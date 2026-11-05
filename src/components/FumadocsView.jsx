import React, { useState, useMemo, useEffect } from 'react';
import { Search, Book, ChevronRight, Hash, Layers, ListFilter, Copy, Check, Terminal, ExternalLink, ArrowLeft, Filter, Sparkles, Shield, Code, Cpu } from 'lucide-react';
import { CATALOG_METHODS } from '../data/catalog.js';

function CodeBlock({ code, lang = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-[#040407] overflow-hidden shadow-lg w-full max-w-full">
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 truncate">
            {lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 sm:p-4 overflow-x-auto text-[11px] sm:text-xs md:text-[13px] font-mono text-white/90 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 max-w-full whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MethodCard({ method, lang }) {
  const [copied, setCopied] = useState(false);

  const copyCall = () => {
    navigator.clipboard.writeText(method.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#080910] p-4 transition-all hover:border-white/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-mono text-xs sm:text-sm font-bold text-white break-all">
            ctx.{method.name}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/70 border border-white/10">
            {method.rpc}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {method.returns}
          </span>
        </div>
        <button
          onClick={copyCall}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-2.5 text-xs text-white/70 font-sans">
        {lang === 'ru' ? method.desc_ru : method.desc_en}
      </p>

      {method.params && method.params.length > 0 && (
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="text-white/40 border-b border-white/5">
                <th className="pb-1 pr-3">Parameter</th>
                <th className="pb-1 pr-3">Type</th>
                <th className="pb-1 pr-3">Required</th>
                <th className="pb-1">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {method.params.map((p, pIdx) => (
                <tr key={pIdx}>
                  <td className="py-1 pr-3 text-white font-medium">{p.name}</td>
                  <td className="py-1 pr-3 text-white/60">{p.type}</td>
                  <td className="py-1 pr-3">
                    {p.required ? (
                      <span className="text-amber-400">yes</span>
                    ) : (
                      <span className="text-white/30">no</span>
                    )}
                  </td>
                  <td className="py-1 text-white/50">{p.default || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {elements?.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.content} lang={part.lang} />;
        }

        const paragraphs = part.content.split('\n\n');
        return (
          <div key={index} className="space-y-3 w-full max-w-full overflow-hidden">
            {paragraphs.map((p, pIdx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={pIdx}
                    className="text-base sm:text-lg font-bold text-white pt-4 pb-1 border-b border-white/10 flex items-center gap-2 break-words"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block flex-shrink-0" />
                    <span>{trimmed.replace('### ', '')}</span>
                  </h4>
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h3
                    key={pIdx}
                    className="text-lg sm:text-xl font-bold text-white pt-5 pb-2 border-b border-white/15 break-words"
                  >
                    {trimmed.replace('## ', '')}
                  </h3>
                );
              }

              return (
                <div
                  key={pIdx}
                  className="text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans break-words overflow-hidden"
                >
                  {trimmed}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function FumadocsView({ content, lang, setLang, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('chapters');
  const [activeSection, setActiveSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[#050508]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-mono text-white/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm sm:text-base text-white">
              HOTARU
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/60">
              DOCS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center rounded-lg bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Manual ({filteredSections.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All 292 Methods
            </button>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white/70 hover:text-white"
          >
            {lang.toUpperCase()}
          </button>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white text-black font-semibold hover:bg-white/90"
          >
            <Sparkles className="w-3 h-3" />
            <span>SKILL.md</span>
          </a>
        </div>
      </header>

      <div className="flex-grow flex w-full max-w-full overflow-hidden">
        <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-white/10 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#07080d]">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter docs & methods..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2 px-1">
            {activeTab === 'chapters' ? 'Chapters' : 'MTProto Namespaces'}
          </div>

          {activeTab === 'chapters' ? (
            <div className="flex flex-col gap-1">
              {filteredSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(idx)}
                  className={`text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    currentSection?.id === sec.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  {currentSection?.id === sec.id && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {namespaces.map((ns) => (
                <button
                  key={ns}
                  onClick={() => setSelectedNamespace(ns)}
                  className={`text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedNamespace === ns
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="capitalize">{ns}</span>
                  <span className="text-[10px] opacity-60">
                    {ns === 'all'
                      ? CATALOG_METHODS.length
                      : CATALOG_METHODS.filter((m) => m.namespace === ns).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="flex-grow p-4 sm:p-8 max-w-5xl mx-auto w-full overflow-hidden">
          <div className="lg:hidden flex items-center justify-between mb-4 gap-2">
            <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-3 py-1 rounded text-xs font-mono ${
                  activeTab === 'chapters' ? 'bg-white text-black font-semibold' : 'text-white/60'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1 rounded text-xs font-mono ${
                  activeTab === 'catalog' ? 'bg-white text-black font-semibold' : 'text-white/60'
                }`}
              >
                292 Methods
              </button>
            </div>

            <div className="relative flex-grow max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-white/30"
              />
            </div>
          </div>

          {activeTab === 'chapters' ? (
            <div>
              <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar flex gap-1.5 pb-1">
                {filteredSections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(idx)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-mono min-h-[36px] flex items-center ${
                      currentSection?.id === sec.id
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-white/70'
                    }`}
                  >
                    {sec.title.split('.')[0]}
                  </button>
                ))}
              </div>

              {currentSection && (
                <div className="rounded-2xl border border-white/10 bg-[#07080f] p-4 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-2">
                    <Hash className="w-3.5 h-3.5 text-white/70" />
                    <span>{currentSection.id}</span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 pb-3 border-b border-white/10">
                    {currentSection.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/60 mb-6 font-mono">
                    {currentSection.summary}
                  </p>
                  <FormattedContent rawContent={currentSection.content} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Extended MTProto API Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Showing {filteredCatalog.length} of {CATALOG_METHODS.length} methods
                  </p>
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
                  {namespaces.map((ns) => (
                    <button
                      key={ns}
                      onClick={() => setSelectedNamespace(ns)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-colors ${
                        selectedNamespace === ns
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {ns}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {filteredCatalog.map((method) => (
                  <MethodCard key={method.name} method={method} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-white/40 font-mono">
        Hotaru Project. Released under GNU Affero General Public License v3.0 (AGPLv3).
      </footer>
    </div>
  );
}
