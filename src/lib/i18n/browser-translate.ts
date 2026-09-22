/**
 * French via the browser's built-in on-device translator.
 *
 * Chrome 138+ / Edge 148+ expose a `Translator` global that runs a local
 * translation model — no network call, no vendor, no API key, no build step.
 * We walk the rendered DOM, hand it the English strings, and swap the results
 * back in. Firefox and Safari don't implement it; there the switcher hides.
 *
 * This is deliberately client-side only. Nothing is prerendered in French and
 * there are no /fr URLs, so there is no duplicate content for crawlers to
 * index — Google sees the English page, which is what we want.
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

type Snapshot =
  | { kind: 'text'; node: Text; original: string }
  | { kind: 'attr'; element: Element; attribute: string; original: string }

/** Original English, kept so switching back is instant and lossless. */
let snapshot: Snapshot[] = []

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

function collectTextNodes(): Text[] {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
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

function collectAttributes(): Array<{ element: Element; attribute: string; value: string }> {
  const selector = TEXT_ATTRIBUTES.map((a) => `[${a}]`).join(', ')
  const found: Array<{ element: Element; attribute: string; value: string }> = []

  for (const element of Array.from(document.body.querySelectorAll(selector))) {
    if (shouldSkip(element)) continue
    for (const attribute of TEXT_ATTRIBUTES) {
      const value = element.getAttribute(attribute)
      if (value && isTranslatableText(value)) found.push({ element, attribute, value })
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

/**
 * Translates the current page into French in place.
 *
 * Must be called from a user gesture — the browser requires user activation
 * before it will create a translator or download a language pack.
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
    const availability = await Translator.availability(config)
    if (availability === 'unavailable') {
      onStatus('unsupported')
      return
    }

    onStatus(availability === 'available' ? 'translating' : 'downloading', 0)

    const translator = await Translator.create({
      ...config,
      monitor(m) {
        m.addEventListener('downloadprogress', (event) => {
          const { loaded } = event as Event & { loaded: number }
          onStatus('downloading', Math.round(loaded * 100))
        })
      },
    })

    onStatus('translating', 0)

    // Snapshot before mutating so English can be restored exactly.
    const textNodes = collectTextNodes()
    const attributes = collectAttributes()
    snapshot = [
      ...textNodes.map((node) => ({ kind: 'text' as const, node, original: node.nodeValue ?? '' })),
      ...attributes.map((a) => ({
        kind: 'attr' as const,
        element: a.element,
        attribute: a.attribute,
        original: a.value,
      })),
    ]

    const total = snapshot.length
    let done = 0

    for (let i = 0; i < snapshot.length; i += BATCH_SIZE) {
      const batch = snapshot.slice(i, i + BATCH_SIZE)
      const translated = await translateBatch(
        translator,
        batch.map((entry) => entry.original),
      )

      batch.forEach((entry, index) => {
        const value = translated[index]
        if (value === undefined) return
        if (entry.kind === 'text') entry.node.nodeValue = value
        else entry.element.setAttribute(entry.attribute, value)
      })

      done += batch.length
      onStatus('translating', Math.round((done / total) * 100))
    }

    translator.destroy?.()
    document.documentElement.lang = 'fr'
    onStatus('translated', 100)
  } catch (error) {
    console.error('[browser-translate] failed:', error)
    onStatus('error')
  }
}

/** Puts the original English back. */
export function restoreEnglish(): void {
  for (const entry of snapshot) {
    if (entry.kind === 'text') entry.node.nodeValue = entry.original
    else entry.element.setAttribute(entry.attribute, entry.original)
  }
  snapshot = []
  document.documentElement.lang = 'en'
}
