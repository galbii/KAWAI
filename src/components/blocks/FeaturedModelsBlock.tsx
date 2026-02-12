import React from 'react'
import { FeaturedModelsRenderer } from './marketing/FeaturedModelsRenderer'

// Type definition - will be replaced by generated types after build
interface FeaturedModelsBlockProps {
  blockType?: string
  [key: string]: any
}

export function FeaturedModelsBlock(block: FeaturedModelsBlockProps) {
  return <FeaturedModelsRenderer block={block as any} />
}
