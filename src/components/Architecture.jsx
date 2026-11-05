import React from 'react';

export function Architecture({ content }) {
  const t = content.architecture;

  return (
    <section id="architecture" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)]">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <h2 className="text-ink">{t.sectionTitle}</h2>
          <p className="lead mt-[var(--space-lg)] text-ink-2">{t.sectionSubtitle}</p>
        </div>

        <dl className="lg:col-span-8 m-0 border-t border-rule">
          {t.cards.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-8 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xs)] py-[var(--space-lg)] border-b border-rule"
            >
              <dt className="md:col-span-3 font-display text-title text-ink">{c.title}</dt>
              <dd className="md:col-span-5 m-0 text-ink-2">{c.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
