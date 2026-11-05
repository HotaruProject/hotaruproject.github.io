import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, FileCode } from 'lucide-react';

export function ModulePlayground({ content }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const t = content.modules;

  const currentTab = t.tabs[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="modules" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-3">
            <FileCode className="w-3.5 h-3.5" />
            <span>EXTENSIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="mt-3 text-base text-white/70 max-w-2xl font-normal">
            {t.sectionSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          {t.tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                activeTab === idx
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-[#08090e] overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#0e1017] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-white/50">{currentTab.id}.hmod</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white text-white hover:text-black transition-all text-xs font-mono"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 overflow-x-auto font-mono text-xs sm:text-sm text-white/90 leading-relaxed bg-[#08090e]">
          <pre>
            <code>{currentTab.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
