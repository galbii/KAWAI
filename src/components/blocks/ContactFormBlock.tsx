import type { MarketingContactFormBlock } from '@/payload-types'
import { ContactFormRenderer } from './marketing/ContactFormRenderer'

export function ContactFormBlock(props: MarketingContactFormBlock) {
  return <ContactFormRenderer {...props} />
}
