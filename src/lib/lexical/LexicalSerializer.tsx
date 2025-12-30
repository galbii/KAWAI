'use client'

import React from 'react'
import { RichText, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type {
  DefaultNodeTypes,
  SerializedUploadNode,
  SerializedLinkNode
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'
import type { Media } from '@/payload-types'

// Import block components for inline rendering
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { CallToActionBlock } from '@/components/blocks/CallToActionBlock'
import { ImageGalleryBlock } from '@/components/blocks/ImageGalleryBlock'
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { TextBlock } from '@/components/blocks/TextBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { SpacerBlock } from '@/components/blocks/SpacerBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { ColumnsBlock } from '@/components/blocks/ColumnsBlock'

// Custom upload converter component that uses Next.js Image
const CustomUploadComponent: React.FC<{ node: SerializedUploadNode }> = ({ node }) => {
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }

    const media = uploadDoc as Media
    const { alt, url, width, height } = media

    if (!url) {
      return null
    }

    return (
      <div className="my-8 rounded-lg overflow-hidden">
        <Image
          src={url}
          alt={alt || 'Uploaded image'}
          width={width || 1200}
          height={height || 800}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    )
  }

  return null
}

// Helper function to convert internal doc links to href
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!

  if (typeof value !== 'object') {
    return '#'
  }

  const slug = value.slug

  switch (relationTo) {
    case 'posts':
      return `/blog/${slug}`
    case 'products':
      return `/products/${slug}`
    case 'storefronts':
      return `/${slug}`
    default:
      return `/${slug}`
  }
}

// JSX Converters for Lexical nodes
const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,

  // Override upload node to use Next.js Image
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />
  },

  // Use LinkJSXConverter helper for internal links
  ...LinkJSXConverter({ internalDocToHref }),

  // Heading converters with Tailwind typography
  h1: ({ node, nodesToJSX }) => (
    <h1 className="text-4xl md:text-5xl font-bold text-kawai-charcoal mb-6 mt-8">
      {nodesToJSX({ nodes: node.children })}
    </h1>
  ),
  h2: ({ node, nodesToJSX }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-5 mt-7">
      {nodesToJSX({ nodes: node.children })}
    </h2>
  ),
  h3: ({ node, nodesToJSX }) => (
    <h3 className="text-2xl md:text-3xl font-semibold text-kawai-charcoal mb-4 mt-6">
      {nodesToJSX({ nodes: node.children })}
    </h3>
  ),
  h4: ({ node, nodesToJSX }) => (
    <h4 className="text-xl md:text-2xl font-semibold text-kawai-charcoal mb-3 mt-5">
      {nodesToJSX({ nodes: node.children })}
    </h4>
  ),
  h5: ({ node, nodesToJSX }) => (
    <h5 className="text-lg md:text-xl font-semibold text-kawai-charcoal mb-3 mt-4">
      {nodesToJSX({ nodes: node.children })}
    </h5>
  ),
  h6: ({ node, nodesToJSX }) => (
    <h6 className="text-base md:text-lg font-semibold text-kawai-charcoal mb-2 mt-3">
      {nodesToJSX({ nodes: node.children })}
    </h6>
  ),

  // Paragraph
  paragraph: ({ node, nodesToJSX }) => (
    <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),

  // Lists
  ul: ({ node, nodesToJSX }) => (
    <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-gray-700">
      {nodesToJSX({ nodes: node.children })}
    </ul>
  ),
  ol: ({ node, nodesToJSX }) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 ml-4 text-gray-700">
      {nodesToJSX({ nodes: node.children })}
    </ol>
  ),
  li: ({ node, nodesToJSX }) => (
    <li className="leading-relaxed">{nodesToJSX({ nodes: node.children })}</li>
  ),

  // Quote
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="border-l-4 border-kawai-red pl-6 py-4 my-6 italic text-lg text-gray-800 bg-kawai-pearl">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),

  // Code block
  code: ({ node, nodesToJSX }) => (
    <pre className="bg-kawai-charcoal text-white p-4 rounded-lg overflow-x-auto my-6">
      <code className="text-sm font-mono">{nodesToJSX({ nodes: node.children })}</code>
    </pre>
  ),

  // Inline code
  'code-highlight': ({ node, nodesToJSX }) => (
    <code className="bg-gray-200 text-kawai-red px-2 py-1 rounded text-sm font-mono">
      {nodesToJSX({ nodes: node.children })}
    </code>
  ),

  // Blocks embedded in rich text
  blocks: {
    hero: ({ node }: { node: any }) => <HeroBlock {...node.fields} />,
    callToAction: ({ node }: { node: any }) => <CallToActionBlock {...node.fields} />,
    imageGallery: ({ node }: { node: any }) => <ImageGalleryBlock {...node.fields} />,
    testimonials: ({ node }: { node: any }) => <TestimonialsBlock {...node.fields} />,
    // Atomic modular blocks
    image: ({ node }: { node: any }) => <ImageBlock {...node.fields} />,
    text: ({ node }: { node: any }) => <TextBlock {...node.fields} />,
    video: ({ node }: { node: any }) => <VideoBlock {...node.fields} />,
    spacer: ({ node }: { node: any }) => <SpacerBlock {...node.fields} />,
    divider: ({ node }: { node: any }) => <DividerBlock {...node.fields} />,
    columns: ({ node }: { node: any }) => <ColumnsBlock {...node.fields} />,
  },
})

// Props for LexicalSerializer
interface LexicalSerializerProps {
  content?: SerializedEditorState | null | undefined
  data?: SerializedEditorState | null | undefined
  className?: string
}

/**
 * LexicalSerializer - Converts Lexical rich text data to JSX
 *
 * Features:
 * - Next.js Image optimization for uploads
 * - Custom styling with Tailwind prose classes
 * - Support for embedded blocks (hero, CTA, gallery, testimonials, atomic blocks)
 * - Internal and external link handling
 * - Code syntax highlighting ready
 */
export function LexicalSerializer({ content, data, className = '' }: LexicalSerializerProps) {
  // Support both 'content' and 'data' props for flexibility
  const editorState = content || data

  if (!editorState) {
    return null
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <RichText converters={jsxConverters} data={editorState} />
    </div>
  )
}
