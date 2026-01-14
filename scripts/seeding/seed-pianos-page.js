import { getPayload } from 'payload'
import config from './src/payload.config.ts'

// Import the seeding data
const pianoPageSeedData = {
  heroTitle: 'Experience the Complete Kawai Piano Collection',
  heroDescription: 'From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.',
  heroCta: {
    text: 'Explore Categories',
    link: '#categories'
  },
  pianoCategories: [
    {
      slug: "grand",
      name: "Acoustic Grand Pianos",
      description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
      priceRange: "$45,000 - $185,000",
      features: [{feature: "Millennium III Action"}, {feature: "Carbon Fiber Components"}, {feature: "Neotex Key Surface"}, {feature: "Konami Tuning Pins"}],
      icon: "piano",
      badge: "Professional",
      highlight: "GX BLAK Performance Series"
    },
    {
      slug: "upright",
      name: "Acoustic Upright Pianos", 
      description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
      priceRange: "$8,999 - $35,000",
      features: [{feature: "Extended Length Keys"}, {feature: "Millennium III Prep"}, {feature: "Soft-Close Fallboard"}, {feature: "Premium Hammers"}],
      icon: "music",
      badge: "Classic", 
      highlight: "K Professional Series"
    },
    {
      slug: "digital",
      name: "Digital Pianos",
      description: "Cutting-edge digital instruments with authentic piano touch and sound",
      priceRange: "$1,999 - $12,999",
      features: [{feature: "Grand Feel III Action"}, {feature: "Harmonic Imaging XL"}, {feature: "Onkyo Audio"}, {feature: "Bluetooth Connectivity"}],
      icon: "zap",
      badge: "Innovation",
      highlight: "Concert Artist Series"
    },
    {
      slug: "hybrid",
      name: "Hybrid Pianos",
      description: "Revolutionary instruments combining acoustic action with digital versatility",
      priceRange: "$12,999 - $24,999", 
      features: [{feature: "Real Grand Action"}, {feature: "Silent Practice Mode"}, {feature: "Digital Recording"}, {feature: "Millennium III Action"}],
      icon: "award",
      badge: "Hybrid Technology",
      highlight: "NOVUS & AnyTime Series"
    }
  ],
  featuredModelsSection: {
    title: 'Flagship & Featured Models',
    description: 'Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide.'
  },
  featuredModels: [
    {
      name: "GX-7 BLAK",
      category: "GX BLAK Performance Series",
      badge: "Performance Series",
      description: "Professional concert grand featuring revolutionary carbon fiber action technology, delivering unprecedented responsiveness and durability for the modern virtuoso."
    },
    {
      name: "CA99",
      category: "Concert Artist Digital",
      badge: "Flagship Digital",
      description: "The ultimate digital piano experience with Grand Feel III wooden-key action and authentic concert grand samples captured in stunning detail."
    },
    {
      name: "NOVUS NV-10S",
      category: "Hybrid Innovation",
      badge: "Revolutionary",
      description: "Revolutionary hybrid piano combining a real grand piano action with advanced digital technology, offering the authentic touch of an acoustic grand with silent practice capabilities."
    }
  ],
  ctaSection: {
    title: "Experience the Difference",
    description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
    ctaText: "Schedule Showroom Visit",
    ctaLink: "/contact/schedule-visit"
  },
  seo: {
    metaTitle: "Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos",
    metaDescription: "Discover Kawai's complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.",
    keywords: "kawai pianos, digital piano, grand piano, hybrid piano, upright piano, acoustic piano, professional piano, concert grand"
  }
}

async function seedPianosPage() {
  console.log('🌱 Starting PianosPage seeding...')
  
  try {
    const payload = await getPayload({ config })
    
    // Check if data already exists
    const existing = await payload.find({
      collection: 'pianos-page',
      limit: 1
    })
    
    console.log(`📊 Found ${existing.docs.length} existing documents`)
    
    if (existing.docs.length > 0) {
      console.log('📝 PianosPage already has data, skipping seed')
      return
    }
    
    console.log('🚀 Creating PianosPage document...')
    
    const result = await payload.create({
      collection: 'pianos-page',
      data: pianoPageSeedData
    })
    
    console.log(`✅ Successfully created PianosPage document with ID: ${result.id}`)
    console.log('🎉 PianosPage seeding completed!')
    
  } catch (error) {
    console.error('❌ PianosPage seeding failed:', error)
  }
  
  process.exit(0)
}

seedPianosPage()