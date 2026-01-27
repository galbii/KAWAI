import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/lib/utils'

type Props = ContentBlockProps

/**
 * ContentBlock Component
 *
 * Flexible column layout with rich text content and optional links.
 * Supports 1/3, 1/2, 2/3, and full-width columns.
 *
 * Server Component
 */
export function ContentBlock({ columns }: Props) {
  if (!columns || columns.length === 0) {
    return null
  }

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8">
        {columns.map((col, index) => {
          const { enableLink, link, richText, size } = col

          return (
            <div
              className={cn(
                `col-span-4 lg:col-span-${colsSpanClasses[size || 'full']}`,
                {
                  'md:col-span-2': size !== 'full',
                }
              )}
              key={index}
            >
              {richText && (
                <RichText data={richText} enableGutter={false} className="mb-6" />
              )}

              {enableLink && link && (
                <CMSLink {...link} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
