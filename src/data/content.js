import { DOCS_EN, DOCS_RU } from './docs.js';

const MODULES_EN = [
  { id: 'accounts', version: '2.0.0', commands: '.account .addaccount .accounts', note: 'Several Telegram accounts under one supervisor, each with its own session and state.' },
  { id: 'acl', version: '3.0.0', commands: '.perms .whois .rule …', note: 'Owners, permission rules and security groups that decide who may drive the bot.' },
  { id: 'backups', version: '1.2.0', commands: '.backup .restore', note: 'Encrypted archives of state and sessions, with a scheduled push.' },
  { id: 'catalyst', version: '1.3.0', commands: '.ld .ul .rl .ex .resetdb', note: 'Loads, unloads and hot-reloads .hmod modules while the kernel keeps running.' },
  { id: 'executor', version: '3.4.0', commands: '.sh .py .kill', note: 'Runs shell and Python inside the module jail, with its own limits.' },
  { id: 'genesis', version: '1.1.0', commands: 'bot: start · github', note: 'The inline entry point: start, repository links and the owner gate.' },
  { id: 'help', version: '2.0.0', commands: '.help', note: 'The interactive module catalog and the command cards.' },
  { id: 'info', version: '2.2.0', commands: '.info .ping', note: 'Gateway latency, uptime and a status card you can retemplate.' },
  { id: 'logger', version: '1.2.0', commands: '.logs .loglevel', note: 'A live log pump with a level switch per module.' },
  { id: 'power', version: '1.5.0', commands: '.restart .stop .resume', note: 'Restarts, stops and resumes the kernel together with its modules.' },
  { id: 'settings', version: '3.1.0', commands: '.config .alias .prefix …', note: 'Runtime settings, command aliases and the command prefix.' },
  { id: 'shield', version: '1.0.0', commands: '.shield .suspend_api', note: 'API flood and rate limit protection.' },
  { id: 'singularity', version: '2.0.1', commands: '.dash', note: 'Opens the control panel: the local dashboard and the Telegram Mini App.' },
  { id: 'translations', version: '2.2.0', commands: '.language .translate .loadlex …', note: 'Interface languages and lexicons that load on demand.' },
  { id: 'updater', version: '2.0.0', commands: '.upd .updlog .updoff .updon', note: 'Checks for new releases and can apply them on demand.' },
];

const MODULES_RU = [
  { id: 'accounts', version: '2.0.0', commands: '.account .addaccount .accounts', note: 'Несколько аккаунтов Telegram под одним супервизором, у каждого своя сессия и состояние.' },
  { id: 'acl', version: '3.0.0', commands: '.perms .whois .rule …', note: 'Владельцы, правила прав и группы безопасности: кто может управлять ботом.' },
  { id: 'backups', version: '1.2.0', commands: '.backup .restore', note: 'Зашифрованные архивы состояния и сессий, с отправкой по расписанию.' },
  { id: 'catalyst', version: '1.3.0', commands: '.ld .ul .rl .ex .resetdb', note: 'Загрузка, выгрузка и горячая перезагрузка модулей .hmod без остановки ядра.' },
  { id: 'executor', version: '3.4.0', commands: '.sh .py .kill', note: 'Запуск shell и Python внутри тюрьмы модуля, с собственными лимитами.' },
  { id: 'genesis', version: '1.1.0', commands: 'бот: start · github', note: 'Точка входа: старт, ссылки на репозиторий и проверка владельца.' },
  { id: 'help', version: '2.0.0', commands: '.help', note: 'Интерактивный каталог модулей и карточки команд.' },
  { id: 'info', version: '2.2.0', commands: '.info .ping', note: 'Задержка шлюза, аптайм и статусная карточка со своим шаблоном.' },
  { id: 'logger', version: '1.2.0', commands: '.logs .loglevel', note: 'Живая лента логов с переключателем уровня для каждого модуля.' },
  { id: 'power', version: '1.5.0', commands: '.restart .stop .resume', note: 'Перезапуск, остановка и возобновление ядра вместе с модулями.' },
  { id: 'settings', version: '3.1.0', commands: '.config .alias .prefix …', note: 'Настройки рантайма, алиасы команд и префикс команд.' },
  { id: 'shield', version: '1.0.0', commands: '.shield .suspend_api', note: 'Защита от флуда и контроль лимитов API.' },
  { id: 'singularity', version: '2.0.1', commands: '.dash', note: 'Открывает панель управления: локальный дашборд и Mini App в Telegram.' },
  { id: 'translations', version: '2.2.0', commands: '.language .translate .loadlex …', note: 'Языки интерфейса и лексионы, которые подгружаются по запросу.' },
  { id: 'updater', version: '2.0.0', commands: '.upd .updlog .updoff .updon', note: 'Проверяет релизы и умеет ставить их по запросу.' },
];

const CAPABILITIES_EN = [
  { id: 'mt', grant: 'Raw MTProto calls through ctx.tg.call', enforce: 'The session stays in the kernel, the worker only sees the answer.' },
  { id: 'state', grant: 'Module scoped SQLite key value storage', enforce: 'One database per module, inside its own namespace.' },
  { id: 'net', grant: 'Outbound HTTP, WebSocket and TCP', enforce: 'Without net the kernel network namespace blocks every socket.' },
  { id: 'files', grant: 'A private temporary workspace', enforce: 'The worker mounts get a tmpfs, the host filesystem does not exist for it.' },
  { id: 'shell', grant: 'Command execution inside the jail', enforce: 'Same namespace, same uid, same limits as the module.' },
];

const CAPABILITIES_RU = [
  { id: 'mt', grant: 'Прямые вызовы MTProto через ctx.tg.call', enforce: 'Сессия остаётся в ядре, воркер видит только ответ.' },
  { id: 'state', grant: 'Собственная база SQLite в области модуля', enforce: 'По одной базе на модуль, внутри его namespace.' },
  { id: 'net', grant: 'Исходящие HTTP, WebSocket и TCP', enforce: 'Без net сетевой namespace ядра блокирует любые сокеты.' },
  { id: 'files', grant: 'Приватное временное рабочее пространство', enforce: 'Воркеру монтируется tmpfs, файловой системы хоста для него не существует.' },
  { id: 'shell', grant: 'Выполнение команд внутри тюрьмы', enforce: 'Тот же namespace, тот же uid, те же лимиты, что и у модуля.' },
];

const COMMANDS_EN = [
  { cmd: '.help', desc: 'Open the interactive module catalog and help cards' },
  { cmd: '.ping', desc: 'Check MTProto gateway latency and connection health' },
  { cmd: '.dash', desc: 'Generate the Singularity panel link and launch the Telegram Mini App' },
  { cmd: '.addaccount', desc: 'Add another Telegram account to the supervisor pool' },
  { cmd: '.shield', desc: 'View API call rates and adjust FloodWait protection' },
  { cmd: '.config', desc: 'Open the interactive runtime settings editor' },
  { cmd: '.backup', desc: 'Create an encrypted backup archive of state and sessions' },
  { cmd: '.restart', desc: 'Reload kernel processes and active modules' },
];

const COMMANDS_RU = [
  { cmd: '.help', desc: 'Открыть интерактивный каталог модулей и карточки команд' },
  { cmd: '.ping', desc: 'Проверить задержку шлюза MTProto и состояние соединения' },
  { cmd: '.dash', desc: 'Собрать ссылку на панель Singularity и открыть Mini App' },
  { cmd: '.addaccount', desc: 'Добавить ещё один аккаунт Telegram в пул супервизора' },
  { cmd: '.shield', desc: 'Посмотреть частоту вызовов API и настроить защиту от флуда' },
  { cmd: '.config', desc: 'Открыть интерактивный редактор настроек рантайма' },
  { cmd: '.backup', desc: 'Создать зашифрованный архив состояния и сессий' },
  { cmd: '.restart', desc: 'Перезапустить процессы ядра и активные модули' },
];

const INSTALL_EN = [
  {
    id: 'script',
    label: 'Installer',
    note: 'Interactive setup: system packages, your Telegram credentials and the deployment you want.',
    code: 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash',
  },
  {
    id: 'compose',
    label: 'Docker Compose',
    note: 'Manifests with namespace sandbox support already wired in.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\ndocker compose run --rm hotaru\ndocker compose up -d',
  },
  {
    id: 'lxc',
    label: 'Proxmox LXC',
    note: 'A container with unconfined nesting, created by the setup script.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nbash lxc/create.sh',
  },
  {
    id: 'manual',
    label: 'Manual with uv',
    note: 'Clone, sync the environment and run the onboarding wizard.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nuv sync\nuv run python -m hotaru',
  },
];

const INSTALL_RU = [
  {
    id: 'script',
    label: 'Установщик',
    note: 'Интерактивная настройка: системные пакеты, данные Telegram и выбранный способ развёртывания.',
    code: 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash',
  },
  {
    id: 'compose',
    label: 'Docker Compose',
    note: 'Манифесты уже настроены на изоляцию через namespace.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\ndocker compose run --rm hotaru\ndocker compose up -d',
  },
  {
    id: 'lxc',
    label: 'Proxmox LXC',
    note: 'Контейнер с unconfined nesting, который создаёт скрипт установки.',
    code: 'git clone -b develop https://github.com/HotaruProject/Hotaru.git\ncd Hotaru\nbash lxc/create.sh',
  },
  {
    id: 'manual',
    label: 'Вручную через uv',
    note: 'Клонирование, сборка окружения и запуск мастера настройки.',
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
      eyebrow: 'Telegram userbot · GoyGram core · Linux namespaces',
      title: 'Hotaru',
      subtitle: 'Third party modules run inside their own Linux namespace. Your session files, keys and network stay out of their reach.',
      installTitle: 'Install',
      copyTooltip: 'Copy command',
      copiedTooltip: 'Copied to clipboard',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      ctaDocs: 'Read the manual',
      ctaSkill: 'Agent guide',
      ctaGithub: 'Source code',
      facts: [
        { value: '292', label: 'MTProto methods' },
        { value: '15', label: 'bundled modules' },
        { value: '5', label: 'capability gates' },
        { value: 'AGPL', label: '3.0 licensed' },
      ],
    },
    jail: {
      kicker: 'Isolation',
      title: 'The jail',
      subtitle: 'Hotaru does not trust a module, it contains it. Every worker gets its own kernel namespace and nothing else.',
      points: [
        {
          title: 'Four namespaces',
          desc: 'CLONE_NEWNS, CLONE_NEWIPC, CLONE_NEWUTS and CLONE_NEWNET give every worker a private mount, IPC, hostname and network namespace.',
        },
        {
          title: 'Nothing to read',
          desc: 'Each worker starts on a private tmpfs. Files outside its own directory are not in its filesystem, they are nowhere.',
        },
        {
          title: 'nobody owns the worker',
          desc: 'Workers drop to uid 65534. The process that holds your Telegram session stays up in the kernel.',
        },
        {
          title: 'Pipes, not sockets',
          desc: 'Kernel and worker talk over UNIX pipes. No shared memory, no shared sockets, no side channel.',
        },
      ],
      diagram: {
        telegram: 'Telegram',
        kernel: 'Hotaru kernel',
        kernelSub: 'Python 3.13 · GoyGram · session keys',
        worker: 'Module worker',
        workerSub: 'CLONE_NEWNS · NEWIPC · NEWUTS · NEWNET',
        tmpfs: 'private tmpfs',
        uid: 'uid 65534 nobody',
        pipe: 'UNIX pipe',
        vault: 'Encrypted vault',
        vaultSub: 'AES-GCM · sanctuary/hotaru.vault',
        caption: 'A module reaches the network only if its manifest asks for it.',
      },
    },
    capabilities: {
      title: 'Capability gates',
      subtitle: 'A module declares what it needs in its manifest. The kernel decides what it gets, and the namespace jail enforces it.',
      aside: 'The kernel knows ten capabilities: mt, state, net, files, shell, inline, modules, assets, logs and fetch. logs and fetch are granted to every module, the rest must be declared.',
      cols: { id: 'capability', grant: 'grants', enforce: 'enforced by' },
    },
    modules: {
      kicker: 'Modules',
      title: 'Fifteen constellations',
      subtitle: 'Every module is a self describing .hmod file with a manifest, its own commands and a capability list.',
      note: 'Versions from the develop branch.',
    },
    run: {
      kicker: 'Run it',
      title: 'Eight commands, one install line',
      subtitle: 'Commands are sent from your own account in any chat. The prefix is configurable.',
      installTitle: 'Four ways to install',
      requirements: 'Linux x86_64 or aarch64 · Python 3.13 · API ID and API Hash from my.telegram.org · a BotFather token · uv',
    },
    docs: {
      title: 'Developer manual',
      subtitle: 'Complete documentation for building, loading via .ld, and managing modules in Telegram.',
      openDocsBtn: 'Open documentation',
      openCatalogBtn: 'Browse 292 methods',
      cards: [
        {
          title: 'Loading & management',
          desc: 'Send a .hmod file to Telegram and reply with .ld. Hot-reload with .rl, unload with .ul, export with .ex and browse the catalog with .help.',
        },
        {
          title: 'Manifest schema',
          desc: 'First-statement HOTARU manifest declaration, command triggers, permissions, and optional typing support.',
        },
        {
          title: 'Context & 292 methods',
          desc: '292 MTProto methods directly on ctx with smart defaults for current chat and message.',
        },
        {
          title: 'State, screens & tasks',
          desc: 'Interactive Telegram menus via ctx.screens, SQLite storage via ctx.state, and supervised background tasks.',
        },
      ],
      searchPlaceholder: 'Search developer reference & methods...',
      tocTitle: 'Chapters',
      sections: DOCS_EN,
    },
    footer: {
      copyright: 'Hotaru Project. Open-source software released under the GNU AGPLv3 License.',
      docsLink: 'Documentation',
      githubHotaru: 'Hotaru Userbot',
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
      eyebrow: 'юзербот для Telegram · ядро GoyGram · namespace Linux',
      title: 'Hotaru',
      subtitle: 'Сторонние модули работают в собственном namespace Linux. Файлы сессии, ключи и сеть остаются вне их досягаемости.',
      installTitle: 'Установка',
      copyTooltip: 'Скопировать команду',
      copiedTooltip: 'Скопировано в буфер',
      copyBtn: 'Скопировать',
      copiedBtn: 'Скопировано',
      ctaDocs: 'Открыть руководство',
      ctaSkill: 'Инструкция для ИИ',
      ctaGithub: 'Исходный код',
      facts: [
        { value: '292', label: 'методов MTProto' },
        { value: '15', label: 'модулей в комплекте' },
        { value: '5', label: 'властей разрешений' },
        { value: 'AGPL', label: 'лицензия 3.0' },
      ],
    },
    jail: {
      kicker: 'Изоляция',
      title: 'Тюрьма',
      subtitle: 'Hotaru не доверяет модулю, он его запирает. Каждому воркеру достаётся собственный namespace ядра и ничего больше.',
      points: [
        {
          title: 'Четыре namespace',
          desc: 'CLONE_NEWNS, CLONE_NEWIPC, CLONE_NEWUTS и CLONE_NEWNET дают воркеру личные namespace монтирования, IPC, имени хоста и сети.',
        },
        {
          title: 'Читать нечего',
          desc: 'Воркер стартует на личной tmpfs. Файлов за пределами его каталога в его файловой системе просто нет.',
        },
        {
          title: 'Воркер принадлежит nobody',
          desc: 'Воркеры работают под uid 65534. Процесс с вашей сессией Telegram остаётся в ядре.',
        },
        {
          title: 'Трубы, а не сокеты',
          desc: 'Ядро и воркер общаются через UNIX pipes. Ни общей памяти, ни общих сокетов, ни бокового канала.',
        },
      ],
      diagram: {
        telegram: 'Telegram',
        kernel: 'Ядро Hotaru',
        kernelSub: 'Python 3.13 · GoyGram · ключи сессии',
        worker: 'Воркер модуля',
        workerSub: 'CLONE_NEWNS · NEWIPC · NEWUTS · NEWNET',
        tmpfs: 'личная tmpfs',
        uid: 'uid 65534 nobody',
        pipe: 'UNIX pipe',
        vault: 'Зашифрованное хранилище',
        vaultSub: 'AES-GCM · sanctuary/hotaru.vault',
        caption: 'Модуль выходит в сеть только если его манифест этого попросил.',
      },
    },
    capabilities: {
      title: 'Власти разрешений',
      subtitle: 'Модуль запрашивает права в манифесте. Ядро решает, что дать, а тюрьма принуждает.',
      aside: 'Ядро знает десять возможностей: mt, state, net, files, shell, inline, modules, assets, logs и fetch. logs и fetch выдаются каждому модулю, остальные нужно объявить в манифесте.',
      cols: { id: 'возможность', grant: 'что даёт', enforce: 'чем принуждается' },
    },
    modules: {
      kicker: 'Модули',
      title: 'Пятнадцать созвездий',
      subtitle: 'Каждый модуль это самодостаточный файл .hmod с манифестом, своими командами и списком разрешений.',
      note: 'Версии из ветки develop.',
    },
    run: {
      kicker: 'Запуск',
      title: 'Восемь команд, одна строка установки',
      subtitle: 'Команды отправляются от вашего аккаунта в любом чате. Префикс настраивается.',
      installTitle: 'Четыре способа установки',
      requirements: 'Linux x86_64 или aarch64 · Python 3.13 · API ID и API Hash с my.telegram.org · токен от BotFather · uv',
    },
    docs: {
      title: 'Руководство по разработке',
      subtitle: 'Полная документация по созданию, быстрой загрузке через .ld и управлению модулями.',
      openDocsBtn: 'Открыть документацию',
      openCatalogBtn: 'Все 292 метода API',
      cards: [
        {
          title: 'Загрузка и управление',
          desc: 'Отправьте .hmod файл в чат и ответьте командой .ld. Перезагрузка через .rl, выгрузка через .ul, экспорт через .ex и каталог через .help.',
        },
        {
          title: 'Схема манифеста',
          desc: 'Правило первой строки HOTARU, привязка команд, запрашиваемые разрешения и опциональная типизация.',
        },
        {
          title: 'Контекст и 292 метода',
          desc: '292 встроенных метода MTProto прямо на объекте ctx с автоподстановкой текущего чата и сообщения.',
        },
        {
          title: 'База данных, экраны и задачи',
          desc: 'Интерактивные меню в Telegram через ctx.screens, SQLite хранилище ctx.state и фоновые задачи tasks.',
        },
      ],
      searchPlaceholder: 'Поиск по руководству и методам...',
      tocTitle: 'Разделы',
      sections: DOCS_RU,
    },
    footer: {
      copyright: 'Hotaru Project. Открытое программное обеспечение под лицензией GNU AGPLv3.',
      docsLink: 'Документация',
      githubHotaru: 'Hotaru Userbot',
      githubWeb: 'HotaruWeb',
      telegramCommunity: 'Telegram',
    },
  },
};

export const modules = { en: MODULES_EN, ru: MODULES_RU };
export const capabilities = { en: CAPABILITIES_EN, ru: CAPABILITIES_RU };
export const commands = { en: COMMANDS_EN, ru: COMMANDS_RU };
export const install = { en: INSTALL_EN, ru: INSTALL_RU };
