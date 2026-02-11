import React from 'react'
import { EventOverviewRenderer } from './events/EventOverviewRenderer'

// Type definition - will be replaced by generated types after build
interface EventOverviewBlockProps {
  blockType?: string
  [key: string]: any
}

export function EventOverviewBlock(block: EventOverviewBlockProps) {
  return <EventOverviewRenderer block={block as any} />
}
