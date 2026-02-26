'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Headphones, Mail } from 'lucide-react'
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
}

interface ResourcesMegaMenuProps {
  /** Whether the menu is currently open */
  isOpen: boolean
  /** Callback when menu should close */
  onClose: () => void
  /** Called when the user clicks "Register Now" — parent handles the modal */
  onRegisterClick: () => void
  /** Whether the Register Your Piano section is enabled (CMS toggle) */
  registerEnabled?: boolean
  /** Banner image URL from CMS (shown in the bottom row) */
  bannerImageUrl?: string | null
  /** Overlay title on the banner */
  bannerTitle?: string | null
  /** Overlay description on the banner */
  bannerDescription?: string | null
  /** Optional CSS class */
  className?: string
  /** Whether the header is in scrolled (compact) state */
  isHeaderScrolled?: boolean
}

// ============================================================================
// Resource Items Data
// ============================================================================

const resourceItems: ResourceItem[] = [
  {
    title: 'Technical Support',
    description: 'Get help with your Kawai piano, troubleshooting, and technical assistance',
    href: '/resources/technical-support',
    icon: Headphones,
    comingSoon: true,
  },
  {
    title: 'Contact Us',
    description: 'Reach out to our team for inquiries, questions, or assistance',
    href: '/resources/contact',
    icon: Mail,
    comingSoon: true,
  },
]


// ============================================================================
// Component
// ============================================================================

/**
 * ResourcesMegaMenu - Full-width mega menu for resources navigation
 *
 * Features:
 * - Clean grid layout with resource cards
 * - Icon-based visual design
 * - Coming soon badges for inactive links
 * - Smooth animations with framer-motion
 * - Responsive design
 *
 * @example
 * ```tsx
 * <ResourcesMegaMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 * />
 * ```
 */
export function ResourcesMegaMenu({
  isOpen,
  onClose,
  onRegisterClick,
  registerEnabled = true,
  bannerImageUrl,
  bannerTitle,
  bannerDescription,
  className,
  isHeaderScrolled = false,
}: ResourcesMegaMenuProps) {
  const handleRegister = () => {
    onClose()
    onRegisterClick()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resources-mega-menu"
          initial={{ opacity: 0, scaleY: 0.95, y: -20 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            y: 0,
            top: isHeaderScrolled
              ? 'calc(112px + var(--announcement-bar-height, 0px))'
              : 'calc(128px + var(--announcement-bar-height, 0px))',
          }}
          exit={{ opacity: 0, scaleY: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'bg-white border-b border-gray-200 shadow-2xl',
            className
          )}
          style={{
            transformOrigin: 'top center',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Resources & Support
              </h2>
              <p className="text-sm text-gray-600">
                Everything you need to get the most out of your Kawai piano
              </p>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              {resourceItems.map((resource, index) => {
                const Icon = resource.icon

                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={resource.comingSoon ? '#' : resource.href}
                      onClick={(e) => {
                        if (resource.comingSoon) {
                          e.preventDefault()
                        } else {
                          onClose()
                        }
                      }}
                      className={cn(
                        'group block bg-white rounded-xl border-2 transition-all duration-300 h-full',
                        'hover:shadow-lg',
                        resource.comingSoon
                          ? 'border-gray-200 cursor-default'
                          : 'border-gray-200 hover:border-kawai-red cursor-pointer'
                      )}
                    >
                      <div className="p-6 flex flex-col h-full">
                        {/* Icon */}
                        <div className="mb-4 relative">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300',
                              resource.comingSoon
                                ? 'bg-gray-100'
                                : 'bg-kawai-red/10 group-hover:bg-kawai-red'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-7 w-7 transition-colors duration-300',
                                resource.comingSoon
                                  ? 'text-gray-400'
                                  : 'text-kawai-red group-hover:text-white'
                              )}
                            />
                          </div>

                          {/* Coming Soon Badge */}
                          {resource.comingSoon && (
                            <div className="absolute -top-1 -right-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-400/90 text-yellow-900 border border-yellow-500/50">
                                Coming Soon
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3
                            className={cn(
                              'text-lg font-bold mb-2 transition-colors duration-300',
                              resource.comingSoon
                                ? 'text-gray-500'
                                : 'text-gray-900 group-hover:text-kawai-red'
                            )}
                          >
                            {resource.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Register Your Piano — bottom row */}
            {registerEnabled && <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={handleRegister}
                className="group relative w-full overflow-hidden rounded-xl text-left transition-all duration-200 hover:shadow-lg bg-kawai-black"
                style={{ height: '320px' }}
              >
                {bannerImageUrl ? (
                  /* ── With banner image ─────────────────────────────── */
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bannerImageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                    {/* Text + CTA */}
                    <div className="absolute inset-0 flex flex-col justify-center px-10 py-8">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-kawai-red">
                        Piano Owner
                      </p>
                      <h3 className="text-2xl font-bold text-white">
                        {bannerTitle ?? 'Register Your Piano'}
                      </h3>
                      {bannerDescription && (
                        <p className="mt-2 max-w-sm text-sm text-white/75">{bannerDescription}</p>
                      )}
                      <span className="mt-5 inline-flex w-fit items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-kawai-black transition-colors group-hover:bg-kawai-red group-hover:text-white">
                        Register Now
                      </span>
                    </div>
                  </>
                ) : (
                  /* ── No image fallback ─────────────────────────────── */
                  <div className="absolute inset-0 flex items-center justify-between px-8">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {bannerTitle ?? 'Register Your Piano'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {bannerDescription ?? 'Activate your warranty and unlock owner benefits'}
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-white/20">
                      Register Now
                    </span>
                  </div>
                )}
              </button>
            </div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
