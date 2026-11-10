import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Jail } from './components/Jail';
import { Modules } from './components/Modules';
import { Console } from './components/Console';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import { FumadocsView } from './components/FumadocsView';
import { CONTENT, commands, install } from './data/content.js';

export function App() {
  const [lang, setLang] = useState('en');
  const [moduleId, setModuleId] = useState('info');
  const [view, setView] = useState(() => (window.location.hash.startsWith('#docs') ? 'docs' : 'home'));
  const currentContent = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

  const pickModule = (id) => {
    setModuleId(id);
    const target = document.getElementById('modules');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        <Jail content={currentContent} lang={lang} onPickModule={pickModule} />
        <Modules content={currentContent} lang={lang} moduleId={moduleId} onPickModule={setModuleId} />
        <Console
          content={currentContent}
          commands={commands}
          install={install}
          lang={lang}
          copyLabels={currentContent.hero}
          onPickModule={pickModule}
        />
        <Documentation content={currentContent} lang={lang} onOpenDocs={openDocs} />
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
