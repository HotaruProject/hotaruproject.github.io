import React, { useState } from 'react';
import { BookOpen, Menu, X, Download } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function LangSwitch({ lang, setLang }) {
  return (
    <div className="flex items-center" role="group" aria-label="Language">
      <button type="button" onClick={() => setLang('ru')} aria-pressed={lang === 'ru'} className="tab">
        Рус
      </button>
      <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'} className="tab">
        Eng
      </button>
    </div>
  );
}

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
    <header className="fixed top-[var(--space-sm)] inset-x-0 z-sticky-nav px-[var(--space-sm)] pointer-events-none">
      <div className="nav-pill pointer-events-auto max-w-[64rem] mx-auto rounded-input min-h-[56px] pl-[var(--space-md)] pr-[var(--space-xs)] flex items-center justify-between gap-[var(--space-md)]">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display uppercase text-lg text-ink min-h-[44px] rounded-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Hotaru, back to top"
        >
          Hotaru
        </button>

        <nav className="hidden md:flex items-center gap-[var(--space-2xs)]" aria-label="Primary">
          <button type="button" onClick={() => scrollTo('architecture')} className="tab">
            {t.architecture}
          </button>
          <button type="button" onClick={handleDocsClick} className="tab inline-flex items-center gap-[var(--space-xs)]">
            <BookOpen aria-hidden="true" className="w-4 h-4" />
            <span>{t.docs}</span>
          </button>
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="tab inline-flex items-center"
            aria-label="Hotaru on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </nav>

        <div className="flex items-center gap-[var(--space-xs)]">
          <div className="hidden sm:block">
            <LangSwitch lang={lang} setLang={setLang} />
          </div>

          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="hidden md:inline-flex btn btn--quiet btn--sm"
          >
            <Download aria-hidden="true" className="w-4 h-4" />
            <span>{t.downloadSkill}</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden tab min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto mt-[var(--space-xs)] max-w-[64rem] mx-auto rounded-input bg-paper-2 p-[var(--space-md)] flex flex-col gap-[var(--space-2xs)]">
          <button type="button" onClick={() => scrollTo('architecture')} className="tab text-left text-md min-h-[44px]">
            {t.architecture}
          </button>
          <button type="button" onClick={handleDocsClick} className="tab text-left text-md min-h-[44px]">
            {t.docs}
          </button>
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="tab text-md min-h-[44px] inline-flex items-center gap-[var(--space-xs)]"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <div className="sm:hidden pt-[var(--space-xs)]">
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          <a
            href="./skill/SKILL.md"
            download="HOTARU_AGENT_SKILL.md"
            className="btn btn--quiet mt-[var(--space-xs)]"
          >
            <Download aria-hidden="true" className="w-4 h-4" />
            <span>{t.downloadSkill}</span>
          </a>
        </div>
      )}
    </header>
  );
}
