'use client'

import { PromoPopup } from '@/components/ui/promo-popup'

export interface SuccessorPromoPopupProps {
  /** Handle of the collection the visitor is currently viewing (namespaces the dismissal key) */
  currentHandle: string
  /** Title of the collection the visitor is currently viewing — shown in the lineage marque */
  currentTitle: string
  /** Handle of the successor collection — the popup links to /pianos/{successorHandle} */
  successorHandle: string
  successorTitle: string
  imageUrl?: string | null
  eyebrow?: string | null
  title?: string | null
  message?: string | null
  ctaLabel?: string | null
  frequency?: 'session' | 'visitor' | 'always' | null
  delaySeconds?: number | null
}

/**
 * Succession announcement modal shown on legacy collection pages, pointing
 * visitors at the successor collection. Thin wrapper over the general-purpose
 * PromoPopup — keeps the original storage key so existing dismissals persist.
 */
export function SuccessorPromoPopup({
  currentHandle,
  currentTitle,
  successorHandle,
  successorTitle,
  imageUrl,
  eyebrow,
  title,
  message,
  ctaLabel,
  frequency = 'session',
  delaySeconds = 2,
}: SuccessorPromoPopupProps) {
  return (
    <PromoPopup
      storageKey={`kawai-successor-promo-${currentHandle}`}
      href={`/pianos/${successorHandle}`}
      headline={title || `Meet the ${successorTitle}`}
      imageUrl={imageUrl}
      imageAlt={successorTitle}
      eyebrow={eyebrow || 'The Next Generation'}
      message={message}
      ctaLabel={ctaLabel || 'Explore the New Collection'}
      marque={{ from: currentTitle, to: successorTitle }}
      dismissLabel={`Continue browsing the ${currentTitle}`}
      frequency={frequency}
      delaySeconds={delaySeconds}
    />
  )
}
