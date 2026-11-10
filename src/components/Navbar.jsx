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
  const [section, setSection] = useState('');
  const headRef = useRef(null);
  const progressRef = useRef(null);
  const menuOpen = useRef(false);
  const t = content.nav;

  const links = [
    { id: 'architecture', label: t.architecture },
    { id: 'modules', label: t.modules },
    { id: 'run', label: t.run },
  ];

  useEffect(() => {
    const head = headRef.current;
    const bar = progressRef.current;
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      last = y;
      const narrow = window.innerWidth < 768;
      const next = narrow && y >= 96 && delta > 0;
      if (next === hidden) return;
      hidden = next;
      if (head) head.classList.toggle('nav-head--hidden', hidden && !menuOpen.current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    menuOpen.current = mobileOpen;
    const head = headRef.current;
    if (mobileOpen && head) head.classList.remove('nav-head--hidden');
  }, [mobileOpen]);

  useEffect(() => {
    const ids = ['architecture', 'modules', 'run', 'documentation', 'skill'];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
    <>
      <header
        ref={headRef}
        className="nav-head fixed top-[var(--space-sm)] inset-x-0 z-sticky-nav px-[var(--space-sm)] pointer-events-none"
      >
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
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollTo(l.id)}
                aria-current={section === l.id ? 'true' : undefined}
                className="tab"
              >
                {l.label}
              </button>
            ))}
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

          <span className="nav-progress" ref={progressRef} aria-hidden="true" />
        </div>
      </header>

      {mobileOpen && (
        <div className="nav-sheet fixed inset-0 z-sticky px-[var(--gutter)] pt-[calc(var(--space-sm)+72px)] pb-[var(--space-xl)] flex flex-col gap-[var(--space-2xs)] overflow-y-auto">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => scrollTo(l.id)}
              aria-current={section === l.id ? 'true' : undefined}
              className="tab text-left text-md min-h-[52px]"
            >
              {l.label}
            </button>
          ))}
          <button type="button" onClick={handleDocsClick} className="tab text-left text-md min-h-[52px]">
            {t.docs}
          </button>
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="tab text-md min-h-[52px] inline-flex items-center gap-[var(--space-xs)]"
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
            className="btn btn--quiet mt-[var(--space-xs)] w-full"
          >
            <Download aria-hidden="true" className="w-4 h-4" />
            <span>{t.downloadSkill}</span>
          </a>
        </div>
      )}
    </>
  );
}
