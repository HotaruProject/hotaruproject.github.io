export const DOCS_EN = [
  {
    id: 'overview',
    title: 'Overview',
    summary: 'Hotaru is a Telegram userbot runtime that loads .hmod modules into isolated sandboxes.',
    content: `![The Hotaru userbot banner from the upstream project](media/hotaru-banner.webp)

Hotaru is a Telegram userbot built on GoyGram, an asynchronous Python MTProto client with native Rust cryptography. The runtime owns the account session; modules are third-party code that the runtime loads, supervises and confines.

### What the runtime provides

- **Namespace isolation.** Every module runs in its own Linux namespaces (\`CLONE_NEWNS\`, \`CLONE_NEWIPC\`, \`CLONE_NEWUTS\`, \`CLONE_NEWNET\`), on a private tmpfs, as uid 65534 (\`nobody\`). Modules talk to the kernel over a UNIX pipe, never over a socket.
- **Explicit capabilities.** A module declares what it needs in its manifest: \`mt\`, \`state\`, \`net\`, \`files\`, \`shell\`, \`inline\`, \`modules\`, \`assets\`. \`logs\` and \`fetch\` are always granted.
- **Encrypted storage.** Session strings, database entries and authorization keys live in \`sanctuary/hotaru.vault\`, encrypted with AES-GCM. The kernel is the only reader.
- **FloodWait protection.** The \`shield\` module samples API call rates and pauses calls locally before Telegram applies a floodwait.
- **Multi-account supervisor.** One instance runs several accounts concurrently, each with its own MTProto session and isolated state.
- **Web dashboard.** Singularity runs on Node.js and Vite, serving system metrics, logs and module management on port 8787. It can also open as a Telegram Mini App through a Cloudflare Horizon tunnel.

### Runtime shape

The kernel boots, activates modules from the \`constellations/\` directory, and hands each one a context object. The context is the only surface a module sees: messaging helpers, state storage, screens, and the contextual Telegram operations.

### The core underneath

Hotaru inherits the transport and the cryptography from GoyGram.

![The GoyGram mark](media/goygram-mark.webp)

The chart below is the upstream GoyGram TL codec benchmark.

![GoyGram TL codec benchmark: 351270 operations per second for serialize sendMessage](media/goygram-codec.webp)`,
  },
  {
    id: 'install',
    title: 'Install',
    summary: 'Requirements, the installer script, and the manual and container setups.',
    content: `### Requirements

- Linux on x86_64 or aarch64
- Python 3.13 or newer
- A Telegram API ID and API Hash from my.telegram.org
- A bot token from @BotFather, for inline UI and Mini App access
- The \`uv\` package manager, installed by the setup script

### Interactive installer

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash
\`\`\`

The script installs system packages, prompts for your Telegram credentials, and offers a deployment: a host systemd service, Docker Compose, or a Proxmox LXC container.

### Docker Compose

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
docker compose run --rm hotaru
docker compose up -d
\`\`\`

### Proxmox VE and LXC

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
bash lxc/create.sh
\`\`\`

### Manual setup with uv

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
uv sync
uv run python -m hotaru
\`\`\`

Keep \`sanctuary/\` and the \`hotaru.vault\` key private. They hold your active sessions and master encryption secrets.`,
  },
  {
    id: 'manifest',
    title: 'Module manifest',
    summary: 'The HOTARU dictionary, the first-statement rule, and every supported field.',
    content: `A module is a Python file with the \`.hmod\` extension. The loader parses it with \`ast\` before any bytecode runs, so the manifest is read without executing the module.

### The first-statement rule

The file must begin with an assignment to \`HOTARU\` holding a literal mapping. Any statement before it, a non-literal value, or a mapping that is not a dictionary is a \`ModuleValidationError\`.

\`\`\`python
HOTARU = {
    "id": "clock",
    "version": "1.0.0",
    "commands": ["utc"],
    "capabilities": [],
}
\`\`\`

### Required fields

| Field | Type | Rule |
| --- | --- | --- |
| \`id\` | string | Canonical module ID and default name. Non-empty, at most 128 characters, no slash or NUL. |
| \`version\` | string | Non-empty. |
| \`commands\` | list of strings | No empty entries and no whitespace inside a command. |
| \`capabilities\` | list of strings | Names from the capability registry. |

### Optional fields

| Field | Type | Meaning |
| --- | --- | --- |
| \`name\` | string | Optional display label; the runtime uses \`id\` when omitted. |
| \`watchers\` | list of strings | Watcher entry points the runtime subscribes. |
| \`tasks\` | dict | Background tasks. Each entry may set \`interval\` (seconds, default 60) and \`autostart\`. |
| \`aliases\` | dict | Alternative command names mapped to existing commands. |
| \`config_schema\` | dict | Settings the module exposes to the runtime settings editor. |
| \`lexicon\` | dict | Localized strings per language code, with \`description\` and \`commands\`. |
| \`requires\` | list of strings | Modules that must be present. |
| \`after\` | list of strings | Modules to activate after this one. |
| \`inline_commands\` | list of strings | Inline query entry points. |
| \`rise\` | string | Handler called right after activation. |
| \`fade\` | string | Handler called before unload, reload, or shutdown. |
| \`template_fields\` | dict | Fields published to other modules. At most 64. |
| \`banner\` | string | URL of a banner image, http or https. |
| \`bot_commands\` | list of strings | Commands registered with the auxiliary bot. |

### Validation

The loader checks identifiers, versions, command lists, configuration schemas, translation tables, published template fields, banner URLs, and dependency lists. A translation may only describe commands and inline commands that the module actually declares. The \`hotaru\` template namespace is reserved.`,
  },
  {
    id: 'capabilities',
    title: 'Capabilities and security',
    summary: 'The eight capability gates, the firewall rules, and the denylist.',
    content: `A module receives only what its manifest asks for.

### The capability gates

| Capability | Grants |
| --- | --- |
| \`mt\` | Raw MTProto calls through \`ctx.tg.call\`. |
| \`state\` | Persistent key-value storage in the module namespace. |
| \`net\` | Outbound network access over http, https, ws, wss, tcp, tls and udp. |
| \`files\` | Read and write inside the module workspace. |
| \`shell\` | Command execution in the workspace. |
| \`inline\` | Query and drive inline bots. |
| \`modules\` | Load, unload, reload and inspect installed modules. |
| \`assets\` | The hidden assets storage. |

\`logs\` and \`fetch\` are always granted: \`logs\` writes to the observatory log, \`fetch\` reads messages, entities and reply resolution.

### The firewall

While a module is running, an audit hook blocks three things:

- Opening a path that resolves inside the protected storage, or any file ending in \`.vault\` or \`.session\`. The error is \`PermissionError: module access to Telegram session storage is denied\`.
- Importing \`goygram\`, \`hotaru\` or \`relay\` directly. Modules use the context proxies instead.
- Opening a socket directly. Network access goes through the \`net\` capability, or Telegram through the \`mt\` capability.

### The denylist

\`my.telegram.org\` is denied and read-only. Peer \`777000\` is protected and read-only: read calls return an empty result, and write calls are refused. Payload inspection walks nested structures, including encoded blobs, up to a complexity limit.

### What the mt gate still refuses

Even with \`mt\`, the \`auth.\` and \`phone.\` namespaces are blocked, every \`payments.\` and \`wallet.\` method is blocked, and account-security operations such as \`account.deleteAccount\`, \`account.resetAuthorizations\` and \`account.getPassword\` are refused. Modules cannot interact with Telegram consent screens.`,
  },
  {
    id: 'context',
    title: 'The module context',
    summary: 'What ctx exposes: messaging, state, files, screens, templates and diagnostics.',
    content: `The context is the only object a module receives. It is created per command invocation.

### Messaging

| Member | Purpose |
| --- | --- |
| \`ctx.respond(content)\` | Send a reply to the current chat. |
| \`ctx.smart_respond(content)\` | Reply, splitting long text and falling back to a file when needed. |
| \`ctx.send_file(file, caption)\` | Send a file by path or bytes. |
| \`ctx.upload_file(source)\` | Upload a file and return its Telegram reference. |
| \`ctx.read_attachment_text(reply=True)\` | Read the text of the replied-to attachment. |
| \`ctx.download(attachment, destination)\` | Download an attachment to disk. |
| \`ctx.edit(text)\` | Edit the message that triggered the command. |
| \`ctx.paginate(content, page, limit)\` | Send a page of long content with navigation. |

### State and configuration

\`ctx.state\` is a namespace over SQLite. \`get\`, \`set\`, \`delete\`, \`keys\` and \`pointer\` work on values scoped to the module. \`ctx.config\` exposes the runtime settings editor, and \`ctx.modules\` lists the installed modules.

### Templates and language

\`ctx.render_template(key, **values)\` renders a published template field. \`ctx.t(key, default, **params)\` resolves a string from the active lexicon, falling back to the supplied default.

### Diagnostics

\`ctx.check_restrictions()\` reports what the current account may not do, such as premium-only features. \`ctx.classify_error(exc)\` turns an exception into a structured diagnosis. \`ctx.premium()\` and \`ctx.is_premium()\` report the premium state.

### Module management

\`ctx.load_module(source)\` and \`ctx.unload_module(module_id, purge=True)\` manage other modules. Both require the \`modules\` capability.`,
  },
  {
    id: 'screens',
    title: 'Screens and forms',
    summary: 'The Kit primitives that build interactive menus, pagers and input forms.',
    content: `\`ctx.screens\` builds interactive screens: a message with inline buttons, a paginator, or an input request. A press is routed back to the handler that created it.

### Primitives

| Call | Result |
| --- | --- |
| \`ctx.screens.button(text, fn)\` | Neutral button. |
| \`ctx.screens.primary(text, fn)\` | Accent button for the main action. |
| \`ctx.screens.success(text, fn)\` | Confirmation button. |
| \`ctx.screens.danger(text, fn)\` | Destructive button. |
| \`ctx.screens.input(text, fn, placeholder)\` | Button that asks for text. |
| \`ctx.screens.copy(text, value)\` | Button that copies a value. |
| \`ctx.screens.url(text, link)\` | External link. |
| \`ctx.screens.webapp(text, link)\` | Telegram Mini App link. |
| \`ctx.screens.close()\` | Button that removes the screen. |
| \`ctx.screens.back(fn, text)\` | Button that returns to the previous screen. |

### Showing a screen

\`\`\`python
async def panel_cmd(ctx, invocation):
    k = ctx.screens

    async def on_refresh(ctx, nav):
        await render()

    async def render():
        rows = [[k.primary("Refresh", on_refresh), k.close()]]
        await ctx.screens.show(k.screen("<b>Gateway</b> online", rows))

    await render()
\`\`\`

\`ctx.screens.screen(text, rows)\` builds the screen, and \`await ctx.screens.show(screen)\` sends it. A button handler receives the context and a navigation object; \`nav.answer(text)\` replies to the press and \`nav.ref().edit(screen)\` replaces the screen in place.

### Paging and layout

\`ctx.screens.pager(fn, page, pages)\` builds the page controls, \`ctx.screens.grid(items, columns)\` arranges buttons, and \`ctx.screens.footer(back)\` closes the row. \`ctx.screens.table(rows)\` renders a monospaced table, \`ctx.screens.radio\` and \`ctx.screens.check\` mark choices, and \`ctx.screens.icon\` and \`ctx.screens.module_icon\` resolve icons.`,
  },
  {
    id: 'tasks',
    title: 'Tasks and lifecycle',
    summary: 'rise and fade, supervised background tasks, and the limits the runtime enforces.',
    content: `### rise and fade

\`rise\` runs immediately after activation and capability binding. \`fade\` runs before an unload, a reload, or a shutdown. Both name a coroutine in the module.

### Supervised tasks

A task is declared in the manifest and its handler is named \`task_<task_name>\`.

\`\`\`python
HOTARU = {
    "id": "metrics_exporter",
    "version": "1.0.0",
    "capabilities": ["state", "net"],
    "commands": [],
    "tasks": {
        "sync_metrics": {
            "interval": 60.0,
            "autostart": True,
        },
    },
}

async def task_sync_metrics(ctx):
    pulse = await ctx.state.get("pulse", 0)
    await ctx.state.set("pulse", pulse + 1)
\`\`\`

The supervisor calls the handler, waits for it, then sleeps for \`interval\`. If the handler raises, the failure is logged once, the loop continues, and the runtime keeps running.

### Limits

The task supervisor allows 128 tasks in total and 16 per module. Exceeding either limit raises \`TaskLimitError\` and the coroutine is closed. Unloading a module cancels its tasks and waits up to five seconds for them to finish. Shutdown cancels everything and closes the supervisor.

### Long-running work

Work that does not fit the interval model can start a coroutine inside \`rise\`. The \`fade\` handler is the place to cancel it: the runtime calls \`fade\` before an unload, a reload or a shutdown.`,
  },
  {
    id: 'methods',
    title: 'The 292 contextual methods',
    summary: 'How the contextual Telegram operations resolve their arguments and where the boundary sits.',
    content: `The context exposes 292 Telegram operations that need no capability at all. They are the contextual routes: the runtime fills in the current peer, the current message and the account, so a module writes one line instead of assembling a raw request.

\`\`\`python
await ctx.set_checklist_completed(completed=[1], incompleted=[])
\`\`\`

### Argument resolution

The gateway substitutes three values before the call reaches Telegram:

| Placeholder | Resolves to |
| --- | --- |
| \`$peer\` | The current dialog. |
| \`$message\` | The current message. |
| \`$self\` | The account running the module. |

A parameter marked required has no kernel default, so the module must pass it.

### The boundary

The contextual route does not bypass the rest of the system. Telegram's own ACL applies, the denylist applies, premium-only features still need premium, media and assets still need their capabilities, and outbound network still needs \`net\`. The \`mt\` capability is only needed for raw calls through \`ctx.tg.call\`, and even then the policy in the capabilities chapter applies.

The full list, with signatures, parameter types and required flags, is in the Methods tab.`,
  },
  {
    id: 'modules',
    title: 'The shipped modules',
    summary: 'The fifteen modules in the constellations directory, with their commands and capabilities.',
    content: `Each module is a manifest in \`constellations/\`. The commands and capability lists below are read from those manifests.

| Module | Version | Commands | Capabilities |
| --- | --- | --- | --- |
| accounts | 2.0.0 | account, addaccount, accounts | mt |
| acl | 3.0.0 | perms, perm, whois, owadd, owrm, owls, sgls, sg, sgnew, sgdel, sgadd, sgrm, rule, rulerm, ruleclr | mt |
| backups | 1.2.0 | backup, restore | mt, state, files, modules |
| catalyst | 1.3.0 | ld, ul, rl, ex, resetdb | modules |
| executor | 3.4.0 | sh, py, kill | mt, files, net, state, assets |
| genesis | 1.1.0 | none, bot commands only | mt, state |
| help | 2.0.0 | help | mt |
| info | 2.2.0 | info, ping | mt, state |
| logger | 1.2.0 | logs, loglevel | mt, state |
| power | 1.5.0 | restart, stop, resume | mt |
| settings | 3.1.0 | config, alias, rmalias, lsalias, prefix | mt, state |
| shield | 1.0.0 | shield, suspend_api | mt, state |
| singularity | 2.0.1 | dash | mt |
| translations | 2.2.0 | language, translate, loadlex, rmlex | mt, net, files, state |
| updater | 2.0.0 | upd, updlog, updoff, updon | net, mt |

### Lifecycle details worth knowing

- \`power\` aliases \`unpause\` to \`resume\`.
- \`backups\` autostarts the \`send\` task every 60 seconds.
- \`logger\` autostarts the \`pump\` task every 2 seconds and hooks up on rise, unhooks on fade.
- \`updater\` autostarts the \`poller\` task every 300 seconds and calls \`afterglow\` on rise.
- \`genesis\` registers the bot commands \`start\` and \`github\`.
- \`shield\` describes itself as API flood and rate limit protection.

### The daily commands

| Command | Action |
| --- | --- |
| \`.help\` | Open the interactive module catalog and help cards. |
| \`.ping\` | Check MTProto gateway latency and connection health. |
| \`.dash\` | Generate the Singularity panel link and open the Mini App. |
| \`.addaccount\` | Add another account to the supervisor pool. |
| \`.shield\` | View API call rates and adjust the flood protection. |
| \`.config\` | Open the interactive runtime settings editor. |
| \`.backup\` | Create an encrypted archive of state and sessions. |
| \`.restart\` | Reload the kernel processes and active modules. |`,
  },
  {
    id: 'dashboard',
    title: 'The dashboard',
    summary: 'Singularity, the web panel and the Telegram Mini App.',
    content: `Singularity is the embedded interface. The frontend is a Vite and React app that renders a live black hole and lets you fly the camera to four points of interest: the event horizon, the accretion disk, the photon ring and the Einstein ring.

### Running it

The panel serves on port 8787 and exposes system metrics, the observatory log tail, and module management. The bundle is rebuilt on every start, so a stale backend never serves an old panel.

### Opening it in Telegram

Hotaru can open a Cloudflare Horizon tunnel and register the panel with BotFather. From there the dashboard opens as a native Mini App inside Telegram.

### Access

The dashboard is owner-only. A request carries the Telegram \`initData\`, and the backend validates its HMAC-SHA256 signature against the bot token before any data is returned. Secrets are never logged.

### The captured panel

The image below is the running Singularity frontend, captured from the upstream build.

![The Singularity panel: a ray-marched black hole with its accretion disk](media/singularity-panel.webp)`,
  },
  {
    id: 'skill',
    title: 'Module-writing reference',
    summary: 'SKILL.md documents the Hotaru module contract and runtime API.',
    content: `\`SKILL.md\` is the reference for Hotaru's module contract and runtime API. It is available as a single-file download.

### What it contains

- The contract for a module and the boundary between an external module and a built-in one.
- The manifest and its entry points, with the exact source file map.
- The catalogue of the 292 contextual operations, with signatures, positional order, parameter types and required flags.
- The 76 exports of the tools helper, grouped by purpose.
- The security model, the capability delegation rules, and the checks a module must pass.
- A minimal template for an external module and a final acceptance list.

### Where it comes from

The method cards are generated from the upstream sources rather than written by hand, and each card carries the SHA-256 of the file it was derived from. When the snapshot changes, the hashes change with it, so the reader can tell whether the reference still matches the code.

### Language

The guide is written in Russian, the language of the upstream project.`,
  },
];

export const DOCS_RU = [
  {
    id: 'overview',
    title: 'Обзор',
    summary: 'Hotaru — среда выполнения Telegram-юзербота, которая загружает модули .hmod в изолированные песочницы.',
    content: `![Баннер юзербота Hotaru из upstream-проекта](media/hotaru-banner.webp)

Hotaru — Telegram-юзербот на базе GoyGram, асинхронного Python-клиента MTProto с нативной криптографией на Rust. Среда выполнения владеет сессией аккаунта; модули — это сторонний код, который среда загружает, контролирует и изолирует.

### Что даёт среда выполнения

- **Изоляция namespaces.** Каждый модуль работает в собственных namespaces Linux (\`CLONE_NEWNS\`, \`CLONE_NEWIPC\`, \`CLONE_NEWUTS\`, \`CLONE_NEWNET\`), на личной tmpfs, под uid 65534 (\`nobody\`). С ядром модуль говорит через UNIX pipe, а не через сокет.
- **Явные владения.** Модуль объявляет нужное в манифесте: \`mt\`, \`state\`, \`net\`, \`files\`, \`shell\`, \`inline\`, \`modules\`, \`assets\`. \`logs\` и \`fetch\` выдаются всегда.
- **Зашифрованное хранилище.** Строки сессии, записи баз и ключи авторизации лежат в \`sanctuary/hotaru.vault\`, зашифрованные AES-GCM. Единственный читатель — ядро.
- **Защита от флудвейта.** Модуль \`shield\` снимает частоту вызовов API и приостанавливает их до того, как Telegram применит флудвейт.
- **Супервизор нескольких аккаунтов.** Один экземпляр ведёт несколько аккаунтов одновременно, у каждого своя сессия MTProto и изолированное состояние.
- **Веб-панель.** Singularity работает на Node.js и Vite, отдаёт метрики системы, логи и управление модулями на порту 8787. Панель также открывается как Mini App в Telegram через туннель Cloudflare Horizon.

### Устройство среды

Ядро стартует, активирует модули из каталога \`constellations/\` и передаёт каждому объект контекста. Контекст — единственная поверхность, которую видит модуль: помощники для сообщений, хранилище состояния, экраны и контекстные операции Telegram.

### Основа

Hotaru наследует транспорт и криптографию от GoyGram.

![Знак GoyGram](media/goygram-mark.webp)

На графике ниже — бенчмарк TL-кодек GoyGram из upstream-репозитория.

![Бенчмарк TL-кодек GoyGram: 351270 операций в секунду на serialize sendMessage](media/goygram-codec.webp)`,
  },
  {
    id: 'install',
    title: 'Установка',
    summary: 'Требования, скрипт установки, ручная сборка и контейнеры.',
    content: `### Требования

- Linux на x86_64 или aarch64
- Python 3.13 или новее
- Telegram API ID и API Hash с my.telegram.org
- Токен бота от @BotFather — для inline-интерфейса и Mini App
- Пакетный менеджер \`uv\`, который ставит установочный скрипт

### Интерактивная установка

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash
\`\`\`

Скрипт ставит системные пакеты, спрашивает учётные данные Telegram и предлагает способ развёртывания: systemd-сервис на хосте, Docker Compose или контейнер Proxmox LXC.

### Docker Compose

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
docker compose run --rm hotaru
docker compose up -d
\`\`\`

### Proxmox VE и LXC

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
bash lxc/create.sh
\`\`\`

### Ручная сборка через uv

\`\`\`bash
git clone -b develop https://github.com/HotaruProject/Hotaru.git
cd Hotaru
uv sync
uv run python -m hotaru
\`\`\`

Держите \`sanctuary/\` и ключ \`hotaru.vault\` в тайне: в них активные сессии и главные секреты шифрования.`,
  },
  {
    id: 'manifest',
    title: 'Манифест модуля',
    summary: 'Словарь HOTARU, правило первого оператора и все поддерживаемые поля.',
    content: `Модуль — это Python-файл с расширением \`.hmod\`. Загрузчик разбирает его через \`ast\` до запуска байткода, поэтому манифест читается без исполнения модуля.

### Правило первого оператора

Файл должен начинаться с присваивания \`HOTARU\`, которому задаётся литеральный словарь. Любой оператор до него, нелитеральное значение или не словарь приводят к \`ModuleValidationError\`.

\`\`\`python
HOTARU = {
    "id": "clock",
    "version": "1.0.0",
    "commands": ["utc"],
    "capabilities": [],
}
\`\`\`

### Обязательные поля

| Поле | Тип | Правило |
| --- | --- | --- |
| \`id\` | строка | Канонический ID и имя модуля по умолчанию. Не пусто, не длиннее 128 символов, без слэша и NUL. |
| \`version\` | строка | Не пусто. |
| \`commands\` | список строк | Без пустых записей и без пробелов внутри команды. |
| \`capabilities\` | список строк | Имена из реестра владений. |

### Необязательные поля

| Поле | Тип | Значение |
| --- | --- | --- |
| \`name\` | строка | Необязательная подпись для отображения; если её нет, среда использует \`id\`. |
| \`watchers\` | список строк | Точки входа наблюдателей, на которые подписывается среда. |
| \`tasks\` | словарь | Фоновые задачи. У каждой можно задать \`interval\` (секунды, по умолчанию 60) и \`autostart\`. |
| \`aliases\` | словарь | Другие имена команд, отображаемые на существующие. |
| \`config_schema\` | словарь | Настройки модуля для редактора настроек среды. |
| \`lexicon\` | словарь | Локализованные строки по кодам языков, с \`description\` и \`commands\`. |
| \`requires\` | список строк | Модули, которые должны быть на месте. |
| \`after\` | список строк | Модули, активируемые после этого. |
| \`inline_commands\` | список строк | Точки входа inline-запросов. |
| \`rise\` | строка | Обработчик, вызываемый сразу после активации. |
| \`fade\` | строка | Обработчик перед выгрузкой, перезагрузкой или остановкой. |
| \`template_fields\` | словарь | Поля, публикуемые другим модулям. Не больше 64. |
| \`banner\` | строка | URL баннера, http или https. |
| \`bot_commands\` | список строк | Команды, регистрируемые у вспомогательного бота. |

### Проверки

Загрузчик проверяет идентификаторы, версии, списки команд, схемы конфигурации, таблицы переводов, публикуемые поля шаблонов, URL баннеров и списки зависимостей. Перевод может описывать только те команды и inline-команды, которые модуль действительно объявляет. Пространство шаблонов \`hotaru\` зарезервировано.`,
  },
  {
    id: 'capabilities',
    title: 'Владения и безопасность',
    summary: 'Восемь ворот доступа, правила файрвола и список запрещённых целей.',
    content: `Модуль получает только то, что запросил в манифесте.

### Ворота доступа

| Владение | Что даёт |
| --- | --- |
| \`mt\` | Прямые вызовы MTProto через \`ctx.tg.call\`. |
| \`state\` | Постоянное хранилище «ключ — значение» в пространстве модуля. |
| \`net\` | Исходящая сеть по http, https, ws, wss, tcp, tls и udp. |
| \`files\` | Чтение и запись внутри рабочего каталога модуля. |
| \`shell\` | Выполнение команд в рабочем каталоге. |
| \`inline\` | Запрос и управление inline-ботами. |
| \`modules\` | Загрузка, выгрузка, перезагрузка и просмотр модулей. |
| \`assets\` | Скрытое хранилище ресурсов. |

\`logs\` и \`fetch\` выдаются всегда: \`logs\` пишет в журнал обсерватории, \`fetch\` читает сообщения, сущности и разрешает ответы.

### Файрвол

Пока модуль работает, аудит-хук блокирует три вещи:

- Открытие пути, который попадает в защищённое хранилище, или любого файла с окончанием \`.vault\` или \`.session\`. Ошибка: \`PermissionError: module access to Telegram session storage is denied\`.
- Прямой импорт \`goygram\`, \`hotaru\` или \`relay\`. Вместо них модуль использует прокси контекста.
- Прямое открытие сокета. Сеть идёт через владение \`net\`, Telegram — через \`mt\`.

### Список запрещённых целей

\`my.telegram.org\` запрещён и доступен только для чтения. Peer \`777000\` защищён и доступен только для чтения: чтение возвращает пустой результат, запись отклоняется. Проверка payload обходит вложенные структуры, включая закодированные блобы, с ограничением на сложность.

### Что \`mt\` всё равно не пропускает

Даже с \`mt\` пространства имён \`auth.\` и \`phone.\` заблокированы, все методы \`payments.\` и \`wallet.\` заблокированы, а операции безопасности аккаунта — \`account.deleteAccount\`, \`account.resetAuthorizations\`, \`account.getPassword\` — отклоняются. Модули не могут взаимодействовать с экранами согласия Telegram.`,
  },
  {
    id: 'context',
    title: 'Контекст модуля',
    summary: 'Что доступно в ctx: сообщения, состояние, файлы, экраны, шаблоны и диагностика.',
    content: `Контекст — единственный объект, который получает модуль. Он создаётся на каждый вызов команды.

### Сообщения

| Член | Назначение |
| --- | --- |
| \`ctx.respond(content)\` | Ответить в текущий чат. |
| \`ctx.smart_respond(content)\` | Ответить, разбив длинный текст и при необходимости отдав файл. |
| \`ctx.send_file(file, caption)\` | Отправить файл по пути или байтам. |
| \`ctx.upload_file(source)\` | Загрузить файл и вернуть ссылку Telegram. |
| \`ctx.read_attachment_text(reply)\` | Прочитать текст вложения, на которое вы ответили. |
| \`ctx.download(attachment, destination)\` | Скачать вложение на диск. |
| \`ctx.edit(text)\` | Отредактировать сообщение, вызвавшее команду. |
| \`ctx.paginate(content, page, limit)\` | Отправить страницу длинного содержимого с навигацией. |

### Состояние и конфигурация

\`ctx.state\` — пространство имён поверх SQLite. Методы \`get\`, \`set\`, \`delete\`, \`keys\` и \`pointer\` работают со значениями в области модуля. \`ctx.config\` открывает редактор настроек среды, \`ctx.modules\` показывает установленные модули.

### Шаблоны и язык

\`ctx.render_template(key, **values)\` отрисовывает опубликованное поле шаблона. \`ctx.t(key, default, **params)\` берёт строку из активного лексикона, а при отсутствии — переданное значение по умолчанию.

### Диагностика

\`ctx.check_restrictions()\` сообщает, что текущий аккаунт делать не может, например функции только для Premium. \`ctx.classify_error(exc)\` превращает исключение в структурированный разбор. \`ctx.premium()\` и \`ctx.is_premium()\` отвечают про состояние Premium.

### Управление модулями

\`ctx.load_module(source)\` и \`ctx.unload_module(module_id, purge=True)\` управляют другими модулями. Для обоих нужно владение \`modules\`.`,
  },
  {
    id: 'screens',
    title: 'Экраны и формы',
    summary: 'Примитивы Kit для интерактивных меню, пагинаторов и запросов ввода.',
    content: `\`ctx.screens\` собирает интерактивные экраны: сообщение с inline-кнопками, пагинатор или запрос ввода. Нажатие возвращается в обработчик, который создал экран.

### Примитивы

| Вызов | Результат |
| --- | --- |
| \`ctx.screens.button(text, fn)\` | Нейтральная кнопка. |
| \`ctx.screens.primary(text, fn)\` | Акцентная кнопка главного действия. |
| \`ctx.screens.success(text, fn)\` | Кнопка подтверждения. |
| \`ctx.screens.danger(text, fn)\` | Кнопка разрушительного действия. |
| \`ctx.screens.input(text, fn, placeholder)\` | Кнопка, запрашивающая текст. |
| \`ctx.screens.copy(text, value)\` | Кнопка, копирующая значение. |
| \`ctx.screens.url(text, link)\` | Внешняя ссылка. |
| \`ctx.screens.webapp(text, link)\` | Ссылка на Mini App. |
| \`ctx.screens.close()\` | Кнопка, удаляющая экран. |
| \`ctx.screens.back(fn, text)\` | Кнопка возврата к предыдущему экрану. |

### Показ экрана

\`\`\`python
async def panel_cmd(ctx, invocation):
    k = ctx.screens

    async def on_refresh(ctx, nav):
        await render()

    async def render():
        rows = [[k.primary("Refresh", on_refresh), k.close()]]
        await ctx.screens.show(k.screen("<b>Gateway</b> online", rows))

    await render()
\`\`\`

\`ctx.screens.screen(text, rows)\` собирает экран, а \`await ctx.screens.show(screen)\` отправляет его. Обработчик кнопки получает контекст и объект навигации: \`nav.answer(text)\` отвечает на нажатие, а \`nav.ref().edit(screen)\` перерисовывает экран на месте.

### Пагинация и вёрстка

\`ctx.screens.pager(fn, page, pages)\` собирает переключатель страниц, \`ctx.screens.grid(items, columns)\` раскладывает кнопки, \`ctx.screens.footer(back)\` закрывает ряд. \`ctx.screens.table(rows)\` рисует моноширинную таблицу, \`ctx.screens.radio\` и \`ctx.screens.check\` отмечают выбор, \`ctx.screens.icon\` и \`ctx.screens.module_icon\` возвращают иконки.`,
  },
  {
    id: 'tasks',
    title: 'Задачи и жизненный цикл',
    summary: 'rise и fade, фоновые задачи под надзором и пределы, которые держит среда.',
    content: `### rise и fade

\`rise\` выполняется сразу после активации и привязки владений. \`fade\` — перед выгрузкой, перезагрузкой или остановкой. Оба имени называют корутину модуля.

### Задачи под надзором

Задача объявляется в манифесте, а её обработчик называется \`task_<task_name>\`.

\`\`\`python
HOTARU = {
    "id": "metrics_exporter",
    "version": "1.0.0",
    "capabilities": ["state", "net"],
    "commands": [],
    "tasks": {
        "sync_metrics": {
            "interval": 60.0,
            "autostart": True,
        },
    },
}

async def task_sync_metrics(ctx):
    pulse = await ctx.state.get("pulse", 0)
    await ctx.state.set("pulse", pulse + 1)
\`\`\`

Супервизор вызывает обработчик, ждёт его и затем спит \`interval\` секунд. Если обработчик бросает исключение, ошибка пишется в журнал один раз, цикл продолжается, а среда выполнения остаётся рабочей.

### Пределы

Супервизор допускает 128 задач всего и 16 на модуль. Превышение любого предела поднимает \`TaskLimitError\`, а корутина закрывается. При выгрузке модуля его задачи отменяются, и супервизор ждёт их до пяти секунд. При остановке отменяется всё, супервизор закрывается.

### Долгая работа

Работа, которая не укладывается в интервальную модель, запускается корутиной внутри \`rise\`. Отменять её нужно в обработчике \`fade\`: среда вызывает его перед выгрузкой, перезагрузкой или остановкой.`,
  },
  {
    id: 'methods',
    title: '292 контекстных метода',
    summary: 'Как контекстные операции Telegram подставляют аргументы и где проходит граница.',
    content: `В контексте доступны 292 операции Telegram, которым не нужно ни одного владения. Это контекстные маршруты: среда подставляет текущий диалог, текущее сообщение и аккаунт, поэтому модуль пишет одну строку вместо сборки сырого запроса.

\`\`\`python
await ctx.set_checklist_completed(completed=[1], incompleted=[])
\`\`\`

### Подстановка аргументов

Шлюз подставляет три значения до того, как вызов уйдёт в Telegram:

| Подстановка | Что означает |
| --- | --- |
| \`$peer\` | Текущий диалог. |
| \`$message\` | Текущее сообщение. |
| \`$self\` | Аккаунт, от имени которого работает модуль. |

Параметр, помеченный обязательным, не имеет умолчания ядра, поэтому модуль обязан передать его сам.

### Граница

Контекстный маршрут не обходит остальную систему. Действуют собственные права Telegram, список запрещённых целей, функции только для Premium по-прежнему требуют Premium, медиа и ресурсы требуют своих владений, а исходящая сеть — владения \`net\`. Владение \`mt\` нужно только для сырых вызовов через \`ctx.tg.call\`, и даже там действует политика из главы о владениях.

Полный список с сигнатурами, типами параметров и отметками обязательности — во вкладке «Методы».`,
  },
  {
    id: 'modules',
    title: 'Штатные модули',
    summary: 'Пятнадцать модулей каталога constellations с их командами и владениями.',
    content: `Каждый модуль — это манифест в каталоге \`constellations/\`. Команды и списки владений ниже прочитаны прямо из этих манифестов.

| Модуль | Версия | Команды | Владения |
| --- | --- | --- | --- |
| accounts | 2.0.0 | account, addaccount, accounts | mt |
| acl | 3.0.0 | perms, perm, whois, owadd, owrm, owls, sgls, sg, sgnew, sgdel, sgadd, sgrm, rule, rulerm, ruleclr | mt |
| backups | 1.2.0 | backup, restore | mt, state, files, modules |
| catalyst | 1.3.0 | ld, ul, rl, ex, resetdb | modules |
| executor | 3.4.0 | sh, py, kill | mt, files, net, state, assets |
| genesis | 1.1.0 | none, bot commands only | mt, state |
| help | 2.0.0 | help | mt |
| info | 2.2.0 | info, ping | mt, state |
| logger | 1.2.0 | logs, loglevel | mt, state |
| power | 1.5.0 | restart, stop, resume | mt |
| settings | 3.1.0 | config, alias, rmalias, lsalias, prefix | mt, state |
| shield | 1.0.0 | shield, suspend_api | mt, state |
| singularity | 2.0.1 | dash | mt |
| translations | 2.2.0 | language, translate, loadlex, rmlex | mt, net, files, state |
| updater | 2.0.0 | upd, updlog, updoff, updon | net, mt |

### Детали жизненного цикла, о которых стоит знать

- \`power\` связывает \`unpause\` с \`resume\`.
- \`backups\` сам запускает задачу \`send\` каждые 60 секунд.
- \`logger\` сам запускает задачу \`pump\` каждые 2 секунды, подписывается на rise и отписывается на fade.
- \`updater\` сам запускает задачу \`poller\` каждые 300 секунд и вызывает \`afterglow\` на rise.
- \`genesis\` регистрирует команды бота \`start\` и \`github\`.
- \`shield\` описывает себя как защиту от флудвейта и перегрузки API.

### Ежедневные команды

| Команда | Действие |
| --- | --- |
| \`.help\` | Открыть интерактивный каталог модулей и карточки помощи. |
| \`.ping\` | Проверить задержку шлюза MTProto и состояние соединения. |
| \`.dash\` | Получить ссылку на панель Singularity и открыть Mini App. |
| \`.addaccount\` | Добавить ещё один аккаунт в пул супервизора. |
| \`.shield\` | Посмотреть частоту вызовов API и настроить защиту от флуда. |
| \`.config\` | Открыть интерактивный редактор настроек среды. |
| \`.backup\` | Создать зашифрованный архив состояния и сессий. |
| \`.restart\` | Перезагрузить процессы ядра и активные модули. |`,
  },
  {
    id: 'dashboard',
    title: 'Панель управления',
    summary: 'Singularity: веб-панель и Mini App в Telegram.',
    content: `Singularity — встроенный интерфейс. Фронтенд на Vite и React рисует живую чёрную дыру и позволяет подвести камеру к четырём точкам: горизонт событий, аккреционный диск, фотонное кольцо и кольцо Эйнштейна.

### Как запускается

Панель отдаёт метрики системы, хвост журнала обсерватории и управление модулями на порту 8787. Бандл пересобирается при каждом старте, поэтому устаревший бэкенд не отдаёт старую панель.

### Открытие в Telegram

Hotaru может поднять туннель Cloudflare Horizon и зарегистрировать панель у BotFather. После этого дашборд открывается как нативное Mini App внутри Telegram.

### Доступ

Панель доступна только владельцу. Запрос несёт Telegram \`initData\`, а бэкенд проверяет его подпись HMAC-SHA256 токеном бота, прежде чем вернуть хоть какие-то данные. Секреты не пишутся в журнал.

### Захваченная панель

На изображении ниже — работающий фронтенд Singularity, снятый с upstream-сборки.

![Панель Singularity: чёрная дыра с аккреционным диском, отрисованная реймарчем](media/singularity-panel.webp)`,
  },
  {
    id: 'skill',
    title: 'Справочник по разработке модулей',
    summary: 'SKILL.md описывает контракт модулей Hotaru и API среды выполнения.',
    content: `\`SKILL.md\` — справочник по контракту модулей и реальному API Hotaru. Он доступен для скачивания одним файлом.

### Что внутри

- Контракт модуля и граница между внешним модулем и встроенным.
- Манифест и точки входа с точной картой исходников.
- Каталог 292 контекстных операций с сигнатурами, порядком позиционных аргументов, типами параметров и отметками обязательности.
- 76 экспортов помощника tools, сгруппированных по назначению.
- Модель безопасности, правила делегирования владений и проверки, которые модуль обязан пройти.
- Минимальный шаблон внешнего модуля и финальный список приёмки.

### Откуда это взято

Карточки методов генерируются из исходников upstream, а не пишутся вручную, и каждая карточка несёт SHA-256 файла, из которого получена. Когда снимок меняется, меняются и хеши, поэтому читатель понимает, совпадает ли справочник с кодом.

### Язык

Руководство написано по-русски, как и сам проект.`,
  },
];
