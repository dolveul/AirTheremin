---
name: Acoustic Brass & Timber
colors:
  surface: '#17130f'
  surface-dim: '#17130f'
  surface-bright: '#3d3833'
  surface-container-lowest: '#110e0a'
  surface-container-low: '#1f1b17'
  surface-container: '#231f1b'
  surface-container-high: '#2e2925'
  surface-container-highest: '#39342f'
  on-surface: '#eae1da'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#eae1da'
  inverse-on-surface: '#34302b'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c3cc8c'
  on-secondary: '#2d3404'
  secondary-container: '#434b18'
  on-secondary-container: '#b1bb7c'
  tertiary: '#ffc19e'
  on-tertiary: '#532200'
  tertiary-container: '#f89c64'
  on-tertiary-container: '#723200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#dfe8a6'
  secondary-fixed-dim: '#c3cc8c'
  on-secondary-fixed: '#191e00'
  on-secondary-fixed-variant: '#434b18'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753401'
  background: '#17130f'
  on-background: '#eae1da'
  surface-variant: '#39342f'
typography:
  headline-xl:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  panel-padding: 32px
---

## Brand & Style

The design system embodies an **Organic Steampunk / Acoustic Tech** aesthetic. It moves away from digital ephemeralism toward a philosophy of permanent, handcrafted engineering. The interface should feel like a high-end physical instrument or a Victorian-era scientific chronometer—heavy, tactile, and precision-machined.

The style combines **Tactile / Skeuomorphism** with **Minimalist structural layouts**. We utilize rich material textures—polished mahogany, brushed brass, and oxidized copper—to create a "Living Machine" experience. The goal is to evoke a sense of heritage, mechanical reliability, and artisanal quality, grounding high-tech functionality in old-world craftsmanship.

## Colors

The palette is rooted in deep, earthy dark modes, replacing synthetic glows with warm, metallic radiation.

- **Primary (Polished Brass):** Used for interactive elements, highlights, and critical technical readouts. It radiates a warm, sun-like glow.
- **Secondary (Oxidized Forest):** A deep, desaturated green representing aged copper and natural organic elements. Used for secondary actions and subtle status indicators.
- **Tertiary (Mahogany):** A rich, warm wood tone used for structural backing and container backgrounds.
- **Neutral (Charred Iron):** The foundational dark space, appearing as a matte, slightly textured metallic surface rather than a pure black or grey.

**Surface Accents:** Use **Amber (#FFBF00)** for warning states and **Verdigris (#43B3AE)** for active connections, mimicking the patina of weathered metal.

## Typography

Typography functions as "precision-engineered gauge markings."

- **Headlines:** Use **Source Serif 4** for an authoritative, literary, and historical feel. Large titles should look like they were engraved into metal plates.
- **Body:** **Hanken Grotesk** provides a clean, contemporary contrast, ensuring high legibility against complex textured backgrounds.
- **Labels & Technical Data:** **JetBrains Mono** is used for all metadata, values, and status labels, mimicking the mono-spaced output of a mechanical ticker-tape or a vintage brass gauge.

All text on dark backgrounds should have a slight "warm" tint (95% opacity) to prevent harsh digital contrast.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy, reminiscent of a modular instrument panel. Components are housed within "Control Modules" or "Plates."

- **Modular Panels:** Use a 12-column grid for desktop with generous 24px gutters. Elements should feel "inset" or "bolted" onto the main mahogany background.
- **Margins:** Wider-than-average margins on desktop (64px) create a sense of focused, high-end equipment.
- **Rhythm:** An 8px linear scale governs all padding and internal spacing. Larger gaps (32px+) are encouraged between distinct functional modules to emphasize their "mechanical" independence.
- **Mobile Adaptivity:** Panels stack vertically, with margins reducing to 16px. Technical data should maintain its mono-spaced clarity, often using horizontal scrolling for wide data tables.

## Elevation & Depth

Hierarchy is achieved through **Material Layering** and **Mechanical Insets** rather than floating shadows.

- **The Base:** The lowest layer is the Mahogany wood texture, deep and matte.
- **The Plates:** Secondary layers (cards, sidebars) are brushed metal plates. Use **Inner Shadows** to make them appear "carved into" the wood, or **Drop Shadows** with very low blur and high offset to make them appear "bolted on."
- **Amber Glow:** Instead of standard elevation shadows, active or focused elements emit a subtle **Amber outer glow**, simulating a vacuum tube or a warm filament light source behind a panel.
- **Rivets:** Use 2px circular accents at the corners of panels to represent metallic rivets, grounding the UI in a physical reality.

## Shapes

The shape language is **Soft (0.25rem)**, reflecting industrial machining where corners are filed down for safety and comfort, but the overall structure remains rigid and geometric.

Avoid "pill" shapes or extreme roundness, as these feel too "digital." The only exceptions are circular gauges and toggle switches, which should be perfect circles to mimic analog dials. Decorative cut-outs (45-degree chamfered corners) can be used on primary action buttons to enhance the "engineered" aesthetic.

## Components

- **Buttons:** Designed as "Machined Switches." Use a linear gradient of Brushed Brass (#D4AF37 to #B8860B). On hover, the button should appear to depress slightly using an inner shadow.
- **Chips / Tags:** Styled as "Stamped Metal Plates" with a 1px border of Oxidized Copper. Use `label-caps` typography.
- **Input Fields:** These should look like "Glass Slots" or "Recessed Gauges." Use a dark, semi-transparent background with a subtle inner glow. The cursor should be an amber block.
- **Cards:** Defined by "Wood Bezel" frames. The header of a card should be separated by a thin brass divider line (1px).
- **Checkboxes & Radios:** These are physical "Toggle Flips" or "Rotary Knobs." When active, they should show a warm amber "Light" indicator.
- **Progress Bars:** Designed as "Mercury Tubes" or "Brass Sliders," where the fill is a glowing amber gradient against a dark, hollowed-out metallic track.
- **Modals:** Heavy mahogany panels with a brushed brass border. Modals should have a "Mechanical" entrance animation (e.g., sliding into place with a slight bounce).
