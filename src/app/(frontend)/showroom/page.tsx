import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Play, Camera, Volume2, VolumeX, Maximize, Crown, Piano, 
  Award, Music, ArrowRight, Eye, MapPin, Clock, Calendar
} from "lucide-react"

const showroomSections = [
  {
    id: "shigeru-kawai",
    name: "Shigeru Kawai Gallery",
    description: "Experience our ultra-premium handcrafted concert grands",
    icon: Crown,
    pianos: [
      { name: "SK-EX", size: "9' Concert Grand", badge: "Competition Grade" },
      { name: "SK-5", size: "6'1\" Chamber Grand", badge: "Studio Master" },
      { name: "SK-3", size: "6'1\" Grand", badge: "Premium" }
    ],
    features: ["Private audition rooms", "Master technician on-site", "Competition-quality acoustics"],
    color: "purple"
  },
  {
    id: "grand-piano-hall",
    name: "Grand Piano Hall", 
    description: "Professional acoustic grands with advanced technology",
    icon: Piano,
    pianos: [
      { name: "GX-7 BLAK", size: "7'6\" Semi-Concert", badge: "Performance Series" },
      { name: "GX-5 BLAK", size: "6'1\" Grand", badge: "Professional" },
      { name: "GL-50", size: "6'2\" Grand", badge: "Traditional" }
    ],
    features: ["Side-by-side comparison", "Acoustic treatment", "Professional lighting"],
    color: "amber"
  },
  {
    id: "digital-showcase",
    name: "Digital Piano Showcase",
    description: "Cutting-edge digital instruments with authentic touch",
    icon: Award,
    pianos: [
      { name: "CA99", size: "Concert Artist", badge: "Flagship Digital" },
      { name: "CA901", size: "Concert Artist", badge: "Best Seller" },
      { name: "CN301", size: "CN Series", badge: "Great Value" }
    ],
    features: ["Headphone listening stations", "App integration demos", "Sound comparison"],
    color: "blue"
  },
  {
    id: "hybrid-experience",
    name: "Hybrid Piano Experience",
    description: "Revolutionary instruments combining acoustic and digital",
    icon: Music,
    pianos: [
      { name: "NOVUS NV-10S", size: "Hybrid Upright", badge: "Revolutionary" },
      { name: "NOVUS NV-5S", size: "Digital Hybrid", badge: "Innovation Award" },
      { name: "AnyTime ATX4", size: "Silent Grand", badge: "Silent Technology" }
    ],
    features: ["Silent mode demonstrations", "Technology explanations", "Interactive displays"],
    color: "indigo"
  },
  {
    id: "upright-gallery",
    name: "Upright Piano Gallery",
    description: "Space-efficient acoustic pianos for home and studio",
    icon: Piano,
    pianos: [
      { name: "K-800", size: "51\" Professional", badge: "Flagship Upright" },
      { name: "K-500", size: "45\" Studio", badge: "Popular Choice" },
      { name: "K-300", size: "44\" Home", badge: "Best Value" }
    ],
    features: ["Space planning assistance", "Finish comparisons", "Acoustic demonstrations"],
    color: "green"
  }
]

const virtualTourFeatures = [
  {
    icon: Eye,
    title: "360° Virtual Views",
    description: "Explore each piano from every angle with high-resolution 360° photography"
  },
  {
    icon: Volume2,
    title: "Professional Recordings",
    description: "Listen to studio-quality recordings of each piano with various musical styles"
  },
  {
    icon: Play,
    title: "Video Demonstrations",
    description: "Watch expert pianists demonstrate the unique qualities of each instrument"
  },
  {
    icon: Camera,
    title: "Detail Close-ups",
    description: "Examine craftsmanship details, finishes, and premium materials up close"
  }
]

export default function VirtualShowroomPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Virtual Piano Showroom
              <span className="block text-blue-400">Explore from Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Take an immersive virtual tour of our piano showroom. Experience our complete collection 
              of Kawai instruments with 360° views, professional recordings, and detailed close-ups 
              from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button variant="default" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start Virtual Tour
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule In-Person Visit
              </Button>
            </div>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-gray-300">Piano Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">5</div>
                <div className="text-gray-300">Themed Galleries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">360°</div>
                <div className="text-gray-300">Virtual Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-gray-300">Always Open</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Virtual Tour Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our virtual showroom offers an immersive experience that brings you closer to our pianos 
              than ever before, with features that complement and enhance your piano shopping journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {virtualTourFeatures.map((feature, index) => {
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

      {/* Showroom Sections */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Gallery Sections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our virtual showroom is organized into themed galleries, each showcasing different 
              categories of Kawai instruments with specialized demonstrations and features.
            </p>
          </div>

          <div className="grid gap-8">
            {showroomSections.map((section, index) => {
              const Icon = section.icon
              const colorClasses = {
                purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-800",
                amber: "from-amber-500 to-amber-600 bg-amber-50 border-amber-200 text-amber-800", 
                blue: "from-blue-500 to-blue-600 bg-blue-50 border-blue-200 text-blue-800",
                indigo: "from-indigo-500 to-indigo-600 bg-indigo-50 border-indigo-200 text-indigo-800",
                green: "from-green-500 to-green-600 bg-green-50 border-green-200 text-green-800"
              }
              
              return (
                <div key={section.id} className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:w-1/2">
                    <div className={`aspect-[4/3] bg-gradient-to-br ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[section.color as keyof typeof colorClasses].split(' ')[1]} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                      <Icon className="h-24 w-24 text-white/80" />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-sm font-semibold text-gray-900">Featured Pianos:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {section.pianos.slice(0, 2).map((piano, idx) => (
                              <span key={idx} className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                                {piano.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Tour
                      </Button>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2 space-y-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <Icon className={`h-8 w-8 mr-3 text-${section.color}-600`} />
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {section.name}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 mb-6">
                        {section.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Featured Instruments:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.pianos.map((piano, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{piano.name}</div>
                              <div className="text-sm text-gray-600">{piano.size}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[section.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')}`}>
                              {piano.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Gallery Features:</h4>
                      <div className="space-y-2">
                        {section.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className={`w-2 h-2 bg-${section.color}-400 rounded-full mr-3 flex-shrink-0`} />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={`/showroom/${section.id}`}>
                          Explore Gallery <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interactive Showroom Experience
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Our virtual showroom goes beyond static images, offering interactive features 
              that help you make informed decisions about your piano purchase.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Maximize className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Live Virtual Consultations</h3>
                <p className="text-gray-300 mb-4">
                  Connect with our piano specialists for live virtual consultations while exploring 
                  the showroom. Get expert guidance and ask questions in real-time.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Schedule Consultation
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <VolumeX className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">A/B Sound Comparisons</h3>
                <p className="text-gray-300 mb-4">
                  Compare the sound of different pianos side-by-side with our interactive 
                  audio player. Perfect for understanding tonal differences between models.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Try Comparisons
                </Button>
              </div>
            </div>

            <Button variant="default" size="lg">
              Start Your Virtual Tour <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Visit Information */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready for an In-Person Visit?
              </h2>
              <p className="text-lg text-gray-600">
                While our virtual showroom offers an incredible experience, nothing replaces 
                the feeling of playing these instruments in person.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Visit Our Showroom</h3>
                <p className="text-gray-600">Experience all pianos in our acoustically treated showroom spaces</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Flexible Hours</h3>
                <p className="text-gray-600">Open 7 days a week with evening appointments available</p>
              </div>
              <div className="text-center">
                <Music className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
                <p className="text-gray-600">Our piano specialists provide personalized recommendations</p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" variant="default" asChild>
                <Link href="/contact/schedule-visit">
                  Schedule Showroom Visit <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}