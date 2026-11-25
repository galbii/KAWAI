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
    expect([...holidayLeadCampaign.shopifyTags]).toEqual(['q4-2026-financing', 'holiday-2026-lead'])
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

describe('availability note under every CTA pair (kawai-holiday-cta-availability-note v1)', () => {
  const NOTE = 'Submit a form to find out about availability!'
  const store = toSaleStore({ showroomInfo: { name: 'Kawai Dallas', phone: '(972) 379-2200' } }, 'dallas')

  it('national content sets the exact line on both sites', () => {
    expect(us.cta.note).toBe(NOTE)
    expect(ca.cta.note).toBe(NOTE)
  })

  for (const [site, content] of [
    ['us', us],
    ['cad', ca],
  ] as const) {
    it(`${site}: renders once under each pair (hero, index, each CTA spread, close), never on the phone bar`, () => {
      const html = render(content)
      const pairs = [...html.matchAll(/data-sale-cta="([^"]+)"/g)].map((m) => m[1])
      const notes = [...html.matchAll(/data-sale-cta-note="([^"]+)"/g)].map((m) => m[1])
      expect(pairs).toContain('hero')
      expect(pairs).toContain('offers')
      expect(pairs).toContain('close')
      expect(pairs.length).toBeGreaterThan(3)
      expect(notes).toEqual(pairs)
      expect(html.split(NOTE).length - 1).toBe(pairs.length)
      // Directly after its own pair's buttons, as a plain paragraph.
      for (const p of pairs) {
        expect(html).toMatch(new RegExp(`data-sale-cta="${p}"[\\s\\S]*?</div><p data-sale-cta-note="${p}"[^>]*>${NOTE}</p>`))
      }
      const sticky = html.slice(html.indexOf('data-sale-sticky'))
      expect(sticky).not.toContain(NOTE)
    })
  }

  it('the store pages set no note and render none', async () => {
    const live = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-event/_content')
    const v1 = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-eventv1/_content')
    for (const content of [live.fallFinancingSale, v1.fallFinancingSale]) {
      expect(content.cta.note).toBeUndefined()
      const html = render(content, store)
      expect(html).not.toContain(NOTE)
      expect(html).not.toContain('data-sale-cta-note')
    }
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

describe('cinematic full-bleed photo close (kawai-holiday-close-redesign v1)', () => {
  const NOTE = 'Submit a form to find out about availability!'
  const closeOf = (html: string) => {
    const start = html.indexOf('<section aria-labelledby="sale-close"')
    expect(start).toBeGreaterThan(-1)
    const end = html.indexOf('</section>', start)
    return html.slice(start, end + '</section>'.length)
  }
  const store = toSaleStore(
    {
      showroomInfo: { name: 'Kawai Dallas', address: '601 W Plano Pkwy Ste 153, Plano, TX 75075', phone: '(972) 379-2200' },
      calendlyUrl: 'https://calendly.com/example',
    },
    'dallas',
  )

  it('national content sets the cinematic close image on both sites', () => {
    for (const content of [us, ca]) {
      expect(content.close.image?.src).toBe('/images/namm/general/_MG_7325.jpg')
      expect(content.close.image?.alt.length).toBeGreaterThan(20)
      expect(content.close.image?.position).toBeTruthy()
    }
  })

  for (const [site, content] of [
    ['us', us],
    ['cad', ca],
  ] as const) {
    it(`${site}: renders the photo close with image, h2#sale-close, CTA wrapper, request CTA and note — no red band`, () => {
      const html = render(content)
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
      const close = closeOf(html)
      expect(close).toContain('data-sale-close="cinematic"')
      expect(close).toMatch(/<img[^>]*alt="A black concert grand piano[^"]*"/)
      expect(close).toMatch(/<img[^>]*_MG_7325/)
      expect(close).not.toMatch(/<img[^>]*fetchPriority="high"/i)
      expect(close).toMatch(/<h2[^>]*id="sale-close"/)
      expect(text(close)).toContain('Instrumental to the Holidays')
      expect(close).toContain('text-kawai-red-400')
      expect(close).toContain('id="sale-cta-close"')
      expect(close).toMatch(/id="sale-cta-close"[\s\S]*data-cta="request-inventory"[^>]*data-cta-placement="close"/)
      expect(close).toContain(`<p data-sale-cta-note="close"`)
      expect(close).toContain(NOTE)
      expect(text(close)).toContain(content.close.eyebrow)
      expect(text(close)).toContain(content.close.heading)
      expect(text(close)).toContain(CLOSE_BODY)
      // The old two-block close is gone on this page.
      expect(close).not.toContain('bg-kawai-red px-5 py-12')
      expect(close).not.toContain('bg-white px-5 pb-20')
      expect(close).not.toContain('data-cta="schedule-visit"')
      // The reversed wordmark sits in the corner.
      expect(close).toContain('brightness-0 invert')
    })
  }

  it('store content has no cinematic option', async () => {
    const live = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-event/_content')
    const v1 = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-eventv1/_content')
    for (const content of [live.fallFinancingSale, v1.fallFinancingSale]) {
      expect(content.close.image).toBeUndefined()
    }
  })

  it('store content still renders the old close: red band, white field, Schedule Visit and phone', async () => {
    const live = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-event/_content')
    const v1 = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-eventv1/_content')
    for (const content of [live.fallFinancingSale, v1.fallFinancingSale]) {
      const close = closeOf(render(content, store))
      expect(close).not.toContain('data-sale-close')
      expect(close).toContain('bg-kawai-red px-5 py-12')
      expect(close).toContain('bg-white px-5 pb-20')
      expect(close).toMatch(/<h2[^>]*id="sale-close"/)
      expect(close).toContain('id="sale-cta-close"')
      expect(close).toContain('data-cta="schedule-visit"')
      expect(close).toContain('href="tel:9723792200"')
      expect(text(close)).toContain('Kawai Dallas · (972) 379-2200')
      expect(close).toContain('kawai-logo-new-red.png')
      expect(close).not.toContain('brightness-0 invert')
    }
  })
})

describe('v2 page polish (kawai-holiday-close-redesign v2), national only', () => {
  const sectionOf = (html: string, id: string) => {
    const start = html.indexOf(`<section id="${id}"`)
    expect(start).toBeGreaterThan(-1)
    return html.slice(start, html.indexOf('</section>', start) + '</section>'.length)
  }
  const GX1 = '/images/signature/pianos/gx-1/gx-1-secondary.webp'
  const enc = encodeURIComponent(GX1)

  it('(a1) cuts the "Make your soundtrack for the Holidays" moment on both sites', () => {
    for (const content of [us, ca]) {
      expect(content.moments.map((m) => m.id)).toEqual(['played', 'sound'])
      const html = render(content)
      expect(html).not.toContain('soundtrack-heading')
      expect(text(html)).not.toContain('Make your soundtrack')
    }
  })

  it('(a2) the financing (US) and acoustic rebate (CA) spreads use an acoustic GX-1 photo; /fall-financing keeps its own', () => {
    const fin = us.promos.find((p) => p.id === 'financing')
    const ac = ca.promos.find((p) => p.id === 'acoustic-rebates')
    expect(fin?.image?.src).toBe(GX1)
    expect(ac?.image?.src).toBe(GX1)
    expect(fin?.image?.alt).toMatch(/grand piano/)
    // The national copy files are untouched: their autumn photo is still theirs.
    expect(campaign.acousticRebate.stageImage).not.toBe(GX1)
    expect(campaign.acousticRebate.stageImage).toContain('KAWAI_CA401B-1')
    // The offer index card reuses the spread's photo: once in the card, once in the spread.
    for (const content of [us, ca]) {
      const html = render(content)
      const offers = html.slice(html.indexOf('id="offers"'))
      expect(offers.split(`url=${enc}`).length - 1).toBeGreaterThanOrEqual(2)
    }
  })

  it('(a3) louder offers: headings and the financing lockup at clamp(2.2rem, 4.2vw, 3.6rem), Synchrony ratios exact', async () => {
    const promos = await import('@/components/sale-template/SalePromos')
    expect(promos.CONNECTOR_RATIO).toBe(0.72)
    expect(promos.SUBHEAD_RATIO).toBe(0.42)
    expect(promos.LOCKUP_SIZE).toBe('clamp(1.9rem, 3.6vw, 2.9rem)')
    expect(promos.LOCKUP_SIZE_LOUD).toBe('clamp(2.2rem, 4.2vw, 3.6rem)')
    const fin = sectionOf(render(us), 'financing')
    // One wrapper sets the size; the h2 is 1em, connector 0.72em, subhead 0.42em of it.
    expect(fin).toMatch(/<div style="font-size:clamp\(2\.2rem, 4\.2vw, 3\.6rem\)"><h2 id="financing-heading"[^>]*font-size:1em/)
    expect(fin).toContain('<span style="font-size:0.72em">')
    expect(fin).toMatch(/<p[^>]*style="font-size:0\.42em"/)
    // Regulated words verbatim, disclosure still visible in the same section, measure capped.
    expect(text(fin)).toContain(campaign.financing.subhead)
    expect(fin).toMatch(/id="disclosures" class="[^"]*max-w-4xl/)
    for (const line of [...campaign.disclosures.financingTerms, campaign.disclosures.financingExample]) {
      expect(text(fin)).toContain(line.replace(/\s+/g, ' ').trim().slice(0, 40))
    }
    // Text headings and rebate values.
    const reb = sectionOf(render(us), 'rebates')
    expect(reb).toContain('font-size:clamp(2.2rem, 4.2vw, 3.6rem)')
    expect(reb).toContain('text-[1.6rem]')
    expect(reb).not.toContain('text-[1.15rem]')
  })

  for (const [site, content] of [
    ['us', us],
    ['cad', ca],
  ] as const) {
    it(`${site} (b) the SH-9 Headphones spread is dark and full bleed, still numbered with its fine print`, () => {
      const bundle = content.promos.find((p) => p.id === 'headphones')
      expect(bundle?.tone).toBe('dark')
      expect(bundle?.layout).toBe('fullBleed')
      const hp = sectionOf(render(content), 'headphones')
      expect(hp).toContain('data-sale-tone="dark"')
      expect(hp).toContain('data-sale-layout="full-bleed"')
      expect(hp).toContain('bg-kawai-black')
      expect(hp).toContain('sizes="100vw"')
      expect(hp).toMatch(/<h2 id="headphones-heading"[^>]*text-white/)
      expect(hp).toContain('text-kawai-red-400')
      expect(text(hp)).toContain('01')
      expect(hp).toMatch(/data-cta="request-inventory"[^>]*data-cta-placement="headphones"/)
      expect(hp).toMatch(/data-sale-cta-note="headphones" class="[^"]*text-white\/90/)
      expect(text(hp)).toContain(campaign.bundle.disclaimer.slice(0, 40))
      expect(hp).not.toContain('bg-kawai-pearl')
    })
  }

  it('(c) mobile: compact index rows, larger gallery prints, larger hero minimum, script clear of the serif', () => {
    const html = render(us)
    expect(html).toContain('relative size-24 shrink-0 overflow-hidden')
    const sound = html.slice(html.indexOf('aria-labelledby="sound-heading"'))
    expect(sound).toContain('grid grid-cols-2 items-start gap-4 sm:mt-16 sm:grid-cols-3')
    expect(sound).toContain('col-span-2 mx-auto w-[74%]')
    expect(html).toContain('font-size:clamp(3.9rem, 7.4vw, 6.6rem)')
    for (const id of ['played-heading', 'sound-heading']) {
      const h = html.slice(html.indexOf(`id="${id}"`), html.indexOf('</h2>', html.indexOf(`id="${id}"`)))
      expect(h).toContain('w-full translate-y-[0.06em]')
      expect(h).toContain('sm:-ml-[0.18em]')
    }
  })

  it('(c) sticky bar: hidden while a pair or disclosure is on screen (pure rule), and the national page opts in', async () => {
    const { stickyShown } = await import('@/components/sale-template')
    expect(stickyShown({ startBottom: -10, endTop: 2000, viewport: 800 })).toBe(true)
    expect(stickyShown({ startBottom: -10, endTop: 2000, viewport: 800, blocked: true })).toBe(false)
    expect(stickyShown({ startBottom: 10, endTop: 2000, viewport: 800 })).toBe(false)
    expect(stickyShown({ startBottom: -10, endTop: 700, viewport: 800 })).toBe(false)
    expect(us.polish?.stickyAvoidsPairs).toBe(true)
    expect(ca.polish?.stickyAvoidsPairs).toBe(true)
    const ctas = src('../../../components/sale-template/SaleCtas.tsx')
    expect(ctas).toContain("document.querySelectorAll('[data-sale-cta]')")
    expect(ctas).toContain('new IntersectionObserver')
    const tpl = src('../../../components/sale-template/SaleTemplate.tsx')
    expect(tpl).toMatch(/polish\?\.stickyAvoidsPairs[\s\S]*fineprintId/)
  })

  it('store pages opt into none of it and render none of the v2 markers', async () => {
    const live = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-event/_content')
    const v1 = await import('@/app/(frontend)/store/[storeslug]/holiday-sale-eventv1/_content')
    const store = toSaleStore({ showroomInfo: { name: 'Kawai Dallas', phone: '(972) 379-2200' } }, 'dallas')
    for (const content of [live.fallFinancingSale, v1.fallFinancingSale]) {
      expect(content.polish).toBeUndefined()
      expect(content.promos.every((p) => p.tone === undefined && p.layout === undefined)).toBe(true)
      for (const html of [render(content, store), render(content)]) {
        for (const marker of [
          'data-sale-tone',
          'data-sale-layout',
          'size-24',
          'text-[1.6rem]',
          'clamp(2.2rem, 4.2vw, 3.6rem)',
          'clamp(3.9rem',
          'sm:-ml-[0.18em]',
          'w-[74%]',
          'max-w-4xl space-y',
          'sm:mt-12 max-w-4xl',
        ]) {
          expect(html).not.toContain(marker)
        }
      }
    }
  })
})
