import React, { useState, useMemo, useEffect, useId, useRef, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  TriangleAlert,
  ArrowLeft,
  Download,
  BookOpen,
  Boxes,
  Hash,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { LangSwitch } from './Navbar';
import { CATALOG_METHODS } from '../data/catalog.jsx';
import { codeText } from '../lib/codeText.jsx';
import { useCopy } from '../lib/useCopy.jsx';

function DocState({ state, copiedLabel, failedLabel }) {
  return (
    <span className={`doc-state ${state !== 'idle' ? 'doc-state--on' : ''}`} aria-live="polite">
      {state === 'copied' ? (
        <>
          <Check aria-hidden="true" className="w-3.5 h-3.5" />
          <span>{copiedLabel}</span>
        </>
      ) : state === 'failed' ? (
        <>
          <TriangleAlert aria-hidden="true" className="w-3.5 h-3.5" />
          <span>{failedLabel}</span>
        </>
      ) : null}
    </span>
  );
}

function CodeBlock({ code, lang = 'python', copyLabel, copiedLabel, failedLabel }) {
  const [state, copy] = useCopy();
  const hintId = useId();

  return (
    <figure className="doc-code-block">
      <div className="doc-code-block__head">
        <figcaption className="doc-code-block__lang">{lang}</figcaption>
        <DocState state={state} copiedLabel={copiedLabel} failedLabel={failedLabel} />
      </div>
      <pre
        className={`doc-code ${state === 'copied' ? 'doc-code--done' : ''}`}
        role="button"
        tabIndex={0}
        title={copyLabel}
        aria-describedby={hintId}
        onClick={() => copy(code)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          copy(code);
        }}
      >
        <code>{codeText(code)}</code>
      </pre>
      <span id={hintId} className="visually-hidden">{copyLabel}</span>
    </figure>
  );
}

function MethodCard({ method, lang }) {
  const description = lang === 'ru' ? method.desc_ru : method.desc_en;

  return (
    <article className="doc-method">
      <h3 className="doc-method__title">
        <span className="doc-method__prefix" aria-hidden="true">ctx.</span>
        <span className="doc-method__name">{method.name}</span>
      </h3>

      <p className="doc-method__rpc">{method.rpc}</p>

      <p className="doc-method__desc">{description}</p>

      {method.params && method.params.length > 0 && (
        <div className="doc-method__table-wrap">
          <table className="doc-method__table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Параметр' : 'Parameter'}</th>
                <th>{lang === 'ru' ? 'Тип' : 'Type'}</th>
                <th>{lang === 'ru' ? 'Обязателен' : 'Required'}</th>
                <th>{lang === 'ru' ? 'По умолчанию' : 'Default'}</th>
              </tr>
            </thead>
            <tbody>
              {method.params.map((p) => (
                <tr key={p.name}>
                  <td className="doc-method__param">{p.name}</td>
                  <td className="doc-method__type">{p.type}</td>
                  <td className={p.required ? 'doc-method__req' : 'doc-method__opt'}>
                    {p.required ? (lang === 'ru' ? 'да' : 'yes') : (lang === 'ru' ? 'нет' : 'no')}
                  </td>
                  <td className="doc-method__default">{p.default || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

function Inline({ text }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((chunk, i) => {
    if (chunk.startsWith('`') && chunk.endsWith('`') && chunk.length > 2) {
      return <code key={i} className="code-inline">{chunk.slice(1, -1)}</code>;
    }
    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
      return <strong key={i} className="doc-strong">{chunk.slice(2, -2)}</strong>;
    }
    return chunk;
  });
}

function Figure({ src, alt, caption }) {
  const mark = src.endsWith('-mark.png');
  return (
    <figure className={`doc-figure${mark ? ' doc-figure--mark' : ''}`}>
      <img src={src} alt={alt || caption || ''} loading="lazy" decoding="async" />
      {caption ? <figcaption className="doc-figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}

function FormattedContent({ rawContent, copyLabel, copiedLabel, failedLabel }) {
  const elements = useMemo(() => {
    if (!rawContent) return null;
    const parts = [];
    const codeBlockRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rawContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: rawContent.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'python',
        content: match[2].trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < rawContent.length) {
      parts.push({ type: 'text', content: rawContent.slice(lastIndex) });
    }

    return parts;
  }, [rawContent]);

  return (
    <div className="doc-prose">
      {elements?.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              lang={part.lang}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              failedLabel={failedLabel}
            />
          );
        }

        const blocks = part.content.split(/\n{2,}/);
        return (
          <React.Fragment key={index}>
            {blocks.map((raw, bIdx) => {
              const trimmed = raw.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={bIdx} className="doc-h3">{trimmed.replace('### ', '')}</h3>
                );
              }

              const figure = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
              if (figure) {
                return (
                  <Figure
                    key={bIdx}
                    src={figure[2]}
                    alt={figure[1]}
                    caption={figure[1]}
                  />
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={bIdx} className="doc-h2">{trimmed.replace('## ', '')}</h2>
                );
              }

              if (trimmed.startsWith('| ')) {
                const rows = trimmed.split('\n').filter((line) => line.trim().length > 0);
                const cells = rows.map((line) =>
                  line
                    .replace(/^\|/, '')
                    .replace(/\|$/, '')
                    .split('|')
                    .map((cell) => cell.trim())
                );
                const body = cells.filter(
                  (row) => !row.every((cell) => /^:?-{2,}:?$/.test(cell))
                );
                if (body.length === 0) return null;
                const [head, ...rest] = body;
                return (
                  <div key={bIdx} className="doc-table-wrap">
                    <table className="doc-table">
                      <thead>
                        <tr>
                          {head.map((cell, cIdx) => (
                            <th key={cIdx}><Inline text={cell} /></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}><Inline text={cell} /></td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n').map((line) => line.replace(/^-\s*/, ''));
                return (
                  <ul key={bIdx} className="doc-list">
                    {items.map((item, iIdx) => (
                      <li key={iIdx}><Inline text={item} /></li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={bIdx} className="doc-p">
                  <Inline text={trimmed} />
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function FumadocsView({ content, lang, setLang, onBackToHome }) {
  const [activeTab, setActiveTab] = useState(() =>
    window.location.hash.includes('catalog') ? 'catalog' : 'chapters'
  );
  const [activeSection, setActiveSection] = useState(0);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const t = content.docs;

  const L = lang === 'ru'
    ? {
        home: 'На главную',
        guide: 'Руководство',
        methods: 'Методы',
        chapters: 'Главы',
        namespaces: 'Пространства имён',
        filter: 'Фильтр по разделам и методам',
        current: 'Текущий раздел',
        pick: 'Выберите раздел',
        catalogTitle: 'Каталог контекстных методов',
        catalogLead: 'Описания приведены по официальному справочнику методов Telegram.',
        showing: (n, total) => `Показано ${n} из ${total}`,
        prev: 'Назад',
        next: 'Дальше',
        empty: 'Ничего не найдено. Измените запрос.',
        copyCode: 'Скопировать код',
        copyMethod: 'Скопировать сигнатуру метода',
        copied: 'Скопировано',
        failed: 'Не удалось скопировать',
        search: 'Поиск',
        searchHint: 'Нажмите / для поиска',
        noResults: 'Совпадений нет',
        closeSearch: 'Закрыть поиск',
      }
    : {
        home: 'Home',
        guide: 'Guide',
        methods: 'Methods',
        chapters: 'Chapters',
        namespaces: 'Namespaces',
        filter: 'Filter docs and methods',
        current: 'Current chapter',
        pick: 'Select chapter',
        catalogTitle: 'Contextual method catalog',
        catalogLead: 'Descriptions follow the official Telegram method reference.',
        showing: (n, total) => `Showing ${n} of ${total}`,
        prev: 'Previous',
        next: 'Next',
        empty: 'Nothing matches. Change the query.',
        copyCode: 'Copy code',
        copyMethod: 'Copy method signature',
        copied: 'Copied',
        failed: 'Copy failed',
        search: 'Search',
        searchHint: 'Press / to search',
        noResults: 'No matches',
        closeSearch: 'Close search',
      };

  const namespaces = useMemo(() => {
    const set = new Set(CATALOG_METHODS.map((m) => m.namespace));
    return ['all', ...Array.from(set).sort()];
  }, []);

  const filteredCatalog = useMemo(() => {
    let list = CATALOG_METHODS;
    if (selectedNamespace !== 'all') {
      list = list.filter((m) => m.namespace === selectedNamespace);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.rpc.toLowerCase().includes(q) ||
          m.signature.toLowerCase().includes(q) ||
          (lang === 'ru' ? m.desc_ru : m.desc_en).toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedNamespace, searchQuery, lang]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return t.sections;
    const q = searchQuery.toLowerCase();
    return t.sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [t.sections, searchQuery]);

  const currentSection =
    filteredSections[activeSection] || filteredSections[0] || t.sections[0];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return t.sections.map((s) => ({
        kind: 'chapter',
        id: s.id,
        title: s.title,
        summary: s.summary,
      }));
    }
    const chapters = t.sections
      .filter((s) =>
        s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((s) => ({ kind: 'chapter', id: s.id, title: s.title, summary: s.summary }));
    const methods = CATALOG_METHODS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.rpc.toLowerCase().includes(q) ||
        (lang === 'ru' ? m.desc_ru : m.desc_en).toLowerCase().includes(q)
    )
      .slice(0, 12)
      .map((m) => ({ kind: 'method', id: m.name, title: m.name, summary: m.rpc }));
    return [...chapters, ...methods];
  }, [searchQuery, t.sections, lang]);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    window.requestAnimationFrame(() => searchRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === 'Escape' && searchOpen) {
        closeSearch();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, openSearch, closeSearch]);

  useEffect(() => {
    if (activeTab === 'catalog') {
      setActiveSection(0);
    }
  }, [activeTab]);

  const jumpToMethod = (name) => {
    setActiveTab('catalog');
    setSelectedNamespace('all');
    setSearchQuery('');
    closeSearch();
    window.requestAnimationFrame(() => {
      const node = document.getElementById(`method-${name}`);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const jumpToChapter = (id) => {
    setActiveTab('chapters');
    setSearchQuery('');
    closeSearch();
    const index = t.sections.findIndex((s) => s.id === id);
    if (index >= 0) setActiveSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shortTitle = (title) => title.split(':')[0];

  const searchField = (id, autoFocus) => (
    <div className="doc-search">
      <Search aria-hidden="true" className="doc-search__icon" />
      <label htmlFor={id} className="visually-hidden">{L.filter}</label>
      <input
        id={id}
        ref={autoFocus ? searchRef : undefined}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="doc-search__input"
        autoComplete="off"
        spellCheck="false"
      />
      {searchQuery ? (
        <button
          type="button"
          className="doc-search__clear"
          onClick={() => setSearchQuery('')}
          aria-label={L.closeSearch}
        >
          <X aria-hidden="true" className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );

  const tabSwitch = (
    <div className="doc-seg" role="group" aria-label={L.guide}>
      <button type="button" onClick={() => setActiveTab('chapters')} aria-pressed={activeTab === 'chapters'} className="doc-seg__btn">
        <BookOpen aria-hidden="true" className="w-4 h-4" />
        <span>{L.guide}</span>
        <span className="doc-seg__num">{t.sections.length}</span>
      </button>
      <button type="button" onClick={() => setActiveTab('catalog')} aria-pressed={activeTab === 'catalog'} className="doc-seg__btn">
        <Boxes aria-hidden="true" className="w-4 h-4" />
        <span>{L.methods}</span>
        <span className="doc-seg__num">{CATALOG_METHODS.length}</span>
      </button>
    </div>
  );

  return (
    <div className="doc-shell min-h-dvh flex flex-col w-full">
      <header className="doc-header">
        <div className="doc-header__inner">
          <div className="doc-header__side">
            <button type="button" onClick={onBackToHome} className="doc-ghost" aria-label={L.home}>
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
              <span className="hidden sm:inline">{L.home}</span>
            </button>
          </div>

          <div className="doc-header__brand">
            <span className="doc-header__mark" aria-hidden="true" />
            <span className="doc-header__title">Hotaru</span>
            <span className="doc-header__sep" aria-hidden="true" />
            <span className="doc-header__crumb">
              {activeTab === 'chapters' ? (currentSection?.title || t.title) : L.catalogTitle}
            </span>
          </div>

          <div className="doc-header__side doc-header__side--end">
            {tabSwitch}
            <LangSwitch lang={lang} setLang={setLang} />
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="hidden md:inline-flex doc-btn doc-btn--sm"
            >
              <Download aria-hidden="true" className="w-4 h-4" />
              <span>SKILL.md</span>
            </a>
          </div>
        </div>
      </header>

      <div className="doc-toolbar">
        <div className="doc-toolbar__inner">
          <div className="doc-toolbar__search">{searchField('docs-search')}</div>
          <button type="button" className="doc-toolbar__hint" onClick={openSearch}>
            <span>{L.search}</span>
            <kbd>/</kbd>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="doc-overlay" role="presentation" onClick={closeSearch}>
          <div
            className="doc-palette"
            role="dialog"
            aria-modal="true"
            aria-label={L.search}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="doc-palette__head">
              <Search aria-hidden="true" className="doc-search__icon" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="doc-palette__input"
                autoComplete="off"
                spellCheck="false"
                aria-label={L.filter}
              />
              <button type="button" className="doc-search__clear" onClick={closeSearch} aria-label={L.closeSearch}>
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
            <div className="doc-palette__body">
              {searchResults.length === 0 ? (
                <p className="doc-palette__empty">{L.noResults}</p>
              ) : (
                <ul className="doc-palette__list">
                  {searchQuery.trim() ? null : (
                    <li className="doc-palette__label-row" aria-hidden="true">
                      {L.chapters}
                    </li>
                  )}
                  {searchResults.map((item) => (
                    <li key={`${item.kind}-${item.id}`}>
                      <button
                        type="button"
                        className="doc-palette__item"
                        onClick={() =>
                          item.kind === 'chapter' ? jumpToChapter(item.id) : jumpToMethod(item.id)
                        }
                      >
                        <span className="doc-palette__kind" aria-hidden="true">
                          {item.kind === 'chapter'
                            ? <BookOpen className="w-4 h-4" />
                            : <Hash className="w-4 h-4" />}
                        </span>
                        <span className="doc-palette__text">
                          <span className="doc-palette__label">{item.title}</span>
                          <span className="doc-palette__sub">{item.summary}</span>
                        </span>
                        <CornerDownLeft aria-hidden="true" className="doc-palette__go w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="doc-layout">
        <aside className="doc-sidebar">
          <h2 className="doc-sidebar__title">
            {activeTab === 'chapters' ? (t.tocTitle || L.chapters) : L.namespaces}
          </h2>

          {activeTab === 'chapters' ? (
            <ol className="doc-nav">
              {filteredSections.map((sec, idx) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-current={currentSection?.id === sec.id ? 'true' : undefined}
                    className="doc-nav__item"
                  >
                    <span className="doc-nav__num">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="doc-nav__label">{sec.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="doc-nav">
              {namespaces.map((ns) => (
                <li key={ns}>
                  <button
                    type="button"
                    onClick={() => setSelectedNamespace(ns)}
                    aria-current={selectedNamespace === ns ? 'true' : undefined}
                    className="doc-nav__item"
                  >
                    <span className="doc-nav__label">{ns}</span>
                    <span className="doc-nav__count">
                      {ns === 'all'
                        ? CATALOG_METHODS.length
                        : CATALOG_METHODS.filter((m) => m.namespace === ns).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="doc-main">
          <div className="doc-mobile">
            <div className="doc-mobile__seg">{tabSwitch}</div>

            {activeTab === 'chapters' && (
              <div className="doc-mobile__chapter">
                <p className="doc-mobile__label">
                  {L.current} <span className="num">{activeSection + 1} / {filteredSections.length}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
                  aria-expanded={chapterDropdownOpen}
                  className="doc-select"
                >
                  <span className="truncate">{currentSection?.title || L.pick}</span>
                  <ChevronDown aria-hidden="true" className={`w-4 h-4 doc-chevron ${chapterDropdownOpen ? 'is-open' : ''}`} />
                </button>

                {chapterDropdownOpen && (
                  <>
                    <div className="doc-scrim" onClick={() => setChapterDropdownOpen(false)} />
                    <ol className="doc-menu doc-menu--drop">
                      {filteredSections.map((sec, idx) => (
                        <li key={sec.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection(idx);
                              setChapterDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            aria-current={currentSection?.id === sec.id ? 'true' : undefined}
                            className="doc-nav__item"
                          >
                            <span className="doc-nav__num">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="doc-nav__label">{sec.title}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            )}
          </div>

          {activeTab === 'chapters' ? (
            currentSection ? (
              <article className="doc-article">
                <p className="doc-eyebrow">
                  <span className="doc-eyebrow__num">{String(activeSection + 1).padStart(2, '0')}</span>
                  <span className="doc-eyebrow__rule" aria-hidden="true" />
                  <span>{t.tocTitle || L.chapters}</span>
                </p>
                <h1 className="doc-title">{currentSection.title}</h1>
                <p className="doc-lead">{currentSection.summary}</p>

                <div className="doc-rule" />

                <FormattedContent
                  rawContent={currentSection.content}
                  copyLabel={L.copyCode}
                  copiedLabel={L.copied}
                  failedLabel={L.failed}
                />

                <nav className="doc-pager" aria-label={L.chapters}>
                  {activeSection > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(activeSection - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="doc-pager__item doc-pager__item--prev"
                    >
                      <span className="doc-pager__dir">{L.prev}</span>
                      <span className="doc-pager__title">{shortTitle(filteredSections[activeSection - 1]?.title || '')}</span>
                    </button>
                  ) : <span />}
                  {activeSection < filteredSections.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(activeSection + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="doc-pager__item doc-pager__item--next"
                    >
                      <span className="doc-pager__dir">{L.next}</span>
                      <span className="doc-pager__title">{shortTitle(filteredSections[activeSection + 1]?.title || '')}</span>
                    </button>
                  ) : <span />}
                </nav>
              </article>
            ) : (
              <p className="doc-p">{L.empty}</p>
            )
          ) : (
            <section className="doc-article">
              <p className="doc-eyebrow">
                <span className="doc-eyebrow__num">{String(CATALOG_METHODS.length).padStart(3, '0')}</span>
                <span className="doc-eyebrow__rule" aria-hidden="true" />
                <span>{L.methods}</span>
              </p>
              <h1 className="doc-title">{L.catalogTitle}</h1>
              <p className="doc-lead">{L.catalogLead}</p>

              <div className="doc-rule" />

              <div className="doc-catalog">
                <div className="doc-catalog__bar">
                  <p className="doc-catalog__count num" aria-live="polite">
                    {L.showing(filteredCatalog.length, CATALOG_METHODS.length)}
                  </p>
                  <div className="doc-catalog__chips">
                    {namespaces.map((ns) => (
                      <button
                        key={ns}
                        type="button"
                        onClick={() => setSelectedNamespace(ns)}
                        aria-pressed={selectedNamespace === ns}
                        className="doc-chip"
                      >
                        {ns}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCatalog.length > 0 ? (
                  <div className="doc-catalog__list">
                    {filteredCatalog.map((method) => (
                      <div key={method.name} id={`method-${method.name}`}>
                        <MethodCard method={method} lang={lang} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="doc-p doc-empty">{L.empty}</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="doc-footer">
        <div className="doc-footer__inner">
          <span>{content.footer.copyright}</span>
          <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="doc-footer__link">
            <Download aria-hidden="true" className="w-4 h-4" />
            <span>SKILL.md</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
