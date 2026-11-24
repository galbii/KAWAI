import { readFileSync } from 'node:fs'
import { describe, expect, it, mock } from 'bun:test'

/**
 * The national /holiday-sale-event page (kawai-holiday-sale-national v1,
 * Nov 24, 2026).
 *
 * Mocks only. Nothing here reaches HubSpot, Shopify, Resend or the RSM email:
 * every server action the lead path can touch is replaced before anything
 * imports it.
 */

const rsmCalls: Array<{ data: unknown; source: string }> = []
mock.module('@/lib/actions/notify-rsm-of-lead', () => ({
  notifyRsmOfLead: async (data: unknown, source: string) => {
    rsmCalls.push({ data, source })
    return { ok: true }
  },
}))
mock.module('@/lib/actions/signup-lead-shopify', () => ({
  upsertSignupLeadToShopify: async () => ({ ok: true }),
}))
mock.module('@/lib/actions/nearby-dealers', () => ({
  getNearestStorefrontForLead: async () => null,
}))

const { createElement } = await import('react')
const { renderToStaticMarkup, renderToString } = await import('react-dom/server')
const { LeadCampaignProvider, useLeadCampaign } = await import('@/components/campaign-lead')
const { SaleTemplate, toSaleStore, lockupText } = await import('@/components/sale-template')
const { leadCampaign } = await import('@/app/(frontend)/fall-financing/_components/lead-campaign')
const campaign = await import('@/app/(frontend)/fall-financing/_components/campaign')
const { holidayLeadCampaign } = await import('./lead')
const { holidaySaleFor, HOLIDAY_META, CLOSE_BODY, SALE_EVENT } = await import('./_content')
const { HOLIDAY_SALE_PATH } = await import('./sale-path')

const us = holidaySaleFor('us')
const ca = holidaySaleFor('cad')
const LEAD = { firstname: 'Test', lastname: 'Lead', email: 't@example.invalid', phone: '5555550100', zip: '75201' }

const src = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')
/** Visitor-facing words only: image URLs and CSS positions ("20% center") are dropped. */
const words = (v: unknown) =>
  JSON.stringify(v, (k, val) => (k === 'src' || k === 'position' || k === 'href' ? undefined : val))
const all = (site: 'us' | 'cad') => words([holidaySaleFor(site), HOLIDAY_META[site]])

/** Render the template the way page.tsx does, inside the national lead provider. */
const render = (content: ReturnType<typeof holidaySaleFor>, store?: ReturnType<typeof toSaleStore>) =>
  renderToStaticMarkup(
    createElement(LeadCampaignProvider, {
      config: holidayLeadCampaign,
      children: createElement(SaleTemplate, store ? { content, store } : { content }),
    }),
  )
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ')

describe('offers per site', () => {
  it('US: headphones, financing, rebates, lessons', () => {
    expect(us.promos.map((p) => p.id)).toEqual(['headphones', 'financing', 'rebates', 'lessons'])
    expect(us.highlights.map((h) => h.href)).toEqual(['#headphones', '#financing', '#rebates'])
    expect(us.highlights.map((h) => h.label)).toEqual(['SH-9 Bundle', 'Financing Options', 'Instant Rebates'])
  })

  it('CA: headphones, acoustic rebate, rebates, lessons', () => {
    expect(ca.promos.map((p) => p.id)).toEqual(['headphones', 'acoustic-rebates', 'rebates', 'lessons'])
    expect(ca.highlights.map((h) => h.href)).toEqual(['#headphones', '#acoustic-rebates'])
    expect(ca.highlights.map((h) => h.label)).toEqual(['SH-9 Bundle', 'Instant Rebates'])
  })

  it('CA amounts are CAD with the Canadian disclaimer', () => {
    const acoustic = ca.promos.find((p) => p.id === 'acoustic-rebates')!
    expect(acoustic.rows?.map((r) => r.value)).toEqual(
      campaign.acousticRebates.map((r) => `Save $${r.cad.toLocaleString('en-US')} CAD`),
    )
    expect(acoustic.fineprint).toEqual([campaign.acousticRebate.disclaimer])
    const es = ca.promos.find((p) => p.id === 'rebates')!
    expect(es.rows?.every((r) => r.value.endsWith(' CAD'))).toBe(true)
    expect(es.heading).toEqual({ kind: 'text', text: campaign.rebateCopyFor('cad').heading })
    expect(es.fineprint).toEqual([campaign.rebateCopyFor('cad').disclaimer])
    const usEs = us.promos.find((p) => p.id === 'rebates')!
    expect(usEs.rows?.some((r) => r.value.includes('CAD'))).toBe(false)
    expect(all('us')).not.toContain('acoustic-rebates')
  })

  it('every index card points at a section on that site', () => {
    for (const c of [us, ca]) {
      const ids = new Set(c.promos.map((p) => `#${p.id}`))
      for (const h of c.highlights) expect(ids.has(h.href)).toBe(true)
    }
  })
})

describe('no store anywhere', () => {
  it('carries no store placeholder, showroom line or location band label', () => {
    for (const site of ['us', 'cad'] as const) {
      const s = all(site)
      expect(s).not.toContain('{location}')
      expect(s).not.toMatch(/showroom at|Contact the store|Factory-direct/i)
      expect(holidaySaleFor(site).locationEyebrow).toBeUndefined()
      expect(holidaySaleFor(site).promos.some((p) => p.storeContact)).toBe(false)
    }
  })

  it('closes on the nearest Authorized Kawai dealer, then the national coda', () => {
    expect(CLOSE_BODY).toBe(
      'Contact your nearest Authorized Kawai dealer for pricing and inventory. They will confirm which offers apply to the piano you want.',
    )
    expect(us.close.body).toBe(CLOSE_BODY)
    expect(ca.close.body).toBe(CLOSE_BODY)
  })

  it('imports nothing from the frozen v1 folder or the store lead notifier', () => {
    for (const f of ['_content.ts', 'lead.ts', 'HolidayLeadProvider.tsx', 'page.tsx']) {
      const s = src(`./${f}`)
      const imports = s.split('\n').filter((l) => /^import |^export .* from /.test(l)).join('\n')
      expect(imports).not.toContain('holiday-sale-eventv1')
      expect(imports).not.toMatch(/notify-store-lead|store-inbox|StoreLeadProvider|holiday-sale-event\/lead'/)
    }
  })
})

describe('hero (user decision): the sale-event line leads, no "Factory direct"', () => {
  it('reads "Holiday Sale Event" over "Exclusive offers until December 31, 2026"', () => {
    for (const c of [us, ca]) {
      expect(lockupText(c.hero.lockup)).toBe('Holiday Sale Event')
      expect(c.hero.support).toBe('Exclusive offers until December 31, 2026')
      expect(c.hero.badge).toEqual({ lead: 'Limited Time', script: 'Offer' })
    }
    expect(SALE_EVENT.name).toBe('Holiday Sale Event')
  })

  it('never says "Factory direct" on either site, in content or metadata', () => {
    for (const site of ['us', 'cad'] as const) expect(all(site)).not.toMatch(/factory/i)
    expect(src('./page.tsx')).not.toMatch(/factory/i)
  })
})

describe('US financing (user decision): the compliant /fall-financing credit advertisement', () => {
  const fin = us.promos.find((p) => p.id === 'financing')!

  it('uses the Synchrony lockup and subhead from campaign.ts, verbatim', () => {
    expect(fin.heading).toEqual({
      kind: 'lockup',
      lead: campaign.financing.heading.lead,
      connector: campaign.financing.heading.connector,
      apr: campaign.financing.heading.apr,
      subhead: campaign.financing.subhead,
    })
    expect(fin.heading.kind === 'lockup' && fin.heading.lead).toContain(campaign.INTRO_APR)
    expect(fin.heading.kind === 'lockup' && fin.heading.apr).toContain(`APR ${campaign.BLENDED_APR}`)
    expect(fin.heading.kind === 'lockup' && fin.heading.subhead).toContain(campaign.TERMS_SENTENCE)
    expect(fin.note).toBe(campaign.financing.dealerNote)
  })

  it('does not use v1\'s figure-free "0% financing on every model"', () => {
    expect(all('us')).not.toContain('on every model')
  })

  it('carries the Supporting Disclosure as visible fine print in the same section', () => {
    expect(fin.fineprint).toEqual([
      ...campaign.disclosures.financingTerms,
      campaign.disclosures.financingExample,
      campaign.disclosures.exclusions,
    ])
    expect(fin.fineprintId).toBe('disclosures')
  })

  it('renders the lockup, subhead and disclosure on US, with both footnote marks resolving', () => {
    const t = text(render(us))
    expect(t).toContain(campaign.financing.heading.lead)
    expect(t).toContain(campaign.financing.heading.apr)
    expect(t).toContain(campaign.financing.subhead)
    expect(t).toContain(campaign.disclosures.financingExample)
    expect(t).toContain(campaign.disclosures.exclusions)
    for (const line of campaign.disclosures.financingTerms) expect(t).toContain(line)
    expect(render(us)).toContain('id="disclosures"')
  })

  it('qualifies every rate figure on the page: each % in the content is inside the financing spread', () => {
    const { promos, ...rest } = us
    expect(words(rest)).not.toMatch(/\d\s*%/)
    for (const p of promos.filter((p) => p.id !== 'financing')) expect(words(p)).not.toMatch(/\d\s*%/)
    expect(JSON.stringify(HOLIDAY_META.us)).not.toMatch(/\d\s*%|APR/)
  })

  it('obeys the §4.5 vocabulary on every rendered string', () => {
    const t = text(render(us))
    expect(t).not.toMatch(/0%\s*APR|22\.99%\s*APR|APR\s+(of\s+)?(0|22\.99)%/i)
    expect(t).not.toMatch(/thereafter|up to \d+ months/i)
  })
})

describe('CA (user decision): no financing anywhere', () => {
  it('has no financing, Synchrony, APR, % or "Interest Free" in content or metadata', () => {
    const s = all('cad')
    expect(s).not.toMatch(/financ|synchrony|\bAPR\b|interest free|%/i)
    const t = text(render(ca))
    expect(t).not.toMatch(/financ|synchrony|\bAPR\b|interest free|%/i)
    expect(render(ca)).not.toContain('id="disclosures"')
    expect(render(ca)).not.toContain('id="financing"')
  })
})

describe('metadata', () => {
  const page = src('./page.tsx')

  it('names the page per site, without figures', () => {
    expect(HOLIDAY_META.us.title).toBe('Holiday Sale Event')
    expect(HOLIDAY_META.cad.title).toBe('Holiday Sale Event')
    expect(HOLIDAY_META.us.description).toContain('December 31, 2026')
  })

  it('canonical is the site URL + path, with hreflang alternates, OG and twitter', () => {
    expect(HOLIDAY_SALE_PATH).toBe('/holiday-sale-event')
    expect(page).toMatch(/const url = `\$\{getSiteUrl\(site\)\}\$\{HOLIDAY_SALE_PATH\}`/)
    expect(page).toMatch(/canonical: url/)
    expect(page).toMatch(/languages: getSiteAlternates\(HOLIDAY_SALE_PATH\)/)
    expect(page).toMatch(/openGraph:/)
    expect(page).toMatch(/twitter:/)
  })
})

describe('the lead form works like /fall-financing (ZIP → nearest RSM)', () => {
  it('equals the national config except formName, tags and the open label', () => {
    expect(holidayLeadCampaign.formName).toBe('fall_financing_enquiry_holiday_national')
    expect([...holidayLeadCampaign.shopifyTags]).toEqual(['fall-financing', 'q4-2026-financing', 'holiday-2026-lead'])
    expect(holidayLeadCampaign.copy.openLabel).toBe('Request Inventory')
    expect(holidayLeadCampaign.source).toBe('fall-financing')
    expect(holidayLeadCampaign.hubspotForm).toEqual(leadCampaign.hubspotForm)
    expect(holidayLeadCampaign.fields).toBe(leadCampaign.fields)
    expect(holidayLeadCampaign.notifyLead).toBeUndefined()
    const { formName: _a, copy: hc, shopifyTags: _t, ...hRest } = holidayLeadCampaign
    const { formName: _b, copy: nc, shopifyTags: _u, ...nRest } = leadCampaign
    expect(hRest).toEqual(nRest)
    expect({ ...hc, openLabel: '' }).toEqual({ ...nc, openLabel: '' })
  })

  it('captureLead → notifyRsmOfLead(lead, "fall-financing")', async () => {
    let ctx: ReturnType<typeof useLeadCampaign> | null = null
    const Probe = () => {
      ctx = useLeadCampaign()
      return null
    }
    renderToString(createElement(LeadCampaignProvider, { config: holidayLeadCampaign, children: createElement(Probe) }))
    rsmCalls.length = 0
    ;(ctx as unknown as ReturnType<typeof useLeadCampaign>).captureLead(LEAD)
    await Promise.resolve()
    expect(rsmCalls).toEqual([{ data: LEAD, source: 'fall-financing' }])
  })
})

describe('the template without a store', () => {
  const store = toSaleStore(
    {
      showroomInfo: { name: 'Kawai Dallas', address: '601 W Plano Pkwy Ste 153, Plano, TX 75075', phone: '(972) 379-2200' },
      calendlyUrl: 'https://calendly.com/example',
    },
    'dallas',
  )

  for (const [site, content] of [
    ['us', us],
    ['cad', ca],
  ] as const) {
    it(`${site}: one h1, Request Inventory only — no tel:, location band, map or Call Now`, () => {
      const html = render(content)
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      expect(html).not.toContain('tel:')
      expect(html).not.toContain('id="sale-location"')
      expect(html).not.toContain('data-sale-map')
      expect(html).not.toContain('data-cta="call-now"')
      expect(html).not.toContain('data-cta="schedule-visit"')
      expect(html).not.toContain('data-sale-store-contact')
      expect(html).toContain('data-cta="request-inventory"')
      expect(text(html)).toContain(CLOSE_BODY)
    })
  }

  it('with a store, the store parts are all back', () => {
    const prev = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-maps-key'
    try {
      const html = render(us, store)
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      expect(html).toContain('href="tel:9723792200"')
      expect(html).toContain('id="sale-location"')
      expect(html).toContain('data-sale-map')
      expect(html).toContain('data-cta="call-now"')
      expect(html).toContain('data-cta="schedule-visit"')
      expect(text(html)).toContain('Kawai Dallas')
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      else process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = prev
    }
  })

  it('lays two index cards in two columns, three in three', () => {
    expect(render(ca)).toContain('sm:grid-cols-2')
    expect(render(us)).toContain('mt-12 grid gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8')
  })
})

describe('route source guards', () => {
  const page = src('./page.tsx')
  const provider = src('./HolidayLeadProvider.tsx')
  const lead = src('./lead.ts')
  const sitemap = readFileSync(new URL('../../sitemap.ts', import.meta.url), 'utf8')

  it('is force-dynamic, with no ISR, static params, 404 or storefront lookup', () => {
    expect(page).toMatch(/export const dynamic = 'force-dynamic'/)
    expect(page).not.toMatch(/export const revalidate/)
    expect(page).not.toMatch(/generateStaticParams/)
    expect(page).not.toMatch(/notFound/)
    expect(page).not.toMatch(/getStorefront|toSaleStore/)
  })

  it('renders the template with no store, inside the national lead provider in test-mode aware form', () => {
    expect(page).toMatch(/<HolidayLeadProvider testMode=\{testMode\}>/)
    expect(page).toMatch(/process\.env\.FALL_FINANCING_TEST_MODE === 'true'/)
    expect(page).toMatch(/<SaleTemplate content=\{holidaySaleFor\(site\)\} \/>/)
  })

  it('the provider is the shared LeadCampaignProvider, fed holidayLeadCampaign, client side', () => {
    expect(provider.startsWith("'use client'")).toBe(true)
    expect(provider).toMatch(/<LeadCampaignProvider config=\{holidayLeadCampaign\} testMode=\{testMode\}>/)
    expect(lead).not.toMatch(/notifyLead\s*:/)
  })

  it('is in the sitemap on both sites', () => {
    expect(sitemap).toMatch(/add\(HOLIDAY_SALE_PATH, \{ changeFrequency: 'weekly', priority: 0\.6 \}\)/)
  })
})
