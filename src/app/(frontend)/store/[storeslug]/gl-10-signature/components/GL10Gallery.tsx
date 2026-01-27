'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  src: string
  alt: string
  model: string
  gridClass: string
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/signature/pianos/gl-10/gl-10-hero.webp',
    alt: 'GL-10 Baby Grand Piano - Full Elegance in Ebony Polish',
    model: 'GL-10',
    gridClass: 'col-span-2 md:col-span-4 lg:col-span-4 row-span-2'
  },
  {
    src: '/images/signature/pianos/gx-2/gx-2-detail.webp',
    alt: 'Millennium III Action - Precision Engineering',
    model: 'GX-2',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gl-30/gl-30-hero.webp',
    alt: 'GL-30 Grand Piano - Exceptional Performance',
    model: 'GL-30',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gx-1/gx-1-hero.webp',
    alt: 'GX-1 Grand Piano - Concert Hall Excellence',
    model: 'GX-1',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2'
  },
  {
    src: '/images/signature/pianos/gl-10/gl-10-detail.webp',
    alt: 'GL-10 Action Detail - Master Craftsmanship',
    model: 'GL-10',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gl-50/gl-50-hero.webp',
    alt: 'GL-50 Grand Piano - Studio Professional',
    model: 'GL-50',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gx-3/gx-3-hero.webp',
    alt: 'GX-3 Grand Piano - Sophisticated Design',
    model: 'GX-3',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gx-2/gx-2-hero.webp',
    alt: 'GX-2 Grand Piano - Premium Elegance',
    model: 'GX-2',
    gridClass: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1'
  },
  {
    src: '/images/signature/pianos/gl-10/f4QT8LYQ.jpeg',
    alt: 'Keyboard Detail - Responsive Touch',
    model: 'GL-10',
    gridClass: 'col-span-2 md:col-span-2 lg:col-span-3 row-span-1'
  },
  {
    src: '/images/signature/pianos/gl-30/GL-30 AURES2 EP 450.jpg',
    alt: 'GL-30 AURES2 - Advanced Technology',
    model: 'GL-30',
    gridClass: 'col-span-2 md:col-span-2 lg:col-span-3 row-span-1'
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              <span className="text-[#D4AF37]">Elevate</span>{' '}
              <span className="text-kawai-charcoal">your Space</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              See how you can elevate your space with a beautiful centerpiece that represents your legacy
            </p>
          </motion.div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <div
                key={index}
                className={cn(
                  'group relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-100',
                  'cursor-pointer transition-all duration-300',
                  'hover:shadow-2xl hover:scale-[1.02]',
                  image.gridClass
                )}
                onClick={() => openLightbox(image)}
              >
                {/* Image */}
                <div className="relative w-full h-full">
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
                  'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'flex items-center justify-center'
                )}>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
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
                Kawai&apos;s Signature Collection represents the pinnacle of piano craftsmanship. From the
                compact GL-10 baby grand to the concert-worthy GX series, each instrument delivers
                exceptional tone, touch, and timeless design with Millennium III Action technology and
                premium materials handcrafted in Japan.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/60 rounded-full">
                  <span className="text-[#8B7355] font-semibold">6 Models</span> Showcased
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
              className="relative w-full h-full max-w-[95vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
