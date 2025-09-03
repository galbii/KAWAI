'use client'

interface SpecificationsBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  specifications?: Array<{
    category?: string | null
    specs?: Array<{
      label: string
      value: string
    }> | null
  }> | null
  layout?: {
    columns?: number | null
    showCategories?: boolean | null
    compact?: boolean | null
  }
}

export function SpecificationsBlock({
  specifications = [],
  layout = {}
}: SpecificationsBlockProps) {
  if (!specifications || specifications.length === 0) {
    return null
  }
  
  const columns = layout.columns || 2
  const showCategories = layout.showCategories !== false
  const compact = layout.compact || false
  
  // Column classes for responsive grid
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
  
  const gridClass = columnClasses[Math.min(columns, 3) as keyof typeof columnClasses] || columnClasses[2]
  const spacingClass = compact ? 'py-12' : 'py-16 lg:py-24'
  
  // Filter out empty categories
  const validSpecifications = specifications.filter(category => 
    category.specs && category.specs.length > 0
  )
  
  if (validSpecifications.length === 0) {
    return null
  }
  
  return (
    <section className={`${spacingClass} bg-white`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-kawai-black mb-4">
            Technical Specifications
          </h2>
          <div className="w-24 h-1 bg-kawai-red mx-auto rounded"></div>
        </div>
        
        {/* Specifications Grid */}
        <div className={`grid ${gridClass} gap-8`}>
          {validSpecifications.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              {/* Category Title */}
              {showCategories && category.category && (
                <h3 className="text-xl font-bold text-kawai-red border-b-2 border-kawai-red/20 pb-2">
                  {category.category}
                </h3>
              )}
              
              {/* Specifications Table */}
              <div className="space-y-3">
                {category.specs!.map((spec, specIndex) => (
                  <div 
                    key={specIndex}
                    className="flex justify-between items-center py-2 border-b border-kawai-neutral/10 last:border-b-0"
                  >
                    <span className="font-medium text-kawai-black/80">
                      {spec.label}
                    </span>
                    <span className="text-kawai-black font-semibold">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t border-kawai-neutral/20">
          <p className="text-kawai-black/70 mb-4">
            Need more detailed specifications or have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-kawai-red hover:bg-kawai-red/80 text-white font-medium rounded-md transition-colors"
          >
            Contact Our Experts
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}