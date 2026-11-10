import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';

export function Jail({ content }) {
  const t = content.jail;
  const d = t.diagram;
  const [active, setActive] = useState('kernel');

  const pick = (event, id) => {
    setActive(id);
    if (event) event.currentTarget.focus();
  };

  return (
    <section id="architecture" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} />
        </Reveal>

        <div className="mt-[var(--space-2xl)]">
          <Reveal>
            <div className="jail">
              <div className="jail__flow">
                <button
                  type="button"
                  onClick={(e) => pick(e, 'telegram')}
                  aria-pressed={active === 'telegram'}
                  className={`jail__node jail__node--ghost ${active === 'telegram' ? 'jail__node--on' : ''}`}
                >
                  <span className="jail__node-title">{d.telegram}</span>
                  <span className="jail__node-sub">{d.telegramSub}</span>
                </button>

                <span className="jail__arrow jail__arrow--down" aria-hidden="true" />

                <div className={`jail__node jail__node--kernel ${active === 'kernel' || active === 'vault' ? 'jail__node--on' : ''}`}>
                  <button
                    type="button"
                    onClick={(e) => pick(e, 'kernel')}
                    aria-pressed={active === 'kernel'}
                    className="jail__node-btn"
                  >
                    <span className="jail__node-title">{d.kernel}</span>
                    <span className="jail__node-sub">{d.kernelSub}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => pick(e, 'vault')}
                    aria-pressed={active === 'vault'}
                    className={`jail__vault ${active === 'vault' ? 'jail__vault--on' : ''}`}
                  >
                    <span className="jail__vault-title">{d.vault}</span>
                    <span className="jail__vault-meta">
                      <span className="jail__tag">{d.vaultAlgo}</span>
                      <span className="jail__path">{d.vaultPath}</span>
                    </span>
                  </button>
                </div>

                <div className="jail__pipe" aria-hidden="true">
                  <span className="jail__pipe-label">{d.pipe}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => pick(e, 'worker')}
                  aria-pressed={active === 'worker'}
                  className={`jail__node jail__node--worker ${active === 'worker' ? 'jail__node--on' : ''}`}
                >
                  <span className="jail__node-title">{d.worker}</span>
                  <span className="jail__node-sub jail__node-sub--text">{d.workerSub}</span>
                  <span className="jail__tags">
                    {d.ns.map((name) => (
                      <span key={name} className="jail__tag jail__tag--ns">{name}</span>
                    ))}
                    <span className="jail__tag">{d.tmpfs}</span>
                    <span className="jail__tag">{d.uid}</span>
                  </span>
                </button>
              </div>
            </div>

            <p className="jail__detail" key={active}>
              {d.details[active]}
            </p>
            <p className="jail__gates">{t.gates}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
