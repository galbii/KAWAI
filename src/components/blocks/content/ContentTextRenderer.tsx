import React from 'react'
import type { ContentTextBlock } from '@/payload-types'
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { cn } from '@/lib/utils'

interface ContentTextRendererProps extends ContentTextBlock {}

export function ContentTextRenderer({ content, alignment = 'left' }: ContentTextRendererProps) {
  // Alignment class mapping
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  return (
    <div
      className={cn(
        'my-6 prose prose-lg max-w-none dark:prose-invert',
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      )}
    >
      <LexicalSerializer content={content} />
    </div>
  )
}
