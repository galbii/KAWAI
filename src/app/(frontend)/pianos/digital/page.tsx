"use client";

import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";
import { useScrollAnimation, fadeUpClass, slideInClass, scaleInClass } from "@/lib/hooks/useScrollAnimation";
import { useEffect, useRef, useState } from "react";
import { getProductlines, transformProductlinesToSeries, getProductlinesWithProducts } from "@/lib/payload";
import { Productline } from "@/lib/types";

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


export default function DigitalPianosPage() {
  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  const [productlines, setProductlines] = useState<Productline[]>([]);
  const [series, setSeries] = useState(digitalPianoSeries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductlines() {
      try {
        setLoading(true);
        // Use the function that fetches productlines WITH their products via join field
        const seriesWithPianos = await getProductlinesWithProducts('digital');
        
        if (seriesWithPianos.length > 0) {
          setSeries(seriesWithPianos);
          // Also set productlines for compatibility
          const productlines = await getProductlines('digital');
          setProductlines(productlines);
        }
      } catch (err) {
        console.error('Failed to fetch productlines:', err);
        setError('Failed to load product data');
        // Keep using hardcoded data as fallback
      } finally {
        setLoading(false);
      }
    }

    fetchProductlines();
  }, []);
  
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
      {loading ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-kawai-neutral/20 rounded-lg mb-4 max-w-md mx-auto" />
              <div className="h-4 bg-kawai-neutral/20 rounded-lg mb-8 max-w-lg mx-auto" />
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-kawai-neutral/20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-kawai-red/10 border border-kawai-red/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-kawai-red mb-2">Unable to load product data</h3>
              <p className="text-kawai-black/70">{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <UnifiedPianoSeries
          title="Explore Digital Piano Series"
          description="Discover our complete collection of digital piano series. Each series showcases distinct technologies and features for different musical needs."
          series={series}
          categorySlug="digital"
          productlines={productlines}
        />
      )}


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