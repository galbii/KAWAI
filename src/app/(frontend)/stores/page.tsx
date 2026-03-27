import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai Factory Stores | KAWAI',
  description:
    'Visit an Official Kawai Factory Showroom and experience the full range of grand, upright, and digital pianos in person. Expert staff, world-class instruments.',
  openGraph: {
    title: 'Kawai Factory Stores',
    description: "Experience the world's finest pianos in person at an Official Kawai Showroom.",
  },
}

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

interface StorefrontEntry {
  id: string
  slug: string
  locationName: string
  locationText: string
  establishedText?: string
  showroomInfo?: { address?: string; phone?: string }
  features?: Array<{ title: string }>
}

const getActiveStorefronts = unstable_cache(
  async (): Promise<StorefrontEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'storefronts',
      where: { isActive: { equals: true } },
      select: {
        slug: true,
        locationName: true,
        locationText: true,
        establishedText: true,
        showroomInfo: true,
        features: true,
      },
      sort: 'locationName',
      depth: 0,
      limit: 50,
    })

    return result.docs.map((doc) => ({
      id: String(doc.id),
      slug: doc.slug ?? '',
      locationName: doc.locationName ?? '',
      locationText: (doc as any).locationText ?? '',
      establishedText: (doc as any).establishedText ?? undefined,
      showroomInfo: (doc as any).showroomInfo ?? undefined,
      features: ((doc as any).features ?? []).map((f: any) => ({ title: f.title ?? '' })),
    }))
  },
  ['stores-page-storefronts'],
  { tags: ['storefronts'], revalidate: 3600 }
)

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function StoresPage() {
  const storefronts = await getActiveStorefronts()

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-kawai-black"
        style={{ minHeight: '44vh' }}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Red left-edge accent */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-1 bg-kawai-red"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20 md:py-28">
          <div className="max-w-4xl">
            {/* Logo as heading */}
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={400}
              height={120}
              className="h-16 md:h-24 w-auto brightness-0 invert mb-5"
              priority
            />

            {/* Official Showrooms label */}
            <p className="text-2xl md:text-3xl font-light text-white/80 tracking-widest uppercase font-[family-name:var(--font-brand-sans)] mb-8">
              Official Showrooms
            </p>

            {/* Red rule */}
            <div className="w-16 h-[2px] bg-kawai-red" />
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-16 md:py-24">
        {storefronts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-end gap-6 md:gap-10">

              {/* Large editorial number */}
              <span
                className="flex-shrink-0 font-[family-name:var(--font-brand-serif)] font-light text-kawai-red select-none"
                style={{ fontSize: 'clamp(6rem, 14vw, 11rem)', lineHeight: '0.82' }}
              >
                {storefronts.length}
              </span>

              {/* Label stack + rule */}
              <div className="flex-1 min-w-0 pb-3 md:pb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.55em] text-kawai-red font-[family-name:var(--font-brand-sans)] mb-1.5">
                  Kawai
                </p>
                <p className="text-xl md:text-3xl font-bold uppercase tracking-[0.18em] text-kawai-black font-[family-name:var(--font-brand-sans)] mb-4">
                  {storefronts.length === 1 ? 'Location' : 'Locations'}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="w-full h-px bg-kawai-neutral" />
                  <div className="w-10 h-[2px] bg-kawai-red" />
                </div>
              </div>

            </div>
          </div>
        )}

        {storefronts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {storefronts.map((storefront) => (
              <StorefrontCard key={storefront.id} storefront={storefront} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Storefront Card
// ─────────────────────────────────────────────────────────────

function StorefrontCard({ storefront }: { storefront: StorefrontEntry }) {
  return (
    <Link
      href={`/store/${storefront.slug}`}
      className="group flex h-[480px] flex-col overflow-hidden rounded-2xl border-2 border-kawai-red bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <div className="mb-3 text-[10px] font-medium tracking-[0.22em] uppercase text-kawai-red font-[family-name:var(--font-brand-sans)]">
            {storefront.locationText || 'Kawai Showroom'}
          </div>
          <div className="mb-3">
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={60}
              height={18}
              className="h-3 w-auto"
            />
          </div>
          <h3
            className="mb-2 text-xl font-bold uppercase leading-tight text-kawai-black transition-colors duration-200 group-hover:text-kawai-red font-[family-name:var(--font-brand-sans)]"
          >
            {storefront.locationName}
          </h3>
          <div className="h-px w-12 bg-kawai-red opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Details */}
        <div className="mb-4 flex-shrink-0 space-y-2.5">
          {storefront.showroomInfo?.address && (
            <InfoRow icon="pin">
              {storefront.showroomInfo.address}
            </InfoRow>
          )}
          {storefront.showroomInfo?.phone && (
            <InfoRow icon="phone">
              {storefront.showroomInfo.phone}
            </InfoRow>
          )}
          {storefront.establishedText && (
            <InfoRow icon="pin">
              {storefront.establishedText.replace(/^Est\.\s*\d{4}\s*•\s*/, '')}
            </InfoRow>
          )}
        </div>

        {/* Feature tags */}
        <div className="mb-4 flex-1 overflow-hidden">
          {storefront.features && storefront.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 content-start">
              {storefront.features.map((feature, i) => (
                <span
                  key={i}
                  className="rounded-full bg-kawai-red/10 px-3 py-1 text-xs font-medium text-kawai-red font-[family-name:var(--font-brand-sans)]"
                >
                  {feature.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto flex-shrink-0 border-t border-kawai-pearl pt-3">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium text-kawai-black transition-colors duration-200 group-hover:text-kawai-red font-[family-name:var(--font-brand-sans)]"
            >
              Visit Store Site
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-kawai-red/10 transition-all duration-200 group-hover:bg-kawai-red">
              <svg
                className="h-3 w-3 text-kawai-red transition-colors duration-200 group-hover:translate-x-px group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// InfoRow helper
// ─────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  children,
}: {
  icon: 'pin' | 'phone'
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-kawai-red/10">
        {icon === 'pin' ? (
          <svg className="h-2.5 w-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        ) : (
          <svg className="h-2.5 w-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        )}
      </div>
      <p className="text-xs leading-relaxed text-kawai-black/70 line-clamp-2 font-[family-name:var(--font-brand-sans)]">
        {children}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-kawai-red/10">
        <svg className="h-8 w-8 text-kawai-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3
        className="mb-2 text-xl font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
      >
        No showrooms available
      </h3>
      <p className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">
        Check back soon or{' '}
        <Link href="/find-a-dealer" className="text-kawai-red hover:underline">
          find an authorized dealer
        </Link>{' '}
        near you.
      </p>
    </div>
  )
}

