'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useActionState } from 'react'
import { cn } from '@/lib/utils'
import { KawaiLogo } from '@/components/ui/kawai-logo'
import { Button } from '@/components/ui/button'
import { submitNewsletterSignup, type NewsletterSignupResult } from '@/lib/actions/newsletter-signup'
import { ChevronRight } from 'lucide-react'
import type { ResourceLink, StoreLocationNavItem, QuickLink } from './header-dynamic'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(className)} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(className)} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// All footer quick links removed per user request
// const footerLinks = {
//   instruments: {
//     title: 'Instruments',
//     links: [
//       { label: 'Shigeru Kawai', href: '/pianos/shigeru-kawai' },
//       { label: 'Grand Pianos', href: '/pianos/grand' },
//       { label: 'Upright Pianos', href: '/pianos/upright' },
//       { label: 'Digital Pianos', href: '/pianos/digital' },
//       { label: 'Hybrid Pianos', href: '/pianos/hybrid' },
//       { label: 'Piano Finder', href: '/piano-finder' },
//     ]
//   },
//   explore: {
//     title: 'Explore',
//     links: [
//       { label: 'About Kawai', href: '/about' },
//       { label: 'Artists', href: '/artists' },
//       { label: 'Technology', href: '/technology' },
//       { label: 'Showroom', href: '/showroom' },
//       { label: 'Guides', href: '/guides' },
//     ]
//   },
// }

type SocialIconComponent = React.ComponentType<{ className?: string }>

const socialLinks: Array<{ icon: SocialIconComponent; href: string; label: string }> = [
  { icon: Instagram, href: 'https://www.instagram.com/kawaipianosus/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/KawaiPianosUS/', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@kawaipianosus', label: 'TikTok' },
  { icon: XIcon, href: 'https://x.com/KawaiPianosUS', label: 'X / Twitter' },
  { icon: Youtube, href: 'https://www.youtube.com/@KawaiPianosUS', label: 'YouTube' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/9083672', label: 'LinkedIn' },
]

interface DealerLocationContactData {
  name: string
  address: string
  phone: string
  email?: string
  locationName?: string
  slug?: string
}

interface FooterProps {
  locationContactData?: DealerLocationContactData | null
  isSignaturePage?: boolean
  promotedLinks?: QuickLink[]
  resourceLinks?: ResourceLink[]
  storeLocations?: StoreLocationNavItem[]
  site?: 'us' | 'cad'
}

// Mirrors ProductsMegaMenu's SIDEBAR_CATEGORIES order so the footer stays
// in lockstep with the header.
const PIANO_COLUMN: Array<{ label: string; href: string }> = [
  { label: 'Digital Pianos',   href: '/pianos/digital'  },
  { label: 'Hybrid Pianos',    href: '/pianos/hybrid'   },
  { label: 'Upright Pianos',   href: '/pianos/upright'  },
  { label: 'Grand Pianos',     href: '/pianos/grand'    },
  { label: 'Shigeru Kawai',    href: '/shigeru'         },
  { label: 'Accessories',      href: '/accessories'     },
]

const EXPLORE_EXTRAS: Array<{ label: string; href: string }> = [
  { label: 'News',    href: '/news'    },
  { label: 'Artists', href: '/artists' },
]

const SHOWROOMS_VISIBLE = 6

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function displayStoreName(store: StoreLocationNavItem): string {
  return store.locationName.replace(/^kawai\s+/i, '').trim() || store.locationName
}

function NavColumn({
  title,
  items,
  footer,
  className,
}: {
  title: string
  items: Array<{ label: string; href: string; external?: boolean }>
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="text-kawai-pearl text-sm font-semibold uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-kawai-neutral hover:text-kawai-red transition-colors text-sm leading-snug"
              >
                {item.label}
                <span className="sr-only"> (opens in new window)</span>
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-kawai-neutral hover:text-kawai-red transition-colors text-sm leading-snug"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
        {footer && <li>{footer}</li>}
      </ul>
    </div>
  )
}

export function Footer({
  locationContactData,
  isSignaturePage = false,
  promotedLinks = [],
  resourceLinks = [],
  storeLocations = [],
  site = 'us',
}: FooterProps) {
  const pathname = usePathname()
  const isUniversityPage = pathname.includes('/university')
  const [newsletterState, newsletterAction, newsletterPending] = useActionState<NewsletterSignupResult | null, FormData>(
    submitNewsletterSignup,
    null,
  )

  // Generate location-aware business name and description
  const businessName = locationContactData?.name || 'Kawai'
  const locationDescription = locationContactData?.locationName
    ? `${locationContactData.locationName}'s premier piano destination. Experience the harmony of traditional Japanese craftsmanship and innovative technology.`
    : 'Crafting exceptional pianos for over 95 years. Experience the harmony of traditional Japanese craftsmanship and innovative technology.'

  const linkVariants = {
    initial: { x: 0 },
    hover: {
      x: 2,
      transition: { duration: 0.2 }
    }
  }

  const socialVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <footer className="backdrop-blur-md bg-kawai-black/95 text-kawai-pearl border-t border-kawai-neutral/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        {isSignaturePage ? (
          // Signature campaign pages: centered logo + heading + quote only
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <KawaiLogo
                size="sm"
                animated={true}
                theme="dark"
                {...(locationContactData?.locationName && { dealerName: locationContactData.locationName })}
                nonClickable={isSignaturePage}
              />
            </div>
            {locationContactData?.locationName && (
              <h2 className="text-2xl md:text-3xl font-semibold text-kawai-pearl mb-4 uppercase tracking-wide">
                {locationContactData.locationName}
              </h2>
            )}
            <p className="text-kawai-neutral leading-relaxed">
              {locationDescription}
            </p>
          </div>
        ) : (
          <UnifiedFooterGrid
            locationContactData={locationContactData ?? null}
            locationDescription={locationDescription}
            promotedLinks={promotedLinks}
            resourceLinks={resourceLinks}
            storeLocations={storeLocations}
            site={site}
            isUniversityPage={isUniversityPage}
            newsletterAction={newsletterAction}
            newsletterState={newsletterState}
            newsletterPending={newsletterPending}
          />
        )}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-kawai-neutral/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright + Legal Links */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-kawai-neutral/80 text-sm mb-4 md:mb-0">
              <span>© 2026 Kawai America Corporation. All rights reserved.</span>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/privacy" className="hover:text-kawai-red transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/terms" className="hover:text-kawai-red transition-colors">
                Terms of Service
              </Link>
              <span className="hidden md:inline text-kawai-neutral/40">·</span>
              <Link href="/return-policy" className="hover:text-kawai-red transition-colors">
                Return Policy
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div key={social.label} variants={socialVariants} initial="initial" whileHover="hover">
                    <Link
                      href={social.href}
                      className="text-kawai-neutral/80 hover:text-kawai-red transition-colors"
                      aria-label={`${social.label} (opens in new window)`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-7 w-7" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Unified main-section grid
//
// Layout strategy:
//  - On mobile (default): intro block (logo + heading + quote + form) appears
//    first as a single column, then a 2-col grid of nav columns below.
//  - On md+: a single grid where intro sits in the rightmost (wider) column
//    and 3–4 nav columns fill the left. `md:contents` makes the mobile
//    2-col nav container disappear at md+ so nav columns become direct
//    grid children at their explicit col-start positions.
// ────────────────────────────────────────────────────────────────────────────

interface UnifiedGridProps {
  locationContactData: DealerLocationContactData | null
  locationDescription: string
  promotedLinks: QuickLink[]
  resourceLinks: ResourceLink[]
  storeLocations: StoreLocationNavItem[]
  site: 'us' | 'cad'
  isUniversityPage: boolean
  newsletterAction: (payload: FormData) => void
  newsletterState: NewsletterSignupResult | null
  newsletterPending: boolean
}

function UnifiedFooterGrid({
  locationContactData,
  locationDescription,
  promotedLinks,
  resourceLinks,
  storeLocations,
  site,
  isUniversityPage,
  newsletterAction,
  newsletterState,
  newsletterPending,
}: UnifiedGridProps) {
  const showShowrooms = site !== 'cad' && storeLocations.length > 0
  const visibleStores = storeLocations.slice(0, SHOWROOMS_VISIBLE)
  const hasMoreStores = storeLocations.length > SHOWROOMS_VISIBLE

  const exploreItems = [
    ...promotedLinks.map((l) => ({ label: l.label, href: l.url })),
    ...EXPLORE_EXTRAS,
  ]

  const resourceItems = resourceLinks
    .filter((l) => l.enabled !== false)
    .map((l) => ({
      label: l.title,
      href: l.href,
      external: l.openInNewTab === true || isExternalHref(l.href),
    }))

  // Grid template: nav columns 1fr each, intro 2fr (wider). Intro is placed
  // at the trailing column via col-start; nav columns claim col-start-1..N.
  const gridColsClass = showShowrooms
    ? 'md:grid-cols-[1fr_1fr_1fr_1fr_2fr]'
    : 'md:grid-cols-[1fr_1fr_1fr_2fr]'
  const introColStart = showShowrooms ? 'md:col-start-5' : 'md:col-start-4'

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-12 md:gap-10 md:items-start',
        gridColsClass,
      )}
    >
      {/* Intro: logo + heading + quote + newsletter form.
          Mobile: appears first (HTML order). Desktop: placed in trailing column. */}
      <div className={cn('md:row-start-1', introColStart)}>
        <div className="mb-5">
          <KawaiLogo
            size="sm"
            animated={true}
            theme="dark"
            {...(locationContactData?.locationName && { dealerName: locationContactData.locationName })}
          />
        </div>
        {locationContactData?.locationName && (
          <h2 className="text-xl md:text-2xl font-semibold text-kawai-pearl mb-3 uppercase tracking-wide">
            {locationContactData.locationName}
          </h2>
        )}
        <p className="text-kawai-neutral text-sm leading-relaxed mb-5">
          {locationDescription}
        </p>

        <h3 className="font-semibold text-base mb-2 text-kawai-pearl">Stay Connected</h3>
        <p className="text-kawai-neutral text-xs mb-3 leading-relaxed">
          Join our community for piano insights, artist stories, and exclusive events.
        </p>
        {newsletterState?.success ? (
          <p className="text-kawai-red font-medium text-sm">{newsletterState.message}</p>
        ) : (
          <form action={newsletterAction} className="flex flex-col sm:flex-row gap-2">
            {locationContactData?.slug && (
              <input type="hidden" name="storefrontSlug" value={locationContactData.slug} />
            )}
            <input
              type="email"
              name="email"
              aria-label="Email address for newsletter signup"
              placeholder="Enter your email"
              required
              className="flex-1 min-w-0 px-3 py-2 bg-kawai-black/60 border border-kawai-neutral/30 rounded-md text-kawai-pearl placeholder-kawai-neutral/60 focus:outline-none focus:ring-2 focus:ring-kawai-red backdrop-blur-sm text-sm"
            />
            <Button
              type="submit"
              disabled={newsletterPending}
              className="px-4 py-2 bg-kawai-red hover:bg-kawai-red/90 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-sm whitespace-nowrap"
            >
              {newsletterPending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
        {newsletterState && !newsletterState.success && (
          <p className="text-red-400 text-xs mt-2">{newsletterState.message}</p>
        )}

        {/* Dealer contact info — lives within the intro column when present */}
        {locationContactData && (
          <div className="mt-6 space-y-2 text-sm">
            {locationContactData.phone && !isUniversityPage && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-kawai-red shrink-0" />
                <span className="text-kawai-neutral">{locationContactData.phone}</span>
              </div>
            )}
            {locationContactData.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-kawai-red shrink-0" />
                <span className="text-kawai-neutral">{locationContactData.email}</span>
              </div>
            )}
            {locationContactData.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-kawai-red shrink-0" />
                <span className="text-kawai-neutral">{locationContactData.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav columns container: 2-col grid on mobile, dissolves into parent grid on md+ */}
      <div className="grid grid-cols-2 gap-8 md:contents">
        <NavColumn
          title="Pianos"
          items={PIANO_COLUMN}
          className="md:row-start-1 md:col-start-1"
        />
        <NavColumn
          title="Explore"
          items={exploreItems.map((i) => ({ ...i, external: isExternalHref(i.href) }))}
          className="md:row-start-1 md:col-start-2"
        />
        <NavColumn
          title="Resources"
          items={resourceItems}
          className="md:row-start-1 md:col-start-3"
        />
        {showShowrooms && (
          <NavColumn
            title="Showrooms"
            items={visibleStores.map((s) => ({
              label: displayStoreName(s),
              href: `/store/${s.slug}`,
            }))}
            footer={
              hasMoreStores ? (
                <Link
                  href="/find-a-dealer"
                  className="inline-flex items-center gap-1 text-kawai-red hover:text-kawai-red/80 transition-colors text-sm font-medium"
                >
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : undefined
            }
            className="md:row-start-1 md:col-start-4"
          />
        )}
      </div>
    </div>
  )
}