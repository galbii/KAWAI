import React from 'react'
import { UniversitySocialProofRenderer } from './university/UniversitySocialProofRenderer'

interface UniversitySocialProofBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversitySocialProofBlock(block: UniversitySocialProofBlockProps) {
  return <UniversitySocialProofRenderer block={block as any} />
}
