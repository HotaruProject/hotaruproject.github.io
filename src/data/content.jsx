import { DOCS_EN, DOCS_RU } from './docs.jsx';

const COMMANDS_EN = [
  { cmd: '.help', module: 'help', desc: 'Module catalog and help cards' },
  { cmd: '.ping', module: 'info', desc: 'Gateway latency and connection health' },
  { cmd: '.dash', module: 'singularity', desc: 'Panel link and Telegram Mini App' },
  { cmd: '.addaccount', module: 'accounts', desc: 'Add an account to the pool' },
  { cmd: '.shield', module: 'shield', desc: 'API rates and flood protection' },
  { cmd: '.config', module: 'settings', desc: 'Runtime settings, aliases, prefix' },
  { cmd: '.backup', module: 'backups', desc: 'Encrypted copy of state and sessions' },
  { cmd: '.restart', module: 'power', desc: 'Restart the kernel and its modules' },
];

const COMMANDS_RU = [
  { cmd: '.help', module: 'help', desc: 'Каталог модулей и карточки команд' },
  { cmd: '.ping', module: 'info', desc: 'Задержка шлюза и состояние соединения' },
  { cmd: '.dash', module: 'singularity', desc: 'Ссылка на панель и Mini App' },
  { cmd: '.addaccount', module: 'accounts', desc: 'Добавить аккаунт в пул' },
  { cmd: '.shield', module: 'shield', desc: 'Частота вызовов API и защита от флуда' },
  { cmd: '.config', module: 'settings', desc: 'Настройки, алиасы и префикс' },
  { cmd: '.backup', module: 'backups', desc: 'Зашифрованная копия состояния и сессий' },
  { cmd: '.restart', module: 'power', desc: 'Перезапуск ядра и модулей' },
];

const INSTALL_EN = [
  {
    id: 'script',
    label: 'Installer',
    note: 'Setup wizard: packages, credentials, deployment.',
    code: 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash',
  },
  {
    id: 'compose',
    label: 'Docker Compose',
    note: 'The sandbox is already wired into the manifests.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\ndocker compose run --rm hotaru\ndocker compose up -d',
  },
  {
    id: 'lxc',
    label: 'Proxmox LXC',
    note: 'A container with unconfined nesting.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nbash lxc/create.sh',
  },
  {
    id: 'manual',
    label: 'Manual with uv',
    note: 'Clone, sync, run the wizard.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nuv sync\nuv run python -m hotaru',
  },
];

const INSTALL_RU = [
  {
    id: 'script',
    label: 'Установщик',
    note: 'Мастер: пакеты, данные Telegram, развёртывание.',
    code: 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash',
  },
  {
    id: 'compose',
    label: 'Docker Compose',
    note: 'Песочница уже встроена в манифесты.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\ndocker compose run --rm hotaru\ndocker compose up -d',
  },
  {
    id: 'lxc',
    label: 'Proxmox LXC',
    note: 'Контейнер с unconfined nesting.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nbash lxc/create.sh',
  },
  {
    id: 'manual',
    label: 'Вручную через uv',
    note: 'Клонировать, собрать окружение, запустить мастер.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nuv sync\nuv run python -m hotaru',
  },
];

export const CONTENT = {
  en: {
    nav: {
      overview: 'Overview',
      architecture: 'Isolation',
      docs: 'Documentation',
      skill: 'Agent Guide',
      github: 'GitHub',
      install: 'Install',
      downloadSkill: 'Download Guide',
      modules: 'Modules',
      run: 'Run it',
    },
    hero: {
      eyebrow: 'MTProto · 15 modules · Linux sandbox',
      title: 'Hotaru',
      subtitle: 'Every module runs sandboxed. Your session, keys and network stay in the kernel.',
      installTitle: 'Install',
      copyTooltip: 'Copy command',
      copiedTooltip: 'Copied to clipboard',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      ctaDocs: 'Read the manual',
      ctaSkill: 'Agent guide',
      ctaGithub: 'Source code',
      spec: ['292 MTProto methods', '15 modules', '5 capability gates', 'AGPL-3.0'],
    },
    jail: {
      kicker: 'Isolation',
      title: 'The sandbox',
      subtitle: 'Every worker gets its own sandbox and nothing else.',
      points: [
        {
          title: 'Four namespaces',
          desc: 'CLONE_NEWNS, NEWIPC, NEWUTS, NEWNET: private mount, IPC, hostname and network.',
        },
        {
          title: 'Nothing to read',
          desc: 'A private tmpfs. The host filesystem does not exist for the worker.',
        },
        {
          title: 'No owner',
          desc: 'Workers drop to uid 65534. The session stays in the kernel.',
        },
        {
          title: 'Pipes, not sockets',
          desc: 'Kernel and worker talk over UNIX pipes.',
        },
      ],
      diagram: {
        telegram: 'Telegram',
        kernel: 'Hotaru kernel',
        kernelSub: 'Python 3.13 · session keys',
        worker: 'Module worker',
        workerSub: 'CLONE_NEWNS · NEWIPC · NEWUTS · NEWNET',
        tmpfs: 'private tmpfs',
        uid: 'uid 65534 nobody',
        pipe: 'UNIX pipe',
        vault: 'Encrypted vault',
        vaultSub: 'AES-GCM · sanctuary/hotaru.vault',
        caption: 'Network access only if the manifest asks for it.',
        details: {
          telegram: 'The account and its session. They never cross into the worker.',
          kernel: 'Python 3.13. Holds the session keys and the vault.',
          vault: 'AES-GCM encrypted, in the sanctuary. The kernel is the only reader.',
          worker: 'Its own process, its own tmpfs, no owner.',
        },
      },
    },
    capabilities: {
      title: 'Capability gates',
      subtitle: 'A module declares what it needs. The kernel grants it, the jail enforces it.',
      aside: 'Ten capabilities. logs and fetch are always on, the other eight must be declared.',
      cols: { id: 'capability', grant: 'grants', enforce: 'enforced by' },
      usedBy: 'declared by',
    },
    modules: {
      kicker: 'Modules',
      title: 'Fifteen modules',
      subtitle: 'A .hmod file with a manifest, its own commands and a capability list.',
      note: 'Versions from develop.',
      manifestTitle: 'manifest',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      failedBtn: 'Copy failed',
      pickLabel: 'Show the manifest of',
    },
    run: {
      kicker: 'Run it',
      title: 'Eight commands, one install line',
      subtitle: 'Send them from your own account in any chat.',
      installTitle: 'Four ways to install',
      copyCmd: 'Copy the command',
      copiedCmd: 'Copied',
      failedCmd: 'Copy failed',
      requirements: 'Linux x86_64 or aarch64 · Python 3.13 · API ID, API Hash, BotFather token · uv',
    },
    docs: {
      title: 'Developer manual',
      subtitle: 'How to write a .hmod and run it in Telegram.',
      openDocsBtn: 'Open documentation',
      openCatalogBtn: 'Browse 292 methods',
      cards: [
        {
          title: 'Loading and management',
          desc: 'Send a .hmod to Telegram and reply .ld. Reload .rl, unload .ul, export .ex, catalog .help.',
        },
        {
          title: 'Manifest schema',
          desc: 'HOTARU on the first line, command triggers, permissions, optional typing.',
        },
        {
          title: 'Context and 292 methods',
          desc: '292 MTProto methods on ctx, with the current chat and message filled in.',
        },
        {
          title: 'State, screens, tasks',
          desc: 'Menus via ctx.screens, storage via ctx.state, background tasks.',
        },
      ],
      searchPlaceholder: 'Search the reference and the methods',
      tocTitle: 'Chapters',
      sections: DOCS_EN,
    },
    footer: {
      copyright: 'Hotaru Project. AGPL-3.0.',
      docsLink: 'Documentation',
      githubHotaru: 'Hotaru',
      githubWeb: 'HotaruWeb',
      telegramCommunity: 'Telegram',
    },
  },
  ru: {
    nav: {
      overview: 'Обзор',
      architecture: 'Изоляция',
      docs: 'Документация',
      skill: 'Инструкция для ИИ',
      github: 'GitHub',
      install: 'Установка',
      downloadSkill: 'Скачать инструкцию',
      modules: 'Модули',
      run: 'Запуск',
    },
    hero: {
      eyebrow: 'MTProto · 15 модулей · песочница Linux',
      title: 'Hotaru',
      subtitle: 'Каждый модуль в песочнице. Сессия, ключи и сеть остаются в ядре.',
      installTitle: 'Установка',
      copyTooltip: 'Скопировать команду',
      copiedTooltip: 'Скопировано в буфер',
      copyBtn: 'Скопировать',
      copiedBtn: 'Скопировано',
      ctaDocs: 'Открыть руководство',
      ctaSkill: 'Инструкция для ИИ',
      ctaGithub: 'Исходный код',
      spec: ['292 метода MTProto', '15 модулей', '5 владений', 'AGPL-3.0'],
    },
    jail: {
      kicker: 'Изоляция',
      title: 'Песочница',
      subtitle: 'Каждому воркеру достаётся своя песочница и ничего больше.',
      points: [
        {
          title: 'Четыре namespace',
          desc: 'CLONE_NEWNS, NEWIPC, NEWUTS, NEWNET: личные монтирование, IPC, имя хоста и сеть.',
        },
        {
          title: 'Читать нечего',
          desc: 'Личная tmpfs. Файловой системы хоста для воркера не существует.',
        },
        {
          title: 'Без владельца',
          desc: 'Воркеры работают под uid 65534. Сессия остаётся в ядре.',
        },
        {
          title: 'Трубы, а не сокеты',
          desc: 'Ядро и воркер общаются через UNIX pipes.',
        },
      ],
      diagram: {
        telegram: 'Telegram',
        kernel: 'Ядро Hotaru',
        kernelSub: 'Python 3.13 · ключи сессии',
        worker: 'Воркер модуля',
        workerSub: 'CLONE_NEWNS · NEWIPC · NEWUTS · NEWNET',
        tmpfs: 'личная tmpfs',
        uid: 'uid 65534 nobody',
        pipe: 'UNIX pipe',
        vault: 'Зашифрованное хранилище',
        vaultSub: 'AES-GCM · sanctuary/hotaru.vault',
        caption: 'Сеть доступна, только если манифест её запросил.',
        details: {
          telegram: 'Аккаунт и его сессия. В воркер они не попадают никогда.',
          kernel: 'Python 3.13. Держит ключи сессии и хранилище.',
          vault: 'Шифрование AES-GCM, лежит в sanctuary. Читает его только ядро.',
          worker: 'Свой процесс, своя tmpfs, без владельца.',
        },
      },
    },
    capabilities: {
      title: 'Власти разрешений',
      subtitle: 'Модуль запрашивает права. Ядро даёт, тюрьма принуждает.',
      aside: 'Десять возможностей. logs и fetch выдаются всегда, остальные восемь нужно объявить.',
      cols: { id: 'возможность', grant: 'что даёт', enforce: 'чем принуждается' },
      usedBy: 'объявляют',
    },
    modules: {
      kicker: 'Модули',
      title: 'Пятнадцать модулей',
      subtitle: 'Файл .hmod с манифестом, своими командами и списком разрешений.',
      note: 'Версии из develop.',
      manifestTitle: 'манифест',
      copyBtn: 'Копировать',
      copiedBtn: 'Скопировано',
      failedBtn: 'Не удалось скопировать',
      pickLabel: 'Показать манифест модуля',
    },
    run: {
      kicker: 'Запуск',
      title: 'Восемь команд, одна строка установки',
      subtitle: 'Отправляйте от своего аккаунта в любом чате.',
      installTitle: 'Четыре способа установки',
      copyCmd: 'Скопировать команду',
      copiedCmd: 'Скопировано',
      failedCmd: 'Не удалось скопировать',
      requirements: 'Linux x86_64 или aarch64 · Python 3.13 · API ID, API Hash, токен BotFather · uv',
    },
    docs: {
      title: 'Руководство по разработке',
      subtitle: 'Как написать .hmod и запустить его в Telegram.',
      openDocsBtn: 'Открыть документацию',
      openCatalogBtn: 'Все 292 метода API',
      cards: [
        {
          title: 'Загрузка и управление',
          desc: 'Отправьте .hmod в Telegram и ответьте .ld. Перезагрузка .rl, выгрузка .ul, экспорт .ex, каталог .help.',
        },
        {
          title: 'Схема манифеста',
          desc: 'HOTARU в первой строке, привязка команд, права, опциональная типизация.',
        },
        {
          title: 'Контекст и 292 метода',
          desc: '292 метода MTProto на ctx, с подставленным чатом и сообщением.',
        },
        {
          title: 'Состояние, экраны, задачи',
          desc: 'Меню через ctx.screens, хранилище ctx.state, фоновые задачи.',
        },
      ],
      searchPlaceholder: 'Поиск по руководству и методам',
      tocTitle: 'Разделы',
      sections: DOCS_RU,
    },
    footer: {
      copyright: 'Hotaru Project. AGPL-3.0.',
      docsLink: 'Документация',
      githubHotaru: 'Hotaru',
      githubWeb: 'HotaruWeb',
      telegramCommunity: 'Telegram',
    },
  },
};

export const commands = { en: COMMANDS_EN, ru: COMMANDS_RU };
export const install = { en: INSTALL_EN, ru: INSTALL_RU };
