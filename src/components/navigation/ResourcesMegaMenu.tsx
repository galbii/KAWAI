'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Headphones, Briefcase, ArrowRight, Cpu, Building2, GraduationCap, BookOpen, Store, Shield, Globe, Wrench, Music, Info, ChevronDown, MapPin } from 'lucide-react'
import type { ResourceLink, StoreLocationNavItem } from '@/components/layout/header-dynamic'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface ResourceItem {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
  migration?: boolean
  openInNewTab?: boolean
}

interface ResourcesMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  /** @deprecated Navigation now goes to /warranty-registration directly */
  onRegisterClick?: () => void
  registerEnabled?: boolean
  bannerImageUrl?: string | null
  bannerTitle?: string | null
  bannerDescription?: string | null
  resourceLinks?: ResourceLink[]
  storeLocations?: StoreLocationNavItem[] | undefined
  className?: string
  isHeaderScrolled?: boolean
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  headphones: Headphones,
  shield: Shield,
  briefcase: Briefcase,
  store: Store,
  'building-2': Building2,
  cpu: Cpu,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  globe: Globe,
  wrench: Wrench,
  music: Music,
  info: Info,
}

// ============================================================================
// Resource Items Data
// ============================================================================

// Defaults to hidden. Set NEXT_PUBLIC_MIGRATION_NAV=true to show Technology, Company, Institutions, and Glossary.
const MIGRATION_NAV_ENABLED = process.env.NEXT_PUBLIC_MIGRATION_NAV === 'true'

const allResourceItems: ResourceItem[] = [
  {
    title: 'Support Center',
    description: 'Troubleshooting, connectivity, firmware, warranty, and piano care — for owners, buyers, and technicians.',
    href: '/technical-support-division',
    icon: Headphones,
  },
  {
    title: 'Technology',
    description: 'ABS-Carbon actions, Harmonic Imaging sound engines, wooden key actions, and the science behind Kawai pianos.',
    href: '/technology',
    icon: Cpu,
    migration: true,
  },
  {
    title: 'Company',
    description: 'Our history, philosophy, founder story, awards, and the legacy behind every Kawai instrument.',
    href: '/company',
    icon: Building2,
    migration: true,
  },
  {
    title: 'Institutions',
    description: 'EPIC partnerships, fleet management, loan programs, and financial assistance for schools and universities.',
    href: '/institutions/epic-program',
    icon: GraduationCap,
    migration: true,
  },
  {
    title: 'Warranty',
    description: 'View Kawai\'s warranty coverage, terms, and claim information for your piano.',
    href: 'https://kawaius.com/warranty',
    icon: Shield,
  },
  {
    title: 'Careers',
    description: 'Join the Kawai team and help bring the world\'s finest pianos to musicians everywhere.',
    href: '/careers',
    icon: Briefcase,
  },
  {
    title: 'Glossary',
    description: 'A complete index of Kawai technology, company, and institutional resources — all in one place.',
    href: '/glossary',
    icon: BookOpen,
    migration: true,
  },
]

function displayStoreName(store: StoreLocationNavItem): string {
  return store.locationName.replace(/^kawai\s+/i, '').trim() || store.locationName
}

// ============================================================================
// Component
// ============================================================================

export function ResourcesMegaMenu({
  isOpen,
  onClose,
  registerEnabled = true,
  bannerImageUrl,
  bannerTitle,
  bannerDescription,
  resourceLinks,
  storeLocations,
  className,
  isHeaderScrolled = false,
}: ResourcesMegaMenuProps) {
  const [isStoresExpanded, setIsStoresExpanded] = useState(false)

  // Reset accordion when the menu closes so it doesn't appear pre-expanded on next open
  useEffect(() => {
    if (!isOpen) setIsStoresExpanded(false)
  }, [isOpen])

  // Use CMS-managed links when provided; fall back to hardcoded defaults.
  // Migration items (gated by env flag) are always appended on top of whichever source is active.
  const cmsItems: ResourceItem[] = (resourceLinks && resourceLinks.length > 0)
    ? resourceLinks
        .filter((l) => l.enabled !== false)
        .map((l) => ({
          title: l.title,
          description: l.description ?? '',
          href: l.href,
          icon: ICON_MAP[l.icon ?? ''] ?? Headphones,
          ...(l.openInNewTab !== undefined && { openInNewTab: l.openInNewTab }),
        }))
    : allResourceItems.filter((item) => !item.migration)

  const migrationItems = MIGRATION_NAV_ENABLED
    ? allResourceItems.filter((item) => item.migration)
    : []

  const activeItems: ResourceItem[] = [...cmsItems, ...migrationItems]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resources-mega-menu"
          initial={{ opacity: 0, scaleY: 0.97, y: -8 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            y: 0,
            top: isHeaderScrolled
              ? 'calc(112px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'
              : 'calc(128px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))',
          }}
          exit={{ opacity: 0, scaleY: 0.97, y: -8 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed z-[60] w-[95vw] max-w-[1440px]',
            'bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_32px_80px_-8px_rgba(0,0,0,0.28)] overflow-hidden rounded-2xl',
            className
          )}
          style={{ transformOrigin: 'top center', left: '50%', x: '-50%' }}
        >
          <div className="px-8 md:px-12 py-8 max-h-[75vh] overflow-y-auto">

            {/* Eyebrow label */}
            <p className="text-[10px] text-kawai-red/70 tracking-[0.45em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] mb-6">
              Resources
            </p>

            {/* ── Kawai Stores — expandable featured row ─────────────────── */}
            <div className="mb-2 border-b border-kawai-black/[0.06]">
              <button
                onClick={() => { if (storeLocations && storeLocations.length > 0) setIsStoresExpanded((v) => !v) }}
                className={cn(
                  'group relative w-full flex items-center justify-between py-4 pl-5 pr-3 transition-colors duration-200 text-left',
                  storeLocations && storeLocations.length > 0 ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <div className={cn(
                  'absolute left-0 top-0 w-[2px] bg-kawai-red transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
                  isStoresExpanded ? 'h-full' : 'h-0 group-hover:h-full'
                )} />
                <div className="flex items-baseline gap-2.5">
                  <Image
                    src="/images/Kawai (Red)(2).png"
                    alt="KAWAI"
                    width={52}
                    height={16}
                    className="h-[14px] w-auto self-center"
                  />
                  <span className={cn(
                    'text-[17px] font-semibold font-[family-name:var(--font-brand-sans)] transition-colors duration-200',
                    isStoresExpanded ? 'text-kawai-black' : 'text-kawai-black/80 group-hover:text-kawai-black'
                  )}>
                    Stores
                  </span>
                  <span className="text-xs text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] hidden sm:inline">
                    — official showrooms
                  </span>
                </div>
                {storeLocations && storeLocations.length > 0 ? (
                  <motion.div
                    animate={{ rotate: isStoresExpanded ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-colors duration-200',
                      isStoresExpanded ? 'text-kawai-red' : 'text-kawai-charcoal/35 group-hover:text-kawai-red/60'
                    )} />
                  </motion.div>
                ) : (
                  <ArrowRight className="w-4 h-4 text-kawai-red/0 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                )}
              </button>

              {/* Expanded locations grid */}
              <AnimatePresence initial={false}>
                {isStoresExpanded && storeLocations && storeLocations.length > 0 && (
                  <motion.div
                    key="stores-expanded"
                    initial={{ maxHeight: 0, opacity: 0 }}
                    animate={{ maxHeight: 600, opacity: 1 }}
                    exit={{ maxHeight: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-5 pt-1 pb-5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                        {storeLocations.map((store, i) => (
                          <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18, delay: i * 0.025, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            <Link
                              href={`/store/${store.slug}`}
                              onClick={onClose}
                              className="group/loc relative flex flex-col gap-0.5 py-2.5 px-3 rounded-md border border-kawai-neutral/50 hover:border-kawai-red/25 hover:bg-kawai-red/[0.025] transition-all duration-200 overflow-hidden"
                            >
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-kawai-red scale-y-0 group-hover/loc:scale-y-100 transition-transform duration-200 origin-center" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-kawai-black/80 group-hover/loc:text-kawai-black font-[family-name:var(--font-brand-sans)] leading-none truncate">
                                {displayStoreName(store)}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href="/stores"
                          onClick={onClose}
                          className="group/all inline-flex items-center gap-2 px-5 py-2.5 bg-kawai-red text-white hover:bg-kawai-red/85 transition-colors duration-200 rounded-sm font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.18em]"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          View all showrooms
                          <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Link rows ──────────────────────────────────────────────── */}
            <div className="divide-y divide-kawai-black/[0.06] mb-8">
              {activeItems.map((item, index) => {
                const Icon = item.icon
                const isDisabled = item.comingSoon

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link
                      href={isDisabled ? '#' : item.href}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (isDisabled) { e.preventDefault(); return }
                        onClose()
                      }}
                      className={cn(
                        'group relative flex items-start gap-5 py-5 pl-5 pr-2 transition-colors duration-200',
                        isDisabled ? 'cursor-default' : 'cursor-pointer'
                      )}
                    >
                      {/* Left red accent bar */}
                      {!isDisabled && (
                        <div className="absolute left-0 top-0 w-[2px] h-0 bg-kawai-red group-hover:h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                      )}

                      {/* Icon */}
                      <div className={cn(
                        'mt-0.5 flex-shrink-0 transition-colors duration-200',
                        isDisabled
                          ? 'text-kawai-charcoal/20'
                          : 'text-kawai-charcoal/35 group-hover:text-kawai-red',
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={cn(
                            'text-[15px] font-medium font-[family-name:var(--font-brand-sans)] transition-colors duration-200 leading-none',
                            isDisabled
                              ? 'text-kawai-black/30'
                              : 'text-kawai-black/65 group-hover:text-kawai-black',
                          )}>
                            {item.title}
                          </span>
                          {item.comingSoon && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase bg-kawai-neutral/60 text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          'text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]',
                          isDisabled
                            ? 'text-kawai-charcoal/25'
                            : 'text-kawai-charcoal/45 group-hover:text-kawai-charcoal/65',
                        )}>
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      {!isDisabled && (
                        <div className="flex-shrink-0 mt-0.5 self-center">
                          <ArrowRight className="w-4 h-4 text-kawai-red/0 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all duration-200" />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* ── Register Your Piano — full-width bottom banner ─────────── */}
            {registerEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="border-t border-kawai-black/[0.06] pt-6"
              >
                <Link
                  href="/warranty-registration"
                  onClick={onClose}
                  className="group relative w-full overflow-hidden rounded-xl text-left transition-all duration-300 hover:shadow-lg bg-kawai-black flex"
                  style={{ height: '220px' }}
                >
                  {bannerImageUrl ? (
                    /* ── With banner image ─────────────────────────────── */
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerImageUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                      <div className="absolute inset-0 flex flex-col justify-center px-10 py-8">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
                          Piano Owner
                        </p>
                        <h3 className="text-2xl font-light text-white font-[family-name:var(--font-brand-serif)] mb-2 leading-tight">
                          {bannerTitle ?? 'Register Your Piano'}
                        </h3>
                        {bannerDescription && (
                          <p className="mt-1 max-w-sm text-sm text-white/65 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                            {bannerDescription}
                          </p>
                        )}
                        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-kawai-black transition-colors group-hover:bg-kawai-red group-hover:text-white font-[family-name:var(--font-brand-sans)]">
                          Register Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </>
                  ) : (
                    /* ── No image fallback ─────────────────────────────── */
                    <div className="absolute inset-0 flex items-center justify-between px-10">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-kawai-red mb-2 font-[family-name:var(--font-brand-sans)]">
                          Piano Owner
                        </p>
                        <p className="text-xl font-light text-white font-[family-name:var(--font-brand-serif)]">
                          {bannerTitle ?? 'Register Your Piano'}
                        </p>
                        <p className="mt-1 text-sm text-white/50 font-[family-name:var(--font-brand-sans)]">
                          {bannerDescription ?? 'Activate your warranty and unlock owner benefits.'}
                        </p>
                      </div>
                      <span className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-white/20 font-[family-name:var(--font-brand-sans)]">
                        Register Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </Link>
              </motion.div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
