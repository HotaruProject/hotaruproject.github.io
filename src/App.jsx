import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import { FumadocsView } from './components/FumadocsView';
import { CONTENT } from './data/content.js';

export function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState(() => (window.location.hash.startsWith('#docs') ? 'docs' : 'home'));
  const currentContent = CONTENT[lang] || CONTENT.en;

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
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      <Navbar
        lang={lang}
        setLang={setLang}
        content={currentContent}
        onOpenDocs={openDocs}
      />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <Hero content={currentContent} onOpenDocs={openDocs} />
        <Architecture content={currentContent} />
        <Documentation content={currentContent} onOpenDocs={openDocs} />
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
