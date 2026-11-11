import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Jail } from './components/Jail';
import { Modules } from './components/Modules';
import { Documentation } from './components/Documentation';
import { Skill } from './components/Skill';
import { Footer } from './components/Footer';
import { FumadocsView } from './components/FumadocsView';
import { CONTENT } from './data/content.jsx';

export function App() {
  const [lang, setLang] = useState('en');
  const [moduleId, setModuleId] = useState('info');
  const [view, setView] = useState(() => (window.location.hash.startsWith('#docs') ? 'docs' : 'home'));
  const currentContent = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const selector = '.btn, .copy-block__code, .manifest__code, .doc-code-block, .doc-method__name';
    const ignite = (event) => {
      const el = event.target.closest(selector);
      if (!el) return;
      el.classList.remove('is-lit');
      void el.offsetWidth;
      el.classList.add('is-lit');
      el.addEventListener('animationend', () => el.classList.remove('is-lit'), { once: true });
    };
    const onKey = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      ignite(event);
    };
    document.addEventListener('pointerdown', ignite);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', ignite);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#docs')) {
        setView('docs');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openDocs = (target) => {
    window.location.hash = target === 'catalog' ? '#docs-catalog' : '#docs';
    setView('docs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backHome = () => {
    window.location.hash = '';
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'docs') {
    return (
      <FumadocsView
        content={currentContent}
        lang={lang}
        setLang={setLang}
        onBackToHome={backHome}
      />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col w-full">
      <Navbar
        lang={lang}
        setLang={setLang}
        content={currentContent}
        onOpenDocs={openDocs}
      />
      <main className="flex-grow w-full">
        <Hero content={currentContent} lang={lang} onOpenDocs={openDocs} />
        <Jail content={currentContent} />
        <Modules content={currentContent} lang={lang} moduleId={moduleId} onPickModule={setModuleId} />
        <Documentation content={currentContent} lang={lang} onOpenDocs={openDocs} />
        <Skill content={currentContent} copyLabels={currentContent.hero} />
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
