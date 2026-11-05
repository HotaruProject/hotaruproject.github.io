import React from 'react';
import { Send } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Footer({ content }) {
  const t = content.footer;

  return (
    <footer className="border-t border-white/[0.08] bg-[#040406] py-14 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
          <span className="font-bold tracking-tight text-sm text-white">Hotaru</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
            agpl-3.0
          </span>
        </div>

        <p className="text-xs text-white/50 text-center font-normal px-2">
          {t.copyright}
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-white/60 flex-wrap justify-center">
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>{t.githubHotaru}</span>
          </a>
          <a
            href="https://github.com/HotaruProject/hotaruproject.github.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>{t.githubWeb}</span>
          </a>
          <a
            href="https://t.me/hotaru_ub"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.telegramCommunity}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
