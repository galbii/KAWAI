'use client'

interface FeaturesListBlockProps {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: any
  features?: Array<{
    icon?: string | null
    title?: string | null
    description?: string | null
  }> | null
  layout?: {
    columns?: number | null
    showIcons?: boolean | null
    compact?: boolean | null
  }
}

// Icon mapping for different feature types
const iconMap = {
  music: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  piano: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v18m0 0l-3-3m3 3l3-3m6-15v18m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
  sound: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  quality: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  technology: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  connectivity: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  default: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

export function FeaturesListBlock({
  features = [],
  layout = {}
}: FeaturesListBlockProps) {
  if (!features || features.length === 0) {
    return null
  }
  
  const columns = layout.columns || 2
  const showIcons = layout.showIcons !== false
  const compact = layout.compact || false
  
  // Column classes for responsive grid
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  const gridClass = columnClasses[Math.min(columns, 4) as keyof typeof columnClasses] || columnClasses[2]
  const spacingClass = compact ? 'py-12' : 'py-16 lg:py-24'
  
  // Get icon component
  const getIcon = (iconName?: string | null) => {
    if (!showIcons) return null
    return iconMap[iconName as keyof typeof iconMap] || iconMap.default
  }
  
  return (
    <section className={`${spacingClass} bg-kawai-pearl`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid ${gridClass} gap-8`}>
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              {/* Icon */}
              {showIcons && (
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-kawai-red rounded-full flex items-center justify-center text-white transform transition-transform duration-500 hover:scale-110">
                    {getIcon(feature.icon)}
                  </div>
                </div>
              )}
              
              {/* Title */}
              {feature.title && (
                <h3 className="text-xl font-bold text-kawai-black">
                  {feature.title}
                </h3>
              )}
              
              {/* Description */}
              {feature.description && (
                <p className="text-kawai-black/70 leading-relaxed">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}