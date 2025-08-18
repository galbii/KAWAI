import { BookOpen, CheckCircle, Heart, Home, Music, Settings, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const buyingGuides = [
  {
    title: "First Piano Buyer's Guide",
    description: "Everything you need to know when choosing your first piano, from space considerations to budget planning.",
    icon: Heart,
    path: "/guides/first-piano",
    topics: ["Acoustic vs Digital", "Space Requirements", "Budget Planning", "Touch and Sound Basics"]
  },
  {
    title: "Digital Piano Selection",
    description: "Navigate the world of digital pianos with confidence, understanding key features and technologies.",
    icon: Settings,
    path: "/guides/digital-piano",
    topics: ["Key Action Types", "Sound Quality", "Connectivity Features", "Home Integration"]
  },
  {
    title: "Acoustic Piano Guide",
    description: "Learn about grand and upright pianos, their differences, and what to consider for your home.",
    icon: Music,
    path: "/guides/acoustic-piano",
    topics: ["Grand vs Upright", "Size Considerations", "Room Acoustics", "Investment Value"]
  },
  {
    title: "Professional Pianist Guide",
    description: "Advanced considerations for serious pianists, including competition-grade instruments and studio setup.",
    icon: Users,
    path: "/guides/professional",
    topics: ["Performance Requirements", "Studio Setup", "Competition Preparation", "Career Investment"]
  }
];

const careGuides = [
  {
    title: "Digital Piano Care",
    description: "Maintain your digital piano's performance and longevity with proper care and maintenance.",
    icon: Shield,
    path: "/guides/digital-care",
    topics: ["Cleaning Procedures", "Environment Considerations", "Software Updates", "Troubleshooting"]
  },
  {
    title: "Acoustic Piano Maintenance",
    description: "Essential care for acoustic pianos, including tuning schedules and environmental factors.",
    icon: Settings,
    path: "/guides/acoustic-care",
    topics: ["Tuning Schedule", "Humidity Control", "Cleaning Methods", "Professional Maintenance"]
  },
  {
    title: "Home Setup Optimization",
    description: "Create the perfect piano environment in your home for optimal sound and performance.",
    icon: Home,
    path: "/guides/home-setup",
    topics: ["Room Placement", "Acoustic Treatment", "Lighting Solutions", "Comfort Setup"]
  }
];

const featuredArticles = [
  {
    title: "Understanding Piano Actions: Why Kawai's Technology Matters",
    excerpt: "Dive deep into the mechanics of piano actions and discover how Kawai's innovations improve your playing experience.",
    readTime: "8 min read",
    category: "Technology",
    featured: true
  },
  {
    title: "The Science Behind ABS-Carbon Composite",
    excerpt: "Learn about the scientific research and testing that proves the superiority of Kawai's composite materials.",
    readTime: "6 min read",
    category: "Innovation",
    featured: true
  },
  {
    title: "Choosing Between Grand and Upright Pianos",
    excerpt: "A comprehensive comparison to help you decide which acoustic piano type is right for your home and needs.",
    readTime: "10 min read",
    category: "Buying Guide",
    featured: true
  }
];

const quickTips = [
  {
    tip: "Digital Piano Placement",
    description: "Keep your digital piano away from direct sunlight and heat sources to prevent damage to electronics and keys.",
    icon: Settings
  },
  {
    tip: "Proper Bench Height",
    description: "Your forearms should be parallel to the floor when playing. Adjust bench height accordingly for comfort and technique.",
    icon: Users
  },
  {
    tip: "Regular Dusting",
    description: "Use a soft, dry cloth to dust your piano weekly. Avoid household cleaners that can damage finishes.",
    icon: Shield
  },
  {
    tip: "Climate Control",
    description: "Maintain 45-65% humidity and stable temperature for optimal piano performance and longevity.",
    icon: Home
  }
];

export default function Guides() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block text-yellow-400">Expert Guidance</span>
              for Piano Owners
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              From choosing your first piano to maintaining a concert grand, our comprehensive guides 
              provide the knowledge and expertise you need to make informed decisions and care for your instrument.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="#buying-guides">Piano Buying Guides</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link href="#care-guides">Care & Maintenance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Buying Guides */}
      <section id="buying-guides" className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Piano Buying Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make confident piano purchasing decisions with our comprehensive buying guides, 
              covering everything from first-time buyers to professional requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buyingGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <guide.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{guide.description}</p>
                
                <div className="space-y-2 mb-6">
                  <h4 className="font-medium text-gray-900 text-sm">Covers:</h4>
                  <ul className="space-y-1">
                    {guide.topics.map((topic, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href={guide.path}>Read Guide</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care & Maintenance Guides */}
      <section id="care-guides" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Care & Maintenance Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your investment and ensure optimal performance with proper piano care and maintenance. 
              Learn from our experts how to keep your instrument in perfect condition.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {careGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <guide.icon className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{guide.title}</h3>
                    <p className="text-gray-600">{guide.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h4 className="font-medium text-gray-900">Topics Covered:</h4>
                  <ul className="space-y-1">
                    {guide.topics.map((topic, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href={guide.path}>View Care Guide</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Care Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential tips every piano owner should know for daily care and optimal performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tip.tip}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Educational Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deep dive into piano technology, maintenance techniques, and expert insights 
              from our comprehensive educational library.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
                  <Button variant="outline" className="w-full">
                    Read Article
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Support */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Need Personal Guidance?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              While our guides provide comprehensive information, sometimes you need personalized advice. 
              Our piano experts are here to help you make the best decisions for your specific situation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Consultation</h3>
                <p className="text-gray-300">Personalized advice from our piano specialists</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Home Assessment</h3>
                <p className="text-gray-300">In-home evaluation of space and acoustics</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ongoing Support</h3>
                <p className="text-gray-300">Continuous care and maintenance assistance</p>
              </div>
            </div>
            
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/consultation">
                Schedule Expert Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Choose Your Piano?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Armed with knowledge from our guides, you're ready to make an informed decision. 
            Visit our showroom to experience Kawai's exceptional instruments firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule Showroom Visit
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pianos">Browse Instruments</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}