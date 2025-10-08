/**
 * ES60 Slide Content Configuration
 *
 * Centralized content for SEO optimization and easy editing.
 * All copy is optimized for target keywords:
 * - "best beginner digital piano"
 * - "affordable digital piano"
 * - "digital piano under $500"
 */

export const slideContent = {
  opening: {
    tagline: {
      main: "Concert Grand Sound Made Affordable",
      sub: ""
    },
    price: "Only $799",
    subtitle: "Professional sound quality for students, adult learners, and everyone starting their musical journey",
    scrollHint: "Scroll to explore"
  },

  heritage: {
    sectionLabel: "Heritage",
    title: {
      line1: "Premium Sound,",
      line2: "Beginner Price",
      line3: ""
    },
    skex: {
      label: "Shigeru Kawai",
      sublabel: "SK-EX Concert Grand"
    },
    samples: {
      label: "Premium Samples",
      sublabel: "Studio Recorded"
    },
    description: {
      main: "Every note in the ES60 contains the soul of our legendary Shigeru Kawai SK-EX concert grand—the same piano trusted by concert halls worldwide.",
      emphasis: "Now accessible to beginners and students at just $799"
    }
  },

  transformation: {
    sectionLabel: "Innovation",
    title: {
      line1: "Perfect for",
      line2: "Beginners & Students",
      line3: ""
    },
    leftContent: {
      heading: "Everything Beginners Need",
      weight: {
        value: "24 lbs",
        label: "Ultra Portable - Perfect for Apartments"
      },
      headphones: "Dual Headphones for Silent Practice",
      polyphony: {
        value: "192",
        label: "Note Polyphony - Never Miss a Note"
      },
      priceSection: {
        lead: "Professional features that won't break the bank",
        price: "Just $799"
      }
    }
  },

  experience: {
    sectionLabel: "Experience",
    title: {
      line1: "Why Beginners",
      line2: "Choose ES60",
      line3: ""
    },
    demos: [
      {
        title: "Real Piano Feel",
        icon: "🎹",
        description: "88-Key Responsive Hammer Lite Action",
        detail: "Authentic weighted keys teach proper technique from day one - essential for serious learning"
      },
      {
        title: "Concert Grand Sound",
        icon: "🎼",
        description: "Shigeru Kawai SK-EX Samples",
        detail: "The best piano sound quality under $500 - verified by professional reviewers and educators"
      },
      {
        title: "Silent Practice Anytime",
        icon: "🎧",
        description: "Dual Headphone Outputs",
        detail: "Perfect for apartments, dorms, and late-night practice - ideal for students and adult learners"
      }
    ],
    specs: [
      { value: "88", label: "Weighted Keys" },
      { value: "192", label: "Note Polyphony" },
      { value: "17", label: "Quality Voices" },
      { value: "24", label: "Pounds" }
    ],
    bottomMessage: "The perfect affordable digital piano for beginners who want professional results"
  },

  finale: {
    title: {
      line1: "Your Musical",
      line2: "Journey Starts",
      line3: "Here"
    },
    trustSignals: [
      { icon: "Award", label: "Award Winning Sound Quality" },
      { icon: "Star", label: "95+ Years of Excellence" },
      { icon: "Music", label: "Concert Grand Quality" }
    ],
    primaryCTA: {
      text: "Get Your ES60 Today",
      link: "/contact?product=es60&action=purchase",
      subtitle: "Best beginner digital piano. Professional sound. Unbeatable value at $799."
    },
    secondaryCTAs: [
      { text: "Schedule Demo", link: "/contact?product=es60&action=demo" },
      { text: "Learn More", link: "/es60" }
    ],
    valueReminder: [
      { value: "$799", label: "Concert Grand Sound" },
      { value: "24 lbs", label: "Ultra Portable" },
      { value: "∞", label: "Musical Possibilities" }
    ]
  }
} as const;

/**
 * SEO-focused feature highlights
 * Used across multiple slides for consistency
 */
export const features = {
  beginnerFriendly: [
    "Authentic 88 weighted keys for proper technique development",
    "Intuitive controls perfect for first-time piano players",
    "Included sustain pedal and instructional resources",
    "Compatible with popular learning apps via USB-MIDI"
  ],

  affordable: [
    "Professional Shigeru Kawai SK-EX concert grand sampling at entry-level price",
    "Best sound quality under $500 according to professional reviewers",
    "No compromise on essential features despite affordable pricing",
    "Incredible value - features typically found in pianos costing $1000+"
  ],

  studentFocused: [
    "Ultra-portable 24 lb design for students moving between locations",
    "Dual headphone jacks for silent practice in dorms and apartments",
    "Exceptional through-headphone sound quality for focused practice",
    "192-note polyphony ensures no dropped notes during complex passages"
  ],

  technical: [
    "Responsive Hammer Lite action with 57-gram downweight",
    "Harmonic Imaging technology for smooth dynamic transitions",
    "17 meticulously sampled instrument voices",
    "PianoRemote app integration for enhanced functionality",
    "Professional connectivity with dual 1/4\" stereo outputs"
  ]
} as const;

/**
 * Target audience messaging for different user personas
 */
export const audienceMessaging = {
  beginners: {
    headline: "Perfect First Piano",
    description: "Start your musical journey with professional sound quality that inspires practice and accelerates learning"
  },

  students: {
    headline: "Ideal for Music Students",
    description: "Portable, apartment-friendly, with authentic weighted action and concert grand sound quality teachers recommend"
  },

  adultLearners: {
    headline: "Never Too Late to Learn",
    description: "Professional features and authentic piano feel at a price that makes starting your musical journey affordable"
  },

  apartments: {
    headline: "Apartment-Friendly Excellence",
    description: "Silent practice capability with exceptional through-headphone sound quality, plus ultra-portable 24 lb design"
  }
} as const;
