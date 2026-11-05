import React, { useState } from 'react';
import { Copy, Check, Terminal, ArrowRight, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { QuasarScene } from './QuasarScene';

export function Hero({ content }) {
  const [copied, setCopied] = useState(false);
  const t = content.hero;
  const installCmd = "curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash";

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[94vh] flex items-center justify-center pt-20 sm:pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <QuasarScene />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#050508]/60 via-[#050508]/20 to-[#050508]" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/70 backdrop-blur-md mb-6 animate-glow-pulse">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-white/90 uppercase">{t.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black -tracking-[0.04em] text-white drop-shadow-2xl leading-none">
          {t.title}
        </h1>

        <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-white/75 leading-relaxed font-normal px-2">
          {t.subtitle}
        </p>

        <div className="mt-8 w-full max-w-xl px-2 sm:px-0">
          <div className="text-[11px] font-mono text-white/50 text-left mb-2 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-white/70" />
            <span>{t.installTitle}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2.5 sm:p-3 rounded-xl bg-black/85 border border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/40 gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 px-2 py-1 overflow-x-auto no-scrollbar text-left flex-grow">
              <span className="text-emerald-400 font-mono text-xs select-none">$</span>
              <code className="text-xs sm:text-sm font-mono text-white/95 whitespace-nowrap select-all">
                {installCmd}
              </code>
            </div>

            <button
              onClick={copyInstall}
              className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
              title={copied ? t.copiedTooltip : t.copyTooltip}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 w-full max-w-md sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
          <button
            onClick={() => scrollTo('documentation')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.ctaDocs}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 text-white border border-white/20 text-sm font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{t.ctaSkill}</span>
          </a>
        </div>

        <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl px-2 sm:px-0">
          {t.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0c0d14]/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:border-white/25 hover:-translate-y-0.5"
            >
              <span className="text-[11px] text-white/50 font-mono tracking-wide">{m.label}</span>
              <span className="text-xs sm:text-sm font-bold text-white mt-1">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
