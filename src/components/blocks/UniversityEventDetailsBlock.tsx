import React from 'react'
import { UniversityEventDetailsRenderer } from './university/UniversityEventDetailsRenderer'

interface UniversityEventDetailsBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityEventDetailsBlock(block: UniversityEventDetailsBlockProps) {
  return <UniversityEventDetailsRenderer block={block as any} />
}
