import React from 'react'
import { UniversityLocationRenderer } from './university/UniversityLocationRenderer'

// Type definition — will be replaced by generated types after `bun run build`
interface UniversityLocationBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityLocationBlock(block: UniversityLocationBlockProps) {
  return <UniversityLocationRenderer block={block as any} />
}
