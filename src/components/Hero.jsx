import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { QuasarScene } from './QuasarScene';
import { CopyBlock } from './CopyBlock';

const INSTALL_CMD = 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash';

export function Hero({ content, lang, onOpenDocs }) {
  const t = content.hero;

  return (
    <section className="relative min-h-dvh flex flex-col justify-end w-full">
      <div className="absolute inset-0">
        <QuasarScene lang={lang} />
      </div>
      <div className="hero-scrim absolute inset-0 z-base pointer-events-none" />

      <div className="relative z-raised max-w-container mx-auto w-full px-[var(--gutter)] pt-[44svh] md:pt-32 pb-12 md:pb-16 pointer-events-none">
        <div className="max-w-[46rem] min-w-0 pointer-events-auto">
          <p className="eyebrow">{t.eyebrow}</p>

          <h1 className="font-display text-poster uppercase text-ink mt-[var(--space-md)]">{t.title}</h1>

          <p className="lead mt-[var(--space-lg)] text-ink-2 max-w-[42ch]">{t.subtitle}</p>

          <CopyBlock
            stacked
            className="surface-float mt-[var(--space-xl)]"
            code={INSTALL_CMD}
            label={t.installTitle}
            copyLabel={t.copyBtn}
            copiedLabel={t.copiedBtn}
          />

          <div className="hero__actions mt-[var(--space-lg)]">
            <button type="button" onClick={() => onOpenDocs?.()} className="btn">
              <BookOpen aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaDocs}</span>
            </button>
            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="link-arrow">
              <span>{t.ctaSkill}</span>
              <ArrowUpRight aria-hidden="true" className="w-4 h-4 link-arrow__icon" />
            </a>
            <a
              href="https://github.com/HotaruProject/Hotaru"
              target="_blank"
              rel="noreferrer"
              className="link-arrow"
            >
              <span>{t.ctaGithub}</span>
              <ArrowUpRight aria-hidden="true" className="w-4 h-4 link-arrow__icon" />
            </a>
          </div>

          <p className="spec-line mt-[var(--space-xl)]">
            {t.spec.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 ? <span className="spec-line__sep" aria-hidden="true" /> : null}
                <span className="spec-line__item">{item}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
