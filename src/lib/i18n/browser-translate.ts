/**
 * French via the browser's built-in on-device translator.
 *
 * Chrome 138+ / Edge 148+ expose a `Translator` global that runs a local
 * translation model — no network call, no vendor, no API key, no build step.
 * We walk the rendered DOM, hand it the English strings, and swap the results
 * back in. Switching back restores the original English exactly, from a
 * snapshot taken before the first write.
 *
 * Firefox, Safari, and every mobile browser don't implement it, and no browser
 * lets a page invoke its *native* translate command — that's a deliberate
 * security boundary. There the switcher shows the visitor how to use their own
 * browser's translate instead (see translate-hints.ts).
 *
 * This is deliberately client-side only. Nothing is prerendered in French and
 * there are no /fr URLs, so there is no duplicate content for crawlers to
 * index — Google sees the English page, which is what we want.
 *
 * Note: this is a convenience, not Quebec Bill 96 compliance. See i18n/flags.ts.
 *
 * https://developer.chrome.com/docs/ai/translator-api
 */

export type TranslateStatus =
  | 'unsupported'
  | 'idle'
  | 'downloading'
  | 'translating'
  | 'translated'
  | 'error'

/** Elements whose text must never be touched. */
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'SVG'])

/** Attributes that carry user-visible text — kept in sync with the body copy. */
const TEXT_ATTRIBUTES = ['aria-label', 'placeholder', 'title', 'alt'] as const

/**
 * Nodes per translate() call. The API processes requests sequentially, so
 * batching is what makes a full page finish in seconds rather than minutes.
 */
const BATCH_SIZE = 40

/**
 * How long to wait after a DOM change before re-translating it.
 *
 * Carousels and framer-motion transitions fire mutations continuously while
 * animating; without a debounce we'd queue a translate call per frame.
 */
const RETRANSLATE_DEBOUNCE_MS = 300

type Snapshot =
  | { kind: 'text'; node: Text; original: string }
  | { kind: 'attr'; element: Element; attribute: string; original: string }

/** Original English, kept so switching back is instant and lossless. */
let snapshot: Snapshot[] = []

/**
 * The live translator.
 *
 * Kept alive rather than destroyed after the first pass, because
 * `Translator.create()` requires user activation — and neither a
 * MutationObserver callback nor a client-side route change has any. Destroying
 * it would make every re-translation after the initial click fail.
 */
let activeTranslator: TranslatorInstance | null = null

/** Null whenever French is off. Non-null means we're watching for re-renders. */
let observer: MutationObserver | null = null

/**
 * What we last wrote into each node — and the only reliable way to tell our
 * own writes apart from React's.
 *
 * A synchronous "I am applying right now" flag does NOT work here:
 * MutationObserver delivers its callback as a microtask, long after any such
 * flag has been reset, so every one of our writes comes back to us anyway.
 * Comparing against what we last wrote is what actually filters them out, and
 * it doubles as the check that stops us re-feeding French to an en→fr model.
 */
const lastWrittenText = new WeakMap<Text, string>()
const lastWrittenAttr = new WeakMap<Element, Record<string, string>>()

/** Nodes seen changing since the last flush. */
let pendingText = new Set<Text>()
let pendingAttr = new Map<Element, Set<string>>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

type TranslatorInstance = {
  translate: (text: string) => Promise<string>
  destroy?: () => void
}

type TranslatorGlobal = {
  availability: (config: {
    sourceLanguage: string
    targetLanguage: string
  }) => Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>
  create: (config: {
    sourceLanguage: string
    targetLanguage: string
    monitor?: (m: EventTarget) => void
  }) => Promise<TranslatorInstance>
}

function getTranslatorGlobal(): TranslatorGlobal | null {
  if (typeof self === 'undefined' || !('Translator' in self)) return null
  return (self as unknown as { Translator: TranslatorGlobal }).Translator
}

export function isBrowserTranslateSupported(): boolean {
  return getTranslatorGlobal() !== null
}

/** Currency markers that indicate a string carries a price. */
const CURRENCY = /[$€£¥₩₹]|\b(?:CAD|USD|EUR|GBP)\b/

/**
 * Whether a string is worth handing to the translator.
 *
 * Prices are excluded outright: the model is free to reformat numbers or move
 * a currency symbol, and a wrong price on a retail page is far worse than an
 * untranslated one. Strings with no letters have nothing to translate anyway.
 */
export function isTranslatableText(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 2) return false
  if (CURRENCY.test(trimmed)) return false
  // Needs a run of three letters to be a word rather than a product code:
  // "GX-7" and "SK-EX" stay as they are, "The GX-7 grand piano" translates.
  return /\p{L}{3,}/u.test(trimmed)
}

function shouldSkip(element: Element | null): boolean {
  if (!element) return true
  if (SKIP_TAGS.has(element.tagName.toUpperCase())) return true
  // Honour the standard opt-out, plus our own escape hatch for brand names.
  return element.closest('[translate="no"], [data-no-translate]') !== null
}

/** Collects translatable text nodes inside `root` (inclusive). */
function collectTextNodes(root: Node): Text[] {
  if (root.nodeType === Node.TEXT_NODE) {
    const text = root as Text
    return !shouldSkip(text.parentElement) && isTranslatableText(text.nodeValue ?? '')
      ? [text]
      : []
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return []

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT
      return isTranslatableText(node.nodeValue ?? '')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    },
  })

  const nodes: Text[] = []
  let current = walker.nextNode()
  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }
  return nodes
}

type AttrHit = { element: Element; attribute: string; value: string }

/** Collects translatable text-bearing attributes inside `root` (inclusive). */
function collectAttributes(root: Node): AttrHit[] {
  if (root.nodeType !== Node.ELEMENT_NODE) return []
  const element = root as Element
  const selector = TEXT_ATTRIBUTES.map((a) => `[${a}]`).join(', ')

  const candidates = [
    ...(element.matches(selector) ? [element] : []),
    ...Array.from(element.querySelectorAll(selector)),
  ]

  const found: AttrHit[] = []
  for (const candidate of candidates) {
    if (shouldSkip(candidate)) continue
    for (const attribute of TEXT_ATTRIBUTES) {
      const value = candidate.getAttribute(attribute)
      if (value && isTranslatableText(value)) found.push({ element: candidate, attribute, value })
    }
  }
  return found
}

/**
 * Translates a batch in one call by joining with newlines, which the model
 * preserves. If the line count comes back wrong the batch is retried one
 * string at a time, so a mismatch costs speed rather than correctness.
 */
async function translateBatch(
  translator: TranslatorInstance,
  strings: string[],
): Promise<string[]> {
  if (strings.length === 1) return [await translator.translate(strings[0]!)]

  const joined = strings.join('\n')
  const result = await translator.translate(joined)
  const lines = result.split('\n')

  if (lines.length === strings.length) return lines

  const individual: string[] = []
  for (const string of strings) individual.push(await translator.translate(string))
  return individual
}

/** Writes a translated value, recording it so we don't mistake it for English later. */
function applyEntry(entry: Snapshot, value: string): void {
  if (entry.kind === 'text') {
    entry.node.nodeValue = value
    lastWrittenText.set(entry.node, value)
  } else {
    entry.element.setAttribute(entry.attribute, value)
    const record = lastWrittenAttr.get(entry.element) ?? {}
    record[entry.attribute] = value
    lastWrittenAttr.set(entry.element, record)
  }
}

/**
 * Translates a set of entries, appending them to the snapshot so English can
 * still be restored. `onProgress` is optional — incremental passes run silently
 * so the switcher doesn't flicker back to a percentage mid-browse.
 */
async function translateEntries(
  translator: TranslatorInstance,
  entries: Snapshot[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  snapshot.push(...entries)

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    const translated = await translateBatch(
      translator,
      batch.map((entry) => entry.original),
    )

    batch.forEach((entry, index) => {
      const value = translated[index]
      if (value !== undefined) applyEntry(entry, value)
    })

    onProgress?.(Math.min(i + BATCH_SIZE, entries.length), entries.length)
  }
}

// ---------------------------------------------------------------------------
// Re-translating what React re-renders
//
// React owns these text nodes. Any component that remounts or renders new text
// — carousels, AnimatePresence dropdowns, the framer-motion header — puts
// English back. Without this observer those regions silently revert while the
// switcher still says FR.
// ---------------------------------------------------------------------------

function queueFlush(): void {
  if (flushTimer !== null) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => {
    flushTimer = null
    void flushPending()
  }, RETRANSLATE_DEBOUNCE_MS)
}

async function flushPending(): Promise<void> {
  const translator = activeTranslator
  if (!translator) return

  const textNodes = [...pendingText]
  const attrs = pendingAttr
  pendingText = new Set()
  pendingAttr = new Map()

  const entries: Snapshot[] = []

  for (const node of textNodes) {
    // Dropped from the document between the mutation and this flush.
    if (!node.isConnected) continue
    const value = node.nodeValue ?? ''
    // Already ours — React re-rendered around it without changing the text.
    if (lastWrittenText.get(node) === value) continue
    if (!isTranslatableText(value) || shouldSkip(node.parentElement)) continue
    entries.push({ kind: 'text', node, original: value })
  }

  for (const [element, attributes] of attrs) {
    if (!element.isConnected || shouldSkip(element)) continue
    for (const attribute of attributes) {
      const value = element.getAttribute(attribute)
      if (!value || !isTranslatableText(value)) continue
      if (lastWrittenAttr.get(element)?.[attribute] === value) continue
      entries.push({ kind: 'attr', element, attribute, original: value })
    }
  }

  if (entries.length === 0) return

  try {
    await translateEntries(translator, entries)
  } catch (error) {
    // A failed incremental pass leaves that region in English, which is a
    // cosmetic problem — never tear down the whole page over it.
    console.error('[browser-translate] incremental pass failed:', error)
  }
}

function startObserving(): void {
  if (observer !== null) return

  // Our own writes come back through here too; flushPending() discards them by
  // comparing against lastWritten*, so the loop always terminates.
  observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') {
        if (record.target.nodeType === Node.TEXT_NODE) pendingText.add(record.target as Text)
        continue
      }

      if (record.type === 'attributes' && record.attributeName) {
        const element = record.target as Element
        const set = pendingAttr.get(element) ?? new Set<string>()
        set.add(record.attributeName)
        pendingAttr.set(element, set)
        continue
      }

      for (const added of record.addedNodes) {
        for (const node of collectTextNodes(added)) pendingText.add(node)
        for (const hit of collectAttributes(added)) {
          const set = pendingAttr.get(hit.element) ?? new Set<string>()
          set.add(hit.attribute)
          pendingAttr.set(hit.element, set)
        }
      }
    }

    if (pendingText.size > 0 || pendingAttr.size > 0) queueFlush()
  })

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TEXT_ATTRIBUTES],
  })
}

function stopObserving(): void {
  observer?.disconnect()
  observer = null
  if (flushTimer !== null) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  pendingText = new Set()
  pendingAttr = new Map()
}

/**
 * Translates the current page into French in place.
 *
 * The first call must come from a user gesture — the browser requires user
 * activation before it will create a translator or download a language pack.
 * Later calls (client-side navigation) reuse the instance created then, which
 * is why it is never destroyed until the visitor switches back to English.
 */
export async function translatePageToFrench(
  onStatus: (status: TranslateStatus, progress?: number) => void,
): Promise<void> {
  const Translator = getTranslatorGlobal()
  if (!Translator) {
    onStatus('unsupported')
    return
  }

  const config = { sourceLanguage: 'en', targetLanguage: 'fr' }

  try {
    if (!activeTranslator) {
      const availability = await Translator.availability(config)
      if (availability === 'unavailable') {
        onStatus('unsupported')
        return
      }

      onStatus(availability === 'available' ? 'translating' : 'downloading', 0)

      activeTranslator = await Translator.create({
        ...config,
        monitor(m) {
          m.addEventListener('downloadprogress', (event) => {
            const { loaded } = event as Event & { loaded: number }
            onStatus('downloading', Math.round(loaded * 100))
          })
        },
      })
    }

    onStatus('translating', 0)

    // A second call means client-side navigation. Pause the observer so it
    // isn't fighting the bulk rewrite, and drop snapshot entries for nodes the
    // previous page took with it — otherwise it grows on every navigation.
    stopObserving()
    snapshot = snapshot.filter((entry) =>
      entry.kind === 'text' ? entry.node.isConnected : entry.element.isConnected,
    )

    // Snapshot before mutating so English can be restored exactly. Anything
    // already carrying our French is skipped: persistent chrome like the header
    // survives navigation, and re-feeding French to an en→fr model mangles it.
    const entries: Snapshot[] = [
      ...collectTextNodes(document.body)
        .filter((node) => lastWrittenText.get(node) !== node.nodeValue)
        .map((node) => ({
          kind: 'text' as const,
          node,
          original: node.nodeValue ?? '',
        })),
      ...collectAttributes(document.body)
        .filter((a) => lastWrittenAttr.get(a.element)?.[a.attribute] !== a.value)
        .map((a) => ({
          kind: 'attr' as const,
          element: a.element,
          attribute: a.attribute,
          original: a.value,
        })),
    ]

    await translateEntries(activeTranslator, entries, (done, total) =>
      onStatus('translating', Math.round((done / total) * 100)),
    )

    document.documentElement.lang = 'fr'
    // Only start watching once the bulk pass is done, so the observer isn't
    // fighting the initial rewrite.
    startObserving()
    onStatus('translated', 100)
  } catch (error) {
    console.error('[browser-translate] failed:', error)
    onStatus('error')
  }
}

/** Puts the original English back and stops watching for changes. */
export function restoreEnglish(): void {
  stopObserving()

  for (const entry of snapshot) {
    if (entry.kind === 'text') {
      if (entry.node.isConnected) entry.node.nodeValue = entry.original
    } else if (entry.element.isConnected) {
      entry.element.setAttribute(entry.attribute, entry.original)
    }
  }
  snapshot = []

  // lastWritten* deliberately keeps its French values. Switching back to
  // French then compares the node's *restored English* against that French and
  // sees a difference, so the node is re-translated rather than skipped as
  // "already ours" — which is what makes EN → FR → EN → FR round-trip.
  activeTranslator?.destroy?.()
  activeTranslator = null

  document.documentElement.lang = 'en'
}
