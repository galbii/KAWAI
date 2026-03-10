import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";
import { getPayloadClient } from '@/lib/payload/queries'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Page } from '@/payload-types'

// Featured digital pianos - highlighting the best from each series
const featuredDigitalPianos = [
  {
    slug: "ca901",
    name: "CA901",
    series: "Concert Artist Series",
    rating: 5,
    reviews: 124,
    image: "/images/banners/CA901EP-bench-styling.webp",
    description: "Professional Concert Artist with Grand Feel III action and premium sound system",
    keyFeatures: [
      "88-key Grand Feel III wooden-key action",
      "Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds",
      "Onkyo audio system with 6 speakers",
      "Bluetooth MIDI and Audio connectivity",
      "Spatial Headphone Sound technology",
      "Professional recording capabilities"
    ]
  },
  {
    slug: "cn301",
    name: "CN301",
    series: "CN Series",
    rating: 4.7,
    reviews: 156,
    image: "/images/banners/CN301-styling.webp",
    description: "Advanced CN series piano with Responsive Hammer III action",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Progressive Harmonic Imaging sound technology",
      "Dual headphone jacks for silent practice",
      "Built-in Bluetooth MIDI connectivity",
      "Compact design perfect for home use",
      "Recording and lesson functions"
    ]
  },
  {
    slug: "es920",
    name: "ES920",
    series: "ES Series",
    rating: 4.5,
    reviews: 78,
    image: "/images/banners/ES920-styling.webp",
    description: "Professional portable piano with premium sound and features",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Harmonic Imaging XL sound technology",
      "Lightweight portable design at just 38 lbs",
      "Line outputs for professional stage use",
      "USB connectivity and recording",
      "Professional sound library"
    ]
  }
];

// Piano series with complete piano data for browsing
const digitalPianoSeries = [
  {
    name: "CA Series",
    description: "The pinnacle of digital piano technology, featuring Grand Feel III wooden-key action and premium Shigeru Kawai concert grand sounds. Professional instruments trusted by musicians worldwide.",
    pianos: [
      {
        slug: "ca901",
        name: "CA901",
        series: "Concert Artist Series",
        rating: 5,
        reviews: 124,
        image: "/images/banners/CA901EP-bench-styling.webp",
        description: "Professional Concert Artist with Grand Feel III action and premium sound system",
        keyFeatures: [
          "88-key Grand Feel III wooden-key action",
          "Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds",
          "Onkyo audio system with 6 speakers",
          "Bluetooth MIDI and Audio connectivity",
          "Spatial Headphone Sound technology",
          "Professional recording capabilities"
        ]
      },
      {
        slug: "ca701",
        name: "CA701",
        series: "Concert Artist Series",
        rating: 4.9,
        reviews: 89,
        image: "/images/banners/CA701-styling.webp",
        description: "Advanced Concert Artist model with premium features and realistic touch",
        keyFeatures: [
          "88-key Grand Feel III wooden-key action",
          "Shigeru Kawai SK-EX and SK-5 sounds",
          "High-quality speaker system",
          "Advanced connectivity options",
          "Professional recording features",
          "Spatial headphone technology"
        ]
      },
      {
        slug: "ca501",
        name: "CA501",
        series: "Concert Artist Series",
        rating: 4.8,
        reviews: 76,
        image: "/images/banners/CA501-styling.webp",
        description: "Entry-level Concert Artist with authentic grand piano experience",
        keyFeatures: [
          "88-key Grand Feel II action",
          "Shigeru Kawai SK-EX sampling",
          "Quality speaker system",
          "Bluetooth connectivity",
          "Lesson functions",
          "Recording capabilities"
        ]
      }
    ]
  },
  {
    name: "CN Series",
    description: "Advanced digital pianos offering exceptional value with Responsive Hammer III action and Progressive Harmonic Imaging sound technology. Perfect for serious musicians and students.",
    pianos: [
      {
        slug: "cn301",
        name: "CN301",
        series: "CN Series",
        rating: 4.7,
        reviews: 156,
        image: "/images/banners/CN301-styling.webp",
        description: "Advanced CN series piano with Responsive Hammer III action",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Progressive Harmonic Imaging sound technology",
          "Dual headphone jacks for silent practice",
          "Built-in Bluetooth MIDI connectivity",
          "Compact design perfect for home use",
          "Recording and lesson functions"
        ]
      },
      {
        slug: "cn201",
        name: "CN201",
        series: "CN Series",
        rating: 4.6,
        reviews: 134,
        image: "/images/banners/CN201-styling.webp",
        description: "Compact CN model with essential features and quality touch",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Progressive Harmonic Imaging sounds",
          "Dual headphone outputs",
          "USB connectivity",
          "Compact cabinet design",
          "Educational features"
        ]
      }
    ]
  },
  {
    name: "KDP Series",
    description: "Elegant console digital pianos with traditional furniture styling and authentic piano action. Designed to complement your home while delivering professional performance.",
    pianos: [
      {
        slug: "cl36",
        name: "CL36",
        series: "CL Console Series",
        rating: 4.5,
        reviews: 67,
        image: "/images/banners/CL36-styling.webp",
        description: "Traditional console design with modern digital technology",
        keyFeatures: [
          "88-key Responsive Hammer action",
          "Harmonic Imaging sound technology",
          "Traditional cabinet styling",
          "Built-in music rest",
          "Headphone connectivity",
          "Compact footprint"
        ]
      }
    ]
  },
  {
    name: "ES Series",
    description: "Professional portable digital pianos perfect for performing musicians. Lightweight designs with advanced action technology and premium sounds for studio and stage use.",
    pianos: [
      {
        slug: "es920",
        name: "ES920",
        series: "ES Portable Series",
        rating: 4.5,
        reviews: 78,
        image: "/images/banners/ES920-styling.webp",
        description: "Professional portable piano with premium sound and features",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Harmonic Imaging XL sound technology",
          "Lightweight portable design at just 38 lbs",
          "Line outputs for professional stage use",
          "USB connectivity and recording",
          "Professional sound library"
        ]
      },
      {
        slug: "es520",
        name: "ES520",
        series: "ES Portable Series",
        rating: 4.4,
        reviews: 92,
        image: "/images/banners/ES520-styling.webp",
        description: "Compact portable piano with essential features for performers",
        keyFeatures: [
          "88-key Responsive Hammer action",
          "Harmonic Imaging sounds",
          "Ultra-portable at 31 lbs",
          "Battery operation capability",
          "Bluetooth connectivity",
          "Stage-ready outputs"
        ]
      }
    ]
  }
];



export default async function DigitalPianosPage() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'pianos/digital' }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    console.log('[digital/page] CMS query result — total:', result.totalDocs, '| docs[0] slug:', result.docs[0]?.slug ?? 'none')
    const cmsPage = result.docs[0] as Page | undefined
    if (cmsPage?.layout && cmsPage.layout.length > 0) {
      return <RenderBlocks blocks={cmsPage.layout} />
    }
  } catch (err) {
    console.error('[digital/page] CMS override query failed:', err)
    // fall through to hardcoded layout
  }

  const series = digitalPianoSeries;
  const loading = false; // Productlines removed - using fallback data
  const error: string | null = null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        category="Digital Pianos"
        title="Digital Innovation"
        description="Experience the perfect blend of traditional piano craftsmanship and cutting-edge digital technology. Our digital pianos deliver authentic acoustic piano experience with modern convenience and connectivity."
        backgroundImage="/images/banners/CA901EP-bench-styling.webp"
        stats={[
          { label: "Digital Series", value: "4" },
          { label: "Piano Models", value: "8" },
          { label: "Premium Sounds", value: "SK-EX+" }
        ]}
      />

      {/* Unified Series Browser with Carousel */}
      {loading ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-kawai-neutral/20 rounded-lg mb-4 max-w-md mx-auto" />
              <div className="h-4 bg-kawai-neutral/20 rounded-lg mb-8 max-w-lg mx-auto" />
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-kawai-neutral/20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-kawai-red/10 border border-kawai-red/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-kawai-red mb-2">Unable to load product data</h3>
              <p className="text-kawai-black/70">{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <UnifiedPianoSeries
          title="Explore Digital Piano Series"
          description="Discover our complete collection of digital piano series. Each series showcases distinct technologies and features for different musical needs."
          series={series}
          categorySlug="digital"
        />
      )}


      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            Experience Digital Excellence
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Visit our showroom to experience the touch, sound, and features of our digital pianos. Compare models side-by-side and find your perfect match.
          </p>

          <a
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Visit Showroom</span>
            <svg
              className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
