export const CONTENT = {
  en: {
    nav: {
      overview: "Overview",
      architecture: "Architecture",
      modules: "Modules",
      docs: "Documentation",
      skill: "Agent Skill",
      github: "GitHub",
      install: "Install",
      downloadSkill: "Get Skill (.md)",
    },
    hero: {
      badge: "SECURITY-FIRST TELEGRAM USERBOT",
      title: "HOTARU",
      subtitle: "A modern Telegram userbot built on GoyGram with Linux namespace isolation and strict capability sandboxing.",
      installTitle: "Interactive one-line installation:",
      copyTooltip: "Copy command",
      copiedTooltip: "Copied to clipboard",
      ctaDocs: "Explore Documentation",
      ctaSkill: "Download Agent Skill",
      ctaGithub: "View Source Code",
      metrics: [
        { label: "Core Engine", value: "GoyGram 0.8.28" },
        { label: "Runtime", value: "Python 3.13+" },
        { label: "Isolation", value: "Linux Namespaces" },
        { label: "Vault", value: "AES-GCM Encrypted" },
      ],
    },
    architecture: {
      sectionTitle: "Security Architecture",
      sectionSubtitle: "Hotaru eliminates attack vectors common in userbots by running untrusted third-party code in unprivileged namespaces.",
      cards: [
        {
          id: "namespaces",
          title: "Linux Namespace Sandboxing",
          tag: "OS Containment",
          description: "Every .hmod module executes inside isolated CLONE_NEWNS, CLONE_NEWIPC, CLONE_NEWUTS, and CLONE_NEWNET namespaces. Processes run as unprivileged user nobody (UID 65534) with an ephemeral tmpfs root. An untrusted script cannot inspect host files, credentials, or parent memory.",
        },
        {
          id: "capabilities",
          title: "Capability Privilege Model",
          tag: "Relay Firewall",
          description: "Modules explicitly declare required capabilities: mt for Telegram MTProto RPC, state for scoped key-value storage, and net for outbound network connections. If net is not declared, the kernel network namespace blocks raw sockets at the kernel boundary.",
        },
        {
          id: "vault",
          title: "Encrypted Master Vault",
          tag: "AES-GCM",
          description: "Telegram auth keys, session strings, and runtime state are kept in an encrypted SQLite vault (sanctuary/hotaru.vault) with key derivation and automatic backup rotation. Sensitive credentials never leak into module environments.",
        },
        {
          id: "goygram",
          title: "GoyGram Core Transport",
          tag: "Native Rust MTProto",
          description: "Hotaru combines an asynchronous Python event loop with GoyGram native Rust cryptography for MTProto serialization and payload encryption, achieving low latency and reduced memory overhead.",
        },
        {
          id: "singularity",
          title: "Singularity Web Dashboard",
          tag: "Mini App UI",
          description: "An embedded web dashboard runs locally on Node.js and Vite, providing metrics, logs, and live module configuration. It connects through Cloudflare Horizon tunnels to function as a native Telegram Mini App.",
        },
        {
          id: "shield",
          title: "Shield FloodWait Guard",
          tag: "Rate Monitoring",
          description: "A sliding-window rate tracking engine monitors Telegram API request frequency. When approaching limits, it pauses outbound calls locally to prevent account bans and temporary flood restrictions.",
        },
      ],
    },
    modules: {
      sectionTitle: "Module Ecosystem (.hmod)",
      sectionSubtitle: "Modules are standard Python 3.13 scripts declaring capabilities, command callbacks, and localized lexicons.",
      tabs: [
        {
          id: "ping",
          title: "Ping & Latency",
          code: `from __future__ import annotations
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
            "pong": "<b>Pong</b> in <code>{ms} ms</code>\\nRAM: <code>{ram}</code>",
        },
        "ru": {
            "pinging": "Замер задержки MTProto...",
            "pong": "<b>Понг</b> за <code>{ms} мс</code>\\nОЗУ: <code>{ram}</code>",
        },
    },
}`,
        },
        {
          id: "notes",
          title: "Encrypted Notes (State)",
          code: `from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def notes_cmd(ctx: ModuleContext) -> None:
    args = ctx.args
    if not args:
        items = ctx.state.get("notes", {})
        if not items:
            await ctx.respond(ctx.t("empty"))
            return
        lines = [f"• <b>{k}</b>: {v}" for k, v in items.items()]
        await ctx.respond("\\n".join(lines))
        return

    sub, name = args[0].lower(), args[1] if len(args) > 1 else ""
    items = dict(ctx.state.get("notes", {}))
    if sub == "set" and len(args) >= 3:
        items[name] = " ".join(args[2:])
        ctx.state.set("notes", items)
        await ctx.respond(ctx.t("saved", name=name))
    elif sub == "del" and name in items:
        del items[name]
        ctx.state.set("notes", items)
        await ctx.respond(ctx.t("deleted", name=name))

HOTARU = {
    "id": "notes",
    "name": "Notes Storage",
    "version": "1.0.0",
    "about": "Persistent note storage using module-scoped state.",
    "commands": {"notes": notes_cmd},
    "capabilities": ["mt", "state"],
    "lexicon": {
        "en": {
            "empty": "No notes stored. Use <code>.notes set [name] [text]</code>",
            "saved": "Note <b>{name}</b> saved.",
            "deleted": "Note <b>{name}</b> deleted.",
        },
        "ru": {
            "empty": "Заметок нет. Используйте <code>.notes set [имя] [текст]</code>",
            "saved": "Заметка <b>{name}</b> сохранена.",
            "deleted": "Заметка <b>{name}</b> удалена.",
        },
    },
}`,
        },
        {
          id: "screen",
          title: "Interactive Screen Form",
          code: `from __future__ import annotations
from hotaru.screens import Screen
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def menu_cmd(ctx: ModuleContext) -> None:
    rows = [
        [
            {"text": "Option A", "callback": on_option_a},
            {"text": "Option B", "callback": on_option_b},
        ],
        [
            {"text": "Close Menu", "action": "close"},
        ]
    ]
    screen = Screen(
        text="<b>Interactive Form</b>\\nSelect an option below:",
        rows=rows,
        rich=True,
    )
    await ctx.screens.show(screen)

HOTARU = {
    "id": "interactive_menu",
    "commands": {"menu": menu_cmd},
    "capabilities": ["mt"],
}`,
        },
      ],
    },
    docs: {
      searchPlaceholder: "Search ArchWiki documentation & ctx methods...",
      tocTitle: "Table of Contents",
      sections: [
        {
          id: "arch-overview",
          title: "1. Architecture Overview",
          content: `Hotaru is designed from the ground up as a security-first Telegram userbot. Unlike traditional userbots that execute arbitrary scripts within the same Python process as the Telegram session, Hotaru isolates every extension into an independent sandbox.

The project structure divides responsibilities into distinct layers:
- hotaru/: Core userbot logic, kernel supervisor, task manager, and encrypted vault storage.
- relay/: Trusted boundary enforcing capability permissions, RPC denylisting, and IPC marshalling.
- constellations/: Built-in system modules implemented as standalone .hmod files.
- sanctuary/: Local user storage containing session files, master encryption keys, and SQLite database. This directory is strictly isolated from third-party modules.`,
        },
        {
          id: "sandbox-spec",
          title: "2. Linux Namespace Sandbox",
          content: `Third-party code runs in dedicated worker processes spawned with four isolation flags:
- CLONE_NEWNS: Unshares the mount table. Critical directories are mounted read-only or hidden. Temporary files use a private tmpfs mount.
- CLONE_NEWIPC: Isolates System V IPC and POSIX message queues.
- CLONE_NEWUTS: Isolates hostname configuration.
- CLONE_NEWNET: Isolates network sockets. If a module does not declare the 'net' capability, network routing is completely disabled.

Privilege dropping:
The worker drops permissions to user nobody (UID 65534), calls prctl(PR_SET_NO_NEW_PRIVS, 1), and communicates with the kernel strictly over UNIX pipes.`,
        },
        {
          id: "hmod-manifest",
          title: "3. The .hmod Manifest Schema",
          content: `Every module exports a dictionary named HOTARU with the following fields:
- id (str): Unique lowercase identifier (e.g. 'echo', 'rss_reader').
- name (str): Display name shown in help listings.
- version (str): Semantic version string (e.g. '1.0.0').
- about (str): Brief summary of what the module does.
- commands (dict[str, Callable]): Mapping of command names to async handler coroutines.
- capabilities (list[str]): Declared permissions: 'mt', 'state', 'net'.
- tasks (dict[str, Callable]): Optional background workers managed by the supervisor.
- lexicon (dict[str, dict[str, str]]): Localized strings organized by language code (en, ru, uk, ja, kz, zh).`,
        },
        {
          id: "capabilities-model",
          title: "4. Capability Permissions Model",
          content: `Hotaru enforces three explicit capabilities:
1. 'mt': Grants Telegram MTProto RPC access via GoyGram. Enables ctx.reply(), ctx.respond(), ctx.edit(), ctx.delete(), ctx.send_file(), and Telegram event listeners.
2. 'state': Grants module-scoped key-value storage backed by an encrypted SQLite database. Other modules cannot access this storage.
3. 'net': Grants outbound HTTP and socket network access via ctx.net() and ctx.stream().

Denylisted Telegram RPC methods:
Calling destructive account methods (account.deleteaccount, account.resetauthorization, account.resetauthorizations) is prohibited and immediately triggers process termination and a security alert.`,
        },
        {
          id: "ctx-api-reference",
          title: "5. ModuleContext (ctx) Complete API Reference",
          content: `Every command handler receives ctx: ModuleContext as its argument. Below is the complete method and property catalog:

Properties:
• ctx.module_id -> str: Identifier of the running module.
• ctx.args -> list[str]: Parsed command arguments.
• ctx.raw_args -> str: Full unparsed argument string following the command.
• ctx.prefix -> str: Active bot command prefix (default: '.').
• ctx.message -> ModuleMessage: Wrapper for the triggering Telegram message.
• ctx.chat_id -> int: Telegram chat ID where the command was executed.
• ctx.sender_id / ctx.user_id -> int: User ID of the message sender.
• ctx.topic_id -> int | None: Forum topic thread ID, if applicable.
• ctx.is_me -> bool: True if the message was sent by the userbot account.
• ctx.out -> bool: True for outgoing messages.
• ctx.uptime -> int: Total bot running time in seconds.
• ctx.memory / ctx.ram -> Memory: Memory diagnostics (.kb, .mb, .gb, .format()).
• ctx.version -> str: Short git commit hash of the Hotaru installation.

Message Operations:
• await ctx.reply(text, parse_mode="HTML", link_preview=True): Replies to the triggering message.
• await ctx.respond(text, parse_mode="HTML", link_preview=True): Edits the message if outgoing, or replies if incoming.
• await ctx.edit(text, parse_mode="HTML", link_preview=True): Edits the current message in place.
• await ctx.delete(): Deletes the triggering message.
• await ctx.pin(both_sides=None, notify=False, pm_oneside=False): Pins the message in the chat.
• await ctx.unpin(): Unpins the message.
• await ctx.react(emoji): Places an emoji or custom emoji reaction.
• await ctx.unreact(): Clears all reactions from the message.
• await ctx.forward_to(to_chat): Forwards the message to another chat.
• await ctx.copy_to(to_chat): Copies content to another chat without author attribution.

Media Operations:
• await ctx.send_file(file, caption=None): Sends a document file.
• await ctx.reply_file(file, caption=None): Sends a document file in reply.
• await ctx.send_photo(photo, caption=None): Sends a photo.
• await ctx.reply_photo(photo, caption=None): Sends a photo in reply.
• await ctx.send_video(video, caption=None): Sends a video.
• await ctx.reply_video(video, caption=None): Sends a video in reply.
• await ctx.send_audio(audio, caption=None): Sends an audio file.
• await ctx.send_voice(voice, caption=None): Sends a voice recording.
• await ctx.send_animation(animation, caption=None): Sends a GIF or looping video.
• await ctx.send_sticker(sticker): Sends a sticker.
• await ctx.send_contact(phone, first_name, last_name=""): Sends a contact card.
• await ctx.download_media(destination=None): Downloads media from the current or replied message.

Polls & Interactive Elements:
• await ctx.send_poll(question, options, multiple_choice=False, quiz=False): Creates a Telegram poll.
• await ctx.close_poll(): Closes an active poll.
• await ctx.vote(options): Casts a vote.
• await ctx.retract_vote(): Withdraws the account's vote.
• await ctx.send_todo(title, items): Creates a checklist.
• await ctx.append_todo(item): Adds an item to a checklist.

State Management (capability: state):
• ctx.state.get(key, default=None): Retrieves a JSON-deserialized value.
• ctx.state.set(key, value): Saves a JSON-serializable value.
• ctx.state.delete(key): Removes a key.
• ctx.state.clear(): Deletes all module keys.
• ctx.state.all() -> dict: Returns all stored pairs.

Network (capability: net):
• await ctx.net(url, method="GET", headers=None, params=None, json=None, timeout=10.0, binary=False): Makes an HTTP request through the relay proxy.
• await ctx.stream(url, headers=None, timeout=None): Opens an asynchronous socket stream.

UI & Screens:
• ctx.screens: Screen engine for multi-step interactive forms.
• await ctx.paginate(content, page=0, limit=4000, rich=True): Splits long text into paginated views with inline navigation buttons.
• ctx.wordmark() -> str: Returns the official styled Hotaru badge for headers.

Internationalization:
• ctx.t(key, default=None, **params): Retrieves localized strings with parameter interpolation.`,
        },
        {
          id: "screens-guide",
          title: "6. Interactive Screens Guide",
          content: `The Hotaru screens engine allows creating stateful inline menus with back-stacks and custom callbacks.

Basic structure:
from hotaru.screens import Screen

async def my_screen(ctx: ModuleContext) -> None:
    rows = [
        [
            {"text": "Action 1", "callback": handle_action_1},
            {"text": "Action 2", "callback": handle_action_2},
        ],
        [
            {"text": "Back", "action": "back"},
            {"text": "Close", "action": "close"},
        ]
    ]
    screen = Screen(
        text="<b>Main Menu</b>\\nSelect an action:",
        rows=rows,
        rich=True
    )
    await ctx.screens.show(screen)`,
        },
        {
          id: "tasks-guide",
          title: "7. Background Supervisor Tasks",
          content: `Background tasks run as persistent asyncio loops monitored by the kernel supervisor.

Task structure:
async def periodic_task(ctx: TaskContext) -> None:
    while not ctx.is_stopping:
        try:
            await perform_work(ctx)
        except Exception as exc:
            ctx.log.error(f"Task failed: {exc}")
        await ctx.sleep(60)

HOTARU = {
    "id": "my_worker",
    "commands": {},
    "capabilities": ["mt"],
    "tasks": {
        "sync": periodic_task,
    },
}`,
        },
        {
          id: "coding-rules",
          title: "8. Quality Rules & Guidelines",
          content: `When writing modules for Hotaru, adhere to the following project guidelines:
1. Zero Comments Policy: No '#' comments are allowed in Python (.py) or module (.hmod) files. Write clean, self-describing code.
2. Localization First: Never hardcode English or Russian messages inside command functions. Put all strings in the module's lexicon dictionary and use ctx.t().
3. Strict Typing: Function signatures and type annotations must pass basedpyright in strict mode without errors.
4. Capability Discipline: Only request capabilities ('mt', 'state', 'net') that your module actually invokes.
5. No Secret Ingestion: Never attempt to read session tokens, master keys, or files outside your allocated tmpfs directory.`,
        },
      ],
    },
    skill: {
      badge: "AI CODING ASSISTANT SKILL",
      title: "Hotaru Agent Skill (SKILL.md)",
      subtitle: "A comprehensive instruction manual for Antigravity, Claude Code, Cursor, and ChatGPT agents to write correct, secure .hmod modules.",
      downloadBtn: "Download SKILL.md",
      previewBtn: "View Specification",
      features: [
        "Complete manifest schema with typed definitions",
        "Every ModuleContext method, signature, and parameter",
        "Zero-comments rule enforcement for Python code",
        "Linux namespace sandbox compliance patterns",
        "Ready-to-use production module templates",
      ],
    },
    footer: {
      copyright: "Hotaru Project. Open-source software released under the MIT License.",
      docsLink: "Documentation",
      githubHotaru: "Hotaru Core",
      githubWeb: "HotaruWeb",
      telegramCommunity: "Telegram",
    },
  },
  ru: {
    nav: {
      overview: "Обзор",
      architecture: "Архитектура",
      modules: "Модули",
      docs: "Документация",
      skill: "Agent Skill",
      github: "GitHub",
      install: "Установка",
      downloadSkill: "Скачать Skill",
    },
    hero: {
      badge: "SECURITY-FIRST TELEGRAM ЮЗЕРБОТ",
      title: "HOTARU",
      subtitle: "Telegram юзербот с архитектурой security-first на базе GoyGram, изоляцией в Linux namespaces и строгой моделью capabilities.",
      installTitle: "Быстрая установка одной командой:",
      copyTooltip: "Скопировать команду",
      copiedTooltip: "Скопировано в буфер",
      ctaDocs: "Перейти к документации",
      ctaSkill: "Скачать Agent Skill",
      ctaGithub: "Исходный код",
      metrics: [
        { label: "Ядро MTProto", value: "GoyGram 0.8.28" },
        { label: "Среда", value: "Python 3.13+" },
        { label: "Изоляция", value: "Linux Namespaces" },
        { label: "Хранилище", value: "AES-GCM Vault" },
      ],
    },
    architecture: {
      sectionTitle: "Архитектура безопасности",
      sectionSubtitle: "Hotaru исключает типичные векторы атак в юзерботах, изолируя сторонний код модулей в непривилегированных пространствах имён.",
      cards: [
        {
          id: "namespaces",
          title: "Песочница Linux Namespaces",
          tag: "Изоляция ОС",
          description: "Каждый модуль .hmod исполняется в изолированных пространствах имён CLONE_NEWNS, CLONE_NEWIPC, CLONE_NEWUTS и CLONE_NEWNET. Процессы запускаются от непривилегированного пользователя nobody (UID 65534) с временным tmpfs. Недоверенный код не может читать файлы хоста, сессии или память ядра.",
        },
        {
          id: "capabilities",
          title: "Модель прав Capabilities",
          tag: "Сетевой фаервол",
          description: "Модули явно декларируют требуемые разрешения: mt для Telegram MTProto RPC, state для изолированного хранилища и net для сетевых подключений. Если net не указан, сетевой стек блокирует сокеты на уровне ядра Linux.",
        },
        {
          id: "vault",
          title: "Шифрованное хранилище Vault",
          tag: "AES-GCM",
          description: "Ключи авторизации Telegram, сессионные строки и состояние хранятся в зашифрованной SQLite базе (sanctuary/hotaru.vault) с автоматической ротацией ключей и резервным копированием. Секреты никогда не попадают в окружение модулей.",
        },
        {
          id: "goygram",
          title: "Движок GoyGram MTProto",
          tag: "Rust MTProto криптография",
          description: "Hotaru объединяет асинхронный цикл Python с нативной Rust-криптографией GoyGram для сериализации MTProto сообщений и шифрования пакетов, обеспечивая минимальную задержку и низкое потребление памяти.",
        },
        {
          id: "singularity",
          title: "Веб-панель Singularity",
          tag: "Telegram Mini App",
          description: "Встроенная веб-панель работает локально на Node.js и Vite, отображая метрики, логи и управление модулями. Подключается через туннели Cloudflare Horizon и доступна как нативный Telegram Mini App.",
        },
        {
          id: "shield",
          title: "Защита Shield FloodWait",
          tag: "Контроль лимитов",
          description: "Модуль Shield отслеживает частоту запросов к API Telegram в скользящем окне. При приближении к лимитам вызовы локально приостанавливаются, защищая аккаунт от банов и флудвейтов.",
        },
      ],
    },
    modules: {
      sectionTitle: "Экосистема модулей (.hmod)",
      sectionSubtitle: "Модули представляют собой стандартные скрипты Python 3.13 с объявлением прав, обработчиков команд и многоязычного лексикона.",
      tabs: [
        {
          id: "ping",
          title: "Пинг и задержка",
          code: `from __future__ import annotations
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
    "name": "Мониторинг пинга",
    "version": "1.0.0",
    "about": "Замеряет задержку MTProto и использование памяти.",
    "commands": {
        "ping": ping_cmd,
    },
    "capabilities": ["mt"],
    "lexicon": {
        "en": {
            "pinging": "Pinging Telegram gateway...",
            "pong": "<b>Pong</b> in <code>{ms} ms</code>\\nRAM: <code>{ram}</code>",
        },
        "ru": {
            "pinging": "Замер задержки MTProto...",
            "pong": "<b>Понг</b> за <code>{ms} мс</code>\\nОЗУ: <code>{ram}</code>",
        },
    },
}`,
        },
        {
          id: "notes",
          title: "Заметки (Хранилище State)",
          code: `from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def notes_cmd(ctx: ModuleContext) -> None:
    args = ctx.args
    if not args:
        items = ctx.state.get("notes", {})
        if not items:
            await ctx.respond(ctx.t("empty"))
            return
        lines = [f"• <b>{k}</b>: {v}" for k, v in items.items()]
        await ctx.respond("\\n".join(lines))
        return

    sub, name = args[0].lower(), args[1] if len(args) > 1 else ""
    items = dict(ctx.state.get("notes", {}))
    if sub == "set" and len(args) >= 3:
        items[name] = " ".join(args[2:])
        ctx.state.set("notes", items)
        await ctx.respond(ctx.t("saved", name=name))
    elif sub == "del" and name in items:
        del items[name]
        ctx.state.set("notes", items)
        await ctx.respond(ctx.t("deleted", name=name))

HOTARU = {
    "id": "notes",
    "name": "Заметки",
    "version": "1.0.0",
    "about": "Хранение заметок в изолированном пространстве модуля.",
    "commands": {"notes": notes_cmd},
    "capabilities": ["mt", "state"],
    "lexicon": {
        "en": {
            "empty": "No notes stored. Use <code>.notes set [name] [text]</code>",
            "saved": "Note <b>{name}</b> saved.",
            "deleted": "Note <b>{name}</b> deleted.",
        },
        "ru": {
            "empty": "Заметок нет. Используйте <code>.notes set [имя] [текст]</code>",
            "saved": "Заметка <b>{name}</b> сохранена.",
            "deleted": "Заметка <b>{name}</b> удалена.",
        },
    },
}`,
        },
        {
          id: "screen",
          title: "Интерактивная экранная форма",
          code: `from __future__ import annotations
from hotaru.screens import Screen
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def menu_cmd(ctx: ModuleContext) -> None:
    rows = [
        [
            {"text": "Пункт А", "callback": on_option_a},
            {"text": "Пункт Б", "callback": on_option_b},
        ],
        [
            {"text": "Закрыть меню", "action": "close"},
        ]
    ]
    screen = Screen(
        text="<b>Интерактивная форма</b>\\nВыберите действие:",
        rows=rows,
        rich=True,
    )
    await ctx.screens.show(screen)

HOTARU = {
    "id": "interactive_menu",
    "commands": {"menu": menu_cmd},
    "capabilities": ["mt"],
}`,
        },
      ],
    },
    docs: {
      searchPlaceholder: "Поиск по ArchWiki документации и методам ctx...",
      tocTitle: "Содержание",
      sections: [
        {
          id: "arch-overview",
          title: "1. Архитектурный обзор",
          content: `Hotaru спроектирован с нуля с упором на безопасность. В отличие от стандартных юзерботов, исполняющих сторонние скрипты в том же процессе, где лежат сессии Telegram, Hotaru изолирует каждое расширение в отдельной песочнице.

Структура проекта:
- hotaru/: Ядро юзербота, супервизор задач, хранилище vault и диспетчер.
- relay/: Доверенная граница, проверяющая capabilities, деструктивные RPC и изоляцию.
- constellations/: Встроенные системные модули в формате .hmod.
- sanctuary/: Локальное хранилище данных пользователя (сессии, мастер-ключ, SQLite база). Модули не имеют доступа к этой директории.`,
        },
        {
          id: "sandbox-spec",
          title: "2. Песочница Linux Namespaces",
          content: `Сторонний код исполняется в изолированных процессах с четырьмя флагами изоляции:
- CLONE_NEWNS: Личное пространство монтирования. Системные каталоги защищены от записи, а рабочий каталог размещается в эфемерном tmpfs.
- CLONE_NEWIPC: Изоляция очередей сообщений и System V IPC.
- CLONE_NEWUTS: Изолированное имя хоста.
- CLONE_NEWNET: Изоляция сети. Если capability 'net' не запрошена, сетевые сокеты заблокированы на уровне ядра.

Сброс привилегий:
Процесс модуля переключается на пользователя nobody (UID 65534), применяет prctl(PR_SET_NO_NEW_PRIVS, 1) и общается с ядром через однонаправленные UNIX-пайпы.`,
        },
        {
          id: "hmod-manifest",
          title: "3. Спецификация манифеста .hmod",
          content: `Каждый модуль экспортирует словарь HOTARU со следующими полями:
- id (str): Уникальный идентификатор в нижнем регистре (например, 'echo', 'rss_reader').
- name (str): Человекочитаемое имя для меню help.
- version (str): Версия модуля по semver (например, '1.0.0').
- about (str): Краткое описание возможностей модуля.
- commands (dict[str, Callable]): Словарь команд и их асинхронных обработчиков.
- capabilities (list[str]): Требуемые права: 'mt', 'state', 'net'.
- tasks (dict[str, Callable]): Фоновые задачи под управлением супервизора.
- lexicon (dict[str, dict[str, str]]): Словари переводов по кодам языков (ru, en, uk, ja, kz, zh).`,
        },
        {
          id: "capabilities-model",
          title: "4. Модель прав Capabilities",
          content: `Hotaru поддерживает три явно объявляемых разрешения:
1. 'mt': Доступ к Telegram MTProto RPC через GoyGram. Разрешает ctx.reply(), ctx.respond(), ctx.edit(), ctx.delete(), ctx.send_file() и обработку событий.
2. 'state': Изолированное хранилище ключ-значение в зашифрованной SQLite базе. Другие модули не могут получить к нему доступ.
3. 'net': Доступ в интернет через методы ctx.net() и ctx.stream().

Запрещённые RPC методы:
Вызовы деструктивных методов аккаунта (account.deleteaccount, account.resetauthorization, account.resetauthorizations) строго запрещены и приводят к экстренной остановке модуля и генерации security alert.`,
        },
        {
          id: "ctx-api-reference",
          title: "5. Полный справочник API ModuleContext (ctx)",
          content: `Каждый обработчик команды принимает ctx: ModuleContext в качестве единственного аргумента:

Свойства:
• ctx.module_id -> str: Идентификатор активного модуля.
• ctx.args -> list[str]: Разобранные аргументы команды.
• ctx.raw_args -> str: Полная строка аргументов после команды.
• ctx.prefix -> str: Текущий префикс команд (по умолчанию: '.').
• ctx.message -> ModuleMessage: Объект сообщения, вызвавшего команду.
• ctx.chat_id -> int: Числовой ID чата Telegram.
• ctx.sender_id / ctx.user_id -> int: ID пользователя-отправителя.
• ctx.topic_id -> int | None: ID треда/топика в форумах.
• ctx.is_me -> bool: True, если сообщение отправлено этим юзерботом.
• ctx.out -> bool: True для исходящих сообщений.
• ctx.uptime -> int: Время аптайма в секундах.
• ctx.memory / ctx.ram -> Memory: Данные об оперативной памяти (.kb, .mb, .gb, .format()).
• ctx.version -> str: Хэш коммита установленной версии Hotaru.

Операции с сообщениями:
• await ctx.reply(text, parse_mode="HTML", link_preview=True): Отвечает на сообщение.
• await ctx.respond(text, parse_mode="HTML", link_preview=True): Редактирует сообщение, если оно исходящее, или отвечает, если входящее.
• await ctx.edit(text, parse_mode="HTML", link_preview=True): Редактирует сообщение на месте.
• await ctx.delete(): Удаляет исходное сообщение.
• await ctx.pin(both_sides=None, notify=False, pm_oneside=False): Закрепляет сообщение.
• await ctx.unpin(): Открепляет сообщение.
• await ctx.react(emoji): Ставит реакцию (эмодзи или кастомный эмодзи).
• await ctx.unreact(): Снимает реакции пользователя с сообщения.
• await ctx.forward_to(to_chat): Пересылает сообщение в другой чат.
• await ctx.copy_to(to_chat): Копирует сообщение без указания автора.

Работа с медиа:
• await ctx.send_file(file, caption=None): Отправляет файл-документ.
• await ctx.reply_file(file, caption=None): Отправляет файл ответом.
• await ctx.send_photo(photo, caption=None): Отправляет фотографию.
• await ctx.reply_photo(photo, caption=None): Отправляет фото ответом.
• await ctx.send_video(video, caption=None): Отправляет видеозапись.
• await ctx.reply_video(video, caption=None): Отправляет видео ответом.
• await ctx.send_audio(audio, caption=None): Отправляет аудиофайл.
• await ctx.send_voice(voice, caption=None): Отправляет голосовое сообщение.
• await ctx.send_animation(animation, caption=None): Отправляет GIF анимацию.
• await ctx.send_sticker(sticker): Отправляет стикер.
• await ctx.send_contact(phone, first_name, last_name=""): Отправляет карточку контакта.
• await ctx.download_media(destination=None): Скачивает вложение из текущего сообщения.

Опросы и задачи:
• await ctx.send_poll(question, options, multiple_choice=False, quiz=False): Создаёт опрос.
• await ctx.close_poll(): Закрывает опрос.
• await ctx.vote(options): Голосует в опросе.
• await ctx.retract_vote(): Отзывает голос.
• await ctx.send_todo(title, items): Создаёт чек-лист.
• await ctx.append_todo(item): Добавляет пункт в чек-лист.

Хранилище состояния (capability: state):
• ctx.state.get(key, default=None): Читает значение (десериализуется из JSON).
• ctx.state.set(key, value): Сохраняет сериализуемое значение.
• ctx.state.delete(key): Удаляет ключ.
• ctx.state.clear(): Очищает всё хранилище модуля.
• ctx.state.all() -> dict: Возвращает все пары ключ-значение.

Сеть (capability: net):
• await ctx.net(url, method="GET", headers=None, params=None, json=None, timeout=10.0, binary=False): Выполняет сетевой запрос через прокси релея.
• await ctx.stream(url, headers=None, timeout=None): Открывает потоковый сокет.

Экранные формы и интерфейс:
• ctx.screens: Движок интерактивных форм и меню.
• await ctx.paginate(content, page=0, limit=4000, rich=True): Разбивает длинный текст на страницы с кнопками перехода.
• ctx.wordmark() -> str: Возвращает фирменный логотип Hotaru для шапки сообщений.

Локализация:
• ctx.t(key, default=None, **params): Возвращает переведённую строку с подстановкой параметров.`,
        },
        {
          id: "screens-guide",
          title: "6. Руководство по интерактивным экранам",
          content: `Движок экранов Hotaru позволяет создавать кнопочные меню со стеком возврата назад и кастомными обработчиками.

Пример структуры экрана:
from hotaru.screens import Screen

async def my_screen(ctx: ModuleContext) -> None:
    rows = [
        [
            {"text": "Действие 1", "callback": handle_action_1},
            {"text": "Действие 2", "callback": handle_action_2},
        ],
        [
            {"text": "Назад", "action": "back"},
            {"text": "Закрыть", "action": "close"},
        ]
    ]
    screen = Screen(
        text="<b>Главное меню</b>\\nВыберите действие:",
        rows=rows,
        rich=True
    )
    await ctx.screens.show(screen)`,
        },
        {
          id: "tasks-guide",
          title: "7. Фоновые задачи супервизора",
          content: `Фоновые задачи работают как постоянные корутины под наблюдением супервизора ядра.

Пример задачи:
async def periodic_task(ctx: TaskContext) -> None:
    while not ctx.is_stopping:
        try:
            await perform_work(ctx)
        except Exception as exc:
            ctx.log.error(f"Ошибка в задаче: {exc}")
        await ctx.sleep(60)

HOTARU = {
    "id": "my_worker",
    "commands": {},
    "capabilities": ["mt"],
    "tasks": {
        "sync": periodic_task,
    },
}`,
        },
        {
          id: "coding-rules",
          title: "8. Правила качества и код-стиль",
          content: `При написании модулей обязательно соблюдайте следующие правила:
1. Правило нулевых комментариев: В коде Python (.py) и модулей (.hmod) категорически запрещены комментарии через '#'. Пишите понятный самодокументируемый код.
2. Локализация: Не хардкодьте строки на русском или английском в коде. Помещайте их в словарь lexicon модуля и вызывайте через ctx.t().
3. Строгая типизация: Код должен проходить проверку basedpyright в режиме strict без предупреждений и ошибок.
4. Минимальные права: Запрашивайте только те capabilities ('mt', 'state', 'net'), которые реально используются.
5. Защита секретов: Никогда не пытайтесь читать сессии, мастер-ключи или файлы вне изолированного tmpfs каталога.`,
        },
      ],
    },
    skill: {
      badge: "SKILL ДЛЯ AI-АГЕНТОВ",
      title: "Hotaru Agent Skill (SKILL.md)",
      subtitle: "Полная инструкция для агентов Antigravity, Claude Code, Cursor и ChatGPT для безошибочного создания модулей .hmod.",
      downloadBtn: "Скачать SKILL.md",
      previewBtn: "Открыть спецификацию",
      features: [
        "Полная схема манифеста с типизированными определениями",
        "Каждый метод ModuleContext с сигнатурами и аргументами",
        "Соблюдение правила отсутствия комментариев в коде",
        "Соответствие требованиям песочницы Linux Namespaces",
        "Готовые шаблоны модулей для продакшена",
      ],
    },
    footer: {
      copyright: "Hotaru Project. Открытое программное обеспечение под лицензией MIT.",
      docsLink: "Документация",
      githubHotaru: "Hotaru Core",
      githubWeb: "HotaruWeb",
      telegramCommunity: "Telegram",
    },
  },
};
