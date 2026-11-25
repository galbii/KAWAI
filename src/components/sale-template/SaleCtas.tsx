'use client'

import { useEffect, useState } from 'react'
import { ArrowRightIcon, PhoneIcon } from '@heroicons/react/24/solid'
import { useLeadCampaign } from '@/components/campaign-lead'
import { telHref } from './store'
import { SANS } from './tokens'
import type { SaleCta, SaleStore } from './types'

/**
 * The page's two actions, everywhere a visitor might want them
 * (kawai-holiday-financing-landing v2, Chance, Nov 19, 2026):
 *
 * - Primary, solid Kawai red: `cta.requestLabel` ("Request Inventory"). It
 *   opens the page's lead dialog — the campaign-lead provider the route wraps
 *   the template in — so there is one form, never a second one per button.
 * - Secondary, black outline: `callLabel` ("Call Now"), a tel: link to the
 *   store's own phone. Omitted when the storefront has no phone.
 *
 * The template still holds no words of its own: both labels arrive through
 * content. `data-cta` / `data-cta-placement` mark each button for analytics
 * tags already on the site to read; they add no tracking of their own.
 */

type Size = 'md' | 'lg'

const BASE =
  'inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full font-semibold transition duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'
const SIZE: Record<Size, string> = {
  // min-h keeps every tap target at least 48px tall on phones.
  md: 'min-h-12 px-7 py-3 text-sm',
  lg: 'min-h-14 px-8 py-4 text-base',
}

export function SaleRequestButton({
  label,
  placement,
  size = 'md',
  className = '',
  arrow = true,
}: {
  label: string
  placement: string
  size?: Size
  className?: string
  arrow?: boolean
}) {
  const { open } = useLeadCampaign()
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      data-cta="request-inventory"
      data-cta-placement={placement}
      className={`group ${BASE} ${SIZE[size]} bg-kawai-red text-white shadow-[0_14px_30px_-16px_var(--color-kawai-red)] hover:bg-kawai-red-700 focus-visible:outline-kawai-red ${className}`}
      style={{ fontFamily: SANS }}
    >
      {label}
      {arrow && <ArrowRightIcon aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  )
}

export function SaleCallButton({
  label,
  tel,
  placement,
  size = 'md',
  className = '',
}: {
  label: string
  tel: string
  placement: string
  size?: Size
  className?: string
}) {
  return (
    <a
      href={tel}
      data-cta="call-now"
      data-cta-placement={placement}
      className={`group ${BASE} ${SIZE[size]} border-2 border-kawai-black bg-white text-kawai-black hover:bg-kawai-black hover:text-white focus-visible:outline-kawai-black ${className}`}
      style={{ fontFamily: SANS }}
    >
      <PhoneIcon aria-hidden className="h-4 w-4 transition-transform group-hover:-rotate-12" />
      {label}
    </a>
  )
}

/**
 * Request Inventory + Call Now, side by side from `sm`, stacked full width
 * (to a readable cap) on phones so both are thumb-sized. When the content
 * sets `cta.note`, that line sits directly under the buttons.
 */
export function SaleCtaPair({
  cta,
  callLabel,
  store,
  placement,
  size = 'md',
  align = 'center',
  tone = 'light',
  className = '',
}: {
  cta: SaleCta
  callLabel: string
  /** Optional: without a store there is no tel: link, so Request Inventory stands alone. */
  store?: SaleStore | undefined
  placement: string
  size?: Size
  align?: 'center' | 'start'
  /**
   * `dark`: the note is set in white for a scrimmed photograph (the cinematic
   * close). `light` (default) is unchanged.
   */
  tone?: 'light' | 'dark'
  className?: string
}) {
  const tel = store ? telHref(store) : null
  const note = cta.note
  const justify = align === 'center' ? 'items-stretch sm:items-center sm:justify-center' : 'items-stretch sm:items-center sm:justify-start'
  const pair = (
    <div
      data-sale-cta={placement}
      className={`flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 ${justify} ${note ? '' : className}`}
    >
      <SaleRequestButton label={cta.requestLabel} placement={placement} size={size} />
      {tel && <SaleCallButton label={callLabel} tel={tel} placement={placement} size={size} />}
    </div>
  )
  // No note (the store pages): the pair alone, markup unchanged.
  if (!note) return pair
  // Every pair sits on white or pearl (the hero's type column is white beside
  // the photo, never over it), so one style serves all: kawai-muted #595959
  // is ~7:1 on white and ~6.7:1 on pearl, clearing AA 4.5:1. A plain <p>,
  // never a heading.
  return (
    <div
      className={`flex w-full flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} ${className}`}
    >
      {pair}
      <p
        data-sale-cta-note={placement}
        className={`mt-3 max-w-sm text-sm font-medium leading-snug ${tone === 'dark' ? 'text-white/90' : 'text-kawai-muted'} sm:max-w-none`}
        style={{ fontFamily: SANS }}
      >
        {note}
      </p>
    </div>
  )
}

/**
 * Height of the site's own floating mobile search pill (SearchBar.tsx, fixed
 * to the bottom below `md`, z-9003): 1rem padding + a 1rem-padded 1.5rem row
 * + 1rem padding, rounded up. The bar floats just above it, never under it.
 */
const SITE_SEARCH_PILL = '5.75rem'

/**
 * Phones only: a bar pinned to the bottom of the screen carrying both actions,
 * so neither is ever more than a thumb away on a long page.
 *
 * It stays out of the way while the hero's own buttons are on screen and
 * leaves for good once the close's buttons come up, so it never sits over
 * the close, the fine print beneath it or the footer. Hidden from `sm` up,
 * where every section already has its own pair within reach. It sits above
 * the site's search pill and below every dialog and overlay (z-40).
 */
export function SaleStickyCtas({
  cta,
  callLabel,
  store,
  startId,
  endId,
}: {
  cta: SaleCta
  callLabel: string
  store?: SaleStore | undefined
  /** The hero's CTA row: the bar shows once this has scrolled off the top. */
  startId: string
  /** The close's CTA row: the bar hides once this reaches the screen. */
  endId: string
}) {
  const [shown, setShown] = useState(false)
  const tel = store ? telHref(store) : null

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const start = document.getElementById(startId)
      const end = document.getElementById(endId)
      if (!start || !end) return setShown(false)
      const vh = window.innerHeight
      setShown(start.getBoundingClientRect().bottom < 0 && end.getBoundingClientRect().top > vh)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [startId, endId])

  return (
    <div
      data-sale-sticky
      aria-hidden={!shown}
      inert={!shown}
      className={`pointer-events-none fixed inset-x-0 z-40 px-4 transition duration-300 sm:hidden ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ bottom: `calc(${SITE_SEARCH_PILL} + env(safe-area-inset-bottom))` }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl gap-2.5 rounded-full bg-white/90 p-1.5 shadow-[0_18px_40px_-16px_color-mix(in_srgb,var(--color-kawai-black)_55%,transparent)] ring-1 ring-kawai-black/10 backdrop-blur">
        <SaleRequestButton
          label={cta.requestLabel}
          placement="sticky"
          arrow={false}
          className="flex-[1.35] px-3 text-[0.9rem] shadow-none"
        />
        {tel && <SaleCallButton label={callLabel} tel={tel} placement="sticky" className="flex-1 px-3 text-[0.9rem]" />}
      </div>
    </div>
  )
}
