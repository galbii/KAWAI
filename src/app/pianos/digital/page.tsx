"use client";

import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";
import { useScrollAnimation, fadeUpClass, slideInClass, scaleInClass } from "@/lib/hooks/useScrollAnimation";
import { useEffect, useRef } from "react";

// Featured digital pianos - highlighting the best from each series
const featuredDigitalPianos = [
  {
    slug: "ca901",
    name: "CA901",
    series: "Concert Artist Series",
    rating: 5,
    reviews: 124,
    image: "/images/banners/CA901EP-bench-styling.webp",
    description: "Professional Concert Artist with Grand Feel III action and premium sound system",
    keyFeatures: [
      "88-key Grand Feel III wooden-key action",
      "Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds",
      "Onkyo audio system with 6 speakers",
      "Bluetooth MIDI and Audio connectivity",
      "Spatial Headphone Sound technology",
      "Professional recording capabilities"
    ]
  },
  {
    slug: "cn301",
    name: "CN301",
    series: "CN Series",
    rating: 4.7,
    reviews: 156,
    image: "/images/banners/CN301-styling.webp",
    description: "Advanced CN series piano with Responsive Hammer III action",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Progressive Harmonic Imaging sound technology",
      "Dual headphone jacks for silent practice",
      "Built-in Bluetooth MIDI connectivity",
      "Compact design perfect for home use",
      "Recording and lesson functions"
    ]
  },
  {
    slug: "es920",
    name: "ES920",
    series: "ES Series",
    rating: 4.5,
    reviews: 78,
    image: "/images/banners/ES920-styling.webp",
    description: "Professional portable piano with premium sound and features",
    keyFeatures: [
      "88-key Responsive Hammer III action",
      "Harmonic Imaging XL sound technology",
      "Lightweight portable design at just 38 lbs",
      "Line outputs for professional stage use",
      "USB connectivity and recording",
      "Professional sound library"
    ]
  }
];

// Piano series with complete piano data for browsing
const digitalPianoSeries = [
  {
    name: "CA Series",
    description: "The pinnacle of digital piano technology, featuring Grand Feel III wooden-key action and premium Shigeru Kawai concert grand sounds. Professional instruments trusted by musicians worldwide.",
    pianos: [
      {
        slug: "ca901",
        name: "CA901",
        series: "Concert Artist Series",
        rating: 5,
        reviews: 124,
        image: "/images/banners/CA901EP-bench-styling.webp",
        description: "Professional Concert Artist with Grand Feel III action and premium sound system",
        keyFeatures: [
          "88-key Grand Feel III wooden-key action",
          "Shigeru Kawai SK-EX, SK-5, EX concert grand piano sounds",
          "Onkyo audio system with 6 speakers",
          "Bluetooth MIDI and Audio connectivity",
          "Spatial Headphone Sound technology",
          "Professional recording capabilities"
        ]
      },
      {
        slug: "ca701",
        name: "CA701",
        series: "Concert Artist Series",
        rating: 4.9,
        reviews: 89,
        image: "/images/banners/CA701-styling.webp",
        description: "Advanced Concert Artist model with premium features and realistic touch",
        keyFeatures: [
          "88-key Grand Feel III wooden-key action",
          "Shigeru Kawai SK-EX and SK-5 sounds",
          "High-quality speaker system",
          "Advanced connectivity options",
          "Professional recording features",
          "Spatial headphone technology"
        ]
      },
      {
        slug: "ca501",
        name: "CA501",
        series: "Concert Artist Series",
        rating: 4.8,
        reviews: 76,
        image: "/images/banners/CA501-styling.webp",
        description: "Entry-level Concert Artist with authentic grand piano experience",
        keyFeatures: [
          "88-key Grand Feel II action",
          "Shigeru Kawai SK-EX sampling",
          "Quality speaker system",
          "Bluetooth connectivity",
          "Lesson functions",
          "Recording capabilities"
        ]
      }
    ]
  },
  {
    name: "CN Series",
    description: "Advanced digital pianos offering exceptional value with Responsive Hammer III action and Progressive Harmonic Imaging sound technology. Perfect for serious musicians and students.",
    pianos: [
      {
        slug: "cn301",
        name: "CN301",
        series: "CN Series",
        rating: 4.7,
        reviews: 156,
        image: "/images/banners/CN301-styling.webp",
        description: "Advanced CN series piano with Responsive Hammer III action",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Progressive Harmonic Imaging sound technology",
          "Dual headphone jacks for silent practice",
          "Built-in Bluetooth MIDI connectivity",
          "Compact design perfect for home use",
          "Recording and lesson functions"
        ]
      },
      {
        slug: "cn201",
        name: "CN201",
        series: "CN Series",
        rating: 4.6,
        reviews: 134,
        image: "/images/banners/CN201-styling.webp",
        description: "Compact CN model with essential features and quality touch",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Progressive Harmonic Imaging sounds",
          "Dual headphone outputs",
          "USB connectivity",
          "Compact cabinet design",
          "Educational features"
        ]
      }
    ]
  },
  {
    name: "KDP Series",
    description: "Elegant console digital pianos with traditional furniture styling and authentic piano action. Designed to complement your home while delivering professional performance.",
    pianos: [
      {
        slug: "cl36",
        name: "CL36",
        series: "CL Console Series",
        rating: 4.5,
        reviews: 67,
        image: "/images/banners/CL36-styling.webp",
        description: "Traditional console design with modern digital technology",
        keyFeatures: [
          "88-key Responsive Hammer action",
          "Harmonic Imaging sound technology",
          "Traditional cabinet styling",
          "Built-in music rest",
          "Headphone connectivity",
          "Compact footprint"
        ]
      }
    ]
  },
  {
    name: "ES Series",
    description: "Professional portable digital pianos perfect for performing musicians. Lightweight designs with advanced action technology and premium sounds for studio and stage use.",
    pianos: [
      {
        slug: "es920",
        name: "ES920",
        series: "ES Portable Series",
        rating: 4.5,
        reviews: 78,
        image: "/images/banners/ES920-styling.webp",
        description: "Professional portable piano with premium sound and features",
        keyFeatures: [
          "88-key Responsive Hammer III action",
          "Harmonic Imaging XL sound technology",
          "Lightweight portable design at just 38 lbs",
          "Line outputs for professional stage use",
          "USB connectivity and recording",
          "Professional sound library"
        ]
      },
      {
        slug: "es520",
        name: "ES520",
        series: "ES Portable Series",
        rating: 4.4,
        reviews: 92,
        image: "/images/banners/ES520-styling.webp",
        description: "Compact portable piano with essential features for performers",
        keyFeatures: [
          "88-key Responsive Hammer action",
          "Harmonic Imaging sounds",
          "Ultra-portable at 31 lbs",
          "Battery operation capability",
          "Bluetooth connectivity",
          "Stage-ready outputs"
        ]
      }
    ]
  }
];

// Animated Section Component
function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const animation = useScrollAnimation({ threshold: 0.2, delay });
  
  return (
    <section ref={animation.ref} className={className}>
      <div className={fadeUpClass(animation.isVisible)}>
        {children}
      </div>
    </section>
  );
}

// Enhanced Feature Grid Component
function FeatureGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Grand Feel III Action",
      description: "Real wooden keys with let-off simulation and authentic hammer weighting for the most realistic grand piano touch.",
      delay: 0
    },
    {
      title: "Shigeru Kawai Sampling",
      description: "Every nuance of our world-renowned SK-EX and SK-5 concert grands captured with stunning realism and dynamic expression.",
      delay: 200
    },
    {
      title: "Spatial Headphone Sound",
      description: "Advanced crossfeed technology creates natural acoustic ambience through headphones for comfortable extended practice.",
      delay: 400
    }
  ];

  return (
    <div ref={sectionRef} className="grid md:grid-cols-3 gap-8 mb-12">
      {features.map((feature, index) => (
        <div 
          key={index}
          className={`text-center transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${feature.delay}ms` }}
        >
          <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-500 hover:scale-110">
            <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              {index === 0 && (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              )}
              {index === 1 && (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
              )}
              {index === 2 && (
                <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H19C20.1 4 21 4.9 21 6V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4H7ZM5 8V20H19V8H5Z"/>
              )}
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-kawai-red">{feature.title}</h3>
          <p className="text-kawai-pearl/80">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function DigitalPianosPage() {
  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Animation */}
      <section 
        ref={heroAnimation.ref} 
        className="relative py-12 lg:py-16 bg-cover bg-center bg-no-repeat bg-[url('/images/banners/CA901EP-bench-styling.webp')]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/60 via-kawai-black/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className={`inline-block bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-medium mb-4 ${scaleInClass(heroAnimation.isVisible)}`}>
              Digital Pianos
            </div>
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 ${fadeUpClass(heroAnimation.isVisible, 200)}`}>
              Innovation Meets Tradition
            </h1>
            <p className={`text-xl md:text-2xl leading-relaxed text-white/90 mb-8 max-w-2xl ${fadeUpClass(heroAnimation.isVisible, 400)}`}>
              Experience the perfect blend of traditional piano craftsmanship and cutting-edge digital technology. Our digital pianos deliver authentic acoustic piano experience with modern convenience and connectivity.
            </p>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 ${fadeUpClass(heroAnimation.isVisible, 600)}`}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-kawai-red mb-1">5</div>
                <div className="text-sm text-white/80 font-medium">Piano Series</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-kawai-red mb-1">16</div>
                <div className="text-sm text-white/80 font-medium">Digital Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-kawai-red mb-1">SK-EX</div>
                <div className="text-sm text-white/80 font-medium">Sound Sources</div>
              </div>
            </div>
            <div className={fadeUpClass(heroAnimation.isVisible, 800)}>
              <a
                href="#series"
                className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/80 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
              >
                <span>Explore Series</span>
                <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Series Browser with Carousel */}
      <UnifiedPianoSeries
        title="Explore Digital Piano Series"
        description="Discover our complete collection of digital piano series. Each series showcases distinct technologies and features for different musical needs."
        series={digitalPianoSeries}
        categorySlug="digital"
      />

      {/* Technology Showcase */}
      <AnimatedSection className="py-16 lg:py-24 bg-gradient-to-br from-kawai-black to-kawai-neutral text-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Advanced Digital Piano Technology
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-pearl/80 mb-12">
            Kawai's innovative technologies bring you closer to the authentic grand piano experience than ever before.
          </p>
          
          <FeatureGrid />

          <a
            href="/technology"
            className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/80 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Explore Technology</span>
            <svg
              className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="py-16 lg:py-24 bg-kawai-pearl text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            Experience Digital Excellence
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Visit our showroom to experience the touch, sound, and features of our digital pianos. Compare models side-by-side and find your perfect match.
          </p>
          
          <a
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Visit Showroom</span>
            <svg
              className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </AnimatedSection>
    </div>
  );
}