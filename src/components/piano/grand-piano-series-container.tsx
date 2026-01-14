import { UnifiedPianoSeries } from './unified-piano-series'
import { getProductlinesServer, transformProductlinesToSeriesServer } from '@/lib/payload/server'

// Hardcoded fallback data in case CMS is unavailable
const fallbackGrandPianoSeries = [
  {
    name: "Shigeru Kawai SK Series",
    description: "Hand-built masterpieces representing the pinnacle of piano craftsmanship. Each instrument is meticulously crafted by master technicians for the world's most demanding musicians. Under 20 SK-EX models made annually.",
    slides: [],
    pianos: [
      {
        slug: "sk-ex",
        name: "SK-EX",
        series: "Shigeru Kawai SK Series",
        rating: 5,
        reviews: 12,
        image: "/images/banners/SK-EX-grand-styling.webp",
        description: "Concert grand masterpiece hand-built by master craftsmen (9'1\")",
        keyFeatures: [
          "9'1\" concert grand with extraordinary projection",
          "Hand-built by Shigeru Kawai master craftsmen",
          "Premium Ezo spruce soundboard",
          "Millennium III Konsei Katagi action",
          "Under 20 made annually worldwide",
          "Concert hall performance capability"
        ]
      }
    ]
  },
  {
    name: "GX Series",
    description: "Professional performance grand pianos featuring advanced technology, Millennium III action, and premium components. Designed for concert halls, recording studios, and serious musicians.",
    slides: [],
    pianos: [
      {
        slug: "gx-7",
        name: "GX-7",
        series: "GX Series",
        rating: 5,
        reviews: 22,
        image: "/images/banners/GX-7-grand-styling.webp",
        description: "Concert-sized model with professional performance capability",
        keyFeatures: [
          "Concert-sized grand piano",
          "Millennium III action technology",
          "Professional performance features",
          "Advanced materials",
          "Concert hall suitable",
          "Premium construction"
        ]
      }
    ]
  }
]

export async function GrandPianoSeriesContainer() {
  // Try to fetch data from CMS
  const productlines = await getProductlinesServer('grand')
  
  // Transform CMS data or use fallback
  const series = productlines.length > 0 
    ? transformProductlinesToSeriesServer(productlines)
    : fallbackGrandPianoSeries

  return (
    <UnifiedPianoSeries
      title="Explore Grand Piano Series"
      description="Discover our prestigious collection of grand piano series. From hand-crafted masterpieces to performance instruments, explore the pinnacle of piano craftsmanship."
      series={series}
      categorySlug="grand"
      productlines={productlines}
    />
  )
}