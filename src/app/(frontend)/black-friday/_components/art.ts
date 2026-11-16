import type { PromoHeroOffer } from '@/components/fall-promo'
import type { OfferKey } from '@/lib/fall-promo/tokens'
import type { SceneImages } from '../../fall-financing/_components/cinematic/PinnedCanvas'
import type { Sh9BundleArt } from '../../fall-financing/_components/Sh9BundleBlock'
import { heroOffersFor } from '../../fall-financing/_components/slides'

/**
 * Black Friday photography (kawai-black-friday-redesign v2, reworked in v3, Nov 15 2026).
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

/** The hero's opening frame: inside a black GX grand, strings and plate. */
export const BF_KEY_ART: Art = {
  image: '/images/signature/pianos/gx-1/gx-1-secondary.webp',
  imageAlt: 'Inside a black Kawai GX grand piano: the strings, dampers and golden plate',
  imagePosition: '55% center',
}

/** One frame per offer cell in the hero index, and the matching section stages. */
export const BF_OFFER_ART: Record<OfferKey, Art> = {
  financing: {
    image: '/images/signature/pianos/gx-3/gx-3-hero.webp',
    imageAlt: 'A pianist at an open black Kawai GX-3 grand piano',
    imagePosition: '50% 40%',
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
  image: '/images/signature/pianos/gl-50/gl-50-hero.webp',
  imageAlt: 'Inside a Kawai GL-50 grand piano, the plate and strings',
}

/** The dealer close's three scenes. */
export const BF_SCENES: SceneImages = {
  warmPianist: '/images/namm/general/_MG_7325.jpg',
  soundboard: '/images/signature/pianos/gx-2/gx-2-hero.webp',
  luxeRoom: '/images/signature/pianos/gx-3/gx-3-secondary.webp',
}

/**
 * The photograph band over the financing section (US only). Decorative: the
 * section's own heading names the offer, so the picture carries `alt=""`.
 */
export const BF_FINANCING_BAND: Art = {
  image: '/images/signature/pianos/gx-1/gx-1-hero.webp',
  imageAlt: '',
  imagePosition: '50% 45%',
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
  BF_FINANCING_BAND.image,
  ...Object.values(BF_SCENES),
]
