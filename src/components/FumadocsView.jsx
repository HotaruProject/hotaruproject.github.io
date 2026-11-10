import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Copy, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { LangSwitch } from './Navbar';
import { CATALOG_METHODS } from '../data/catalog.jsx';

function copyText(text, setCopied) {
  navigator.clipboard?.writeText(text).then(
    () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    () => {}
  );
}

function CopyButton({ copied, onClick, label = 'Copy code snippet' }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="tab inline-flex items-center gap-[var(--space-xs)] flex-shrink-0">
      {copied ? <Check aria-hidden="true" className="w-4 h-4 text-success" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function CodeBlock({ code, lang = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => copyText(code, setCopied);

  return (
    <figure className="m-0 my-[var(--space-lg)] rounded-card bg-paper-2 overflow-hidden w-full max-w-full">
      <div className="flex items-center justify-between gap-[var(--space-xs)] pl-[var(--space-md)] pr-[var(--space-2xs)] py-[var(--space-2xs)] border-b border-rule">
        <figcaption className="text-sm text-muted">{lang}</figcaption>
        <CopyButton copied={copied} onClick={handleCopy} />
      </div>
      <pre className="m-0 p-[var(--space-md)] overflow-x-auto font-mono text-sm text-ink-2 leading-relaxed whitespace-pre">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

function MethodCard({ method, lang }) {
  const [copied, setCopied] = useState(false);

  const copyCall = () => copyText(method.signature, setCopied);

  return (
    <article className="py-[var(--space-xl)] border-b border-rule">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[var(--space-xs)]">
        <div className="min-w-0">
          <h3 className="font-mono text-lg text-ink font-normal tracking-normal break-all">ctx.{method.name}</h3>
          <p className="mt-[var(--space-2xs)] text-sm text-muted">
            <span className="font-mono">{method.rpc}</span>
            <span className="mx-[var(--space-xs)]" aria-hidden="true">/</span>
            <span>{lang === 'ru' ? 'возвращает' : 'returns'} </span>
            <span className="font-mono text-ink-2">{method.returns}</span>
          </p>
        </div>
        <CopyButton copied={copied} onClick={copyCall} label="Copy method signature" />
      </div>

      <p className="mt-[var(--space-sm)] text-ink-2">
        {lang === 'ru' ? method.desc_ru : method.desc_en}
      </p>

      {method.params && method.params.length > 0 && (
        <div className="mt-[var(--space-md)] overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-muted border-b border-rule">
                <th className="font-normal py-[var(--space-xs)] pr-[var(--space-md)]">{lang === 'ru' ? 'Параметр' : 'Parameter'}</th>
                <th className="font-normal py-[var(--space-xs)] pr-[var(--space-md)]">{lang === 'ru' ? 'Тип' : 'Type'}</th>
                <th className="font-normal py-[var(--space-xs)] pr-[var(--space-md)]">{lang === 'ru' ? 'Обязательный' : 'Required'}</th>
                <th className="font-normal py-[var(--space-xs)]">{lang === 'ru' ? 'По умолчанию' : 'Default'}</th>
              </tr>
            </thead>
            <tbody>
              {method.params.map((p) => (
                <tr key={p.name} className="border-b border-rule last:border-b-0">
                  <td className="py-[var(--space-xs)] pr-[var(--space-md)] font-mono text-ink">{p.name}</td>
                  <td className="py-[var(--space-xs)] pr-[var(--space-md)] font-mono text-ink-2">{p.type}</td>
                  <td className="py-[var(--space-xs)] pr-[var(--space-md)] text-ink-2">
                    {p.required ? (lang === 'ru' ? 'да' : 'yes') : (lang === 'ru' ? 'нет' : 'no')}
                  </td>
                  <td className="py-[var(--space-xs)] font-mono text-muted">{p.default || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

function FormattedContent({ rawContent }) {
  const elements = useMemo(() => {
    if (!rawContent) return null;
    const parts = [];
    const codeBlockRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rawContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: rawContent.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'python',
        content: match[2].trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < rawContent.length) {
      parts.push({
        type: 'text',
        content: rawContent.slice(lastIndex),
      });
    }

    return parts;
  }, [rawContent]);

  return (
    <div className="w-full max-w-[72ch] min-w-0">
      {elements?.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.content} lang={part.lang} />;
        }

        const paragraphs = part.content.split('\n\n');
        return (
          <React.Fragment key={index}>
            {paragraphs.map((p, pIdx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="mt-[var(--space-2xl)] mb-[var(--space-sm)] text-title text-ink">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={pIdx} className="mt-[var(--space-3xl)] mb-[var(--space-md)] text-[length:var(--text-2xl)] text-ink">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }

              return (
                <p key={pIdx} className="mt-[var(--space-md)] text-ink-2 leading-[1.7] whitespace-pre-line break-words">
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

function Inline({ text }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((chunk, i) => {
    if (chunk.startsWith('`') && chunk.endsWith('`') && chunk.length > 2) {
      return <code key={i} className="code-inline">{chunk.slice(1, -1)}</code>;
    }
    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
      return <strong key={i} className="font-semibold text-ink">{chunk.slice(2, -2)}</strong>;
    }
    return chunk;
  });
}

export function FumadocsView({ content, lang, setLang, onBackToHome }) {
  const [activeTab, setActiveTab] = useState(() =>
    window.location.hash.includes('catalog') ? 'catalog' : 'chapters'
  );
  const [activeSection, setActiveSection] = useState(0);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  const t = content.docs;

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
          m.signature.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedNamespace, searchQuery]);

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

  const L = lang === 'ru'
    ? { home: 'На главную', manual: 'Руководство', methods: 'Методы', chapters: 'Разделы', namespaces: 'Пространства имён', filter: 'Фильтр по разделам и методам', current: 'Текущий раздел', pick: 'Выберите раздел', catalogTitle: 'Каталог методов MTProto', showing: (n, total) => `Показано ${n} из ${total}`, prev: 'Назад', next: 'Дальше', empty: 'Ничего не найдено. Измените запрос.' }
    : { home: 'Home', manual: 'Manual', methods: 'Methods', chapters: 'Chapters', namespaces: 'Namespaces', filter: 'Filter docs and methods', current: 'Current chapter', pick: 'Select chapter', catalogTitle: 'Extended MTProto API catalog', showing: (n, total) => `Showing ${n} of ${total}`, prev: 'Previous', next: 'Next', empty: 'Nothing matches. Change the query.' };

  const shortTitle = (title) => title.split(':')[0];

  const searchField = (id) => (
    <div className="relative">
      <label htmlFor={id} className="visually-hidden">{L.filter}</label>
      <Search aria-hidden="true" className="absolute left-[var(--space-sm)] top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        id={id}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="field"
      />
    </div>
  );

  const tabSwitch = (
    <div className="flex items-center gap-[var(--space-2xs)]" role="group" aria-label="Docs view">
      <button type="button" onClick={() => setActiveTab('chapters')} aria-pressed={activeTab === 'chapters'} className="tab">
        {L.manual} <span className="num text-muted">{filteredSections.length}</span>
      </button>
      <button type="button" onClick={() => setActiveTab('catalog')} aria-pressed={activeTab === 'catalog'} className="tab">
        {L.methods} <span className="num text-muted">{CATALOG_METHODS.length}</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col w-full">
      <header className="sticky top-0 z-sticky-nav nav-pill">
        <div className="max-w-container mx-auto px-[var(--gutter)] min-h-[56px] flex items-center justify-between gap-[var(--space-md)]">
          <div className="flex items-center gap-[var(--space-md)] min-w-0">
            <button type="button" onClick={onBackToHome} className="tab inline-flex items-center gap-[var(--space-xs)] min-h-[44px]" aria-label={L.home}>
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
              <span className="hidden sm:inline">{L.home}</span>
            </button>
            <span className="font-display uppercase text-lg text-ink">Hotaru</span>
          </div>

          <div className="flex items-center gap-[var(--space-md)]">
            <div className="hidden sm:block">{tabSwitch}</div>
            <LangSwitch lang={lang} setLang={setLang} />
            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="hidden md:inline-flex btn btn--quiet btn--sm">
              <Sparkles aria-hidden="true" className="w-4 h-4" />
              <span>SKILL.md</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex-grow w-full max-w-container mx-auto px-[var(--gutter)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)]">
        <aside className="hidden lg:block lg:col-span-3 sticky top-[56px] self-start max-h-[calc(100dvh-56px)] overflow-y-auto py-[var(--space-xl)] pr-[var(--space-xs)]">
          {searchField('docs-search')}

          <h2 className="mt-[var(--space-xl)] mb-[var(--space-xs)] text-sm text-muted font-sans font-normal tracking-normal">
            {activeTab === 'chapters' ? (t.tocTitle || L.chapters) : L.namespaces}
          </h2>

          {activeTab === 'chapters' ? (
            <ol className="m-0 p-0 list-none flex flex-col">
              {filteredSections.map((sec, idx) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(idx)}
                    aria-current={currentSection?.id === sec.id}
                    className="toc-item"
                  >
                    {sec.title}
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="m-0 p-0 list-none flex flex-col">
              {namespaces.map((ns) => (
                <li key={ns}>
                  <button
                    type="button"
                    onClick={() => setSelectedNamespace(ns)}
                    aria-current={selectedNamespace === ns}
                    className="toc-item flex items-center justify-between gap-[var(--space-sm)]"
                  >
                    <span>{ns}</span>
                    <span className="num text-muted">
                      {ns === 'all' ? CATALOG_METHODS.length : CATALOG_METHODS.filter((m) => m.namespace === ns).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="lg:col-start-5 lg:col-span-8 min-w-0 py-[var(--space-xl)] lg:py-[var(--space-2xl)]">
          <div className="lg:hidden flex flex-col gap-[var(--space-sm)] mb-[var(--space-xl)]">
            <div className="sm:hidden">{tabSwitch}</div>
            {searchField('docs-search-m')}

            {activeTab === 'chapters' && (
              <div className="relative">
                <p className="text-sm text-muted mb-[var(--space-2xs)]">
                  {L.current} <span className="num">{activeSection + 1} / {filteredSections.length}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
                  aria-expanded={chapterDropdownOpen}
                  className="w-full min-h-[48px] px-[var(--space-md)] rounded-input bg-paper-2 text-ink text-left flex items-center justify-between gap-[var(--space-xs)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <span className="truncate">{currentSection?.title || L.pick}</span>
                  <ChevronDown aria-hidden="true" className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-short ease-out ${chapterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {chapterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-dropdown" onClick={() => setChapterDropdownOpen(false)} />
                    <ol className="absolute top-full mt-[var(--space-2xs)] inset-x-0 z-dropdown m-0 p-[var(--space-2xs)] list-none rounded-input bg-paper-3 max-h-72 overflow-y-auto">
                      {filteredSections.map((sec, idx) => (
                        <li key={sec.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection(idx);
                              setChapterDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            aria-current={currentSection?.id === sec.id}
                            className="toc-item"
                          >
                            {sec.title}
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
              <article>
                <p className="text-sm text-muted font-mono">#{currentSection.id}</p>
                <h1 className="mt-[var(--space-xs)] text-section text-ink max-w-[24ch]">{currentSection.title}</h1>
                <p className="lead mt-[var(--space-md)] text-ink-2">{currentSection.summary}</p>

                <div className="mt-[var(--space-xl)] pt-[var(--space-xs)] border-t border-rule">
                  <FormattedContent rawContent={currentSection.content} />
                </div>

                <nav className="mt-[var(--space-3xl)] pt-[var(--space-lg)] border-t border-rule grid grid-cols-2 gap-[var(--space-md)]" aria-label={L.chapters}>
                  {activeSection > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(activeSection - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="pager text-left"
                    >
                      <span className="text-sm text-muted">{L.prev}</span>
                      <span className="text-ink">{shortTitle(filteredSections[activeSection - 1]?.title || '')}</span>
                    </button>
                  ) : <span />}
                  {activeSection < filteredSections.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(activeSection + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="pager text-right items-end"
                    >
                      <span className="text-sm text-muted">{L.next}</span>
                      <span className="text-ink">{shortTitle(filteredSections[activeSection + 1]?.title || '')}</span>
                    </button>
                  ) : <span />}
                </nav>
              </article>
            ) : (
              <p className="text-ink-2">{L.empty}</p>
            )
          ) : (
            <section>
              <h1 className="text-section text-ink">{L.catalogTitle}</h1>
              <p className="mt-[var(--space-sm)] text-muted num" aria-live="polite">
                {L.showing(filteredCatalog.length, CATALOG_METHODS.length)}
              </p>

              <div className="lg:hidden mt-[var(--space-lg)] flex gap-[var(--space-2xs)] overflow-x-auto no-scrollbar -mx-[var(--gutter)] px-[var(--gutter)]">
                {namespaces.map((ns) => (
                  <button key={ns} type="button" onClick={() => setSelectedNamespace(ns)} aria-pressed={selectedNamespace === ns} className="tab">
                    {ns}
                  </button>
                ))}
              </div>

              <div className="mt-[var(--space-lg)] border-t border-rule">
                {filteredCatalog.length > 0
                  ? filteredCatalog.map((method) => <MethodCard key={method.name} method={method} lang={lang} />)
                  : <p className="py-[var(--space-xl)] text-ink-2">{L.empty}</p>}
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="border-t border-rule">
        <div className="max-w-container mx-auto px-[var(--gutter)] py-[var(--space-lg)] text-sm text-muted">
          {content.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
