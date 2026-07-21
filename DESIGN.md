---
name: QuickRefine
description: AI English proofreading that teaches while it fixes — warm paper, inkwell teal, tutor's patience.
colors:
  inkwell-teal: "#0d5c63"
  worn-bronze: "#8b5a2b"
  marginalia-blue: "#1d6f8c"
  writing-paper: "#faf8f5"
  aged-paper: "#f0ebe3"
  paper-edge: "#e0d8cc"
  reading-ink: "#1c1917"
  soft-charcoal: "#292524"
  approving-green: "#1b4332"
  gentle-amber: "#a16207"
  quiet-crimson: "#991b1b"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.05em"
rounded:
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.inkwell-teal}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#0a4a50"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.reading-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.aged-paper}"
  card:
    backgroundColor: "{colors.writing-paper}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
  input-textarea:
    backgroundColor: "{colors.writing-paper}"
    textColor: "{colors.reading-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: QuickRefine

## 1. Overview

**Creative North Star: "The Tutor's Desk"**

QuickRefine looks and feels like a patient teacher's warm workspace: good paper, a calm teal pen, and notes in the margin that explain rather than grade. The body surface is warm paper (#faf8f5) washed by two faint atmospheric radial gradients (a breath of teal at the top-left, a breath of bronze at the right) so the page feels like a lit desk, not a white void. Ink is near-black warm brown (#1c1917), never pure black. The single tool at the center — the draft editor — is the most important object on the desk, and every other section supports it.

The system's density is **crisp and studious**: precise stationery rather than plush furniture. Corners are moderately rounded (12px is the workhorse), padding is generous but not lounging, and type is set with intent — a serif voice (Fraunces) for anything the tutor "says" (headings, labels of substance) and a plain, highly legible sans (DM Sans) for everything the student reads and writes. The system explicitly rejects Grammarly-style SaaS upsell energy, the sterile dark-gradient AI-tool template, red-pen academic grading, and gamified toy aesthetics — no mascots, no scores, no sparkle emoji, no glassy dark heroes.

**Key Characteristics:**
- Warm paper ground with atmospheric teal/bronze washes; never flat white, never dark mode.
- Deep, ink-like accents at low saturation-noise: one teal voice, used sparingly and confidently.
- Serif display (Fraunces) for voice, sans (DM Sans) for reading and writing surfaces.
- Soft-ambient depth: surfaces rest nearly flat; shadows whisper on hover.
- Corrections presented as guidance, never as grading.

## 2. Colors

A warm paper-and-ink palette with one deep teal voice and a bronze undertone — the desk, the ink, and the lamp.

### Primary
- **Inkwell Teal** (#0d5c63): The tutor's pen. Primary buttons, focus rings (at 20% alpha), the "Revised text" label, icon tints (at 10-15% alpha backgrounds), and hover accents. This is the only color that commands attention; its restraint is what makes it authoritative.

### Secondary
- **Worn Bronze** (#8b5a2b): The brass of the desk lamp. An undertone, not a call to action — it appears in the atmospheric background wash and occasional warm accents. Never used for interactive elements.

### Tertiary
- **Marginalia Blue** (#1d6f8c): A cooler teal-blue for informational moments and as the far stop of the hero's accent. Info states only; it must never compete with Inkwell Teal for attention.

### Neutral
- **Writing Paper** (#faf8f5): The body background and surface of cards and inputs. Warm, quiet, never clinical white.
- **Aged Paper** (#f0ebe3): The second surface layer — result panels, ghost-button hover fills, subtle wells.
- **Paper Edge** (#e0d8cc): Borders and dividers, usually at 70-90% alpha. Depth by outline, not by darkness.
- **Reading Ink** (#1c1917): All primary text. Secondary text is this ink at 65-70% alpha; captions and counters at 45-50%. Never gray-on-tint below 4.5:1.
- **Soft Charcoal** (#292524): The neutral for rare dark fills.

Semantic states: **Approving Green** (#1b4332) for success, **Gentle Amber** (#a16207) for warnings, **Quiet Crimson** (#991b1b) for errors — always presented softly (error surfaces are crimson at 5% alpha with a 30%-alpha border, not solid red).

### Named Rules
**The One Pen Rule.** Inkwell Teal is the only color allowed to ask for a click. If two teal elements compete in one view, one of them is wrong.

**The No Red Pen Rule.** Errors and corrections are never presented with harsh solid red. Quiet Crimson appears only on soft tinted surfaces with plain-language explanation beside it. A correction is a margin note, not a grade.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif)
**Body Font:** DM Sans (with ui-sans-serif, system-ui)

**Character:** A bookish serif voice over a plain, friendly reading sans. Fraunces carries the tutor's personality — literate and warm; DM Sans keeps every sentence effortless for non-native readers. The pairing is part of shipped brand identity: do not swap either family.

### Hierarchy
- **Display** (600, 3rem mobile → 3.75rem desktop, line-height 1.08, tracking -0.025em): The hero headline only. Fraunces.
- **Headline** (600, 1.875-2.25rem, tight tracking): Section headings ("How it works", "Why writers use it"). Fraunces.
- **Title** (600, 1.25rem): Card titles and the editor's "Your draft" label. Fraunces.
- **Body** (400, 1rem-1.125rem, line-height 1.625): All prose and the editor text itself. DM Sans, max width ~65ch (`max-w-xl` on lead paragraphs).
- **Label** (500-600, 0.75rem, tracking 0.05em-0.2em, uppercase): Rare, deliberate labels — the hero kicker and the "Revised text" tag. Uppercase tracked labels are reserved for these two moments; they are not section grammar.

### Named Rules
**The Two Voices Rule.** Fraunces speaks (headings, labels of substance); DM Sans reads and writes (prose, inputs, buttons, UI). No third font, ever.

## 4. Elevation

Soft ambient. Surfaces rest nearly flat on the paper — a hairline Paper Edge border plus `shadow-sm` — and depth appears only as a gentle response: hover lifts a feature card by half a pixel-step (`-translate-y-0.5`) and deepens the shadow to `shadow-md`; the fixed header floats on 85%-alpha paper with `backdrop-blur-md`. Nothing pops, nothing floats aggressively; the desk stays calm.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)` — Tailwind `shadow-sm`): Default for cards and the editor.
- **Hover lift** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` — `shadow-md`): Feature cards on hover, paired with the half-step translate.

### Named Rules
**The Calm Desk Rule.** Shadows communicate response, not hierarchy. If an element needs to look important at rest, use the border, the surface tint, or Inkwell Teal — never a bigger shadow.

## 5. Components

Crisp and studious: precise stationery. Consistent corner vocabulary (8px small elements, 12px workhorse, 16px feature cards), hairline borders, soft translucent fills.

### Buttons
- **Shape:** Comfortably rounded (12px on primary CTAs, 8px on small ghost buttons).
- **Primary:** Inkwell Teal fill, white text, min-width 10rem on the main CTA, padding ~12px 24px. DaisyUI `btn btn-primary` with `rounded-xl`.
- **Hover / Focus:** Fill deepens toward #0a4a50; focus uses a 2px ring of Inkwell Teal at 20% alpha. Loading state swaps the label for a dots loader — never freezes silently.
- **Ghost:** Transparent with 70%-alpha ink text; hover fills with Aged Paper. The bordered variant (Paste) adds a Paper Edge border on a 50%-alpha Aged Paper fill.
- **Disabled:** DaisyUI muted treatment; the primary CTA is disabled until the draft is valid.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`) for the editor card; 16px (`rounded-2xl`) for feature cards.
- **Background:** Writing Paper at 90% alpha with `backdrop-blur-sm`, letting the atmospheric wash breathe through.
- **Shadow Strategy:** Resting `shadow-sm`; see Elevation.
- **Border:** 1px Paper Edge at 80% alpha. On hover, feature cards warm the border to Inkwell Teal at 30% alpha.
- **Internal Padding:** 24px x / 20px y (compressed to 16px on small screens).

### Inputs / Fields
- **Style:** The textarea is the product's centerpiece: Writing Paper fill, Paper Edge border, 12px radius, 16px x-padding, DM Sans at 1rem with relaxed leading, ~13rem min-height on desktop. Placeholder is ink at 35% alpha showing a real example sentence.
- **Focus:** Border shifts to Inkwell Teal plus a 2px ring at 20% alpha. No outline suppression without replacement.
- **Error:** Over-limit drafts turn the border and character counter to Quiet Crimson; the counter announces via `aria-live`.

### Navigation
- **Style:** A fixed 64px header on 85%-alpha Writing Paper with `backdrop-blur-md` and a hairline bottom border. Wordmark in Fraunces semibold, hover-tinted to Inkwell Teal. Right side holds session state (greeting + ghost sign-out, or the sign-in button). No nav links — the page is the product.

### The Result Panel (signature)
The `prose-panel`: an Aged Paper well (8px radius, Paper Edge border warmed with Inkwell Teal at 15%) that presents the revised text under a small uppercase Inkwell Teal "Revised text" label. Changes are bolded inline; a ghost copy button sits in the corner. This is the tutor's margin note — always presented as an offering, never as a verdict.

## 6. Do's and Don'ts

### Do:
- **Do** keep Writing Paper (#faf8f5) as the ground everywhere; the atmospheric teal/bronze wash stays behind content at the body level.
- **Do** reserve Inkwell Teal for interaction and emphasis — The One Pen Rule. Tint fills at 10-20% alpha; full strength only on primary actions and key labels.
- **Do** set all reading and writing surfaces in DM Sans at ≥1rem with relaxed leading; this audience reads English as a second language.
- **Do** keep body text at ≥4.5:1 contrast — Reading Ink at 65% alpha on Writing Paper is the floor for secondary text; captions at 45-50% alpha are for non-essential metadata only.
- **Do** give every interactive element a visible focus ring (2px, Inkwell Teal at 20% alpha) and every animation a `prefers-reduced-motion` fallback (already global in `globals.css`).
- **Do** keep motion at 150-300ms ease-out, state-driven: hover lifts, loading dots, fade-up entrances on first load only.

### Don't:
- **Don't** drift toward "Grammarly-style SaaS": no mascots, no upsell banners, no feature-matrix marketing, no freemium nagging.
- **Don't** touch the "sterile AI-tool template": no dark gradient heroes, no glassmorphism-as-decoration, no sparkle emoji, no "powered by GPT" genericism.
- **Don't** grade like "academic / test-prep": no solid red-pen corrections, no scores or percentages, no exam-pressure framing — The No Red Pen Rule.
- **Don't** gamify: no streaks, badges, or cartoon mascots; QuickRefine must be taken seriously by serious learners.
- **Don't** add a third font family, use pure black (#000) or clinical white (#fff) surfaces, or introduce cool grays into the warm neutral ramp.
- **Don't** use colored side-stripe borders (`border-left` > 1px) on callouts or results — the soft tinted-surface-plus-full-border pattern is the house style.
- **Don't** put uppercase tracked labels above every section; they are reserved for the hero kicker and the "Revised text" tag.
