import { cn } from '@/lib/utils'
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'

interface GalleryImage {
  image: any // Media object or string
  alt?: string
  caption?: string
}

interface CategoryImageGridProps {
  galleryImages?: GalleryImage[]
  category: string
  fallbackToPlaceholder?: boolean
}

export function CategoryImageGrid({ 
  galleryImages, 
  category, 
  fallbackToPlaceholder = true 
}: CategoryImageGridProps) {
  
  // If no gallery images provided or less than 3, show placeholders or nothing
  if (!galleryImages || galleryImages.length === 0) {
    if (!fallbackToPlaceholder) return null
    
    // Fallback to placeholder logic (simplified version)
    const placeholderCount = 3
    const getPlaceholderTheme = (cat: string) => {
      switch (cat) {
        case 'grand':
          return 'bg-gradient-to-br from-kawai-neutral/15 via-kawai-neutral/8 to-kawai-neutral/3'
        case 'digital':
          return 'bg-gradient-to-r from-kawai-neutral/12 via-kawai-neutral/6 to-kawai-neutral/4'
        case 'upright':
          return 'bg-gradient-to-b from-kawai-neutral/10 via-kawai-neutral/8 to-kawai-neutral/5'
        case 'hybrid':
          return 'bg-gradient-to-tl from-kawai-neutral/14 via-kawai-neutral/7 to-kawai-neutral/3'
        default:
          return 'bg-gradient-to-br from-kawai-neutral/10 to-kawai-neutral/5'
      }
    }

    const gradient = getPlaceholderTheme(category)

    return (
      <div className="w-full py-8 -mx-6">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
            {Array.from({ length: placeholderCount }, (_, index) => (
              <div
                key={index}
                className={cn(
                  'relative w-full h-80 md:h-96 overflow-hidden',
                  gradient,
                  'border border-kawai-neutral/20',
                  'transition-all duration-500 ease-out',
                  'hover:scale-[1.02] hover:shadow-lg hover:border-kawai-neutral/30',
                  'group cursor-default'
                )}
                role="img"
                aria-label={`${category} piano showcase placeholder ${index + 1}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-kawai-black/30 rounded-full opacity-60" />
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-kawai-neutral/40 rounded-full opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render actual CMS images
  return (
    <div className="w-full py-8 -mx-6">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
          {galleryImages.slice(0, 3).map((imageItem, index) => (
            <div
              key={index}
              className={cn(
                'relative w-full h-80 md:h-96 overflow-hidden',
                'border border-kawai-neutral/20',
                'transition-all duration-500 ease-out',
                'hover:scale-[1.02] hover:shadow-lg hover:border-kawai-neutral/30',
                'group'
              )}
            >
              <MediaRenderer
                media={imageItem.image}
                preset="gallery"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                aria-label={imageItem.alt || (typeof imageItem.image === 'object' && imageItem.image.alt) || `${category} piano showcase ${index + 1}`}
                priority={index === 0} // Prioritize first image
              />
              
              {/* Optional caption overlay */}
              {imageItem.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {imageItem.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {/* If less than 3 images, fill with placeholders */}
          {galleryImages.length < 3 && fallbackToPlaceholder && 
            Array.from({ length: 3 - galleryImages.length }, (_, index) => (
              <div
                key={`placeholder-${index}`}
                className={cn(
                  'relative w-full h-80 md:h-96 overflow-hidden',
                  'bg-gradient-to-br from-kawai-neutral/10 to-kawai-neutral/5',
                  'border border-kawai-neutral/20',
                  'transition-all duration-500 ease-out',
                  'hover:scale-[1.02] hover:shadow-lg hover:border-kawai-neutral/30',
                  'group cursor-default'
                )}
                role="img"
                aria-label={`${category} piano showcase placeholder ${galleryImages.length + index + 1}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-kawai-black/30 rounded-full opacity-60" />
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-kawai-neutral/40 rounded-full opacity-60" />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}