import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading, SERIF } from './SectionHeading'

/**
 * "Regularly available" model cards and the featured-finish panels on the
 * rental pages. Data is resolved by the caller (PianoRentalsSection); this
 * file is presentation only.
 */

export interface RentalModelCard {
  label: string
  name: string
  typeLabel: string
  imageUrl: string | null
  href: string
}

export interface FinishPanel {
  name: string
  model: string
  description: string
  imageUrl: string | null
  swatch: string
  contactForAvailability: boolean
  href: string
}

export function RentalModels({ models, storeName }: { models: RentalModelCard[]; storeName: string }) {
  if (models.length === 0) return null
  return (
    <div>
      <SectionHeading label="Regularly available">Models you can rent at {storeName}</SectionHeading>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {models.map((m) => (
          <li key={m.label}>
            <Link
              href={m.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
            >
              <div className="relative aspect-square">
                {m.imageUrl && (
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain p-5 transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col border-t border-kawai-black/10 p-4 md:p-5">
                <p className="text-xl font-bold tracking-[-0.02em] text-kawai-black">{m.label}</p>
                <p className="mt-1 text-sm text-kawai-black/60">{m.typeLabel}</p>
                <span className="mt-4 self-start border-b border-kawai-black/30 pb-px text-[11px] font-medium uppercase tracking-[0.2em] text-kawai-black transition-colors duration-300 group-hover:border-kawai-red group-hover:text-kawai-red">
                  Ask about it
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeaturedFinishes({ finishes, storeName }: { finishes: FinishPanel[]; storeName: string }) {
  if (finishes.length === 0) return null
  return (
    <div>
      <SectionHeading label="Featured finishes">Something beyond black</SectionHeading>
      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
        {finishes.map((f) => {
          const dark = !f.imageUrl && f.swatch.toUpperCase() !== '#F4F2EE'
          return (
            <Link
              key={f.name}
              href={f.href}
              className="group block overflow-hidden rounded-lg bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
            >
              <div className="relative aspect-[16/10]" style={{ backgroundColor: f.imageUrl ? '#FFFFFF' : f.swatch }}>
                {f.imageUrl ? (
                  <Image
                    src={f.imageUrl}
                    alt={`${f.model ? `${f.model} in ` : ''}${f.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-8 transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
                  />
                ) : (
                  <p
                    aria-hidden
                    className={`absolute bottom-6 left-6 font-light leading-none md:bottom-8 md:left-8 ${dark ? 'text-white' : 'text-kawai-black'}`}
                    style={{ fontFamily: SERIF, fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.03em' }}
                  >
                    {f.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 border-t border-kawai-black/10 p-6 md:flex-row md:items-end md:justify-between md:p-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-kawai-black">
                    {f.name}
                    {f.model && <span className="font-normal text-kawai-black/50"> · {f.model}</span>}
                  </h3>
                  {f.description && <p className="mt-2 max-w-md leading-relaxed text-kawai-black/70">{f.description}</p>}
                  {f.contactForAvailability && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-kawai-black">
                      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: f.swatch }} />
                      Contact {storeName} for availability
                    </p>
                  )}
                </div>
                <span className="inline-flex shrink-0 self-start items-center rounded-full bg-kawai-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:bg-kawai-red md:self-auto">
                  {f.contactForAvailability ? 'Ask about availability' : 'Ask about it'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
