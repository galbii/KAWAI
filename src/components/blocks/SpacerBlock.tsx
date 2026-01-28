'use client'

import React from 'react'
import type { LayoutSpacerBlock as SpacerBlockType } from '@/payload-types'
import { cn } from '@/lib/utils'

interface SpacerBlockProps extends SpacerBlockType {}

export function SpacerBlock({ height = 'medium' }: SpacerBlockProps) {
  // Height class mapping
  const heightClasses = {
    xs: 'h-2',      // 0.5rem / 8px
    small: 'h-4',   // 1rem / 16px
    medium: 'h-8',  // 2rem / 32px
    large: 'h-16',  // 4rem / 64px
    xl: 'h-24',     // 6rem / 96px
  }

  return (
    <div
      className={cn(
        'block',
        heightClasses[height as keyof typeof heightClasses]
      )}
      aria-hidden="true"
    />
  )
}
