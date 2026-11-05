import React from 'react';
import { Sparkles, Download, CheckCircle2, Bot, ArrowRight, FileText } from 'lucide-react';

export function AgentSkillSection({ content }) {
  const t = content.skill;

  return (
    <section id="agent-skill" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-[#0e101a] to-[#07080d] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white mb-6">
            <Bot className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {t.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed font-normal">
            {t.subtitle}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {t.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-white/80 font-normal">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadBtn}</span>
            </a>

            <a
              href="./skill/SKILL.md"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-sm hover:bg-white/10 transition-all"
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
