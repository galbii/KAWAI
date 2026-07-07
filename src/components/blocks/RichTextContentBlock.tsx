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
  // A rich-text body block always sits beneath the page/template <h1>, so an
  // authored <h1> in the body would create a duplicate top-level heading
  // (WCAG 2.4.6). Demote any in-body h1 to h2; other levels pass through.
  heading: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    const Tag = (node.tag === 'h1' ? 'h2' : node.tag) as keyof React.JSX.IntrinsicElements
    return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>
  },
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
  // Payload's default table converter emits inline `border:1px solid #ccc;
  // padding:8px` on every cell, which (being inline) overrides the branded
  // `.prose table/th/td` rules in globals.css. Override it to emit clean,
  // style-free markup so the KAWAI `.prose` table styling applies, and wrap
  // the table in a horizontally-scrollable container for narrow viewports.
  table: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => (
    <div className="overflow-x-auto">
      <table>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => (
    <tr>{nodesToJSX({ nodes: node.children })}</tr>
  ),
  tablecell: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
    const Tag = (node.headerState > 0 ? 'th' : 'td') as 'th' | 'td'
    const colSpan = node.colSpan && node.colSpan > 1 ? node.colSpan : undefined
    const rowSpan = node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined
    return (
      <Tag
        colSpan={colSpan}
        rowSpan={rowSpan}
        style={node.backgroundColor ? { backgroundColor: node.backgroundColor } : undefined}
      >
        {nodesToJSX({ nodes: node.children })}
      </Tag>
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
