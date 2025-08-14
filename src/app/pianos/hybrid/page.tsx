import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, ArrowRight, Star, Volume2, VolumeX, Piano, Zap } from "lucide-react"

const hybridPianoSeries = [
  {
    name: "NOVUS Series", 
    description: "Revolutionary hybrid pianos featuring real grand piano action with digital versatility",
    badge: "Revolutionary Technology",
    highlight: "Real Grand Piano Action",
    models: [
      {
        slug: "nv-10s",
        name: "NOVUS NV-10S",
        series: "NOVUS Series",
        size: "Upright Hybrid",
        price: "$24,999",
        rating: 5,
        reviews: 34,
        badge: "Revolutionary",
        image: "/api/placeholder/500/400",
        description: "The world's first upright piano with real grand piano action mechanism",
        keyFeatures: [
          "Real Millennium III grand piano action in upright form",
          "Authentic acoustic piano touch and feel",
          "Silent practice with headphones",
          "Shigeru Kawai SK-EX and other premium sounds",
          "Advanced digital recording capabilities",
          "Bluetooth MIDI and Audio connectivity",
          "Professional speaker system"
        ],
        specifications: {
          "Action": "Real Millennium III grand piano action",
          "Sound Engine": "SK-EX Rendering with 88-key sampling",
          "Voices": "38 voices including multiple grands",
          "Polyphony": "256 notes maximum",
          "Speakers": "6 speakers with amplified sound system",
          "Dimensions": "58\" W x 24\" D x 49\" H",
          "Weight": "485 lbs (220 kg)",
          "Pedals": "3 pedals with half-pedal support",
          "Silent Mode": "Complete silent practice capability"
        },
        uniqueFeatures: [
          "World's first upright with grand action",
          "Patented hybrid technology design",
          "Acoustic and digital modes seamlessly integrated",
          "Professional recording studio features"
        ]
      },
      {
        slug: "nv-5s",
        name: "NOVUS NV-5S",
        series: "NOVUS Series", 
        size: "Digital Hybrid",
        price: "$15,999",
        rating: 4.9,
        reviews: 42,
        badge: "Innovation Award",
        image: "/api/placeholder/500/400",
        description: "Advanced hybrid piano with wooden-key action and premium digital features",
        keyFeatures: [
          "Grand Feel III wooden-key action",
          "Hybrid sensor technology for ultimate expression",
          "Premium Shigeru Kawai concert grand sounds",
          "Advanced Spatial Headphone Sound",
          "Professional recording capabilities",
          "Bluetooth connectivity",
          "Concert Performer mode"
        ],
        specifications: {
          "Action": "Grand Feel III wooden-key hybrid action",
          "Sound Engine": "SK-EX Rendering with harmonic imaging",
          "Voices": "Over 40 premium voices",
          "Polyphony": "256 notes maximum",
          "Speakers": "6 speakers with premium amplification",
          "Dimensions": "57\" W x 19\" D x 36\" H",
          "Weight": "198 lbs (90 kg)",
          "Pedals": "3 pedals with advanced sensing",
          "Recording": "Multi-track MIDI and audio recording"
        },
        uniqueFeatures: [
          "Hybrid sensing technology",
          "Wooden key construction with sensors",
          "Advanced sound modeling",
          "Professional connectivity options"
        ]
      }
    ]
  },
  {
    name: "AnyTime Series",
    description: "Acoustic grand and upright pianos with integrated silent practice systems",
    badge: "Silent Practice Technology",
    highlight: "Acoustic + Silent Practice",
    models: [
      {
        slug: "atx4",
        name: "AnyTime ATX4",
        series: "AnyTime Series",
        size: "6'1\" Grand with Silent System",
        price: "Contact for Price",
        rating: 4.8,
        reviews: 28,
        badge: "Silent Grand",
        image: "/api/placeholder/500/400",
        description: "Professional grand piano with integrated silent practice system",
        keyFeatures: [
          "6'1\" acoustic grand piano with full acoustic performance",
          "Integrated AnyTime silent practice system",
          "Millennium III action with sensor technology",
          "Switch between acoustic and silent modes instantly",
          "Premium digital piano sounds for silent practice",
          "Recording and playback capabilities",
          "Professional acoustic piano when desired"
        ],
        specifications: {
          "Piano Type": "6'1\" acoustic grand with silent system",
          "Action": "Millennium III with digital sensors",
          "Silent Voices": "Multiple premium piano voices",
          "Acoustic Mode": "Full acoustic grand piano performance",
          "Dimensions": "6'1\" x 4'11\" x 3'4\" (piano dimensions)",
          "Silent Features": "Headphone output, recording, voices",
          "Pedals": "3 pedals with acoustic and digital sensing",
          "Installation": "Professional installation required"
        },
        uniqueFeatures: [
          "Real acoustic grand piano",
          "Silent practice without compromise",
          "Seamless mode switching",
          "Professional installation and setup"
        ]
      },
      {
        slug: "atx3",
        name: "AnyTime ATX3",
        series: "AnyTime Series",
        size: "48\" Upright with Silent System", 
        price: "Contact for Price",
        rating: 4.7,
        reviews: 36,
        badge: "Silent Upright",
        image: "/api/placeholder/500/400",
        description: "Professional upright piano with integrated silent practice capabilities",
        keyFeatures: [
          "48\" professional acoustic upright piano",
          "Integrated AnyTime silent system technology",
          "Advanced action with digital sensors",
          "Instant switching between acoustic and silent",
          "Quality digital sounds for silent practice",
          "MIDI recording and connectivity",
          "Full acoustic performance when desired"
        ],
        specifications: {
          "Piano Type": "48\" acoustic upright with silent system",
          "Action": "Professional upright with digital sensors",
          "Silent Voices": "Premium digital piano sounds",
          "Acoustic Mode": "Full acoustic upright performance",
          "Dimensions": "58\" W x 25\" D x 48\" H",
          "Silent Features": "Headphone practice, recording, voices",
          "Pedals": "3 pedals with dual sensing",
          "Installation": "Professional setup included"
        },
        uniqueFeatures: [
          "Real acoustic upright piano",
          "Silent practice system integrated",
          "Professional acoustic sound",
          "Compact upright footprint"
        ]
      }
    ]
  }
]

const hybridFeatures = [
  {
    icon: Piano,
    title: "Real Piano Action",
    description: "Experience authentic acoustic piano touch and feel with advanced sensor technology that captures every nuance of your playing."
  },
  {
    icon: VolumeX,
    title: "Silent Practice Mode",
    description: "Practice anytime with headphones while maintaining the authentic feel of an acoustic piano action mechanism."
  },
  {
    icon: Zap,
    title: "Hybrid Technology",
    description: "Seamlessly switch between acoustic and digital modes, combining the best of both worlds in one remarkable instrument."
  }
]

export default function HybridPianosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl">
            <div className="mb-6 flex items-center">
              <Award className="h-8 w-8 text-indigo-400 mr-3" />
              <span className="text-indigo-400 font-semibold text-lg">Hybrid Piano Technology</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Revolutionary Hybrid Pianos
              <span className="block text-indigo-400">Best of Both Worlds</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl">
              Experience groundbreaking instruments that combine authentic acoustic piano action 
              with cutting-edge digital technology. Practice silently with headphones or enjoy 
              full acoustic performance - the choice is yours.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="default" size="lg">
                Explore Hybrid Innovation
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Technology Demo
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-400">4</div>
                <div className="text-gray-300">Hybrid Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-400">2</div>
                <div className="text-gray-300">Revolutionary Series</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-400">100%</div>
                <div className="text-gray-300">Silent Practice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hybrid Technology Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Hybrid Piano Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hybrid pianos represent the ultimate evolution in piano technology, offering the authentic 
              touch of acoustic instruments with the convenience and versatility of digital features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hybridFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-indigo-600" />
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
          {hybridPianoSeries.map((series) => (
            <div key={series.name} className="mb-20">
              <div className="text-center mb-12">
                <div className="mb-4">
                  <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {series.badge}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {series.name}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                  {series.description}
                </p>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 max-w-md mx-auto">
                  <p className="text-indigo-800 font-semibold">{series.highlight}</p>
                </div>
              </div>

              <div className="space-y-16">
                {series.models.map((piano, index) => (
                  <div key={piano.slug} className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className="lg:w-1/2">
                      <div className="aspect-[4/3] bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Award className="h-24 w-24 text-indigo-600" />
                        {piano.badge && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-indigo-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                              {piano.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2 space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{piano.name}</h3>
                        <p className="text-lg text-indigo-600 font-semibold mb-4">{piano.size}</p>
                        <p className="text-lg text-gray-600 mb-6">{piano.description}</p>
                        
                        <div className="flex items-center mb-6">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < Math.floor(piano.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-gray-600 ml-2">({piano.reviews} reviews)</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Revolutionary Features:</h4>
                        <div className="space-y-2">
                          {piano.keyFeatures.slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="font-semibold text-indigo-900 mb-2">Unique Innovation:</h4>
                        <ul className="space-y-1">
                          {piano.uniqueFeatures.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-indigo-700 text-sm flex items-start">
                              <Zap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{piano.price}</p>
                          <p className="text-sm text-gray-500">Professional installation included</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <Link href={`/pianos/hybrid/${piano.slug}`}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Schedule Demo
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

      {/* Innovation Showcase */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Future of Piano Technology
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Kawai hybrid pianos represent decades of innovation, combining traditional 
              piano craftsmanship with cutting-edge digital technology for an unparalleled musical experience.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Piano className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Authentic Touch</h3>
                <p className="text-gray-300">
                  Real acoustic piano actions and mechanisms provide the authentic feel 
                  musicians demand, with advanced sensor technology for digital integration.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Versatile Performance</h3>
                <p className="text-gray-300">
                  Switch instantly between acoustic and silent modes, record performances, 
                  and access premium digital sounds while maintaining authentic piano touch.
                </p>
              </div>
            </div>

            <Button variant="default" size="lg">
              Experience Hybrid Innovation <Award className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Revolutionary Hybrid Technology
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Visit our showroom to experience the remarkable innovation of Kawai hybrid pianos. 
            Feel the authentic action and discover the versatility that's changing the piano world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-demo">
                Schedule Technology Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/technology/hybrid">Learn More About Hybrid Tech</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}