import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { FumadocsView } from './components/FumadocsView';
import { CONTENT } from './data/content.jsx';

export function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState(() => (window.location.hash.startsWith('#docs') ? 'docs' : 'home'));
  const currentContent = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const selector = [
      '.btn',
      '.link',
      '.link-arrow',
      '.tab',
      '.doc-seg__btn',
      '.doc-chip',
      '.doc-ghost',
      '.doc-select',
      '.doc-nav__item',
      '.doc-pager__item',
      '.doc-palette__item',
      '.doc-code',
      '.doc-toolbar__hint',
      '.doc-search__clear',
    ].join(', ');
    const ignite = (event) => {
      const el = event.target.closest(selector);
      if (!el) return;
      const token = (el.pressToken || 0) + 1;
      el.pressToken = token;
      el.removeAttribute('data-lit');
      void el.offsetWidth;
      el.setAttribute('data-lit', '');
      const clear = () => {
        if (el.pressToken !== token) return;
        el.removeEventListener('animationend', onEnd);
        el.removeAttribute('data-lit');
      };
      const onEnd = (animEvent) => {
        if (animEvent.target !== el || animEvent.animationName !== 'press-light') return;
        clear();
      };
      el.addEventListener('animationend', onEnd);
      window.setTimeout(clear, 2000);
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
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
