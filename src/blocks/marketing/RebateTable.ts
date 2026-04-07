import type { Block } from 'payload'

export const RebateTable: Block = {
  slug: 'marketing-rebate-table',
  labels: {
    singular: '💰 Rebate Table',
    plural: 'Rebate Tables',
  },
  interfaceName: 'MarketingRebateTableBlock',
  fields: [
    // ── Header ────────────────────────────────────────────────────────────────
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Spring 2026 Savings',
      admin: { description: 'Small label above the heading' },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Digital Piano Rebates',
      admin: { description: 'Section heading' },
    },
    {
      name: 'deadline',
      type: 'text',
      defaultValue: 'June 30, 2026',
      admin: { description: 'Offer end date shown in the heading and subtitle (e.g. "June 30, 2026")' },
    },

    // ── Schedule ──────────────────────────────────────────────────────────────
    {
      name: 'schedule',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add one entry per series. Each series contains one or more model rows.',
      },
      defaultValue: [
        {
          seriesName: 'CN Series',
          models: [
            { model: 'CN201', finishes: 'All Finishes', consumerRebate: 150 },
            { model: 'CN301', finishes: 'All Finishes', consumerRebate: 200 },
          ],
        },
        {
          seriesName: 'CA Series',
          models: [
            { model: 'CA401', finishes: 'All Finishes', consumerRebate: 200 },
            { model: 'CA501', finishes: 'All Finishes', consumerRebate: 250 },
            { model: 'CA701', finishes: 'All Finishes', consumerRebate: 300 },
            { model: 'CA901', finishes: 'All Finishes', consumerRebate: 400 },
          ],
        },
        {
          seriesName: 'DG Series',
          models: [
            { model: 'DG-30', finishes: 'EP', consumerRebate: 400 },
          ],
        },
        {
          seriesName: 'ES Series',
          models: [
            { model: 'ES60', finishes: 'Black', consumerRebate: 30 },
            { model: 'ES120', finishes: 'Black / White / Gold', consumerRebate: 50 },
            { model: 'ES920', finishes: 'Black / White', consumerRebate: 100 },
          ],
        },
        {
          seriesName: 'CX Line',
          models: [
            { model: 'CX102', finishes: 'Black / White', consumerRebate: 75 },
            { model: 'CX202', finishes: 'Rosewood / Satin Black / White', consumerRebate: 100 },
          ],
        },
        {
          seriesName: 'MP Series',
          models: [
            { model: 'MP7SE', finishes: 'Black', consumerRebate: 150 },
            { model: 'MP11SE', finishes: 'Black', consumerRebate: 200 },
          ],
        },
        {
          seriesName: 'VPC Controllers',
          models: [
            { model: 'VPC1', finishes: 'Black', consumerRebate: 175 },
          ],
        },
      ],
      fields: [
        {
          name: 'seriesName',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "CN Series", "CA Series"' },
        },
        {
          name: 'models',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'model',
              type: 'text',
              required: true,
              admin: { description: 'Model number, e.g. "CN201"' },
            },
            {
              name: 'finishes',
              type: 'text',
              admin: { description: 'Available finishes, e.g. "Black / White / Gold"' },
            },
            {
              name: 'consumerRebate',
              type: 'number',
              required: true,
              min: 0,
              admin: { description: 'Consumer rebate amount in USD' },
            },
          ],
        },
      ],
    },
  ],
}
