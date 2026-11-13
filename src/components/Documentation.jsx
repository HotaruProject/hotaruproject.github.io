import React, { useMemo } from 'react';
import { BookOpen, Terminal } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';
import { CopyState } from './CopyBlock.jsx';
import { useCopy } from '../lib/useCopy.jsx';
import { codeText } from '../lib/codeText.jsx';

const FACTS = [
  [{ en: 'License', ru: 'Лицензия' }, 'AGPLv3'],
  [{ en: 'Python', ru: 'Python' }, '3.13'],
  [{ en: 'Modules', ru: 'Модулей' }, '15'],
];

function firstCodeBlock(sections) {
  const quickstart = sections?.[0]?.content || '';
  const match = /```python\n([\s\S]*?)```/.exec(quickstart);
  return match ? match[1].trimEnd() : '';
}

export function Documentation({ content, lang = 'en', onOpenDocs }) {
  const t = content.docs;
  const labels = content.modules;
  const sample = useMemo(() => firstCodeBlock(t.sections), [t.sections]);
  const [state, copy] = useCopy();

  return (
    <section id="documentation" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={content.nav.docs} title={t.title} note={t.subtitle} />
        </Reveal>

        <div className="mt-[var(--space-xl)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)] items-start">
          <Reveal className="lg:col-span-5 min-w-0 flex flex-col">
            <ol className="docs-toc m-0 p-0 list-none">
              {t.cards?.map((card, index) => (
                <li key={card.title} className="docs-toc__row">
                  <span className="docs-toc__num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="docs-toc__title">{card.title}</span>
                </li>
              ))}
            </ol>

            <dl className="mt-[var(--space-xl)] m-0 flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)] pt-[var(--space-lg)] border-t border-rule">
              {FACTS.map(([k, v]) => (
                <div key={k.en}>
                  <dt className="text-sm text-muted">{k[lang] || k.en}</dt>
                  <dd className="m-0 text-ink num">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]">
              <button type="button" onClick={() => onOpenDocs?.('chapters')} className="btn">
                <BookOpen aria-hidden="true" className="w-4 h-4" />
                <span>{t.openDocsBtn}</span>
              </button>
              <button type="button" onClick={() => onOpenDocs?.('catalog')} className="link">
                <Terminal aria-hidden="true" className="w-4 h-4" />
                <span>{t.openCatalogBtn}</span>
              </button>
            </div>
          </Reveal>

          <Reveal className="lg:col-start-6 lg:col-span-7 m-0 min-w-0 self-start lg:sticky lg:top-28" delay={80}>
            <figure className="manifest">
              <figcaption className="manifest__bar">
                <span className="manifest__file">hello_world.hmod</span>
                <span className="flex items-center gap-[var(--space-sm)]">
                  <span className="manifest__lang">python</span>
                  <CopyState
                    state={state}
                    copyLabel={labels.copyBtn}
                    copiedLabel={labels.copiedBtn}
                    failedLabel={labels.failedBtn}
                  />
                </span>
              </figcaption>
              <button
                type="button"
                onClick={() => copy(sample)}
                className={`manifest__code manifest__code--tall ${state === 'copied' ? 'manifest__code--done' : ''}`}
                title={labels.copyBtn}
              >
                <code>{codeText(sample)}</code>
                <span className="visually-hidden">{labels.copyBtn}</span>
              </button>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
