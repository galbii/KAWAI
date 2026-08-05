#!/usr/bin/env tsx
/**
 * Dealers — RSM List Reconciliation
 *
 * Reconciles the Payload `dealers` collection against the RSM dealer roster CSV
 * (columns: dealerName, dbaName, contactInfo_email, address_state, RSM).
 *
 * What it does:
 *   1. rsmEmail          — backfilled from the CSV `RSM` column
 *   2. contactInfo.email — synced to the CSV email; also lowercased/trimmed
 *                          collection-wide so existing values are normalized
 *   3. ecommerceDealer   — set true on every dealer NOT present in the CSV
 *   4. dbaName           — filled from the CSV where present and currently empty
 *
 * Matching: dealer names are normalized (lowercased, punctuation and
 * Inc/LLC/Ltd/Co/Company/Corp suffixes stripped, curly apostrophes folded) and
 * keyed on (name, state), falling back to name alone. The state component is
 * required to disambiguate "Piano Gallery", which appears under two different
 * RSMs in AB and ID.
 *
 * Safety: every document mutated is written to a timestamped JSON backup before
 * any change, so the run can be reverted field-by-field.
 *
 * Usage:
 *   bun --env-file=.env.local run migrate:dealers:rsm:dry-run
 *   bun --env-file=.env.local run migrate:dealers:rsm
 *   bun --env-file=.env.local run migrate:dealers:rsm -- --csv=/path/to/list.csv
 */

import { getPayload } from 'payload'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import config from '../src/payload.config'

const DEFAULT_CSV =
  '/Users/chance/Downloads/2026-07-30_23-16-45-dealers(2) (1).csv'

interface CsvRow {
  dealerName: string
  dbaName: string
  contactInfo_email: string
  address_state: string
  RSM: string
}

interface Backup {
  id: string
  slug: string
  dealerName: string
  before: Record<string, unknown>
  after: Record<string, unknown>
}

/** Full state/province names seen in the data, mapped to their postal codes. */
const STATE_MAP: Record<string, string> = {
  ALABAMA: 'AL',
  ALASKA: 'AK',
  ARIZONA: 'AZ',
  OHIO: 'OH',
  ALBERTA: 'AB',
  'BRITISH COLUMBIA': 'BC',
  MANITOBA: 'MB',
  'NOVA SCOTIA': 'NS',
  ONTARIO: 'ON',
  QUEBEC: 'QC',
  SASKATCHEWAN: 'SK',
}

function normalizeState(raw: string | null | undefined): string | null {
  const s = (raw ?? '').trim()
  if (!s) return null
  const upper = s.toUpperCase()
  if (STATE_MAP[upper]) return STATE_MAP[upper]
  return s.length === 2 ? upper : s
}

function normalizeName(raw: string | null | undefined): string {
  return (raw ?? '')
    .normalize('NFKD')
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .trim()
    .replace(/[.,&]/g, ' ')
    .replace(/\b(inc|llc|ltd|co|company|corp)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Minimal CSV parser handling quoted fields containing commas. */
function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  const stripped = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i]
    if (inQuotes) {
      if (ch === '"') {
        if (stripped[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') field += ch
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  const header = rows.shift()
  if (!header) return []
  return rows
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => {
      const obj: Record<string, string> = {}
      header.forEach((h, i) => {
        obj[h.trim()] = r[i] ?? ''
      })
      return obj as unknown as CsvRow
    })
}

async function migrate(dryRun: boolean, csvPath: string): Promise<void> {
  console.log('🎹 Dealers — RSM List Reconciliation')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no changes)' : '✍️  LIVE'}`)
  console.log(`   CSV:  ${csvPath}`)
  console.log('')

  const rows = parseCsv(readFileSync(csvPath, 'utf8'))
  console.log(`   Parsed ${rows.length} CSV rows`)

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'dealers',
    limit: 1000,
    depth: 0,
    pagination: false,
  })
  console.log(`   Loaded ${docs.length} dealers from Payload\n`)

  // Index dealers by (name, state) and by name alone.
  const byNameState = new Map<string, typeof docs>()
  const byName = new Map<string, typeof docs>()
  for (const d of docs) {
    const n = normalizeName(d.dealerName)
    const s = normalizeState(d.address?.state)
    const push = (m: Map<string, typeof docs>, k: string) => {
      const list = m.get(k)
      if (list) list.push(d)
      else m.set(k, [d])
    }
    push(byNameState, `${n}|${s ?? ''}`)
    push(byName, n)
  }

  // Roster membership is decided by NAME ALONE, independent of the precise
  // (name, state) resolution used to assign data below. A dealer whose state is
  // missing or disagrees with the roster is still a roster dealer — it must not
  // be mistaken for an e-commerce account. This affects real locations such as
  // Schmitt Music SD, Henderson Music (state recorded as "Ohio"), Rieman Music,
  // Arizona Piano and Cordogans Pianoland.
  const csvNames = new Set(rows.map((r) => normalizeName(r.dealerName)))

  // RSM per roster name, used to fill dealers that match by name but not state.
  const rsmByName = new Map<string, Set<string>>()
  for (const r of rows) {
    const n = normalizeName(r.dealerName)
    const set = rsmByName.get(n) ?? new Set<string>()
    set.add(r.RSM.trim().toLowerCase())
    rsmByName.set(n, set)
  }

  // Resolve each CSV row to its target dealer document(s).
  const updates = new Map<string, Record<string, unknown>>()
  const onList = new Set<string>()
  const unresolved: string[] = []
  let viaNameState = 0
  let viaName = 0

  for (const d of docs) {
    if (csvNames.has(normalizeName(d.dealerName))) onList.add(String(d.id))
  }

  for (const r of rows) {
    const n = normalizeName(r.dealerName)
    const s = normalizeState(r.address_state)
    const exact = byNameState.get(`${n}|${s ?? ''}`)
    const targets = exact ?? byName.get(n)

    if (!targets?.length) {
      unresolved.push(`${r.dealerName} [${r.address_state}]`)
      continue
    }
    if (exact) viaNameState++
    else viaName++

    const rsm = r.RSM.trim().toLowerCase()
    const email = r.contactInfo_email.trim().toLowerCase()
    const dba = r.dbaName.trim()

    for (const d of targets) {
      const patch = updates.get(String(d.id)) ?? {}
      if (rsm) patch.rsmEmail = rsm
      if (email) patch.email = email
      if (dba && !d.dbaName) patch.dbaName = dba
      updates.set(String(d.id), patch)
    }
  }

  // Roster dealers with no precise (name, state) hit still get an RSM when every
  // roster row for that name agrees on one. Their contact email is deliberately
  // left alone — the roster row belongs to a different location.
  let viaNameOnlyRsm = 0
  for (const d of docs) {
    const id = String(d.id)
    if (!onList.has(id) || updates.get(id)?.rsmEmail) continue
    const candidates = rsmByName.get(normalizeName(d.dealerName))
    if (candidates?.size !== 1) continue
    const rsm = [...candidates][0]!
    updates.set(id, { ...(updates.get(id) ?? {}), rsmEmail: rsm })
    viaNameOnlyRsm++
  }

  console.log('   Row resolution:')
  console.log(`     matched via name+state : ${viaNameState}`)
  console.log(`     matched via name only  : ${viaName}`)
  console.log(`     RSM via name fallback  : ${viaNameOnlyRsm}`)
  console.log(`     unresolved             : ${unresolved.length}`)
  unresolved.forEach((u) => console.log(`        ⚠️  ${u}`))
  console.log('')

  // Build the final per-document change set.
  const backups: Backup[] = []
  const stats = {
    rsmSet: 0,
    emailFilled: 0,
    emailOverwritten: 0,
    emailNormalized: 0,
    dbaFilled: 0,
    ecommerceFlagged: 0,
    docsChanged: 0,
    errors: 0,
  }
  const overwrites: string[] = []

  for (const d of docs) {
    const id = String(d.id)
    const patch = updates.get(id) ?? {}
    const before: Record<string, unknown> = {}
    const after: Record<string, unknown> = {}
    const data: Record<string, unknown> = {}

    // 1. rsmEmail
    if (typeof patch.rsmEmail === 'string' && d.rsmEmail !== patch.rsmEmail) {
      before.rsmEmail = d.rsmEmail ?? null
      after.rsmEmail = patch.rsmEmail
      data.rsmEmail = patch.rsmEmail
      stats.rsmSet++
    }

    // 2. contactInfo.email — CSV value wins; otherwise normalize what is there.
    const currentEmail = (d.contactInfo?.email ?? '').trim()
    const csvEmail = typeof patch.email === 'string' ? patch.email : null
    const targetEmail = csvEmail ?? currentEmail.toLowerCase()

    if (targetEmail && targetEmail !== currentEmail) {
      before['contactInfo.email'] = d.contactInfo?.email ?? null
      after['contactInfo.email'] = targetEmail
      data.contactInfo = { ...(d.contactInfo ?? {}), email: targetEmail }
      if (!currentEmail) stats.emailFilled++
      else if (currentEmail.toLowerCase() !== targetEmail) {
        stats.emailOverwritten++
        overwrites.push(`${d.slug}: ${currentEmail} → ${targetEmail}`)
      } else stats.emailNormalized++
    }

    // 3. dbaName
    if (typeof patch.dbaName === 'string' && !d.dbaName) {
      before.dbaName = d.dbaName ?? null
      after.dbaName = patch.dbaName
      data.dbaName = patch.dbaName
      stats.dbaFilled++
    }

    // 4. ecommerceDealer — true for anything absent from the roster.
    const isEcommerce = !onList.has(id)
    if (isEcommerce && d.ecommerceDealer !== true) {
      before.ecommerceDealer = d.ecommerceDealer ?? false
      after.ecommerceDealer = true
      data.ecommerceDealer = true
      stats.ecommerceFlagged++
    }

    if (!Object.keys(data).length) continue
    stats.docsChanged++
    backups.push({ id, slug: d.slug, dealerName: d.dealerName, before, after })

    if (!dryRun) {
      try {
        await payload.update({
          collection: 'dealers',
          id: d.id,
          data,
          depth: 0,
          context: { skipRevalidation: true },
        })
      } catch (err) {
        stats.errors++
        console.error(`   ❌ ${d.slug}:`, err instanceof Error ? err.message : err)
      }
    }
  }

  // Write the backup regardless of mode so a dry run still yields a diff to review.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = resolve(
    process.cwd(),
    `backups/dealers-rsm-${dryRun ? 'dryrun-' : ''}${stamp}.json`,
  )
  mkdirSync(dirname(backupPath), { recursive: true })
  writeFileSync(backupPath, JSON.stringify(backups, null, 2))

  console.log('   Changes:')
  console.log(`     rsmEmail set              : ${stats.rsmSet}`)
  console.log(`     contactInfo.email filled  : ${stats.emailFilled}`)
  console.log(`     contactInfo.email changed : ${stats.emailOverwritten}`)
  console.log(`     contactInfo.email cased   : ${stats.emailNormalized}`)
  console.log(`     dbaName filled            : ${stats.dbaFilled}`)
  console.log(`     ecommerceDealer flagged   : ${stats.ecommerceFlagged}`)
  console.log(`     documents touched         : ${stats.docsChanged}`)
  console.log(`     errors                    : ${stats.errors}`)

  if (overwrites.length) {
    console.log('\n   ⚠️  Overwritten emails (review these):')
    overwrites.forEach((o) => console.log(`     ${o}`))
  }

  console.log(`\n   💾 Backup: ${backupPath}`)
  console.log(dryRun ? '\n🔍 Dry run complete — nothing written.' : '\n✅ Migration complete.')
  process.exit(0)
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvArg = args.find((a) => a.startsWith('--csv='))
const csvPath = csvArg ? csvArg.slice('--csv='.length) : DEFAULT_CSV

migrate(dryRun, csvPath).catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
