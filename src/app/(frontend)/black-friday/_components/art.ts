import type { PromoHeroOffer } from '@/components/fall-promo'
import type { OfferKey } from '@/lib/fall-promo/tokens'
import type { SceneImages } from '../../fall-financing/_components/cinematic/PinnedCanvas'
import type { Sh9BundleArt } from '../../fall-financing/_components/Sh9BundleBlock'
import { heroOffersFor } from '../../fall-financing/_components/slides'

/**
 * Black Friday photography (kawai-black-friday-redesign v2, Nov 15 2026).
 *
 * Every frame here is a real Kawai photograph already in this repo and already
 * served on kawaius.com under /images, and none of them is a frame the fall
 * campaign (and so the d4cefac Black Friday page) runs. The test beside this
 * file pins both facts.
 *
 * Only pictures live here. The words on the page — every offer, price, term
 * and disclosure — still come from `fall-financing/_components/campaign.ts`
 * and `./sale.ts`, untouched. `alt` describes the photograph it sits on, so it
 * follows the picture.
 *
 * The Skoove / Piano Marvel art is kept: it is the partners' logos, not a
 * photograph, and the product and range photos are catalogue data.
 */

type Art = { image: string; imageAlt: string; imagePosition?: string }

/** The hero's opening frame: a black GX grand on black. */
export const BF_KEY_ART: Art = {
  image: '/images/signature/GX_cover.jpg',
  imageAlt: 'The curve of a black Kawai GX grand piano in a dark room',
  // The instrument sits in the right third; the copy column takes the left.
  imagePosition: '78% center',
}

/** One frame per offer cell in the hero index, and the matching section stages. */
export const BF_OFFER_ART: Record<OfferKey, Art> = {
  financing: {
    image: '/images/signature/pianos/gl-10/gl-10-hero.jpeg',
    imageAlt: 'Hands playing a black Kawai grand piano',
  },
  bundle: {
    image: '/images/gallery/KAWAI_CA401B-43 copy.webp',
    imageAlt: 'A young pianist playing a black Kawai CA401 digital piano',
    imagePosition: '70% center',
  },
  rebates: {
    image: '/images/es60-above-closeup.png',
    imageAlt: 'A Kawai ES60 portable digital piano seen from above',
  },
}

/** SH-9 Bundle: the stage and the two series tiles. */
export const BF_BUNDLE_ART: Sh9BundleArt = {
  stage: { image: BF_OFFER_ART.bundle.image, imageAlt: BF_OFFER_ART.bundle.imageAlt },
  seriesArt: {
    'cn-series': '/images/gallery/CA701R-43 copy.webp',
    'ca-series': '/images/gallery/KAWAI-CA501W-39 copy.webp',
  },
}

/** ES Series rebates stage. */
export const BF_REBATE_STAGE = {
  image: BF_OFFER_ART.rebates.image,
  imageAlt: BF_OFFER_ART.rebates.imageAlt,
}

/** Acoustic rebates stage (ca.kawaius.com only). */
export const BF_ACOUSTIC_STAGE = {
  image: '/images/signature/pianos/gl-50/gl-50-hero.jpg',
  imageAlt: 'Inside a Kawai GL-50 grand piano, the plate and strings',
}

/** The dealer close's three scenes. */
export const BF_SCENES: SceneImages = {
  warmPianist: '/images/signature/pianos/gx-1/gx-1-hero.webp',
  soundboard: '/images/signature/pianos/gl-10/gl-10-secondary.webp',
  luxeRoom: '/images/gallery/KAWAI-CA901B-24 copy.webp',
}

/**
 * The hero index for the site: the fall cells' words exactly as
 * `heroOffersFor(site)` gives them (financing dropped on ca.kawaius.com),
 * with only the photograph swapped.
 */
export function bfHeroOffersFor(site: 'us' | 'cad'): readonly PromoHeroOffer[] {
  return heroOffersFor(site).map((cell) => {
    const art = BF_OFFER_ART[cell.offer]
    // The fall frame's crop point belongs to the fall photograph, not this one.
    return { ...cell, ...art, imagePosition: art.imagePosition ?? 'center' }
  })
}

/** Every image the BF pages add, for the test. */
export const BF_IMAGES: readonly string[] = [
  BF_KEY_ART.image,
  ...Object.values(BF_OFFER_ART).map((a) => a.image),
  ...Object.values(BF_BUNDLE_ART.seriesArt ?? {}).filter((s): s is string => Boolean(s)),
  BF_ACOUSTIC_STAGE.image,
  ...Object.values(BF_SCENES),
]
