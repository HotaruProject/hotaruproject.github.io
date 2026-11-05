<div align="center">
  <img src="https://raw.githubusercontent.com/HotaruProject/Hotaru/main/hotaru/assets/banner.png" alt="Hotaru banner" width="100%">
  <br /><br />

[![React][react-badge]][react-url]
[![Vite][vite-badge]][vite-url]
[![Tailwind][tailwind-badge]][tailwind-url]
<br />
[![GitHub Pages][pages-badge]][pages-url]
[![License][license-badge]][license-url]
[![Hotaru][hotaru-badge]][hotaru-url]

  <p>Official web portal, interactive 3D quasar visualizer, and Hotaru developer manual for the Hotaru Telegram userbot.</p>
</div>

> [!NOTE]
> HotaruWeb serves as the interactive landing page and documentation hub for Hotaru, featuring a relativistic WebGL quasar raytracer, bilingual engineering manual, and downloadable agent skill.

## Live site

The web portal is deployed to GitHub Pages:

**[https://hotaruproject.github.io/HotaruWeb/](https://hotaruproject.github.io/HotaruWeb/)**

## Features

- **Relativistic 3D quasar**: Real-time WebGL raymarched black hole with interactive camera controls (drag to orbit, wheel to zoom), gravitational bending, photon ring, and relativistic Doppler beaming.
- **Hotaru developer manual**: Comprehensive documentation covering Linux namespace sandboxing, the `.hmod` manifest schema, and complete `ctx` API method specifications.
- **Bilingual interface**: Instant runtime language switching between English and Russian across all guides and specifications.
- **Agent skill download**: Integrated `SKILL.md` distribution ready for use with AI coding assistants (Antigravity, Cursor, Claude Code, ChatGPT).
- **Responsive design**: Layout calibrated for mobile screens (390px), tablets, and ultra-wide displays.

## Local development

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Getting started

1. Clone the repository:
   ```bash
   git clone https://github.com/HotaruProject/HotaruWeb.git
   cd HotaruWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

The compiled assets are generated in `dist/`.

## Project structure

```
HotaruWeb/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── skill/
│       └── SKILL.md
├── src/
│   ├── components/
│   │   ├── AgentSkillSection.jsx
│   │   ├── Architecture.jsx
│   │   ├── Documentation.jsx
│   │   ├── Footer.jsx
│   │   ├── GithubIcon.jsx
│   │   ├── Hero.jsx
│   │   ├── ModulePlayground.jsx
│   │   ├── Navbar.jsx
│   │   └── QuasarScene.jsx
│   ├── data/
│   │   └── content.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## License

This project is open-source software licensed under the GNU AGPLv3 License.

[react-badge]: https://img.shields.io/badge/React-19.0-black?style=for-the-badge&logo=react
[react-url]: https://react.dev/
[vite-badge]: https://img.shields.io/badge/Vite-6.0-black?style=for-the-badge&logo=vite
[vite-url]: https://vite.dev/
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS-3.4-black?style=for-the-badge&logo=tailwindcss
[tailwind-url]: https://tailwindcss.com/
[pages-badge]: https://img.shields.io/badge/GitHub_Pages-Active-emerald?style=for-the-badge&logo=githubpages
[pages-url]: https://hotaruproject.github.io/HotaruWeb/
[license-badge]: https://img.shields.io/badge/License-AGPL_v3-white?style=for-the-badge
[license-url]: https://github.com/HotaruProject/HotaruWeb/blob/main/LICENSE
[hotaru-badge]: https://img.shields.io/badge/Hotaru_Core-Repository-black?style=for-the-badge&logo=telegram
[hotaru-url]: https://github.com/HotaruProject/Hotaru
