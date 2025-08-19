/**
 * Default Product Lines data extracted from hardcoded series data
 * This data will be used to populate the Product Lines collection with initial content
 */

export const defaultProductLines = [
  // Digital Piano Series
  {
    name: "CA Series",
    slug: "ca-series", 
    category: "digital" as const,
    description: "The pinnacle of digital piano technology, featuring Grand Feel III wooden-key action and premium Shigeru Kawai concert grand sounds. Professional instruments trusted by musicians worldwide.",
    highlight: "Grand Feel III Action",
    featured: true,
    sortOrder: 1,
    slides: [
      {
        title: "Grand Feel III Action",
        // Will need to add actual image uploads via admin
      },
      {
        title: "Shigeru Kawai Sampling",
      },
      {
        title: "Professional Sound System",
      }
    ]
  },
  {
    name: "CN Series", 
    slug: "cn-series",
    category: "digital" as const,
    description: "Advanced digital pianos offering exceptional value with Responsive Hammer III action and Progressive Harmonic Imaging sound technology. Perfect for serious musicians and students.",
    highlight: "Responsive Hammer III Action",
    featured: true,
    sortOrder: 2,
    slides: [
      {
        title: "Responsive Touch",
      },
      {
        title: "Progressive Harmonic Imaging",
      },
      {
        title: "Compact Design",
      }
    ]
  },
  {
    name: "KDP Series",
    slug: "kdp-series", 
    category: "digital" as const,
    description: "Elegant console digital pianos with traditional furniture styling and authentic piano action. Designed to complement your home while delivering professional performance.",
    highlight: "Traditional Console Design",
    featured: false,
    sortOrder: 3,
    slides: [
      {
        title: "Furniture Styling",
      },
      {
        title: "Space Efficient",
      }
    ]
  },
  {
    name: "ES Series",
    slug: "es-series",
    category: "digital" as const, 
    description: "Professional portable digital pianos perfect for performing musicians. Lightweight designs with advanced action technology and premium sounds for studio and stage use.",
    highlight: "Professional Portable",
    featured: false,
    sortOrder: 4,
    slides: [
      {
        title: "Stage Ready",
      },
      {
        title: "Lightweight Design",
      },
      {
        title: "Professional Outputs",
      }
    ]
  },

  // Grand Piano Series
  {
    name: "Shigeru Kawai SK Series",
    slug: "shigeru-kawai-sk-series",
    category: "grand" as const,
    description: "Hand-built masterpieces representing the pinnacle of piano craftsmanship. Each instrument is meticulously crafted by master technicians for the world's most demanding musicians. Under 20 SK-EX models made annually.",
    highlight: "Hand-Built Masterpieces",
    featured: true,
    sortOrder: 1,
    slides: [
      {
        title: "Master Craftsmen",
      },
      {
        title: "Premium Materials",
      },
      {
        title: "Concert Hall Performance", 
      },
      {
        title: "Limited Production",
      }
    ]
  },
  {
    name: "GX Series",
    slug: "gx-series",
    category: "grand" as const,
    description: "Professional performance grand pianos featuring advanced technology, Millennium III action, and premium components. Designed for concert halls, recording studios, and serious musicians.",
    highlight: "Millennium III Action",
    featured: true,
    sortOrder: 2,
    slides: [
      {
        title: "Concert Technology",
      },
      {
        title: "Professional Performance",
      },
      {
        title: "Advanced Materials",
      }
    ]
  },
  {
    name: "GL Series", 
    slug: "gl-series",
    category: "grand" as const,
    description: "Classic grand pianos offering exceptional quality and traditional craftsmanship. Time-tested designs with premium materials for authentic acoustic piano experience.",
    highlight: "Traditional Craftsmanship",
    featured: false,
    sortOrder: 3,
    slides: [
      {
        title: "Classic Design",
      },
      {
        title: "Time-Tested Quality",
      },
      {
        title: "Traditional Methods",
      }
    ]
  },
  {
    name: "Crystal Series",
    slug: "crystal-series", 
    category: "grand" as const,
    description: "Exclusive crystal grand pianos handmade with only 3 units produced annually. A masterpiece of craftsmanship and artistic beauty combining traditional piano excellence with unique crystal aesthetics.",
    highlight: "Only 3 Made Annually",
    featured: true,
    sortOrder: 4,
    slides: [
      {
        title: "Crystal Aesthetics",
      },
      {
        title: "Artistic Masterpiece",
      },
      {
        title: "Ultra-Exclusive",
      }
    ]
  },

  // Upright Piano Series
  {
    name: "K Series Professional",
    slug: "k-series-professional",
    category: "upright" as const,
    description: "Professional upright pianos featuring advanced action technology, premium materials, and exceptional craftsmanship. From the flagship K-800 to the entry-level K-15 Continental, each model delivers professional performance. Named 'Acoustic Piano Line of the Year' four years running.",
    highlight: "Piano Line of the Year",
    featured: true,
    sortOrder: 1,
    slides: [
      {
        title: "Professional Performance",
      },
      {
        title: "Millennium III Action",
      },
      {
        title: "Built in Japan Quality",
      }
    ]
  },
  {
    name: "ND Series",
    slug: "nd-series",
    category: "upright" as const,
    description: "Value-oriented professional upright pianos offering quality construction and performance at an accessible price point. Designed for students, schools, and home use.",
    highlight: "Educational Excellence",
    featured: false,
    sortOrder: 2,
    slides: [
      {
        title: "Value-Oriented Quality",
      },
      {
        title: "Educational Choice",
      }
    ]
  },
  {
    name: "Master Series",
    slug: "master-series",
    category: "upright" as const,
    description: "Kawai's highest-tier acoustic uprights when released. Three new models previewed at NAMM 2025 representing the pinnacle of upright piano innovation and craftsmanship.",
    highlight: "Highest-Tier Acoustic",
    featured: true,
    sortOrder: 3,
    slides: [
      {
        title: "Ultimate Innovation",
      },
      {
        title: "NAMM 2025 Preview",
      },
      {
        title: "Pinnacle Craftsmanship",
      }
    ]
  },

  // Hybrid Piano Series
  {
    name: "NOVUS Series",
    slug: "novus-series",
    category: "hybrid" as const,
    description: "Revolutionary hybrid pianos featuring real grand piano action with digital versatility. The world's first upright piano with authentic grand piano action mechanism and advanced digital technology.",
    highlight: "World's First Hybrid",
    featured: true,
    sortOrder: 1,
    slides: [
      {
        title: "Revolutionary Design",
      },
      {
        title: "Real Grand Action",
      },
      {
        title: "Digital Versatility",
      }
    ]
  },
  {
    name: "AnyTime Silent Series",
    slug: "anytime-silent-series",
    category: "hybrid" as const,
    description: "Acoustic grand and upright pianos with integrated silent practice systems. Experience the full acoustic piano performance with the ability to practice silently using headphones.",
    highlight: "Silent Practice Technology",
    featured: true,
    sortOrder: 2,
    slides: [
      {
        title: "Acoustic Performance",
      },
      {
        title: "Silent Practice Mode",
      },
      {
        title: "Dual-Mode Operation",
      }
    ]
  }
];

/**
 * Seed function to populate the Product Lines collection
 * This can be called during development or via admin interface
 */
export async function seedProductLines() {
  console.log('Starting Product Lines seed...');
  
  for (const productLine of defaultProductLines) {
    try {
      // Note: In a real implementation, you would use the Payload local API here
      // const result = await payload.create({
      //   collection: 'productlines',
      //   data: productLine
      // });
      console.log(`Would create: ${productLine.name}`);
    } catch (error) {
      console.error(`Failed to create ${productLine.name}:`, error);
    }
  }
  
  console.log('Product Lines seed completed!');
}

/**
 * Helper function to generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}