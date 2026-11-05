---
name: hotaru-module-developer
description: Exhaustive engineering specification and agent reference for authoring secure .hmod modules for the Hotaru Telegram userbot with Linux namespace sandboxing, capability enforcement, lifecycle hooks, template fields, watchers, tasks, and complete ModuleContext API reference.
---

# Hotaru Module Developer Reference & Agent Skill

Hotaru is a security-first Telegram userbot operating from a primary user account. Unlike legacy userbot platforms that load third-party scripts directly into the interpreter alongside Telegram authentication sessions, Hotaru enforces process isolation and hardware-assisted capability sandboxing.

Modules (.hmod files) execute under strict Linux namespace boundaries:
- CLONE_NEWNS (Mount Namespace): Private filesystem table. /root, /home, /etc, sanctuary/ are concealed or read-only. Temporary files reside in ephemeral tmpfs.
- CLONE_NEWIPC (IPC Namespace): Isolated message queues and shared memory.
- CLONE_NEWUTS (Hostname Namespace): Isolated hostname identifiers.
- CLONE_NEWNET (Network Namespace): Network stack isolation. Modules without the 'net' capability have only a down loopback device.
- Privilege Dropping: Effective UID/GID set to nobody/nogroup (65534). prctl(PR_SET_NO_NEW_PRIVS, 1) enforced.
- First-Statement Rule: The assignment to HOTARU must be the very first statement in the .hmod file.
- Zero Comments Rule: Hotaru production code and .hmod modules must contain zero comments.

## 1. Core Architecture & Linux Namespace Isolation

Hotaru is a security-first Telegram userbot operating from a primary user account. Unlike legacy userbot platforms that load third-party scripts directly into the interpreter alongside Telegram authentication sessions, Hotaru enforces process isolation and hardware-assisted capability sandboxing.

### Subsystem Topology

The Hotaru repository is divided into four distinct security tiers:

1. hotaru/ (Kernel Core):
The privileged supervisor managing account sessions, the encrypted master vault (AES-GCM), event dispatching, command registries, and interactive screen rendering. It never executes unverified third-party code in its process space.

2. relay/ (Capability Firewall):
The security boundary mediating all communication between external modules and the Telegram MTProto transport. The relay contains capability definitions (relay/caps.py), network egress proxies (relay/proxies.py), filesystem isolation gates (relay/files.py), and the RPC denylist (relay/denylist.py).

3. constellations/ (Built-in Modules):
System extensions implemented in the .hmod format (accounts, acl, backups, catalyst, executor, genesis, help, info, logger, power, settings, shield, singularity, translations, updater). Built-in modules are core components and their triggers are reserved.

4. sanctuary/ (Private Runtime State):
Encrypted user data directory containing session credentials (sanctuary/hotaru.vault), SQLite state databases, and audit logs. This directory is strictly inaccessible to third-party modules.

### Linux Namespace Isolation Model

When Hotaru loads a third-party .hmod module, it launches an isolated worker process configured with four Linux kernel namespaces:

• CLONE_NEWNS (Mount Namespace):
The worker process receives a private mount table. Critical directories (/root, /home, /etc, /proc/keys, and sanctuary/) are either concealed or mounted read-only. Temporary files reside in an ephemeral tmpfs mount discarded on process exit.

• CLONE_NEWIPC (IPC Namespace):
Isolates System V IPC and POSIX message queues, preventing shared-memory snooping or signal hijacking between modules.

• CLONE_NEWUTS (Hostname Namespace):
Isolates UTS system identifiers and hostname information.

• CLONE_NEWNET (Network Namespace):
Isolates the network stack. Unless a module explicitly declares the 'net' capability in its manifest, its network namespace contains only a down loopback device. Raw socket calls, DNS queries, and HTTP requests fail at the OS syscall boundary with ENETUNREACH or EPERM.

### Privilege Dropping & Syscall Control

Before executing module code, the worker drops root privileges:
• Switches effective UID to nobody (65534) and GID to nogroup (65534).
• Enforces prctl(PR_SET_NO_NEW_PRIVS, 1) to prevent privilege escalation via setuid binaries.
• Channels all I/O through unidirectional UNIX pipes and typed JSON/TLV RPC serialization.

## 2. Manifest Specification & First-Statement Rule

A Hotaru module is an executable Python source file ending with the .hmod extension. Before loading, the Hotaru module supervisor parses the AST to verify compliance with sandbox invariants.

### The First-Statement Rule

Hotaru requires that the assignment to HOTARU be the very first statement in the file. If an import, variable declaration, or function definition precedes HOTARU, the loader rejects the module with ModuleValidationError('HOTARU must be the first statement').

This rule allows the runtime to inspect the manifest metadata, verify requested capabilities, and validate dependencies before executing any code or importing untrusted libraries.

### Manifest Schema Reference

```python
HOTARU = {
    "id": "qr_tool",
    "version": "1.0.0",
    "commands": {
        "qr": "qr_command",
    },
    "capabilities": ["mt", "net"],
    "watchers": ["message_watcher"],
    "tasks": {
        "sync_loop": "sync_worker",
    },
    "aliases": {
        "qrcode": "qr",
    },
    "config_schema": {
        "api_key": {
            "type": "string",
            "default": "",
            "description": "Optional API key for upstream service",
        },
    },
    "lexicon": {
        "en": {
            "description": "High resolution QR generator.",
            "commands": {
                "qr": {"description": "Generate a QR code from text"},
            },
        },
    },
    "requires": ["common_lib"],
    "after": ["accounts", "shield"],
    "inline_commands": ["qr_inline"],
    "rise": "on_startup",
    "fade": "on_shutdown",
    "template_fields": {
        "qr_count": {
            "scope": "global",
            "provider": "qr_count",
        },
    },
    "banner": "https://example.com/banner.png",
    "bot_commands": ["qr"],
}
```

### Manifest Fields Description

• id (str, required): Unique identifier containing lowercase alphanumeric characters and underscores.
• version (str, required): Semantic version string (e.g. '1.0.0').
• commands (dict[str, Callable | str], required): Trigger-to-handler mappings.
• capabilities (list[str], required): List of hardware and subsystem permissions requested by the module.
• watchers (list[str | Callable], optional): Message and event interceptors.
• tasks (dict[str, Callable | str], optional): Background coroutines managed by the supervisor.
• aliases (dict[str, str], optional): Alternative command triggers mapped to existing commands.
• config_schema (dict[str, dict[str, Any]], optional): Configurable settings schema for user customization.
• lexicon (dict[str, dict[str, Any]], optional): Localization dictionary supporting 'en', 'ru', 'uk', 'ja', 'kz', 'zh'.
• requires (list[str], optional): Module dependencies that must be installed and active.
• after (list[str], optional): Soft load ordering constraints.
• inline_commands (list[str], optional): Inline bot query triggers.
• rise (str | Callable, optional): Async lifecycle coroutine executed during module initialization.
• fade (str | Callable, optional): Async lifecycle coroutine executed during module shutdown.
• template_fields (dict[str, dict[str, Any]], optional): Published template providers.
• banner (str, optional): URL pointing to a preview image for module catalogues.
• bot_commands (list[str], optional): Command triggers registered with BotFather for the companion bot.

## 3. Module Lifecycle Hooks: rise and fade

Hotaru modules can declare lifecycle hooks to manage resources across startup and shutdown events.

### The rise Hook (Startup Initialization)

The 'rise' field specifies an asynchronous function invoked immediately after the module is loaded and its capabilities are granted:

```python
HOTARU = {
    "id": "custom_sync",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {
        "sync": "sync_command",
    },
    "rise": "on_startup",
    "fade": "on_shutdown",
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def on_startup(ctx: ModuleContext) -> None:
    initialized = await ctx.state.get("initialized", False)
    if not initialized:
        await ctx.state.set("initialized", True)
        await ctx.state.set("sync_counter", 0)

async def on_shutdown(ctx: ModuleContext) -> None:
    await ctx.state.set("last_shutdown", int(ctx.uptime))

async def sync_command(ctx: ModuleContext) -> None:
    await ctx.respond("Synced.")
```

### The fade Hook (Teardown Cleanup)

The 'fade' field specifies a coroutine invoked when the module is unloaded, reloaded, or when Hotaru initiates process termination. Use fade to flush file buffers, close open network sessions, or emit audit logs.

### Hibernation Protection

By default, Hotaru suspends idle module worker processes to preserve RAM when no commands are processed. Declaring either 'rise', 'fade', 'tasks', or 'watchers' marks the worker as protected, keeping it active to service stateful operations.

## 4. Event Watchers & Message Interceptors

Watchers allow modules to monitor incoming and outgoing messages across chats without requiring an explicit command trigger.

### Declaring Watchers

Declare watcher handlers in the 'watchers' list of the HOTARU manifest:

```python
HOTARU = {
    "id": "keyword_monitor",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "watchers": ["message_scanner"],
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def message_scanner(ctx: ModuleContext) -> None:
    if ctx.out:
        return
    text = ctx.message.text or ""
    if "SECURITY ALERT" in text:
        await ctx.save()
```

### Watcher Invariants

• Non-blocking execution: Watchers run concurrently with command handlers. A slow watcher must not block the main event pipeline.
• Error isolation: Unhandled exceptions inside a watcher are caught by the supervisor and recorded in the audit log without crashing the core userbot.
• State access: Watchers receive a valid ModuleContext and can read or write to ctx.state.

## 5. Background Tasks, Loops & Supervisor Watchdog

Background tasks run continuously inside the module worker process to perform periodic syncs, cleanup sweeps, or metric collection.

### Declaring Background Tasks

Declare tasks in the 'tasks' dictionary of HOTARU:

```python
HOTARU = {
    "id": "heartbeat_reporter",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "tasks": {
        "heartbeat": "run_heartbeat",
    },
}

import asyncio
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def run_heartbeat(ctx: ModuleContext) -> None:
    while not ctx.is_stopping:
        try:
            current = await ctx.state.get("beats", 0)
            await ctx.state.set("beats", current + 1)
        except Exception:
            pass
        for _ in range(60):
            if ctx.is_stopping:
                break
            await asyncio.sleep(1)
```

### Supervisor Crash Recovery

If a task coroutine raises an unhandled exception, the Hotaru supervisor catches the fault and schedules a restart with exponential backoff:
1. Attempt 1: 2-second delay
2. Attempt 2: 4-second delay
3. Attempt 3: 8-second delay
4. Attempt 4: 16-second delay
5. Attempt 5: 32-second delay
If crashes persist beyond 5 attempts, the task is marked as degraded and quarantined.

### Graceful Shutdown Lifecycle

When Hotaru receives SIGINT or SIGTERM:
1. The supervisor sets ctx.is_stopping to True across all contexts.
2. Background tasks must detect this flag and terminate their loops.
3. The supervisor grants a 5-second grace window. If a task fails to exit within 5 seconds, the worker process is sent SIGKILL.

## 6. Dynamic Template System & Scopes

Hotaru features a template rendering engine that dynamically resolves variables inside messages, user interfaces, and notifications.

### Declaring Template Fields

Modules publish template placeholders using 'template_fields' in HOTARU:

```python
HOTARU = {
    "id": "crypto_data",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "template_fields": {
        "btc_price": {
            "scope": "global",
            "provider": "btc_provider",
        },
        "session_stat": {
            "scope": "shared",
            "modules": ["dashboard", "analytics"],
            "provider": "stat_provider",
        },
    },
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def template_btc_provider(ctx: ModuleContext) -> str:
    return "$92,400"

async def template_stat_provider(ctx: ModuleContext) -> int:
    return 142
```

### Template Scopes

1. private: Placeholder can only be evaluated within the declaring module.
2. shared: Placeholder is accessible by explicitly listed module IDs in the 'modules' array.
3. global: Placeholder can be rendered in any module, status screen, or system notification using {field_name}.

### Provider Conventions

Each provider must be an async function named `template_<provider_name>(ctx: ModuleContext)` that returns a string, integer, or float.

## 7. Dynamic Module Configuration Schema

The 'config_schema' dictionary in HOTARU defines configurable module settings that users can adjust via the Singularity web panel or the .config command.

### Schema Specification

```python
HOTARU = {
    "id": "rss_notifier",
    "version": "1.0.0",
    "capabilities": ["mt", "net", "state"],
    "commands": {
        "rss": "rss_command",
    },
    "config_schema": {
        "feed_url": {
            "type": "string",
            "default": "https://news.ycombinator.com/rss",
            "description": "Upstream RSS feed URL",
        },
        "poll_interval": {
            "type": "integer",
            "default": 300,
            "min": 60,
            "max": 86400,
            "description": "Polling frequency in seconds",
        },
        "notify_silent": {
            "type": "boolean",
            "default": False,
            "description": "Send alerts without sound",
        },
    },
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def rss_command(ctx: ModuleContext) -> None:
    url = getattr(ctx.config, "feed_url", "https://news.ycombinator.com/rss")
    await ctx.respond(f"Active feed: {url}")
```

### Supported Schema Types

• string: Text input with optional min_length and max_length.
• integer / float: Numeric value with optional min and max bounds.
• boolean: Toggle flag (True / False).
• choice: Dropdown selection constrained to an array of valid strings.

## 8. Aliases, Ordering & Module Dependencies

Modules can declare relationships with other modules to ensure proper initialization order and prevent execution conflicts.

### Command Aliases (aliases)

Maps secondary trigger names to an existing command handler without duplicating code:

```python
HOTARU = {
    "id": "url_shortener",
    "version": "1.0.0",
    "capabilities": ["mt", "net"],
    "commands": {
        "shorten": "shorten_cmd",
    },
    "aliases": {
        "short": "shorten",
        "tiny": "shorten",
    },
}
```

### Hard Dependencies (requires)

The 'requires' list specifies module IDs that must be present and active. If any required module is missing or failed validation, Hotaru refuses to load the module:

```python
HOTARU = {
    "id": "advanced_notes",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "requires": ["crypto_engine"],
    "commands": {
        "anote": "anote_cmd",
    },
}
```

### Load Ordering (after)

The 'after' list defines soft ordering. The module is guaranteed to initialize after the specified modules have finished loading, without raising an error if they are absent:

```python
HOTARU = {
    "id": "analytics_tracker",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "after": ["accounts", "shield"],
    "commands": {
        "metrics": "metrics_cmd",
    },
}
```

## 9. Inline Bot Commands & Queries

Hotaru integrates with Telegram inline bot queries, enabling users to invoke modules via @bot_username in any chat.

### Declaring Inline Handlers

```python
HOTARU = {
    "id": "inline_search",
    "version": "1.0.0",
    "capabilities": ["mt", "net"],
    "commands": {},
    "inline_commands": ["search"],
    "bot_commands": ["search"],
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def search_inline(ctx: ModuleContext) -> None:
    query = ctx.raw_args.strip()
    articles = [
        {
            "id": "1",
            "title": f"Search for {query}",
            "description": "Click to send result",
            "message_text": f"Results for: <b>{query}</b>",
        }
    ]
    await ctx.inline.answer(articles)
```

### bot_commands List

Triggers listed under 'bot_commands' are synchronized with BotFather to populate the official command menu in the userbot companion bot.

## 10. Capability Privilege Gate & RPC Denylist

Hotaru operates under a default-deny capability architecture. An unprivileged module cannot access hardware resources, network interfaces, or raw MTProto RPC calls.

### Capability Matrix

1. mt: Access to Telegram MTProto transport. Enables ctx.mt(method, **kwargs) and messaging helpers.
2. net: Egress network interface. Enables HTTP/HTTPS requests via ctx.net and TCP socket streams via ctx.stream.
3. state: Persistent isolated SQLite key-value store scoped strictly to the module ID.
4. files: Filesystem write access inside the module ephemeral tmpfs scratch directory.
5. accounts: Read-only access to userbot profile metadata via ctx.accounts.
6. screens: Declarative UI rendering engine via ctx.screens.

### The RPC Denylist (relay/denylist.py)

Even when a module holds the 'mt' capability, all raw MTProto calls are inspected by relay/firewall.py against a denylist of destructive Telegram methods:

• auth.logOut
• auth.resetAuthorizations
• auth.dropTempAuthKeys
• account.deleteAccount
• account.updatePasswordSettings

Any attempt to call a denylisted method terminates the worker process with SIGKILL and logs a security violation.

## 11. ModuleContext: Properties Reference Catalog

The ModuleContext instance passed to command handlers, tasks, and watchers exposes the following properties:

• ctx.module_id -> str
Returns the unique lowercase identifier of the executing module.

• ctx.chat_id -> int
Telegram ID of the dialog, group, or channel where the command was triggered.

• ctx.user_id / ctx.sender_id -> int | None
Telegram user ID of the author of the triggering message. Returns None if sent from an anonymous channel.

• ctx.topic_id -> int | None
Thread ID when executed inside a forum supergroup topic. Returns None in non-forum chats.

• ctx.is_me / ctx.out -> bool
Boolean indicating whether the triggering message was sent by the userbot account itself.

• ctx.message -> ModuleMessage
The triggering message instance, exposing text, entities, reply references, and timestamp.

• ctx.has_media -> bool
True if the triggering message contains an attached photo, video, document, audio, sticker, voice note, or animation.

• ctx.media / ctx.attachment -> Attachment | None
Attachment metadata object exposing file_id, size, mime_type, and filename.

• ctx.reply_message -> ModuleMessage | None
If the command was executed in reply to another message, returns that referenced message. Otherwise returns None.

• ctx.reply_attachment -> Attachment | None
The attachment object of the message replied to, if present.

• ctx.args -> list[str]
List of command arguments split by whitespace, excluding prefix and command trigger.

• ctx.raw_args -> str
The complete unparsed string following the command trigger. Preserves whitespace.

• ctx.prefix -> str
The command prefix used to trigger the handler (e.g. '.' or '!').

• ctx.uptime -> float
The uptime of the Hotaru kernel supervisor process in seconds.

• ctx.memory / ctx.ram -> int
Resident set size (RSS) memory consumption of the worker process in bytes.

• ctx.version -> str
Hotaru kernel release version string.

• ctx.is_stopping -> bool
Shutdown flag indicating whether the userbot has initiated process termination.

## 12. ModuleContext: Messaging, Dispatch & Editing

ModuleContext provides methods for creating, editing, forwarding, and deleting Telegram messages.

### ctx.reply
`await ctx.reply(text: str, *, parse_mode: str = "html", link_preview: bool = False, silent: bool = False, schedule_date: int | None = None) -> ModuleMessage`
Sends a message in direct reply to the triggering message.

### ctx.respond
`await ctx.respond(text: str, *, parse_mode: str = "html", link_preview: bool = False) -> ModuleMessage`
If the triggering message was authored by the userbot (ctx.is_me is True), edits that message in place. If authored by another user, transmits a new reply.

### ctx.edit
`await ctx.edit(text: str, *, parse_mode: str = "html", link_preview: bool = False) -> ModuleMessage`
Edits the triggering message in place. Raises PermissionError if ctx.is_me is False.

### ctx.delete
`await ctx.delete(*, revoke: bool = True) -> bool`
Deletes the triggering message. If revoke is True, deletes for all participants.

### ctx.pin & ctx.unpin
`await ctx.pin(*, silent: bool = False, unpin_both: bool = False) -> bool`
`await ctx.unpin() -> bool`
Pins or unpins the triggering message in the chat.

### ctx.react & ctx.unreact
`await ctx.react(emoji: str, *, big: bool = False) -> bool`
`await ctx.unreact() -> bool`
Applies or removes an emoji reaction on the triggering message.

### ctx.forward & ctx.forward_to
`await ctx.forward_to(target_chat_id: int, *, silent: bool = False) -> ModuleMessage`
Forwards the triggering message to the target chat with forward attribution.

### ctx.copy_to
`await ctx.copy_to(target_chat_id: int, *, caption: str | None = None) -> ModuleMessage`
Copies the message content to the target chat without forward attribution.

### ctx.save
`await ctx.save() -> ModuleMessage`
Copies the message directly into Saved Messages.

### ctx.schedule
`await ctx.schedule(schedule_date: int, text: str | None = None) -> ModuleMessage`
Schedules a message to be delivered at a future Unix timestamp.

### ctx.typing
`await ctx.typing(action: str = "typing") -> None`
Broadcasts a chat activity status ('typing', 'upload_photo', 'upload_document', 'record_video').

### ctx.read & ctx.mark_read
`await ctx.read() -> bool`
Marks incoming messages in the dialog up to the current message as read.

### ctx.read_contents
`await ctx.read_contents() -> bool`
Marks media contents (voice notes, video notes) as listened/watched.

## 13. ModuleContext: Message Inspection & Peer Resolution

Methods for resolving Telegram peers, extracting sender entities, and querying chat metadata:

• await ctx.get_sender() -> dict[str, Any]
Retrieves the full User entity of the message sender.

• await ctx.get_chat() -> dict[str, Any]
Fetches full chat or channel metadata for the current conversation.

• await ctx.get_input_chat() -> dict[str, Any]
Constructs an InputPeer representation of the current chat for raw MTProto RPC calls.

• await ctx.get_input_sender() -> dict[str, Any]
Constructs an InputPeer representation of the message sender.

• await ctx.get_input_channel() -> dict[str, Any]
Constructs an InputChannel representation when operating in a broadcast channel or supergroup.

• await ctx.get_reply_message() -> ModuleMessage | None
Fetches the full message object referenced by the current reply.

• await ctx.get_reactions() -> list[dict[str, Any]]
Lists all active emoji reactions and reactor counts on the message.

• await ctx.get_reactors(limit: int = 50) -> list[dict[str, Any]]
Queries individual user entities that reacted to the message.

• await ctx.get_views() -> int
Returns the view count of the message in channels.

• await ctx.get_replies() -> int
Returns the reply count in discussion threads.

• await ctx.get_discussion() -> dict[str, Any]
Retrieves the linked discussion supergroup for a channel post.

• await ctx.get_link() -> str
Constructs a direct t.me link to the current message.

• await ctx.check_restrictions() -> dict[str, Any]
Queries active Telegram spam or permission restrictions on the userbot account.

## 14. ModuleContext: Media Transmission & File Operations

Hotaru handles media transmission through streaming helpers supporting raw bytes, file paths, and BinaryIO objects.

### Media Sending Methods

• await ctx.reply_file(file: bytes | str | BinaryIO, *, caption: str | None = None, force_document: bool = False, filename: str | None = None) -> ModuleMessage
Sends a file attachment into the chat.

• await ctx.reply_photo(photo: bytes | str | BinaryIO, *, caption: str | None = None, parse_mode: str = "html") -> ModuleMessage
Sends a compressed Telegram photo (JPEG, PNG, WEBP).

• await ctx.reply_video(video: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None, width: int | None = None, height: int | None = None) -> ModuleMessage
Sends an MP4 or MOV video.

• await ctx.reply_audio(audio: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None, performer: str | None = None, title: str | None = None) -> ModuleMessage
Sends a music track with metadata tags.

• await ctx.reply_voice(voice: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None) -> ModuleMessage
Sends an Opus audio stream as a voice message.

• await ctx.reply_animation(animation: bytes | str | BinaryIO, *, caption: str | None = None) -> ModuleMessage
Sends a looping silent MP4 or GIF.

• await ctx.reply_dice(emoji: str = "🎲") -> ModuleMessage
Rolls an animated dice ('🎲', '🎯', '🏀', '⚽', '🎳', '🎰').

### Media Editing & Downloading

• await ctx.edit_media(media: bytes | str | BinaryIO, *, caption: str | None = None) -> ModuleMessage
Replaces the media attachment of an existing message.

• await ctx.edit_caption(caption: str, *, parse_mode: str = "html") -> ModuleMessage
Updates the caption of an existing media message without re-uploading the file.

• await ctx.download(attachment: Attachment | None = None, destination: str | None = None) -> bytes | str
Downloads media from the message. If destination is None, buffers into memory and returns bytes.

## 15. ModuleContext: Buttons, Polls & Checklists

Methods for interacting with inline keyboards, interactive polls, and native checklists:

### Inline Buttons

• ctx.buttons -> list[list[MessageButton]]
Matrix of inline buttons on the triggering message.

• ctx.button_count -> int
Total count of inline buttons on the message.

• await ctx.click(row: int, col: int) -> Any
Simulates clicking the button at matrix coordinate (row, col).

• await ctx.click_button(text: str | None = None, data: bytes | None = None) -> Any
Clicks an inline button matching label text or callback data.

• await ctx.edit_buttons(buttons: list[list[dict[str, str]]]) -> None
Replaces the inline keyboard of the current message.

• await ctx.remove_buttons() -> None
Removes all inline buttons from the message.

### Telegram Polls

• await ctx.send_poll(question: str, answers: list[str], *, multiple_choice: bool = False, quiz: bool = False, correct_id: int | None = None) -> ModuleMessage
Sends an interactive poll into the chat.

• await ctx.close_poll() -> Any
Closes voting on the poll.

• await ctx.vote(answers: list[int]) -> Any
Casts a vote for option indices.

• await ctx.retract_vote() -> Any
Retracts cast votes from the poll.

• await ctx.get_poll_results() -> dict[str, Any]
Fetches aggregated poll voting totals.

### Telegram Checklists

• await ctx.send_todo(title: str, items: list[str], *, others_can_append: bool = False, others_can_complete: bool = False) -> ModuleMessage
Sends a native Telegram checklist.

• await ctx.append_todo(items: list[str]) -> Any
Appends new items to an existing checklist.

• await ctx.set_checklist_completed(completed: list[int], incompleted: list[int]) -> Any
Toggles task completion indices.

## 16. ModuleContext: State Storage & Network Stream

Hotaru isolates persistence and network I/O behind dedicated capability proxies.

### Persistent Key-Value State (ctx.state)

Requires capability: 'state'
Key-value storage backed by SQLite and scoped strictly to the module ID.

• await ctx.state.get(key: str, default: Any = None) -> Any
Retrieves value for key. Returns default if absent.

• await ctx.state.set(key: str, value: Any) -> None
Persists a JSON-serializable value (dict, list, int, float, str, bool).

• await ctx.state.delete(key: str) -> bool
Deletes key from storage.

• await ctx.state.clear() -> None
Purges all stored keys for this module.

• await ctx.state.all() -> dict[str, Any]
Returns all key-value pairs stored by this module.

### Network Client & TCP Streaming (ctx.net & ctx.stream)

Requires capability: 'net'
All egress traffic passes through a proxy enforcing TLS validation and rate limiting.

1. HTTP Requests (ctx.net):
`await ctx.net(url: str, *, method: str = "GET", headers: dict[str, str] | None = None, data: bytes | None = None, timeout: float = 10.0) -> HttpResponse`
Exposes .status_code, .text, .content, and .headers.

2. TCP Streaming (ctx.stream):
`stream = await ctx.stream(host: str, port: int, *, ssl: bool = True) -> NetStream`
• await stream.send(data: bytes) -> None
• await stream.recv(size: int = 4096) -> bytes
• await stream.close() -> None

## 17. Interactive Screens, Navigation & Form Engine

The Hotaru Screens engine (ctx.screens) enables developers to build stateful menus within Telegram messages:

• await ctx.screens.show(title: str, body: str, *, buttons: list[list[Any]] | None = None, pager: Any | None = None) -> FormHandle
Renders a structured screen card with header, body, and keyboard.

• ctx.screens.button(text: str, callback: Callable[[FormHandle], Awaitable[None]], style: str = "default")
Creates an interactive button bound to an asynchronous callback.

• ctx.screens.primary(text: str, callback: Callable)
Creates a highlighted action button.

• ctx.screens.danger(text: str, callback: Callable)
Creates a destructive warning button (red accent).

• ctx.screens.success(text: str, callback: Callable)
Creates a confirmation action button (green accent).

• ctx.screens.pager(current_page: int, total_pages: int, on_page_change: Callable[[int], Awaitable[None]])
Constructs a pagination bar with previous, index, and next triggers.

• ctx.screens.table(headers: list[str], rows: list[list[str]], page: int = 1, page_size: int = 5) -> str
Renders an aligned ASCII table formatted for monospaced mobile displays.

• ctx.screens.details(items: dict[str, str]) -> str
Renders a structured key-value specification block.

• ctx.screens.back(on_back: Callable)
Adds a back button navigating to the previous view in the stack.

• ctx.screens.close()
Creates a dismissal button that cleanly tears down the interactive screen.

## 18. Security Checklist & Production Blueprints

Before distributing or loading a module, it must satisfy strict security audits:

### Security Verification (.semgrep/hotaru-security.yml)

1. No Credentials Leakage: Modules must never access sanctuary/ or session vaults.
2. No Private Namespace Escape: Access to __class__, __subclasses__, or sys.modules is blocked.
3. No Raw Sockets: Direct import of socket or urllib is rejected. Use ctx.net with the 'net' capability.
4. No Shell Execution: Calls to os.system or subprocess are blocked by seccomp.
5. Zero Comments: Production .hmod files contain zero comments. Code must be self-describing through strict typing.

### Production Blueprint: QR Code Generator (.qr)

```python
HOTARU = {
    "id": "qr_tool",
    "version": "1.0.0",
    "commands": {
        "qr": "qr_command",
    },
    "capabilities": ["mt", "net"],
    "lexicon": {
        "en": {
            "missing": "Provide text after .qr",
            "done": "QR Code generated.",
        },
        "ru": {
            "missing": "Укажите текст после .qr",
            "done": "QR-код сгенерирован.",
        },
    },
}

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def qr_command(ctx: ModuleContext) -> None:
    text = ctx.raw_args.strip()
    if not text:
        await ctx.respond(ctx.t("missing"))
        return
    url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={text}"
    response = await ctx.net(url)
    await ctx.reply_photo(response.content, caption=ctx.t("done"))
```
