export const MODULES = [
  {
    id: 'accounts',
    version: '2.0.0',
    commands: ['account', 'addaccount', 'accounts'],
    caps: ['mt'],
    role: {
      en: 'Several Telegram accounts under one supervisor, each with its own session.',
      ru: 'Несколько аккаунтов Telegram под одним супервизором, у каждого своя сессия.',
    },
  },
  {
    id: 'acl',
    version: '3.0.0',
    commands: ['perms', 'whois', 'rule', 'sg', 'ruleclr'],
    caps: ['mt'],
    role: {
      en: 'Owners, permission rules and security groups that decide who drives the bot.',
      ru: 'Владельцы, правила прав и группы безопасности: кто управляет ботом.',
    },
  },
  {
    id: 'backups',
    version: '1.2.0',
    commands: ['backup', 'restore'],
    caps: ['mt', 'state', 'files', 'modules'],
    role: {
      en: 'Encrypted archives of state and sessions, with a scheduled push.',
      ru: 'Зашифрованные архивы состояния и сессий, с отправкой по расписанию.',
    },
  },
  {
    id: 'catalyst',
    version: '1.3.0',
    commands: ['ld', 'ul', 'rl', 'ex', 'resetdb'],
    caps: ['modules'],
    role: {
      en: 'Loads, unloads and hot reloads modules while the kernel keeps running.',
      ru: 'Загрузка, выгрузка и горячая перезагрузка модулей без остановки ядра.',
    },
  },
  {
    id: 'executor',
    version: '3.4.0',
    commands: ['sh', 'py', 'kill'],
    caps: ['mt', 'files', 'net', 'state', 'assets'],
    role: {
      en: 'Runs shell and Python inside the module jail, with its own limits.',
      ru: 'Запуск shell и Python внутри тюрьмы модуля, с собственными лимитами.',
    },
  },
  {
    id: 'genesis',
    version: '1.1.0',
    commands: ['start', 'github'],
    caps: ['mt', 'state'],
    role: {
      en: 'The inline entry point: start, repository links and the owner gate.',
      ru: 'Точка входа: старт, ссылки на репозиторий и проверка владельца.',
    },
  },
  {
    id: 'help',
    version: '2.0.0',
    commands: ['help'],
    caps: ['mt'],
    role: {
      en: 'The interactive module catalog and the command cards.',
      ru: 'Интерактивный каталог модулей и карточки команд.',
    },
  },
  {
    id: 'info',
    version: '2.2.0',
    commands: ['info', 'ping'],
    caps: ['mt', 'state'],
    role: {
      en: 'Gateway latency, uptime and a status card you can retemplate.',
      ru: 'Задержка шлюза, аптайм и статусная карточка со своим шаблоном.',
    },
  },
  {
    id: 'logger',
    version: '1.2.0',
    commands: ['logs', 'loglevel'],
    caps: ['mt', 'state'],
    role: {
      en: 'A live log pump with a level switch for every module.',
      ru: 'Живая лента логов с переключателем уровня для каждого модуля.',
    },
  },
  {
    id: 'power',
    version: '1.5.0',
    commands: ['restart', 'stop', 'resume'],
    caps: ['mt'],
    role: {
      en: 'Restarts, stops and resumes the kernel together with its modules.',
      ru: 'Перезапуск, остановка и возобновление ядра вместе с модулями.',
    },
  },
  {
    id: 'settings',
    version: '3.1.0',
    commands: ['config', 'alias', 'rmalias', 'lsalias', 'prefix'],
    caps: ['mt', 'state'],
    role: {
      en: 'Runtime settings, command aliases and the command prefix.',
      ru: 'Настройки рантайма, алиасы команд и префикс команд.',
    },
  },
  {
    id: 'shield',
    version: '1.0.0',
    commands: ['shield', 'suspend_api'],
    caps: ['mt', 'state'],
    role: {
      en: 'API flood and rate limit protection.',
      ru: 'Защита от флуда и контроль лимитов API.',
    },
  },
  {
    id: 'singularity',
    version: '2.0.1',
    commands: ['dash'],
    caps: ['mt'],
    role: {
      en: 'Opens the control panel: the local dashboard and the Telegram Mini App.',
      ru: 'Открывает панель управления: локальный дашборд и Mini App в Telegram.',
    },
  },
  {
    id: 'translations',
    version: '2.2.0',
    commands: ['language', 'translate', 'loadlex', 'rmlex'],
    caps: ['mt', 'net', 'files', 'state'],
    role: {
      en: 'Interface languages and lexicons that load on demand.',
      ru: 'Языки интерфейса и лексионы, которые подгружаются по запросу.',
    },
  },
  {
    id: 'updater',
    version: '2.0.0',
    commands: ['upd', 'updlog', 'updoff', 'updon'],
    caps: ['net', 'mt'],
    role: {
      en: 'Checks for new releases and can apply them on demand.',
      ru: 'Проверяет релизы и умеет ставить их по запросу.',
    },
  },
];

export function manifestOf(module) {
  const commands = module.commands.map((c) => `"${c}"`).join(', ');
  const caps = module.caps.map((c) => `"${c}"`).join(', ');
  return [
    'HOTARU = {',
    `    "id": "${module.id}",`,
    `    "version": "${module.version}",`,
    `    "commands": [${commands}],`,
    `    "capabilities": [${caps}],`,
    '}',
  ].join('\n');
}
