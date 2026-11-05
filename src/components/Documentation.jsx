import React from 'react';
import { BookOpen, Terminal, ArrowRight, Layers, FileCode, Cpu, ShieldCheck } from 'lucide-react';

const CARD_ICONS = [Layers, FileCode, Terminal, Cpu];

export function Documentation({ content, onOpenDocs }) {
  const t = content.docs;

  return (
    <section id="documentation" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] w-full max-w-full overflow-hidden">
      <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#080910] to-[#040407] p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t.title || "Hotaru Module Developer Hub"}
          </h2>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-normal">
            {t.subtitle || "Documentation for building, loading, and managing third-party .hmod modules via .ld in Telegram."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {t.cards?.map((card, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length] || Layers;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#090a12]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-white/40">
            AGPLv3 • Python 3.13 • GoyGram 0.8.28
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onOpenDocs?.('catalog')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-mono transition-all duration-200 active:scale-95"
            >
              <Terminal className="w-4 h-4 text-white/70" />
              <span>{t.openCatalogBtn || "Browse 292 Methods"}</span>
            </button>

            <button
              onClick={() => onOpenDocs?.('chapters')}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-white/90 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.18)] active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.openDocsBtn || "Open Full Documentation"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
