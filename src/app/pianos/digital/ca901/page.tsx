import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Piano, ArrowRight, Star, Play, Heart, Share2, 
  Check, Volume2
} from "lucide-react"

const pianoData = {
  name: "CA901",
  series: "Concert Artist Series",
  fullName: "Kawai CA901 Concert Artist Digital Piano",
  price: "$6,999",
  originalPrice: "$7,999",
  rating: 5,
  reviews: 124,
  availability: "In Stock",
  shortDescription: "The flagship Concert Artist piano featuring revolutionary Grand Feel III wooden-key action and authentic Shigeru Kawai SK-EX concert grand sound.",
  longDescription: "The CA901 embodies 97 years of Kawai's piano-making expertise, representing the pinnacle where traditional Japanese craftsmanship meets scientific innovation. Each key of the Grand Feel III action is meticulously crafted from seasoned wood, providing the authentic touch response that has made Kawai the choice of competition winners worldwide. The Progressive Harmonic Imaging XL sound engine captures every nuance of the legendary Shigeru Kawai SK-EX concert grand—the same instrument trusted by artists in 61+ international competitions. This isn't just a digital piano; it's a gateway to the world's finest concert halls.",
  
  keyFeatures: [
    "Grand Feel III wooden-key action - authentic wood keys with let-off simulation for concert-level touch",
    "Shigeru Kawai SK-EX sound - the competition-winning concert grand sampled in extraordinary detail",
    "Progressive Harmonic Imaging XL - captures complete harmonic spectrum and string resonance",
    "Onkyo premium audio system - 6 speakers with dual 40W amplifiers for studio-quality sound",
    "Spatial Headphone Sound (SHS) - revolutionary 3D audio technology for immersive practice",
    "Competition-grade performance - the same technologies trusted by international artists",
    "Bluetooth connectivity - seamless integration with modern devices and apps",
    "Handcrafted cabinet design - furniture-grade construction reflecting Kawai's attention to detail"
  ],

  specifications: {
    "Action": "Grand Feel III wooden-key action with let-off",
    "Sound Engine": "Progressive Harmonic Imaging XL",
    "Voices": "128 voices including SK-EX, SK-5, EX grands",
    "Polyphony": "256 notes maximum",
    "Speakers": "6 speakers, Onkyo audio system",
    "Amplifiers": "Dual 40W amplifiers",
    "Dimensions": "57-1/8\" W x 18-1/2\" D x 36-1/4\" H",
    "Weight": "187 lbs",
    "Pedals": "3 pedals with half-pedal support",
    "Connectivity": "Bluetooth MIDI/Audio, USB to Host, Line Out",
    "Display": "OLED display with intuitive interface",
    "Finish Options": "Ebony Polish, Satin Black, Satin White"
  },

  included: [
    "Piano bench with storage",
    "Music rest",
    "Owner's manual",
    "Power adapter",
    "USB cable",
    "1-year manufacturer warranty"
  ],

  soundSamples: [
    { name: "SK-EX Concert Grand", duration: "0:45" },
    { name: "SK-5 Studio Grand", duration: "0:38" },
    { name: "EX Concert Grand", duration: "0:52" },
    { name: "Jazz Piano", duration: "0:41" }
  ],

  videos: [
    { title: "CA901 Overview & Demo", duration: "8:45" },
    { title: "Grand Feel III Action Explained", duration: "5:32" },
    { title: "Onkyo Audio System Demo", duration: "3:21" }
  ]
}

const relatedPianos = [
  {
    slug: "ca701",
    name: "CA701",
    price: "$4,999",
    description: "Premium Concert Artist with Grand Feel III"
  },
  {
    slug: "ca501",
    name: "CA501",
    price: "$3,999",
    description: "Entry-level Concert Artist series"
  },
  {
    slug: "cn301",
    name: "CN301",
    price: "$2,999",
    description: "Advanced CN series with great value"
  }
]

export default function CA901Page() {
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
            <Link href="/pianos/digital" className="hover:text-gray-900">Digital Pianos</Link>
            <span>/</span>
            <span className="text-gray-900">{pianoData.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <Piano className="h-32 w-32 text-gray-500" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                    <Piano className="h-6 w-6 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-semibold mb-2">{pianoData.series}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {pianoData.fullName}
                </h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(pianoData.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({pianoData.reviews} reviews)</span>
                </div>

                <p className="text-lg text-gray-600 mb-6">{pianoData.shortDescription}</p>
              </div>

              <div className="border-t border-b py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{pianoData.price}</p>
                    {pianoData.originalPrice && (
                      <p className="text-lg text-gray-500 line-through">{pianoData.originalPrice}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-semibold">{pianoData.availability}</p>
                    <p className="text-sm text-gray-500">Ships in 2-3 weeks</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button size="lg" variant="default" className="w-full">
                    Schedule Showroom Visit
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {pianoData.keyFeatures.slice(0, 6).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Description */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{pianoData.longDescription}</p>
            </div>

            {/* Specifications */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(pianoData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sound Samples */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sound Samples</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pianoData.soundSamples.map((sample, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center">
                      <Volume2 className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="font-medium">{sample.name}</span>
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

            {/* Technology Deep Dive */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology & Innovation</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Grand Feel III Action</h3>
                  <p className="text-gray-600 mb-4">
                    Each of the 88 keys is crafted from premium seasoned wood, providing the authentic weight, 
                    texture, and response of a concert grand piano. The let-off mechanism simulates the subtle 
                    sensation felt when playing a grand piano just before the hammer strikes the string.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Individual key weighting for authentic touch</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Triple-sensor key detection for precise expression</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Shigeru Kawai SK-EX</h3>
                  <p className="text-gray-600 mb-4">
                    The sound of the legendary Shigeru Kawai SK-EX concert grand, recorded in meticulous detail 
                    using our Progressive Harmonic Imaging XL technology. This is the same piano chosen by 
                    competition winners in 61+ international competitions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">88-key individual sampling</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Complete harmonic overtone capture</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pianoData.included.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedPianos.map((piano) => (
              <div key={piano.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Piano className="h-12 w-12 text-gray-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{piano.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{piano.description}</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">{piano.price}</p>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/pianos/digital/${piano.slug}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience 97 Years of Innovation</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Feel the difference that Japanese craftsmanship and scientific innovation make. 
            Experience the Grand Feel III action and competition-winning Shigeru Kawai sound 
            that has earned the trust of artists worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default">
              Schedule Technology Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Learn About Our Heritage
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}