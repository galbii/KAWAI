import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { HolidaySaleBanner, holidaySaleHref } from './HolidaySaleBanner'
import { holidayDaysUntilDeadline, HOLIDAY_BANNER_END } from './campaign'

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
  for (const slug of STORES) {
    it(`${slug}: 0% financing on every model, contact the store, CTA to its /holiday-sale-event`, () => {
      const html = render({ storeslug: slug, locationName: 'Kawai Piano Gallery', phone: '(214) 555-0100', now: before })
      expect(html).toContain('0% financing on every model')
      expect(html).toContain('Contact the store')
      expect(html).toContain('href="tel:2145550100"')
      expect(html).toContain(`href="/store/${slug}/holiday-sale-event"`)
      expect(html).not.toContain('holiday-sale-eventv1')
      expect(holidaySaleHref(slug)).toBe(`/store/${slug}/holiday-sale-event`)
    })
  }

  it('falls back to the store contact page when the store has no phone', () => {
    expect(render({ storeslug: 'denver', now: before })).toContain('href="/store/denver/contact"')
  })

  it('carries no SH-9, rebates, lessons, rates or lender terms', () => {
    // Visible copy only: the shared CampaignStyles sheet's comments mention the
    // BTS rebate modal, which is CSS, not banner content.
    const html = render({ storeslug: 'houston', phone: '7135550100', now: before })
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
