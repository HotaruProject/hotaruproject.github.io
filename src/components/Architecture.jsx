import React from 'react';
import { Box, Lock, Shield, Cpu, Activity, LayoutGrid } from 'lucide-react';

const ICONS = {
  namespaces: Box,
  capabilities: Shield,
  vault: Lock,
  goygram: Cpu,
  singularity: LayoutGrid,
  shield: Activity,
};

export function Architecture({ content }) {
  const t = content.architecture;

  return (
    <section id="architecture" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.sectionTitle}
        </h2>
        <p className="mt-4 text-base text-white/70 leading-relaxed font-normal">
          {t.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.cards.map((c) => {
          const Icon = ICONS[c.id] || Shield;
          return (
            <div
              key={c.id}
              className="group p-6 rounded-2xl bg-[#0c0d14] border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-3">
                  {c.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  {c.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                <span>ISOLATION LAYER</span>
                <span className="text-emerald-400">ENFORCED</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
