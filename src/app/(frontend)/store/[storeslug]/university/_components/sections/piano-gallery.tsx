"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';

// PostHog import removed

interface FeaturedPiano {
  id: string;
  model: string;
  title: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  keyFeatures: string[];
  availability: string;
}

const featuredPianos: FeaturedPiano[] = [
  {
    id: "es-120",
    model: "ES-120",
    title: "Kawai ES-120",
    description: "Compact digital piano with Responsive Hammer Compact action, 88 weighted keys, and premium piano sounds. Perfect for Houston piano lessons, home practice, and portable performances.",
    image: "/images/optimized/pianos/es120.webp",
    category: "Digital Piano",
    originalPrice: 1099,
    salePrice: 949,
    savings: 150,
    keyFeatures: ["88 Weighted Keys", "Responsive Hammer Action", "19 Premium Sounds"],
    availability: "Available for demonstration"
  },
  {
    id: "k-200",
    model: "K-200",
    title: "Kawai K-200",
    description: "Professional upright piano with premium spruce soundboard, responsive action, and rich, resonant tone. Popular choice for Houston piano families, serious students, teachers, and music institutions.",
    image: "/images/optimized/pianos/K-200_EP_styling_1200.webp",
    category: "Upright Piano",
    originalPrice: 8395,
    salePrice: 6390,
    savings: 2005,
    keyFeatures: ["Solid Spruce Soundboard", "Premium Action", "114cm Height"],
    availability: "Available for demonstration"
  },
  {
    id: "gl-10",
    model: "GL-10",
    title: "Kawai GL-10",
    description: "Baby grand piano combining traditional craftsmanship with modern precision. Delivers exceptional touch, tone, and musical expression for the most discerning musicians.",
    image: "/images/optimized/pianos/GL10_1200.webp",
    category: "Grand Piano",
    originalPrice: 18995,
    salePrice: 12950,
    savings: 6045,
    keyFeatures: ["5'1\" Baby Grand", "Premium Action", "Solid Spruce Soundboard"],
    availability: "Available for demonstration"
  }
];

interface PianoSectionProps {
  piano: FeaturedPiano;
  index: number;
  hasTrackedAnyPiano: React.MutableRefObject<boolean>;
}

function PianoSection({ piano, index, hasTrackedAnyPiano }: PianoSectionProps) {
  const { ref: sectionRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  // PostHog tracking removed
  const activeTimer = useRef<NodeJS.Timeout | null>(null);

  const isEven = index % 2 === 0;

  // Track piano gallery view after 6 seconds (once per page view, any model)
  useEffect(() => {
    // Clear any existing timer first
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }

    if (isVisible && !hasTrackedAnyPiano.current) {
      activeTimer.current = setTimeout(() => {
        // Double-check we haven't tracked any piano yet
        if (!hasTrackedAnyPiano.current) {
          // Mark as tracked FIRST to prevent duplicate calls
          hasTrackedAnyPiano.current = true;
          
          // Piano view tracking removed
        }
        activeTimer.current = null;
      }, 6000); // 6 seconds
    }

    return () => {
      if (activeTimer.current) {
        clearTimeout(activeTimer.current);
        activeTimer.current = null;
      }
    };
  }, [isVisible, piano.model, piano.salePrice, piano.category, hasTrackedAnyPiano]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-[30vh] flex items-center py-3"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className={`grid lg:grid-cols-2 gap-4 lg:gap-6 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Image */}
          <div className={`relative ${isEven ? 'order-1 lg:order-2' : 'order-1 lg:col-start-1'}`}>
            <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
              <Image
                src={piano.image}
                alt={`${piano.title} - Houston Piano Sales - Available at KAWAI Piano Store Houston`}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-4 ${isEven ? 'order-2 lg:order-1' : 'order-2 lg:col-start-2'}`}>
            <div className="space-y-3">
              <div className={`space-y-1 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-sm font-medium text-gray-600 break-words overflow-hidden">{piano.category}</div>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-kawai-black break-words overflow-hidden">
                  {piano.title}
                </h2>
              </div>
              
              {/* Experience Information */}
              <div className={`space-y-2 transition-all duration-600 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className={`inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 delay-300 hover:bg-blue-200 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                  </svg>
                  Book an Appointment for Priority Deals and University Pricing
                </div>
              </div>
              
              <div className={`space-y-4 transition-all duration-600 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-sm md:text-base leading-relaxed text-kawai-black/80 max-w-lg">
                  {piano.description}
                </p>
                
                {/* Key Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-kawai-black">Key Features:</h4>
                  <ul className="text-sm text-kawai-black/70 space-y-1">
                    {piano.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-medium">{piano.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedDealsProps {
  onOpenConsultation: () => void;
}

export function FeaturedDeals({ onOpenConsultation }: FeaturedDealsProps) {
  const hasTrackedAnyPiano = useRef<boolean>(false);
  // const heroRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div id="featured-deals" className="bg-white">
      {/* Section Header */}
      <section ref={headerRef} className="py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className={`mb-8 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Premium Gallery Title */}
            <div className={`relative inline-block mb-6 transition-all duration-600 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-red-600 font-bold text-lg mb-2 tracking-wide">FEATURED MODELS</div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-2">
                HOUSTON PIANO GALLERY
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg"></div>
            </div>
            
            {/* Premium Subtitle */}
            <div className={`space-y-4 mb-6 transition-all duration-600 delay-400 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl md:text-2xl font-semibold text-gray-700 tracking-wide">
                Premium Collection • Expert Guidance
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  EXCLUSIVE SHOWCASE
                </div>
                <span className="text-red-600 font-bold text-lg">December 4th - 7th, 2025</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Piano Models */}
      {featuredPianos.map((piano, index) => (
        <PianoSection key={piano.id} piano={piano} index={index} hasTrackedAnyPiano={hasTrackedAnyPiano} />
      ))}
      
      {/* CTA Section */}
      <section className="py-12 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6 space-y-4">
          <h3 className="font-heading text-2xl font-semibold text-kawai-black">
            Schedule Your Personal Appointment
          </h3>
          <p className="text-kawai-black/70 max-w-lg mx-auto">
            Get priority access to special university pricing and deals when you book your appointment. See more models in person and connect with our KAWAI piano experts for personalized recommendations.
          </p>
          <div className="space-y-2">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
            >
              <span>Book Appointment</span>
              <svg
                className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-sm text-blue-600 font-medium">
              December 4th-7th experiences available • Appointment only
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}