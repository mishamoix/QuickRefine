---
name: QuickRefine
description: Bold English proofreading that fixes the text, explains the edit, and confirms the meaning.
colors:
  black: "#000000"
  white: "#ffffff"
  cream: "#f5f0e6"
  yellow: "#ffeb3b"
  blue: "#2196f3"
  pink: "#ff4081"
  green: "#4caf50"
  orange: "#ff9800"
  red: "#ff5252"
typography:
  display:
    fontFamily: "Archivo Black, Impact, sans-serif"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Archivo Black, Impact, sans-serif"
    fontWeight: 400
    textTransform: uppercase
borders:
  control: "2px solid #000000"
  panel: "3px solid #000000"
shadows:
  control: "4px 4px 0 #000000"
  panel: "6px 6px 0 #000000"
  feature: "8px 8px 0 #000000"
rounded:
  default: "0px"
spacing:
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    border: "{borders.control}"
    shadow: "{shadows.control}"
  card:
    backgroundColor: "{colors.white}"
    border: "{borders.panel}"
    shadow: "{shadows.panel}"
  input-textarea:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    border: "{borders.panel}"
---

# Design System: QuickRefine

## 1. Overview

**Creative North Star: “The Loud Tutor”**

QuickRefine is an approachable neobrutalist learning tool: direct, energetic, and visibly structured. The interface uses flat color, heavy black strokes, hard offset shadows, sharp corners, and oversized type to make the proofreading loop unmistakable. It should feel like a confident workbook covered in bright tabs, not a quiet SaaS dashboard.

The visual system is bold, but the experience remains patient. Corrections are lessons rather than grades. Every high-contrast panel has a clear job, every color identifies a section or action, and the editor remains the largest object on the page.

### Core characteristics

- Flat, opaque color only. No gradients, blur, glass, or translucent surfaces.
- Black 2–3px borders on controls and panels.
- Hard black shadows with zero blur.
- Sharp corners throughout.
- Archivo Black for headlines and labels; Space Grotesk for reading and writing.
- Physical button feedback: shadow and position change on hover and press.

## 2. Color

- **Black (`#000000`)**: all borders, shadows, primary text, and the footer.
- **White (`#ffffff`)**: editor, cards, and neutral content panels.
- **Cream (`#f5f0e6`)**: page background and low-priority fields.
- **Yellow (`#ffeb3b`)**: primary actions, revised text, and the header.
- **Blue (`#2196f3`)**: informational sections and meaning.
- **Pink (`#ff4081`)**: brand callouts and secondary highlights.
- **Green (`#4caf50`)**: successful no-error results.
- **Orange (`#ff9800`)**: warnings only.
- **Red (`#ff5252`)**: errors and over-limit input only.

All colors are fully opaque. Color never replaces a text label, icon, or border.

## 3. Typography

**Display: Archivo Black.** Uppercase, compact, and used for the wordmark, hero, section titles, card titles, and result labels. The hero scales from roughly 44px on mobile to 104px on desktop.

**Body: Space Grotesk.** Medium weight by default, with at least 16px for user-entered and corrected text. Short instructional copy may use 14px when contrast remains high.

Do not add another font, italic display styling, low-contrast gray copy, or decorative letter spacing that slows reading.

## 4. Borders and elevation

Neobrutalist depth is structural:

- Controls: 2px black border, 4px hard shadow.
- Cards and result panels: 3px black border, 6px hard shadow.
- Hero/video feature objects: up to 8px hard shadow.
- No blur radius, alpha shadow, soft elevation, or backdrop blur.

Hover moves interactive controls up-left by 2px and grows the shadow. Active controls move down-right and reduce it. Under `prefers-reduced-motion`, position changes stop while contrast and shadows remain.

## 5. Components

### Header

A fixed yellow bar with a 3px black bottom border. The wordmark is uppercase Archivo Black. Session actions use white hard-shadow buttons.

### Editor

The editor is a white 3px-bordered card with a 6px shadow. The textarea has a 3px border and no radius; focus adds a hard shadow and a blue outline where needed. The character counter is a compact yellow badge, switching to red when over limit.

### Buttons

Buttons are uppercase, bold, sharp, 2px bordered, and hard-shadowed. Primary actions are yellow. Utility actions are white. Disabled buttons stay fully opaque on cream. Icon-only buttons keep accessible names; focus outlines are black, or white on black surfaces, so they remain visible against every brand color.

### Results

- Revised text: yellow 3px-bordered panel.
- No mistakes: green 3px-bordered panel.
- Explanation and alternatives: white 2px-bordered rows.
- Meaning: blue 2px-bordered panel at the bottom of the result stack.
- Errors: red 3px-bordered panel with retry or sign-in action.

Titles use one consistent uppercase Archivo Black style. User-facing prose uses Space Grotesk at medium weight.

### Marketing sections

Sections alternate cream, blue, and white. Feature cards may use yellow, pink, or blue, but each card uses one flat fill. The video is framed by a white panel with a heavy hard shadow.

### Footer

Solid black with white text. External actions use yellow and pink hard-shadow buttons.

## 6. Rules

### Do

- Use bold color to separate jobs, not decorate empty space.
- Keep black borders and shadows consistent across every surface.
- Keep the editor and result hierarchy obvious on mobile and desktop.
- Preserve visible focus states, keyboard behavior, live-region feedback, and reduced-motion support.
- Keep copy direct and readable for English learners.

### Don’t

- Do not use gradients, opacity, blur, glassmorphism, soft shadows, or rounded cards.
- Do not introduce muted gray-on-white text.
- Do not use color without a visible label or structural border.
- Do not turn corrections into grades, scores, or shame.
- Do not add animation that delays writing, analyzing, copying, or retrying.
