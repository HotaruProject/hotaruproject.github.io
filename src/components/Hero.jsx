import React, { useState } from 'react';
import { Copy, Check, Terminal, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { QuasarScene } from './QuasarScene';

export function Hero({ content, onOpenDocs }) {
  const [copied, setCopied] = useState(false);
  const t = content.hero;
  const installCmd = "curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash";

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-[96vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 overflow-hidden w-full max-w-full">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none md:pointer-events-auto">
        <QuasarScene />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#050508]/50 via-[#050508]/20 to-[#050508]" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center w-full max-w-full min-w-0 overflow-hidden">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black -tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/70 drop-shadow-2xl leading-none break-words max-w-full">
          {t.title}
        </h1>

        <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-normal px-2 break-words">
          {t.subtitle}
        </p>

        <div className="mt-8 w-full max-w-xl px-0 min-w-0">
          <div className="text-[11px] font-mono text-white/40 text-left mb-2 flex items-center gap-2 px-1">
            <Terminal className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <span className="truncate">{t.installTitle}</span>
          </div>

          <div className="liquid-glass-container rounded-2xl sm:rounded-full p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full max-w-full min-w-0 transition-all duration-300 hover:border-white/35">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            <div className="absolute -top-10 left-1/4 w-1/2 h-14 bg-white/[0.08] blur-xl pointer-events-none rounded-full" />

            <div className="flex items-center gap-2.5 px-3 py-1.5 overflow-x-auto no-scrollbar text-left flex-grow min-w-0 w-full max-w-full relative z-10">
              <span className="text-emerald-400 font-mono text-xs select-none flex-shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]">$</span>
              <code className="text-[11px] sm:text-xs md:text-sm font-mono text-white/95 whitespace-nowrap select-all inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {installCmd}
              </code>
            </div>

            <button
              onClick={copyInstall}
              className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-mono font-bold tracking-wider liquid-glass-button active:scale-95 ${
                copied ? 'liquid-glass-button-copied' : ''
              }`}
              title={copied ? t.copiedTooltip : t.copyTooltip}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white/80" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 w-full max-w-md sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-0">
          <button
            onClick={() => onOpenDocs?.()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-white/90 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.18)] active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.ctaDocs}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/5 text-white/90 border border-white/15 text-xs sm:text-sm font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white/80" />
            <span>{t.ctaSkill}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
