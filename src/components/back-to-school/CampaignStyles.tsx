/**
 * Every rule the Back to School page adds to the site's own styles, emitted
 * once from the page shell.
 *
 * It lives in a `<style>` tag rather than a CSS file for the same reason the
 * hero's keyframes always have: these rules belong to one campaign and would
 * otherwise ship on every route. Nothing here uses `@apply`, so it needs no
 * `@import "tailwindcss"` (see the Tailwind v4 note in CLAUDE.md).
 *
 * The type scale is the redesign: Oswald condensed caps take the section
 * headings at poster size, and Cormorant is demoted to a single italic
 * counterpoint line per section — the serif lands harder used once than used
 * for every heading on the page.
 */
export function CampaignStyles() {
  return (
    <style>{`
      /* ── Type scale ─────────────────────────────────────────────────── */
      .bts-display {
        font-family: var(--font-oswald), sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        line-height: 0.86;
        letter-spacing: -0.012em;
      }
      /* Section headings. Poster-scale — the whole point of the redesign. */
      .bts-h2 { font-size: clamp(2.3rem, 6.2vw, 4.9rem); }
      .bts-h3 { font-size: clamp(1.65rem, 3.4vw, 2.6rem); }
      .bts-eyebrow {
        font-family: var(--font-oswald), sans-serif;
        font-size: 0.7rem;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      .bts-num {
        font-family: var(--font-oswald), sans-serif;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.01em;
      }
      /* The counterpoint voice: one italic serif line per section, no more. */
      .bts-serif {
        font-family: var(--font-family-cormorant), Georgia, serif;
        font-style: italic;
        font-weight: 400;
      }
      /* Outlined display type — poster device, used only at large sizes where
         a hairline stroke still reads (WCAG large-text threshold). */
      /* -webkit-text-fill-color, not the color property: currentColor must
         still resolve to the class's text colour so the stroke can take it. */
      .bts-outline {
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 1.25px currentColor;
        paint-order: stroke fill;
      }
      @supports not ((-webkit-text-stroke: 1px red)) {
        .bts-outline { -webkit-text-fill-color: currentColor; }
      }

      /* Outlined type lit like a neon tube: the stroke is the glass, the
         stacked drop-shadows are the light coming off it. drop-shadow rather
         than text-shadow because the glow has to follow the stroke, not the
         (transparent) fill — a text-shadow would bloom a solid slab.
         Large display sizes only, same as .bts-outline. */
      .bts-neon {
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 1.6px currentColor;
        paint-order: stroke fill;
        filter:
          drop-shadow(0 0 2px rgba(255, 122, 128, 0.95))
          drop-shadow(0 0 9px rgba(240, 45, 55, 0.75))
          drop-shadow(0 0 26px rgba(225, 25, 34, 0.5))
          drop-shadow(0 0 54px rgba(225, 25, 34, 0.32));
      }
      @supports not ((-webkit-text-stroke: 1px red)) {
        .bts-neon { -webkit-text-fill-color: currentColor; }
      }

      /* The tube striking, then settling.
         
         Two animations: the strike is the sign coming on — it catches, drops
         out, catches again — and the flicker is the idle stutter it keeps
         afterwards. steps(1, end) on both, because neon switches; it does not
         fade.

         The timing is a WCAG 2.3.1 budget, not a taste call. A flash is a pair
         of opposing luminance changes, and the ceiling is three per second, so
         no on-off pair sits closer than ~330ms to the next: the strike lands
         about 1.6 flashes per second and the idle loop about two per nine.
         Neither dip is long enough or deep enough to take the line under its
         contrast floor.

         Motion-safe only — the global reduced-motion rule sets every animation
         to 0.01ms, which on an infinite loop would be a strobe. */
      @media (prefers-reduced-motion: no-preference) {
        @keyframes bts-neon-strike {
          0%   { opacity: 0; }
          14%  { opacity: 1; }
          22%  { opacity: 0.18; }
          36%  { opacity: 1; }
          48%  { opacity: 0.22; }
          62%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes bts-neon-flicker {
          0%, 100% { opacity: 1; }
          46%   { opacity: 0.35; }
          49.5% { opacity: 1; }
          81%   { opacity: 0.55; }
          84%   { opacity: 1; }
        }
        /* --bts-neon-delay is set by the hero so the strike fires with the wipe
           that reveals the line. The fallback matches the hero's current cue. */
        .bts-neon {
          animation:
            bts-neon-strike 2s steps(1, end) var(--bts-neon-delay, 0.66s) both,
            bts-neon-flicker 9s steps(1, end)
              calc(var(--bts-neon-delay, 0.66s) + 2.6s) infinite;
        }
      }

      /* ── Hero entrance ──────────────────────────────────────────────── */
      /* The hero animates itself: CSS animations run without waiting on JS, so
         nothing gates the LCP text. Each keyframe ends on its resting state and
         is declared with fill mode both, so the global reduced-motion rule (0.01ms) lands
         every element on the finished hero immediately. */
      @keyframes bts-fade-up {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes bts-line-up {
        from { opacity: 1; clip-path: inset(110% -30% -30% -5%); transform: translateY(0.18em); }
        to   { opacity: 1; clip-path: inset(-30% -30% -30% -5%); transform: none; }
      }
      @keyframes bts-wipe-in {
        from { clip-path: inset(-45% 100% -45% -5%); }
        to   { clip-path: inset(-45% -30% -45% -5%); }
      }
      @keyframes bts-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes bts-draw-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes bts-track-in {
        from { opacity: 0; letter-spacing: 0.6em; }
        to   { opacity: 1; letter-spacing: 0.28em; }
      }

      .bts-in    { animation: bts-fade-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
      .bts-inline { display: block; animation: bts-line-up 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .bts-wipe  { animation: bts-wipe-in 1.1s cubic-bezier(0.76, 0, 0.24, 1) both; }
      .bts-drawx { transform-origin: left center; animation: bts-draw-x 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .bts-drawy { transform-origin: center; animation: bts-draw-y 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .bts-track { animation: bts-track-in 1s cubic-bezier(0.22, 1, 0.36, 1) both; }

      /* ── Scroll reveals (see Choreography.tsx) ───────────────────────── */
      .bts-r {
        --bts-d: 0s;
        opacity: 0;
        transform: translateY(22px);
        transition:
          opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) var(--bts-d),
          transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) var(--bts-d);
      }
      .bts-r[data-in='1'] { opacity: 1; transform: none; }

      /* Display lines rise out of their own baseline. The end state insets
         negatively so nothing clips a descender once the reveal finishes. */
      .bts-r.is-line {
        opacity: 1;
        transform: translateY(0.16em);
        clip-path: inset(110% -30% -30% -5%);
        transition:
          clip-path 1s cubic-bezier(0.16, 1, 0.3, 1) var(--bts-d),
          transform 1s cubic-bezier(0.16, 1, 0.3, 1) var(--bts-d);
      }
      .bts-r.is-line[data-in='1'] {
        clip-path: inset(-30% -30% -30% -5%);
        transform: none;
      }

      .bts-r.is-rulex {
        opacity: 1;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--bts-d);
      }
      .bts-r.is-rulex[data-in='1'] { transform: none; }

      .bts-r.is-ruley {
        opacity: 1;
        transform: scaleY(0);
        transform-origin: top center;
        transition: transform 1.15s cubic-bezier(0.22, 1, 0.36, 1) var(--bts-d);
      }
      .bts-r.is-ruley[data-in='1'] { transform: none; }

      .bts-r.is-wipe {
        opacity: 1;
        transform: none;
        clip-path: inset(-45% 100% -45% -5%);
        transition: clip-path 0.95s cubic-bezier(0.76, 0, 0.24, 1) var(--bts-d);
      }
      .bts-r.is-wipe[data-in='1'] { clip-path: inset(-45% -30% -45% -5%); }

      /* ── Ledger rows ────────────────────────────────────────────────── */
      /* The red edge slides out of the left margin on hover — the same pen
         stroke the section rules are drawn with, at row scale. */
      .bts-row::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--color-kawai-red, #E11922);
        transform: scaleY(0);
        transform-origin: center;
        transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .bts-row:hover::before,
      .bts-row:focus-visible::before { transform: scaleY(1); }
    `}</style>
  )
}

/**
 * Without JS the reveals would sit at opacity 0 forever. One rule, and the
 * page degrades to its finished state.
 */
export function CampaignNoScript() {
  return (
    <noscript>
      <style>{`.bts-r { opacity: 1 !important; transform: none !important; clip-path: none !important; }`}</style>
    </noscript>
  )
}
