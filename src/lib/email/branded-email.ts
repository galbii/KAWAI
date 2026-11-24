/**
 * The Kawai-branded email: one shell for any store's transactional email.
 *
 * A store email is the logo, a dark title band, the message, and a footer
 * that signs it with that store's own name and contact details, read from the
 * storefront record by slug. Every caller supplies only its words; the look,
 * the footer and the plain-text twin come from here, so two emails from the
 * same showroom never look like two different companies.
 *
 * Today only the /store/{slug}/holiday-sale-event emails use it (the customer
 * confirmation and the store notification). Other event forms still go
 * through the signup and RSM builders; moving one over is a matter of calling
 * `renderBrandedEmail` with its own content.
 *
 * Pure: no Payload, no Resend, no env, no `server-only`, so it is unit-tested
 * and rendered by the preview script without a database or a send.
 *
 * Email-client rules this follows on purpose:
 * - Tables and inline styles carry the layout. The one <style> block is a
 *   progressive enhancement (phone padding, full-bleed card); clients that
 *   strip it still get a readable 600px-max card.
 * - Web fonts are linked but every stack falls back to a system font, so
 *   Gmail and Outlook render Georgia / Helvetica instead.
 * - The logo is an absolute https URL with fixed width/height and alt text.
 */
import { escapeHtml } from '@/lib/rsm/lead-email'

export const KAWAI_SITE_URL = 'https://kawaius.com'

/** Kawai brand values, the same ones the site and the older lead emails use. */
export const BRAND = {
  ink: '#1E1B16',
  red: '#E11922',
  pearl: '#FAF8F5',
  line: '#DBDBDB',
  muted: '#6b7280',
  white: '#ffffff',
  serif: "'Crimson Text',Georgia,'Times New Roman',serif",
  sans: "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
} as const

/** The red Kawai wordmark, 320×64, shown at 140×28 so it is sharp on retina. */
export const KAWAI_LOGO = {
  path: '/images/logos/kawai-logo-red-3x.png',
  width: 140,
  height: 28,
  alt: 'KAWAI',
} as const

export function kawaiLogoUrl(siteUrl: string = KAWAI_SITE_URL): string {
  return `${siteUrl.replace(/\/+$/, '')}${KAWAI_LOGO.path}`
}

/* ------------------------------------------------------------------ *
 * The store's contact card, from its storefront record.
 * ------------------------------------------------------------------ */

export interface StoreContact {
  /** 'Kawai Dallas' — always present, even when the storefront lookup failed. */
  name: string
  address?: string | undefined
  phone?: string | undefined
  email?: string | undefined
  hours: Array<{ day: string; time: string }>
  directionsUrl?: string | undefined
  /** The store's page on the site. */
  pageUrl?: string | undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Read a storefront record (getStorefrontBySlugDirect) into the footer's
 * contact card. Anything missing is left out, never rendered as a blank row;
 * a null storefront (lookup failed, store inactive) still yields the name, so
 * the email always says which showroom it is from.
 *
 * `displayName` is the store's short name ('Dallas'); the card reads
 * 'Kawai Dallas'. The record's own locationName wins when it is set.
 */
export function storeContactFromStorefront(
  storefront: unknown,
  { displayName, pageUrl }: { displayName: string; pageUrl?: string | undefined },
): StoreContact {
  const record = isRecord(storefront) ? storefront : {}
  const showroom = isRecord(record.showroomInfo) ? record.showroomInfo : {}

  const short = str(record.locationName) || displayName
  const name = /^kawai\b/i.test(short) ? short : `Kawai ${short}`
  const address = str(showroom.address)
  const phone = str(showroom.phone)
  const email = str(showroom.email)

  const hours: StoreContact['hours'] = []
  if (Array.isArray(record.hours)) {
    for (const row of record.hours) {
      if (!isRecord(row)) continue
      const day = str(row.day)
      const time = str(row.time)
      if (day && time) hours.push({ day, time })
    }
  }

  return {
    name,
    ...(address ? { address } : {}),
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
    hours,
    ...(address
      ? { directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` }
      : {}),
    ...(pageUrl ? { pageUrl } : {}),
  }
}

/** tel: href from a display number: '(972) 379-2200' → 'tel:9723792200'. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/* ------------------------------------------------------------------ *
 * Content helpers: small HTML pieces in the brand, plus their text twin.
 * ------------------------------------------------------------------ */

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${BRAND.sans};font-size:15px;line-height:1.65;color:${BRAND.ink}">${html}</p>`
}

/** Red uppercase label over a section, as on the site. */
export function sectionLabel(text: string): string {
  return `<p style="margin:28px 0 10px;font-family:${BRAND.sans};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.red}">${escapeHtml(text)}</p>`
}

/** A bulletproof-enough button: a padded <a>, primary red or outlined ink. */
export function button(href: string, label: string, kind: 'primary' | 'secondary' = 'primary'): string {
  const look =
    kind === 'primary'
      ? `background:${BRAND.red};color:${BRAND.white};border:1px solid ${BRAND.red};`
      : `background:${BRAND.white};color:${BRAND.ink};border:1px solid ${BRAND.ink};`
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 10px 0;padding:11px 20px;border-radius:4px;font-family:${BRAND.sans};font-size:14px;font-weight:700;line-height:1.2;text-decoration:none;${look}">${escapeHtml(label)}</a>`
}

/** Label/value rows (lead details). Empty values are dropped. */
export function detailsTable(rows: Array<[string, string | undefined | null]>): string {
  const body = rows
    .filter((r): r is [string, string] => Boolean(r[1] && r[1].trim()))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;border-bottom:1px solid ${BRAND.line};font-family:${BRAND.sans};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.muted};white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;border-bottom:1px solid ${BRAND.line};font-family:${BRAND.sans};font-size:15px;color:${BRAND.ink};word-break:break-word">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${body}</table>`
}

/** A pearl callout with a red rule, for the one thing to do next. */
export function callout(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0 0;border-collapse:collapse"><tr><td style="border-left:3px solid ${BRAND.red};background:${BRAND.pearl};padding:14px 18px;font-family:${BRAND.sans};font-size:15px;line-height:1.6;color:${BRAND.ink}">${html}</td></tr></table>`
}

/** Text twin of detailsTable. */
export function detailsText(rows: Array<[string, string | undefined | null]>): string {
  return rows
    .filter((r): r is [string, string] => Boolean(r[1] && r[1].trim()))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}

/* ------------------------------------------------------------------ *
 * The shell.
 * ------------------------------------------------------------------ */

export interface BrandedEmailInput {
  /** <title> and the hidden inbox preview line. */
  subject: string
  preheader?: string | undefined
  /** Red label in the title band, e.g. the store name. */
  eyebrow: string
  /** Serif heading in the title band. */
  title: string
  /** Main content, already-escaped HTML built from the helpers above. */
  contentHtml: string
  /** The same content as plain text (no footer; the shell adds it). */
  contentText: string
  /** Whose email this is: rendered as the footer signature. */
  store: StoreContact
  /** Optional full-width notice above the logo (test copies). Raw HTML. */
  noticeHtml?: string | undefined
  noticeText?: string | undefined
  /** Small print under the footer (why you got this). Plain text. */
  finePrint?: string | undefined
  siteUrl?: string | undefined
}

export interface RenderedEmail {
  html: string
  text: string
}

function footerHtml(store: StoreContact): string {
  const line = (html: string) =>
    `<p style="margin:4px 0 0;font-family:${BRAND.sans};font-size:13px;line-height:1.55;color:#d6d3cf">${html}</p>`
  const link = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="color:${BRAND.white};text-decoration:underline">${escapeHtml(label)}</a>`

  const parts = [
    store.address ? `<address style="margin:6px 0 0;font-family:${BRAND.sans};font-size:13px;line-height:1.55;font-style:normal;color:#d6d3cf">${escapeHtml(store.address)}</address>` : '',
    store.phone ? line(link(telHref(store.phone), store.phone)) : '',
    store.email ? line(link(`mailto:${store.email}`, store.email)) : '',
  ].join('')

  const hours = store.hours.length
    ? `<p style="margin:14px 0 4px;font-family:${BRAND.sans};font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.red}">Showroom hours</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${store.hours
        .map(
          (h) =>
            `<tr><td style="padding:1px 14px 1px 0;font-family:${BRAND.sans};font-size:12px;color:#a8a29e;white-space:nowrap;vertical-align:top">${escapeHtml(h.day)}</td><td style="padding:1px 0;font-family:${BRAND.sans};font-size:12px;color:#d6d3cf">${escapeHtml(h.time)}</td></tr>`,
        )
        .join('')}</table>`
    : ''

  const links = [
    store.directionsUrl ? link(store.directionsUrl, 'Get directions') : '',
    store.pageUrl ? link(store.pageUrl, 'Visit the showroom online') : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')

  return `<p style="margin:0;font-family:${BRAND.serif};font-size:20px;font-weight:600;line-height:1.3;color:${BRAND.white}">${escapeHtml(store.name)}</p>
${parts}
${hours}
${links ? `<p style="margin:14px 0 0;font-family:${BRAND.sans};font-size:13px;line-height:1.55;color:${BRAND.white}">${links}</p>` : ''}`
}

function footerText(store: StoreContact): string {
  const lines = [store.name]
  if (store.address) lines.push(store.address)
  if (store.phone) lines.push(`Phone: ${store.phone}`)
  if (store.email) lines.push(`Email: ${store.email}`)
  if (store.hours.length) {
    lines.push('', 'Showroom hours:')
    for (const h of store.hours) lines.push(`  ${h.day}: ${h.time}`)
  }
  if (store.directionsUrl) lines.push('', `Directions: ${store.directionsUrl}`)
  if (store.pageUrl) lines.push(`Online: ${store.pageUrl}`)
  return lines.join('\n')
}

/** The branded email, HTML and plain text, from one set of inputs. */
export function renderBrandedEmail(input: BrandedEmailInput): RenderedEmail {
  const site = (input.siteUrl ?? KAWAI_SITE_URL).replace(/\/+$/, '')
  const pad = 'padding-left:40px;padding-right:40px'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(input.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@600&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet">
<style>
  @media only screen and (max-width:620px) {
    .k-outer { padding:0 !important; }
    .k-card { width:100% !important; border-radius:0 !important; border-left:0 !important; border-right:0 !important; }
    .k-pad { padding-left:22px !important; padding-right:22px !important; }
    .k-title { font-size:25px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.pearl};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(input.preheader ?? '')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:${BRAND.pearl}">
<tr><td class="k-outer" align="center" style="padding:32px 12px">
<table role="presentation" class="k-card" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${BRAND.white};border:1px solid ${BRAND.line};border-radius:8px;overflow:hidden;border-collapse:separate">
${input.noticeHtml ? `<tr><td style="padding:0">${input.noticeHtml}</td></tr>` : ''}
<tr><td class="k-pad" style="${pad};padding-top:26px;padding-bottom:22px;background:${BRAND.white};border-bottom:3px solid ${BRAND.red}">
  <a href="${escapeHtml(site)}" style="text-decoration:none"><img src="${escapeHtml(kawaiLogoUrl(site))}" width="${KAWAI_LOGO.width}" height="${KAWAI_LOGO.height}" alt="${KAWAI_LOGO.alt}" style="display:block;border:0;outline:none;width:${KAWAI_LOGO.width}px;height:${KAWAI_LOGO.height}px;font-family:${BRAND.sans};font-size:20px;font-weight:700;letter-spacing:0.2em;color:${BRAND.red}"></a>
</td></tr>
<tr><td class="k-pad" style="${pad};padding-top:28px;padding-bottom:28px;background:${BRAND.ink}">
  <p style="margin:0;font-family:${BRAND.sans};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.red}">${escapeHtml(input.eyebrow)}</p>
  <h1 class="k-title" style="margin:8px 0 0;font-family:${BRAND.serif};font-size:30px;font-weight:600;line-height:1.2;color:${BRAND.white}">${escapeHtml(input.title)}</h1>
</td></tr>
<tr><td class="k-pad" style="${pad};padding-top:32px;padding-bottom:28px">
${input.contentHtml}
</td></tr>
<tr><td class="k-pad" style="${pad};padding-top:28px;padding-bottom:28px;background:${BRAND.ink}">
${footerHtml(input.store)}
</td></tr>
</table>
<p style="margin:18px 0 0;max-width:560px;font-family:${BRAND.sans};font-size:11px;line-height:1.6;color:${BRAND.muted};text-align:center">${input.finePrint ? `${escapeHtml(input.finePrint)}<br>` : ''}Kawai America Corporation &middot; <a href="${escapeHtml(site)}" style="color:${BRAND.muted}">${escapeHtml(site.replace(/^https?:\/\//, ''))}</a></p>
</td></tr>
</table>
</body>
</html>`

  const rule = '—'.repeat(32)
  const text = [
    input.noticeText ? `${input.noticeText}\n${rule}\n` : '',
    'KAWAI',
    `${input.eyebrow.toUpperCase()}`,
    input.title,
    rule,
    '',
    input.contentText.trim(),
    '',
    rule,
    footerText(input.store),
    rule,
    input.finePrint ?? '',
    `Kawai America Corporation · ${site.replace(/^https?:\/\//, '')}`,
  ]
    .filter((l, i, all) => !(l === '' && all[i - 1] === ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { html, text: `${text}\n` }
}
