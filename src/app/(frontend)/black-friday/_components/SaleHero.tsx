import Image from 'next/image'
import { PromoButton } from '../../fall-financing/_components/PromoUI'
import { BF_KEY_ART, bfHeroOffersFor } from './art'
import { BfHero } from './BfHero'
import { SALE_BODY, SALE_ENDING, SALE_TITLE, type SaleSite, type SaleVariant } from './sale'

/**
 * The Black Friday hero: the /fall-financing hero's words (offer index words
 * from `heroOffersFor`, financing cell dropped on ca.kawaius.com; same CTA),
 * with the Black Friday headline, opener and ending line from `sale.ts`, the
 * frames from `art.ts`, and since redesign v3 the BF-owned layout in `BfHero`.
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
      className="block h-[0.9em] w-auto"
    />
  )
}

export function SaleHero({ site, variant }: { site: SaleSite; variant: SaleVariant }) {
  const title = SALE_TITLE[variant]
  const words = title.endsWith(' Kawai') ? title.slice(0, -' Kawai'.length) : title

  return (
    <BfHero
      title={words}
      {...(words !== title ? { titleMark: <HeadlineMark /> } : {})}
      body={SALE_BODY[variant][site]}
      ending={SALE_ENDING[variant].line}
      cta={<PromoButton />}
      keyArt={BF_KEY_ART}
      offers={bfHeroOffersFor(site)}
    />
  )
}
