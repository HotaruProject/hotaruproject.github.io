import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, Hash, Layers, ListFilter, Copy, Check, Terminal } from 'lucide-react';

function CodeBlock({ code, lang = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-[#040407] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
            {lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
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
      <pre className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono text-white/90 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
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
    <div className="space-y-4">
      {elements?.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.content} lang={part.lang} />;
        }

        const paragraphs = part.content.split('\n\n');
        return (
          <div key={index} className="space-y-3">
            {paragraphs.map((p, pIdx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={pIdx}
                    className="text-base sm:text-lg font-bold text-white pt-4 pb-1 border-b border-white/10 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                    <span>{trimmed.replace('### ', '')}</span>
                  </h4>
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h3
                    key={pIdx}
                    className="text-lg sm:text-xl font-bold text-white pt-5 pb-2 border-b border-white/15"
                  >
                    {trimmed.replace('## ', '')}
                  </h3>
                );
              }

              return (
                <div
                  key={pIdx}
                  className="text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans"
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

export function Documentation({ content }) {
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
      className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]"
    >
      <div className="mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-3">
          <Book className="w-3.5 h-3.5 text-white" />
          <span>TECHNICAL MANUAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Hotaru Developer Manual
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-white/70 max-w-2xl font-normal leading-relaxed">
          Comprehensive technical reference for Linux namespace sandboxing, capability security gates, and the ModuleContext API.
        </p>

        <div className="mt-6 relative max-w-xl">
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

      <div className="lg:hidden mb-6 sticky top-16 z-20 bg-[#050508]/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-white/10">
        <div className="relative">
          <button
            onClick={() => setMobileSelectOpen(!mobileSelectOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#0e101a] border border-white/20 text-xs font-mono text-white font-medium shadow-lg"
          >
            <div className="flex items-center gap-2 truncate">
              <Layers className="w-4 h-4 text-white/70 flex-shrink-0" />
              <span className="truncate">{currentSection?.title}</span>
            </div>
            <ListFilter className="w-4 h-4 text-white/70 flex-shrink-0 ml-2" />
          </button>

          {mobileSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0e101a] border border-white/20 shadow-2xl z-30 max-h-72 overflow-y-auto flex flex-col gap-1 backdrop-blur-2xl">
              {filteredSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(idx)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between min-h-[44px] ${
                    currentSection?.id === sec.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {currentSection?.id === sec.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {filteredSections.map((sec, idx) => {
            const shortLabel = sec.title.split('.')[0];
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all min-h-[36px] flex items-center justify-center ${
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="hidden lg:block lg:col-span-4 bg-[#0a0b12] border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[78vh] overflow-y-auto">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-3 px-2">
            {t.tocTitle} ({filteredSections.length})
          </div>
          <div className="flex flex-col gap-1">
            {filteredSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-150 flex items-center justify-between ${
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

        <div className="lg:col-span-8 bg-[#0a0b12] border border-white/15 rounded-2xl p-5 sm:p-8 min-h-[500px] shadow-2xl">
          {currentSection ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-3">
                <Hash className="w-3.5 h-3.5 text-white/70" />
                <span>{currentSection.id}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 pb-3 border-b border-white/10">
                {currentSection.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6 font-mono">
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
