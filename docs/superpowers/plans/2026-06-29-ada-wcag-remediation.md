# ADA / WCAG 2.1 AA Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate the confirmed WCAG 2.1 AA accessibility defects on the KAWAI site (workstream A) and produce the conformance documentation counsel needs (workstream B), in response to an ADA demand letter from a visually impaired user.

**Architecture:** Most defects are systemic — fixed once in a shared component or design token, fixed everywhere. Code fixes are grouped so each task ends with a re-runnable audit that proves the specific WCAG criterion now passes. Counsel deliverables are generated from the same audit evidence so the legal record matches the engineering work.

**Tech Stack:** Next.js 15 (App Router) · Payload CMS 3 · Tailwind CSS v4 (CSS-first `@theme`, no config file) · Bun · Chrome DevTools MCP Lighthouse/axe for verification.

## Global Constraints

- **Standard:** WCAG 2.1 Level AA — the benchmark for ADA Title III web claims. Every fix is justified against a specific success criterion (cited per task).
- **Runtime:** Bun only — never npm/yarn/pnpm.
- **No new runtime dependencies** without explicit approval. Use existing primitives (Radix is already in for dialogs).
- **Verification is mandatory and evidence-based:** a task is not "done" until the named Lighthouse/axe audit shows the targeted audit ID passing (score 1) or the failing-element count for that audit drops to 0. Save every report — it becomes legal evidence.
- **Branch:** do all work on `fix/ada-wcag-aa-remediation` (we are currently on `main`). Do not commit to `main`.
- **Tailwind v4:** color tokens live in `src/app/globals.css` under `@theme`. There is no `tailwind.config.js`. Dynamic class names need the `@source inline()` safelist.
- **CMS-driven content:** alt text and video data come from Payload — code fixes must not hardcode content that belongs in the CMS.

**Confirmed audit baseline (2026-06-29, desktop Lighthouse):** Home 92 · Product 93 · Dealer 91. Failing axe audits across templates: `color-contrast` (20/67/19 elements), `link-name` (logo, every page), `label-content-name-mismatch` (play + radius buttons), `heading-order` (h3 skip). Reports in `.lh-home/`, `.lh-product/`, `.lh-dealer/`.

---

## File Structure

| File | Responsibility | Touched by |
|------|----------------|-----------|
| `src/app/(frontend)/layout.tsx` | Frontend shell; add skip link targeting existing `<main>` (line 169) | A1 |
| `src/components/layout/header.tsx` | Logo link accessible name (lines 960, 1384) | A2 |
| `src/app/globals.css` | `@theme` tokens; add compliant `kawai-muted` text token | A3 |
| `src/components/blocks/marketing/ArtistI2LRenderer.tsx` | Play-button label/name match (lines 77, 521) | A4 |
| `src/app/(frontend)/find-a-dealer/DealerFinderClient.tsx` | "Change search radius" label/name (line 208) | A4 |
| `src/app/(frontend)/stores/StoresMapClient.tsx` | Search input label (line 186) | A5 |
| `src/app/(frontend)/stores/StoresInteractiveSection.tsx` | Search input label (line 210) | A5 |
| `src/app/(frontend)/find-a-dealer/components/SearchBar.tsx` | Search input labels | A5 |
| `src/components/homepage/SpringSaleLocationModal.tsx` | Search input label (line 74) | A5 |
| `src/app/(frontend)/concert-artist/components/ConcertArtistModels.tsx` | `<div onClick>` → button (lines 99-104) | A6 |
| `src/components/piano/piano-builder.tsx` | Slot-selection `<div onClick>` → button | A6 |
| `docs/accessibility/remediation-tracker.md` | Counsel deliverable: prioritized defect register | B1 |
| `docs/accessibility/VPAT-kawaius-2026-06.md` | Counsel deliverable: WCAG 2.1 AA conformance table | B2 |

---

## WORKSTREAM A — Code Remediation

Ordered by legal exposure × blast radius. A1–A4 are site-wide single-component wins; A3 (contrast) is the highest-volume fix.

### Task A1: Skip-to-content link + verified `<main>` landmark

**WCAG:** 2.4.1 Bypass Blocks (A). A keyboard/screen-reader user can currently only reach content by tabbing the whole header.

**Files:**
- Modify: `src/app/(frontend)/layout.tsx` (a `<main className="flex-1 m-0 p-0">` already exists at line 169 — add an `id` and the skip link)
- Modify: `src/app/globals.css` (add `.sr-only` / `focus:not-sr-only` utilities if not already present — verify first)

- [ ] **Step 1 — Baseline:** confirm no skip link exists: `grep -rni 'skip.*content' src/app src/components` → expect no result.
- [ ] **Step 2 — Add `id` to main.** In `src/app/(frontend)/layout.tsx` line 169, change `<main className="flex-1 m-0 p-0">` to `<main id="main-content" className="flex-1 m-0 p-0">`.
- [ ] **Step 3 — Add the skip link** as the first focusable element inside the layout's top wrapper (immediately before the header render):

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-kawai-black focus:px-4 focus:py-2 focus:text-white"
>
  Skip to main content
</a>
```

- [ ] **Step 4 — Verify `sr-only` exists.** `grep -n 'sr-only' src/app/globals.css`. If absent, add the standard Tailwind `sr-only` + `not-sr-only` utilities under an `@layer utilities` block (each Tailwind v4 CSS file needs its own `@import "tailwindcss"` — globals.css already has it).
- [ ] **Step 5 — Verify (manual keyboard):** reload `http://localhost:3000`, press Tab once. The skip link must become visible and focused. Press Enter → focus jumps to main content.
- [ ] **Step 6 — Verify (audit):** re-run Lighthouse navigation on home; `bypass` audit passes and no new regressions.
- [ ] **Step 7 — Commit:** `git add -A && git commit -m "a11y: add skip-to-content link and main landmark id (WCAG 2.4.1)"`

### Task A2: Header logo link accessible name (site-wide `link-name` failure)

**WCAG:** 4.1.2 Name, Role, Value (A). The logo `<a href="/">` wraps an SVG/image with no text — flagged on every page audited.

**Files:**
- Modify: `src/components/layout/header.tsx` (lines 960 and 1384 — both `href="/"` logo links)

- [ ] **Step 1 — Inspect** both links (lines 960, 1384) to confirm neither has `aria-label` and the child is an icon/image, not text.
- [ ] **Step 2 — Add accessible name** to each: `<a href="/" aria-label="Kawai — Home">`. (If the link already contains an `<Image>` with descriptive `alt`, prefer fixing the `alt`; do not double-label.)
- [ ] **Step 3 — Verify (audit):** re-run Lighthouse navigation on home AND product. `link-name` audit passes (was failing on both).
- [ ] **Step 4 — Commit:** `git add -A && git commit -m "a11y: give header logo links an accessible name (WCAG 4.1.2)"`

### Task A3: Color contrast — global token fix (highest volume: 100+ elements)

**WCAG:** 1.4.3 Contrast Minimum (AA, 4.5:1). Approved approach: fix at the token/utility source so all pages are corrected at once. Failing colors observed: `#99a1af` (`text-gray-400`), `#ababab` (`text-kawai-charcoal/40`), and `/50`,`/35`,`/30` charcoal on white/pearl — measured 2.0–2.96:1.

**Files:**
- Modify: `src/app/globals.css` (add `kawai-muted` token)
- Modify: the failing usages surfaced by audit (migrate, do not blindly swap all 580 occurrences — many sit on dark backgrounds and already pass)

- [ ] **Step 1 — Add a compliant muted-text token** to the `@theme` block in `globals.css`:

```css
/* Accessible muted text — 4.6:1 on white, 4.5:1 on kawai-pearl. WCAG 1.4.3 AA */
--color-kawai-muted: #595959;
```

This auto-generates `text-kawai-muted`. (`#595959` clears AA at all sizes on both white and `#FAF8F5`.)

- [ ] **Step 2 — Enumerate the actual failures.** From each saved report, list the failing selectors:

```bash
for p in home product dealer; do
  node -e "const r=require('./.lh-$p/report.json');r.audits['color-contrast'].details.items.forEach(i=>console.log('$p',i.node.selector))"
done | sort -u
```

- [ ] **Step 3 — Migrate failing light-on-light usages** to `text-kawai-muted` (or a darker step). Primary targets: `text-gray-400`, `text-kawai-charcoal/30`, `/35`, `/40`, `/50` **where rendered on a light background**. Use grep to find them and edit in place; leave instances on dark backgrounds alone.
- [ ] **Step 4 — Add safelist entry** if any muted class is composed dynamically: add `text-kawai-muted` to the `@source inline()` block in `globals.css`.
- [ ] **Step 5 — Verify (audit), iterate:** re-run Lighthouse navigation on home, product, AND dealer. Target: `color-contrast` failing-element count = 0 on all three. Re-run Step 2 enumeration; fix any stragglers; repeat until clean.
- [ ] **Step 6 — Spot-check brand pages** flagged in code audit: Shigeru pages using `text-kawai-gold` on pearl/white. Audit `http://localhost:3000/shigeru` (snapshot mode) and migrate any failing gold text.
- [ ] **Step 7 — Commit:** `git add -A && git commit -m "a11y: introduce compliant muted-text token and fix low-contrast text (WCAG 1.4.3)"`

### Task A4: Button label / accessible-name mismatch

**WCAG:** 2.5.3 Label in Name (A). Buttons whose `aria-label` does not contain their visible text — breaks voice-control users and flagged by axe.

**Files:**
- Modify: `src/components/blocks/marketing/ArtistI2LRenderer.tsx` (lines 77, 521 — `aria-label={`Play: ${video.title}`}` on buttons that also render the title visibly)
- Modify: `src/app/(frontend)/find-a-dealer/DealerFinderClient.tsx` (line 208 — `aria-label="Change search radius"` on a button whose visible text is the current radius value)

- [ ] **Step 1 — ArtistI2LRenderer:** the visible text is the video title but `aria-label` prefixes `"Play: "`. Either (a) remove the redundant `aria-label` and let the visible title be the name plus a `<span className="sr-only">Play </span>`, or (b) ensure the visible text string is a substring of the aria-label (it already is — confirm casing/punctuation match exactly, the mismatch is the trailing space/diacritics). Prefer (a).
- [ ] **Step 2 — DealerFinderClient line 208:** make the accessible name include the visible radius text, e.g. `aria-label={`Change search radius, currently ${radius} miles`}` so the visible "{radius} mi" is contained in the name.
- [ ] **Step 3 — Verify (audit):** re-run Lighthouse navigation on home (play buttons) and dealer (radius button). `label-content-name-mismatch` passes on both.
- [ ] **Step 4 — Commit:** `git add -A && git commit -m "a11y: align button accessible names with visible labels (WCAG 2.5.3)"`

### Task A5: Form input labels

**WCAG:** 1.3.1 Info & Relationships, 4.1.2 Name (A). Search inputs rely on placeholder only — no programmatic label.

**Files (all 4 search inputs):**
- `src/app/(frontend)/stores/StoresMapClient.tsx:186`
- `src/app/(frontend)/stores/StoresInteractiveSection.tsx:210`
- `src/app/(frontend)/find-a-dealer/components/SearchBar.tsx` (search inputs)
- `src/components/homepage/SpringSaleLocationModal.tsx:74`

- [ ] **Step 1 — Add a programmatic label** to each input. Minimum viable: `aria-label` matching the intent, e.g. `aria-label="Search dealers by city or state"`. Keep the placeholder for sighted users.
- [ ] **Step 2 — Prefer a real `<label>`** with `htmlFor` + matching `id` where layout allows; use `sr-only` on the label if the design has no room for a visible one.
- [ ] **Step 3 — Verify (orphaned-input snippet):** with Chrome DevTools MCP, navigate `/find-a-dealer` and `/stores`, run the "Find Orphaned Form Inputs" evaluate_script snippet → expect empty result. Open the Spring Sale modal and re-check.
- [ ] **Step 4 — Commit:** `git add -A && git commit -m "a11y: label dealer/store search inputs (WCAG 1.3.1, 4.1.2)"`

### Task A6: Keyboard-operable controls (non-semantic `<div onClick>`)

**WCAG:** 2.1.1 Keyboard, 4.1.2 (A). `<div>`/`<span>` click handlers are not focusable or key-operable.

**Files:**
- `src/app/(frontend)/concert-artist/components/ConcertArtistModels.tsx:99-104` (scroll-to-grid div)
- `src/components/piano/piano-builder.tsx` (slot-selection divs)
- Dismiss overlays (e.g. `DealerFinderClient` radius-menu backdrop) — these are lower risk but should not be the *only* way to dismiss

- [ ] **Step 1 — Convert** each interactive `<div onClick={fn}>` to `<button type="button" onClick={fn}>` with appropriate styling reset, OR if it must stay a div, add `role="button"`, `tabIndex={0}`, and an `onKeyDown` that fires on Enter/Space.
- [ ] **Step 2 — Dismiss overlays:** ensure the underlying menu/modal also closes on `Escape` (so the click-backdrop isn't the sole affordance). Radix-based ones already do; hand-rolled ones need an Escape handler.
- [ ] **Step 3 — Verify (manual keyboard):** Tab to each converted control, activate with Enter and Space, confirm the action fires. Navigate `/concert-artist` and a product page with the piano builder.
- [ ] **Step 4 — Commit:** `git add -A && git commit -m "a11y: make custom click targets keyboard-operable (WCAG 2.1.1)"`

### Task A7: Heading order

**WCAG:** 1.3.1 (A). An `<h3>` appears without a preceding `<h2>` (flagged on home + dealer).

**Files:** identified at verify time from the audit selector (the flagged `<h3 class="text-[15px] font-semibold leading-snug mb-1.5 ...">` — likely a card title component shared by home/dealer).

- [ ] **Step 1 — Locate:** `grep -rn 'text-\[15px\] font-semibold leading-snug mb-1.5' src/` to find the component rendering the out-of-order `h3`.
- [ ] **Step 2 — Fix:** change the tag to the correct level for its position (likely `h2`, or restructure so the parent section has an `h2`). Preserve the visual size via classes, not the tag level.
- [ ] **Step 3 — Verify (audit):** re-run navigation on home + dealer; `heading-order` passes.
- [ ] **Step 4 — Commit:** `git add -A && git commit -m "a11y: correct heading hierarchy (WCAG 1.3.1)"`

### Task A8 (flag, lower priority for THIS plaintiff): Video captions

**WCAG:** 1.2.2 Captions (A). No `<track>` elements anywhere. Less relevant to a *visually impaired* claimant (this is a hearing criterion) but a common companion claim — document it and plan it, do not necessarily block the first remediation pass.

- [ ] **Step 1 — Decision point:** confirm with counsel/stakeholders whether captions are in scope for pass 1. Marketing/hero video is often decorative+muted (autoplay-muted is compliant), but any video with meaningful speech needs captions.
- [ ] **Step 2 — If in scope:** add a CMS field for a WebVTT caption file on the video block, render `<track kind="captions" src=... srclang="en" label="English" />`, and require captions on speech-bearing videos. (Separate plan if large.)

### Task A9: Full-site verification sweep (gate before merge)

- [ ] **Step 1 — Re-audit all sampled templates** (home, product, dealer, plus `/stores`, `/concert-artist`, `/shigeru`) with Lighthouse navigation, desktop AND mobile, saving fresh reports to `.lh-final/<page>/`.
- [ ] **Step 2 — Confirm** every previously failing axe audit (`color-contrast`, `link-name`, `label-content-name-mismatch`, `heading-order`) now passes and the accessibility score rose from the 91–93 baseline.
- [ ] **Step 3 — Manual screen-reader pass** (VoiceOver on macOS) of the core flow: home → browse → product → find-a-dealer/contact. Note any reading-order or focus issues automated tools missed; file follow-ups.
- [ ] **Step 4 — Record** the final scores + report paths into the workstream-B tracker.

---

## WORKSTREAM B — Counsel Deliverables

Generated from the audit evidence so the legal record matches the code. Do B1 early (counsel wants to see we are acting) and keep it updated as A-tasks close.

### Task B1: Remediation tracker (prioritized defect register)

**File:** Create `docs/accessibility/remediation-tracker.md`

- [ ] **Step 1 — Create the register** as a table with columns: `ID | Defect | WCAG criterion (number + name + level) | Severity (Critical/Serious/Moderate) | Location (file / page) | Evidence (report path) | Status | Fixed-in commit`.
- [ ] **Step 2 — Populate** one row per confirmed defect from the audit (the four live axe failures + the code-audit findings: unlabeled inputs, `div onClick`, skip link, gold contrast, video captions). Mark live-confirmed vs code-found.
- [ ] **Step 3 — Add a header block:** date, standard targeted (WCAG 2.1 AA), tools used (Lighthouse + axe-core, manual VoiceOver), pages sampled, and the baseline scores. This frames the document as a good-faith, methodical remediation record.
- [ ] **Step 4 — Keep `Status` current** as each A-task commits; this file is the single source of truth for "what's left."
- [ ] **Step 5 — Commit:** `git add docs/accessibility/remediation-tracker.md && git commit -m "docs(a11y): add WCAG remediation tracker for counsel"`

### Task B2: VPAT — WCAG 2.1 AA conformance report

**File:** Create `docs/accessibility/VPAT-kawaius-2026-06.md`

- [ ] **Step 1 — Use the WCAG 2.1 AA table structure:** one row per applicable Level A and AA success criterion, columns `Criterion | Conformance Level | Remarks and Explanations`. Conformance values: *Supports / Partially Supports / Does Not Support / Not Applicable*.
- [ ] **Step 2 — Fill from evidence:** mark the criteria we fixed as *Supports* with a remark citing the fix; mark anything still open (e.g. captions if deferred) honestly as *Partially Supports* with the remediation date. Do not overclaim — a VPAT that claims full support and is later contradicted is worse than an honest one.
- [ ] **Step 3 — Include scope:** product name, version/date, evaluation methods (automated Lighthouse/axe + manual keyboard/VoiceOver), and contact. Note it is a self-assessment; recommend a third-party audit for litigation defense.
- [ ] **Step 4 — Commit:** `git add docs/accessibility/VPAT-kawaius-2026-06.md && git commit -m "docs(a11y): add WCAG 2.1 AA VPAT self-assessment"`

---

## Self-Review Notes

- **Spec coverage:** every live axe failure → a task (contrast A3, link-name A2, label-mismatch A4, heading-order A7). Every code-audit finding → a task (inputs A5, div-onClick A6, skip link A1, captions A8). Counsel asks → B1+B2.
- **Verification is real:** each code task re-runs the exact audit that failed and requires the count to hit 0 — evidence before claiming done (this matters doubly because the output is legal evidence).
- **Out of scope (flagged, not silently dropped):** full third-party certified audit, automated a11y CI/regression test, and a deep screen-reader pass beyond the A9 spot-check — recommend as follow-ups; a litigation-grade defense usually wants the third-party audit.

## Execution Handoff

Order: A1 → A2 → A4 → A7 (quick site-wide wins) → A3 (contrast, biggest) → A5 → A6 → A9 gate, with B1 started in parallel up front and B2 after A9.
