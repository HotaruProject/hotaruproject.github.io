import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';

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
    <section id="modules" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] w-full max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-3">
            <FileCode className="w-3.5 h-3.5 text-white" />
            <span>SANDBOX EXTENSIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t.sectionTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl font-normal leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] self-start lg:self-auto max-w-full">
          {t.tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-[#06070c] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/25">
        <div className="px-4 sm:px-6 py-3 bg-[#0c0d14] border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="font-mono text-xs text-white/50 truncate ml-2">{currentTab.id}.hmod</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-200 text-xs font-mono font-medium active:scale-95"
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

        <div className="p-4 sm:p-6 overflow-x-auto no-scrollbar font-mono text-[11px] sm:text-xs md:text-sm text-white/90 leading-relaxed bg-[#06070c]">
          <pre className="selection:bg-white/20 selection:text-white">
            <code>{currentTab.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
