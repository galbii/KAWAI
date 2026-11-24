import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, mock } from 'bun:test'

// The banner wraps its buttons in the holiday page's real StoreLeadProvider.
// As in lead-parity.test.ts, every server action behind the lead form is
// replaced before anything imports it, so nothing here can reach HubSpot,
// Shopify, Resend or a store inbox. Nothing is clicked or submitted anyway.
mock.module('@/lib/actions/notify-rsm-of-lead', () => ({ notifyRsmOfLead: async () => ({ ok: true }) }))
mock.module('@/app/(frontend)/store/[storeslug]/holiday-sale-event/notify-store-lead', () => ({
  notifyHolidayStoreLead: async () => ({ success: true }),
}))
mock.module('@/lib/actions/signup-lead-shopify', () => ({ upsertSignupLeadToShopify: async () => ({ ok: true }) }))
mock.module('@/lib/actions/nearby-dealers', () => ({ getNearestStorefrontForLead: async () => null }))
const { HolidaySaleBanner, holidaySaleHref } = await import('./HolidaySaleBanner')
import { renderToStaticMarkup } from 'react-dom/server'
import { holidayDaysUntilDeadline, HOLIDAY_BANNER_END } from './campaign'
import { HOLIDAY_STOREFRONT_FIXTURES } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/holiday-emails.fixtures'

const STORE_DIR = 'src/app/(frontend)/store/[storeslug]'
const STORES = ['dallas', 'houston', 'denver', 'st-louis'] as const
const before = new Date('2026-11-24T12:00:00')
const render = (props: Parameters<typeof HolidaySaleBanner>[0]) =>
  renderToStaticMarkup(<HolidaySaleBanner {...props} />)

describe('holiday sale banner: date window', () => {
  it('ends at December 31, 2026 23:59:59', () => {
    expect(HOLIDAY_BANNER_END).toBe('2026-12-31T23:59:59')
    expect(holidayDaysUntilDeadline(new Date('2026-12-31T23:59:58'))).toBe(1)
    expect(holidayDaysUntilDeadline(new Date('2026-12-31T23:59:59'))).toBe(0)
    expect(holidayDaysUntilDeadline(new Date('2027-01-01T00:00:00'))).toBe(0)
  })

  it('renders before the deadline and nothing after it', () => {
    expect(render({ storeslug: 'dallas', now: before })).toContain('data-banner="holiday-sale"')
    expect(render({ storeslug: 'dallas', now: new Date('2026-12-31T23:59:58') })).not.toBe('')
    expect(render({ storeslug: 'dallas', now: new Date('2027-01-01T00:00:00') })).toBe('')
  })
})

describe('holiday sale banner: content and CTA', () => {
  // Live showroomInfo, Nov 24, 2026 (holiday-emails.fixtures.ts).
  const tels = {
    dallas: 'tel:9723792200',
    houston: 'tel:7139040001',
    denver: 'tel:7207624938',
    'st-louis': 'tel:6367780477',
  } as const

  for (const slug of STORES) {
    it(`${slug}: 0% financing on every model, Request Inventory + Call Now on its own phone, link to its /holiday-sale-event`, () => {
      const html = render({ storeslug: slug, storefront: HOLIDAY_STOREFRONT_FIXTURES[slug] as never, now: before })
      const name = (HOLIDAY_STOREFRONT_FIXTURES[slug] as { showroomInfo: { name: string } }).showroomInfo.name
      expect(html).toContain('0% financing on every model')
      expect(html).toContain(`Kawai ${name} · Holiday Sale Event`)
      expect(html).toContain('data-cta="request-inventory"')
      expect(html).toContain('Request Inventory')
      expect(html).toContain('data-cta="call-now"')
      expect(html).toContain(`href="${tels[slug]}"`)
      expect(html).toContain('Call Now')
      expect(html.match(/href="tel:/g)?.length).toBe(1)
      expect(html).toContain(`href="/store/${slug}/holiday-sale-event"`)
      expect(html).not.toContain('holiday-sale-eventv1')
      expect(holidaySaleHref(slug)).toBe(`/store/${slug}/holiday-sale-event`)
    })
  }

  it('matches the event-page hero: cream field, display serif headline, red Request Inventory', () => {
    const html = render({ storeslug: 'dallas', storefront: HOLIDAY_STOREFRONT_FIXTURES.dallas as never, now: before })
    const section = html.slice(html.indexOf('<section'), html.indexOf('>', html.indexOf('<section')))
    expect(section).toContain('bg-kawai-pearl')
    expect(section).not.toContain('bg-kawai-black')
    const h2 = html.slice(html.indexOf('<h2'), html.indexOf('</h2>'))
    expect(h2).toContain('--font-holiday-display')
    expect(h2).toContain('font-weight:900')
    const request = html.slice(html.indexOf('data-cta="request-inventory"') - 200, html.indexOf('data-cta="request-inventory"') + 400)
    expect(request).toContain('bg-kawai-red')
    // The source uses the hero's own pair and the holiday page's lead form, no new form.
    const src = readFileSync('src/components/holiday-sale/HolidaySaleBanner.tsx', 'utf8')
    expect(src).toContain('<SaleCtaPair')
    expect(src).toContain('<StoreLeadProvider storeSlug={storeslug}')
    expect(src).not.toMatch(/<form|<input/)
    expect(src).not.toContain('RuledGround')
  })

  it('leaves Call Now out when the store has no phone', () => {
    const html = render({ storeslug: 'denver', storefront: { showroomInfo: { name: 'Denver' } }, now: before })
    expect(html).not.toContain('tel:')
    expect(html).not.toContain('data-cta="call-now"')
    expect(html).toContain('data-cta="request-inventory"')
  })

  it('carries no SH-9, rebates, lessons, rates or lender terms', () => {
    const html = render({ storeslug: 'houston', storefront: HOLIDAY_STOREFRONT_FIXTURES.houston as never, now: before })
      .replace(/<style>[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .toLowerCase()
    for (const banned of ['sh-9', 'sh9', 'rebate', 'lesson', 'synchrony', 'month', 'apr', '22.99', '$']) {
      expect(html).not.toContain(banned)
    }
  })
})

describe('holiday sale banner: placement', () => {
  const home = readFileSync(join(STORE_DIR, 'page.tsx'), 'utf8')

  it('is mounted on the store homepage under the news carousel hero, with BackToSchoolPromo kept', () => {
    const carousel = home.indexOf('<NewsCarousel ')
    const bts = home.indexOf('<BackToSchoolPromo')
    const banner = home.indexOf('<HolidaySaleBanner')
    const next = home.indexOf('<ShowroomLocation ')
    expect(carousel).toBeGreaterThan(-1)
    expect(bts).toBeGreaterThan(carousel)
    expect(banner).toBeGreaterThan(bts)
    expect(next).toBeGreaterThan(banner)
    // Nothing but the BTS promo between the hero and the banner.
    const between = home.slice(home.indexOf('/>', carousel) + 2, banner).replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    expect(between.match(/<[A-Z]\w*/g)).toEqual(['<BackToSchoolPromo'])
  })

  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f)
      return statSync(p).isDirectory() ? walk(p) : [p]
    })

  it('is not rendered by /holiday-sale-event or /holiday-sale-eventv1', () => {
    for (const route of ['holiday-sale-event', 'holiday-sale-eventv1']) {
      const dir = join(STORE_DIR, route)
      if (!existsSync(dir)) continue // the v1 backup lands with kawai-holiday-sale-rep-edits
      for (const file of walk(dir)) {
        expect(readFileSync(file, 'utf8')).not.toContain('HolidaySaleBanner')
      }
    }
  })

  it('is mounted nowhere else (not in the carousel, not on other store routes)', () => {
    const users = walk('src')
      .filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.includes('components/holiday-sale/'))
      .filter((f) => readFileSync(f, 'utf8').includes('HolidaySaleBanner'))
    expect(users).toEqual([join(STORE_DIR, 'page.tsx')])
  })
})
