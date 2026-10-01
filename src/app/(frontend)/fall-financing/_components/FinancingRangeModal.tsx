'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Modal } from '@/components/ui/modal'
import { PromoCta } from '@/components/fall-promo'
import { useLeadCampaign } from '@/components/campaign-lead'
import { formatPrice } from '@/lib/utils'
import { planFor } from '@/lib/financing/plan'
import { FALL_2026 } from '@/lib/financing/terms'
import { financing, CTA_LABEL_SHORT } from './campaign'
import type { FinancedProduct } from '@/lib/payload/financing-types'

/** One Shopify collection of eligible instruments, as the section groups them. */
export interface FinancingRange {
  handle: string
  title: string
  group: string
  art?: string
  products: FinancedProduct[]
}

/**
 * The models in one range, opened from its panel.
 *
 * Mirrors the SH-9 bundle's series dialog — photographic band carrying the
 * heading, then the models as rows — so opening a panel lands somewhere that
 * still looks like the panel that was clicked.
 *
 * Each row carries the monthly payment, prefixed "as low as" because the figure
 * is the payment during the promotional window and rises when that window
 * closes. The note under the list is the qualifier that must travel with any
 * quoted payment; the full stream, the APR and the down-payment rule are in the
 * Supporting Disclosure, which is visible on the page and not reachable from
 * here by design (§4.4).
 *
 * §5: the model name links to its product page — for an acoustic that page
 * carries a dealer CTA and no cart control — and the row's button opens the
 * enquiry form. Neither is a store link.
 */
export function FinancingRangeModal({
  range,
  onClose,
}: {
  range: FinancingRange | null
  onClose: () => void
}) {
  const { open: openLead } = useLeadCampaign()

  return (
    <Modal
      isOpen={range !== null}
      onClose={onClose}
      size="full"
      className="promo promo-a promo-on-light max-h-[86vh] overflow-y-auto !p-0"
    >
      {range && (
        <div>
          <div className="relative overflow-hidden">
            {range.art ? (
              <div className="relative h-40 w-full sm:h-56">
                <Image src={range.art} alt="" fill sizes="90vw" className="object-cover" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(29,27,24,0.82) 0%, rgba(29,27,24,0.58) 55%, rgba(29,27,24,0.38) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="promo-label text-[color:var(--ivory)]/85">{range.group}</p>
                  <h3 className="promo-h2 promo-photo-text mt-1 text-[1.6rem] text-[color:var(--ivory)] sm:text-[2.1rem]">
                    {range.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="p-6 pb-0 sm:p-8 sm:pb-0">
                <p className="promo-label text-[color:var(--body-dim)]">{range.group}</p>
                <h3 className="promo-h2 mt-1 text-[1.6rem] text-[color:var(--on-ground)] sm:text-[2.1rem]">
                  {range.title}
                </h3>
              </div>
            )}
          </div>

          <ul className="grid gap-3 p-6 sm:p-8 lg:grid-cols-2">
            {range.products.map((product) => (
              <ModelRow
                key={product.slug}
                product={product}
                onAsk={() => {
                  // Close this dialog before opening the lead one: two stacked
                  // dialogs fight over the focus trap, and the reader has
                  // finished with the list once they have picked a model.
                  onClose()
                  openLead()
                }}
              />
            ))}
          </ul>

          <p className="px-6 pb-6 text-[0.76rem] leading-relaxed text-[color:var(--body-dim)] sm:px-8 sm:pb-8">
            {financing.paymentNote}
          </p>
        </div>
      )}
    </Modal>
  )
}

function ModelRow({ product, onAsk }: { product: FinancedProduct; onAsk: () => void }) {
  // No published price, no honest payment. The Shigeru line is sold by
  // consultation and never carries one, so those rows say so instead.
  const plan = product.price == null ? null : planFor(product.price, FALL_2026)

  return (
    <li className="flex items-center gap-4 border border-[color:var(--rule-soft)] bg-[color:var(--surface)] p-3 sm:gap-5 sm:p-4">
      <span className="relative h-16 w-20 shrink-0 overflow-hidden bg-white sm:h-20 sm:w-24">
        {product.imageUrl && (
          <Image src={product.imageUrl} alt="" fill sizes="96px" className="object-contain p-1.5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="promo-focus promo-body block truncate text-[1.02rem] font-medium text-[color:var(--on-ground)] hover:underline"
        >
          {product.label}
        </Link>
        {plan ? (
          <>
            <span className="promo-body mt-1 block text-[0.72rem] text-[color:var(--body-dim)]">
              {financing.fromPrefix}
            </span>
            <span className="promo-num block text-[0.95rem] text-[color:var(--on-ground)]">
              {formatPrice(Math.round(plan.introMonthly))}
              <span className="text-[0.78rem] text-[color:var(--body-dim)]">/mo</span>
            </span>
          </>
        ) : (
          <span className="promo-body mt-1 block text-[0.85rem] text-[color:var(--body-dim)]">
            {financing.onRequest}
          </span>
        )}
      </span>

      <PromoCta size="compact" onClick={onAsk} hasPopup="dialog">
        {CTA_LABEL_SHORT}
      </PromoCta>
    </li>
  )
}
