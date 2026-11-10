import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';
import { CopyChip } from './CopyChip.jsx';
import { MODULES, manifestOf } from '../data/modules.jsx';
import { codeText } from '../lib/codeText.jsx';

export function Modules({ content, lang, moduleId, onPickModule }) {
  const t = content.modules;
  const [internalId, setInternalId] = useState(MODULES[7].id);
  const tabsRef = useRef(null);

  const activeId = moduleId || internalId;
  const active = useMemo(() => MODULES.find((m) => m.id === activeId) || MODULES[0], [activeId]);
  const manifest = useMemo(() => manifestOf(active), [active]);

  const pick = (id) => {
    setInternalId(id);
    onPickModule?.(id);
  };

  useEffect(() => {
    const root = tabsRef.current;
    const button = root?.querySelector('[aria-selected="true"]');
    if (button && document.activeElement && root?.contains(document.activeElement)) {
      button.focus();
    }
  }, [activeId]);

  const onKeyDown = (event) => {
    const index = MODULES.findIndex((m) => m.id === activeId);
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % MODULES.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + MODULES.length) % MODULES.length;
    if (next === null) return;
    event.preventDefault();
    pick(MODULES[next].id);
    const buttons = tabsRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[next]?.focus();
  };

  return (
    <section id="modules" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} aside={<p className="text-sm text-muted">{t.note}</p>} />
        </Reveal>

        <Reveal className="mt-[var(--space-xl)]">
          <div
            className="mod-rail"
            role="tablist"
            aria-label={t.pickLabel}
            ref={tabsRef}
            onKeyDown={onKeyDown}
          >
            {MODULES.map((m, index) => {
              const selected = m.id === active.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  id={`mod-tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls="mod-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => pick(m.id)}
                  style={{ '--index': index }}
                  className={`mod-card ${selected ? 'mod-card--on' : ''}`}
                >
                  <span className="mod-card__head">
                    <code className="mod-card__id">{m.id}</code>
                    <span className="mod-card__version">v{m.version}</span>
                  </span>
                  <span className="mod-card__role">{m.role[lang] || m.role.en}</span>
                  <span className="mod-card__cmds">
                    {m.commands.slice(0, 3).map((c) => (
                      <span key={c} className="chip chip--tiny chip--static">
                        .{c}
                      </span>
                    ))}
                    {m.commands.length > 3 ? (
                      <span className="chip chip--tiny chip--static">+{m.commands.length - 3}</span>
                    ) : null}
                  </span>
                  <span className="mod-card__caps">
                    {m.caps.map((c) => (
                      <span key={c} className="chip chip--tiny">
                        {c}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-[var(--space-lg)]" delay={60}>
          <figure
            className="manifest"
            id="mod-panel"
            role="tabpanel"
            aria-labelledby={`mod-tab-${active.id}`}
          >
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
            <pre className="manifest__code" tabIndex={0}>
              <code>{codeText(manifest)}</code>
            </pre>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
