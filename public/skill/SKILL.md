---
name: hotaru-module-dev
description: Comprehensive ArchWiki-style engineering specification and agent guide for authoring secure .hmod modules for the Hotaru Telegram userbot with Linux namespace sandboxing, capability enforcement, and complete ModuleContext API reference.
metadata:
  version: "1.0.0"
  target: "Hotaru Userbot (Python 3.13+, GoyGram core, Linux namespaces)"
---

# Hotaru module development specification

This specification serves as the definitive engineering manual for writing third-party and built-in modules (`.hmod`) for the Hotaru Telegram userbot. It details the runtime architecture, sandbox containment model, capability permissions, and provides an exhaustive API reference for every method exposed by `ModuleContext`.

## Table of contents

1. Architecture and runtime model
2. Linux namespace sandbox specification
3. Module structure and manifest schema
4. Capability enforcement model
5. ModuleContext (`ctx`) exhaustive API reference
6. Interactive screens and inline forms
7. Background supervisor tasks
8. Internationalization and lexicon dictionaries
9. Security constraints and prohibited patterns
10. Step-by-step production examples
11. Agent verification checklist

---

## 1. Architecture and runtime model

Hotaru is a security-first Telegram userbot operating from a primary user account. It utilizes GoyGram (`goygram==0.8.28`) for MTProto transport, combining an asynchronous Python event loop with native Rust cryptography for message serialization and key exchange.

The project structure separates untrusted extensions from privileged kernel components:

- `hotaru/`: Userbot core containing the kernel dispatcher, master AES-GCM vault, task supervisor, interactive screen runtime, and multi-account manager.
- `relay/`: Capability firewall and security boundary. Mediates all module operations, filters destructive RPCs, and enforces the denylist.
- `constellations/`: Built-in system modules implemented in the `.hmod` format.
- `sanctuary/`: User data storage holding encrypted credentials, session files, and logs. Modules must never have access to this directory.

A module in Hotaru is an executable Python file with the `.hmod` extension. Rather than importing internal kernel modules directly, an `.hmod` runs within an isolated worker process. It interacts with Telegram and the host system strictly through capability gates and the injected `ctx` (ModuleContext) parameter passed to command handlers.

---

## 2. Linux namespace sandbox specification

To prevent credential theft, host tampering, and lateral network movements, Hotaru isolates every third-party `.hmod` inside dedicated Linux namespaces before executing user code.

### 2.1 Namespace flags

Worker processes are spawned with four isolation flags:

- `CLONE_NEWNS`: Private filesystem mount namespace. The worker operates inside an unshared mount table. Critical directories (`/root`, `/home`, `/etc/shadow`, `/proc/keys`, and `sanctuary/`) are either hidden or mounted read-only. Temporary files reside in an ephemeral `tmpfs` destroyed on process termination.
- `CLONE_NEWIPC`: Isolated System V IPC and POSIX message queues, preventing worker-to-kernel shared memory inspection.
- `CLONE_NEWUTS`: Isolated hostname and NIS domain namespace.
- `CLONE_NEWNET`: Network namespace isolation. Unless a module explicitly declares the `net` capability, its network namespace contains only a down loopback device. Any raw socket creation, DNS resolution, or HTTP request attempted by third-party Python libraries fails at the OS syscall level with `ENETUNREACH` or `EPERM`.

### 2.2 Privilege dropping

The module worker process drops Linux privileges:
- Changes effective user ID to user `nobody` (`uid: 65534`) and group `nogroup` (`gid: 65534`).
- Drops capabilities using `prctl(PR_SET_NO_NEW_PRIVS, 1)`.
- Communication with the Hotaru kernel occurs exclusively over unidirectional UNIX pipes and strict JSON/TLV RPC serialization.

---

## 3. Module structure and manifest schema

An `.hmod` file is written in Python 3.13 syntax. It must export a top-level dictionary named `HOTARU`.

### 3.1 Manifest dictionary schema

```python
HOTARU = {
    "id": "echo",
    "name": "Echo Module",
    "version": "1.0.0",
    "author": "Hotaru Team",
    "about": "A basic echo module demonstrating command dispatch.",
    "commands": {
        "echo": echo_handler,
        "shout": shout_handler,
    },
    "capabilities": ["mt"],
    "tasks": {
        "heartbeat": background_worker,
    },
    "lexicon": {
        "en": {
            "echo_empty": "Please provide text to echo.",
        },
        "ru": {
            "echo_empty": "Пожалуйста, укажите текст для эха.",
        },
    },
    "dependencies": [],
}
```

### 3.2 Manifest fields

- `id` (str, required): Unique lowercase identifier containing alphanumeric characters and underscores (e.g. `ping`, `notes`, `rss_reader`).
- `name` (str, optional): Human-readable title displayed in the `/help` menu and web dashboard.
- `version` (str, required): Semantic version string (e.g. `1.0.0`).
- `author` (str, optional): Creator handle or name.
- `about` (str, optional): One-line summary of module functionality.
- `commands` (dict[str, Callable], required): Mapping of command names to async handler functions. Each handler must accept `ctx: ModuleContext` as its sole argument.
- `capabilities` (list[str], required): List of permission strings required by the module.
- `tasks` (dict[str, Callable], optional): Dictionary of long-running asynchronous worker coroutines managed by the kernel supervisor.
- `lexicon` (dict[str, dict[str, str]], optional): Localization dictionary organized by two-letter language code (`en`, `ru`, `uk`, `ja`, `kz`, `zh`).
- `dependencies` (list[str], optional): Required PyPI package specifications installed into the isolated environment.

---

## 4. Capability enforcement model

Hotaru uses an explicit capability permission model. Any operation outside declared capabilities is rejected by the relay firewall.

### 4.1 Capability definitions

1. `mt`: Telegram MTProto RPC access via GoyGram.
   - Grants access to `ctx.reply()`, `ctx.respond()`, `ctx.edit()`, `ctx.delete()`, `ctx.send_file()`, `ctx.tg`, and MTProto message operations.
   - If omitted: Attempting to call Telegram sending methods raises `PermissionError: capability 'mt' required`.

2. `state`: Persistent module-scoped storage.
   - Grants access to `ctx.state` (get, set, delete, clear).
   - Hotaru stores state in an encrypted SQLite database partitioned by `module_id`. A module cannot query, overwrite, or access keys belonging to another module.
   - If omitted: Accessing `ctx.state` raises `PermissionError: capability 'state' required`.

3. `net`: Outbound network access.
   - Grants access to `ctx.net()` and `ctx.stream()` HTTP client methods and configures network namespace routing.
   - If omitted: Sockets cannot be opened, and calls to `ctx.net()` raise `PermissionError: capability 'net' required`.

### 4.2 Denylisted RPC methods

Even with the `mt` capability enabled, modules are restricted from calling destructive Telegram account methods:
- `account.deleteaccount`
- `account.resetauthorization`
- `account.resetauthorizations`

Invoking these methods immediately triggers an intrusion alert, terminates the module worker, and logs the security violation in `sanctuary/logs/security.log`.

---

## 5. ModuleContext (`ctx`) exhaustive API reference

When a user executes a registered command, the kernel instantiates a `ModuleContext` and passes it to the command handler:

```python
async def my_command(ctx: ModuleContext) -> None:
    ...
```

Below is the complete reference of all attributes and methods available on `ctx`.

### 5.1 Context properties

- `ctx.module_id` -> str
  Returns the module identifier as declared in `HOTARU["id"]`.

- `ctx.args` -> list[str]
  Returns command arguments parsed as a list of whitespace-separated tokens. Quoted strings are preserved as single arguments.

- `ctx.raw_args` -> str
  Returns the raw argument string following the command trigger, with leading and trailing whitespace stripped.

- `ctx.prefix` -> str
  Returns the active bot command prefix (default: `.`).

- `ctx.message` -> ModuleMessage
  Returns the high-level message object that triggered the command.

- `ctx.chat_id` -> int
  Returns the unique integer identifier of the current Telegram chat (private user ID, group ID, or supergroup channel ID).

- `ctx.sender_id` -> int | None
  Returns the user ID of the message author.

- `ctx.user_id` -> int | None
  Alias for `ctx.sender_id`.

- `ctx.topic_id` -> int | None
  Returns the forum topic ID (message thread ID) if the command was triggered inside a forum topic.

- `ctx.is_me` -> bool
  Returns `True` if the command was sent by the userbot account itself.

- `ctx.out` -> bool
  Returns `True` for outgoing messages sent by the current account.

- `ctx.uptime` -> int
  Returns the bot uptime in seconds since process start.

- `ctx.memory` -> Memory
  Returns current memory consumption. Helper properties: `ctx.memory.kb`, `ctx.memory.mb`, `ctx.memory.gb`, `ctx.memory.format()`.

- `ctx.version` -> str
  Returns the short git commit hash of the running Hotaru core.

### 5.2 Responding and message manipulation

- `await ctx.reply(text: str, parse_mode: str = "HTML", link_preview: bool = True, **kwargs) -> Any`
  Sends a new message to the chat in direct reply to the triggering message.
  Supports `parse_mode="HTML"` and `parse_mode="Markdown"`.

- `await ctx.respond(text: str, parse_mode: str = "HTML", link_preview: bool = True, **kwargs) -> Any`
  Intelligently edits the triggering message if sent by the userbot itself (`out=True`). If the message was incoming from another user, sends a reply instead.

- `await ctx.edit(text: str, parse_mode: str = "HTML", link_preview: bool = True, **kwargs) -> Any`
  Edits the triggering message in place. Raises an error if the message was not authored by the current account.

- `await ctx.delete() -> Any`
  Deletes the message that triggered the command.

- `await ctx.pin(both_sides: bool | None = None, notify: bool = False, pm_oneside: bool = False) -> Any`
  Pins the triggering message in the current chat.

- `await ctx.unpin() -> Any`
  Unpins the triggering message.

- `await ctx.react(emoji: str | int | list[str | int]) -> Any`
  Applies an emoji or custom emoji reaction to the triggering message. Pass an empty list or string to remove reactions.

- `await ctx.unreact() -> Any`
  Removes all reactions placed on the message by the current user.

- `await ctx.forward_to(to_chat: int | str, **kwargs) -> Any`
  Forwards the triggering message to a target chat.

- `await ctx.copy_to(to_chat: int | str, **kwargs) -> Any`
  Copies the message content to another chat without author attribution.

### 5.3 Media operations

- `await ctx.send_file(file: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Uploads and sends a document file to the current chat.

- `await ctx.reply_file(file: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends a file in reply to the triggering message.

- `await ctx.send_photo(photo: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends an image formatted as a Telegram photo.

- `await ctx.reply_photo(photo: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Replies with an image photo.

- `await ctx.send_video(video: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends a video file.

- `await ctx.reply_video(video: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Replies with a video.

- `await ctx.send_audio(audio: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends an audio file.

- `await ctx.send_voice(voice: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends a voice message.

- `await ctx.send_animation(animation: str | bytes | Path, caption: str | None = None, **kwargs) -> Any`
  Sends an animated GIF or silent looping MP4.

- `await ctx.send_sticker(sticker: str | bytes | Path, **kwargs) -> Any`
  Sends a sticker file (`.webp` or `.tgs`).

- `await ctx.download_media(destination: str | Path | None = None) -> bytes | Path`
  Downloads media attached to the message (or replied-to message) to disk or memory.

### 5.4 Polls and interactive tasks

- `await ctx.send_poll(question: str, options: list[str], multiple_choice: bool = False, quiz: bool = False, correct_id: int | None = None) -> Any`
  Sends a native Telegram poll.

- `await ctx.close_poll() -> Any`
  Closes an active poll on the current message.

- `await ctx.vote(options: int | list[int]) -> Any`
  Casts a vote on a poll.

- `await ctx.retract_vote() -> Any`
  Retracts the vote previously cast by the account.

- `await ctx.send_todo(title: str, items: list[str]) -> Any`
  Sends an interactive checklist formatted message.

- `await ctx.append_todo(item: str) -> Any`
  Appends an item to an existing checklist message.

### 5.5 State management (`ctx.state`)

Requires capability `state`. All keys are scoped to `ctx.module_id`.

- `ctx.state.get(key: str, default: Any = None) -> Any`
  Retrieves a stored value. Deserializes JSON objects and primitives.

- `ctx.state.set(key: str, value: Any) -> None`
  Persists a JSON-serializable value for the given key.

- `ctx.state.delete(key: str) -> bool`
  Removes a key from storage. Returns `True` if the key existed.

- `ctx.state.clear() -> None`
  Deletes all keys owned by the current module.

- `ctx.state.all() -> dict[str, Any]`
  Returns a dictionary containing all key-value pairs stored by this module.

### 5.6 Internationalization (`ctx.t`)

- `ctx.t(key: str, default: str | None = None, **params: Any) -> str`
  Looks up a localized string according to user language preferences.
  Searches the module's own `HOTARU["lexicon"]` first, then falls back to global dictionaries (`lexicon/{lang}.json`).
  Supports format parameters: `ctx.t("welcome", name="Alice")`.

### 5.7 Network operations (`ctx.net`)

Requires capability `net`.

- `await ctx.net(url: str, method: str = "GET", headers: dict[str, str] | None = None, params: dict[str, Any] | None = None, json: Any = None, data: Any = None, timeout: float = 10.0, binary: bool = False) -> dict[str, Any]`
  Performs an HTTP request through the relay proxy.
  Returns a dictionary containing:
  - `status`: HTTP status code (int).
  - `headers`: Response headers dictionary.
  - `data`: Response body decoded as JSON or text.
  - `bytes`: Raw response bytes if `binary=True`.

- `await ctx.stream(url: str, headers: dict[str, str] | None = None, timeout: float | None = None) -> NetStream`
  Opens a streaming socket connection over HTTP or WebSocket.

### 5.8 UI and screen helpers

- `ctx.screens` -> ScreenKit
  Helper for building interactive inline UI menus with navigation, forms, and buttons.

- `await ctx.paginate(content: str | list[str], page: int = 0, limit: int = 4000, rich: bool = True) -> Any`
  Paginates long text or lists into multiple pages with inline Next/Previous buttons.

- `ctx.wordmark() -> str`
  Returns the styled Hotaru brand badge for output headers.

- `ctx.classify_error(exc: Exception) -> dict[str, Any]`
  Classifies an exception into a human-readable diagnosis and recommended action.

---

## 6. Interactive screens and inline forms

Hotaru includes an interactive screen engine (`hotaru/screens.py`) that allows modules to construct full multi-step interfaces using Telegram inline buttons.

### 6.1 Creating a screen

A screen consists of a text body, a 2D matrix of action buttons, and optional banner media:

```python
from hotaru.screens import Screen

async def menu_command(ctx: ModuleContext) -> None:
    rows = [
        [
            {"text": "Status", "callback": show_status},
            {"text": "Settings", "callback": show_settings},
        ],
        [
            {"text": "Close", "action": "close"},
        ],
    ]
    screen = Screen(
        text="<b>Control Panel</b>\nChoose an action below:",
        rows=rows,
        rich=True,
    )
    await ctx.screens.show(screen)
```

### 6.2 Button attributes

- `text` (str): Label displayed on the button.
- `callback` (Callable): Coroutine invoked when the user taps the button.
- `action` (str): Built-in action name: `"close"`, `"back"`, `"refresh"`.
- `url` (str): Direct URL opened in the client browser.
- `query` (str): Switch inline query to a designated string.

---

## 7. Background supervisor tasks

Modules can run background tasks that persist throughout the userbot runtime. Declare tasks in the `tasks` mapping of the `HOTARU` dictionary.

### 7.1 Task signature

A task function receives a `TaskContext` and runs as an independent asyncio coroutine:

```python
async def cleaner_task(ctx: TaskContext) -> None:
    while not ctx.is_stopping:
        try:
            await perform_cleanup(ctx)
        except Exception as exc:
            ctx.log.error(f"Task error: {exc}")
        await ctx.sleep(300)
```

### 7.2 Task guarantees

- Automatic restart: The kernel supervisor monitors tasks and restarts them if they fail unexpectedly.
- Graceful shutdown: When Hotaru stops, `ctx.is_stopping` becomes `True`, allowing tasks to finish in-flight operations and release resources cleanly.

---

## 8. Internationalization and lexicon dictionaries

Every user-facing string must be localized. Never hardcode English or Russian strings directly in command bodies.

### 8.1 Declaring lexicons

```python
HOTARU = {
    "id": "my_mod",
    "commands": {"run": run_cmd},
    "capabilities": ["mt"],
    "lexicon": {
        "en": {
            "success": "Operation completed in {time}s.",
            "error": "Failed to process item: {reason}",
        },
        "ru": {
            "success": "Операция завершена за {time} с.",
            "error": "Не удалось обработать элемент: {reason}",
        },
    },
}
```

### 8.2 Rendering strings

```python
async def run_cmd(ctx: ModuleContext) -> None:
    elapsed = 1.25
    text = ctx.t("success", time=elapsed)
    await ctx.respond(text)
```

---

## 9. Security constraints and prohibited patterns

The Hotaru repository enforces automated static analysis (Semgrep) and strict type checking (`basedpyright`). Any pull request violating these constraints is rejected automatically.

### 9.1 Zero comment policy in code

Hotaru maintains a strict policy: zero `#` comments in Python (`.py`) and module (`.hmod`) files. Self-documenting code with clear variable and function names is required. Verify your git diff before committing:

```bash
git diff '*.py' '*.hmod' | grep -E "^\+\s*#"
```

This command must return zero lines.

### 9.2 Prohibited practices

1. Never import internal kernel modules directly (`import hotaru.kernel` or `import hotaru.state`). All operations must use `ctx`.
2. Never store secrets, API tokens, or session strings in module files or global variables.
3. Never attempt to read or modify files outside the module's sandbox directory.
4. Never call denylisted RPC methods (`account.deleteaccount`, `account.resetauthorization`).
5. Never bypass the `lexicon` translation system by hardcoding English or Russian strings in code.

---

## 10. Step-by-Step production examples

### 10.1 Example 1: Minimal security ping module

```python
from __future__ import annotations
import time
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def ping_cmd(ctx: ModuleContext) -> None:
    t0 = time.perf_counter()
    res = await ctx.respond(ctx.t("pinging"))
    latency = (time.perf_counter() - t0) * 1000
    await ctx.edit(ctx.t("pong", ms=round(latency, 2), ram=ctx.ram.format()))

HOTARU = {
    "id": "ping",
    "name": "Ping Monitor",
    "version": "1.0.0",
    "about": "Measures MTProto roundtrip latency and RAM footprint.",
    "commands": {
        "ping": ping_cmd,
    },
    "capabilities": ["mt"],
    "lexicon": {
        "en": {
            "pinging": "Pinging Telegram gateway...",
            "pong": "<b>Pong</b> in <code>{ms} ms</code>\nRAM: <code>{ram}</code>",
        },
        "ru": {
            "pinging": "Замер задержки MTProto...",
            "pong": "<b>Понг</b> за <code>{ms} мс</code>\nОЗУ: <code>{ram}</code>",
        },
    },
}
```

### 10.2 Example 2: Interactive notes manager with state

```python
from __future__ import annotations
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def notes_cmd(ctx: ModuleContext) -> None:
    args = ctx.args
    if not args:
        notes = ctx.state.get("items", {})
        if not notes:
            await ctx.respond(ctx.t("no_notes"))
            return
        lines = [ctx.t("header")]
        for key in sorted(notes.keys()):
            lines.append(f"• <b>{key}</b>: {notes[key]}")
        await ctx.respond("\n".join(lines))
        return

    sub = args[0].lower()
    if sub == "add" and len(args) >= 3:
        name = args[1]
        content = " ".join(args[2:])
        notes = dict(ctx.state.get("items", {}))
        notes[name] = content
        ctx.state.set("items", notes)
        await ctx.respond(ctx.t("saved", name=name))
    elif sub == "del" and len(args) >= 2:
        name = args[1]
        notes = dict(ctx.state.get("items", {}))
        if name in notes:
            del notes[name]
            ctx.state.set("items", notes)
            await ctx.respond(ctx.t("deleted", name=name))
        else:
            await ctx.respond(ctx.t("not_found", name=name))
    else:
        await ctx.respond(ctx.t("usage"))

HOTARU = {
    "id": "notes",
    "name": "Encrypted Notes",
    "version": "1.0.0",
    "about": "Persistent note storage using module-scoped state.",
    "commands": {
        "notes": notes_cmd,
    },
    "capabilities": ["mt", "state"],
    "lexicon": {
        "en": {
            "no_notes": "No notes stored yet. Use <code>.notes add [name] [text]</code>",
            "header": "<b>Saved Notes:</b>",
            "saved": "Note <b>{name}</b> saved successfully.",
            "deleted": "Note <b>{name}</b> deleted.",
            "not_found": "Note <b>{name}</b> was not found.",
            "usage": "Usage: <code>.notes [add|del] [name] [text]</code>",
        },
        "ru": {
            "no_notes": "Заметок нет. Используйте <code>.notes add [имя] [текст]</code>",
            "header": "<b>Сохраненные заметки:</b>",
            "saved": "Заметка <b>{name}</b> сохранена.",
            "deleted": "Заметка <b>{name}</b> удалена.",
            "not_found": "Заметка <b>{name}</b> не найдена.",
            "usage": "Использование: <code>.notes [add|del] [имя] [текст]</code>",
        },
    },
}
```

---

## 11. Agent verification checklist

Before generating or submitting any `.hmod` file, verify:

1. Manifest validity: `HOTARU` dictionary contains `id`, `version`, `commands`, and `capabilities`.
2. Minimal capabilities: Only request `mt`, `state`, or `net` if actually invoked in the code.
3. Zero comments: No `#` comments anywhere in the file.
4. No hardcoded text: All user-facing output routes through `ctx.t(...)` and `lexicon`.
5. Error handling: Network requests and RPC calls catch appropriate exceptions (`FloodWaitError`, `RPCError`, `TimeoutError`).
6. Sandbox compliance: No direct imports of filesystem secrets, process tokens, or private kernel modules.
