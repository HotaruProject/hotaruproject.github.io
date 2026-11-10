export const GATES = [
  {
    id: 'mt',
    title: 'Telegram API',
    detail: 'Full userbot MTProto access, with account security and payment operations blocked.',
    side: 'write',
    grant: {
      en: 'Raw MTProto calls through ctx.tg.call',
      ru: 'Прямые вызовы MTProto через ctx.tg.call',
    },
    enforce: {
      en: 'The session stays in the kernel, the worker only sees the answer.',
      ru: 'Сессия остаётся в ядре, воркер видит только ответ.',
    },
  },
  {
    id: 'state',
    title: 'State',
    detail: 'Persistent key value state inside the namespace of the module that owns it.',
    side: 'write',
    grant: {
      en: 'Module scoped SQLite key value storage',
      ru: 'Собственная база SQLite в области модуля',
    },
    enforce: {
      en: 'One database per module, inside its own namespace.',
      ru: 'По одной базе на модуль, внутри его namespace.',
    },
  },
  {
    id: 'net',
    title: 'Network',
    detail: 'Outbound access to public hosts over http, https, ws, wss, tcp, tls and udp.',
    side: 'write',
    grant: {
      en: 'Outbound HTTP, WebSocket and TCP',
      ru: 'Исходящие HTTP, WebSocket и TCP',
    },
    enforce: {
      en: 'Without net the network namespace of the kernel blocks every socket.',
      ru: 'Без net сетевой namespace ядра блокирует любые сокеты.',
    },
  },
  {
    id: 'files',
    title: 'Files',
    detail: 'Read and write files inside the workspace of the module.',
    side: 'write',
    grant: {
      en: 'A private temporary workspace',
      ru: 'Приватное временное рабочее пространство',
    },
    enforce: {
      en: 'The worker mounts get a tmpfs, the host filesystem does not exist for it.',
      ru: 'Воркеру монтируется tmpfs, файловой системы хоста для него не существует.',
    },
  },
  {
    id: 'shell',
    title: 'Shell',
    detail: 'Run shell commands in the module workspace, with the limits of the module.',
    side: 'write',
    grant: {
      en: 'Command execution inside the jail',
      ru: 'Выполнение команд внутри тюрьмы',
    },
    enforce: {
      en: 'Same namespace, same uid, same limits as the module.',
      ru: 'Тот же namespace, тот же uid, те же лимиты, что и у модуля.',
    },
  },
];
