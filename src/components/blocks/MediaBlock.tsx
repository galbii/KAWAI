import React from 'react'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = MediaBlockProps & {
  className?: string
  imgClassName?: string
  enableGutter?: boolean
}

/**
 * MediaBlock Component
 *
 * Renders an image or media file from a URL. The URL can be from the media library
 * or an external source. Uses Next.js Image component for optimization when possible.
 *
 * Server Component
 */
export function MediaBlock({
  mediaUrl,
  alt,
  caption,
  className,
  imgClassName,
  enableGutter = true
}: Props) {
  if (!mediaUrl || !alt) {
    return null
  }

  // Determine if this is an external URL (for optimization purposes)
  const isExternal = mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')
  const isInternal = mediaUrl.startsWith('/')

  return (
    <div
      className={cn(
        'my-16',
        {
          'container': enableGutter,
        },
        className
      )}
    >
      <div className="relative rounded-lg overflow-hidden">
        <Image
          src={mediaUrl}
          alt={alt}
          width={1200}
          height={800}
          className={cn('w-full h-auto', imgClassName)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          // Use unoptimized for external URLs from different domains
          unoptimized={isExternal && !mediaUrl.includes(process.env.NEXT_PUBLIC_S3_PUBLIC_URL || '')}
        />
      </div>

      {caption && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          {caption}
        </p>
      )}
    </div>
  )
}
