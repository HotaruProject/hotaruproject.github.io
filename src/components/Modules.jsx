import React, { useMemo } from 'react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';
import { RevealGroup } from './RevealGroup.jsx';
import { CopyChip } from './CopyChip.jsx';
import { MODULES, manifestOf } from '../data/modules.jsx';
import { codeText } from '../lib/codeText.jsx';

export function Modules({ content, lang, moduleId, onPickModule }) {
  const t = content.modules;
  const active = useMemo(() => MODULES.find((m) => m.id === moduleId) || MODULES[0], [moduleId]);
  const manifest = useMemo(() => manifestOf(active), [active]);

  return (
    <section id="modules" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} />
        </Reveal>

        <RevealGroup className="mod-index mt-[var(--space-xl)]" role="tablist" aria-label={t.pickLabel}>
            {MODULES.map((m, index) => {
              const selected = m.id === active.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="module-manifest"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onPickModule?.(m.id)}
                  style={{ '--i': index }}
                  className={`mod-index__item ${selected ? 'mod-index__item--on' : ''}`}
                >
                  <span className="mod-index__name">{m.id}</span>
                  <span className="mod-index__version">{m.version}</span>
                </button>
              );
            })}
        </RevealGroup>

        <Reveal className="mt-[var(--space-lg)]" delay={60}>
          <figure className="manifest">
            <figcaption className="manifest__bar">
              <span className="manifest__file">{active.id}.hmod</span>
              <CopyChip
                value={manifest}
                label={t.copyBtn}
                copiedLabel={t.copiedBtn}
                failedLabel={t.failedBtn}
                className="chip--tight"
              />
            </figcaption>
            <pre className="manifest__code" tabIndex={0} aria-label={`${active.id}.hmod`}>
              <code>{codeText(manifest)}</code>
            </pre>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
