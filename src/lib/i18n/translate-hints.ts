/**
 * Per-browser instructions for the native "translate this page" feature.
 *
 * Chromium desktop exposes a `Translator` global we can drive ourselves (see
 * browser-translate.ts). Everywhere else the browser can still translate this
 * page perfectly well, but no browser lets a page invoke its *native* translate
 * command — so the honest thing is to point at the control the visitor has.
 *
 * The steps differ per browser and getting them wrong is worse than saying
 * nothing, hence this explicit table rather than one generic "use your
 * browser's translate feature" line.
 *
 * Pure string-in/string-out so it can be unit tested without a DOM.
 */

/** Browsers we can give exact steps for. `unknown` gets a generic fallback. */
export type TranslateHintBrowser =
  | 'firefox'
  | 'firefox-ios'
  | 'safari'
  | 'safari-ios'
  | 'chromium'
  | 'chromium-android'
  | 'chromium-ios'
  | 'unknown'

export type TranslateHint = {
  browser: TranslateHintBrowser
  /** Short name for the heading, e.g. "Firefox". */
  label: string
  /** Ordered steps. Kept to two or three — any more and nobody reads it. */
  steps: string[]
  /**
   * False when the browser has no built-in page translation at all, in which
   * case `steps` tells the visitor where to go instead of what to tap.
   */
  hasNativeTranslation: boolean
}

const HINTS: Record<TranslateHintBrowser, Omit<TranslateHint, 'browser'>> = {
  firefox: {
    label: 'Firefox',
    steps: [
      'Right-click anywhere on the page',
      'Choose “Translate Page”',
      'Select French',
    ],
    hasNativeTranslation: true,
  },
  'firefox-ios': {
    // Firefox on iOS is a WebKit wrapper and does not expose Safari's
    // translation UI, so there is nothing to tap — redirect them instead.
    label: 'Firefox for iOS',
    steps: [
      'Firefox for iOS has no built-in translation',
      'Open this page in Safari, then tap “ᴀA” in the address bar',
      'Choose “Translate to French”',
    ],
    hasNativeTranslation: false,
  },
  safari: {
    label: 'Safari',
    steps: [
      'Click the translate icon at the right of the address bar',
      'Choose “Translate to French”',
    ],
    hasNativeTranslation: true,
  },
  'safari-ios': {
    label: 'Safari',
    steps: ['Tap “ᴀA” at the left of the address bar', 'Choose “Translate to French”'],
    hasNativeTranslation: true,
  },
  chromium: {
    label: 'your browser',
    steps: ['Right-click anywhere on the page', 'Choose “Translate to French”'],
    hasNativeTranslation: true,
  },
  'chromium-android': {
    label: 'your browser',
    steps: ['Open the ⋮ menu', 'Choose “Translate…”', 'Select French'],
    hasNativeTranslation: true,
  },
  'chromium-ios': {
    label: 'your browser',
    steps: ['Open the ⋯ menu', 'Choose “Translate…”', 'Select French'],
    hasNativeTranslation: true,
  },
  unknown: {
    label: 'your browser',
    steps: [
      'Open your browser’s menu, or right-click the page',
      'Look for “Translate”, then choose French',
    ],
    hasNativeTranslation: true,
  },
}

/**
 * Classifies a user-agent string.
 *
 * Order matters and is the usual UA-sniffing minefield: Edge claims to be
 * Chrome, Chrome claims to be Safari, and every iOS browser claims to be
 * Safari because they are all required to use WebKit. So iOS is checked first,
 * then the browsers that impersonate others are matched before their victims.
 */
export function detectTranslateHintBrowser(userAgent: string): TranslateHintBrowser {
  const ua = userAgent.toLowerCase()

  // iOS first: every browser here is WebKit and the UA is misleading.
  if (/iphone|ipad|ipod/.test(ua)) {
    if (ua.includes('fxios')) return 'firefox-ios'
    // CriOS = Chrome, EdgiOS = Edge, OPiOS/OPT = Opera.
    if (/crios|edgios|opios|opt\//.test(ua)) return 'chromium-ios'
    return 'safari-ios'
  }

  if (ua.includes('android')) {
    if (ua.includes('firefox')) return 'firefox'
    return 'chromium-android'
  }

  // Desktop. Firefox never pretends to be anything else.
  if (ua.includes('firefox')) return 'firefox'

  // Edge ("edg/"), Opera ("opr/") and Chrome all carry "chrome" AND "safari",
  // so real Safari is only what is left once every Chromium is excluded.
  if (/edg\/|opr\/|chrome|chromium/.test(ua)) return 'chromium'

  if (ua.includes('safari')) return 'safari'

  return 'unknown'
}

export function getTranslateHint(userAgent: string): TranslateHint {
  const browser = detectTranslateHintBrowser(userAgent)
  return { browser, ...HINTS[browser] }
}
