import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { QuasarScene } from './QuasarScene';

export function Hero({ content, lang, onOpenDocs }) {
  const [copied, setCopied] = useState(false);
  const t = content.hero;
  const installCmd = "curl -fsSL https://raw.githubusercontent.com/HotaruProject/Hotaru/main/install.sh | bash";

  const copyInstall = () => {
    navigator.clipboard?.writeText(installCmd).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      },
      () => {}
    );
  };

  return (
    <section className="relative min-h-dvh flex flex-col justify-end w-full">
      <div className="absolute inset-0">
        <QuasarScene lang={lang} />
      </div>
      <div className="hero-scrim absolute inset-0 z-base pointer-events-none" />

      <div className="relative z-raised max-w-container mx-auto w-full px-[var(--gutter)] pt-[55svh] md:pt-32 pb-28 md:pb-36 pointer-events-none">
        <div className="max-w-[40rem] min-w-0 pointer-events-auto">
          <h1 className="font-display text-poster uppercase text-ink">
            {t.title}
          </h1>

          <p className="lead mt-[var(--space-lg)] text-ink-2">
            {t.subtitle}
          </p>

          <div className="mt-[var(--space-xl)]">
            <p className="text-sm text-muted mb-[var(--space-xs)]">{t.installTitle}</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-[var(--space-xs)] min-w-0">
              <code className="flex-1 min-w-0 flex items-start min-h-[48px] px-[var(--space-md)] py-[var(--space-sm)] rounded-input bg-paper-2 text-ink font-mono text-sm leading-relaxed break-all select-all">
                <span aria-hidden="true" className="text-muted mr-[var(--space-sm)] select-none">$</span>
                {installCmd}
              </code>
              <button
                type="button"
                onClick={copyInstall}
                className="btn"
                title={copied ? t.copiedTooltip : t.copyTooltip}
              >
                {copied ? <Check aria-hidden="true" className="w-4 h-4" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
                <span aria-live="polite">{copied ? t.copiedBtn : t.copyBtn}</span>
              </button>
            </div>
          </div>

          <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]">
            <button type="button" onClick={() => onOpenDocs?.()} className="btn btn--quiet">
              <BookOpen aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaDocs}</span>
            </button>
            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="link">
              <Sparkles aria-hidden="true" className="w-4 h-4" />
              <span>{t.ctaSkill}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
