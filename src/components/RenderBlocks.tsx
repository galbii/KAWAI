import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { ArchiveBlock } from './blocks/ArchiveBlock'
import { ContentBlock } from './blocks/ContentBlock'
import { MediaBlock } from './blocks/MediaBlock'
import { CtaBlock } from './blocks/CtaBlock'

/**
 * Block Components Mapping
 *
 * Maps block slugs to their respective React components.
 * Add new block types here as they're created.
 */
const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  cta: CtaBlock,
} as const

type BlockComponents = typeof blockComponents

/**
 * RenderBlocks Component
 *
 * Dynamically renders an array of blocks from Payload CMS.
 * Each block is mapped to its corresponding React component based on blockType.
 *
 * Server Component - can be used in RSC context
 *
 * @example
 * ```tsx
 * <RenderBlocks blocks={page.layout} />
 * ```
 */
export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof BlockComponents]

          if (Block) {
            return (
              <div key={index} className="block-container">
                {/* @ts-expect-error - Block types are complex and may have slight mismatches */}
                <Block {...block} />
              </div>
            )
          }
        }

        // Log unhandled block types in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Unhandled block type: ${blockType}`)
        }

        return null
      })}
    </Fragment>
  )
}
