'use client'

import { CampaignLocationModal } from './CampaignLocationModal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

/** Grand Spring Sale wrapper around the generic campaign location picker. */
export function SpringSaleLocationModal({ isOpen, onClose }: Props) {
  return (
    <CampaignLocationModal
      isOpen={isOpen}
      onClose={onClose}
      hrefForSlug={slug => `/store/${slug}/grand-spring-sale`}
    />
  )
}
