# RISE — Premium Hydration Marketing Website

A production-quality, single-page marketing website for **RISE**, a premium hydration beverage. Cinematic, immersive, and highly animated — comparable to premium product launches from Apple / Nike / Tesla.

## Stack

- **React 18 + Vite 5** — fast dev + production build
- **Tailwind CSS 3** — utility styling with CSS variables for live accent theming
- **GSAP + ScrollTrigger** — scrubbed pinning, layered parallax, cinematic reveals
- **Three.js (r128)** — procedural 3D can with realistic reflections & lighting
- **Lenis** — buttery smooth scroll synced with GSAP ticker
- **Framer Motion** — nav, menu, micro-interactions

## Quick start

```bash
# Make sure Node 18+ / npm available. On this machine Node lives in:
#   C:\Program Files\nodejs   (added to PATH automatically below)

cd "C:\Users\OWNER\All Development Works\Sample Works\rise-hydration"
npm install
npm run dev      # http://localhost:5173
# or
npm run build    # outputs to ./dist
npm run preview  # serve the production build on :4173
```

If `node`/`npm` aren't on PATH for a fresh shell:

```powershell
$env:Path += ";C:\Program Files\nodejs"
npm run dev
```

## Sections (in scroll order)

1. **Hero** — pinned 3D RISE can, GSAP split-text reveal, cursor-reactive lighting
2. **Product Showcase** — four flavor cards with parallax imagery + marquee strip
3. **Mid-Scroll Cinematic Video Reveal** — pinned frame that scales to fullscreen; a procedurally animated slow-motion can + water burst renders on `<canvas>` (no external video dependency)
4. **Ingredients & Benefits** — floating transparent asset sprites, animated ingredient rows
5. **Hydration Science** — animated cellular electrolyte diagram with pulsing rings
6. **Flavor Experience** *(signature)* — can pinned & centered, spins driven by ScrollTrigger scrub; every quarter rotation the can morphs into the next flavor via canvas-texture crossfade; page accent, copy, ambient light, and dots all update; scrolling backward reverses perfectly
7. **Final CTA** — kinetic headline, parallax can, primary subscription pitch
8. **Footer** — newsletter form (Framer Motion confirmation), nav, legal

## Architectural notes

### Assets
All visual assets are real generated SVGs (no placeholders) under `public/assets/`:
- `cans/can-{berry,lime,mango,blue}.svg` — matching can designs, only flavor color changes
- `ingredients/*.svg` — transparent droplets, fruit, electrolytes, ice, splash
- `textures/bg-*.svg` — abstract liquid gradient backgrounds
- `hero-product.svg` / `hero-poster.svg` — studio can render

The 3D can renders its label as a `CanvasTexture` drawn at runtime in `src/three/CanModel.js` (so flavor morphing uses real canvas textures, not pre-baked files).

### Three.js rendering
- ACES filmic tone mapping, sRGB output
- 4-point lighting: ambient, key, fill, rim, plus a flavor-following point light
- Anisotropy-8 textures; DPR clamped to 2; fullRenderer disposal on unmount
- Only one WebGL context per scene section (Hero + Flavor)

### Smooth scroll / GSAP integrity
- Lenis `raf` is fed into `gsap.ticker` so ScrollTrigger updates stay in lockstep
- All `ScrollTrigger` cleanup in component unmounts
- `gsap.context()` used where appropriate to revert on unmount

### Replaceable media hooks
To swap the procedural cinematic canvas with a real generated video, drop the file in `public/assets/` and replace the `<canvas ref={canvasRef} />` inside `CinematicVideo.jsx` with a `<video>` whose `opacity`/`scale` is bound to the same `gsap` timeline onUpdate. Same approach works for any AI-generated Seedance video ID.

## File layout

```
rise-hydration/
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  public/assets/{cans,ingredients,textures,hero-product.svg,...}
  src/
    main.jsx
    App.jsx
    index.css
    three/
      CanScene.js          // Hero WebGL controller + lighting + cursor reactor
      CanModel.js          // procedural 3D can + canvas-texture labeling
    components/
      CustomCursor.jsx
      FloatingParticles.jsx
      NavBar.jsx
      Hero.jsx
      ProductShowcase.jsx
      CinematicVideo.jsx
      Ingredients.jsx
      HydrationScience.jsx
      FlavorExperience.jsx     // signature pinned spin + flavor morph
      FinalCTA.jsx
      Footer.jsx
```
