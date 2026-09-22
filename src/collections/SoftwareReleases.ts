import type { CollectionConfig } from 'payload'
import { anyone, authenticated, adminOnly } from '@/lib/payload/access'
import { slugBeforeDuplicate } from '@/lib/payload/fields/slug'
import {
  revalidateSoftwareRelease,
  revalidateSoftwareReleaseAfterDelete,
} from './hooks/revalidateSoftwareReleases'

/**
 * Firmware / system software downloads surfaced on /software.
 *
 * One document per instrument. The binaries themselves stay on kawai-global.com
 * (Kawai Japan owns and signs them) — we store the URL, so publishing a new
 * release is a one-field edit: paste the new zip URL and bump the version.
 */
export const SoftwareReleases: CollectionConfig = {
  slug: 'software-releases',
  labels: { singular: 'Software Release', plural: 'Software Releases' },
  admin: {
    group: 'Content',
    useAsTitle: 'model',
    defaultColumns: ['model', 'category', 'series', 'isActive', 'updatedAt'],
    description:
      'Firmware downloads listed on /software. To publish a new version, open the model and update the Version and Update file URL.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateSoftwareRelease],
    afterDelete: [revalidateSoftwareReleaseAfterDelete],
  },
  fields: [
    {
      name: 'model',
      type: 'text',
      required: true,
      admin: {
        description:
          'Model name exactly as Kawai lists it, e.g. "ES920" or "CA901/CA701". Shown as the row heading.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeDuplicate: [slugBeforeDuplicate] },
      admin: {
        description: 'Anchor id used for deep links, e.g. /software#es920. Lowercase, kebab-case.',
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'digital',
      options: [
        { label: 'Digital Pianos', value: 'digital' },
        { label: 'Hybrid Pianos', value: 'hybrid' },
        { label: 'AnyTime & AURES', value: 'anytime' },
      ],
      admin: { description: 'Top-level group in the sidebar.' },
    },
    {
      name: 'series',
      type: 'select',
      required: true,
      index: true,
      options: ['CA', 'CN', 'CS', 'CX', 'DG', 'ES', 'MP', 'CP', 'NV', 'ATX', 'AURES'].map((s) => ({
        label: s,
        value: s,
      })),
      admin: { description: 'Series group nested under the category in the sidebar.' },
    },
    {
      name: 'aliases',
      type: 'array',
      labels: { singular: 'Alias', plural: 'Aliases' },
      admin: {
        description:
          'Extra names the search box should match. For combined models add each half separately (CA901, CA701) so either owner finds the row.',
        initCollapsed: true,
      },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'downloads',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Download', plural: 'Downloads' },
      admin: {
        description:
          'Usually one row ("System"). A few instruments (CA901/CA701, CA99/CA79, NV10S, NV5S) also ship a separately-versioned LCD touch panel image — add it as a second row.',
        components: {
          RowLabel: '/components/admin/SoftwareDownloadRowLabel#SoftwareDownloadRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'System',
          admin: { description: 'What this file updates, e.g. "System" or "LCD Touch Panel".' },
        },
        {
          name: 'version',
          type: 'text',
          required: true,
          admin: {
            description: 'Version number without the "v", e.g. 1.25 or 1.0.10.',
            width: '50%',
          },
        },
        {
          name: 'releaseDate',
          type: 'date',
          admin: {
            description: 'Optional. Shown as "Updated <month> <year>" next to the version.',
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' },
            width: '50%',
          },
        },
        {
          name: 'fileUrl',
          type: 'text',
          required: true,
          admin: {
            description:
              'Direct link to the .zip on kawai-global.com. This is the field to change when new firmware ships.',
          },
        },
        {
          name: 'fileBytes',
          type: 'number',
          admin: {
            description:
              'Optional file size in bytes, shown on the download button (e.g. 918448 renders as "897 KB"). Leave blank to hide the size.',
          },
        },
        {
          name: 'instructionsUrl',
          type: 'text',
          admin: { description: 'Link to the English instructions PDF.' },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description:
          'Optional short note shown under the model, e.g. a prerequisite or a caveat about the update.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        description: 'Uncheck to hide this model from /software without deleting it.',
        position: 'sidebar',
      },
    },
  ],
}
