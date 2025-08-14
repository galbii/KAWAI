import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, ArrowRight, Star, Home, School, Award } from "lucide-react"

const uprightPianoSeries = [
  {
    name: "K Professional Series",
    description: "Professional upright pianos featuring advanced action technology and premium materials",
    badge: "Professional Series",
    highlight: "Millennium III Preparation",
    models: [
      {
        slug: "k-800",
        name: "K-800",
        size: "51\" Professional Upright",
        price: "$34,999",
        rating: 5,
        reviews: 72,
        badge: "Flagship",
        description: "The ultimate professional upright with concert-quality performance",
        keyFeatures: [
          "51\" professional upright with exceptional projection",
          "Millennium III action preparation",
          "Extended length keys for grand piano feel",
          "Premium German Roslau strings",
          "Solid spruce soundboard construction",
          "Soft-close fallboard with hydraulic system",
          "Professional-grade tuning stability"
        ],
        specifications: {
          "Height": "51\" (130 cm)",
          "Width": "60\" (153 cm)",
          "Depth": "26\" (66 cm)",
          "Weight": "573 lbs (260 kg)",
          "Keys": "88 keys with extended length",
          "Action": "Millennium III preparation",
          "Pedals": "3 pedals with half-pedal support"
        }
      },
      {
        slug: "k-600",
        name: "K-600",
        size: "48\" Professional Upright",
        price: "$28,999",
        rating: 4.9,
        reviews: 64,
        description: "Professional upright offering excellent performance in a compact size",
        keyFeatures: [
          "48\" professional upright with rich tone",
          "Advanced action technology",
          "Extended length keys",
          "Premium materials throughout",
          "Excellent tuning stability", 
          "Professional cabinet finish",
          "Enhanced string scaling"
        ],
        specifications: {
          "Height": "48\" (122 cm)",
          "Width": "58\" (147 cm)", 
          "Depth": "25\" (64 cm)",
          "Weight": "507 lbs (230 kg)",
          "Keys": "88 keys with extended length",
          "Action": "Professional upright action",
          "Pedals": "3 pedals with soft-close"
        }
      },
      {
        slug: "k-500",
        name: "K-500",
        size: "45\" Studio Upright",
        price: "$22,999",
        rating: 4.8,
        reviews: 93,
        badge: "Popular Choice",
        description: "Versatile studio upright perfect for serious musicians and institutions",
        keyFeatures: [
          "45\" studio upright with powerful sound",
          "Enhanced action mechanism",
          "Extended length keys for improved control",
          "Quality German strings",
          "Solid construction throughout",
          "Professional-grade components",
          "Excellent value proposition"
        ],
        specifications: {
          "Height": "45\" (114 cm)",
          "Width": "58\" (147 cm)",
          "Depth": "24\" (61 cm)", 
          "Weight": "463 lbs (210 kg)",
          "Keys": "88 keys with extended length",
          "Action": "Enhanced upright action",
          "Pedals": "3 pedals including sostenuto"
        }
      },
      {
        slug: "k-400",
        name: "K-400",
        size: "44\" Console Upright",
        price: "$18,999",
        rating: 4.7,
        reviews: 87,
        description: "Professional console upright with excellent touch and tone",
        keyFeatures: [
          "44\" console upright with clear projection",
          "Quality action mechanism",
          "Extended length keys",
          "Premium hammer construction",
          "Solid wood components",
          "Reliable tuning stability",
          "Classic cabinet styling"
        ],
        specifications: {
          "Height": "44\" (112 cm)",
          "Width": "58\" (147 cm)",
          "Depth": "24\" (61 cm)",
          "Weight": "441 lbs (200 kg)",
          "Keys": "88 keys with extended length", 
          "Action": "Professional console action",
          "Pedals": "3 pedals with half-pedal"
        }
      },
      {
        slug: "k-300",
        name: "K-300",
        size: "44\" Home Studio",
        price: "$15,999",
        rating: 4.6,
        reviews: 105,
        badge: "Best Value",
        description: "Professional home studio upright offering exceptional quality",
        keyFeatures: [
          "44\" home studio upright with warm tone",
          "Quality construction standards",
          "Extended length keys",
          "Premium materials selection",
          "Good tuning stability",
          "Attractive cabinet design",
          "Professional performance capability"
        ],
        specifications: {
          "Height": "44\" (112 cm)",
          "Width": "58\" (147 cm)",
          "Depth": "24\" (61 cm)",
          "Weight": "419 lbs (190 kg)",
          "Keys": "88 keys with extended length",
          "Action": "Quality upright action", 
          "Pedals": "3 pedals including practice"
        }
      },
      {
        slug: "k-200",
        name: "K-200",
        size: "43\" Compact Upright",
        price: "$12,999",
        rating: 4.5,
        reviews: 118,
        description: "Entry-level professional upright perfect for home use",
        keyFeatures: [
          "43\" compact upright with good sound",
          "Reliable action mechanism",
          "Extended length keys",
          "Quality construction",
          "Stable tuning performance",
          "Space-efficient design",
          "Professional entry point"
        ],
        specifications: {
          "Height": "43\" (109 cm)",
          "Width": "58\" (147 cm)",
          "Depth": "24\" (61 cm)",
          "Weight": "397 lbs (180 kg)",
          "Keys": "88 keys with extended length",
          "Action": "Compact upright action",
          "Pedals": "3 pedals standard"
        }
      }
    ]
  },
  {
    name: "Designer & Continental Series", 
    description: "Elegant upright pianos combining beautiful aesthetics with quality performance",
    badge: "Aesthetic Excellence",
    highlight: "Style Meets Performance",
    models: [
      {
        slug: "designer-series",
        name: "Designer Series",
        size: "Various Heights",
        price: "$16,999 - $28,999",
        rating: 4.6,
        reviews: 134,
        description: "Elegant upright pianos with premium finishes and classic styling",
        keyFeatures: [
          "Multiple cabinet styles and finishes",
          "Premium wood construction",
          "Quality action mechanisms",
          "Extended length keys",
          "Elegant aesthetic designs",
          "Professional performance capability",
          "Various size options available"
        ]
      },
      {
        slug: "continental-series", 
        name: "Continental Series",
        size: "Traditional Heights",
        price: "$14,999 - $24,999",
        rating: 4.5,
        reviews: 89,
        description: "Classic continental styling with reliable performance",
        keyFeatures: [
          "Traditional continental cabinet design",
          "Quality materials and construction", 
          "Reliable action performance",
          "Extended length keys",
          "Classic aesthetic appeal",
          "Good tuning stability",
          "Professional entry-level option"
        ]
      }
    ]
  }
]

const uprightFeatures = [
  {
    icon: Music,
    title: "Extended Length Keys",
    description: "Longer keys provide better leverage and control, delivering a playing experience closer to grand piano touch and responsiveness."
  },
  {
    icon: Award,
    title: "Millennium III Prep",
    description: "Select models feature Millennium III action preparation with advanced materials for enhanced responsiveness and durability."
  },
  {
    icon: Home,
    title: "Space Efficient Design",
    description: "Compact footprint allows placement in smaller spaces while maintaining full 88-key performance and professional sound quality."
  }
]

export default function UprightPianosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl">
            <div className="mb-6 flex items-center">
              <Music className="h-8 w-8 text-green-400 mr-3" />
              <span className="text-green-400 font-semibold text-lg">Acoustic Upright Pianos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Professional Upright Pianos
              <span className="block text-green-400">For Every Space</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl">
              Experience the perfect balance of space efficiency and professional performance. 
              Our K Professional Series and elegant Designer collections deliver exceptional 
              touch, tone, and craftsmanship in a compact footprint.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="default" size="lg">
                Explore Upright Pianos
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Size Comparison Guide
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">8+</div>
                <div className="text-gray-300">Upright Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">43" - 51"</div>
                <div className="text-gray-300">Height Range</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">2</div>
                <div className="text-gray-300">Distinct Series</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upright Piano Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Kawai Upright Pianos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kawai upright pianos deliver professional performance in a space-efficient design, 
              featuring advanced technologies and premium materials typically found in grand pianos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {uprightFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Piano Series */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {uprightPianoSeries.map((series) => (
            <div key={series.name} className="mb-20">
              <div className="text-center mb-12">
                <div className="mb-4">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {series.badge}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {series.name}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                  {series.description}
                </p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 max-w-md mx-auto">
                  <p className="text-green-800 font-semibold">{series.highlight}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {series.models.map((piano) => (
                  <div key={piano.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {'badge' in piano && piano.badge && (
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                            {piano.badge}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="aspect-[4/3] bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                      <Music className="h-16 w-16 text-green-600" />
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{piano.name}</h3>
                        <p className="text-green-600 font-semibold text-sm mb-2">{piano.size}</p>
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
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xl font-bold text-gray-900">{piano.price}</p>
                          <p className="text-sm text-gray-500">Financing available</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/pianos/upright/${piano.slug}`}>
                            Learn More
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
          ))}
        </div>
      </section>

      {/* Placement Guide */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for Every Setting
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Kawai upright pianos are ideal for homes, studios, schools, and institutions 
              where space is at a premium but professional performance is essential.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Home Practice</h3>
                <p className="text-gray-300">
                  Perfect for home musicians who want professional quality in a compact footprint 
                  that fits comfortably in living spaces.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Educational Institutions</h3>
                <p className="text-gray-300">
                  Ideal for music schools, universities, and practice rooms where space efficiency 
                  and reliability are crucial for daily use.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Professional Studios</h3>
                <p className="text-gray-300">
                  Excellent for recording studios and teaching studios where professional sound 
                  quality is needed in a space-conscious design.
                </p>
              </div>
            </div>

            <Button variant="default" size="lg">
              Find Your Perfect Size <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Upright Excellence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Visit our showroom to experience the touch, tone, and compact elegance of Kawai upright pianos. 
            Our specialists will help you find the perfect model for your space and musical needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule Showroom Visit <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/space-planning">Space Planning Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}