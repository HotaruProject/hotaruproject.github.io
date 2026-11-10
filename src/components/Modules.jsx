import React, { useMemo } from 'react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';
import { RevealGroup } from './RevealGroup.jsx';
import { CopyState } from './CopyBlock.jsx';
import { useCopy } from '../lib/useCopy.jsx';
import { MODULES, manifestOf } from '../data/modules.jsx';
import { codeText } from '../lib/codeText.jsx';

function ManifestPanel({ id, manifest, labels }) {
  const [state, copy] = useCopy();

  return (
    <figure className="manifest">
      <figcaption className="manifest__bar">
        <span className="manifest__file">{id}.hmod</span>
        <CopyState
          state={state}
          copyLabel={labels.copyBtn}
          copiedLabel={labels.copiedBtn}
          failedLabel={labels.failedBtn}
        />
      </figcaption>
      <button
        type="button"
        onClick={() => copy(manifest)}
        className={`manifest__code ${state === 'copied' ? 'manifest__code--done' : ''}`}
        title={labels.copyBtn}
      >
        <code>{codeText(manifest)}</code>
        <span className="visually-hidden">{labels.copyBtn}</span>
      </button>
    </figure>
  );
}

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

        <RevealGroup className="mod-index mt-[var(--space-xl)]" delay={2} role="tablist" aria-label={t.pickLabel}>
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
          <ManifestPanel id={active.id} manifest={manifest} labels={t} />
        </Reveal>
      </div>
    </section>
  );
}
