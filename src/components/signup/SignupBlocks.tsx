import Image from 'next/image'
import type { SignupCampaign } from '@/payload-types'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { BannerBlock } from '@/components/blocks/BannerBlock'
import { RichTextContentBlock } from '@/components/blocks/RichTextContentBlock'
import { ColumnsBlock } from '@/components/blocks/ColumnsBlock'
import { SpacerBlock } from '@/components/blocks/SpacerBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { DETAIL_ICONS, ExternalIcon, type DetailIcon } from './SignupIcons'

type Blocks = NonNullable<SignupCampaign['blocks']>
type Block = Blocks[number]

interface Props {
  blocks: Blocks
  storefront: any
  school: any
  /** Tone of the page surface these blocks sit on. See NEEDS_CARD_ON_DARK. */
  surface?: 'light' | 'dark'
}

/**
 * Renders a campaign's content column.
 *
 * The shared `RenderBlocks` is not used here for one structural reason: the
 * three `signup-*` blocks need the storefront and music-school records to
 * render at all, and `RenderBlocks` has no way to thread that through its
 * blockType map. This renderer keeps those records in scope and delegates the
 * seven reused content/layout blocks to the very same components the shared
 * renderer uses, so their appearance stays identical.
 *
 * It also deliberately never promotes a block to `<h1>` — `SignupHero` owns the
 * page's single h1, and a second one would be a WCAG violation.
 */
const CARD_WRAP = 'rounded-xl border border-kawai-neutral bg-white p-5 sm:p-6'

/**
 * Blocks that paint no surface of their own and would be unreadable on a dark
 * page background.
 *
 * RichTextContentBlock renders bare prose in kawai-black/kawai-charcoal with no
 * container, so on Kawai Red or Black it disappears. It gets a white card.
 * Everything else is deliberately excluded: image and video carry their own
 * media, banner ships its own tinted surface, divider and spacer have no text,
 * and ColumnsBlock exposes its own backgroundColor control — card-wrapping
 * those would double up a surface the editor already chose.
 */
const NEEDS_CARD_ON_DARK = new Set(['content-rich-text'])

export function SignupBlocks({ blocks, storefront, school, surface = 'light' }: Props) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const carded = surface === 'dark' && NEEDS_CARD_ON_DARK.has(block.blockType)
        return (
          <div key={block.id ?? index} className={carded ? CARD_WRAP : 'block-container'}>
            {renderBlock(block, storefront, school)}
          </div>
        )
      })}
    </>
  )
}

function renderBlock(block: Block, storefront: any, school: any) {
  switch (block.blockType) {
    case 'content-rich-text':
      return <RichTextContentBlock {...(block as any)} />
    case 'content-image':
      return <ImageBlock {...(block as any)} />
    case 'content-video':
      return <VideoBlock {...(block as any)} />
    case 'content-banner':
      return <BannerBlock {...(block as any)} />
    case 'layout-columns':
      return <ColumnsBlock {...(block as any)} />
    case 'layout-spacer':
      return <SpacerBlock {...(block as any)} />
    case 'layout-divider':
      return <DividerBlock {...(block as any)} />
    case 'signup-instructors':
      return <InstructorsBlock block={block as any} school={school} />
    case 'signup-details':
      return <DetailsBlock block={block as any} />
    case 'signup-location':
      return <LocationBlock block={block as any} storefront={storefront} />
    default:
      return null
  }
}

/* ------------------------------------------------------------------ shell */

/**
 * Shared card shell for the three signup blocks.
 *
 * The single kawai-red rule across the top edge is the only ornament, and it is
 * the brand mark doing the work rather than an illustration of the subject. It
 * is decorative — the heading beneath it carries the meaning — so it is hidden
 * from assistive tech and never used to distinguish one card from another.
 */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-kawai-neutral bg-white shadow-[0_1px_2px_rgba(30,27,22,0.04),0_10px_28px_-14px_rgba(30,27,22,0.18)]">
      <div aria-hidden="true" className="h-1 w-full bg-kawai-red" />
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

const EYEBROW = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-kawai-charcoal/70'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-brand-serif)] text-[1.375rem] font-semibold leading-tight tracking-[-0.01em] text-kawai-black sm:text-2xl">
      {children}
    </h2>
  )
}

/* ----------------------------------------------------------- instructors */

/** First letters of the first two words — "Mei-Lin Torres" → "MT". */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
}

function InstructorsBlock({ block, school }: { block: any; school: any }) {
  const faculty = (school?.faculty ?? []).slice(0, block.limit ?? 6)
  if (!faculty.length) return null

  return (
    <Card>
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
      {block.intro ? (
        <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-kawai-charcoal">
          {block.intro}
        </p>
      ) : null}
      <ul className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {faculty.map((person: any, i: number) => (
          <li key={person.id ?? i} className="flex items-start gap-3.5">
            {person.photo?.url ? (
              <Image
                src={person.photo.url}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-kawai-neutral"
              />
            ) : (
              // A teacher with no photo used to render nothing at all, so their
              // name sat flush left while everyone else's was indented — the
              // roster looked broken rather than incomplete. The monogram keeps
              // the row on the same grid.
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-kawai-pearl text-sm font-semibold tracking-[0.06em] text-kawai-charcoal ring-1 ring-kawai-neutral"
              >
                {initials(person.name ?? '')}
              </span>
            )}
            <div className="min-w-0 pt-0.5">
              {/* A div, not a heading — a roster of names would wreck
                  screen-reader heading navigation. */}
              <div className="font-semibold leading-snug text-kawai-black">{person.name}</div>
              {person.title || person.role ? (
                <div className="mt-0.5 text-sm leading-snug text-kawai-charcoal">
                  {person.title ?? person.role}
                </div>
              ) : null}
              {person.specialties ? (
                <div className={`mt-1.5 ${EYEBROW}`}>{person.specialties}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* --------------------------------------------------------------- details */

function DetailsBlock({ block }: { block: any }) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <Card>
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
      {/* A <dl> because that is what this is — each label describes its value.
          The icons are decoration on top of that, never a replacement for it. */}
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {items.map((item: any, i: number) => {
          const Icon = DETAIL_ICONS[(item.icon ?? 'note') as DetailIcon] ?? DETAIL_ICONS.note
          return (
            <div key={item.id ?? i} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kawai-pearl text-kawai-red ring-1 ring-kawai-neutral">
                <Icon />
              </span>
              <div className="min-w-0 pt-0.5">
                <dt className={EYEBROW}>{item.label}</dt>
                <dd className="mt-1 font-medium leading-snug text-kawai-black">{item.value}</dd>
              </div>
            </div>
          )
        })}
      </dl>
    </Card>
  )
}

/* -------------------------------------------------------------- location */

function LocationBlock({ block, storefront }: { block: any; storefront: any }) {
  const showroom = storefront?.showroomInfo
  const hours = storefront?.hours ?? []
  const address: string | null = showroom?.address ?? null
  const storeName: string = storefront?.locationName ?? showroom?.name ?? 'this location'

  // The Storefronts records carry a flat address string and no coordinates, so
  // the Embed API is queried by text. Without a key the iframe would render
  // Google's own error card, which looks worse than no map — so the whole map
  // is gated on the key being present rather than shipped broken.
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const embedSrc =
    block.showMap && address && mapsKey
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(address)}&zoom=15`
      : null
  const directionsHref = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : null

  return (
    <Card>
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}

      {embedSrc ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-kawai-neutral">
          <iframe
            src={embedSrc}
            title={`Map showing Kawai ${storeName} at ${address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[16/9] w-full border-0"
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          {address ? (
            <address className="whitespace-pre-line not-italic text-sm leading-relaxed text-kawai-charcoal">
              {address}
            </address>
          ) : null}
          {showroom?.phone ? (
            <p className="mt-1.5">
              <a
                className="text-sm font-medium text-kawai-red underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                href={`tel:${showroom.phone}`}
              >
                {showroom.phone}
              </a>
            </p>
          ) : null}
        </div>

        {directionsHref ? (
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-kawai-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-kawai-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
          >
            Get directions
            <ExternalIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>

      {block.showHours && hours.length ? (
        <>
          <p className={`mt-6 ${EYEBROW}`}>Opening hours</p>
          <dl className="mt-2 divide-y divide-kawai-neutral border-y border-kawai-neutral text-sm">
            {hours.map((row: any, i: number) => (
              <div key={row.id ?? i} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-kawai-charcoal">{row.day}</dt>
                <dd className="font-medium tabular-nums text-kawai-black">{row.time}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      {block.parkingNote ? (
        <p className="mt-5 rounded-lg bg-kawai-pearl px-4 py-3 text-sm leading-relaxed text-kawai-charcoal">
          {block.parkingNote}
        </p>
      ) : null}
    </Card>
  )
}
