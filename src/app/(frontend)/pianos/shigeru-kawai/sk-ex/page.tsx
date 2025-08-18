import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Crown, ArrowRight, Star, Play, Heart, Share2, 
  Award, Music, Volume2, CheckCircle, Calendar
} from "lucide-react"

const pianoData = {
  name: "SK-EX",
  series: "Shigeru Kawai",
  fullName: "Shigeru Kawai SK-EX Concert Grand Piano",
  size: "9' Concert Grand",
  price: "Contact for Price",
  rating: 5,
  reviews: 47,
  availability: "Available by Special Order",
  shortDescription: "The ultimate 9-foot concert grand piano, chosen for international competitions and the world's most prestigious stages.",
  longDescription: "The Shigeru Kawai SK-EX represents the absolute pinnacle of piano craftsmanship and artistic expression. This magnificent 9-foot concert grand is meticulously handcrafted by master artisans using only the finest materials and time-honored techniques. Used in the International Tchaikovsky Competition and gracing the stages of concert halls worldwide, the SK-EX delivers unparalleled projection, dynamic range, and tonal beauty that has captivated the world's most accomplished musicians.",
  
  keyFeatures: [
    "9-foot concert grand with exceptional projection and dynamic range",
    "Hand-selected premium European spruce soundboard with tapered construction",
    "Millennium III Hybrid action with carbon fiber components",
    "Premium German Roslau piano wire for superior string quality",
    "Neotex synthetic ivory key surface for enhanced control",
    "Konami tuning pins for superior tuning stability",
    "Soft-close fallboard with hydraulic dampening system",
    "Multiple cabinet finishes including Ebony Polish and special orders",
    "Competition-grade specifications meeting international standards",
    "Individually voiced and regulated by master technicians"
  ],

  specifications: {
    "Piano Type": "9-foot acoustic concert grand",
    "Dimensions": "9'0\" L × 5'1\" W × 3'4\" H (274 × 155 × 102 cm)",
    "Weight": "750 lbs (340 kg)",
    "Keys": "88 keys with Neotex synthetic ivory surface",
    "Action": "Millennium III Hybrid with carbon fiber",
    "Soundboard": "Hand-selected European spruce, tapered construction",
    "Strings": "Premium German Roslau piano wire",
    "Tuning Pins": "Konami tuning pins for superior stability",
    "Pedals": "3 pedals with half-pedal support (soft, sostenuto, sustain)",
    "Finish Options": "Ebony Polish (standard), special finishes available",
    "Hammers": "Premium mahogany moldings with finest wool felt",
    "Rim Construction": "Laminated hardwood with acoustic optimization",
    "Bridges": "Vertically laminated with precise crown adjustment"
  },

  craftmanship: [
    {
      title: "Master Craftsman Construction",
      description: "Each SK-EX is handbuilt by master artisans with decades of experience, ensuring uncompromising quality and attention to detail."
    },
    {
      title: "Premium Material Selection", 
      description: "Only the finest hand-selected materials are used, from European spruce soundboards to premium German strings."
    },
    {
      title: "Advanced Action Technology",
      description: "The Millennium III Hybrid action incorporates carbon fiber components for ultimate responsiveness and durability."
    },
    {
      title: "Individual Voicing & Regulation",
      description: "Every piano is individually voiced and regulated by master technicians to achieve perfect tonal balance."
    }
  ],

  accolades: [
    "Official piano of the International Tchaikovsky Competition",
    "Used in major concert halls worldwide including Carnegie Hall",
    "Preferred by leading international concert pianists",
    "Winner of multiple industry design and craftsmanship awards",
    "Featured in prestigious music festivals and competitions",
    "Endorsed by conservatories and music institutions globally"
  ],

  soundSamples: [
    { name: "Classical Repertoire Demo", duration: "3:45", description: "Chopin Ballade performed on SK-EX" },
    { name: "Competition Performance", duration: "2:30", description: "Rachmaninoff excerpt from Tchaikovsky Competition" },
    { name: "Chamber Music", duration: "4:12", description: "Mozart Piano Concerto with orchestra" },
    { name: "Contemporary Works", duration: "2:15", description: "Modern compositions showcasing dynamic range" }
  ],

  videos: [
    { title: "SK-EX at the Tchaikovsky Competition", duration: "12:45", description: "Documentary about the SK-EX's role in competition" },
    { title: "Master Craftsman: Building the SK-EX", duration: "18:30", description: "Behind the scenes construction process" },
    { title: "Concert Hall Acoustics", duration: "8:20", description: "SK-EX performance in various concert venues" },
    { title: "Artist Testimonials", duration: "15:00", description: "Leading pianists discuss the SK-EX" }
  ],

  artistTestimonials: [
    {
      artist: "Daniil Trifonov",
      quote: "The SK-EX responds to every subtle nuance while providing the power needed for the most demanding repertoire.",
      title: "International Concert Pianist"
    },
    {
      artist: "Yuja Wang", 
      quote: "This instrument allows for an incredible range of expression, from the most delicate pianissimo to thunderous fortissimo.",
      title: "Virtuoso Pianist"
    },
    {
      artist: "Lang Lang",
      quote: "The SK-EX has become my instrument of choice for the most important concerts. Its voice is simply extraordinary.",
      title: "International Piano Superstar"
    }
  ]
}

export default function SKEXPage() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/pianos" className="hover:text-gray-900">Pianos</Link>
            <span>/</span>
            <Link href="/pianos/shigeru-kawai" className="hover:text-gray-900">Shigeru Kawai</Link>
            <span>/</span>
            <span className="text-gray-900">{pianoData.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-yellow-400 mr-3" />
              <span className="text-yellow-400 font-semibold text-lg">{pianoData.series}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pianoData.fullName}
            </h1>
            <p className="text-xl text-gray-300 mb-6">{pianoData.shortDescription}</p>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-yellow-200 font-semibold">Official Piano of the International Tchaikovsky Competition</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex">
                {[...Array(pianoData.rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-300">({pianoData.reviews} professional reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Images and Media */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <Crown className="h-32 w-32 text-gray-500" />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                    <Crown className="h-8 w-8 text-gray-500" />
                  </div>
                ))}
              </div>

              {/* Sound Samples */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Concert Recordings
                </h3>
                <div className="space-y-3">
                  {pianoData.soundSamples.map((sample, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <div className="font-medium text-gray-900">{sample.name}</div>
                        <div className="text-sm text-gray-600">{sample.description}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{sample.duration}</span>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{pianoData.name}</h2>
                    <p className="text-lg text-purple-600 font-semibold">{pianoData.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{pianoData.price}</p>
                    <p className="text-sm text-gray-600">{pianoData.availability}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{pianoData.longDescription}</p>
              </div>

              <div className="space-y-6">
                <Button size="lg" variant="default" className="w-full">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Private Audition
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save to Favorites
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-4">Distinguished Features</h3>
                <div className="space-y-3">
                  {pianoData.keyFeatures.slice(0, 8).map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Specifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(pianoData.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-4 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">{key}</span>
                  <span className="text-gray-700 text-right max-w-md">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Master Craftsmanship</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every SK-EX is a masterpiece of piano artistry, representing generations of craftsmanship 
                and innovation in acoustic piano design.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {pianoData.craftmanship.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artist Testimonials */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Artists Say</h2>
              <p className="text-xl text-gray-300">
                Leading pianists worldwide choose the SK-EX for their most important performances.
              </p>
            </div>

            <div className="space-y-8">
              {pianoData.artistTestimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <blockquote className="text-lg italic text-gray-200 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <Music className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <div className="font-semibold text-white">{testimonial.artist}</div>
                      <div className="text-sm text-gray-300">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accolades */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">International Recognition</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pianoData.accolades.map((accolade, idx) => (
                <div key={idx} className="flex items-center bg-white rounded-lg p-4 shadow">
                  <Award className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800">{accolade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the SK-EX</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The SK-EX is available for private audition by appointment. Experience this extraordinary 
            instrument in our dedicated Shigeru Kawai showroom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default">
              Schedule Private Audition <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
              Contact Shigeru Specialist
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}