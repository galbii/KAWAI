'use client'

import React from 'react'
import type { ContentTextBlock as TextBlockType } from '@/payload-types'
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { cn } from '@/lib/utils'

interface TextBlockProps extends TextBlockType {}

export function TextBlock({ content, alignment = 'left' }: TextBlockProps) {
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
        'my-6 prose prose-lg max-w-none',
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      )}
    >
      <LexicalSerializer content={content} />
    </div>
  )
}
