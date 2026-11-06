---
name: hotaru-module-developer
description: Exhaustive engineering specification, architecture reference, and agent manual for authoring secure .hmod modules for the Hotaru Telegram userbot with Linux namespace sandboxing, capability enforcement, lifecycle hooks, template fields, watchers, tasks, 29 init systems daemon integration, and complete reference for all ModuleContext MTProto methods.
license: GNU AGPLv3
---

# Hotaru Module Developer Reference & Agent Skill

Hotaru is a security-first Telegram userbot operating from a primary user account, built on top of the GoyGram asynchronous MTProto framework (`goygram==0.8.28`) in Python 3.13+. Unlike legacy userbot platforms that execute third-party code in the main process alongside sensitive authentication keys and session databases, Hotaru enforces hardware-assisted process isolation and capability-based sandboxing.

## 1. Core Architectural Invariants

1. **First-Statement Rule**:
   The assignment `HOTARU = { ... }` must be the very first executable statement in every `.hmod` file. Hotaru inspects module metadata using Python's `ast` module prior to loading or compiling bytecode. Any preceding imports, variable declarations, or helper functions will trigger `ModuleValidationError` and immediately halt execution.

2. **Process Isolation & Linux Namespaces**:
   Modules execute in dedicated child worker processes isolated through Linux namespaces (`CLONE_NEWNS`, `CLONE_NEWIPC`, `CLONE_NEWUTS`, `CLONE_NEWNET`). Unprivileged worker UID/GID is locked to `nobody:nogroup` (65534) on a clean, ephemeral `tmpfs` root. The Linux kernel flag `prctl(PR_SET_NO_NEW_PRIVS, 1)` strictly prevents privilege escalation.

3. **Optional Type Annotations**:
   Type annotations are completely optional in Hotaru modules. Python 3.13 executes handlers whether typed or untyped with zero difference in performance or runtime behavior. Developers are free to use typing for static analysis or omit it for concise scripting.

4. **Code Quality & Documentation**:
   Clear code, clean architecture, and robust error handling maintain long-term reliability and facilitate collaborative development and agent pair-programming.

5. **Open Source License**:
   Hotaru is free, open-source software distributed under the GNU Affero General Public License v3.0 (AGPLv3).

## 2. Core Subsystems Deep Dive (File-by-File Reference)

Hotaru's codebase is divided into two primary security boundaries: the trusted core (`hotaru/`) and the isolation relay gate (`relay/`).

### Core Directory (`hotaru/`)

• `hotaru/__main__.py`:
  The primary entry point. Parses command-line flags (`--config`, `--daemon`, `--version`), sets up signal handlers (`SIGINT`, `SIGTERM`, `SIGHUP`), bootstraps logging with Rich formatting, verifies `.venv` execution, and initializes `hotaru.kernel.Kernel`.

• `hotaru/kernel.py`:
  The central nervous system of Hotaru. Instantiates the GoyGram client, connects to Telegram MTProto data centers, initializes the encryption layer, manages network keep-alives, routes raw Telegram updates into the event bus, and dispatches command triggers to active modules.

• `hotaru/modules.py`:
  The dynamic module loading engine. Implements the `.ld` command handler. Downloads `.hmod` files from chat replies or HTTPS URLs into `sanctuary/quarantine/`, performs AST parsing and schema validation, checks capability policies in `hotaru/access.py`, forks the isolated worker process via `relay/sandbox.py`, and registers command triggers in `hotaru/registry.py`. Also provides `.rl` (hot-reload), `.ul` (unload), `.ex` (export), and `.resetdb` (database wipe).

• `hotaru/response.py`:
  Implements the `ModuleContext` class passed to every command, watcher, and task. Provides everyday helpers (`ctx.respond`, `ctx.reply`, `ctx.edit`, `ctx.delete`, `ctx.react`, `ctx.reply_photo`, `ctx.reply_file`, `ctx.reply_video`, `ctx.reply_audio`, `ctx.reply_voice`, `ctx.reply_dice`), capability bridges (`ctx.state`, `ctx.net`, `ctx.screens`, `ctx.stream`, `ctx.download`), and all 292 extended MTProto RPC methods.

• `hotaru/screens.py`:
  The interactive Telegram UI engine. Renders inline keyboard buttons, pagination carousels, monospaced ASCII tables, and multi-step dialog forms. Maps callback queries to coroutine closures via `hotaru/callback_codec.py`.

• `hotaru/state.py`:
  Encrypted SQLite storage manager. Provisions an isolated SQLite database for each module at `sanctuary/modules/<id>.db`. Configured in WAL mode with atomic transactions and automatic JSON serialization of arbitrary nested structures.

• `hotaru/daemon.py`:
  Cross-platform background service coordinator supporting 29 init systems and service supervisors (`systemd`, `dinit`, `openrc`, `runit`, `s6`, `66`, `termux-services`, `termux-boot`, `launchd`, `procd`, `sysvinit`, `upstart`, `shepherd`, `supervisord`, `circus`, `monit`, `pm2`, `god`, `daemontools`, `perp`, `finit`, `busybox-init`, `minit`, `cinit`, `smf`, `nosh`, `bsd-rc`, `openbsd-rc`, `simple-daemon`). Auto-detects the active init system on the host and manages unit generation, installation, status checks, and uninstallation.

• `hotaru/supervisor.py`:
  Task monitor. Continuously supervises background coroutines declared in `HOTARU['tasks']`. Catches unhandled exceptions, records tracebacks, and applies an exponential backoff restart schedule (`2s`, `4s`, `8s`, `16s`, `32s`). Enforces a 5-second graceful termination window via `ctx.is_stopping` during module unloads.

• `hotaru/access.py`:
  Security gate and Access Control Lists (ACL). Enforces permission boundaries, role-based command whitelists and blacklists, chat scopes, and capability authorizations.

• `hotaru/login.py`:
  Interactive multi-factor CLI login wizard. Supports QR code authentication, phone number + SMS code + 2FA cloud password, and bot token authorization. Automatically connects to `/dev/tty` when executed inside piped install scripts.

• `hotaru/accounts.py`:
  Multi-account session coordinator. Allows users to register and manage multiple Telegram accounts within a single Hotaru instance, switch active personas, and synchronize security policies.

• `hotaru/boot.py` & `hotaru/deps.py`:
  Runtime bootloader and dependency resolver. Checks virtual environment integrity, auto-creates `.venv` if missing, synchronizes dependencies via `uv` or `pip`, and executes self-exec process replacement.

• `hotaru/i18n.py`:
  Internationalization manager. Loads core translations from `lexicon/*.json` and merges module-level lexicons. Implements locale auto-detection and language fallback cascades.

• `hotaru/backup.py`:
  Automated backup engine. Creates encrypted archives of user state, session vaults, and installed modules with automatic rotation and integrity verification.

### Relay Boundary Directory (`relay/`)

• `relay/sandbox.py`:
  Process containment barrier. Spawns isolated worker processes using Linux namespaces (`CLONE_NEWNS`, `CLONE_NEWIPC`, `CLONE_NEWUTS`, `CLONE_NEWNET`), drops privileges to UID 65534 (`nobody`), applies seccomp filters, mounts an ephemeral tmpfs root, and sets `PR_SET_NO_NEW_PRIVS`.

• `relay/caps.py`:
  Capability enforcer. Verifies that incoming calls from worker processes match permissions declared in `HOTARU['capabilities']`. Unprivileged requests are immediately rejected with `CapabilityDeniedError`.

• `relay/firewall.py`:
  MTProto security firewall. Inspects all outbound MTProto RPC calls from modules and blocks dangerous or destructive calls (e.g. `auth.resetAuthorizations`, `account.deleteAccount`, `auth.exportAuthorization`, `messages.deleteAllHistory`).

• `relay/rpc.py`:
  Inter-Process Communication (IPC) transport. Serializes and dispatches calls and responses across UNIX domain sockets between the core userbot and isolated module workers.

• `relay/proxies.py`:
  Network proxy gateway. Enforces TLS validation, DNS rebinding guards, and request timeouts for outbound HTTP requests issued via `ctx.net`.

## 3. Built-in Constellation Modules Reference (`constellations/*.hmod`)

Hotaru ships with 15 production-grade built-in modules located in `constellations/`. These modules provide core userbot functionality and serve as architectural benchmarks for third-party module authors:

1. `accounts.hmod` (48 KB):
   - Capabilities: `mt`, `state`
   - Purpose: Multi-account management. Allows linking multiple Telegram accounts, switching active session contexts, viewing authorization dates, and cloning profile settings.

2. `acl.hmod` (36 KB):
   - Capabilities: `mt`, `state`
   - Purpose: Granular Access Control Lists. Enables restricting specific commands to trusted user IDs, whitelisting or blacklisting chats, creating custom user groups, and setting rate limits per user.

3. `backups.hmod` (7.5 KB):
   - Capabilities: `mt`, `state`, `files`
   - Purpose: Encrypted backup creator. Bundles `sanctuary/` databases, installed `.hmod` files, and configuration vaults into password-protected archives sent directly to Saved Messages.

4. `catalyst.hmod` (9.7 KB):
   - Capabilities: `mt`, `state`
   - Purpose: Fast execution engine and alias manager. Manages custom command aliases, dynamic shortcuts, prefix overrides, and command chaining pipelines.

5. `executor.hmod` (66 KB):
   - Capabilities: `mt`, `state`, `files`
   - Purpose: Dynamic evaluation terminal (`.e`, `.py`, `.sh`). Executes Python expressions and bash commands inside an isolated sub-sandbox with live stdout/stderr capture, result editing, and traceback formatting.

6. `genesis.hmod` (18 KB):
   - Capabilities: `mt`, `state`, `files`
   - Purpose: Module development generator. Scaffolds new `.hmod` projects from templates, validates manifest syntax, checks AST structures, and packages modules for distribution.

7. `help.hmod` (12 KB):
   - Capabilities: `mt`
   - Purpose: Interactive command browser (`.help`, `.help <mod>`). Features interactive category pagination, search by trigger name, parameter usage display, and module about banners.

8. `info.hmod` (5.4 KB):
   - Capabilities: `mt`
   - Purpose: System telemetry and diagnostic status card. Displays kernel uptime, Python version, GoyGram version, host OS, CPU load, memory utilization, and active module counts.

9. `logger.hmod` (14 KB):
   - Capabilities: `mt`, `state`
   - Purpose: Real-time chat activity auditing. Monitors message edits, deleted messages, user bio updates, and group event notifications, forwarding logged events to a designated private logging channel.

10. `power.hmod` (6.4 KB):
    - Capabilities: `mt`
    - Purpose: Userbot process lifecycle control. Handles `.restart`, `.reload`, `.poweroff`, and graceful self-exec upgrades without disconnecting Telegram sessions.

11. `settings.hmod` (27 KB):
    - Capabilities: `mt`, `state`
    - Purpose: Central configuration hub (`.config`). Provides an interactive settings screen for configuring command prefixes, active languages, theme colors, and defense sensitivity levels.

12. `shield.hmod` (8.2 KB):
    - Capabilities: `mt`, `state`
    - Purpose: Defensive anti-flood and anti-raid sentinel. Intercepts incoming messages, detects rapid message bursts from spambots, automatically silences offending users, and deletes raid waves.

13. `singularity.hmod` (5.0 KB):
    - Capabilities: `mt`, `state`, `net`
    - Purpose: Web dashboard bridge. Connects the userbot core to the Node.js/Vite Singularity web panel, exporting live telemetry metrics and handling Cloudflare tunnel authentication.

14. `translations.hmod` (21 KB):
    - Capabilities: `mt`, `net`
    - Purpose: Multi-engine inline translator (`.tr`, `.translate`). Supports Telegram native MTProto translation RPCs and fallback translation providers with automatic language detection.

15. `updater.hmod` (18 KB):
    - Capabilities: `mt`, `net`
    - Purpose: Automated core updater. Fetches git commit history from GitHub, checks for new releases on `main` and `develop`, executes schema migrations, and restarts the core smoothly.

16. `indusblock.hmod` (Example External Module):
    - Capabilities: `mt`, `state`
    - Purpose: Automated story viewer auditor. Inspects viewers of your Telegram stories, identifies suspicious promotional accounts and mass-viewing bots, and blocks them automatically.

## 4. Complete Manifest Schema Reference (HOTARU Dictionary)

Every module declares its specification via the `HOTARU` dictionary. Below is the comprehensive schema documentation:

```python
HOTARU = {
    "id": "vault_sync",
    "version": "1.2.0",
    "commands": {
        "sync": "sync_command",
        "status": "status_command",
    },
    "capabilities": ["net", "state"],  # Declare ONLY what is actually needed (mt is NOT needed for ctx 292 methods!)
    "watchers": ["message_watcher"],
    "tasks": {
        "heartbeat_loop": "heartbeat_worker",
        "cleanup_loop": "cleanup_worker",
    },
    "aliases": {
        "vstatus": "status",
        "vsync": "sync",
    },
    "config_schema": {
        "remote_endpoint": {
            "type": "string",
            "default": "https://api.vault.internal/sync",
            "description": "Remote vault sync URL",
        },
        "sync_interval": {
            "type": "int",
            "default": 300,
            "min": 30,
            "max": 86400,
            "description": "Interval between background syncs (seconds)",
        },
        "auto_notify": {
            "type": "bool",
            "default": True,
            "description": "Send notification upon successful sync",
        },
    },
    "lexicon": {
        "en": {
            "syncing": "Synchronizing vault with remote...",
            "done": "Vault sync completed in {duration}ms.",
            "error": "Sync failed: {reason}",
        },
        "ru": {
            "syncing": "Синхронизация хранилища с сервером...",
            "done": "Синхронизация завершена за {duration}мс.",
            "error": "Ошибка синхронизации: {reason}",
        },
    },
    "requires": ["common_crypto"],
    "after": ["accounts", "shield"],
    "inline_commands": ["vault_query"],
    "rise": "on_startup",
    "fade": "on_shutdown",
    "template_fields": {
        "vault_health": {
            "scope": "global",
            "provider": "vault_health_provider",
        },
    },
    "banner": "https://example.com/banner.png",
    "bot_commands": ["sync", "status"],
}
```

### Field Rules & Verification

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `str` | Yes | **Module name** (e.g. `'notes'`, `'calc'`). Used in Telegram commands like `.rl <id>`, `.ul <id>`, `.ex <id>`, `.resetdb <id>`, and in `.mods`. |
| `version` | `str` | Yes | Semantic version string (`x.y.z`). |
| `commands` | `dict[str, str]` | Yes | Map of chat command triggers to handler functions (e.g. `{'calc': 'calc_cmd'}` triggers on `.calc`). |
| `capabilities` | `list[str]` | Yes | List of requested permissions (`mt`, `state`, `net`, `files`, `shell`, `inline`, `modules`, `assets`). Default is `[]` for standard modules using `ctx` methods. |
| `watchers` | `list[str]` | No | List of message interceptors called on all updates. |
| `tasks` | `dict[str, str]` | No | Supervised background worker coroutines. |
| `aliases` | `dict[str, str]` | No | Command aliases (`{'alias': 'target'}`). |
| `config_schema`| `dict[str, dict]`| No | User settings schema with types, defaults, and ranges. |
| `lexicon` | `dict[str, dict]`| No | Localized strings for multi-language support. |
| `requires` | `list[str]` | No | Module dependencies that must be active. |
| `after` | `list[str]` | No | Initialization ordering constraints. |
| `inline_commands`| `list[str]` | No | Triggers for inline queries via `@bot`. |
| `rise` | `str` | No | Startup initialization hook coroutine. |
| `fade` | `str` | No | Shutdown teardown hook coroutine. |
| `template_fields`| `dict[str, dict]`| No | Dynamic placeholder variables for formatting layouts. |
| `banner` | `str` | No | URL or local path to module banner image. |
| `bot_commands` | `list[str]` | No | Commands exported to Telegram autocomplete. |

### Complete Capability Classification & Sandbox Security Model

Hotaru enforces a capability-based security model. Modules execute in isolated unprivileged worker processes and must explicitly request privileged capabilities in `HOTARU['capabilities']`. Unprivileged requests are immediately rejected with `CapabilityDeniedError`.

#### Principle of Least Privilege: What Requires Capabilities vs What Is Free

| Resource / API | Capability Required | Description |
|---|---|---|
| **Everyday Messaging** | **None (`[]`)** | `ctx.respond()`, `ctx.reply()`, `ctx.edit()`, `ctx.delete()`, `ctx.react()`, `ctx.pin()`, etc. |
| **Media Senders** | **None (`[]`)** | `ctx.reply_photo()`, `ctx.reply_file()`, `ctx.reply_video()`, `ctx.reply_audio()`, `ctx.reply_voice()`, `ctx.reply_dice()` |
| **All 292 Extended MTProto Methods** | **None (`[]`)** | Built-in Telegram methods on `ctx` (`ctx.send_message()`, `ctx.block_peer()`, `ctx.channel_details()`, `ctx.post_story()`, `ctx.create_forum_topic()`, `ctx.send_poll()`, `ctx.set_slow_mode()`, `ctx.ban_channel_member()`, etc.) with automatic defaults for current chat and message. |
| **Interactive Screens & UI** | **None (`[]`)** | `ctx.screens` (buttons, forms, paginators, tables) and `ctx.ui` |
| **HTML Formatting** | **None (`[]`)** | `ctx.html.bold()`, `ctx.html.italic()`, `ctx.html.code()`, `ctx.html.pre()`, `ctx.html.escape()`, etc. |
| **Localization & Lexicon** | **None (`[]`)** | `ctx.t("key", **kwargs)` multi-language string lookup |
| **Context & Inspection Data** | **None (`[]`)** | `ctx.chat_id`, `ctx.peer_id`, `ctx.message`, `ctx.reply_to`, `ctx.sender_id`, `ctx.args`, `ctx.memory`, `ctx.uptime` |
| **Structured Logging** | **None (`[]`)** | `ctx.logs.info()`, `ctx.logs.warning()`, `ctx.logs.error()` (always granted) |
| **Read-Only Message Fetching** | **None (`[]`)** | `fetch` capability is always granted |
| **Persistent Storage** | **`"state"`** | Module-isolated SQLite key-value database (`ctx.state`) |
| **Internet & Web Requests** | **`"net"`** | Outbound HTTP/HTTPS, WebSocket, and streaming (`ctx.net`, `ctx.stream`) with SSRF firewall |
| **Sandboxed Filesystem** | **`"files"`** | File read/write inside the module's tmpfs workspace directory (`ctx.files`) |
| **Sandboxed Shell Execution** | **`"shell"`** | Running shell commands in workspace namespace jail (`ctx.shell`) |
| **Inline Bot Gateway** | **`"inline"`** | Querying and forwarding results from external Telegram inline bots (`ctx.inline`) |
| **Module Management** | **`"modules"`** | Managing other modules: load, unload, reload, inspect (`ctx.modules`) |
| **Encrypted Asset Storage** | **`"assets"`** | Hidden assets storage and file downloads (`ctx.assets`, `ctx.download_file`) |
| **Raw Telegram MTProto RPC** | **`"mt"`** | **ONLY for direct raw calls** via `await ctx.tg.call(method, kwargs)`, `await ctx.tg.send(...)`, `await ctx.cap("mt", ...)`, or `await mt(...)`. |

> [!IMPORTANT]
> **The `mt` capability is NOT needed for the 292 extended MTProto methods on `ctx`!**
> The 292 extended methods on `ctx` (e.g. `ctx.block_peer`, `ctx.send_message`, `ctx.channel_details`, `ctx.post_story`) work out of the box with zero permissions. You only need `"capabilities": ["mt"]` when making raw, direct MTProto calls via `ctx.tg.call("some.method", { ... })`.

## 5. Daemon Subsystem: 29 Supported Init Systems (`hotaru/daemon.py`)

Hotaru includes built-in auto-detection and service registration for 29 distinct init systems and process supervisors. This enables Hotaru to operate as a native background daemon across virtually any Linux, BSD, Android (Termux), or macOS environment.

| ID | Init System | Detection Mechanism | Status Command | Unit / Service Location |
|---|---|---|---|---|
| `termux-services` | Termux Services | `$PREFIX/var/service` | `sv status hotaru` | `$PREFIX/var/service/hotaru/run` |
| `termux-boot` | Termux Boot | `~/.termux/boot` directory | `ps -ef \| grep hotaru` | `~/.termux/boot/start-hotaru` |
| `systemd` | Systemd (Linux) | `systemctl`, `/run/systemd/system` | `systemctl status hotaru` | `/etc/systemd/system/hotaru.service` |
| `dinit` | Dinit (Void/Artix/Chimera) | `dinitctl`, `/etc/dinit.d` | `dinitctl status hotaru` | `/etc/dinit.d/hotaru` |
| `openrc` | OpenRC (Alpine/Gentoo) | `rc-service`, `/etc/init.d` | `rc-service hotaru status` | `/etc/init.d/hotaru` |
| `runit` | Runit (Void/Artix) | `sv`, `/etc/service` | `sv status hotaru` | `/etc/sv/hotaru/run` |
| `s6` | S6 Supervision Suite | `s6-rc`, `s6-svc` | `s6-svstat /run/service/hotaru` | `/etc/s6/sv/hotaru/run` |
| `66` | Obarun 66 Suite | `66-info`, `66-enable` | `66-info hotaru` | `/etc/66/service/hotaru` |
| `launchd` | macOS Launchd | Darwin kernel, `launchctl` | `launchctl list hotaru` | `~/Library/LaunchAgents/hotaru.plist` |
| `procd` | OpenWrt Procd | `/etc/init.d/rc.common` | `/etc/init.d/hotaru status` | `/etc/init.d/hotaru` |
| `sysvinit` | SysV Init (Debian/CentOS 6) | `/etc/init.d` | `service hotaru status` | `/etc/init.d/hotaru` |
| `upstart` | Ubuntu Upstart | `/etc/init`, `initctl` | `initctl status hotaru` | `/etc/init/hotaru.conf` |
| `shepherd` | GNU Guix Shepherd | `herd`, `/etc/shepherd` | `herd status hotaru` | `/etc/shepherd.d/hotaru.scm` |
| `supervisord` | Python Supervisor | `supervisorctl` | `supervisorctl status hotaru`| `/etc/supervisor/conf.d/hotaru.conf` |
| `circus` | Mozilla Circus | `circusctl` | `circusctl status hotaru` | `/etc/circus.d/hotaru.ini` |
| `monit` | Monit System Monitor | `monit`, `/etc/monit` | `monit status hotaru` | `/etc/monit/conf.d/hotaru` |
| `pm2` | PM2 Process Manager | `pm2` CLI | `pm2 status hotaru` | `~/.pm2/dump.pm2` |
| `god` | God Process Monitor | `god` CLI | `god status hotaru` | `/etc/god/hotaru.god` |
| `daemontools` | DJB Daemontools | `supervise`, `svc` | `svstat /service/hotaru` | `/service/hotaru/run` |
| `perp` | Perp Supervision | `perpctls`, `perpmon` | `perptab hotaru` | `/etc/perp/hotaru/rc.main` |
| `finit` | Fast Init for Linux | `/etc/finit.d` | `initctl status hotaru` | `/etc/finit.d/hotaru.conf` |
| `busybox-init` | BusyBox Init | `/etc/inittab` | `ps \| grep hotaru` | `/etc/inittab` |
| `minit` | Minit Minimal Init | `minit`, `/etc/minit` | `msvc -u hotaru` | `/etc/minit/hotaru/run` |
| `cinit` | Cinit Init System | `/etc/cinit` | `cinit status hotaru` | `/etc/cinit/services/hotaru` |
| `smf` | Solaris / Illumos SMF | `svcs`, `svcadm` | `svcs hotaru` | `/var/svc/manifest/site/hotaru.xml` |
| `nosh` | Nosh System Manager | `system-control` | `system-control is-active hotaru`| `/etc/service-bundles/services/hotaru` |
| `bsd-rc` | FreeBSD / NetBSD rc | `/etc/rc.d` | `service hotaru status` | `/usr/local/etc/rc.d/hotaru` |
| `openbsd-rc` | OpenBSD rc.d | `/etc/rc.d/rc.subr` | `/etc/rc.d/hotaru check` | `/etc/rc.d/hotaru` |
| `simple-daemon` | POSIX Forking Daemon | Standard POSIX OS | `kill -0 $(cat hotaru.pid)` | `sanctuary/hotaru.pid` |

### Interacting with the Daemon from Python

```python
from hotaru.daemon import detect_init_system, install_daemon, daemon_status, uninstall_daemon

# Auto-detect the running init system on the current host
init = detect_init_system()
print(f'Detected Init System: {init.name} ({init.id})')
print(f'Check Status Command: {init.status_command()}')

# Install and enable background service
result = install_daemon()
print(result.message)

# Query live status
status = daemon_status()
print(f'Installed: {status.installed}, Running: {status.running}, PID: {status.pid}')
```

## 6. ModuleContext API & Everyday Methods (`hotaru/response.py`)

Every handler coroutine receives an instance of `ModuleContext` (`ctx`). Below is the complete catalog of everyday methods:

### Text Messaging Operations

• `await ctx.respond(text, parse_mode='html')`: Edits the message if sent by userbot, or sends a reply if sent by another user.
• `await ctx.reply(text, parse_mode='html')`: Sends a new reply to the triggering message.
• `await ctx.edit(text, parse_mode='html')`: Edits the triggering message in place.
• `await ctx.delete(revoke=True)`: Deletes the triggering message (for all participants if revoke=True).
• `await ctx.react(emoji)`: Places native emoji reaction on the triggering message (`👍`, `❤️`, `🔥`, etc.).
• `await ctx.pin(silent=False)`: Pins the triggering message in the chat.
• `await ctx.unpin()`: Unpins the message.
• `await ctx.forward_to(peer_id)`: Forwards the message with forward attribution.
• `await ctx.copy_to(peer_id)`: Copies the message without forward headers.
• `await ctx.save()`: Forwards the message to your personal Saved Messages chat.
• `await ctx.typing(action='typing')`: Broadcasts action indicator (`typing`, `upload_photo`, `record_video`, `upload_document`).

### Media Uploading & Downloading

• `await ctx.reply_photo(photo, caption='')`: Sends photo from bytes, file path, or URL.
• `await ctx.reply_file(file, filename='doc.txt', caption='')`: Sends a document file.
• `await ctx.reply_video(video, caption='', supports_streaming=True)`: Sends an MP4 video.
• `await ctx.reply_audio(audio, title='', performer='', caption='')`: Sends an audio file with ID3 tags.
• `await ctx.reply_voice(opus_bytes)`: Sends an audio voice note in OGG Opus format.
• `await ctx.reply_animation(gif_bytes)`: Sends an animated GIF or silent MP4 video.
• `await ctx.reply_dice(emoji='🎲')`: Sends native animated dice (`🎲`, `🎯`, `🏀`, `⚽`, `🎰`, `🎳`).
• `bytes_data = await ctx.download(attachment)`: Downloads any attached media into memory bytes.

### Persistent State (`ctx.state`)

• `await ctx.state.get(key, default=None)`: Retrieves value from module SQLite database.
• `await ctx.state.set(key, value)`: Stores any JSON-serializable value (`dict`, `list`, `int`, `str`, `bool`).
• `await ctx.state.delete(key)`: Deletes key from storage.
• `await ctx.state.clear()`: Wipes all keys for this module.
• `await ctx.state.all()`: Returns dictionary of all stored key-value pairs.

### Sandboxed Network (`ctx.net` & `ctx.stream`)

• `await ctx.net(url, method='GET', headers=None, json=None, data=None, timeout=15)`: Issues TLS-guarded HTTP request.
• `async for chunk in ctx.stream(url, chunk_size=8192)`: Streams large files asynchronously in chunks.

### Interactive Screens (`ctx.screens`)

• `await ctx.screens.show(title, body, buttons)`: Displays or updates an interactive Telegram screen.
• `ctx.screens.button(text, callback)`: Neutral button.
• `ctx.screens.primary(text, callback)`: Accent button.
• `ctx.screens.danger(text, callback)`: Red destructive action button.
• `ctx.screens.success(text, callback)`: Green confirmation button.
• `ctx.screens.close()`: Dismiss button.
• `ctx.screens.pager(current, total, callback)`: Pagination navigation component.
• `ctx.screens.table(headers, rows)`: Formatted monospaced ASCII table generator.

## 7. Exhaustive Reference: All 292 MTProto RPC Methods on `ctx`

Hotaru exposes 292 built-in Telegram methods directly on `ctx`. **Crucially, these 292 methods do NOT require the `'mt'` capability!** They work out of the box in any module with `capabilities: []`. Default arguments are automatically filled in when omitted (`$peer` -> current chat, `$message` -> current message, `$self` -> userbot account ID).

The `'mt'` capability is strictly reserved for rare, raw low-level Telegram API calls made via `await ctx.tg.call(method, kwargs)` or `await mt(...)`.

Below is the complete indexed reference of every method:

### 1. `ctx.set_checklist_completed`
- **MTProto RPC**: `messages.toggleTodoCompleted`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_checklist_completed(peer: InputPeer, msg_id: int, completed: Vector<int>, incompleted: Vector<int>)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.toggleTodoCompleted. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleTodoCompleted. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)
  • `completed` (Vector<int>, Required)
  • `incompleted` (Vector<int>, Required)

### 2. `ctx.add_poll_answer`
- **MTProto RPC**: `messages.addPollAnswer`
- **Namespace**: `messages`
- **Signature**: `await ctx.add_poll_answer(peer: InputPeer, msg_id: int, answer: PollAnswer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.addPollAnswer. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.addPollAnswer. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)
  • `answer` (PollAnswer, Required)

### 3. `ctx.remove_poll_answer`
- **MTProto RPC**: `messages.deletePollAnswer`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_poll_answer(peer: InputPeer, msg_id: int, option: bytes)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deletePollAnswer. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deletePollAnswer. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)
  • `option` (bytes, Required)

### 4. `ctx.unread_poll_votes`
- **MTProto RPC**: `messages.getUnreadPollVotes`
- **Namespace**: `messages`
- **Signature**: `await ctx.unread_poll_votes(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getUnreadPollVotes. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getUnreadPollVotes. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)
  • `offset_id` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)

### 5. `ctx.mark_poll_votes_read`
- **MTProto RPC**: `messages.readPollVotes`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_poll_votes_read(peer: InputPeer, top_msg_id: flags.0?int = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readPollVotes. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readPollVotes. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)

### 6. `ctx.poll_statistics`
- **MTProto RPC**: `stats.getPollStats`
- **Namespace**: `stats`
- **Signature**: `await ctx.poll_statistics(dark: flags.0?true = None, peer: InputPeer, msg_id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getPollStats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getPollStats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `dark` (flags.0?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)

### 7. `ctx.scheduled_messages`
- **MTProto RPC**: `messages.getScheduledHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.scheduled_messages(peer: InputPeer, hash: long)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.getScheduledHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getScheduledHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `hash` (long, Required) (default: `0`)

### 8. `ctx.scheduled_by_ids`
- **MTProto RPC**: `messages.getScheduledMessages`
- **Namespace**: `messages`
- **Signature**: `await ctx.scheduled_by_ids(peer: InputPeer, id: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getScheduledMessages. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getScheduledMessages. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (Vector<int>, Required)

### 9. `ctx.publish_scheduled`
- **MTProto RPC**: `messages.sendScheduledMessages`
- **Namespace**: `messages`
- **Signature**: `await ctx.publish_scheduled(peer: InputPeer, id: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.sendScheduledMessages. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.sendScheduledMessages. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (Vector<int>, Required)

### 10. `ctx.cancel_scheduled`
- **MTProto RPC**: `messages.deleteScheduledMessages`
- **Namespace**: `messages`
- **Signature**: `await ctx.cancel_scheduled(peer: InputPeer, id: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.deleteScheduledMessages. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteScheduledMessages. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (Vector<int>, Required)

### 11. `ctx.configure_chat_reactions`
- **MTProto RPC**: `messages.setChatAvailableReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.configure_chat_reactions(peer: InputPeer, available_reactions: ChatReactions, reactions_limit: flags.0?int = None, paid_enabled: flags.1?Bool = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.setChatAvailableReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.setChatAvailableReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `available_reactions` (ChatReactions, Required)
  • `reactions_limit` (flags.0?int, Optional)
  • `paid_enabled` (flags.1?Bool, Optional)

### 12. `ctx.available_reactions`
- **MTProto RPC**: `messages.getAvailableReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.available_reactions(hash: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getAvailableReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getAvailableReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (int, Required) (default: `0`)

### 13. `ctx.set_default_reaction`
- **MTProto RPC**: `messages.setDefaultReaction`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_default_reaction(reaction: Reaction)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.setDefaultReaction. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.setDefaultReaction. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `reaction` (Reaction, Required)

### 14. `ctx.unread_reactions`
- **MTProto RPC**: `messages.getUnreadReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.unread_reactions(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getUnreadReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getUnreadReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)
  • `saved_peer_id` (flags.1?InputPeer, Optional)
  • `offset_id` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)

### 15. `ctx.mark_reactions_read`
- **MTProto RPC**: `messages.readReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_reactions_read(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)
  • `saved_peer_id` (flags.1?InputPeer, Optional)

### 16. `ctx.popular_reactions`
- **MTProto RPC**: `messages.getTopReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.popular_reactions(limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getTopReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getTopReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 17. `ctx.recent_reactions`
- **MTProto RPC**: `messages.getRecentReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.recent_reactions(limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getRecentReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getRecentReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 18. `ctx.clear_recent_reactions`
- **MTProto RPC**: `messages.clearRecentReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.clear_recent_reactions()`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.clearRecentReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.clearRecentReactions. Передает параметры и возвращает типизированный ответ.

### 19. `ctx.remove_member_reactions`
- **MTProto RPC**: `messages.deleteParticipantReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_member_reactions(peer: InputPeer, participant: InputPeer)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteParticipantReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteParticipantReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `participant` (InputPeer, Required)

### 20. `ctx.remove_member_message_reaction`
- **MTProto RPC**: `messages.deleteParticipantReaction`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_member_message_reaction(peer: InputPeer, msg_id: int, participant: InputPeer)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteParticipantReaction. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteParticipantReaction. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)
  • `participant` (InputPeer, Required)

### 21. `ctx.saved_dialogs`
- **MTProto RPC**: `messages.getSavedDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.saved_dialogs(exclude_pinned: flags.0?true = None, parent_peer: flags.1?InputPeer = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSavedDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSavedDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `exclude_pinned` (flags.0?true, Optional)
  • `parent_peer` (flags.1?InputPeer, Optional)
  • `offset_date` (int, Required) (default: `0`)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_peer` (InputPeer, Required) (default: `{'_': 'inputPeerEmpty'}`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 22. `ctx.saved_history`
- **MTProto RPC**: `messages.getSavedHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSavedHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSavedHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `parent_peer` (flags.0?InputPeer, Optional)
  • `peer` (InputPeer, Required)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_date` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)
  • `hash` (long, Required) (default: `0`)

### 23. `ctx.clear_saved_history`
- **MTProto RPC**: `messages.deleteSavedHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.clear_saved_history(parent_peer: flags.0?InputPeer = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteSavedHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteSavedHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `parent_peer` (flags.0?InputPeer, Optional)
  • `peer` (InputPeer, Required)
  • `max_id` (int, Required)
  • `min_date` (flags.2?int, Optional)
  • `max_date` (flags.3?int, Optional)

### 24. `ctx.pinned_saved_dialogs`
- **MTProto RPC**: `messages.getPinnedSavedDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.pinned_saved_dialogs()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getPinnedSavedDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getPinnedSavedDialogs. Передает параметры и возвращает типизированный ответ.

### 25. `ctx.set_saved_dialog_pinned`
- **MTProto RPC**: `messages.toggleSavedDialogPin`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_saved_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.toggleSavedDialogPin. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleSavedDialogPin. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `pinned` (flags.0?true, Optional)
  • `peer` (InputDialogPeer, Required)

### 26. `ctx.reorder_saved_pins`
- **MTProto RPC**: `messages.reorderPinnedSavedDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.reorder_saved_pins(force: flags.0?true = None, order: Vector<InputDialogPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.reorderPinnedSavedDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.reorderPinnedSavedDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `force` (flags.0?true, Optional)
  • `order` (Vector<InputDialogPeer>, Required)

### 27. `ctx.saved_reaction_tags`
- **MTProto RPC**: `messages.getSavedReactionTags`
- **Namespace**: `messages`
- **Signature**: `await ctx.saved_reaction_tags(peer: flags.0?InputPeer = None, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSavedReactionTags. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSavedReactionTags. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (flags.0?InputPeer, Optional)
  • `hash` (long, Required) (default: `0`)

### 28. `ctx.rename_saved_tag`
- **MTProto RPC**: `messages.updateSavedReactionTag`
- **Namespace**: `messages`
- **Signature**: `await ctx.rename_saved_tag(reaction: Reaction, title: flags.0?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.updateSavedReactionTag. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.updateSavedReactionTag. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `reaction` (Reaction, Required)
  • `title` (flags.0?string, Optional)

### 29. `ctx.suggested_saved_tags`
- **MTProto RPC**: `messages.getDefaultTagReactions`
- **Namespace**: `messages`
- **Signature**: `await ctx.suggested_saved_tags(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getDefaultTagReactions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getDefaultTagReactions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 30. `ctx.saved_dialogs_by_peers`
- **MTProto RPC**: `messages.getSavedDialogsByID`
- **Namespace**: `messages`
- **Signature**: `await ctx.saved_dialogs_by_peers(parent_peer: flags.1?InputPeer = None, ids: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSavedDialogsByID. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSavedDialogsByID. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `parent_peer` (flags.1?InputPeer, Optional)
  • `ids` (Vector<InputPeer>, Required)

### 31. `ctx.mark_saved_history_read`
- **MTProto RPC**: `messages.readSavedHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_saved_history_read(parent_peer: InputPeer, peer: InputPeer, max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readSavedHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readSavedHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `parent_peer` (InputPeer, Required)
  • `peer` (InputPeer, Required)
  • `max_id` (int, Required)

### 32. `ctx.forum_topics`
- **MTProto RPC**: `messages.getForumTopics`
- **Namespace**: `messages`
- **Signature**: `await ctx.forum_topics(peer: InputPeer, q: flags.0?string = None, offset_date: int, offset_id: int, offset_topic: int, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.getForumTopics. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getForumTopics. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `q` (flags.0?string, Optional)
  • `offset_date` (int, Required) (default: `0`)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_topic` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 33. `ctx.forum_topics_by_ids`
- **MTProto RPC**: `messages.getForumTopicsByID`
- **Namespace**: `messages`
- **Signature**: `await ctx.forum_topics_by_ids(peer: InputPeer, topics: Vector<int>)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.getForumTopicsByID. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getForumTopicsByID. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `topics` (Vector<int>, Required)

### 34. `ctx.edit_forum_topic`
- **MTProto RPC**: `messages.editForumTopic`
- **Namespace**: `messages`
- **Signature**: `await ctx.edit_forum_topic(peer: InputPeer, topic_id: int, title: flags.0?string = None, icon_emoji_id: flags.1?long = None, closed: flags.2?Bool = None, hidden: flags.3?Bool = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editForumTopic. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editForumTopic. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `topic_id` (int, Required)
  • `title` (flags.0?string, Optional)
  • `icon_emoji_id` (flags.1?long, Optional)
  • `closed` (flags.2?Bool, Optional)
  • `hidden` (flags.3?Bool, Optional)

### 35. `ctx.set_forum_topic_pinned`
- **MTProto RPC**: `messages.updatePinnedForumTopic`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_forum_topic_pinned(peer: InputPeer, topic_id: int, pinned: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.updatePinnedForumTopic. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.updatePinnedForumTopic. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `topic_id` (int, Required)
  • `pinned` (Bool, Required)

### 36. `ctx.reorder_forum_pins`
- **MTProto RPC**: `messages.reorderPinnedForumTopics`
- **Namespace**: `messages`
- **Signature**: `await ctx.reorder_forum_pins(force: flags.0?true = None, peer: InputPeer, order: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.reorderPinnedForumTopics. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.reorderPinnedForumTopics. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `force` (flags.0?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `order` (Vector<int>, Required)

### 37. `ctx.create_forum_topic`
- **MTProto RPC**: `messages.createForumTopic`
- **Namespace**: `messages`
- **Signature**: `await ctx.create_forum_topic(title_missing: flags.4?true = None, peer: InputPeer, title: string, icon_color: flags.0?int = None, icon_emoji_id: flags.3?long = None, random_id: long, send_as: flags.2?InputPeer = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.createForumTopic. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.createForumTopic. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `title_missing` (flags.4?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `title` (string, Required)
  • `icon_color` (flags.0?int, Optional)
  • `icon_emoji_id` (flags.3?long, Optional)
  • `random_id` (long, Required) (default: `$random`)
  • `send_as` (flags.2?InputPeer, Optional)

### 38. `ctx.remove_forum_topic`
- **MTProto RPC**: `messages.deleteTopicHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_forum_topic(peer: InputPeer, top_msg_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteTopicHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteTopicHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (int, Required)

### 39. `ctx.set_forum_enabled`
- **MTProto RPC**: `channels.toggleForum`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_forum_enabled(channel: InputChannel, enabled: Bool, tabs: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleForum. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleForum. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)
  • `tabs` (Bool, Required)

### 40. `ctx.set_forum_message_view`
- **MTProto RPC**: `channels.toggleViewForumAsMessages`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_forum_message_view(channel: InputChannel, enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleViewForumAsMessages. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleViewForumAsMessages. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 41. `ctx.story_posting_quota`
- **MTProto RPC**: `stories.canSendStory`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_posting_quota(peer: InputPeer)`
- **Returns**: `int`
- **Description**: Calls Telegram stories.canSendStory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.canSendStory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)

### 42. `ctx.post_story`
- **MTProto RPC**: `stories.sendStory`
- **Namespace**: `stories`
- **Signature**: `await ctx.post_story(pinned: flags.2?true = None, noforwards: flags.4?true = None, fwd_modified: flags.7?true = None, peer: InputPeer, media: InputMedia, media_areas: flags.5?Vector<MediaArea> = None, caption: flags.0?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: Vector<InputPrivacyRule>, random_id: long, period: flags.3?int = None, fwd_from_id: flags.6?InputPeer = None, fwd_from_story: flags.6?int = None, albums: flags.8?Vector<int> = None, music: flags.9?InputDocument = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.sendStory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.sendStory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `pinned` (flags.2?true, Optional)
  • `noforwards` (flags.4?true, Optional)
  • `fwd_modified` (flags.7?true, Optional)
  • `peer` (InputPeer, Required)
  • `media` (InputMedia, Required)
  • `media_areas` (flags.5?Vector<MediaArea>, Optional)
  • `caption` (flags.0?string, Optional)
  • `entities` (flags.1?Vector<MessageEntity>, Optional)
  • `privacy_rules` (Vector<InputPrivacyRule>, Required)
  • `random_id` (long, Required) (default: `$random`)
  • `period` (flags.3?int, Optional)
  • `fwd_from_id` (flags.6?InputPeer, Optional)
  • `fwd_from_story` (flags.6?int, Optional)
  • `albums` (flags.8?Vector<int>, Optional)
  • `music` (flags.9?InputDocument, Optional)

### 43. `ctx.edit_story`
- **MTProto RPC**: `stories.editStory`
- **Namespace**: `stories`
- **Signature**: `await ctx.edit_story(peer: InputPeer, id: int, media: flags.0?InputMedia = None, media_areas: flags.3?Vector<MediaArea> = None, caption: flags.1?string = None, entities: flags.1?Vector<MessageEntity> = None, privacy_rules: flags.2?Vector<InputPrivacyRule> = None, music: flags.4?InputDocument = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.editStory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.editStory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (int, Required)
  • `media` (flags.0?InputMedia, Optional)
  • `media_areas` (flags.3?Vector<MediaArea>, Optional)
  • `caption` (flags.1?string, Optional)
  • `entities` (flags.1?Vector<MessageEntity>, Optional)
  • `privacy_rules` (flags.2?Vector<InputPrivacyRule>, Optional)
  • `music` (flags.4?InputDocument, Optional)

### 44. `ctx.delete_stories`
- **MTProto RPC**: `stories.deleteStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.delete_stories(peer: InputPeer, id: Vector<int>)`
- **Returns**: `bool`
- **Description**: Calls Telegram stories.deleteStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.deleteStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (Vector<int>, Required)

### 45. `ctx.set_stories_on_profile`
- **MTProto RPC**: `stories.togglePinned`
- **Namespace**: `stories`
- **Signature**: `await ctx.set_stories_on_profile(peer: InputPeer, id: Vector<int>, pinned: Bool)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.togglePinned. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.togglePinned. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (Vector<int>, Required)
  • `pinned` (Bool, Required)

### 46. `ctx.story_feed`
- **MTProto RPC**: `stories.getAllStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_feed(next: flags.1?true = None, hidden: flags.2?true = None, state: flags.0?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getAllStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getAllStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `next` (flags.1?true, Optional)
  • `hidden` (flags.2?true, Optional)
  • `state` (flags.0?string, Optional)

### 47. `ctx.profile_stories`
- **MTProto RPC**: `stories.getPinnedStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.profile_stories(peer: InputPeer, offset_id: int, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.getPinnedStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getPinnedStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `offset_id` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 48. `ctx.archived_stories`
- **MTProto RPC**: `stories.getStoriesArchive`
- **Namespace**: `stories`
- **Signature**: `await ctx.archived_stories(peer: InputPeer, offset_id: int, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.getStoriesArchive. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getStoriesArchive. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `offset_id` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 49. `ctx.stories_by_ids`
- **MTProto RPC**: `stories.getStoriesByID`
- **Namespace**: `stories`
- **Signature**: `await ctx.stories_by_ids(peer: InputPeer, id: Vector<int>)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.getStoriesByID. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getStoriesByID. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (Vector<int>, Required)

### 50. `ctx.mark_stories_read`
- **MTProto RPC**: `stories.readStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.mark_stories_read(peer: InputPeer, max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram stories.readStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.readStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `max_id` (int, Required) (default: `0`)

### 51. `ctx.story_viewers`
- **MTProto RPC**: `stories.getStoryViewsList`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_viewers(just_contacts: flags.0?true = None, reactions_first: flags.2?true = None, forwards_first: flags.3?true = None, peer: InputPeer, q: flags.1?string = None, id: int, offset: string, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getStoryViewsList. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getStoryViewsList. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `just_contacts` (flags.0?true, Optional)
  • `reactions_first` (flags.2?true, Optional)
  • `forwards_first` (flags.3?true, Optional)
  • `peer` (InputPeer, Required)
  • `q` (flags.1?string, Optional)
  • `id` (int, Required)
  • `offset` (string, Required) (default: ``)
  • `limit` (int, Required) (default: `50`)

### 52. `ctx.story_view_counts`
- **MTProto RPC**: `stories.getStoriesViews`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_view_counts(peer: InputPeer, id: Vector<int>)`
- **Returns**: `int`
- **Description**: Calls Telegram stories.getStoriesViews. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getStoriesViews. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (Vector<int>, Required)

### 53. `ctx.story_link`
- **MTProto RPC**: `stories.exportStoryLink`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_link(peer: InputPeer, id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.exportStoryLink. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.exportStoryLink. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (int, Required)

### 54. `ctx.activate_story_stealth`
- **MTProto RPC**: `stories.activateStealthMode`
- **Namespace**: `stories`
- **Signature**: `await ctx.activate_story_stealth(past: flags.0?true = None, future: flags.1?true = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.activateStealthMode. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.activateStealthMode. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `past` (flags.0?true, Optional)
  • `future` (flags.1?true, Optional)

### 55. `ctx.react_to_story`
- **MTProto RPC**: `stories.sendReaction`
- **Namespace**: `stories`
- **Signature**: `await ctx.react_to_story(add_to_recent: flags.0?true = None, peer: InputPeer, story_id: int, reaction: Reaction)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.sendReaction. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.sendReaction. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `add_to_recent` (flags.0?true, Optional)
  • `peer` (InputPeer, Required)
  • `story_id` (int, Required)
  • `reaction` (Reaction, Required)

### 56. `ctx.peer_stories`
- **MTProto RPC**: `stories.getPeerStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.peer_stories(peer: InputPeer)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.getPeerStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getPeerStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)

### 57. `ctx.story_read_markers`
- **MTProto RPC**: `stories.getAllReadPeerStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_read_markers()`
- **Returns**: `bool`
- **Description**: Calls Telegram stories.getAllReadPeerStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getAllReadPeerStories. Передает параметры и возвращает типизированный ответ.

### 58. `ctx.peer_latest_story_ids`
- **MTProto RPC**: `stories.getPeerMaxIDs`
- **Namespace**: `stories`
- **Signature**: `await ctx.peer_latest_story_ids(id: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getPeerMaxIDs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getPeerMaxIDs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<InputPeer>, Required)

### 59. `ctx.story_posting_chats`
- **MTProto RPC**: `stories.getChatsToSend`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_posting_chats()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getChatsToSend. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getChatsToSend. Передает параметры и возвращает типизированный ответ.

### 60. `ctx.set_peer_stories_hidden`
- **MTProto RPC**: `stories.togglePeerStoriesHidden`
- **Namespace**: `stories`
- **Signature**: `await ctx.set_peer_stories_hidden(peer: InputPeer, hidden: Bool)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.togglePeerStoriesHidden. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.togglePeerStoriesHidden. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `hidden` (Bool, Required)

### 61. `ctx.story_reaction_senders`
- **MTProto RPC**: `stories.getStoryReactionsList`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_reaction_senders(forwards_first: flags.2?true = None, peer: InputPeer, id: int, reaction: flags.0?Reaction = None, offset: flags.1?string = None, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getStoryReactionsList. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getStoryReactionsList. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `forwards_first` (flags.2?true, Optional)
  • `peer` (InputPeer, Required)
  • `id` (int, Required)
  • `reaction` (flags.0?Reaction, Optional)
  • `offset` (flags.1?string, Optional)
  • `limit` (int, Required) (default: `50`)

### 62. `ctx.reorder_profile_story_pins`
- **MTProto RPC**: `stories.togglePinnedToTop`
- **Namespace**: `stories`
- **Signature**: `await ctx.reorder_profile_story_pins(peer: InputPeer, id: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.togglePinnedToTop. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.togglePinnedToTop. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `id` (Vector<int>, Required)

### 63. `ctx.search_stories`
- **MTProto RPC**: `stories.searchPosts`
- **Namespace**: `stories`
- **Signature**: `await ctx.search_stories(hashtag: flags.0?string = None, area: flags.1?MediaArea = None, peer: flags.2?InputPeer = None, offset: string, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.searchPosts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.searchPosts. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hashtag` (flags.0?string, Optional)
  • `area` (flags.1?MediaArea, Optional)
  • `peer` (flags.2?InputPeer, Optional)
  • `offset` (string, Required) (default: ``)
  • `limit` (int, Required) (default: `50`)

### 64. `ctx.create_story_album`
- **MTProto RPC**: `stories.createAlbum`
- **Namespace**: `stories`
- **Signature**: `await ctx.create_story_album(peer: InputPeer, title: string, stories: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.createAlbum. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.createAlbum. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `title` (string, Required)
  • `stories` (Vector<int>, Required)

### 65. `ctx.edit_story_album`
- **MTProto RPC**: `stories.updateAlbum`
- **Namespace**: `stories`
- **Signature**: `await ctx.edit_story_album(peer: InputPeer, album_id: int, title: flags.0?string = None, delete_stories: flags.1?Vector<int> = None, add_stories: flags.2?Vector<int> = None, order: flags.3?Vector<int> = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.updateAlbum. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.updateAlbum. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `album_id` (int, Required)
  • `title` (flags.0?string, Optional)
  • `delete_stories` (flags.1?Vector<int>, Optional)
  • `add_stories` (flags.2?Vector<int>, Optional)
  • `order` (flags.3?Vector<int>, Optional)

### 66. `ctx.reorder_story_albums`
- **MTProto RPC**: `stories.reorderAlbums`
- **Namespace**: `stories`
- **Signature**: `await ctx.reorder_story_albums(peer: InputPeer, order: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.reorderAlbums. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.reorderAlbums. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `order` (Vector<int>, Required)

### 67. `ctx.remove_story_album`
- **MTProto RPC**: `stories.deleteAlbum`
- **Namespace**: `stories`
- **Signature**: `await ctx.remove_story_album(peer: InputPeer, album_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram stories.deleteAlbum. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.deleteAlbum. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `album_id` (int, Required)

### 68. `ctx.story_albums`
- **MTProto RPC**: `stories.getAlbums`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_albums(peer: InputPeer, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stories.getAlbums. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getAlbums. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `hash` (long, Required) (default: `0`)

### 69. `ctx.story_album_items`
- **MTProto RPC**: `stories.getAlbumStories`
- **Namespace**: `stories`
- **Signature**: `await ctx.story_album_items(peer: InputPeer, album_id: int, offset: int, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram stories.getAlbumStories. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stories.getAlbumStories. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required)
  • `album_id` (int, Required)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 70. `ctx.stickers_for_emoji`
- **MTProto RPC**: `messages.getStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.stickers_for_emoji(emoticon: string, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `emoticon` (string, Required)
  • `hash` (long, Required) (default: `0`)

### 71. `ctx.installed_sticker_sets`
- **MTProto RPC**: `messages.getAllStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.installed_sticker_sets(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getAllStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getAllStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 72. `ctx.sticker_set`
- **MTProto RPC**: `messages.getStickerSet`
- **Namespace**: `messages`
- **Signature**: `await ctx.sticker_set(stickerset: InputStickerSet, hash: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)
  • `hash` (int, Required) (default: `0`)

### 73. `ctx.install_sticker_set`
- **MTProto RPC**: `messages.installStickerSet`
- **Namespace**: `messages`
- **Signature**: `await ctx.install_sticker_set(stickerset: InputStickerSet, archived: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.installStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.installStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)
  • `archived` (Bool, Required) (default: `False`)

### 74. `ctx.uninstall_sticker_set`
- **MTProto RPC**: `messages.uninstallStickerSet`
- **Namespace**: `messages`
- **Signature**: `await ctx.uninstall_sticker_set(stickerset: InputStickerSet)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.uninstallStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.uninstallStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)

### 75. `ctx.reorder_sticker_sets`
- **MTProto RPC**: `messages.reorderStickerSets`
- **Namespace**: `messages`
- **Signature**: `await ctx.reorder_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, order: Vector<long>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.reorderStickerSets. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.reorderStickerSets. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `masks` (flags.0?true, Optional)
  • `emojis` (flags.1?true, Optional)
  • `order` (Vector<long>, Required)

### 76. `ctx.saved_gifs`
- **MTProto RPC**: `messages.getSavedGifs`
- **Namespace**: `messages`
- **Signature**: `await ctx.saved_gifs(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSavedGifs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSavedGifs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 77. `ctx.set_gif_saved`
- **MTProto RPC**: `messages.saveGif`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_gif_saved(id: InputDocument, unsave: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.saveGif. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.saveGif. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputDocument, Required)
  • `unsave` (Bool, Required)

### 78. `ctx.featured_sticker_sets`
- **MTProto RPC**: `messages.getFeaturedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.featured_sticker_sets(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getFeaturedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getFeaturedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 79. `ctx.mark_featured_stickers_seen`
- **MTProto RPC**: `messages.readFeaturedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_featured_stickers_seen(id: Vector<long>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.readFeaturedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readFeaturedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<long>, Required)

### 80. `ctx.recent_stickers`
- **MTProto RPC**: `messages.getRecentStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.recent_stickers(attached: flags.0?true = None, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getRecentStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getRecentStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `attached` (flags.0?true, Optional)
  • `hash` (long, Required) (default: `0`)

### 81. `ctx.set_sticker_recent`
- **MTProto RPC**: `messages.saveRecentSticker`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_sticker_recent(attached: flags.0?true = None, id: InputDocument, unsave: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.saveRecentSticker. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.saveRecentSticker. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `attached` (flags.0?true, Optional)
  • `id` (InputDocument, Required)
  • `unsave` (Bool, Required)

### 82. `ctx.clear_recent_stickers`
- **MTProto RPC**: `messages.clearRecentStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.clear_recent_stickers(attached: flags.0?true = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.clearRecentStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.clearRecentStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `attached` (flags.0?true, Optional)

### 83. `ctx.archived_sticker_sets`
- **MTProto RPC**: `messages.getArchivedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.archived_sticker_sets(masks: flags.0?true = None, emojis: flags.1?true = None, offset_id: long, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getArchivedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getArchivedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `masks` (flags.0?true, Optional)
  • `emojis` (flags.1?true, Optional)
  • `offset_id` (long, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 84. `ctx.installed_masks`
- **MTProto RPC**: `messages.getMaskStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.installed_masks(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getMaskStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getMaskStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 85. `ctx.media_sticker_sets`
- **MTProto RPC**: `messages.getAttachedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.media_sticker_sets(media: InputStickeredMedia)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getAttachedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getAttachedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `media` (InputStickeredMedia, Required)

### 86. `ctx.favorite_stickers`
- **MTProto RPC**: `messages.getFavedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.favorite_stickers(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getFavedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getFavedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 87. `ctx.set_sticker_favorite`
- **MTProto RPC**: `messages.faveSticker`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_sticker_favorite(id: InputDocument, unfave: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.faveSticker. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.faveSticker. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputDocument, Required)
  • `unfave` (Bool, Required)

### 88. `ctx.search_sticker_sets`
- **MTProto RPC**: `messages.searchStickerSets`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_sticker_sets(exclude_featured: flags.0?true = None, q: string, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.searchStickerSets. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchStickerSets. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `exclude_featured` (flags.0?true, Optional)
  • `q` (string, Required)
  • `hash` (long, Required) (default: `0`)

### 89. `ctx.bulk_sticker_set_action`
- **MTProto RPC**: `messages.toggleStickerSets`
- **Namespace**: `messages`
- **Signature**: `await ctx.bulk_sticker_set_action(uninstall: flags.0?true = None, archive: flags.1?true = None, unarchive: flags.2?true = None, stickersets: Vector<InputStickerSet>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.toggleStickerSets. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleStickerSets. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `uninstall` (flags.0?true, Optional)
  • `archive` (flags.1?true, Optional)
  • `unarchive` (flags.2?true, Optional)
  • `stickersets` (Vector<InputStickerSet>, Required)

### 90. `ctx.older_featured_sticker_sets`
- **MTProto RPC**: `messages.getOldFeaturedStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.older_featured_sticker_sets(offset: int, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getOldFeaturedStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getOldFeaturedStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 91. `ctx.custom_emoji_documents`
- **MTProto RPC**: `messages.getCustomEmojiDocuments`
- **Namespace**: `messages`
- **Signature**: `await ctx.custom_emoji_documents(document_id: Vector<long>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getCustomEmojiDocuments. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getCustomEmojiDocuments. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `document_id` (Vector<long>, Required)

### 92. `ctx.installed_emoji_sets`
- **MTProto RPC**: `messages.getEmojiStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.installed_emoji_sets(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getEmojiStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getEmojiStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 93. `ctx.featured_emoji_sets`
- **MTProto RPC**: `messages.getFeaturedEmojiStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.featured_emoji_sets(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getFeaturedEmojiStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getFeaturedEmojiStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 94. `ctx.search_custom_emoji`
- **MTProto RPC**: `messages.searchCustomEmoji`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_custom_emoji(emoticon: string, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.searchCustomEmoji. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchCustomEmoji. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `emoticon` (string, Required)
  • `hash` (long, Required) (default: `0`)

### 95. `ctx.search_emoji_sets`
- **MTProto RPC**: `messages.searchEmojiStickerSets`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_emoji_sets(exclude_featured: flags.0?true = None, q: string, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.searchEmojiStickerSets. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchEmojiStickerSets. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `exclude_featured` (flags.0?true, Optional)
  • `q` (string, Required)
  • `hash` (long, Required) (default: `0`)

### 96. `ctx.owned_sticker_sets`
- **MTProto RPC**: `messages.getMyStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.owned_sticker_sets(offset_id: long, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getMyStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getMyStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `offset_id` (long, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 97. `ctx.search_stickers`
- **MTProto RPC**: `messages.searchStickers`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_stickers(emojis: flags.0?true = None, q: string, emoticon: string, lang_code: Vector<string>, offset: int, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.searchStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `emojis` (flags.0?true, Optional)
  • `q` (string, Required)
  • `emoticon` (string, Required)
  • `lang_code` (Vector<string>, Required)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 98. `ctx.create_sticker_set`
- **MTProto RPC**: `stickers.createStickerSet`
- **Namespace**: `stickers`
- **Signature**: `await ctx.create_sticker_set(masks: flags.0?true = None, emojis: flags.5?true = None, text_color: flags.6?true = None, user_id: InputUser, title: string, short_name: string, thumb: flags.2?InputDocument = None, stickers: Vector<InputStickerSetItem>, software: flags.3?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.createStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.createStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `masks` (flags.0?true, Optional)
  • `emojis` (flags.5?true, Optional)
  • `text_color` (flags.6?true, Optional)
  • `user_id` (InputUser, Required)
  • `title` (string, Required)
  • `short_name` (string, Required)
  • `thumb` (flags.2?InputDocument, Optional)
  • `stickers` (Vector<InputStickerSetItem>, Required)
  • `software` (flags.3?string, Optional)

### 99. `ctx.remove_sticker`
- **MTProto RPC**: `stickers.removeStickerFromSet`
- **Namespace**: `stickers`
- **Signature**: `await ctx.remove_sticker(sticker: InputDocument)`
- **Returns**: `bool`
- **Description**: Calls Telegram stickers.removeStickerFromSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.removeStickerFromSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `sticker` (InputDocument, Required)

### 100. `ctx.move_sticker`
- **MTProto RPC**: `stickers.changeStickerPosition`
- **Namespace**: `stickers`
- **Signature**: `await ctx.move_sticker(sticker: InputDocument, position: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.changeStickerPosition. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.changeStickerPosition. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `sticker` (InputDocument, Required)
  • `position` (int, Required)

### 101. `ctx.add_sticker`
- **MTProto RPC**: `stickers.addStickerToSet`
- **Namespace**: `stickers`
- **Signature**: `await ctx.add_sticker(stickerset: InputStickerSet, sticker: InputStickerSetItem)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.addStickerToSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.addStickerToSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)
  • `sticker` (InputStickerSetItem, Required)

### 102. `ctx.set_sticker_set_thumbnail`
- **MTProto RPC**: `stickers.setStickerSetThumb`
- **Namespace**: `stickers`
- **Signature**: `await ctx.set_sticker_set_thumbnail(stickerset: InputStickerSet, thumb: flags.0?InputDocument = None, thumb_document_id: flags.1?long = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.setStickerSetThumb. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.setStickerSetThumb. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)
  • `thumb` (flags.0?InputDocument, Optional)
  • `thumb_document_id` (flags.1?long, Optional)

### 103. `ctx.check_sticker_set_name`
- **MTProto RPC**: `stickers.checkShortName`
- **Namespace**: `stickers`
- **Signature**: `await ctx.check_sticker_set_name(short_name: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.checkShortName. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.checkShortName. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `short_name` (string, Required)

### 104. `ctx.suggest_sticker_set_name`
- **MTProto RPC**: `stickers.suggestShortName`
- **Namespace**: `stickers`
- **Signature**: `await ctx.suggest_sticker_set_name(title: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.suggestShortName. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.suggestShortName. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `title` (string, Required)

### 105. `ctx.edit_sticker_metadata`
- **MTProto RPC**: `stickers.changeSticker`
- **Namespace**: `stickers`
- **Signature**: `await ctx.edit_sticker_metadata(sticker: InputDocument, emoji: flags.0?string = None, mask_coords: flags.1?MaskCoords = None, keywords: flags.2?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.changeSticker. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.changeSticker. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `sticker` (InputDocument, Required)
  • `emoji` (flags.0?string, Optional)
  • `mask_coords` (flags.1?MaskCoords, Optional)
  • `keywords` (flags.2?string, Optional)

### 106. `ctx.rename_sticker_set`
- **MTProto RPC**: `stickers.renameStickerSet`
- **Namespace**: `stickers`
- **Signature**: `await ctx.rename_sticker_set(stickerset: InputStickerSet, title: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.renameStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.renameStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)
  • `title` (string, Required)

### 107. `ctx.remove_sticker_set`
- **MTProto RPC**: `stickers.deleteStickerSet`
- **Namespace**: `stickers`
- **Signature**: `await ctx.remove_sticker_set(stickerset: InputStickerSet)`
- **Returns**: `bool`
- **Description**: Calls Telegram stickers.deleteStickerSet. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.deleteStickerSet. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `stickerset` (InputStickerSet, Required)

### 108. `ctx.replace_sticker`
- **MTProto RPC**: `stickers.replaceSticker`
- **Namespace**: `stickers`
- **Signature**: `await ctx.replace_sticker(sticker: InputDocument, new_sticker: InputStickerSetItem)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stickers.replaceSticker. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stickers.replaceSticker. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `sticker` (InputDocument, Required)
  • `new_sticker` (InputStickerSetItem, Required)

### 109. `ctx.contact_ids`
- **MTProto RPC**: `contacts.getContactIDs`
- **Namespace**: `contacts`
- **Signature**: `await ctx.contact_ids(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getContactIDs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getContactIDs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 110. `ctx.contact_statuses`
- **MTProto RPC**: `contacts.getStatuses`
- **Namespace**: `contacts`
- **Signature**: `await ctx.contact_statuses()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getStatuses. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getStatuses. Передает параметры и возвращает типизированный ответ.

### 111. `ctx.contacts_list`
- **MTProto RPC**: `contacts.getContacts`
- **Namespace**: `contacts`
- **Signature**: `await ctx.contacts_list(hash: long)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram contacts.getContacts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getContacts. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 112. `ctx.import_contacts`
- **MTProto RPC**: `contacts.importContacts`
- **Namespace**: `contacts`
- **Signature**: `await ctx.import_contacts(contacts: Vector<InputContact>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.importContacts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.importContacts. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `contacts` (Vector<InputContact>, Required)

### 113. `ctx.remove_contacts`
- **MTProto RPC**: `contacts.deleteContacts`
- **Namespace**: `contacts`
- **Signature**: `await ctx.remove_contacts(id: Vector<InputUser>)`
- **Returns**: `bool`
- **Description**: Calls Telegram contacts.deleteContacts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.deleteContacts. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<InputUser>, Required)

### 114. `ctx.remove_contacts_by_phone`
- **MTProto RPC**: `contacts.deleteByPhones`
- **Namespace**: `contacts`
- **Signature**: `await ctx.remove_contacts_by_phone(phones: Vector<string>)`
- **Returns**: `bool`
- **Description**: Calls Telegram contacts.deleteByPhones. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.deleteByPhones. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `phones` (Vector<string>, Required)

### 115. `ctx.block_peer`
- **MTProto RPC**: `contacts.block`
- **Namespace**: `contacts`
- **Signature**: `await ctx.block_peer(my_stories_from: flags.0?true = None, id: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.block. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.block. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `my_stories_from` (flags.0?true, Optional)
  • `id` (InputPeer, Required)

### 116. `ctx.unblock_peer`
- **MTProto RPC**: `contacts.unblock`
- **Namespace**: `contacts`
- **Signature**: `await ctx.unblock_peer(my_stories_from: flags.0?true = None, id: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.unblock. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.unblock. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `my_stories_from` (flags.0?true, Optional)
  • `id` (InputPeer, Required)

### 117. `ctx.blocked_peers`
- **MTProto RPC**: `contacts.getBlocked`
- **Namespace**: `contacts`
- **Signature**: `await ctx.blocked_peers(my_stories_from: flags.0?true = None, offset: int, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getBlocked. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getBlocked. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `my_stories_from` (flags.0?true, Optional)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 118. `ctx.search_public_peers`
- **MTProto RPC**: `contacts.search`
- **Namespace**: `contacts`
- **Signature**: `await ctx.search_public_peers(broadcasts: flags.0?true = None, bots: flags.1?true = None, q: string, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.search. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.search. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `broadcasts` (flags.0?true, Optional)
  • `bots` (flags.1?true, Optional)
  • `q` (string, Required)
  • `limit` (int, Required) (default: `50`)

### 119. `ctx.frequent_peers`
- **MTProto RPC**: `contacts.getTopPeers`
- **Namespace**: `contacts`
- **Signature**: `await ctx.frequent_peers(correspondents: flags.0?true = None, bots_pm: flags.1?true = None, bots_inline: flags.2?true = None, phone_calls: flags.3?true = None, forward_users: flags.4?true = None, forward_chats: flags.5?true = None, groups: flags.10?true = None, channels: flags.15?true = None, bots_app: flags.16?true = None, bots_guestchat: flags.17?true = None, offset: int, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getTopPeers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getTopPeers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `correspondents` (flags.0?true, Optional)
  • `bots_pm` (flags.1?true, Optional)
  • `bots_inline` (flags.2?true, Optional)
  • `phone_calls` (flags.3?true, Optional)
  • `forward_users` (flags.4?true, Optional)
  • `forward_chats` (flags.5?true, Optional)
  • `groups` (flags.10?true, Optional)
  • `channels` (flags.15?true, Optional)
  • `bots_app` (flags.16?true, Optional)
  • `bots_guestchat` (flags.17?true, Optional)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 120. `ctx.reset_peer_rating`
- **MTProto RPC**: `contacts.resetTopPeerRating`
- **Namespace**: `contacts`
- **Signature**: `await ctx.reset_peer_rating(category: TopPeerCategory, peer: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.resetTopPeerRating. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.resetTopPeerRating. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `category` (TopPeerCategory, Required)
  • `peer` (InputPeer, Required)

### 121. `ctx.clear_imported_contacts`
- **MTProto RPC**: `contacts.resetSaved`
- **Namespace**: `contacts`
- **Signature**: `await ctx.clear_imported_contacts()`
- **Returns**: `bool`
- **Description**: Calls Telegram contacts.resetSaved. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.resetSaved. Передает параметры и возвращает типизированный ответ.

### 122. `ctx.imported_contacts`
- **MTProto RPC**: `contacts.getSaved`
- **Namespace**: `contacts`
- **Signature**: `await ctx.imported_contacts()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getSaved. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getSaved. Передает параметры и возвращает типизированный ответ.

### 123. `ctx.set_frequent_peers_enabled`
- **MTProto RPC**: `contacts.toggleTopPeers`
- **Namespace**: `contacts`
- **Signature**: `await ctx.set_frequent_peers_enabled(enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.toggleTopPeers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.toggleTopPeers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `enabled` (Bool, Required)

### 124. `ctx.add_contact`
- **MTProto RPC**: `contacts.addContact`
- **Namespace**: `contacts`
- **Signature**: `await ctx.add_contact(add_phone_privacy_exception: flags.0?true = None, id: InputUser, first_name: string, last_name: string, phone: string, note: flags.1?TextWithEntities = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.addContact. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.addContact. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `add_phone_privacy_exception` (flags.0?true, Optional)
  • `id` (InputUser, Required)
  • `first_name` (string, Required)
  • `last_name` (string, Required)
  • `phone` (string, Required)
  • `note` (flags.1?TextWithEntities, Optional)

### 125. `ctx.accept_contact`
- **MTProto RPC**: `contacts.acceptContact`
- **Namespace**: `contacts`
- **Signature**: `await ctx.accept_contact(id: InputUser)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.acceptContact. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.acceptContact. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)

### 126. `ctx.set_close_friends`
- **MTProto RPC**: `contacts.editCloseFriends`
- **Namespace**: `contacts`
- **Signature**: `await ctx.set_close_friends(id: Vector<long>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.editCloseFriends. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.editCloseFriends. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<long>, Required)

### 127. `ctx.replace_blocklist`
- **MTProto RPC**: `contacts.setBlocked`
- **Namespace**: `contacts`
- **Signature**: `await ctx.replace_blocklist(my_stories_from: flags.0?true = None, id: Vector<InputPeer>, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram contacts.setBlocked. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.setBlocked. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `my_stories_from` (flags.0?true, Optional)
  • `id` (Vector<InputPeer>, Required)
  • `limit` (int, Required) (default: `50`)

### 128. `ctx.contact_birthdays`
- **MTProto RPC**: `contacts.getBirthdays`
- **Namespace**: `contacts`
- **Signature**: `await ctx.contact_birthdays()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.getBirthdays. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.getBirthdays. Передает параметры и возвращает типизированный ответ.

### 129. `ctx.edit_contact_note`
- **MTProto RPC**: `contacts.updateContactNote`
- **Namespace**: `contacts`
- **Signature**: `await ctx.edit_contact_note(id: InputUser, note: TextWithEntities)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram contacts.updateContactNote. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram contacts.updateContactNote. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)
  • `note` (TextWithEntities, Required)

### 130. `ctx.dialogs`
- **MTProto RPC**: `messages.getDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.dialogs(exclude_pinned: flags.0?true = None, folder_id: flags.1?int = None, offset_date: int, offset_id: int, offset_peer: InputPeer, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `exclude_pinned` (flags.0?true, Optional)
  • `folder_id` (flags.1?int, Optional)
  • `offset_date` (int, Required) (default: `0`)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_peer` (InputPeer, Required) (default: `{'_': 'inputPeerEmpty'}`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 131. `ctx.chat_history`
- **MTProto RPC**: `messages.getHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.chat_history(peer: InputPeer, offset_id: int, offset_date: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_date` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)
  • `hash` (long, Required) (default: `0`)

### 132. `ctx.search_chat_messages`
- **MTProto RPC**: `messages.search`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_chat_messages(peer: InputPeer, q: string, from_id: flags.0?InputPeer = None, saved_peer_id: flags.2?InputPeer = None, saved_reaction: flags.3?Vector<Reaction> = None, top_msg_id: flags.1?int = None, filter: MessagesFilter, min_date: int, max_date: int, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int, hash: long)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.search. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.search. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `q` (string, Required)
  • `from_id` (flags.0?InputPeer, Optional)
  • `saved_peer_id` (flags.2?InputPeer, Optional)
  • `saved_reaction` (flags.3?Vector<Reaction>, Optional)
  • `top_msg_id` (flags.1?int, Optional)
  • `filter` (MessagesFilter, Required) (default: `{'_': 'inputMessagesFilterEmpty'}`)
  • `min_date` (int, Required) (default: `0`)
  • `max_date` (int, Required) (default: `0`)
  • `offset_id` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)
  • `hash` (long, Required) (default: `0`)

### 133. `ctx.mark_chat_read`
- **MTProto RPC**: `messages.readHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_chat_read(peer: InputPeer, max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `max_id` (int, Required)

### 134. `ctx.clear_chat_history`
- **MTProto RPC**: `messages.deleteHistory`
- **Namespace**: `messages`
- **Signature**: `await ctx.clear_chat_history(just_clear: flags.0?true = None, revoke: flags.1?true = None, peer: InputPeer, max_id: int, min_date: flags.2?int = None, max_date: flags.3?int = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `just_clear` (flags.0?true, Optional)
  • `revoke` (flags.1?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `max_id` (int, Required)
  • `min_date` (flags.2?int, Optional)
  • `max_date` (flags.3?int, Optional)

### 135. `ctx.peer_settings`
- **MTProto RPC**: `messages.getPeerSettings`
- **Namespace**: `messages`
- **Signature**: `await ctx.peer_settings(peer: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getPeerSettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getPeerSettings. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)

### 136. `ctx.basic_groups`
- **MTProto RPC**: `messages.getChats`
- **Namespace**: `messages`
- **Signature**: `await ctx.basic_groups(id: Vector<long>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getChats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getChats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<long>, Required)

### 137. `ctx.basic_group_details`
- **MTProto RPC**: `messages.getFullChat`
- **Namespace**: `messages`
- **Signature**: `await ctx.basic_group_details(chat_id: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getFullChat. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getFullChat. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)

### 138. `ctx.search_all_messages`
- **MTProto RPC**: `messages.searchGlobal`
- **Namespace**: `messages`
- **Signature**: `await ctx.search_all_messages(broadcasts_only: flags.1?true = None, groups_only: flags.2?true = None, users_only: flags.3?true = None, folder_id: flags.0?int = None, community: flags.4?InputChannel = None, q: string, filter: MessagesFilter, min_date: int, max_date: int, offset_rate: int, offset_peer: InputPeer, offset_id: int, limit: int)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.searchGlobal. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchGlobal. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `broadcasts_only` (flags.1?true, Optional)
  • `groups_only` (flags.2?true, Optional)
  • `users_only` (flags.3?true, Optional)
  • `folder_id` (flags.0?int, Optional)
  • `community` (flags.4?InputChannel, Optional)
  • `q` (string, Required)
  • `filter` (MessagesFilter, Required) (default: `{'_': 'inputMessagesFilterEmpty'}`)
  • `min_date` (int, Required) (default: `0`)
  • `max_date` (int, Required) (default: `0`)
  • `offset_rate` (int, Required) (default: `0`)
  • `offset_peer` (InputPeer, Required) (default: `{'_': 'inputPeerEmpty'}`)
  • `offset_id` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 139. `ctx.message_editability`
- **MTProto RPC**: `messages.getMessageEditData`
- **Namespace**: `messages`
- **Signature**: `await ctx.message_editability(peer: InputPeer, id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getMessageEditData. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getMessageEditData. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (int, Required) (default: `$message`)

### 140. `ctx.peer_dialogs`
- **MTProto RPC**: `messages.getPeerDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.peer_dialogs(peers: Vector<InputDialogPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getPeerDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getPeerDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peers` (Vector<InputDialogPeer>, Required)

### 141. `ctx.all_drafts`
- **MTProto RPC**: `messages.getAllDrafts`
- **Namespace**: `messages`
- **Signature**: `await ctx.all_drafts()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getAllDrafts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getAllDrafts. Передает параметры и возвращает типизированный ответ.

### 142. `ctx.mutual_groups`
- **MTProto RPC**: `messages.getCommonChats`
- **Namespace**: `messages`
- **Signature**: `await ctx.mutual_groups(user_id: InputUser, max_id: long, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getCommonChats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getCommonChats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `user_id` (InputUser, Required)
  • `max_id` (long, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 143. `ctx.set_dialog_pinned`
- **MTProto RPC**: `messages.toggleDialogPin`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_dialog_pinned(pinned: flags.0?true = None, peer: InputDialogPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.toggleDialogPin. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleDialogPin. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `pinned` (flags.0?true, Optional)
  • `peer` (InputDialogPeer, Required)

### 144. `ctx.reorder_dialog_pins`
- **MTProto RPC**: `messages.reorderPinnedDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.reorder_dialog_pins(force: flags.0?true = None, folder_id: int, order: Vector<InputDialogPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.reorderPinnedDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.reorderPinnedDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `force` (flags.0?true, Optional)
  • `folder_id` (int, Required)
  • `order` (Vector<InputDialogPeer>, Required)

### 145. `ctx.pinned_dialogs`
- **MTProto RPC**: `messages.getPinnedDialogs`
- **Namespace**: `messages`
- **Signature**: `await ctx.pinned_dialogs(folder_id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getPinnedDialogs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getPinnedDialogs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `folder_id` (int, Required)

### 146. `ctx.unread_mentions`
- **MTProto RPC**: `messages.getUnreadMentions`
- **Namespace**: `messages`
- **Signature**: `await ctx.unread_mentions(peer: InputPeer, top_msg_id: flags.0?int = None, offset_id: int, add_offset: int, limit: int, max_id: int, min_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getUnreadMentions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getUnreadMentions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)
  • `offset_id` (int, Required) (default: `0`)
  • `add_offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `max_id` (int, Required) (default: `0`)
  • `min_id` (int, Required) (default: `0`)

### 147. `ctx.mark_mentions_read`
- **MTProto RPC**: `messages.readMentions`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_mentions_read(peer: InputPeer, top_msg_id: flags.0?int = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readMentions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readMentions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)

### 148. `ctx.recent_live_locations`
- **MTProto RPC**: `messages.getRecentLocations`
- **Namespace**: `messages`
- **Signature**: `await ctx.recent_live_locations(peer: InputPeer, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getRecentLocations. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getRecentLocations. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 149. `ctx.set_dialog_unread`
- **MTProto RPC**: `messages.markDialogUnread`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_dialog_unread(unread: flags.0?true = None, parent_peer: flags.1?InputPeer = None, peer: InputDialogPeer)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.markDialogUnread. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.markDialogUnread. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `unread` (flags.0?true, Optional)
  • `parent_peer` (flags.1?InputPeer, Optional)
  • `peer` (InputDialogPeer, Required)

### 150. `ctx.unread_dialog_marks`
- **MTProto RPC**: `messages.getDialogUnreadMarks`
- **Namespace**: `messages`
- **Signature**: `await ctx.unread_dialog_marks(parent_peer: flags.0?InputPeer = None)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getDialogUnreadMarks. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getDialogUnreadMarks. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `parent_peer` (flags.0?InputPeer, Optional)

### 151. `ctx.clear_all_drafts`
- **MTProto RPC**: `messages.clearAllDrafts`
- **Namespace**: `messages`
- **Signature**: `await ctx.clear_all_drafts()`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.clearAllDrafts. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.clearAllDrafts. Передает параметры и возвращает типизированный ответ.

### 152. `ctx.chat_online_count`
- **MTProto RPC**: `messages.getOnlines`
- **Namespace**: `messages`
- **Signature**: `await ctx.chat_online_count(peer: InputPeer)`
- **Returns**: `int`
- **Description**: Calls Telegram messages.getOnlines. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getOnlines. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)

### 153. `ctx.message_type_counts`
- **MTProto RPC**: `messages.getSearchCounters`
- **Namespace**: `messages`
- **Signature**: `await ctx.message_type_counts(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, top_msg_id: flags.0?int = None, filters: Vector<MessagesFilter>)`
- **Returns**: `int`
- **Description**: Calls Telegram messages.getSearchCounters. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSearchCounters. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `saved_peer_id` (flags.2?InputPeer, Optional)
  • `top_msg_id` (flags.0?int, Optional)
  • `filters` (Vector<MessagesFilter>, Required)

### 154. `ctx.dismiss_peer_settings_bar`
- **MTProto RPC**: `messages.hidePeerSettingsBar`
- **Namespace**: `messages`
- **Signature**: `await ctx.dismiss_peer_settings_bar(peer: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.hidePeerSettingsBar. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.hidePeerSettingsBar. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)

### 155. `ctx.mark_discussion_read`
- **MTProto RPC**: `messages.readDiscussion`
- **Namespace**: `messages`
- **Signature**: `await ctx.mark_discussion_read(peer: InputPeer, msg_id: int, read_max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.readDiscussion. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.readDiscussion. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)
  • `read_max_id` (int, Required)

### 156. `ctx.unpin_all_chat_messages`
- **MTProto RPC**: `messages.unpinAllMessages`
- **Namespace**: `messages`
- **Signature**: `await ctx.unpin_all_chat_messages(peer: InputPeer, top_msg_id: flags.0?int = None, saved_peer_id: flags.1?InputPeer = None)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram messages.unpinAllMessages. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.unpinAllMessages. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `top_msg_id` (flags.0?int, Optional)
  • `saved_peer_id` (flags.1?InputPeer, Optional)

### 157. `ctx.message_readers`
- **MTProto RPC**: `messages.getMessageReadParticipants`
- **Namespace**: `messages`
- **Signature**: `await ctx.message_readers(peer: InputPeer, msg_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getMessageReadParticipants. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getMessageReadParticipants. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)

### 158. `ctx.message_search_calendar`
- **MTProto RPC**: `messages.getSearchResultsCalendar`
- **Namespace**: `messages`
- **Signature**: `await ctx.message_search_calendar(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, offset_date: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSearchResultsCalendar. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSearchResultsCalendar. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `saved_peer_id` (flags.2?InputPeer, Optional)
  • `filter` (MessagesFilter, Required) (default: `{'_': 'inputMessagesFilterEmpty'}`)
  • `offset_id` (int, Required) (default: `0`)
  • `offset_date` (int, Required) (default: `0`)

### 159. `ctx.message_search_positions`
- **MTProto RPC**: `messages.getSearchResultsPositions`
- **Namespace**: `messages`
- **Signature**: `await ctx.message_search_positions(peer: InputPeer, saved_peer_id: flags.2?InputPeer = None, filter: MessagesFilter, offset_id: int, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSearchResultsPositions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSearchResultsPositions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `saved_peer_id` (flags.2?InputPeer, Optional)
  • `filter` (MessagesFilter, Required) (default: `{'_': 'inputMessagesFilterEmpty'}`)
  • `offset_id` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 160. `ctx.set_default_send_as`
- **MTProto RPC**: `messages.saveDefaultSendAs`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_default_send_as(peer: InputPeer, send_as: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.saveDefaultSendAs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.saveDefaultSendAs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `send_as` (InputPeer, Required)

### 161. `ctx.sent_media_search`
- **MTProto RPC**: `messages.searchSentMedia`
- **Namespace**: `messages`
- **Signature**: `await ctx.sent_media_search(q: string, filter: MessagesFilter, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.searchSentMedia. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.searchSentMedia. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `q` (string, Required)
  • `filter` (MessagesFilter, Required) (default: `{'_': 'inputMessagesFilterEmpty'}`)
  • `limit` (int, Required) (default: `50`)

### 162. `ctx.outgoing_read_date`
- **MTProto RPC**: `messages.getOutboxReadDate`
- **Namespace**: `messages`
- **Signature**: `await ctx.outgoing_read_date(peer: InputPeer, msg_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.getOutboxReadDate. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getOutboxReadDate. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `msg_id` (int, Required) (default: `$message`)

### 163. `ctx.channel_message_author`
- **MTProto RPC**: `channels.getMessageAuthor`
- **Namespace**: `channels`
- **Signature**: `await ctx.channel_message_author(channel: InputChannel, id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getMessageAuthor. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getMessageAuthor. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `id` (int, Required)

### 164. `ctx.move_dialogs_to_archive`
- **MTProto RPC**: `folders.editPeerFolders`
- **Namespace**: `folders`
- **Signature**: `await ctx.move_dialogs_to_archive(folder_peers: Vector<InputFolderPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram folders.editPeerFolders. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram folders.editPeerFolders. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `folder_peers` (Vector<InputFolderPeer>, Required)

### 165. `ctx.chat_folders`
- **MTProto RPC**: `messages.getDialogFilters`
- **Namespace**: `messages`
- **Signature**: `await ctx.chat_folders()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getDialogFilters. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getDialogFilters. Передает параметры и возвращает типизированный ответ.

### 166. `ctx.suggested_chat_folders`
- **MTProto RPC**: `messages.getSuggestedDialogFilters`
- **Namespace**: `messages`
- **Signature**: `await ctx.suggested_chat_folders()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getSuggestedDialogFilters. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getSuggestedDialogFilters. Передает параметры и возвращает типизированный ответ.

### 167. `ctx.save_chat_folder`
- **MTProto RPC**: `messages.updateDialogFilter`
- **Namespace**: `messages`
- **Signature**: `await ctx.save_chat_folder(id: int, filter: flags.0?DialogFilter = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.updateDialogFilter. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.updateDialogFilter. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (int, Required)
  • `filter` (flags.0?DialogFilter, Optional)

### 168. `ctx.reorder_chat_folders`
- **MTProto RPC**: `messages.updateDialogFiltersOrder`
- **Namespace**: `messages`
- **Signature**: `await ctx.reorder_chat_folders(order: Vector<int>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.updateDialogFiltersOrder. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.updateDialogFiltersOrder. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `order` (Vector<int>, Required)

### 169. `ctx.set_folder_tags_visible`
- **MTProto RPC**: `messages.toggleDialogFilterTags`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_folder_tags_visible(enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.toggleDialogFilterTags. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleDialogFilterTags. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `enabled` (Bool, Required)

### 170. `ctx.share_chat_folder`
- **MTProto RPC**: `chatlists.exportChatlistInvite`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.share_chat_folder(chatlist: InputChatlist, title: string, peers: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.exportChatlistInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.exportChatlistInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)
  • `title` (string, Required)
  • `peers` (Vector<InputPeer>, Required)

### 171. `ctx.remove_folder_invite`
- **MTProto RPC**: `chatlists.deleteExportedInvite`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.remove_folder_invite(chatlist: InputChatlist, slug: string)`
- **Returns**: `bool`
- **Description**: Calls Telegram chatlists.deleteExportedInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.deleteExportedInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)
  • `slug` (string, Required)

### 172. `ctx.edit_folder_invite`
- **MTProto RPC**: `chatlists.editExportedInvite`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.edit_folder_invite(chatlist: InputChatlist, slug: string, title: flags.1?string = None, peers: flags.2?Vector<InputPeer> = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.editExportedInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.editExportedInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)
  • `slug` (string, Required)
  • `title` (flags.1?string, Optional)
  • `peers` (flags.2?Vector<InputPeer>, Optional)

### 173. `ctx.folder_invites`
- **MTProto RPC**: `chatlists.getExportedInvites`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.folder_invites(chatlist: InputChatlist)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.getExportedInvites. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.getExportedInvites. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)

### 174. `ctx.inspect_folder_invite`
- **MTProto RPC**: `chatlists.checkChatlistInvite`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.inspect_folder_invite(slug: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.checkChatlistInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.checkChatlistInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `slug` (string, Required)

### 175. `ctx.join_folder_invite`
- **MTProto RPC**: `chatlists.joinChatlistInvite`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.join_folder_invite(slug: string, peers: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.joinChatlistInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.joinChatlistInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `slug` (string, Required)
  • `peers` (Vector<InputPeer>, Required)

### 176. `ctx.folder_updates`
- **MTProto RPC**: `chatlists.getChatlistUpdates`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.folder_updates(chatlist: InputChatlist)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.getChatlistUpdates. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.getChatlistUpdates. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)

### 177. `ctx.accept_folder_updates`
- **MTProto RPC**: `chatlists.joinChatlistUpdates`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.accept_folder_updates(chatlist: InputChatlist, peers: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.joinChatlistUpdates. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.joinChatlistUpdates. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)
  • `peers` (Vector<InputPeer>, Required)

### 178. `ctx.dismiss_folder_updates`
- **MTProto RPC**: `chatlists.hideChatlistUpdates`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.dismiss_folder_updates(chatlist: InputChatlist)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.hideChatlistUpdates. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.hideChatlistUpdates. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)

### 179. `ctx.folder_leave_suggestions`
- **MTProto RPC**: `chatlists.getLeaveChatlistSuggestions`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.folder_leave_suggestions(chatlist: InputChatlist)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.getLeaveChatlistSuggestions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.getLeaveChatlistSuggestions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)

### 180. `ctx.leave_shared_folder`
- **MTProto RPC**: `chatlists.leaveChatlist`
- **Namespace**: `chatlists`
- **Signature**: `await ctx.leave_shared_folder(chatlist: InputChatlist, peers: Vector<InputPeer>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram chatlists.leaveChatlist. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram chatlists.leaveChatlist. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chatlist` (InputChatlist, Required)
  • `peers` (Vector<InputPeer>, Required)

### 181. `ctx.edit_profile`
- **MTProto RPC**: `account.updateProfile`
- **Namespace**: `account`
- **Signature**: `await ctx.edit_profile(first_name: flags.0?string = None, last_name: flags.1?string = None, about: flags.2?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateProfile. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateProfile. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `first_name` (flags.0?string, Optional)
  • `last_name` (flags.1?string, Optional)
  • `about` (flags.2?string, Optional)

### 182. `ctx.set_online_status`
- **MTProto RPC**: `account.updateStatus`
- **Namespace**: `account`
- **Signature**: `await ctx.set_online_status(offline: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateStatus. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateStatus. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `offline` (Bool, Required)

### 183. `ctx.check_profile_username`
- **MTProto RPC**: `account.checkUsername`
- **Namespace**: `account`
- **Signature**: `await ctx.check_profile_username(username: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.checkUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.checkUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `username` (string, Required)

### 184. `ctx.set_profile_username`
- **MTProto RPC**: `account.updateUsername`
- **Namespace**: `account`
- **Signature**: `await ctx.set_profile_username(username: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `username` (string, Required)

### 185. `ctx.privacy_rules`
- **MTProto RPC**: `account.getPrivacy`
- **Namespace**: `account`
- **Signature**: `await ctx.privacy_rules(key: InputPrivacyKey)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getPrivacy. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getPrivacy. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `key` (InputPrivacyKey, Required)

### 186. `ctx.account_inactivity_ttl`
- **MTProto RPC**: `account.getAccountTTL`
- **Namespace**: `account`
- **Signature**: `await ctx.account_inactivity_ttl()`
- **Returns**: `int`
- **Description**: Calls Telegram account.getAccountTTL. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getAccountTTL. Передает параметры и возвращает типизированный ответ.

### 187. `ctx.set_emoji_status`
- **MTProto RPC**: `account.updateEmojiStatus`
- **Namespace**: `account`
- **Signature**: `await ctx.set_emoji_status(emoji_status: EmojiStatus)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateEmojiStatus. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateEmojiStatus. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `emoji_status` (EmojiStatus, Required)

### 188. `ctx.suggested_emoji_statuses`
- **MTProto RPC**: `account.getDefaultEmojiStatuses`
- **Namespace**: `account`
- **Signature**: `await ctx.suggested_emoji_statuses(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getDefaultEmojiStatuses. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getDefaultEmojiStatuses. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 189. `ctx.recent_emoji_statuses`
- **MTProto RPC**: `account.getRecentEmojiStatuses`
- **Namespace**: `account`
- **Signature**: `await ctx.recent_emoji_statuses(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getRecentEmojiStatuses. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getRecentEmojiStatuses. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 190. `ctx.clear_recent_emoji_statuses`
- **MTProto RPC**: `account.clearRecentEmojiStatuses`
- **Namespace**: `account`
- **Signature**: `await ctx.clear_recent_emoji_statuses()`
- **Returns**: `bool`
- **Description**: Calls Telegram account.clearRecentEmojiStatuses. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.clearRecentEmojiStatuses. Передает параметры и возвращает типизированный ответ.

### 191. `ctx.reorder_profile_usernames`
- **MTProto RPC**: `account.reorderUsernames`
- **Namespace**: `account`
- **Signature**: `await ctx.reorder_profile_usernames(order: Vector<string>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.reorderUsernames. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.reorderUsernames. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `order` (Vector<string>, Required)

### 192. `ctx.set_profile_username_active`
- **MTProto RPC**: `account.toggleUsername`
- **Namespace**: `account`
- **Signature**: `await ctx.set_profile_username_active(username: string, active: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.toggleUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.toggleUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `username` (string, Required)
  • `active` (Bool, Required)

### 193. `ctx.profile_photo_emojis`
- **MTProto RPC**: `account.getDefaultProfilePhotoEmojis`
- **Namespace**: `account`
- **Signature**: `await ctx.profile_photo_emojis(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getDefaultProfilePhotoEmojis. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getDefaultProfilePhotoEmojis. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 194. `ctx.set_profile_color`
- **MTProto RPC**: `account.updateColor`
- **Namespace**: `account`
- **Signature**: `await ctx.set_profile_color(for_profile: flags.1?true = None, color: flags.2?PeerColor = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateColor. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateColor. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `for_profile` (flags.1?true, Optional)
  • `color` (flags.2?PeerColor, Optional)

### 195. `ctx.set_birthday`
- **MTProto RPC**: `account.updateBirthday`
- **Namespace**: `account`
- **Signature**: `await ctx.set_birthday(birthday: flags.0?Birthday = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateBirthday. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateBirthday. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `birthday` (flags.0?Birthday, Optional)

### 196. `ctx.set_personal_channel`
- **MTProto RPC**: `account.updatePersonalChannel`
- **Namespace**: `account`
- **Signature**: `await ctx.set_personal_channel(channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updatePersonalChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updatePersonalChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required)

### 197. `ctx.set_profile_tab`
- **MTProto RPC**: `account.setMainProfileTab`
- **Namespace**: `account`
- **Signature**: `await ctx.set_profile_tab(tab: ProfileTab)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.setMainProfileTab. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.setMainProfileTab. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `tab` (ProfileTab, Required)

### 198. `ctx.set_music_saved`
- **MTProto RPC**: `account.saveMusic`
- **Namespace**: `account`
- **Signature**: `await ctx.set_music_saved(unsave: flags.0?true = None, id: InputDocument, after_id: flags.1?InputDocument = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.saveMusic. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.saveMusic. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `unsave` (flags.0?true, Optional)
  • `id` (InputDocument, Required)
  • `after_id` (flags.1?InputDocument, Optional)

### 199. `ctx.saved_music_ids`
- **MTProto RPC**: `account.getSavedMusicIds`
- **Namespace**: `account`
- **Signature**: `await ctx.saved_music_ids(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getSavedMusicIds. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getSavedMusicIds. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 200. `ctx.user_details`
- **MTProto RPC**: `users.getFullUser`
- **Namespace**: `users`
- **Signature**: `await ctx.user_details(id: InputUser)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram users.getFullUser. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram users.getFullUser. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)

### 201. `ctx.contact_requirements`
- **MTProto RPC**: `users.getRequirementsToContact`
- **Namespace**: `users`
- **Signature**: `await ctx.contact_requirements(id: Vector<InputUser>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram users.getRequirementsToContact. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram users.getRequirementsToContact. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<InputUser>, Required)

### 202. `ctx.user_music`
- **MTProto RPC**: `users.getSavedMusic`
- **Namespace**: `users`
- **Signature**: `await ctx.user_music(id: InputUser, offset: int, limit: int, hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram users.getSavedMusic. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram users.getSavedMusic. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required) (default: `0`)

### 203. `ctx.user_music_by_documents`
- **MTProto RPC**: `users.getSavedMusicByID`
- **Namespace**: `users`
- **Signature**: `await ctx.user_music_by_documents(id: InputUser, documents: Vector<InputDocument>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram users.getSavedMusicByID. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram users.getSavedMusicByID. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)
  • `documents` (Vector<InputDocument>, Required)

### 204. `ctx.suggest_contact_birthday`
- **MTProto RPC**: `users.suggestBirthday`
- **Namespace**: `users`
- **Signature**: `await ctx.suggest_contact_birthday(id: InputUser, birthday: Birthday)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram users.suggestBirthday. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram users.suggestBirthday. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputUser, Required)
  • `birthday` (Birthday, Required)

### 205. `ctx.select_profile_photo`
- **MTProto RPC**: `photos.updateProfilePhoto`
- **Namespace**: `photos`
- **Signature**: `await ctx.select_profile_photo(fallback: flags.0?true = None, bot: flags.1?InputUser = None, id: InputPhoto)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram photos.updateProfilePhoto. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram photos.updateProfilePhoto. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `fallback` (flags.0?true, Optional)
  • `bot` (flags.1?InputUser, Optional)
  • `id` (InputPhoto, Required)

### 206. `ctx.upload_profile_photo`
- **MTProto RPC**: `photos.uploadProfilePhoto`
- **Namespace**: `photos`
- **Signature**: `await ctx.upload_profile_photo(fallback: flags.3?true = None, bot: flags.5?InputUser = None, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.4?VideoSize = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram photos.uploadProfilePhoto. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram photos.uploadProfilePhoto. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `fallback` (flags.3?true, Optional)
  • `bot` (flags.5?InputUser, Optional)
  • `file` (flags.0?InputFile, Optional)
  • `video` (flags.1?InputFile, Optional)
  • `video_start_ts` (flags.2?double, Optional)
  • `video_emoji_markup` (flags.4?VideoSize, Optional)

### 207. `ctx.remove_profile_photos`
- **MTProto RPC**: `photos.deletePhotos`
- **Namespace**: `photos`
- **Signature**: `await ctx.remove_profile_photos(id: Vector<InputPhoto>)`
- **Returns**: `bool`
- **Description**: Calls Telegram photos.deletePhotos. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram photos.deletePhotos. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (Vector<InputPhoto>, Required)

### 208. `ctx.profile_photos`
- **MTProto RPC**: `photos.getUserPhotos`
- **Namespace**: `photos`
- **Signature**: `await ctx.profile_photos(user_id: InputUser, offset: int, max_id: long, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram photos.getUserPhotos. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram photos.getUserPhotos. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `user_id` (InputUser, Required)
  • `offset` (int, Required) (default: `0`)
  • `max_id` (long, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)

### 209. `ctx.set_contact_photo`
- **MTProto RPC**: `photos.uploadContactProfilePhoto`
- **Namespace**: `photos`
- **Signature**: `await ctx.set_contact_photo(suggest: flags.3?true = None, save: flags.4?true = None, user_id: InputUser, file: flags.0?InputFile = None, video: flags.1?InputFile = None, video_start_ts: flags.2?double = None, video_emoji_markup: flags.5?VideoSize = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram photos.uploadContactProfilePhoto. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram photos.uploadContactProfilePhoto. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `suggest` (flags.3?true, Optional)
  • `save` (flags.4?true, Optional)
  • `user_id` (InputUser, Required)
  • `file` (flags.0?InputFile, Optional)
  • `video` (flags.1?InputFile, Optional)
  • `video_start_ts` (flags.2?double, Optional)
  • `video_emoji_markup` (flags.5?VideoSize, Optional)

### 210. `ctx.notification_settings`
- **MTProto RPC**: `account.getNotifySettings`
- **Namespace**: `account`
- **Signature**: `await ctx.notification_settings(peer: InputNotifyPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getNotifySettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getNotifySettings. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputNotifyPeer, Required)

### 211. `ctx.set_notification_settings`
- **MTProto RPC**: `account.updateNotifySettings`
- **Namespace**: `account`
- **Signature**: `await ctx.set_notification_settings(peer: InputNotifyPeer, settings: InputPeerNotifySettings)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.updateNotifySettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.updateNotifySettings. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputNotifyPeer, Required)
  • `settings` (InputPeerNotifySettings, Required)

### 212. `ctx.reset_notification_settings`
- **MTProto RPC**: `account.resetNotifySettings`
- **Namespace**: `account`
- **Signature**: `await ctx.reset_notification_settings()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.resetNotifySettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.resetNotifySettings. Передает параметры и возвращает типизированный ответ.

### 213. `ctx.contact_signup_notifications`
- **MTProto RPC**: `account.getContactSignUpNotification`
- **Namespace**: `account`
- **Signature**: `await ctx.contact_signup_notifications()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getContactSignUpNotification. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getContactSignUpNotification. Передает параметры и возвращает типизированный ответ.

### 214. `ctx.set_contact_signup_notifications`
- **MTProto RPC**: `account.setContactSignUpNotification`
- **Namespace**: `account`
- **Signature**: `await ctx.set_contact_signup_notifications(silent: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.setContactSignUpNotification. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.setContactSignUpNotification. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `silent` (Bool, Required)

### 215. `ctx.notification_exceptions`
- **MTProto RPC**: `account.getNotifyExceptions`
- **Namespace**: `account`
- **Signature**: `await ctx.notification_exceptions(compare_sound: flags.1?true = None, compare_stories: flags.2?true = None, peer: flags.0?InputNotifyPeer = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getNotifyExceptions. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getNotifyExceptions. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `compare_sound` (flags.1?true, Optional)
  • `compare_stories` (flags.2?true, Optional)
  • `peer` (flags.0?InputNotifyPeer, Optional)

### 216. `ctx.reaction_notification_settings`
- **MTProto RPC**: `account.getReactionsNotifySettings`
- **Namespace**: `account`
- **Signature**: `await ctx.reaction_notification_settings()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getReactionsNotifySettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getReactionsNotifySettings. Передает параметры и возвращает типизированный ответ.

### 217. `ctx.set_reaction_notification_settings`
- **MTProto RPC**: `account.setReactionsNotifySettings`
- **Namespace**: `account`
- **Signature**: `await ctx.set_reaction_notification_settings(settings: ReactionsNotifySettings)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.setReactionsNotifySettings. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.setReactionsNotifySettings. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `settings` (ReactionsNotifySettings, Required)

### 218. `ctx.saved_notification_sounds`
- **MTProto RPC**: `account.getSavedRingtones`
- **Namespace**: `account`
- **Signature**: `await ctx.saved_notification_sounds(hash: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.getSavedRingtones. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.getSavedRingtones. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `hash` (long, Required) (default: `0`)

### 219. `ctx.set_notification_sound_saved`
- **MTProto RPC**: `account.saveRingtone`
- **Namespace**: `account`
- **Signature**: `await ctx.set_notification_sound_saved(id: InputDocument, unsave: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.saveRingtone. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.saveRingtone. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `id` (InputDocument, Required)
  • `unsave` (Bool, Required)

### 220. `ctx.upload_notification_sound`
- **MTProto RPC**: `account.uploadRingtone`
- **Namespace**: `account`
- **Signature**: `await ctx.upload_notification_sound(file: InputFile, file_name: string, mime_type: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram account.uploadRingtone. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram account.uploadRingtone. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `file` (InputFile, Required)
  • `file_name` (string, Required)
  • `mime_type` (string, Required)

### 221. `ctx.rename_basic_group`
- **MTProto RPC**: `messages.editChatTitle`
- **Namespace**: `messages`
- **Signature**: `await ctx.rename_basic_group(chat_id: long, title: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatTitle. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatTitle. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)
  • `title` (string, Required)

### 222. `ctx.set_basic_group_photo`
- **MTProto RPC**: `messages.editChatPhoto`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_basic_group_photo(chat_id: long, photo: InputChatPhoto)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatPhoto. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatPhoto. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)
  • `photo` (InputChatPhoto, Required)

### 223. `ctx.add_basic_group_member`
- **MTProto RPC**: `messages.addChatUser`
- **Namespace**: `messages`
- **Signature**: `await ctx.add_basic_group_member(chat_id: long, user_id: InputUser, fwd_limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.addChatUser. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.addChatUser. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)
  • `user_id` (InputUser, Required)
  • `fwd_limit` (int, Required) (default: `0`)

### 224. `ctx.remove_basic_group_member`
- **MTProto RPC**: `messages.deleteChatUser`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_basic_group_member(revoke_history: flags.0?true = None, chat_id: long, user_id: InputUser)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteChatUser. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteChatUser. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `revoke_history` (flags.0?true, Optional)
  • `chat_id` (long, Required)
  • `user_id` (InputUser, Required)

### 225. `ctx.create_basic_group`
- **MTProto RPC**: `messages.createChat`
- **Namespace**: `messages`
- **Signature**: `await ctx.create_basic_group(users: Vector<InputUser>, title: string, ttl_period: flags.0?int = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.createChat. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.createChat. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `users` (Vector<InputUser>, Required)
  • `title` (string, Required)
  • `ttl_period` (flags.0?int, Optional)

### 226. `ctx.set_basic_group_admin`
- **MTProto RPC**: `messages.editChatAdmin`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_basic_group_admin(chat_id: long, user_id: InputUser, is_admin: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatAdmin. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatAdmin. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)
  • `user_id` (InputUser, Required)
  • `is_admin` (Bool, Required)

### 227. `ctx.upgrade_basic_group`
- **MTProto RPC**: `messages.migrateChat`
- **Namespace**: `messages`
- **Signature**: `await ctx.upgrade_basic_group(chat_id: long)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.migrateChat. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.migrateChat. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)

### 228. `ctx.edit_chat_description`
- **MTProto RPC**: `messages.editChatAbout`
- **Namespace**: `messages`
- **Signature**: `await ctx.edit_chat_description(peer: InputPeer, about: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatAbout. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatAbout. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `about` (string, Required)

### 229. `ctx.set_default_member_restrictions`
- **MTProto RPC**: `messages.editChatDefaultBannedRights`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_default_member_restrictions(peer: InputPeer, banned_rights: ChatBannedRights)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatDefaultBannedRights. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatDefaultBannedRights. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `banned_rights` (ChatBannedRights, Required)

### 230. `ctx.remove_basic_group`
- **MTProto RPC**: `messages.deleteChat`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_basic_group(chat_id: long)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteChat. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteChat. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `chat_id` (long, Required)

### 231. `ctx.set_chat_auto_delete`
- **MTProto RPC**: `messages.setHistoryTTL`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_chat_auto_delete(peer: InputPeer, period: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.setHistoryTTL. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.setHistoryTTL. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `period` (int, Required)

### 232. `ctx.set_content_protection`
- **MTProto RPC**: `messages.toggleNoForwards`
- **Namespace**: `messages`
- **Signature**: `await ctx.set_content_protection(peer: InputPeer, enabled: Bool, request_msg_id: flags.0?int = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.toggleNoForwards. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.toggleNoForwards. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `enabled` (Bool, Required)
  • `request_msg_id` (flags.0?int, Optional)

### 233. `ctx.mark_channel_read`
- **MTProto RPC**: `channels.readHistory`
- **Namespace**: `channels`
- **Signature**: `await ctx.mark_channel_read(channel: InputChannel, max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram channels.readHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.readHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `max_id` (int, Required)

### 234. `ctx.channel_members`
- **MTProto RPC**: `channels.getParticipants`
- **Namespace**: `channels`
- **Signature**: `await ctx.channel_members(channel: InputChannel, filter: ChannelParticipantsFilter, offset: int, limit: int, hash: long)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram channels.getParticipants. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getParticipants. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `filter` (ChannelParticipantsFilter, Required) (default: `{'_': 'channelParticipantsRecent'}`)
  • `offset` (int, Required) (default: `0`)
  • `limit` (int, Required) (default: `50`)
  • `hash` (long, Required)

### 235. `ctx.channel_member`
- **MTProto RPC**: `channels.getParticipant`
- **Namespace**: `channels`
- **Signature**: `await ctx.channel_member(channel: InputChannel, participant: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getParticipant. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getParticipant. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `participant` (InputPeer, Required)

### 236. `ctx.channel_details`
- **MTProto RPC**: `channels.getFullChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.channel_details(channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getFullChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getFullChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)

### 237. `ctx.create_channel`
- **MTProto RPC**: `channels.createChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.create_channel(broadcast: flags.0?true = None, megagroup: flags.1?true = None, for_import: flags.3?true = None, forum: flags.5?true = None, title: string, about: string, geo_point: flags.2?InputGeoPoint = None, address: flags.2?string = None, ttl_period: flags.4?int = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.createChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.createChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `broadcast` (flags.0?true, Optional)
  • `megagroup` (flags.1?true, Optional)
  • `for_import` (flags.3?true, Optional)
  • `forum` (flags.5?true, Optional)
  • `title` (string, Required)
  • `about` (string, Required)
  • `geo_point` (flags.2?InputGeoPoint, Optional)
  • `address` (flags.2?string, Optional)
  • `ttl_period` (flags.4?int, Optional)

### 238. `ctx.set_channel_admin`
- **MTProto RPC**: `channels.editAdmin`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_admin(channel: InputChannel, user_id: InputUser, admin_rights: ChatAdminRights, rank: flags.0?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.editAdmin. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.editAdmin. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `user_id` (InputUser, Required)
  • `admin_rights` (ChatAdminRights, Required)
  • `rank` (flags.0?string, Optional)

### 239. `ctx.rename_channel`
- **MTProto RPC**: `channels.editTitle`
- **Namespace**: `channels`
- **Signature**: `await ctx.rename_channel(channel: InputChannel, title: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.editTitle. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.editTitle. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `title` (string, Required)

### 240. `ctx.set_channel_photo`
- **MTProto RPC**: `channels.editPhoto`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_photo(channel: InputChannel, photo: InputChatPhoto)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.editPhoto. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.editPhoto. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `photo` (InputChatPhoto, Required)

### 241. `ctx.check_channel_username`
- **MTProto RPC**: `channels.checkUsername`
- **Namespace**: `channels`
- **Signature**: `await ctx.check_channel_username(channel: InputChannel, username: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.checkUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.checkUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `username` (string, Required)

### 242. `ctx.set_channel_username`
- **MTProto RPC**: `channels.updateUsername`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_username(channel: InputChannel, username: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.updateUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.updateUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `username` (string, Required)

### 243. `ctx.join_channel`
- **MTProto RPC**: `channels.joinChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.join_channel(channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.joinChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.joinChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)

### 244. `ctx.leave_channel`
- **MTProto RPC**: `channels.leaveChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.leave_channel(channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.leaveChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.leaveChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)

### 245. `ctx.invite_channel_members`
- **MTProto RPC**: `channels.inviteToChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.invite_channel_members(channel: InputChannel, users: Vector<InputUser>)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram channels.inviteToChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.inviteToChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `users` (Vector<InputUser>, Required)

### 246. `ctx.remove_channel`
- **MTProto RPC**: `channels.deleteChannel`
- **Namespace**: `channels`
- **Signature**: `await ctx.remove_channel(channel: InputChannel)`
- **Returns**: `bool`
- **Description**: Calls Telegram channels.deleteChannel. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.deleteChannel. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)

### 247. `ctx.set_channel_signatures`
- **MTProto RPC**: `channels.toggleSignatures`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_signatures(signatures_enabled: flags.0?true = None, profiles_enabled: flags.1?true = None, channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleSignatures. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleSignatures. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `signatures_enabled` (flags.0?true, Optional)
  • `profiles_enabled` (flags.1?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)

### 248. `ctx.owned_public_channels`
- **MTProto RPC**: `channels.getAdminedPublicChannels`
- **Namespace**: `channels`
- **Signature**: `await ctx.owned_public_channels(by_location: flags.0?true = None, check_limit: flags.1?true = None, for_personal: flags.2?true = None, for_community_peer: flags.3?true = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getAdminedPublicChannels. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getAdminedPublicChannels. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `by_location` (flags.0?true, Optional)
  • `check_limit` (flags.1?true, Optional)
  • `for_personal` (flags.2?true, Optional)
  • `for_community_peer` (flags.3?true, Optional)

### 249. `ctx.restrict_channel_member`
- **MTProto RPC**: `channels.editBanned`
- **Namespace**: `channels`
- **Signature**: `await ctx.restrict_channel_member(channel: InputChannel, participant: InputPeer, banned_rights: ChatBannedRights)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.editBanned. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.editBanned. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `participant` (InputPeer, Required)
  • `banned_rights` (ChatBannedRights, Required)

### 250. `ctx.channel_admin_log`
- **MTProto RPC**: `channels.getAdminLog`
- **Namespace**: `channels`
- **Signature**: `await ctx.channel_admin_log(channel: InputChannel, q: string, events_filter: flags.0?ChannelAdminLogEventsFilter = None, admins: flags.1?Vector<InputUser> = None, max_id: long, min_id: long, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getAdminLog. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getAdminLog. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `q` (string, Required) (default: ``)
  • `events_filter` (flags.0?ChannelAdminLogEventsFilter, Optional)
  • `admins` (flags.1?Vector<InputUser>, Optional)
  • `max_id` (long, Required)
  • `min_id` (long, Required)
  • `limit` (int, Required) (default: `50`)

### 251. `ctx.set_group_sticker_set`
- **MTProto RPC**: `channels.setStickers`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_group_sticker_set(channel: InputChannel, stickerset: InputStickerSet)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.setStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.setStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `stickerset` (InputStickerSet, Required)

### 252. `ctx.mark_channel_media_read`
- **MTProto RPC**: `channels.readMessageContents`
- **Namespace**: `channels`
- **Signature**: `await ctx.mark_channel_media_read(channel: InputChannel, id: Vector<int>)`
- **Returns**: `bool`
- **Description**: Calls Telegram channels.readMessageContents. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.readMessageContents. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `id` (Vector<int>, Required)

### 253. `ctx.clear_channel_history`
- **MTProto RPC**: `channels.deleteHistory`
- **Namespace**: `channels`
- **Signature**: `await ctx.clear_channel_history(for_everyone: flags.0?true = None, channel: InputChannel, max_id: int)`
- **Returns**: `bool`
- **Description**: Calls Telegram channels.deleteHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.deleteHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `for_everyone` (flags.0?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `max_id` (int, Required)

### 254. `ctx.set_prehistory_hidden`
- **MTProto RPC**: `channels.togglePreHistoryHidden`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_prehistory_hidden(channel: InputChannel, enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.togglePreHistoryHidden. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.togglePreHistoryHidden. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 255. `ctx.left_channels`
- **MTProto RPC**: `channels.getLeftChannels`
- **Namespace**: `channels`
- **Signature**: `await ctx.left_channels(offset: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getLeftChannels. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getLeftChannels. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `offset` (int, Required) (default: `0`)

### 256. `ctx.eligible_discussion_groups`
- **MTProto RPC**: `channels.getGroupsForDiscussion`
- **Namespace**: `channels`
- **Signature**: `await ctx.eligible_discussion_groups()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getGroupsForDiscussion. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getGroupsForDiscussion. Передает параметры и возвращает типизированный ответ.

### 257. `ctx.set_discussion_group`
- **MTProto RPC**: `channels.setDiscussionGroup`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_discussion_group(broadcast: InputChannel, group: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.setDiscussionGroup. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.setDiscussionGroup. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `broadcast` (InputChannel, Required)
  • `group` (InputChannel, Required)

### 258. `ctx.set_group_location`
- **MTProto RPC**: `channels.editLocation`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_group_location(channel: InputChannel, geo_point: InputGeoPoint, address: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.editLocation. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.editLocation. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `geo_point` (InputGeoPoint, Required)
  • `address` (string, Required)

### 259. `ctx.set_slow_mode`
- **MTProto RPC**: `channels.toggleSlowMode`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_slow_mode(channel: InputChannel, seconds: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleSlowMode. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleSlowMode. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `seconds` (int, Required)

### 260. `ctx.inactive_channels`
- **MTProto RPC**: `channels.getInactiveChannels`
- **Namespace**: `channels`
- **Signature**: `await ctx.inactive_channels()`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getInactiveChannels. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getInactiveChannels. Передает параметры и возвращает типизированный ответ.

### 261. `ctx.send_as_identities`
- **MTProto RPC**: `channels.getSendAs`
- **Namespace**: `channels`
- **Signature**: `await ctx.send_as_identities(for_paid_reactions: flags.0?true = None, for_live_stories: flags.1?true = None, peer: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getSendAs. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getSendAs. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `for_paid_reactions` (flags.0?true, Optional)
  • `for_live_stories` (flags.1?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)

### 262. `ctx.remove_member_history`
- **MTProto RPC**: `channels.deleteParticipantHistory`
- **Namespace**: `channels`
- **Signature**: `await ctx.remove_member_history(channel: InputChannel, participant: InputPeer)`
- **Returns**: `bool`
- **Description**: Calls Telegram channels.deleteParticipantHistory. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.deleteParticipantHistory. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `participant` (InputPeer, Required)

### 263. `ctx.set_join_to_send`
- **MTProto RPC**: `channels.toggleJoinToSend`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_join_to_send(channel: InputChannel, enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleJoinToSend. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleJoinToSend. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 264. `ctx.set_join_requests`
- **MTProto RPC**: `channels.toggleJoinRequest`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_join_requests(apply_to_invites: flags.1?true = None, channel: InputChannel, enabled: Bool, guard_bot: flags.0?InputUser = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleJoinRequest. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleJoinRequest. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `apply_to_invites` (flags.1?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)
  • `guard_bot` (flags.0?InputUser, Optional)

### 265. `ctx.reorder_channel_usernames`
- **MTProto RPC**: `channels.reorderUsernames`
- **Namespace**: `channels`
- **Signature**: `await ctx.reorder_channel_usernames(channel: InputChannel, order: Vector<string>)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.reorderUsernames. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.reorderUsernames. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `order` (Vector<string>, Required)

### 266. `ctx.set_channel_username_active`
- **MTProto RPC**: `channels.toggleUsername`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_username_active(channel: InputChannel, username: string, active: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleUsername. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleUsername. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `username` (string, Required)
  • `active` (Bool, Required)

### 267. `ctx.deactivate_channel_usernames`
- **MTProto RPC**: `channels.deactivateAllUsernames`
- **Namespace**: `channels`
- **Signature**: `await ctx.deactivate_channel_usernames(channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.deactivateAllUsernames. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.deactivateAllUsernames. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)

### 268. `ctx.set_antispam`
- **MTProto RPC**: `channels.toggleAntiSpam`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_antispam(channel: InputChannel, enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleAntiSpam. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleAntiSpam. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 269. `ctx.set_members_hidden`
- **MTProto RPC**: `channels.toggleParticipantsHidden`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_members_hidden(channel: InputChannel, enabled: Bool)`
- **Returns**: `list[dict[str, Any]]`
- **Description**: Calls Telegram channels.toggleParticipantsHidden. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleParticipantsHidden. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 270. `ctx.set_channel_color`
- **MTProto RPC**: `channels.updateColor`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_color(for_profile: flags.1?true = None, channel: InputChannel, color: flags.2?int = None, background_emoji_id: flags.0?long = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.updateColor. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.updateColor. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `for_profile` (flags.1?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `color` (flags.2?int, Optional)
  • `background_emoji_id` (flags.0?long, Optional)

### 271. `ctx.related_channels`
- **MTProto RPC**: `channels.getChannelRecommendations`
- **Namespace**: `channels`
- **Signature**: `await ctx.related_channels(channel: flags.0?InputChannel = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.getChannelRecommendations. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.getChannelRecommendations. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (flags.0?InputChannel, Optional)

### 272. `ctx.set_channel_emoji_status`
- **MTProto RPC**: `channels.updateEmojiStatus`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_emoji_status(channel: InputChannel, emoji_status: EmojiStatus)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.updateEmojiStatus. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.updateEmojiStatus. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `emoji_status` (EmojiStatus, Required)

### 273. `ctx.set_group_emoji_set`
- **MTProto RPC**: `channels.setEmojiStickers`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_group_emoji_set(channel: InputChannel, stickerset: InputStickerSet)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.setEmojiStickers. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.setEmojiStickers. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `stickerset` (InputStickerSet, Required)

### 274. `ctx.set_channel_auto_translation`
- **MTProto RPC**: `channels.toggleAutotranslation`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_auto_translation(channel: InputChannel, enabled: Bool)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.toggleAutotranslation. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.toggleAutotranslation. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `enabled` (Bool, Required)

### 275. `ctx.set_channel_profile_tab`
- **MTProto RPC**: `channels.setMainProfileTab`
- **Namespace**: `channels`
- **Signature**: `await ctx.set_channel_profile_tab(channel: InputChannel, tab: ProfileTab)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram channels.setMainProfileTab. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram channels.setMainProfileTab. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `tab` (ProfileTab, Required)

### 276. `ctx.edit_member_rank`
- **MTProto RPC**: `messages.editChatParticipantRank`
- **Namespace**: `messages`
- **Signature**: `await ctx.edit_member_rank(peer: InputPeer, participant: InputPeer, rank: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editChatParticipantRank. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editChatParticipantRank. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `participant` (InputPeer, Required)
  • `rank` (string, Required)

### 277. `ctx.create_chat_invite`
- **MTProto RPC**: `messages.exportChatInvite`
- **Namespace**: `messages`
- **Signature**: `await ctx.create_chat_invite(legacy_revoke_permanent: flags.2?true = None, request_needed: flags.3?true = None, peer: InputPeer, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, title: flags.4?string = None, subscription_pricing: flags.5?StarsSubscriptionPricing = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.exportChatInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.exportChatInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `legacy_revoke_permanent` (flags.2?true, Optional)
  • `request_needed` (flags.3?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `expire_date` (flags.0?int, Optional)
  • `usage_limit` (flags.1?int, Optional)
  • `title` (flags.4?string, Optional)
  • `subscription_pricing` (flags.5?StarsSubscriptionPricing, Optional)

### 278. `ctx.chat_invites`
- **MTProto RPC**: `messages.getExportedChatInvites`
- **Namespace**: `messages`
- **Signature**: `await ctx.chat_invites(revoked: flags.3?true = None, peer: InputPeer, admin_id: InputUser, offset_date: flags.2?int = None, offset_link: flags.2?string = None, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getExportedChatInvites. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getExportedChatInvites. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `revoked` (flags.3?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `admin_id` (InputUser, Required)
  • `offset_date` (flags.2?int, Optional)
  • `offset_link` (flags.2?string, Optional)
  • `limit` (int, Required) (default: `50`)

### 279. `ctx.chat_invite_details`
- **MTProto RPC**: `messages.getExportedChatInvite`
- **Namespace**: `messages`
- **Signature**: `await ctx.chat_invite_details(peer: InputPeer, link: string)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getExportedChatInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getExportedChatInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `link` (string, Required)

### 280. `ctx.edit_chat_invite`
- **MTProto RPC**: `messages.editExportedChatInvite`
- **Namespace**: `messages`
- **Signature**: `await ctx.edit_chat_invite(revoked: flags.2?true = None, peer: InputPeer, link: string, expire_date: flags.0?int = None, usage_limit: flags.1?int = None, request_needed: flags.3?Bool = None, title: flags.4?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.editExportedChatInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.editExportedChatInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `revoked` (flags.2?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `link` (string, Required)
  • `expire_date` (flags.0?int, Optional)
  • `usage_limit` (flags.1?int, Optional)
  • `request_needed` (flags.3?Bool, Optional)
  • `title` (flags.4?string, Optional)

### 281. `ctx.purge_revoked_chat_invites`
- **MTProto RPC**: `messages.deleteRevokedExportedChatInvites`
- **Namespace**: `messages`
- **Signature**: `await ctx.purge_revoked_chat_invites(peer: InputPeer, admin_id: InputUser)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.deleteRevokedExportedChatInvites. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteRevokedExportedChatInvites. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `admin_id` (InputUser, Required)

### 282. `ctx.remove_chat_invite`
- **MTProto RPC**: `messages.deleteExportedChatInvite`
- **Namespace**: `messages`
- **Signature**: `await ctx.remove_chat_invite(peer: InputPeer, link: string)`
- **Returns**: `bool`
- **Description**: Calls Telegram messages.deleteExportedChatInvite. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.deleteExportedChatInvite. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `link` (string, Required)

### 283. `ctx.invite_admins`
- **MTProto RPC**: `messages.getAdminsWithInvites`
- **Namespace**: `messages`
- **Signature**: `await ctx.invite_admins(peer: InputPeer)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getAdminsWithInvites. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getAdminsWithInvites. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)

### 284. `ctx.invite_joiners`
- **MTProto RPC**: `messages.getChatInviteImporters`
- **Namespace**: `messages`
- **Signature**: `await ctx.invite_joiners(requested: flags.0?true = None, subscription_expired: flags.3?true = None, peer: InputPeer, link: flags.1?string = None, q: flags.2?string = None, offset_date: int, offset_user: InputUser, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.getChatInviteImporters. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.getChatInviteImporters. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `requested` (flags.0?true, Optional)
  • `subscription_expired` (flags.3?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `link` (flags.1?string, Optional)
  • `q` (flags.2?string, Optional)
  • `offset_date` (int, Required) (default: `0`)
  • `offset_user` (InputUser, Required) (default: `{'_': 'inputUserEmpty'}`)
  • `limit` (int, Required) (default: `50`)

### 285. `ctx.resolve_join_request`
- **MTProto RPC**: `messages.hideChatJoinRequest`
- **Namespace**: `messages`
- **Signature**: `await ctx.resolve_join_request(approved: flags.0?true = None, peer: InputPeer, user_id: InputUser)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.hideChatJoinRequest. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.hideChatJoinRequest. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `approved` (flags.0?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `user_id` (InputUser, Required)

### 286. `ctx.resolve_all_join_requests`
- **MTProto RPC**: `messages.hideAllChatJoinRequests`
- **Namespace**: `messages`
- **Signature**: `await ctx.resolve_all_join_requests(approved: flags.0?true = None, peer: InputPeer, link: flags.1?string = None)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram messages.hideAllChatJoinRequests. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram messages.hideAllChatJoinRequests. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `approved` (flags.0?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `link` (flags.1?string, Optional)

### 287. `ctx.channel_statistics`
- **MTProto RPC**: `stats.getBroadcastStats`
- **Namespace**: `stats`
- **Signature**: `await ctx.channel_statistics(dark: flags.0?true = None, channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getBroadcastStats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getBroadcastStats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `dark` (flags.0?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)

### 288. `ctx.supergroup_statistics`
- **MTProto RPC**: `stats.getMegagroupStats`
- **Namespace**: `stats`
- **Signature**: `await ctx.supergroup_statistics(dark: flags.0?true = None, channel: InputChannel)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getMegagroupStats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getMegagroupStats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `dark` (flags.0?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)

### 289. `ctx.message_statistics`
- **MTProto RPC**: `stats.getMessageStats`
- **Namespace**: `stats`
- **Signature**: `await ctx.message_statistics(dark: flags.0?true = None, channel: InputChannel, msg_id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getMessageStats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getMessageStats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `dark` (flags.0?true, Optional)
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `msg_id` (int, Required)

### 290. `ctx.message_public_forwards`
- **MTProto RPC**: `stats.getMessagePublicForwards`
- **Namespace**: `stats`
- **Signature**: `await ctx.message_public_forwards(channel: InputChannel, msg_id: int, offset: string, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getMessagePublicForwards. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getMessagePublicForwards. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `channel` (InputChannel, Required) (default: `$peer`)
  • `msg_id` (int, Required)
  • `offset` (string, Required) (default: ``)
  • `limit` (int, Required) (default: `50`)

### 291. `ctx.story_statistics`
- **MTProto RPC**: `stats.getStoryStats`
- **Namespace**: `stats`
- **Signature**: `await ctx.story_statistics(dark: flags.0?true = None, peer: InputPeer, id: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getStoryStats. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getStoryStats. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `dark` (flags.0?true, Optional)
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (int, Required) (default: `$message`)

### 292. `ctx.story_public_forwards`
- **MTProto RPC**: `stats.getStoryPublicForwards`
- **Namespace**: `stats`
- **Signature**: `await ctx.story_public_forwards(peer: InputPeer, id: int, offset: string, limit: int)`
- **Returns**: `dict[str, Any]`
- **Description**: Calls Telegram stats.getStoryPublicForwards. Dispatches typed parameters and returns structured result.
- **Описание (RU)**: Вызывает метод Telegram stats.getStoryPublicForwards. Передает параметры и возвращает типизированный ответ.
- **Parameters**:
  • `peer` (InputPeer, Required) (default: `$peer`)
  • `id` (int, Required) (default: `$message`)
  • `offset` (string, Required) (default: ``)
  • `limit` (int, Required) (default: `50`)

## 8. Complete Production Module Blueprints

The following 12 blueprints represent fully functional, tested `.hmod` modules covering a wide spectrum of userbot applications:

### Blueprint 1: Multi-Currency & Crypto Price Watcher (`crypto_watch.hmod`)
Demonstrates `net` and `state` capabilities with automatic live screen refreshes (no `mt` capability needed):
```python
HOTARU = {
    "id": "crypto_watch",
    "version": "1.0.0",
    "commands": {
        "crypto": "crypto_cmd",
        "btc": "btc_cmd",
    },
    "capabilities": ["net", "state"],
    "lexicon": {
        "en": {
            "fetching": "Querying cryptocurrency rates...",
            "title": "Crypto Market Rates",
        },
        "ru": {
            "fetching": "Запрос курсов криптовалют...",
            "title": "Курсы криптовалют",
        },
    },
}

import json

async def fetch_crypto_rates(ctx):
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,toncoin,solana&vs_currencies=usd,eur,rub"
    res = await ctx.net(url, timeout=10)
    if res.status_code == 200:
        return json.loads(res.text)
    return None

async def crypto_cmd(ctx):
    await ctx.respond(ctx.t("fetching"))
    data = await fetch_crypto_rates(ctx)
    if not data:
        await ctx.respond("Failed to fetch market rates from CoinGecko.")
        return

    async def on_refresh(handle):
        await render()

    async def render():
        rates = await fetch_crypto_rates(ctx) or data
        lines = [
            "<b>" + ctx.t("title") + "</b>\n",
            f"• <b>BTC</b>: ${rates.get('bitcoin', {}).get('usd', 0):,} USD",
            f"• <b>ETH</b>: ${rates.get('ethereum', {}).get('usd', 0):,} USD",
            f"• <b>TON</b>: ${rates.get('toncoin', {}).get('usd', 0):,} USD",
            f"• <b>SOL</b>: ${rates.get('solana', {}).get('usd', 0):,} USD",
        ]
        buttons = [
            [ctx.screens.primary("Refresh Rates", on_refresh)],
            [ctx.screens.close()],
        ]
        await ctx.screens.show("Market", "\n".join(lines), buttons=buttons)

    await render()

async def btc_cmd(ctx):
    rates = await fetch_crypto_rates(ctx)
    if rates and 'bitcoin' in rates:
        usd = rates['bitcoin']['usd']
        await ctx.respond(f"Bitcoin: <b>${usd:,} USD</b>")
    else:
        await ctx.respond("Unable to retrieve Bitcoin rate.")
```

### Blueprint 2: Ephemeral Self-Destructing Notes (`destruct_note.hmod`)
Demonstrates message scheduling, timers, and automatic deletion using standard context operations (zero capabilities needed):
```python
HOTARU = {
    "id": "destruct_note",
    "version": "1.0.0",
    "commands": {
        "sd": "self_destruct_cmd",
    },
    "capabilities": [],
}

import asyncio

async def self_destruct_cmd(ctx):
    args = ctx.args
    if len(args) < 2:
        await ctx.respond("Usage: .sd <seconds> <text>")
        return
    try:
        seconds = int(args[0])
        if seconds <= 0 or seconds > 3600:
            await ctx.respond("Delay must be between 1 and 3600 seconds.")
            return
    except ValueError:
        await ctx.respond("Invalid seconds number.")
        return

    text = " ".join(args[1:])
    notice = await ctx.respond(f"{text}\n\n<i>💥 This message self-destructs in {seconds}s.</i>")
    await asyncio.sleep(seconds)
    try:
        await ctx.delete_message(id=notice.id)
    except Exception:
        pass
```

### Blueprint 3: Anti-Spam Channel & Group Watcher (`spam_sentinel.hmod`)
Demonstrates passive `watchers`, regex filtering, and MTProto member administration using 292 contextual methods (requires only `state`, no `mt` needed):
```python
HOTARU = {
    "id": "spam_sentinel",
    "version": "1.0.0",
    "commands": {
        "sentinel": "toggle_sentinel_cmd",
    },
    "capabilities": ["state"],
    "watchers": ["spam_filter_watcher"],
}

import re

SPAM_PATTERNS = [
    re.compile(r"(crypto|giveaway|airdrop|binance|free\s*ton|usdt|claim\s*reward)", re.IGNORECASE),
    re.compile(r"(t\.me/joinchat/|t\.me/\+[a-zA-Z0-9_-]+)", re.IGNORECASE),
]

async def toggle_sentinel_cmd(ctx):
    active = await ctx.state.get("active", True)
    await ctx.state.set("active", not active)
    status = "ACTIVE" if not active else "DISABLED"
    await ctx.respond(f"Spam Sentinel protection: <b>{status}</b>")

async def spam_filter_watcher(ctx):
    if ctx.out or not ctx.sender_id:
        return

    active = await ctx.state.get("active", True)
    if not active:
        return

    text = ctx.message.text or ""
    matched = any(p.search(text) for p in SPAM_PATTERNS)
    if matched:
        try:
            # Delete spam message
            await ctx.delete()
            # Optionally restrict member for 24h
            await ctx.ban_channel_member(user_id=ctx.sender_id, until_date=86400)
        except Exception:
            pass
```

### Blueprint 4: System Telemetry & Daemon Monitor (`daemon_inspector.hmod`)
Demonstrates integration with Hotaru's 29 init systems and interactive screens (zero capabilities needed):
```python
HOTARU = {
    "id": "daemon_inspector",
    "version": "1.0.0",
    "commands": {
        "daemon": "daemon_cmd",
    },
    "capabilities": [],
}

from hotaru.daemon import detect_init_system, daemon_status

async def daemon_cmd(ctx):
    async def on_refresh(handle):
        await render()

    async def render():
        init = detect_init_system()
        status = daemon_status()
        body = (
            f"<b>Daemon & Service Inspector</b>\n\n"
            f"• <b>Init System</b>: <code>{init.name}</code> ({init.id})\n"
            f"• <b>Scope</b>: <code>{'Root System' if init.is_root else 'User Space'}</code>\n"
            f"• <b>Service Installed</b>: <code>{'Yes' if status.installed else 'No'}</code>\n"
            f"• <b>Process Running</b>: <code>{'Active' if status.running else 'Stopped'}</code>\n"
            f"• <b>Daemon PID</b>: <code>{status.pid or 'N/A'}</code>\n"
            f"• <b>Unit Path</b>: <code>{init.unit_path()}</code>\n"
            f"• <b>Check Command</b>: <code>{init.status_command()}</code>"
        )
        buttons = [
            [ctx.screens.primary("Refresh Status", on_refresh)],
            [ctx.screens.close()],
        ]
        await ctx.screens.show("Daemon Monitor", body, buttons=buttons)

    await render()
```

### Blueprint 5: Audio Pitch Shifter & Voice Converter (`voice_mod.hmod`)
Demonstrates `files` and `shell` capabilities with ffmpeg transcoding:
```python
HOTARU = {
    "id": "voice_mod",
    "version": "1.0.0",
    "commands": {
        "pitch": "pitch_cmd",
    },
    "capabilities": ["files", "shell"],
}

import asyncio
import os

async def pitch_cmd(ctx):
    if not ctx.reply_to or not ctx.reply_to.media:
        await ctx.respond("Reply to a voice note or audio file with .pitch <factor> (e.g. 1.25)")
        return

    factor = ctx.args[0] if ctx.args else '1.2'
    await ctx.respond("Downloading and adjusting pitch...")
    audio_bytes = await ctx.download(ctx.reply_to.media)

    in_file = "/tmp/sandbox/in_audio.ogg"
    out_file = "/tmp/sandbox/out_audio.ogg"
    with open(in_file, 'wb') as f:
        f.write(audio_bytes)

    cmd = f"ffmpeg -y -i {in_file} -filter:a 'asetrate=48000*{factor},aresample=48000' {out_file}"
    proc = await asyncio.create_subprocess_shell(cmd)
    await proc.communicate()

    if os.path.exists(out_file):
        with open(out_file, 'rb') as f:
            await ctx.reply_voice(f.read())
        await ctx.delete()
    else:
        await ctx.respond("Audio pitch modulation failed.")
```

### Blueprint 6: Persistent Todo & Checklist Manager (`todo_list.hmod`)
Demonstrates multi-key SQLite state persistence with formatted checklists (requires only `state`):
```python
HOTARU = {
    "id": "todo_list",
    "version": "1.0.0",
    "commands": {
        "todo": "todo_cmd",
        "done": "done_cmd",
        "todos": "todos_cmd",
        "cleartodo": "clear_todo_cmd",
    },
    "capabilities": ["state"],
}

async def todo_cmd(ctx):
    item = ctx.raw_args.strip()
    if not item:
        await ctx.respond("Usage: .todo <task description>")
        return
    items = await ctx.state.get("tasks", [])
    items.append({"text": item, "done": False})
    await ctx.state.set("tasks", items)
    await ctx.respond(f"Added task #{len(items)}: <b>{item}</b>")

async def done_cmd(ctx):
    if not ctx.args:
        await ctx.respond("Usage: .done <task_number>")
        return
    try:
        idx = int(ctx.args[0]) - 1
        items = await ctx.state.get("tasks", [])
        if 0 <= idx < len(items):
            items[idx]['done'] = True
            await ctx.state.set("tasks", items)
            await ctx.respond(f"Marked task #{idx + 1} as completed!")
        else:
            await ctx.respond("Task index out of range.")
    except ValueError:
        await ctx.respond("Please provide a valid integer.")

async def todos_cmd(ctx):
    items = await ctx.state.get("tasks", [])
    if not items:
        await ctx.respond("Your todo list is empty!")
        return
    lines = ["<b>Your Todo Checklist:</b>\n"]
    for i, it in enumerate(items, 1):
        mark = '✅' if it['done'] else '⬜'
        strike_start = "<s>" if it['done'] else ""
        strike_end = "</s>" if it['done'] else ""
        lines.append(f"{mark} #{i}: {strike_start}{it['text']}{strike_end}")
    await ctx.respond("\n".join(lines))

async def clear_todo_cmd(ctx):
    items = await ctx.state.get("tasks", [])
    active_items = [it for it in items if not it['done']]
    await ctx.state.set("tasks", active_items)
    await ctx.respond("Cleaned up all completed tasks.")
```

### Blueprint 7: Link Unshortener & Redirect Safety Checker (`link_check.hmod`)
Demonstrates resolving HTTP 301/302 redirects without executing client scripts (requires only `net`):
```python
HOTARU = {
    "id": "link_check",
    "version": "1.0.0",
    "commands": {
        "unshort": "unshort_cmd",
    },
    "capabilities": ["net"],
}

async def unshort_cmd(ctx):
    target_url = ctx.raw_args.strip()
    if not target_url and ctx.reply_to and ctx.reply_to.text:
        target_url = ctx.reply_to.text.strip()
    if not target_url:
        await ctx.respond("Usage: .unshort <url>")
        return
    if not target_url.startswith(("http://", "https://")):
        target_url = "https://" + target_url

    await ctx.respond("Tracing redirect hops...")
    try:
        res = await ctx.net(target_url, timeout=12)
        final_url = res.headers.get("Location") or target_url
        status = res.status_code
        body = (
            f"<b>Link Inspection Result</b>\n\n"
            f"• <b>Initial URL</b>: <code>{target_url}</code>\n"
            f"• <b>Final Destination</b>: <code>{final_url}</code>\n"
            f"• <b>HTTP Status</b>: <code>{status}</code>"
        )
        await ctx.respond(body)
    except Exception as err:
        await ctx.respond(f"Failed to inspect link: <code>{err}</code>")
```

### Blueprint 8: GitHub Repository Release & Issue Watcher (`github_watch.hmod`)
Demonstrates background supervised tasks polling public APIs (requires `net` and `state`):
```python
HOTARU = {
    "id": "github_watch",
    "version": "1.0.0",
    "commands": {
        "ghrepo": "set_repo_cmd",
        "ghstatus": "status_cmd",
    },
    "capabilities": ["net", "state"],
    "tasks": {
        "poll_releases": "release_checker_task",
    },
}

import asyncio
import json

async def set_repo_cmd(ctx):
    repo = ctx.raw_args.strip()
    if not repo:
        await ctx.respond("Usage: .ghrepo <owner/repo>")
        return
    await ctx.state.set("target_repo", repo)
    await ctx.respond(f"Monitoring GitHub repository: <b>{repo}</b>")

async def status_cmd(ctx):
    repo = await ctx.state.get("target_repo", "HotaruProject/Hotaru")
    last_tag = await ctx.state.get("last_release", "None")
    await ctx.respond(f"Repo: <code>{repo}</code>\nLast Release: <b>{last_tag}</b>")

async def release_checker_task(ctx):
    while not ctx.is_stopping:
        try:
            repo = await ctx.state.get("target_repo", "HotaruProject/Hotaru")
            url = f"https://api.github.com/repos/{repo}/releases/latest"
            headers = {"User-Agent": "Hotaru-Userbot"}
            res = await ctx.net(url, headers=headers, timeout=15)
            if res.status_code == 200:
                data = json.loads(res.text)
                tag = data.get('tag_name')
                last_tag = await ctx.state.get("last_release")
                if last_tag and tag != last_tag:
                    await ctx.save() # Notify in Saved Messages
                await ctx.state.set("last_release", tag)
        except Exception:
            pass
        for _ in range(300):
            if ctx.is_stopping:
                break
            await asyncio.sleep(1)
```

### Blueprint 9: AI Language Model Chat Assistant (`ai_chat.hmod`)
Demonstrates integrating external LLM endpoints (requires `net` and `state`):
```python
HOTARU = {
    "id": "ai_chat",
    "version": "1.0.0",
    "commands": {
        "ai": "ai_cmd",
        "ask": "ai_cmd",
    },
    "capabilities": ["net", "state"],
    "config_schema": {
        "api_key": {
            "type": "string",
            "default": "",
            "description": "API Key for AI provider",
        },
        "endpoint": {
            "type": "string",
            "default": "https://api.openai.com/v1/chat/completions",
            "description": "OpenAI-compatible API endpoint",
        },
    },
}

import json

async def ai_cmd(ctx):
    prompt = ctx.raw_args.strip()
    if not prompt and ctx.reply_to and ctx.reply_to.text:
        prompt = ctx.reply_to.text.strip()
    if not prompt:
        await ctx.respond("Usage: .ai <prompt> or reply to message")
        return

    await ctx.respond("Thinking...")
    api_key = await ctx.state.get("api_key", "")
    endpoint = await ctx.state.get("endpoint", "https://api.openai.com/v1/chat/completions")

    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}" if api_key else "",
    }
    try:
        res = await ctx.net(endpoint, method='POST', headers=headers, json=payload, timeout=30)
        if res.status_code == 200:
            data = json.loads(res.text)
            reply_text = data['choices'][0]['message']['content']
            await ctx.respond(f"<b>AI Response:</b>\n\n{reply_text}")
        else:
            await ctx.respond(f"AI API error (HTTP {res.status_code}): {res.text[:200]}")
    except Exception as err:
        await ctx.respond(f"Connection failed: {err}")
```

### Blueprint 10: Auto-Translation Group Watcher (`group_translator.hmod`)
Demonstrates automatic language translation of non-native messages in foreign groups (requires only `state`):
```python
HOTARU = {
    "id": "group_translator",
    "version": "1.0.0",
    "commands": {
        "autotr": "toggle_autotr_cmd",
    },
    "capabilities": ["state"],
    "watchers": ["translate_watcher"],
}

async def toggle_autotr_cmd(ctx):
    enabled = await ctx.state.get("enabled", False)
    await ctx.state.set("enabled", not enabled)
    status = "ON" if not enabled else "OFF"
    await ctx.respond(f"Group Auto-Translator is now <b>{status}</b>.")

async def translate_watcher(ctx):
    if ctx.out:
        return
    enabled = await ctx.state.get("enabled", False)
    if not enabled:
        return
    text = ctx.message.text or ""
    # If message is short or contains no latin/cyrillic, skip
    if len(text) < 5 or text.startswith('.'):
        return
    try:
        # Call Hotaru's internal translation RPC
        tr_res = await ctx.call_rpc("translate_text", text=text, target="ru")
        if tr_res and tr_res.get('translated') and tr_res['translated'] != text:
            await ctx.reply(f"🌐 <i>{tr_res['translated']}</i>")
    except Exception:
        pass
```

### Blueprint 11: Telegram Story Auto-Archiver (`story_archiver.hmod`)
Demonstrates story enumeration and media downloading (zero capabilities needed for standard download and photo reply):
```python
HOTARU = {
    "id": "story_archiver",
    "version": "1.0.0",
    "commands": {
        "savestory": "save_story_cmd",
    },
    "capabilities": [],
}

async def save_story_cmd(ctx):
    if not ctx.args:
        await ctx.respond("Usage: .savestory <username_or_user_id>")
        return
    target = ctx.args[0]
    await ctx.respond(f"Querying active stories for <code>{target}</code>...")
    try:
        # Extended MTProto method for story retrieval
        stories = await ctx.call_rpc('get_peer_stories', peer=target)
        if not stories or not stories.get('stories'):
            await ctx.respond("No active stories found for this user.")
            return
        for story in stories['stories'][:3]:
            media = story.get('media')
            if media:
                data = await ctx.download(media)
                caption = f"Saved story from @{target} (ID: {story.get('id')})"
                await ctx.reply_photo(data, caption=caption)
    except Exception as err:
        await ctx.respond(f"Story archive error: {err}")
```

### Blueprint 12: Interactive Poll Maker with CSV Export (`poll_wizard.hmod`)
Demonstrates creating native polls using `ctx.send_poll` (one of the 292 methods, zero capabilities needed):
```python
HOTARU = {
    "id": "poll_wizard",
    "version": "1.0.0",
    "commands": {
        "poll": "create_poll_cmd",
    },
    "capabilities": [],
}

async def create_poll_cmd(ctx):
    args = ctx.raw_args.split('|')
    if len(args) < 3:
        await ctx.respond("Usage: .poll Question | Option A | Option B | [Option C]")
        return
    question = args[0].strip()
    options = [opt.strip() for opt in args[1:] if opt.strip()]
    if len(options) < 2:
        await ctx.respond("Please provide at least two valid poll options.")
        return
    try:
        await ctx.send_poll(question=question, options=options, multiple_choice=False)
        await ctx.delete()
    except Exception as err:
        await ctx.respond(f"Failed to publish poll: {err}")
```

### Blueprint 13: Raw MTProto Inspector (`raw_mtproto.hmod`)
Demonstrates when the `'mt'` capability **IS** actually required: making direct, raw MTProto RPC calls via `ctx.tg.call`:
```python
HOTARU = {
    "id": "raw_mtproto",
    "version": "1.0.0",
    "commands": {
        "dc": "get_dc_cmd",
    },
    "capabilities": ["mt"],  # Required ONLY because ctx.tg.call is invoked directly
    "lexicon": {
        "en": {
            "dc_info": "<b>Telegram Data Center Info (Raw MTProto):</b>\n• Country: <code>{country}</code>\n• Current DC: <code>DC{this_dc}</code>\n• Nearest DC: <code>DC{nearest_dc}</code>",
        },
        "ru": {
            "dc_info": "<b>Дата-центр Telegram (Сырой MTProto):</b>\n• Страна: <code>{country}</code>\n• Текущий ДЦ: <code>DC{this_dc}</code>\n• Ближайший ДЦ: <code>DC{nearest_dc}</code>",
        },
    },
}

async def get_dc_cmd(ctx):
    # Direct raw MTProto call using ctx.tg.call (requires mt capability in HOTARU["capabilities"])
    res = await ctx.tg.call("help.getNearestDc")
    country = res.get("country", "Unknown")
    this_dc = res.get("this_dc", 0)
    nearest_dc = res.get("nearest_dc", 0)
    await ctx.respond(ctx.t("dc_info", country=country, this_dc=this_dc, nearest_dc=nearest_dc))
```

## 9. Security Audit Checklist & Development Best Practices

When authoring `.hmod` modules for production deployment or sharing with the Hotaru community, ensure strict adherence to the following security guidelines:

1. **First-Statement Validation**:
   Never place comments, imports, or variable assignments before `HOTARU = { ... }`. The manifest dictionary must be line 1.

2. **Principle of Least Privilege**:
   Declare only the exact capabilities your module requires. Never request `mt` unless invoking raw `ctx.tg.call(...)` (the 292 contextual methods on `ctx` do NOT require `mt`!). Never request `net` if your module only computes numbers locally. Never request `files` if `state` suffices.

3. **Sandboxed File Paths**:
   When using `capabilities: ['files']`, always write to `/tmp/sandbox/` or temporary files generated by Python's `tempfile` module. Never attempt to traverse into host paths like `/etc` or `/home`.

4. **Safe Credential Handling**:
   Never hardcode bot tokens, API keys, or Telegram authorization hashes directly in source code. Utilize `config_schema` or `ctx.state` so users can configure secrets securely via `.config`.

5. **Non-Blocking Watchers & Tasks**:
   Always yield control back to the event loop. In long-running background tasks, insert cooperative sleeps (`await asyncio.sleep(1)`). In watchers, handle exceptions quietly without blocking the dispatch loop.

6. **Destructive MTProto Calls Prohibited**:
   Never attempt to invoke destructive account-level RPCs (`account.deleteAccount`, `auth.resetAuthorizations`, `messages.deleteAllHistory`). The Hotaru relay firewall will intercept and terminate the offending module immediately.

