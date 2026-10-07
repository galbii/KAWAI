/**
 * The Fall Promo 2026 style layer, serving both campaign looks.
 *
 * Structure is three rings, and the point of the split is that a component can
 * be written once and land correctly in either variation:
 *
 *   .promo     the brand palette, identical in both looks
 *   .promo-a   Seasonal Offers  — Ivory ground, Walnut lead, calm
 *   .promo-b   Stack the Savings — Ink ground, Ember lead, loud
 *
 * Components never reach for `--ivory` or `--ink` directly. They use the
 * semantic aliases (`--ground`, `--on-ground`, `--lead`, `--surface`…), which
 * each variation re-points. That is what lets the ledger, the tabs and the
 * product cards render on either page without a `variation` prop threaded
 * through every one of them.
 *
 * Every alias below is annotated with its measured contrast against the ground
 * it is used on. This site is held to WCAG AA and two of the brand's own
 * pairings sit under it (see `@/lib/fall-promo/tokens`), so these are not
 * taste values — changing one is a compliance decision.
 *
 * Type is Fraunces for headlines and campaign names only, Instrument Sans for
 * everything a person reads as information. The guidelines forbid a bold or
 * all-caps campaign headline, so `.promo-display` and `.promo-h2` are locked to
 * weight 400 and inherit sentence case from the copy.
 */
export function PromoStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // NOTE: everything below is a JS template literal. A backtick inside
        // these CSS comments terminates the string and takes the whole
        // stylesheet with it — it has happened twice. Write `foo` as foo.
        __html: `
      .promo {
        /* Brand palette — guideline hexes, not sampled. */
        --ink: #1D1B18;
        --ivory: #F5EFE4;
        --parchment: #EADFCB;
        --walnut: #4A3426;
        --ember: #B4521E;
        --gold: #C8942F;
        /* Ember, darkened until it clears AA as SMALL TEXT. Same hue (20.2 deg
           against Ember's 20.8), so it reads as the accent rather than as a
           second colour -- it is the campaign's equivalent of the main site's
           kawai-red-400, which exists for exactly this reason.

           Ember itself is 4.40:1 on Ivory and 2.31:1 on the transparent glass
           card, so it cannot carry a word at 12-14px anywhere on this page.
           This is 4.75:1 at the glass card's worst composite and 9.46:1 at its
           best. Use it for red WORDS; use --accent for red SHAPES. */
        --ember-ink: #6B2E0F;

        /* Button labels are white, not Ivory: Ivory on Ember is 4.40:1 and
           fails AA at button size, white is 5.04:1. The brand's Ember fill is
           kept; only the label moves. */
        --btn-label: #FFFFFF;
      }

      /* ── Variation A · Seasonal Offers ──────────────────────────────── */
      .promo-a {
        --ground: var(--ivory);
        --surface: var(--parchment);      /* cards and photo mats */
        --on-ground: var(--ink);          /* 15.01:1 */
        --body: var(--walnut);            /* 10.14:1 */
        --body-dim: rgba(74, 52, 38, 0.78); /*  5.45:1 — the floor; fine print lives here */
        --lead: var(--walnut);
        --accent: var(--ember);           /* graphic only below 24px — 4.40:1 as text */
        --accent-ink: var(--ember-ink);   /* the accent as TEXT — 7.72:1 on Ivory */
        --rule: rgba(74, 52, 38, 0.18);
        --rule-soft: rgba(74, 52, 38, 0.10);
        /* Money, split by size because Ember is only legible as large text.
           --money is safe anywhere; --money-display is for figures set at
           24px or more and must never carry a caption or a label. */
        --money: var(--walnut);           /* 10.14:1 */
        --money-display: var(--ember);    /*  4.40:1 — >=24px only */
        /* Ember, deepened until it carries small text.
           A saving is the one figure that has to read as red at label size,
           and brand Ember is 4.40:1 on Ivory -- under AA for 13px. This is
           Ember at 92% value: 5.04:1, and indistinguishable from it beside
           the fill on a button. Use it for a saving, not as a second accent. */
        --money-accent: #A64B1B;          /*  5.04:1 on Ivory */
        --focus-ring: var(--ink);
        background-color: var(--ground);
        color: var(--on-ground);
      }

      /* ── Variation B · Stack the Savings ────────────────────────────── */
      .promo-b {
        --ground: var(--ink);
        --surface: rgba(245, 239, 228, 0.07);  /* a lift off Ink, not a new colour */
        --on-ground: var(--ivory);        /* 15.01:1 */
        --body: rgba(245, 239, 228, 0.72); /*  8.29:1 */
        --body-dim: rgba(245, 239, 228, 0.62); /*  6.6:1 — still clears AA */
        --lead: var(--ember);
        --accent: var(--gold);            /* Harvest Gold as text is 6.33:1 on Ink — its one sanctioned use */
        --rule: rgba(245, 239, 228, 0.20);
        --rule-soft: rgba(245, 239, 228, 0.12);
        --money: var(--gold);             /*  6.33:1 on Ink */
        --money-display: var(--ember);    /*  3.41:1 on Ink — >=24px only */
        --money-accent: #E86A26;          /*  5.34:1 on Ink — Ember lifted */
        --focus-ring: var(--ivory);
        background-color: var(--ground);
        color: var(--on-ground);
      }

      /* ── Type ───────────────────────────────────────────────────────── */

      /* Fraunces. Headlines and campaign names ONLY. Regular weight and
         sentence case are brand rules, not defaults — do not add a bold
         variant or an uppercase utility to either of these. */
      .promo-display {
        font-family: var(--font-fraunces), Georgia, serif;
        font-weight: 400;
        font-size: clamp(2.75rem, 7vw, 6rem);
        line-height: 1.02;
        letter-spacing: -0.018em;
        text-wrap: balance;
      }
      .promo-h2 {
        font-family: var(--font-fraunces), Georgia, serif;
        font-weight: 400;
        font-size: clamp(1.9rem, 4vw, 3.5rem);
        line-height: 1.08;
        letter-spacing: -0.012em;
        text-wrap: balance;
      }

      /* Instrument Sans. Sublines, body, prices, buttons, fine print. */
      .promo-lede {
        font-family: var(--font-instrument), system-ui, sans-serif;
        font-size: clamp(1.05rem, 1.6vw, 1.25rem);
        line-height: 1.5;
        max-width: 54ch;
      }
      .promo-label {
        font-family: var(--font-instrument), system-ui, sans-serif;
        font-size: 0.8125rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.16em;   /* the guideline's "+16%" */
      }
      /* Prices and payments. Tabular so a column aligns on the digit. */
      .promo-num {
        font-family: var(--font-instrument), system-ui, sans-serif;
        font-variant-numeric: tabular-nums;
        font-feature-settings: 'tnum' 1;
      }
      .promo-body {
        font-family: var(--font-instrument), system-ui, sans-serif;
      }

      /* The hairline under a campaign headline, above its subline. */
      .promo-rule {
        width: 4.5rem;
        height: 1px;
        border: 0;
        background: currentColor;
        opacity: 0.5;
      }

      /* ── Motion ─────────────────────────────────────────────────────── */
      @media (prefers-reduced-motion: no-preference) {
        .promo-enter {
          animation: promo-rise 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          animation-delay: calc(0.06s + var(--promo-i, 0) * 0.07s);
        }
        .promo-panel { animation: promo-rise 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
      }
      @keyframes promo-rise {
        from { opacity: 0; transform: translateY(0.7rem); }
        to   { opacity: 1; transform: none; }
      }

      /*
       * The one card material used on a photographic stage.
       *
       * Ink at 0.78 puts Ivory at about 7.3:1 against a blown-out frame, so a
       * card carries its own contrast and the picture behind it needs no wash.
       * Defined once because a stage can hold several of these — a copy
       * lockup, a control strip — and two that are almost the same read as a
       * mistake rather than a distinction. Padding is left to the caller; the
       * material is not.
       */
      .promo-card {
        background-color: rgba(29, 27, 24, 0.78);
        border: 1px solid rgba(245, 239, 228, 0.15);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
      }

      /* ── Laying content over a photograph ───────────────────────────── */

      /* Re-points the semantic tokens for anything drawn on a scrimmed image.
         Nested components invert on their own: no tone prop, no variant. */
      .promo-on-dark {
        --ground: var(--ink);
        --surface: rgba(245, 239, 228, 0.08);
        --on-ground: var(--ivory);
        --body: rgba(245, 239, 228, 0.92);
        --body-dim: rgba(245, 239, 228, 0.86);
        --rule: rgba(245, 239, 228, 0.26);
        --rule-soft: rgba(245, 239, 228, 0.15);
        --money: var(--gold);
        --money-accent: #E86A26;
        --focus-ring: var(--ivory);
      }

      /* And back again, for an OPAQUE object sitting on that dark ground — a
         product card, a panel. Its own fill supplies the contrast, so it wants
         the page's ordinary light set rather than the inverted one. Without
         this a card nested in .promo-on-dark would paint its photo well on Ink
         and its price in Ivory-on-Parchment. */
      .promo-on-light {
        --ground: var(--ivory);
        --surface: var(--parchment);
        --on-ground: var(--ink);
        /* Deliberately NOT mirrored into .promo-on-dark. A dark ground needs a
           LIGHTER red than Ember, not a darker one, so this value would be
           worse there than the thing it fixes. Work the figure out before
           adding one. */
        --accent-ink: var(--ember-ink);
        --body: var(--walnut);
        --body-dim: rgba(74, 52, 38, 0.78);
        --rule: rgba(74, 52, 38, 0.18);
        --rule-soft: rgba(74, 52, 38, 0.10);
        --money: var(--walnut);
        --money-accent: #A64B1B;
        --focus-ring: var(--ink);
      }

      /*
       * Small text laid directly on a photograph, with no scrim under it.
       *
       * Two shadows doing two jobs: a tight one that gives each glyph an edge
       * against whatever it happens to land on, and a wide soft one that lifts
       * the whole line off a busy background. Ink rather than black, so it
       * reads as part of the palette on the warm frames this campaign runs.
       *
       * This improves how the line READS. It does not improve what the line
       * MEASURES: WCAG 1.4.3 compares text colour to background colour and
       * ignores shadows entirely, so a shadowed line over a bright frame is
       * still the ~1.1:1 noted in PromoHeroCarousel. It is a legibility aid on
       * top of an accepted exception, not a fix for it.
       */
      .promo-photo-text {
        text-shadow:
          0 1px 2px rgba(29, 27, 24, 0.72),
          0 2px 10px rgba(29, 27, 24, 0.6),
          0 4px 26px rgba(29, 27, 24, 0.45);
      }

      /*
       * The same thing at display size.
       *
       * A shadow is sized against the glyph it sits under, not against the
       * page: .promo-photo-text's 2px blur disappears entirely beneath a 6rem
       * .promo-display heading, which is why the hero headline read as having
       * no shadow at all while the line below it clearly did. Three passes —
       * a tight one for edge definition, a mid one for weight, and a wide soft
       * one that lifts the whole word off a busy frame.
       *
       * Same caveat as its smaller sibling, and it bears repeating because this
       * one is tempting: it changes how the headline READS and nothing about
       * what it MEASURES. The gradient behind it is what carries the contrast.
       */
      .promo-photo-display {
        text-shadow:
          0 2px 4px rgba(29, 27, 24, 0.6),
          0 6px 24px rgba(29, 27, 24, 0.55),
          0 12px 60px rgba(29, 27, 24, 0.45);
      }

      .promo-focus:focus-visible {
        outline: 2px solid var(--focus-ring, var(--ink));
        outline-offset: 3px;
      }
    `,
      }}
    />
  )
}

/** The one content column every section in both variations uses. */
export const PROMO_CONTAINER = 'mx-auto w-full max-w-[78rem] px-5 sm:px-8 lg:px-12'

/**
 * The wide measure, for a section whose content rewards the room.
 *
 * Not a default. 78rem is the campaign's reading measure and prose belongs in
 * it; this exists for the two sections built around a large photograph — the
 * financing carousel and the SH-9 stage — where the extra width goes to the
 * picture rather than to a longer line of text. The gutters tighten with it,
 * because a section that has claimed the viewport should not then give 12rem
 * back at the edges.
 */
export const PROMO_CONTAINER_WIDE = 'mx-auto w-full max-w-[104rem] px-4 sm:px-6 lg:px-8'
