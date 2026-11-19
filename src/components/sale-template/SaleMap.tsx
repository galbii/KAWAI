import { mapEmbedSrc } from './store'
import type { SaleStore } from './types'

/**
 * The showroom on a map, as on the store homepage (Chance, Nov 19, 2026: "can
 * we have a map on the page just like the homepage"). Same Google Maps embed,
 * set in the sale template's terms: square corners and a neutral hairline,
 * wide on desktop and taller on phones so the pin is not lost.
 *
 * Lazy-loaded (it sits below the hero) and titled for screen readers. Renders
 * It is a direct child of the location band's grid, so it spans the full
 * row there. Renders nothing without a store address or a Maps key: the address and the
 * directions link beside it still say where the showroom is.
 */
export function SaleMap({ store, apiKey }: { store: SaleStore; apiKey: string | null | undefined }) {
  const src = mapEmbedSrc(store, apiKey)
  if (!src || !store.address) return null

  return (
    <div
      data-sale-map
      data-reveal="fade"
      className="relative aspect-[4/3] w-full lg:col-span-12 overflow-hidden border border-kawai-neutral bg-white sm:aspect-[16/7]"
    >
      <iframe
        title={`Map of ${store.name}, ${store.address}`}
        src={src}
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
