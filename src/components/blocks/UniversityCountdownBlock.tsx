import React from 'react'
import { UniversityCountdownRenderer } from './university/UniversityCountdownRenderer'

interface UniversityCountdownBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityCountdownBlock(block: UniversityCountdownBlockProps) {
  return <UniversityCountdownRenderer block={block as any} />
}
