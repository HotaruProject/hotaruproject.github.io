export const MODULES = [
  {
    id: 'accounts',
    version: '2.0.0',
    commands: ['account', 'addaccount', 'accounts'],
    caps: ['mt'],
    role: {
      en: 'Several accounts, each with its own session.',
      ru: 'Несколько аккаунтов, у каждого своя сессия.',
    },
  },
  {
    id: 'acl',
    version: '3.0.0',
    commands: ['perms', 'whois', 'rule', 'sg', 'ruleclr'],
    caps: ['mt'],
    role: {
      en: 'Owners, permission rules and security groups.',
      ru: 'Владельцы, правила прав и группы безопасности.',
    },
  },
  {
    id: 'backups',
    version: '1.2.0',
    commands: ['backup', 'restore'],
    caps: ['mt', 'state', 'files', 'modules'],
    role: {
      en: 'Encrypted archives of state and sessions.',
      ru: 'Зашифрованные архивы состояния и сессий.',
    },
  },
  {
    id: 'catalyst',
    version: '1.3.0',
    commands: ['ld', 'ul', 'rl', 'ex', 'resetdb'],
    caps: ['modules'],
    role: {
      en: 'Loads, unloads and hot reloads modules on the fly.',
      ru: 'Загрузка, выгрузка и горячая перезагрузка модулей.',
    },
  },
  {
    id: 'executor',
    version: '3.4.0',
    commands: ['sh', 'py', 'kill'],
    caps: ['mt', 'files', 'net', 'state', 'assets'],
    role: {
      en: 'Runs shell and Python in the sandbox, with its own limits.',
      ru: 'Запуск shell и Python в песочнице, с собственными лимитами.',
    },
  },
  {
    id: 'genesis',
    version: '1.1.0',
    commands: ['start', 'github'],
    caps: ['mt', 'state'],
    role: {
      en: 'The entry point: start, repository links, owner check.',
      ru: 'Точка входа: старт, ссылки на репозиторий, проверка владельца.',
    },
  },
  {
    id: 'help',
    version: '2.0.0',
    commands: ['help'],
    caps: ['mt'],
    role: {
      en: 'The module catalog and the command cards.',
      ru: 'Каталог модулей и карточки команд.',
    },
  },
  {
    id: 'info',
    version: '2.2.0',
    commands: ['info', 'ping'],
    caps: ['mt', 'state'],
    role: {
      en: 'Gateway latency, uptime and a status card.',
      ru: 'Задержка шлюза, аптайм и статусная карточка.',
    },
  },
  {
    id: 'logger',
    version: '1.2.0',
    commands: ['logs', 'loglevel'],
    caps: ['mt', 'state'],
    role: {
      en: 'A live log pump with a level switch per module.',
      ru: 'Живая лента логов с переключателем уровня на модуль.',
    },
  },
  {
    id: 'power',
    version: '1.5.0',
    commands: ['restart', 'stop', 'resume'],
    caps: ['mt'],
    role: {
      en: 'Restarts, stops and resumes the kernel with its modules.',
      ru: 'Перезапуск, остановка и возобновление ядра с модулями.',
    },
  },
  {
    id: 'settings',
    version: '3.1.0',
    commands: ['config', 'alias', 'rmalias', 'lsalias', 'prefix'],
    caps: ['mt', 'state'],
    role: {
      en: 'Runtime settings, aliases and the command prefix.',
      ru: 'Настройки, алиасы и префикс команд.',
    },
  },
  {
    id: 'shield',
    version: '1.0.0',
    commands: ['shield', 'suspend_api'],
    caps: ['mt', 'state'],
    role: {
      en: 'Flood and rate limit protection.',
      ru: 'Защита от флуда и лимитов API.',
    },
  },
  {
    id: 'singularity',
    version: '2.0.1',
    commands: ['dash'],
    caps: ['mt'],
    role: {
      en: 'Opens the control panel: dashboard and Telegram Mini App.',
      ru: 'Открывает панель: дашборд и Mini App в Telegram.',
    },
  },
  {
    id: 'translations',
    version: '2.2.0',
    commands: ['language', 'translate', 'loadlex', 'rmlex'],
    caps: ['mt', 'net', 'files', 'state'],
    role: {
      en: 'Interface languages and lexicons, loaded on demand.',
      ru: 'Языки интерфейса и лексионы, подгружаются по запросу.',
    },
  },
  {
    id: 'updater',
    version: '2.0.0',
    commands: ['upd', 'updlog', 'updoff', 'updon'],
    caps: ['net', 'mt'],
    role: {
      en: 'Checks for new releases and applies them on demand.',
      ru: 'Проверяет релизы и ставит их по запросу.',
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
