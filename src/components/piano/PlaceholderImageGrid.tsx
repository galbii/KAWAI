import { cn } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/icons/CategoryIcon'

interface PlaceholderImageGridProps {
  category: string
}

export function PlaceholderImageGrid({ category }: PlaceholderImageGridProps) {
  const getPlaceholderTheme = (cat: string) => {
    switch (cat) {
      case 'grand':
        return {
          gradient: 'bg-gradient-to-br from-kawai-neutral/15 via-kawai-neutral/8 to-kawai-neutral/3',
          pattern: 'piano-curve',
          description: 'Grand piano showcase placeholder'
        }
      case 'digital':
        return {
          gradient: 'bg-gradient-to-r from-kawai-neutral/12 via-kawai-neutral/6 to-kawai-neutral/4',
          pattern: 'digital-grid',
          description: 'Digital piano showcase placeholder'
        }
      case 'upright':
        return {
          gradient: 'bg-gradient-to-b from-kawai-neutral/10 via-kawai-neutral/8 to-kawai-neutral/5',
          pattern: 'upright-lines',
          description: 'Upright piano showcase placeholder'
        }
      case 'hybrid':
        return {
          gradient: 'bg-gradient-to-tl from-kawai-neutral/14 via-kawai-neutral/7 to-kawai-neutral/3',
          pattern: 'hybrid-blend',
          description: 'Hybrid piano showcase placeholder'
        }
      default:
        return {
          gradient: 'bg-gradient-to-br from-kawai-neutral/10 to-kawai-neutral/5',
          pattern: 'default',
          description: 'Piano showcase placeholder'
        }
    }
  }

  const theme = getPlaceholderTheme(category)
  const placeholderCount = 3

  return (
    <div className="w-full py-8 -mx-6">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
          {Array.from({ length: placeholderCount }, (_, index) => (
            <div
              key={index}
              className={cn(
                'relative w-full h-80 md:h-96 overflow-hidden',
                theme.gradient,
                'border border-kawai-neutral/20',
                'transition-all duration-500 ease-out',
                'hover:scale-[1.02] hover:shadow-lg hover:border-kawai-neutral/30',
                'group cursor-default'
              )}
              role="img"
              aria-label={`${theme.description} ${index + 1}`}
            >
              {/* Geometric Pattern Overlay */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
                {theme.pattern === 'piano-curve' && (
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-kawai-neutral/20 to-transparent rounded-b-xl" />
                )}
                {theme.pattern === 'digital-grid' && (
                  <>
                    <div className="absolute top-1/3 left-0 w-full h-px bg-kawai-neutral/30" />
                    <div className="absolute top-2/3 left-0 w-full h-px bg-kawai-neutral/20" />
                    <div className="absolute top-0 left-1/3 w-px h-full bg-kawai-neutral/25" />
                    <div className="absolute top-0 right-1/3 w-px h-full bg-kawai-neutral/25" />
                  </>
                )}
                {theme.pattern === 'upright-lines' && (
                  <>
                    <div className="absolute top-0 left-1/4 w-px h-full bg-kawai-neutral/30" />
                    <div className="absolute top-0 left-1/2 w-px h-full bg-kawai-neutral/20" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-kawai-neutral/30" />
                  </>
                )}
                {theme.pattern === 'hybrid-blend' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-kawai-neutral/15 to-transparent rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-kawai-neutral/10 to-transparent rounded-br-xl" />
                  </>
                )}
              </div>

              {/* Subtle Content Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <CategoryIcon iconName="piano" className="w-8 h-8 text-kawai-black" />
              </div>

              {/* Future Image Indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-kawai-neutral/40 rounded-full opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}