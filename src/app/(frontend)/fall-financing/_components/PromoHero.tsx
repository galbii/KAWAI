import Image from 'next/image'
import { PromoHeroCarousel, PromoValueProps } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { valuePropsFor } from './campaign'
import { heroSlidesFor } from './slides'

const CAMPAIGN_NAME = 'Fall for a Kawai'

/**
 * What the mobile lockup says under the mark.
 *
 * Not the campaign name. The slide headline immediately below it is already
 * "Fall for a Kawai" on the opening slide, and the lockup repeating it set
 * the same three words twice in a column at two sizes. This describes what the
 * page is instead, which is the job a line under a logotype should be doing.
 */
const LOCKUP_LINE = 'Fall Promotions'

/**
 * The brand lockup: mark over campaign line, low in the frame. Phones only.
 *
 * It exists because a phone collapses the site header behind a menu, and with
 * it the only thing on screen saying whose promotion this is. From `sm` up the
 * header is visible and the carousel renders no lockup at all — two Kawai
 * marks on one screen is the brand stated twice, not stated firmly.
 *
 * Deliberately inert: no entrance beyond its one arrival, no crossfade, no
 * parallax, and rendered outside the carousel's AnimatePresence so the slides
 * change behind it without it flickering. Everything else on the stage moves;
 * the lockup holding still is what makes that movement read as deliberate
 * rather than restless.
 *
 * The mark runs in Kawai red, unfiltered, at the 3336px brand asset. A
 * logotype is exempt from WCAG 1.4.3, so it carries no contrast obligation of
 * its own — the drop-shadow below is for legibility, not compliance. The line
 * beneath it is ordinary text and is not exempt; see the gradient note in
 * PromoHeroCarousel for where that stands.
 */
function CampaignLockup() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/images/Kawai (Red)(2).png"
        alt="Kawai"
        width={3336}
        height={667}
        priority
        // Sized against the viewport on phones so it stays the head of the
        // frame on a 430px screen as much as on a 360px one, then to fixed
        // steps once there is room to set it properly.
        className="promo-lockup-enter h-auto w-[min(74vw,21rem)]"
        style={
          {
            // drop-shadow, not box-shadow: the asset is a PNG with alpha, so
            // this follows the letterforms instead of shadowing the rectangle
            // they sit in. Two passes — a tight one for edge definition, a
            // wide soft one to lift the mark off a busy frame — the same
            // construction .promo-photo-text uses on the copy.
            filter:
              'drop-shadow(0 1px 2px rgba(29,27,24,0.55)) drop-shadow(0 4px 20px rgba(29,27,24,0.45))',
            '--promo-i': 0,
          } as React.CSSProperties
        }
      />
      {/* Arrives a beat after the mark. */}
      <p
        className="promo-lockup-enter promo-h2 promo-photo-text mt-4 text-center text-[1.75rem] leading-none text-[color:var(--ivory)]"
        style={{ '--promo-i': 1 } as React.CSSProperties}
      >
        {LOCKUP_LINE}
      </p>
    </div>
  )
}

/**
 * The hero: the campaign carousel, and nothing under it.
 *
 * The carousel is the homepage hero's staging — full stage, one slide at a
 * time, slow Ken Burns, side arrows, dots and a pause control — in the Fall
 * Promo palette. Three slides: the Fall for a Kawai opener naming the
 * programme, then financing and the SH-9 bundle, each against an instrument
 * from the range that offer actually covers.
 *
 * A standfirst and a three-row offer index used to sit under the stage. Both
 * went when the carousel took over the same job: each offer gets its own slide,
 * so the index was the same facts a second time, in smaller type, immediately
 * below the first telling. Wayfinding is carried by the sections themselves,
 * each of which opens by naming the instruments it covers.
 *
 * The index is back, in the one form that is not a repetition: `PromoValueProps`
 * as glass cards overlaid on the foot of the stage. Each card carries what its
 * offer covers rather than only naming it, and each card jumps to the section
 * that explains it — so the band answers "which of these is mine?" without the
 * reader scrolling past the other two to find out.
 *
 * Handing the carousel a `valueProps` slot rearranges its chrome: the dot rail,
 * the pause control and the slide copy all lift clear of the band. That is the
 * carousel's business, not this file's. On ca.kawaius.com the financing card is
 * dropped — see `valuePropsFor`.
 *
 * The page's h1 is visually hidden. The slide titles rotate, so none of them can
 * be the document's heading without the h1 changing under the reader; the
 * carousel sets its titles as h2. This is the same pattern the block-rendered
 * templates use (see the Accessibility section of CLAUDE.md).
 */
export function PromoHero({ site = 'us' }: { site?: 'us' | 'cad' }) {
  return (
    <>
      <h1 className="sr-only">{`${CAMPAIGN_NAME} — Kawai fall promotions`}</h1>
      <PromoHeroCarousel
        slides={heroSlidesFor(site)}
        cta={<PromoButton />}
        lockup={<CampaignLockup />}
        valueProps={<PromoValueProps items={valuePropsFor(site)} />}
      />
    </>
  )
}
