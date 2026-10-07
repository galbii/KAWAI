/**
 * How this page writes an amount.
 *
 * USD reads "$1,549", as everywhere on kawaius.com. CAD reads "$2,049 CAD":
 * a dollar sign a Canadian shopper recognises, with the currency named after
 * it so the figure can never be mistaken for the US one.
 *
 * Page-local on purpose. The rest of ca.kawaius.com writes CAD as "CAD2,049"
 * through the shared `formatPrice`, and changing that is a site-wide decision
 * this campaign does not make. Everything on this page that prints money —
 * the ledgers, the bundle's model rows, the rebate card, the ES heading —
 * goes through here, so the page never mixes the two styles.
 *
 * Whole dollars: these are list prices and rebates, not quotes.
 */
const DOLLARS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatOfferPrice(amount: number, currency: 'USD' | 'CAD' = 'USD'): string {
  const figure = DOLLARS.format(amount)
  return currency === 'CAD' ? `${figure} CAD` : figure
}
