# Accessibility Conformance Report (VPAT-style)
## WCAG 2.1 Level AA — kawaius.com

**Product:** KAWAI America / Kawai Canada website (kawaius.com, ca.kawaius.com)
**Report date:** 2026-06-29
**Evaluation methods:** Automated testing with Google Lighthouse (axe-core engine, desktop **and mobile**) across representative templates (Home, Product, Find-a-Dealer, Stores, Concert Artist); manual source-code review. Limited manual keyboard testing. **No full assistive-technology (screen reader) evaluation has yet been performed.**
**Prepared by:** Engineering (self-assessment)

> **Important:** This is an internal self-assessment prepared in good faith. It is not an independent third-party certification. "Supports" reflects results of automated tooling and code review on the sampled templates, not exhaustive page-by-page or screen-reader verification. We recommend a certified third-party audit to corroborate.

### Conformance terms
- **Supports** — meets the criterion on evaluated templates.
- **Partially Supports** — meets it in most places; known exceptions remain (listed).
- **Does Not Support** — does not meet it.
- **Not Evaluated** — not yet assessed (requires manual/AT testing).

## Table 1 — WCAG 2.1 Level A & AA (material criteria)

| Criterion | Level | Conformance | Remarks |
|---|---|---|---|
| 1.1.1 Non-text Content | A | Partially Supports | Most images carry alt text via the CMS Media system; decorative images use `alt=""`. Not exhaustively verified across all CMS content. |
| 1.2.2 Captions (Prerecorded) | A | Does Not Support | Marketing/hero videos lack caption `<track>` elements. Remediation planned (CMS captions field). Lower impact for vision-impaired users; relevant to hearing-impaired users. |
| 1.3.1 Info and Relationships | A | Partially Supports | Search inputs now have programmatic labels (fixed). Dealer card heading order corrected (h3→h2, desktop & mobile, verified). One remaining heading-order issue in the home hero carousel (intermittent; shared component) is still open. |
| 1.4.3 Contrast (Minimum) | AA | Partially Supports | Low-contrast light-gray text remediated across sampled templates via a new compliant muted-text token (product 67→9; dealer template now passes contrast on desktop and mobile). Dealer type badges fixed using the brand's own tokens (`kawai-gold-on-light`, `kawai-red-700`, darker charcoal). Remaining exceptions are a design decision: brand red `#E11922` as small text on dark surfaces, `text-white/40` on dark, and white-on-green status badge. |
| 1.4.4 Resize Text | AA | Not Evaluated | Layout uses responsive/relative units; not formally tested at 200% zoom. |
| 1.4.11 Non-text Contrast | AA | Not Evaluated | Icon/control contrast not formally audited. |
| 2.1.1 Keyboard | A | Partially Supports | Custom `<div onClick>` controls (concert-artist scroll trigger, piano-builder slot rows) made keyboard-operable (fixed). Full keyboard pass across all interactive components not yet completed. |
| 2.1.2 No Keyboard Trap | A | Partially Supports | Dialogs use Radix UI (focus trap, Escape, focus restore). Some hand-rolled dismiss overlays not yet fully verified. |
| 2.4.1 Bypass Blocks | A | Supports | "Skip to main content" link added; `<main id="main-content">` landmark present. |
| 2.4.3 Focus Order | A | Not Evaluated | Requires manual/AT testing. |
| 2.4.7 Focus Visible | AA | Not Evaluated | Focus styles present in many components; not formally audited site-wide. |
| 2.5.3 Label in Name | A | Supports | Button accessible names corrected to contain visible text (video play buttons, dealer radius button). |
| 2.5.8 Target Size (Minimum) | AA (WCAG 2.2) | Partially Supports | Most controls meet the 24×24px minimum. Mobile dealer-finder has 4 inline links below the minimum — open as a design decision (enlarging inline links affects card layout). |
| 3.1.1 Language of Page | A | Supports | `<html lang="en">` set. |
| 3.2.x Predictable | A/AA | Not Evaluated | Not formally assessed. |
| 3.3.2 Labels or Instructions | A | Partially Supports | Form inputs labelled; not all forms exhaustively reviewed. |
| 4.1.2 Name, Role, Value | A | Partially Supports | Header logo link accessible-name bug fixed (and a prop-forwarding defect in a link wrapper corrected); search inputs labelled. Full ARIA audit across all widgets not yet complete. |
| 2.3.3 Animation from Interactions | AAA (noted) | Supports | `prefers-reduced-motion` is honored globally. (Above AA; noted as a positive.) |

## Table 2 — criteria not yet evaluated

The following require manual and/or assistive-technology testing not yet performed, and are reported as **Not Evaluated**: 1.3.2, 1.3.3, 1.3.4, 1.3.5, 1.4.1, 1.4.5, 1.4.10, 1.4.12, 1.4.13, 2.4.2, 2.4.4, 2.4.5, 2.4.6, 2.5.1–2.5.4, 3.2.3, 3.2.4, 3.3.1, 3.3.3, 3.3.4, 4.1.3. A certified audit should cover these.

## Summary

Remediation has materially improved conformance on the highest-traffic templates, with the most legally-exposed issues for a vision-impaired user (missing accessible names, unlabeled form inputs, keyboard-inoperable controls, low-contrast text, missing skip link) **fixed and verified** on sampled pages. As of this revision the Find-a-Dealer template scores 100/100 (desktop) and 96/100 (mobile) on the automated accessibility audit, and dealer heading-order and type-badge contrast are resolved. Known remaining gaps — the home hero heading level, four mobile tap-targets, brand-color contrast on dark surfaces, and video captions — are documented honestly above and in the remediation tracker, with owners and next steps; most require a design or counsel decision rather than a code fix. A certified third-party audit and a manual screen-reader evaluation are recommended to validate this self-assessment and close the **Not Evaluated** items.
