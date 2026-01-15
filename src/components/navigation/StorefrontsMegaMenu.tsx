'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface StorefrontCardData {
  id: string
  slug: string
  locationName: string
  locationText: string
  establishedText?: string
  showroomInfo?: {
    address?: string
    phone?: string
  }
  features?: Array<{ title: string }>
}

interface StorefrontsMegaMenuProps {
  /** Active storefronts to display */
  storefronts: StorefrontCardData[]
  /** Whether the menu is currently open */
  isOpen: boolean
  /** Callback when menu should close */
  onClose: () => void
  /** Optional CSS class */
  className?: string
  /** Whether data is still loading */
  isLoading?: boolean
  /** Whether the header is in scrolled (compact) state */
  isHeaderScrolled?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * StorefrontsMegaMenu - Horizontal scrolling mega menu for official storefronts
 *
 * Features:
 * - Full-width viewport display
 * - Horizontal scroll with scroll buttons
 * - Branded storefront cards matching homepage design
 * - Smooth animations with framer-motion
 * - Responsive design
 *
 * @example
 * ```tsx
 * <StorefrontsMegaMenu
 *   storefronts={storefrontsData}
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 * />
 * ```
 */
export function StorefrontsMegaMenu({
  storefronts,
  isOpen,
  onClose,
  className,
  isLoading = false,
  isHeaderScrolled = false,
}: StorefrontsMegaMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll left/right handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="storefronts-mega-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'fixed left-0 right-0 z-50',
            'bg-white border-t border-b border-gray-200/50 shadow-2xl',
            'transition-[top] duration-300 ease-in-out',
            className
          )}
          style={{
            top: isHeaderScrolled ? '64px' : '80px',
            width: '100vw',
          }}
        >
          <div className="relative py-6 pb-8">
            {isLoading ? (
              /* Loading State */
              <div className="container mx-auto px-4 sm:px-6">
                <div className="flex space-x-4 overflow-x-hidden">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[320px] h-[280px] bg-gray-200 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Actual Content */
              <>
                {/* Header */}
                <div className="container mx-auto px-4 sm:px-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-kawai-black mb-1">
                        Official Kawai Storefronts
                      </h2>
                      <p className="text-sm text-gray-600">
                        Visit our authorized Kawai Piano Gallery locations • {storefronts.length} {storefronts.length === 1 ? 'location' : 'locations'}
                      </p>
                    </div>

                    {/* Scroll Controls */}
                    {storefronts.length > 3 && (
                      <div className="hidden lg:flex items-center space-x-2">
                        <button
                          onClick={scrollLeft}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Scroll left"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <button
                          onClick={scrollRight}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Scroll right"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizontal Scrolling Cards */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto overflow-y-visible scrollbar-hide px-4 sm:px-6"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div className="flex space-x-6 pb-4 justify-center" style={{ minWidth: 'max-content' }}>
                    {storefronts.map((storefront, index) => (
                      <motion.div
                        key={storefront.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex-shrink-0"
                        style={{ width: '320px' }}
                      >
                        <Link
                          href={`/${storefront.slug}`}
                          onClick={onClose}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 min-h-[280px] flex flex-col block border border-gray-100"
                        >
                          <div className="p-6 flex-1 flex flex-col">
                            {/* Location Header */}
                            <div className="mb-4">
                              <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-3">
                                {storefront.locationText || 'Kawai Showroom'}
                              </div>
                              {/* Small Kawai Logo */}
                              <div className="mb-3 flex justify-start">
                                <Image
                                  src="/images/Kawai (Red)(2).png"
                                  alt="KAWAI"
                                  width={60}
                                  height={18}
                                  className="h-3 w-auto"
                                />
                              </div>
                              <h3 className="text-xl font-bold text-kawai-black mb-2 group-hover:text-kawai-red transition-colors leading-tight uppercase">
                                {storefront.locationName}
                              </h3>
                              <div className="w-12 h-px bg-kawai-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-3 mb-4 flex-1">
                              {storefront.showroomInfo?.address && (
                                <div className="flex items-start space-x-3">
                                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                  </div>
                                  <p className="text-xs text-kawai-black/70 leading-relaxed">
                                    {storefront.showroomInfo.address}
                                  </p>
                                </div>
                              )}

                              {storefront.showroomInfo?.phone && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                  </div>
                                  <p className="text-xs text-kawai-black/70">
                                    {storefront.showroomInfo.phone}
                                  </p>
                                </div>
                              )}

                              {storefront.establishedText && (
                                <div className="flex items-center space-x-3">
                                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                  </div>
                                  <p className="text-xs text-kawai-black/70">
                                    {storefront.establishedText}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Key Features */}
                            {storefront.features && storefront.features.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {storefront.features.map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
                                    >
                                      {feature.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Visit Button */}
                            <div className="pt-3 border-t border-kawai-pearl mt-auto">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                                  Visit Showroom
                                </span>
                                <div className="w-6 h-6 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-colors">
                                  <svg
                                    className="w-3 h-3 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Scroll Hint for Mobile */}
                {storefronts.length > 1 && (
                  <div className="lg:hidden text-center mt-4 text-xs text-gray-500">
                    ← Scroll to see more locations →
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
