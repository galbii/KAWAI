/**
 * The Black Friday look, for /black-friday and /black-friday-ext only.
 *
 * kawai-black-friday-redesign v2 (Chance, Nov 15 2026): a cooler, more modern
 * Black Friday dress on the same page — same sections, same order, same words.
 * Everything here is scoped to `.promo-bf`, the class `SalePage` adds to its
 * wrapper, and this stylesheet only renders on the two Black Friday routes, so
 * /fall-financing (which shares every section component) is untouched.
 *
 * It works the way the fall campaign's own variations do: by re-pointing the
 * semantic tokens in `PromoStyles` (`--ground`, `--on-ground`, `--ember`…)
 * rather than restyling components one by one. Opaque cards keep
 * `.promo-on-light`, so prices and fine print still sit on the light set their
 * contrast was measured on.
 *
 * Contrast, measured (WCAG 2.x) on the BF ground #0E0D0C:
 *   Ivory 16.97:1 · Ivory 0.78 10.39:1 · Ivory 0.72 8.98:1
 *   Kawai Red #E11922 4.03:1 (shapes and >=24px only) · #FF4D55 5.96:1 · #FF6B6F 7.01:1
 *   White label on Kawai Red 4.81:1 (AA at button size; hover darkens, never lightens)
 *
 * Brand rules kept: Fraunces 400 in sentence case for headlines, Instrument
 * Sans for everything read as information, no new fonts.
 *
 * Compliance: the financing lockup (§4.1/§4.2) sizes itself with inline
 * styles, which nothing here overrides, and "0%" and its APR share one colour
 * token, so they stay identical to each other.
 *
 * Motion: two decorative loops (a slow red glow in the hero, a light sweep on
 * the main buttons), both inside `prefers-reduced-motion: no-preference`.
 *
 * NOTE: this is a JS template literal. A backtick inside the CSS ends it.
 */
export function SaleStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
      /* ── Tokens ─────────────────────────────────────────────────────── */
      .promo.promo-bf {
        --ink: #0E0D0C;
        --kawai-red: #E11922;
        --ember: var(--kawai-red);          /* button fills, lit lines, dots */
        --ground: var(--ink);
        --surface: rgba(245, 239, 228, 0.06);
        --on-ground: var(--ivory);          /* 16.97:1 */
        --body: rgba(245, 239, 228, 0.78);  /* 10.39:1 */
        --body-dim: rgba(245, 239, 228, 0.72); /* 8.98:1 */
        --lead: var(--ivory);
        --accent: var(--kawai-red);         /* shapes only below 24px */
        --accent-ink: #FF6B6F;              /* red as small text, 7.01:1 */
        --rule: rgba(245, 239, 228, 0.14);
        --rule-soft: rgba(245, 239, 228, 0.08);
        --money: var(--ivory);
        --money-display: #FF4D55;           /* 5.96:1 */
        --money-accent: #FF6B6F;            /* 7.01:1 */
        --focus-ring: var(--ivory);
        background-color: var(--ground);
        color: var(--on-ground);
      }
      /* Dialogs portal out of the wrapper; give their buttons the same red. */
      body:has(.promo-bf) .promo { --ember: #E11922; }

      /* ── Type scale ─────────────────────────────────────────────────── */
      .promo-bf .promo-h2 {
        font-size: clamp(2.15rem, 4.6vw, 4.25rem);
        line-height: 1.02;
        letter-spacing: -0.028em;
      }
      .promo-bf .promo-label { letter-spacing: 0.22em; }
      .promo-bf #promo-hero-title {
        font-size: clamp(3.3rem, 8.2vw, 7.75rem) !important;
        line-height: 0.92 !important;
        letter-spacing: -0.032em;
      }

      /* ── Hero ───────────────────────────────────────────────────────── */
      .promo-bf section[aria-labelledby="promo-hero-title"] > div:first-child::after {
        content: '';
        position: absolute;
        inset: -20% -10% -10% -20%;
        z-index: -1;
        pointer-events: none;
        background:
          radial-gradient(42% 46% at 18% 72%, rgba(225, 25, 34, 0.30), rgba(225, 25, 34, 0) 70%),
          radial-gradient(30% 30% at 86% 18%, rgba(225, 25, 34, 0.12), rgba(225, 25, 34, 0) 70%);
        mix-blend-mode: screen;
      }
      /* A red hairline where the picture meets the offer index. */
      .promo-bf nav[aria-label="The offers on this page"] {
        position: relative;
        background: linear-gradient(180deg, #120F0E 0%, var(--ink) 100%);
      }
      .promo-bf nav[aria-label="The offers on this page"]::before {
        content: '';
        position: absolute;
        inset: -1px 0 auto 0;
        height: 1px;
        background: linear-gradient(90deg, rgba(225,25,34,0) 0%, rgba(225,25,34,0.85) 30%, rgba(225,25,34,0.85) 70%, rgba(225,25,34,0) 100%);
        pointer-events: none;
      }
      .promo-bf nav[aria-label="The offers on this page"] button {
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
      }
      .promo-bf nav[aria-label="The offers on this page"] button:hover,
      .promo-bf nav[aria-label="The offers on this page"] button[aria-current="true"] {
        background-color: rgba(225, 25, 34, 0.08);
        box-shadow: inset 0 -1px 0 rgba(225, 25, 34, 0.35);
      }
      /* Phones: a shorter stage, so the offer index starts inside the first screen. */
      @media (max-width: 639px) {
        .promo-bf section[aria-labelledby="promo-hero-title"] > div:first-child {
          min-height: 25rem;
        }
        .promo-bf section[aria-labelledby="promo-hero-title"] > div:first-child > div:not([aria-hidden]) {
          padding-top: 4.5rem;
          padding-bottom: 1.75rem;
        }
        .promo-bf nav[aria-label="The offers on this page"] button {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
      }

      /* ── Buttons: Kawai Red pills ───────────────────────────────────── */
      .promo-bf [class*="rounded-[3px]"] { border-radius: 999px; }
      .promo-bf [class*="bg-[color:var(--ember)]"] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        box-shadow: 0 10px 28px -12px rgba(225, 25, 34, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.14);
        transition: background-color 0.2s ease, box-shadow 0.3s ease, transform 0.2s ease;
      }
      .promo-bf [class*="bg-[color:var(--ember)]"]:hover {
        box-shadow: 0 14px 36px -10px rgba(225, 25, 34, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.14);
      }

      /* ── Stages and cards ───────────────────────────────────────────── */
      .promo-bf [data-promo-stage]::before {
        content: '';
        position: absolute;
        inset: 0 0 auto 0;
        height: 1px;
        z-index: 20;
        pointer-events: none;
        background: linear-gradient(90deg, rgba(225,25,34,0) 0%, rgba(225,25,34,0.6) 50%, rgba(225,25,34,0) 100%);
      }
      .promo-bf .promo-card {
        background-color: rgba(14, 13, 12, 0.82);
        border-color: rgba(245, 239, 228, 0.1);
        border-radius: 14px;
        box-shadow: inset 0 2px 0 -1px rgba(225, 25, 34, 0.9), 0 30px 60px -30px rgba(0, 0, 0, 0.8);
      }
      .promo-bf [data-promo-stage] button.rounded-lg { border-radius: 14px; }

      /* ── Financing sheet: dark, on a hairline grid with a red glow ───── */
      .promo-bf #financing {
        position: relative;
        isolation: isolate;
        background-color: var(--ink);
        background-image:
          radial-gradient(48% 60% at 8% 0%, rgba(225, 25, 34, 0.16), rgba(225, 25, 34, 0) 70%),
          linear-gradient(rgba(245, 239, 228, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245, 239, 228, 0.035) 1px, transparent 1px);
        background-size: auto, 72px 72px, 72px 72px;
      }
      .promo-bf #financing > div:first-child { padding-top: 4.5rem; padding-bottom: 4.5rem; }
      @media (min-width: 768px) {
        .promo-bf #financing > div:first-child { padding-top: 5.5rem; padding-bottom: 5.5rem; }
      }

      /* ── Lessons band and dealer close ──────────────────────────────── */
      .promo-bf #lessons { border-top: 1px solid rgba(245, 239, 228, 0.08); }

      /* ── Motion (decorative, opt-in) ────────────────────────────────── */
      @media (prefers-reduced-motion: no-preference) {
        .promo-bf section[aria-labelledby="promo-hero-title"] > div:first-child::after {
          animation: bf-glow 14s ease-in-out infinite alternate;
        }
        .promo-bf [class*="bg-[color:var(--ember)]"]::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(105deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 65%);
          transform: translateX(-120%);
          animation: bf-sweep 5.5s ease-in-out 1.8s infinite;
        }
        .promo-bf [class*="bg-[color:var(--ember)]"]:hover { transform: translateY(-1px); }
      }
      @keyframes bf-glow {
        from { transform: translate3d(0, 0, 0) scale(1); opacity: 0.85; }
        to   { transform: translate3d(4%, -3%, 0) scale(1.08); opacity: 1; }
      }
      @keyframes bf-sweep {
        0%, 62% { transform: translateX(-120%); }
        100%    { transform: translateX(120%); }
      }
    `,
      }}
    />
  )
}
