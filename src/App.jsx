import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { CONTENT } from './data/content.jsx';

const loadDocs = () => import('./components/FumadocsView');
const FumadocsView = lazy(() => loadDocs().then((m) => ({ default: m.FumadocsView })));

export function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState(() => (window.location.hash.startsWith('#docs') ? 'docs' : 'home'));
  const [docsInitialTab, setDocsInitialTab] = useState(() =>
    window.location.hash.includes('catalog') ? 'catalog' : 'chapters'
  );
  const currentContent = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (window.location.hash.startsWith('#docs')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    if (view !== 'home') return undefined;
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 2500));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const id = idle(() => loadDocs());
    return () => cancel(id);
  }, [view]);

  const openDocs = (target) => {
    setDocsInitialTab(target === 'catalog' ? 'catalog' : 'chapters');
    setView('docs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'docs') {
    return (
      <Suspense fallback={<div className="doc-shell" />}>
        <FumadocsView
          content={currentContent}
          lang={lang}
          setLang={setLang}
          onBackToHome={backHome}
          initialTab={docsInitialTab}
        />
      </Suspense>
    );
  }

  return (
    <div className="home min-h-dvh flex flex-col w-full">
      <Navbar lang={lang} setLang={setLang} content={currentContent} onOpenDocs={openDocs} />
      <main className="flex-grow min-h-0 w-full flex flex-col">
        <Hero content={currentContent} lang={lang} onOpenDocs={openDocs} />
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
