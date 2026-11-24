/**
 * Render the holiday-sale-event emails to files for review. NEVER SENDS.
 *
 *   bun scripts/preview-holiday-emails.ts [outDir]
 *
 * Writes, for each holiday store (dallas, houston, denver, st-louis):
 *   <slug>-confirmation.html / .txt   the customer's confirmation
 *   <slug>-store-notification.html / .txt   the store inbox's lead email
 * plus index.html linking them all.
 *
 * Uses the same pure builders the server action sends with, fed by the
 * storefront fixtures (holiday-emails.fixtures.ts) and a sample lead. It
 * imports no Resend client, no Payload and no env, so it cannot send or
 * write anywhere but outDir.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { storeContactFromStorefront } from '@/lib/email/branded-email'
import {
  buildHolidayConfirmationEmail,
  buildHolidayStoreNotificationEmail,
} from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/holiday-emails'
import { HOLIDAY_STOREFRONT_FIXTURES } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/holiday-emails.fixtures'
import { HOLIDAY_STORES } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/store-inbox'
import { STORE_SALE_PATH } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/sale-path'

const outDir = resolve(process.argv[2] ?? 'holiday-email-previews')
mkdirSync(outDir, { recursive: true })

const SAMPLE_LEAD = {
  firstname: 'Jordan',
  lastname: 'Sample',
  email: 'jordan.sample@example.invalid',
  phone: '(555) 010-0199',
  zip: '75201',
  piano_type: 'Grand;Digital',
  when_are_you_looking_to_purchase_: 'Within_3_months',
}

const rows: string[] = []
for (const slug of Object.keys(HOLIDAY_STORES) as Array<keyof typeof HOLIDAY_STORES>) {
  const store = HOLIDAY_STORES[slug]
  const contact = storeContactFromStorefront(HOLIDAY_STOREFRONT_FIXTURES[slug], {
    displayName: store.name,
    pageUrl: `https://kawaius.com/store/${slug}/${STORE_SALE_PATH}`,
  })
  const emails = {
    confirmation: buildHolidayConfirmationEmail({ firstName: SAMPLE_LEAD.firstname, store, contact }),
    'store-notification': buildHolidayStoreNotificationEmail({ lead: SAMPLE_LEAD, contact, source: 'fall-financing' }),
  }
  for (const [kind, email] of Object.entries(emails)) {
    const base = `${slug}-${kind}`
    writeFileSync(join(outDir, `${base}.html`), email.html)
    writeFileSync(join(outDir, `${base}.txt`), `Subject: ${email.subject}\n\n${email.text}`)
    rows.push(
      `<tr><td>${slug}</td><td>${kind}</td><td>${email.subject.replace(/</g, '&lt;')}</td><td><a href="${base}.html">HTML</a> · <a href="${base}.txt">text</a></td></tr>`,
    )
    console.log(`wrote ${base}.html / .txt — "${email.subject}"`)
  }
}

writeFileSync(
  join(outDir, 'index.html'),
  `<!DOCTYPE html><meta charset="utf-8"><title>Holiday email previews</title>
<style>body{font-family:system-ui;margin:32px}td,th{padding:6px 12px;border-bottom:1px solid #ddd;text-align:left}</style>
<h1>Holiday Sale Event emails — previews (not sent)</h1>
<table><tr><th>Store</th><th>Email</th><th>Subject</th><th>Files</th></tr>${rows.join('')}</table>`,
)
console.log(`index: ${join(outDir, 'index.html')}`)
