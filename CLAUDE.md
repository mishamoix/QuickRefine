# QuickRefine

AI English proofreading for short texts (≤600 chars) with explanations for every correction. Next.js 16 App Router, React 19, Tailwind + DaisyUI (`quickrefine` theme), NextAuth (Google), MongoDB.

## Design Context

- **PRODUCT.md** (project root) — strategy: product register, web platform, student/learner audience, "it teaches while it fixes" positioning, anti-references, design principles. Read it before any UI work.
- **DESIGN.md** (project root) — the visual system: "The Tutor's Desk" north star, Inkwell Teal / Worn Bronze palette on warm paper, Fraunces + DM Sans, component and elevation rules. Tokens in its YAML frontmatter are normative.
- `.impeccable/design.json` — machine-readable sidecar (tonal ramps, component snippets) for impeccable live mode.

Any change to the visual system should update DESIGN.md; strategic shifts update PRODUCT.md.
