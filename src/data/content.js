import { DOCS_EN, DOCS_RU } from './docs.js';

export const CONTENT = {
  en: {
    nav: {
      overview: "Overview",
      architecture: "Features",
      docs: "Documentation",
      skill: "Agent Guide",
      github: "GitHub",
      install: "Install",
      downloadSkill: "Download Guide",
    },
    hero: {
      title: "Hotaru",
      subtitle: "Modular Telegram userbot powered by GoyGram with safe plugin sandboxing.",
      installTitle: "Installation command:",
      copyTooltip: "Copy command",
      copiedTooltip: "Copied to clipboard",
      copyBtn: "Copy",
      copiedBtn: "Copied",
      ctaDocs: "Documentation",
      ctaSkill: "Agent Guide (SKILL.md)",
      ctaGithub: "Source Code",
    },
    architecture: {
      sectionTitle: "How Hotaru Works",
      sectionSubtitle: "Hotaru runs third-party plugins in isolated worker processes to keep your account safe.",
      cards: [
        {
          id: "namespaces",
          title: "Process Isolation",
          description: "Every plugin runs inside its own isolated worker process. Third-party scripts cannot access your host filesystem, inspect other processes, or spy on parent memory.",
        },
        {
          id: "capabilities",
          title: "Permission Controls",
          description: "Plugins explicitly declare what they need: Telegram API calls, local storage, or internet access. If a plugin does not declare internet access, raw network calls are blocked.",
        },
        {
          id: "vault",
          title: "Protected Storage",
          description: "Login credentials, account tokens, and session databases are kept in an encrypted local vault. Third-party plugins never see your secret keys.",
        },
        {
          id: "goygram",
          title: "Fast MTProto Core",
          description: "Combines Python 3.13 with GoyGram's Rust engine for low latency, instant message delivery, and minimal RAM consumption.",
        },
        {
          id: "singularity",
          title: "Web Control Panel",
          description: "An optional web dashboard runs locally to view logs, check system metrics, and configure installed plugins directly from your browser.",
        },
        {
          id: "shield",
          title: "Flood Protection",
          description: "Monitors Telegram request rates in real time and pauses outgoing traffic when limits are close, preventing temporary account bans.",
        },
      ],
    },
    docs: {
      title: "Developer Manual",
      subtitle: "Complete documentation for building, loading via .ld, and managing plugins in Telegram.",
      openDocsBtn: "Open Documentation",
      openCatalogBtn: "Browse 292 Methods",
      cards: [
        {
          title: "Loading & Management",
          desc: "Send a .hmod file to Telegram and reply with .ld. Hot-reload with .rl, unload with .ul, and inspect active plugins with .mods.",
        },
        {
          title: "Manifest Schema",
          desc: "First-statement HOTARU manifest declaration, command triggers, permissions, and optional typing support.",
        },
        {
          title: "Context & 292 Methods",
          desc: "292 MTProto methods directly on ctx with smart defaults for current chat and message.",
        },
        {
          title: "State, Screens & Tasks",
          desc: "Interactive Telegram menus via ctx.screens, SQLite storage via ctx.state, and supervised background tasks.",
        },
      ],
      searchPlaceholder: "Search developer reference & methods...",
      tocTitle: "Chapters",
      sections: DOCS_EN,
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
      architecture: "Возможности",
      docs: "Документация",
      skill: "Инструкция для ИИ",
      github: "GitHub",
      install: "Установка",
      downloadSkill: "Скачать инструкцию",
    },
    hero: {
      title: "Hotaru",
      subtitle: "Модульный юзербот для Telegram на GoyGram с безопасной песочницей плагинов.",
      installTitle: "Команда установки:",
      copyTooltip: "Скопировать команду",
      copiedTooltip: "Скопировано в буфер",
      copyBtn: "Скопировать",
      copiedBtn: "Скопировано",
      ctaDocs: "Документация",
      ctaSkill: "Инструкция для ИИ (SKILL.md)",
      ctaGithub: "Исходный код",
    },
    architecture: {
      sectionTitle: "Как устроен Hotaru",
      sectionSubtitle: "Hotaru запускает сторонние плагины в изолированных процессах, защищая ваш аккаунт и систему.",
      cards: [
        {
          id: "namespaces",
          title: "Изоляция процессов",
          description: "Каждый плагин работает в отдельном процессе с временной файловой системой. Недоверенный код не имеет доступа к системным файлам хоста и чужой памяти.",
        },
        {
          id: "capabilities",
          title: "Контроль разрешений",
          description: "Плагины явно объявляют нужные права: доступ к Telegram API, локальной базе или интернету. Без разрешения плагин физически не может отправлять сетевые запросы.",
        },
        {
          id: "vault",
          title: "Защищенное хранилище",
          description: "Ключи авторизации Telegram, сессии и важные данные хранятся в защищенном локальном хранилище. Сторонние плагины не имеют доступа к вашим секретам.",
        },
        {
          id: "goygram",
          title: "Быстрое ядро MTProto",
          description: "Сочетание Python 3.13 и движка GoyGram обеспечивает быструю доставку сообщений, минимальные задержки и низкое потребление оперативной памяти.",
        },
        {
          id: "singularity",
          title: "Панель управления",
          description: "Локальный веб-интерфейс позволяет просматривать системные логи, следить за нагрузкой и настраивать плагины прямо в браузере.",
        },
        {
          id: "shield",
          title: "Защита от флуда",
          description: "Отслеживает частоту запросов к серверам Telegram в реальном времени и вовремя притормаживает вызовы, защищая аккаунт от ограничений.",
        },
      ],
    },
    docs: {
      title: "Руководство по разработке",
      subtitle: "Полная документация по созданию, быстрой загрузке через .ld и управлению плагинами.",
      openDocsBtn: "Открыть документацию",
      openCatalogBtn: "Все 292 метода API",
      cards: [
        {
          title: "Загрузка и управление",
          desc: "Отправьте .hmod файл в чат и ответьте командой .ld. Перезагрузка через .rl, выгрузка через .ul и список через .mods.",
        },
        {
          title: "Схема манифеста",
          desc: "Правило первой строки HOTARU, привязка команд, запрашиваемые разрешения и опциональная типизация.",
        },
        {
          title: "Контекст и 292 метода",
          desc: "292 встроенных метода MTProto прямо на объекте ctx с автоподстановкой текущего чата и сообщения.",
        },
        {
          title: "База данных, экраны и задачи",
          desc: "Интерактивные меню в Telegram через ctx.screens, SQLite хранилище ctx.state и фоновые задачи tasks.",
        },
      ],
      searchPlaceholder: "Поиск по руководству и методам...",
      tocTitle: "Разделы",
      sections: DOCS_RU,
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
