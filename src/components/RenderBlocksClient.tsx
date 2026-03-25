'use client'

/**
 * RenderBlocksClient
 *
 * Client-side block renderer for live preview contexts.
 *
 * Unlike `RenderBlocks` (a Server Component), this runs entirely in the browser
 * so it can re-render in real-time as `useLivePreview` streams field changes from
 * the Payload admin panel.
 *
 * Scope: only the blocks the Posts collection actually uses. Other collections
 * keep using the server-side `RenderBlocks`. Adding a new block to Posts?
 *   1. Confirm the component is `'use client'` and has no server-only imports
 *   2. Import it here and add it to `POST_BLOCK_COMPONENTS`
 *
 * Server-only blocks (e.g. `marketing-blog-latest`) can't render client-side because
 * they call `getPayloadClient()`. They get a preview placeholder instead.
 */

import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import type { Post } from '@/payload-types'

// Content blocks — all `'use client'`, render purely from props
import { RichTextContentBlock } from '@/components/blocks/RichTextContentBlock'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { BannerBlock } from '@/components/blocks/BannerBlock'
import { CodeBlock } from '@/components/blocks/CodeBlock'
import { ContentCtaBlock } from '@/components/blocks/ContentCtaBlock'

// Layout blocks — all `'use client'`, render purely from props
import { SpacerBlock } from '@/components/blocks/SpacerBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { ColumnsBlock } from '@/components/blocks/ColumnsBlock'

// Marketing blocks — all `'use client'`, render purely from props
import { CallToActionBlock } from '@/components/blocks/CallToActionBlock'
import { FeaturedModelsBlock } from '@/components/blocks/FeaturedModelsBlock'
import { ArtistCarouselBlock } from '@/components/blocks/ArtistCarouselBlock'

// Map block slugs → client components (mirrors blockComponents in RenderBlocks.tsx)
const POST_BLOCK_COMPONENTS = {
  'content-rich-text': RichTextContentBlock,
  'content-image': ImageBlock,
  'content-video': VideoBlock,
  'content-banner': BannerBlock,
  'content-code': CodeBlock,
  'content-cta': ContentCtaBlock,
  'layout-spacer': SpacerBlock,
  'layout-divider': DividerBlock,
  'layout-columns': ColumnsBlock,
  'marketing-cta': CallToActionBlock,
  'marketing-featured-models': FeaturedModelsBlock,
  'marketing-artist-carousel': ArtistCarouselBlock,
  // marketing-blog-latest is server-only — gets a placeholder (see below)
} as const

type ClientBlockType = keyof typeof POST_BLOCK_COMPONENTS

function isClientBlock(blockType: string): blockType is ClientBlockType {
  return blockType in POST_BLOCK_COMPONENTS
}

/**
 * Shown in the live preview iframe for blocks that require server-side data fetching.
 * Normal (non-preview) page rendering is unaffected — `RenderBlocks` handles those.
 */
function ServerBlockPlaceholder({ blockType }: { blockType: string }) {
  return (
    <div className="flex items-center justify-center py-8 mx-auto max-w-4xl px-6">
      <div className="w-full flex items-center justify-center py-6 border border-dashed border-kawai-neutral rounded-lg bg-kawai-pearl/50">
        <p className="text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
          <span className="font-medium text-kawai-charcoal/70">{blockType}</span>
          {' '}— save to preview this block
        </p>
      </div>
    </div>
  )
}

export function RenderBlocksClient({ blocks }: { blocks: Post['layout'] }) {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (isClientBlock(blockType)) {
          const Block = POST_BLOCK_COMPONENTS[blockType]
          return (
            <div
              key={block.id ?? index}
              id={`block-${block.id}`}
              className={cn(
                'block-container',
                // Match RenderBlocks: strip margin from the very first block
                index === 0 && '[&>*]:!m-0 [&>*]:!mt-0 [&>*]:!mb-0',
              )}
            >
              {/* @ts-expect-error — block type unions are complex; runtime safety ensured by isClientBlock */}
              <Block {...block} />
            </div>
          )
        }

        // Server-only block — show a styled placeholder in the live preview
        return (
          <div key={block.id ?? index} className="block-container">
            <ServerBlockPlaceholder blockType={blockType} />
          </div>
        )
      })}
    </Fragment>
  )
}
