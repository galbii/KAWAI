import { PROGRAM_END, PROGRAM_END_ISO, PROGRAM_END_SHORT } from '../../fall-financing/_components/campaign'

/**
 * Black Friday framing for /black-friday and the standby /black-friday-ext.
 *
 * ── What this module may and may not change ─────────────────────────────
 *
 * Both pages are the /fall-financing page re-framed, not a new promotion. The
 * offers, amounts, eligible models, lender terms, disclosures and the CA/US
 * split are all read from `fall-financing/_components/campaign.ts` unchanged;
 * this file supplies only the words around them: the headline, the opener
 * line, the metadata and the countdown.
 *
 * The sale framing runs through the end of November (Chance, Nov 15 2026).
 * The offers themselves still run to {@link PROGRAM_END}, and every offer's own
 * fine print keeps saying so, because that is the date the terms carry. The
 * Black Friday date is a sale window around them, never a new offer end.
 *
 * ── Copy rules carried over ──────────────────────────────────────────────
 *
 * - No rate figure in any of this copy (Synchrony §4.1/4.2): a hero line sits
 *   screens above the disclosure. "Interest Free financing" is the supplied
 *   phrase from the fall opener, reused verbatim rather than reworded.
 * - Nothing for ca.kawaius.com mentions financing: the Synchrony offer is
 *   US-only.
 */

export type SaleVariant = 'main' | 'ext'
export type SaleSite = 'us' | 'cad'

/** End of the Black Friday sale framing: the last day of November. */
export const SALE_END = 'November 30, 2026'
export const SALE_END_SHORT = 'Nov 30'
export const SALE_END_ISO = '2026-11-30'

export const SALE_PATH: Record<SaleVariant, string> = {
  main: '/black-friday',
  ext: '/black-friday-ext',
}

/** The h1. Ends in " Kawai" so the hero swaps the last word for the logotype. */
export const SALE_TITLE: Record<SaleVariant, string> = {
  main: 'Black Friday at Kawai',
  ext: 'Black Friday, extended at Kawai',
}

const OFFERS_US =
  'Interest Free financing, Instant Rebates, and Complimentary Headphones across select Kawai Pianos.'
const OFFERS_CAD = 'Instant Rebates and Complimentary Headphones across select Kawai Pianos.'

/** The opener's line under the headline, per page and site. */
export const SALE_BODY: Record<SaleVariant, Record<SaleSite, string>> = {
  main: {
    us: `Kawai's Black Friday Sale runs through ${SALE_END}. ${OFFERS_US}`,
    cad: `Kawai's Black Friday Sale runs through ${SALE_END}. ${OFFERS_CAD}`,
  },
  ext: {
    us: `Kawai's Black Friday Sale, extended. ${OFFERS_US}`,
    cad: `Kawai's Black Friday Sale, extended. ${OFFERS_CAD}`,
  },
}

/**
 * The line under the hero CTA and the dock's deadline.
 *
 * Main: the sale window. Ext: the offers' own end, the only real date after
 * November; nothing here invents an extension date.
 */
export const SALE_ENDING: Record<SaleVariant, { line: string; iso: string; short: string }> = {
  main: { line: `Black Friday Sale ends ${SALE_END}.`, iso: SALE_END_ISO, short: SALE_END_SHORT },
  ext: { line: `Offers end ${PROGRAM_END}.`, iso: PROGRAM_END_ISO, short: PROGRAM_END_SHORT },
}

/** Title and description per page and site. CA never mentions financing. */
export const SALE_META: Record<
  SaleVariant,
  Record<SaleSite, { title: string; description: string }>
> = {
  main: {
    us: {
      title: 'Kawai Black Friday Sale: financing, free SH-9 headphones, ES rebates',
      description:
        `Kawai's Black Friday Sale runs through ${SALE_END}: financing on acoustic grands and ` +
        'uprights, a free pair of SH-9 headphones with every qualifying CN or CA Series digital, ' +
        'and instant rebates on ES Series portables at your Authorized Kawai dealer.',
    },
    cad: {
      title: 'Kawai Black Friday Sale: free SH-9 headphones and ES Series rebates',
      description:
        `Kawai's Black Friday Sale runs through ${SALE_END}: a free pair of SH-9 headphones ` +
        'with every qualifying CN or CA Series digital piano, and instant rebates on ES Series ' +
        'portables at your Authorized Kawai dealer.',
    },
  },
  ext: {
    us: {
      title: 'Kawai Black Friday, extended: financing, free SH-9 headphones, ES rebates',
      description:
        "Kawai's Black Friday Sale, extended: financing on acoustic grands and uprights, a free " +
        'pair of SH-9 headphones with every qualifying CN or CA Series digital, and instant ' +
        'rebates on ES Series portables at your Authorized Kawai dealer.',
    },
    cad: {
      title: 'Kawai Black Friday, extended: free SH-9 headphones and ES Series rebates',
      description:
        "Kawai's Black Friday Sale, extended: a free pair of SH-9 headphones with every " +
        'qualifying CN or CA Series digital piano, and instant rebates on ES Series portables at ' +
        'your Authorized Kawai dealer.',
    },
  },
}
