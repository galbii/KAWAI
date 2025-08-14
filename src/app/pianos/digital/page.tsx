import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Piano, ArrowRight, Star, Headphones, Volume2, Bluetooth } from "lucide-react"

const digitalPianos = [
  {
    slug: "ca99",
    name: "CA99",
    series: "Concert Artist Series",
    price: "$12,999",
    rating: 5,
    reviews: 89,
    badge: "Flagship Digital",
    image: "/api/placeholder/400/300",
    description: "The ultimate digital piano with revolutionary Grand Feel III action and premium audio",
    keyFeatures: [
      "88-key Grand Feel III wooden-key action with let-off",
      "Shigeru Kawai SK-EX, SK-5, EX, and more concert grands",
      "Advanced Onkyo audio system with 8 speakers",
      "TwinDrive soundboard speaker system",
      "Spatial Headphone Sound technology",
      "Bluetooth MIDI and Audio connectivity"
    ],
    specifications: {
      keys: 88,
      voices: "Over 100 voices",
      polyphony: 256,
      dimensions: "57-1/8\" x 18-1/2\" x 37\"",
      weight: "198 lbs"
    }
  },
  {
    slug: "ca901",
    name: "CA901",
    series: "Concert Artist Series",
    price: "$6,999",
    originalPrice: "$7,999",
    rating: 5,
    reviews: 124,
    badge: "Best Seller",
    image: "/api/placeholder/400/300",
    description: "Professional Concert Artist with Grand Feel III action and premium sound system",
    keyFeatures: [
      "88-key Grand Feel III wooden-key action",
      "Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds",
      "Onkyo audio system with 6 speakers",
      "Bluetooth MIDI and Audio connectivity"
    ],
    specifications: {
      keys: 88,
      voices: 128,
      polyphony: 256,
      dimensions: "57-1/8\" x 18-1/2\" x 36-1/4\"",
      weight: "187 lbs"
    }
  },
  {
    slug: "ca701",
    name: "CA701",
    series: "Concert Artist Series",
    price: "$4,999",
    rating: 5,
    reviews: 89,
    badge: "Popular",
    image: "/api/placeholder/400/300",
    description: "Premium digital piano with authentic grand piano action and exceptional sound",
    keyFeatures: [
      "88-key Grand Feel III wooden-key action",
      "Shigeru Kawai SK-EX rendering",
      "Spatial Headphone Sound technology",
      "Dual headphone jacks"
    ],
    specifications: {
      keys: 88,
      voices: 38,
      polyphony: 256,
      dimensions: "57-1/8\" x 17-3/4\" x 36-1/4\"",
      weight: "172 lbs"
    }
  },
  {
    slug: "ca501",
    name: "CA501",
    series: "Concert Artist Series",
    price: "$3,999",
    rating: 4.8,
    reviews: 67,
    image: "/api/placeholder/400/300",
    description: "Entry-level Concert Artist with Grand Feel Compact action",
    keyFeatures: [
      "88-key Grand Feel Compact wooden-key action",
      "Shigeru Kawai SK-EX rendering",
      "Built-in lesson function",
      "USB audio recording"
    ],
    specifications: {
      keys: 88,
      voices: 19,
      polyphony: 192,
      dimensions: "53-1/2\" x 17-3/4\" x 34-1/2\"",
      weight: "145 lbs"
    }
  },
  {
    slug: "cn301",
    name: "CN301",
    series: "CN Series",
    price: "$2,999",
    rating: 4.7,
    reviews: 156,
    badge: "Great Value",
    image: "/api/placeholder/400/300",
    description: "Advanced CN series piano with Responsive Hammer III action",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Progressive Harmonic Imaging sound technology",
      "Dual headphone jacks",
      "Built-in Bluetooth MIDI"
    ],
    specifications: {
      keys: 88,
      voices: 19,
      polyphony: 192,
      dimensions: "53-1/2\" x 16-1/2\" x 34\"",
      weight: "99 lbs"
    }
  },
  {
    slug: "cn201",
    name: "CN201",
    series: "CN Series",
    price: "$1,999",
    rating: 4.6,
    reviews: 203,
    badge: "Budget Friendly",
    image: "/api/placeholder/400/300",
    description: "Entry-level digital piano with authentic touch and sound",
    keyFeatures: [
      "88-key Responsive Hammer Compact action",
      "Progressive Harmonic Imaging",
      "Dual headphone jacks",
      "Compact design"
    ],
    specifications: {
      keys: 88,
      voices: 15,
      polyphony: 192,
      dimensions: "53-1/2\" x 15-3/4\" x 31\"",
      weight: "84 lbs"
    }
  },
  {
    slug: "cl36",
    name: "CL36",
    series: "CL Series",
    price: "$2,199",
    rating: 4.6,
    reviews: 67,
    badge: "Compact Console",
    image: "/api/placeholder/400/300",
    description: "Compact console digital piano with authentic touch and quality sound",
    keyFeatures: [
      "88-key Responsive Hammer Compact action",
      "Progressive Harmonic Imaging sound",
      "Compact console design with bench",
      "USB connectivity and recording"
    ],
    specifications: {
      keys: 88,
      voices: 19,
      polyphony: 192,
      dimensions: "53-1/2\" x 16-1/2\" x 32\"",
      weight: "89 lbs"
    }
  },
  {
    slug: "cl26",
    name: "CL26",
    series: "CL Series", 
    price: "$1,799",
    rating: 4.4,
    reviews: 54,
    badge: "Entry Console",
    image: "/api/placeholder/400/300",
    description: "Entry-level console digital piano perfect for beginning musicians",
    keyFeatures: [
      "88-key Responsive Hammer Compact action",
      "Progressive Harmonic Imaging",
      "Compact footprint with storage bench",
      "Simple operation and controls"
    ],
    specifications: {
      keys: 88,
      voices: 15,
      polyphony: 192,
      dimensions: "53-1/2\" x 15-3/4\" x 31\"",
      weight: "79 lbs"
    }
  },
  {
    slug: "es920",
    name: "ES920",
    series: "ES Series",
    price: "$2,499",
    rating: 4.5,
    reviews: 78,
    image: "/api/placeholder/400/300",
    description: "Professional portable piano with premium sound and features",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Harmonic Imaging XL sound technology", 
      "Lightweight portable design",
      "Line outputs for stage use"
    ],
    specifications: {
      keys: 88,
      voices: 38,
      polyphony: 256,
      dimensions: "52\" x 11-1/2\" x 6\"",
      weight: "38 lbs"
    }
  }
]

const digitalPianoFeatures = [
  {
    icon: Piano,
    title: "Authentic Piano Action",
    description: "From Grand Feel III wooden keys to Responsive Hammer actions, experience the authentic touch of an acoustic piano."
  },
  {
    icon: Volume2,
    title: "Premium Sound Systems",
    description: "Advanced sampling technology captures every nuance of our world-renowned Shigeru Kawai concert grands."
  },
  {
    icon: Headphones,
    title: "Silent Practice",
    description: "Practice anytime with high-quality headphones and spatial sound technology for immersive experience."
  },
  {
    icon: Bluetooth,
    title: "Smart Connectivity",
    description: "Bluetooth MIDI and audio connectivity for seamless integration with apps, devices, and recording software."
  }
]

export default function DigitalPianosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="text-blue-300 font-semibold">Digital Pianos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Modern Innovation
              <span className="block text-blue-400">Classic Performance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Experience the perfect blend of traditional piano craftsmanship and cutting-edge 
              digital technology. Our digital pianos deliver authentic acoustic piano experience 
              with modern convenience and connectivity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg">
                Shop Digital Pianos
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Compare Models
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Kawai Digital Pianos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kawai digital pianos combine over 95 years of piano-making expertise with 
              innovative digital technology to deliver an unmatched playing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalPianoFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Piano Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Digital Piano Collection
            </h2>
            <p className="text-xl text-gray-600">
              From entry-level to professional concert instruments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalPianos.map((piano) => (
              <div key={piano.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {piano.badge && (
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {piano.badge}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Piano className="h-16 w-16 text-gray-500" />
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-blue-600 font-semibold">{piano.series}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{piano.name}</h3>
                    <p className="text-gray-600 text-sm">{piano.description}</p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(piano.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({piano.reviews})</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {piano.keyFeatures.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                    <div>Keys: {piano.specifications.keys}</div>
                    <div>Voices: {piano.specifications.voices}</div>
                    <div>Polyphony: {piano.specifications.polyphony}</div>
                    <div>Weight: {piano.specifications.weight}</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{piano.price}</p>
                      {piano.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{piano.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/pianos/digital/${piano.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Advanced Digital Piano Technology
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Kawai's innovative technologies bring you closer to the authentic grand piano experience.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Grand Feel III Action</h3>
                <p className="text-gray-300">
                  Real wooden keys with let-off simulation and authentic hammer weighting 
                  for the most realistic grand piano touch.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Shigeru Kawai Sampling</h3>
                <p className="text-gray-300">
                  Every nuance of our world-renowned SK-EX and SK-5 concert grands captured 
                  with stunning realism and dynamic expression.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Spatial Headphone Sound</h3>
                <p className="text-gray-300">
                  Advanced crossfeed technology creates natural acoustic ambience 
                  through headphones for comfortable extended practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Digital Excellence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Visit our showroom to experience the touch, sound, and features of our digital pianos. 
            Compare models side-by-side and find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule Visit <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/financing">Financing Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}