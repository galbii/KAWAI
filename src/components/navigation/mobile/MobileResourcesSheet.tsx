'use client'

import Link from 'next/link'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  X,
  Headphones,
  Shield,
  Briefcase,
  MapPin,
  Cpu,
  Building2,
  GraduationCap,
  BookOpen,
  Globe,
  Wrench,
  Music,
  Info,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResourceLink, StoreLocationNavItem } from '@/components/layout/header-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MobileResourcesSheetProps {
  isOpen: boolean
  onBack: () => void
  onNavigate: () => void
  storeLocations?: StoreLocationNavItem[] | undefined
  resourceLinks?: ResourceLink[] | undefined
  registerEnabled?: boolean | undefined
  /** 'cad' hides showrooms — Kawai has no physical showrooms in Canada */
  site?: 'us' | 'cad'
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

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

const DEFAULT_RESOURCE_ITEMS = [
  { title: 'Support Center', description: 'Troubleshooting, firmware, warranty & care', href: '/technical-support-division', icon: 'headphones' },
  { title: 'Warranty', description: 'Register and manage your piano warranty', href: '/warranty-registration', icon: 'shield' },
  { title: 'Careers', description: 'Join the Kawai team', href: '/careers', icon: 'briefcase' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export function MobileResourcesSheet({
  isOpen,
  onBack,
  onNavigate,
  storeLocations = [],
  resourceLinks,
  registerEnabled = true,
  site = 'us',
}: MobileResourcesSheetProps) {
  const MIGRATION_NAV = process.env.NEXT_PUBLIC_MIGRATION_NAV === 'true'
  const showShowrooms = site !== 'cad' && storeLocations.length > 0

  const resources = resourceLinks && resourceLinks.length > 0
    ? resourceLinks.filter((r) => r.enabled !== false)
    : DEFAULT_RESOURCE_ITEMS

  const filteredResources = MIGRATION_NAV
    ? resources
    : resources.filter((r) => !('migration' in r && r.migration))

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9502] bg-black/40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBack}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[9503] xl:hidden bg-kawai-pearl rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '92vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {/* handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-kawai-neutral/60" />
            </div>

            {/* header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-kawai-neutral/40">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-kawai-charcoal hover:text-kawai-black transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h2 className="text-base font-bold tracking-tight text-kawai-black">{showShowrooms ? 'Official Stores & Resources' : 'Resources'}</h2>
              <button
                onClick={onNavigate}
                className="p-1.5 rounded-md hover:bg-kawai-neutral/30 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-kawai-charcoal" />
              </button>
            </div>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto min-h-0">

              {/* Showrooms section */}
              {showShowrooms && (
                <section className="px-4 pt-5 pb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-kawai-charcoal/50 px-1 mb-3">
                    Our Showrooms
                  </p>
                  <div className="space-y-1">
                    {storeLocations.map((store) => (
                      <Link
                        key={store.id}
                        href={`/store/${store.slug}`}
                        onClick={onNavigate}
                        className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-kawai-neutral/30 hover:border-kawai-red/40 hover:bg-kawai-pearl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-kawai-red/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-kawai-red" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-kawai-black leading-tight">
                              {store.city ?? store.locationName}
                            </p>
                            {store.state && (
                              <p className="text-xs text-kawai-charcoal/50 mt-0.5">{store.state}</p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/stores"
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-1.5 mt-3 py-2.5 text-xs font-semibold text-kawai-charcoal/60 hover:text-kawai-red transition-colors"
                  >
                    View all official stores
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </section>
              )}

              {/* divider */}
              {showShowrooms && (
                <div className="mx-4 border-t border-kawai-neutral/40" />
              )}

              {/* Resources section */}
              <section className="px-4 pt-5 pb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-kawai-charcoal/50 px-1 mb-3">
                  Resources
                </p>
                <div className="space-y-1">
                  {filteredResources.map((item) => {
                    const IconComponent = ICON_MAP[item.icon ?? 'info'] ?? Info
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        target={'openInNewTab' in item && item.openInNewTab ? '_blank' : undefined}
                        rel={'openInNewTab' in item && item.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-3 px-4 py-3.5 bg-white rounded-xl border border-kawai-neutral/30 hover:border-kawai-red/40 hover:bg-kawai-pearl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-kawai-black/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-kawai-red/10 transition-colors">
                          <IconComponent className="w-4 h-4 text-kawai-charcoal group-hover:text-kawai-red transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-kawai-black">{item.title}</p>
                          {'description' in item && item.description && (
                            <p className="text-xs text-kawai-charcoal/50 mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-kawai-charcoal/20 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                      </Link>
                    )
                  })}
                </div>
              </section>

              {/* Register CTA */}
              {registerEnabled !== false && (
                <div className="px-4 pb-6">
                  <Link
                    href="/warranty-registration"
                    onClick={onNavigate}
                    className="flex items-center justify-between w-full px-5 py-4 bg-kawai-black text-white rounded-xl hover:bg-kawai-charcoal transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm">Register Your Piano</p>
                      <p className="text-white/50 text-xs mt-0.5">Activate your warranty today</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
