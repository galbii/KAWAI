"use client";

import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";

// Featured hybrid pianos - highlighting the best from each series
const featuredHybridPianos = [
  {
    slug: "nv-10s",
    name: "NOVUS NV-10S",
    series: "NOVUS Series",
    rating: 5,
    reviews: 34,
    image: "/images/banners/NV10S-hybrid-styling.webp",
    description: "The world's first upright piano with real grand piano action mechanism",
    keyFeatures: [
      "Real Millennium III grand piano action in upright form",
      "Authentic acoustic piano touch and feel",
      "Silent practice with headphones",
      "Shigeru Kawai SK-EX and other premium sounds",
      "Advanced digital recording capabilities",
      "Bluetooth MIDI and Audio connectivity"
    ]
  },
  {
    slug: "nv-5s",
    name: "NOVUS NV-5S",
    series: "NOVUS Series",
    rating: 4.9,
    reviews: 42,
    image: "/images/banners/NV5S-hybrid-styling.webp",
    description: "Advanced hybrid piano with wooden-key action and premium digital features",
    keyFeatures: [
      "Grand Feel III wooden-key action",
      "Hybrid sensor technology for ultimate expression",
      "Premium Shigeru Kawai concert grand sounds",
      "Advanced Spatial Headphone Sound",
      "Professional recording capabilities",
      "Concert Performer mode"
    ]
  },
  {
    slug: "atx4",
    name: "AnyTime ATX4",
    series: "AnyTime Series",
    rating: 4.8,
    reviews: 28,
    image: "/images/banners/ATX4-grand-styling.webp",
    description: "Professional grand piano with integrated silent practice system",
    keyFeatures: [
      "6'1\" acoustic grand piano with full acoustic performance",
      "Integrated AnyTime silent practice system",
      "Millennium III action with sensor technology",
      "Switch between acoustic and silent modes instantly",
      "Premium digital piano sounds for silent practice",
      "Professional acoustic piano when desired"
    ]
  }
];

// Hybrid piano series with complete piano data for browsing
const hybridPianoSeries = [
  {
    name: "NOVUS Series",
    description: "Revolutionary hybrid pianos featuring real grand piano action with digital versatility. The world's first upright piano with authentic grand piano action mechanism and advanced digital technology.",
    pianos: [
      {
        slug: "nv-10s",
        name: "NOVUS NV-10S",
        series: "NOVUS Series",
        rating: 5,
        reviews: 34,
        image: "/images/banners/NV10S-hybrid-styling.webp",
        description: "The world's first upright piano with real grand piano action mechanism",
        keyFeatures: [
          "Real Millennium III grand piano action in upright form",
          "Authentic acoustic piano touch and feel",
          "Silent practice with headphones",
          "Shigeru Kawai SK-EX and other premium sounds",
          "Advanced digital recording capabilities",
          "Bluetooth MIDI and Audio connectivity"
        ]
      },
      {
        slug: "nv-5s",
        name: "NOVUS NV-5S",
        series: "NOVUS Series",
        rating: 4.9,
        reviews: 42,
        image: "/images/banners/NV5S-hybrid-styling.webp",
        description: "Advanced hybrid piano with wooden-key action and premium digital features",
        keyFeatures: [
          "Grand Feel III wooden-key action",
          "Hybrid sensor technology for ultimate expression",
          "Premium Shigeru Kawai concert grand sounds",
          "Advanced Spatial Headphone Sound",
          "Professional recording capabilities",
          "Concert Performer mode"
        ]
      }
    ]
  },
  {
    name: "AnyTime Silent Series",
    description: "Acoustic grand and upright pianos with integrated silent practice systems. Experience the full acoustic piano performance with the ability to practice silently using headphones.",
    pianos: [
      {
        slug: "k-500-aures",
        name: "K-500 AURES",
        series: "AnyTime Silent Series",
        rating: 4.8,
        reviews: 28,
        image: "/images/banners/K500-AURES-styling.webp",
        description: "Silent acoustic upright piano with AnyTime technology",
        keyFeatures: [
          "51\" acoustic upright piano (130cm)",
          "Integrated AnyTime silent practice system",
          "Millennium III action with sensor technology",
          "Switch between acoustic and silent modes instantly",
          "Premium digital piano sounds for silent practice",
          "Professional acoustic upright when desired"
        ]
      },
      {
        slug: "gl-30-aures-2",
        name: "GL-30 AURES 2",
        series: "AnyTime Silent Series",
        rating: 4.7,
        reviews: 31,
        image: "/images/banners/GL30-AURES2-styling.webp",
        description: "Silent acoustic grand piano with advanced AnyTime technology",
        keyFeatures: [
          "5'5\" acoustic grand piano",
          "AnyTime AURES 2 silent practice system",
          "Professional action with sensor technology",
          "Dual-mode operation: acoustic and silent",
          "Enhanced digital sounds for practice",
          "Premium grand piano solution"
        ]
      }
    ]
  }
];

export default function HybridPianosPage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        category="Hybrid Pianos"
        title="Revolutionary Innovation"
        description="Experience groundbreaking instruments that combine authentic acoustic piano action with cutting-edge digital technology. Practice silently with headphones or enjoy full acoustic performance – the choice is yours."
        backgroundImage="/images/banners/NV10S-hybrid-styling.webp"
        stats={[
          { label: "Hybrid Models", value: "4" },
          { label: "Revolutionary Series", value: "2" },
          { label: "Silent Practice", value: "100%" }
        ]}
      />

      {/* Unified Series Browser with Carousel */}
      <UnifiedPianoSeries
        title="Explore Hybrid Piano Series"
        description="Experience groundbreaking instruments that seamlessly blend authentic acoustic piano action with cutting-edge digital technology."
        series={hybridPianoSeries}
        categorySlug="hybrid"
      />

      {/* Innovation Showcase */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-kawai-black to-kawai-neutral text-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The Future of Piano Technology
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-pearl/80 mb-12">
            Kawai hybrid pianos represent decades of innovation, combining traditional piano craftsmanship with cutting-edge digital technology for an unparalleled musical experience.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Authentic Touch</h3>
              <p className="text-kawai-pearl/80">
                Real acoustic piano actions and mechanisms provide the authentic feel musicians demand, with advanced sensor technology for digital integration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Silent Practice Mode</h3>
              <p className="text-kawai-pearl/80">
                Practice anytime with headphones while maintaining the authentic feel of an acoustic piano action mechanism.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Hybrid Technology</h3>
              <p className="text-kawai-pearl/80">
                Seamlessly switch between acoustic and digital modes, combining the best of both worlds in one remarkable instrument.
              </p>
            </div>
          </div>

          <a
            href="/technology/hybrid"
            className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/80 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Explore Hybrid Technology</span>
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
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            Best of Both Worlds
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Hybrid pianos offer unprecedented versatility, allowing you to enjoy authentic acoustic piano performance and silent digital practice in one remarkable instrument.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Acoustic Performance</h3>
              <p className="text-kawai-black/70">
                Experience the full richness and resonance of an acoustic piano with traditional soundboard, strings, and hammers when you want authentic acoustic sound.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Silent Practice</h3>
              <p className="text-kawai-black/70">
                Switch to silent mode for practice with headphones using premium digital sounds, recording capabilities, and educational features – perfect for any time of day.
              </p>
            </div>
          </div>

          <a
            href="#featured-products"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Discover Hybrid Models</span>
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
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            Experience Revolutionary Innovation
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Visit our showroom to experience the remarkable innovation of Kawai hybrid pianos. Feel the authentic action and discover the versatility that's changing the piano world.
          </p>
          
          <a
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Schedule Technology Demo</span>
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
      </section>
    </div>
  );
}