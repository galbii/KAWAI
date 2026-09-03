import { RuledGround, BTS_CONTAINER, SectionHead, Reveal } from '@/components/back-to-school'
import { codaCopy } from './campaign'
import { SignUpButton, CampaignLink } from './CampaignCtas'

/**
 * The last sheet: the ask, with nothing else on it.
 *
 * Back on pearl after the dark trust strip, and deliberately sparse — every
 * other section on the page has already made an argument, so this one only
 * has to be the button.
 */
export function CodaSection() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround animate />

      <div className={`relative ${BTS_CONTAINER} py-20 md:py-32`}>
        <SectionHead
          eyebrow={codaCopy.eyebrow}
          title={codaCopy.headline}
          aside={codaCopy.body}
          className="mb-12"
        />

        <Reveal
          delay={0.12}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
        >
          <SignUpButton />
          <CampaignLink href={codaCopy.secondaryCta.href}>{codaCopy.secondaryCta.label}</CampaignLink>
        </Reveal>
      </div>
    </section>
  )
}
