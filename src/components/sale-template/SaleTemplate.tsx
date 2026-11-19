import { SaleHero } from './SaleHero'
import { SaleLocationBar } from './SaleLocationBar'
import { SalePromos } from './SalePromos'
import { SaleClose } from './SaleClose'
import { SaleStickyCtas } from './SaleCtas'
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
 * Color division (v4, Nov 19, 2026): the white field is broken into blocks
 * from the existing Kawai palette only — a Kawai red band at the top of the
 * hero and at the head of the close, Kawai pearl bands under the location
 * and behind every other offer spread. No new colors; contrast is AA on each.
 *
 * Isolation: this template is rendered only by
 * /store/[storeslug]/fall-financing. It imports no UI from the national
 * /fall-financing page and the national page imports nothing from here; the
 * two share copy only (the store route's `_content.ts` reads campaign.ts).
 * Fonts are applied inline inside this tree (tokens.ts), never globally.
 *
 * The template holds no campaign words: everything comes in through `content`
 * and `store`.
 *
 * Actions (v2, Nov 19, 2026): Request Inventory (primary) and Call Now
 * (secondary) sit in the hero, the location band, under the offer index, in
 * each offer spread that asks for them and in the close, plus a bar pinned to
 * the bottom of the screen on phones between the hero's pair and the close's.
 * Request Inventory opens the lead dialog of the campaign-lead provider, so
 * the route MUST wrap this template in a `LeadCampaignProvider`.
 */
export const HERO_CTA_ID = 'sale-cta-hero'
export const CLOSE_CTA_ID = 'sale-cta-close'

export function SaleTemplate({ content, store }: { content: SaleContent; store: SaleStore }) {
  return (
    <div data-sale-template className="bg-white text-kawai-black">
      <SaleHero
        hero={content.hero}
        store={store}
        cta={content.cta}
        callLabel={content.callLabel}
        ctaId={HERO_CTA_ID}
      />
      <SaleLocationBar store={store} cta={content.cta} />
      <SalePromos
        intro={content.intro}
        highlights={content.highlights}
        promos={content.promos}
        moments={content.moments}
        cta={content.cta}
        callLabel={content.callLabel}
        store={store}
      />
      <SaleClose
        close={content.close}
        store={store}
        cta={content.cta}
        callLabel={content.callLabel}
        tagline={content.tagline}
        ctaId={CLOSE_CTA_ID}
      />
      <SaleStickyCtas
        cta={content.cta}
        callLabel={content.callLabel}
        store={store}
        startId={HERO_CTA_ID}
        endId={CLOSE_CTA_ID}
      />
    </div>
  )
}
