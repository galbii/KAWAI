/**
 * parse-specification-json.ts
 *
 * Converts a Shopify custom.specification_json metafield value into flat,
 * renderable rows for the Technical Specifications block.
 *
 * Each row maps to:
 *   label  |  type (name/category)  |  value + subItems
 *
 * The metafield is authored by hand in Shopify and its nesting is arbitrary —
 * `dimensions.height.without_music_rest.inches` is four levels deep, while
 * `music_rest` is a bare string. So the flattener below recurses to any depth
 * and carries a breadcrumb of the keys it walked through, which is what keeps
 * `Height — Without Music Rest: 6" (15 cm)` from collapsing into a bare
 * `Inches: 6` that the reader can no longer attribute to anything.
 *
 * Value shapes handled:
 *   - null / undefined              → skip
 *   - boolean                       → "Yes" / "No" (at every depth)
 *   - string / number               → direct value
 *   - string[]                      → first as value, rest as subItems
 *   - { name, details[] }           → type=name, details as value/subItems
 *   - { name, parameters[] }        → type=name, params as value/subItems
 *   - { count, label }              → label as value
 *   - { types: number }             → "N types"
 *   - { version, details[] }        → type="Version X", details as subItems
 *   - { inches, cm } / { lbs, kg }  → one measurement, both units
 *   - anything else                 → recursive breadcrumb flatten
 */

export interface ParsedSpecRow {
  label: string
  type?: string    // middle column: name / category info when present
  value: string
  subItems?: string[]
}

/**
 * Acronyms and product names that must not be Title Cased into "Midi" / "Usb".
 * Keyed by the lowercased word as it appears in a metafield key.
 */
const ACRONYMS: Record<string, string> = {
  midi: 'MIDI',
  usb: 'USB',
  eq: 'EQ',
  ep: 'EP',
  ac: 'AC',
  dc: 'DC',
  io: 'I/O',
  led: 'LED',
  lcd: 'LCD',
  oled: 'OLED',
  rca: 'RCA',
  xlr: 'XLR',
  bpm: 'BPM',
  shs: 'SHS',
  sk: 'SK',
  ex: 'EX',
  xl: 'XL',
  hx: 'HX',
  wx: 'WX',
  dx: 'DX',
  app: 'App',
  apps: 'Apps',
}

/** Convert snake_case / kebab-case / camelCase keys to Title Case labels */
function humanizeKey(key: string): string {
  return key
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const acronym = ACRONYMS[word.toLowerCase()]
      if (acronym) return acronym
      // Already mixed-case (e.g. an author-written "SK-EX") — leave it alone.
      if (/[A-Z]/.test(word.slice(1))) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

type Scalar = string | number | boolean

function isScalar(v: unknown): v is Scalar {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
}

/** Booleans are metadata in the source JSON ("has this feature") — never show raw true/false. */
function formatScalar(v: Scalar): string {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v).trim()
}

/**
 * Some products (DG30, KDP75, the GX line) were authored with whole spec
 * sections as one " - " delimited string instead of a nested object:
 *   "Responsive Hammer III action - 88 keys - Ivory Touch - Let-off"
 * Split those into separate lines so they read like every other product.
 *
 * Only splits at three or more segments. Two-segment strings are ranges and
 * pairs in this data — "1st - 46th Key", "USB - MIDI" — and splitting those
 * would destroy the value rather than clarify it.
 */
function splitRunOnString(text: string): string[] | null {
  if (!text.includes(' - ')) return null
  const parts = text.split(/ +- +/).map((p) => p.trim().replace(/,$/, '')).filter(Boolean)
  return parts.length >= 3 ? parts : null
}

/** Render one object inline, for arrays of objects: prefers `name (extra, extra)`. */
function formatInlineObject(obj: Record<string, unknown>): string {
  const name = typeof obj.name === 'string' ? obj.name : null
  const rest = Object.entries(obj)
    .filter(([k, v]) => k !== 'name' && v !== null && v !== undefined)
    .map(([k, v]) => {
      // A boolean here is a named flag — `{ name: 'Damper', half_pedal_support: true }`.
      // Rendering the value alone gives "Damper (Yes)", which says nothing; the key
      // IS the information, so emit the key and drop the entry when it's false.
      if (typeof v === 'boolean') return v ? humanizeKey(k).toLowerCase() : null
      if (isScalar(v)) return formatScalar(v)
      if (Array.isArray(v)) return formatList(v)
      return null
    })
    .filter((s): s is string => Boolean(s))
  if (name) return rest.length ? `${name} (${rest.join(', ')})` : name
  return rest.join(' — ')
}

/**
 * Join an array into one string. Always an explicit `, ` join — relying on
 * implicit Array→string coercion produced comma-run-together output
 * ("Concert,Jazz,Mellow") in ~100 rows.
 */
function formatList(arr: unknown[]): string {
  return arr
    .filter((v) => v !== null && v !== undefined)
    .map((v) => {
      if (isScalar(v)) return formatScalar(v)
      if (Array.isArray(v)) return formatList(v)
      return formatInlineObject(v as Record<string, unknown>)
    })
    .filter(Boolean)
    .join(', ')
}

/**
 * Collapse a unit pair into a single measurement so both units stay on one
 * line and keep their parent label. Without this, `{ inches, cm }` flattens to
 * two sibling lines named "Inches"/"Cm", and a Dimensions row ends up with
 * three identical "Inches" entries and no way to tell width from depth.
 */
function tryMeasurement(obj: Record<string, unknown>): string | null {
  const note = typeof obj.note === 'string' ? ` — ${obj.note}` : ''
  const keys = Object.keys(obj).filter((k) => k !== 'note' && obj[k] !== null && obj[k] !== undefined)
  const pair = (a: string, b: string) => keys.length === 2 && keys.includes(a) && keys.includes(b)
  const val = (k: string) => (isScalar(obj[k]) ? formatScalar(obj[k] as Scalar) : null)

  if (pair('inches', 'cm')) return `${val('inches')}" (${val('cm')} cm)${note}`
  if (pair('lbs', 'kg')) return `${val('lbs')} lbs (${val('kg')} kg)${note}`
  return null
}

/**
 * Flatten any value into "Breadcrumb — Label: value" lines.
 * `path` is the chain of humanized keys walked so far; an empty path means the
 * value sits directly under the row label, so the line is just the value.
 */
function flattenValue(value: unknown, path: string[]): string[] {
  if (value === null || value === undefined) return []

  const prefix = path.join(' — ')
  const line = (text: string) => (prefix ? `${prefix}: ${text}` : text)

  if (isScalar(value)) {
    const s = formatScalar(value)
    return s ? [line(s)] : []
  }

  if (Array.isArray(value)) {
    const s = formatList(value)
    return s ? [line(s)] : []
  }

  const obj = value as Record<string, unknown>

  const measurement = tryMeasurement(obj)
  if (measurement) return [line(measurement)]

  // Recurse, extending the breadcrumb. An object whose entries are all null
  // yields nothing at all — which is correct, and stops the raw
  // `{"record_playback":null}` JSON dump that used to reach the page.
  return Object.entries(obj).flatMap(([k, v]) => flattenValue(v, [...path, humanizeKey(k)]))
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
    .map((v) => formatInlineObject(v))
    .filter(Boolean)

  return {
    value: items[0] ?? '—',
    ...(items.length > 1 ? { subItems: items.slice(1) } : {}),
  }
}

function normalizeObjectValue(
  obj: Record<string, unknown>,
): { type?: string; value: string; subItems?: string[] } | null {

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
    if (allDetails.length > 0) {
      return {
        ...(name ? { type: name } : {}),
        value: allDetails[0] ?? '—',
        ...(allDetails.length > 1 ? { subItems: allDetails.slice(1) } : {}),
      }
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
    if (all.length > 0) {
      return {
        ...(name ? { type: name } : {}),
        value: all[0] ?? '—',
        ...(all.length > 1 ? { subItems: all.slice(1) } : {}),
      }
    }
  }

  // { version, details } (e.g., bluetooth) — checked before the bare { label }
  // and { count } shortcuts so a versioned block keeps its details.
  if (typeof obj.version === 'string' && Array.isArray(obj.details)) {
    const details = (obj.details as unknown[]).filter((d): d is string => typeof d === 'string')
    if (details.length > 0) {
      return {
        type: `Version ${obj.version}`,
        value: details[0] ?? '—',
        ...(details.length > 1 ? { subItems: details.slice(1) } : {}),
      }
    }
  }

  // { label } or { count, label }
  if (typeof obj.label === 'string') return { value: obj.label }
  if (typeof obj.count === 'number' && Object.keys(obj).length === 1) return { value: String(obj.count) }

  // { types: number }
  if (typeof obj.types === 'number') return { value: `${obj.types} types` }

  // A whole-value measurement, e.g. weight: { lbs, kg }
  const measurement = tryMeasurement(obj)
  if (measurement) return { value: measurement }

  // Anything else — recursive breadcrumb flatten. Returns null (row dropped)
  // when the object carries no renderable content.
  const lines = flattenValue(obj, [])
  if (lines.length === 0) return null
  return {
    value: lines[0] ?? '—',
    ...(lines.length > 1 ? { subItems: lines.slice(1) } : {}),
  }
}

/**
 * Parse a raw specification JSON object into renderable rows.
 * Null / undefined / empty values are silently skipped.
 */
export function parseSpecificationJson(
  json: Record<string, unknown>,
): ParsedSpecRow[] {
  const rows: ParsedSpecRow[] = []

  for (const [key, value] of Object.entries(json)) {
    const label = humanizeKey(key)

    if (value === null || value === undefined) continue

    if (isScalar(value)) {
      const v = formatScalar(value)
      if (!v) continue
      const parts = typeof value === 'string' ? splitRunOnString(v) : null
      if (parts) {
        rows.push({ label, value: parts[0] ?? v, subItems: parts.slice(1) })
      } else {
        rows.push({ label, value: v })
      }
      continue
    }

    if (Array.isArray(value)) {
      if (value.length === 0) continue
      const { value: v, subItems } = normalizeArrayValue(value)
      rows.push({ label, value: v, ...(subItems ? { subItems } : {}) })
      continue
    }

    if (typeof value === 'object') {
      const normalized = normalizeObjectValue(value as Record<string, unknown>)
      if (!normalized) continue
      const { type, value: v, subItems } = normalized
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
