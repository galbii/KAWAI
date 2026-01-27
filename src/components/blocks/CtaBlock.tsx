import React from 'react'
import type { CtaBlock as CtaBlockProps } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { LinkGroup } from '@/components/CMSLink'
import { cn } from '@/lib/utils'

type Props = CtaBlockProps & {
  className?: string
}

/**
 * CtaBlock Component (Call to Action)
 *
 * Renders a call-to-action section with rich text content and action links.
 * Typically used for prompting user engagement and conversions.
 *
 * Server Component
 */
export function CtaBlock({ richText, links, className }: Props) {
  return (
    <div
      className={cn(
        'my-16 bg-gradient-to-br from-kawai-red/10 to-kawai-gold/10 rounded-2xl',
        className
      )}
    >
      <div className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className="mb-8 prose prose-lg mx-auto"
            />
          )}

          {links && links.length > 0 && (
            <LinkGroup links={links} className="justify-center" />
          )}
        </div>
      </div>
    </div>
  )
}
