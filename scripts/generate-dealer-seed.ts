#!/usr/bin/env bun
/**
 * Generates src/lib/data/dealers-seed-data.ts from the CSV export.
 *
 * Usage:
 *   bun scripts/generate-dealer-seed.ts > src/lib/data/dealers-seed-data.ts
 */

import { readFileSync } from 'fs'

const CSV_PATH =
  process.argv[2] ??
  '/Users/chancenoonan/Downloads/kawai_dealer_network/Dealers-Table 1.csv'

// ---------------------------------------------------------------------------
// Minimal RFC 4180-compliant CSV parser (handles quoted fields with commas)
// ---------------------------------------------------------------------------
function parseCSV(raw: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]!
    const next = raw[i + 1]

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        row.push(field)
        field = ''
      } else if (ch === '\r' && next === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
        i++
      } else if (ch === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }
  // Last field / row
  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function bool(val: string): boolean {
  return val.trim().toUpperCase() === 'TRUE'
}

function str(val: string): string | undefined {
  const trimmed = val.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

// Take only the first email if comma-separated; discard if it looks like a URL
function parseEmail(val: string): string | undefined {
  const first = val.split(',')[0]?.trim() ?? ''
  if (!first || first.startsWith('http') || !first.includes('@')) return undefined
  return first
}

function num(val: string): number | undefined {
  const trimmed = val.trim()
  if (!trimmed) return undefined
  const n = parseFloat(trimmed)
  return isNaN(n) ? undefined : n
}

function escapeStr(val: string): string {
  return val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function renderOptStr(val: string | undefined): string {
  return val !== undefined ? `'${escapeStr(val)}'` : 'undefined'
}

function renderOptNum(val: number | undefined): string {
  return val !== undefined ? String(val) : 'undefined'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const raw = readFileSync(CSV_PATH, 'utf-8')
const rows = parseCSV(raw)

// Row 0 = headers, rows 1+ = data
const headers = rows[0]!
const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim()))

// Validate expected columns exist
const expectedCols = [
  'dealerName', 'slug', 'isActive', 'isFeatured', 'dealerIdentification',
  'phone', 'email', 'website', 'fax', 'street', 'city', 'state', 'zipCode',
  'country', 'latitude', 'longitude', 'shigeruKawaiDealer', 'acousticPianoDealer',
  'professionalProductDealer', 'description', 'hours', 'dealerImage',
  'yearEstablished', 'serviceRadius', 'primaryMarkets', 'statesServed',
  'metaTitle', 'metaDescription',
]

const colIdx: Record<string, number> = {}
for (const col of expectedCols) {
  const idx = headers.indexOf(col)
  if (idx === -1) {
    process.stderr.write(`Warning: column "${col}" not found in CSV\n`)
  }
  colIdx[col] = idx
}

function col(row: string[], name: string): string {
  const idx = colIdx[name]
  if (idx === undefined || idx === -1) return ''
  return row[idx] ?? ''
}

// ---------------------------------------------------------------------------
// Render TypeScript output
// ---------------------------------------------------------------------------
const entries = dataRows.map((row) => {
  const dealerName = str(col(row, 'dealerName')) ?? ''
  const slug = str(col(row, 'slug')) ?? ''
  const isActive = bool(col(row, 'isActive'))
  const isFeatured = bool(col(row, 'isFeatured'))
  const dealerIdentification = str(col(row, 'dealerIdentification'))
  const phone = str(col(row, 'phone'))
  const email = parseEmail(col(row, 'email'))
  const website = str(col(row, 'website'))
  const fax = str(col(row, 'fax'))
  const street = str(col(row, 'street'))
  const city = str(col(row, 'city'))
  const state = str(col(row, 'state'))
  const zipCode = str(col(row, 'zipCode'))
  const country = str(col(row, 'country'))
  const latitude = num(col(row, 'latitude'))
  const longitude = num(col(row, 'longitude'))
  const shigeruKawaiDealer = bool(col(row, 'shigeruKawaiDealer'))
  const acousticPianoDealer = bool(col(row, 'acousticPianoDealer'))
  const professionalProductDealer = bool(col(row, 'professionalProductDealer'))
  const description = str(col(row, 'description'))
  const metaTitle = str(col(row, 'metaTitle'))
  const metaDescription = str(col(row, 'metaDescription'))

  return {
    dealerName,
    slug,
    isActive,
    isFeatured,
    dealerIdentification,
    phone,
    email,
    website,
    fax,
    street,
    city,
    state,
    zipCode,
    country,
    latitude,
    longitude,
    shigeruKawaiDealer,
    acousticPianoDealer,
    professionalProductDealer,
    description,
    metaTitle,
    metaDescription,
  }
})

// ---------------------------------------------------------------------------
// Output file
// ---------------------------------------------------------------------------
const lines: string[] = []

lines.push(`// AUTO-GENERATED by scripts/generate-dealer-seed.ts`)
lines.push(`// Source: Dealers-Table 1.csv  (${dataRows.length} entries)`)
lines.push(`// DO NOT EDIT MANUALLY — re-run the generation script instead.`)
lines.push(``)
lines.push(`export type DealerSeedEntry = {`)
lines.push(`  dealerName: string`)
lines.push(`  slug: string`)
lines.push(`  isActive: boolean`)
lines.push(`  isFeatured: boolean`)
lines.push(`  dealerIdentification?: string`)
lines.push(`  phone?: string`)
lines.push(`  fax?: string`)
lines.push(`  email?: string`)
lines.push(`  website?: string`)
lines.push(`  street?: string`)
lines.push(`  city?: string`)
lines.push(`  state?: string`)
lines.push(`  zipCode?: string`)
lines.push(`  country?: string`)
lines.push(`  latitude?: number`)
lines.push(`  longitude?: number`)
lines.push(`  shigeruKawaiDealer: boolean`)
lines.push(`  acousticPianoDealer: boolean`)
lines.push(`  digitalPianoDealer: boolean`)
lines.push(`  professionalProductDealer: boolean`)
lines.push(`  description?: string`)
lines.push(`  metaTitle?: string`)
lines.push(`  metaDescription?: string`)
lines.push(`}`)
lines.push(``)
lines.push(`export const DEALER_SEED_DATA: DealerSeedEntry[] = [`)

for (const e of entries) {
  lines.push(`  {`)
  lines.push(`    dealerName: '${escapeStr(e.dealerName)}',`)
  lines.push(`    slug: '${escapeStr(e.slug)}',`)
  lines.push(`    isActive: ${e.isActive},`)
  lines.push(`    isFeatured: ${e.isFeatured},`)
  if (e.dealerIdentification !== undefined) lines.push(`    dealerIdentification: '${escapeStr(e.dealerIdentification)}',`)
  if (e.phone !== undefined) lines.push(`    phone: '${escapeStr(e.phone)}',`)
  if (e.fax !== undefined) lines.push(`    fax: '${escapeStr(e.fax)}',`)
  if (e.email !== undefined) lines.push(`    email: '${escapeStr(e.email)}',`)
  if (e.website !== undefined) lines.push(`    website: '${escapeStr(e.website)}',`)
  if (e.street !== undefined) lines.push(`    street: '${escapeStr(e.street)}',`)
  if (e.city !== undefined) lines.push(`    city: '${escapeStr(e.city)}',`)
  if (e.state !== undefined) lines.push(`    state: '${escapeStr(e.state)}',`)
  if (e.zipCode !== undefined) lines.push(`    zipCode: '${escapeStr(e.zipCode)}',`)
  if (e.country !== undefined) lines.push(`    country: '${escapeStr(e.country)}',`)
  if (e.latitude !== undefined) lines.push(`    latitude: ${renderOptNum(e.latitude)},`)
  if (e.longitude !== undefined) lines.push(`    longitude: ${renderOptNum(e.longitude)},`)
  lines.push(`    shigeruKawaiDealer: ${e.shigeruKawaiDealer},`)
  lines.push(`    acousticPianoDealer: ${e.acousticPianoDealer},`)
  lines.push(`    digitalPianoDealer: false,`)
  lines.push(`    professionalProductDealer: ${e.professionalProductDealer},`)
  if (e.description !== undefined) lines.push(`    description: '${escapeStr(e.description)}',`)
  if (e.metaTitle !== undefined) lines.push(`    metaTitle: '${escapeStr(e.metaTitle)}',`)
  if (e.metaDescription !== undefined) lines.push(`    metaDescription: '${escapeStr(e.metaDescription)}',`)
  lines.push(`  },`)
}

lines.push(`]`)
lines.push(``)

process.stdout.write(lines.join('\n'))
process.stderr.write(`\nGenerated ${entries.length} dealer entries.\n`)
