'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  src: string
  alt: string
  aspect: 'portrait' | 'landscape' | 'square'
  featured?: boolean
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/gl10-hero.jpg',
    alt: 'GL-10 Baby Grand - Full View',
    aspect: 'landscape',
    featured: true
  },
  {
    src: '/images/gl10-hero.jpg',
    alt: 'GL-10 Side Profile',
    aspect: 'portrait'
  },
  {
    src: '/images/gl10-hero.jpg',
    alt: 'Millennium III Action Keyboard',
    aspect: 'landscape'
  },
  {
    src: '/images/gl10-hero.jpg',
    alt: 'GL-10 Interior - Soundboard',
    aspect: 'square'
  },
  {
    src: '/images/gl10-hero.jpg',
    alt: 'GL-10 Pedals Close-up',
    aspect: 'portrait'
  },
  {
    src: '/images/gl10-hero.jpg',
    alt: 'GL-10 in Living Room Setting',
    aspect: 'landscape'
  }
]

export default function GL10Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setTimeout(() => setSelectedImage(null), 300)
  }

  return (
    <>
      <section className="min-h-screen bg-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-kawai-charcoal mb-4">
              GL-10 Gallery
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the exquisite craftsmanship and timeless elegance of the GL-10 Baby Grand
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl bg-gray-100',
                  'cursor-pointer transition-all duration-300',
                  'hover:shadow-2xl hover:scale-[1.02]',
                  image.featured && 'md:col-span-2 md:row-span-2',
                  image.aspect === 'portrait' && !image.featured && 'md:row-span-2',
                  image.aspect === 'square' && 'aspect-square'
                )}
                onClick={() => openLightbox(image)}
              >
                {/* Image */}
                <div className={cn(
                  'relative w-full',
                  image.featured ? 'h-[500px]' : 'h-[300px]',
                  image.aspect === 'portrait' && !image.featured && 'h-[400px]'
                )}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Overlay */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'flex items-end justify-between p-6'
                )}>
                  <p className="text-white font-medium text-lg">
                    {image.alt}
                  </p>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-kawai-pearl to-white rounded-3xl p-8 md:p-12 border border-[#8B7355]/10">
              <h3 className="text-2xl md:text-3xl font-serif text-kawai-charcoal mb-4">
                Every Detail, Perfected
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                The GL-10 represents the pinnacle of Kawai&apos;s baby grand piano craftsmanship.
                At just 5&apos;0&quot;, it delivers a full grand piano experience with Millennium III
                Action technology, premium materials, and award-winning design.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/60 rounded-full">
                  <span className="text-[#8B7355] font-semibold">5&apos;0&quot;</span> Compact Length
                </div>
                <div className="px-4 py-2 bg-white/60 rounded-full">
                  <span className="text-[#8B7355] font-semibold">Millennium III</span> Action
                </div>
                <div className="px-4 py-2 bg-white/60 rounded-full">
                  <span className="text-[#8B7355] font-semibold">Handcrafted</span> in Japan
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-6xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-6 left-6 right-6 text-center"
            >
              <p className="text-white text-lg font-medium">
                {selectedImage.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
