import React from 'react'
import type { ContentBannerBlock } from '@/payload-types'
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { cn } from '@/lib/utils'

interface ContentBannerRendererProps extends ContentBannerBlock {}

export function ContentBannerRenderer({ style = 'info', content }: ContentBannerRendererProps) {
  // Style mapping with KAWAI's Tailwind design system
  const styleClasses = {
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400',
    warning: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-400',
    error: 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-400',
    success: 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-400',
  }

  return (
    <div className="mx-auto my-8 w-full">
      <div
        className={cn(
          'border-2 py-4 px-6 flex items-center rounded-lg',
          styleClasses[style as keyof typeof styleClasses]
        )}
      >
        <div className="w-full prose prose-sm max-w-none dark:prose-invert">
          <LexicalSerializer content={content} />
        </div>
      </div>
    </div>
  )
}
