---
name: Cyber-Zen Spatial Audio
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#ccc3d7'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d3bbff'
  primary: '#d3bbff'
  on-primary: '#3f008d'
  primary-container: '#6d28d9'
  on-primary-container: '#dac5ff'
  inverse-primary: '#7331df'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#ffafd3'
  on-tertiary: '#620040'
  tertiary-container: '#9c2a6c'
  on-tertiary-container: '#ffbcd9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#250059'
  on-primary-fixed-variant: '#5b00c5'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  technical-data:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  panel-padding: 24px
---

## Brand & Style

The design system is built upon a "Cyber-Zen" aesthetic—a harmonious convergence of high-fidelity technical precision and ethereal, cosmic atmosphere. It targets professional sound designers and experimental musicians who require a tool that feels less like a spreadsheet and more like a futuristic cockpit.

The visual style leverages **Glassmorphism** and **High-Contrast Neon** accents. It prioritizes a sense of "physical light" where UI elements do not just sit on a screen, but appear as projected holograms or translucent glass panels floating within a deep-space environment. The emotional response should be one of focused calm (Zen) energized by the limitless possibilities of the future (Cyber).

## Colors

This design system utilizes a deep, multi-layered dark palette to simulate the infinite depth of space.

- **Primary (Cosmic Purple):** Used for core branding, active states, and primary navigation elements.
- **Secondary (Electric Cyan):** Used for technical data visualization, "On" states, and high-priority interactive cues.
- **Tertiary (Neon Pink):** Reserved for highlights, experimental features, and critical alerts.
- **Neutral (Deep Space Navy):** The bedrock of the UI. This color should be used for background surfaces, with varying opacities to create the "glass" effect.

Backgrounds should rarely be flat. Use subtle radial gradients transitioning from `#0B0E14` to a very dark `#1E1B4B` (Deep Indigo) to create a sense of curvature and depth.

## Typography

Typography is a primary tool for distinguishing between "Artistic Narrative" and "Technical Data."

**Sora** provides a geometric, futuristic feel for all headers and display text. Its wide stance and modern curves anchor the UI in the "high-end instrument" space.

**Hanken Grotesk** is used for general interface text and descriptions, providing a clean and sharp reading experience that doesn't distract from the visual intensity of the app.

**Space Mono** is used exclusively for technical data, synthesizer parameters (e.g., Hertz, Decibels, Oscillation rates), and labels. This ensures that every numerical value feels precise, engineered, and readable against complex background visuals.

## Layout & Spacing

The layout philosophy centers on a **HUD (Heads-Up Display) Model**. Because the core of the app is a 2.5D spatial canvas, the UI elements do not occupy a fixed grid that pushes content. Instead, they float over the canvas as interactive overlays.

- **Floating Viewports:** Essential controls should be grouped into translucent panels pinned to the corners or sides of the screen.
- **Safe Areas:** Keep a 40px margin on desktop to allow the "Starry Gradient" background to breathe, creating a cinematic framing effect.
- **Rhythm:** Use an 8px base unit. All internal component padding should be increments of 8px (16, 24, 32).
- **Reflow:** On mobile, side panels should collapse into a bottom-sheet architecture to maximize the visual field of the synthesizer's 2.5D canvas.

## Elevation & Depth

Depth is conveyed through **Light and Clarity**, rather than traditional shadows.

1.  **Backdrop Blurs:** All panels must use `backdrop-filter: blur(20px)`. This creates the "Frosted Glass" effect, ensuring legibility while maintaining a visual connection to the 2.5D space behind the UI.
2.  **Neon Edges:** Instead of drop shadows, use thin (1px) inner or outer borders. For active elements, these borders should "glow" using a `box-shadow` with the same color as the border (e.g., Cyan or Pink) and a blur radius of 8px-12px.
3.  **Z-Axis Hierarchy:**
    - **Level 0:** The 2.5D spatial canvas.
    - **Level 1:** Floating transparent panels (60% opacity Navy).
    - **Level 2:** Interactive controls (Buttons, Sliders).
    - **Level 3:** Tooltips and Modals (100% opacity with intense glow borders).

## Shapes

The shape language reflects "Organic Geometry." While the system is technical, the curves should feel natural and ergonomic, reminiscent of high-end hardware.

- **Main Panels:** Use `rounded-xl` (1.5rem) to soften the large containers.
- **Interactive Elements:** Buttons and Input fields use the standard `0.5rem` roundedness.
- **Visualizers:** Waveforms and organic patterns should use fluid, bezier-curve paths, avoiding sharp angles unless representing a "harsh" audio wave (like a Square or Sawtooth wave).

## Components

- **Floating Action Buttons (FABs):** Circular, 56px diameter. Feature a 2px Electric Cyan border and a subtle cyan outer glow. Icons should be minimal line-art (1.5px stroke).
- **Glass Cards:** Containers for synthesizer modules. They must feature a subtle gradient border (Top-left: Secondary Color; Bottom-right: Primary Color) at 30% opacity.
- **Technical Inputs:** Number fields and Sliders. Sliders should use the Neon Pink for the "track fill" and Electric Cyan for the "thumb handle," creating a vibrant visual contrast.
- **Control Knobs:** A custom 2.5D component. Use concentric circles with a "glow needle" to indicate the value.
- **Status Chips:** Small, pill-shaped labels for "Mute," "Solo," or "Active." Use a solid background of the Primary or Secondary color with 0.1 opacity and a 1px solid border.
- **Organic Wave Visualizers:** Use SVG paths that animate in real-time. The stroke should be the Secondary (Cyan) color with a "motion blur" glow effect applied via CSS filters.
- **Transparent Overlays:** For camera view controls, use ultra-minimal icon-only buttons with no background, appearing only when the user's mouse nears the canvas edges.
