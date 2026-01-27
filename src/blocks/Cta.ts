import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/lib/payload/fields/linkGroup'

/**
 * Simple Call to Action block
 *
 * This is a simpler, more flexible CTA block (compared to CallToAction.ts)
 * that uses rich text and link groups for maximum flexibility.
 * Originally from orca-web template.
 */
export const Cta: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Call to Actions',
    singular: 'Call to Action',
  },
}
