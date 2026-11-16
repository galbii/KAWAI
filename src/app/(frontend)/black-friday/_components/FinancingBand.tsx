import Image from 'next/image'
import { BF_FINANCING_BAND } from './art'

/**
 * A full-bleed photograph over the financing section (v3). Financing was the
 * one offer with no picture: a long dark sheet of type. Decorative only: the
 * section's own h2 names the offer, so the image has no alt and no text.
 */
export function FinancingBand() {
  return (
    <div aria-hidden className="bf-band relative h-[15rem] w-full overflow-hidden sm:h-[24rem] lg:h-[32rem]">
      <Image
        src={BF_FINANCING_BAND.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: BF_FINANCING_BAND.imagePosition ?? 'center' }}
      />
    </div>
  )
}
