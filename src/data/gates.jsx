export const GATES = [
  {
    id: 'mt',
    title: 'Telegram API',
    detail: 'Full MTProto access. Account security and payments are blocked.',
    side: 'write',
    grant: {
      en: 'Raw MTProto calls via ctx.tg.call',
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
    detail: 'Persistent key value state, private to the module that owns it.',
    side: 'write',
    grant: {
      en: 'Module scoped SQLite storage',
      ru: 'Собственная база SQLite на модуль',
    },
    enforce: {
      en: 'One database per module.',
      ru: 'По одной базе на модуль.',
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
      en: 'Without net every socket is closed.',
      ru: 'Без net любой сокет закрыт.',
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
      en: 'The worker gets a tmpfs. The host filesystem does not exist for it.',
      ru: 'Воркеру достаётся tmpfs, файловой системы хоста для него нет.',
    },
  },
  {
    id: 'shell',
    title: 'Shell',
    detail: 'Run shell commands in the module workspace, with the limits of the module.',
    side: 'write',
    grant: {
      en: 'Command execution in the sandbox',
      ru: 'Выполнение команд в песочнице',
    },
    enforce: {
      en: 'Same uid, same limits as the module.',
      ru: 'Тот же uid, те же лимиты, что и у модуля.',
    },
  },
];
