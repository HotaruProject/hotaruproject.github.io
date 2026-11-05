import React, { useMemo } from 'react';
import { BookOpen, Terminal } from 'lucide-react';

const FACTS = [
  [{ en: 'License', ru: 'Лицензия' }, 'AGPLv3'],
  [{ en: 'Python', ru: 'Python' }, '3.13'],
  [{ en: 'GoyGram', ru: 'GoyGram' }, '0.8.28'],
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
        <div className="lg:col-span-5 min-w-0 flex flex-col">
          <h2 className="text-ink">{t.title}</h2>
          <p className="lead mt-[var(--space-lg)] text-ink-2">{t.subtitle}</p>

          <ol className="mt-[var(--space-2xl)] p-0 list-none flex flex-col gap-[var(--space-lg)]">
            {t.cards?.map((card) => (
              <li key={card.title}>
                <h3 className="text-title text-ink">{card.title}</h3>
                <p className="mt-[var(--space-2xs)] text-ink-2">{card.desc}</p>
              </li>
            ))}
          </ol>

          <dl className="mt-[var(--space-2xl)] m-0 flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)] pt-[var(--space-lg)] border-t border-rule">
            {FACTS.map(([k, v]) => (
              <div key={k.en}>
                <dt className="text-sm text-muted">{k[lang] || k.en}</dt>
                <dd className="m-0 text-ink num">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-[var(--space-xl)] flex flex-wrap items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xs)]">
            <button type="button" onClick={() => onOpenDocs?.('chapters')} className="btn btn--quiet">
              <BookOpen aria-hidden="true" className="w-4 h-4" />
              <span>{t.openDocsBtn}</span>
            </button>
            <button type="button" onClick={() => onOpenDocs?.('catalog')} className="link">
              <Terminal aria-hidden="true" className="w-4 h-4" />
              <span>{t.openCatalogBtn}</span>
            </button>
          </div>
        </div>

        <figure className="lg:col-start-6 lg:col-span-7 m-0 min-w-0 self-start lg:sticky lg:top-28">
          <figcaption className="text-sm text-muted mb-[var(--space-xs)] font-mono">hello_world.hmod</figcaption>
          <pre tabIndex={0} aria-label="hello_world.hmod" className="m-0 p-[var(--space-md)] sm:p-[var(--space-lg)] rounded-card bg-paper text-ink-2 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            <code>{sample}</code>
          </pre>
        </figure>
      </div>
    </section>
  );
}
