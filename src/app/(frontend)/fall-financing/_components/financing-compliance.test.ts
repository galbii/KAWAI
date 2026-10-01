import { describe, expect, it } from 'bun:test'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import { FALL_2026 } from '@/lib/financing/terms'
import { heroSlidesFor } from './slides'
import {
  BLENDED_APR,
  FOOTNOTE_EXAMPLE,
  FOOTNOTE_EXCLUSIONS,
  INTRO_APR,
  POST_APR,
  disclosures,
  financing,
  learnMore,
  navSectionsFor,
  valuePropsFor,
  PROGRAM_START,
  SECTION,
  TERMS_SENTENCE,
  CTA_LABEL,
  CTA_LABEL_SHORT,
} from './campaign'

/**
 * Synchrony / Reg Z guards from the Q4 2026 developer requirements.
 *
 * These are legal requirements, not style rules, and several of them are the
 * kind a well-meaning copy edit breaks silently — "0% APR" reads naturally and
 * is forbidden; "thereafter" is shorter than "for the remaining 36 months" and
 * is forbidden. A test is the only thing that catches that in review.
 *
 * What this CANNOT check is §4.1 and §4.2, which are rendered-type rules: that
 * "(APR 8.01%)*" matches "0%" in font, size, weight and colour, and that the
 * subhead is at least 40% of the headline at every breakpoint. Both are
 * enforced structurally instead — the headline is one string and the lockup
 * sizes both from one parent — and both are on the pre-launch checklist in §8
 * to be eyeballed at desktop, tablet and mobile.
 */

/** Everything this page renders that could carry a forbidden phrase. */
const RENDERED: ReadonlyArray<readonly [string, string]> = [
  ['financing.heading.lead', financing.heading.lead],
  ['financing.heading.connector', financing.heading.connector],
  ['financing.heading.apr', financing.heading.apr],
  ['financing.subhead', financing.subhead],
  ['financing.paymentNote', financing.paymentNote],
  ['financing.fromPrefix', financing.fromPrefix],
  ['financing.startingAt', financing.startingAt],
  ['disclosures.financingExample', disclosures.financingExample],
  ['disclosures.exclusions', disclosures.exclusions],
  ...disclosures.financingTerms.map((s, i) => [`disclosures.financingTerms[${i}]`, s] as const),
  ...learnMore.body.map((s, i) => [`learnMore.body[${i}]`, s] as const),
  // The side rail's rows. A label is the easiest place on the page to lose a
  // figure's disclosure, because the panel floats free of the section the
  // footnote lives in — so the rows are checked like any other rendered copy.
  // The US rail is the superset — CA's is the same rows minus financing and
  // its disclosure — so checking it covers both.
  ...navSectionsFor('us').map((s) => [`navSections.${s.id}`, s.label] as const),
  // The hero's value props, label and detail line both. Same reasoning as the
  // rail, more sharply: this strip is the loudest small copy on the page and
  // sits several screens above the disclosure, so a figure landing in the
  // financing cell is a credit advertisement with no disclosure under it. US is
  // the superset again — CA's strip is these minus financing.
  ...valuePropsFor('us').flatMap(
    (v) =>
      [
        [`valueProps.${v.offer}.label`, OFFER_CHIPS[v.offer]],
        [`valueProps.${v.offer}.detail`, v.detail],
      ] as const,
  ),
  // Every CTA on the page renders one of these two, and a CTA is the easiest
  // place to lose a figure's disclosure — a label in a floating pill or a
  // dialog row is nowhere near the footnote that qualifies it.
  ['CTA_LABEL', CTA_LABEL],
  ['CTA_LABEL_SHORT', CTA_LABEL_SHORT],
]

describe('the hero slides', () => {
  const all = [...heroSlidesFor('us'), ...heroSlidesFor('cad')].flatMap((slide) =>
    [
      [`${slide.id}.title`, slide.title] as const,
      [`${slide.id}.body`, slide.body ?? ''] as const,
      [`${slide.id}.eyebrow`, slide.eyebrow ?? ''] as const,
    ],
  )

  it('carries no rate figure in any slide', () => {
    // §4.1 in the form the hero can actually break it. A rate in a slide needs
    // "(APR 8.01%)*" beside it at identical type and a subhead at 40% of that
    // size, which `.promo-display` over `.promo-lede` is nowhere near — the
    // note in slides.ts works this out in full. The financing slide's title has
    // always respected it; the opener's subheader did not, and said "0%
    // financing" in the largest body copy on the page until the copy changed.
    // This is what stops it coming back.
    for (const [name, text] of all) {
      expect(`${name}: ${text}`).not.toMatch(/\d+(\.\d+)?\s*%/)
    }
  })

  it('drops the financing slide on ca.kawaius.com', () => {
    expect(heroSlidesFor('cad').map((s) => s.id)).toEqual(['stack', 'bundle'])
    expect(heroSlidesFor('us').map((s) => s.id)).toEqual(['stack', 'financing', 'bundle'])
  })

  it('advertises the start date the terms actually begin on', () => {
    // PROGRAM_START is prose and FALL_2026.start is the date the lender's terms
    // run from. A promotional page naming the wrong one is only noticed from
    // outside, so they are pinned to each other here.
    const [, month, day] = FALL_2026.start.split('-').map(Number) as [number, number, number]
    const monthName = new Date(Date.UTC(2026, month - 1, 1)).toLocaleString('en-US', {
      month: 'long',
      timeZone: 'UTC',
    })
    expect(PROGRAM_START).toContain(monthName)
    expect(PROGRAM_START).toContain(String(day))
  })
})

describe("the hero's value props", () => {
  /** Every string the strip renders, both sites. */
  const all = [...valuePropsFor('us'), ...valuePropsFor('cad')].flatMap((v) => [
    [`${v.offer}.label`, OFFER_CHIPS[v.offer]] as const,
    [`${v.offer}.detail`, v.detail] as const,
  ])

  it('carries no rate, no term and no amount in any cell', () => {
    // The scope rule from §4.1/§4.2, as the strip can actually break it: a
    // price, a percentage or a number of months in an 11px hero label, screens
    // above the footnote that would have to qualify it. Scope words are fine,
    // and a digit inside a model name ("SH-9") is not a figure — hence three
    // targeted patterns rather than a blanket no-digits rule.
    for (const [name, text] of all) {
      expect(`${name}: ${text}`).not.toMatch(/\$\s?\d/)
      expect(`${name}: ${text}`).not.toMatch(/\d+\s*%/)
      expect(`${name}: ${text}`).not.toMatch(/\d+\s*months?/i)
    }
  })

  it('drops the financing cell on ca.kawaius.com and keeps the other two', () => {
    // The Synchrony offer is US-only. This is the fifth surface it reaches —
    // slide, section, disclosure, rail row, value prop — and the one most
    // easily forgotten, because it is the only one that renders inside another
    // component's slot.
    expect(valuePropsFor('cad').map((v) => v.offer)).toEqual(['bundle', 'rebates'])
    expect(valuePropsFor('us').map((v) => v.offer)).toEqual(['financing', 'bundle', 'rebates'])
  })

  it('names each offer exactly as every other surface names it', () => {
    // The labels are not in campaign.ts at all — PromoValueProps reads
    // OFFER_CHIPS — so this guards against someone adding a label override to
    // the prop shape later.
    for (const v of valuePropsFor('us')) {
      expect(Object.keys(v).sort()).toEqual(['detail', 'highlight', 'offer', 'sectionId'])
    }
  })

  it('marks a phrase that is actually in the line', () => {
    // withHook() splits detail on indexOf(highlight). A highlight that has
    // drifted out of its copy does not throw and does not warn — it just
    // quietly stops highlighting, which is the kind of regression that ships.
    for (const site of ['us', 'cad'] as const) {
      for (const v of valuePropsFor(site)) {
        const highlight = 'highlight' in v ? (v.highlight as string | undefined) : undefined
        if (highlight === undefined) continue
        expect(`${v.offer}: "${v.detail}" contains "${highlight}"`).toBe(
          `${v.offer}: "${v.detail}" contains "${v.detail.includes(highlight) ? highlight : 'NOTHING'}"`,
        )
      }
    }
  })

  it('never marks a figure', () => {
    // The mark is the loudest treatment on the card, so a rate or an amount
    // landing inside one would be the worst place on the page to put a figure
    // with no disclosure under it. Covered transitively by the detail-line
    // check above, since a highlight is a substring of its detail — asserted
    // directly anyway, because that relationship is the thing most likely to
    // change.
    for (const site of ['us', 'cad'] as const) {
      for (const v of valuePropsFor(site)) {
        const highlight = 'highlight' in v ? (v.highlight as string | undefined) : undefined
        if (highlight === undefined) continue
        expect(`${v.offer} marks: ${highlight}`).not.toMatch(/\$\s?\d|\d+\s*%|\d+\s*months?/i)
      }
    }
  })

  it('points every cell at a section id the page actually renders', () => {
    // The cells scroll by id. A cell aimed at an id that is not in the document
    // scrolls nowhere and reads as a dead control, which is exactly what the CA
    // financing cell would be — so the ids are checked per site, not once.
    const onPage = {
      us: new Set<string>([SECTION.bundle, SECTION.financing, SECTION.rebate]),
      // No financing section on ca.kawaius.com. See `showFinancing` in page.tsx.
      cad: new Set<string>([SECTION.bundle, SECTION.rebate]),
    } as const

    for (const site of ['us', 'cad'] as const) {
      for (const v of valuePropsFor(site)) {
        expect(`${site}/${v.offer} -> ${v.sectionId}`).toBe(
          `${site}/${v.offer} -> ${onPage[site].has(v.sectionId) ? v.sectionId : 'MISSING'}`,
        )
      }
    }
  })
})

describe('§4.5 — fixed terminology', () => {
  it('never calls the 0% or the 22.99% an APR', () => {
    // "0% APR", "22.99% APR" and "APR of 0%" are all the same violation.
    const banned = [
      new RegExp(`${INTRO_APR.replace('%', '\\%')}\\s*APR`, 'i'),
      new RegExp(`${POST_APR.replace('.', '\\.').replace('%', '\\%')}\\s*APR`, 'i'),
      new RegExp(`APR\\s+(of\\s+)?(${INTRO_APR}|${POST_APR})`.replace(/\./g, '\\.'), 'i'),
    ]
    for (const [name, text] of RENDERED) {
      for (const re of banned) {
        expect(`${name}: ${text}`).not.toMatch(re)
      }
    }
  })

  it('reserves the word APR for the blended figure alone', () => {
    for (const [name, text] of RENDERED) {
      for (const match of text.matchAll(/APR[^.]*?(\d+(?:\.\d+)?%)/g)) {
        expect(`${name} used APR with ${match[1]}`).toBe(`${name} used APR with ${BLENDED_APR}`)
      }
    }
  })

  it('never says "up to" a term, or "thereafter"', () => {
    for (const [name, text] of RENDERED) {
      expect(`${name}: ${text}`).not.toMatch(/up to \d+ months/i)
      expect(`${name}: ${text}`).not.toMatch(/thereafter/i)
    }
  })

  it('says "for the remaining 36 months" in the worked example', () => {
    // The subhead used to be checked here too, and no longer is: the approved
    // banner's subhead reads "will apply for 36 months", and the banner is the
    // artwork Synchrony signed off. See the note on TERMS_SENTENCE. The worked
    // example still uses the prescribed phrasing — twice — so the guard moved
    // there rather than being deleted.
    expect(disclosures.financingExample).toContain('for the remaining 36 months')
  })
})

describe('§4.1 — the APR travels with the 0% in the headline', () => {
  it('puts the two regulated figures in the two prominent parts', () => {
    expect(financing.heading.lead).toContain(INTRO_APR)
    expect(financing.heading.apr).toContain(`APR ${BLENDED_APR}`)
  })

  it('keeps the smaller connector free of every regulated figure', () => {
    // This is the guard that earns the split. The headline renders in two
    // sizes to match the banner: `lead` and `apr` are bare text nodes in one
    // <h2> and so cannot be styled apart, but `connector` is wrapped in a span
    // at 0.72em. A rate, a term figure or an amount moved into that span would
    // be a regulated figure rendered smaller than the one beside it, which is
    // exactly what §4.1 exists to prevent — and it would look like an innocent
    // copy edit. So the span may hold no figure at all.
    expect(financing.heading.connector).not.toMatch(/\d+(\.\d+)?\s*%/)
    expect(financing.heading.connector).not.toMatch(/\$\s?\d/)
  })

  it('keeps every part a plain string, so none can smuggle in its own markup', () => {
    // A string cannot carry markup. If a part ever gains a tag, the
    // equal-prominence guarantee in §4.1 is gone with it.
    for (const part of ['lead', 'connector', 'apr'] as const) {
      expect(typeof financing.heading[part]).toBe('string')
      expect(`${part}: ${financing.heading[part]}`).not.toMatch(/[<>]/)
    }
  })
})

describe('§4.3 — every footnote mark resolves on this page', () => {
  it('references the worked example from the end of the headline', () => {
    expect(financing.heading.apr.endsWith(FOOTNOTE_EXAMPLE)).toBe(true)
  })

  it('opens the worked example with the mark that points at it', () => {
    expect(disclosures.financingExample.startsWith(FOOTNOTE_EXAMPLE)).toBe(true)
    // ...and is not itself the ** footnote.
    expect(disclosures.financingExample.startsWith(FOOTNOTE_EXCLUSIONS)).toBe(false)
  })

  it('pairs the ** mark on the subhead with its footnote', () => {
    // The mark sat on an "Eligible instruments" paragraph until the banner
    // replaced that section, at which point the exclusions footnote rendered
    // with nothing on the page pointing at it. The banner puts ** at the end
    // of the subhead; this is what keeps it there.
    expect(financing.subhead.endsWith(FOOTNOTE_EXCLUSIONS)).toBe(true)
    expect(disclosures.exclusions.startsWith(FOOTNOTE_EXCLUSIONS)).toBe(true)
  })
})

describe('§4.4 — the disclosure is page text, not a dialog', () => {
  it('keeps disclosure sentences out of the explainer dialog', () => {
    const dialog = learnMore.body.join(' ')
    expect(dialog).not.toContain(disclosures.financingExample)
    expect(dialog).not.toContain(disclosures.exclusions)
    expect(dialog).not.toContain(TERMS_SENTENCE)
    // No footnote marks in a dialog: a mark whose footnote is elsewhere on the
    // page cannot be followed from inside a modal.
    expect(dialog).not.toContain(FOOTNOTE_EXCLUSIONS)
  })
})
