import type { Config, Plugin } from 'payload'

// Sample piano models seed data with relationships to productlines
const samplePianoModels = [
  // CA Series Digital Piano Models
  {
    name: 'CA901',
    model: 'CA901',
    slug: 'ca901',
    productlineSlug: 'ca-series',
    description: 'Flagship Concert Artist digital piano featuring Grand Feel III wooden-key action and premium Onkyo audio system with 6 speakers.',
    shortDescription: 'Flagship Concert Artist with Grand Feel III action and premium sound system',
    image: '/images/banners/CA901EP-bench-styling.webp', // Placeholder image path
    keyFeatures: [
      '88-key Grand Feel III wooden-key action with let-off simulation',
      'Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds',
      'Onkyo audio system with 6 speakers and dual headphone jacks',
      'Bluetooth MIDI and Audio connectivity',
      'Spatial Headphone Sound (SHS) technology',
      'Professional recording capabilities with line outputs'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 90,
      polyphony: 256,
      dimensions: {
        width: '145cm',
        depth: '46cm', 
        height: '88cm'
      },
      weight: '68kg',
      actionType: 'Grand Feel III',
      soundEngine: 'Progressive Harmonic Imaging'
    },
    pricing: {
      msrp: 8999,
      priceRange: '$8,999'
    },
    rating: 4.8,
    reviewCount: 124,
    status: 'active' as const,
    featured: true,
    sortOrder: 1
  },
  {
    name: 'CA79',
    model: 'CA79', 
    slug: 'ca79',
    productlineSlug: 'ca-series',
    description: 'Professional Concert Artist digital piano with Grand Feel III action and advanced connectivity features.',
    shortDescription: 'Professional Concert Artist with Grand Feel III action',
    keyFeatures: [
      '88-key Grand Feel III wooden-key action',
      'Shigeru Kawai SK-EX concert grand piano sounds',
      'Built-in Bluetooth MIDI connectivity',
      'Dual headphone jacks for silent practice',
      'USB audio recording functionality',
      'Concert magic feature with 40 songs'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 90,
      polyphony: 256,
      dimensions: {
        width: '136cm',
        depth: '46cm',
        height: '88cm'
      },
      weight: '62kg',
      actionType: 'Grand Feel III',
      soundEngine: 'Progressive Harmonic Imaging'
    },
    pricing: {
      msrp: 6999,
      priceRange: '$6,999'
    },
    rating: 4.7,
    reviewCount: 89,
    status: 'active' as const,
    featured: false,
    sortOrder: 2
  },

  // CN Series Digital Piano Models
  {
    name: 'CN301',
    model: 'CN301',
    slug: 'cn301',
    productlineSlug: 'cn-series',
    description: 'Advanced CN series digital piano with Responsive Hammer III action and progressive harmonic imaging sound technology.',
    shortDescription: 'Advanced CN series piano with Responsive Hammer III action',
    keyFeatures: [
      '88-key Responsive Hammer III action with triple sensor',
      'Progressive Harmonic Imaging sound technology',
      'Dual headphone jacks for silent practice',
      'Built-in Bluetooth MIDI connectivity',
      'Compact design perfect for home use',
      'Recording and lesson functions with metronome'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 39,
      polyphony: 192,
      dimensions: {
        width: '136cm',
        depth: '40.5cm',
        height: '86cm'
      },
      weight: '43kg',
      actionType: 'Responsive Hammer III',
      soundEngine: 'Progressive Harmonic Imaging'
    },
    pricing: {
      msrp: 3999,
      priceRange: '$3,999'
    },
    rating: 4.6,
    reviewCount: 156,
    status: 'active' as const,
    featured: true,
    sortOrder: 1
  },
  {
    name: 'CN201',
    model: 'CN201',
    slug: 'cn201',
    productlineSlug: 'cn-series',
    description: 'Entry-level CN series digital piano offering quality touch and sound in an affordable package.',
    shortDescription: 'Quality entry-level CN series digital piano',
    keyFeatures: [
      '88-key Responsive Hammer Compact action',
      'Harmonic Imaging sound technology',
      'Dual headphone capability',
      'Compact and lightweight design',
      'Lesson function with built-in songs',
      'USB connectivity for MIDI'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 19,
      polyphony: 192,
      dimensions: {
        width: '136cm',
        depth: '40.5cm',
        height: '86cm'
      },
      weight: '41kg',
      actionType: 'Responsive Hammer Compact',
      soundEngine: 'Harmonic Imaging'
    },
    pricing: {
      msrp: 2999,
      priceRange: '$2,999'
    },
    rating: 4.4,
    reviewCount: 78,
    status: 'active' as const,
    featured: false,
    sortOrder: 2
  },

  // Grand Piano Models - Shigeru Kawai SK Series
  {
    name: 'SK-EX',
    model: 'SK-EX',
    slug: 'sk-ex',
    productlineSlug: 'shigeru-kawai-sk-series',
    description: 'The ultimate expression of the piano maker\'s art. Fewer than 20 of these instruments are crafted each year by our most skilled artisans.',
    shortDescription: 'Ultimate handcrafted concert grand - under 20 made annually',
    keyFeatures: [
      'Hand-selected premium materials throughout',
      'Millennium III carbon fiber action with ABS key surfaces',
      'Neotex synthetic ivory key surfaces',
      'Mahogany inner rim with premium Hokkaido spruce soundboard',
      'Handcrafted by master piano technicians',
      'Concert hall-approved by world-class artists'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      dimensions: {
        width: '275cm',
        depth: '102cm',
        height: '103cm'
      },
      weight: '480kg',
      actionType: 'Millennium III with ABS',
      soundEngine: 'Acoustic'
    },
    pricing: {
      contactForPricing: true,
      priceRange: 'Contact for pricing'
    },
    rating: 5.0,
    reviewCount: 12,
    status: 'limited-edition' as const,
    featured: true,
    sortOrder: 1
  },
  {
    name: 'SK-7',
    model: 'SK-7',
    slug: 'sk-7',
    productlineSlug: 'shigeru-kawai-sk-series',
    description: 'Semi-concert grand piano combining traditional craftsmanship with modern innovations for professional performance.',
    shortDescription: 'Semi-concert grand with traditional craftsmanship',
    keyFeatures: [
      'Handcrafted traditional methods',
      'Premium tapered solid spruce soundboard',
      'Millennium III action technology',
      'Extended key length for enhanced touch',
      'Agraffes and full duplex scaling',
      'Hand-polished cabinet finish'
    ],
    specifications: {
      keys: 88,
      pedals: 3,
      dimensions: {
        width: '227cm',
        depth: '102cm',
        height: '103cm'
      },
      weight: '360kg',
      actionType: 'Millennium III',
      soundEngine: 'Acoustic'
    },
    pricing: {
      msrp: 185000,
      priceRange: '$185,000'
    },
    rating: 4.9,
    reviewCount: 8,
    status: 'active' as const,
    featured: true,
    sortOrder: 2
  }
]

export const pianoModelsSeedPlugin = (): Plugin => (config: Config): Config => {
  return {
    ...config,
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)
      
      // Only seed in development or when explicitly requested
      if (process.env.SEED_PIANO_MODELS === 'true') {
        payload.logger.info('🎹 Seeding Piano Models...')

        try {
          // Get productlines to match relationships
          const { docs: productlines } = await payload.find({
            collection: 'productlines',
            limit: 100
          })

          let seededCount = 0
          let skippedCount = 0

          for (const modelData of samplePianoModels) {
            // Find the corresponding productline
            const productline = productlines.find(pl => pl.slug === modelData.productlineSlug)
            
            if (!productline) {
              payload.logger.warn(`❌ Productline not found for slug: ${modelData.productlineSlug}`)
              skippedCount++
              continue
            }

            // Check if model already exists
            const { docs: existingModels } = await payload.find({
              collection: 'piano-models',
              where: {
                slug: { equals: modelData.slug }
              }
            })

            if (existingModels.length > 0) {
              payload.logger.info(`⏭️ Piano model ${modelData.name} already exists, skipping`)
              skippedCount++
              continue
            }

            // Prepare the data for creation
            const { productlineSlug, ...createData } = modelData
            const finalData = {
              ...createData,
              productline: productline.id,
              // Convert keyFeatures array to the expected format
              keyFeatures: createData.keyFeatures?.map((feature) => ({ feature })) || [],
              // Add placeholder image if not provided
              image: createData.image || '/images/banners/default-piano.webp'
            }

            await payload.create({
              collection: 'piano-models',
              data: finalData
            })

            payload.logger.info(`✅ Created piano model: ${modelData.name}`)
            seededCount++
          }

          payload.logger.info(`🎹 Piano Models seeding completed: ${seededCount} created, ${skippedCount} skipped`)
        } catch (error) {
          payload.logger.error('❌ Error seeding piano models:', error)
        }
      }
    }
  }
}