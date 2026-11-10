import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { QuasarScene } from './QuasarScene';
import { CopyBlock } from './CopyBlock';
import { GithubIcon } from './GithubIcon';

const INSTALL_CMD = 'curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash';

export function Hero({ content, lang, onOpenDocs }) {
  const t = content.hero;

  return (
    <section className="relative min-h-dvh flex flex-col justify-end w-full">
      <div className="absolute inset-0">
        <QuasarScene lang={lang} />
      </div>
      <div className="hero-scrim absolute inset-0 z-base pointer-events-none" />

      <div className="relative z-raised max-w-container mx-auto w-full px-[var(--gutter)] pt-[55svh] md:pt-32 pb-28 md:pb-36 pointer-events-none">
        <div className="max-w-[48rem] min-w-0 pointer-events-auto">
          <p className="eyebrow">{t.eyebrow}</p>

          <h1 className="font-display text-poster uppercase text-ink mt-[var(--space-md)]">{t.title}</h1>

          <p className="lead mt-[var(--space-lg)] text-ink-2 max-w-[44ch]">{t.subtitle}</p>

          <CopyBlock
            stacked
            className="mt-[var(--space-xl)]"
            code={INSTALL_CMD}
            label={t.installTitle}
            copyLabel={t.copyBtn}
            copiedLabel={t.copiedBtn}
          />

          <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-xs)]">
            <button type="button" onClick={() => onOpenDocs?.()} className="btn">
              <BookOpen aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaDocs}</span>
            </button>
            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="btn btn--quiet">
              <Sparkles aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaSkill}</span>
            </a>
            <a
              href="https://github.com/HotaruProject/Hotaru"
              target="_blank"
              rel="noreferrer"
              className="btn btn--quiet"
              aria-label={t.ctaGithub}
            >
              <GithubIcon className="w-4 h-4" />
              <span>{t.ctaGithub}</span>
            </a>
          </div>

          <dl className="fact-strip">
            {t.facts.map((f) => (
              <div key={f.label} className="fact-strip__item">
                <dt className="fact-strip__value">{f.value}</dt>
                <dd className="fact-strip__label">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
