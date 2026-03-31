'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const SpecificationRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ spec?: string; details?: string }>()
  return <span>{data?.spec || `Specification ${rowNumber}`}</span>
}
