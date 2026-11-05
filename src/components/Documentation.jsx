import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, Hash, Code, ExternalLink } from 'lucide-react';

export function Documentation({ content }) {
  const [activeSection, setActiveSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const t = content.docs;

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return t.sections;
    const q = searchQuery.toLowerCase();
    return t.sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
  }, [t.sections, searchQuery]);

  const currentSection = filteredSections[activeSection] || filteredSections[0] || t.sections[0];

  return (
    <section id="documentation" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-3">
          <Book className="w-3.5 h-3.5" />
          <span>ARCHWIKI REFERENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Hotaru Developer Manual
        </h2>
        <p className="mt-3 text-base text-white/70 max-w-2xl font-normal">
          Complete engineering reference for Linux namespace sandboxing, capabilities, and the ModuleContext API.
        </p>

        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveSection(0);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-[#0a0b10] border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[75vh] overflow-y-auto">
          <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3 px-2">
            {t.tocTitle}
          </div>
          <div className="flex flex-col gap-1">
            {filteredSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                  currentSection?.id === sec.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate pr-2">{sec.title}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#0a0b10] border border-white/10 rounded-2xl p-6 sm:p-8 min-h-[600px]">
          {currentSection ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-3">
                <Hash className="w-3.5 h-3.5 text-white/70" />
                <span>{currentSection.id}</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-6 pb-4 border-b border-white/10">
                {currentSection.title}
              </h3>
              <div className="prose prose-invert max-w-none text-white/80 font-normal leading-relaxed text-sm whitespace-pre-line space-y-4 font-sans">
                {currentSection.content}
              </div>
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
