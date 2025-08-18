"use client";

import { CategoryHero } from "@/components/piano/category-hero";
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series";

// Featured grand pianos - highlighting the best from each series
const featuredGrandPianos = [
  {
    slug: "gx-6-blak",
    name: "GX-6 BLAK",
    series: "GX BLAK Performance Series",
    rating: 5,
    reviews: 38,
    image: "/images/banners/SK-EX-grand-styling.webp",
    description: "Professional grand offering concert-quality performance with carbon fiber technology",
    keyFeatures: [
      "6'7\" grand with rich, powerful tone",
      "Millennium III action technology with carbon fiber",
      "NEOTEX synthetic ivory key tops",
      "Advanced composite materials",
      "Premium German strings",
      "Soft-close fallboard system"
    ]
  },
  {
    slug: "gl-50",
    name: "GL-50",
    series: "GL Traditional Series",
    rating: 4.8,
    reviews: 67,
    image: "/images/banners/GL-50-grand-styling.webp",
    description: "Premium traditional grand with refined touch and tone for discerning musicians",
    keyFeatures: [
      "6'2\" grand with classic voicing",
      "Traditional hammer felt construction",
      "Solid spruce soundboard",
      "Premium key weighting",
      "Classic cabinet styling",
      "Time-tested construction methods"
    ]
  },
  {
    slug: "gx-3-blak",
    name: "GX-3 BLAK",
    series: "GX BLAK Performance Series", 
    rating: 4.9,
    reviews: 47,
    image: "/images/banners/GX-3-BLAK-styling.webp",
    description: "Compact professional grand with full-size performance and advanced technology",
    keyFeatures: [
      "5'11\" grand with remarkable projection",
      "Advanced Millennium III action with carbon fiber",
      "Carbon fiber reinforced components",
      "NEOTEX key covering",
      "Optimized string scaling",
      "Premium cabinet finishes"
    ]
  }
];

// Grand piano series with complete piano data for browsing
const grandPianoSeries = [
  {
    name: "Shigeru Kawai SK Series",
    description: "Hand-built masterpieces representing the pinnacle of piano craftsmanship. Each instrument is meticulously crafted by master technicians for the world's most demanding musicians. Under 20 SK-EX models made annually.",
    pianos: [
      {
        slug: "sk-ex",
        name: "SK-EX",
        series: "Shigeru Kawai SK Series",
        rating: 5,
        reviews: 12,
        image: "/images/banners/SK-EX-grand-styling.webp",
        description: "Concert grand masterpiece hand-built by master craftsmen (9'1\")",
        keyFeatures: [
          "9'1\" concert grand with extraordinary projection",
          "Hand-built by Shigeru Kawai master craftsmen",
          "Premium Ezo spruce soundboard",
          "Millennium III Konsei Katagi action",
          "Under 20 made annually worldwide",
          "Concert hall performance capability"
        ]
      },
      {
        slug: "sk-7",
        name: "SK-7",
        series: "Shigeru Kawai SK Series",
        rating: 5,
        reviews: 8,
        image: "/images/banners/SK-7-grand-styling.webp",
        description: "Semi-concert grand with hand-crafted excellence (7'6\")",
        keyFeatures: [
          "7'6\" semi-concert grand",
          "Hand-selected premium materials",
          "Millennium III Konsei Katagi action",
          "Tapered soundboard design",
          "Master craftsman construction",
          "Professional recording standard"
        ]
      },
      {
        slug: "sk-6",
        name: "SK-6",
        series: "Shigeru Kawai SK Series",
        rating: 4.9,
        reviews: 15,
        image: "/images/banners/SK-6-grand-styling.webp",
        description: "Orchestra grand with Shigeru Kawai craftsmanship (7'0\" - 842 lbs)",
        keyFeatures: [
          "7'0\" orchestra grand piano (842 lbs)",
          "Hand-built construction techniques",
          "Premium Ezo spruce soundboard",
          "Millennium III action preparation",
          "Exceptional tonal clarity",
          "Professional performance"
        ]
      },
      {
        slug: "sk-5",
        name: "SK-5",
        series: "Shigeru Kawai SK Series",
        rating: 4.9,
        reviews: 11,
        image: "/images/banners/SK-5-grand-styling.webp",
        description: "Chamber grand with premium handcrafted construction (6'7\" - 774 lbs)",
        keyFeatures: [
          "6'7\" chamber grand (774 lbs)",
          "Handcrafted Shigeru Kawai quality",
          "Premium materials throughout",
          "Millennium III action",
          "Exceptional touch and tone",
          "Chamber music excellence"
        ]
      },
      {
        slug: "sk-3l",
        name: "SK-3L",
        series: "Shigeru Kawai SK Series",
        rating: 4.8,
        reviews: 9,
        image: "/images/banners/SK-3L-grand-styling.webp",
        description: "Handcrafted semi-concert grand (6'2\")",
        keyFeatures: [
          "6'2\" handcrafted semi-concert grand",
          "Shigeru Kawai premium construction",
          "Hand-selected materials",
          "Professional action preparation",
          "Studio and performance use",
          "Exceptional craftsmanship"
        ]
      },
      {
        slug: "sk-2l",
        name: "SK-2L",
        series: "Shigeru Kawai SK Series",
        rating: 4.7,
        reviews: 7,
        image: "/images/banners/SK-2L-grand-styling.webp",
        description: "Handcrafted semi-concert grand (5'11\")",
        keyFeatures: [
          "5'11\" handcrafted semi-concert grand",
          "Shigeru Kawai quality construction",
          "Premium materials selection",
          "Professional touch and tone",
          "Home and studio suitable",
          "Master craftsman built"
        ]
      }
    ]
  },
  {
    name: "GX Series",
    description: "Professional performance grand pianos featuring advanced technology, Millennium III action, and premium components. Designed for concert halls, recording studios, and serious musicians.",
    pianos: [
      {
        slug: "gx-7",
        name: "GX-7",
        series: "GX Series",
        rating: 5,
        reviews: 22,
        image: "/images/banners/GX-7-grand-styling.webp",
        description: "Concert-sized model with professional performance capability",
        keyFeatures: [
          "Concert-sized grand piano",
          "Millennium III action technology",
          "Professional performance features",
          "Advanced materials",
          "Concert hall suitable",
          "Premium construction"
        ]
      },
      {
        slug: "gx-6",
        name: "GX-6",
        series: "GX Series",
        rating: 4.9,
        reviews: 31,
        image: "/images/banners/GX-6-grand-styling.webp",
        description: "Professional concert model (7'0\")",
        keyFeatures: [
          "7'0\" professional concert model",
          "Millennium III action with carbon fiber",
          "NEOTEX synthetic ivory key tops",
          "Advanced composite materials",
          "Professional performance",
          "Concert quality sound"
        ]
      },
      {
        slug: "gx-5",
        name: "GX-5",
        series: "GX Series",
        rating: 4.8,
        reviews: 28,
        image: "/images/banners/GX-5-grand-styling.webp",
        description: "Chamber grand from GX BLAK Series (6'7\")",
        keyFeatures: [
          "6'7\" chamber grand",
          "GX BLAK Series heritage",
          "Advanced action technology",
          "Professional grade materials",
          "Exceptional projection",
          "Studio and performance use"
        ]
      },
      {
        slug: "gx-3",
        name: "GX-3",
        series: "GX Series",
        rating: 4.8,
        reviews: 47,
        image: "/images/banners/GX-3-grand-styling.webp",
        description: "Professional grand with advanced technology (6'2\")",
        keyFeatures: [
          "6'2\" professional grand",
          "Millennium III action technology",
          "Advanced materials",
          "Professional sound quality",
          "Studio and home suitable",
          "Premium construction"
        ]
      },
      {
        slug: "gx-2-limited",
        name: "GX-2 Limited Edition",
        series: "GX Series",
        rating: 5,
        reviews: 8,
        image: "/images/banners/GX-2-Limited-styling.webp",
        description: "60th Anniversary with hand-painted Urushi lacquering (5'11\")",
        keyFeatures: [
          "5'11\" limited edition grand",
          "Hand-painted Urushi lacquering",
          "60th Anniversary commemoration",
          "Premium craftsmanship",
          "Collector's instrument",
          "Exceptional beauty and sound"
        ]
      },
      {
        slug: "gx-2",
        name: "GX-2",
        series: "GX Series",
        rating: 4.7,
        reviews: 52,
        image: "/images/banners/GX-2-grand-styling.webp",
        description: "Professional grand perfect for home and studio (5'11\")",
        keyFeatures: [
          "5'11\" professional grand",
          "Millennium III action",
          "Premium materials",
          "Professional sound quality",
          "Home and studio friendly",
          "Reliable performance"
        ]
      },
      {
        slug: "gx-1",
        name: "GX-1",
        series: "GX Series",
        rating: 4.6,
        reviews: 63,
        image: "/images/banners/GX-1-grand-styling.webp",
        description: "Compact professional grand (5'5\")",
        keyFeatures: [
          "5'5\" compact professional grand",
          "Professional action technology",
          "Quality materials",
          "Space-efficient design",
          "Professional performance",
          "Excellent value"
        ]
      }
    ]
  },
  {
    name: "GL Series",
    description: "Classic grand pianos offering exceptional quality and traditional craftsmanship. Time-tested designs with premium materials for authentic acoustic piano experience.",
    pianos: [
      {
        slug: "gl-50",
        name: "GL-50",
        series: "GL Series",
        rating: 4.8,
        reviews: 67,
        image: "/images/banners/GL-50-grand-styling.webp",
        description: "Classic series model with refined touch and tone",
        keyFeatures: [
          "Classic grand design",
          "Traditional hammer felt construction",
          "Solid spruce soundboard",
          "Premium key weighting",
          "Classic cabinet styling",
          "Time-tested construction methods"
        ]
      },
      {
        slug: "gl-40",
        name: "GL-40",
        series: "GL Series",
        rating: 4.7,
        reviews: 84,
        image: "/images/banners/GL-40-grand-styling.webp",
        description: "Classic grand piano with traditional design (5'11\")",
        keyFeatures: [
          "5'11\" traditional grand design",
          "Classic action mechanism",
          "Solid spruce soundboard",
          "Traditional cabinet finishes",
          "Reliable tuning stability",
          "Home and studio suitable"
        ]
      },
      {
        slug: "gl-30",
        name: "GL-30",
        series: "GL Series",
        rating: 4.6,
        reviews: 73,
        image: "/images/banners/GL-30-grand-styling.webp",
        description: "Compact traditional grand perfect for smaller spaces (5'5\")",
        keyFeatures: [
          "5'5\" compact grand piano",
          "Traditional construction methods",
          "Quality soundboard materials",
          "Classic design aesthetics",
          "Space-efficient footprint",
          "Excellent value proposition"
        ]
      },
      {
        slug: "gl-20",
        name: "GL-20",
        series: "GL Series",
        rating: 4.5,
        reviews: 91,
        image: "/images/banners/GL-20-grand-styling.webp",
        description: "Entry-level grand with quality construction (5'2\")",
        keyFeatures: [
          "5'2\" entry-level grand",
          "Quality construction standards",
          "Solid materials",
          "Traditional design",
          "Affordable grand piano option",
          "Home-friendly size"
        ]
      },
      {
        slug: "gl-10",
        name: "GL-10",
        series: "GL Series",
        rating: 4.4,
        reviews: 108,
        image: "/images/banners/GL-10-grand-styling.webp",
        description: "Compact grand piano perfect for home use (5'0\")",
        keyFeatures: [
          "5'0\" compact grand piano",
          "Quality entry-level construction",
          "Traditional piano design",
          "Space-efficient footprint",
          "Excellent beginner grand",
          "Affordable price point"
        ]
      }
    ]
  },
  {
    name: "Crystal Series",
    description: "Exclusive crystal grand pianos handmade with only 3 units produced annually. A masterpiece of craftsmanship and artistic beauty combining traditional piano excellence with unique crystal aesthetics.",
    pianos: [
      {
        slug: "cr-45",
        name: "CR-45",
        series: "Crystal Series",
        rating: 5,
        reviews: 3,
        image: "/images/banners/CR-45-crystal-styling.webp",
        description: "Crystal grand piano with only 3 units produced annually (6'1\")",
        keyFeatures: [
          "6'1\" crystal grand piano",
          "Only 3 units produced annually",
          "Handmade construction",
          "Unique crystal aesthetics",
          "Premium materials throughout",
          "Collector's masterpiece"
        ]
      }
    ]
  },
  {
    name: "Concert Series",
    description: "Flagship concert instruments designed for the world's most prestigious concert halls and professional venues. The ultimate expression of Kawai's piano-making expertise.",
    pianos: [
      {
        slug: "ex-concert",
        name: "EX Concert Grand",
        series: "Concert Series",
        rating: 5,
        reviews: 5,
        image: "/images/banners/EX-Concert-styling.webp",
        description: "Flagship concert instrument for world-class venues",
        keyFeatures: [
          "Full concert grand size",
          "Flagship concert instrument",
          "World-class performance capability",
          "Premium construction throughout",
          "Concert hall projection",
          "Professional artist choice"
        ]
      }
    ]
  }
];

export default function GrandPianosPage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        category="Grand Pianos"
        title="Professional Excellence"
        description="From the innovative GX BLAK Performance Series with carbon fiber technology to the hand-crafted Shigeru Kawai masterpieces, discover grand pianos that represent the pinnacle of musical achievement."
        backgroundImage="/images/banners/SK-EX-grand-styling.webp"
        stats={[
          { label: "Piano Series", value: "5" },
          { label: "Grand Models", value: "19" },
          { label: "Master Craftsmen", value: "30+" }
        ]}
      />

      {/* Unified Series Browser with Carousel */}
      <UnifiedPianoSeries
        title="Explore Grand Piano Series"
        description="Discover our prestigious collection of grand piano series. From hand-crafted masterpieces to performance instruments, explore the pinnacle of piano craftsmanship."
        series={grandPianoSeries}
        categorySlug="grand"
      />

      {/* Craftsmanship Showcase */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-kawai-black to-kawai-neutral text-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Uncompromising Craftsmanship
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-pearl/80 mb-12">
            Every Kawai grand piano embodies our commitment to excellence, combining traditional Japanese craftsmanship with innovative materials and techniques.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Millennium III Action</h3>
              <p className="text-kawai-pearl/80">
                Advanced action technology featuring carbon fiber components for exceptional responsiveness and durability in professional performance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">NEOTEX Key Surface</h3>
              <p className="text-kawai-pearl/80">
                Premium synthetic ivory key surface provides enhanced grip and control while being more durable and consistent than natural materials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-1.5v1H6.5V1H5v1H4.5C3.11 2 2 3.11 2 4.5v15C2 20.89 3.11 22 4.5 22h15c1.39 0 2.5-1.11 2.5-2.5v-15C22 3.11 20.89 2 19.5 2zM20 19.5c0 .28-.22.5-.5.5h-15c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h15c.28 0 .5.22.5.5v15z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-kawai-red">Premium Soundboards</h3>
              <p className="text-kawai-pearl/80">
                Carefully selected solid spruce soundboards are aged and crafted to provide optimal resonance and tonal projection for concert-quality performance.
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

      {/* Heritage Section */}
      <section className="py-16 lg:py-24 bg-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            95 Years of Innovation
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Since 1927, Kawai has been at the forefront of piano innovation, creating instruments that inspire musicians and define excellence in concert halls worldwide.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-kawai-red mb-4">1927</div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Founded</h3>
              <p className="text-kawai-black/70">
                Koichi Kawai established our company with a vision to create pianos that would inspire musicians worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-kawai-red mb-4">50+</div>
              <h3 className="text-2xl font-bold text-kawai-black mb-3">Countries</h3>
              <p className="text-kawai-black/70">
                Kawai grand pianos are trusted by musicians and institutions in over 50 countries around the world.
              </p>
            </div>
          </div>

          <a
            href="/about"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Our Heritage</span>
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
            Experience Concert Excellence
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            Visit our showroom to experience the touch, tone, and craftsmanship of Kawai grand pianos. Our specialists will help you find the perfect instrument for your musical aspirations.
          </p>
          
          <a
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>Schedule Private Audition</span>
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