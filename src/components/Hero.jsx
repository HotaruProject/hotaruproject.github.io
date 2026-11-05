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
    <section className="relative min-h-[92vh] flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <QuasarScene />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#050508]/40 via-transparent to-[#050508]" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md mb-6 animate-pulse">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-mono tracking-widest text-white/90 uppercase">{t.badge}</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed font-normal drop-shadow">
          {t.subtitle}
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <div className="text-xs font-mono text-white/50 text-left mb-2 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.installTitle}</span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/85 border border-white/20 backdrop-blur-xl shadow-2xl group transition-all hover:border-white/40">
            <code className="text-xs sm:text-sm font-mono text-white/95 overflow-x-auto whitespace-nowrap text-left pr-4 select-all">
              {installCmd}
            </code>
            <button
              onClick={copyInstall}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-all text-xs font-mono"
              title={copied ? t.copiedTooltip : t.copyTooltip}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
                  <span className="text-emerald-400 group-hover:text-black font-semibold">COPIED</span>
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('documentation')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.ctaDocs}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white border border-white/20 text-sm font-semibold hover:bg-white/15 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.ctaSkill}</span>
          </a>
        </div>

        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
          {t.metrics.map((m, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs text-white/50 font-mono">{m.label}</span>
              <span className="text-sm font-bold text-white mt-1">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
