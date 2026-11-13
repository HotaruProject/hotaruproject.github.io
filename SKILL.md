---
name: hotaru-module-developer
description: Exhaustive engineering specification and agent reference for authoring secure .hmod modules for the Hotaru Telegram userbot with Linux namespace sandboxing, capability enforcement, and complete ModuleContext API reference.
---

# Hotaru Module Developer Reference & Agent Skill

Hotaru is a security-first Telegram userbot operating from a primary user account. Unlike legacy userbot platforms that load third-party scripts directly into the interpreter alongside Telegram authentication sessions, Hotaru enforces process isolation and hardware-assisted capability sandboxing.

Modules (.hmod files) execute under strict Linux namespace boundaries:
- CLONE_NEWNS (Mount Namespace): Private filesystem table. /root, /home, /etc, sanctuary/ are concealed or read-only. Temporary files reside in ephemeral tmpfs.
- CLONE_NEWIPC (IPC Namespace): Isolated message queues and shared memory.
- CLONE_NEWUTS (Hostname Namespace): Isolated hostname identifiers.
- CLONE_NEWNET (Network Namespace): Network stack isolation. Modules without the 'net' capability have only a down loopback device.
- Privilege Dropping: Effective UID/GID set to nobody/nogroup (65534). prctl(PR_SET_NO_NEW_PRIVS, 1) enforced.
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

## 2. The .hmod Module Specification & Lifecycle

A Hotaru module is a self-contained Python source file ending with the .hmod extension. The runtime loads modules dynamically through the sandboxed runner.

### Manifest Schema: HOTARU Dictionary

Every .hmod module must expose a top-level module dictionary named HOTARU:

```python
from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def qr_command(ctx: ModuleContext) -> None:
    text = ctx.raw_args.strip()
    if not text:
        await ctx.respond(ctx.t("missing_text"))
        return
    url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={text}"
    response = await ctx.net(url)
    await ctx.reply_photo(response.content, caption=ctx.t("generated"))

HOTARU = {
    "id": "qr_tool",
    "name": "QR Generator",
    "version": "1.0.0",
    "author": "Security Engineering",
    "description": "Renders high resolution QR codes directly in chat.",
    "capabilities": ["mt", "net"],
    "commands": {
        "qr": qr_command,
    },
    "lexicon": {
        "en": {
            "missing_text": "Please provide text or a URL after .qr",
            "generated": "Here is your generated QR code.",
        },
        "ru": {
            "missing_text": "Укажите текст или ссылку после .qr",
            "generated": "Ваш QR-код успешно сгенерирован.",
        },
    },
}
```

### Manifest Fields Reference

• id (str, required): Unique lowercase identifier containing alphanumeric characters and underscores (e.g. 'qr_tool', 'notes_mgr', 'crypto_ticker').
• name (str, required): Human-readable display name.
• version (str, required): Semantic version string (MAJOR.MINOR.PATCH).
• author (str, optional): Author handle or organization.
• description (str, optional): Functional summary of the module.
• capabilities (list[str], required): Set of hardware and network capabilities requested by the module.
• commands (dict[str, Callable], required): Mapping of command triggers to asynchronous handler coroutines. Every handler receives ctx: ModuleContext as its single argument.
• tasks (dict[str, Callable], optional): Long-running background coroutines supervised by the core engine.
• lexicon (dict[str, dict[str, str]], optional): Localization dictionary supporting 'en', 'ru', 'uk', 'ja', 'kz', and 'zh'.

### Reserved Kernel Triggers

Hotaru reserves all command triggers utilized by built-in constellation modules. A third-party module attempting to bind any of the following triggers will fail validation at load time:
accounts, acl, backups, catalyst, executor, genesis, help, info, logger, power, settings, shield, singularity, translations, updater, ping, dash, restart, config, backup.

## 3. Capability System & RPC Firewall

Hotaru adheres to the principle of least privilege. By default, an isolated module has zero permissions: no network egress, no filesystem read or write outside its tmpfs mount, and no direct MTProto invocation.

### Available Capabilities

1. mt:
Grants mediated access to Telegram MTProto RPC calls via ctx.mt(method, **kwargs) and high-level messaging helpers. All RPC calls are intercepted by relay/firewall.py and verified against relay/denylist.py.

2. net:
Enables the network namespace egress interface. Allows outgoing HTTP, HTTPS, and TCP socket requests through ctx.net(url) and ctx.stream(host, port). Modules lacking this capability cannot communicate over the Internet.

3. state:
Provides persistent key-value storage scoped strictly to the module id. Backed by SQLite in a secured namespace. Modules cannot inspect or modify state entries belonging to other modules.

4. files:
Grants read and write access inside the module's ephemeral tmpfs scratch directory. Path traversal attempts (such as ../../sanctuary) are trapped and terminated with a security exception.

5. accounts:
Allows read-only introspection of configured userbot accounts via ctx.accounts.

6. screens:
Enables the interactive UI screen rendering engine (ctx.screens) for terminal and message-based navigation.

### The RPC Denylist

When a module with the 'mt' capability issues raw RPC calls, relay/denylist.py evaluates the method name against destructive Telegram operations. The following methods are strictly forbidden:

• Authentication and session revocation:
auth.logOut, auth.resetAuthorizations, auth.dropTempAuthKeys

• Account destruction:
account.deleteAccount

• Two-factor password modification:
account.updatePasswordSettings

If a module attempts to invoke a denylisted method, the relay immediately intercepts the packet, drops the worker process, logs the violation, and revokes all module capabilities.

## 4. ModuleContext: Complete Properties Catalog

The ModuleContext instance passed to command handlers and background tasks provides real-time event metadata and execution state.

### Properties Reference Table

• ctx.module_id -> str
Returns the unique identifier of the executing module.
Example:
assert ctx.module_id == "qr_tool"

• ctx.chat_id -> int
Telegram ID of the dialog, group, or channel where the command was triggered.
Example:
chat = ctx.chat_id

• ctx.sender_id / ctx.user_id -> int | None
Telegram user ID of the individual who sent the triggering message. Returns None if the message originated from an anonymous channel.
Example:
sender = ctx.sender_id or 0

• ctx.topic_id -> int | None
Thread ID when the message is posted inside a forum supergroup topic. Returns None in regular chats.
Example:
if ctx.topic_id is not None:
    await ctx.respond(f"Executed in topic {ctx.topic_id}")

• ctx.is_me / ctx.out -> bool
Boolean indicating whether the triggering message was sent by the userbot account itself.
Example:
if not ctx.is_me:
    return

• ctx.message -> ModuleMessage
The underlying message object containing text, entities, reply references, and raw flags.
Example:
raw_id = ctx.message.id

• ctx.has_media -> bool
Evaluates to True if the triggering message contains an attached photo, video, document, audio, sticker, voice note, or animation.
Example:
if not ctx.has_media:
    await ctx.respond("Please attach a file.")
    return

• ctx.media / ctx.attachment -> Attachment | None
Represents the media payload attached to the current message. Exposes .file_id, .size, .mime_type, and .filename.
Example:
if ctx.attachment:
    size_mb = ctx.attachment.size / (1024 * 1024)

• ctx.reply_message -> ModuleMessage | None
If the command was executed in reply to another message, returns that referenced message. Otherwise returns None.
Example:
if ctx.reply_message:
    target_author = ctx.reply_message.sender_id

• ctx.reply_attachment -> Attachment | None
The media attachment present on the replied-to message.
Example:
if ctx.reply_attachment:
    data = await ctx.download(ctx.reply_attachment)

• ctx.args -> list[str]
List of command arguments split by whitespace, excluding the prefix and command trigger.
Example:
if len(ctx.args) < 2:
    await ctx.respond("Usage: .calc <number> <operator>")

• ctx.raw_args -> str
The complete, unparsed string following the command trigger. Preserves leading and trailing whitespace.
Example:
query = ctx.raw_args.strip()

• ctx.prefix -> str
The specific prefix character used to trigger the command (e.g. '.' or '!').
Example:
pfx = ctx.prefix

• ctx.uptime -> float
The uptime of the Hotaru supervisor process in seconds.
Example:
up_hours = ctx.uptime / 3600.0

• ctx.memory / ctx.ram -> int
The resident set size (RSS) memory consumption of the worker process in bytes.
Example:
mb_used = ctx.memory / (1024 * 1024)

• ctx.version -> str
The Hotaru core version string.
Example:
current_ver = ctx.version

• ctx.is_stopping -> bool
Flag indicating whether the userbot has initiated shutdown. Checked by background tasks to perform graceful cleanup.
Example:
while not ctx.is_stopping:
    await asyncio.sleep(1)

## 5. ModuleContext: Messaging & Editing Methods

ModuleContext provides methods to create, edit, forward, react to, and delete messages.

### ctx.reply
Signature:
`await ctx.reply(text: str, *, parse_mode: str = "html", link_preview: bool = False, silent: bool = False, schedule_date: int | None = None) -> ModuleMessage`
Description:
Sends a message into the current chat in explicit reply to the triggering message.
Parameters:
• text (str): The body text to transmit.
• parse_mode (str): Entity parser ('html', 'md', or None). Defaults to 'html'.
• link_preview (bool): Enables or disables rich URL preview cards.
• silent (bool): Delivers the notification without sound.
• schedule_date (int | None): Unix timestamp for scheduled delivery.
Returns:
ModuleMessage instance of the sent message.
Exceptions:
Raises TelegramError on flood wait or chat restrictions.
Example:
```python
await ctx.reply("Calculation result: <b>42</b>", parse_mode="html")
```

### ctx.respond
Signature:
`await ctx.respond(text: str, *, parse_mode: str = "html", link_preview: bool = False) -> ModuleMessage`
Description:
If the triggering message was sent by the userbot account (ctx.is_me is True), edits that message in place. If the message was sent by another user, sends a fresh reply.
Returns:
ModuleMessage instance.
Example:
```python
msg = await ctx.respond("Processing dataset...")
await msg.edit("Processing complete.")
```

### ctx.edit
Signature:
`await ctx.edit(text: str, *, parse_mode: str = "html", link_preview: bool = False) -> ModuleMessage`
Description:
Edits the content of the triggering message. Fails if the message was not authored by the userbot.
Exceptions:
Raises PermissionError if ctx.is_me is False.
Example:
```python
await ctx.edit("Status: <b>Updated</b>")
```

### ctx.delete
Signature:
`await ctx.delete(*, revoke: bool = True) -> bool`
Description:
Deletes the triggering message.
Parameters:
• revoke (bool): When True, deletes the message for all chat participants.
Returns:
bool indicating success.
Example:
```python
await ctx.delete(revoke=True)
```

### ctx.pin
Signature:
`await ctx.pin(*, silent: bool = False, unpin_both: bool = False) -> bool`
Description:
Pins the triggering message in the current chat.
Example:
```python
await ctx.pin(silent=True)
```

### ctx.unpin
Signature:
`await ctx.unpin() -> bool`
Description:
Unpins the triggering message.
Example:
```python
await ctx.unpin()
```

### ctx.react
Signature:
`await ctx.react(emoji: str, *, big: bool = False) -> bool`
Description:
Applies an emoji reaction to the triggering message.
Parameters:
• emoji (str): Unicode emoji character (e.g. '🔥', '👍', '❤️').
• big (bool): Displays full-screen reaction animation.
Example:
```python
await ctx.react("🔥", big=True)
```

### ctx.unreact
Signature:
`await ctx.unreact() -> bool`
Description:
Removes any previously set reaction by the userbot on the current message.
Example:
```python
await ctx.unreact()
```

### ctx.forward_to
Signature:
`await ctx.forward_to(target_chat_id: int, *, silent: bool = False) -> ModuleMessage`
Description:
Forwards the triggering message to the specified target chat or user.
Example:
```python
await ctx.forward_to(123456789, silent=True)
```

### ctx.copy_to
Signature:
`await ctx.copy_to(target_chat_id: int, *, caption: str | None = None) -> ModuleMessage`
Description:
Sends a duplicate copy of the triggering message without the forwarded header.
Example:
```python
await ctx.copy_to(123456789, caption="Copied snippet")
```

### ctx.save
Signature:
`await ctx.save() -> ModuleMessage`
Description:
Forwards the message directly to Saved Messages ('me').
Example:
```python
await ctx.save()
```

### ctx.typing
Signature:
`await ctx.typing(action: str = "typing") -> None`
Description:
Sends a chat action notification to indicate activity.
Supported actions: 'typing', 'upload_photo', 'record_video', 'upload_video', 'record_audio', 'upload_audio', 'upload_document', 'choose_sticker'.
Example:
```python
await ctx.typing("upload_document")
```

### ctx.read & ctx.mark_read
Signature:
`await ctx.read() -> bool`
Description:
Marks all incoming messages in the current dialog up to the current message as read.
Example:
```python
await ctx.read()
```

## 6. ModuleContext: Media & File Operations

Hotaru handles media upload, transmission, and download through high-level streaming helpers that bypass disk storage when operating with memory buffers.

### ctx.send_file & ctx.reply_file
Signature:
`await ctx.reply_file(file: bytes | str | BinaryIO, *, caption: str | None = None, force_document: bool = False, filename: str | None = None) -> ModuleMessage`
Description:
Transmits an arbitrary binary payload, local file, or memory stream as a file attachment.
Parameters:
• file: Raw bytes, string path, or file-like object.
• caption: Optional descriptive text.
• force_document: Forces document delivery even for photos or audio.
• filename: Explicit filename when transmitting raw bytes.
Example:
```python
data = b"ID,Name\n1,Alpha\n2,Beta"
await ctx.reply_file(data, filename="report.csv", caption="Weekly Export")
```

### ctx.send_photo & ctx.reply_photo
Signature:
`await ctx.reply_photo(photo: bytes | str | BinaryIO, *, caption: str | None = None, parse_mode: str = "html") -> ModuleMessage`
Description:
Sends a JPEG, PNG, or WEBP image formatted as a compressed Telegram photo.
Example:
```python
with open("chart.png", "rb") as f:
    await ctx.reply_photo(f.read(), caption="System Metrics")
```

### ctx.send_video & ctx.reply_video
Signature:
`await ctx.reply_video(video: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None, width: int | None = None, height: int | None = None) -> ModuleMessage`
Description:
Transmits an MP4 or MOV video container with dimensions and playback duration metadata.
Example:
```python
await ctx.reply_video("capture.mp4", duration=14, caption="Recorded stream")
```

### ctx.send_audio & ctx.reply_audio
Signature:
`await ctx.reply_audio(audio: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None, performer: str | None = None, title: str | None = None) -> ModuleMessage`
Description:
Transmits an MP3, FLAC, or OGG music track with track title and performer tags.
Example:
```python
await ctx.reply_audio(audio_data, title="Synthesized Wave", performer="Hotaru")
```

### ctx.send_voice & ctx.reply_voice
Signature:
`await ctx.reply_voice(voice: bytes | str | BinaryIO, *, caption: str | None = None, duration: int | None = None) -> ModuleMessage`
Description:
Transmits an Opus-encoded audio stream as a voice waveform note.
Example:
```python
await ctx.reply_voice(opus_bytes, duration=5)
```

### ctx.send_animation & ctx.reply_animation
Signature:
`await ctx.reply_animation(animation: bytes | str | BinaryIO, *, caption: str | None = None) -> ModuleMessage`
Description:
Transmits a silent looping MP4 or GIF file as an in-chat animated sticker.
Example:
```python
await ctx.reply_animation("radar.mp4")
```

### ctx.send_dice & ctx.reply_dice
Signature:
`await ctx.reply_dice(emoji: str = "🎲") -> ModuleMessage`
Description:
Rolls an animated Telegram dice. Supported emojis: '🎲', '🎯', '🏀', '⚽', '🎳', '🎰'.
Example:
```python
await ctx.reply_dice("🎯")
```

### ctx.edit_media
Signature:
`await ctx.edit_media(media: bytes | str | BinaryIO, *, caption: str | None = None, parse_mode: str = "html") -> ModuleMessage`
Description:
Replaces the media attachment of an existing message without re-sending the message entity.
Example:
```python
await ctx.edit_media(updated_chart_bytes, caption="Updated at 12:00 UTC")
```

### ctx.edit_caption
Signature:
`await ctx.edit_caption(caption: str, *, parse_mode: str = "html") -> ModuleMessage`
Description:
Updates the text caption of an existing media message without re-uploading the underlying file.
Example:
```python
await ctx.edit_caption("Archived capture")
```

### ctx.download & ctx.download_media
Signature:
`await ctx.download(attachment: Attachment | None = None, destination: str | None = None) -> bytes | str`
Description:
Downloads the attachment associated with the triggering message or replied message. If destination is provided, streams the file to disk and returns the string path. If destination is None, buffers the complete file into memory and returns bytes.
Example:
```python
if ctx.reply_attachment:
    file_bytes = await ctx.download(ctx.reply_attachment)
    assert isinstance(file_bytes, bytes)
```

## 7. ModuleContext: Buttons, Polls & Checklists

Hotaru enables deep interaction with inline buttons, Telegram polls, and native checklists.

### Inline Button Operations

• ctx.buttons -> list[list[MessageButton]]
Matrix of inline buttons present on the triggering message. Each button exposes .text, .data, and .url.

• ctx.button_count -> int
Total count of inline buttons on the message.

• await ctx.click(row: int, col: int) -> Any
Simulates tapping an inline button at the specified matrix coordinate.

• await ctx.click_button(text: str | None = None, data: bytes | None = None) -> Any
Searches for an inline button matching the label or callback payload and triggers it.
Example:
```python
await ctx.click_button(text="Confirm")
```

• await ctx.edit_buttons(buttons: list[list[dict[str, str]]]) -> None
Updates or replaces the inline keyboard markup of the current message.
Example:
```python
markup = [
    [{"text": "Refresh", "data": "ref_1"}, {"text": "Dismiss", "data": "dis_1"}]
]
await ctx.edit_buttons(markup)
```

• await ctx.remove_buttons() -> None
Strips all inline keyboard buttons from the message while keeping its text intact.
Example:
```python
await ctx.remove_buttons()
```

### Native Poll Operations

• await ctx.send_poll(question: str, answers: list[str], *, multiple_choice: bool = False, quiz: bool = False, correct_id: int | None = None) -> ModuleMessage
Sends an interactive poll into the chat.
Parameters:
• question: The inquiry heading (up to 255 characters).
• answers: List of 2 to 10 option strings.
• multiple_choice: Permits selecting multiple answers.
• quiz: Sets quiz mode requiring a single correct answer.
• correct_id: Zero-indexed position of the correct answer in quiz mode.
Example:
```python
await ctx.send_poll(
    "Choose target deployment region:",
    ["Frankfurt", "Tokyo", "Virginia"],
    multiple_choice=False,
)
```

• await ctx.close_poll() -> Any
Closes voting on the poll contained in the current message.
Example:
```python
await ctx.close_poll()
```

• await ctx.vote(answers: list[int]) -> Any
Casts a vote on the poll for the specified answer indices.
Example:
```python
await ctx.vote([0])
```

• await ctx.retract_vote() -> Any
Retracts the userbot's cast vote from the poll.
Example:
```python
await ctx.retract_vote()
```

• await ctx.get_poll_results() -> dict[str, Any]
Retrieves aggregated vote totals and percentages for the poll.

### Native Telegram Checklists

• await ctx.send_todo(title: str, items: list[str], *, others_can_append: bool = False, others_can_complete: bool = False) -> ModuleMessage
Transmits a native Telegram checklist with checkable boxes.
Example:
```python
await ctx.send_todo(
    "Deployment Checklist",
    ["Run migrations", "Flush cache", "Verify health check"],
    others_can_complete=True,
)
```

• await ctx.append_todo(items: list[str]) -> Any
Appends additional task items to an existing checklist message.
Example:
```python
await ctx.append_todo(["Verify DNS propagation"])
```

• await ctx.set_checklist_completed(completed: list[int], incompleted: list[int]) -> Any
Toggles the checked state of checklist items by index.

## 8. Extended Telegram Subsystem Catalog

The Hotaru relay provides direct access to over 290 granular Telegram methods through ctx. These methods are type-checked, sanitized, and bound to the current peer.

### Forum Topics Management

• await ctx.create_forum_topic(title: str, icon_color: int | None = None, icon_emoji_id: int | None = None) -> Any
Creates a discussion thread inside a forum supergroup.
Example:
```python
topic = await ctx.create_forum_topic("Incident #402", icon_color=0x6FB9F0)
```

• await ctx.edit_forum_topic(topic_id: int, title: str | None = None, closed: bool | None = None) -> Any
Modifies topic title or toggles closed status.

• await ctx.set_forum_topic_pinned(topic_id: int, pinned: bool) -> Any
Pins or unpins a topic in the forum index.

• await ctx.remove_forum_topic(topic_id: int) -> Any
Deletes a forum topic and its complete message history.

• await ctx.forum_topics(offset_date: int = 0, limit: int = 50) -> Any
Lists forum topics in the current channel.

### Channel Administration

• await ctx.channel_details() -> Any
Fetches metadata, participant count, and description for the current channel.

• await ctx.channel_members(limit: int = 50) -> Any
Retrieves participant records for the channel.

• await ctx.set_channel_admin(user_id: int, is_admin: bool, rank: str = "") -> Any
Promotes or demotes an administrator with a custom badge title.

• await ctx.restrict_channel_member(user_id: int, send_messages: bool = False) -> Any
Restricts specific permissions of a member.

• await ctx.channel_admin_log(limit: int = 50) -> Any
Extracts audit log events including member bans, message deletions, and role changes.

• await ctx.set_slow_mode(seconds: int) -> Any
Configures slow mode interval in seconds (0 to disable).

• await ctx.set_antispam(enabled: bool) -> Any
Toggles Telegram native aggressive anti-spam protection.

### Reactions & Scheduled History

• await ctx.configure_chat_reactions(available_reactions: list[str]) -> Any
Restricts allowed reaction emojis in a group or channel.

• await ctx.scheduled_messages() -> list[Any]
Retrieves pending scheduled messages in the current chat.

• await ctx.cancel_scheduled(ids: list[int]) -> Any
Cancels and removes scheduled messages by their identifier.

## 9. State Storage & Network Stream Engine

Hotaru isolates persistence and network I/O behind dedicated capability proxies.

### Persistent Key-Value State (ctx.state)

Requires capability: 'state'
State is backed by an encrypted SQLite engine. Keys are scoped strictly to the calling module ID, guaranteeing isolation between modules.

Methods:
• await ctx.state.get(key: str, default: Any = None) -> Any
Retrieves the value associated with key. If absent, returns default.

• await ctx.state.set(key: str, value: Any) -> None
Persists a JSON-serializable value (dict, list, int, float, str, bool).

• await ctx.state.delete(key: str) -> bool
Removes key from storage. Returns True if the key existed.

• await ctx.state.clear() -> None
Purges all key-value entries belonging to this module.

• await ctx.state.all() -> dict[str, Any]
Dumps the entire key-value space of the module.

Usage Example:
```python
async def counter_command(ctx: ModuleContext) -> None:
    current = await ctx.state.get("invocations", 0)
    current += 1
    await ctx.state.set("invocations", current)
    await ctx.respond(f"Command executed {current} times.")
```

### Network Client & TCP Streaming (ctx.net & ctx.stream)

Requires capability: 'net'
All egress traffic passes through a proxy gateway enforcing TLS validation and connection rate limiting.

1. HTTP Requests (ctx.net):
Signature:
`await ctx.net(url: str, *, method: str = "GET", headers: dict[str, str] | None = None, data: bytes | None = None, json: Any | None = None, timeout: float = 10.0) -> HttpResponse`
Properties on HttpResponse:
• .status_code (int): HTTP response status code (e.g. 200, 404).
• .text (str): Decoded unicode response body.
• .content (bytes): Raw binary response body.
• .headers (dict[str, str]): HTTP response headers.

Usage Example:
```python
async def weather_command(ctx: ModuleContext) -> None:
    city = ctx.raw_args.strip() or "London"
    url = f"https://wttr.in/{city}?format=j1"
    response = await ctx.net(url)
    if response.status_code == 200:
        data = json.loads(response.text)
        temp = data["current_condition"][0]["temp_C"]
        await ctx.respond(f"Temperature in {city}: {temp}°C")
```

2. Raw TCP Streaming (ctx.stream):
Signature:
`stream = await ctx.stream(host: str, port: int, *, ssl: bool = True) -> NetStream`
Methods on NetStream:
• await stream.send(data: bytes) -> None
• await stream.recv(size: int = 4096) -> bytes
• await stream.close() -> None

## 10. Interactive Screens, Navigation & Form Engine

The Hotaru Screens engine (ctx.screens) enables developers to create stateful interactive menus and terminal screens within Telegram messages.

### Screen Components Reference

• await ctx.screens.show(title: str, body: str, *, buttons: list[list[Any]] | None = None, pager: Any | None = None) -> FormHandle
Renders a structured message screen with header, content body, and inline keyboard controls.

• ctx.screens.button(text: str, callback: Callable[[FormHandle], Awaitable[None]], style: str = "default")
Creates an interactive button bound to an asynchronous callback coroutine.

• ctx.screens.primary(text: str, callback: Callable)
Creates a visually highlighted primary action button.

• ctx.screens.danger(text: str, callback: Callable)
Creates a destructive warning button (red accent).

• ctx.screens.success(text: str, callback: Callable)
Creates an affirmative action button (green accent).

• ctx.screens.pager(current_page: int, total_pages: int, on_page_change: Callable[[int], Awaitable[None]])
Constructs a pagination bar with previous, index, and next triggers.

• ctx.screens.table(headers: list[str], rows: list[list[str]], page: int = 1, page_size: int = 5) -> str
Renders an aligned ASCII table formatted for mobile monospaced display.

• ctx.screens.close()
Creates a dismissal button that cleanly tears down the interactive screen.

### Stateful Navigation Example

```python
async def notes_menu(ctx: ModuleContext) -> None:
    notes = await ctx.state.get("notes_list", [])

    async def render_view(page: int = 0) -> None:
        items_per_page = 3
        total = max(1, (len(notes) + items_per_page - 1) // items_per_page)
        slice_items = notes[page * items_per_page:(page + 1) * items_per_page]
        
        body_lines = [f"{i+1}. {item}" for i, item in enumerate(slice_items)]
        body = "\n".join(body_lines) or "No notes saved yet."

        rows = []
        if total > 1:
            pager_row = []
            if page > 0:
                pager_row.append(ctx.screens.button("Prev", lambda h: render_view(page - 1)))
            pager_row.append(ctx.screens.button(f"{page + 1}/{total}", lambda h: None))
            if page < total - 1:
                pager_row.append(ctx.screens.button("Next", lambda h: render_view(page + 1)))
            rows.append(pager_row)

        rows.append([
            ctx.screens.success("Add Note", add_note_flow),
            ctx.screens.danger("Clear All", clear_notes_flow),
        ])

        await ctx.screens.show("Notes Manager", body, buttons=rows)

    async def add_note_flow(handle: FormHandle) -> None:
        notes.append(f"Note recorded at {int(ctx.uptime)}s")
        await ctx.state.set("notes_list", notes)
        await render_view(0)

    async def clear_notes_flow(handle: FormHandle) -> None:
        notes.clear()
        await ctx.state.set("notes_list", [])
        await render_view(0)

    await render_view(0)
```

## 11. Background Supervisor Tasks & Lifecycle

Modules can run background tasks that persist throughout the userbot runtime. Declare tasks in the tasks mapping of the HOTARU dictionary.

### Background Task Lifecycle

1. Registration:
During module startup, Hotaru registers every coroutine declared in HOTARU['tasks'].

2. Supervisor Monitoring:
Tasks run inside the module's sandboxed worker process. If a task crashes due to an unhandled exception, the Hotaru supervisor restarts it with exponential backoff (up to 5 attempts).

3. Graceful Termination:
During bot shutdown or module unloading, ctx.is_stopping is set to True. The task is given a 5-second grace period to flush buffers, close open files, and exit cleanly before SIGKILL.

### Background Worker Pattern

```python
import asyncio
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def reminder_worker(ctx: ModuleContext) -> None:
    while not ctx.is_stopping:
        try:
            reminders = await ctx.state.get("pending_reminders", [])
            now = int(asyncio.get_event_loop().time())
            active = []
            for r in reminders:
                if r["timestamp"] <= now:
                    await ctx.tg.send_message(r["chat_id"], f"Reminder: {r['text']}")
                else:
                    active.append(r)
            if len(active) != len(reminders):
                await ctx.state.set("pending_reminders", active)
        except Exception:
            pass
        
        for _ in range(10):
            if ctx.is_stopping:
                break
            await asyncio.sleep(1)

HOTARU = {
    "id": "reminders",
    "name": "Background Reminder",
    "version": "1.0.0",
    "capabilities": ["mt", "state"],
    "commands": {},
    "tasks": {
        "checker": reminder_worker,
    },
}
```

## 12. Internationalization & Lexicons

Hotaru user interfaces adapt dynamically to the user's configured language. Hardcoding user-facing strings in command handlers is strictly prohibited.

### Lexicon Schema

Declare a lexicon dictionary in the module manifest containing language sub-dictionaries:

```python
"lexicon": {
    "en": {
        "welcome": "Welcome back, {user}!",
        "error_empty": "Query cannot be empty.",
    },
    "ru": {
        "welcome": "С возвращением, {user}!",
        "error_empty": "Запрос не может быть пустым.",
    },
    "uk": {
        "welcome": "З поверненням, {user}!",
        "error_empty": "Запит не може бути порожнім.",
    },
}
```

### Retrieving Localized Strings: ctx.t

Signature:
`ctx.t(key: str, **kwargs) -> str`

Behavior:
1. Checks the user's active language setting.
2. If the key exists in that language, returns the translated string formatted with **kwargs.
3. If absent, falls back to the English ('en') translation.
4. If missing from English, returns the raw key literal as a safety measure.

Usage Example:
```python
greeting = ctx.t("welcome", user="Alice")
await ctx.respond(greeting)
```

## 13. Security Audit Checklist & Semgrep Rules

Before any module is distributed or loaded into Hotaru, it must satisfy strict static security requirements.

### Semgrep Security Verification

The repository enforces Semgrep rules located in .semgrep/hotaru-security.yml:

1. No Credentials Leakage (hotaru-no-vault-leak):
Modules must never attempt to open, read, or transmit files located in sanctuary/, including hotaru.vault, runtime.db, or session files.

2. No Private Namespace Access (hotaru-no-private-escape):
Modules must never inspect or modify private attributes of the core engine (__class__, __subclasses__, __globals__, or sys.modules).

3. No Unsandboxed Network Sockets (hotaru-no-raw-socket):
Direct import of socket, urllib, or requests is blocked by the runtime. All network traffic must use ctx.net or ctx.stream with the 'net' capability declared.

4. No System Shell Execution (hotaru-no-shell-exec):
Calls to os.system, subprocess.Popen, os.popen, or pty.spawn are trapped by seccomp filters and result in immediate worker SIGKILL.

5. Zero Comments in Production Code:
In accordance with Hotaru code purity standards, production .hmod files contain zero comment lines. Code must be self-documenting through precise type annotations and explicit naming.

## 14. Complete Production Module Blueprints

The following production blueprints demonstrate real-world, secure module design. Notice that neither ping nor any kernel command is used.

### Blueprint 1: Text Encryption Tool (.cipher)

```python
from __future__ import annotations
import base64
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def cipher_command(ctx: ModuleContext) -> None:
    text = ctx.raw_args.strip()
    if not text:
        await ctx.respond(ctx.t("missing_input"))
        return
    encoded = base64.b64encode(text.encode("utf-8")).decode("ascii")
    await ctx.respond(f"<code>{encoded}</code>", parse_mode="html")

HOTARU = {
    "id": "b64_cipher",
    "name": "Base64 Cipher",
    "version": "1.0.0",
    "capabilities": ["mt"],
    "commands": {
        "cipher": cipher_command,
    },
    "lexicon": {
        "en": {
            "missing_input": "Usage: .cipher <text to encode>",
        },
        "ru": {
            "missing_input": "Использование: .cipher <текст для кодирования>",
        },
    },
}
```

### Blueprint 2: Persistent Paste Bin (.paste)

```python
from __future__ import annotations
import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def paste_command(ctx: ModuleContext) -> None:
    content = ctx.raw_args.strip()
    if not content and ctx.reply_message:
        content = ctx.reply_message.message.text
    if not content:
        await ctx.respond(ctx.t("empty_paste"))
        return
    await ctx.typing("upload_document")
    payload = json.dumps({"content": content, "extension": "txt"}).encode("utf-8")
    res = await ctx.net(
        "https://paste.rs",
        method="POST",
        headers={"Content-Type": "text/plain"},
        data=content.encode("utf-8"),
    )
    if res.status_code in (200, 201):
        url = res.text.strip()
        await ctx.respond(ctx.t("paste_success", url=url))
    else:
        await ctx.respond(ctx.t("paste_error"))

HOTARU = {
    "id": "paste_bin",
    "name": "Paste Bin Uploader",
    "version": "1.0.0",
    "capabilities": ["mt", "net"],
    "commands": {
        "paste": paste_command,
    },
    "lexicon": {
        "en": {
            "empty_paste": "Provide text or reply to a message with .paste",
            "paste_success": "Uploaded to pastebin: {url}",
            "paste_error": "Failed to upload snippet.",
        },
        "ru": {
            "empty_paste": "Укажите текст или ответьте на сообщение через .paste",
            "paste_success": "Сниппет опубликован: {url}",
            "paste_error": "Ошибка при публикации сниппета.",
        },
    },
}
```
