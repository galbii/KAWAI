import { ArrowRight, Award, Beaker, Cog, Headphones, Music, Piano, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const technologies = [
  {
    name: "Millennium III Action",
    category: "Mechanical Innovation",
    description: "The pinnacle of composite action technology, featuring extended key length, carbon fiber reinforcement, and precision engineering for ultimate control and expression.",
    features: [
      "ABS-Carbon composite construction",
      "Extended key length for enhanced leverage",
      "Carbon fiber reinforced hammers",
      "Precision-weighted keys",
      "Competition-grade repetition speed"
    ],
    benefits: [
      "Unmatched consistency across all 88 keys",
      "Superior repetition capability",
      "Enhanced dynamic range and control",
      "Resistance to environmental changes",
      "Decades of maintenance-free performance"
    ],
    icon: Cog,
    detailPath: "/technology/millennium-iii"
  },
  {
    name: "ABS-Carbon Composite",
    category: "Material Science",
    description: "Revolutionary composite material that surpasses traditional wood in durability, consistency, and resistance to environmental factors. Scientifically proven at Cal Poly.",
    features: [
      "ABS polymer base with carbon fiber reinforcement",
      "Scientifically tested at Cal Poly University",
      "10x more resistant to humidity than wood",
      "Consistent weight and density",
      "No seasonal maintenance required"
    ],
    benefits: [
      "Eliminates wood's natural inconsistencies",
      "No warping, cracking, or seasonal movement",
      "Consistent touch response over decades",
      "Reduced maintenance requirements",
      "Superior long-term stability"
    ],
    icon: Shield,
    detailPath: "/technology/abs-carbon"
  },
  {
    name: "Progressive Harmonic Imaging",
    category: "Digital Sound Technology",
    description: "Advanced sound sampling technology that captures the complete harmonic spectrum of Shigeru Kawai concert grands, providing unprecedented realism in digital pianos.",
    features: [
      "88-key individual sampling",
      "Multiple velocity layers per key",
      "Complete harmonic overtone capture",
      "String resonance modeling",
      "Sympathetic string vibration simulation"
    ],
    benefits: [
      "Authentic concert grand sound",
      "Realistic dynamic response",
      "Natural harmonic resonance",
      "Enhanced musical expression",
      "Studio-quality audio reproduction"
    ],
    icon: Music,
    detailPath: "/technology/phi"
  },
  {
    name: "Grand Feel III Action",
    category: "Digital Piano Innovation",
    description: "Wooden-key action technology that brings the authentic feel of a concert grand piano to digital instruments, featuring let-off simulation and triple-sensor detection.",
    features: [
      "Full-length wooden keys",
      "Let-off mechanism simulation",
      "Triple-sensor key detection",
      "Individual key weighting",
      "Escapement feel reproduction"
    ],
    benefits: [
      "Authentic grand piano touch",
      "Enhanced expression and control",
      "Smooth transition between acoustic and digital",
      "Professional-level training capability",
      "Concert preparation readiness"
    ],
    icon: Piano,
    detailPath: "/technology/grand-feel-iii"
  },
  {
    name: "Spatial Headphone Sound",
    category: "Audio Innovation",
    description: "Revolutionary 3D audio technology that creates an immersive concert hall experience through headphones, making practice sessions more engaging and realistic.",
    features: [
      "Binaural 3D audio processing",
      "Concert hall ambience simulation",
      "Multiple virtual room types",
      "Distance and positioning effects",
      "Crossfeed adjustment controls"
    ],
    benefits: [
      "Immersive practice experience",
      "Reduced listening fatigue",
      "Natural spatial perception",
      "Enhanced musical enjoyment",
      "Professional monitoring quality"
    ],
    icon: Headphones,
    detailPath: "/technology/shs"
  },
  {
    name: "SK-EX Rendering",
    category: "Sound Modeling",
    description: "Detailed sound modeling of the flagship Shigeru Kawai SK-EX concert grand, capturing every nuance of this world-renowned instrument used in international competitions.",
    features: [
      "Complete SK-EX piano modeling",
      "Advanced resonance algorithms",
      "Pedal noise and mechanism sounds",
      "Damper resonance simulation",
      "Competition-quality sound reproduction"
    ],
    benefits: [
      "Access to world-class concert grand sound",
      "Competition-level audio quality",
      "Authentic playing experience",
      "Professional recording capabilities",
      "Artist-approved sound reproduction"
    ],
    icon: Award,
    detailPath: "/technology/sk-ex-rendering"
  }
];

const researchHighlights = [
  {
    title: "Cal Poly University Testing",
    description: "Independent scientific testing at California Polytechnic State University proved that Kawai's ABS-Carbon composite materials are significantly more stable and consistent than traditional wood.",
    results: ["10x more humidity resistant", "Superior dimensional stability", "Consistent density throughout", "No seasonal maintenance required"]
  },
  {
    title: "Competition Performance Analysis",
    description: "Data from 61+ international piano competition victories shows that Shigeru Kawai pianos consistently deliver the precision and reliability demanded by world-class pianists.",
    results: ["61+ competition victories", "Preferred by competition winners", "Consistent performance under pressure", "World-renowned reliability"]
  },
  {
    title: "Long-term Durability Studies",
    description: "Decades of real-world testing demonstrate that Kawai's composite actions maintain their precision and responsiveness far longer than traditional wooden actions.",
    results: ["Decades of consistent performance", "Minimal maintenance requirements", "Stable regulation over time", "Superior longevity"]
  }
];

export default function Technology() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block text-yellow-400">Scientific Innovation</span>
              Meets Musical Artistry
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Discover the cutting-edge technologies that make Kawai pianos the choice of competition winners, 
              concert artists, and discerning musicians worldwide. Each innovation represents years of research, 
              testing, and refinement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild>
                <Link href="#technologies">Explore Technologies</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link href="#research">Scientific Research</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pioneering Piano Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From revolutionary composite materials to advanced digital sound processing, 
              Kawai's technologies set new standards for piano performance, reliability, and musical expression.
            </p>
          </div>
          
          <div className="grid gap-12" id="technologies">
            {technologies.map((tech, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <tech.icon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tech.name}</h3>
                        <p className="text-yellow-600 font-medium">{tech.category}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">{tech.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {tech.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {tech.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild>
                    <Link href={tech.detailPath}>
                      Learn More About {tech.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <tech.icon className="h-24 w-24 text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Testing */}
      <section id="research" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Scientific Research & Validation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kawai's innovations aren't just theoretical—they're rigorously tested and validated through 
              independent research, real-world performance data, and decades of professional use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {researchHighlights.map((research, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-4">
                  <Beaker className="h-8 w-8 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-900">{research.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{research.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Findings:</h4>
                  <ul className="space-y-1">
                    {research.results.map((result, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <Target className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Philosophy */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Innovation Through Scientific Method
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Kawai's approach to innovation combines traditional Japanese craftsmanship with rigorous scientific methodology. 
              Every technology we develop undergoes extensive testing, validation, and real-world performance verification 
              before becoming part of our instruments.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Research</h3>
                <p className="text-gray-300">Rigorous scientific investigation and material testing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-300">Breakthrough technologies that advance the art of piano making</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Validation</h3>
                <p className="text-gray-300">Proven performance in competitions and professional use</p>
              </div>
            </div>
            <Button size="lg" variant="default" asChild>
              <Link href="/pianos">
                Experience These Technologies
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Kawai Technology
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Visit our showroom to experience these innovative technologies firsthand. 
            Feel the difference that scientific research and Japanese craftsmanship make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/contact/schedule-visit">
                Schedule a Technology Demo
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