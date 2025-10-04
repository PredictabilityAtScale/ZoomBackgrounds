# Zoom Backgrounder



> **Create professional, mirrored backgrounds for your whole team in minutes.**This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



🌐 **Live App:** [zoombackgrounder.com](https://zoombackgrounder.com)  Currently, two official plugins are available:

📂 **Open Source:** [github.com/PredictabilityAtScale/ZoomBackgrounds](https://github.com/PredictabilityAtScale/ZoomBackgrounds)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

Zoom Backgrounder is a free, open-source web application for creating professional video call backgrounds for Zoom, Microsoft Teams, and other video conferencing platforms. Built with React + TypeScript, it generates custom 1920×1080 backgrounds with your company branding, team member information, and location details—all rendered client-side with no server uploads required.


- 🎨 **8 Professional Themes** – Choose from beautiful gradient backgrounds including Glacier Haze, Ember Sky, Royal Amethyst, Ocean Breeze, and more## Expanding the ESLint configuration

- 🪞 **Automatic Mirroring** – Generates both standard and mirrored versions so text appears correctly when you see yourself on camera

- 🏢 **Company Branding** – Add your company name, tagline, website, and logo to every backgroundIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- 👥 **Bulk Team Export** – Create backgrounds for your entire team and download as a ZIP file

- 📍 **Location Pins** – Shows team member locations with accurate map coordinates (36+ cities, 50+ countries)```js

- ⚙️ **Customizable Scaling** – Independent controls for font size, logo size, and map sizeexport default defineConfig([

- 🔒 **Privacy First** – All processing happens in your browser—no data is uploaded to any server  # ZoomBackgrounds

- 💾 **Instant Download** – Get high-quality PNG files ready to use immediately

  ZoomBackgrounds is a React + TypeScript web tool for generating mirrored Zoom and Microsoft Teams backgrounds for entire teams. Enter company branding, upload your logo, supply teammate details, and export polished PNGs or a ready-to-share ZIP bundle—every image is pre-flipped so it reads correctly on camera.

---

## 🚀 Quick Start

1. Visit [zoombackgrounder.com](https://zoombackgrounder.com)  - **Logo aware** – Drop in a transparent PNG/SVG/JPEG logo and it is scaled automatically with metadata feedback.

2. Fill in your company details (name, tagline, website)  - **Offline ready** – All rendering happens client-side; no accounts, uploads, or server dependencies.

3. Upload your company logo (optional, PNG/SVG/JPG)

4. Add team members with their names, roles, locations, and contact info  ## 🚀 Getting started

5. Select your preferred background theme

6. Adjust scaling sliders if needed  Prerequisites: Node.js 18+ and npm.

7. Download individual backgrounds or a ZIP file with all team members


### Running Locally  git clone <repo-url>
**Prerequisites:** Node.js 18+ and npm

```bash  
  cd ZoomBackgrounds
  npm install
  npm run dev
```


## 📖 How to Use

  - **Adjust layouts** in `src/utils/backdrop.ts` where the canvas drawing logic lives (gradient, shapes, typography, positioning).

### 1. Company Profile  - **Default data** for the first render sits in `src/constants/defaults.ts`. Update or remove sample records to match your team.

  - **Styling** is consolidated in `src/App.css`. Components share utility classes like `.panel`, `.ghost`, and `.primary`.

Enter your company information in the left panel:

- **Company Name** – Appears on every background  ## 📦 Scripts

- **Tagline** – Short description of your company

- **Website** – Your company's website URL  ```pwsh

  npm run dev     # Start the Vite dev server

### 2. Upload Logo (Optional)  npm run build   # Type-check and produce a production build in dist/

  npm run lint    # Run ESLint across the project

- Click "Choose a file" to upload your company logo  npm run preview # Preview the production build locally

- Supported formats: PNG, JPG, SVG (max 4 MB)  ```

- Logo appears in the top-right corner of backgrounds

- Use the logo scale slider to adjust size (50%–150%)  ## ✅ Quality checks



### 3. Choose Background Theme  - `npm run build`

  - `npm run lint`

Select from 8 professionally designed gradient themes:

- **Glacier Haze** – Cool blue tones  Both commands are part of the default workflow; run them before shipping updates to ensure consistent output.

- **Ember Sky** – Warm orange sunset

- **Midnight Frost** – Deep navy blue  ## 📄 License

- **Sage Dawn** – Calming green

- **Royal Amethyst** – Rich purple  This project is provided without a specific license. Add your preferred license file if you plan to share or distribute the tool.

- **Ocean Breeze** – Refreshing teal
- **Golden Hour** – Warm amber
- **Slate Professional** – Neutral gray

### 4. Add Team Members

For each person, provide:
- **Full Name** – Displayed prominently on the left
- **Role/Title** – Job title or position
- **Email** – Contact email address
- **Pronouns** – Optional (e.g., she/her, he/him, they/them)
- **Location** – City and country with **smart autocomplete** from 47,000+ cities worldwide
- **Timezone** – For international teams
- **Social Links** – Add LinkedIn, X (Twitter), or other profiles

**🔍 City Search Features:**
- Type any city name to see instant suggestions
- Searchable database of 47,462 cities worldwide
- Shows country and region for each result
- Keyboard navigation (arrow keys, Enter, Escape)
- Automatically places accurate map pins using real coordinates
- **Auto-fills timezone** based on city longitude (approximate)
- Falls back to country-level or timezone-based estimates if city not found

**⏰ Timezone Note:** When you select a city from autocomplete, the timezone field is automatically populated with an estimated timezone (e.g., "UTC+9", "UTC-5") based on the city's longitude. This is a rough approximation since real timezone boundaries are complex and don't follow longitude lines perfectly. You can manually edit the timezone field if needed for precision.

**Team Management:**
- ➕ **Add Person** – Create new team member entries
- 📋 **Duplicate** – Copy an existing person's details
- 🗑️ **Remove** – Delete a team member

### 5. Customize Scaling

Three independent sliders let you fine-tune the layout:
- **Font Scale** (70%–130%) – Adjust all text sizes
- **Logo Scale** (50%–150%) – Make logo bigger or smaller
- **Map Scale** (50%–150%) – Adjust map size

### 6. Preview & Download

- **Toggle Mirror** – Switch between standard and mirrored preview
- **Download for [Person]** – Get backgrounds for the selected person (both versions)
- **Download All Backgrounds** – Creates a ZIP file with backgrounds for every team member (both standard and mirrored versions)

**File Naming:** `company-name-person-name-theme-name-[standard/mirrored].png`

---

## 🎯 Why Mirrored Versions?

Zoom and Microsoft Teams show you a **mirrored view** of yourself (like looking in a mirror), but other participants see you normally. When you use a background with text, it appears backwards to you but correct to others.

**Zoom Backgrounder solves this by providing BOTH versions:**
- **Standard version** – Text appears correct to other meeting participants
- **Mirrored version** – Text appears correct to YOU when you see yourself

💡 **Pro Tip:** Use the **mirrored version** so you can read your own background correctly during calls!

---

## 🛠️ Development

### Project Structure

```
ZoomBackgrounds/
├── src/
│   ├── components/          # React components
│   │   ├── BackdropPreview.tsx
│   │   ├── BackgroundSelector.tsx
│   │   ├── CompanyForm.tsx
│   │   ├── LogoUploader.tsx
│   │   └── PeopleEditor.tsx
│   ├── constants/           # Configuration
│   │   ├── backgrounds.ts   # Theme definitions
│   │   └── defaults.ts      # Default company/people data
│   ├── utils/
│   │   └── backdrop.ts      # Canvas rendering engine
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── index.html               # HTML template
```

### Available Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Adding New Background Themes

Edit `src/constants/backgrounds.ts`:

```typescript
{
  id: 'my-theme',
  name: 'My Theme',
  description: 'Description of the theme',
  gradientStops: [
    { offset: 0, color: '#start-color' },
    { offset: 0.5, color: '#middle-color' },
    { offset: 1, color: '#end-color' }
  ],
  accentColor: '#accent-color',
  textColor: '#ffffff',
  subTextColor: 'rgba(255, 255, 255, 0.85)',
  panelColor: 'rgba(255, 255, 255, 0.15)',
  panelOpacity: 0.2
}
```

### Customizing Layouts

The canvas rendering logic is in `src/utils/backdrop.ts`. Key functions:
- `generateBackdropDataUrl()` – Main rendering pipeline
- `drawTypography()` – Text layout and positioning
- `drawLogo()` – Logo placement and scaling
- `drawLocationBackdrop()` – Map panel and location pin
- `estimateCoordinates()` – Location → coordinates lookup

---

## 🌍 Location Support

### Worldwide City Database

**47,462 cities** from around the globe with precise latitude/longitude coordinates. City data provided by [SimpleMaps World Cities Database](https://simplemaps.com/data/world-cities).

The autocomplete search provides:

- **Real-time fuzzy search** – Matches city names, countries, and regions
- **Accurate coordinates** – Uses actual geocoding data for precise map pin placement
- **Full coverage** – Major cities, regional centers, and smaller towns worldwide
- **Smart ranking** – Prioritizes exact matches, then starts-with, then contains

### Top Cities Included

Major metropolitan areas like San Francisco, New York, Seattle, Los Angeles, Chicago, Boston, Austin, Denver, London, Paris, Berlin, Tokyo, Sydney, Toronto, Vancouver, Dublin, Amsterdam, Stockholm, Singapore, Hong Kong, Melbourne, Bangalore, Mumbai, São Paulo, Mexico City, Madrid, Barcelona, and thousands more...

### Coverage by Region

- **North America** – USA, Canada, Mexico
- **Europe** – UK, Germany, France, Spain, Italy, Netherlands, Switzerland, Nordic countries, and more
- **Asia Pacific** – Japan, China, India, Singapore, Australia, New Zealand, Korea, Thailand, Vietnam
- **Latin America** – Brazil, Argentina, Chile, Colombia, Peru
- **Middle East & Africa** – UAE, Israel, South Africa, Egypt, Nigeria

**Coordinate Resolution:**
1. **City autocomplete selected** → Uses precise city coordinates (±0.01° accuracy)
2. **Manual text entry** → Attempts keyword matching against city/country database
3. **No match found** → Uses timezone offset to estimate longitude
4. **All else fails** → Center of world map (0°, 0°)

---

## 🤝 About Us

**Zoom Backgrounder** is built by [Predictability at Scale, Inc.](https://predictabilityatscale.com)

We create tools and products that help developers build better AI-powered applications:

### 🔌 [UsageTap.com](https://usagetap.com)
**Effortless analytics, usage base limits and billing for AI applications**

UsageTap provides drop-in usage tracking, metering, and billing infrastructure for AI features. Get real-time insights into API consumption, set usage limits, and automate billing—all with a simple SDK integration.

### 🤖 [LLMAsAService.io](https://llmasaservice.io)
**Full LLM gateway. Add reliable, safe and interactive AI agents to your apps and websites**

LLMAsAService offers a complete LLM gateway platform with full conversation logging, PII redaction, content safety filters, and multi-model support. Deploy production-ready AI agents with enterprise-grade reliability and security.

---

## 📬 Contact

**Authors:**
- Troy Magennis – [troy@predictabilityatscale.com](mailto:troy@predictabilityatscale.com)
- Chris Hefley – [chris@predictabilityatscale.com](mailto:chris@predictabilityatscale.com)

**Website:** [zoombackgrounder.com](https://zoombackgrounder.com)  
**GitHub:** [github.com/PredictabilityAtScale/ZoomBackgrounds](https://github.com/PredictabilityAtScale/ZoomBackgrounds)

---

## 📄 License

This project is open source. See the repository for license details.

### Data Attribution

City coordinates data sourced from [SimpleMaps World Cities Database](https://simplemaps.com/data/world-cities) - a comprehensive, free database of world cities with geographic coordinates.

---

## � Optional Causes / Charities Section

Each teammate can optionally attach a personal set of causes. In their card, add up to 10 charities (preset or custom). The generated background shows a subtle "I SUPPORT" label followed by semi-transparent pills containing the (possibly truncated) full organization names. Short codes are still used internally for custom entries, but the display favors readable names.

Why no logos?
- Trademarks and branding guidelines vary by organization.
- Keeping this minimal avoids unintended misuse of protected marks.
- Text short codes are recognizable while remaining neutral and lightweight.

If you want to add official marks globally or per-person:
1. Review each organization's usage/brand guidelines.
2. Get permission where required.
3. Store approved monochrome SVGs locally in `public/causes/`.
4. Extend `CauseInfo` with a `logoPath` property.
5. Update `drawCausesRow` in `src/utils/backdrop.ts` to render images (respect max height ~32px @1080p).

Rendering guidelines (current implementation):
- Max ~10 causes; extras ignored to preserve clarity.
- Gradient fade behind pills for contrast.
- Semi-transparent background (≈14%) + subtle border (≈28%).
- Uppercase short code centered; no wrapping.

Disclaimer: Organization names/short codes belong to their respective owners. Inclusion does not imply endorsement.

Current capabilities:
- Per-person selection from a curated preset list.
- Custom cause codes & optional names (full name shown if provided, truncated for width).
- Automatic truncation with ellipsis to preserve layout.
- Click any pill in the editor to remove it.

Future enhancements (open to PRs):
- Reordering via drag + drop.
- Persistence of custom causes across sessions (localStorage sync).
- Monochrome SVG logo rendering with automatic contrast adaptation.
- Hover tooltips in preview listing full organization names & links.

---

## �🙏 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests on GitHub.

---

**Made with ❤️ by Predictability at Scale, Inc.**
