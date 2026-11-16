import Image from 'next/image'
import { PromoHeroCarousel } from '@/components/fall-promo'
import { PromoButton } from '../../fall-financing/_components/PromoUI'
import { heroOffersFor, heroOpenerFor } from '../../fall-financing/_components/slides'
import { SALE_BODY, SALE_ENDING, SALE_TITLE, type SaleSite, type SaleVariant } from './sale'

/**
 * The /fall-financing hero with Black Friday words: same key art, same offer
 * index (financing cell dropped on ca.kawaius.com by `heroOffersFor`), same
 * CTA. Only the headline, the opener line and the ending line change.
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

export function SaleHero({ site, variant }: { site: SaleSite; variant: SaleVariant }) {
  const opener = heroOpenerFor(site)
  const title = SALE_TITLE[variant]
  const words = title.endsWith(' Kawai') ? title.slice(0, -' Kawai'.length) : title

  return (
    <PromoHeroCarousel
      title={words}
      {...(words !== title ? { titleMark: <HeadlineMark /> } : {})}
      body={SALE_BODY[variant][site]}
      ending={SALE_ENDING[variant].line}
      cta={<PromoButton />}
      keyArt={{ image: opener.image, imageAlt: opener.imageAlt }}
      offers={heroOffersFor(site)}
    />
  )
}
