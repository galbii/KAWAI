import Image from 'next/image'
import { RuledGround, BTS_CONTAINER, SectionHead, Reveal } from '@/components/back-to-school'
import { showroomsCopy } from './campaign'
import { aboutImages } from './images'
import { SignUpButton, CampaignLink } from './CampaignCtas'

/**
 * Where to play. The dealer network stated once, at poster scale, with the
 * count set as the display figure rather than a stat card — on this page the
 * number IS the argument for signing up, so it gets the size.
 *
 * Pearl ground, so it reads as the next sheet after the ledger rather than a
 * new page. The Kawai wordmark sits on the heading's cap height the way the
 * Back to School showroom heading signs itself with the storefront's.
 */
export function ShowroomsSection() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
        <SectionHead
          eyebrow={showroomsCopy.eyebrow}
          title={showroomsCopy.headline}
          aside={showroomsCopy.aside}
          className="mb-12 md:mb-16"
        />

        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 md:gap-16 items-center">
          <div>
            <Reveal
              as="span"
              variant="line"
              className="bts-display bts-num block text-kawai-red leading-none"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 9.5rem)' }}
            >
              200+
            </Reveal>

            <Reveal variant="ruleX" delay={0.12} className="h-px bg-kawai-black/15 my-6" aria-hidden />

            <Reveal as="p" delay={0.18} className="bts-eyebrow text-kawai-charcoal/60">
              {showroomsCopy.subhead}
            </Reveal>

            <Reveal
              delay={0.26}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-10"
            >
              <SignUpButton />
              <CampaignLink href={showroomsCopy.findDealerCta.href}>
                {showroomsCopy.findDealerCta.label}
              </CampaignLink>
            </Reveal>
          </div>

          {/* The picture is the aside here — a dealer floor, wiped in beside the
              count rather than cropped behind the copy. */}
          <Reveal variant="wipe" delay={0.1} className="relative aspect-[4/3] w-full bg-kawai-black">
            <Image
              src={aboutImages.warmPianist}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
