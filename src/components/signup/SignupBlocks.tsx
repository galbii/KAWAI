import Image from 'next/image'
import type { SignupCampaign } from '@/payload-types'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { VideoBlock } from '@/components/blocks/VideoBlock'
import { BannerBlock } from '@/components/blocks/BannerBlock'
import { RichTextContentBlock } from '@/components/blocks/RichTextContentBlock'
import { ColumnsBlock } from '@/components/blocks/ColumnsBlock'
import { SpacerBlock } from '@/components/blocks/SpacerBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'

type Blocks = NonNullable<SignupCampaign['blocks']>
type Block = Blocks[number]

interface Props {
  blocks: Blocks
  storefront: any
  school: any
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
export function SignupBlocks({ blocks, storefront, school }: Props) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => (
        <div key={block.id ?? index} className="block-container">
          {renderBlock(block, storefront, school)}
        </div>
      ))}
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xl font-bold tracking-tight text-kawai-black sm:text-2xl">
      {children}
    </h2>
  )
}

function InstructorsBlock({ block, school }: { block: any; school: any }) {
  const faculty = (school?.faculty ?? []).slice(0, block.limit ?? 6)
  if (!faculty.length) return null

  return (
    <section className="rounded-lg border border-kawai-neutral bg-white p-5">
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
      {block.intro ? (
        <p className="mb-4 text-sm leading-relaxed text-kawai-charcoal">{block.intro}</p>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2">
        {faculty.map((person: any, i: number) => (
          <li key={person.id ?? i} className="flex items-start gap-3">
            {person.photo?.url ? (
              <Image
                src={person.photo.url}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <div className="min-w-0">
              {/* A div, not a heading — a roster of names would wreck
                  screen-reader heading navigation. */}
              <div className="font-semibold text-kawai-black">{person.name}</div>
              {person.title || person.role ? (
                <div className="text-sm text-kawai-charcoal">{person.title ?? person.role}</div>
              ) : null}
              {person.specialties ? (
                <div className="text-xs text-kawai-charcoal/75">{person.specialties}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DetailsBlock({ block }: { block: any }) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section className="rounded-lg border border-kawai-neutral bg-white p-5">
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items.map((item: any, i: number) => (
          <div key={item.id ?? i}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-kawai-charcoal/70">
              {item.label}
            </dt>
            <dd className="mt-0.5 font-medium text-kawai-black">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function LocationBlock({ block, storefront }: { block: any; storefront: any }) {
  const showroom = storefront?.showroomInfo
  const hours = storefront?.hours ?? []

  return (
    <section className="rounded-lg border border-kawai-neutral bg-white p-5">
      {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
      {showroom?.address ? (
        <address className="whitespace-pre-line not-italic text-sm leading-relaxed text-kawai-charcoal">
          {showroom.address}
        </address>
      ) : null}
      {showroom?.phone ? (
        <p className="mt-2 text-sm">
          <a className="text-kawai-red hover:underline" href={`tel:${showroom.phone}`}>
            {showroom.phone}
          </a>
        </p>
      ) : null}
      {block.showHours && hours.length ? (
        <dl className="mt-4 grid gap-1 text-sm">
          {hours.map((row: any, i: number) => (
            <div key={row.id ?? i} className="flex justify-between gap-4">
              <dt className="text-kawai-charcoal/70">{row.day}</dt>
              <dd className="text-kawai-black">{row.time}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {block.parkingNote ? (
        <p className="mt-4 text-sm leading-relaxed text-kawai-charcoal">{block.parkingNote}</p>
      ) : null}
    </section>
  )
}
