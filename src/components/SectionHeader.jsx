import React from 'react';

export function SectionHeader({ kicker, title, note, aside }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-md)] items-end">
      <div className="lg:col-span-6">
        {kicker ? <p className="eyebrow">{kicker}</p> : null}
        <h2 className="text-section text-ink mt-[var(--space-sm)]">{title}</h2>
      </div>
      <div className="lg:col-span-6">
        <p className="lead text-ink-2 max-w-[52ch]">{note}</p>
        {aside ? <div className="mt-[var(--space-sm)]">{aside}</div> : null}
      </div>
    </div>
  );
}
