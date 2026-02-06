import type { MarketingContactFormBlock } from '@/payload-types'
import { ContactForm } from '@/components/homepage/contact-form'
import type { ContactFormSectionData } from '@/lib/types/homepage'

export function ContactFormRenderer(props: MarketingContactFormBlock) {
  const formData: ContactFormSectionData = {
    contactTitle: props.contactTitle || 'Find Your Perfect',
    contactTitleHighlight: props.contactTitleHighlight || 'Piano',
    contactDescription: props.contactDescription || '',
    stepTitles: props.stepTitles?.map((s) => ({ step: s.step })) || [],
    trustMessage: props.trustMessage || '',
    benefits: props.benefits?.map((b) => ({
      icon: b.icon,
      text: b.text,
    })) || [],
    formOptions: {
      experienceLevels: props.formOptions?.experienceLevels?.map((l) => ({ level: l.level })) || [],
      pianoTypes: props.formOptions?.pianoTypes?.map((t) => ({ type: t.type })) || [],
      budgetRanges: props.formOptions?.budgetRanges?.map((r) => ({ range: r.range })) || [],
      primaryUses: props.formOptions?.primaryUses?.map((u) => ({ use: u.use })) || [],
    },
  }

  return <ContactForm data={formData} />
}
