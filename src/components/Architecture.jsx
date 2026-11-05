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
    <section id="architecture" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] w-full max-w-full overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          {t.sectionTitle}
        </h2>
        <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-white/70 leading-relaxed font-normal px-2">
          {t.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {t.cards.map((c) => {
          const Icon = ICONS[c.id] || Shield;
          return (
            <div
              key={c.id}
              className="group p-6 rounded-2xl bg-[#08090f]/90 border border-white/[0.08] hover:border-white/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/90 mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  {c.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
