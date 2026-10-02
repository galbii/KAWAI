import type { PromoSlide } from '@/components/fall-promo'
import { FALL_2026 } from '@/lib/financing/terms'
import { PROGRAM_END, PROGRAM_START } from './campaign'

/**
 * The hero slides.
 *
 * An opener that names the campaign and says what is in it, then one slide per
 * offer that has its own photograph. The opener's subheader lists the offers in
 * the order the slides then present them, so the carousel reads as a promise
 * followed by its instalments rather than unrelated posters.
 *
 * ── Site ─────────────────────────────────────────────────────────────────
 * The Synchrony financing offer is USA-only, so on ca.kawaius.com its slide is
 * dropped AND the opener's subheader stops naming it. Use {@link heroSlidesFor};
 * the exported array is the US list and exists only as its default.
 *
 * The subheader was briefly one string for both sites, back when it named only
 * the programme. It lists the three offers again, so it is gated again — a
 * Canadian visitor may not be told about a US lender's credit offer, and the
 * largest body copy on the page is the worst place to slip.
 *
 * Swapping art is a one-line change here. The R2 images are the campaign's own
 * key art.
 */
/**
 * The opener's subheader, per site.
 *
 * Names the programme, then the three offers in the order the slides present
 * them. The Canadian line drops the financing clause and closes the list with
 * "and" instead — the offer does not run there, and this is the loudest body
 * copy on the page.
 *
 * ── "Interest Free financing" is a claim about a rate ─────────────────────
 * It carries no digits, so the rate-figure guard in the compliance test does
 * not catch it, and it is worth knowing why that guard does not settle the
 * question. The offer is 0% for the first 24 months and 22.99% for the
 * remaining 36, a blended APR of 8.01% — the promotional window does not clear
 * the balance, which is the single thing `FinancingLearnMore` exists to
 * explain. "Interest free", unqualified, describes a different offer from the
 * one the disclosure at the foot of the page describes.
 *
 * This is supplied copy and is rendered as given. If it goes to Synchrony
 * review and comes back, the surrounding sentence is this constant and nothing
 * else reads it.
 */
const OPENER_BODY = {
  us:
    `Kawai Pianos Fall Promotional Offerings starting ${PROGRAM_START}. Interest Free ` +
    'financing, Instant Rebates, and Complimentary Headphones across select Kawai Pianos.',
  cad:
    `Kawai Pianos Fall Promotional Offerings starting ${PROGRAM_START}. Instant Rebates and ` +
    'Complimentary Headphones across select Kawai Pianos.',
} as const

export const heroSlides: readonly PromoSlide[] = [
  {
    id: 'stack',
    title: 'Fall for a Kawai',
    body: OPENER_BODY.us,
    image: 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/MS%20Fall%202.webp',
    imageAlt: 'A pianist playing a Kawai upright piano in a sunlit autumn room',
  },
  {
    id: 'financing',
    eyebrow: `Through ${PROGRAM_END}`,
    /**
     * The rate is deliberately NOT in this headline.
     *
     * §4.1 of the Q4 developer requirements: wherever "0%" appears in a
     * headline, "(APR 8.01%)*" must sit beside it in the same font, size,
     * weight and colour — and §4.2 then requires the subhead under it to be at
     * least 40% of the headline's size. A carousel title is `.promo-display`
     * (up to 6rem) over a `.promo-lede` body (max 1.25rem), which is 21%. The
     * floor cannot be met here without resizing every slide.
     *
     * So the hero names the offer and the financing section carries the
     * compliant headline, where the lockup sizes both from one parent and the
     * ratio holds by construction. Do not put "0%" back into this title.
     */
    title: 'Financing on acoustic pianos',
    body: 'On new Kawai and Shigeru Kawai acoustic grands and uprights.',
    image: 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_CA401B-1%20copy.webp',
    imageAlt: 'A Kawai piano in a sunlit room in autumn',
  },
  {
    id: 'bundle',
    eyebrow: `Through ${PROGRAM_END}`,
    title: 'SH-9 Bundle',
    body: 'Free when you buy a qualifying CN or CA Series digital piano. A pair of Kawai SH-9 high-performance headphones, at no extra cost.',
    image: 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KAWAI_CA401B-30.webp',
    imageAlt: 'Kawai SH-9 headphones hanging beneath a Kawai CA Series digital piano',
  },
]

/**
 * The slides for the active site.
 *
 * `financing` is a US-market Synchrony promotion; nothing on ca.kawaius.com may
 * advertise it, so the slide comes out and the opener drops its mention.
 */
export function heroSlidesFor(site: 'us' | 'cad'): readonly PromoSlide[] {
  if (site === 'us') return heroSlides
  return heroSlides
    .filter((slide) => slide.id !== 'financing')
    .map((slide) => (slide.id === 'stack' ? { ...slide, body: OPENER_BODY.cad } : slide))
}
