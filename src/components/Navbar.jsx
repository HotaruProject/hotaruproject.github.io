import React, { useState } from 'react';
import { Shield, BookOpen, Terminal, Sparkles, Menu, X, Download } from 'lucide-react';
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
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none flex flex-col items-center w-full max-w-full">
      <div className="pointer-events-auto w-full max-w-5xl rounded-full border border-white/[0.08] bg-[#07070a]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-3.5 sm:px-5 h-13 sm:h-14 flex items-center justify-between transition-all min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left group min-w-0 active:scale-95 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold tracking-tight text-sm sm:text-base text-white truncate">
                Hotaru
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 flex-shrink-0">
                agpl-3.0
              </span>
            </div>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]">
          <button
            onClick={() => scrollTo('architecture')}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            {t.architecture}
          </button>
          <button
            onClick={handleDocsClick}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono text-white/80 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-white/90" />
            <span>{t.docs}</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <div className="flex rounded-full border border-white/[0.08] bg-black/50 p-0.5">
            <button
              onClick={() => setLang('ru')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                lang === 'ru'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                lang === 'en'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex p-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            title="Hotaru on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadSkill}</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-white/80 hover:text-white active:scale-95 border border-white/10 bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#07070a]/98 px-5 py-4 flex flex-col gap-2.5 backdrop-blur-3xl animate-fade-in shadow-2xl">
          <button
            onClick={() => scrollTo('architecture')}
            className="text-left text-xs font-mono py-2 text-white/80 hover:text-white border-b border-white/5 flex items-center justify-between"
          >
            <span>{t.architecture}</span>
          </button>
          <button
            onClick={handleDocsClick}
            className="text-left text-xs font-mono py-2 text-white/80 hover:text-white border-b border-white/5 flex items-center justify-between"
          >
            <span>{t.docs}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              Manual & 292 Methods
            </span>
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black text-xs font-semibold shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadSkill}</span>
            </a>
            <a
              href="https://github.com/HotaruProject/Hotaru"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/80 text-xs font-mono"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub (AGPLv3)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
