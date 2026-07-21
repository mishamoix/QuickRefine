---
target: home page
total_score: 28
p0_count: 0
p1_count: 3
timestamp: 2026-07-21T17-02-05Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a51b25b06f1d2ed52 · B: acae1f9ee824f7569)

# Critique: Home page (`src/app/page.tsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading is dots-in-button only; result arrives silently (no live region, `TextAnalyzer.tsx:265`); session-loading also shows the loader, reading as a stuck analysis |
| 2 | Match System / Real World | 3 | Copy mostly plain and warm; "Analyze" is mildly tool-ish for learners |
| 3 | User Control and Freedom | 2 | Enter inside the textarea submits — or triggers a Google OAuth redirect when signed out (`TextAnalyzer.tsx:84-89`, `100-109`); no cancel, no undo after Clear |
| 4 | Consistency and Standards | 3 | Dead off-system components (`Logout.tsx` solid red, `GoogleLogin.tsx`); hero kicker set in Fraunces vs. DESIGN.md's DM Sans label spec |
| 5 | Error Prevention | 3 | Disabled-until-valid CTA and draft saved before OAuth redirect are excellent; `dangerouslySetInnerHTML` on LLM output (`TextAnalyzer.tsx:281-283`) is an injection risk |
| 6 | Recognition Rather Than Recall | 3 | Bold-in-results = "changed" is never explained; Enter behavior documented only in 0.75rem/50%-alpha fine print |
| 7 | Flexibility and Efficiency | 3 | Paste with permission fallbacks is good; nothing for the return user (no history/recents) despite principle 5 |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, editor-centered; Contact FAB is a permanent second focal point; Features section is filler weight |
| 9 | Error Recovery | 3 | Friendly mapped error copy with `role="alert"`; but no Retry button and `retry: 0` |
| 10 | Help and Documentation | 2 | Only help is a YouTube embed; no FAQ, no privacy policy/terms while asking for Google sign-in |
| **Total** | | **28/40** | **Good — solid foundation, address weak areas** |

## Anti-Patterns Verdict

**LLM assessment:** Borderline-pass. The token system (warm paper, one-teal restraint, tinted-surface errors, Fraunces/DM Sans) reads genuinely art-directed. But two loud tells remain: gradient text on "refined" in the hero (`Hero.tsx:13` — an absolute ban, half-codified into DESIGN.md §3 "Marginalia Blue… far stop of the hero's accent"), and the three-identical-cards Features grid (`Features.tsx:42-61`). Worst of all is a credibility failure unique to this product: the Features copy contains broken English — "Get instant proofreading opinion to improve your English" (`Features.tsx:19-20`) and generic "Boost Productivity / Enhance efficiency with smart tools" (`Features.tsx:24-26`) — on an English-proofreading tool. Clean elsewhere: no side-stripes, no glassmorphism-as-default, no hero metrics, no numbered scaffolding; the single hero kicker is the sanctioned exception.

**Deterministic scan:** 2 findings (exit 2). (1) `gradient-text` warning at `Hero.tsx:13` — confirms the LLM's top visual tell, real positive. (2) `design-system-font-size` advisory at `Hero.tsx:11` (`max-sm:text-[2rem]` off the DESIGN.md ramp) — technically accurate but effectively a false positive: it's a responsive downscale of the display step, and the detector ignores the equally off-ramp `text-4xl`/`text-6xl` on the same line. The detector caught nothing the review missed; everything else (copy, a11y, promise gap) was LLM-only.

**Visual overlays:** No user-visible overlay was created — no dev server was running and this session has no browser-injection capability, so the browser visualization step was skipped. Evidence is code + CLI scan only.

## Overall Impression

The desk is beautiful; the lesson is missing. Visually this is a disciplined, warm, credible surface that upholds almost every DESIGN.md rule in live code. But the product's entire positioning — "every correction comes with the rule and an example" — is not shipped: the page calls `/api/enhance/fast`, which returns corrected text only, and renders bolded diffs with no explanations, while the full explain route and `Mistake` model (rule/example/explanation) sit unused. The single biggest opportunity is wiring the promised lesson into the result panel.

## What's Working

1. **Real token discipline.** Atmospheric two-radial paper wash, warm ink instead of black, hairline Paper Edge borders, error state as 5% crimson tint with 30% border (`TextAnalyzer.tsx:213`) — the No Red Pen Rule holds everywhere live.
2. **The OAuth round-trip preserves the draft** (`TextAnalyzer.tsx:121-124`): stashed to localStorage before redirect, restored on return — invisible kindness most products get wrong.
3. **Error copy written for the audience.** `src/libs/enhance-errors.ts` maps every failure to short, blame-free plain English with a next step.

## Priority Issues

1. **[P1] The lesson ships as an undifferentiated blob — and Copy copies all of it.** (CORRECTED after user review: explanations ARE shipped — `prompts/fast_mode.md` returns corrected text + alternatives + a mistakes list with short explanations, embedded as markdown in one `text` field.) But the UI renders the entire blob with identical styling under one "Revised text" label (`TextAnalyzer.tsx:279-284`) — explanations get fine-print treatment, not the first-class margin-note treatment Design Principle 2 requires. Worse, the Copy button copies the whole blob including "Corrected text:/Alternatives:/Mistakes:" headers (`TextAnalyzer.tsx:113` strips only `**`), so a user pastes the entire lesson into their email instead of the corrected text.
   **Fix:** parse the markdown response into sections — corrected text prominent, alternatives as options, each mistake as a margin-note (error → corrected: explanation) — and make Copy copy only the corrected text. **Suggested command:** /impeccable polish

2. **[P1] Enter-in-textarea submits — and can launch Google OAuth mid-sentence.** `TextAnalyzer.tsx:84-89` + `100-109`: a signed-out learner pressing Enter for line two is redirected to Google consent. The mitigation is fine print. **Fix:** Enter inserts a newline; Cmd/Ctrl+Enter submits; a keystroke never initiates auth. **Suggested command:** /impeccable harden

3. **[P1] Broken/generic English in Features.** "Get instant proofreading opinion…" and "Boost Productivity / Enhance efficiency with smart tools" (`Features.tsx:19-26`) are self-disqualifying on a proofreading product, and the identical card grid is the page's biggest slop tell. **Fix:** rewrite around PRODUCT.md's actual claims (rule behind every fix; tone smoothing; built for ≤600-char drafts) or replace the grid with one annotated before/after example — which also gives signed-out visitors a value preview. **Suggested command:** /impeccable clarify

4. **[P2] One Pen / Calm Desk violations.** Up to three teal CTAs share a viewport: header "Sign In" (`SignInButton.tsx:12`), editor CTA, Contact FAB (`ContactButton.tsx:11` — also `shadow-lg shadow-primary/25` at rest; the video container carries at-rest `shadow-lg` too, `HowItWorks.tsx:15`). Plus the hero gradient text. **Fix:** ghost the header sign-in when signed out, demote Contact to a quiet footer affordance, drop at-rest shadows to `shadow-sm`, replace gradient "refined" with solid Inkwell Teal. **Suggested command:** /impeccable quieter

5. **[P2] The screen-reader loop is broken at both ends.** Submit button loses its accessible name while loading (`TextAnalyzer.tsx:253-254`); result arrives with no live-region announcement; corrections are `<strong>`-only (style-only meaning — the product's entire payload is invisible non-visually); char counter `aria-live` chatters every keystroke; copy button named by `title` only. Also escape HTML before the `**`→`<strong>` transform (`TextAnalyzer.tsx:281-283`). **Fix:** polite live region ("Revised text ready, N changes"), sr-only loading label, debounced counter announcements, visible "bold = changed" legend. **Suggested command:** /impeccable audit

## Persona Red Flags

**Jordan (first-timer, non-native reader):** first action is clear in 5s (labeled textarea, worked-example placeholder — good). Breaks: Enter → Google consent screen mid-draft; the explanation of that behavior is the page's hardest-to-read text (0.75rem, 50% alpha, idiomatic phrasing); nothing explains what bolding means.

**Casey (distracted mobile, slow connection):** actions are thumb-reachable, but no cancel and `retry: 0` mean flaky-connection failures need manual re-taps; draft is lost on tab reload (localStorage save happens only on the sign-in path); the Contact FAB is an unlabeled envelope circle in prime thumb territory; the YouTube iframe loads eagerly — heaviest asset on the page.

**Sam (screen reader / keyboard):** unlabeled loading state, silent result arrival, `<strong>`-only corrections most screen readers never announce, chattering char counter, `title`-only copy button. Keyboard operability of the loop itself works; textarea focus ring matches DESIGN.md, other buttons fall back to DaisyUI defaults.

**Mei (ESL student polishing an email to her professor — from PRODUCT.md):** delights: placeholder mirrors her exact situation; "Hey, {name}"; blame-free errors. Alienates: the site's own English is wrong in Features — if QuickRefine can't proofread itself, she won't trust it with a professor-bound email; corrections come with no reasons, so she can't verify fixes suit academic register; "smooths tone" is claimed with no tone control or indication; over-limit gives a crimson counter and dead button with no "trim or split" guidance; no privacy statement anywhere while she pastes personal correspondence.

## Minor Observations

- Dead components with rule-violating styles: `Logout.tsx` (solid `btn-error` red) and `GoogleLogin.tsx` — both unimported; delete before someone mounts them.
- Hero kicker in Fraunces vs. DESIGN.md YAML label spec (DM Sans) — reconcile code or doc.
- `Features.tsx` uses `useMemo` on a static array — pointless; verify client/server boundary at build.
- Validation errors return HTTP 200 with an `error` body (`fast/route.ts:68,75`) — non-standard contract.
- `ClientLayout` mounted twice (`layout.tsx` and `page.tsx`) — duplicate SessionProvider/Toaster, potential double toasts.
- `HowItWorks` promises "structured feedback" the UI doesn't render — the promise/delivery gap in miniature.
- `.padding` utility resolves to 8px side padding at desktop (`globals.css:30-32`) — fragile.
- Plausible `<Script>` tags manually placed inside `<head>` (`layout.tsx:50-63`) — next/script shouldn't need that; may double-inject.
- SEO-stuffed tab title in `src/config.ts` ("Improve Your English – Instantly Verify and Enhance Your Text").
- Detector advisory: `max-sm:text-[2rem]` off the DESIGN.md type ramp (`Hero.tsx:11`) — treat as intentional responsive step or add it to the ramp.

## Questions to Consider

1. If "every correction is a lesson" is the entire reason QuickRefine exists over pasting into ChatGPT, why does the home page call the one endpoint that strips the lessons out — and what does "fast" buy that's worth the positioning?
2. Would you sign in to a proofreading tool whose own landing page says "Get instant proofreading opinion"? The site itself is the first sample of the product's output — is it treated that way anywhere in your process?
3. The sign-in wall stands exactly where the "aha" should be. What's the cheapest honest demo — one hardcoded annotated before/after in the result panel's exact visual language — that lets a stranger feel the margin-note experience before Google asks who they are?
