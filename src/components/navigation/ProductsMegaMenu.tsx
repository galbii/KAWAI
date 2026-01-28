'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductTypeNav } from '@/lib/shopify'

// ============================================================================
// Types
// ============================================================================

interface ProductsMegaMenuProps {
  /** Product types with sample products */
  productTypes: ProductTypeNav[]
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
 * ProductsMegaMenu - Full-width mega menu for products navigation
 *
 * Features:
 * - Sidebar with product type categories
 * - Grid display of products for selected type
 * - Hover interactions and smooth animations
 * - Responsive design with mobile support
 *
 * @example
 * ```tsx
 * <ProductsMegaMenu
 *   productTypes={navData.types}
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 * />
 * ```
 */
export function ProductsMegaMenu({
  productTypes,
  isOpen,
  onClose,
  className,
  isLoading = false,
  isHeaderScrolled = false,
}: ProductsMegaMenuProps) {
  // Default to first product type
  const [selectedType, setSelectedType] = useState<string | null>(
    productTypes[0]?.type || null
  )

  // Get selected type data
  const selectedTypeData = productTypes.find((t) => t.type === selectedType)

  // Handle type selection
  const handleTypeSelect = useCallback((type: string) => {
    setSelectedType(type)
  }, [])

  // Handle product click
  const handleProductClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="products-mega-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'bg-white border-t border-b border-gray-200 shadow-2xl',
            'overflow-hidden',
            className
          )}
          style={{
            top: isHeaderScrolled ? '118px' : '126px',
            width: '100vw',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-6">
            {isLoading ? (
              /* Loading State */
              <div className="grid grid-cols-12 gap-0">
                {/* Sidebar Skeleton */}
                <div className="col-span-3 border-r border-gray-200 bg-gray-50 py-2">
                  <div className="pr-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-4 px-4 animate-pulse" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Content Skeleton */}
                <div className="col-span-9 pl-6">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Actual Content */
              <div className="grid grid-cols-12 gap-0">
                {/* Sidebar - Product Types */}
                <div className="col-span-3 border-r border-gray-200 bg-gray-50 py-2">
                  <div className="pr-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-4 px-4">
                      Product Categories
                    </h3>
                    <nav className="space-y-1">
                      {productTypes.map((typeData) => (
                        <button
                          key={typeData.type}
                          onClick={() => handleTypeSelect(typeData.type)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                            'flex items-center justify-between group',
                            selectedType === typeData.type
                              ? 'bg-kawai-red text-white font-semibold shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{typeData.type}</div>
                            <div className={cn(
                              "text-xs mt-0.5",
                              selectedType === typeData.type ? "text-white/90" : "text-gray-500"
                            )}>
                              {typeData.count} {typeData.count === 1 ? 'product' : 'products'}
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform duration-200',
                              selectedType === typeData.type
                                ? 'text-white translate-x-0.5'
                                : 'text-gray-400 group-hover:translate-x-0.5'
                            )}
                          />
                        </button>
                      ))}
                    </nav>

                    {/* View All Products Link */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Link
                        href="/products"
                        onClick={onClose}
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="col-span-9 pl-6">
                  <AnimatePresence mode="wait">
                    {selectedTypeData && (
                      <motion.div
                        key={selectedTypeData.type}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Header */}
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {selectedTypeData.type}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Explore our collection of {selectedTypeData.count} products
                          </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {selectedTypeData.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.handle}`}
                              onClick={handleProductClick}
                              className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-kawai-red hover:shadow-lg transition-all duration-200"
                            >
                              {/* Product Image */}
                              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                {product.image ? (
                                  <Image
                                    src={product.image.url}
                                    alt={product.image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    No image
                                  </div>
                                )}

                                {/* Availability Badge */}
                                {!product.available && (
                                  <div className="absolute top-2 right-2">
                                    <span className="inline-block px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="p-3">
                                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-kawai-red transition-colors line-clamp-2 mb-1">
                                  {product.title}
                                </h3>
                                <p className="text-sm font-bold text-gray-700">
                                  {product.price.display}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* View Category Link */}
                        <div className="pt-4 border-t border-gray-200">
                          <Link
                            href={`/products?type=${encodeURIComponent(selectedTypeData.type)}`}
                            onClick={onClose}
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-kawai-red hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            View All {selectedTypeData.type} Products
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
