import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Crown, ArrowRight, Star, Award, Music, Play } from "lucide-react"

const shigeruKawaiPianos = [
  {
    slug: "sk-ex",
    name: "SK-EX",
    series: "Shigeru Kawai",
    size: "9' Concert Grand",
    price: "Contact for Price",
    rating: 5,
    reviews: 47,
    badge: "Competition Grade",
    image: "/api/placeholder/500/400",
    description: "The ultimate concert grand piano, chosen for international competitions including the Tchaikovsky Competition",
    keyFeatures: [
      "9-foot concert grand with exceptional projection",
      "Hand-selected premium materials throughout",
      "Tapered solid spruce soundboard",
      "Millennium III Hybrid action with carbon fiber",
      "Competition-grade specifications",
      "Premium Roslau piano wire",
      "Neotex key surface for enhanced control"
    ],
    specifications: {
      "Length": "9' (274 cm)",
      "Width": "5'1\" (155 cm)", 
      "Height": "3'4\" (102 cm)",
      "Weight": "750 lbs (340 kg)",
      "Keys": "88 keys with Neotex surface",
      "Action": "Millennium III Hybrid with carbon fiber",
      "Soundboard": "Tapered solid spruce",
      "Strings": "Premium Roslau piano wire",
      "Finish": "Ebony Polish, available in limited finishes"
    },
    accolades: [
      "Official piano of the International Tchaikovsky Competition",
      "Used in major concert halls worldwide",
      "Preferred by leading international pianists",
      "Winner of multiple industry awards"
    ]
  },
  {
    slug: "sk-5",
    name: "SK-5",
    series: "Shigeru Kawai",
    size: "6'1\" Chamber Grand",
    price: "Contact for Price",
    rating: 5,
    reviews: 34,
    badge: "Studio Master",
    image: "/api/placeholder/500/400",
    description: "Professional chamber grand offering concert-quality performance in a more compact size",
    keyFeatures: [
      "6'1\" chamber grand with rich, powerful tone",
      "Master craftsman handbuilt construction",
      "Premium selected European spruce soundboard",
      "Millennium III action technology",
      "Exceptional touch sensitivity and control",
      "Premium German Roslau strings",
      "Soft-close fallboard"
    ],
    specifications: {
      "Length": "6'1\" (185 cm)",
      "Width": "4'11\" (150 cm)",
      "Height": "3'4\" (102 cm)", 
      "Weight": "575 lbs (261 kg)",
      "Keys": "88 keys with premium key covering",
      "Action": "Millennium III with advanced materials",
      "Soundboard": "Premium European solid spruce",
      "Strings": "German Roslau piano wire",
      "Finish": "Ebony Polish, Mahogany Polish available"
    },
    accolades: [
      "Chosen by recording studios worldwide",
      "Featured in prestigious music institutions",
      "Preferred by professional chamber musicians",
      "Award-winning design and craftsmanship"
    ]
  },
  {
    slug: "sk-3",
    name: "SK-3",
    series: "Shigeru Kawai",
    size: "6'1\" Grand",
    price: "Contact for Price", 
    rating: 5,
    reviews: 28,
    badge: "Premium Grand",
    image: "/api/placeholder/500/400",
    description: "Entry point into the Shigeru Kawai collection, offering exceptional quality and performance",
    keyFeatures: [
      "6'1\" grand with signature Shigeru Kawai sound",
      "Hand-selected premium materials",
      "Advanced Millennium III action",
      "European spruce soundboard",
      "Professional-grade specifications",
      "Refined touch and tonal character",
      "Elegant cabinet design"
    ],
    specifications: {
      "Length": "6'1\" (185 cm)",
      "Width": "4'11\" (150 cm)",
      "Height": "3'4\" (102 cm)",
      "Weight": "565 lbs (256 kg)",
      "Keys": "88 keys with premium surface",
      "Action": "Millennium III advanced action",
      "Soundboard": "European solid spruce",
      "Strings": "Premium piano wire",
      "Finish": "Ebony Polish, special finishes available"
    },
    accolades: [
      "Entry into the prestigious Shigeru Kawai line",
      "Used by serious musicians and institutions", 
      "Exceptional value in premium piano category",
      "Recognized for superior craftsmanship"
    ]
  }
]

const shigeruFeatures = [
  {
    icon: Crown,
    title: "Master Craftsman Built",
    description: "Each Shigeru Kawai piano is handcrafted by master artisans with decades of experience, ensuring uncompromising quality and attention to detail."
  },
  {
    icon: Award,
    title: "Competition Grade",
    description: "Chosen for international competitions including the Tchaikovsky Competition, these instruments meet the highest professional standards."
  },
  {
    icon: Music,
    title: "Premium Materials",
    description: "Only the finest hand-selected materials are used, from premium European spruce soundboards to advanced carbon fiber action components."
  }
]

export default function ShigeruKawaiPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white py-24">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl">
            <div className="mb-6 flex items-center">
              <Crown className="h-8 w-8 text-yellow-400 mr-3" />
              <span className="text-yellow-400 font-semibold text-lg">Ultra-Premium Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Shigeru Kawai
              <span className="block text-yellow-400">Concert Grands</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl">
              Experience the pinnacle of piano artistry. These handcrafted instruments represent 
              the ultimate expression of Kawai's 95+ years of piano-making excellence, chosen by 
              the world's most demanding musicians and prestigious competitions.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="default" size="lg">
                Schedule Private Audition
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Competition Heritage
              </Button>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-yellow-200 font-semibold flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Official Piano of the International Tchaikovsky Competition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Art of Piano Excellence
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Shigeru Kawai pianos represent the absolute pinnacle of piano craftsmanship. Named after 
              Kawai's former president and master piano designer, these instruments are meticulously 
              handcrafted by master artisans who have dedicated their lives to the pursuit of tonal 
              and touch perfection. Each piano undergoes extensive quality control and voicing to 
              ensure it meets the exacting standards demanded by the world's finest musicians.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {shigeruFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Piano Collection */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Shigeru Kawai Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three exceptional grand pianos, each representing the absolute pinnacle of acoustic piano design and craftsmanship.
            </p>
          </div>

          <div className="space-y-16">
            {shigeruKawaiPianos.map((piano, index) => (
              <div key={piano.slug} className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Crown className="h-24 w-24 text-gray-500" />
                    {piano.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                          {piano.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{piano.name}</h3>
                    <p className="text-lg text-purple-600 font-semibold mb-4">{piano.size}</p>
                    <p className="text-lg text-gray-600 mb-6">{piano.description}</p>
                    
                    <div className="flex items-center mb-6">
                      <div className="flex">
                        {[...Array(piano.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-gray-600 ml-2">({piano.reviews} professional reviews)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Distinguished Features:</h4>
                    <div className="space-y-2">
                      {piano.keyFeatures.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Notable Accolades:</h4>
                    <ul className="space-y-1">
                      {piano.accolades.slice(0, 2).map((accolade, idx) => (
                        <li key={idx} className="text-purple-700 text-sm flex items-start">
                          <Award className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {accolade}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{piano.price}</p>
                      <p className="text-sm text-gray-500">Financing available</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/pianos/shigeru-kawai/${piano.slug}`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Schedule Audition
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Heritage */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Competition Heritage
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Shigeru Kawai pianos have earned their place on the world's most prestigious stages, 
              chosen by international competitions and concert halls for their exceptional quality and reliability.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">International Tchaikovsky Competition</h3>
                <p className="text-gray-300">
                  The SK-EX has been the official piano of this prestigious competition, 
                  trusted by the world's most accomplished pianists.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Concert Halls Worldwide</h3>
                <p className="text-gray-300">
                  From Carnegie Hall to the Royal Albert Hall, Shigeru Kawai pianos 
                  grace the stages of the world's most renowned venues.
                </p>
              </div>
            </div>

            <Button variant="default" size="lg">
              Experience the Legend <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Perfection
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Shigeru Kawai pianos are available for private audition by appointment. 
            Experience these exceptional instruments in our dedicated showroom environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-audition">
                Schedule Private Audition <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Shigeru Specialist</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}