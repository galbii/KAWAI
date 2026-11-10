import { SaleHero } from './SaleHero'
import { SaleLocationBar } from './SaleLocationBar'
import { SalePromos } from './SalePromos'
import { SaleClose } from './SaleClose'
import type { SaleContent, SaleStore } from './types'

/**
 * One store's sale page, in the order Chance set (Nov 10, 2026):
 * hero → that store's location block → promos → Call Now / Schedule Visit.
 *
 * Styling follows the holiday flyers (red / white / cream-gold, serif with a
 * red italic accent, red-check list, red location bar). The template holds no
 * campaign words: everything comes in through `content` and `store`.
 */
export function SaleTemplate({ content, store }: { content: SaleContent; store: SaleStore }) {
  return (
    <div data-sale-template className="bg-white text-kawai-black">
      <SaleHero hero={content.hero} storeName={store.name} />
      <SaleLocationBar store={store} />
      <SalePromos highlights={content.highlights} promos={content.promos} />
      <SaleClose close={content.close} store={store} callLabel={content.callLabel} />
    </div>
  )
}
