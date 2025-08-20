import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Image mappings for seeding
export const pianoPageImages = {
  heroBackgroundImage: {
    path: '/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg',
    alt: 'Kawai NOVUS NV-10S hybrid piano keyboard detail',
    filename: 'hero-background-nv10s.jpg'
  },
  categoryImages: {
    grand: {
      path: '/images/piano-categories/grand.jpg',
      alt: 'Kawai Grand Piano',
      filename: 'category-grand-piano.jpg'
    },
    upright: {
      path: '/images/piano-categories/upright.png',
      alt: 'Kawai Upright Piano',
      filename: 'category-upright-piano.png'
    },
    digital: {
      path: '/images/piano-categories/digital.png',
      alt: 'Kawai Digital Piano',
      filename: 'category-digital-piano.png'
    },
    hybrid: {
      path: '/images/piano-categories/hybrid.jpg',
      alt: 'Kawai Hybrid Piano',
      filename: 'category-hybrid-piano.jpg'
    }
  },
  featuredModelImages: {
    gx7blak: {
      path: '/images/banners/GX-7-BLAK-grand-styling.webp',
      alt: 'Kawai GX-7 BLAK Grand Piano',
      filename: 'featured-gx7-blak.webp'
    },
    ca99: {
      path: '/images/banners/CA99-digital-styling.webp',
      alt: 'Kawai CA99 Digital Piano',
      filename: 'featured-ca99.webp'
    },
    nv10s: {
      path: '/images/banners/NV10S_along the keyboard_whiteBG.jpg',
      alt: 'Kawai NOVUS NV-10S Hybrid Piano',
      filename: 'featured-nv10s.jpg'
    }
  }
}

// Complete PianosPage seeding data structure
export const pianoPageSeedData = {
  // Hero Section
  heroTitle: 'Experience the Complete Kawai Piano Collection',
  heroDescription: 'From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.',
  heroCta: {
    text: 'Explore Categories',
    link: '#categories'
  },

  // Piano Categories (4 categories)
  pianoCategories: [
    {
      slug: 'grand',
      name: 'Acoustic Grand Pianos',
      description: 'Professional grand pianos featuring advanced technology and superior craftsmanship',
      priceRange: '$45,000 - $185,000',
      features: [
        { feature: 'Millennium III Action' },
        { feature: 'Carbon Fiber Components' },
        { feature: 'Neotex Key Surface' },
        { feature: 'Konami Tuning Pins' }
      ],
      icon: 'piano',
      badge: 'Professional',
      highlight: 'GX BLAK Performance Series'
    },
    {
      slug: 'upright',
      name: 'Acoustic Upright Pianos',
      description: 'Space-efficient acoustic pianos delivering exceptional touch and tone',
      priceRange: '$8,999 - $35,000',
      features: [
        { feature: 'Extended Length Keys' },
        { feature: 'Millennium III Prep' },
        { feature: 'Soft-Close Fallboard' },
        { feature: 'Premium Hammers' }
      ],
      icon: 'music',
      badge: 'Classic',
      highlight: 'K Professional Series'
    },
    {
      slug: 'digital',
      name: 'Digital Pianos',
      description: 'Cutting-edge digital instruments with authentic piano touch and sound',
      priceRange: '$1,999 - $12,999',
      features: [
        { feature: 'Grand Feel III Action' },
        { feature: 'Harmonic Imaging XL' },
        { feature: 'Onkyo Audio' },
        { feature: 'Bluetooth Connectivity' }
      ],
      icon: 'zap',
      badge: 'Innovation',
      highlight: 'Concert Artist Series'
    },
    {
      slug: 'hybrid',
      name: 'Hybrid Pianos',
      description: 'Revolutionary instruments combining acoustic action with digital versatility',
      priceRange: '$12,999 - $24,999',
      features: [
        { feature: 'Real Grand Action' },
        { feature: 'Silent Practice Mode' },
        { feature: 'Digital Recording' },
        { feature: 'Millennium III Action' }
      ],
      icon: 'award',
      badge: 'Hybrid Technology',
      highlight: 'NOVUS & AnyTime Series'
    }
  ],

  // Featured Models Section
  featuredModelsSection: {
    title: 'Flagship & Featured Models',
    description: 'Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide.'
  },

  // Featured Models (3 models)
  featuredModels: [
    {
      name: 'GX-7 BLAK',
      category: 'GX BLAK Performance Series',
      badge: 'Performance Series',
      description: 'Professional concert grand featuring revolutionary carbon fiber action technology, delivering unprecedented responsiveness and durability for the modern virtuoso.'
    },
    {
      name: 'CA99',
      category: 'Concert Artist Digital',
      badge: 'Flagship Digital',
      description: 'The ultimate digital piano experience with Grand Feel III wooden-key action and authentic concert grand samples captured in stunning detail.'
    },
    {
      name: 'NOVUS NV-10S',
      category: 'Hybrid Innovation',
      badge: 'Revolutionary',
      description: 'Revolutionary hybrid piano combining a real grand piano action with advanced digital technology, offering the authentic touch of an acoustic grand with silent practice capabilities.'
    }
  ],

  // CTA Section
  ctaSection: {
    title: 'Experience the Difference',
    description: 'Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.',
    ctaText: 'Schedule Showroom Visit',
    ctaLink: '/contact/schedule-visit'
  },

  // SEO Section
  seo: {
    metaTitle: 'Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos',
    metaDescription: 'Discover Kawai\'s complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.',
    keywords: 'kawai pianos, digital piano, grand piano, hybrid piano, upright piano, acoustic piano, professional piano, concert grand'
  }
}

// Helper function to resolve image paths
export function resolveImagePath(imagePath: string): string {
  // Convert from public path to absolute file system path
  return path.resolve(process.cwd(), 'public', imagePath.substring(1))
}

// Helper function to check if file exists
export function imageExists(imagePath: string): boolean {
  try {
    const fs = require('fs')
    return fs.existsSync(resolveImagePath(imagePath))
  } catch {
    return false
  }
}

// Helper to get all image paths for validation
export function getAllImagePaths(): string[] {
  return [
    pianoPageImages.heroBackgroundImage.path,
    ...Object.values(pianoPageImages.categoryImages).map(img => img.path),
    ...Object.values(pianoPageImages.featuredModelImages).map(img => img.path)
  ]
}