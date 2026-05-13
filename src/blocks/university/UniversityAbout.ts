import type { Block } from 'payload'
import { imageField, mediaField } from '@/lib/payload/fields'

export const UniversityAbout: Block = {
  slug: 'university-about',
  labels: {
    singular: '🎓 University About',
    plural: 'University About Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+About',
  imageAltText:
    'Editorial about section for university piano sale events. Features section heading, partnership description, bento-style image gallery, and an optional PDF partnership letter.',
  interfaceName: 'UniversityAboutBlock',
  fields: [
    // Heading
    {
      type: 'collapsible',
      label: 'Heading',
      admin: {
        description: 'Section headline and partner branding',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sectionHeading',
          type: 'text',
          admin: {
            description: 'Primary section heading (e.g. "Houston\'s Premier Piano Sale Event")',
            placeholder: "Houston's Premier Piano Sale Event",
          },
        },
        {
          name: 'headingHighlight',
          type: 'text',
          admin: {
            description:
              'Part of the heading to highlight in Kawai Red (must appear verbatim in the heading)',
            placeholder: 'Piano Sale Event',
          },
        },
        imageField('partnerLogo', {
          required: false,
          admin: {
            description: 'Logo displayed above the section heading (optional)',
          },
        }),
        {
          name: 'categoryLabel',
          type: 'text',
          admin: {
            description:
              'Scrolling marquee / category label bar text (e.g. "HOUSTON PIANO SALES | BABY GRANDS | ...")',
            placeholder: 'HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS',
          },
        },
      ],
    },

    // Description
    {
      type: 'collapsible',
      label: 'Description',
      admin: {
        description: 'Partnership description paragraphs',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'descriptionParagraphs',
          type: 'array',
          maxRows: 6,
          admin: {
            description: 'Add up to 6 description paragraphs (each rendered as a separate <p>)',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Paragraph text',
              },
            },
          ],
        },
      ],
    },

    // Gallery
    {
      type: 'collapsible',
      label: 'Gallery',
      admin: {
        description: 'Bento-style image gallery — up to 6 images',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'gallery',
          type: 'array',
          maxRows: 6,
          admin: {
            description: 'Add up to 6 gallery images. The first image renders large (hero position).',
          },
          fields: [
            imageField('image', {
              required: true,
              admin: {
                description: 'Gallery image',
              },
            }),
            {
              name: 'caption',
              type: 'text',
              admin: {
                description: 'Optional alt text / caption for this image',
                placeholder: 'KAWAI CA901 Digital Piano',
              },
            },
          ],
        },
      ],
    },

    // PDF & Document
    {
      type: 'collapsible',
      label: 'PDF & Document',
      admin: {
        description: 'Optional partnership letter or document',
        initCollapsed: true,
      },
      fields: [
        mediaField('partnershipDocument', {
          filterOptions: {
            mimeType: { contains: 'pdf' },
          },
          admin: {
            description: 'Upload a PDF partnership letter or event document',
          },
        }),
        {
          name: 'showDocumentButton',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show a "View Partnership Letter" button linking to this document',
          },
        },
        {
          name: 'documentButtonLabel',
          type: 'text',
          defaultValue: 'View Partnership Letter',
          admin: {
            description: 'Label for the document download/view button',
            placeholder: 'View Partnership Letter',
            condition: (_data: any, siblingData: any) => !!siblingData?.showDocumentButton,
          },
        },
      ],
    },

    // Style
    {
      type: 'collapsible',
      label: 'Style',
      admin: {
        description: 'Background colour and section spacing',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Pearl (off-white)', value: 'pearl' },
            { label: 'Kawai Black', value: 'black' },
          ],
          admin: {
            description: 'Section background colour',
          },
        },
      ],
    },
  ],
}
