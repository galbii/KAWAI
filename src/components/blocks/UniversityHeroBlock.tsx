import React from 'react'
import { UniversityHeroRenderer } from './events/UniversityHeroRenderer'

// Type definition - will be replaced by generated types after build
interface UniversityHeroBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityHeroBlock(block: UniversityHeroBlockProps) {
  return <UniversityHeroRenderer block={block as any} />
}
