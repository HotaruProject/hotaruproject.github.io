import React from 'react';
import { SectionHeader } from './SectionHeader';

export function Modules({ content, modules, lang }) {
  const t = content.modules;
  const list = modules[lang] || modules.en;

  return (
    <section id="modules" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} aside={<p className="text-sm text-muted">{t.note}</p>} />

        <ul className="mod-list mt-[var(--space-2xl)] m-0 p-0 list-none">
          {list.map((m) => (
            <li key={m.id} className="mod-list__row">
              <div className="mod-list__head">
                <code className="mod-list__id">{m.id}</code>
                <span className="mod-list__version">v{m.version}</span>
              </div>
              <p className="mod-list__note">{m.note}</p>
              <code className="mod-list__commands">{m.commands}</code>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
