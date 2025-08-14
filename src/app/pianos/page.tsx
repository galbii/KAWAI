import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Piano, ArrowRight, Star, Filter, Award, Crown, Music, Zap } from "lucide-react"

const pianoCategories = [
  {
    slug: "shigeru-kawai",
    name: "Shigeru Kawai",
    description: "Ultra-premium handcrafted pianos representing the pinnacle of piano artistry",
    image: "/api/placeholder/600/400",
    models: ["SK-EX", "SK-5", "SK-3"],
    priceRange: "$150,000 - $250,000",
    features: ["Hand-selected Materials", "Master Craftsman Built", "Concert Hall Quality", "Tapered Soundboard"],
    icon: Crown,
    badge: "Ultra-Premium",
    highlight: "Used in Tchaikovsky Competition"
  },
  {
    slug: "grand",
    name: "Acoustic Grand Pianos",
    description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
    image: "/api/placeholder/600/400",
    models: ["GX-7 BLAK", "GX-6 BLAK", "GX-5 BLAK", "GX-3 BLAK", "GX-2 BLAK", "GX-1 BLAK", "GL-50", "GL-40", "GL-30", "GL-20", "GL-10"],
    priceRange: "$45,000 - $185,000",
    features: ["Millennium III Action", "Carbon Fiber Components", "Neotex Key Surface", "Konami Tuning Pins"],
    icon: Piano,
    badge: "Professional",
    highlight: "GX BLAK Performance Series"
  },
  {
    slug: "upright",
    name: "Acoustic Upright Pianos",
    description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
    image: "/api/placeholder/600/400",
    models: ["K-800", "K-600", "K-500", "K-400", "K-300", "K-200", "Designer Series", "Continental Series"],
    priceRange: "$8,999 - $35,000",
    features: ["Extended Length Keys", "Millennium III Prep", "Soft-Close Fallboard", "Premium Hammers"],
    icon: Music,
    badge: "Classic",
    highlight: "K Professional Series"
  },
  {
    slug: "digital",
    name: "Digital Pianos",
    description: "Cutting-edge digital instruments with authentic piano touch and sound",
    image: "/api/placeholder/600/400",
    models: ["CA99", "CA901", "CA701", "CA501", "CN301", "CN201", "CL36", "CL26"],
    priceRange: "$1,999 - $12,999",
    features: ["Grand Feel III Action", "Harmonic Imaging XL", "Onkyo Audio", "Bluetooth Connectivity"],
    icon: Zap,
    badge: "Innovation",
    highlight: "Concert Artist Series"
  },
  {
    slug: "hybrid",
    name: "Hybrid Pianos",
    description: "Revolutionary instruments combining acoustic action with digital versatility",
    image: "/api/placeholder/600/400",
    models: ["NOVUS NV-10S", "NOVUS NV-5S", "AnyTime ATX4", "AnyTime ATX3"],
    priceRange: "$12,999 - $24,999",
    features: ["Real Grand Action", "Silent Practice Mode", "Digital Recording", "Millennium III Action"],
    icon: Award,
    badge: "Hybrid Technology",
    highlight: "NOVUS & AnyTime Series"
  }
]

const featuredModels = [
  {
    name: "SK-EX",
    category: "Shigeru Kawai",
    price: "Contact for Price",
    rating: 5,
    reviews: 47,
    image: "/api/placeholder/300/200",
    badge: "Concert Grand",
    description: "9' concert grand used in international competitions"
  },
  {
    name: "GX-7 BLAK",
    category: "Grand Piano",
    price: "Contact for Price",
    rating: 5,
    reviews: 63,
    image: "/api/placeholder/300/200",
    badge: "Performance Series",
    description: "7'6\" professional grand with carbon fiber action"
  },
  {
    name: "CA99",
    category: "Digital Piano",
    price: "$12,999",
    rating: 5,
    reviews: 89,
    image: "/api/placeholder/300/200",
    badge: "Flagship Digital",
    description: "Ultimate Concert Artist with wooden keys"
  },
  {
    name: "NOVUS NV-10S",
    category: "Hybrid Piano",
    price: "$24,999",
    rating: 5,
    reviews: 34,
    image: "/api/placeholder/300/200",
    badge: "Revolutionary",
    description: "Real grand action with silent practice"
  },
  {
    name: "K-800",
    category: "Upright Piano",
    price: "$34,999",
    rating: 5,
    reviews: 72,
    image: "/api/placeholder/300/200",
    badge: "Professional",
    description: "51\" professional upright with Millennium III"
  },
  {
    name: "CA901",
    category: "Digital Piano",
    price: "$6,999",
    originalPrice: "$7,999",
    rating: 5,
    reviews: 124,
    image: "/api/placeholder/300/200",
    badge: "Best Seller",
    description: "Concert Artist with Grand Feel III action"
  }
]

export default function PianosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl">
            <div className="mb-6">
              <span className="text-yellow-400 font-semibold text-lg">Since 1927 • 95+ Years of Excellence</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              Experience the Complete
              <span className="block text-yellow-400">Kawai Piano Collection</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl">
              From the legendary Shigeru Kawai concert grands used in international competitions to 
              innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="default" size="lg">
                Explore All Categories
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Piano Finder Tool <Filter className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400">95+</div>
                <div className="text-gray-300">Years of Innovation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">5</div>
                <div className="text-gray-300">Piano Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">50+</div>
                <div className="text-gray-300">Piano Models</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Piano Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From the world's finest concert grands to revolutionary digital instruments, 
              explore five distinct categories designed to meet every musical need and aspiration.
            </p>
          </div>

          <div className="grid gap-12">
            {pianoCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div key={category.slug} className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:w-1/2">
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <IconComponent className="h-24 w-24 text-gray-500" />
                      {category.badge && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {category.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:w-1/2 space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {category.name}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">
                        {category.description}
                      </p>
                      {category.highlight && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                          <p className="text-yellow-800 font-semibold">{category.highlight}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="font-semibold">Price Range: {category.priceRange}</span>
                        <span>•</span>
                        <span>{category.models.length} Models Available</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Technologies:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-600">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href={`/pianos/${category.slug}`}>
                          Explore {category.name} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/pianos/${category.slug}#compare`}>
                          Compare Models
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flagship & Featured Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most celebrated instruments, from competition-grade concert grands 
              to innovative digital and hybrid pianos preferred by professionals worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <div key={model.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {model.badge && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        {model.badge}
                      </span>
                    </div>
                  </div>
                )}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Piano className="h-16 w-16 text-gray-500" />
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{model.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-2">{model.category}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{model.description}</p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(model.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({model.reviews} reviews)</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900">{model.price}</p>
                      {model.originalPrice && (
                        <p className="text-sm text-gray-500 line-through mb-1">{model.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      View Details
                    </Button>
                    <Button className="flex-1">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kawai Technology Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kawai Innovation & Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the groundbreaking technologies that set Kawai pianos apart, 
              from revolutionary action designs to advanced sound engines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Piano className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Millennium III Action</h3>
              <p className="text-gray-300">
                Advanced composite materials and carbon fiber components create the most responsive 
                and durable action mechanism in acoustic pianos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Harmonic Imaging XL</h3>
              <p className="text-gray-300">
                Revolutionary sound engine captures every harmonic detail of our world-renowned 
                Shigeru Kawai concert grands with stunning realism.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Grand Feel III</h3>
              <p className="text-gray-300">
                Real wooden keys with grade-A spruce, let-off simulation, and authentic 
                hammer weighting for the ultimate digital piano experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Finder Tool */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Kawai Piano
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From budget and space requirements to musical goals and experience level, 
                our piano finder tool helps you discover the ideal instrument for your journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Profile</h3>
                <p className="text-gray-600 text-sm">Experience level, musical style, and practice habits</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-600 text-sm">Budget range, space constraints, and key features</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-gray-600 text-sm">AI-powered recommendations from our complete lineup</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                <p className="text-gray-600 text-sm">Schedule showroom visit and try your matches</p>
              </div>
            </div>

            <div className="text-center">
              <Button variant="default" size="lg">
                Start Piano Finder <Filter className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience the Difference
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Visit our showroom to hear and feel the exceptional quality of Kawai pianos. 
            Our experts will help you find the perfect instrument for your musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule Showroom Visit <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/financing">View Financing Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}