import { SaleHero } from './SaleHero'
import { SaleLocationBar } from './SaleLocationBar'
import { SalePromos } from './SalePromos'
import { SaleClose } from './SaleClose'
import type { SaleContent, SaleStore } from './types'

/**
 * One store's sale page — the holiday landing page (kawai-holiday-financing-
 * landing, Chance, Nov 17, 2026). Order, as set Nov 10 and kept:
 * hero → that store's location → offers → Call Now / Schedule Visit.
 *
 * Branding, from the comps: a white, clean field; black heavy display serif
 * for setup lines; one Kawai red script word per headline (Holiday, Played,
 * Holidays, Sound); the red wordmark over "Instrumental to Life"; image-led
 * spreads. It replaces the Nov 10 gift-wrap treatment (dark scrim, satin
 * ribbon and bow, snowfall, gold italic accent) outright.
 *
 * Isolation: this template is rendered only by
 * /store/[storeslug]/fall-financing. It imports no UI from the national
 * /fall-financing page and the national page imports nothing from here; the
 * two share copy only (the store route's `_content.ts` reads campaign.ts).
 * Fonts are applied inline inside this tree (tokens.ts), never globally.
 *
 * The template holds no campaign words: everything comes in through `content`
 * and `store`.
 */
export function SaleTemplate({ content, store }: { content: SaleContent; store: SaleStore }) {
  return (
    <div data-sale-template className="bg-white text-kawai-black">
      <SaleHero hero={content.hero} store={store} callLabel={content.callLabel} tagline={content.tagline} />
      <SaleLocationBar store={store} />
      <SalePromos
        intro={content.intro}
        highlights={content.highlights}
        promos={content.promos}
        moments={content.moments}
      />
      <SaleClose close={content.close} store={store} callLabel={content.callLabel} tagline={content.tagline} />
    </div>
  )
}
