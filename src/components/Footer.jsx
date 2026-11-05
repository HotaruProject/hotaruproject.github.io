import React from 'react';
import { Shield, Send } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export function Footer({ content }) {
  const t = content.footer;

  return (
    <footer className="border-t border-white/[0.08] bg-[#050508] py-14 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold tracking-wider text-sm text-white">HOTARU</span>
          <span className="text-xs text-white/40 font-mono">AGPLv3</span>
        </div>

        <p className="text-xs text-white/50 text-center font-normal">
          {t.copyright}
        </p>

        <div className="flex items-center gap-5 text-sm text-white/60 flex-wrap justify-center">
          <a
            href="https://github.com/HotaruProject/Hotaru"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>{t.githubHotaru}</span>
          </a>
          <a
            href="https://github.com/HotaruProject/hotaruproject.github.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>{t.githubWeb}</span>
          </a>
          <a
            href="https://t.me/HotaruProject"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.telegramCommunity}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
