import React, { useMemo } from 'react';
import { BookOpen, Terminal } from 'lucide-react';
import { Reveal } from './Reveal.jsx';
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
  const sample = useMemo(() => firstCodeBlock(t.sections), [t.sections]);

  return (
    <section id="documentation" className="w-full bg-paper-2 py-[var(--section-gap-s)]">
      <div className="max-w-container mx-auto px-[var(--gutter)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)]">
        <Reveal className="lg:col-span-5 min-w-0 flex flex-col">
          <h2 className="text-ink">{t.title}</h2>
          <p className="lead mt-[var(--space-md)] text-ink-2 max-w-[40ch]">{t.subtitle}</p>

          <ol className="docs-toc mt-[var(--space-xl)] m-0 p-0 list-none">
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
              <span className="manifest__lang">python</span>
            </figcaption>
            <pre className="manifest__code manifest__code--tall" tabIndex={0} aria-label="hello_world.hmod">
              <code>{codeText(sample)}</code>
            </pre>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
