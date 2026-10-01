'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn, formatPrice } from '@/lib/utils'
import { getRebateModelDetail } from '@/lib/actions/rebate-model-detail'
import type { RebateModelDetail, RebateProduct } from '@/lib/payload/rebate-types'
import { extractYouTubeId as parseYouTubeId } from '@/lib/utils/youtube'

type SpecKey = 'action' | 'tone' | 'features'
type SectionKey = 'details' | SpecKey

const SPEC_SECTIONS: { key: SpecKey; label: string }[] = [
  { key: 'action', label: 'Touch & Action' },
  { key: 'tone', label: 'Sound & Tone' },
  { key: 'features', label: 'Connectivity & Features' },
]

type Props = {
  /** The rebate row this modal details. `null` while closed (last value is retained for the exit). */
  product: RebateProduct | null
  isOpen: boolean
  categoryLabel: string
  /** Shigeru leans further into the gold treatment. */
  isShigeru: boolean
  /**
   * Which house style the card is dressed in.
   *
   * 'gold' is the /signup treatment — serif display, gold savings figure,
   * rounded shell. 'campaign' matches the Back to School page: condensed caps,
   * a red savings figure, square corners and a red edge. The two pages sit in
   * different type systems, and a card that opens out of a ledger row should
   * look like the ledger it came from.
   */
  variant?: 'gold' | 'campaign'
  /**
   * Which palette and type the chosen `variant` is poured in.
   *
   * `variant` is STRUCTURE — the type scale, square or rounded, where the rail
   * sits. `theme` is only the values, so a page can keep the campaign's layout
   * and still paint in its own system. `/fall-financing` needs exactly that:
   * the Back to School structure is right for a card opening out of a ledger
   * row, but kawai-red and Oswald belong to that campaign and not to this one.
   *
   * Defaults to `brand`, whose every value is what this file hardcoded before
   * the theme existed — so a caller that passes no `theme` renders identically.
   */
  theme?: CardTheme
  /**
   * Overrides the card's call to action. The campaign variant is rendered by
   * two pages that ask for different things — /signup3 asks for a sign-up,
   * Back to School asks for a showroom tour — so the label is a prop rather
   * than a second meaning read off `variant`.
   */
  ctaLabel?: string
  /**
   * The quiet link under the primary button. `null` removes it.
   *
   * It is a prop because a page whose every CTA opens one form cannot also
   * offer a link that navigates away from it: on /fall-financing this card sat
   * a "Find a dealer" link directly under a "Find a Kawai Dealer" button, two
   * labels a shopper cannot tell apart going to two different places. That
   * page passes `null`; everyone else gets the locator link as before.
   */
  secondaryCta?: { label: string; href: string } | null
  /** Opens the dealer sign-up offer popup (closes this modal first). */
  onSignUp: () => void
  onClose: () => void
}

/**
 * The colour and type values the card paints with — see the `theme` prop.
 *
 * `promo` is the Fall Promo system on a dark ground. Its accents are split by
 * size exactly as PromoStyles splits them, and the split is forced rather than
 * stylistic: `--money-accent` (#E86A26, 5.34:1 on Ink) is the only one that may
 * carry a label, and `--money-display` (Ember, 3.41:1) is for figures at 24px
 * and over, where 1.4.3's large-text 3:1 applies. Never move the display colour
 * onto a caption. The button is `PromoCta`'s fill and label verbatim, including
 * the white label `--btn-label` exists for — Ivory on Ember is 4.40:1 and fails
 * at button size.
 *
 * Fonts are set as arbitrary `font-[family-name:…]` utilities rather than the
 * `.promo-*` classes. Those classes come from an injected `<style>` tag, so
 * pairing one with a Tailwind font utility leaves the winner down to stylesheet
 * order; an arbitrary utility is something `twMerge` can actually reconcile.
 */
/** Declared here rather than below: the theme table reads it. */
const OSWALD = 'var(--font-oswald), sans-serif'

export type CardTheme = 'brand' | 'promo'

type ThemeTokens = {
  /** Small accent text: the eyebrow, "You save", the rebate note. */
  accentText: string
  accentTextSoft: string
  accentTextDim: string
  /** The savings figure, at display size only. */
  displayText: string
  /** Graphic accents — the spec bullet, the rail mark, the active pill border. */
  accentBar: string
  accentBorder: string
  /** The primary button: fill, hover and label. */
  fill: string
  /** The condensed/label face, and the headline face. */
  capsFont: string
  displayFont: string
  /** For the figures whose size is set inline, beside `fontFamily`. */
  figureFont: string
  /**
   * Undoes the structure's type treatment where a brand rule forbids it.
   *
   * The campaign structure sets its headings `uppercase font-semibold`, which
   * is correct for Oswald and forbidden for Fraunces — PromoStyles is explicit:
   * "Regular weight and sentence case are brand rules, not defaults — do not
   * add a bold variant or an uppercase utility to either of these." So the promo
   * theme resets both. It goes LAST in every `cn()` that uses it, because that
   * is what lets `twMerge` drop the utility it replaces.
   */
  headingReset: string
  /**
   * Extra classes on the modal shell, so the tokens below resolve.
   *
   * It has to be a class and not an inline style: `ModalProps` has no `style`
   * prop, so a token block passed that way is dropped without a type error and
   * every `var()` in this file silently resolves to nothing.
   */
  rootClass: string
}

const THEMES: Record<CardTheme, ThemeTokens> = {
  brand: {
    accentText: 'text-kawai-red-400',
    accentTextSoft: 'text-kawai-red-400/85',
    accentTextDim: 'text-kawai-red-400/90',
    displayText: 'text-kawai-red-400',
    accentBar: 'bg-kawai-red-400',
    accentBorder: 'border-kawai-red',
    fill: 'bg-kawai-red text-white hover:bg-kawai-red-600',
    capsFont: 'font-[family-name:var(--font-oswald)]',
    displayFont: 'font-[family-name:var(--font-oswald)]',
    figureFont: OSWALD,
    headingReset: '',
    rootClass: '',
  },
  promo: {
    accentText: 'text-[color:var(--money-accent)]',
    accentTextSoft: 'text-[color:var(--money-accent)]/85',
    accentTextDim: 'text-[color:var(--money-accent)]/90',
    /**
     * `--money-accent`, not `--money-display`, for the big savings figure.
     *
     * PromoStyles splits money by size because brand Ember is only legible as
     * large text, and `--money-display` is the one that carries it: 3.41:1 on
     * Ink, which clears 1.4.3's large-text 3:1 and nothing more. On a dark
     * ground `.promo-on-dark` deliberately does not define it, and its own note
     * says why — "a dark ground needs a LIGHTER red than Ember". So this figure
     * takes the lifted Ember the dark set does define, at 5.34:1, which passes
     * AA outright rather than only as large text.
     */
    displayText: 'text-[color:var(--money-accent)]',
    accentBar: 'bg-[color:var(--money-accent)]',
    accentBorder: 'border-[color:var(--ember)]',
    fill: 'bg-[color:var(--ember)] text-[color:var(--btn-label)] hover:bg-[color:var(--ember)]/90',
    capsFont: 'font-[family-name:var(--font-instrument)]',
    displayFont: 'font-[family-name:var(--font-fraunces)]',
    figureFont: 'var(--font-instrument), system-ui, sans-serif',
    headingReset: 'normal-case font-normal',
    /**
     * `promo` carries the raw palette (`--ember`, `--btn-label`);
     * `promo-on-dark` re-points the semantic tokens for a dark ground, which is
     * where `--money-accent` and `--focus-ring` come from. Both are needed: the
     * shared Modal portals to the body, so the page's own `.promo.promo-a`
     * scope does not reach in here.
     *
     * Note what this is NOT: `.promo-b`. That class would also supply these
     * tokens, but it is Variation B, it sets a background and a colour of its
     * own, and the campaign's guidelines forbid mixing the two looks. This is a
     * dark region on a Variation A page, which is what `.promo-on-dark` is for.
     */
    rootClass: 'promo promo-on-dark',
  },
}

/** The locator link every caller but /fall-financing shows under the button. */
const DEFAULT_SECONDARY_CTA = { label: 'Find a dealer', href: '/find-a-dealer' } as const


const ARROW = (
  <svg
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const CHEVRON_DOWN = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const EYEBROW = 'font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em]'
const LABEL = 'font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60'

/** The film that plays behind the whole modal — collection video, image, or product photo. */
function FilmBackground({
  videoId,
  imageUrl,
}: {
  videoId: string | null
  imageUrl: string | null
}) {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-kawai-black">
      {videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          allow="autoplay; encrypted-media"
          title=""
        />
      ) : imageUrl ? (
        <Image src={imageUrl} alt="" fill priority className="object-cover" sizes="92vw" />
      ) : null}
      {/* Heavier on the control-panel side so the copy always reads. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/65 to-black/80 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/60 lg:to-black/45" />
    </div>
  )
}

/** MSRP struck, the savings reward at display scale, then the resulting price. */
function RebateReveal({
  product,
  campaign,
  t,
}: {
  product: RebateProduct
  campaign: boolean
  t: ThemeTokens
}) {
  const accent = campaign ? t.displayText : 'text-kawai-gold'
  const accentSoft = campaign ? t.accentTextSoft : 'text-kawai-gold/80'
  const label = campaign ? cn(LABEL, t.capsFont, 'tracking-[0.24em]') : LABEL
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={label}>MSRP</span>
        <span className="text-base text-white/55 line-through">
          {formatPrice(product.msrp, product.currency)}
        </span>
      </div>
      <div className="mt-3">
        <span className={cn(label, accentSoft)}>You save</span>
        <div
          className={cn('mt-1 leading-[0.9]', accent)}
          style={
            campaign
              ? {
                  fontFamily: t.figureFont,
                  fontSize: '4rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                }
              : {
                  fontFamily: 'var(--font-brand-serif)',
                  fontSize: '3.75rem',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                }
          }
        >
          {formatPrice(Math.max(product.msrp - product.yourPrice, 0), product.currency)}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={label}>Your price</span>
        <span
          className="text-2xl text-white"
          style={
            campaign
              ? { fontFamily: t.figureFont, fontWeight: 500 }
              : { fontFamily: 'var(--font-brand-serif)', fontWeight: 500 }
          }
        >
          {formatPrice(product.yourPrice, product.currency)}
        </span>
      </div>
      {product.rebate > 0 && product.msrp - product.yourPrice > product.rebate ? (
        <p
          className={cn(
            'mt-2.5 text-xs font-semibold uppercase tracking-[0.14em]',
            campaign ? t.accentTextDim : 'text-kawai-gold/90',
          )}
          style={campaign ? { fontFamily: t.figureFont } : undefined}
        >
          Includes {formatPrice(product.rebate, product.currency)} instant rebate
        </p>
      ) : null}
      {product.note ? (
        <p className="mt-3 font-[family-name:var(--font-brand-sans)] text-xs font-medium uppercase tracking-[0.1em] text-white/55">
          {product.note}
        </p>
      ) : null}
    </div>
  )
}

export default function RebateModelModal({
  product,
  isOpen,
  categoryLabel,
  isShigeru,
  variant = 'gold',
  theme = 'brand',
  ctaLabel: ctaLabelProp,
  secondaryCta,
  onSignUp,
  onClose,
}: Props) {
  const reduce = useReducedMotion() ?? false
  const campaign = variant === 'campaign'
  const t = THEMES[theme]
  // `undefined` means "the caller did not say", which keeps the locator link
  // every page had before this prop existed. `null` means "the caller said no".
  const secondary = secondaryCta === undefined ? DEFAULT_SECONDARY_CTA : secondaryCta

  // Retain the last product so the close animation has content to render.
  const [shown, setShown] = useState<RebateProduct | null>(product)
  const [detail, setDetail] = useState<RebateModelDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState<SectionKey>('details')
  const [mediaIndex, setMediaIndex] = useState(0)
  // Mobile only: collapse the pricing panel so the active content section fills
  // the screen once the shopper dives into it. Desktop keeps both side-by-side.
  const [pricingOpen, setPricingOpen] = useState(true)

  useEffect(() => {
    if (product) setShown(product)
  }, [product])

  // Lazily load the model's media, specs + film when the modal opens for a product.
  useEffect(() => {
    if (!isOpen || !product) return
    let cancelled = false
    setLoading(true)
    setDetail(null)
    setMediaIndex(0)
    setPricingOpen(true)
    getRebateModelDetail(product.slug)
      .then((d) => {
        if (cancelled) return
        setDetail(d)
        const first: SectionKey =
          d.media.length > 0
            ? 'details'
            : (SPEC_SECTIONS.find((s) => d[s.key].length > 0)?.key ?? 'features')
        setActiveKey(first)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, product])

  // Mobile bottom-sheet swipe refs — declared before the early return below so
  // the hook order stays stable whether or not there's a product to show.
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null)

  const p = product ?? shown
  if (!p) return null

  const media = detail?.media ?? []
  const specSections = SPEC_SECTIONS.filter((s) => (detail?.[s.key]?.length ?? 0) > 0)
  const navSections: { key: SectionKey; label: string }[] = [
    ...(media.length > 0 ? [{ key: 'details' as SectionKey, label: 'Details' }] : []),
    ...specSections,
  ]
  const hasContent = navSections.length > 0
  const activeSpec = SPEC_SECTIONS.find((s) => s.key === activeKey)
  const activeItems = activeSpec ? (detail?.[activeSpec.key] ?? []) : []
  const activeLabel = navSections.find((s) => s.key === activeKey)?.label ?? ''
  const showMedia = activeKey === 'details' && media.length > 0
  const current = media[mediaIndex]
  const stepMedia = (dir: number) => {
    setPricingOpen(false) // mobile: diving into the gallery expands it full-screen
    setMediaIndex((i) => (media.length ? (i + dir + media.length) % media.length : 0))
  }

  // Mobile bottom-sheet swipe: swipe up focuses the content (lower) panel, swipe
  // down brings back the pricing (upper) panel. Reads the content scroll position
  // to tell a real scroll from a sheet swipe, so it never fights the scroller.
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    if (!t) return
    touchRef.current = { x: t.clientX, y: t.clientY, scrollTop: scrollRef.current?.scrollTop ?? 0 }
  }
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchRef.current
    touchRef.current = null
    const t = e.changedTouches[0]
    if (!start || !t) return
    const dy = t.clientY - start.y
    const dx = t.clientX - start.x
    const scrolled = Math.abs((scrollRef.current?.scrollTop ?? 0) - start.scrollTop)
    // Only decisive, mostly-vertical swipes that didn't scroll the content toggle.
    if (scrolled > 6 || Math.abs(dy) < 56 || Math.abs(dx) > Math.abs(dy)) return
    setPricingOpen(dy > 0) // up → collapse pricing (content); down → reveal pricing
  }

  const videoId = reduce ? null : parseYouTubeId(detail?.film?.youtubeUrl ?? null)
  const bgImage = detail?.film?.imageUrl ?? detail?.productImageUrl ?? p.imageUrl

  const handleSignUp = () => {
    onClose()
    onSignUp()
  }

  // Square and heavier on the campaign page — the same button the page's own
  // sections use, so the card doesn't hand off to a differently-shaped CTA.
  const signUpPill = campaign
    ? cn(
        'group inline-flex w-full items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        t.fill,
        t.capsFont,
      )
    : 'group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-kawai-red px-6 py-3.5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-kawai-red/90 hover:shadow-[0_8px_28px_rgba(225,25,34,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  const ctaLabel = ctaLabelProp ?? (campaign ? 'Book an appointment' : 'Sign Up Now')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className={cn(
        'w-[94vw] max-w-5xl overflow-hidden rounded-2xl border-0 bg-kawai-black p-0 text-white lg:w-[92vw]',
        t.rootClass,
      )}
    >
      <DialogTitle className="sr-only">{`${p.name} — current rebate and specifications`}</DialogTitle>
      <DialogDescription className="sr-only">
        {`${p.name}: ${formatPrice(p.yourPrice, p.currency)} — save ${formatPrice(Math.max(p.msrp - p.yourPrice, 0), p.currency)} off ${formatPrice(p.msrp, p.currency)} MSRP, including a ${formatPrice(p.rebate, p.currency)} instant rebate. Touch and action, sound and tone, and connectivity features, with a sign-up to claim the rebate through your local dealer.`}
      </DialogDescription>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative flex h-[92vh] w-full flex-col overflow-hidden lg:h-[88vh] lg:max-h-[760px] lg:flex-row"
      >
        <FilmBackground videoId={videoId} imageUrl={bgImage} />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Control panel — model, the savings reward, the section rail, the CTA */}
        <aside className="relative z-20 flex flex-shrink-0 flex-col gap-5 bg-gradient-to-b from-black/70 to-black/35 p-6 backdrop-blur-md lg:w-[360px] lg:gap-7 lg:bg-black/40 lg:p-8">
          <div className="pr-8">
            <p
              className={cn(
                EYEBROW,
                campaign
                  ? cn(t.capsFont, t.accentText)
                  : isShigeru
                    ? 'text-kawai-gold'
                    : 'text-kawai-red',
              )}
            >
              {categoryLabel}
            </p>
            <h2
              className={cn(
                'mt-2 leading-tight text-white transition-all duration-300 sm:text-4xl lg:!text-4xl',
                campaign
                  ? cn(
                      'font-semibold uppercase !leading-[0.92] tracking-[-0.01em]',
                      t.displayFont,
                      t.headingReset,
                    )
                  : 'font-[family-name:var(--font-brand-serif)] font-medium tracking-tight',
                pricingOpen ? 'text-[2rem]' : 'text-2xl',
              )}
            >
              {p.name}
            </h2>
          </div>

          {/* Full savings reveal — collapses on mobile when the shopper dives into
              a content section, so that section can fill the screen. Always open
              on desktop (side-by-side layout). */}
          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:!grid-rows-[1fr] lg:!opacity-100',
              pricingOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <div className="overflow-hidden">
              <RebateReveal product={p} campaign={campaign} t={t} />
            </div>
          </div>

          {/* Compact savings bar — mobile only, shown while pricing is collapsed.
              Tap to bring the full pricing panel back. */}
          {!pricingOpen ? (
            <button
              type="button"
              onClick={() => setPricingOpen(true)}
              aria-label="Show full pricing"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/10 lg:hidden"
            >
              <span className="font-[family-name:var(--font-brand-sans)] text-sm font-semibold text-white">
                Save {formatPrice(Math.max(p.msrp - p.yourPrice, 0), p.currency)}
                <span className="text-white/50"> · {formatPrice(p.yourPrice, p.currency)}</span>
              </span>
              <span className="flex-shrink-0 text-white/60">{CHEVRON_DOWN}</span>
            </button>
          ) : null}

          {/* Section rail — backlit "string" nav (desktop) */}
          <nav className="mt-1 hidden flex-col lg:flex" aria-label="Product details">
            {navSections.map((s) => {
              const active = s.key === activeKey
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveKey(s.key)}
                  className="group flex items-center gap-3 py-3 text-left"
                >
                  <span
                    className={cn(
                      'block flex-shrink-0 transition-all duration-300',
                      campaign && active ? 'w-[2px]' : 'w-px',
                      active
                        ? campaign
                          ? cn('h-8', t.accentBar)
                          : 'h-8 bg-kawai-red'
                        : 'h-5 bg-white/25 group-hover:bg-white/55',
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase transition-colors',
                      campaign
                        ? cn(t.capsFont, 'tracking-[0.22em]')
                        : 'font-[family-name:var(--font-brand-sans)] tracking-[0.18em]',
                      active ? 'text-white' : 'text-white/55 group-hover:text-white/85',
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* CTA (desktop, pinned to the panel bottom) */}
          <div className="mt-auto hidden lg:block">
            <button type="button" onClick={handleSignUp} className={signUpPill}>
              {ctaLabel}
              {ARROW}
            </button>
            {secondary && (
              <Link
                href={secondary.href}
                className="mt-3 block text-center font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </aside>

        {/* Active section */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {/* Section nav pills (mobile) */}
          {hasContent ? (
            <div className="flex gap-2 overflow-x-auto scrollbar-none border-b border-white/10 bg-black/30 px-5 py-3 backdrop-blur-sm lg:hidden">
              {navSections.map((s) => {
                const active = s.key === activeKey
                return (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => { setActiveKey(s.key); setPricingOpen(false) }}
                    className={cn(
                      'shrink-0 whitespace-nowrap text-xs font-semibold uppercase transition-colors',
                      campaign
                        ? cn(
                            'border-b-2 px-3 py-2 tracking-[0.18em]',
                            t.capsFont,
                            active
                              ? cn(t.accentBorder, 'text-white')
                              : 'border-transparent text-white/55 hover:text-white/85',
                          )
                        : cn(
                            'rounded-full px-4 py-2 font-[family-name:var(--font-brand-sans)] tracking-[0.14em]',
                            active ? 'bg-white text-kawai-black' : 'bg-white/15 text-white/80',
                          ),
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div
            ref={scrollRef}
            className={cn(
              'min-h-0 flex-1 overflow-y-auto overscroll-contain',
              showMedia ? 'bg-white' : 'p-6 sm:p-8 lg:p-12',
            )}
          >
            {loading ? (
              <div className="max-w-lg animate-pulse space-y-4">
                <div className="h-8 w-2/3 rounded bg-white/15" />
                <div className="mt-8 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-white/10" style={{ width: `${85 - i * 9}%` }} />
                  ))}
                </div>
              </div>
            ) : showMedia ? (
              <div key="details" className="flex h-full animate-fade-in flex-col">
                <h3
                  className={cn(
                    'px-6 pt-6 text-4xl uppercase text-kawai-black sm:px-8 sm:pt-8 sm:text-5xl lg:px-10 lg:pt-10 lg:text-6xl',
                    campaign
                      ? cn('font-semibold tracking-[-0.01em]', t.displayFont, t.headingReset)
                      : 'font-[family-name:var(--font-brand-serif)] font-light tracking-[0.06em]',
                  )}
                >
                  Details
                </h3>
                <div className="relative mt-3 flex min-h-0 flex-1 items-center justify-center">
                  {current?.type === 'video' ? (
                    <div className="relative aspect-video w-full max-w-3xl px-4 sm:px-8">
                      <iframe
                        key={current.youtubeId}
                        src={`https://www.youtube.com/embed/${current.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                        title={current.alt}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full animate-fade-in rounded-xl bg-black shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <Image
                        key={current?.url}
                        src={current?.url ?? ''}
                        alt={current?.alt || p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="animate-fade-in object-contain"
                      />
                    </div>
                  )}
                  {media.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => stepMedia(-1)}
                        aria-label="Previous item"
                        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-kawai-black/15 bg-white text-kawai-black shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-kawai-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black/40"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => stepMedia(1)}
                        aria-label="Next item"
                        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-kawai-black/15 bg-white text-kawai-black shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-kawai-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black/40"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  ) : null}
                </div>
                {media.length > 1 ? (
                  <p className="px-6 pb-5 pt-2 text-center font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.18em] tabular-nums text-kawai-charcoal/60">
                    {mediaIndex + 1} / {media.length}
                  </p>
                ) : null}
              </div>
            ) : activeSpec ? (
              <div key={activeKey} className="animate-fade-in">
                <h3
                  className={cn(
                    'max-w-2xl text-4xl uppercase text-white sm:text-5xl lg:text-6xl',
                    campaign
                      ? cn('font-semibold tracking-[-0.01em]', t.displayFont, t.headingReset)
                      : 'font-[family-name:var(--font-brand-serif)] font-light tracking-[0.06em]',
                  )}
                >
                  {activeLabel}
                </h3>
                <ul className="mt-8 max-w-xl space-y-4">
                  {activeItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3.5 font-[family-name:var(--font-brand-sans)] text-lg leading-relaxed text-white sm:text-xl"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'mt-[0.6em] block h-1.5 w-1.5 flex-shrink-0',
                          campaign ? t.accentBar : 'rounded-full',
                          !campaign && (isShigeru ? 'bg-kawai-gold' : 'bg-kawai-red'),
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                {bgImage ? (
                  <div className="relative h-40 w-56 sm:h-52 sm:w-72">
                    <Image src={bgImage} alt={p.name} fill className="object-contain" sizes="288px" />
                  </div>
                ) : null}
                <p className="mt-6 max-w-sm font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/80">
                  Your local Authorized Kawai dealer can walk you through everything the {p.label}{' '}
                  has to offer.
                </p>
              </div>
            )}
          </div>

          {/* CTA (mobile, sticky to the modal bottom) */}
          <div className="border-t border-white/10 bg-black/70 p-4 backdrop-blur-md lg:hidden">
            <button type="button" onClick={handleSignUp} className={signUpPill}>
              {ctaLabel}
              {ARROW}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
