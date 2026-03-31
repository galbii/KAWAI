'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const VariationRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ name?: string; price?: number }>()
  const label = data?.name || `Variation ${rowNumber}`
  const price = data?.price ? ` — $${data.price.toLocaleString()}` : ''
  return <span>{label}{price}</span>
}
