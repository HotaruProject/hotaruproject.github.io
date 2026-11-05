import React, { useState } from 'react';
import { Shield, BookOpen, Terminal, Sparkles, Menu, X, Globe, Download } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Navbar({ lang, setLang, content }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = content.nav;

  const scrollTo = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050508]/80 border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 text-left group">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-base text-white">HOTARU</span>
              <span className="text-[10px] text-white/50 tracking-widest font-mono -mt-1">USERBOT</span>
            </div>
          </button>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-white/70">
            v1.0.0
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo('architecture')} className="text-sm text-white/70 hover:text-white transition-colors">
            {t.architecture}
          </button>
          <button onClick={() => scrollTo('modules')} className="text-sm text-white/70 hover:text-white transition-colors">
            {t.modules}
          </button>
          <button onClick={() => scrollTo('documentation')} className="text-sm text-white/70 hover:text-white transition-colors">
            {t.docs}
          </button>
          <button onClick={() => scrollTo('agent-skill')} className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span>{t.skill}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/10 text-xs font-mono text-white/80 hover:text-white hover:border-white/30 transition-all"
            title="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{lang}</span>
          </button>

          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            title="Hotaru on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-white/90 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadSkill}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="px-2 py-1 rounded border border-white/10 text-xs font-mono text-white/80"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#050508]/95 px-4 pt-3 pb-6 flex flex-col gap-4 backdrop-blur-2xl">
          <button onClick={() => scrollTo('architecture')} className="text-left text-sm py-2 text-white/80 hover:text-white">
            {t.architecture}
          </button>
          <button onClick={() => scrollTo('modules')} className="text-left text-sm py-2 text-white/80 hover:text-white">
            {t.modules}
          </button>
          <button onClick={() => scrollTo('documentation')} className="text-left text-sm py-2 text-white/80 hover:text-white">
            {t.docs}
          </button>
          <button onClick={() => scrollTo('agent-skill')} className="text-left text-sm py-2 text-white/80 hover:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.skill}</span>
          </button>
          <div className="pt-2 flex flex-col gap-2 border-t border-white/10">
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-white text-black text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadSkill}</span>
            </a>
            <a
              href="https://github.com/HotaruProject/Hotaru"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-white/20 text-white text-sm"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
