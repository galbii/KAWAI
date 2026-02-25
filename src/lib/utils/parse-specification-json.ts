/**
 * parse-specification-json.ts
 *
 * Converts a Shopify custom.specification_json metafield value into flat,
 * renderable rows for the Technical Specifications block.
 *
 * Each row maps to a 3-column layout:
 *   label  |  type (name/category)  |  value + subItems
 *
 * Value shapes handled:
 *   - null / undefined              → skip
 *   - boolean                       → "Yes" / "No"
 *   - string / number               → direct value
 *   - string[]                      → first as value, rest as subItems
 *   - { name, details[] }           → type=name, details as value/subItems
 *   - { name, parameters[] }        → type=name, params as value/subItems
 *   - { count, label }              → label as value
 *   - { types: number }             → "N types"
 *   - { version, details[] }        → type="Version X", details as subItems
 *   - flat object with primitives   → each key flattened into sub-item lines
 *   - nested objects                → one level deeper
 */

export interface ParsedSpecRow {
  label: string
  type?: string    // middle column: name / category info when present
  value: string
  subItems?: string[]
}

/** Convert snake_case / kebab-case / camelCase keys to Title Case labels */
function humanizeKey(key: string): string {
  return key
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Flatten a plain object one level deep into "Label: value" strings */
function flattenObject(obj: Record<string, unknown>): string[] {
  const lines: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue
    const lbl = humanizeKey(k)
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      lines.push(`${lbl}: ${v}`)
    } else if (Array.isArray(v)) {
      const strs = v.filter((x): x is string => typeof x === 'string')
      if (strs.length) lines.push(`${lbl}: ${strs.join(', ')}`)
    } else if (typeof v === 'object') {
      const nested = v as Record<string, unknown>
      for (const [k2, v2] of Object.entries(nested)) {
        if (v2 === null || v2 === undefined) continue
        lines.push(`${humanizeKey(k2)}: ${v2}`)
      }
    }
  }
  return lines
}

function normalizeArrayValue(arr: unknown[]): { value: string; subItems?: string[] } {
  const filtered = arr.filter((v) => v !== null && v !== undefined)
  if (filtered.length === 0) return { value: '—' }

  // Array of strings
  if (filtered.every((v) => typeof v === 'string')) {
    const strings = filtered as string[]
    return {
      value: strings[0] ?? '—',
      ...(strings.length > 1 ? { subItems: strings.slice(1) } : {}),
    }
  }

  // Array of objects (e.g., available_finishes: [{ name, model }])
  const items = filtered
    .filter((v): v is Record<string, unknown> => typeof v === 'object' && !Array.isArray(v))
    .map((v) => Object.values(v).filter(Boolean).join(' — '))

  return {
    value: items[0] ?? '—',
    ...(items.length > 1 ? { subItems: items.slice(1) } : {}),
  }
}

function normalizeObjectValue(
  obj: Record<string, unknown>,
): { type?: string; value: string; subItems?: string[] } {

  // { name, details: string[] } — most common piano spec shape
  if (Array.isArray(obj.details)) {
    const details = (obj.details as unknown[]).filter((d): d is string => typeof d === 'string')
    const name = typeof obj.name === 'string' ? obj.name : undefined

    // Collect extra sub-items: parameters list + smart_mode
    const extra: string[] = []
    if (Array.isArray(obj.parameters)) {
      extra.push(...(obj.parameters as string[]).filter(Boolean))
    }
    if (typeof obj.smart_mode === 'object' && obj.smart_mode !== null) {
      const sm = obj.smart_mode as Record<string, unknown>
      if (sm.name) extra.push(`${sm.name}${sm.presets ? ` (${sm.presets} presets)` : ''}`)
    }

    const allDetails = [...details, ...extra]
    return {
      ...(name ? { type: name } : {}),
      value: allDetails[0] ?? '—',
      ...(allDetails.length > 1 ? { subItems: allDetails.slice(1) } : {}),
    }
  }

  // { name, parameters: string[] }
  if (Array.isArray(obj.parameters)) {
    const name = typeof obj.name === 'string' ? obj.name : undefined
    const params = (obj.parameters as string[]).filter(Boolean)

    const extra: string[] = []
    if (typeof obj.smart_mode === 'object' && obj.smart_mode !== null) {
      const sm = obj.smart_mode as Record<string, unknown>
      if (sm.name) extra.push(`${sm.name}${sm.presets ? ` (${sm.presets} presets)` : ''}`)
    }

    const all = [...params, ...extra]
    return {
      ...(name ? { type: name } : {}),
      value: all[0] ?? '—',
      ...(all.length > 1 ? { subItems: all.slice(1) } : {}),
    }
  }

  // { label } or { count, label }
  if (typeof obj.label === 'string') return { value: obj.label }
  if (typeof obj.count === 'number') return { value: String(obj.count) }

  // { types: number }
  if (typeof obj.types === 'number') return { value: `${obj.types} types` }

  // { version, details } (e.g., bluetooth)
  if (typeof obj.version === 'string' && Array.isArray(obj.details)) {
    const details = (obj.details as string[]).filter(Boolean)
    return {
      type: `Version ${obj.version}`,
      value: details[0] ?? '—',
      ...(details.length > 1 ? { subItems: details.slice(1) } : {}),
    }
  }

  // Flat / nested object — flatten to sub-items
  const lines = flattenObject(obj)
  if (lines.length === 0) return { value: JSON.stringify(obj) }
  return {
    value: lines[0] ?? '—',
    ...(lines.length > 1 ? { subItems: lines.slice(1) } : {}),
  }
}

/**
 * Parse a raw specification JSON object into renderable rows.
 * Null / undefined values are silently skipped.
 */
export function parseSpecificationJson(
  json: Record<string, unknown>,
): ParsedSpecRow[] {
  const rows: ParsedSpecRow[] = []

  for (const [key, value] of Object.entries(json)) {
    const label = humanizeKey(key)

    if (value === null || value === undefined) continue

    if (typeof value === 'boolean') {
      rows.push({ label, value: value ? 'Yes' : 'No' })
      continue
    }

    if (typeof value === 'string') {
      rows.push({ label, value })
      continue
    }

    if (typeof value === 'number') {
      rows.push({ label, value: String(value) })
      continue
    }

    if (Array.isArray(value)) {
      if (value.length === 0) continue
      const { value: v, subItems } = normalizeArrayValue(value)
      rows.push({ label, value: v, ...(subItems ? { subItems } : {}) })
      continue
    }

    if (typeof value === 'object') {
      const { type, value: v, subItems } = normalizeObjectValue(value as Record<string, unknown>)
      rows.push({
        label,
        ...(type ? { type } : {}),
        value: v,
        ...(subItems ? { subItems } : {}),
      })
    }
  }

  return rows
}
