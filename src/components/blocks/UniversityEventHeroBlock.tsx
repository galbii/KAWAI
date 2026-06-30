import React from 'react'
import { UniversityEventHeroRenderer } from './university/UniversityEventHeroRenderer'

interface UniversityEventHeroBlockProps {
  blockType?: string
  headingLevel?: 'h1' | 'h2'
  [key: string]: any
}

export function UniversityEventHeroBlock(block: UniversityEventHeroBlockProps) {
  const { headingLevel, ...rest } = block
  return <UniversityEventHeroRenderer block={rest} headingLevel={headingLevel ?? 'h1'} />
}
