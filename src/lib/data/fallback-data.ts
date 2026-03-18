/**
 * Fallback data for Kawai Piano Website
 * 
 * This module contains comprehensive fallback data extracted from existing category pages,
 * organized by piano category and structured to match the Series interface used by 
 * UnifiedPianoSeries component and other frontend components.
 * 
 * Data is used when CMS data is unavailable, ensuring the website remains functional
 * and provides a complete user experience even without backend connectivity.
 * 
 * @module fallback-data
 * @version 1.0.0
 * @author KAWAI Piano Website - Data Extraction Agent
 */

import { PianoCategorySlug } from './categories';
import type { Media } from '@/payload-types';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Piano interface matching the UnifiedPianoSeries component expectations
 */
export interface FallbackPiano {
  slug: string;
  name: string;
  series: string;
  rating: number;
  reviews: number;
  image: string | Media;
  description: string;
  keyFeatures: string[];
}

/**
 * Series interface matching the UnifiedPianoSeries component expectations
 */
export interface FallbackSeries {
  name: string;
  description: string;
  highlight?: string | null;
  modelCount?: number;
  href?: string;
  pianos: FallbackPiano[];
  slides?: Array<{
    title: string;
    image: string | Media;
  }>;
}

/**
 * Category fallback data structure
 */
export interface CategoryFallbackData {
  series: FallbackSeries[];
  featuredPianos: FallbackPiano[];
  totalModels: number;
  lastUpdated: string;
}

// =============================================================================
// DIGITAL PIANOS FALLBACK DATA
// =============================================================================

const digitalPianosFallback: CategoryFallbackData = {
  series: [
    {
      name: "CA Series",
      description: "The pinnacle of digital piano technology, featuring Grand Feel III wooden-key action and premium Shigeru Kawai concert grand sounds. Professional instruments trusted by musicians worldwide.",
      modelCount: 3,
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
      modelCount: 2,
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
      modelCount: 1,
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
      modelCount: 2,
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
  ],
  featuredPianos: [
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
  ],
  totalModels: 8,
  lastUpdated: "2024-12-09"
};

// =============================================================================
// GRAND PIANOS FALLBACK DATA
// =============================================================================

const grandPianosFallback: CategoryFallbackData = {
  series: [
    {
      name: "Shigeru Kawai SK Series",
      description: "Hand-built masterpieces representing the pinnacle of piano craftsmanship. Each instrument is meticulously crafted by master technicians for the world's most demanding musicians. Under 20 SK-EX models made annually.",
      modelCount: 6,
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
      modelCount: 7,
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
      modelCount: 5,
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
      modelCount: 1,
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
      modelCount: 1,
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
  ],
  featuredPianos: [
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
  ],
  totalModels: 20,
  lastUpdated: "2024-12-09"
};

// =============================================================================
// HYBRID PIANOS FALLBACK DATA
// =============================================================================

const hybridPianosFallback: CategoryFallbackData = {
  series: [
    {
      name: "NOVUS Series",
      description: "Revolutionary hybrid pianos featuring real grand piano action with digital versatility. The world's first upright piano with authentic grand piano action mechanism and advanced digital technology.",
      modelCount: 2,
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
      modelCount: 2,
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
  ],
  featuredPianos: [
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
  ],
  totalModels: 4,
  lastUpdated: "2024-12-09"
};

// =============================================================================
// UPRIGHT PIANOS FALLBACK DATA
// =============================================================================

const uprightPianosFallback: CategoryFallbackData = {
  series: [
    {
      name: "K Series Professional",
      description: "Professional upright pianos featuring advanced action technology, premium materials, and exceptional craftsmanship. From the flagship K-800 to the entry-level K-15 Continental, each model delivers professional performance. Named 'Acoustic Piano Line of the Year' four years running.",
      modelCount: 6,
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
      modelCount: 1,
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
      modelCount: 3,
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
  ],
  featuredPianos: [
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
  ],
  totalModels: 10,
  lastUpdated: "2024-12-09"
};

// =============================================================================
// CONSOLIDATED FALLBACK DATA MAP
// =============================================================================

/**
 * Complete fallback data mapping for all piano categories
 */
const CATEGORY_FALLBACK_DATA: Record<PianoCategorySlug, CategoryFallbackData> = {
  digital: digitalPianosFallback,
  grand: grandPianosFallback,
  hybrid: hybridPianosFallback,
  upright: uprightPianosFallback,
  shigeru: grandPianosFallback,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Retrieves fallback data for a specific piano category
 * @param category - The piano category slug
 * @returns Complete fallback data for the category or null if invalid
 */
export function getCategoryFallbackData(category: string): CategoryFallbackData | null {
  if (!category || typeof category !== 'string') {
    return null;
  }

  const normalizedCategory = category.toLowerCase() as PianoCategorySlug;
  return CATEGORY_FALLBACK_DATA[normalizedCategory] || null;
}

/**
 * Retrieves fallback series data for a specific category
 * @param category - The piano category slug
 * @returns Array of series data or empty array if invalid
 */
export function getCategorySeriesFallback(category: string): FallbackSeries[] {
  const fallbackData = getCategoryFallbackData(category);
  return fallbackData?.series || [];
}

/**
 * Retrieves featured pianos fallback data for a specific category
 * @param category - The piano category slug
 * @returns Array of featured piano data or empty array if invalid
 */
export function getCategoryFeaturedPianosFallback(category: string): FallbackPiano[] {
  const fallbackData = getCategoryFallbackData(category);
  return fallbackData?.featuredPianos || [];
}

/**
 * Gets total model count for a category from fallback data
 * @param category - The piano category slug
 * @returns Number of total models or 0 if invalid
 */
export function getCategoryModelCount(category: string): number {
  const fallbackData = getCategoryFallbackData(category);
  return fallbackData?.totalModels || 0;
}

/**
 * Searches for pianos across all fallback data by name or features
 * @param searchTerm - Term to search for
 * @param category - Optional category to limit search to
 * @returns Array of matching pianos
 */
export function searchFallbackPianos(searchTerm: string, category?: string): FallbackPiano[] {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  const categoriesToSearch = category 
    ? [category] 
    : Object.keys(CATEGORY_FALLBACK_DATA);

  const results: FallbackPiano[] = [];

  categoriesToSearch.forEach(cat => {
    const fallbackData = getCategoryFallbackData(cat);
    if (!fallbackData) return;

    fallbackData.series.forEach(series => {
      series.pianos.forEach(piano => {
        const matches = 
          piano.name.toLowerCase().includes(term) ||
          piano.series.toLowerCase().includes(term) ||
          piano.description.toLowerCase().includes(term) ||
          piano.keyFeatures.some(feature => feature.toLowerCase().includes(term));

        if (matches) {
          results.push(piano);
        }
      });
    });
  });

  return results;
}

/**
 * Gets all available categories with fallback data
 * @returns Array of category slugs that have fallback data
 */
export function getAvailableFallbackCategories(): PianoCategorySlug[] {
  return Object.keys(CATEGORY_FALLBACK_DATA) as PianoCategorySlug[];
}

/**
 * Gets fallback statistics across all categories
 * @returns Object with overall fallback data statistics
 */
export function getFallbackDataStats() {
  const categories = getAvailableFallbackCategories();
  let totalModels = 0;
  let totalSeries = 0;
  let totalFeatured = 0;

  categories.forEach(category => {
    const data = getCategoryFallbackData(category);
    if (data) {
      totalModels += data.totalModels;
      totalSeries += data.series.length;
      totalFeatured += data.featuredPianos.length;
    }
  });

  return {
    totalCategories: categories.length,
    totalSeries,
    totalModels,
    totalFeatured,
    lastUpdated: "2024-12-09"
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

/**
 * This module exports:
 * 
 * TYPES:
 * - FallbackPiano: Piano interface for fallback data
 * - FallbackSeries: Series interface for fallback data  
 * - CategoryFallbackData: Complete category data structure
 * 
 * DATA RETRIEVAL FUNCTIONS:
 * - getCategoryFallbackData(): Get all fallback data for a category
 * - getCategorySeriesFallback(): Get series data for a category
 * - getCategoryFeaturedPianosFallback(): Get featured pianos for a category
 * - getCategoryModelCount(): Get total model count for a category
 * 
 * UTILITY FUNCTIONS:
 * - searchFallbackPianos(): Search pianos across fallback data
 * - getAvailableFallbackCategories(): Get categories with fallback data
 * - getFallbackDataStats(): Get overall fallback data statistics
 * 
 * The fallback data is comprehensive, clean, and structured to maintain
 * compatibility with existing component interfaces while providing a complete
 * user experience when CMS data is unavailable.
 */