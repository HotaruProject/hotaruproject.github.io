import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CopyBlock } from './CopyBlock';
import { CopyChip } from './CopyChip.jsx';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';

export function Console({ content, commands, install, lang, copyLabels, onPickModule }) {
  const t = content.run;
  const list = install[lang] || install.en;
  const cmdList = commands[lang] || commands.en;
  const [activeId, setActiveId] = useState(list[0].id);
  const tabsRef = useRef(null);
  const [marker, setMarker] = useState({ left: 0, width: 0 });

  const active = useMemo(() => list.find((i) => i.id === activeId) || list[0], [list, activeId]);

  useEffect(() => {
    const root = tabsRef.current;
    const button = root?.querySelector('[aria-selected="true"]');
    if (!root || !button) return undefined;
    const update = () => setMarker({ left: button.offsetLeft, width: button.offsetWidth });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeId, list]);

  const onKeyDown = (event) => {
    const index = list.findIndex((i) => i.id === activeId);
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % list.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + list.length) % list.length;
    if (next === null) return;
    event.preventDefault();
    setActiveId(list[next].id);
    const buttons = tabsRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[next]?.focus();
  };

  return (
    <section id="run" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} aside={<p className="text-sm text-muted max-w-[52ch]">{t.requirements}</p>} />
        </Reveal>

        <Reveal className="mt-[var(--space-xl)]">
          <ul className="cmd-list m-0 p-0 list-none">
            {cmdList.map((c) => (
              <li key={c.cmd} className="cmd-list__row">
                <code className="cmd-list__cmd">{c.cmd}</code>
                <button
                  type="button"
                  onClick={() => onPickModule?.(c.module)}
                  className="chip chip--tiny chip--link cmd-list__owner"
                >
                  {c.module}
                </button>
                <span className="cmd-list__desc">{c.desc}</span>
                <CopyChip
                  value={c.cmd}
                  label={t.copyCmd}
                  copiedLabel={t.copiedCmd}
                  failedLabel={t.failedCmd}
                  className="cmd-list__copy chip--tight"
                  compact
                />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-[var(--section-gap-l)]" delay={60}>
          <h3 className="text-title text-ink">{t.installTitle}</h3>

          <div className="mt-[var(--space-lg)]">
            <div className="install-tabs" role="tablist" aria-label={t.installTitle} ref={tabsRef} onKeyDown={onKeyDown}>
              <span
                className="install-tabs__marker"
                style={{ transform: `translateX(${marker.left}px)`, width: `${marker.width}px` }}
                aria-hidden="true"
              />
              {list.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`install-tab-${item.id}`}
                  aria-selected={item.id === active.id}
                  aria-controls={`install-panel-${item.id}`}
                  tabIndex={item.id === active.id ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  className="install-tabs__tab"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              className="install-panel"
              role="tabpanel"
              id={`install-panel-${active.id}`}
              aria-labelledby={`install-tab-${active.id}`}
              tabIndex={0}
              key={active.id}
            >
              <p className="install-panel__note">{active.note}</p>
              <CopyBlock
                code={active.code}
                copyLabel={copyLabels.copyBtn}
                copiedLabel={copyLabels.copiedBtn}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
