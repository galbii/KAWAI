import type { Block } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { MediaManagerUploadFeature } from '@/features/mediaManagerUpload'

export const RichTextContent: Block = {
  slug: 'content-rich-text',
  interfaceName: 'ContentRichTextBlock',
  labels: {
    singular: '✏️ Rich Text',
    plural: 'Rich Text Blocks',
  },
  imageAltText: 'Add formatted article text with headings, lists, quotes, and inline callouts',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          // Reference globally registered blocks by slug
          BlocksFeature({ blocks: ['content-banner', 'content-code'] }),
          UploadFeature({ collections: { media: { fields: [] } } }),
          MediaManagerUploadFeature(),
          HorizontalRuleFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Rich text content with headings, lists, quotes, and inline Banner/Code blocks',
      },
    },
  ],
}
