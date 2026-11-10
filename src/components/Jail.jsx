import React from 'react';
import { SectionHeader } from './SectionHeader';

function Node({ title, sub, kind, children }) {
  return (
    <div className={`jail__node jail__node--${kind}`}>
      <span className="jail__node-title">{title}</span>
      {sub ? <span className="jail__node-sub">{sub}</span> : null}
      {children}
    </div>
  );
}

export function Jail({ content, capabilities, lang }) {
  const t = content.jail;
  const caps = capabilities[lang] || capabilities.en;
  const d = t.diagram;

  return (
    <section id="architecture" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} />

        <div className="mt-[var(--space-2xl)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)]">
          <div className="lg:col-span-6">
            <div className="jail">
              <Node kind="ghost" title={d.telegram} />

              <div className="jail__link" aria-hidden="true" />

              <Node kind="kernel" title={d.kernel} sub={d.kernelSub}>
                <div className="jail__vault">
                  <span className="jail__vault-title">{d.vault}</span>
                  <span className="jail__node-sub">{d.vaultSub}</span>
                </div>
              </Node>

              <div className="jail__link" aria-hidden="true">
                <span className="jail__link-label">{d.pipe}</span>
              </div>

              <Node kind="worker" title={d.worker} sub={d.workerSub}>
                <div className="jail__tags">
                  <span className="jail__tag">{d.tmpfs}</span>
                  <span className="jail__tag">{d.uid}</span>
                </div>
              </Node>
            </div>

            <p className="jail__caption">{d.caption}</p>
          </div>

          <dl className="lg:col-span-6 m-0 border-t border-rule">
            {t.points.map((p) => (
              <div key={p.title} className="py-[var(--space-md)] border-b border-rule">
                <dt className="font-display text-title text-ink">{p.title}</dt>
                <dd className="m-0 mt-[var(--space-2xs)] text-ink-2 max-w-[52ch]">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-[var(--section-gap-l)]">
          <h3 className="text-title text-ink">{content.capabilities.title}</h3>
          <p className="mt-[var(--space-xs)] text-ink-2 max-w-[60ch]">{content.capabilities.subtitle}</p>

          <div className="cap-grid mt-[var(--space-xl)]">
            <div className="cap-grid__head" aria-hidden="true">
              <span>{content.capabilities.cols.id}</span>
              <span>{content.capabilities.cols.grant}</span>
              <span>{content.capabilities.cols.enforce}</span>
            </div>
            {caps.map((c) => (
              <div key={c.id} className="cap-grid__row">
                <code className="cap-grid__id">{c.id}</code>
                <span className="cap-grid__grant">{c.grant}</span>
                <span className="cap-grid__enforce">{c.enforce}</span>
              </div>
            ))}
          </div>

          <p className="jail__aside">{content.capabilities.aside}</p>
        </div>
      </div>
    </section>
  );
}
