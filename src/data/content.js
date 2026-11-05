import { DOCS_EN, DOCS_RU } from './docs.js';

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
      badge: "Telegram юзербот • Python 3.13",
      title: "Hotaru",
      subtitle: "Модульный юзербот для Telegram на GoyGram с изолированными процессами и песочницей.",
      installTitle: "Команда установки:",
      copyTooltip: "Copy command",
      copiedTooltip: "Copied to clipboard",
      ctaDocs: "Документация",
      ctaSkill: "Инструкция для ИИ (SKILL.md)",
      ctaGithub: "Исходный код",
      metrics: [
        { label: "Core Engine", value: "GoyGram 0.8.28" },
        { label: "Runtime", value: "Python 3.13+" },
        { label: "Isolation", value: "Linux Namespaces" },
        { label: "Vault", value: "AES-GCM Encrypted" },
      ],
    },
    architecture: {
      sectionTitle: "Архитектура и изоляция",
      sectionSubtitle: "Сторонние модули исполняются в изолированных процессах без прямого доступа к хосту.",
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
      sectionTitle: "Примеры модулей .hmod",
      sectionSubtitle: "Готовые скрипты на Python, которые можно загрузить прямо в чате через .ld.",
      tabs: [
        {
          id: "qr",
          title: "QR Generator (Net)",
          code: `from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def qr_cmd(ctx: ModuleContext) -> None:
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
    "about": "Renders high resolution QR codes directly in chat.",
    "commands": {
        "qr": qr_cmd,
    },
    "capabilities": ["mt", "net"],
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
      badge: "Документация",
      title: "Руководство по разработке модулей",
      subtitle: "Подробное руководство по созданию, загрузке через .ld и вызову методов контекста.",
      openDocsBtn: "Открыть документацию",
      openCatalogBtn: "292 метода API",
      cards: [
        {
          title: "Module Loading & Lifecycle",
          desc: "Load scripts live in chat via .ld, hot reload with .rl, unload with .ul, export with .ex, and reset database with .resetdb.",
          tag: "Lifecycle",
        },
        {
          title: "HOTARU Manifest & Dynamic Execution",
          desc: "First-statement manifest rule, optional Python typing, command handlers, arguments, and return rules.",
          tag: "Manifest",
        },
        {
          title: "Context & Extended MTProto API",
          desc: "292 dynamically generated MTProto methods on ctx with smart defaults ($peer, $message) and full return schemas.",
          tag: "292 Methods",
        },
        {
          title: "Screens, State & Background Tasks",
          desc: "Interactive Telegram UI forms via ctx.screens, persistent SQLite state via ctx.state, and periodic background tasks.",
          tag: "Sandboxed APIs",
        },
      ],
      searchPlaceholder: "Search developer reference & ctx methods...",
      tocTitle: "Table of Contents",
      sections: DOCS_EN,
    },
    skill: {
      badge: "Инструкция для ИИ",
      title: "Инструкция для AI-агентов (SKILL.md)",
      subtitle: "Файл инструкций для Claude, Cursor, ChatGPT и Antigravity для создания корректных .hmod модулей.",
      downloadBtn: "Скачать SKILL.md",
      previewBtn: "Смотреть спецификацию",
      features: [
        "Complete manifest schema with typed definitions",
        "Every ModuleContext method, signature, and parameter",
        "Zero-comments rule enforcement for Python code",
        "Linux namespace sandbox compliance patterns",
        "Ready-to-use production module templates",
      ],
    },
    footer: {
      copyright: "Hotaru Project. Open-source software released under the GNU AGPLv3 License.",
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
      badge: "Telegram юзербот • Python 3.13",
      title: "Hotaru",
      subtitle: "Модульный юзербот для Telegram на GoyGram с изолированными процессами и песочницей.",
      installTitle: "Команда установки:",
      copyTooltip: "Скопировать команду",
      copiedTooltip: "Скопировано в буфер",
      ctaDocs: "Документация",
      ctaSkill: "Инструкция для ИИ (SKILL.md)",
      ctaGithub: "Исходный код",
      metrics: [
        { label: "Ядро MTProto", value: "GoyGram 0.8.28" },
        { label: "Среда", value: "Python 3.13+" },
        { label: "Изоляция", value: "Linux Namespaces" },
        { label: "Хранилище", value: "AES-GCM Vault" },
      ],
    },
    architecture: {
      sectionTitle: "Архитектура и изоляция",
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
      sectionTitle: "Примеры модулей .hmod",
      sectionSubtitle: "Модули представляют собой стандартные скрипты Python 3.13 с объявлением прав, обработчиков команд и многоязычного лексикона.",
      tabs: [
        {
          id: "qr",
          title: "Генератор QR (Net)",
          code: `from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from hotaru.response import ModuleContext

async def qr_cmd(ctx: ModuleContext) -> None:
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
    "about": "Генерация QR-кодов прямо в чате.",
    "commands": {
        "qr": qr_cmd,
    },
    "capabilities": ["mt", "net"],
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
      badge: "ПОРТАЛ РАЗРАБОТЧИКА",
      title: "Руководство по разработке модулей",
      subtitle: "Подробное руководство по созданию, загрузке через .ld и вызову методов контекста.",
      openDocsBtn: "Открыть документацию",
      openCatalogBtn: "292 метода API",
      cards: [
        {
          title: "Загрузка модулей и жизненный цикл",
          desc: "Загрузка модулей на лету через .ld, горячая перезагрузка .rl, выгрузка .ul, экспорт .ex и сброс базы .resetdb.",
          tag: "Жизненный цикл",
        },
        {
          title: "Манифест HOTARU и динамика",
          desc: "Правило первого выражения в файле, опциональная типизация Python, обработчики команд, аргументы и ответы.",
          tag: "Манифест",
        },
        {
          title: "Контекст и расширенный MTProto API",
          desc: "292 динамических MTProto-метода в объекте ctx со смарт-подстановками ($peer, $message) и схемами возвращаемых данных.",
          tag: "292 метода",
        },
        {
          title: "Интерактивные экраны, состояние и задачи",
          desc: "Интерактивные UI-формы Telegram через ctx.screens, изолированное SQLite-состояние ctx.state и фоновые задачи tasks.",
          tag: "Песочница",
        },
      ],
      searchPlaceholder: "Поиск по документации и методам ctx...",
      tocTitle: "Содержание",
      sections: DOCS_RU,
    },
    skill: {
      badge: "Инструкция для ИИ",
      title: "Инструкция для AI-агентов (SKILL.md)",
      subtitle: "Файл инструкций для Claude, Cursor, ChatGPT и Antigravity для создания корректных .hmod модулей.",
      downloadBtn: "Скачать SKILL.md",
      previewBtn: "Смотреть спецификацию",
      features: [
        "Полная схема манифеста с типизированными определениями",
        "Каждый метод ModuleContext с сигнатурами и аргументами",
        "Соблюдение правила отсутствия комментариев в коде",
        "Соответствие требованиям песочницы Linux Namespaces",
        "Готовые шаблоны модулей для продакшена",
      ],
    },
    footer: {
      copyright: "Hotaru Project. Открытое программное обеспечение под лицензией GNU AGPLv3.",
      docsLink: "Документация",
      githubHotaru: "Hotaru Core",
      githubWeb: "HotaruWeb",
      telegramCommunity: "Telegram",
    },
  },
};
