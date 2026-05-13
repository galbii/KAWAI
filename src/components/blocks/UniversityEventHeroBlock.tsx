import React from 'react'
import { UniversityEventHeroRenderer } from './university/UniversityEventHeroRenderer'

interface UniversityEventHeroBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityEventHeroBlock(block: UniversityEventHeroBlockProps) {
  return <UniversityEventHeroRenderer block={block} />
}
