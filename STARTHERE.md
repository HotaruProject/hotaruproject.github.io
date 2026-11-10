# STARTHERE

Read this first if you were handed the Hotaru site task without context.

## What the project is

`hotaruproject.github.io` is the public landing page for Hotaru, a modular Telegram
userbot built on GoyGram. The hero of that page is a full bleed WebGL canvas that
renders a black hole. Round 4 replaced that canvas with the black hole that
already ships inside the Hotaru observatory dashboard, so the marketing site and
the product look the same. Round 5 rebuilt the rest of the page into a real
product landing page: hierarchy, real facts, working controls, no decoration
without a job.

## Repositories

| What | Where |
| --- | --- |
| Site, the work of this round | https://github.com/HotaruProject/hotaruproject.github.io |
| Site base | `origin/main` = `02784ff`, merge of PR #25 with the 60 fps native dpr canvas |
| Site branch with the redesign | `fix/black-hole-resolution`, one commit on top of `02784ff` |
| Product repo, source of every fact on the page | https://github.com/HotaruProject/Hotaru |
| Product branch | `develop` |
| Source of truth for the black hole | `singularity/frontend/src/Scene.jsx` in the product repo |

The dashboard shader is the reference for the look. Read
`singularity/frontend/src/Scene.jsx` before touching the site canvas. Do not copy
the dashboard `App.jsx`, `HotspotLayer.jsx`, `style.css` or `CameraDirector.js`
into the site.

## Round 5, what the page looks like now

Six surfaces, in this order, each one with a single job:

| Section | Component | Job |
| --- | --- | --- |
| Hero | `src/components/Hero.jsx` | poster wordmark, one install line with a copy button, three calls to action, four facts |
| Isolation | `src/components/Jail.jsx` | the namespace jail diagram, four isolation facts, the capability gate table |
| Modules | `src/components/Modules.jsx` | the ledger of fifteen constellations with versions and commands |
| Run it | `src/components/Console.jsx` | the eight chat commands, four install paths behind tabs |
| Manual | `src/components/Documentation.jsx` | the entry into the existing `#docs` view |
| Footer | `src/components/Footer.jsx` | unchanged |

New shared pieces: `src/components/CopyBlock.jsx` (a code block with a copy
button that reports `Copied` for two seconds) and
`src/components/SectionHeader.jsx` (kicker, title, lead, optional aside).
`src/components/Architecture.jsx` was deleted, its job moved into `Jail.jsx`.

Every string of the page lives in `src/data/content.js`, in English and Russian.
The manifests, versions, capability names and commands are not written by hand,
they were read out of the product repo:

- the fifteen modules from `constellations/*.hmod`, with the `HOTARU` manifest
  id, version and command list;
- the five capability gates from the README, plus the note that the kernel knows
  ten capabilities and grants `logs` and `fetch` to everyone;
- the eight chat commands from the README table;
- the four install paths from the README: the `install.sh` one liner, Docker
  Compose, Proxmox LXC and the manual `uv` setup;
- 292 contextual MTProto methods, AGPL 3.0, Python 3.13, Linux x86_64 or
  aarch64.

Do not invent numbers on this page. If a value is not in the product repo, it
does not belong here.

## Design rules of this round

The stance is an observatory console: near monochrome paper and ink, one signal
colour for state (`--color-signal`, cyan), a display face for headlines and a
mono face for metadata.

Banned, they are the usual AI landing page tells:

- purple or indigo gradients, glow blobs, glass cards floating over the copy;
- the three card grid where every card has an icon, a title and a paragraph;
- emoji as icons, icons that carry no information;
- counters with no source, fake testimonials, fake logos;
- a heading style that is the same size as the body, and a section that is a
  wall of equal blocks;
- an empty state with a placeholder image, a dead link, a button that does
  nothing.

Kept:

- one primary action per view, visible focus rings on every control, disabled
  states that exist, `aria` on the tabs and the toggles;
- semantic elements, `dl` for the fact lists, `dl` and `dt` for the isolation
  facts, `ul` for the ledger and the commands;
- the DOM order equals the visual order, no reordered grid;
- motion only where it carries meaning, the page does not move on scroll.

## Resolution and frame policy

This is the part that was wrong twice, so do not undo it.

The canvas sits at the native resolution, `rect * dpr`, dpr capped at 3, so a
modern phone renders one to one with its own pixels. The scene is rendered into
an offscreen buffer at `rect * dpr * quality` and blitted up with a bilinear
filter. The ladder is `QUALITY = [0.8, 0.9, 1.0]` and it starts at the top, 1.0.

The loop is locked at 60 fps, `FRAME_MIN = 1000 / 61`. The quality steps down
only when the gap between draws stays above 45 ms, that is when the device
cannot hold the frame rate even at the floor of 0.8, and it steps back up as
soon as the gap falls under 26 ms. Between 22 and 60 fps the quality stays
maximal and the frame rate gives way instead. A floor below 0.8 is not
acceptable, that was the pixel mosaic.

The shader pays for the extra pixels. `pow(r2safe, 2.5)` became
`r2safe * r2safe * sqrt(r2safe)`, `pow(doppler, 3.5)` became the cube times
`sqrt`, and the step budget went from 360 to 300. The look is unchanged, the
edge of the disk is smooth at the native resolution.

The first policy dropped the resolution on every slow frame and a floor of 0.3
turned the hole into a pixel mosaic on a phone. The second one capped the
frames at 30 and made the resolution give way. The current one keeps the
picture and lets the frame rate move.

## What to delete

Nothing more in the site repo unless you find the same kind of dead code. The
old quasar pipeline is already gone: the adaptive leapfrog shader, the cpu noise
texture and the bright, blur and composite passes.

In the product repo, `singularity/frontend/src/CameraDirector.js` and
`singularity/frontend/src/DirectorPanel.jsx` are dead code and were removed in
commit `2cfabe5`. They only referenced each other.

## What to replace

Nothing else. Keep the hero layout, the install command block, the navbar, the
docs hub and the skill download exactly as they are.

## What must not come back

- hotspot markers and their layer, the site hole is a picture, not a map;
- the scene director, no presets, no `flyTo`, no `recenter`, no panel;
- a second webgl context, the hero owns the only one;
- the old generic feature list of the landing page, the sections carry real
  facts now;
- hardcoded English strings inside the components, the copy belongs in
  `src/data/content.js`;
- heavy dependencies, the site stays on react, react-dom, lucide-react, vite and
  tailwind.

## How to apply

Unpack the archive over a clone of the site repo, or apply the patch:

```bash
git clone https://github.com/HotaruProject/hotaruproject.github.io.git
cd hotaruproject.github.io
git apply hotaru-site-redesign.patch
```

The patch is verified with `git apply --check` against a pristine `origin/main`
tree at `02784ff`. It touches `src/`, `STARTHERE.md` and `README.md`.

## How to verify

```bash
npm ci
npm run build
npm run dev -- --host 0.0.0.0 --port 5173
```

Check the page at 1440x900 and at 390x844, in English and in Russian. The
console must be clean and there must be no horizontal scrollbar.

Look at the edge of the disk on a phone, it must be smooth, not a staircase of
squares. Software rendering in a sandbox makes the scene look blocky, that is
the adaptive scale reacting to a slow renderer, not a bug.

## How it ships

The site is deployed by `.github/workflows/deploy.yml`, GitHub Pages, on a push
to `main`. So the branch `fix/black-hole-resolution` has to be merged into
`main`, or the commit cherry picked onto `main`, and the workflow does the rest.

## Rules that still apply

- no comments, no emoji and no em dashes in code;
- the frontend is English only for code, the interface copy is bilingual;
- never commit `node_modules`, `dist` or `.git`;
- keep the archive naming fresh, every archive gets a new name.

## Open items

- the commit is local only, there are no github credentials in the sandbox, it
  has to be pushed by hand;
- `SKILL.md` in the site root and `public/skill/SKILL.md` are byte identical
  copies, 526 kB each. The root one is the source the repo documents, the copy
  in `public` is what the download button serves. Collapsing them is optional
  and was left alone;
- the long manual inside `src/data/docs.js` was checked against the manifests,
  the `.mods` command it mentioned does not exist and now points at the `.help`
  catalog;
- `src/components/QuasarScene.jsx` is untouched by round 5, it is exactly the
  file that shipped in PR #25.
