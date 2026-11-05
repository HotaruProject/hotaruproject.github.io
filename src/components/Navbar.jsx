import React, { useState } from 'react';
import { Shield, BookOpen, Terminal, Sparkles, Menu, X, Globe, Download } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Navbar({ lang, setLang, content, onOpenDocs }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = content.nav;

  const scrollTo = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDocsClick = () => {
    setMobileOpen(false);
    if (onOpenDocs) {
      onOpenDocs();
    } else {
      scrollTo('documentation');
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#050508]/85 border-b border-white/[0.08] transition-all w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between w-full min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 text-left group min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-200 flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold tracking-wider text-sm sm:text-base text-white truncate">HOTARU</span>
              <span className="text-[9px] text-white/50 tracking-widest font-mono -mt-1 truncate">USERBOT</span>
            </div>
          </button>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-white/70 flex-shrink-0">
            AGPLv3
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo('architecture')} className="text-xs font-mono text-white/70 hover:text-white transition-colors">
            {t.architecture}
          </button>
          <button onClick={() => scrollTo('modules')} className="text-xs font-mono text-white/70 hover:text-white transition-colors">
            {t.modules}
          </button>
          <button onClick={handleDocsClick} className="text-xs font-mono text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-white/90" />
            <span>{t.docs}</span>
          </button>
          <button onClick={() => scrollTo('agent-skill')} className="text-xs font-mono text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span>{t.skill}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/80 hover:text-white hover:border-white/30 transition-all"
            title="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{lang}</span>
          </button>

          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            title="Hotaru on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadSkill}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden flex-shrink-0">
          <button
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="px-2.5 py-1.5 rounded-lg border border-white/15 text-xs font-mono text-white/90 active:scale-95"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-white/80 hover:text-white active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#050508]/98 px-4 sm:px-5 pt-3 pb-6 flex flex-col gap-3 backdrop-blur-3xl animate-fade-in shadow-2xl w-full max-w-full overflow-hidden">
          <button
            onClick={() => scrollTo('architecture')}
            className="text-left text-sm py-2.5 text-white/80 hover:text-white border-b border-white/5"
          >
            {t.architecture}
          </button>
          <button
            onClick={() => scrollTo('modules')}
            className="text-left text-sm py-2.5 text-white/80 hover:text-white border-b border-white/5"
          >
            {t.modules}
          </button>
          <button
            onClick={handleDocsClick}
            className="text-left text-sm py-2.5 text-white/80 hover:text-white border-b border-white/5 flex items-center justify-between"
          >
            <span>{t.docs}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
              Full Manual
            </span>
          </button>
          <button
            onClick={() => scrollTo('agent-skill')}
            className="text-left text-sm py-2.5 text-white/80 hover:text-white flex items-center gap-2 border-b border-white/5"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{t.skill}</span>
          </button>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black text-sm font-semibold shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadSkill}</span>
            </a>
            <a
              href="https://github.com/HotaruProject/Hotaru"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-white text-sm"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub (AGPLv3)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
