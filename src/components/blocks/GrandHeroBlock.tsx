import React from 'react'
import { MarketingGrandHeroRenderer } from './marketing/MarketingGrandHeroRenderer'

// Type definition - will be replaced by generated types after build
interface GrandHeroBlockProps {
  blockType?: string
  [key: string]: any
}

export function GrandHeroBlock(block: GrandHeroBlockProps) {
  return <MarketingGrandHeroRenderer block={block as any} />
}
