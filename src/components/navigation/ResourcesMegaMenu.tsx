'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Headphones, Mail, FileText } from 'lucide-react'
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
  {
    title: 'Register My Piano',
    description: 'Register your Kawai piano for warranty coverage and exclusive benefits',
    href: '/resources/register-piano',
    icon: FileText,
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
  className,
  isHeaderScrolled = false,
}: ResourcesMegaMenuProps) {
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
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
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

                        {/* Action Indicator */}
                        {!resource.comingSoon && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 group-hover:text-kawai-red transition-colors">
                                Learn More
                              </span>
                              <div className="w-6 h-6 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-colors">
                                <svg
                                  className="w-3 h-3 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Need immediate assistance? Call us at{' '}
                <a
                  href="tel:1-800-KAWAI-US"
                  className="font-medium text-gray-900 hover:text-kawai-red transition-colors"
                >
                  1-800-KAWAI-US
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
