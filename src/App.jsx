import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { ModulePlayground } from './components/ModulePlayground';
import { Documentation } from './components/Documentation';
import { AgentSkillSection } from './components/AgentSkillSection';
import { Footer } from './components/Footer';
import { CONTENT } from './data/content.js';

export function App() {
  const [lang, setLang] = useState('en');
  const currentContent = CONTENT[lang] || CONTENT.en;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      <Navbar lang={lang} setLang={setLang} content={currentContent} />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <Hero content={currentContent} />
        <Architecture content={currentContent} />
        <ModulePlayground content={currentContent} />
        <Documentation content={currentContent} />
        <AgentSkillSection content={currentContent} />
      </main>
      <Footer content={currentContent} />
    </div>
  );
}

export default App;
