import React from 'react'
import { UniversityFaqRenderer } from './university/UniversityFaqRenderer'

interface UniversityFaqBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityFaqBlock(block: UniversityFaqBlockProps) {
  return <UniversityFaqRenderer block={block as any} />
}
