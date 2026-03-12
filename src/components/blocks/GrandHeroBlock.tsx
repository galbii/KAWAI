import React from 'react'
import { MarketingGrandHeroRenderer } from './marketing/MarketingGrandHeroRenderer'

// Type definition - will be replaced by generated types after build
interface GrandHeroBlockProps {
  blockType?: string
  [key: string]: any
}

export function GrandHeroBlock(block: GrandHeroBlockProps) {
  const { ctaTracking, impressionTracking, ...rest } = block
  return (
    <MarketingGrandHeroRenderer
      block={rest as any}
      ctaTracking={ctaTracking}
      impressionTracking={impressionTracking}
    />
  )
}
