import React, { useState } from 'react';
import { GATES } from '../data/gates.js';
import { Reveal } from './Reveal.jsx';

export function Capabilities({ content, lang }) {
  const t = content.capabilities;
  const [activeId, setActiveId] = useState(GATES[0].id);
  const gate = GATES.find((g) => g.id === activeId) || GATES[0];

  return (
    <Reveal className="caps">
      <div className="caps__bar" role="radiogroup" aria-label={t.title}>
        {GATES.map((g) => {
          const selected = g.id === gate.id;
          return (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setActiveId(g.id)}
              className={`chip chip--gate ${selected ? 'chip--active' : ''}`}
            >
              <span className="chip__text">{g.id}</span>
            </button>
          );
        })}
      </div>

      <div className="caps__panel" key={gate.id}>
        <div className="caps__head">
          <h3 className="caps__title">{gate.title}</h3>
          <span className="caps__side">{gate.side}</span>
        </div>
        <p className="caps__detail">{gate.detail}</p>
        <dl className="caps__grid">
          <div className="caps__cell">
            <dt>{t.cols.grant}</dt>
            <dd>{gate.grant[lang] || gate.grant.en}</dd>
          </div>
          <div className="caps__cell">
            <dt>{t.cols.enforce}</dt>
            <dd>{gate.enforce[lang] || gate.enforce.en}</dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}
