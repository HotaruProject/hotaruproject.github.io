<div align="center">
  <img src="https://raw.githubusercontent.com/HotaruProject/Hotaru/develop/hotaru/assets/banner.png" alt="Hotaru banner" width="100%">
  <br /><br />

[![React][react-badge]][react-url]
[![Vite][vite-badge]][vite-url]
[![Tailwind][tailwind-badge]][tailwind-url]
<br />
[![GitHub Pages][pages-badge]][pages-url]
[![License][license-badge]][license-url]
[![Hotaru Core][hotaru-badge]][hotaru-url]
[![Telegram][telegram-badge]][telegram-url]

  <p>Official web portal, interactive 3D quasar visualization, and documentation for Hotaru.</p>
</div>

> [!TIP]
> Visit the live portal and interactive documentation at **[hotaruproject.github.io](https://hotaruproject.github.io/)**.

> [!NOTE]
> HotaruWeb serves as the public landing page and documentation manual for the [Hotaru](https://github.com/HotaruProject/Hotaru) Telegram userbot. It features a real-time WebGL raymarched black hole, a dedicated Fumadocs documentation view with all 292 extended MTProto methods, and downloadable AI coding agent instructions.

## Live Deployment

- **Web Portal**: [https://hotaruproject.github.io/](https://hotaruproject.github.io/)
- **Documentation Engine**: [https://hotaruproject.github.io/#docs](https://hotaruproject.github.io/#docs)
- **AI Agent Skill**: [https://hotaruproject.github.io/skill/SKILL.md](https://hotaruproject.github.io/skill/SKILL.md)

## Key Features

- **Relativistic 3D Quasar**: WebGL raymarched black hole with photon sphere, accretion disk turbulence, gravitational lensing, and interactive orbital camera controls.
- **Dedicated Documentation Engine**: Fumadocs-style full-page interface featuring 10 deep developer chapters and live search across all 292 extended MTProto methods.
- **Interactive MTProto Methods Explorer**: Namespace filters (`messages`, `channels`, `account`, `stories`, `contacts`, `stickers`, `stats`), parameter specification tables, and one-click code snippet copying.
- **Liquid Glass Interface**: Apple-style optical glassmorphism with dynamic rim highlights, specular top sheen, and tactile copy buttons with emerald feedback.
- **Vector & Limen Aesthetics**: Minimalist floating glass pill navigation, deep obsidian cards (`#08090f`), and fluid typography.
- **Bilingual Support**: Instant runtime switching between English (`en`) and Russian (`ru`).
- **Mobile Containment**: Strict viewport bounds prevention (`overflow-x-hidden`, responsive flex-wrap, isolated horizontal code blocks).

## Project Structure

```
HotaruWeb/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml       # GitHub Pages deployment pipeline
│   │   └── codeql.yml       # CodeQL security scanning
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   └── skill/
│       └── SKILL.md         # Downloadable master AI agent skill
├── src/
│   ├── components/
│   │   ├── AgentSkillSection.jsx
│   │   ├── Architecture.jsx
│   │   ├── Documentation.jsx
│   │   ├── Footer.jsx
│   │   ├── FumadocsView.jsx # Dedicated documentation engine
│   │   ├── GithubIcon.jsx
│   │   ├── Hero.jsx         # Hero with Liquid Glass install card
│   │   ├── ModulePlayground.jsx
│   │   ├── Navbar.jsx       # Floating glass pill navigation
│   │   └── QuasarScene.jsx  # WebGL raymarched quasar shader
│   ├── data/
│   │   ├── catalog.js       # 292 extended MTProto methods
│   │   ├── content.js       # Localized interface strings
│   │   └── docs.js          # In-depth developer chapters
│   ├── App.jsx
│   ├── index.css            # Base styles & Liquid Glass utilities
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Setup & Running

1. Clone the repository:
   ```bash
   git clone https://github.com/HotaruProject/hotaruproject.github.io.git
   cd hotaruproject.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

The compiled assets are generated in `dist/`.

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `vite` | Starts local Vite dev server with hot module replacement |
| `build` | `vite build` | Compiles optimized production bundle into `dist/` |
| `preview` | `vite preview` | Serves production build locally for verification |

## License

This project is open-source software licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for details.

[react-badge]: https://img.shields.io/badge/React-19.0-333333.svg?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[vite-badge]: https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev/
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[pages-badge]: https://img.shields.io/badge/GitHub_Pages-Active-emerald.svg?style=for-the-badge&logo=githubpages&logoColor=white
[pages-url]: https://hotaruproject.github.io/
[license-badge]: https://img.shields.io/badge/License-AGPL_3.0-blue.svg?style=for-the-badge
[license-url]: LICENSE
[hotaru-badge]: https://img.shields.io/badge/Hotaru_Core-Repository-000000.svg?style=for-the-badge&logo=telegram&logoColor=white
[hotaru-url]: https://github.com/HotaruProject/Hotaru
[telegram-badge]: https://img.shields.io/badge/Telegram-Community-2CA5E0.svg?style=for-the-badge&logo=telegram&logoColor=white
[telegram-url]: https://t.me/HotaruProject
