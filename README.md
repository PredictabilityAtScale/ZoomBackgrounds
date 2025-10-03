# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # ZoomBackgrounds

  ZoomBackgrounds is a React + TypeScript web tool for generating mirrored Zoom and Microsoft Teams backgrounds for entire teams. Enter company branding, upload your logo, supply teammate details, and export polished PNGs or a ready-to-share ZIP bundle—every image is pre-flipped so it reads correctly on camera.

  ## ✨ Highlights

  - **Brand-safe layouts** – Four curated gradient themes with glassmorphism overlays that feel conference-ready.
  - **Batch friendly** – Manage a roster of teammates, duplicate entries, and export everything as a single ZIP file.
  - **Mirrored output** – Each canvas render is flipped horizontally before download, matching Zoom/Teams expectations.
  - **Logo aware** – Drop in a transparent PNG/SVG/JPEG logo and it is scaled automatically with metadata feedback.
  - **Offline ready** – All rendering happens client-side; no accounts, uploads, or server dependencies.

  ## 🚀 Getting started

  Prerequisites: Node.js 18+ and npm.

  ```pwsh
  git clone <repo-url>
  cd ZoomBackgrounds
  npm install
  npm run dev
  ```

  The dev server runs at <http://localhost:5173>. Hot Module Reload is enabled by default.

  ## 🧭 Using the generator

  1. **Company Profile** – Fill out your company name, tagline, and contact channels. These appear on every backdrop.
  2. **Logo** – Upload an optional logo (PNG/JPEG/SVG, ≤ 4 MB). The preview panel shows dimension metadata and lets you remove it.
  3. **Backdrop Style** – Pick one of the gradient themes defined in `src/constants/backgrounds.ts`. Update or add new themes there.
  4. **Team Members** – Add colleagues, adjust their details, duplicate entries for similar roles, and manage pronouns/phones.
  5. **Preview** – The live preview is mirrored; this is intentional. The image you see is the camera-ready version.
  6. **Download** –
     - *Download for {Person}* renders a single PNG.
     - *Download all backgrounds* builds a `.zip` that contains every teammate’s file (naming includes the company, person, and theme).

  ## 🛠️ Customization tips

  - **Adjust layouts** in `src/utils/backdrop.ts` where the canvas drawing logic lives (gradient, shapes, typography, positioning).
  - **Default data** for the first render sits in `src/constants/defaults.ts`. Update or remove sample records to match your team.
  - **Styling** is consolidated in `src/App.css`. Components share utility classes like `.panel`, `.ghost`, and `.primary`.

  ## 📦 Scripts

  ```pwsh
  npm run dev     # Start the Vite dev server
  npm run build   # Type-check and produce a production build in dist/
  npm run lint    # Run ESLint across the project
  npm run preview # Preview the production build locally
  ```

  ## ✅ Quality checks

  - `npm run build`
  - `npm run lint`

  Both commands are part of the default workflow; run them before shipping updates to ensure consistent output.

  ## 📄 License

  This project is provided without a specific license. Add your preferred license file if you plan to share or distribute the tool.
