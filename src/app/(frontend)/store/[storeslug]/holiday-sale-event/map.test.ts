import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'bun:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { SaleMap } from '@/components/sale-template/SaleMap'
import { mapEmbedSrc, toSaleStore } from '@/components/sale-template/store'

/**
 * The showroom map (Chance, Nov 19, 2026: "can we have a map on the page just
 * like the homepage"): the store homepage's Google Maps embed, on the
 * storefront's own address, in the location band.
 */
const dallas = toSaleStore(
  {
    showroomInfo: { name: 'Kawai Dallas', address: '601 W Plano Pkwy Ste 153, Plano, TX 75075', phone: '(972) 379-2200' },
  },
  'dallas',
)
const KEY = 'test-maps-key'
const html = (store = dallas, key: string | undefined = KEY) =>
  renderToString(createElement(SaleMap, { store, apiKey: key }))
const htmlNoKey = (key: string | undefined) => renderToString(createElement(SaleMap, { store: dallas, apiKey: key }))
const templateDir = new URL('../../../../../components/sale-template/', import.meta.url)
const homepageMap = readFileSync(new URL('../homepage/showroom-location.tsx', templateDir), 'utf8')
const bar = readFileSync(new URL('SaleLocationBar.tsx', templateDir), 'utf8')

describe('store holiday-sale-event: the showroom map', () => {
  it('embeds the store address with the homepage map URL', () => {
    const src = `https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${encodeURIComponent(dallas.address ?? '')}&zoom=15`
    expect(mapEmbedSrc(dallas, KEY)).toBe(src)
    // Same Embed API query and zoom as the store homepage's ShowroomLocation.
    expect(homepageMap).toContain('https://www.google.com/maps/embed/v1/place?key=')
    expect(homepageMap).toContain('&zoom=15')
    const out = html()
    expect(out).toContain('<iframe')
    expect(out).toContain(src.replaceAll('&', '&amp;'))
  })

  it('is lazy-loaded and titled with the store name and address', () => {
    const out = html()
    expect(out).toContain('loading="lazy"')
    expect(out).toContain('title="Map of Kawai Dallas, 601 W Plano Pkwy Ste 153, Plano, TX 75075"')
    expect(out).not.toMatch(/rounded/)
  })

  it('renders nothing without an address or a Maps key', () => {
    expect(html(toSaleStore({ showroomInfo: { name: 'No Address' } }, 'x'))).toBe('')
    expect(htmlNoKey(undefined)).toBe('')
    expect(htmlNoKey('')).toBe('')
  })

  it('sits in the location band, fed the public Maps key', () => {
    expect(bar).toContain('<SaleMap store={store} apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} />')
  })
})
