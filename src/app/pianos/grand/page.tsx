import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Piano, ArrowRight, Star, Award, Zap, Music } from "lucide-react"

const grandPianoSeries = [
  {
    name: "GX BLAK Performance Series",
    description: "Professional performance grand pianos featuring carbon fiber technology and premium components",
    badge: "Performance Series", 
    highlight: "Carbon Fiber Enhanced",
    models: [
      {
        slug: "gx-7-blak",
        name: "GX-7 BLAK",
        size: "7'6\" Semi-Concert Grand",
        price: "Contact for Price",
        rating: 5,
        reviews: 43,
        description: "Semi-concert grand with exceptional projection and dynamic range",
        keyFeatures: [
          "7'6\" semi-concert grand with powerful projection",
          "Millennium III Hybrid action with carbon fiber",
          "NEOTEX key surface for enhanced control",
          "Konami tuning pins for superior stability",
          "Premium solid spruce soundboard",
          "Carbon fiber reinforced hammer moldings"
        ]
      },
      {
        slug: "gx-6-blak", 
        name: "GX-6 BLAK",
        size: "6'7\" Grand",
        price: "Contact for Price",
        rating: 5,
        reviews: 38,
        description: "Professional grand offering concert-quality performance",
        keyFeatures: [
          "6'7\" grand with rich, powerful tone",
          "Millennium III action technology",
          "NEOTEX synthetic ivory key tops",
          "Advanced composite materials",
          "Premium German strings",
          "Soft-close fallboard system"
        ]
      },
      {
        slug: "gx-5-blak",
        name: "GX-5 BLAK", 
        size: "6'1\" Grand",
        price: "Contact for Price",
        rating: 5,
        reviews: 52,
        description: "Versatile grand perfect for serious musicians and institutions",
        keyFeatures: [
          "6'1\" grand with balanced tone and touch",
          "Millennium III Hybrid action",
          "Carbon fiber components for durability",
          "NEOTEX key surface technology",
          "Premium soundboard construction",
          "Professional-grade specifications"
        ]
      },
      {
        slug: "gx-3-blak",
        name: "GX-3 BLAK",
        size: "5'11\" Grand", 
        price: "Contact for Price",
        rating: 4.9,
        reviews: 47,
        description: "Compact professional grand with full-size performance",
        keyFeatures: [
          "5'11\" grand with remarkable projection",
          "Advanced Millennium III action",
          "Carbon fiber reinforced components",
          "NEOTEX key covering",
          "Optimized string scaling",
          "Premium cabinet finishes"
        ]
      },
      {
        slug: "gx-2-blak",
        name: "GX-2 BLAK",
        size: "5'10\" Grand",
        price: "Contact for Price", 
        rating: 4.8,
        reviews: 41,
        description: "Professional grand offering exceptional value and performance",
        keyFeatures: [
          "5'10\" grand with focused tone",
          "Millennium III action technology",
          "Advanced material construction",
          "Premium key surface treatment",
          "Optimized hammer voicing",
          "Professional tuning stability"
        ]
      },
      {
        slug: "gx-1-blak",
        name: "GX-1 BLAK",
        size: "5'5\" Grand",
        price: "Contact for Price",
        rating: 4.7, 
        reviews: 36,
        description: "Entry-level professional grand with advanced features",
        keyFeatures: [
          "5'5\" grand with excellent tone quality",
          "Millennium III action components",
          "Premium materials throughout",
          "NEOTEX key surface",
          "Solid spruce soundboard",
          "Professional-grade pedals"
        ]
      }
    ]
  },
  {
    name: "GL Traditional Series",
    description: "Classic grand pianos offering exceptional quality and traditional craftsmanship",
    badge: "Traditional Series",
    highlight: "Timeless Elegance",
    models: [
      {
        slug: "gl-50",
        name: "GL-50",
        size: "6'2\" Grand",
        price: "Contact for Price",
        rating: 4.8,
        reviews: 67,
        description: "Premium traditional grand with refined touch and tone",
        keyFeatures: [
          "6'2\" grand with classic voicing",
          "Traditional hammer felt construction",
          "Solid spruce soundboard",
          "Premium key weighting",
          "Classic cabinet styling",
          "Time-tested construction methods"
        ]
      },
      {
        slug: "gl-40",
        name: "GL-40", 
        size: "5'11\" Grand",
        price: "Contact for Price",
        rating: 4.7,
        reviews: 54,
        description: "Versatile traditional grand for home and studio use",
        keyFeatures: [
          "5'11\" grand with warm, musical tone",
          "Traditional action design",
          "Premium materials selection",
          "Classic aesthetic appeal",
          "Reliable tuning stability",
          "Excellent craftsmanship"
        ]
      },
      {
        slug: "gl-30",
        name: "GL-30",
        size: "5'5\" Grand",
        price: "Contact for Price", 
        rating: 4.6,
        reviews: 48,
        description: "Compact traditional grand perfect for smaller spaces",
        keyFeatures: [
          "5'5\" grand with impressive sound",
          "Traditional construction methods",
          "Quality materials throughout",
          "Elegant cabinet design",
          "Smooth, responsive action",
          "Excellent value proposition"
        ]
      },
      {
        slug: "gl-20",
        name: "GL-20",
        size: "5'2\" Grand",
        price: "Contact for Price",
        rating: 4.5,
        reviews: 39,
        description: "Entry-level grand offering authentic acoustic piano experience",
        keyFeatures: [
          "5'2\" grand with good projection",
          "Traditional piano construction",
          "Solid wood components",
          "Classic styling elements",
          "Responsive touch",
          "Affordable grand piano option"
        ]
      },
      {
        slug: "gl-10",
        name: "GL-10", 
        size: "5'0\" Grand",
        price: "Contact for Price",
        rating: 4.4,
        reviews: 33,
        description: "Compact grand piano ideal for home musicians",
        keyFeatures: [
          "5'0\" grand with clear tone",
          "Quality construction standards",
          "Traditional design elements", 
          "Space-efficient footprint",
          "Reliable performance",
          "Entry-level grand pricing"
        ]
      }
    ]
  }
]

const grandPianoFeatures = [
  {
    icon: Zap,
    title: "Millennium III Action",
    description: "Advanced action technology featuring carbon fiber components for exceptional responsiveness and durability in professional performance."
  },
  {
    icon: Award,
    title: "NEOTEX Key Surface", 
    description: "Premium synthetic ivory key surface provides enhanced grip and control while being more durable and consistent than natural materials."
  },
  {
    icon: Music,
    title: "Premium Soundboards",
    description: "Carefully selected solid spruce soundboards are aged and crafted to provide optimal resonance and tonal projection."
  }
]

export default function GrandPianosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl">
            <div className="mb-6 flex items-center">
              <Piano className="h-8 w-8 text-amber-400 mr-3" />
              <span className="text-amber-400 font-semibold text-lg">Acoustic Grand Pianos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Professional Grand Pianos
              <span className="block text-amber-400">For Every Stage</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl">
              From the innovative GX BLAK Performance Series with carbon fiber technology to the 
              timeless GL Traditional Series, discover grand pianos that combine Kawai's renowned 
              craftsmanship with cutting-edge innovations for professional musicians.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="default" size="lg">
                Explore Grand Pianos
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Compare Models
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-400">11</div>
                <div className="text-gray-300">Grand Piano Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">5'0" - 7'6"</div>
                <div className="text-gray-300">Size Range</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">2</div>
                <div className="text-gray-300">Distinct Series</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Grand Piano Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kawai grand pianos incorporate innovative technologies and premium materials 
              to deliver exceptional performance for professional musicians and institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {grandPianoFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-amber-600" />
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
          {grandPianoSeries.map((series) => (
            <div key={series.name} className="mb-20">
              <div className="text-center mb-12">
                <div className="mb-4">
                  <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {series.badge}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {series.name}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                  {series.description}
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 max-w-md mx-auto">
                  <p className="text-amber-800 font-semibold">{series.highlight}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {series.models.map((piano) => (
                  <div key={piano.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                      <Piano className="h-16 w-16 text-amber-600" />
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{piano.name}</h3>
                        <p className="text-amber-600 font-semibold text-sm mb-2">{piano.size}</p>
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
                              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
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
                          <Link href={`/pianos/grand/${piano.slug}`}>
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

      {/* Professional Heritage */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Professional Performance Heritage
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Kawai grand pianos are trusted by professional musicians, music institutions, 
              and recording studios worldwide for their exceptional quality and reliability.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-400">Innovation Leader</h3>
                <p className="text-gray-300">
                  Pioneering technologies like carbon fiber action components and NEOTEX key surfaces 
                  set new standards for performance and durability.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-400">Professional Choice</h3>
                <p className="text-gray-300">
                  Chosen by conservatories, universities, and professional musicians 
                  for their exceptional touch, tone, and long-term reliability.
                </p>
              </div>
            </div>

            <Button variant="default" size="lg">
              Schedule Grand Piano Audition <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Professional Excellence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Visit our showroom to experience the touch, tone, and craftsmanship of Kawai grand pianos. 
            Our specialists will help you find the perfect instrument for your musical needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule Showroom Visit <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/financing">Professional Financing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}