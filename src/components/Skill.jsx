import React from 'react';
import { Download } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Reveal } from './Reveal.jsx';
import { CopyBlock } from './CopyBlock';

const SKILL_CMD = 'curl -fsSL https://hotaruproject.github.io/skill/SKILL.md -o HOTARU_AGENT_SKILL.md';

export function Skill({ content, copyLabels }) {
  const t = content.skill;

  return (
    <section id="skill" className="w-full py-[var(--section-gap)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <Reveal>
          <SectionHeader kicker={t.kicker} title={t.title} note={t.subtitle} />
        </Reveal>

        <div className="mt-[var(--space-xl)] grid grid-cols-1 lg:grid-cols-12 gap-x-[var(--gap-columns)] gap-y-[var(--space-lg)] items-start">
          <Reveal className="lg:col-span-5 min-w-0">
            <ul className="skill-list m-0 p-0 list-none">
              {t.points.map((point) => (
                <li key={point} className="skill-list__item">{point}</li>
              ))}
            </ul>

            <a href="./skill/SKILL.md" download="HOTARU_AGENT_SKILL.md" className="btn mt-[var(--space-lg)]">
              <Download aria-hidden="true" className="w-4 h-4" />
              <span>{t.downloadBtn}</span>
            </a>
          </Reveal>

          <Reveal className="lg:col-start-7 lg:col-span-6 min-w-0" delay={60}>
            <CopyBlock
              stacked
              className="surface-float"
              code={SKILL_CMD}
              label="SKILL.md"
              copyLabel={copyLabels.copyBtn}
              copiedLabel={copyLabels.copiedBtn}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
