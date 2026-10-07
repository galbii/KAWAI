'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import Link from 'next/link'
import { useLeadCampaign } from '@/components/campaign-lead'
import { PromoCta, PromoStage } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { formatOfferPrice } from './money'
import { bundle, PROGRAM_END, SECTION } from './campaign'
import type { PromoGroup } from '@/lib/payload/promo-types'

/**
 * Buy a CN or CA Series piano, get a pair of SH-9 headphones.
 *
 * One stage, split. The offer on the left; on the right the two series it
 * covers, as tiles.
 *
 * The right half used to be the models themselves — a filter row over a
 * scrolling grid of a dozen cards. That put the least important decision first.
 * A shopper here owns a CN or they own a CA, or they are choosing between the
 * two lines; the individual model is what they work out afterwards, with a
 * dealer. Two tiles answer the first question at a glance and hold the second
 * behind a click, which also gives the models room to be shown at a usable
 * size instead of squeezed into half a column.
 */
export function Sh9BundleBlock({ groups }: { groups: PromoGroup[] }) {
  const [openHandle, setOpenHandle] = useState<string | null>(null)
  const open = groups.find((g) => g.handle === openHandle) ?? null
  const { open: openLead } = useLeadCampaign()

  return (
    <>
      <PromoStage
        id={SECTION.bundle}
        image={bundle.stageImage}
        imageAlt={bundle.stageImageAlt}
        eyebrow={`Through ${PROGRAM_END}`}
        heading={bundle.heading}
        subheading={bundle.standfirst}
        aside={<SeriesTiles groups={groups} onOpen={setOpenHandle} />}
        // No wash: the copy sits on its own card and the tiles are opaque, so
        // every piece of text here brings its own ground.
        scrim={0}
        lockupCard
        // The aside is a picture browser; the extra width goes to the pictures.
        wide
      >
        {/* Every offer in this campaign is redeemed in a showroom, and the
            bundle is the one most easily mistaken for a checkout add-on. */}
        <p className="promo-body text-[1rem] font-medium leading-snug text-[color:var(--ivory)]">
          {bundle.dealerNote}
        </p>

        <div className="mt-7">
          <PromoButton />
        </div>

        <p className="promo-body mt-9 max-w-[46ch] text-[0.72rem] leading-relaxed text-[color:var(--ivory)]/80">
          {bundle.disclaimer}
        </p>
      </PromoStage>

      <Modal
        isOpen={open !== null}
        onClose={() => setOpenHandle(null)}
        size="full"
        className="promo promo-a promo-on-light max-h-[86vh] overflow-y-auto !p-0"
      >
        {open && (
          <div>
            {/* The series photograph carries the heading, so opening a tile
                lands somewhere that still looks like the tile that was
                clicked. The band is scrimmed where the tiles are not: this
                heading has no second treatment to fall back on and the modal
                has to work whatever art a series is given. */}
            <div className="relative overflow-hidden">
              {bundle.seriesArt[open.handle] ? (
                <div className="relative h-40 w-full sm:h-56">
                  <Image
                    src={bundle.seriesArt[open.handle]!}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(29,27,24,0.82) 0%, rgba(29,27,24,0.58) 55%, rgba(29,27,24,0.38) 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="promo-h2 promo-photo-text text-[1.6rem] text-[color:var(--ivory)] sm:text-[2.1rem]">
                      {open.title}
                    </h3>
                    <p className="promo-body promo-photo-text mt-2 max-w-[54ch] text-[0.92rem] text-[color:var(--ivory)]">
                      {bundle.standfirst}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0 sm:p-8 sm:pb-0">
                  <h3 className="promo-h2 text-[1.6rem] text-[color:var(--on-ground)] sm:text-[2.1rem]">
                    {open.title}
                  </h3>
                  <p className="promo-body mt-2 max-w-[54ch] text-[0.92rem] text-[color:var(--body)]">
                    {bundle.standfirst}
                  </p>
                </div>
              )}
            </div>

            <ul className="grid gap-3 p-6 sm:p-8 lg:grid-cols-2">
              {open.products.map((product) => (
                <ModelRow
                  key={product.slug}
                  product={product}
                  onSignUp={() => {
                    // Close this dialog before opening the lead one. Two
                    // stacked dialogs fight over the focus trap, and the
                    // visitor has finished with the model list the moment they
                    // have decided to ask about one.
                    setOpenHandle(null)
                    openLead()
                  }}
                />
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  )
}

/**
 * The two series, as tiles.
 *
 * Built on the homepage featured-collection card: a 4:3 photographic tile that
 * darkens toward the foot, with the name sitting in that shadow and the way in
 * revealed on hover. The difference is that these open a dialog rather than
 * navigate — the models are a detail of this offer, not a destination, and
 * sending a shopper to a collection page would lose the bundle context that
 * brought them here.
 *
 * A tile with no lifestyle photograph falls back to its first product shot,
 * which is a cut-out on white and so is laid on a light mat and contained
 * rather than cropped — and keeps a foot gradient, since a shadow against a
 * white frame does nothing. Both current series have real art; see
 * `bundle.seriesArt`.
 */
function SeriesTiles({
  groups,
  onOpen,
}: {
  groups: PromoGroup[]
  onOpen: (handle: string) => void
}) {
  if (groups.length === 0) {
    return (
      <p className="promo-body promo-card p-6 text-center text-[0.95rem] text-[color:var(--ivory)]/90">
        {bundle.emptyState}
      </p>
    )
  }

  return (
    <div>
      <div data-reveal="rise" className="promo-card px-5 py-4">
        {/* h3 — the stage owns this section's h2. */}
        <h3 className="promo-label text-[color:var(--ivory)]">{bundle.browseHeading}</h3>
      </div>

      {/* Side by side from `sm`, which the wide stage now has room for.
          They were stacked when the stage ran on the 78rem reading measure:
          two tiles in a row had to be square-ish to fit, and a square crop
          takes a room photograph down to the piano in it. At the wide measure
          each tile is still landscape enough to keep the instrument in its
          room, and the pair stops the section scrolling past a screen. */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Each tile is uncovered from the foot up as the stage arrives — see
            `wipe` in PromoReveal. On a wrapper, not the button, so the
            button's own hover transforms never share a property with it. */}
        {groups.map((group) => (
          <div key={group.handle} data-reveal="wipe">
            <SeriesTile group={group} onOpen={() => onOpen(group.handle)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SeriesTile({ group, onOpen }: { group: PromoGroup; onOpen: () => void }) {
  const art = bundle.seriesArt[group.handle]
  const fallback = group.products[0]?.imageUrl ?? null
  const src = art ?? fallback
  const count = group.products.length

  return (
    <button
      type="button"
      onClick={onOpen}
      className="promo-focus group relative block w-full overflow-hidden rounded-lg bg-[color:var(--ink)] text-left"
      // 3:2 rather than the 2:1 banner it was: side by side, each tile is
      // roughly half as wide, so the taller crop is what keeps the room around
      // the instrument instead of cropping to the instrument.
      style={{ aspectRatio: '3 / 2' }}
    >
      {src && (
        <div className={art ? 'absolute inset-0' : 'absolute inset-0 bg-white p-6'}>
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 28vw"
            className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
              art ? 'object-cover' : 'object-contain'
            }`}
          />
        </div>
      )}

      {/* No gradient — the photograph runs clean. The labels below therefore
          carry a shadow rather than a ground, which reads but does not measure:
          see the note on .promo-photo-text. The one exception is the cut-out
          fallback, which is a white frame and defeats a shadow outright, so it
          keeps a foot gradient until real art exists for that series. */}
      {!art && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/45 to-transparent" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[color:var(--ink)]/0 transition-colors duration-500 group-hover:bg-[color:var(--ink)]/10" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="promo-h2 promo-photo-text text-[1.9rem] leading-none text-[color:var(--ivory)] transition-transform duration-500 group-hover:-translate-y-1 sm:text-[2.4rem]">
          {group.title}
        </p>
        <p className="promo-num promo-photo-text mt-2.5 text-[0.85rem] text-[color:var(--ivory)]">
          {count} {count === 1 ? 'model' : 'models'}
        </p>

        {/* Revealed on hover, but never the only way in — the whole tile is the
            control, and it is a real button, so keyboard and touch reach it
            without this ever appearing. */}
        <span className="promo-body mt-3 inline-flex max-h-0 items-center gap-2 overflow-hidden text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ivory)] opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">
          {bundle.seriesCta}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </span>
      </div>
    </button>
  )
}

/**
 * One qualifying model, as a row.
 *
 * A row rather than a card because each one now carries an action. On a card
 * the whole tile is the link and there is nowhere for a second control to go
 * without nesting a button inside an anchor; a row gives the name its link and
 * the button its own hit area, side by side, which is also the shape that lets
 * a dozen models be scanned rather than browsed.
 *
 * "SH-9 Included" sits on every row deliberately. It is the one fact this
 * dialog exists to convey, and a shopper who opened it from a tile two clicks
 * ago should not have to remember why these particular pianos are listed.
 */
function ModelRow({
  product,
  onSignUp,
}: {
  product: PromoGroup['products'][number]
  onSignUp: () => void
}) {
  return (
    <li className="flex items-center gap-4 border border-[color:var(--rule-soft)] bg-[color:var(--surface)] p-3 sm:gap-5 sm:p-4">
      <span className="relative h-16 w-20 shrink-0 overflow-hidden bg-white sm:h-20 sm:w-24">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="96px"
            className="object-contain p-1.5"
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="promo-focus promo-body block truncate text-[1.02rem] font-medium text-[color:var(--on-ground)] hover:underline"
        >
          {product.label}
        </Link>
        <span className="promo-body mt-1 block text-[0.8rem] font-medium text-[color:var(--money)]">
          {bundle.rowLabel}
        </span>
        {product.price != null && (
          <span className="promo-num mt-1 block text-[0.85rem] text-[color:var(--body-dim)]">
            {formatOfferPrice(product.price, product.currency)}
          </span>
        )}
      </span>

      <PromoCta size="compact" onClick={onSignUp} hasPopup="dialog">
        {bundle.rowCta}
      </PromoCta>
    </li>
  )
}
