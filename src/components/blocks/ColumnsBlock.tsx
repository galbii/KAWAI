'use client'

import React from 'react'
import type { LayoutColumnsBlock as ColumnsBlockType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ImageBlock } from './ImageBlock'
import { TextBlock } from './TextBlock'
import { VideoBlock } from './VideoBlock'
import { SpacerBlock } from './SpacerBlock'
import { DividerBlock } from './DividerBlock'

interface ColumnsBlockProps extends ColumnsBlockType {}

// Block component mapping for nested blocks
const NESTED_BLOCK_COMPONENTS = {
  image: ImageBlock,
  text: TextBlock,
  video: VideoBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
} as const

export function ColumnsBlock({ columns, layout }: ColumnsBlockProps) {
  if (!columns || columns.length === 0) {
    return null
  }

  // Gap class mapping
  const gapClasses = {
    small: 'gap-2',   // 0.5rem
    medium: 'gap-4',  // 1rem
    large: 'gap-8',   // 2rem
  }

  // Vertical align class mapping
  const verticalAlignClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  // Background color class mapping
  const backgroundClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }

  // Width class mapping
  const widthClasses = {
    '25': 'w-full md:w-1/4',
    '33': 'w-full md:w-1/3',
    '50': 'w-full md:w-1/2',
    '66': 'w-full md:w-2/3',
    '75': 'w-full md:w-3/4',
    '100': 'w-full',
  }

  const gap = layout?.gap || 'medium'
  const verticalAlign = layout?.verticalAlign || 'top'
  const backgroundColor = layout?.backgroundColor || 'transparent'

  return (
    <div
      className={cn(
        'my-8 rounded-lg',
        backgroundClasses[backgroundColor as keyof typeof backgroundClasses],
        backgroundColor !== 'transparent' && 'p-6'
      )}
    >
      <div
        className={cn(
          'flex flex-wrap',
          gapClasses[gap as keyof typeof gapClasses],
          verticalAlignClasses[verticalAlign as keyof typeof verticalAlignClasses]
        )}
      >
        {columns.map((column, index) => {
          const width = column.width || '50'
          const content = column.content || []

          return (
            <div
              key={column.id || `column-${index}`}
              className={cn(
                widthClasses[width as keyof typeof widthClasses],
                'flex-shrink-0'
              )}
            >
              {content.map((block: any, blockIndex: number) => {
                const blockType = block.blockType
                const BlockComponent = NESTED_BLOCK_COMPONENTS[blockType as keyof typeof NESTED_BLOCK_COMPONENTS]

                if (!BlockComponent) {
                  console.warn(`[ColumnsBlock] Unknown nested block type: "${blockType}"`)
                  return null
                }

                return (
                  <BlockComponent
                    key={block.id || `block-${blockIndex}`}
                    {...block}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
