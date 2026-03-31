'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const CustomMediaRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ mediaType?: string; alt?: string }>()
  const type = data?.mediaType === 'youtube' ? '▶ YouTube' : '🖼 Image'
  const caption = data?.alt ? ` — ${data.alt}` : ''
  return <span>{type}{caption || ` ${rowNumber}`}</span>
}
