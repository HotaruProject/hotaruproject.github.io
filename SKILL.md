---
name: hotaru-modules
description: >-
  Разработка, редактирование, исправление и ревью модулей Telegram-userbot Hotaru
  (.hmod): манифест HOTARU, SandboxContext, команды и алиасы, MTProto/GoyGram,
  сообщения и медиа, inline/rich UI, callbacks и ввод, конфиги, состояние и миграции,
  watchers, lifecycle, фоновые задачи, capabilities, сеть, зависимости и тесты;
  справочник контекстных методов без raw mt, ctx.tools, regdate и search.
  Использовать при создании нового модуля Hotaru, добавлении функций, исправлении
  ошибок и адаптации существующего .hmod. Проверять фактический API целевой версии,
  сохранять поведение и пользовательские данные, не путать sandbox и ядро.
---

# Разработка и редактирование модулей Hotaru

## 1. Назначение и контракт

Ты разрабатываешь настоящий устанавливаемый модуль Hotaru, а не приблизительный
Python-пример. Выполняй пользовательскую задачу в её границах: создание, точечная
правка, расширение, диагностика или ревью. Не переписывай всё без необходимости.

- По умолчанию результат — один самодостаточный `<module_id>.hmod`. Helpers,
  пользовательские строки и статические данные размещай внутри него. Не создавай
  обязательные соседние `.py`, JSON, ресурсы, установщики и скрытые сервисы.
- Предпочитай стандартную библиотеку и штатные API Hotaru. Внешние зависимости
  допустимы только при обоснованной необходимости и совместимости с установкой
  пользователя; явно декларируй их и сообщай об этом. Не устанавливай их молча.
- Тесты можно создавать отдельно в тестовой или временной области; не превращай
  их в обязательную часть устанавливаемого модуля.
- Не меняй ядро Hotaru, ACL, глобальные настройки и sandbox ради обхода ограничения
  модуля. Если публичного контракта недостаточно, укажи конкретный blocker.
- При переносе из Ataraxia/Hikka дополнительно загрузи `ataraxia-to-hotaru`, если
  он доступен. Его контракт однофайловости, зависимостей и соответствия 1:1
  соблюдай для такого переноса; этот скилл не отменяет его ограничений.
- Отвечай на языке пользователя. Код согласуй с проектом. Для `.hmod` соблюдай
  политику Hotaru: не добавляй `#`-комментарии; выбирай ясные имена функций.

## 2. Источник истины: версия и код

Репозиторий: https://github.com/HotaruProject/Hotaru.

База и справочники перепроверены 2026-11-09 на `main`/`develop`
`8cab560e2b9dbc009aab4670c8a78a9a790e2d1a`. Тогда ветки совпадали. Это
историческая отметка, не обещание актуальности API или веток.

### Один файл и навигация

**Этот SKILL.md самодостаточен:** инструкции, все справочники и проверочный код
включены ниже. Для установки достаточно только этого файла; соседние `.md`, `.py`,
дополнительные каталоги и ZIP не требуются. Дополнительный скилл переноса, если
он установлен, — необязательное дополнение, не зависимость этого документа.

- [Приложение A — контекстный API и компактный каталог 292 операций](#context-contract).
- [Приложение B — все 76 tools, regdate, search и примеры](#tools-reference).
- [Приложение C — полные карточки всех 292 методов](#method-cards): RPC,
  namespace, сигнатуры, описания RU/EN и таблицы параметров.
- [Приложение D — самостоятельный проверочный скрипт](#api-inspector):
  AST-инвентаризация API и генерация карточек без импорта Hotaru.

Сначала читай основные правила. В приложениях ищи конкретный `ctx.<name>` или
`ctx.tools.<name>` средствами поиска по этому файлу; не перечитывай весь каталог
для каждой небольшой правки. Указанные пути `hotaru/` и `relay/` относятся к
исходникам целевого Hotaru, не к обязательным файлам рядом со скиллом.

Перед реализацией:

1. Прочитай применимые `AGENTS.md`, исходный модуль и связанные файлы. Проверь
   существующие изменения; не удаляй и не перезаписывай пользовательскую работу.
2. Определи целевые ветку/коммит Hotaru и среду исполнения. Если есть локальная
   установка, приоритет у её исходников. Не меняй её ветку и не обновляй установку.
3. При отсутствии исходников возьми нужные файлы из указанного пользователем
   коммита. Если версия не задана, используй текущую `main`, зафиксировав SHA.
   Репозиторий можно читать в отдельной временной копии; не запускай install.sh.
4. Изучай реализации необходимых методов и оба конца IPC, а не только README,
   названия методов, аннотации `ModuleContext` или встроенные примеры.
5. Если код недоступен, отдели подтверждённое от предположений. Не называй
   непроверенную сигнатуру или поведение гарантированно совместимыми.

### Карта исходников

| Что нужно узнать | Где искать |
| --- | --- |
| Формат и проверка манифеста | `hotaru/modules.py`: `HmodLoader`, `ModuleManifest` |
| Регистрация, rise/fade, tasks | `hotaru/activation.py`, `hotaru/tasks.py` |
| Аргументы, aliases, dispatch | `hotaru/commands.py`, `hotaru/registry.py`, `hotaru/kernel.py` |
| Реальный внешний ctx, invocation, IPC | `relay/sandbox.py`: `WORKER_SOURCE`, `SandboxContext`, `_execute`, `_serve_*` |
| Высокоуровневые Telegram-операции | `relay/context.py`: `ContextOperations`, `MessageOperations`, `CTX_OPERATIONS`, `CTX_CATALOG` |
| Capabilities и ограничения | `relay/caps.py`: `CapabilityHost`, `PROVIDERS`, `KNOWN` |
| Host ctx и доставка ответа | `hotaru/response.py`, `hotaru/runtime.py` |
| UI, callbacks, input | `hotaru/screens.py`, `hotaru/callbacks.py`, `hotaru/runtime.py`, worker-прокси в `relay/sandbox.py` |
| Схема и хранение конфигов | `hotaru/config.py`, `hotaru/state.py` |
| Переводы и шаблоны | `hotaru/i18n.py`, `relay/toolkit.py`, `hotaru/activation.py` |
| Медиа и зависимости | `relay/files.py`, `relay/caps.py`, `hotaru/deps.py` |
| Права и восстановление | `hotaru/access.py`, `hotaru/security.py`, `hotaru/backup.py` |

Не фиксируй в модуле путь к машине разработки, временной копии или исходникам.
Не подгружай исполняемый код из сети для «совместимости».

## 3. Сначала опиши поведение

Для нового модуля составь краткую спецификацию. Для правки сначала восстанови
существующий контракт и найди причину ошибки. Зафиксируй:

- команды, алиасы, обычные/bot/inline-входы и разбор аргументов;
- поведение без аргументов, по reply, с вложением, подписью и неверным вводом;
- кто вызывает действие, от чьего имени и в какой чат/топик отправляется ответ;
- edit/reply/send, обычное/rich форматирование, кнопки, страницы и ввод;
- конфиги, state-ключи, версии схемы и совместимость со старыми данными;
- watchers, расписание, загрузку/выгрузку и обработку ошибок;
- требуемые capabilities, внешние сервисы и зависимости.

При редактировании сохраняй ID модуля, команды, алиасы, имена конфигов и state-ключи,
если пользователь не запросил их изменение. Исправляй минимальный необходимый
участок. Для изменения схемы данных спроектируй идемпотентную миграцию с сохранением
старых значений; не сбрасывай базу и не используй `purge` как «исправление».

## 4. Главная граница: внешний модуль ≠ встроенный

Встроенные `constellations/*.hmod` исполняются в ядре. Сторонний модуль работает
в отдельном worker с `SandboxContext`. Сходные имена объектов не делают API равным.

Для внешнего `.hmod`:

- Не используй `ctx.runtime`, внутренний `app`, session, connection или database.
- Не импортируй `hotaru`, `relay`, `goygram` во время выполнения. Не используй
  Telethon/Pyrogram-объекты и их Request-классы как будто Hotaru предоставляет их.
- `invocation` сокращён: проверяй наличие `name`, `args`, `raw_args`, `source`,
  `chat_id`, `message_id`; не рассчитывай на `invocation.message`.
- `ctx.message` — ограниченный объект, а не полноценное сообщение GoyGram.
  Поля текста, вложения, out/sender и reply проверяй по реальному payload dispatch.
  Значение `False`/`None` в таком объекте не всегда доказывает отсутствие поля
  в исходном Telegram-сообщении. При необходимости получи сообщение через API.
- `ctx.msg()`, `ctx.reply()` и `ctx.resolve()` могут возвращать TL-словари или
  `None`, а не объекты с `.text`, `.download()`, `.edit()` и прочими методами.
- `ctx.config` в проверенном worker — снимок `dict`, не изменяемый `ModuleConfig`.
  Правка `ctx.config["x"]` не сохраняет значение. Найди поддерживаемую операцию
  записи; не обещай её по сходству с host API.
- Не сериализуй через IPC ctx, callback, coroutine, файловый объект, lock, Path
  или экземпляр произвольного класса. Передавай примитивы, списки и словари.
  Байты разрешены только там, где текущий IPC-кодек и конкретный метод их поддерживают.

Каждый используемый API проверяй по цепочке:
**внешний proxy → IPC-запрос → host handler → фактическая операция**.
В частности, это обязательно для медиа, input, rich UI, config-записи и tasks.

## 5. Манифест и точки входа

Первое AST-выражение файла — литеральный `HOTARU = {...}`. Перед ним не должно быть
import, module docstring или `from __future__`. Обязательные поля: `id`, `version`,
`commands`, `capabilities`; списки задавай именно списками литеральных строк.

Используй простой уникальный kebab-case ID и имена команд из ASCII letters/digits/
underscore, совместимые с путями и dependency storage. Не занимай ID и команды ядра.

Основные соглашения:

```python
async def command_example(ctx, invocation):
    ...

async def watcher_example(ctx, event):
    ...

async def task_example(ctx):
    ...
```

`...` здесь обозначает сигнатуры, не допустимую заглушку в готовом результате.
`watchers: ["example"]` связывается с `watcher_example`; task объявляется в
`tasks` с `interval` и `autostart`; имена rise/fade указываются в манифесте явно.
Inline handlers в проверенном worker вызываются как `inline_name(query, args)`,
не как обычная команда с ctx. Маршрут `bot_commands` отдельно проследи в dispatch:
название `bot_name` в host binder ещё не гарантирует такой target в worker.

Загрузчик может допускать более широкие имена, fallback handlers и поля, чем
worker действительно обслуживает. Используй канонические `command_<name>`;
не полагайся на host fallback, особенно для дефисов и специальных символов.

Поля `after` и `requires` различны: первое относится к порядку модулей,
второе — к Python-зависимостям. Порядок загрузки не предоставляет прямой импорт
или общий Python-объект другого модуля.

## 6. Команды и ответы

- `invocation.args` — уже разделённые по whitespace аргументы; это не shell parser.
  Для исходного текста используй `raw_args`. Если нужна обработка кавычек,
  применяй явный parser к raw_args, не собирай исходник обратно через `join(args)`.
- Не зашивай `.` в сообщения usage; получай актуальный префикс через доступный ctx.
- В проверенном API `await ctx.reply()` получает reply-сообщение, а
  `await ctx.reply_text()` его текст. Это не отправка ответа.
- Для ответа используй `await ctx.respond(text, ...)`; для режима указывай
  поддерживаемый `output="auto"`, `"edit"` или `"reply"` осознанно.
- Последовательные status/result ответы проверяй на отсутствие дубликатов,
  редактирование именно нужного сообщения и сохранение привязки к исходному чату.
- Не выбирай адресата по принципу «первый доступный ID». Различай actor, peer,
  message_id, topic_id, account и inline_message_id. Не теряй topic при reply.
- Для raw MT используй проверенный `ctx.tg.call(method, kwargs)` с capability `mt`.
  TL-конструкторы задаются словарями с ключом `_`. Проверяй форму результата;
  не считай любой truthy dict подтверждением успешного действия.
- Высокоуровневые операции из `relay/context.py` могут не требовать raw `mt`;
  не добавляй эту capability «на всякий случай». Доступность метода не отменяет
  серверных прав Telegram, denylist и ограничений политики ядра.
- Сначала найди готовую операцию в [приложении A](#context-contract), а не заменяй её
  raw RPC с лишней capability. «Без capabilities» относится к выбранному маршруту
  вызова, не ко всему модулю: state, внешняя сеть и загрузка файла имеют свои права.
- Escape пользовательский текст до вставки в HTML. Не escape целую готовую
  разметку и не выполняй двойное экранирование. Учитывай entities и UTF-16 offsets.
- Длинные ответы разбивай безопасно для HTML или отправляй файлом только через
  реально поддерживаемый путь. Не обрезай молча существенные данные.

## 7. Capabilities, данные и безопасность

Запрашивай минимум прав для реальных функций. В проверенной версии известны
`mt`, `state`, `net`, `files`, `shell`, `inline`, `modules`, `assets`, `logs`, `fetch`;
`logs` и `fetch` имеют отдельный всегда доступный маршрут. Перепроверь это для цели.

- `net`: сеть через `ctx.net()` / `ctx.stream()` и поддерживаемые cap-операции.
  Не открывай прямые sockets и не обходи запреты внутренних/частных адресов.
- `files`: штатные операции workspace, не доступ к файловой системе хоста.
- `assets`: в проверенном worker upload/download медиа используют этот provider;
  наличие `files` само по себе не гарантирует отправку локального файла.
- `shell`: только при реальной необходимости. Не заменяй обычную логику shell,
  не интерполируй непроверенный ввод, не запускай установщики и привилегированные
  команды. Учитывай отдельные synchronous/job пути и их разные ограничения.
- `modules`: только если назначение — управление модулями; не выдавай для удобства.
- Не обходи consent, ограничения аккаунта, защищённые peers, auth/payment policy,
  seccomp и namespace-границы. Не предлагай portable как безопасный аналог strict.
- Не читай/не меняй vault, master keys, сессии, глобальные настройки или чужой state.
  Никогда не помещай секреты в код, callback payload, логи и диагностические ответы.

`ctx.state` использует namespace данного модуля. В проверенном worker его методы
`get/set/delete/keys` синхронные: не ставь `await` автоматически. `get()` способен
вернуть default при отказе в capability; это не доказательство доступного хранения.
Объявляй `state`, когда оно нужно; проверяй ошибки записи.

Используй короткие ключи, совместимые с `StateNamespace._validate_key`, и JSON-данные.
Зарезервированные lifecycle-ключи не трогай. Изменение вложенного dict/list после
`get()` не сохраняется автоматически — вызови `set()`. Read-modify-write не атомарен:
предусмотри конкурентные команды, callbacks и повторные события.

Не называй state и module config зашифрованными без проверки: в изученном коде
`runtime_settings` шифруется, а `module_state` хранит JSON. `secret` маскирует UI,
но сам по себе не обеспечивает шифрование поля. Не обещай защиту секретов на диске.

## 8. Конфигурация и переводы

- Объявляй `config_schema` литерально: тип, default, диапазон, длина, regex,
  options, item-schema и secret — по актуальному `validator_from_spec`.
- Не выдумывай JSON-формат для каждого Python validator: наличие класса в ядре
  не означает поддержку его имени в литеральной схеме.
- Валидируй границы, пустые строки, неверные типы, `None`, boolean вместо integer,
  нечисловые/нефинитные значения там, где это применимо.
- Различай конфиг пользователя и служебное состояние. Изменение default не должно
  незаметно уничтожать уже сохранённое значение. Миграции делай повторяемыми.
- Строки интерфейса централизуй; для однофайлового внешнего модуля допустим свой
  словарь языков и явный helper с fallback. Не пиши в глобальный `lexicon/`.
- `HOTARU.lexicon` обслуживает метаданные/справку, но не гарантирует автоматическую
  доступность каждой строки в worker `ctx.t()`. Проследи, какой translations payload
  передаётся каждому типу вызова; не смешивай глобальные ключи и локальные строки.
- `template_fields` задавай явно; не используй eval/exec для шаблонов. Межмодульные
  значения требуют штатного экспорта и `render_template_async`; сохраняй scopes.

### Штатные tools вместо самодельных helpers

Внешнему worker доступен `ctx.tools` из `TOOLKIT_FUNCS`; не импортируй
`relay.toolkit`. Ищи готовые `message_text`, `entities_to_html`, `duration`,
`file_size`, `search`, `regdate`, template/HTML и collection helpers в
[приложении B](#tools-reference). Не путай чистый helper с выполняющим Telegram-действие API.

- `ctx.tools.regdate(user_id, registration_month=..., not_after=...)` синхронный,
  локальный и без capabilities. Это **оценка** с `earliest/latest/error_days`,
  `estimated=True` и `conflict`, не точная официальная дата Telegram.
- `await ctx.tools.search(values, query, ...)` асинхронный локальный fuzzy search,
  а не поиск сообщений в Telegram. Он возвращает records с value/score/matched/layout.
- Не все функции экспортируемого namespace работоспособны в sandbox: например,
  `prune_logs` импортирует ядро, а `check_restrictions` без host app не проверяет
  реальное состояние аккаунта. Смотри ограничения в справочнике.

## 9. UI, callbacks и input

Сначала выбери один реально доступный путь: `ctx.respond(buttons=...)`, `ctx.ui`,
`ctx.screens` или inline-form. Не смешивай host `Kit/Nav/ScreenRef` и worker-прокси.

- Проверь сигнатуру callback: в worker UI handler может получать `(callback)`
  либо `(callback, payload)`, screen navigation — `(ctx, nav)` только по своему
  поддерживаемому маршруту. Не выбирай сигнатуру по внешнему виду кнопки.
- Предпочитай именованные module-level handlers и сериализуемые payload ID.
  Не захватывай ctx, исходное message, сеть или mutable данные в nested closures:
  восстановление callback после рестарта/hibernation может потерять эти значения.
- Callback context не равен командному ctx. Проверь доступные методы, наличие
  языка/конфига/state и источник данных повторно при нажатии.
- Используй штатные binding и проверку доступа. Не формируй собственный обход
  подписанных callback_data; не доверяй actor, peer и ID из payload без проверки.
- Подтверждение нажатия, редактирование формы и удаление — разные операции.
  В проверенном callback API подтверждение — `respond`, а не `answer`.
- Для input проверь весь маршрут: кнопка → запрос → ввод → авторизация → handler.
  Наличие `input()` у host Kit или `SandboxNav.value` не гарантирует worker feature.
- Поддержи истёкшие формы, повторное нажатие, отмену, ошибку ввода, отозванные права,
  выгрузку/рестарт и отсутствие inline-бота. Проверяй актуальность целевого объекта
  непосредственно перед необратимым действием.
- Rich HTML и стили могут требовать Premium/другой транспорт. Предусмотри обычный
  fallback без потери смысла; не выдавай сырой `<table>`/`<footer>` как готовый plain UI.
- Не обещай host banner/иконки/ScreenRef на стороне worker без реализации proxy.

## 10. Медиа и внешняя сеть

Для медиа различай metadata attachment, сырое Telegram media, uploaded InputFile,
байты, URL и путь. Это разные значения, не взаимозаменяемый `file`.

- Проверь source/reply, вид вложения, caption, MIME, имя, размер и текстовую кодировку.
- Для текста вложения используй `read_attachment_text()` с явным лимитом, если
  его хватает: это отдельный bound-message путь, не произвольное чтение файлов.
- Проследи upload/download и интерпретацию пути на host и worker. Общий абсолютный
  путь или BytesIO нельзя считать работающими через IPC по умолчанию.
- Для временных файлов используй допустимый workspace, уникальные имена и `finally`.
  Не удаляй пользовательский файл после отправки и не переходи по чужим symlink.
- Для HTTP проверяй status, content type, размер, `truncated` и тело ответа.
  JSON разбирай отдельно; результат `ctx.net()` не является aiohttp/requests response.
- Binary response может быть base64 с явным encoding; не декодируй его как UTF-8.
- Задавай таймауты/лимиты, закрывай streams в `finally`. Retry ограничивай и
  различай безопасное чтение и запись: повтор может дублировать действие.
- Тестируй отказ capability, недоступность сервиса, redirect, не-JSON, пустой ответ,
  timeout, rate limit и FloodWait. Не отправляй приватный текст стороннему сервису
  без явного назначения функции и понятного пользователю поведения.

## 11. Lifecycle, watchers и конкурентность

Worker в изученной версии обслуживает запросы через потоки и отдельные
`asyncio.run()`, не через единый вечный event loop модуля.

- Не храни глобально loop-bound session, Future, asyncio.Lock или фоновые tasks,
  рассчитывая использовать их из следующей команды или callback.
- Не превращай `asyncio.create_task()` в команде в постоянный сервис: цикл вызова
  завершится. Для расписаний используй манифест `tasks` и `task_<name>`.
- Учитывай параллельные вызовы и shared Python globals. Не держи threading lock
  через await/IPC; используй короткие critical sections и продуманную модель данных.
- Worker может завершиться и пересоздаться при простое/сбое. Важные данные храни
  через штатный state; не полагайся на глобальный cache как единственный источник.
- Rise делай идемпотентным и ограниченным по времени, без дублей уведомлений и
  внешних действий. Fade — best-effort cleanup; он не гарантирован при аварии.
- Watcher не проходит тот же командный ACL-маршрут. Явно фильтруй chat, sender,
  направление, тип события, собственные ответы и повторную обработку. Не вызывай
  команду от чужого имени и не создавай reply-loop.
- Фильтруй watcher до сетевых операций. Используй deduplication и ограниченную
  нагрузку, не создавай бесконечный поток задач на каждое сообщение.
- Уточни доступный payload watcher: text/sender/message могут не передаваться
  целиком. При необходимости fetch; не подменяй отсутствие данных догадкой.

## 12. Проверка: обязательные уровни

### A. Статически, без выполнения модуля

Не импортируй `.hmod` для проверки синтаксиса. Не делай обычный `import hotaru`:
инициализация пакета может переисполнить Python или подготовить окружение.

Этот скрипт принимает путь единственного модуля; сохраняй его во временной области
или выполни через stdin средствами своей оболочки:

```python
import ast
import io
import sys
import tokenize
from pathlib import Path

path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")
assert path.suffix == ".hmod", "Expected .hmod"
tree = ast.parse(source, filename=str(path))
assert tree.body, "Empty module"
first = tree.body[0]
assert isinstance(first, ast.Assign), "First statement must assign HOTARU"
assert len(first.targets) == 1
assert isinstance(first.targets[0], ast.Name) and first.targets[0].id == "HOTARU"
manifest = ast.literal_eval(first.value)
assert isinstance(manifest, dict)
assert all(key in manifest for key in ("id", "version", "commands", "capabilities"))
assert isinstance(manifest["id"], str) and manifest["id"]
assert isinstance(manifest["version"], str) and manifest["version"]
for key in ("commands", "capabilities"):
    assert isinstance(manifest[key], list)
    assert all(isinstance(value, str) and value for value in manifest[key])
functions = {node.name for node in tree.body if isinstance(node, ast.AsyncFunctionDef)}
assert all("command_" + name in functions for name in manifest["commands"])
assert not any(token.type == tokenize.COMMENT for token in tokenize.generate_tokens(io.StringIO(source).readline))
compile(tree, str(path), "exec", dont_inherit=True)
print("Static checks passed; runtime compatibility not tested")
```

Это минимальный консервативный smoke-check канонического модуля, не замена
`HmodLoader` и не полный валидатор всех optional полей. Проверяй также манифест
штатным загрузчиком в подготовленной целевой Linux-среде без запуска Telegram,
когда такой безопасный harness уже доступен. Не запускай bootstrap ради проверки.

### B. Unit и contract tests

- Pure-функции: разбор аргументов, валидация, escape, форматирование и миграции.
- Mock ctx, максимально похожий на SandboxContext, а не на богатый host ctx.
  Отсутствующие методы должны давать ошибку, а не универсальный MagicMock success.
- IPC/host-контракты проверяй отдельно; mock не доказывает наличие provider.
- Покрой happy path, пустые args/reply, неверный ввод, старые данные, отказ прав,
  сетевые/Telegram ошибки и отсутствие целевого объекта.
- При правке воспроизведи исходный баг до изменения и проверь устранение после.
  Если воспроизведение невозможно, прямо скажи это. При расширении добавь регрессии
  для прежних команд, форматов ответа и state.

### C. Реальная интеграция — только с разрешения пользователя

Используй тестовую Linux-установку, штатную загрузку `.hmod`, фактический strict
sandbox и тестовый чат/аккаунт. Без явного разрешения не авторизуйся в Telegram,
не загружай модуль в рабочий userbot и не отправляй реальные сообщения.

Проверь объявленные capabilities; отсутствие случайных пакетов и файлов рядом;
другой CWD; команды, aliases, edit/reply/topic; медиа; callbacks/input; рестарт;
unload/reload; восстановление state; совместимость со старыми данными.
Не проверяй обработку критических сессионных ошибок на рабочем аккаунте: в
некоторых версиях обработчик Hotaru удаляет каталог проблемного аккаунта.

Не утверждай «работает в Hotaru», если выполнены только compile или mocks.
Чётко разделяй: статически проверено / mock tests / IPC contract / live integration.

## 13. Минимальный шаблон внешнего модуля

Этот пример использует только bound response и не требует capabilities. Он не
объявляет лишних API, не зависит от файлов рядом и не выполняет действия на import.

```python
HOTARU = {
    "id": "example",
    "version": "1.0.0",
    "commands": ["example"],
    "capabilities": [],
    "lexicon": {
        "en": {
            "description": "A minimal example",
            "commands": {"example": {"description": "Show a greeting"}},
        },
        "ru": {
            "description": "Минимальный пример",
            "commands": {"example": {"description": "Показать приветствие"}},
        },
    },
}

import html

STRINGS = {
    "en": {"greeting": "Hello, {name}!", "default_name": "world"},
    "ru": {"greeting": "Привет, {name}!", "default_name": "мир"},
}


def localized(ctx, key):
    language = str(ctx.i18n.language).replace("_", "-").split("-", 1)[0].lower()
    return STRINGS.get(language, STRINGS["en"]).get(key, STRINGS["en"][key])


async def command_example(ctx, invocation):
    name = invocation.raw_args.strip() or localized(ctx, "default_name")
    text = localized(ctx, "greeting").format(name=html.escape(name, quote=False))
    await ctx.respond(text, parse_mode="HTML", rich=False)
```

Не сохраняй имя/команды шаблона в пользовательском модуле. Добавляй только функции,
нужные задаче, и повторно проверяй их по целевому коду.

## 14. Финальная приёмка и ответ

Перед завершением проверь:

- Нет заглушек, fake-success, выдуманных API, лишних прав и зависимостей.
- Изменены только согласованные файлы и поведение; данные пользователя сохраняются.
- Новый манифест и handlers согласованы; imports и top-level код безопасны.
- User input экранирован, данные ограничены по размеру, адресаты и права проверены.
- Сеть и внешние действия имеют осмысленные ошибки и управляемый lifecycle.
- Нет секретов, абсолютных dev-путей, обязательных sidecar и изменений ядра.
- Проверки выполнены с указанной глубиной; ограничения не скрыты.

В ответе укажи готовый путь к `.hmod`, кратко опиши изменения, требуемые capabilities
и зависимости, целевой коммит/версию, результаты проверок и что не запускалось.
Для исправления объясни причину ошибки. Не заявляй полноценную интеграционную
проверку без запуска в целевой среде и не проси рабочие ключи/сессию для тестов.

<a id="context-contract"></a>
## Приложение A. Контекстный API и компактный каталог

## Контекстные операции Hotaru без raw capability `mt`

Источник: `relay/context.py`, `relay/sandbox.py`, `relay/caps.py` на коммите
`8cab560e2b9dbc009aab4670c8a78a9a790e2d1a`, проверено 2026-11-09.

### 1. Что означает «без capabilities»

В обсуждении упоминалось 229 методов; в проверенном исходнике **292 записи
`CTX_CATALOG`**, плюс отдельно определённые message helpers. Не урезай список
до произвольного числа и не утверждай, что все записи всегда исполнимы.

Внешний `ctx.<operation>()` идёт через `_ctx_call` → `_op_call` → `_serve_op` →
`CapabilityHost._mt_call`. Этот маршрут не требует декларировать raw `mt`.
Напротив, `ctx.tg.call()`/`ctx.cap("mt", ...)` идут через проверку capability.
Не используй приватный `_ctx_call` напрямую как публичный raw RPC API.

**Без raw `mt` не значит без ограничений:**

- Telegram-права администратора, доступность RPC в слое, Premium, FloodWait,
  denylist, read-only peers и запрет оплачиваемых операций продолжают действовать.
- `set_profile_username` → `account.updateUsername` и `search_all_messages` →
  `messages.searchGlobal` присутствуют в каталоге, но запрещены `MT_BLOCKED`.
  Добавление `mt` их не разблокирует. Это отмеченные исключения, не рабочие примеры.
- Загрузка медиа с локального диска в проверенном worker использует `assets`.
  Наличие `send_photo` без raw `mt` не делает локальный upload permissionless.
- Внешний перевод требует `net`; персистентность — `state`; доступ к файлам и
  inline gateway также проверяется отдельно. Выбирай capabilities по всей цепочке.

### 2. Как читать каталог

Ниже **контрактные обозначения**, не объявления Python-функций:

- Все перечисленные операции вызываются как `await ctx.<name>(...)`.
- `$peer` — текущий чат; `$message` — текущее сообщение только при совместимом
  адресате; `$random` — генерируемый `random_id`. В task/source-less ctx их может
  не быть: тогда передавай адресата и ID явно.
- `=?` — необязательное TL-поле; обычно лучше не передавать, чем передавать `None`.
- До `*` указан порядок positional аргументов из каталога. Defaults подставляются
  отдельно, поэтому **используй keywords**, если пропускаешь peer/message/defaults.
  Например `await ctx.chat_history(limit=10)`, не `ctx.chat_history(10)`.
- После `*` — дополнительные keyword-поля. Неизвестные, повторные аргументы и
  запрещённые поля отвергаются до RPC. `timeout` не является общим keyword каталога.
- `chat_id` может быть alias для `peer`/`channel`, но если RPC имеет настоящий
  `chat_id: long`, это raw ID basic group, не произвольный InputPeer.
- `message_id` заменяет `msg_id` либо скалярный `id: int`; `topic_id` заменяет
  `top_msg_id` только у соответствующей операции. Это не универсальные kwargs.
- Типы InputPeer/InputUser/InputChannel преобразуются из подходящих entity/TL
  значений, username или ID с разрешением через ctx. `Vector<T>` требует список/
  tuple. Строка не заменяет вектор, а ID сообщения не равен ID пользователя.
- Для TL-типа, required/default/forbidden/RPC используй read-only скрипт
  встроенный скрипт из [приложения D](#api-inspector) с `--section catalog`
  либо сам `CTX_CATALOG`.
  Нельзя выдумывать return type: host возвращает обработанное тело RPC, не всегда
  dict и не полноценный объект сообщения.

Общие guards отвергают paid/business fields, в частности ненулевые `allow_paid_stars`,
`allow_paid_floodskip`, `stars`, `subscription_pricing`, а также `reactionPaid`.
У `create_chat_invite` `subscription_pricing` явно запрещён и не указан ниже.

### 3. Каталог: все 292 записи

Развёрнутые карточки с RPC, TL-типами и таблицами параметров:
[приложение C](#method-cards). Здесь сохранён компактный индекс,
чтобы выбор метода не требовал загрузки большого справочника целиком.

#### Checklist, polls, scheduled, reactions — 1–20

1. `set_checklist_completed(peer=$peer, msg_id=$message, completed, incompleted)`
2. `add_poll_answer(peer=$peer, msg_id=$message, answer)`
3. `remove_poll_answer(peer=$peer, msg_id=$message, option)`
4. `unread_poll_votes(peer=$peer, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0, *, top_msg_id=?)`
5. `mark_poll_votes_read(peer=$peer, *, top_msg_id=?)`
6. `poll_statistics(peer=$peer, msg_id=$message, *, dark=?)`
7. `scheduled_messages(peer=$peer, hash=0)`
8. `scheduled_by_ids(peer=$peer, id)`
9. `publish_scheduled(peer=$peer, id)`
10. `cancel_scheduled(peer=$peer, id)`
11. `configure_chat_reactions(peer=$peer, available_reactions, *, reactions_limit=?, paid_enabled=?)`
12. `available_reactions(hash=0)`
13. `set_default_reaction(reaction)`
14. `unread_reactions(peer=$peer, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0, *, top_msg_id=?, saved_peer_id=?)`
15. `mark_reactions_read(peer=$peer, *, top_msg_id=?, saved_peer_id=?)`
16. `popular_reactions(limit=50, hash=0)`
17. `recent_reactions(limit=50, hash=0)`
18. `clear_recent_reactions()`
19. `remove_member_reactions(peer=$peer, participant)`
20. `remove_member_message_reaction(peer=$peer, msg_id=$message, participant)`

#### Saved Messages и forums — 21–40

21. `saved_dialogs(offset_date=0, offset_id=0, offset_peer={'_': 'inputPeerEmpty'}, limit=50, hash=0, *, exclude_pinned=?, parent_peer=?)`
22. `saved_history(peer, offset_id=0, offset_date=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0, *, parent_peer=?)`
23. `clear_saved_history(peer, max_id, *, parent_peer=?, min_date=?, max_date=?)`
24. `pinned_saved_dialogs()`
25. `set_saved_dialog_pinned(peer, *, pinned=?)`
26. `reorder_saved_pins(order, *, force=?)`
27. `saved_reaction_tags(hash=0, *, peer=?)`
28. `rename_saved_tag(reaction, *, title=?)`
29. `suggested_saved_tags(hash=0)`
30. `saved_dialogs_by_peers(ids, *, parent_peer=?)`
31. `mark_saved_history_read(parent_peer, peer, max_id)`
32. `forum_topics(peer=$peer, offset_date=0, offset_id=0, offset_topic=0, limit=50, *, q=?)`
33. `forum_topics_by_ids(peer=$peer, topics)`
34. `edit_forum_topic(peer=$peer, topic_id, *, title=?, icon_emoji_id=?, closed=?, hidden=?)`
35. `set_forum_topic_pinned(peer=$peer, topic_id, pinned)`
36. `reorder_forum_pins(peer=$peer, order, *, force=?)`
37. `create_forum_topic(peer=$peer, title, random_id=$random, *, title_missing=?, icon_color=?, icon_emoji_id=?, send_as=?)`
38. `remove_forum_topic(peer=$peer, top_msg_id)`
39. `set_forum_enabled(channel=$peer, enabled, tabs)`
40. `set_forum_message_view(channel=$peer, enabled)`

#### Stories — 41–69

41. `story_posting_quota(peer)`
42. `post_story(peer, media, privacy_rules, random_id=$random, *, pinned=?, noforwards=?, fwd_modified=?, media_areas=?, caption=?, entities=?, period=?, fwd_from_id=?, fwd_from_story=?, albums=?, music=?)`
43. `edit_story(peer, id, *, media=?, media_areas=?, caption=?, entities=?, privacy_rules=?, music=?)`
44. `delete_stories(peer, id)`
45. `set_stories_on_profile(peer, id, pinned)`
46. `story_feed(*, next=?, hidden=?, state=?)`
47. `profile_stories(peer, offset_id=0, limit=50)`
48. `archived_stories(peer, offset_id=0, limit=50)`
49. `stories_by_ids(peer, id)`
50. `mark_stories_read(peer, max_id=0)`
51. `story_viewers(peer, id, offset='', limit=50, *, just_contacts=?, reactions_first=?, forwards_first=?, q=?)`
52. `story_view_counts(peer, id)`
53. `story_link(peer, id)`
54. `activate_story_stealth(*, past=?, future=?)`
55. `react_to_story(peer, story_id, reaction, *, add_to_recent=?)`
56. `peer_stories(peer)`
57. `story_read_markers()`
58. `peer_latest_story_ids(id)`
59. `story_posting_chats()`
60. `set_peer_stories_hidden(peer, hidden)`
61. `story_reaction_senders(peer, id, limit=50, *, forwards_first=?, reaction=?, offset=?)`
62. `reorder_profile_story_pins(peer, id)`
63. `search_stories(offset='', limit=50, *, hashtag=?, area=?, peer=?)`
64. `create_story_album(peer, title, stories)`
65. `edit_story_album(peer, album_id, *, title=?, delete_stories=?, add_stories=?, order=?)`
66. `reorder_story_albums(peer, order)`
67. `remove_story_album(peer, album_id)`
68. `story_albums(peer, hash=0)`
69. `story_album_items(peer, album_id, offset=0, limit=50)`

#### Stickers, emoji, GIF — 70–108

70. `stickers_for_emoji(emoticon, hash=0)`
71. `installed_sticker_sets(hash=0)`
72. `sticker_set(stickerset, hash=0)`
73. `install_sticker_set(stickerset, archived=False)`
74. `uninstall_sticker_set(stickerset)`
75. `reorder_sticker_sets(order, *, masks=?, emojis=?)`
76. `saved_gifs(hash=0)`
77. `set_gif_saved(id, unsave)`
78. `featured_sticker_sets(hash=0)`
79. `mark_featured_stickers_seen(id)`
80. `recent_stickers(hash=0, *, attached=?)`
81. `set_sticker_recent(id, unsave, *, attached=?)`
82. `clear_recent_stickers(*, attached=?)`
83. `archived_sticker_sets(offset_id=0, limit=50, *, masks=?, emojis=?)`
84. `installed_masks(hash=0)`
85. `media_sticker_sets(media)`
86. `favorite_stickers(hash=0)`
87. `set_sticker_favorite(id, unfave)`
88. `search_sticker_sets(q, hash=0, *, exclude_featured=?)`
89. `bulk_sticker_set_action(stickersets, *, uninstall=?, archive=?, unarchive=?)`
90. `older_featured_sticker_sets(offset=0, limit=50, hash=0)`
91. `custom_emoji_documents(document_id)`
92. `installed_emoji_sets(hash=0)`
93. `featured_emoji_sets(hash=0)`
94. `search_custom_emoji(emoticon, hash=0)`
95. `search_emoji_sets(q, hash=0, *, exclude_featured=?)`
96. `owned_sticker_sets(offset_id=0, limit=50)`
97. `search_stickers(q, emoticon, lang_code, offset=0, limit=50, hash=0, *, emojis=?)`
98. `create_sticker_set(user_id, title, short_name, stickers, *, masks=?, emojis=?, text_color=?, thumb=?, software=?)`
99. `remove_sticker(sticker)`
100. `move_sticker(sticker, position)`
101. `add_sticker(stickerset, sticker)`
102. `set_sticker_set_thumbnail(stickerset, *, thumb=?, thumb_document_id=?)`
103. `check_sticker_set_name(short_name)`
104. `suggest_sticker_set_name(title)`
105. `edit_sticker_metadata(sticker, *, emoji=?, mask_coords=?, keywords=?)`
106. `rename_sticker_set(stickerset, title)`
107. `remove_sticker_set(stickerset)`
108. `replace_sticker(sticker, new_sticker)`

#### Contacts — 109–129

109. `contact_ids(hash=0)`
110. `contact_statuses()`
111. `contacts_list(hash=0)`
112. `import_contacts(contacts)`
113. `remove_contacts(id)`
114. `remove_contacts_by_phone(phones)`
115. `block_peer(id, *, my_stories_from=?)`
116. `unblock_peer(id, *, my_stories_from=?)`
117. `blocked_peers(offset=0, limit=50, *, my_stories_from=?)`
118. `search_public_peers(q, limit=50, *, broadcasts=?, bots=?)`
119. `frequent_peers(offset=0, limit=50, hash=0, *, correspondents=?, bots_pm=?, bots_inline=?, phone_calls=?, forward_users=?, forward_chats=?, groups=?, channels=?, bots_app=?, bots_guestchat=?)`
120. `reset_peer_rating(category, peer)`
121. `clear_imported_contacts()`
122. `imported_contacts()`
123. `set_frequent_peers_enabled(enabled)`
124. `add_contact(id, first_name, last_name, phone, *, add_phone_privacy_exception=?, note=?)`
125. `accept_contact(id)`
126. `set_close_friends(id)`
127. `replace_blocklist(id, limit=50, *, my_stories_from=?)`
128. `contact_birthdays()`
129. `edit_contact_note(id, note)`

#### Dialogs, messages, folders — 130–180

130. `dialogs(offset_date=0, offset_id=0, offset_peer={'_': 'inputPeerEmpty'}, limit=50, hash=0, *, exclude_pinned=?, folder_id=?)`
131. `chat_history(peer=$peer, offset_id=0, offset_date=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0)`
132. `search_chat_messages(peer=$peer, q, filter={'_': 'inputMessagesFilterEmpty'}, min_date=0, max_date=0, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0, *, from_id=?, saved_peer_id=?, saved_reaction=?, top_msg_id=?)`
133. `mark_chat_read(peer=$peer, max_id)`
134. `clear_chat_history(peer=$peer, max_id, *, just_clear=?, revoke=?, min_date=?, max_date=?)`
135. `peer_settings(peer=$peer)`
136. `basic_groups(id)`
137. `basic_group_details(chat_id)`
138. `search_all_messages(q, filter={'_': 'inputMessagesFilterEmpty'}, min_date=0, max_date=0, offset_rate=0, offset_peer={'_': 'inputPeerEmpty'}, offset_id=0, limit=50, *, broadcasts_only=?, groups_only=?, users_only=?, folder_id=?, community=?)` **BLOCKED**
139. `message_editability(peer=$peer, id=$message)`
140. `peer_dialogs(peers)`
141. `all_drafts()`
142. `mutual_groups(user_id, max_id=0, limit=50)`
143. `set_dialog_pinned(peer, *, pinned=?)`
144. `reorder_dialog_pins(folder_id, order, *, force=?)`
145. `pinned_dialogs(folder_id)`
146. `unread_mentions(peer=$peer, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0, *, top_msg_id=?)`
147. `mark_mentions_read(peer=$peer, *, top_msg_id=?)`
148. `recent_live_locations(peer=$peer, limit=50, hash=0)`
149. `set_dialog_unread(peer, *, unread=?, parent_peer=?)`
150. `unread_dialog_marks(*, parent_peer=?)`
151. `clear_all_drafts()`
152. `chat_online_count(peer=$peer)`
153. `message_type_counts(peer=$peer, filters, *, saved_peer_id=?, top_msg_id=?)`
154. `dismiss_peer_settings_bar(peer=$peer)`
155. `mark_discussion_read(peer=$peer, msg_id=$message, read_max_id)`
156. `unpin_all_chat_messages(peer=$peer, *, top_msg_id=?, saved_peer_id=?)`
157. `message_readers(peer=$peer, msg_id=$message)`
158. `message_search_calendar(peer=$peer, filter={'_': 'inputMessagesFilterEmpty'}, offset_id=0, offset_date=0, *, saved_peer_id=?)`
159. `message_search_positions(peer=$peer, filter={'_': 'inputMessagesFilterEmpty'}, offset_id=0, limit=50, *, saved_peer_id=?)`
160. `set_default_send_as(peer=$peer, send_as)`
161. `sent_media_search(q, filter={'_': 'inputMessagesFilterEmpty'}, limit=50)`
162. `outgoing_read_date(peer=$peer, msg_id=$message)`
163. `channel_message_author(channel=$peer, id)`
164. `move_dialogs_to_archive(folder_peers)`
165. `chat_folders()`
166. `suggested_chat_folders()`
167. `save_chat_folder(id, *, filter=?)`
168. `reorder_chat_folders(order)`
169. `set_folder_tags_visible(enabled)`
170. `share_chat_folder(chatlist, title, peers)`
171. `remove_folder_invite(chatlist, slug)`
172. `edit_folder_invite(chatlist, slug, *, title=?, peers=?)`
173. `folder_invites(chatlist)`
174. `inspect_folder_invite(slug)`
175. `join_folder_invite(slug, peers)`
176. `folder_updates(chatlist)`
177. `accept_folder_updates(chatlist, peers)`
178. `dismiss_folder_updates(chatlist)`
179. `folder_leave_suggestions(chatlist)`
180. `leave_shared_folder(chatlist, peers)`

#### Profile, users, photos, notifications — 181–220

181. `edit_profile(*, first_name=?, last_name=?, about=?)`
182. `set_online_status(offline)`
183. `check_profile_username(username)`
184. `set_profile_username(username)` **BLOCKED**
185. `privacy_rules(key)`
186. `account_inactivity_ttl()`
187. `set_emoji_status(emoji_status)`
188. `suggested_emoji_statuses(hash=0)`
189. `recent_emoji_statuses(hash=0)`
190. `clear_recent_emoji_statuses()`
191. `reorder_profile_usernames(order)`
192. `set_profile_username_active(username, active)`
193. `profile_photo_emojis(hash=0)`
194. `set_profile_color(*, for_profile=?, color=?)`
195. `set_birthday(*, birthday=?)`
196. `set_personal_channel(channel)`
197. `set_profile_tab(tab)`
198. `set_music_saved(id, *, unsave=?, after_id=?)`
199. `saved_music_ids(hash=0)`
200. `user_details(id)`
201. `contact_requirements(id)`
202. `user_music(id, offset=0, limit=50, hash=0)`
203. `user_music_by_documents(id, documents)`
204. `suggest_contact_birthday(id, birthday)`
205. `select_profile_photo(id, *, fallback=?, bot=?)`
206. `upload_profile_photo(*, fallback=?, bot=?, file=?, video=?, video_start_ts=?, video_emoji_markup=?)`
207. `remove_profile_photos(id)`
208. `profile_photos(user_id, offset=0, max_id=0, limit=50)`
209. `set_contact_photo(user_id, *, suggest=?, save=?, file=?, video=?, video_start_ts=?, video_emoji_markup=?)`
210. `notification_settings(peer)`
211. `set_notification_settings(peer, settings)`
212. `reset_notification_settings()`
213. `contact_signup_notifications()`
214. `set_contact_signup_notifications(silent)`
215. `notification_exceptions(*, compare_sound=?, compare_stories=?, peer=?)`
216. `reaction_notification_settings()`
217. `set_reaction_notification_settings(settings)`
218. `saved_notification_sounds(hash=0)`
219. `set_notification_sound_saved(id, unsave)`
220. `upload_notification_sound(file, file_name, mime_type)`

#### Basic groups, channels, moderation — 221–276

221. `rename_basic_group(chat_id, title)`
222. `set_basic_group_photo(chat_id, photo)`
223. `add_basic_group_member(chat_id, user_id, fwd_limit=0)`
224. `remove_basic_group_member(chat_id, user_id, *, revoke_history=?)`
225. `create_basic_group(users, title, *, ttl_period=?)`
226. `set_basic_group_admin(chat_id, user_id, is_admin)`
227. `upgrade_basic_group(chat_id)`
228. `edit_chat_description(peer=$peer, about)`
229. `set_default_member_restrictions(peer=$peer, banned_rights)`
230. `remove_basic_group(chat_id)`
231. `set_chat_auto_delete(peer=$peer, period)`
232. `set_content_protection(peer=$peer, enabled, *, request_msg_id=?)`
233. `mark_channel_read(channel=$peer, max_id)`
234. `channel_members(channel=$peer, filter={'_': 'channelParticipantsRecent'}, offset=0, limit=50, hash)`
235. `channel_member(channel=$peer, participant)`
236. `channel_details(channel=$peer)`
237. `create_channel(title, about, *, broadcast=?, megagroup=?, for_import=?, forum=?, geo_point=?, address=?, ttl_period=?)`
238. `set_channel_admin(channel=$peer, user_id, admin_rights, *, rank=?)`
239. `rename_channel(channel=$peer, title)`
240. `set_channel_photo(channel=$peer, photo)`
241. `check_channel_username(channel=$peer, username)`
242. `set_channel_username(channel=$peer, username)`
243. `join_channel(channel=$peer)`
244. `leave_channel(channel=$peer)`
245. `invite_channel_members(channel=$peer, users)`
246. `remove_channel(channel=$peer)`
247. `set_channel_signatures(channel=$peer, *, signatures_enabled=?, profiles_enabled=?)`
248. `owned_public_channels(*, by_location=?, check_limit=?, for_personal=?, for_community_peer=?)`
249. `restrict_channel_member(channel=$peer, participant, banned_rights)`
250. `channel_admin_log(channel=$peer, q='', max_id, min_id, limit=50, *, events_filter=?, admins=?)`
251. `set_group_sticker_set(channel=$peer, stickerset)`
252. `mark_channel_media_read(channel=$peer, id)`
253. `clear_channel_history(channel=$peer, max_id, *, for_everyone=?)`
254. `set_prehistory_hidden(channel=$peer, enabled)`
255. `left_channels(offset=0)`
256. `eligible_discussion_groups()`
257. `set_discussion_group(broadcast, group)`
258. `set_group_location(channel=$peer, geo_point, address)`
259. `set_slow_mode(channel=$peer, seconds)`
260. `inactive_channels()`
261. `send_as_identities(peer=$peer, *, for_paid_reactions=?, for_live_stories=?)`
262. `remove_member_history(channel=$peer, participant)`
263. `set_join_to_send(channel=$peer, enabled)`
264. `set_join_requests(channel=$peer, enabled, *, apply_to_invites=?, guard_bot=?)`
265. `reorder_channel_usernames(channel=$peer, order)`
266. `set_channel_username_active(channel=$peer, username, active)`
267. `deactivate_channel_usernames(channel=$peer)`
268. `set_antispam(channel=$peer, enabled)`
269. `set_members_hidden(channel=$peer, enabled)`
270. `set_channel_color(channel=$peer, *, for_profile=?, color=?, background_emoji_id=?)`
271. `related_channels(*, channel=?)`
272. `set_channel_emoji_status(channel=$peer, emoji_status)`
273. `set_group_emoji_set(channel=$peer, stickerset)`
274. `set_channel_auto_translation(channel=$peer, enabled)`
275. `set_channel_profile_tab(channel=$peer, tab)`
276. `edit_member_rank(peer=$peer, participant, rank)`

#### Invites, join requests, statistics — 277–292

277. `create_chat_invite(peer=$peer, *, legacy_revoke_permanent=?, request_needed=?, expire_date=?, usage_limit=?, title=?)`
278. `chat_invites(peer=$peer, admin_id, limit=50, *, revoked=?, offset_date=?, offset_link=?)`
279. `chat_invite_details(peer=$peer, link)`
280. `edit_chat_invite(peer=$peer, link, *, revoked=?, expire_date=?, usage_limit=?, request_needed=?, title=?)`
281. `purge_revoked_chat_invites(peer=$peer, admin_id)`
282. `remove_chat_invite(peer=$peer, link)`
283. `invite_admins(peer=$peer)`
284. `invite_joiners(peer=$peer, offset_date=0, offset_user={'_': 'inputUserEmpty'}, limit=50, *, requested=?, subscription_expired=?, link=?, q=?)`
285. `resolve_join_request(peer=$peer, user_id, *, approved=?)`
286. `resolve_all_join_requests(peer=$peer, *, approved=?, link=?)`
287. `channel_statistics(channel=$peer, *, dark=?)`
288. `supergroup_statistics(channel=$peer, *, dark=?)`
289. `message_statistics(channel=$peer, msg_id, *, dark=?)`
290. `message_public_forwards(channel=$peer, msg_id, offset='', limit=50)`
291. `story_statistics(peer=$peer, id=$message, *, dark=?)`
292. `story_public_forwards(peer=$peer, id=$message, offset='', limit=50)`

### 4. Дополнительные message helpers и overrides

Это отдельный API поверх каталога. Учитывай методы, переопределённые SandboxContext:

| Внешний вызов | Контракт |
| --- | --- |
| `await ctx.respond(content=None, **kwargs)` | Bound answer; output auto/edit/reply; при явном target — message operation |
| `await ctx.send(text, **kwargs)` | В worker задаёт output=reply, не универсальный send-to-peer |
| `await ctx.edit(text, **kwargs)` | Bound output=edit либо явная операция edit |
| `await ctx.reply(message=None)` | Получить reply через fetch; **не отправить текст** |
| `await ctx.reply_text(message=None)` | Текст reply; может быть None |
| `await ctx.msg(chat_id, message_id)` | Fetch TL-словарь сообщения либо None |
| `await ctx.resolve(value)` | Entity lookup, не гарантия полного User |
| `await ctx.send_text(text, **kwargs)` | Обычная отправка через message operation |
| `await ctx.reply_html(text, **kwargs)` / `edit_html(...)` | Bound response с output=reply/edit |
| `await ctx.delete(revoke=True)` | Удалить конкретное сообщение; проверь target/peer |
| `await ctx.pin(both_sides=None, *, notify=False, pm_oneside=False)` / `unpin()` | Не `silent=` из других библиотек |
| `await ctx.react(emoji, **kwargs)` / `unreact()` | Строка, custom emoji ID или список реакций |
| `await ctx.forward(to_chat, **kwargs)` / `forward_to(...)` / `copy_to(...)` | Copy выставляет drop_author; не произвольный upload |
| `await ctx.get_sender()` / `get_chat()` / `get_input_chat()` / `get_input_sender()` / `get_input_channel()` | Resolve и TL peer conversion |
| `await ctx.read()` / `mark_read()` / `read_contents()` | С учётом channel/topic |
| `await ctx.get_reply_message()` / `refresh()` | Получение актуального сообщения |
| `await ctx.get_buttons()` / `click(i=None, j=None, *, text=None, filter=None, data=None, share_phone=None, share_geo=None, password=None, open_url=False)` | Кнопки/голосование; phone/geo sharing явно разрешить; пароль — SRP, не строка |
| `await ctx.vote(options)` / `retract_vote()` / `get_poll_results()` | Vote принимает options/индексы по контракту |
| `await ctx.get_poll_votes(*, option=None, offset=None, limit=100)` | Получение голосовавших |
| `await ctx.get_reactions()` / `get_reactors(*, reaction=None, offset=None, limit=100)` | Reactions list |
| `await ctx.get_views(increment=False)` / `get_replies(*, offset_id=0, limit=100, **kwargs)` / `get_discussion()` | Не смешивать views с изменением read state |
| `await ctx.get_link(*, grouped=False, thread=False)` | Telegram-ссылка конкретного сообщения |
| `await ctx.edit_buttons(buttons=None)` / `remove_buttons()` / `edit_caption(caption, **kwargs)` | Модификация сообщения |
| `await ctx.send_file(media, caption=None, **kwargs)` / `send_media(...)` / `respond_file(...)` / `respond_media(...)` | output/send semantics и assets для локальной загрузки |
| `await ctx.reply_file(file, caption=None, **kwargs)` / `reply_media(...)` | Reply к конкретному сообщению |
| `await ctx.send_photo(photo, caption=None, **kwargs)` / `reply_photo(...)` | По URL может идти external media; локальный upload через assets |
| `send_video/reply_video`, `send_audio/reply_audio`, `send_voice/reply_voice`, `send_animation/reply_animation` | Все async; media, caption=None, **kwargs |
| `await ctx.send_sticker(sticker, **kwargs)` / `reply_sticker(...)` | Caption отдельно не предусмотрен |
| `await ctx.send_contact(phone, first_name, *, last_name='', **kwargs)` / `reply_contact(...)` | Контактные данные только по назначению функции |
| `await ctx.send_location(latitude, longitude, **kwargs)` / `reply_location(...)` | Не путать порядок координат |
| `await ctx.send_dice(emoji='🎲', **kwargs)` / `reply_dice(...)` | Native dice |
| `await ctx.edit_media(media, *, caption=None, kind='document', **kwargs)` | Изменение медиа; проверить kind/upload |
| `await ctx.send_rich(html, **kwargs)` / `edit_rich(rich, **kwargs)` / `reply_rich(...)` | Rich transport и fallback отдельно |
| `await ctx.save(**kwargs)` | Переслать текущее сообщение в me, не произвольный notify API |
| `await ctx.typing(action='sendMessageTypingAction')` | TL action constructor, не sugar `'typing'` |
| `await ctx.schedule(text, when, **kwargs)` | Schedule date timestamp |
| `await ctx.send_todo(title, items, *, others_can_append=False, others_can_complete=False, **kwargs)` | items — непустой список, ID уникальные positive int |
| `await ctx.edit_todo(...)` / `append_todo(items)` | Проверяется реальное todo-сообщение |
| `await ctx.send_poll(question, answers, *, multiple_choice=False, public_voters=False, correct_answers=None, solution=None, poll_options=None, **kwargs)` | `answers`, **не `options`**; минимум 2; correct_answers — уникальные индексы |
| `await ctx.close_poll()` | Получить актуальный poll и выставить closed |
| `await ctx.translate(text, to_lang=None, *, source='auto', provider='auto', **kwargs)` | telegram/google/mymemory; внешние providers требуют net; input ≤4000 UTF-8 bytes |

Шаблон вызова с корректными keywords:

```python
async def command_example(ctx, invocation):
    history = await ctx.chat_history(limit=10)
    await ctx.respond(str(len(history.get("messages", []))), rich=False)
```

Пример предполагает `messages` dict-result для конкретного RPC; при других
операциях проверяй их реальную форму. Не выполняй destructive methods как smoke-test.

### 5. Fetch, системные данные, файлы

Без raw `mt`: bound responses, fetch (`reply/msg/resolve`), `ctx.html` formatting,
`ctx.tools` (с оговорками приложения B), `ctx.version`, `ctx.uptime`, `ctx.config` snapshot,
`ctx.i18n.language`, `ctx.t`, доступные `ctx.ui/screens`/forms. Не выдумывай прямые
`ctx.sender_id`, `ctx.out`, `ctx.raw_args`, `ctx.logs` по аналогии с другой платформой.

`ctx.memory/ram/get_memory/get_ram` и `prefix/get_prefix` в worker имеют особенности:
после замены base class на shared ContextOperations некоторые fallback значения
могут оказаться 0/'.', а не переданный в payload runtime snapshot. Проверяй
исполнение, не делай метрики/адресацию зависимыми от предполагаемого значения.

`ctx.mt` — метод, возвращающий callable MTContext, а не безусловно готовый callable
RPC-объект; для raw API предпочитай явно подтверждённый `ctx.tg.call` и `mt` capability.

#### Assets (capability `assets`)

В `8cab560` исправлен путь: host `assets` использует тот же `sandbox.workspace`,
что worker. В старых версиях это не гарантировалось.

- `await ctx.upload_file(source, file_name=...)` или `ctx.assets.upload(file, filename=...)`:
  source в проверенном provider — **путь к существующему файлу workspace**, не BytesIO
  и не произвольные bytes; возвращается uploaded file record.
- `await ctx.download_file(source, destination=None)` / `ctx.assets.download(...)`:
  source — message dict с `chat_id` и `id`/`message_id`. Результат — относительный
  путь workspace. Не bytes. Не передавай один media dict без message identity.
- `ctx.file_media(up, *, mime='application/octet-stream', file_name=None, force_file=True)`
  — синхронная сборка InputMediaUploadedDocument; это не отправка и не upload.
- `await ctx.read_attachment_text(*, reply=False, max_bytes=1048576)` использует
  bound fetch; лимит допустим 1..4194304, декодирует UTF-8-sig, не требует assets.

### 6. Что нельзя считать доказанным тестом

Каталог проверен статически и contract-mocks; реальные Telegram RPC, namespace jail,
права аккаунта и все 292 операции не запускались. Добавление списка в скилл не
является обещанием, что каждый серверный метод доступен конкретной установке.

<a id="tools-reference"></a>
## Приложение B. Tools, regdate и search

## Hotaru tools, regdate, search и formatting helpers

Проверено 2026-11-09 по `relay/toolkit.py`, `relay/sandbox.py`, `relay/context.py`
на `8cab560e2b9dbc009aab4670c8a78a9a790e2d1a`.

### 1. Доступ и границы

В worker `_build_tools` исполняет штатный toolkit и передаёт **76 экспортов
`TOOLKIT_FUNCS`** в `ctx.tools`. Пользуйся `ctx.tools.<name>`, без импорта
`relay.toolkit`. В host есть alias `ctx.toolkit`, но у проверенного SandboxContext
его нет: не добавляй его в готовый внешний модуль по аналогии.

Все функции ниже **синхронные**, кроме `search` и `check_restrictions`. `regdate`,
formatting, парсеры и локальные преобразования не требуют capabilities и не
делают сетевых запросов. Но экспорт имени не гарантирует работоспособность
функции в sandbox: `prune_logs` и restriction-check имеют ограничения ниже.

Типы в сигнатурах документируют код, а не runtime validation каждого аргумента.
Не передавай недоверенные данные без проверки. Примеры — фрагменты тела handler,
не самостоятельные `.hmod`: у готового файла сначала должен быть HOTARU.

### 2. regdate — оценка регистрации Telegram

```text
ctx.tools.regdate(user_id, *, registration_month=None, not_after=None)
```

**Sync, локально, без `mt/net/state`.** Алгоритм использует встроенные ID/date
anchors и интерполяцию, не Telegram RPC и не внешний API.

Вход:

- `user_id`: положительный integer `< 2**63` либо строка ASCII decimal digits;
  bool, отрицательный marked chat ID, username и Telegram entity не подходят.
- `registration_month`: optional строка строго `MM.YYYY`, не раньше запуска
  Telegram 2013-08-14 и не из будущего. Это **заданное вызывающим ограничение**,
  не автоматически полученная официальная дата. Не заполняй его догадкой.
- `not_after`: optional строка строго `YYYY-MM-DD`, не из будущего: верхняя граница
  по независимо известному событию/дате. Не интерпретируется как дата регистрации.
- ID вне `_REGDATE_POINTS` без registration_month даёт ValueError. Не экстраполируй
  за калибровку незаметно и не подавляй ошибку фиктивной датой.

Результат — dict:

| Ключ | Значение |
| --- | --- |
| `date` | Центральная оценка, ISO `YYYY-MM-DD` |
| `earliest`, `latest` | Границы оценочного диапазона, ISO даты |
| `error_days` | Максимальное отклонение от оценки до границ, integer |
| `age_days` | Возраст относительно текущей даты UTC по центральной оценке |
| `estimated` | Всегда True, включая anchor |
| `source` | `anchor`, `model`, `registration_month`; может иметь `+upper_bound` или `conflict` |
| `conflict` | Несовместимость известных ограничений с оценкой/диапазоном |
| `registration_month`, `not_after` | Переданные ограничения либо пустые строки |

Показывай пользователю «примерно», диапазон и при необходимости конфликт.
Даже при `source='anchor'` это не подтверждённая точная дата. Не используй её
как надёжный критерий блокировки/доверия. Если конфликт=True, не выдавай результат
как точное пересечение ограничений: функция сохраняет диагностический конфликт.

Пример без лишних capabilities:

```python
async def command_regdate(ctx, invocation):
    try:
        info = ctx.tools.regdate(invocation.raw_args.strip())
    except (TypeError, ValueError):
        await ctx.respond("Нужен числовой ID в поддерживаемом диапазоне.", rich=False)
        return
    text = (
        f"Примерная регистрация: {info['date']}\n"
        f"Диапазон: {info['earliest']} — {info['latest']}\n"
        f"Погрешность: до {info['error_days']} дней"
    )
    if info["conflict"]:
        text += "\nОграничения противоречат оценке."
    await ctx.respond(text, rich=False)
```

Локализуй строки в настоящем модуле. Для username отдельно resolve → положительный
user ID → regdate; не передавай `ctx.message.id` (это ID сообщения).

### 3. Асинхронный локальный поиск search

```text
await ctx.tools.search(values, query, *, key=None, limit=10, min_score=0.76, layout=True)
```

Без capabilities, не ищет в Telegram/интернете. Нормализует Unicode NFKC,
регистр, ё/е, слова; учитывает совпадения, префиксы и ограниченные опечатки.
При `layout=True` пробует RU/EN раскладку с небольшим штрафом к score.
Периодически делает `await asyncio.sleep(0)`, не создаёт внешние jobs.

- `values`: коллекция значений, не строка/bytes.
- `query`: str; пустой нормализованный запрос возвращает [].
- `key=None`: каждый value должен быть строкой либо последовательностью строк.
- `key='name'`: извлекает `value['name']`, не object attribute.
- Callable key: локальная функция, возвращающая строку или list/tuple строк;
  не coroutine. Неверные типы поисковых полей дают TypeError.
- `limit`: nonnegative int, bool недопустим; 0 возвращает [].
- `min_score`: от 0 до 1.
- Результат отсортирован по score; при равенстве сохраняется приоритет исходного
  порядка. Запись: `{'value': original, 'score': float, 'matched': str, 'layout': bool}`.
  Это не список исходных объектов: извлекай hit['value'] явно.

```python
async def command_find(ctx, invocation):
    items = [{"name": "Backup", "id": "backups"}, {"name": "Settings", "id": "settings"}]
    hits = await ctx.tools.search(items, invocation.raw_args, key="name", limit=5)
    text = "\n".join(ctx.tools.escape(hit["value"]["name"]) for hit in hits)
    await ctx.respond(text or "Нет совпадений.", rich=False)
```

### 4. Полный каталог tools: 76 экспортов

В следующих строках вызов без префикса означает `ctx.tools.<name>(...)`.
Возвращаемые типы взяты из определения функции. `Any` не означает сериализацию
любого объекта через IPC: tools исполняются локально внутри worker.

#### Аргументы — 6

| Сигнатура | Что делает / ограничения |
| --- | --- |
| `args_parse(text: str) -> list[str]` | **Полный текст команды**; отбрасывает первый токен, применяет shlex к остатку; при неверных кавычках возвращает остаток одним элементом |
| `args_raw(text: str) -> str` | Отбрасывает первый токен полного текста команды |
| `args_split(text: str, separator: str \| list[str]) -> list[str]` | Разбивает raw args, trim и удаление пустых частей |
| `args_int(text: str) -> list[int]` | Числа из args_parse; нечисловые токены пропускаются |
| `args_bool(text: str) -> list[bool]` | Известные yes/no/on/off/true/false/1/0/да/нет/вкл/выкл; остальные пропускаются |
| `args_float(text: str) -> list[float]` | Floats из args_parse; неверные токены пропускаются |

**Ловушка:** `args_parse(invocation.raw_args)` потеряет первый аргумент. Для raw_args
используй `shlex.split(invocation.raw_args)` с явной обработкой ошибок либо передай
synthetic full command text, если именно toolkit parser нужен по контракту.

#### HTML, entities и ссылки — 12

| Сигнатура | Семантика |
| --- | --- |
| `escape(value: Any) -> str` | HTML text escaping без quotes |
| `escape_attr(value: Any) -> str` | HTML attribute escaping с quotes |
| `escape_smart(text: str) -> str` | Сохраняет allowlisted tags, escape остальное; **не sanitizer атрибутов/URL** |
| `strip_tags(text: str, keep_tg: bool=True) -> str` | В текущей реализации итоговый regex удаляет все tags даже при keep_tg=True; не обещай сохранение Telegram tags |
| `strip_emoji(text: str) -> str` | Regex-удаление диапазонов emoji; не универсальный grapheme parser |
| `flag(code: str) -> str` | Две ASCII letters → regional indicator flag; иначе исходник |
| `entity_url(entity: object, openmessage: bool=False) -> str` | Локальная сборка tg:// для user/username; не делает resolve |
| `entity_link(entity: object, label: str \| None=None) -> str` | Escaped HTML link по entity_url; без URL возвращает escaped label |
| `valid_url(url: str) -> bool` | Только bool(urlparse(url).netloc); это **не** проверка безопасности/SSRF |
| `is_url(text: str) -> bool` | Ограниченный HTTP(S) regex, не полный стандарт URL |
| `urls_extract(text: str) -> list[str]` | Regex извлекает HTTP(S) ссылки |
| `html_fix(text: str) -> str` | Alias escape_smart; не структурный HTML validator |

Ни valid_url, ни is_url, ни escape_smart не дают права обходить сетевую политику.
Для полностью недоверенного текста используй escape, а не escape_smart.

#### Коллекции и служебные данные — 9

| Сигнатура | Семантика |
| --- | --- |
| `chunk(items: list[Any] \| tuple[Any, ...] \| str, size: int) -> list[Any]` | Slices размера size>0; не HTML-aware |
| `random_str(size: int, charset: str \| None=None) -> str` | random.choice; **не криптографический токен**; size<1 → '' |
| `merge_dicts(a: dict[str, Any], b: dict[str, Any], *, deep: bool=True) -> dict[str, Any]` | Мутирует **b**, приоритет у a; list merge убирает дубли через dict.fromkeys |
| `json_ok(value: Any) -> bool` | Проверяет json.dumps; не проверяет IPC limits или business schema |
| `flatten(nested: list[Any]) -> list[Any]` | Разворачивает только один уровень вложенных list, не рекурсивно |
| `censor(obj: Any, fields: list[str] \| None=None, replacement: str='***') -> Any` | Рекурсивно dict/list, маскирует строковые значения известных ключей; numeric и неизвестные секреты могут остаться |
| `attr(obj: Any, name: str, default: Any=None) -> Any` | getattr с подавлением Exception; **не dict.get** |
| `face() -> str` | Случайный escaped kaomoji |
| `hash_short(text: str, length: int=8) -> str` | Срез hex SHA-256; не парольный hash и не уникальный ID-гарант |

#### Message/entity introspection — 7

| Сигнатура | Семантика |
| --- | --- |
| `chat_id(message: Any) -> int \| None` | Извлекает chat_id; для marked channel ID удаляет -100 prefix, то есть может вернуть **raw positive channel ID** |
| `entity_id(entity: Any) -> int \| None` | channel_id/chat_id/user_id/id для dict, иначе .id; не делает Telegram resolve |
| `topic_id(message: Any) -> int \| None` | topic_id/message_thread_id/top_msg_id; не разбирает все варианты reply header |
| `mime(message: Any) -> str` | Шаллоу media/document lookup; при иной структуре может вернуть '' |
| `msg_link(message: Any, chat: Any=None) -> str` | Локальная сборка ссылки; raw/marked ID и username могут потребовать дополнительной обработки |
| `has_media(message: Any) -> bool` | Проверяет доступные поля; не fetch скрытого/непереданного attachment |
| `target_id(message: Any, arg_index: int=0) -> int \| None` | Text mention/числовой аргумент; не полноценный username resolver |

`tools.chat_id` нельзя бездумно передавать как адресата RPC: не путай raw channel
ID и marked chat ID. Для достоверной ссылки используй `await ctx.get_link()` на
полном конкретном сообщении, для пользователя — `ctx.resolve` и проверку типа entity.

#### Время и числа — 12

| Сигнатура | Семантика |
| --- | --- |
| `file_size(size_bytes: int \| float) -> str` | Формат по 1024, B..PB |
| `iso_time() -> str` | Текущее datetime UTC isoformat |
| `uptime() -> int` | Секунды с импорта toolkit в данном процессе, **не обязательно runtime uptime** |
| `uptime_fmt(language: str='en') -> str` | duration(toolkit uptime, language) |
| `duration(seconds: int \| float, language: str='en') -> str` | Локализованная длительность; normalize locale; отрицательное → 0; не планировщик |
| `timestamp(value: int \| float, language: str='en') -> str` | Unix timestamp → локализованная дата/время **UTC** |
| `time_range(start: int \| float, end: int \| float \| None=None, language: str='en') -> str` | Форматированный UTC диапазон |
| `plural(count: int \| float, one: str, few: str='', many: str='') -> str` | Выбирает форму; возвращает форму, **не число + форму** |
| `percent(value: int \| float, total: int \| float, decimals: int=1) -> str` | Процент; total=0 → '0%'; не clamp до 100 |
| `clamp(value: int \| float, minimum: int \| float, maximum: int \| float) -> int \| float` | Ограничить диапазон |
| `mask(value: str, visible: int=4, char: str='•') -> str` | Маскирование строки; проверяй visible>0: крайние значения ведут себя по Python slices |
| `countdown(seconds: int \| float) -> str` | duration или 'now'; это отображение, **не timer/task** |

Для uptime самого userbot предпочитай подтверждённый `ctx.uptime`, а не время
жизни worker/toolkit. Поддержка локалей formatter не равна наличию перевода ядра.

#### Шаблоны и представление — 17

| Сигнатура | Семантика |
| --- | --- |
| `render(template: str, **data: Any) -> str` | Простой replace `{key}`; **нет escaping, type validation и scopes** |
| `template_fields(raw: object) -> dict[str, dict[str, Any]]` | Валидация 1..64 полей, type/example/description/format |
| `template_names(template: str, fields: dict[str, Any] \| None=None, *, legacy_braces: bool=False) -> list[str]` | Имена placeholders; с fields проверяет declared names |
| `template_render(template: object, fields: object, values: object=None, *, legacy_braces: bool=False) -> str` | Безопасный declared-template pipeline; values=None использует example values |
| `truncate(text: str, limit: int, suffix: str='…') -> str` | Текстовое обрезание с попыткой сохранить слово; не HTML-safe split |
| `table(rows: list[list[Any] \| tuple[Any, ...] \| dict[str, Any]], headers: list[str] \| None=None) -> str` | **Rich HTML `<table>`**, escaped cells; не ASCII table |
| `progress(current: int \| float, total: int \| float, width: int=10, filled: str='█', empty: str='░') -> str` | Текстовый progress bar с clamp ratio |
| `code_block(text: str, language: str='') -> str` | Escaped `<pre><code>` |
| `spoiler(text: str) -> str` | Оборачивает в tg-spoiler, **не escape содержимое** |
| `blockquote(text: str, expandable: bool=False) -> str` | Оборачивает HTML; содержимое **не escape** |
| `mention(user_id: int \| str, name: str \| None=None) -> str` | tg://user; label escape; user_id сначала validate |
| `link(label: str, url: str) -> str` | Escaped HTML label/href; URL safety отдельно |
| `list_items(items: list[str], ordered: bool=False) -> str` | Rich ul/ol; items **не escape** |
| `kv(pairs: dict[str, Any] \| list[tuple[str, Any]], bold_keys: bool=True) -> str` | Escaped key/value, `<br>` separators |
| `tree(items: list[str], indent: str='  ') -> str` | Escaped плоское дерево в code; indent в текущем теле не используется |
| `badge(text: str, style: str='info') -> str` | Текстовый icon+escaped label, не Telegram button |
| `wordmark() -> str` | Статическая последовательность tg-emoji wordmark |

`template_validate` существует внутри файла, но **не экспортирован** в
TOOLKIT_FUNCS: не вызывай `ctx.tools.template_validate`. Для межмодульных полей
нужен `ctx.render_template_async`, не локальная подстановка с обходом scopes.

#### Rich/text/buttons — 7

| Сигнатура | Семантика |
| --- | --- |
| `rich_to_html(message: object) -> str` | TL rich_message blocks из dict → HTML; не произвольный HTML renderer |
| `message_text(message: object) -> str` | Plain текст из rich/message/raw_text/text/caption; str возвращается как есть; None/неполное сообщение → '' |
| `entities_to_html(text: str \| None, entities: list[object] \| tuple[object, ...] \| None=None) -> str` | Telegram UTF-16 entity offsets → HTML; не удаляй offsets до преобразования |
| `btn_html(button: dict[str, Any]) -> str` | Rich tg-button из url/copy_text/callback_data; **не регистрирует handler и не подписывает callback** |
| `buttons_html(buttons: list[Any], kind: str='page') -> str` | Row/group rich HTML, kind='text' → плоский список tags |
| `needs_form(buttons: object) -> bool` | Input detection по старому dict-полю input, не универсальная проверка всех UI routes |
| `needs_callback(buttons: object) -> bool` | Проверяет некоторые callback/input поля; **не учитывает все worker action_id/Screen kinds** |

`message_text` работает только с переданными данными. Для неполного ctx.message
сначала fetch при необходимости. Он может вернуть plain текст с `<`/`&`, поэтому
escape перед повторной HTML-отправкой обязателен.

#### Пагинация, диагностика, special tools — 6

| Сигнатура | Семантика |
| --- | --- |
| `paginate_chunks(text: str, limit: int=4000) -> list[str]` | Деление текста по строкам/символам; **не HTML-aware**; '' → ['']; limit должен быть положительным |
| `classify_error(exc: Any) -> dict[str, Any]` | Локальная эвристика по тексту/seconds, поля type/is_restriction/flood_wait/detail/recoverable |
| `await check_restrictions(ctx: Any) -> dict[str, Any]` | Проверяет users.getUsers только если ctx имеет настоящий app/runtime.app; в sandbox обычно его нет |
| `prune_logs(root: str \| Path='.', max_file_bytes: int=8*1024*1024, keep_tail_bytes: int=1*1024*1024) -> int` | Внутри импортирует hotaru.observatory; **не worker-safe**, не вызывай из внешнего модуля |
| `regdate(user_id: object, *, registration_month: object=None, not_after: object=None) -> dict[str, str \| int \| bool]` | Локальная оценка регистрации, см. раздел 2 |
| `await search(values: Any, query: object, *, key: Any=None, limit: object=10, min_score: float=0.76, layout: bool=True) -> list[dict[str, Any]]` | Локальный fuzzy search, см. раздел 3 |

`check_restrictions` без host app вернёт default `can_send=True`, но это **не
проверка** состояния Telegram. `ctx.classify_error`/`ctx.check_restrictions` из
shared ContextOperations тоже могут импортировать relay.toolkit, что запрещено
worker audit hook. Для локальной классификации используй `ctx.tools.classify_error`.
Не обещай успешный account health check по default результату и не импортируй
ядро, чтобы обойти ограничение.

### 5. Отдельный ctx.html (не tools)

Проверенный `_HtmlHelper` worker предоставляет sync:

- `ctx.html.escape(value)`;
- `bold(value)`, `italic(value)`, `code(value)`, `underline(value)`, `quote(value)`;
- `link(label, url)`;
- `pre(value, language=None)`.

Они escape содержимое. Это отличается от `tools.blockquote/spoiler/list_items`,
которые принимают уже подготовленную разметку. Форматирование не отправляет
сообщение и не требует capabilities.

### 6. Критерий достоверности

Список экспортов и сигнатуры проверяются встроенным скриптом
из [приложения D](#api-inspector) с аргументами `<Hotaru> --section tools`. Источник `TOOLKIT_FUNCS` важнее случайных top-level def и
неполного автодополнения. Не устанавливай внешние библиотеки для уже имеющихся
tools. При обновлении исходника сравни состав, сигнатуры и поведение, а не только
число функций. Live Telegram и Linux sandbox не подтверждены одним AST-тестом.

<a id="method-cards"></a>
## Приложение C. Полные карточки методов

## Hotaru: полные карточки контекстных методов

292 карточки, сформированные из AST исходников Hotaru; без импорта ядра и Telegram RPC.
Базовый снимок скилла: `8cab560e2b9dbc009aab4670c8a78a9a790e2d1a`, 2026-11-09.
При регенерации по другой версии актуальность определяют SHA-256 ниже, а не эта отметка.

### Как читать карточки

- Это справочные сигнатуры в стиле Python, не исполняемые вызовы: `*` означает
  рекомендуемые keyword-аргументы; реальные positional slots указаны отдельно.
- Все операции асинхронные: в handler используй `await ctx.<name>(...)`.
- `CURRENT_PEER`, `CURRENT_MESSAGE`, `RANDOM_ID` обозначают defaults ядра,
  а не имена, которые нужно объявлять в модуле. Обычно соответствующий keyword пропускают.
- TL `flags.N?T` — optional поле; `Vector<T>` — последовательность; типы сохраняют
  запись исходной TL-схемы и не являются готовыми Python-аннотациями.
- «Обязательный» означает: вызывающий обязан передать значение, поскольку ядро
  не подставляет default. Наличие обязательного TL-поля не исключает default ядра.
- Optional `None` в справочной сигнатуре означает пропуск поля, не обязательную
  отправку None в Telegram. Keyword со статусом «запрещён» передавать нельзя.
- **Результат: `Any`, зависит от RPC.** CTX_CATALOG не хранит тип результата,
  а host распаковывает/фильтрует response. Непроверенные returns сайта не копируются.
  Для конкретного результата сверяй TL result schema используемого GoyGram и host adapter.
- «Без raw mt» не отменяет ACL Telegram, denylist, Premium, media/assets, net,
  state и другие ограничения всей операции. Подробности: [приложение A](#context-contract).

### Контроль источников

| Файл | SHA-256 содержимого |
| --- | --- |
| `relay/context.py` | `af66ab88029113b354451c0748a5adb641f3dcfab0a7998d073368f4c5f79b74` |
| `relay/toolkit.py` | `6fbae44abad4595b3695fecead063fa66c50ea72b3784924e2c9e6e023d9f013` |
| `relay/sandbox.py` | `34c660ebc571fac589dc1406da093c7cedfe78654d4ae394c06a1af3cb904815` |
| `relay/caps.py` | `215248de25954b1023342b1ea4a328230b499dd68d411f04200dba7fe29ab9d7` |

### Навигация по namespace

- **messages (126):** [set_checklist_completed](#ctx-set_checklist_completed), [add_poll_answer](#ctx-add_poll_answer), [remove_poll_answer](#ctx-remove_poll_answer), [unread_poll_votes](#ctx-unread_poll_votes), [mark_poll_votes_read](#ctx-mark_poll_votes_read), [scheduled_messages](#ctx-scheduled_messages), [scheduled_by_ids](#ctx-scheduled_by_ids), [publish_scheduled](#ctx-publish_scheduled), [cancel_scheduled](#ctx-cancel_scheduled), [configure_chat_reactions](#ctx-configure_chat_reactions), [available_reactions](#ctx-available_reactions), [set_default_reaction](#ctx-set_default_reaction), [unread_reactions](#ctx-unread_reactions), [mark_reactions_read](#ctx-mark_reactions_read), [popular_reactions](#ctx-popular_reactions), [recent_reactions](#ctx-recent_reactions), [clear_recent_reactions](#ctx-clear_recent_reactions), [remove_member_reactions](#ctx-remove_member_reactions), [remove_member_message_reaction](#ctx-remove_member_message_reaction), [saved_dialogs](#ctx-saved_dialogs), [saved_history](#ctx-saved_history), [clear_saved_history](#ctx-clear_saved_history), [pinned_saved_dialogs](#ctx-pinned_saved_dialogs), [set_saved_dialog_pinned](#ctx-set_saved_dialog_pinned), [reorder_saved_pins](#ctx-reorder_saved_pins), [saved_reaction_tags](#ctx-saved_reaction_tags), [rename_saved_tag](#ctx-rename_saved_tag), [suggested_saved_tags](#ctx-suggested_saved_tags), [saved_dialogs_by_peers](#ctx-saved_dialogs_by_peers), [mark_saved_history_read](#ctx-mark_saved_history_read), [forum_topics](#ctx-forum_topics), [forum_topics_by_ids](#ctx-forum_topics_by_ids), [edit_forum_topic](#ctx-edit_forum_topic), [set_forum_topic_pinned](#ctx-set_forum_topic_pinned), [reorder_forum_pins](#ctx-reorder_forum_pins), [create_forum_topic](#ctx-create_forum_topic), [remove_forum_topic](#ctx-remove_forum_topic), [stickers_for_emoji](#ctx-stickers_for_emoji), [installed_sticker_sets](#ctx-installed_sticker_sets), [sticker_set](#ctx-sticker_set), [install_sticker_set](#ctx-install_sticker_set), [uninstall_sticker_set](#ctx-uninstall_sticker_set), [reorder_sticker_sets](#ctx-reorder_sticker_sets), [saved_gifs](#ctx-saved_gifs), [set_gif_saved](#ctx-set_gif_saved), [featured_sticker_sets](#ctx-featured_sticker_sets), [mark_featured_stickers_seen](#ctx-mark_featured_stickers_seen), [recent_stickers](#ctx-recent_stickers), [set_sticker_recent](#ctx-set_sticker_recent), [clear_recent_stickers](#ctx-clear_recent_stickers), [archived_sticker_sets](#ctx-archived_sticker_sets), [installed_masks](#ctx-installed_masks), [media_sticker_sets](#ctx-media_sticker_sets), [favorite_stickers](#ctx-favorite_stickers), [set_sticker_favorite](#ctx-set_sticker_favorite), [search_sticker_sets](#ctx-search_sticker_sets), [bulk_sticker_set_action](#ctx-bulk_sticker_set_action), [older_featured_sticker_sets](#ctx-older_featured_sticker_sets), [custom_emoji_documents](#ctx-custom_emoji_documents), [installed_emoji_sets](#ctx-installed_emoji_sets), [featured_emoji_sets](#ctx-featured_emoji_sets), [search_custom_emoji](#ctx-search_custom_emoji), [search_emoji_sets](#ctx-search_emoji_sets), [owned_sticker_sets](#ctx-owned_sticker_sets), [search_stickers](#ctx-search_stickers), [dialogs](#ctx-dialogs), [chat_history](#ctx-chat_history), [search_chat_messages](#ctx-search_chat_messages), [mark_chat_read](#ctx-mark_chat_read), [clear_chat_history](#ctx-clear_chat_history), [peer_settings](#ctx-peer_settings), [basic_groups](#ctx-basic_groups), [basic_group_details](#ctx-basic_group_details), [search_all_messages](#ctx-search_all_messages), [message_editability](#ctx-message_editability), [peer_dialogs](#ctx-peer_dialogs), [all_drafts](#ctx-all_drafts), [mutual_groups](#ctx-mutual_groups), [set_dialog_pinned](#ctx-set_dialog_pinned), [reorder_dialog_pins](#ctx-reorder_dialog_pins), [pinned_dialogs](#ctx-pinned_dialogs), [unread_mentions](#ctx-unread_mentions), [mark_mentions_read](#ctx-mark_mentions_read), [recent_live_locations](#ctx-recent_live_locations), [set_dialog_unread](#ctx-set_dialog_unread), [unread_dialog_marks](#ctx-unread_dialog_marks), [clear_all_drafts](#ctx-clear_all_drafts), [chat_online_count](#ctx-chat_online_count), [message_type_counts](#ctx-message_type_counts), [dismiss_peer_settings_bar](#ctx-dismiss_peer_settings_bar), [mark_discussion_read](#ctx-mark_discussion_read), [unpin_all_chat_messages](#ctx-unpin_all_chat_messages), [message_readers](#ctx-message_readers), [message_search_calendar](#ctx-message_search_calendar), [message_search_positions](#ctx-message_search_positions), [set_default_send_as](#ctx-set_default_send_as), [sent_media_search](#ctx-sent_media_search), [outgoing_read_date](#ctx-outgoing_read_date), [chat_folders](#ctx-chat_folders), [suggested_chat_folders](#ctx-suggested_chat_folders), [save_chat_folder](#ctx-save_chat_folder), [reorder_chat_folders](#ctx-reorder_chat_folders), [set_folder_tags_visible](#ctx-set_folder_tags_visible), [rename_basic_group](#ctx-rename_basic_group), [set_basic_group_photo](#ctx-set_basic_group_photo), [add_basic_group_member](#ctx-add_basic_group_member), [remove_basic_group_member](#ctx-remove_basic_group_member), [create_basic_group](#ctx-create_basic_group), [set_basic_group_admin](#ctx-set_basic_group_admin), [upgrade_basic_group](#ctx-upgrade_basic_group), [edit_chat_description](#ctx-edit_chat_description), [set_default_member_restrictions](#ctx-set_default_member_restrictions), [remove_basic_group](#ctx-remove_basic_group), [set_chat_auto_delete](#ctx-set_chat_auto_delete), [set_content_protection](#ctx-set_content_protection), [edit_member_rank](#ctx-edit_member_rank), [create_chat_invite](#ctx-create_chat_invite), [chat_invites](#ctx-chat_invites), [chat_invite_details](#ctx-chat_invite_details), [edit_chat_invite](#ctx-edit_chat_invite), [purge_revoked_chat_invites](#ctx-purge_revoked_chat_invites), [remove_chat_invite](#ctx-remove_chat_invite), [invite_admins](#ctx-invite_admins), [invite_joiners](#ctx-invite_joiners), [resolve_join_request](#ctx-resolve_join_request), [resolve_all_join_requests](#ctx-resolve_all_join_requests)
- **stats (7):** [poll_statistics](#ctx-poll_statistics), [channel_statistics](#ctx-channel_statistics), [supergroup_statistics](#ctx-supergroup_statistics), [message_statistics](#ctx-message_statistics), [message_public_forwards](#ctx-message_public_forwards), [story_statistics](#ctx-story_statistics), [story_public_forwards](#ctx-story_public_forwards)
- **channels (46):** [set_forum_enabled](#ctx-set_forum_enabled), [set_forum_message_view](#ctx-set_forum_message_view), [channel_message_author](#ctx-channel_message_author), [mark_channel_read](#ctx-mark_channel_read), [channel_members](#ctx-channel_members), [channel_member](#ctx-channel_member), [channel_details](#ctx-channel_details), [create_channel](#ctx-create_channel), [set_channel_admin](#ctx-set_channel_admin), [rename_channel](#ctx-rename_channel), [set_channel_photo](#ctx-set_channel_photo), [check_channel_username](#ctx-check_channel_username), [set_channel_username](#ctx-set_channel_username), [join_channel](#ctx-join_channel), [leave_channel](#ctx-leave_channel), [invite_channel_members](#ctx-invite_channel_members), [remove_channel](#ctx-remove_channel), [set_channel_signatures](#ctx-set_channel_signatures), [owned_public_channels](#ctx-owned_public_channels), [restrict_channel_member](#ctx-restrict_channel_member), [channel_admin_log](#ctx-channel_admin_log), [set_group_sticker_set](#ctx-set_group_sticker_set), [mark_channel_media_read](#ctx-mark_channel_media_read), [clear_channel_history](#ctx-clear_channel_history), [set_prehistory_hidden](#ctx-set_prehistory_hidden), [left_channels](#ctx-left_channels), [eligible_discussion_groups](#ctx-eligible_discussion_groups), [set_discussion_group](#ctx-set_discussion_group), [set_group_location](#ctx-set_group_location), [set_slow_mode](#ctx-set_slow_mode), [inactive_channels](#ctx-inactive_channels), [send_as_identities](#ctx-send_as_identities), [remove_member_history](#ctx-remove_member_history), [set_join_to_send](#ctx-set_join_to_send), [set_join_requests](#ctx-set_join_requests), [reorder_channel_usernames](#ctx-reorder_channel_usernames), [set_channel_username_active](#ctx-set_channel_username_active), [deactivate_channel_usernames](#ctx-deactivate_channel_usernames), [set_antispam](#ctx-set_antispam), [set_members_hidden](#ctx-set_members_hidden), [set_channel_color](#ctx-set_channel_color), [related_channels](#ctx-related_channels), [set_channel_emoji_status](#ctx-set_channel_emoji_status), [set_group_emoji_set](#ctx-set_group_emoji_set), [set_channel_auto_translation](#ctx-set_channel_auto_translation), [set_channel_profile_tab](#ctx-set_channel_profile_tab)
- **stories (29):** [story_posting_quota](#ctx-story_posting_quota), [post_story](#ctx-post_story), [edit_story](#ctx-edit_story), [delete_stories](#ctx-delete_stories), [set_stories_on_profile](#ctx-set_stories_on_profile), [story_feed](#ctx-story_feed), [profile_stories](#ctx-profile_stories), [archived_stories](#ctx-archived_stories), [stories_by_ids](#ctx-stories_by_ids), [mark_stories_read](#ctx-mark_stories_read), [story_viewers](#ctx-story_viewers), [story_view_counts](#ctx-story_view_counts), [story_link](#ctx-story_link), [activate_story_stealth](#ctx-activate_story_stealth), [react_to_story](#ctx-react_to_story), [peer_stories](#ctx-peer_stories), [story_read_markers](#ctx-story_read_markers), [peer_latest_story_ids](#ctx-peer_latest_story_ids), [story_posting_chats](#ctx-story_posting_chats), [set_peer_stories_hidden](#ctx-set_peer_stories_hidden), [story_reaction_senders](#ctx-story_reaction_senders), [reorder_profile_story_pins](#ctx-reorder_profile_story_pins), [search_stories](#ctx-search_stories), [create_story_album](#ctx-create_story_album), [edit_story_album](#ctx-edit_story_album), [reorder_story_albums](#ctx-reorder_story_albums), [remove_story_album](#ctx-remove_story_album), [story_albums](#ctx-story_albums), [story_album_items](#ctx-story_album_items)
- **stickers (11):** [create_sticker_set](#ctx-create_sticker_set), [remove_sticker](#ctx-remove_sticker), [move_sticker](#ctx-move_sticker), [add_sticker](#ctx-add_sticker), [set_sticker_set_thumbnail](#ctx-set_sticker_set_thumbnail), [check_sticker_set_name](#ctx-check_sticker_set_name), [suggest_sticker_set_name](#ctx-suggest_sticker_set_name), [edit_sticker_metadata](#ctx-edit_sticker_metadata), [rename_sticker_set](#ctx-rename_sticker_set), [remove_sticker_set](#ctx-remove_sticker_set), [replace_sticker](#ctx-replace_sticker)
- **contacts (21):** [contact_ids](#ctx-contact_ids), [contact_statuses](#ctx-contact_statuses), [contacts_list](#ctx-contacts_list), [import_contacts](#ctx-import_contacts), [remove_contacts](#ctx-remove_contacts), [remove_contacts_by_phone](#ctx-remove_contacts_by_phone), [block_peer](#ctx-block_peer), [unblock_peer](#ctx-unblock_peer), [blocked_peers](#ctx-blocked_peers), [search_public_peers](#ctx-search_public_peers), [frequent_peers](#ctx-frequent_peers), [reset_peer_rating](#ctx-reset_peer_rating), [clear_imported_contacts](#ctx-clear_imported_contacts), [imported_contacts](#ctx-imported_contacts), [set_frequent_peers_enabled](#ctx-set_frequent_peers_enabled), [add_contact](#ctx-add_contact), [accept_contact](#ctx-accept_contact), [set_close_friends](#ctx-set_close_friends), [replace_blocklist](#ctx-replace_blocklist), [contact_birthdays](#ctx-contact_birthdays), [edit_contact_note](#ctx-edit_contact_note)
- **folders (1):** [move_dialogs_to_archive](#ctx-move_dialogs_to_archive)
- **chatlists (11):** [share_chat_folder](#ctx-share_chat_folder), [remove_folder_invite](#ctx-remove_folder_invite), [edit_folder_invite](#ctx-edit_folder_invite), [folder_invites](#ctx-folder_invites), [inspect_folder_invite](#ctx-inspect_folder_invite), [join_folder_invite](#ctx-join_folder_invite), [folder_updates](#ctx-folder_updates), [accept_folder_updates](#ctx-accept_folder_updates), [dismiss_folder_updates](#ctx-dismiss_folder_updates), [folder_leave_suggestions](#ctx-folder_leave_suggestions), [leave_shared_folder](#ctx-leave_shared_folder)
- **account (30):** [edit_profile](#ctx-edit_profile), [set_online_status](#ctx-set_online_status), [check_profile_username](#ctx-check_profile_username), [set_profile_username](#ctx-set_profile_username), [privacy_rules](#ctx-privacy_rules), [account_inactivity_ttl](#ctx-account_inactivity_ttl), [set_emoji_status](#ctx-set_emoji_status), [suggested_emoji_statuses](#ctx-suggested_emoji_statuses), [recent_emoji_statuses](#ctx-recent_emoji_statuses), [clear_recent_emoji_statuses](#ctx-clear_recent_emoji_statuses), [reorder_profile_usernames](#ctx-reorder_profile_usernames), [set_profile_username_active](#ctx-set_profile_username_active), [profile_photo_emojis](#ctx-profile_photo_emojis), [set_profile_color](#ctx-set_profile_color), [set_birthday](#ctx-set_birthday), [set_personal_channel](#ctx-set_personal_channel), [set_profile_tab](#ctx-set_profile_tab), [set_music_saved](#ctx-set_music_saved), [saved_music_ids](#ctx-saved_music_ids), [notification_settings](#ctx-notification_settings), [set_notification_settings](#ctx-set_notification_settings), [reset_notification_settings](#ctx-reset_notification_settings), [contact_signup_notifications](#ctx-contact_signup_notifications), [set_contact_signup_notifications](#ctx-set_contact_signup_notifications), [notification_exceptions](#ctx-notification_exceptions), [reaction_notification_settings](#ctx-reaction_notification_settings), [set_reaction_notification_settings](#ctx-set_reaction_notification_settings), [saved_notification_sounds](#ctx-saved_notification_sounds), [set_notification_sound_saved](#ctx-set_notification_sound_saved), [upload_notification_sound](#ctx-upload_notification_sound)
- **users (5):** [user_details](#ctx-user_details), [contact_requirements](#ctx-contact_requirements), [user_music](#ctx-user_music), [user_music_by_documents](#ctx-user_music_by_documents), [suggest_contact_birthday](#ctx-suggest_contact_birthday)
- **photos (5):** [select_profile_photo](#ctx-select_profile_photo), [upload_profile_photo](#ctx-upload_profile_photo), [remove_profile_photos](#ctx-remove_profile_photos), [profile_photos](#ctx-profile_photos), [set_contact_photo](#ctx-set_contact_photo)

### Карточки методов

<a id="ctx-set_checklist_completed"></a>
#### 1. `ctx.set_checklist_completed`

- **MTProto RPC:** `messages.toggleTodoCompleted`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleTodoCompleted`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleTodoCompleted`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_checklist_completed(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE, completed, incompleted)
```

**Порядок positional slots:** `peer, msg_id, completed, incompleted`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |
| `completed` | `Vector<int>` | да | — |
| `incompleted` | `Vector<int>` | да | — |

<a id="ctx-add_poll_answer"></a>
#### 2. `ctx.add_poll_answer`

- **MTProto RPC:** `messages.addPollAnswer`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.addPollAnswer`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.addPollAnswer`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.add_poll_answer(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE, answer)
```

**Порядок positional slots:** `peer, msg_id, answer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |
| `answer` | `PollAnswer` | да | — |

<a id="ctx-remove_poll_answer"></a>
#### 3. `ctx.remove_poll_answer`

- **MTProto RPC:** `messages.deletePollAnswer`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deletePollAnswer`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deletePollAnswer`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_poll_answer(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE, option)
```

**Порядок positional slots:** `peer, msg_id, option`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |
| `option` | `bytes` | да | — |

<a id="ctx-unread_poll_votes"></a>
#### 4. `ctx.unread_poll_votes`

- **MTProto RPC:** `messages.getUnreadPollVotes`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getUnreadPollVotes`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getUnreadPollVotes`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unread_poll_votes(*, peer=CURRENT_PEER, top_msg_id=None, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0)
```

**Порядок positional slots:** `peer, offset_id, add_offset, limit, max_id, min_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `offset_id` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |

<a id="ctx-mark_poll_votes_read"></a>
#### 5. `ctx.mark_poll_votes_read`

- **MTProto RPC:** `messages.readPollVotes`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readPollVotes`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readPollVotes`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_poll_votes_read(*, peer=CURRENT_PEER, top_msg_id=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |

<a id="ctx-poll_statistics"></a>
#### 6. `ctx.poll_statistics`

- **MTProto RPC:** `stats.getPollStats`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getPollStats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getPollStats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.poll_statistics(*, dark=None, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE)
```

**Порядок positional slots:** `peer, msg_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `dark` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |

<a id="ctx-scheduled_messages"></a>
#### 7. `ctx.scheduled_messages`

- **MTProto RPC:** `messages.getScheduledHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getScheduledHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getScheduledHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.scheduled_messages(*, peer=CURRENT_PEER, hash=0)
```

**Порядок positional slots:** `peer, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `hash` | `long` | нет | `0` |

<a id="ctx-scheduled_by_ids"></a>
#### 8. `ctx.scheduled_by_ids`

- **MTProto RPC:** `messages.getScheduledMessages`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getScheduledMessages`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getScheduledMessages`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.scheduled_by_ids(*, peer=CURRENT_PEER, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `Vector<int>` | да | — |

<a id="ctx-publish_scheduled"></a>
#### 9. `ctx.publish_scheduled`

- **MTProto RPC:** `messages.sendScheduledMessages`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.sendScheduledMessages`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.sendScheduledMessages`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.publish_scheduled(*, peer=CURRENT_PEER, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `Vector<int>` | да | — |

<a id="ctx-cancel_scheduled"></a>
#### 10. `ctx.cancel_scheduled`

- **MTProto RPC:** `messages.deleteScheduledMessages`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteScheduledMessages`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteScheduledMessages`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.cancel_scheduled(*, peer=CURRENT_PEER, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `Vector<int>` | да | — |

<a id="ctx-configure_chat_reactions"></a>
#### 11. `ctx.configure_chat_reactions`

- **MTProto RPC:** `messages.setChatAvailableReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.setChatAvailableReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.setChatAvailableReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.configure_chat_reactions(*, peer=CURRENT_PEER, available_reactions, reactions_limit=None, paid_enabled=None)
```

**Порядок positional slots:** `peer, available_reactions`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `available_reactions` | `ChatReactions` | да | — |
| `reactions_limit` | `flags.0?int` | нет | поле пропускается |
| `paid_enabled` | `flags.1?Bool` | нет | поле пропускается |

<a id="ctx-available_reactions"></a>
#### 12. `ctx.available_reactions`

- **MTProto RPC:** `messages.getAvailableReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getAvailableReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getAvailableReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.available_reactions(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `int` | нет | `0` |

<a id="ctx-set_default_reaction"></a>
#### 13. `ctx.set_default_reaction`

- **MTProto RPC:** `messages.setDefaultReaction`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.setDefaultReaction`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.setDefaultReaction`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_default_reaction(*, reaction)
```

**Порядок positional slots:** `reaction`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `reaction` | `Reaction` | да | — |

<a id="ctx-unread_reactions"></a>
#### 14. `ctx.unread_reactions`

- **MTProto RPC:** `messages.getUnreadReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getUnreadReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getUnreadReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unread_reactions(*, peer=CURRENT_PEER, top_msg_id=None, saved_peer_id=None, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0)
```

**Порядок positional slots:** `peer, offset_id, add_offset, limit, max_id, min_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `saved_peer_id` | `flags.1?InputPeer` | нет | поле пропускается |
| `offset_id` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |

<a id="ctx-mark_reactions_read"></a>
#### 15. `ctx.mark_reactions_read`

- **MTProto RPC:** `messages.readReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_reactions_read(*, peer=CURRENT_PEER, top_msg_id=None, saved_peer_id=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `saved_peer_id` | `flags.1?InputPeer` | нет | поле пропускается |

<a id="ctx-popular_reactions"></a>
#### 16. `ctx.popular_reactions`

- **MTProto RPC:** `messages.getTopReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getTopReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getTopReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.popular_reactions(*, limit=50, hash=0)
```

**Порядок positional slots:** `limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-recent_reactions"></a>
#### 17. `ctx.recent_reactions`

- **MTProto RPC:** `messages.getRecentReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getRecentReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getRecentReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.recent_reactions(*, limit=50, hash=0)
```

**Порядок positional slots:** `limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-clear_recent_reactions"></a>
#### 18. `ctx.clear_recent_reactions`

- **MTProto RPC:** `messages.clearRecentReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.clearRecentReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.clearRecentReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_recent_reactions()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-remove_member_reactions"></a>
#### 19. `ctx.remove_member_reactions`

- **MTProto RPC:** `messages.deleteParticipantReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteParticipantReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteParticipantReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_member_reactions(*, peer=CURRENT_PEER, participant)
```

**Порядок positional slots:** `peer, participant`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `participant` | `InputPeer` | да | — |

<a id="ctx-remove_member_message_reaction"></a>
#### 20. `ctx.remove_member_message_reaction`

- **MTProto RPC:** `messages.deleteParticipantReaction`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteParticipantReaction`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteParticipantReaction`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_member_message_reaction(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE, participant)
```

**Порядок positional slots:** `peer, msg_id, participant`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |
| `participant` | `InputPeer` | да | — |

<a id="ctx-saved_dialogs"></a>
#### 21. `ctx.saved_dialogs`

- **MTProto RPC:** `messages.getSavedDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSavedDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSavedDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_dialogs(*, exclude_pinned=None, parent_peer=None, offset_date=0, offset_id=0, offset_peer={'_': 'inputPeerEmpty'}, limit=50, hash=0)
```

**Порядок positional slots:** `offset_date, offset_id, offset_peer, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `exclude_pinned` | `flags.0?true` | нет | поле пропускается |
| `parent_peer` | `flags.1?InputPeer` | нет | поле пропускается |
| `offset_date` | `int` | нет | `0` |
| `offset_id` | `int` | нет | `0` |
| `offset_peer` | `InputPeer` | нет | `{'_': 'inputPeerEmpty'}` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-saved_history"></a>
#### 22. `ctx.saved_history`

- **MTProto RPC:** `messages.getSavedHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSavedHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSavedHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_history(*, parent_peer=None, peer, offset_id=0, offset_date=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0)
```

**Порядок positional slots:** `peer, offset_id, offset_date, add_offset, limit, max_id, min_id, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `parent_peer` | `flags.0?InputPeer` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `offset_id` | `int` | нет | `0` |
| `offset_date` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |
| `hash` | `long` | нет | `0` |

<a id="ctx-clear_saved_history"></a>
#### 23. `ctx.clear_saved_history`

- **MTProto RPC:** `messages.deleteSavedHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteSavedHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteSavedHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_saved_history(*, parent_peer=None, peer, max_id, min_date=None, max_date=None)
```

**Порядок positional slots:** `peer, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `parent_peer` | `flags.0?InputPeer` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `max_id` | `int` | да | — |
| `min_date` | `flags.2?int` | нет | поле пропускается |
| `max_date` | `flags.3?int` | нет | поле пропускается |

<a id="ctx-pinned_saved_dialogs"></a>
#### 24. `ctx.pinned_saved_dialogs`

- **MTProto RPC:** `messages.getPinnedSavedDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getPinnedSavedDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getPinnedSavedDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.pinned_saved_dialogs()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_saved_dialog_pinned"></a>
#### 25. `ctx.set_saved_dialog_pinned`

- **MTProto RPC:** `messages.toggleSavedDialogPin`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleSavedDialogPin`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleSavedDialogPin`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_saved_dialog_pinned(*, pinned=None, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `pinned` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputDialogPeer` | да | — |

<a id="ctx-reorder_saved_pins"></a>
#### 26. `ctx.reorder_saved_pins`

- **MTProto RPC:** `messages.reorderPinnedSavedDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.reorderPinnedSavedDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.reorderPinnedSavedDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_saved_pins(*, force=None, order)
```

**Порядок positional slots:** `order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `force` | `flags.0?true` | нет | поле пропускается |
| `order` | `Vector<InputDialogPeer>` | да | — |

<a id="ctx-saved_reaction_tags"></a>
#### 27. `ctx.saved_reaction_tags`

- **MTProto RPC:** `messages.getSavedReactionTags`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSavedReactionTags`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSavedReactionTags`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_reaction_tags(*, peer=None, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `flags.0?InputPeer` | нет | поле пропускается |
| `hash` | `long` | нет | `0` |

<a id="ctx-rename_saved_tag"></a>
#### 28. `ctx.rename_saved_tag`

- **MTProto RPC:** `messages.updateSavedReactionTag`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.updateSavedReactionTag`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.updateSavedReactionTag`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.rename_saved_tag(*, reaction, title=None)
```

**Порядок positional slots:** `reaction`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `reaction` | `Reaction` | да | — |
| `title` | `flags.0?string` | нет | поле пропускается |

<a id="ctx-suggested_saved_tags"></a>
#### 29. `ctx.suggested_saved_tags`

- **MTProto RPC:** `messages.getDefaultTagReactions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getDefaultTagReactions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getDefaultTagReactions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.suggested_saved_tags(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-saved_dialogs_by_peers"></a>
#### 30. `ctx.saved_dialogs_by_peers`

- **MTProto RPC:** `messages.getSavedDialogsByID`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSavedDialogsByID`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSavedDialogsByID`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_dialogs_by_peers(*, parent_peer=None, ids)
```

**Порядок positional slots:** `ids`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `parent_peer` | `flags.1?InputPeer` | нет | поле пропускается |
| `ids` | `Vector<InputPeer>` | да | — |

<a id="ctx-mark_saved_history_read"></a>
#### 31. `ctx.mark_saved_history_read`

- **MTProto RPC:** `messages.readSavedHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readSavedHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readSavedHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_saved_history_read(*, parent_peer, peer, max_id)
```

**Порядок positional slots:** `parent_peer, peer, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `parent_peer` | `InputPeer` | да | — |
| `peer` | `InputPeer` | да | — |
| `max_id` | `int` | да | — |

<a id="ctx-forum_topics"></a>
#### 32. `ctx.forum_topics`

- **MTProto RPC:** `messages.getForumTopics`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getForumTopics`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getForumTopics`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.forum_topics(*, peer=CURRENT_PEER, q=None, offset_date=0, offset_id=0, offset_topic=0, limit=50)
```

**Порядок positional slots:** `peer, offset_date, offset_id, offset_topic, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `q` | `flags.0?string` | нет | поле пропускается |
| `offset_date` | `int` | нет | `0` |
| `offset_id` | `int` | нет | `0` |
| `offset_topic` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-forum_topics_by_ids"></a>
#### 33. `ctx.forum_topics_by_ids`

- **MTProto RPC:** `messages.getForumTopicsByID`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getForumTopicsByID`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getForumTopicsByID`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.forum_topics_by_ids(*, peer=CURRENT_PEER, topics)
```

**Порядок positional slots:** `peer, topics`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `topics` | `Vector<int>` | да | — |

<a id="ctx-edit_forum_topic"></a>
#### 34. `ctx.edit_forum_topic`

- **MTProto RPC:** `messages.editForumTopic`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editForumTopic`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editForumTopic`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_forum_topic(*, peer=CURRENT_PEER, topic_id, title=None, icon_emoji_id=None, closed=None, hidden=None)
```

**Порядок positional slots:** `peer, topic_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `topic_id` | `int` | да | — |
| `title` | `flags.0?string` | нет | поле пропускается |
| `icon_emoji_id` | `flags.1?long` | нет | поле пропускается |
| `closed` | `flags.2?Bool` | нет | поле пропускается |
| `hidden` | `flags.3?Bool` | нет | поле пропускается |

<a id="ctx-set_forum_topic_pinned"></a>
#### 35. `ctx.set_forum_topic_pinned`

- **MTProto RPC:** `messages.updatePinnedForumTopic`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.updatePinnedForumTopic`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.updatePinnedForumTopic`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_forum_topic_pinned(*, peer=CURRENT_PEER, topic_id, pinned)
```

**Порядок positional slots:** `peer, topic_id, pinned`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `topic_id` | `int` | да | — |
| `pinned` | `Bool` | да | — |

<a id="ctx-reorder_forum_pins"></a>
#### 36. `ctx.reorder_forum_pins`

- **MTProto RPC:** `messages.reorderPinnedForumTopics`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.reorderPinnedForumTopics`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.reorderPinnedForumTopics`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_forum_pins(*, force=None, peer=CURRENT_PEER, order)
```

**Порядок positional slots:** `peer, order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `force` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `order` | `Vector<int>` | да | — |

<a id="ctx-create_forum_topic"></a>
#### 37. `ctx.create_forum_topic`

- **MTProto RPC:** `messages.createForumTopic`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.createForumTopic`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.createForumTopic`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_forum_topic(*, title_missing=None, peer=CURRENT_PEER, title, icon_color=None, icon_emoji_id=None, random_id=RANDOM_ID, send_as=None)
```

**Порядок positional slots:** `peer, title, random_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `title_missing` | `flags.4?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `title` | `string` | да | — |
| `icon_color` | `flags.0?int` | нет | поле пропускается |
| `icon_emoji_id` | `flags.3?long` | нет | поле пропускается |
| `random_id` | `long` | нет | `RANDOM_ID` |
| `send_as` | `flags.2?InputPeer` | нет | поле пропускается |

<a id="ctx-remove_forum_topic"></a>
#### 38. `ctx.remove_forum_topic`

- **MTProto RPC:** `messages.deleteTopicHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteTopicHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteTopicHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_forum_topic(*, peer=CURRENT_PEER, top_msg_id)
```

**Порядок positional slots:** `peer, top_msg_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `int` | да | — |

<a id="ctx-set_forum_enabled"></a>
#### 39. `ctx.set_forum_enabled`

- **MTProto RPC:** `channels.toggleForum`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleForum`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleForum`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_forum_enabled(*, channel=CURRENT_PEER, enabled, tabs)
```

**Порядок positional slots:** `channel, enabled, tabs`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |
| `tabs` | `Bool` | да | — |

<a id="ctx-set_forum_message_view"></a>
#### 40. `ctx.set_forum_message_view`

- **MTProto RPC:** `channels.toggleViewForumAsMessages`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleViewForumAsMessages`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleViewForumAsMessages`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_forum_message_view(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-story_posting_quota"></a>
#### 41. `ctx.story_posting_quota`

- **MTProto RPC:** `stories.canSendStory`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.canSendStory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.canSendStory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_posting_quota(*, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |

<a id="ctx-post_story"></a>
#### 42. `ctx.post_story`

- **MTProto RPC:** `stories.sendStory`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.sendStory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.sendStory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.post_story(*, pinned=None, noforwards=None, fwd_modified=None, peer, media, media_areas=None, caption=None, entities=None, privacy_rules, random_id=RANDOM_ID, period=None, fwd_from_id=None, fwd_from_story=None, albums=None, music=None)
```

**Порядок positional slots:** `peer, media, privacy_rules, random_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `pinned` | `flags.2?true` | нет | поле пропускается |
| `noforwards` | `flags.4?true` | нет | поле пропускается |
| `fwd_modified` | `flags.7?true` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `media` | `InputMedia` | да | — |
| `media_areas` | `flags.5?Vector<MediaArea>` | нет | поле пропускается |
| `caption` | `flags.0?string` | нет | поле пропускается |
| `entities` | `flags.1?Vector<MessageEntity>` | нет | поле пропускается |
| `privacy_rules` | `Vector<InputPrivacyRule>` | да | — |
| `random_id` | `long` | нет | `RANDOM_ID` |
| `period` | `flags.3?int` | нет | поле пропускается |
| `fwd_from_id` | `flags.6?InputPeer` | нет | поле пропускается |
| `fwd_from_story` | `flags.6?int` | нет | поле пропускается |
| `albums` | `flags.8?Vector<int>` | нет | поле пропускается |
| `music` | `flags.9?InputDocument` | нет | поле пропускается |

<a id="ctx-edit_story"></a>
#### 43. `ctx.edit_story`

- **MTProto RPC:** `stories.editStory`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.editStory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.editStory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_story(*, peer, id, media=None, media_areas=None, caption=None, entities=None, privacy_rules=None, music=None)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `int` | да | — |
| `media` | `flags.0?InputMedia` | нет | поле пропускается |
| `media_areas` | `flags.3?Vector<MediaArea>` | нет | поле пропускается |
| `caption` | `flags.1?string` | нет | поле пропускается |
| `entities` | `flags.1?Vector<MessageEntity>` | нет | поле пропускается |
| `privacy_rules` | `flags.2?Vector<InputPrivacyRule>` | нет | поле пропускается |
| `music` | `flags.4?InputDocument` | нет | поле пропускается |

<a id="ctx-delete_stories"></a>
#### 44. `ctx.delete_stories`

- **MTProto RPC:** `stories.deleteStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.deleteStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.deleteStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.delete_stories(*, peer, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `Vector<int>` | да | — |

<a id="ctx-set_stories_on_profile"></a>
#### 45. `ctx.set_stories_on_profile`

- **MTProto RPC:** `stories.togglePinned`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.togglePinned`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.togglePinned`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_stories_on_profile(*, peer, id, pinned)
```

**Порядок positional slots:** `peer, id, pinned`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `Vector<int>` | да | — |
| `pinned` | `Bool` | да | — |

<a id="ctx-story_feed"></a>
#### 46. `ctx.story_feed`

- **MTProto RPC:** `stories.getAllStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getAllStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getAllStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_feed(*, next=None, hidden=None, state=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `next` | `flags.1?true` | нет | поле пропускается |
| `hidden` | `flags.2?true` | нет | поле пропускается |
| `state` | `flags.0?string` | нет | поле пропускается |

<a id="ctx-profile_stories"></a>
#### 47. `ctx.profile_stories`

- **MTProto RPC:** `stories.getPinnedStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getPinnedStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getPinnedStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.profile_stories(*, peer, offset_id=0, limit=50)
```

**Порядок positional slots:** `peer, offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `offset_id` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-archived_stories"></a>
#### 48. `ctx.archived_stories`

- **MTProto RPC:** `stories.getStoriesArchive`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getStoriesArchive`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getStoriesArchive`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.archived_stories(*, peer, offset_id=0, limit=50)
```

**Порядок positional slots:** `peer, offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `offset_id` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-stories_by_ids"></a>
#### 49. `ctx.stories_by_ids`

- **MTProto RPC:** `stories.getStoriesByID`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getStoriesByID`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getStoriesByID`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.stories_by_ids(*, peer, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `Vector<int>` | да | — |

<a id="ctx-mark_stories_read"></a>
#### 50. `ctx.mark_stories_read`

- **MTProto RPC:** `stories.readStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.readStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.readStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_stories_read(*, peer, max_id=0)
```

**Порядок positional slots:** `peer, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `max_id` | `int` | нет | `0` |

<a id="ctx-story_viewers"></a>
#### 51. `ctx.story_viewers`

- **MTProto RPC:** `stories.getStoryViewsList`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getStoryViewsList`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getStoryViewsList`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_viewers(*, just_contacts=None, reactions_first=None, forwards_first=None, peer, q=None, id, offset='', limit=50)
```

**Порядок positional slots:** `peer, id, offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `just_contacts` | `flags.0?true` | нет | поле пропускается |
| `reactions_first` | `flags.2?true` | нет | поле пропускается |
| `forwards_first` | `flags.3?true` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `q` | `flags.1?string` | нет | поле пропускается |
| `id` | `int` | да | — |
| `offset` | `string` | нет | `''` |
| `limit` | `int` | нет | `50` |

<a id="ctx-story_view_counts"></a>
#### 52. `ctx.story_view_counts`

- **MTProto RPC:** `stories.getStoriesViews`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getStoriesViews`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getStoriesViews`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_view_counts(*, peer, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `Vector<int>` | да | — |

<a id="ctx-story_link"></a>
#### 53. `ctx.story_link`

- **MTProto RPC:** `stories.exportStoryLink`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.exportStoryLink`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.exportStoryLink`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_link(*, peer, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `int` | да | — |

<a id="ctx-activate_story_stealth"></a>
#### 54. `ctx.activate_story_stealth`

- **MTProto RPC:** `stories.activateStealthMode`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.activateStealthMode`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.activateStealthMode`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.activate_story_stealth(*, past=None, future=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `past` | `flags.0?true` | нет | поле пропускается |
| `future` | `flags.1?true` | нет | поле пропускается |

<a id="ctx-react_to_story"></a>
#### 55. `ctx.react_to_story`

- **MTProto RPC:** `stories.sendReaction`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.sendReaction`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.sendReaction`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.react_to_story(*, add_to_recent=None, peer, story_id, reaction)
```

**Порядок positional slots:** `peer, story_id, reaction`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `add_to_recent` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `story_id` | `int` | да | — |
| `reaction` | `Reaction` | да | — |

<a id="ctx-peer_stories"></a>
#### 56. `ctx.peer_stories`

- **MTProto RPC:** `stories.getPeerStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getPeerStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getPeerStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.peer_stories(*, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |

<a id="ctx-story_read_markers"></a>
#### 57. `ctx.story_read_markers`

- **MTProto RPC:** `stories.getAllReadPeerStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getAllReadPeerStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getAllReadPeerStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_read_markers()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-peer_latest_story_ids"></a>
#### 58. `ctx.peer_latest_story_ids`

- **MTProto RPC:** `stories.getPeerMaxIDs`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getPeerMaxIDs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getPeerMaxIDs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.peer_latest_story_ids(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<InputPeer>` | да | — |

<a id="ctx-story_posting_chats"></a>
#### 59. `ctx.story_posting_chats`

- **MTProto RPC:** `stories.getChatsToSend`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getChatsToSend`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getChatsToSend`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_posting_chats()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_peer_stories_hidden"></a>
#### 60. `ctx.set_peer_stories_hidden`

- **MTProto RPC:** `stories.togglePeerStoriesHidden`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.togglePeerStoriesHidden`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.togglePeerStoriesHidden`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_peer_stories_hidden(*, peer, hidden)
```

**Порядок positional slots:** `peer, hidden`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `hidden` | `Bool` | да | — |

<a id="ctx-story_reaction_senders"></a>
#### 61. `ctx.story_reaction_senders`

- **MTProto RPC:** `stories.getStoryReactionsList`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getStoryReactionsList`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getStoryReactionsList`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_reaction_senders(*, forwards_first=None, peer, id, reaction=None, offset=None, limit=50)
```

**Порядок positional slots:** `peer, id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `forwards_first` | `flags.2?true` | нет | поле пропускается |
| `peer` | `InputPeer` | да | — |
| `id` | `int` | да | — |
| `reaction` | `flags.0?Reaction` | нет | поле пропускается |
| `offset` | `flags.1?string` | нет | поле пропускается |
| `limit` | `int` | нет | `50` |

<a id="ctx-reorder_profile_story_pins"></a>
#### 62. `ctx.reorder_profile_story_pins`

- **MTProto RPC:** `stories.togglePinnedToTop`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.togglePinnedToTop`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.togglePinnedToTop`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_profile_story_pins(*, peer, id)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `id` | `Vector<int>` | да | — |

<a id="ctx-search_stories"></a>
#### 63. `ctx.search_stories`

- **MTProto RPC:** `stories.searchPosts`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.searchPosts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.searchPosts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_stories(*, hashtag=None, area=None, peer=None, offset='', limit=50)
```

**Порядок positional slots:** `offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hashtag` | `flags.0?string` | нет | поле пропускается |
| `area` | `flags.1?MediaArea` | нет | поле пропускается |
| `peer` | `flags.2?InputPeer` | нет | поле пропускается |
| `offset` | `string` | нет | `''` |
| `limit` | `int` | нет | `50` |

<a id="ctx-create_story_album"></a>
#### 64. `ctx.create_story_album`

- **MTProto RPC:** `stories.createAlbum`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.createAlbum`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.createAlbum`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_story_album(*, peer, title, stories)
```

**Порядок positional slots:** `peer, title, stories`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `title` | `string` | да | — |
| `stories` | `Vector<int>` | да | — |

<a id="ctx-edit_story_album"></a>
#### 65. `ctx.edit_story_album`

- **MTProto RPC:** `stories.updateAlbum`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.updateAlbum`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.updateAlbum`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_story_album(*, peer, album_id, title=None, delete_stories=None, add_stories=None, order=None)
```

**Порядок positional slots:** `peer, album_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `album_id` | `int` | да | — |
| `title` | `flags.0?string` | нет | поле пропускается |
| `delete_stories` | `flags.1?Vector<int>` | нет | поле пропускается |
| `add_stories` | `flags.2?Vector<int>` | нет | поле пропускается |
| `order` | `flags.3?Vector<int>` | нет | поле пропускается |

<a id="ctx-reorder_story_albums"></a>
#### 66. `ctx.reorder_story_albums`

- **MTProto RPC:** `stories.reorderAlbums`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.reorderAlbums`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.reorderAlbums`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_story_albums(*, peer, order)
```

**Порядок positional slots:** `peer, order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `order` | `Vector<int>` | да | — |

<a id="ctx-remove_story_album"></a>
#### 67. `ctx.remove_story_album`

- **MTProto RPC:** `stories.deleteAlbum`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.deleteAlbum`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.deleteAlbum`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_story_album(*, peer, album_id)
```

**Порядок positional slots:** `peer, album_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `album_id` | `int` | да | — |

<a id="ctx-story_albums"></a>
#### 68. `ctx.story_albums`

- **MTProto RPC:** `stories.getAlbums`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getAlbums`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getAlbums`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_albums(*, peer, hash=0)
```

**Порядок positional slots:** `peer, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `hash` | `long` | нет | `0` |

<a id="ctx-story_album_items"></a>
#### 69. `ctx.story_album_items`

- **MTProto RPC:** `stories.getAlbumStories`
- **Namespace:** `stories`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stories.getAlbumStories`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stories.getAlbumStories`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_album_items(*, peer, album_id, offset=0, limit=50)
```

**Порядок positional slots:** `peer, album_id, offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | да | — |
| `album_id` | `int` | да | — |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-stickers_for_emoji"></a>
#### 70. `ctx.stickers_for_emoji`

- **MTProto RPC:** `messages.getStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.stickers_for_emoji(*, emoticon, hash=0)
```

**Порядок positional slots:** `emoticon, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `emoticon` | `string` | да | — |
| `hash` | `long` | нет | `0` |

<a id="ctx-installed_sticker_sets"></a>
#### 71. `ctx.installed_sticker_sets`

- **MTProto RPC:** `messages.getAllStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getAllStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getAllStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.installed_sticker_sets(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-sticker_set"></a>
#### 72. `ctx.sticker_set`

- **MTProto RPC:** `messages.getStickerSet`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.sticker_set(*, stickerset, hash=0)
```

**Порядок positional slots:** `stickerset, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |
| `hash` | `int` | нет | `0` |

<a id="ctx-install_sticker_set"></a>
#### 73. `ctx.install_sticker_set`

- **MTProto RPC:** `messages.installStickerSet`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.installStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.installStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.install_sticker_set(*, stickerset, archived=False)
```

**Порядок positional slots:** `stickerset, archived`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |
| `archived` | `Bool` | нет | `False` |

<a id="ctx-uninstall_sticker_set"></a>
#### 74. `ctx.uninstall_sticker_set`

- **MTProto RPC:** `messages.uninstallStickerSet`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.uninstallStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.uninstallStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.uninstall_sticker_set(*, stickerset)
```

**Порядок positional slots:** `stickerset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |

<a id="ctx-reorder_sticker_sets"></a>
#### 75. `ctx.reorder_sticker_sets`

- **MTProto RPC:** `messages.reorderStickerSets`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.reorderStickerSets`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.reorderStickerSets`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_sticker_sets(*, masks=None, emojis=None, order)
```

**Порядок positional slots:** `order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `masks` | `flags.0?true` | нет | поле пропускается |
| `emojis` | `flags.1?true` | нет | поле пропускается |
| `order` | `Vector<long>` | да | — |

<a id="ctx-saved_gifs"></a>
#### 76. `ctx.saved_gifs`

- **MTProto RPC:** `messages.getSavedGifs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSavedGifs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSavedGifs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_gifs(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_gif_saved"></a>
#### 77. `ctx.set_gif_saved`

- **MTProto RPC:** `messages.saveGif`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.saveGif`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.saveGif`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_gif_saved(*, id, unsave)
```

**Порядок positional slots:** `id, unsave`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputDocument` | да | — |
| `unsave` | `Bool` | да | — |

<a id="ctx-featured_sticker_sets"></a>
#### 78. `ctx.featured_sticker_sets`

- **MTProto RPC:** `messages.getFeaturedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getFeaturedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getFeaturedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.featured_sticker_sets(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-mark_featured_stickers_seen"></a>
#### 79. `ctx.mark_featured_stickers_seen`

- **MTProto RPC:** `messages.readFeaturedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readFeaturedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readFeaturedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_featured_stickers_seen(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<long>` | да | — |

<a id="ctx-recent_stickers"></a>
#### 80. `ctx.recent_stickers`

- **MTProto RPC:** `messages.getRecentStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getRecentStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getRecentStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.recent_stickers(*, attached=None, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `attached` | `flags.0?true` | нет | поле пропускается |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_sticker_recent"></a>
#### 81. `ctx.set_sticker_recent`

- **MTProto RPC:** `messages.saveRecentSticker`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.saveRecentSticker`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.saveRecentSticker`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_sticker_recent(*, attached=None, id, unsave)
```

**Порядок positional slots:** `id, unsave`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `attached` | `flags.0?true` | нет | поле пропускается |
| `id` | `InputDocument` | да | — |
| `unsave` | `Bool` | да | — |

<a id="ctx-clear_recent_stickers"></a>
#### 82. `ctx.clear_recent_stickers`

- **MTProto RPC:** `messages.clearRecentStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.clearRecentStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.clearRecentStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_recent_stickers(*, attached=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `attached` | `flags.0?true` | нет | поле пропускается |

<a id="ctx-archived_sticker_sets"></a>
#### 83. `ctx.archived_sticker_sets`

- **MTProto RPC:** `messages.getArchivedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getArchivedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getArchivedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.archived_sticker_sets(*, masks=None, emojis=None, offset_id=0, limit=50)
```

**Порядок positional slots:** `offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `masks` | `flags.0?true` | нет | поле пропускается |
| `emojis` | `flags.1?true` | нет | поле пропускается |
| `offset_id` | `long` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-installed_masks"></a>
#### 84. `ctx.installed_masks`

- **MTProto RPC:** `messages.getMaskStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getMaskStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getMaskStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.installed_masks(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-media_sticker_sets"></a>
#### 85. `ctx.media_sticker_sets`

- **MTProto RPC:** `messages.getAttachedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getAttachedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getAttachedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.media_sticker_sets(*, media)
```

**Порядок positional slots:** `media`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `media` | `InputStickeredMedia` | да | — |

<a id="ctx-favorite_stickers"></a>
#### 86. `ctx.favorite_stickers`

- **MTProto RPC:** `messages.getFavedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getFavedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getFavedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.favorite_stickers(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_sticker_favorite"></a>
#### 87. `ctx.set_sticker_favorite`

- **MTProto RPC:** `messages.faveSticker`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.faveSticker`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.faveSticker`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_sticker_favorite(*, id, unfave)
```

**Порядок positional slots:** `id, unfave`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputDocument` | да | — |
| `unfave` | `Bool` | да | — |

<a id="ctx-search_sticker_sets"></a>
#### 88. `ctx.search_sticker_sets`

- **MTProto RPC:** `messages.searchStickerSets`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchStickerSets`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchStickerSets`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_sticker_sets(*, exclude_featured=None, q, hash=0)
```

**Порядок positional slots:** `q, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `exclude_featured` | `flags.0?true` | нет | поле пропускается |
| `q` | `string` | да | — |
| `hash` | `long` | нет | `0` |

<a id="ctx-bulk_sticker_set_action"></a>
#### 89. `ctx.bulk_sticker_set_action`

- **MTProto RPC:** `messages.toggleStickerSets`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleStickerSets`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleStickerSets`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.bulk_sticker_set_action(*, uninstall=None, archive=None, unarchive=None, stickersets)
```

**Порядок positional slots:** `stickersets`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `uninstall` | `flags.0?true` | нет | поле пропускается |
| `archive` | `flags.1?true` | нет | поле пропускается |
| `unarchive` | `flags.2?true` | нет | поле пропускается |
| `stickersets` | `Vector<InputStickerSet>` | да | — |

<a id="ctx-older_featured_sticker_sets"></a>
#### 90. `ctx.older_featured_sticker_sets`

- **MTProto RPC:** `messages.getOldFeaturedStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getOldFeaturedStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getOldFeaturedStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.older_featured_sticker_sets(*, offset=0, limit=50, hash=0)
```

**Порядок positional slots:** `offset, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-custom_emoji_documents"></a>
#### 91. `ctx.custom_emoji_documents`

- **MTProto RPC:** `messages.getCustomEmojiDocuments`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getCustomEmojiDocuments`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getCustomEmojiDocuments`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.custom_emoji_documents(*, document_id)
```

**Порядок positional slots:** `document_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `document_id` | `Vector<long>` | да | — |

<a id="ctx-installed_emoji_sets"></a>
#### 92. `ctx.installed_emoji_sets`

- **MTProto RPC:** `messages.getEmojiStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getEmojiStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getEmojiStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.installed_emoji_sets(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-featured_emoji_sets"></a>
#### 93. `ctx.featured_emoji_sets`

- **MTProto RPC:** `messages.getFeaturedEmojiStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getFeaturedEmojiStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getFeaturedEmojiStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.featured_emoji_sets(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-search_custom_emoji"></a>
#### 94. `ctx.search_custom_emoji`

- **MTProto RPC:** `messages.searchCustomEmoji`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchCustomEmoji`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchCustomEmoji`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_custom_emoji(*, emoticon, hash=0)
```

**Порядок positional slots:** `emoticon, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `emoticon` | `string` | да | — |
| `hash` | `long` | нет | `0` |

<a id="ctx-search_emoji_sets"></a>
#### 95. `ctx.search_emoji_sets`

- **MTProto RPC:** `messages.searchEmojiStickerSets`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchEmojiStickerSets`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchEmojiStickerSets`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_emoji_sets(*, exclude_featured=None, q, hash=0)
```

**Порядок positional slots:** `q, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `exclude_featured` | `flags.0?true` | нет | поле пропускается |
| `q` | `string` | да | — |
| `hash` | `long` | нет | `0` |

<a id="ctx-owned_sticker_sets"></a>
#### 96. `ctx.owned_sticker_sets`

- **MTProto RPC:** `messages.getMyStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getMyStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getMyStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.owned_sticker_sets(*, offset_id=0, limit=50)
```

**Порядок positional slots:** `offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `offset_id` | `long` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-search_stickers"></a>
#### 97. `ctx.search_stickers`

- **MTProto RPC:** `messages.searchStickers`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_stickers(*, emojis=None, q, emoticon, lang_code, offset=0, limit=50, hash=0)
```

**Порядок positional slots:** `q, emoticon, lang_code, offset, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `emojis` | `flags.0?true` | нет | поле пропускается |
| `q` | `string` | да | — |
| `emoticon` | `string` | да | — |
| `lang_code` | `Vector<string>` | да | — |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-create_sticker_set"></a>
#### 98. `ctx.create_sticker_set`

- **MTProto RPC:** `stickers.createStickerSet`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.createStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.createStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_sticker_set(*, masks=None, emojis=None, text_color=None, user_id, title, short_name, thumb=None, stickers, software=None)
```

**Порядок positional slots:** `user_id, title, short_name, stickers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `masks` | `flags.0?true` | нет | поле пропускается |
| `emojis` | `flags.5?true` | нет | поле пропускается |
| `text_color` | `flags.6?true` | нет | поле пропускается |
| `user_id` | `InputUser` | да | — |
| `title` | `string` | да | — |
| `short_name` | `string` | да | — |
| `thumb` | `flags.2?InputDocument` | нет | поле пропускается |
| `stickers` | `Vector<InputStickerSetItem>` | да | — |
| `software` | `flags.3?string` | нет | поле пропускается |

<a id="ctx-remove_sticker"></a>
#### 99. `ctx.remove_sticker`

- **MTProto RPC:** `stickers.removeStickerFromSet`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.removeStickerFromSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.removeStickerFromSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_sticker(*, sticker)
```

**Порядок positional slots:** `sticker`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `sticker` | `InputDocument` | да | — |

<a id="ctx-move_sticker"></a>
#### 100. `ctx.move_sticker`

- **MTProto RPC:** `stickers.changeStickerPosition`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.changeStickerPosition`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.changeStickerPosition`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.move_sticker(*, sticker, position)
```

**Порядок positional slots:** `sticker, position`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `sticker` | `InputDocument` | да | — |
| `position` | `int` | да | — |

<a id="ctx-add_sticker"></a>
#### 101. `ctx.add_sticker`

- **MTProto RPC:** `stickers.addStickerToSet`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.addStickerToSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.addStickerToSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.add_sticker(*, stickerset, sticker)
```

**Порядок positional slots:** `stickerset, sticker`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |
| `sticker` | `InputStickerSetItem` | да | — |

<a id="ctx-set_sticker_set_thumbnail"></a>
#### 102. `ctx.set_sticker_set_thumbnail`

- **MTProto RPC:** `stickers.setStickerSetThumb`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.setStickerSetThumb`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.setStickerSetThumb`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_sticker_set_thumbnail(*, stickerset, thumb=None, thumb_document_id=None)
```

**Порядок positional slots:** `stickerset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |
| `thumb` | `flags.0?InputDocument` | нет | поле пропускается |
| `thumb_document_id` | `flags.1?long` | нет | поле пропускается |

<a id="ctx-check_sticker_set_name"></a>
#### 103. `ctx.check_sticker_set_name`

- **MTProto RPC:** `stickers.checkShortName`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.checkShortName`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.checkShortName`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.check_sticker_set_name(*, short_name)
```

**Порядок positional slots:** `short_name`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `short_name` | `string` | да | — |

<a id="ctx-suggest_sticker_set_name"></a>
#### 104. `ctx.suggest_sticker_set_name`

- **MTProto RPC:** `stickers.suggestShortName`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.suggestShortName`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.suggestShortName`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.suggest_sticker_set_name(*, title)
```

**Порядок positional slots:** `title`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `title` | `string` | да | — |

<a id="ctx-edit_sticker_metadata"></a>
#### 105. `ctx.edit_sticker_metadata`

- **MTProto RPC:** `stickers.changeSticker`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.changeSticker`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.changeSticker`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_sticker_metadata(*, sticker, emoji=None, mask_coords=None, keywords=None)
```

**Порядок positional slots:** `sticker`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `sticker` | `InputDocument` | да | — |
| `emoji` | `flags.0?string` | нет | поле пропускается |
| `mask_coords` | `flags.1?MaskCoords` | нет | поле пропускается |
| `keywords` | `flags.2?string` | нет | поле пропускается |

<a id="ctx-rename_sticker_set"></a>
#### 106. `ctx.rename_sticker_set`

- **MTProto RPC:** `stickers.renameStickerSet`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.renameStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.renameStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.rename_sticker_set(*, stickerset, title)
```

**Порядок positional slots:** `stickerset, title`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |
| `title` | `string` | да | — |

<a id="ctx-remove_sticker_set"></a>
#### 107. `ctx.remove_sticker_set`

- **MTProto RPC:** `stickers.deleteStickerSet`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.deleteStickerSet`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.deleteStickerSet`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_sticker_set(*, stickerset)
```

**Порядок positional slots:** `stickerset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `stickerset` | `InputStickerSet` | да | — |

<a id="ctx-replace_sticker"></a>
#### 108. `ctx.replace_sticker`

- **MTProto RPC:** `stickers.replaceSticker`
- **Namespace:** `stickers`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stickers.replaceSticker`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stickers.replaceSticker`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.replace_sticker(*, sticker, new_sticker)
```

**Порядок positional slots:** `sticker, new_sticker`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `sticker` | `InputDocument` | да | — |
| `new_sticker` | `InputStickerSetItem` | да | — |

<a id="ctx-contact_ids"></a>
#### 109. `ctx.contact_ids`

- **MTProto RPC:** `contacts.getContactIDs`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getContactIDs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getContactIDs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contact_ids(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-contact_statuses"></a>
#### 110. `ctx.contact_statuses`

- **MTProto RPC:** `contacts.getStatuses`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getStatuses`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getStatuses`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contact_statuses()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-contacts_list"></a>
#### 111. `ctx.contacts_list`

- **MTProto RPC:** `contacts.getContacts`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getContacts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getContacts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contacts_list(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-import_contacts"></a>
#### 112. `ctx.import_contacts`

- **MTProto RPC:** `contacts.importContacts`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.importContacts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.importContacts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.import_contacts(*, contacts)
```

**Порядок positional slots:** `contacts`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `contacts` | `Vector<InputContact>` | да | — |

<a id="ctx-remove_contacts"></a>
#### 113. `ctx.remove_contacts`

- **MTProto RPC:** `contacts.deleteContacts`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.deleteContacts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.deleteContacts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_contacts(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<InputUser>` | да | — |

<a id="ctx-remove_contacts_by_phone"></a>
#### 114. `ctx.remove_contacts_by_phone`

- **MTProto RPC:** `contacts.deleteByPhones`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.deleteByPhones`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.deleteByPhones`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_contacts_by_phone(*, phones)
```

**Порядок positional slots:** `phones`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `phones` | `Vector<string>` | да | — |

<a id="ctx-block_peer"></a>
#### 115. `ctx.block_peer`

- **MTProto RPC:** `contacts.block`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.block`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.block`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.block_peer(*, my_stories_from=None, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `my_stories_from` | `flags.0?true` | нет | поле пропускается |
| `id` | `InputPeer` | да | — |

<a id="ctx-unblock_peer"></a>
#### 116. `ctx.unblock_peer`

- **MTProto RPC:** `contacts.unblock`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.unblock`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.unblock`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unblock_peer(*, my_stories_from=None, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `my_stories_from` | `flags.0?true` | нет | поле пропускается |
| `id` | `InputPeer` | да | — |

<a id="ctx-blocked_peers"></a>
#### 117. `ctx.blocked_peers`

- **MTProto RPC:** `contacts.getBlocked`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getBlocked`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getBlocked`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.blocked_peers(*, my_stories_from=None, offset=0, limit=50)
```

**Порядок positional slots:** `offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `my_stories_from` | `flags.0?true` | нет | поле пропускается |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-search_public_peers"></a>
#### 118. `ctx.search_public_peers`

- **MTProto RPC:** `contacts.search`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.search`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.search`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_public_peers(*, broadcasts=None, bots=None, q, limit=50)
```

**Порядок positional slots:** `q, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `broadcasts` | `flags.0?true` | нет | поле пропускается |
| `bots` | `flags.1?true` | нет | поле пропускается |
| `q` | `string` | да | — |
| `limit` | `int` | нет | `50` |

<a id="ctx-frequent_peers"></a>
#### 119. `ctx.frequent_peers`

- **MTProto RPC:** `contacts.getTopPeers`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getTopPeers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getTopPeers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.frequent_peers(*, correspondents=None, bots_pm=None, bots_inline=None, phone_calls=None, forward_users=None, forward_chats=None, groups=None, channels=None, bots_app=None, bots_guestchat=None, offset=0, limit=50, hash=0)
```

**Порядок positional slots:** `offset, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `correspondents` | `flags.0?true` | нет | поле пропускается |
| `bots_pm` | `flags.1?true` | нет | поле пропускается |
| `bots_inline` | `flags.2?true` | нет | поле пропускается |
| `phone_calls` | `flags.3?true` | нет | поле пропускается |
| `forward_users` | `flags.4?true` | нет | поле пропускается |
| `forward_chats` | `flags.5?true` | нет | поле пропускается |
| `groups` | `flags.10?true` | нет | поле пропускается |
| `channels` | `flags.15?true` | нет | поле пропускается |
| `bots_app` | `flags.16?true` | нет | поле пропускается |
| `bots_guestchat` | `flags.17?true` | нет | поле пропускается |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-reset_peer_rating"></a>
#### 120. `ctx.reset_peer_rating`

- **MTProto RPC:** `contacts.resetTopPeerRating`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.resetTopPeerRating`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.resetTopPeerRating`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reset_peer_rating(*, category, peer)
```

**Порядок positional slots:** `category, peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `category` | `TopPeerCategory` | да | — |
| `peer` | `InputPeer` | да | — |

<a id="ctx-clear_imported_contacts"></a>
#### 121. `ctx.clear_imported_contacts`

- **MTProto RPC:** `contacts.resetSaved`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.resetSaved`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.resetSaved`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_imported_contacts()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-imported_contacts"></a>
#### 122. `ctx.imported_contacts`

- **MTProto RPC:** `contacts.getSaved`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getSaved`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getSaved`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.imported_contacts()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_frequent_peers_enabled"></a>
#### 123. `ctx.set_frequent_peers_enabled`

- **MTProto RPC:** `contacts.toggleTopPeers`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.toggleTopPeers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.toggleTopPeers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_frequent_peers_enabled(*, enabled)
```

**Порядок positional slots:** `enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `enabled` | `Bool` | да | — |

<a id="ctx-add_contact"></a>
#### 124. `ctx.add_contact`

- **MTProto RPC:** `contacts.addContact`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.addContact`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.addContact`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.add_contact(*, add_phone_privacy_exception=None, id, first_name, last_name, phone, note=None)
```

**Порядок positional slots:** `id, first_name, last_name, phone`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `add_phone_privacy_exception` | `flags.0?true` | нет | поле пропускается |
| `id` | `InputUser` | да | — |
| `first_name` | `string` | да | — |
| `last_name` | `string` | да | — |
| `phone` | `string` | да | — |
| `note` | `flags.1?TextWithEntities` | нет | поле пропускается |

<a id="ctx-accept_contact"></a>
#### 125. `ctx.accept_contact`

- **MTProto RPC:** `contacts.acceptContact`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.acceptContact`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.acceptContact`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.accept_contact(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |

<a id="ctx-set_close_friends"></a>
#### 126. `ctx.set_close_friends`

- **MTProto RPC:** `contacts.editCloseFriends`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.editCloseFriends`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.editCloseFriends`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_close_friends(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<long>` | да | — |

<a id="ctx-replace_blocklist"></a>
#### 127. `ctx.replace_blocklist`

- **MTProto RPC:** `contacts.setBlocked`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.setBlocked`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.setBlocked`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.replace_blocklist(*, my_stories_from=None, id, limit=50)
```

**Порядок positional slots:** `id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `my_stories_from` | `flags.0?true` | нет | поле пропускается |
| `id` | `Vector<InputPeer>` | да | — |
| `limit` | `int` | нет | `50` |

<a id="ctx-contact_birthdays"></a>
#### 128. `ctx.contact_birthdays`

- **MTProto RPC:** `contacts.getBirthdays`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.getBirthdays`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.getBirthdays`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contact_birthdays()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-edit_contact_note"></a>
#### 129. `ctx.edit_contact_note`

- **MTProto RPC:** `contacts.updateContactNote`
- **Namespace:** `contacts`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `contacts.updateContactNote`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `contacts.updateContactNote`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_contact_note(*, id, note)
```

**Порядок positional slots:** `id, note`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |
| `note` | `TextWithEntities` | да | — |

<a id="ctx-dialogs"></a>
#### 130. `ctx.dialogs`

- **MTProto RPC:** `messages.getDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.dialogs(*, exclude_pinned=None, folder_id=None, offset_date=0, offset_id=0, offset_peer={'_': 'inputPeerEmpty'}, limit=50, hash=0)
```

**Порядок positional slots:** `offset_date, offset_id, offset_peer, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `exclude_pinned` | `flags.0?true` | нет | поле пропускается |
| `folder_id` | `flags.1?int` | нет | поле пропускается |
| `offset_date` | `int` | нет | `0` |
| `offset_id` | `int` | нет | `0` |
| `offset_peer` | `InputPeer` | нет | `{'_': 'inputPeerEmpty'}` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-chat_history"></a>
#### 131. `ctx.chat_history`

- **MTProto RPC:** `messages.getHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.chat_history(*, peer=CURRENT_PEER, offset_id=0, offset_date=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0)
```

**Порядок positional slots:** `peer, offset_id, offset_date, add_offset, limit, max_id, min_id, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `offset_id` | `int` | нет | `0` |
| `offset_date` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |
| `hash` | `long` | нет | `0` |

<a id="ctx-search_chat_messages"></a>
#### 132. `ctx.search_chat_messages`

- **MTProto RPC:** `messages.search`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.search`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.search`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.search_chat_messages(*, peer=CURRENT_PEER, q, from_id=None, saved_peer_id=None, saved_reaction=None, top_msg_id=None, filter={'_': 'inputMessagesFilterEmpty'}, min_date=0, max_date=0, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0, hash=0)
```

**Порядок positional slots:** `peer, q, filter, min_date, max_date, offset_id, add_offset, limit, max_id, min_id, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `q` | `string` | да | — |
| `from_id` | `flags.0?InputPeer` | нет | поле пропускается |
| `saved_peer_id` | `flags.2?InputPeer` | нет | поле пропускается |
| `saved_reaction` | `flags.3?Vector<Reaction>` | нет | поле пропускается |
| `top_msg_id` | `flags.1?int` | нет | поле пропускается |
| `filter` | `MessagesFilter` | нет | `{'_': 'inputMessagesFilterEmpty'}` |
| `min_date` | `int` | нет | `0` |
| `max_date` | `int` | нет | `0` |
| `offset_id` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |
| `hash` | `long` | нет | `0` |

<a id="ctx-mark_chat_read"></a>
#### 133. `ctx.mark_chat_read`

- **MTProto RPC:** `messages.readHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_chat_read(*, peer=CURRENT_PEER, max_id)
```

**Порядок positional slots:** `peer, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `max_id` | `int` | да | — |

<a id="ctx-clear_chat_history"></a>
#### 134. `ctx.clear_chat_history`

- **MTProto RPC:** `messages.deleteHistory`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_chat_history(*, just_clear=None, revoke=None, peer=CURRENT_PEER, max_id, min_date=None, max_date=None)
```

**Порядок positional slots:** `peer, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `just_clear` | `flags.0?true` | нет | поле пропускается |
| `revoke` | `flags.1?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `max_id` | `int` | да | — |
| `min_date` | `flags.2?int` | нет | поле пропускается |
| `max_date` | `flags.3?int` | нет | поле пропускается |

<a id="ctx-peer_settings"></a>
#### 135. `ctx.peer_settings`

- **MTProto RPC:** `messages.getPeerSettings`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getPeerSettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getPeerSettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.peer_settings(*, peer=CURRENT_PEER)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |

<a id="ctx-basic_groups"></a>
#### 136. `ctx.basic_groups`

- **MTProto RPC:** `messages.getChats`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getChats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getChats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.basic_groups(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<long>` | да | — |

<a id="ctx-basic_group_details"></a>
#### 137. `ctx.basic_group_details`

- **MTProto RPC:** `messages.getFullChat`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getFullChat`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getFullChat`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.basic_group_details(*, chat_id)
```

**Порядок positional slots:** `chat_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |

<a id="ctx-search_all_messages"></a>
#### 138. `ctx.search_all_messages`

- **MTProto RPC:** `messages.searchGlobal`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchGlobal`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchGlobal`, converts contextual parameters and returns the host-processed RPC response body.
- **Политика:** **BLOCKED** в проверенном CapabilityHost. Присутствует в каталоге, но не разрешён; raw `mt` запрет не снимает.

**Справочная сигнатура (keywords):**

```text
ctx.search_all_messages(*, broadcasts_only=None, groups_only=None, users_only=None, folder_id=None, community=None, q, filter={'_': 'inputMessagesFilterEmpty'}, min_date=0, max_date=0, offset_rate=0, offset_peer={'_': 'inputPeerEmpty'}, offset_id=0, limit=50)
```

**Порядок positional slots:** `q, filter, min_date, max_date, offset_rate, offset_peer, offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `broadcasts_only` | `flags.1?true` | нет | поле пропускается |
| `groups_only` | `flags.2?true` | нет | поле пропускается |
| `users_only` | `flags.3?true` | нет | поле пропускается |
| `folder_id` | `flags.0?int` | нет | поле пропускается |
| `community` | `flags.4?InputChannel` | нет | поле пропускается |
| `q` | `string` | да | — |
| `filter` | `MessagesFilter` | нет | `{'_': 'inputMessagesFilterEmpty'}` |
| `min_date` | `int` | нет | `0` |
| `max_date` | `int` | нет | `0` |
| `offset_rate` | `int` | нет | `0` |
| `offset_peer` | `InputPeer` | нет | `{'_': 'inputPeerEmpty'}` |
| `offset_id` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-message_editability"></a>
#### 139. `ctx.message_editability`

- **MTProto RPC:** `messages.getMessageEditData`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getMessageEditData`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getMessageEditData`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_editability(*, peer=CURRENT_PEER, id=CURRENT_MESSAGE)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `int` | нет | `CURRENT_MESSAGE` |

<a id="ctx-peer_dialogs"></a>
#### 140. `ctx.peer_dialogs`

- **MTProto RPC:** `messages.getPeerDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getPeerDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getPeerDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.peer_dialogs(*, peers)
```

**Порядок positional slots:** `peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peers` | `Vector<InputDialogPeer>` | да | — |

<a id="ctx-all_drafts"></a>
#### 141. `ctx.all_drafts`

- **MTProto RPC:** `messages.getAllDrafts`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getAllDrafts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getAllDrafts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.all_drafts()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-mutual_groups"></a>
#### 142. `ctx.mutual_groups`

- **MTProto RPC:** `messages.getCommonChats`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getCommonChats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getCommonChats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mutual_groups(*, user_id, max_id=0, limit=50)
```

**Порядок positional slots:** `user_id, max_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `user_id` | `InputUser` | да | — |
| `max_id` | `long` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-set_dialog_pinned"></a>
#### 143. `ctx.set_dialog_pinned`

- **MTProto RPC:** `messages.toggleDialogPin`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleDialogPin`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleDialogPin`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_dialog_pinned(*, pinned=None, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `pinned` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputDialogPeer` | да | — |

<a id="ctx-reorder_dialog_pins"></a>
#### 144. `ctx.reorder_dialog_pins`

- **MTProto RPC:** `messages.reorderPinnedDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.reorderPinnedDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.reorderPinnedDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_dialog_pins(*, force=None, folder_id, order)
```

**Порядок positional slots:** `folder_id, order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `force` | `flags.0?true` | нет | поле пропускается |
| `folder_id` | `int` | да | — |
| `order` | `Vector<InputDialogPeer>` | да | — |

<a id="ctx-pinned_dialogs"></a>
#### 145. `ctx.pinned_dialogs`

- **MTProto RPC:** `messages.getPinnedDialogs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getPinnedDialogs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getPinnedDialogs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.pinned_dialogs(*, folder_id)
```

**Порядок positional slots:** `folder_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `folder_id` | `int` | да | — |

<a id="ctx-unread_mentions"></a>
#### 146. `ctx.unread_mentions`

- **MTProto RPC:** `messages.getUnreadMentions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getUnreadMentions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getUnreadMentions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unread_mentions(*, peer=CURRENT_PEER, top_msg_id=None, offset_id=0, add_offset=0, limit=50, max_id=0, min_id=0)
```

**Порядок positional slots:** `peer, offset_id, add_offset, limit, max_id, min_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `offset_id` | `int` | нет | `0` |
| `add_offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `max_id` | `int` | нет | `0` |
| `min_id` | `int` | нет | `0` |

<a id="ctx-mark_mentions_read"></a>
#### 147. `ctx.mark_mentions_read`

- **MTProto RPC:** `messages.readMentions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readMentions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readMentions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_mentions_read(*, peer=CURRENT_PEER, top_msg_id=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |

<a id="ctx-recent_live_locations"></a>
#### 148. `ctx.recent_live_locations`

- **MTProto RPC:** `messages.getRecentLocations`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getRecentLocations`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getRecentLocations`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.recent_live_locations(*, peer=CURRENT_PEER, limit=50, hash=0)
```

**Порядок positional slots:** `peer, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_dialog_unread"></a>
#### 149. `ctx.set_dialog_unread`

- **MTProto RPC:** `messages.markDialogUnread`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.markDialogUnread`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.markDialogUnread`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_dialog_unread(*, unread=None, parent_peer=None, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `unread` | `flags.0?true` | нет | поле пропускается |
| `parent_peer` | `flags.1?InputPeer` | нет | поле пропускается |
| `peer` | `InputDialogPeer` | да | — |

<a id="ctx-unread_dialog_marks"></a>
#### 150. `ctx.unread_dialog_marks`

- **MTProto RPC:** `messages.getDialogUnreadMarks`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getDialogUnreadMarks`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getDialogUnreadMarks`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unread_dialog_marks(*, parent_peer=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `parent_peer` | `flags.0?InputPeer` | нет | поле пропускается |

<a id="ctx-clear_all_drafts"></a>
#### 151. `ctx.clear_all_drafts`

- **MTProto RPC:** `messages.clearAllDrafts`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.clearAllDrafts`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.clearAllDrafts`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_all_drafts()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-chat_online_count"></a>
#### 152. `ctx.chat_online_count`

- **MTProto RPC:** `messages.getOnlines`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getOnlines`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getOnlines`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.chat_online_count(*, peer=CURRENT_PEER)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |

<a id="ctx-message_type_counts"></a>
#### 153. `ctx.message_type_counts`

- **MTProto RPC:** `messages.getSearchCounters`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSearchCounters`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSearchCounters`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_type_counts(*, peer=CURRENT_PEER, saved_peer_id=None, top_msg_id=None, filters)
```

**Порядок positional slots:** `peer, filters`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `saved_peer_id` | `flags.2?InputPeer` | нет | поле пропускается |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `filters` | `Vector<MessagesFilter>` | да | — |

<a id="ctx-dismiss_peer_settings_bar"></a>
#### 154. `ctx.dismiss_peer_settings_bar`

- **MTProto RPC:** `messages.hidePeerSettingsBar`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.hidePeerSettingsBar`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.hidePeerSettingsBar`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.dismiss_peer_settings_bar(*, peer=CURRENT_PEER)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |

<a id="ctx-mark_discussion_read"></a>
#### 155. `ctx.mark_discussion_read`

- **MTProto RPC:** `messages.readDiscussion`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.readDiscussion`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.readDiscussion`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_discussion_read(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE, read_max_id)
```

**Порядок positional slots:** `peer, msg_id, read_max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |
| `read_max_id` | `int` | да | — |

<a id="ctx-unpin_all_chat_messages"></a>
#### 156. `ctx.unpin_all_chat_messages`

- **MTProto RPC:** `messages.unpinAllMessages`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.unpinAllMessages`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.unpinAllMessages`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.unpin_all_chat_messages(*, peer=CURRENT_PEER, top_msg_id=None, saved_peer_id=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `top_msg_id` | `flags.0?int` | нет | поле пропускается |
| `saved_peer_id` | `flags.1?InputPeer` | нет | поле пропускается |

<a id="ctx-message_readers"></a>
#### 157. `ctx.message_readers`

- **MTProto RPC:** `messages.getMessageReadParticipants`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getMessageReadParticipants`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getMessageReadParticipants`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_readers(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE)
```

**Порядок positional slots:** `peer, msg_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |

<a id="ctx-message_search_calendar"></a>
#### 158. `ctx.message_search_calendar`

- **MTProto RPC:** `messages.getSearchResultsCalendar`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSearchResultsCalendar`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSearchResultsCalendar`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_search_calendar(*, peer=CURRENT_PEER, saved_peer_id=None, filter={'_': 'inputMessagesFilterEmpty'}, offset_id=0, offset_date=0)
```

**Порядок positional slots:** `peer, filter, offset_id, offset_date`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `saved_peer_id` | `flags.2?InputPeer` | нет | поле пропускается |
| `filter` | `MessagesFilter` | нет | `{'_': 'inputMessagesFilterEmpty'}` |
| `offset_id` | `int` | нет | `0` |
| `offset_date` | `int` | нет | `0` |

<a id="ctx-message_search_positions"></a>
#### 159. `ctx.message_search_positions`

- **MTProto RPC:** `messages.getSearchResultsPositions`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSearchResultsPositions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSearchResultsPositions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_search_positions(*, peer=CURRENT_PEER, saved_peer_id=None, filter={'_': 'inputMessagesFilterEmpty'}, offset_id=0, limit=50)
```

**Порядок positional slots:** `peer, filter, offset_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `saved_peer_id` | `flags.2?InputPeer` | нет | поле пропускается |
| `filter` | `MessagesFilter` | нет | `{'_': 'inputMessagesFilterEmpty'}` |
| `offset_id` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-set_default_send_as"></a>
#### 160. `ctx.set_default_send_as`

- **MTProto RPC:** `messages.saveDefaultSendAs`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.saveDefaultSendAs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.saveDefaultSendAs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_default_send_as(*, peer=CURRENT_PEER, send_as)
```

**Порядок positional slots:** `peer, send_as`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `send_as` | `InputPeer` | да | — |

<a id="ctx-sent_media_search"></a>
#### 161. `ctx.sent_media_search`

- **MTProto RPC:** `messages.searchSentMedia`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.searchSentMedia`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.searchSentMedia`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.sent_media_search(*, q, filter={'_': 'inputMessagesFilterEmpty'}, limit=50)
```

**Порядок positional slots:** `q, filter, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `q` | `string` | да | — |
| `filter` | `MessagesFilter` | нет | `{'_': 'inputMessagesFilterEmpty'}` |
| `limit` | `int` | нет | `50` |

<a id="ctx-outgoing_read_date"></a>
#### 162. `ctx.outgoing_read_date`

- **MTProto RPC:** `messages.getOutboxReadDate`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getOutboxReadDate`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getOutboxReadDate`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.outgoing_read_date(*, peer=CURRENT_PEER, msg_id=CURRENT_MESSAGE)
```

**Порядок positional slots:** `peer, msg_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | нет | `CURRENT_MESSAGE` |

<a id="ctx-channel_message_author"></a>
#### 163. `ctx.channel_message_author`

- **MTProto RPC:** `channels.getMessageAuthor`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getMessageAuthor`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getMessageAuthor`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_message_author(*, channel=CURRENT_PEER, id)
```

**Порядок positional slots:** `channel, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `id` | `int` | да | — |

<a id="ctx-move_dialogs_to_archive"></a>
#### 164. `ctx.move_dialogs_to_archive`

- **MTProto RPC:** `folders.editPeerFolders`
- **Namespace:** `folders`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `folders.editPeerFolders`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `folders.editPeerFolders`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.move_dialogs_to_archive(*, folder_peers)
```

**Порядок positional slots:** `folder_peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `folder_peers` | `Vector<InputFolderPeer>` | да | — |

<a id="ctx-chat_folders"></a>
#### 165. `ctx.chat_folders`

- **MTProto RPC:** `messages.getDialogFilters`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getDialogFilters`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getDialogFilters`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.chat_folders()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-suggested_chat_folders"></a>
#### 166. `ctx.suggested_chat_folders`

- **MTProto RPC:** `messages.getSuggestedDialogFilters`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getSuggestedDialogFilters`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getSuggestedDialogFilters`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.suggested_chat_folders()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-save_chat_folder"></a>
#### 167. `ctx.save_chat_folder`

- **MTProto RPC:** `messages.updateDialogFilter`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.updateDialogFilter`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.updateDialogFilter`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.save_chat_folder(*, id, filter=None)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `int` | да | — |
| `filter` | `flags.0?DialogFilter` | нет | поле пропускается |

<a id="ctx-reorder_chat_folders"></a>
#### 168. `ctx.reorder_chat_folders`

- **MTProto RPC:** `messages.updateDialogFiltersOrder`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.updateDialogFiltersOrder`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.updateDialogFiltersOrder`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_chat_folders(*, order)
```

**Порядок positional slots:** `order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `order` | `Vector<int>` | да | — |

<a id="ctx-set_folder_tags_visible"></a>
#### 169. `ctx.set_folder_tags_visible`

- **MTProto RPC:** `messages.toggleDialogFilterTags`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleDialogFilterTags`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleDialogFilterTags`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_folder_tags_visible(*, enabled)
```

**Порядок positional slots:** `enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `enabled` | `Bool` | да | — |

<a id="ctx-share_chat_folder"></a>
#### 170. `ctx.share_chat_folder`

- **MTProto RPC:** `chatlists.exportChatlistInvite`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.exportChatlistInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.exportChatlistInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.share_chat_folder(*, chatlist, title, peers)
```

**Порядок positional slots:** `chatlist, title, peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |
| `title` | `string` | да | — |
| `peers` | `Vector<InputPeer>` | да | — |

<a id="ctx-remove_folder_invite"></a>
#### 171. `ctx.remove_folder_invite`

- **MTProto RPC:** `chatlists.deleteExportedInvite`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.deleteExportedInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.deleteExportedInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_folder_invite(*, chatlist, slug)
```

**Порядок positional slots:** `chatlist, slug`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |
| `slug` | `string` | да | — |

<a id="ctx-edit_folder_invite"></a>
#### 172. `ctx.edit_folder_invite`

- **MTProto RPC:** `chatlists.editExportedInvite`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.editExportedInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.editExportedInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_folder_invite(*, chatlist, slug, title=None, peers=None)
```

**Порядок positional slots:** `chatlist, slug`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |
| `slug` | `string` | да | — |
| `title` | `flags.1?string` | нет | поле пропускается |
| `peers` | `flags.2?Vector<InputPeer>` | нет | поле пропускается |

<a id="ctx-folder_invites"></a>
#### 173. `ctx.folder_invites`

- **MTProto RPC:** `chatlists.getExportedInvites`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.getExportedInvites`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.getExportedInvites`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.folder_invites(*, chatlist)
```

**Порядок positional slots:** `chatlist`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |

<a id="ctx-inspect_folder_invite"></a>
#### 174. `ctx.inspect_folder_invite`

- **MTProto RPC:** `chatlists.checkChatlistInvite`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.checkChatlistInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.checkChatlistInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.inspect_folder_invite(*, slug)
```

**Порядок positional slots:** `slug`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `slug` | `string` | да | — |

<a id="ctx-join_folder_invite"></a>
#### 175. `ctx.join_folder_invite`

- **MTProto RPC:** `chatlists.joinChatlistInvite`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.joinChatlistInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.joinChatlistInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.join_folder_invite(*, slug, peers)
```

**Порядок positional slots:** `slug, peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `slug` | `string` | да | — |
| `peers` | `Vector<InputPeer>` | да | — |

<a id="ctx-folder_updates"></a>
#### 176. `ctx.folder_updates`

- **MTProto RPC:** `chatlists.getChatlistUpdates`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.getChatlistUpdates`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.getChatlistUpdates`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.folder_updates(*, chatlist)
```

**Порядок positional slots:** `chatlist`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |

<a id="ctx-accept_folder_updates"></a>
#### 177. `ctx.accept_folder_updates`

- **MTProto RPC:** `chatlists.joinChatlistUpdates`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.joinChatlistUpdates`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.joinChatlistUpdates`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.accept_folder_updates(*, chatlist, peers)
```

**Порядок positional slots:** `chatlist, peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |
| `peers` | `Vector<InputPeer>` | да | — |

<a id="ctx-dismiss_folder_updates"></a>
#### 178. `ctx.dismiss_folder_updates`

- **MTProto RPC:** `chatlists.hideChatlistUpdates`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.hideChatlistUpdates`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.hideChatlistUpdates`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.dismiss_folder_updates(*, chatlist)
```

**Порядок positional slots:** `chatlist`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |

<a id="ctx-folder_leave_suggestions"></a>
#### 179. `ctx.folder_leave_suggestions`

- **MTProto RPC:** `chatlists.getLeaveChatlistSuggestions`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.getLeaveChatlistSuggestions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.getLeaveChatlistSuggestions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.folder_leave_suggestions(*, chatlist)
```

**Порядок positional slots:** `chatlist`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |

<a id="ctx-leave_shared_folder"></a>
#### 180. `ctx.leave_shared_folder`

- **MTProto RPC:** `chatlists.leaveChatlist`
- **Namespace:** `chatlists`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `chatlists.leaveChatlist`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `chatlists.leaveChatlist`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.leave_shared_folder(*, chatlist, peers)
```

**Порядок positional slots:** `chatlist, peers`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chatlist` | `InputChatlist` | да | — |
| `peers` | `Vector<InputPeer>` | да | — |

<a id="ctx-edit_profile"></a>
#### 181. `ctx.edit_profile`

- **MTProto RPC:** `account.updateProfile`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateProfile`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateProfile`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_profile(*, first_name=None, last_name=None, about=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `first_name` | `flags.0?string` | нет | поле пропускается |
| `last_name` | `flags.1?string` | нет | поле пропускается |
| `about` | `flags.2?string` | нет | поле пропускается |

<a id="ctx-set_online_status"></a>
#### 182. `ctx.set_online_status`

- **MTProto RPC:** `account.updateStatus`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateStatus`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateStatus`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_online_status(*, offline)
```

**Порядок positional slots:** `offline`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `offline` | `Bool` | да | — |

<a id="ctx-check_profile_username"></a>
#### 183. `ctx.check_profile_username`

- **MTProto RPC:** `account.checkUsername`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.checkUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.checkUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.check_profile_username(*, username)
```

**Порядок positional slots:** `username`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `username` | `string` | да | — |

<a id="ctx-set_profile_username"></a>
#### 184. `ctx.set_profile_username`

- **MTProto RPC:** `account.updateUsername`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Политика:** **BLOCKED** в проверенном CapabilityHost. Присутствует в каталоге, но не разрешён; raw `mt` запрет не снимает.

**Справочная сигнатура (keywords):**

```text
ctx.set_profile_username(*, username)
```

**Порядок positional slots:** `username`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `username` | `string` | да | — |

<a id="ctx-privacy_rules"></a>
#### 185. `ctx.privacy_rules`

- **MTProto RPC:** `account.getPrivacy`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getPrivacy`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getPrivacy`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.privacy_rules(*, key)
```

**Порядок positional slots:** `key`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `key` | `InputPrivacyKey` | да | — |

<a id="ctx-account_inactivity_ttl"></a>
#### 186. `ctx.account_inactivity_ttl`

- **MTProto RPC:** `account.getAccountTTL`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getAccountTTL`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getAccountTTL`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.account_inactivity_ttl()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_emoji_status"></a>
#### 187. `ctx.set_emoji_status`

- **MTProto RPC:** `account.updateEmojiStatus`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateEmojiStatus`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateEmojiStatus`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_emoji_status(*, emoji_status)
```

**Порядок positional slots:** `emoji_status`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `emoji_status` | `EmojiStatus` | да | — |

<a id="ctx-suggested_emoji_statuses"></a>
#### 188. `ctx.suggested_emoji_statuses`

- **MTProto RPC:** `account.getDefaultEmojiStatuses`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getDefaultEmojiStatuses`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getDefaultEmojiStatuses`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.suggested_emoji_statuses(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-recent_emoji_statuses"></a>
#### 189. `ctx.recent_emoji_statuses`

- **MTProto RPC:** `account.getRecentEmojiStatuses`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getRecentEmojiStatuses`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getRecentEmojiStatuses`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.recent_emoji_statuses(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-clear_recent_emoji_statuses"></a>
#### 190. `ctx.clear_recent_emoji_statuses`

- **MTProto RPC:** `account.clearRecentEmojiStatuses`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.clearRecentEmojiStatuses`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.clearRecentEmojiStatuses`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_recent_emoji_statuses()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-reorder_profile_usernames"></a>
#### 191. `ctx.reorder_profile_usernames`

- **MTProto RPC:** `account.reorderUsernames`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.reorderUsernames`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.reorderUsernames`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_profile_usernames(*, order)
```

**Порядок positional slots:** `order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `order` | `Vector<string>` | да | — |

<a id="ctx-set_profile_username_active"></a>
#### 192. `ctx.set_profile_username_active`

- **MTProto RPC:** `account.toggleUsername`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.toggleUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.toggleUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_profile_username_active(*, username, active)
```

**Порядок positional slots:** `username, active`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `username` | `string` | да | — |
| `active` | `Bool` | да | — |

<a id="ctx-profile_photo_emojis"></a>
#### 193. `ctx.profile_photo_emojis`

- **MTProto RPC:** `account.getDefaultProfilePhotoEmojis`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getDefaultProfilePhotoEmojis`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getDefaultProfilePhotoEmojis`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.profile_photo_emojis(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_profile_color"></a>
#### 194. `ctx.set_profile_color`

- **MTProto RPC:** `account.updateColor`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateColor`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateColor`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_profile_color(*, for_profile=None, color=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `for_profile` | `flags.1?true` | нет | поле пропускается |
| `color` | `flags.2?PeerColor` | нет | поле пропускается |

<a id="ctx-set_birthday"></a>
#### 195. `ctx.set_birthday`

- **MTProto RPC:** `account.updateBirthday`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateBirthday`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateBirthday`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_birthday(*, birthday=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `birthday` | `flags.0?Birthday` | нет | поле пропускается |

<a id="ctx-set_personal_channel"></a>
#### 196. `ctx.set_personal_channel`

- **MTProto RPC:** `account.updatePersonalChannel`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updatePersonalChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updatePersonalChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_personal_channel(*, channel)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | да | — |

<a id="ctx-set_profile_tab"></a>
#### 197. `ctx.set_profile_tab`

- **MTProto RPC:** `account.setMainProfileTab`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.setMainProfileTab`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.setMainProfileTab`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_profile_tab(*, tab)
```

**Порядок positional slots:** `tab`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `tab` | `ProfileTab` | да | — |

<a id="ctx-set_music_saved"></a>
#### 198. `ctx.set_music_saved`

- **MTProto RPC:** `account.saveMusic`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.saveMusic`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.saveMusic`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_music_saved(*, unsave=None, id, after_id=None)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `unsave` | `flags.0?true` | нет | поле пропускается |
| `id` | `InputDocument` | да | — |
| `after_id` | `flags.1?InputDocument` | нет | поле пропускается |

<a id="ctx-saved_music_ids"></a>
#### 199. `ctx.saved_music_ids`

- **MTProto RPC:** `account.getSavedMusicIds`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getSavedMusicIds`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getSavedMusicIds`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_music_ids(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-user_details"></a>
#### 200. `ctx.user_details`

- **MTProto RPC:** `users.getFullUser`
- **Namespace:** `users`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `users.getFullUser`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `users.getFullUser`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.user_details(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |

<a id="ctx-contact_requirements"></a>
#### 201. `ctx.contact_requirements`

- **MTProto RPC:** `users.getRequirementsToContact`
- **Namespace:** `users`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `users.getRequirementsToContact`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `users.getRequirementsToContact`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contact_requirements(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<InputUser>` | да | — |

<a id="ctx-user_music"></a>
#### 202. `ctx.user_music`

- **MTProto RPC:** `users.getSavedMusic`
- **Namespace:** `users`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `users.getSavedMusic`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `users.getSavedMusic`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.user_music(*, id, offset=0, limit=50, hash=0)
```

**Порядок positional slots:** `id, offset, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | нет | `0` |

<a id="ctx-user_music_by_documents"></a>
#### 203. `ctx.user_music_by_documents`

- **MTProto RPC:** `users.getSavedMusicByID`
- **Namespace:** `users`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `users.getSavedMusicByID`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `users.getSavedMusicByID`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.user_music_by_documents(*, id, documents)
```

**Порядок positional slots:** `id, documents`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |
| `documents` | `Vector<InputDocument>` | да | — |

<a id="ctx-suggest_contact_birthday"></a>
#### 204. `ctx.suggest_contact_birthday`

- **MTProto RPC:** `users.suggestBirthday`
- **Namespace:** `users`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `users.suggestBirthday`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `users.suggestBirthday`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.suggest_contact_birthday(*, id, birthday)
```

**Порядок positional slots:** `id, birthday`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputUser` | да | — |
| `birthday` | `Birthday` | да | — |

<a id="ctx-select_profile_photo"></a>
#### 205. `ctx.select_profile_photo`

- **MTProto RPC:** `photos.updateProfilePhoto`
- **Namespace:** `photos`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `photos.updateProfilePhoto`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `photos.updateProfilePhoto`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.select_profile_photo(*, fallback=None, bot=None, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `fallback` | `flags.0?true` | нет | поле пропускается |
| `bot` | `flags.1?InputUser` | нет | поле пропускается |
| `id` | `InputPhoto` | да | — |

<a id="ctx-upload_profile_photo"></a>
#### 206. `ctx.upload_profile_photo`

- **MTProto RPC:** `photos.uploadProfilePhoto`
- **Namespace:** `photos`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `photos.uploadProfilePhoto`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `photos.uploadProfilePhoto`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.upload_profile_photo(*, fallback=None, bot=None, file=None, video=None, video_start_ts=None, video_emoji_markup=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `fallback` | `flags.3?true` | нет | поле пропускается |
| `bot` | `flags.5?InputUser` | нет | поле пропускается |
| `file` | `flags.0?InputFile` | нет | поле пропускается |
| `video` | `flags.1?InputFile` | нет | поле пропускается |
| `video_start_ts` | `flags.2?double` | нет | поле пропускается |
| `video_emoji_markup` | `flags.4?VideoSize` | нет | поле пропускается |

<a id="ctx-remove_profile_photos"></a>
#### 207. `ctx.remove_profile_photos`

- **MTProto RPC:** `photos.deletePhotos`
- **Namespace:** `photos`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `photos.deletePhotos`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `photos.deletePhotos`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_profile_photos(*, id)
```

**Порядок positional slots:** `id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `Vector<InputPhoto>` | да | — |

<a id="ctx-profile_photos"></a>
#### 208. `ctx.profile_photos`

- **MTProto RPC:** `photos.getUserPhotos`
- **Namespace:** `photos`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `photos.getUserPhotos`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `photos.getUserPhotos`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.profile_photos(*, user_id, offset=0, max_id=0, limit=50)
```

**Порядок positional slots:** `user_id, offset, max_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `user_id` | `InputUser` | да | — |
| `offset` | `int` | нет | `0` |
| `max_id` | `long` | нет | `0` |
| `limit` | `int` | нет | `50` |

<a id="ctx-set_contact_photo"></a>
#### 209. `ctx.set_contact_photo`

- **MTProto RPC:** `photos.uploadContactProfilePhoto`
- **Namespace:** `photos`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `photos.uploadContactProfilePhoto`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `photos.uploadContactProfilePhoto`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_contact_photo(*, suggest=None, save=None, user_id, file=None, video=None, video_start_ts=None, video_emoji_markup=None)
```

**Порядок positional slots:** `user_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `suggest` | `flags.3?true` | нет | поле пропускается |
| `save` | `flags.4?true` | нет | поле пропускается |
| `user_id` | `InputUser` | да | — |
| `file` | `flags.0?InputFile` | нет | поле пропускается |
| `video` | `flags.1?InputFile` | нет | поле пропускается |
| `video_start_ts` | `flags.2?double` | нет | поле пропускается |
| `video_emoji_markup` | `flags.5?VideoSize` | нет | поле пропускается |

<a id="ctx-notification_settings"></a>
#### 210. `ctx.notification_settings`

- **MTProto RPC:** `account.getNotifySettings`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getNotifySettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getNotifySettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.notification_settings(*, peer)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputNotifyPeer` | да | — |

<a id="ctx-set_notification_settings"></a>
#### 211. `ctx.set_notification_settings`

- **MTProto RPC:** `account.updateNotifySettings`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.updateNotifySettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.updateNotifySettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_notification_settings(*, peer, settings)
```

**Порядок positional slots:** `peer, settings`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputNotifyPeer` | да | — |
| `settings` | `InputPeerNotifySettings` | да | — |

<a id="ctx-reset_notification_settings"></a>
#### 212. `ctx.reset_notification_settings`

- **MTProto RPC:** `account.resetNotifySettings`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.resetNotifySettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.resetNotifySettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reset_notification_settings()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-contact_signup_notifications"></a>
#### 213. `ctx.contact_signup_notifications`

- **MTProto RPC:** `account.getContactSignUpNotification`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getContactSignUpNotification`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getContactSignUpNotification`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.contact_signup_notifications()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_contact_signup_notifications"></a>
#### 214. `ctx.set_contact_signup_notifications`

- **MTProto RPC:** `account.setContactSignUpNotification`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.setContactSignUpNotification`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.setContactSignUpNotification`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_contact_signup_notifications(*, silent)
```

**Порядок positional slots:** `silent`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `silent` | `Bool` | да | — |

<a id="ctx-notification_exceptions"></a>
#### 215. `ctx.notification_exceptions`

- **MTProto RPC:** `account.getNotifyExceptions`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getNotifyExceptions`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getNotifyExceptions`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.notification_exceptions(*, compare_sound=None, compare_stories=None, peer=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `compare_sound` | `flags.1?true` | нет | поле пропускается |
| `compare_stories` | `flags.2?true` | нет | поле пропускается |
| `peer` | `flags.0?InputNotifyPeer` | нет | поле пропускается |

<a id="ctx-reaction_notification_settings"></a>
#### 216. `ctx.reaction_notification_settings`

- **MTProto RPC:** `account.getReactionsNotifySettings`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getReactionsNotifySettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getReactionsNotifySettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reaction_notification_settings()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_reaction_notification_settings"></a>
#### 217. `ctx.set_reaction_notification_settings`

- **MTProto RPC:** `account.setReactionsNotifySettings`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.setReactionsNotifySettings`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.setReactionsNotifySettings`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_reaction_notification_settings(*, settings)
```

**Порядок positional slots:** `settings`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `settings` | `ReactionsNotifySettings` | да | — |

<a id="ctx-saved_notification_sounds"></a>
#### 218. `ctx.saved_notification_sounds`

- **MTProto RPC:** `account.getSavedRingtones`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.getSavedRingtones`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.getSavedRingtones`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.saved_notification_sounds(*, hash=0)
```

**Порядок positional slots:** `hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `hash` | `long` | нет | `0` |

<a id="ctx-set_notification_sound_saved"></a>
#### 219. `ctx.set_notification_sound_saved`

- **MTProto RPC:** `account.saveRingtone`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.saveRingtone`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.saveRingtone`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_notification_sound_saved(*, id, unsave)
```

**Порядок positional slots:** `id, unsave`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `id` | `InputDocument` | да | — |
| `unsave` | `Bool` | да | — |

<a id="ctx-upload_notification_sound"></a>
#### 220. `ctx.upload_notification_sound`

- **MTProto RPC:** `account.uploadRingtone`
- **Namespace:** `account`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `account.uploadRingtone`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `account.uploadRingtone`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.upload_notification_sound(*, file, file_name, mime_type)
```

**Порядок positional slots:** `file, file_name, mime_type`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `file` | `InputFile` | да | — |
| `file_name` | `string` | да | — |
| `mime_type` | `string` | да | — |

<a id="ctx-rename_basic_group"></a>
#### 221. `ctx.rename_basic_group`

- **MTProto RPC:** `messages.editChatTitle`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatTitle`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatTitle`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.rename_basic_group(*, chat_id, title)
```

**Порядок positional slots:** `chat_id, title`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |
| `title` | `string` | да | — |

<a id="ctx-set_basic_group_photo"></a>
#### 222. `ctx.set_basic_group_photo`

- **MTProto RPC:** `messages.editChatPhoto`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatPhoto`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatPhoto`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_basic_group_photo(*, chat_id, photo)
```

**Порядок positional slots:** `chat_id, photo`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |
| `photo` | `InputChatPhoto` | да | — |

<a id="ctx-add_basic_group_member"></a>
#### 223. `ctx.add_basic_group_member`

- **MTProto RPC:** `messages.addChatUser`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.addChatUser`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.addChatUser`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.add_basic_group_member(*, chat_id, user_id, fwd_limit=0)
```

**Порядок positional slots:** `chat_id, user_id, fwd_limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |
| `user_id` | `InputUser` | да | — |
| `fwd_limit` | `int` | нет | `0` |

<a id="ctx-remove_basic_group_member"></a>
#### 224. `ctx.remove_basic_group_member`

- **MTProto RPC:** `messages.deleteChatUser`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteChatUser`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteChatUser`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_basic_group_member(*, revoke_history=None, chat_id, user_id)
```

**Порядок positional slots:** `chat_id, user_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `revoke_history` | `flags.0?true` | нет | поле пропускается |
| `chat_id` | `long` | да | — |
| `user_id` | `InputUser` | да | — |

<a id="ctx-create_basic_group"></a>
#### 225. `ctx.create_basic_group`

- **MTProto RPC:** `messages.createChat`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.createChat`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.createChat`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_basic_group(*, users, title, ttl_period=None)
```

**Порядок positional slots:** `users, title`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `users` | `Vector<InputUser>` | да | — |
| `title` | `string` | да | — |
| `ttl_period` | `flags.0?int` | нет | поле пропускается |

<a id="ctx-set_basic_group_admin"></a>
#### 226. `ctx.set_basic_group_admin`

- **MTProto RPC:** `messages.editChatAdmin`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatAdmin`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatAdmin`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_basic_group_admin(*, chat_id, user_id, is_admin)
```

**Порядок positional slots:** `chat_id, user_id, is_admin`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |
| `user_id` | `InputUser` | да | — |
| `is_admin` | `Bool` | да | — |

<a id="ctx-upgrade_basic_group"></a>
#### 227. `ctx.upgrade_basic_group`

- **MTProto RPC:** `messages.migrateChat`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.migrateChat`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.migrateChat`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.upgrade_basic_group(*, chat_id)
```

**Порядок positional slots:** `chat_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |

<a id="ctx-edit_chat_description"></a>
#### 228. `ctx.edit_chat_description`

- **MTProto RPC:** `messages.editChatAbout`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatAbout`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatAbout`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_chat_description(*, peer=CURRENT_PEER, about)
```

**Порядок positional slots:** `peer, about`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `about` | `string` | да | — |

<a id="ctx-set_default_member_restrictions"></a>
#### 229. `ctx.set_default_member_restrictions`

- **MTProto RPC:** `messages.editChatDefaultBannedRights`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatDefaultBannedRights`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatDefaultBannedRights`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_default_member_restrictions(*, peer=CURRENT_PEER, banned_rights)
```

**Порядок positional slots:** `peer, banned_rights`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `banned_rights` | `ChatBannedRights` | да | — |

<a id="ctx-remove_basic_group"></a>
#### 230. `ctx.remove_basic_group`

- **MTProto RPC:** `messages.deleteChat`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteChat`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteChat`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_basic_group(*, chat_id)
```

**Порядок positional slots:** `chat_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `chat_id` | `long` | да | — |

<a id="ctx-set_chat_auto_delete"></a>
#### 231. `ctx.set_chat_auto_delete`

- **MTProto RPC:** `messages.setHistoryTTL`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.setHistoryTTL`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.setHistoryTTL`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_chat_auto_delete(*, peer=CURRENT_PEER, period)
```

**Порядок positional slots:** `peer, period`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `period` | `int` | да | — |

<a id="ctx-set_content_protection"></a>
#### 232. `ctx.set_content_protection`

- **MTProto RPC:** `messages.toggleNoForwards`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.toggleNoForwards`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.toggleNoForwards`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_content_protection(*, peer=CURRENT_PEER, enabled, request_msg_id=None)
```

**Порядок positional slots:** `peer, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |
| `request_msg_id` | `flags.0?int` | нет | поле пропускается |

<a id="ctx-mark_channel_read"></a>
#### 233. `ctx.mark_channel_read`

- **MTProto RPC:** `channels.readHistory`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.readHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.readHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_channel_read(*, channel=CURRENT_PEER, max_id)
```

**Порядок positional slots:** `channel, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `max_id` | `int` | да | — |

<a id="ctx-channel_members"></a>
#### 234. `ctx.channel_members`

- **MTProto RPC:** `channels.getParticipants`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getParticipants`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getParticipants`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_members(*, channel=CURRENT_PEER, filter={'_': 'channelParticipantsRecent'}, offset=0, limit=50, hash)
```

**Порядок positional slots:** `channel, filter, offset, limit, hash`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `filter` | `ChannelParticipantsFilter` | нет | `{'_': 'channelParticipantsRecent'}` |
| `offset` | `int` | нет | `0` |
| `limit` | `int` | нет | `50` |
| `hash` | `long` | да | — |

<a id="ctx-channel_member"></a>
#### 235. `ctx.channel_member`

- **MTProto RPC:** `channels.getParticipant`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getParticipant`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getParticipant`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_member(*, channel=CURRENT_PEER, participant)
```

**Порядок positional slots:** `channel, participant`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `participant` | `InputPeer` | да | — |

<a id="ctx-channel_details"></a>
#### 236. `ctx.channel_details`

- **MTProto RPC:** `channels.getFullChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getFullChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getFullChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_details(*, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-create_channel"></a>
#### 237. `ctx.create_channel`

- **MTProto RPC:** `channels.createChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.createChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.createChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_channel(*, broadcast=None, megagroup=None, for_import=None, forum=None, title, about, geo_point=None, address=None, ttl_period=None)
```

**Порядок positional slots:** `title, about`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `broadcast` | `flags.0?true` | нет | поле пропускается |
| `megagroup` | `flags.1?true` | нет | поле пропускается |
| `for_import` | `flags.3?true` | нет | поле пропускается |
| `forum` | `flags.5?true` | нет | поле пропускается |
| `title` | `string` | да | — |
| `about` | `string` | да | — |
| `geo_point` | `flags.2?InputGeoPoint` | нет | поле пропускается |
| `address` | `flags.2?string` | нет | поле пропускается |
| `ttl_period` | `flags.4?int` | нет | поле пропускается |

<a id="ctx-set_channel_admin"></a>
#### 238. `ctx.set_channel_admin`

- **MTProto RPC:** `channels.editAdmin`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.editAdmin`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.editAdmin`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_admin(*, channel=CURRENT_PEER, user_id, admin_rights, rank=None)
```

**Порядок positional slots:** `channel, user_id, admin_rights`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `user_id` | `InputUser` | да | — |
| `admin_rights` | `ChatAdminRights` | да | — |
| `rank` | `flags.0?string` | нет | поле пропускается |

<a id="ctx-rename_channel"></a>
#### 239. `ctx.rename_channel`

- **MTProto RPC:** `channels.editTitle`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.editTitle`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.editTitle`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.rename_channel(*, channel=CURRENT_PEER, title)
```

**Порядок positional slots:** `channel, title`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `title` | `string` | да | — |

<a id="ctx-set_channel_photo"></a>
#### 240. `ctx.set_channel_photo`

- **MTProto RPC:** `channels.editPhoto`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.editPhoto`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.editPhoto`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_photo(*, channel=CURRENT_PEER, photo)
```

**Порядок positional slots:** `channel, photo`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `photo` | `InputChatPhoto` | да | — |

<a id="ctx-check_channel_username"></a>
#### 241. `ctx.check_channel_username`

- **MTProto RPC:** `channels.checkUsername`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.checkUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.checkUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.check_channel_username(*, channel=CURRENT_PEER, username)
```

**Порядок positional slots:** `channel, username`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `username` | `string` | да | — |

<a id="ctx-set_channel_username"></a>
#### 242. `ctx.set_channel_username`

- **MTProto RPC:** `channels.updateUsername`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.updateUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.updateUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_username(*, channel=CURRENT_PEER, username)
```

**Порядок positional slots:** `channel, username`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `username` | `string` | да | — |

<a id="ctx-join_channel"></a>
#### 243. `ctx.join_channel`

- **MTProto RPC:** `channels.joinChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.joinChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.joinChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.join_channel(*, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-leave_channel"></a>
#### 244. `ctx.leave_channel`

- **MTProto RPC:** `channels.leaveChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.leaveChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.leaveChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.leave_channel(*, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-invite_channel_members"></a>
#### 245. `ctx.invite_channel_members`

- **MTProto RPC:** `channels.inviteToChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.inviteToChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.inviteToChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.invite_channel_members(*, channel=CURRENT_PEER, users)
```

**Порядок positional slots:** `channel, users`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `users` | `Vector<InputUser>` | да | — |

<a id="ctx-remove_channel"></a>
#### 246. `ctx.remove_channel`

- **MTProto RPC:** `channels.deleteChannel`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.deleteChannel`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.deleteChannel`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_channel(*, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-set_channel_signatures"></a>
#### 247. `ctx.set_channel_signatures`

- **MTProto RPC:** `channels.toggleSignatures`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleSignatures`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleSignatures`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_signatures(*, signatures_enabled=None, profiles_enabled=None, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `signatures_enabled` | `flags.0?true` | нет | поле пропускается |
| `profiles_enabled` | `flags.1?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-owned_public_channels"></a>
#### 248. `ctx.owned_public_channels`

- **MTProto RPC:** `channels.getAdminedPublicChannels`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getAdminedPublicChannels`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getAdminedPublicChannels`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.owned_public_channels(*, by_location=None, check_limit=None, for_personal=None, for_community_peer=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `by_location` | `flags.0?true` | нет | поле пропускается |
| `check_limit` | `flags.1?true` | нет | поле пропускается |
| `for_personal` | `flags.2?true` | нет | поле пропускается |
| `for_community_peer` | `flags.3?true` | нет | поле пропускается |

<a id="ctx-restrict_channel_member"></a>
#### 249. `ctx.restrict_channel_member`

- **MTProto RPC:** `channels.editBanned`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.editBanned`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.editBanned`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.restrict_channel_member(*, channel=CURRENT_PEER, participant, banned_rights)
```

**Порядок positional slots:** `channel, participant, banned_rights`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `participant` | `InputPeer` | да | — |
| `banned_rights` | `ChatBannedRights` | да | — |

<a id="ctx-channel_admin_log"></a>
#### 250. `ctx.channel_admin_log`

- **MTProto RPC:** `channels.getAdminLog`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getAdminLog`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getAdminLog`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_admin_log(*, channel=CURRENT_PEER, q='', events_filter=None, admins=None, max_id, min_id, limit=50)
```

**Порядок positional slots:** `channel, q, max_id, min_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `q` | `string` | нет | `''` |
| `events_filter` | `flags.0?ChannelAdminLogEventsFilter` | нет | поле пропускается |
| `admins` | `flags.1?Vector<InputUser>` | нет | поле пропускается |
| `max_id` | `long` | да | — |
| `min_id` | `long` | да | — |
| `limit` | `int` | нет | `50` |

<a id="ctx-set_group_sticker_set"></a>
#### 251. `ctx.set_group_sticker_set`

- **MTProto RPC:** `channels.setStickers`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.setStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.setStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_group_sticker_set(*, channel=CURRENT_PEER, stickerset)
```

**Порядок positional slots:** `channel, stickerset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `stickerset` | `InputStickerSet` | да | — |

<a id="ctx-mark_channel_media_read"></a>
#### 252. `ctx.mark_channel_media_read`

- **MTProto RPC:** `channels.readMessageContents`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.readMessageContents`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.readMessageContents`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.mark_channel_media_read(*, channel=CURRENT_PEER, id)
```

**Порядок positional slots:** `channel, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `id` | `Vector<int>` | да | — |

<a id="ctx-clear_channel_history"></a>
#### 253. `ctx.clear_channel_history`

- **MTProto RPC:** `channels.deleteHistory`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.deleteHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.deleteHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.clear_channel_history(*, for_everyone=None, channel=CURRENT_PEER, max_id)
```

**Порядок positional slots:** `channel, max_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `for_everyone` | `flags.0?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `max_id` | `int` | да | — |

<a id="ctx-set_prehistory_hidden"></a>
#### 254. `ctx.set_prehistory_hidden`

- **MTProto RPC:** `channels.togglePreHistoryHidden`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.togglePreHistoryHidden`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.togglePreHistoryHidden`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_prehistory_hidden(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-left_channels"></a>
#### 255. `ctx.left_channels`

- **MTProto RPC:** `channels.getLeftChannels`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getLeftChannels`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getLeftChannels`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.left_channels(*, offset=0)
```

**Порядок positional slots:** `offset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `offset` | `int` | нет | `0` |

<a id="ctx-eligible_discussion_groups"></a>
#### 256. `ctx.eligible_discussion_groups`

- **MTProto RPC:** `channels.getGroupsForDiscussion`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getGroupsForDiscussion`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getGroupsForDiscussion`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.eligible_discussion_groups()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-set_discussion_group"></a>
#### 257. `ctx.set_discussion_group`

- **MTProto RPC:** `channels.setDiscussionGroup`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.setDiscussionGroup`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.setDiscussionGroup`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_discussion_group(*, broadcast, group)
```

**Порядок positional slots:** `broadcast, group`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `broadcast` | `InputChannel` | да | — |
| `group` | `InputChannel` | да | — |

<a id="ctx-set_group_location"></a>
#### 258. `ctx.set_group_location`

- **MTProto RPC:** `channels.editLocation`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.editLocation`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.editLocation`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_group_location(*, channel=CURRENT_PEER, geo_point, address)
```

**Порядок positional slots:** `channel, geo_point, address`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `geo_point` | `InputGeoPoint` | да | — |
| `address` | `string` | да | — |

<a id="ctx-set_slow_mode"></a>
#### 259. `ctx.set_slow_mode`

- **MTProto RPC:** `channels.toggleSlowMode`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleSlowMode`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleSlowMode`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_slow_mode(*, channel=CURRENT_PEER, seconds)
```

**Порядок positional slots:** `channel, seconds`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `seconds` | `int` | да | — |

<a id="ctx-inactive_channels"></a>
#### 260. `ctx.inactive_channels`

- **MTProto RPC:** `channels.getInactiveChannels`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getInactiveChannels`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getInactiveChannels`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.inactive_channels()
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| — | — | — | Аргументов нет |

<a id="ctx-send_as_identities"></a>
#### 261. `ctx.send_as_identities`

- **MTProto RPC:** `channels.getSendAs`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getSendAs`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getSendAs`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.send_as_identities(*, for_paid_reactions=None, for_live_stories=None, peer=CURRENT_PEER)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `for_paid_reactions` | `flags.0?true` | нет | поле пропускается |
| `for_live_stories` | `flags.1?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |

<a id="ctx-remove_member_history"></a>
#### 262. `ctx.remove_member_history`

- **MTProto RPC:** `channels.deleteParticipantHistory`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.deleteParticipantHistory`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.deleteParticipantHistory`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_member_history(*, channel=CURRENT_PEER, participant)
```

**Порядок positional slots:** `channel, participant`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `participant` | `InputPeer` | да | — |

<a id="ctx-set_join_to_send"></a>
#### 263. `ctx.set_join_to_send`

- **MTProto RPC:** `channels.toggleJoinToSend`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleJoinToSend`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleJoinToSend`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_join_to_send(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-set_join_requests"></a>
#### 264. `ctx.set_join_requests`

- **MTProto RPC:** `channels.toggleJoinRequest`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleJoinRequest`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleJoinRequest`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_join_requests(*, apply_to_invites=None, channel=CURRENT_PEER, enabled, guard_bot=None)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `apply_to_invites` | `flags.1?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |
| `guard_bot` | `flags.0?InputUser` | нет | поле пропускается |

<a id="ctx-reorder_channel_usernames"></a>
#### 265. `ctx.reorder_channel_usernames`

- **MTProto RPC:** `channels.reorderUsernames`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.reorderUsernames`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.reorderUsernames`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.reorder_channel_usernames(*, channel=CURRENT_PEER, order)
```

**Порядок positional slots:** `channel, order`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `order` | `Vector<string>` | да | — |

<a id="ctx-set_channel_username_active"></a>
#### 266. `ctx.set_channel_username_active`

- **MTProto RPC:** `channels.toggleUsername`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleUsername`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleUsername`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_username_active(*, channel=CURRENT_PEER, username, active)
```

**Порядок positional slots:** `channel, username, active`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `username` | `string` | да | — |
| `active` | `Bool` | да | — |

<a id="ctx-deactivate_channel_usernames"></a>
#### 267. `ctx.deactivate_channel_usernames`

- **MTProto RPC:** `channels.deactivateAllUsernames`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.deactivateAllUsernames`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.deactivateAllUsernames`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.deactivate_channel_usernames(*, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-set_antispam"></a>
#### 268. `ctx.set_antispam`

- **MTProto RPC:** `channels.toggleAntiSpam`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleAntiSpam`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleAntiSpam`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_antispam(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-set_members_hidden"></a>
#### 269. `ctx.set_members_hidden`

- **MTProto RPC:** `channels.toggleParticipantsHidden`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleParticipantsHidden`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleParticipantsHidden`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_members_hidden(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-set_channel_color"></a>
#### 270. `ctx.set_channel_color`

- **MTProto RPC:** `channels.updateColor`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.updateColor`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.updateColor`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_color(*, for_profile=None, channel=CURRENT_PEER, color=None, background_emoji_id=None)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `for_profile` | `flags.1?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `color` | `flags.2?int` | нет | поле пропускается |
| `background_emoji_id` | `flags.0?long` | нет | поле пропускается |

<a id="ctx-related_channels"></a>
#### 271. `ctx.related_channels`

- **MTProto RPC:** `channels.getChannelRecommendations`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.getChannelRecommendations`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.getChannelRecommendations`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.related_channels(*, channel=None)
```

**Порядок positional slots:** нет, только keyword-поля при наличии.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `flags.0?InputChannel` | нет | поле пропускается |

<a id="ctx-set_channel_emoji_status"></a>
#### 272. `ctx.set_channel_emoji_status`

- **MTProto RPC:** `channels.updateEmojiStatus`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.updateEmojiStatus`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.updateEmojiStatus`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_emoji_status(*, channel=CURRENT_PEER, emoji_status)
```

**Порядок positional slots:** `channel, emoji_status`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `emoji_status` | `EmojiStatus` | да | — |

<a id="ctx-set_group_emoji_set"></a>
#### 273. `ctx.set_group_emoji_set`

- **MTProto RPC:** `channels.setEmojiStickers`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.setEmojiStickers`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.setEmojiStickers`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_group_emoji_set(*, channel=CURRENT_PEER, stickerset)
```

**Порядок positional slots:** `channel, stickerset`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `stickerset` | `InputStickerSet` | да | — |

<a id="ctx-set_channel_auto_translation"></a>
#### 274. `ctx.set_channel_auto_translation`

- **MTProto RPC:** `channels.toggleAutotranslation`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.toggleAutotranslation`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.toggleAutotranslation`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_auto_translation(*, channel=CURRENT_PEER, enabled)
```

**Порядок positional slots:** `channel, enabled`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `enabled` | `Bool` | да | — |

<a id="ctx-set_channel_profile_tab"></a>
#### 275. `ctx.set_channel_profile_tab`

- **MTProto RPC:** `channels.setMainProfileTab`
- **Namespace:** `channels`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `channels.setMainProfileTab`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `channels.setMainProfileTab`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.set_channel_profile_tab(*, channel=CURRENT_PEER, tab)
```

**Порядок positional slots:** `channel, tab`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `tab` | `ProfileTab` | да | — |

<a id="ctx-edit_member_rank"></a>
#### 276. `ctx.edit_member_rank`

- **MTProto RPC:** `messages.editChatParticipantRank`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editChatParticipantRank`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editChatParticipantRank`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_member_rank(*, peer=CURRENT_PEER, participant, rank)
```

**Порядок positional slots:** `peer, participant, rank`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `participant` | `InputPeer` | да | — |
| `rank` | `string` | да | — |

<a id="ctx-create_chat_invite"></a>
#### 277. `ctx.create_chat_invite`

- **MTProto RPC:** `messages.exportChatInvite`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.exportChatInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.exportChatInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.create_chat_invite(*, legacy_revoke_permanent=None, request_needed=None, peer=CURRENT_PEER, expire_date=None, usage_limit=None, title=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `legacy_revoke_permanent` | `flags.2?true` | нет | поле пропускается |
| `request_needed` | `flags.3?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `expire_date` | `flags.0?int` | нет | поле пропускается |
| `usage_limit` | `flags.1?int` | нет | поле пропускается |
| `title` | `flags.4?string` | нет | поле пропускается |
| `subscription_pricing` | `flags.5?StarsSubscriptionPricing` | нельзя передавать | запрещён helper-политикой |

<a id="ctx-chat_invites"></a>
#### 278. `ctx.chat_invites`

- **MTProto RPC:** `messages.getExportedChatInvites`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getExportedChatInvites`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getExportedChatInvites`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.chat_invites(*, revoked=None, peer=CURRENT_PEER, admin_id, offset_date=None, offset_link=None, limit=50)
```

**Порядок positional slots:** `peer, admin_id, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `revoked` | `flags.3?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `admin_id` | `InputUser` | да | — |
| `offset_date` | `flags.2?int` | нет | поле пропускается |
| `offset_link` | `flags.2?string` | нет | поле пропускается |
| `limit` | `int` | нет | `50` |

<a id="ctx-chat_invite_details"></a>
#### 279. `ctx.chat_invite_details`

- **MTProto RPC:** `messages.getExportedChatInvite`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getExportedChatInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getExportedChatInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.chat_invite_details(*, peer=CURRENT_PEER, link)
```

**Порядок positional slots:** `peer, link`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `link` | `string` | да | — |

<a id="ctx-edit_chat_invite"></a>
#### 280. `ctx.edit_chat_invite`

- **MTProto RPC:** `messages.editExportedChatInvite`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.editExportedChatInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.editExportedChatInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.edit_chat_invite(*, revoked=None, peer=CURRENT_PEER, link, expire_date=None, usage_limit=None, request_needed=None, title=None)
```

**Порядок positional slots:** `peer, link`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `revoked` | `flags.2?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `link` | `string` | да | — |
| `expire_date` | `flags.0?int` | нет | поле пропускается |
| `usage_limit` | `flags.1?int` | нет | поле пропускается |
| `request_needed` | `flags.3?Bool` | нет | поле пропускается |
| `title` | `flags.4?string` | нет | поле пропускается |

<a id="ctx-purge_revoked_chat_invites"></a>
#### 281. `ctx.purge_revoked_chat_invites`

- **MTProto RPC:** `messages.deleteRevokedExportedChatInvites`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteRevokedExportedChatInvites`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteRevokedExportedChatInvites`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.purge_revoked_chat_invites(*, peer=CURRENT_PEER, admin_id)
```

**Порядок positional slots:** `peer, admin_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `admin_id` | `InputUser` | да | — |

<a id="ctx-remove_chat_invite"></a>
#### 282. `ctx.remove_chat_invite`

- **MTProto RPC:** `messages.deleteExportedChatInvite`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.deleteExportedChatInvite`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.deleteExportedChatInvite`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.remove_chat_invite(*, peer=CURRENT_PEER, link)
```

**Порядок positional slots:** `peer, link`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `link` | `string` | да | — |

<a id="ctx-invite_admins"></a>
#### 283. `ctx.invite_admins`

- **MTProto RPC:** `messages.getAdminsWithInvites`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getAdminsWithInvites`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getAdminsWithInvites`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.invite_admins(*, peer=CURRENT_PEER)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |

<a id="ctx-invite_joiners"></a>
#### 284. `ctx.invite_joiners`

- **MTProto RPC:** `messages.getChatInviteImporters`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.getChatInviteImporters`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.getChatInviteImporters`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.invite_joiners(*, requested=None, subscription_expired=None, peer=CURRENT_PEER, link=None, q=None, offset_date=0, offset_user={'_': 'inputUserEmpty'}, limit=50)
```

**Порядок positional slots:** `peer, offset_date, offset_user, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `requested` | `flags.0?true` | нет | поле пропускается |
| `subscription_expired` | `flags.3?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `link` | `flags.1?string` | нет | поле пропускается |
| `q` | `flags.2?string` | нет | поле пропускается |
| `offset_date` | `int` | нет | `0` |
| `offset_user` | `InputUser` | нет | `{'_': 'inputUserEmpty'}` |
| `limit` | `int` | нет | `50` |

<a id="ctx-resolve_join_request"></a>
#### 285. `ctx.resolve_join_request`

- **MTProto RPC:** `messages.hideChatJoinRequest`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.hideChatJoinRequest`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.hideChatJoinRequest`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.resolve_join_request(*, approved=None, peer=CURRENT_PEER, user_id)
```

**Порядок positional slots:** `peer, user_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `approved` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `user_id` | `InputUser` | да | — |

<a id="ctx-resolve_all_join_requests"></a>
#### 286. `ctx.resolve_all_join_requests`

- **MTProto RPC:** `messages.hideAllChatJoinRequests`
- **Namespace:** `messages`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `messages.hideAllChatJoinRequests`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `messages.hideAllChatJoinRequests`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.resolve_all_join_requests(*, approved=None, peer=CURRENT_PEER, link=None)
```

**Порядок positional slots:** `peer`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `approved` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `link` | `flags.1?string` | нет | поле пропускается |

<a id="ctx-channel_statistics"></a>
#### 287. `ctx.channel_statistics`

- **MTProto RPC:** `stats.getBroadcastStats`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getBroadcastStats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getBroadcastStats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.channel_statistics(*, dark=None, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `dark` | `flags.0?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-supergroup_statistics"></a>
#### 288. `ctx.supergroup_statistics`

- **MTProto RPC:** `stats.getMegagroupStats`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getMegagroupStats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getMegagroupStats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.supergroup_statistics(*, dark=None, channel=CURRENT_PEER)
```

**Порядок positional slots:** `channel`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `dark` | `flags.0?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |

<a id="ctx-message_statistics"></a>
#### 289. `ctx.message_statistics`

- **MTProto RPC:** `stats.getMessageStats`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getMessageStats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getMessageStats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_statistics(*, dark=None, channel=CURRENT_PEER, msg_id)
```

**Порядок positional slots:** `channel, msg_id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `dark` | `flags.0?true` | нет | поле пропускается |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | да | — |

<a id="ctx-message_public_forwards"></a>
#### 290. `ctx.message_public_forwards`

- **MTProto RPC:** `stats.getMessagePublicForwards`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getMessagePublicForwards`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getMessagePublicForwards`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.message_public_forwards(*, channel=CURRENT_PEER, msg_id, offset='', limit=50)
```

**Порядок positional slots:** `channel, msg_id, offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `channel` | `InputChannel` | нет | `CURRENT_PEER` |
| `msg_id` | `int` | да | — |
| `offset` | `string` | нет | `''` |
| `limit` | `int` | нет | `50` |

<a id="ctx-story_statistics"></a>
#### 291. `ctx.story_statistics`

- **MTProto RPC:** `stats.getStoryStats`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getStoryStats`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getStoryStats`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_statistics(*, dark=None, peer=CURRENT_PEER, id=CURRENT_MESSAGE)
```

**Порядок positional slots:** `peer, id`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `dark` | `flags.0?true` | нет | поле пропускается |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `int` | нет | `CURRENT_MESSAGE` |

<a id="ctx-story_public_forwards"></a>
#### 292. `ctx.story_public_forwards`

- **MTProto RPC:** `stats.getStoryPublicForwards`
- **Namespace:** `stats`
- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.
- **Описание (RU):** Вызывает `stats.getStoryPublicForwards`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.
- **Description (EN):** Calls `stats.getStoryPublicForwards`, converts contextual parameters and returns the host-processed RPC response body.
- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.

**Справочная сигнатура (keywords):**

```text
ctx.story_public_forwards(*, peer=CURRENT_PEER, id=CURRENT_MESSAGE, offset='', limit=50)
```

**Порядок positional slots:** `peer, id, offset, limit`.

| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |
| --- | --- | --- | --- |
| `peer` | `InputPeer` | нет | `CURRENT_PEER` |
| `id` | `int` | нет | `CURRENT_MESSAGE` |
| `offset` | `string` | нет | `''` |
| `limit` | `int` | нет | `50` |

<a id="api-inspector"></a>
## Приложение D. Самостоятельный проверочный скрипт

Код ниже полностью включён в этот SKILL.md. **Для работы скилла сохранять скрипт
не требуется.** Только для сверки API по конкретным исходникам можно скопировать
этот блок во временный `inspect_api.py` и запустить:

```text
python inspect_api.py <Hotaru> --section catalog
python inspect_api.py <Hotaru> --section tools
python inspect_api.py <Hotaru> --section helpers
python inspect_api.py <Hotaru> --section catalog --format markdown --output catalog.md
```

Это не установка и не запуск Hotaru: скрипт читает AST четырёх исходных файлов,
вычисляет SHA-256 и печатает JSON либо Markdown. Без `--output` файлы не записывает.
Он не импортирует ядро, не ставит пакеты, не подключается к Telegram и не выполняет
код проверяемых модулей. Запускай Python без `-O`, если используешь проверки assert
из других примеров документа. Сгенерированные карточки — документация, а не доказательство
успешного live RPC. Не сохраняй secrets в аргументах или выходном файле.

```python
from __future__ import annotations

"""Render source-derived Hotaru inventory as Markdown method cards."""


from typing import Any


def cell(value: str) -> str:
    return value.replace("|", "&#124;").replace("\n", " ")


def default_repr(value: Any) -> str:
    placeholders = {"$peer": "CURRENT_PEER", "$message": "CURRENT_MESSAGE", "$random": "RANDOM_ID"}
    return placeholders.get(value, repr(value)) if isinstance(value, str) else repr(value)


def call_signature(record: dict[str, Any]) -> str:
    parameters = []
    for name in record["field_types"]:
        if name in record["forbidden"]:
            continue
        if name in record["defaults"]:
            parameters.append(name + "=" + default_repr(record["defaults"][name]))
        elif name not in record["positional_order"]:
            parameters.append(name + "=None")
        else:
            parameters.append(name)
    return (
        "ctx." + record["name"] + "(" + ("*, " if parameters else "") + ", ".join(parameters) + ")"
    )


def render_catalog(inventory: dict[str, Any]) -> str:
    records = inventory["catalog"]
    lines = [
        "# Hotaru: полные карточки контекстных методов",
        "",
        f"{len(records)} карточки, сформированные из AST исходников Hotaru; без импорта ядра и Telegram RPC.",
        "Базовый снимок скилла: `8cab560e2b9dbc009aab4670c8a78a9a790e2d1a`, 2026-11-09.",
        "При регенерации по другой версии актуальность определяют SHA-256 ниже, а не эта отметка.",
        "",
        "## Как читать карточки",
        "",
        "- Это справочные сигнатуры в стиле Python, не исполняемые вызовы: `*` означает",
        "  рекомендуемые keyword-аргументы; реальные positional slots указаны отдельно.",
        "- Все операции асинхронные: в handler используй `await ctx.<name>(...)`.",
        "- `CURRENT_PEER`, `CURRENT_MESSAGE`, `RANDOM_ID` обозначают defaults ядра,",
        "  а не имена, которые нужно объявлять в модуле. Обычно соответствующий keyword пропускают.",
        "- TL `flags.N?T` — optional поле; `Vector<T>` — последовательность; типы сохраняют",
        "  запись исходной TL-схемы и не являются готовыми Python-аннотациями.",
        "- «Обязательный» означает: вызывающий обязан передать значение, поскольку ядро",
        "  не подставляет default. Наличие обязательного TL-поля не исключает default ядра.",
        "- Optional `None` в справочной сигнатуре означает пропуск поля, не обязательную",
        "  отправку None в Telegram. Keyword со статусом «запрещён» передавать нельзя.",
        "- **Результат: `Any`, зависит от RPC.** CTX_CATALOG не хранит тип результата,",
        "  а host распаковывает/фильтрует response. Непроверенные returns сайта не копируются.",
        "  Для конкретного результата сверяй TL result schema используемого GoyGram и host adapter.",
        "- «Без raw mt» не отменяет ACL Telegram, denylist, Premium, media/assets, net,",
        "  state и другие ограничения всей операции. Подробности: [контракт текущего SKILL.md](#context-contract).",
        "",
        "## Контроль источников",
        "",
        "| Файл | SHA-256 содержимого |",
        "| --- | --- |",
    ]
    for path, digest in inventory["source_sha256"].items():
        lines.append(f"| `{path}` | `{digest}` |")
    lines += ["", "## Навигация по namespace", ""]
    namespaces = dict.fromkeys(record["rpc"].split(".", 1)[0] for record in records)
    for namespace in namespaces:
        subset = [record for record in records if record["rpc"].startswith(namespace + ".")]
        links = ", ".join(f"[{record['name']}](#ctx-{record['name']})" for record in subset)
        lines.append(f"- **{namespace} ({len(subset)}):** {links}")
    lines += ["", "## Карточки методов", ""]
    for number, record in enumerate(records, 1):
        name = record["name"]
        rpc = record["rpc"]
        namespace = rpc.split(".", 1)[0]
        lines += [
            f'<a id="ctx-{name}"></a>',
            f"### {number}. `ctx.{name}`",
            "",
            f"- **MTProto RPC:** `{rpc}`",
            f"- **Namespace:** `{namespace}`",
            "- **Результат:** `Any` — форма зависит от RPC и распаковки host; точный тип не подтверждён этим каталогом.",
            "- **Описание (RU):** Вызывает `" + rpc + "`, преобразует контекстные параметры и возвращает обработанное ядром тело ответа.",
            "- **Description (EN):** Calls `" + rpc + "`, converts contextual parameters and returns the host-processed RPC response body.",
        ]
        if record["policy_blocked"]:
            lines.append("- **Политика:** **BLOCKED** в проверенном CapabilityHost. Присутствует в каталоге, но не разрешён; raw `mt` запрет не снимает.")
        else:
            lines.append("- **Capabilities:** контекстный маршрут не требует raw `mt`; дополнительные права/ограничения см. выше.")
        positional = ", ".join(record["positional_order"])
        lines += [
            "",
            "**Справочная сигнатура (keywords):**",
            "",
            "```text",
            call_signature(record),
            "```",
            "",
            "**Порядок positional slots:** " + (f"`{positional}`." if positional else "нет, только keyword-поля при наличии."),
            "",
            "| Параметр | TL-тип | Обязательный для вызова | Default ядра / статус |",
            "| --- | --- | --- | --- |",
        ]
        for parameter, kind in record["field_types"].items():
            if parameter in record["forbidden"]:
                required, default = "нельзя передавать", "запрещён helper-политикой"
            elif parameter in record["defaults"]:
                required, default = "нет", "`" + default_repr(record["defaults"][parameter]) + "`"
            elif parameter in record["positional_order"]:
                required, default = "да", "—"
            else:
                required, default = "нет", "поле пропускается"
            lines.append(f"| `{parameter}` | `{cell(kind)}` | {required} | {cell(default)} |")
        if not record["field_types"]:
            lines.append("| — | — | — | Аргументов нет |")
        lines.append("")
    return "\n".join(lines).rstrip()

"""Read-only inventory of Hotaru API from source AST; never imports Hotaru."""


import argparse
import ast
import copy
import hashlib
import json
import sys
from pathlib import Path


def source_tree(root: Path, relative: str) -> tuple[str, ast.Module]:
    source = (root / relative).read_text(encoding="utf-8")
    return source, ast.parse(source, filename=relative)


def assignment(tree: ast.Module, name: str) -> ast.expr:
    for node in tree.body:
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            if node.target.id == name and node.value is not None:
                return node.value
        if isinstance(node, ast.Assign):
            if any(isinstance(target, ast.Name) and target.id == name for target in node.targets):
                return node.value
    raise ValueError(f"No top-level assignment for {name}")


def signature(node: ast.FunctionDef | ast.AsyncFunctionDef, drop_self: bool = False) -> str:
    args = copy.deepcopy(node.args)
    if drop_self:
        positional = args.posonlyargs if args.posonlyargs else args.args
        if not positional or positional[0].arg != "self":
            raise ValueError("Expected self as the first method argument")
        positional.pop(0)
    result = f"{node.name}({ast.unparse(args)})"
    if node.returns is not None:
        result += " -> " + ast.unparse(node.returns)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("--section", choices=("catalog", "tools", "helpers", "all"), default="all")
    parser.add_argument("--format", choices=("json", "markdown"), default="json")
    parser.add_argument("--output", type=Path, help="Explicit destination for a generated reference")
    options = parser.parse_args()
    if options.format == "markdown" and options.section != "catalog":
        parser.error("Markdown cards require --section catalog")
    root = options.root.resolve()
    paths = ("relay/context.py", "relay/toolkit.py", "relay/sandbox.py", "relay/caps.py")
    sources = {path: source_tree(root, path) for path in paths}
    output: dict[str, object] = {
        "source_sha256": {
            path: hashlib.sha256(source.encode("utf-8")).hexdigest()
            for path, (source, _) in sources.items()
        }
    }
    if options.section in ("catalog", "all"):
        catalog = ast.literal_eval(assignment(sources["relay/context.py"][1], "CTX_CATALOG"))
        caps = sources["relay/caps.py"][1]
        blocked = set(ast.literal_eval(assignment(caps, "MT_BLOCKED").args[0]))
        prefixes = ("auth.", "phone.", *ast.literal_eval(assignment(caps, "MT_BLOCKED_PREFIXES")))
        output["catalog_count"] = len(catalog)
        output["catalog"] = [
            {
                "name": name,
                "rpc": rpc,
                "positional_order": required,
                "field_types": fields,
                "defaults": defaults,
                "forbidden": forbidden,
                "policy_blocked": rpc.lower() in blocked or rpc.lower().startswith(prefixes),
            }
            for name, (rpc, required, fields, defaults, forbidden) in catalog.items()
        ]
    if options.section in ("tools", "all"):
        tree = sources["relay/toolkit.py"][1]
        functions = {node.name: node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))}
        exports = assignment(tree, "TOOLKIT_FUNCS")
        if not isinstance(exports, ast.Dict):
            raise ValueError("TOOLKIT_FUNCS is not a literal dictionary")
        records = []
        for key, value in zip(exports.keys, exports.values):
            if not isinstance(value, ast.Name):
                raise ValueError("Non-name TOOLKIT_FUNCS entry; inspect manually")
            function = functions[value.id]
            records.append({"name": ast.literal_eval(key), "signature": signature(function), "async": isinstance(function, ast.AsyncFunctionDef), "line": function.lineno})
        output["tools_count"] = len(records)
        output["tools"] = records
    if options.section in ("helpers", "all"):
        worker = ast.parse(ast.literal_eval(assignment(sources["relay/sandbox.py"][1], "WORKER_SOURCE")))
        records = []
        for label, tree in (("shared", sources["relay/context.py"][1]), ("worker", worker)):
            for node in tree.body:
                if isinstance(node, ast.ClassDef) and node.name in {"MessageOperations", "ContextOperations", "SandboxContext", "_HtmlHelper", "_StateProxy", "_AssetsProxy", "_UiProxy", "_ScreensProxy"}:
                    for function in node.body:
                        if isinstance(function, (ast.FunctionDef, ast.AsyncFunctionDef)) and not function.name.startswith("_"):
                            positional = function.args.posonlyargs + function.args.args
                            records.append({"origin": label, "class": node.name, "signature": signature(function, bool(positional and positional[0].arg == "self")), "async": isinstance(function, ast.AsyncFunctionDef), "decorators": [ast.unparse(item) for item in function.decorator_list]})
        output["helpers"] = records
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if options.format == "markdown":
        rendered = render_catalog(output)
    else:
        rendered = json.dumps(output, ensure_ascii=False, indent=2)
    if options.output is not None:
        options.output.write_text(rendered + "\n", encoding="utf-8")
    else:
        print(rendered)


if __name__ == "__main__":
    main()
```
