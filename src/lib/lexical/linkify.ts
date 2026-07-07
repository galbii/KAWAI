/**
 * Auto-linkify plain-text URLs and email addresses inside a Lexical editor state.
 *
 * Much of the FAQ content was authored with bare URLs / emails typed as plain
 * text (e.g. "https://kawaius.com/serial-number", "service@kawaius.com") rather
 * than as real Lexical link nodes. Those render as non-clickable text on the
 * frontend. This walks the tree and splits any plain `text` node containing a
 * URL or email into text + synthetic `link` nodes, so the standard
 * LinkJSXConverter renders them as anchors — no content migration required.
 *
 * Notes:
 * - Only untouched plain text is linkified (`format === 0`) so we never split a
 *   node that carries bold/italic/etc. formatting mid-run.
 * - Text already inside a `link` / `autolink` node is left alone (no recursion),
 *   so real authored links are never double-wrapped.
 * - Trailing sentence punctuation (.,;:!?) and a single unbalanced closing paren
 *   are trimmed off the match so "…/serial-number." doesn't link the period.
 */

// URL (http/https or bare www.) or email. Ordered so URLs win over emails.
const LINK_RE =
  /(https?:\/\/[^\s<]+|www\.[^\s<]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

type LexNode = {
  type?: string
  text?: string
  format?: number
  children?: LexNode[]
  [k: string]: unknown
}

function hrefFor(match: string): string {
  if (EMAIL_RE.test(match)) return `mailto:${match}`
  if (match.startsWith('www.')) return `https://${match}`
  return match
}

function makeLinkNode(match: string, template: LexNode): LexNode {
  const isEmail = EMAIL_RE.test(match)
  return {
    type: 'link',
    fields: {
      linkType: 'custom',
      url: hrefFor(match),
      // External web links open in a new tab; mailto stays in-page.
      newTab: !isEmail,
    },
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 3,
    children: [{ ...template, text: match }],
  }
}

function linkifyChildren(children: LexNode[]): LexNode[] {
  const out: LexNode[] = []

  for (const node of children) {
    // Never descend into existing links — preserves real authored anchors.
    if (node?.type === 'link' || node?.type === 'autolink') {
      out.push(node)
      continue
    }

    if (node?.type === 'text' && typeof node.text === 'string' && (node.format ?? 0) === 0) {
      const s = node.text
      const matches = [...s.matchAll(LINK_RE)]
      if (matches.length === 0) {
        out.push(node)
        continue
      }

      let last = 0
      for (const m of matches) {
        const idx = m.index ?? 0
        if (idx > last) out.push({ ...node, text: s.slice(last, idx) })

        let matched = m[0]
        let trailing = ''
        // Trim trailing sentence punctuation and an unbalanced ")".
        while (/[.,;:!?]$/.test(matched) || (matched.endsWith(')') && !matched.includes('('))) {
          trailing = matched.slice(-1) + trailing
          matched = matched.slice(0, -1)
        }

        if (matched) out.push(makeLinkNode(matched, node))
        if (trailing) out.push({ ...node, text: trailing })
        last = idx + m[0].length
      }
      if (last < s.length) out.push({ ...node, text: s.slice(last) })
      continue
    }

    if (node && Array.isArray(node.children)) {
      out.push({ ...node, children: linkifyChildren(node.children) })
      continue
    }

    out.push(node)
  }

  return out
}

/**
 * Return a deep-ish copy of a Lexical editor state with plain-text URLs/emails
 * converted to link nodes. Safe to call with null/undefined or malformed data.
 */
export function linkifyLexical<T extends { root?: LexNode } | null | undefined>(state: T): T {
  if (!state || typeof state !== 'object' || !state.root || !Array.isArray(state.root.children)) {
    return state
  }
  return {
    ...state,
    root: { ...state.root, children: linkifyChildren(state.root.children) },
  }
}
