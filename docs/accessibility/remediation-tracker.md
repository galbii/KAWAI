# KAWAI — Web Accessibility Remediation Tracker

**Standard targeted:** WCAG 2.1 Level AA (the benchmark used for ADA Title III web-accessibility claims)
**Date opened:** 2026-06-29
**Branch:** `fix/ada-wcag-aa-remediation`
**Evaluation methods:** Automated audit (Google Lighthouse + axe-core engine, desktop) across representative page templates, plus a manual source-code audit. Each code fix was re-verified against the same automated audit; evidence (JSON/HTML reports) retained per page.
**Pages sampled:** Home (`/`), Product (`/products/kawai-gx-2-aures-2-hybrid-piano`), Find-a-Dealer (`/find-a-dealer`), with spot checks on Stores and Concert Artist templates.

> **Note for counsel:** This is a good-faith internal engineering record produced promptly on receipt of the demand letter. It is a self-assessment using industry-standard automated tooling plus manual review; it is **not** a substitute for a certified third-party audit or a manual screen-reader evaluation, both of which we recommend as next steps (see "Recommended follow-ups").

## Automated accessibility scores (Lighthouse, desktop, 0–100)

| Template | Baseline (before) | Current (after) |
|---|---|---|
| Home | 92 | **95** |
| Product | 93 | **97** |
| Find-a-Dealer | 91 | **95** |

Automated tooling detects roughly 30–40% of WCAG criteria; a high score is necessary but not sufficient. The defect register below tracks specific issues regardless of score.

## Defect register

| ID | Defect | WCAG criterion (level) | Severity | Location | Status | Fix commit / note |
|----|--------|------------------------|----------|----------|--------|-------------------|
| D1 | Header logo/home icon link had no accessible name; flagged on every page. Root cause: a local `ContextAwareLink` wrapper silently dropped the `aria-label` prop. | 4.1.2 Name, Role, Value (A) | Serious | `src/components/layout/header.tsx` | **Fixed & verified** (`link-name` now passes) | `b87ba17`, `f3e83f4` |
| D2 | Buttons whose accessible name did not contain their visible text (video "Play" buttons; dealer radius button). | 2.5.3 Label in Name (A) | Moderate | `ArtistI2LRenderer.tsx`, `find-a-dealer/DealerFinderClient.tsx` | **Fixed & verified** | `9699913` |
| D3 | Low-contrast text: light-gray fine print (`text-gray-400`, low-opacity charcoal) on white/pearl, measured as low as 1.5:1 (need 4.5:1). 67 failing elements on the product template alone. | 1.4.3 Contrast Minimum (AA) | Serious | Product, home, dealer, stores templates; global muted-text token added | **Fixed & verified** for sampled templates (product 67→9; remaining 9 are design-flagged, see D8) | `6b7900e`, `b399361`, `96f1362`, `91fe660` |
| D4 | Search inputs labelled only by placeholder (no programmatic label) — invisible to screen readers. | 1.3.1 Info & Relationships (A); 4.1.2 (A) | Serious | `stores/StoresMapClient.tsx`, `stores/StoresInteractiveSection.tsx`, `find-a-dealer/components/SearchBar.tsx`, `homepage/SpringSaleLocationModal.tsx` | **Fixed** | `3e79fe8` |
| D5 | `<div onClick>` controls used as buttons — not focusable or keyboard-operable. | 2.1.1 Keyboard (A); 4.1.2 (A) | Critical | `concert-artist/.../ConcertArtistModels.tsx`, `components/piano/piano-builder.tsx` | **Fixed** | `58ad110` |
| D6 | No "skip to main content" link; keyboard users must tab through the entire header. | 2.4.1 Bypass Blocks (A) | Serious | `src/app/(frontend)/layout.tsx` | **Fixed** | `54915e2` |
| D7 | Heading hierarchy skips levels (an `<h3>` with no preceding `<h2>`): the dealer card title (desktop + mobile) and a hero display heading. | 1.3.1 Info & Relationships (A) | Moderate | `DealerCard.tsx`, `DealerFinderMobile.tsx`; home hero carousel | **Mostly fixed** — dealer card titles promoted to `<h2>` (desktop & mobile), verified. Home hero `<h3>` still **open** (intermittent, lives in shared carousel components — needs care so it doesn't disturb other pages). | `f5bca0e`, `a668827` |
| D8 | Brand/semantic colors below 4.5:1 on dark/colored backgrounds: brand red `#E11922` as small text on near-black; `text-white/40` on near-black; white text on the green "in stock" badge. | 1.4.3 (AA) | Moderate | Product template dark sections; status badge | **Open — design decision required** (cannot be fixed without altering brand palette or text size). | Flagged for design/marketing |
| D9 | Dealer type badges (Shigeru/Acoustic/Digital tags) low contrast. | 1.4.3 (AA) | Moderate | `DealerCard.tsx`, `DealerFinderMobile.tsx` | **Fixed & verified** — Shigeru→`kawai-gold-on-light`, Acoustic→darker charcoal, Digital→`kawai-red-700`, using the brand's own tokens. Dealer page now 100 (desktop). | `f5bca0e`, `7be8227` |
| D10 | Video/marketing media have no caption tracks (`<track>`). Less relevant to a vision-impaired claimant (a hearing criterion) but a common companion claim. | 1.2.2 Captions (A) | Moderate | Video block components | **Deferred** — requires a CMS captions field; scope with counsel. | See plan Task A8 |
| D11 | Mobile dealer-finder has 4 inline links below the 24×24px minimum tap-target size. | 2.5.8 Target Size (Minimum) (AA, WCAG 2.2) | Moderate | `find-a-dealer/components/DealerFinderMobile.tsx` | **Open — design decision** — enlarging inline text links affects card layout. | Flagged for design |

**Post-merge follow-up (2026-06-29):** the a11y branch was merged and the previously-blocking dealer work committed, which unblocked D7/D9. Result on the dealer template: **desktop 95→100**, **mobile 93→96** (only D11 tap-targets remain on mobile). Branch `fix/ada-wcag-aa-followup`.

## Recommended follow-ups (for a litigation-grade posture)

1. **Certified third-party accessibility audit** of the live site (manual + automated).
2. **Manual screen-reader walkthrough** (NVDA/JAWS/VoiceOver) of the core journeys — browse → product → contact / find-a-dealer — to catch reading-order and focus issues automated tools miss.
3. **Resolve D8/D9** with the design team (brand-color contrast on dark surfaces; dealer badges).
4. **Decide D10 scope** (video captions) with counsel.
5. **Add an automated accessibility regression check** (axe-core in CI) so fixes don't regress.
6. **Publish an accessibility statement** with a contact channel for users who encounter barriers — a recognized good-faith signal.

## Evidence

Lighthouse JSON + HTML reports were generated per page before and after remediation and retained locally (gitignored audit artifacts: `.lh-*/`). They can be exported for counsel on request.
