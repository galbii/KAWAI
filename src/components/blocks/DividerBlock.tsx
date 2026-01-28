'use client'

import React from 'react'
import type { LayoutDividerBlock as DividerBlockType } from '@/payload-types'
import { cn } from '@/lib/utils'

interface DividerBlockProps extends DividerBlockType {}

export function DividerBlock({
  style = 'solid',
  color = 'default',
  width = 'full',
  spacing = 'medium',
}: DividerBlockProps) {
  // Style class mapping
  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  // Color class mapping
  const colorClasses = {
    default: 'border-gray-300',
    dark: 'border-gray-600',
    brand: 'border-kawai-red',
  }

  // Width class mapping
  const widthClasses = {
    full: 'w-full',
    '75': 'w-3/4 mx-auto',
    '50': 'w-1/2 mx-auto',
    '25': 'w-1/4 mx-auto',
  }

  // Spacing class mapping
  const spacingClasses = {
    small: 'my-4',  // 1rem
    medium: 'my-8', // 2rem
    large: 'my-16', // 4rem
  }

  return (
    <div
      className={cn(
        spacingClasses[spacing as keyof typeof spacingClasses]
      )}
    >
      <hr
        className={cn(
          'border-t',
          styleClasses[style as keyof typeof styleClasses],
          colorClasses[color as keyof typeof colorClasses],
          widthClasses[width as keyof typeof widthClasses]
        )}
      />
    </div>
  )
}
