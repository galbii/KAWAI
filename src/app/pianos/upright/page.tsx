"use client";

import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";

// Featured upright pianos - highlighting the best from each series
const featuredUprightPianos = [
  {
    slug: "k-800",
    name: "K-800",
    series: "K Professional Series",
    rating: 5,
    reviews: 72,
    image: "/images/banners/K800-upright-styling.webp",
    description: "The ultimate professional upright with concert-quality performance",
    keyFeatures: [
      "51\" professional upright with exceptional projection",
      "Millennium III action preparation",
      "Extended length keys for grand piano feel",
      "Premium German Roslau strings",
      "Solid spruce soundboard construction",
      "Soft-close fallboard with hydraulic system"
    ]
  },
  {
    slug: "k-500",
    name: "K-500",
    series: "K Professional Series",
    rating: 4.8,
    reviews: 93,
    image: "/images/banners/K500-upright-styling.webp",
    description: "Versatile studio upright perfect for serious musicians and institutions",
    keyFeatures: [
      "45\" studio upright with powerful sound",
      "Enhanced action mechanism",
      "Extended length keys for improved control",
      "Quality German strings",
      "Solid construction throughout",
      "Professional-grade components"
    ]
  },
  {
    slug: "k-300",
    name: "K-300",
    series: "K Professional Series",
    rating: 4.6,
    reviews: 105,
    image: "/images/banners/K300-upright-styling.webp",
    description: "Professional home studio upright offering exceptional quality",
    keyFeatures: [
      "44\" home studio upright with warm tone",
      "Quality construction standards",
      "Extended length keys",
      "Premium materials selection",
      "Good tuning stability",
      "Attractive cabinet design"
    ]
  }
];

// Upright piano series with complete piano data for browsing
const uprightPianoSeries = [
  {
    name: "K Series Professional",
    description: "Professional upright pianos featuring advanced action technology, premium materials, and exceptional craftsmanship. From the flagship K-800 to the entry-level K-15 Continental, each model delivers professional performance. Named 'Acoustic Piano Line of the Year' four years running.",
    pianos: [
      {
        slug: "k-800",
        name: "K-800",
        series: "K Series Professional",
        rating: 5,
        reviews: 72,
        image: "/images/banners/K800-upright-styling.webp",
        description: "Top K Series model with ultimate professional performance (52\"/132cm)",
        keyFeatures: [
          "52\" professional upright with exceptional projection",
          "Millennium III action preparation",
          "Extended length keysticks for grand piano feel",
          "Premium German Roslau strings",
          "Tapered solid spruce soundboard",
          "Built in Japan - premium construction"
        ]
      },
      {
        slug: "k-500",
        name: "K-500",
        series: "K Series Professional",
        rating: 4.8,
        reviews: 93,
        image: "/images/banners/K500-upright-styling.webp",
        description: "Studio/advanced player model perfect for serious musicians (51\"/130cm)",
        keyFeatures: [
          "51\" studio upright with powerful sound",
          "Enhanced action mechanism",
          "Extended length keysticks for improved control",
          "Quality German strings",
          "Built in Japan - solid construction",
          "Professional-grade components"
        ]
      },
      {
        slug: "k-400",
        name: "K-400",
        series: "K Series Professional",
        rating: 4.7,
        reviews: 89,
        image: "/images/banners/K400-upright-styling.webp",
        description: "Professional upright with grand-style music rack (48\"/122cm)",
        keyFeatures: [
          "48\" professional upright with grand-style music rack",
          "Advanced action technology",
          "Extended length keysticks",
          "Premium materials selection",
          "Built in Japan quality",
          "Elegant cabinet design"
        ]
      },
      {
        slug: "k-300",
        name: "K-300",
        series: "K Series Professional",
        rating: 4.6,
        reviews: 105,
        image: "/images/banners/K300-upright-styling.webp",
        description: "4x Piano of the Year winner offering exceptional quality (48\"/122cm)",
        keyFeatures: [
          "48\" home studio upright with warm tone",
          "Piano of the Year winner (4 years running)",
          "Extended length keysticks",
          "Tapered solid spruce soundboard",
          "Built in Japan construction",
          "Attractive cabinet design"
        ]
      },
      {
        slug: "k-200",
        name: "K-200",
        series: "K Series Professional",
        rating: 4.4,
        reviews: 127,
        image: "/images/banners/K200-upright-styling.webp",
        description: "Redesigned 2014 model with excellent value (45\"/114cm)",
        keyFeatures: [
          "45\" redesigned upright (2014 model)",
          "Professional action mechanism",
          "Extended length keysticks",
          "Quality materials and construction",
          "Assembled in Indonesia - reliable quality",
          "Excellent beginner-to-intermediate choice"
        ]
      },
      {
        slug: "k-15-continental",
        name: "K-15 Continental",
        series: "K Series Professional",
        rating: 4.3,
        reviews: 94,
        image: "/images/banners/K15-Continental-styling.webp",
        description: "Entry professional model with Continental styling (43.3\"/110cm)",
        keyFeatures: [
          "43.3\" compact upright design",
          "Continental cabinet styling",
          "Professional entry-level features",
          "Extended length keysticks",
          "Assembled in Indonesia - good value",
          "Perfect for smaller spaces"
        ]
      }
    ]
  },
  {
    name: "ND Series",
    description: "Value-oriented professional upright pianos offering quality construction and performance at an accessible price point. Designed for students, schools, and home use.",
    pianos: [
      {
        slug: "nd-21",
        name: "ND-21",
        series: "ND Series",
        rating: 4.2,
        reviews: 76,
        image: "/images/banners/ND21-upright-styling.webp",
        description: "Value-oriented professional upright (48\"/121cm)",
        keyFeatures: [
          "48\" value-oriented professional upright",
          "Quality action mechanism",
          "Solid construction methods",
          "Reliable tuning stability",
          "Excellent educational choice",
          "Affordable professional quality"
        ]
      }
    ]
  },
  {
    name: "Master Series",
    description: "Kawai's highest-tier acoustic uprights when released. Three new models previewed at NAMM 2025 representing the pinnacle of upright piano innovation and craftsmanship.",
    pianos: [
      {
        slug: "master-series-model-1",
        name: "Master Series Model 1",
        series: "Master Series",
        rating: 5,
        reviews: 2,
        image: "/images/banners/Master-Series-1-styling.webp",
        description: "Premium Master Series upright (details TBA)",
        keyFeatures: [
          "Highest-tier acoustic upright construction",
          "Advanced materials and technology",
          "Premium craftsmanship throughout",
          "Professional performance capability",
          "2025 release - details to be announced",
          "NAMM 2025 preview model"
        ]
      },
      {
        slug: "master-series-model-2",
        name: "Master Series Model 2",
        series: "Master Series",
        rating: 5,
        reviews: 1,
        image: "/images/banners/Master-Series-2-styling.webp",
        description: "Advanced Master Series upright (details TBA)",
        keyFeatures: [
          "Highest-tier acoustic upright design",
          "Innovative action technology",
          "Premium materials selection",
          "Professional grade construction",
          "2025 release - specifications TBA",
          "NAMM 2025 preview model"
        ]
      },
      {
        slug: "master-series-model-3",
        name: "Master Series Model 3",
        series: "Master Series",
        rating: 5,
        reviews: 1,
        image: "/images/banners/Master-Series-3-styling.webp",
        description: "Elite Master Series upright (details TBA)",
        keyFeatures: [
          "Elite acoustic upright construction",
          "Advanced engineering features",
          "Premium quality throughout",
          "Professional performance standard",
          "2025 release - details forthcoming",
          "NAMM 2025 preview model"
        ]
      }
    ]
  }
];

export default function UprightPianosPage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        category="Upright Pianos"
        title="Professional Performance"
        description="Experience the perfect balance of space efficiency and professional performance. Our K Professional Series and elegant Designer collections deliver exceptional touch, tone, and craftsmanship in a compact footprint."
        backgroundImage="/images/banners/K800-upright-styling.webp"
        stats={[
          { label: "Upright Models", value: "10" },
          { label: "Height Range", value: "43\" - 52\"" },
          { label: "Distinct Series", value: "3" }
        ]}
      />

      {/* Unified Series Browser with Carousel */}
      <UnifiedPianoSeries
        title="Explore Upright Piano Series"
        description="Find the perfect balance of space efficiency and professional performance across our distinguished upright piano families."
        series={uprightPianoSeries}
        categorySlug="upright"
      />

      {/* Benefits Showcase */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-kawai-black to-kawai-neutral text-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Space-Efficient Excellence
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-pearl/80 mb-12">
            Kawai upright pianos deliver professional performance in a compact design, featuring advanced technologies and premium materials typically found in grand pianos.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Extended Length Keys</h3>
              <p className="text-kawai-pearl/80">
                Longer keys provide better leverage and control, delivering a playing experience closer to grand piano touch and responsiveness.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Millennium III Prep</h3>
              <p className="text-kawai-pearl/80">
                Select models feature Millennium III action preparation with advanced materials for enhanced responsiveness and durability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Space Efficient Design</h3>
              <p className="text-kawai-pearl/80">
                Compact footprint allows placement in smaller spaces while maintaining full 88-key performance and professional sound quality.
              </p>
            </div>
          </div>

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
      </section>

      {/* Perfect Settings Section */}
      <section className="py-16 lg:py-24 bg-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            Perfect for Every Setting
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Kawai upright pianos are ideal for homes, studios, schools, and institutions where space is at a premium but professional performance is essential.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Home Practice</h3>
              <p className="text-kawai-black/70">
                Perfect for home musicians who want professional quality in a compact footprint that fits comfortably in living spaces.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Educational Institutions</h3>
              <p className="text-kawai-black/70">
                Ideal for music schools, universities, and practice rooms where space efficiency and reliability are crucial for daily use.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Professional Studios</h3>
              <p className="text-kawai-black/70">
                Excellent for recording studios and teaching studios where professional sound quality is needed in a space-conscious design.
              </p>
            </div>
          </div>

          <a
            href="#featured-products"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Find Your Perfect Size</span>
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
            Experience Upright Excellence
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Visit our showroom to experience the touch, tone, and compact elegance of Kawai upright pianos. Our specialists will help you find the perfect model for your space and musical needs.
          </p>
          
          <a
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Schedule Showroom Visit</span>
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