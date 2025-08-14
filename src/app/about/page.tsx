import { Calendar, Globe, Heart, Lightbulb, Music, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const timelineEvents = [
  {
    year: "1927",
    title: "Foundation",
    description: "Koichi Kawai, former apprentice to Torakusu Yamaha, establishes Kawai Musical Instruments with a vision to democratize access to quality pianos.",
    icon: Calendar
  },
  {
    year: "1955",
    title: "Second Generation Leadership",
    description: "Shigeru Kawai becomes president, introducing a scientific approach to piano innovation and establishing the foundation for modern Kawai technology.",
    icon: Users
  },
  {
    year: "1971",
    title: "ABS Technology Revolution",
    description: "Kawai introduces revolutionary ABS composite materials for piano actions, later proven at Cal Poly to be superior to traditional wood in durability and consistency.",
    icon: Lightbulb
  },
  {
    year: "1989",
    title: "Third Generation & Global Expansion",
    description: "Hirotaka Kawai takes leadership, introducing robotics in manufacturing and expanding Kawai's global presence while maintaining traditional craftsmanship values.",
    icon: Globe
  },
  {
    year: "2002",
    title: "Millennium III Action",
    description: "Launch of the revolutionary Millennium III Action, representing the pinnacle of composite action technology and setting new standards for touch and response.",
    icon: Music
  },
  {
    year: "2024",
    title: "Continued Excellence",
    description: "97 years later, Kawai continues to lead with 61+ international competition victories and instruments trusted by artists and institutions worldwide.",
    icon: Trophy
  }
];

const innovations = [
  {
    title: "ABS-Carbon Composite Technology",
    description: "Scientifically proven superior to traditional wood, our ABS-Carbon composite actions provide unmatched consistency, durability, and resistance to environmental changes.",
    benefits: ["10x more resistant to humidity", "Consistent touch over decades", "No seasonal adjustments needed"]
  },
  {
    title: "Millennium III Action",
    description: "The culmination of decades of research, featuring extended key length, carbon fiber reinforcement, and precision engineering for ultimate control and expression.",
    benefits: ["Enhanced repetition speed", "Improved dynamic control", "Competition-grade precision"]
  },
  {
    title: "Progressive Harmonic Imaging",
    description: "Advanced sound sampling technology that captures the complete harmonic spectrum of our concert grands, providing unprecedented realism in digital pianos.",
    benefits: ["88-key sampling", "Multiple velocity layers", "Authentic resonance modeling"]
  }
];

const philosophyPoints = [
  {
    title: "Music is for Everyone",
    description: "From our founding, Kawai has believed that quality instruments should be accessible to musicians at every level, not just the elite.",
    icon: Heart
  },
  {
    title: "Scientific Innovation",
    description: "We combine traditional Japanese craftsmanship with cutting-edge research and testing to continuously advance piano technology.",
    icon: Lightbulb
  },
  {
    title: "Crafting Inspiration",
    description: "Every piano we create is designed to inspire musicians to reach new heights of musical expression and artistic achievement.",
    icon: Music
  },
  {
    title: "Three-Generation Legacy",
    description: "Our family leadership ensures that Kawai's values and commitment to excellence are maintained across generations.",
    icon: Users
  }
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              97 Years of
              <span className="block text-yellow-400">Musical Innovation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Since 1927, three generations of the Kawai family have dedicated their lives to crafting inspiration 
              through innovative piano technology, scientific research, and an unwavering commitment to quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="/pianos">Explore Our Instruments</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link href="#timeline">Discover Our History</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Philosophy */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Philosophy: Crafting Inspiration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kawai's philosophy combines traditional Japanese values of excellence and attention to detail 
              with innovative thinking and scientific advancement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {philosophyPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <point.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Legacy of Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Koichi Kawai's vision in 1927 to today's cutting-edge technology, 
              explore the milestones that have shaped our company and the piano industry.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex mb-12 last:mb-0">
                <div className="flex flex-col items-center mr-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <event.icon className="h-8 w-8 text-yellow-600" />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-px h-24 bg-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">{event.year}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Innovations */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kawai's commitment to scientific research and innovation has produced groundbreaking 
              technologies that have redefined what's possible in piano design and performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {innovations.map((innovation, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{innovation.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{innovation.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {innovation.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Success */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Competition Heritage
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Kawai pianos have been the choice of competition winners for decades, with our Shigeru Kawai 
              concert grands earning 61+ international competition victories.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">61+</div>
                <div className="text-gray-300">International Victories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">97</div>
                <div className="text-gray-300">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">3</div>
                <div className="text-gray-300">Generations of Leadership</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience 97 Years of Innovation
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how Kawai's legacy of innovation, scientific research, and family dedication 
            can enhance your musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/pianos">
                Explore Our Instruments
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}