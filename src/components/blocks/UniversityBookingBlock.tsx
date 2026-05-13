import React from 'react'
import { UniversityBookingRenderer } from './university/UniversityBookingRenderer'

// Type definition — will be replaced by generated types after `bun run build`
interface UniversityBookingBlockProps {
  blockType?: string
  [key: string]: any
}

export function UniversityBookingBlock(block: UniversityBookingBlockProps) {
  return <UniversityBookingRenderer block={block as any} />
}
