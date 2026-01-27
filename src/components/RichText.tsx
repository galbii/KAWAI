import React from 'react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'

type Props = {
  data: SerializedEditorState
  className?: string
  enableGutter?: boolean
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
})

/**
 * RichText Component
 *
 * Renders Payload CMS Lexical rich text content with proper styling.
 * Supports all default Lexical features and can be extended with custom converters.
 *
 * @example
 * ```tsx
 * <RichText data={page.content} className="prose" />
 * ```
 */
export function RichText({ data, className, enableGutter = true }: Props) {
  if (!data) {
    return null
  }

  return (
    <div
      className={cn(
        'richtext',
        {
          'container mx-auto px-4': enableGutter,
        },
        className
      )}
    >
      <PayloadRichText converters={converters} data={data} />
    </div>
  )
}
