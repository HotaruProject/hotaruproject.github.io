import React, { useMemo, useRef, useState } from 'react';
import { CopyBlock } from './CopyBlock';
import { SectionHeader } from './SectionHeader';

export function Console({ content, commands, install, lang, copyLabels }) {
  const t = content.run;
  const list = install[lang] || install.en;
  const cmdList = commands[lang] || commands.en;
  const [activeId, setActiveId] = useState(list[0].id);
  const tabsRef = useRef(null);

  const active = useMemo(() => list.find((i) => i.id === activeId) || list[0], [list, activeId]);

  const onKeyDown = (e) => {
    const index = list.findIndex((i) => i.id === activeId);
    let next = null;
    if (e.key === 'ArrowRight') next = (index + 1) % list.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + list.length) % list.length;
    if (next === null) return;
    e.preventDefault();
    setActiveId(list[next].id);
    const buttons = tabsRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[next]?.focus();
  };

  return (
    <section id="run" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} aside={<p className="text-sm text-muted max-w-[52ch]">{t.requirements}</p>} />

        <ul className="cmd-list mt-[var(--space-2xl)] m-0 p-0 list-none">
          {cmdList.map((c) => (
            <li key={c.cmd} className="cmd-list__row">
              <code className="cmd-list__cmd">{c.cmd}</code>
              <span className="cmd-list__desc">{c.desc}</span>
            </li>
          ))}
        </ul>

        <div className="mt-[var(--section-gap-l)]">
          <h3 className="text-title text-ink">{t.installTitle}</h3>

          <div className="mt-[var(--space-lg)]">
            <div className="install-tabs" role="tablist" aria-label={t.installTitle} ref={tabsRef} onKeyDown={onKeyDown}>
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
            >
              <p className="install-panel__note">{active.note}</p>
              <CopyBlock
                code={active.code}
                copyLabel={copyLabels.copyBtn}
                copiedLabel={copyLabels.copiedBtn}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
