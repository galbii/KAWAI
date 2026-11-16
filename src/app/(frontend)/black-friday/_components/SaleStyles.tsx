/**
 * The Black Friday look, for /black-friday and /black-friday-ext only.
 *
 * v3 (kawai-black-friday-redesign v3, Chance, Nov 15 2026: v2 was "just too
 * boring"). Black, solid Kawai Red, big bold type, big photographs. Audit and
 * per-component plan: ~/dev/refs/kawai-black-friday-redesign/AUDIT.md.
 *
 * Scope: everything is under `.promo-bf`, the class `SalePage` adds to its
 * wrapper, and this stylesheet only renders on the two Black Friday routes, so
 * /fall-financing and the store fall pages (which share every section
 * component) are untouched.
 *
 * ── The text rule ─────────────────────────────────────────────────────────
 * The page's words must render exactly as before (QA diffs the rendered
 * text). A rendered-text diff reads `display` and `text-transform`, so this
 * sheet never changes either on anything that carries words: no uppercase
 * added or removed, nothing shown or hidden, no inline/block swaps. Every
 * decoration (bars, numerals, arrows) is a pseudo-element with no letters in
 * the document.
 *
 * ── Type ──────────────────────────────────────────────────────────────────
 * Headlines, offer names and prices: Oswald 600/700, the condensed display
 * face the site already loads in `app/layout.tsx` (and runs on the signup3
 * rebate ledger and the Shigeru microsite). Body: Instrument Sans. No new
 * fonts. Sentence case kept. The fall guideline's "Fraunces 400, never bold"
 * is a fall-campaign rule; Chance's v3 steering ("high contrast, bold type")
 * wins on these two routes, and the AUDIT flags it.
 *
 * ── Contrast (WCAG 2.x, measured) ─────────────────────────────────────────
 * On Black #0A0A0A: white 19.8:1 · white 0.85 14.6:1 · white 0.75 11.6:1 ·
 *   #FF4D55 6.2:1 · #FF6B6F 7.3:1 · Kawai Red #E11922 4.2:1 (shapes and
 *   >=24px bold only).
 * White on Kawai Red #E11922: 4.81:1 (buttons, chips, the lit tile).
 * White on Deep Red #B8121A: 6.4:1 (the lessons band).
 * Black on white 19.8:1 (inverted buttons on red).
 *
 * ── Compliance ────────────────────────────────────────────────────────────
 * The financing lockup (§4.1/§4.2) sizes itself with inline styles that
 * nothing here overrides; "0%" and its APR stay in one element, so the face
 * change applies to both equally. The Synchrony disclosure keeps its size.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * Only inside `prefers-reduced-motion: no-preference`: the hero bar wipe, the
 * tile and button lifts. Reduced motion gets the still page.
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
        --ink: #0A0A0A;
        /* Pure white for type on black: crisper than the fall Ivory. */
        --ivory: #FFFFFF;
        --kawai-red: #E11922;
        --deep-red: #B8121A;
        --ember: var(--kawai-red);
        --ground: var(--ink);
        --surface: rgba(255, 255, 255, 0.06);
        --on-ground: #FFFFFF;
        --body: rgba(255, 255, 255, 0.85);
        --body-dim: rgba(255, 255, 255, 0.75);
        --lead: #FFFFFF;
        --accent: var(--kawai-red);
        --accent-ink: #FF6B6F;
        --rule: rgba(255, 255, 255, 0.16);
        --rule-soft: rgba(255, 255, 255, 0.09);
        --money: #FFFFFF;
        --money-display: #FF4D55;
        --money-accent: #FF6B6F;
        --focus-ring: #FFFFFF;
        background-color: var(--ground);
        color: var(--on-ground);
      }
      /* Dialogs portal out of the wrapper; their buttons keep the same red. */
      body:has(.promo-bf) .promo { --ember: #E11922; }

      /* ── Type ───────────────────────────────────────────────────────── */
      .promo-bf .bf-display,
      .promo-bf .promo-h2 {
        font-family: var(--font-oswald), 'Oswald', 'Arial Narrow', sans-serif;
        font-weight: 700;
        letter-spacing: -0.008em;
        text-wrap: balance;
      }
      .promo-bf .promo-h2 {
        font-size: clamp(2.6rem, 6vw, 5.25rem);
        line-height: 0.96;
      }
      .promo-bf .promo-lede { font-size: clamp(1.08rem, 1.5vw, 1.3rem); line-height: 1.5; }
      .promo-bf .promo-label { letter-spacing: 0.2em; }
      /* Eyebrows over a section heading: red, so every section opens on a hit of colour. */
      .promo-bf p.promo-label.mb-5 { color: #FF4D55; }

      /* ── Buttons: solid red blocks ──────────────────────────────────── */
      .promo-bf [class*="rounded-[3px]"] { border-radius: 2px; }
      .promo-bf [class*="bg-[color:var(--ember)]"] {
        position: relative;
        font-weight: 600;
        letter-spacing: 0.01em;
        box-shadow: 0 18px 40px -18px rgba(225, 25, 34, 0.85);
        transition: background-color 0.2s ease, box-shadow 0.25s ease, transform 0.2s ease;
      }
      .promo-bf [class*="bg-[color:var(--ember)]"][class*="px-7"] { padding: 1.15rem 2.1rem; font-size: 1.02rem; }
      .promo-bf [class*="bg-[color:var(--ember)]"]:hover { background-color: var(--deep-red); }
      /* Outlined secondary buttons: a hard white edge. */
      .promo-bf [class*="rounded-[3px]"][class*="border"]:not([class*="bg-[color:var(--ember)]"]) {
        border-width: 2px;
        border-color: rgba(255, 255, 255, 0.85);
      }

      /* ── 1 · Hero ───────────────────────────────────────────────────── */
      .promo-bf .bf-hero { background: var(--ink); }
      .promo-bf .bf-hero-title {
        font-size: clamp(3.3rem, 6.6vw, 7.4rem);
        line-height: 0.9;
        max-width: 9ch;
      }
      @media (min-width: 640px) and (max-width: 1023px) { .promo-bf .bf-hero-title { max-width: none; } }
      /* The red bar over the headline. */
      .promo-bf .bf-hero-copy::before {
        content: '';
        display: block;
        width: 5.5rem;
        height: 0.55rem;
        margin-bottom: 1.6rem;
        background: var(--kawai-red);
        transform-origin: left center;
      }
      .promo-bf .bf-hero-body { color: rgba(255, 255, 255, 0.85); }
      .promo-bf .bf-hero-ending { color: rgba(255, 255, 255, 0.85); }
      /* The photograph: fades into the black under the words on phones, and
         gets a red edge where it meets the copy column from lg. */
      .promo-bf .bf-hero-photo-fade {
        background: linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.82) 22%, rgba(10,10,10,0.15) 55%, rgba(10,10,10,0) 70%);
      }
      @media (min-width: 1024px) {
        .promo-bf .bf-hero-photo { border-left: 10px solid var(--kawai-red); }
        .promo-bf .bf-hero-photo-fade {
          background: linear-gradient(to right, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0) 22%),
                      linear-gradient(to top, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0) 30%);
        }
      }

      /* The offer tiles. */
      .promo-bf .bf-hero-index { background: var(--ink); border-top: 1px solid rgba(255,255,255,0.12); counter-reset: bf-tile; }
      .promo-bf .bf-hero-index ul { background: rgba(255, 255, 255, 0.12); }
      .promo-bf .bf-tile-li { counter-increment: bf-tile; background: #121212; }
      .promo-bf .bf-tile { overflow: hidden; transition: background-color 0.35s ease; }
      .promo-bf .bf-tile::after {
        content: counter(bf-tile, decimal-leading-zero);
        position: absolute;
        right: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        font-family: var(--font-oswald), 'Oswald', sans-serif;
        font-weight: 700;
        font-size: clamp(3.5rem, 6vw, 6.5rem);
        line-height: 1;
        color: transparent;
        -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.2);
        pointer-events: none;
        transition: -webkit-text-stroke-color 0.35s ease;
      }
      .promo-bf .bf-tile-name {
        position: relative;
        font-size: clamp(1.7rem, 2.5vw, 2.6rem);
        line-height: 1;
        font-weight: 600;
        color: #FFFFFF;
      }
      .promo-bf .bf-tile-detail { position: relative; color: rgba(255, 255, 255, 0.78); }
      .promo-bf .bf-tile-cta {
        position: relative;
        color: #FFFFFF;
        padding-bottom: 0.3rem;
        border-bottom: 3px solid var(--kawai-red);
      }
      .promo-bf .bf-tile-cta::after { content: ' \\2192'; }
      .promo-bf .bf-tile-progress { background: #FFFFFF; }
      .promo-bf .bf-tile:hover,
      .promo-bf .bf-tile[aria-current="true"] { background-color: var(--kawai-red); }
      .promo-bf .bf-tile:hover::after,
      .promo-bf .bf-tile[aria-current="true"]::after { -webkit-text-stroke-color: rgba(255, 255, 255, 0.55); }
      .promo-bf .bf-tile:hover .bf-tile-detail,
      .promo-bf .bf-tile[aria-current="true"] .bf-tile-detail { color: #FFFFFF; }
      .promo-bf .bf-tile:hover .bf-tile-cta,
      .promo-bf .bf-tile[aria-current="true"] .bf-tile-cta { border-bottom-color: #FFFFFF; }

      /* ── Photographic stages (SH-9, rebates): bigger, cleaner ───────── */
      .promo-bf [data-promo-stage] { padding-top: 5rem; padding-bottom: 5rem; }
      @media (min-width: 1024px) { .promo-bf [data-promo-stage] { padding-top: 7rem; padding-bottom: 7rem; } }
      .promo-bf [data-promo-stage]::before {
        content: '';
        position: absolute;
        inset: 0 0 auto 0;
        height: 6px;
        z-index: 20;
        background: var(--kawai-red);
        pointer-events: none;
      }
      /* The lockup card and the "pianos this bundle comes with" strip: solid
         black panels with a red top bar, not frosted glass. */
      .promo-bf .promo-card {
        background-color: #0A0A0A;
        border: 0;
        border-top: 6px solid var(--kawai-red);
        border-radius: 0;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.85);
      }
      .promo-bf [data-promo-stage] .promo-card .promo-h2 { font-size: clamp(2.5rem, 3.7vw, 3.6rem); line-height: 0.98; }

      /* SH-9 series tiles: a taller crop, a black foot under the name, a red
         edge on hover. */
      .promo-bf [data-promo-stage] button.rounded-lg {
        border-radius: 0;
        aspect-ratio: 4 / 3 !important;
        outline: 3px solid transparent;
        outline-offset: -3px;
        transition: outline-color 0.25s ease;
      }
      .promo-bf [data-promo-stage] button.rounded-lg:hover { outline-color: var(--kawai-red); }
      .promo-bf [data-promo-stage] button.rounded-lg > div.absolute.inset-x-0.bottom-0 {
        background: linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,0) 100%);
        padding-top: 4rem;
      }
      .promo-bf [data-promo-stage] button.rounded-lg .promo-h2 { font-size: clamp(2.2rem, 3.4vw, 3.4rem); }

      /* ── 3′ / 4 · Rebate boards (ES on both sites, acoustic on CA) ──── */
      .promo-bf [data-promo-stage] ul.promo-on-light {
        --ground: #0A0A0A;
        --surface: rgba(255, 255, 255, 0.07);
        --on-ground: #FFFFFF;
        --body: rgba(255, 255, 255, 0.85);
        --body-dim: rgba(255, 255, 255, 0.72);
        --rule: rgba(255, 255, 255, 0.16);
        --rule-soft: rgba(255, 255, 255, 0.12);
        --money: #FFFFFF;
        --money-accent: #FFFFFF;
        --accent-ink: #FF6B6F;
        --focus-ring: #FFFFFF;
        border: 0;
        border-top: 6px solid var(--kawai-red);
        box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.85);
      }
      .promo-bf [data-promo-stage] ul.promo-on-light .promo-num.font-semibold {
        font-family: var(--font-oswald), 'Oswald', sans-serif;
        font-weight: 700;
        font-size: clamp(1.7rem, 2.6vw, 2.3rem);
        line-height: 1;
      }
      /* The saving, as a red chip. */
      .promo-bf [data-promo-stage] ul.promo-on-light [class*="text-[color:var(--money-accent)]"] {
        background: var(--kawai-red);
        color: #FFFFFF;
        padding: 0.35rem 0.6rem;
        line-height: 1;
        width: fit-content;
      }
      .promo-bf [data-promo-stage] ul.promo-on-light li:hover { background: rgba(225, 25, 34, 0.14); }

      /* ── 3 · Financing (US) ─────────────────────────────────────────── */
      .promo-bf .bf-band { border-top: 6px solid var(--kawai-red); }
      .promo-bf .bf-band::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0) 35%);
      }
      .promo-bf #financing { background-color: var(--ink); }
      .promo-bf #financing > div:first-child { padding-top: 3.5rem; }
      @media (min-width: 768px) { .promo-bf #financing > div:first-child { padding-top: 4.5rem; } }
      /* The lockup: a red bar down its left edge. */
      .promo-bf #financing > div:first-child > div:first-child {
        border-left: 8px solid var(--kawai-red);
        padding-left: 1.25rem;
      }
      @media (min-width: 768px) { .promo-bf #financing > div:first-child > div:first-child { padding-left: 2.25rem; } }

      /* ── 5 · Learning partners: a deep red band ─────────────────────── */
      .promo-bf #lessons {
        --ink: #B8121A;
        background-color: var(--deep-red);
        --rule: rgba(255, 255, 255, 0.35);
      }
      .promo-bf #lessons p.promo-label.mb-5 { color: #FFFFFF; }
      .promo-bf #lessons .promo-lede { color: #FFFFFF; }
      .promo-bf #lessons [class*="text-[0.72rem]"] { color: #FFFFFF; }
      .promo-bf #lessons [class*="bg-[color:var(--ember)]"] {
        background-color: #FFFFFF;
        color: #0A0A0A;
        box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.6);
      }
      .promo-bf #lessons [class*="bg-[color:var(--ember)]"]:hover { background-color: #F1F1F1; }
      .promo-bf #lessons > div:first-child { border-bottom: 6px solid #0A0A0A; }

      /* ── 6 · Dealer close ───────────────────────────────────────────── */
      /* A shorter pin: the same three scenes, two fewer screens of scroll
         before the last Sign Up Now. */
      .promo-bf section#dealers[class*="h-[340vh]"] { height: 240vh; }
      .promo-bf #dealers { border-top: 6px solid var(--kawai-red); }
      .promo-bf #dealers .promo-num {
        font-family: var(--font-oswald), 'Oswald', sans-serif;
        font-weight: 700;
        color: #FF4D55;
      }

      /* ── 7 · Offer dock ─────────────────────────────────────────────── */
      .promo-bf div.fixed [class*="rounded-full"][class*="bg-[color:var(--ink)]"] {
        border-radius: 2px;
        border: 0;
        border-left: 6px solid var(--kawai-red);
        background: #0A0A0A;
        box-shadow: 0 18px 44px -14px rgba(0, 0, 0, 0.75);
      }
      .promo-bf div.fixed [class*="rounded-full"][class*="bg-[color:var(--ink)]"] button { padding-left: 1.4rem; padding-right: 1.4rem; }

      /* ── Motion (opt-in) ────────────────────────────────────────────── */
      @media (prefers-reduced-motion: no-preference) {
        .promo-bf .bf-hero-copy::before { animation: bf-wipe 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .promo-bf [class*="bg-[color:var(--ember)]"]:hover { transform: translateY(-2px); }
        .promo-bf .bf-tile-name { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        .promo-bf .bf-tile:hover .bf-tile-name { transform: translateX(4px); }
      }
      @keyframes bf-wipe {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
      }
    `,
      }}
    />
  )
}
