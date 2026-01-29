import React from 'react'
import type { LayoutColumnsBlock } from '@/payload-types'
import { cn } from '@/lib/utils'
// Import nested block components
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { TextBlock } from '@/components/blocks/TextBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { SpacerBlock } from '@/components/blocks/SpacerBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'

interface LayoutColumnsRendererProps extends LayoutColumnsBlock {}

// Block component mapping for nested blocks
const NESTED_BLOCK_COMPONENTS = {
  'content-image': ImageBlock,
  'content-text': TextBlock,
  'content-video': VideoBlock,
  'layout-spacer': SpacerBlock,
  'layout-divider': DividerBlock,
} as const

export function LayoutColumnsRenderer({ columns, layout }: LayoutColumnsRendererProps) {
  if (!columns || columns.length === 0) {
    return null
  }

  // Gap class mapping
  const gapClasses = {
    small: 'gap-2',    // 0.5rem
    medium: 'gap-4',   // 1rem
    large: 'gap-8',    // 2rem
  }

  // Vertical alignment class mapping
  const verticalAlignClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  // Background color class mapping
  const bgColorClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    light: 'bg-gray-100 dark:bg-gray-800',
    dark: 'bg-gray-900 dark:bg-gray-950',
  }

  const gap = layout?.gap || 'medium'
  const verticalAlign = layout?.verticalAlign || 'top'
  const backgroundColor = layout?.backgroundColor || 'transparent'

  return (
    <div className={cn(
      'my-8 p-6 rounded-lg',
      bgColorClasses[backgroundColor as keyof typeof bgColorClasses]
    )}>
      <div className={cn(
        'flex flex-col md:flex-row',
        gapClasses[gap as keyof typeof gapClasses],
        verticalAlignClasses[verticalAlign as keyof typeof verticalAlignClasses]
      )}>
        {columns.map((column, index) => {
          // Width class mapping
          const widthClasses = {
            '25': 'md:w-1/4',
            '33': 'md:w-1/3',
            '50': 'md:w-1/2',
            '66': 'md:w-2/3',
            '75': 'md:w-3/4',
            '100': 'w-full',
          }

          const width = column.width || '50'
          const content = column.content || []

          return (
            <div
              key={column.id || `column-${index}`}
              className={cn(
                'w-full flex-shrink-0',
                widthClasses[width as keyof typeof widthClasses]
              )}
            >
              {/* Render nested blocks */}
              {content.map((block: any, blockIndex: number) => {
                const blockType = block.blockType
                const BlockComponent = NESTED_BLOCK_COMPONENTS[blockType as keyof typeof NESTED_BLOCK_COMPONENTS]

                if (!BlockComponent) {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn(`[LayoutColumnsRenderer] Unknown nested block type: "${blockType}"`)
                  }
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
