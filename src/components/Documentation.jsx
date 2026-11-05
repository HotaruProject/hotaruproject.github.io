import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, Hash, Layers, ListFilter, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

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

export function Documentation({ content, onOpenDocs }) {
  const [activeSection, setActiveSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSelectOpen, setMobileSelectOpen] = useState(false);
  const t = content.docs;

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

  const handleSelectSection = (idx) => {
    setActiveSection(idx);
    setMobileSelectOpen(false);
  };

  return (
    <section
      id="documentation"
      className="py-14 sm:py-24 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 border-t border-white/[0.08] w-full max-w-full overflow-hidden"
    >
      <div className="mb-8 sm:mb-12 w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 self-start">
            <Book className="w-3.5 h-3.5 text-white" />
            <span>TECHNICAL MANUAL</span>
          </div>

          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-white/90 transition-all shadow-md self-start sm:self-auto"
            >
              <span>Open Fumadocs View (292 Methods)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white break-words">
          Hotaru Developer Manual
        </h2>
        <p className="mt-2 text-xs sm:text-base text-white/70 max-w-2xl font-normal leading-relaxed break-words">
          Complete engineering reference covering Linux sandboxing, the HOTARU manifest schema, hooks, templates, tasks, and the full ModuleContext API.
        </p>

        <div className="mt-5 relative max-w-xl w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveSection(0);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#0c0d14] border border-white/15 text-xs sm:text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/50 transition-all font-mono"
          />
        </div>
      </div>

      <div className="lg:hidden mb-6 sticky top-16 z-20 bg-[#050508]/95 backdrop-blur-md py-2 border-b border-white/10 w-full max-w-full">
        <div className="relative w-full">
          <button
            onClick={() => setMobileSelectOpen(!mobileSelectOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0e101a] border border-white/20 text-xs font-mono text-white font-medium shadow-lg min-h-[44px]"
          >
            <div className="flex items-center gap-2 truncate min-w-0">
              <Layers className="w-4 h-4 text-white/70 flex-shrink-0" />
              <span className="truncate">{currentSection?.title}</span>
            </div>
            <ListFilter className="w-4 h-4 text-white/70 flex-shrink-0 ml-2" />
          </button>

          {mobileSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0e101a] border border-white/20 shadow-2xl z-30 max-h-72 overflow-y-auto flex flex-col gap-1 backdrop-blur-2xl w-full">
              {filteredSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(idx)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between min-h-[44px] w-full ${
                    currentSection?.id === sec.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  {currentSection?.id === sec.id && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full max-w-full">
          {filteredSections.map((sec, idx) => {
            const shortLabel = sec.title.split('.')[0];
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all min-h-[36px] flex items-center justify-center ${
                  currentSection?.id === sec.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-full">
        <div className="hidden lg:block lg:col-span-4 bg-[#0a0b12] border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[78vh] overflow-y-auto">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-3 px-2">
            {t.tocTitle} ({filteredSections.length})
          </div>
          <div className="flex flex-col gap-1">
            {filteredSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-150 flex items-center justify-between w-full ${
                  currentSection?.id === sec.id
                    ? 'bg-white text-black font-semibold shadow-md translate-x-1'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate pr-2">{sec.title}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#0a0b12] border border-white/15 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl w-full max-w-full overflow-hidden">
          {currentSection ? (
            <div className="w-full max-w-full overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-3">
                <Hash className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
                <span className="truncate">{currentSection.id}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 pb-3 border-b border-white/10 break-words">
                {currentSection.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6 font-mono break-words">
                {currentSection.summary}
              </p>
              <FormattedContent rawContent={currentSection.content} />
            </div>
          ) : (
            <div className="text-center py-20 text-white/40 font-mono text-sm">
              No matching sections found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
