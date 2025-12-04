import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { KAWAI_SEO_CONFIG } from '@/lib/seo'

interface BreadcrumbItem {
  name: string
  url: string
}

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Events', url: '/events' },
  { name: 'NAMM 2026', url: '/namm-2026' }
]

/**
 * NAMMBreadcrumbs Component
 *
 * Displays breadcrumb navigation for the NAMM 2026 page
 * Includes Schema.org BreadcrumbList structured data for enhanced SEO
 *
 * Benefits:
 * - Improves UX with clear navigation hierarchy
 * - Enhances SEO with structured data breadcrumbs
 * - Helps Google display rich breadcrumbs in search results
 * - Provides accessibility context for screen readers
 */
export function NAMMBreadcrumbs() {
  const siteUrl = KAWAI_SEO_CONFIG.siteUrl

  // Generate BreadcrumbList structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: index === breadcrumbItems.length - 1
        ? undefined // Current page doesn't need item URL
        : `${siteUrl}${item.url}`
    }))
  }

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="bg-kawai-pearl/50 border-b border-kawai-black/10"
      >
        <div className="container mx-auto px-6 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1
              const isFirst = index === 0

              return (
                <li key={item.url} className="flex items-center">
                  {/* Separator */}
                  {!isFirst && (
                    <ChevronRight
                      className="w-4 h-4 mx-2 text-kawai-black/40"
                      aria-hidden="true"
                    />
                  )}

                  {/* Breadcrumb Link or Text */}
                  {isLast ? (
                    // Current page - no link
                    <span
                      className="text-kawai-black font-medium flex items-center"
                      aria-current="page"
                    >
                      {item.name}
                    </span>
                  ) : (
                    // Clickable breadcrumb
                    <Link
                      href={item.url}
                      className="text-kawai-black/60 hover:text-kawai-red transition-colors flex items-center"
                    >
                      {isFirst && (
                        <Home
                          className="w-4 h-4 mr-1"
                          aria-hidden="true"
                        />
                      )}
                      {item.name}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
