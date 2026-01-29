import React from 'react'
import type { ProductSpecificationsBlock } from '@/payload-types'
import { cn } from '@/lib/utils'

interface ProductSpecsRendererProps extends ProductSpecificationsBlock {}

export function ProductSpecsRenderer({
  header,
  categories,
  layout,
}: ProductSpecsRendererProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  const style = layout?.style || 'table'
  const compactMode = layout?.compactMode ?? false
  const alternateRows = layout?.alternateRows ?? true

  return (
    <section className="my-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(header?.title || header?.description) && (
          <div className="mb-8">
            {header?.title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {header.title}
              </h2>
            )}
            {header?.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Table Style */}
        {style === 'table' && (
          <div className="space-y-8">
            {categories.map((category, catIndex) => (
              <div key={catIndex} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow">
                <h3 className="text-xl font-semibold bg-gray-100 dark:bg-gray-800 px-6 py-4">
                  {category.categoryName}
                </h3>
                <table className="w-full">
                  <tbody>
                    {category.specifications?.map((spec, specIndex) => (
                      <tr
                        key={specIndex}
                        className={cn(
                          alternateRows && specIndex % 2 === 0 && 'bg-gray-50 dark:bg-gray-800',
                          spec.highlight && 'bg-yellow-50 dark:bg-yellow-900/20 font-semibold',
                          compactMode ? 'text-sm' : ''
                        )}
                      >
                        <td className={cn(
                          'px-6 border-b border-gray-200 dark:border-gray-700',
                          compactMode ? 'py-2' : 'py-4'
                        )}>
                          {spec.label}
                        </td>
                        <td className={cn(
                          'px-6 border-b border-gray-200 dark:border-gray-700',
                          compactMode ? 'py-2' : 'py-4'
                        )}>
                          <div>
                            <span>{spec.value}</span>
                            {spec.note && (
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                ({spec.note})
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Cards Style */}
        {style === 'cards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, catIndex) => (
              <div key={catIndex} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                  {category.categoryName}
                </h3>
                <dl className="space-y-3">
                  {category.specifications?.map((spec, specIndex) => (
                    <div
                      key={specIndex}
                      className={cn(
                        spec.highlight && 'bg-yellow-50 dark:bg-yellow-900/20 -mx-2 px-2 py-1 rounded'
                      )}
                    >
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {spec.label}
                      </dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white">
                        {spec.value}
                        {spec.note && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({spec.note})
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}

        {/* List Style */}
        {style === 'list' && (
          <div className="space-y-8">
            {categories.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-2xl font-semibold mb-4">
                  {category.categoryName}
                </h3>
                <dl className="space-y-2">
                  {category.specifications?.map((spec, specIndex) => (
                    <div
                      key={specIndex}
                      className={cn(
                        'flex justify-between py-2 border-b border-gray-200 dark:border-gray-700',
                        spec.highlight && 'bg-yellow-50 dark:bg-yellow-900/20 px-4 -mx-4 rounded'
                      )}
                    >
                      <dt className="font-medium text-gray-700 dark:text-gray-300">
                        {spec.label}
                      </dt>
                      <dd className="text-gray-900 dark:text-white">
                        {spec.value}
                        {spec.note && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({spec.note})
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
