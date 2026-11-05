import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, Hash, Layers, ListFilter } from 'lucide-react';

export function Documentation({ content }) {
  const [activeSection, setActiveSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSelectOpen, setMobileSelectOpen] = useState(false);
  const t = content.docs;

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return t.sections;
    const q = searchQuery.toLowerCase();
    return t.sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
  }, [t.sections, searchQuery]);

  const currentSection = filteredSections[activeSection] || filteredSections[0] || t.sections[0];

  const handleSelectSection = (idx) => {
    setActiveSection(idx);
    setMobileSelectOpen(false);
  };

  return (
    <section id="documentation" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-3">
          <Book className="w-3.5 h-3.5 text-white" />
          <span>ARCHWIKI MANUAL</span>
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

      <div className="lg:hidden mb-6">
        <div className="relative">
          <button
            onClick={() => setMobileSelectOpen(!mobileSelectOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#0e101a] border border-white/20 text-xs font-mono text-white font-medium"
          >
            <div className="flex items-center gap-2 truncate">
              <Layers className="w-4 h-4 text-white/70 flex-shrink-0" />
              <span className="truncate">{currentSection?.title}</span>
            </div>
            <ListFilter className="w-4 h-4 text-white/70 flex-shrink-0 ml-2" />
          </button>

          {mobileSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0e101a] border border-white/20 shadow-2xl z-30 max-h-64 overflow-y-auto flex flex-col gap-1 backdrop-blur-2xl animate-fade-in">
              {filteredSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(idx)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
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

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filteredSections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(idx)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                currentSection?.id === sec.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {sec.title.split('.')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="hidden lg:block lg:col-span-4 bg-[#0a0b12] border border-white/10 rounded-2xl p-4 sticky top-24 max-h-[75vh] overflow-y-auto">
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-3 px-2">
            {t.tocTitle}
          </div>
          <div className="flex flex-col gap-1.5">
            {filteredSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center justify-between ${
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

        <div className="lg:col-span-8 bg-[#0a0b12] border border-white/15 rounded-2xl p-5 sm:p-8 min-h-[500px] shadow-2xl animate-fade-in key={currentSection?.id}">
          {currentSection ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-3">
                <Hash className="w-3.5 h-3.5 text-white/70" />
                <span>{currentSection.id}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6 pb-4 border-b border-white/10">
                {currentSection.title}
              </h3>
              <div className="text-white/85 font-normal leading-relaxed text-xs sm:text-sm whitespace-pre-line space-y-4 font-sans">
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
