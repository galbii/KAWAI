import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

/**
 * Lead tracking parity with kawaius.com/fall-financing
 * (kawai-holiday-financing-landing v6, Nov 19, 2026). Chance: "make sure that
 * any leads we generate from this fire off the same stuff as
 * kawaius.com/fall-financing for consistent lead tracking".
 *
 * Mocks only. Nothing here reaches HubSpot, Shopify, Resend or the RSM email:
 * fetch is replaced, and both server actions are replaced before anything
 * imports them.
 */

const rsmCalls: Array<{ data: unknown; source: string }> = []
const shopifyCalls: Array<{ data: unknown; tags: string[] }> = []

mock.module('@/lib/actions/notify-rsm-of-lead', () => ({
  notifyRsmOfLead: async (data: unknown, source: string) => {
    rsmCalls.push({ data, source })
    return { ok: true }
  },
}))
mock.module('@/lib/actions/signup-lead-shopify', () => ({
  upsertSignupLeadToShopify: async (data: unknown, tags: string[]) => {
    shopifyCalls.push({ data, tags })
    return { ok: true }
  },
}))

mock.module('@/lib/actions/nearby-dealers', () => ({
  getNearestStorefrontForLead: async () => null,
}))

const { leadCampaign } = await import('@/app/(frontend)/fall-financing/_components/lead-campaign')
const { storeLeadCampaign } = await import('./lead')
const { submitHubSpotForm } = await import('@/lib/hubspot/forms')
const { LeadCampaignProvider, useLeadCampaign } = await import('@/components/campaign-lead')
const { createElement } = await import('react')
const { renderToString } = await import('react-dom/server')

const STORES = ['dallas', 'houston', 'denver', 'st-louis'] as const
const LEAD = { firstname: 'Test', lastname: 'Lead', email: 't@example.invalid', phone: '5555550100', zip: '75201' }

const src = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')
const COMPONENTS = '../../../../../components/'

describe('v6 lead parity: same HubSpot form, fields, source and Shopify tags as /fall-financing', () => {
  for (const slug of STORES) {
    it(`${slug}: config equals the national leadCampaign except formName and the open label`, () => {
      const store = storeLeadCampaign(slug)
      expect(store.hubspotForm).toEqual(leadCampaign.hubspotForm)
      expect(store.hubspotForm.portalId).toBe('21987263')
      expect(store.fields).toBe(leadCampaign.fields)
      expect(store.source).toBe('fall-financing')
      expect(store.source).toBe(leadCampaign.source)
      expect([...store.shopifyTags]).toEqual(['fall-financing', 'q4-2026-financing'])
      expect(store.shopifyTags).toBe(leadCampaign.shopifyTags)
      expect(store.formName.startsWith(`${leadCampaign.formName}_store_`)).toBe(true)
      const { formName: _a, copy: storeCopy, ...storeRest } = store
      const { formName: _b, copy: natCopy, ...natRest } = leadCampaign
      expect(storeRest).toEqual(natRest)
      expect({ ...storeCopy, openLabel: '' }).toEqual({ ...natCopy, openLabel: '' })
    })
  }

  it('the field names HubSpot receives are the national ones (incl. piano_type)', () => {
    const names = (storeLeadCampaign('dallas').fields ?? []).map((f) => f.hubspotName ?? f.name)
    for (const n of ['firstname', 'lastname', 'email', 'phone', 'zip', 'piano_type']) expect(names).toContain(n)
    expect(names).toEqual((leadCampaign.fields ?? []).map((f) => f.hubspotName ?? f.name))
  })
})

describe('v6 lead parity: the HubSpot Forms API v3 request (fetch mocked)', () => {
  const g = globalThis as Record<string, unknown>
  const saved = { fetch: g.fetch, window: g.window, document: g.document }
  const requests: Array<{ url: string; body: Record<string, unknown> }> = []

  beforeEach(() => {
    requests.length = 0
    g.fetch = async (url: string, init: { body: string }) => {
      requests.push({ url, body: JSON.parse(init.body) })
      return new Response('{}', { status: 200 })
    }
    g.document = { cookie: 'hubspotutk=utk123' }
  })
  afterEach(() => {
    g.fetch = saved.fetch
    g.window = saved.window
    g.document = saved.document
  })

  const send = async (cfg: typeof leadCampaign, href: string) => {
    g.window = { location: { href } }
    const fields = (cfg.fields ?? []).map((f) => ({ name: f.hubspotName ?? f.name, value: 'x' }))
    await submitHubSpotForm(cfg.hubspotForm, fields, { pageName: cfg.formName })
    return requests[requests.length - 1]!
  }

  it('posts to the same endpoint with the same fields, hutk and the landing URL (UTMs ride on pageUri)', async () => {
    const utm = '?utm_source=meta&utm_medium=paid_social&utm_campaign=kawai_holiday_sale_2026'
    const nat = await send(leadCampaign, `https://kawaius.com/fall-financing${utm}`)
    const store = await send(storeLeadCampaign('dallas'), `https://kawaius.com/store/dallas/holiday-sale-event${utm}`)

    expect(store.url).toBe(nat.url)
    expect(store.url).toBe(
      'https://api.hsforms.com/submissions/v3/integration/submit/21987263/6a40df6b-d339-413c-8f62-d6e8324f3959',
    )
    expect(store.body.fields).toEqual(nat.body.fields)
    expect(Object.keys(store.body.context as object).sort()).toEqual(['hutk', 'pageName', 'pageUri'])
    expect(Object.keys(store.body.context as object).sort()).toEqual(Object.keys(nat.body.context as object).sort())
    expect((store.body.context as { hutk: string }).hutk).toBe('utk123')
    expect((store.body.context as { pageUri: string }).pageUri).toContain('utm_campaign=kawai_holiday_sale_2026')
    expect((store.body.context as { pageName: string }).pageName).toBe('fall_financing_enquiry_store_dallas')
    expect((nat.body.context as { pageName: string }).pageName).toBe('fall_financing_enquiry')
  })
})

describe('v6 lead parity: RSM routing gets the national source (server action mocked)', () => {
  const captureFor = (config: typeof leadCampaign) => {
    let ctx: ReturnType<typeof useLeadCampaign> | null = null
    const Probe = () => {
      ctx = useLeadCampaign()
      return null
    }
    renderToString(createElement(LeadCampaignProvider, { config, children: createElement(Probe) }))
    if (!ctx) throw new Error('lead context not rendered')
    return ctx as ReturnType<typeof useLeadCampaign>
  }

  it('captureLead → notifyRsmOfLead(data, "fall-financing") on the store page, as on the national page', async () => {
    rsmCalls.length = 0
    captureFor(leadCampaign).captureLead(LEAD)
    for (const slug of STORES) captureFor(storeLeadCampaign(slug)).captureLead(LEAD)
    await Promise.resolve()
    expect(rsmCalls).toHaveLength(1 + STORES.length)
    for (const c of rsmCalls) {
      expect(c.source).toBe('fall-financing')
      expect(c.data).toEqual(LEAD)
    }
  })
})

describe('v6 lead parity: dataLayer conversion + Shopify mirror run through the same components', () => {
  // TwoStepHubSpotForm and LeadForm need a DOM to submit; this repo's bun tests
  // have none. These source assertions pin the one code path both pages use:
  // the store page and the national page both mount LeadCampaignProvider →
  // LeadModal → LeadForm → TwoStepHubSpotForm, and the only per-page input is
  // the config compared above.
  const leadForm = src(`${COMPONENTS}campaign-lead/LeadForm.tsx`)
  const twoStep = src(`${COMPONENTS}forms/TwoStepHubSpotForm.tsx`)
  const showroom = src(`${COMPONENTS}campaign-lead/NearestShowroomCard.tsx`)
  const provider = src('./StoreLeadProvider.tsx')

  it('the store provider is the shared LeadCampaignProvider, fed storeLeadCampaign', () => {
    expect(provider).toMatch(/import \{ LeadCampaignProvider \} from '@\/components\/campaign-lead'/)
    expect(provider).toMatch(/storeLeadCampaign\(storeSlug\)/)
    expect(provider).toMatch(/<LeadCampaignProvider config=\{config\}/)
  })

  it('LeadForm keeps the default signup_form_submitted event (no dataLayerEvent override) and passes formName', () => {
    expect(leadForm).not.toMatch(/dataLayerEvent=/)
    expect(leadForm).toMatch(/formName=\{config\.formName\}/)
    expect(twoStep).toMatch(/dataLayerEvent = 'signup_form_submitted'/)
  })

  it('the dataLayer payload shape is event / event_category "signup" / event_label formName / user_data', () => {
    const push = twoStep.slice(twoStep.indexOf('window.dataLayer.push({'), twoStep.indexOf('setSubmitted(true)'))
    expect(push).toMatch(/event: dataLayerEvent,/)
    expect(push).toMatch(/event_category: 'signup',/)
    expect(push).toMatch(/event_label: formName,/)
    expect(push).toMatch(/user_data: userData/)
    for (const k of ['userData.email', 'userData.phone_number', 'userData.address']) expect(twoStep).toContain(k)
    expect(twoStep).toMatch(/pageName: formName/)
  })

  it('LeadForm mirrors to Shopify with config.shopifyTags and hands the lead to captureLead', () => {
    expect(leadForm).toMatch(/upsertSignupLeadToShopify\(data, \[\.\.\.config\.shopifyTags\]\)/)
    expect(leadForm).toMatch(/captureLead\(data\)/)
    expect(leadForm).toMatch(/<NearestShowroomCard zip=\{submittedZip\} source=\{config\.source\}/)
  })

  it('a showroom click pushes storefront_referral with event_label = source', () => {
    expect(showroom).toMatch(/event: 'storefront_referral'/)
    expect(showroom).toMatch(/event_category: 'lead'/)
    expect(showroom).toMatch(/event_label: source/)
  })

  it('no first-party Meta CAPI call in this lead path (Meta Lead is GTM on signup_form_submitted)', () => {
    for (const s of [leadForm, twoStep, provider, src('./lead.ts')]) {
      expect(s).not.toMatch(/graph\.facebook\.com|conversions api|capi/i)
    }
  })
})
