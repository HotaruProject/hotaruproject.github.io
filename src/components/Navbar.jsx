import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Menu, X, Download } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function LangSwitch({ lang, setLang }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
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
  const [mobileClosing, setMobileClosing] = useState(false);
  const progressRef = useRef(null);
  const menuOpen = useRef(false);
  const closeTimer = useRef(0);
  const t = content.nav;

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMobileClosing(false);
    setMobileOpen(true);
  };

  const closeMenu = () => {
    setMobileClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMobileOpen(false);
      setMobileClosing(false);
    }, 200);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const bar = progressRef.current;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (menuOpen.current) closeMenu();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    menuOpen.current = mobileOpen;
  }, [mobileOpen]);

  const scrollToTop = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDocsClick = () => {
    closeMenu();
    if (onOpenDocs) {
      onOpenDocs();
    }
  };

  return (
    <>
      <header
        className="fixed top-[var(--space-sm)] inset-x-0 z-sticky-nav px-[var(--space-sm)] pointer-events-none"
      >
        <div className="nav-pill pointer-events-auto max-w-[64rem] mx-auto rounded-input min-h-[56px] pl-[var(--space-md)] pr-[var(--space-xs)] flex items-center justify-between gap-[var(--space-md)]">
          <button
            type="button"
            onClick={scrollToTop}
            className="wordmark font-display uppercase text-lg text-ink min-h-[44px] rounded-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
            aria-label="Hotaru, back to top"
          >
            Hotaru
          </button>

          <nav className="hidden md:flex items-center gap-[var(--space-2xs)]" aria-label="Primary">
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
              onClick={() => (mobileOpen ? closeMenu() : openMenu())}
              className="md:hidden tab min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
            </button>
          </div>

          <span className="nav-progress" ref={progressRef} aria-hidden="true" />
        </div>
      </header>

      {mobileOpen && (
        <div
          className={`nav-sheet fixed right-[var(--space-sm)] top-[calc(var(--space-sm)+64px)] z-sticky-nav w-[min(16.5rem,calc(100vw-2*var(--space-sm)))] rounded-input p-[var(--space-2xs)] flex flex-col gap-[2px] ${mobileClosing ? 'nav-sheet--closing' : ''}`}
        >
          <button type="button" onClick={handleDocsClick} className="tab text-left min-h-[42px] px-[var(--space-sm)]">
            {t.docs}
          </button>
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="tab min-h-[42px] px-[var(--space-sm)] inline-flex items-center gap-[var(--space-xs)]"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <div className="sm:hidden flex items-center justify-between gap-[var(--space-xs)] mt-[var(--space-2xs)] pt-[var(--space-2xs)] border-t border-rule">
            <LangSwitch lang={lang} setLang={setLang} />
            <a
              href="./skill/SKILL.md"
              download="HOTARU_AGENT_SKILL.md"
              className="tab min-h-[34px] px-[var(--space-xs)] inline-flex items-center gap-[var(--space-2xs)]"
            >
              <Download aria-hidden="true" className="w-4 h-4" />
              <span className="text-xs">{t.downloadSkill}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
