import React from 'react';
import { Download, CheckCircle2, Bot, ArrowRight, FileText } from 'lucide-react';

export function AgentSkillSection({ content }) {
  const t = content.skill;

  return (
    <section id="agent-skill" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] w-full max-w-full overflow-hidden">
      <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-b from-[#0c0d16] to-[#050508] p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white mb-5">
            <Bot className="w-3.5 h-3.5 text-white" />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t.title}
          </h2>

          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-normal">
            {t.subtitle}
          </p>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {t.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-white/90 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.18)] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadBtn}</span>
            </a>

            <a
              href="./skill/SKILL.md"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 border border-white/20 text-white font-medium text-xs sm:text-sm hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{t.previewBtn}</span>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
