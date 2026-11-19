import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'bun:test'
import { telHref, toSaleStore } from '@/components/sale-template/store'
import { lockupText } from '@/components/sale-template/Lockup'
import {
  bundle,
  coda,
  disclosures,
  financing,
  lessons,
  rebate,
  rebateCopyFor,
  FOOTNOTE_EXAMPLE,
  FOOTNOTE_EXCLUSIONS,
  CTA_LABEL,
  CTA_LEAD_IN,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { heroOpenerFor } from '@/app/(frontend)/fall-financing/_components/slides'
import { fallFinancingSale as sale, HEADLINES, HERO_SUBLINE, REQUEST_LABEL, TAGLINE } from './_content'
import { storeLeadCampaign } from './lead'

describe('store fall-financing: the holiday headlines are the approved set', () => {
  // Chance's comps, Nov 17, 2026, with the two source-art typos corrected.
  it('sets the hero to the primary lockup and its sub-line', () => {
    expect(lockupText(sale.hero.lockup)).toBe('Make the first note a Holiday memory')
    expect(sale.hero.lockup).toEqual(HEADLINES.hero)
    expect(sale.hero.subline).toEqual(['Factory-direct Kawai Pianos', 'ready for their first carol'])
    expect(sale.hero.subline).toEqual(HERO_SUBLINE)
  })

  it('carries the other four lockups word for word', () => {
    expect(lockupText(HEADLINES.played)).toBe('Some gifts get unwrapped This one gets Played')
    expect(lockupText(HEADLINES.instrumental)).toBe('Instrumental to Holiday')
    expect(lockupText(HEADLINES.soundtrack)).toBe('Make your soundtrack for the Holidays')
    expect(lockupText(HEADLINES.sound)).toBe('Your holidays have photos Give them a Sound')
    const used = [...sale.moments.map((m) => m.lockup), sale.close.lockup]
    for (const h of [HEADLINES.played, HEADLINES.instrumental, HEADLINES.soundtrack, HEADLINES.sound]) {
      expect(used).toContainEqual(h)
    }
  })

  it('sets one red script word per headline', () => {
    const scripts = [sale.hero.lockup, ...sale.moments.map((m) => m.lockup), sale.close.lockup].map((l) => l.script)
    expect(scripts.sort()).toEqual(['Holiday', 'Holiday', 'Holidays', 'Played', 'Sound'])
  })

  it('never ships the source-art misspellings', () => {
    const all = JSON.stringify(sale)
    expect(all).not.toContain('Some gift get')
    expect(all).not.toContain('soundrack')
  })

  it('signs off with the brand line under the wordmark', () => {
    expect(sale.tagline).toBe('Instrumental to Life')
    expect(TAGLINE).toBe('Instrumental to Life')
  })
})

describe('store fall-financing: offer copy is the national copy, word for word', () => {
  it('introduces the offers with the national opener body', () => {
    expect(sale.intro).toBe(heroOpenerFor('us').body ?? '')
  })

  it('carries each promo heading, standfirst and fine print unchanged', () => {
    const byId = Object.fromEntries(sale.promos.map((p) => [p.id, p]))
    expect(byId.headphones?.heading).toEqual({ kind: 'text', text: bundle.heading })
    expect(byId.headphones?.body).toBe(bundle.standfirst)
    expect(byId.headphones?.fineprint).toEqual([bundle.disclaimer])
    expect(byId.rebates?.heading).toEqual({ kind: 'text', text: rebateCopyFor('us').heading })
    expect(byId.rebates?.body).toBe(rebate.standfirst)
    expect(byId.rebates?.fineprint).toEqual([rebate.disclaimer])
    expect(byId.lessons?.heading).toEqual({ kind: 'text', text: lessons.heading })
    expect(byId.lessons?.body).toBe(lessons.standfirst)
    expect(byId.lessons?.fineprint).toEqual([lessons.disclaimer])
    expect(sale.close.eyebrow).toBe(coda.eyebrow)
    expect(sale.close.heading).toBe(coda.heading)
    expect(sale.close.body).toBe(coda.body)
  })

  it('keeps the promos in the national order', () => {
    expect(sale.promos.map((p) => p.id)).toEqual(['headphones', 'financing', 'rebates', 'lessons'])
  })
})

describe('store fall-financing: the credit advertisement stays with its disclosure', () => {
  const fin = sale.promos.find((p) => p.id === 'financing')

  it('renders the regulated lockup from campaign.ts', () => {
    expect(fin?.heading).toEqual({
      kind: 'lockup',
      lead: financing.heading.lead,
      connector: financing.heading.connector,
      apr: financing.heading.apr,
      subhead: financing.subhead,
    })
  })

  it('resolves both footnote marks in the same card, as visible text', () => {
    expect(fin?.fineprint).toEqual([
      ...disclosures.financingTerms,
      disclosures.financingExample,
      disclosures.exclusions,
    ])
    expect(fin?.fineprint.some((l) => l.startsWith(FOOTNOTE_EXAMPLE) && !l.startsWith('**'))).toBe(true)
    expect(fin?.fineprint.some((l) => l.startsWith(FOOTNOTE_EXCLUSIONS))).toBe(true)
  })

  it('puts no rate figure in the hero, the intro, the highlights or the moments (metadata reuses hero + intro)', () => {
    const text = [
      lockupText(sale.hero.lockup),
      ...sale.hero.subline,
      sale.hero.ending,
      sale.intro,
      ...sale.highlights.map((h) => h.detail),
      ...sale.moments.map((m) => lockupText(m.lockup)),
      lockupText(sale.close.lockup),
    ]
    for (const t of text) expect(t).not.toMatch(/\d+(\.\d+)?%/)
  })

  it('never places a holiday moment directly before the credit advertisement', () => {
    for (const m of sale.moments) expect(m.before).not.toBe('financing')
    const ids = new Set(sale.promos.map((p) => p.id))
    for (const m of sale.moments) expect(ids.has(m.before)).toBe(true)
  })

  it('points every highlight at a promo the page renders', () => {
    const ids = new Set(sale.promos.map((p) => `#${p.id}`))
    for (const h of sale.highlights) expect(ids.has(h.href)).toBe(true)
  })
})

describe('toSaleStore', () => {
  const base = {
    locationName: 'Dallas',
    showroomInfo: { name: 'Kawai Piano Gallery Dallas', address: '601 W Plano Pkwy, Plano, TX 75075', phone: '(972) 379-2200' },
  }

  it('prefers Calendly for Schedule Visit, with the CMS label', () => {
    const s = toSaleStore({ ...base, calendlyUrl: 'https://calendly.com/x', showroomCtas: { scheduleText: 'Book a Tour' } }, 'dallas')
    expect(s.schedule).toEqual({ label: 'Book a Tour', href: 'https://calendly.com/x', external: true })
  })

  it('ignores the collection placeholder links and invents nothing', () => {
    const s = toSaleStore(
      { ...base, showroomCtas: { scheduleLink: '/contact/schedule-visit', directionsLink: 'https://maps.google.com/?q=Lake+St.+Louis+MO' } },
      'dallas',
    )
    expect(s.schedule).toBeNull()
    expect(s.directions?.href).toBe(`https://maps.google.com/?q=${encodeURIComponent(base.showroomInfo.address)}`)
  })

  it('falls back to the location name, like Grand Spring', () => {
    expect(toSaleStore({ locationName: 'Denver' }, 'denver').name).toBe('Denver')
    expect(toSaleStore({}, 'denver').phone).toBeNull()
  })
})

describe('store fall-financing: route config', () => {
  // getSite() uses headers(), so this page cannot be ISR. A source assertion
  // is enough: importing page.tsx pulls in server-only modules.
  const src = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

  it('is force-dynamic so getSite()/headers() is legal on next start', () => {
    expect(src).toMatch(/export const dynamic = 'force-dynamic'/)
    expect(src).not.toMatch(/export const revalidate/)
    expect(src).not.toMatch(/export async function generateStaticParams/)
  })
})

describe('store fall-financing: isolated from the national page', () => {
  const dir = new URL('../../../../../components/sale-template/', import.meta.url)
  const templateSrc = readdirSync(dir)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map((f) => readFileSync(new URL(f, dir), 'utf8'))
    .join('\n')

  it('the template imports no national /fall-financing UI', () => {
    expect(templateSrc).not.toMatch(/app\/\(frontend\)\/fall-financing/)
  })

  it('the template holds none of the holiday words itself', () => {
    // Doc comments may quote the headlines; code may not.
    const code = templateSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    for (const w of ['Make the first note', 'This one gets', 'soundtrack', 'Give them a', 'Instrumental to']) {
      expect(code).not.toContain(w)
    }
  })

  it('the national page does not render the sale template', () => {
    const national = readFileSync(new URL('../../../fall-financing/page.tsx', import.meta.url), 'utf8')
    expect(national).not.toMatch(/sale-template/)
  })
})

describe('store fall-financing v2: Request Inventory + Call Now everywhere', () => {
  // Chance via Marcy, voice 8:17 AM PT Nov 19, 2026: primary "Request
  // Inventory", secondary "Call Now", easy to reach across the page.
  const templateDir = new URL('../../../../../components/sale-template/', import.meta.url)
  const read = (f: string) => readFileSync(new URL(f, templateDir), 'utf8')

  it('labels the two actions with the approved words', () => {
    expect(sale.cta.requestLabel).toBe('Request Inventory')
    expect(REQUEST_LABEL).toBe('Request Inventory')
    expect(sale.callLabel).toBe('Call Now')
  })

  it('leads into the mid-page pair with the national lead-in, imported', () => {
    expect(sale.cta.leadIn).toBe(CTA_LEAD_IN)
    expect(sale.cta.leadIn).not.toMatch(/\d+(\.\d+)?%/)
  })

  it('puts the pair in each offer spread except lessons, which keeps its own link', () => {
    expect(sale.promos.filter((p) => p.cta).map((p) => p.id)).toEqual(['headphones', 'financing', 'rebates'])
    expect(sale.promos.find((p) => p.id === 'lessons')?.cta).toBeUndefined()
  })

  it('renders the actions in the hero, location band, offer index, spreads, close and the phone bar', () => {
    expect(read('SaleHero.tsx')).toMatch(/<SaleCtaPair[^>]*placement="hero"/)
    expect(read('SaleLocationBar.tsx')).toMatch(/<SaleRequestButton[^>]*placement="location"/)
    expect(read('SalePromos.tsx')).toMatch(/<SaleCtaPair[^>]*placement="offers"/)
    expect(read('SalePromos.tsx')).toMatch(/promo\.cta &&[\s\S]*<SaleCtaPair[^>]*placement=\{promo\.id\}/)
    expect(read('SaleClose.tsx')).toMatch(/<SaleCtaPair[^>]*placement="close"/)
    expect(read('SaleTemplate.tsx')).toMatch(/<SaleStickyCtas/)
  })

  it('keeps tel:, directions and Schedule Visit working', () => {
    expect(telHref({ phone: '(972) 379-2200' })).toBe('tel:9723792200')
    expect(telHref({ phone: null })).toBeNull()
    expect(read('SaleCtas.tsx')).toMatch(/href=\{tel\}/)
    expect(read('SaleLocationBar.tsx')).toMatch(/href=\{store\.directions\.href\}/)
    expect(read('SaleClose.tsx')).toMatch(/href=\{store\.schedule\.href\}/)
  })

  it('opens the shared lead dialog — the template posts nothing itself', () => {
    const code = readdirSync(templateDir)
      .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
      .map(read)
      .join('\n')
    expect(read('SaleCtas.tsx')).toMatch(/useLeadCampaign\(\)/)
    for (const banned of ['fetch(', 'portalId', 'formGuid', 'hubspot', 'resend']) {
      expect(code.toLowerCase()).not.toContain(banned.toLowerCase())
    }
  })

  it('wraps the page in the store lead provider', () => {
    const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
    expect(page).toMatch(/<StoreLeadProvider storeSlug=\{storeslug\}/)
  })
})

describe('store fall-financing v2: the lead form is the national enquiry, reused', () => {
  const dallas = storeLeadCampaign('dallas')
  const stl = storeLeadCampaign('st-louis')

  it('posts to the same HubSpot form, unchanged', () => {
    expect(dallas.hubspotForm).toEqual(leadCampaign.hubspotForm)
    expect(dallas.hubspotForm).toEqual({ portalId: '21987263', formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959' })
  })

  it('keeps the routing source, tags, fields and consent', () => {
    expect(dallas.source).toBe(leadCampaign.source)
    expect(dallas.shopifyTags).toBe(leadCampaign.shopifyTags)
    expect(dallas.fields).toBe(leadCampaign.fields)
    expect(dallas.copy.consent).toBe(leadCampaign.copy.consent)
    expect(dallas.copy.headline).toBe(leadCampaign.copy.headline)
    expect(dallas.copy.submitLabel).toBe(leadCampaign.copy.submitLabel)
  })

  it('scopes only the analytics label to the store, keeping the national prefix', () => {
    expect(dallas.formName).toBe('fall_financing_enquiry_store_dallas')
    expect(stl.formName).toBe('fall_financing_enquiry_store_st_louis')
    expect(stl.formName.startsWith(leadCampaign.formName)).toBe(true)
  })

  it('labels the opener Request Inventory and leaves the national config alone', () => {
    expect(dallas.copy.openLabel).toBe('Request Inventory')
    expect(leadCampaign.copy.openLabel).toBe(CTA_LABEL)
    expect(leadCampaign.formName).toBe('fall_financing_enquiry')
  })
})
