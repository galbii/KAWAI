import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'bun:test'
import { toSaleStore } from '@/components/sale-template/store'
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
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor } from '@/app/(frontend)/fall-financing/_components/slides'
import { fallFinancingSale as sale } from './_content'

describe('store fall-financing: copy is the national copy, word for word', () => {
  it('uses the national hero opener', () => {
    const opener = heroOpenerFor('us')
    expect(`${sale.hero.titleLead} ${sale.hero.titleAccent}`).toBe(opener.title)
    expect(sale.hero.body).toBe(opener.body ?? '')
  })

  it('carries each promo heading, standfirst and fine print unchanged', () => {
    const byId = Object.fromEntries(sale.promos.map((p) => [p.id, p]))
    expect(byId.headphones?.heading).toEqual({ kind: 'text', text: bundle.heading })
    expect(byId.headphones?.body).toBe(bundle.standfirst)
    expect(byId.headphones?.fineprint).toEqual([bundle.disclaimer])
    expect(byId.rebates?.heading).toEqual({ kind: 'text', text: rebateCopyFor('us').heading })
    expect(byId.rebates?.body).toBe(rebate.standfirst)
    expect(byId.rebates?.fineprint).toEqual([rebate.disclaimer])
    expect(byId.lessons?.body).toBe(lessons.standfirst)
    expect(sale.close).toEqual({ eyebrow: coda.eyebrow, heading: coda.heading, body: coda.body })
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

  it('puts no rate figure in the hero or the highlights (metadata reuses the hero)', () => {
    const text = [sale.hero.titleLead, sale.hero.titleAccent, sale.hero.body, ...sale.highlights.map((h) => h.detail)]
    for (const t of text) expect(t).not.toMatch(/\d+(\.\d+)?%/)
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
