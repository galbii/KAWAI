import { UnifiedPianoSeries } from './unified-piano-series'
import { getProductlinesWithPianoModelsServer } from '@/lib/payload-server'

// Hardcoded fallback data in case CMS is unavailable
const fallbackDigitalPianoSeries = [
  {
    name: "CA Series",
    description: "The pinnacle of digital piano technology, featuring Grand Feel III wooden-key action and premium Shigeru Kawai concert grand sounds. Professional instruments trusted by musicians worldwide.",
    slides: [],
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
      }
    ]
  },
  {
    name: "CN Series",
    description: "Advanced digital pianos offering exceptional value with Responsive Hammer III action and Progressive Harmonic Imaging sound technology. Perfect for serious musicians and students.",
    slides: [],
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
      }
    ]
  }
]

export async function DigitalPianoSeriesContainer() {
  // Fetch productlines with their piano models from CMS
  const series = await getProductlinesWithPianoModelsServer('digital')
  
  // Use fallback only if no data from CMS
  const finalSeries = series.length > 0 ? series : fallbackDigitalPianoSeries

  return (
    <UnifiedPianoSeries
      title="Explore Digital Piano Series"
      description="Discover our complete collection of digital piano series. Each series showcases distinct technologies and features for different musical needs."
      series={finalSeries}
      categorySlug="digital"
    />
  )
}