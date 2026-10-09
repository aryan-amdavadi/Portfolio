<div align="center">
  <h1><strong>Aryan Amdavadi — Software Engineering Portfolio</strong></h1>
  <p><strong>Art-Directed Engineering Portfolio • WebGL • GSAP • Next.js 16</strong></p>
  
  <p>
    <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-Next.js%2016%20App%20Router-black?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
    <a href="#motion"><img src="https://img.shields.io/badge/Motion-GSAP%203.15-green?style=for-the-badge&logo=greensock" alt="GSAP" /></a>
    <a href="#webgl"><img src="https://img.shields.io/badge/WebGL-Three.js%20%7C%20OGL-white?style=for-the-badge&logo=threedotjs" alt="Three.js" /></a>
    <a href="#styling"><img src="https://img.shields.io/badge/Styling-Vanilla%20CSS%20Architecture-blue?style=for-the-badge&logo=css3" alt="Vanilla CSS" /></a>
  </p>
</div>

<br />

## 🪐 Overview

This repository houses the source code for an advanced, cinematic software engineering portfolio. Designed to bridge the gap between rigorous engineering case studies and high-end digital art direction, the platform relies entirely on native browser APIs, hardware-accelerated WebGL layers, and custom vanilla CSS design tokens (eschewing utility-first frameworks for absolute aesthetic control).

**Core Philosophy:** The portfolio must feel like a premium software product—continuous, fluid, lightweight, and incredibly responsive.

---

## ✨ Key Features

### 1. Antigravity WebGL Engine (`/src/canvas`)
A custom, decoupled WebGL rendering pipeline built on Three.js and OGL. 
- **Continuous Background Motion:** A hardware-accelerated particle system that dynamically tracks pointer velocity and scroll inertia without blocking the main thread.
- **Text-Safe 3D Spatial Narrative:** The primary 3D sculpture mathematically orbits the user's viewport on scroll, intelligently dodging text lanes (when text is left, object moves right, and vice versa) to prevent intersection.
- **Memory Safety:** Heavy WebGL contexts are strictly managed with unmount garbage collection and `useReducedMotion` hooks for accessibility.

### 2. Cinematic GSAP Narratives (`/src/components/layout/ScrollOrchestrator.tsx`)
Scroll experiences powered by **GSAP ScrollTrigger**.
- All React-driven GSAP animations are encapsulated in `gsap.context()` blocks to ensure flawless memory management during React 19's Strict Mode unmounts.
- Features advanced scrubbable timelines, cinematic entrances, and parallax elements.

### 3. Card Fan Carousel (`/src/components/projects/CardFanCarousel.tsx`)
A custom-engineered visual entry point to the project case studies.
- Utilizes GSAP for complex 3D fanned geometry, elastic entrance animations, hover spreading, and state-synced circular pagination.

### 4. Custom CSS Token Architecture (`/src/styles`)
No Tailwind. No CSS-in-JS overhead. The styling is driven by a bespoke vanilla CSS architecture.
- **`tokens.css`**: Design tokens, color spaces, spacing scales, and Z-index hierarchies.
- **`layout.css` & `typography.css`**: Strict typographic grids and responsive bounds.
- **Component CSS**: Encapsulated component styling mapped strictly to global tokens.

### 5. Context-Aware Custom Cursors (`/src/components/cursor`)
A highly optimized custom cursor that bypasses React state for continuous frame updates, mapping to interaction attributes (`data-cursor="open | view | link"`) to dynamically morph across the DOM.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.3 (App Router), React 19
- **Graphics:** Three.js, OGL
- **Animation:** GSAP (ScrollTrigger, CustomEase), Motion
- **Language:** TypeScript
- **Styling:** Vanilla CSS Architecture
- **Tooling:** ESLint, Prettier

---

## 📁 System Architecture

```text
src/
├── app/                  # Next.js 16 App Router (Routes & Layouts)
│   ├── projects/[id]/    # Dynamic Engineering Case Studies
│   └── globals.css       # CSS entrypoint mapping imports
├── canvas/               # WebGL Rendering Pipeline
│   ├── engine/           # Render loop, scene director
│   └── scenes/           # Antigravity Field, Orbital Nodes, etc.
├── components/           # React Presentation Layer
│   ├── backgrounds/      # Secondary visual layers (GhostFibers)
│   ├── cursor/           # Context-aware DOM cursor
│   ├── layout/           # ScrollOrchestrator, Navigation, Shell
│   ├── projects/         # CardFanCarousel, InteractiveDiagrams
│   └── ui/               # Reusable primitives (Specular Buttons)
├── data/                 # Source of truth for portfolio content
├── hooks/                # Global state (CursorState, ReducedMotion)
└── styles/               # Vanilla CSS Token Architecture
    └── components/       # Encapsulated component styles
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryan-amdavadi/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🏎️ Performance Optimizations

- **Main Thread Release:** Canvas calculations are entirely decoupled from React's render lifecycle. `useFrame` implementations map directly to RAF outside of React state.
- **CSS GPU Acceleration:** `will-change: transform` and `transform: translate3d()` utilized on all heavy DOM elements to offload rasterization to the GPU.
- **GSAP Contexts:** Absolute mitigation of memory leaks via `ctx.revert()` in `useEffect` return blocks.
- **Image Optimization:** All engineering artwork and assets are routed through Next.js `<Image />` component for AVIF/WebP conversion and automatic sizing.

---

<div align="center">
  <p>Designed & Engineered by <strong>Aryan Amdavadi</strong></p>
  <p>2026</p>
</div>
