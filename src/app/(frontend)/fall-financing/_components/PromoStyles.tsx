/**
 * The Q4 page's own type scale and its single motion moment.
 *
 * Self-contained on purpose. The page used to import the Back to School
 * campaign's stylesheet, which sets almost everything in tracked-out condensed
 * caps — a register built to shout a seasonal event name. This page is a price
 * list for three offers, and a price list wants to be read, not shouted.
 *
 * Two faces, sharply divided by job:
 *
 *   Inter, sentence case, for anything a person reads as language. No caps
 *   labels, no letter-spaced eyebrows.
 *
 *   Oswald, for numerals and model names only. Its condensed tabular figures
 *   are what lets a column of prices and payments line up on the decimal, and
 *   a model name like ES920 is genuinely a capitalised token rather than caps
 *   applied as decoration.
 *
 * One rule governs colour: red marks money. Not headings, not rules, not
 * arrows. A shopper scanning the page can follow the red and find every number
 * that changes what they pay.
 *
 * Motion is limited to two things — one page-load sequence in the hero, and
 * the transitions that answer a tap on a tab or a row. Nothing fades in on
 * scroll; a ladder of section reveals is noise, not choreography.
 */
export function PromoStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
      .q4 {
        --ink: #1E1B16;
        --paper: #FAF8F5;
        --card: #FFFFFF;
        --money: #E11922;
        --rule: rgba(30, 27, 22, 0.14);
        --rule-soft: rgba(30, 27, 22, 0.08);
        --muted: rgba(44, 44, 44, 0.66);
        --muted-dim: rgba(44, 44, 44, 0.48);
      }

      /* Numerals and model tokens. Tabular so columns align on the digit. */
      .q4-num {
        font-family: var(--font-oswald), sans-serif;
        font-variant-numeric: tabular-nums;
        font-feature-settings: 'tnum' 1;
        letter-spacing: -0.005em;
      }
      .q4-model {
        font-family: var(--font-oswald), sans-serif;
        letter-spacing: 0.015em;
      }

      /* Language. Inter, sentence case, tightened only at display sizes. */
      .q4-display {
        font-family: var(--font-inter), system-ui, sans-serif;
        font-weight: 600;
        line-height: 1.04;
        letter-spacing: -0.028em;
        text-wrap: balance;
      }
      .q4-h2 {
        font-family: var(--font-inter), system-ui, sans-serif;
        font-weight: 600;
        font-size: clamp(1.75rem, 3.6vw, 2.9rem);
        line-height: 1.1;
        letter-spacing: -0.022em;
        text-wrap: balance;
      }
      .q4-lede {
        font-family: var(--font-inter), system-ui, sans-serif;
        font-size: clamp(1.02rem, 1.5vw, 1.2rem);
        line-height: 1.55;
        letter-spacing: -0.004em;
        max-width: 62ch;
      }

      /* The page-load sequence: the index rows arrive after the headline,
         once, and never again. --q4-i is the row's position. */
      @media (prefers-reduced-motion: no-preference) {
        .q4-enter {
          animation: q4-rise 0.62s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          animation-delay: calc(0.08s + var(--q4-i, 0) * 0.07s);
        }
      }
      @keyframes q4-rise {
        from { opacity: 0; transform: translateY(0.75rem); }
        to   { opacity: 1; transform: none; }
      }

      /* Tab panels answer a tap, so they move. */
      @media (prefers-reduced-motion: no-preference) {
        .q4-panel { animation: q4-panel 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
      }
      @keyframes q4-panel {
        from { opacity: 0; transform: translateY(0.35rem); }
        to   { opacity: 1; transform: none; }
      }

      .q4-focus:focus-visible {
        outline: 2px solid var(--ink);
        outline-offset: 3px;
      }
    `,
      }}
    />
  )
}

/** The one content column every block on this page uses. */
export const Q4_CONTAINER = 'mx-auto w-full max-w-[78rem] px-5 sm:px-8 lg:px-12'
