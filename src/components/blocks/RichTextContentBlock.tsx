'use client'

import React from 'react'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { ContentRichTextBlock } from '@/payload-types'
import { BannerBlock } from './BannerBlock'
import { CodeBlock } from './CodeBlock'

// Converters keyed by actual block slugs ('content-banner', 'content-code')
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    'content-banner': ({ node }: { node: any }) => <BannerBlock {...node.fields} />,
    'content-code': ({ node }: { node: any }) => <CodeBlock {...node.fields} />,
  },
  upload: ({ node }: { node: any }) => {
    const { value } = node ?? {}
    const url: string | undefined = value?.url || value?.publicUrl
    const alt: string = value?.alt || value?.filename || ''
    const width: number = value?.width || 1200
    const height: number = value?.height || 800

    if (!url) return null

    return (
      <figure className="my-8">
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg w-full h-auto"
        />
      </figure>
    )
  },
})

export function RichTextContentBlock({ content }: ContentRichTextBlock) {
  if (!content) return null

  return (
    <div className="prose prose-lg prose-headings:font-[family-name:var(--font-brand-serif)] prose-headings:text-kawai-black prose-p:text-kawai-charcoal prose-p:leading-relaxed prose-a:text-kawai-red prose-a:no-underline hover:prose-a:underline prose-strong:text-kawai-black prose-blockquote:border-l-kawai-red prose-blockquote:text-kawai-charcoal prose-li:text-kawai-charcoal prose-li:leading-relaxed prose-table:border prose-table:border-kawai-neutral prose-th:bg-kawai-pearl prose-th:text-kawai-black prose-th:font-semibold prose-th:border prose-th:border-kawai-neutral prose-th:px-4 prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-kawai-neutral prose-td:text-kawai-charcoal prose-td:px-4 prose-td:py-2 max-w-none">
      <RichText converters={converters} data={content} />
    </div>
  )
}
