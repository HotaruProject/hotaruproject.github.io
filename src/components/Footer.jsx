import React from 'react';
import { Send } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Footer({ content }) {
  const t = content.footer;

  return (
    <footer className="w-full border-t border-rule pt-[var(--space-3xl)] pb-[var(--space-2xl)]">
      <div className="max-w-container mx-auto px-[var(--gutter)]">
        <p className="font-display text-poster uppercase text-muted select-none" aria-hidden="true">
          Hotaru
        </p>

        <div className="mt-[var(--space-xl)] flex flex-col md:flex-row md:items-end justify-between gap-[var(--space-lg)]">
          <p className="text-sm text-muted max-w-[48ch]">{t.copyright}</p>

          <ul className="m-0 p-0 list-none flex flex-wrap gap-x-[var(--space-lg)]">
            <li>
              <a href="https://github.com/HotaruProject/Hotaru" target="_blank" rel="noreferrer" className="link">
                <GithubIcon className="w-4 h-4" />
                <span>{t.githubHotaru}</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/HotaruProject/hotaruproject.github.io" target="_blank" rel="noreferrer" className="link">
                <GithubIcon className="w-4 h-4" />
                <span>{t.githubWeb}</span>
              </a>
            </li>
            <li>
              <a href="https://t.me/hotaru_ub" target="_blank" rel="noreferrer" className="link">
                <Send aria-hidden="true" className="w-4 h-4" />
                <span>{t.telegramCommunity}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
