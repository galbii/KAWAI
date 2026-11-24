import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'bun:test'
import { lockupText } from '@/components/sale-template/Lockup'
import {
  bundle,
  financing,
  lessons,
  rebateCopyFor,
  CTA_LEAD_IN,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor } from '@/app/(frontend)/fall-financing/_components/slides'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import { fallFinancingSale as backup, CLOSE_BODY, HEADLINES } from './_content'
import { BACKUP_STORE_SALE_PATH } from './sale-path'

/**
 * kawai-holiday-sale-rep-edits v1 (Nov 23, 2026): the backup of the pre-edit
 * store holiday sale page at /store/<slug>/holiday-sale-eventv1 keeps every
 * section the reps asked to remove from the live page.
 */
describe('holiday-sale-eventv1: the backup keeps the pre-edit page', () => {
  it('lives at holiday-sale-eventv1, no hyphen before v1', () => {
    expect(BACKUP_STORE_SALE_PATH).toBe('holiday-sale-eventv1')
    expect(decodeURIComponent(new URL('.', import.meta.url).pathname)).toMatch(
      /\/store\/\[storeslug\]\/holiday-sale-eventv1\/$/,
    )
  })

  it('keeps the hero, exclusive-offers line, location band and close', () => {
    expect(lockupText(backup.hero.lockup)).toBe('Factory direct, Factory fresh.')
    expect(backup.hero.support).toBe('Exclusive offers until December 31, 2026')
    expect(backup.locationEyebrow).toBe('Factory-direct Kawai Pianos')
    expect(lockupText(backup.close.lockup)).toBe('Instrumental to the Holidays')
    expect(backup.close.body).toBe(CLOSE_BODY)
    expect(backup.cta).toEqual({ requestLabel: 'Request Inventory', leadIn: CTA_LEAD_IN })
  })

  it('keeps the three-card offer strip and its intro', () => {
    expect(backup.intro).toBe(heroOpenerFor('us').body ?? '')
    expect(backup.highlights.map((h) => h.label)).toEqual([
      OFFER_CHIPS.bundle,
      OFFER_CHIPS.financing,
      OFFER_CHIPS.rebates,
    ])
    expect(backup.highlights.map((h) => h.label)).toEqual(['SH-9 Bundle', 'Financing Options', 'Instant Rebates'])
  })

  it('keeps the SH-9, financing, rebate and lessons spreads in order', () => {
    expect(backup.promos.map((p) => p.id)).toEqual(['headphones', 'financing', 'rebates', 'lessons'])
    const byId = Object.fromEntries(backup.promos.map((p) => [p.id, p]))
    expect(byId.headphones?.heading).toEqual({ kind: 'text', text: bundle.heading })
    expect(byId.rebates?.heading).toEqual({ kind: 'text', text: rebateCopyFor('us').heading })
    expect(byId.lessons?.heading).toEqual({ kind: 'text', text: lessons.heading })
  })

  it('keeps the financing spread as it was: 0% line + the national dealer note', () => {
    const fin = backup.promos.find((p) => p.id === 'financing')
    expect(fin?.heading).toEqual({ kind: 'text', text: '0% financing on every model' })
    expect(fin?.note).toBe(financing.dealerNote)
    expect(fin?.note).toBe('Contact a dealer near you for pricing and inventory.')
    expect(JSON.stringify(backup)).not.toContain('St. Louis showroom')
  })

  it('keeps the Played, Sound and Soundtrack banners', () => {
    expect(backup.moments.map((m) => m.id)).toEqual(['played', 'sound', 'soundtrack'])
    expect(backup.moments.map((m) => m.lockup)).toEqual([HEADLINES.played, HEADLINES.sound, HEADLINES.soundtrack])
    expect(lockupText(HEADLINES.played)).toBe('Some gifts get unwrapped This one gets Played')
    expect(lockupText(HEADLINES.sound)).toBe('Your holidays have photos Give them a Sound')
    expect(lockupText(HEADLINES.soundtrack)).toBe('Make your soundtrack for the Holidays')
  })

  it('has none of the live page\'s new factory-boxed section', () => {
    expect(JSON.stringify(backup)).not.toMatch(/factory-boxed/i)
  })
})

describe('holiday-sale-eventv1: an archive URL, not a live or SEO target', () => {
  const root = new URL('../../../../../../', import.meta.url)
  const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
  const livePage = readFileSync(new URL('../holiday-sale-event/page.tsx', import.meta.url), 'utf8')
  const config = readFileSync(new URL('next.config.ts', root), 'utf8')
  const sitemap = readFileSync(new URL('src/app/sitemap.ts', root), 'utf8')

  it('uses the same US-only storefront lookup and lead provider as the live page', () => {
    expect(page).toMatch(/export const dynamic = 'force-dynamic'/)
    expect(page).toMatch(/if \(site !== 'us'\) notFound\(\)/)
    expect(page).toMatch(/getStorefrontBySlugDirect\(storeslug\)/)
    expect(page).toMatch(/if \(!storefront\) notFound\(\)/)
    expect(page).toMatch(/<StoreLeadProvider storeSlug=\{storeslug\}/)
  })

  it('is canonical to itself and not in the sitemap, redirects or the live canonical', () => {
    expect(page).toMatch(/\$\{BACKUP_STORE_SALE_PATH\}`/)
    expect(sitemap).not.toMatch(/holiday-sale-eventv1|BACKUP_STORE_SALE_PATH/)
    expect(config).not.toMatch(/holiday-sale-eventv1/)
    expect(livePage).not.toMatch(/holiday-sale-eventv1|BACKUP_STORE_SALE_PATH/)
  })
})
