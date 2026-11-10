import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Capabilities } from './Capabilities.jsx';
import { Reveal } from './Reveal.jsx';

export function Jail({ content, lang, onPickModule }) {
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

        <div className="mt-[var(--space-2xl)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)]">
          <Reveal className="lg:col-span-7">
            <div className="jail">
              <div className="jail__flow">
              <button
                  type="button"
                  onClick={(e) => pick(e, 'telegram')}
                  aria-pressed={active === 'telegram'}
                  className={`jail__node jail__node--ghost ${active === 'telegram' ? 'jail__node--on' : ''}`}
                >
                  <span className="jail__node-title">{d.telegram}</span>
                </button>

                <span className="jail__arrow jail__arrow--down" aria-hidden="true" />

                <div className="jail__node jail__node--kernel">
                  <button
                    type="button"
                    onClick={(e) => pick(e, 'kernel')}
                    aria-pressed={active === 'kernel'}
                    className={`jail__node-btn ${active === 'kernel' ? 'jail__node--on' : ''}`}
                  >
                    <span className="jail__node-title">{d.kernel}</span>
                    <span className="jail__node-sub">{d.kernelSub}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => pick(e, 'vault')}
                    aria-pressed={active === 'vault'}
                    className={`jail__vault ${active === 'vault' ? 'jail__node--on' : ''}`}
                  >
                    <span className="jail__vault-title">{d.vault}</span>
                    <span className="jail__node-sub">{d.vaultSub}</span>
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
                <span className="jail__node-sub">{d.workerSub}</span>
                <span className="jail__tags">
                  <span className="jail__tag">{d.tmpfs}</span>
                  <span className="jail__tag">{d.uid}</span>
                </span>
              </button>
              </div>
            </div>

            <p className="jail__detail" key={active}>
              {d.details[active]}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={80}>
            <dl className="jail__facts">
              {t.points.map((p) => (
                <div key={p.title} className="jail__fact">
                  <dt className="jail__fact-title">{p.title}</dt>
                  <dd className="jail__fact-desc">{p.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-[var(--section-gap-l)]">
          <Reveal>
            <h3 className="text-title text-ink">{content.capabilities.title}</h3>
            <p className="mt-[var(--space-xs)] text-ink-2 max-w-[60ch]">{content.capabilities.subtitle}</p>
          </Reveal>
          <div className="mt-[var(--space-lg)]">
            <Capabilities content={content} lang={lang} onPickModule={onPickModule} />
          </div>
          <p className="jail__aside">{content.capabilities.aside}</p>
        </div>
      </div>
    </section>
  );
}
