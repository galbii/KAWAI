import { storeContactLines } from './store'
import type { SaleStore } from './types'

/**
 * "Contact the store" and the store's own name, address and phone, from the
 * storefront record (kawai-store-contact-banner v1, Nov 24, 2026). Set like a
 * note; the phone is a tel: link. A missing address or phone is left out.
 */
export function StoreContact({ lead, store }: { lead: string; store: SaleStore }) {
  const c = storeContactLines(store)
  return (
    <div
      data-reveal="rise"
      data-sale-store-contact={store.slug}
      className="mt-6 border-l-[3px] border-kawai-red pl-4 text-sm leading-relaxed text-kawai-black/85"
    >
      <p className="font-semibold text-kawai-black">{lead}</p>
      <p className="mt-1 font-medium">{c.name}</p>
      {c.address && <p>{c.address}</p>}
      {c.phone && c.tel && (
        <p>
          <a href={c.tel} className="font-medium text-kawai-red underline-offset-4 hover:underline">
            {c.phone}
          </a>
        </p>
      )}
    </div>
  )
}
