import React, { useRef } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { QuasarScene } from './QuasarScene';

export function Hero({ content, lang, onOpenDocs }) {
  const t = content.hero;
  const copyRef = useRef(null);

  return (
    <section className="relative min-h-dvh flex flex-col justify-end w-full">
      <div className="absolute inset-0">
        <QuasarScene lang={lang} copyRef={copyRef} />
      </div>
      <div className="hero-scrim absolute inset-0 z-base pointer-events-none" />

      <div className="hero__body relative z-raised max-w-container mx-auto w-full px-[var(--gutter)] pt-[44svh] md:pt-32 pb-24 md:pb-16 pointer-events-none">
        <div className="max-w-[46rem] min-w-0 pointer-events-auto" ref={copyRef}>
          <h1 className="wordmark font-display text-poster uppercase text-ink" data-text={t.title}>{t.title}</h1>

          <p className="lead mt-[var(--space-md)] text-ink-2 max-w-[42ch]">{t.subtitle}</p>

          <div className="hero__actions mt-[var(--space-lg)]">
            <button type="button" onClick={() => onOpenDocs?.()} className="btn">
              <BookOpen aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaDocs}</span>
            </button>
            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="btn btn--quiet">
              <Download aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaSkill}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
