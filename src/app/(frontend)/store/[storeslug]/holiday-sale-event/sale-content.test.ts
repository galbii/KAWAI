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
  FINANCING_RANGE,
  PROGRAM_END,
  TERMS_SENTENCE,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { leadCampaign } from '@/app/(frontend)/fall-financing/_components/lead-campaign'
import { heroOpenerFor } from '@/app/(frontend)/fall-financing/_components/slides'
import { fallFinancingSale as sale, HEADLINES, HERO_BADGE, REQUEST_LABEL, SALE_EVENT, TAGLINE } from './_content'
import { storeLeadCampaign } from './lead'
import { RETIRED_STORE_SALE_PATH, STORE_SALE_PATH } from './sale-path'

describe('store holiday-sale-event: the holiday headlines are the approved set', () => {
  // Chance's comps, Nov 17, 2026, with the two source-art typos corrected.
  it('sets the hero to the primary lockup', () => {
    expect(lockupText(sale.hero.lockup)).toBe('Make the first note a Holiday memory')
    expect(sale.hero.lockup).toEqual(HEADLINES.hero)
  })

  it('carries the other four lockups word for word', () => {
    expect(lockupText(HEADLINES.played)).toBe('Some gifts get unwrapped This one gets Played')
    expect(lockupText(HEADLINES.instrumental)).toBe('Instrumental to the Holidays')
    expect(lockupText(HEADLINES.soundtrack)).toBe('Make your soundtrack for the Holidays')
    expect(lockupText(HEADLINES.sound)).toBe('Your holidays have photos Give them a Sound')
    const used = [...sale.moments.map((m) => m.lockup), sale.close.lockup]
    for (const h of [HEADLINES.played, HEADLINES.instrumental, HEADLINES.soundtrack, HEADLINES.sound]) {
      expect(used).toContainEqual(h)
    }
  })

  it('sets one red script word per headline', () => {
    const scripts = [sale.hero.lockup, ...sale.moments.map((m) => m.lockup), sale.close.lockup].map((l) => l.script)
    expect(scripts.sort()).toEqual(['Holiday', 'Holidays', 'Holidays', 'Played', 'Sound'])
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

describe('store holiday-sale-event: offer copy is the national copy, word for word', () => {
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
    expect(sale.close.body).toBe(coda.body)
  })

  it('keeps the promos in the national order', () => {
    expect(sale.promos.map((p) => p.id)).toEqual(['headphones', 'financing', 'rebates', 'lessons'])
  })
})

describe('store holiday-sale-event: the credit advertisement stays with its disclosure', () => {
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
      `${sale.hero.badge?.lead ?? ''} ${sale.hero.badge?.script ?? ''}`,
      sale.hero.support,
      sale.close.eyebrow,
      sale.close.heading,
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

describe('store holiday-sale-event: route config', () => {
  // getSite() uses headers(), so this page cannot be ISR. A source assertion
  // is enough: importing page.tsx pulls in server-only modules.
  const src = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

  it('is force-dynamic so getSite()/headers() is legal on next start', () => {
    expect(src).toMatch(/export const dynamic = 'force-dynamic'/)
    expect(src).not.toMatch(/export const revalidate/)
    expect(src).not.toMatch(/export async function generateStaticParams/)
  })
})

describe('store holiday-sale-event: isolated from the national page', () => {
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

describe('store holiday-sale-event v2: Request Inventory + Call Now everywhere', () => {
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

describe('store holiday-sale-event v2: the lead form is the national enquiry, reused', () => {
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

describe('store holiday-sale-event v5: the sale event ends December 31, 2026, with every offer', () => {
  // v3 added the sale event (Chance, #qa / card thread 1572326447140438136,
  // 9:35 AM PT Nov 19, 2026). v5, same thread, 12:19 PM PT Nov 19, 2026: "the
  // dates should be to the 31st of december across site, creatives, and meta
  // copy sheet."
  const fin = sale.promos.find((p) => p.id === 'financing')
  // Every way the retired end date could be written.
  const OLD_DATE = /Dec(ember)?\.?\s*5(th)?\b|\b5th\b|2026-12-05/i

  it('the hero and the close carry the sale event, ending on PROGRAM_END', () => {
    expect(SALE_EVENT).toEqual({
      label: 'Sale Event',
      offers: 'Exclusive offers until December 31, 2026',
      ends: 'Sale event ends December 31, 2026.',
    })
    expect(sale.hero.support).toBe(`Exclusive offers until ${PROGRAM_END}`)
    expect(sale.close.eyebrow).toBe('Limited Time Offer')
    expect(sale.close.heading).toBe(`Sale event ends ${PROGRAM_END}.`)
  })

  it('has no retired sale-event date left anywhere on the page', () => {
    expect(JSON.stringify(sale)).not.toMatch(OLD_DATE)
  })

  it('shows one end date: every dated line on the page is December 31, 2026', () => {
    const all = JSON.stringify(sale)
    const dates = all.match(/(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}(st|nd|rd|th)?,? \d{4}/g) ?? []
    expect(dates.length).toBeGreaterThan(0)
    for (const d of dates) expect(d).toBe('December 31, 2026')
    // The hero and the close agree with each other and with the offers' terms.
    expect(sale.hero.support).toContain(PROGRAM_END)
    expect(sale.close.heading).toContain(PROGRAM_END)
    expect(sale.close.heading).not.toBe(coda.heading)
  })

  it('keeps the financing legal and the other offer dates verbatim (December 31, 2026)', () => {
    expect(PROGRAM_END).toBe('December 31, 2026')
    expect(FINANCING_RANGE).toBe('October 1 – December 31, 2026')
    expect(coda.heading).toBe('Offers end December 31, 2026')
    expect(financing.subhead.startsWith(TERMS_SENTENCE)).toBe(true)
    expect(TERMS_SENTENCE).toContain(FINANCING_RANGE)
    expect(sale.promos.find((p) => p.id === 'headphones')?.eyebrow).toBe('Through December 31, 2026')
    // The credit advertisement carries no marketing line: no sale-event copy in it.
    expect(JSON.stringify(fin)).not.toContain(SALE_EVENT.offers)
    expect(JSON.stringify(fin)).not.toContain(SALE_EVENT.ends)
  })
})

describe('store holiday-sale-event v4: fewer words, color division, Instrumental to the Holidays', () => {
  // Chance, #qa / card thread 1572326447140438136, 10:28 AM PT Nov 19, 2026:
  // "Can we redo the hero, too many words. Also I don't like instrumental to
  // holiday do instrumental to the holidays. I want a little bit more color
  // division. This of something cleaner for the graphics like Limited Time
  // “offer”".
  const templateDir = new URL('../../../../../components/sale-template/', import.meta.url)
  const read = (f: string) => readFileSync(new URL(f, templateDir), 'utf8')
  const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  it('the hero is badge, headline, one support line and the CTA pair, nothing else', () => {
    expect(Object.keys(sale.hero).sort()).toEqual(['badge', 'image', 'inset', 'lockup', 'support'])
    expect(sale.hero.badge).toEqual(HERO_BADGE)
    expect(`${HERO_BADGE.lead} ${HERO_BADGE.script}`).toBe('Limited Time Offer')
    const words = [`${HERO_BADGE.lead} ${HERO_BADGE.script}`, lockupText(sale.hero.lockup), sale.hero.support]
      .join(' ')
      .split(/\s+/).length
    // v3's stack was 29 words before the buttons (pill, event line, lockup,
    // two-line sub-line, end line); v4 keeps it under 20.
    expect(words).toBeLessThan(20)
  })

  it('renders badge above the headline, then the support line, then the actions', () => {
    const hero = code('SaleHero.tsx')
    const badge = hero.indexOf('hero.badge.lead')
    const h1 = hero.indexOf('<Lockup lockup={hero.lockup}')
    const support = hero.indexOf('{hero.support}')
    const pair = hero.search(/<SaleCtaPair[^>]*placement="hero"/)
    expect(badge).toBeGreaterThan(0)
    expect(badge).toBeLessThan(h1)
    expect(h1).toBeLessThan(support)
    expect(support).toBeLessThan(pair)
    // No second paragraph, no second date line, no wordmark in the hero.
    expect(hero).not.toContain('subline')
    expect(hero).not.toContain('ending')
    expect(hero).not.toContain('<Wordmark')
  })

  it('keeps the sale-event date in the hero (v5: December 31, 2026)', () => {
    expect(sale.hero.support).toContain('December 31, 2026')
  })

  it('blocks the page in the existing Kawai palette only', () => {
    expect(code('SaleHero.tsx')).toContain('bg-kawai-red')
    expect(code('SaleClose.tsx')).toContain('bg-kawai-red')
    expect(code('SaleLocationBar.tsx')).toContain('bg-kawai-pearl')
    expect(code('SalePromos.tsx')).toContain('bg-kawai-pearl')
    // v5 polish: the pearl bands get neutral hairline edges, so they read as
    // blocks against the white field without darkening the pearl (a darker
    // tint drops the red eyebrows under AA 4.5:1).
    expect(code('SaleLocationBar.tsx')).toContain('border-y border-kawai-neutral')
    expect(code('SalePromos.tsx')).toContain('border-y border-kawai-neutral')
    const all = readdirSync(templateDir)
      .filter((f) => f.endsWith('.tsx'))
      .map(code)
      .join('\n')
    // No hand-typed colors: every band is a palette token.
    expect(all).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(all).not.toMatch(/rgb\(/)
  })

  it('says "Instrumental to the Holidays" and never "Instrumental to Holiday"', () => {
    const all = JSON.stringify(sale)
    expect(lockupText(sale.close.lockup)).toBe('Instrumental to the Holidays')
    expect(all.replace(/Instrumental to the Holidays/g, '')).not.toMatch(/Instrumental to (the )?Holiday/i)
    expect(sale.tagline).toBe('Instrumental to Life')
  })
})

describe('store holiday-sale-event v6: the page moved from /fall-financing', () => {
  // Chance, #qa / card thread 1572326447140438136, 1:05 PM PT Nov 19, 2026:
  // "make sure this page's endpoint is at store/[slug]/holdiay-sale-event"
  // (read as holiday-sale-event).
  const root = new URL('../../../../../../', import.meta.url)
  const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
  const config = readFileSync(new URL('next.config.ts', root), 'utf8')
  const sitemap = readFileSync(new URL('src/app/sitemap.ts', root), 'utf8')

  it('lives at store/[storeslug]/holiday-sale-event, and the old store folder is gone', () => {
    expect(STORE_SALE_PATH).toBe('holiday-sale-event')
    expect(decodeURIComponent(new URL('.', import.meta.url).pathname)).toMatch(/\/store\/\[storeslug\]\/holiday-sale-event\/$/)
    expect(readdirSync(new URL('..', import.meta.url))).not.toContain(RETIRED_STORE_SALE_PATH)
  })

  it('sets its canonical and og:url to the new path', () => {
    expect(page).toMatch(/const url = `\$\{getSiteUrl\(site\)\}\/store\/\$\{storeslug\}\/\$\{STORE_SALE_PATH\}`/)
    expect(page).toMatch(/alternates: \{ canonical: url \}/)
    expect(page).not.toMatch(/\/fall-financing`/)
  })

  it('permanently redirects every store slug from the old path (national /fall-financing untouched)', () => {
    const block = config.match(/\{\s*source: '\/store\/:storeslug\/fall-financing',[\s\S]*?\}/)?.[0] ?? ''
    expect(block).toContain(`destination: '/store/:storeslug/${STORE_SALE_PATH}'`)
    expect(block).toMatch(/permanent: true/)
    expect(config).not.toMatch(/source: '\/fall-financing'/)
  })

  it('is listed in the sitemap for every active storefront', () => {
    expect(sitemap).toMatch(/add\(`\/store\/\$\{s\.slug\}\/\$\{STORE_SALE_PATH\}`/)
    expect(sitemap).not.toMatch(/\/store\/\$\{s\.slug\}\/fall-financing/)
  })
})
