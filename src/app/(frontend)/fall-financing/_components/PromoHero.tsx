import Image from 'next/image'
import { PromoHeroCarousel } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { PROGRAM_END } from './campaign'
import { heroOffersFor, heroOpenerFor } from './slides'

/**
 * The hero: "Fall for a Kawai" as the page's h1, over a photograph that the
 * offer index along its foot controls. See `PromoHeroCarousel` for how the
 * index and the frames are one control rather than two.
 *
 * No brand mark of its own: the site header shows the Kawai logo at every
 * width, phones included, and a second one directly under it was the brand
 * said twice.
 *
 * The opener slide supplies the headline, the line under it and the key art;
 * `heroOffersFor` supplies one cell per offer running on this site, each with
 * its frame. On ca.kawaius.com the financing cell is absent, and with it the
 * financing frame.
 */
/**
 * The headline's last word, as the brand's own mark: "Fall for a [Kawai]".
 *
 * `alt="Kawai"` is what keeps the h1's text "Fall for a Kawai" for a screen
 * reader and a crawler. It sits on a line of its own under "Fall for a", and
 * is sized in `em` against the headline so it tracks the type at every
 * breakpoint — a touch larger than the serif's caps, since it is the line's
 * emphasis rather than a word inside it. Kawai red, unfiltered — a logotype is exempt from 1.4.3, and the
 * shadow is the same two-pass lift the headline itself carries.
 */
function HeadlineMark() {
  return (
    <Image
      src="/images/Kawai (Red)(2).png"
      alt="Kawai"
      width={3336}
      height={667}
      priority
      sizes="(max-width: 640px) 60vw, 34rem"
      className="block h-[0.86em] w-auto"
      style={{
        filter:
          'drop-shadow(0 2px 4px rgba(29,27,24,0.55)) drop-shadow(0 8px 28px rgba(29,27,24,0.45))',
      }}
    />
  )
}

/** "Fall for a Kawai" → "Fall for a", with the mark standing in for the last word. */
function splitBrand(title: string): { words: string; mark: boolean } {
  return title.endsWith(' Kawai')
    ? { words: title.slice(0, -' Kawai'.length), mark: true }
    : { words: title, mark: false }
}

export function PromoHero({ site = 'us' }: { site?: 'us' | 'cad' }) {
  const opener = heroOpenerFor(site)
  const { words, mark } = splitBrand(opener.title)

  return (
    <PromoHeroCarousel
      title={words}
      {...(mark ? { titleMark: <HeadlineMark /> } : {})}
      {...(opener.body ? { body: opener.body } : {})}
      ending={`Offers end ${PROGRAM_END}.`}
      cta={<PromoButton />}
      keyArt={{ image: opener.image, imageAlt: opener.imageAlt }}
      offers={heroOffersFor(site)}
    />
  )
}
