import type { MarketingNewsletterPopupBlock } from '@/payload-types'
import { NewsletterPopupRenderer } from './marketing/NewsletterPopupRenderer'

export function NewsletterPopupBlock(props: MarketingNewsletterPopupBlock) {
  return <NewsletterPopupRenderer {...props} />
}
