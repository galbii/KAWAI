import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PianoFinder } from '@/components/piano/piano-finder'
import {
  FinderHero,
  HowToChooseSection,
  DecisionFactorsSection,
  PianoTypeComparison,
  UseCaseCards,
  FinderFAQSection,
  ConversionSection
} from '@/components/find-my-piano'

// ISR Configuration - Revalidate every 5 minutes
export const revalidate = 300

// SEO Metadata - Optimized for target keywords
export const metadata: Metadata = {
  title: 'Piano Finder - Find Your Perfect Kawai Piano in 7 Questions | Interactive Piano Selector Tool',
  description: 'Use our expert piano finder tool to discover the perfect Kawai piano for your needs, budget, space, and musical goals. Get personalized recommendations matched to your skill level and preferences. Find your ideal piano in just 7 questions.',
  keywords: [
    'piano finder',
    'find the right piano',
    'piano selection tool',
    'which piano should I buy',
    'piano buying guide',
    'how to choose a piano',
    'best piano for beginners',
    'piano for apartment',
    'warm vs bright piano',
    'wooden key action piano',
    'digital vs acoustic piano',
    'Kawai piano selector'
  ],
  openGraph: {
    title: 'Find Your Perfect Piano | Kawai Piano Finder Tool',
    description: 'Answer 7 quick questions to get personalized Kawai piano recommendations matched to your experience, budget, and musical goals.',
    url: 'https://kawai.com/find-my-piano',
    type: 'website',
    images: [
      {
        url: '/images/og/piano-finder-tool.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai Piano Finder - Interactive Piano Selection Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Perfect Piano | Kawai Piano Finder',
    description: 'Interactive tool helps you discover the ideal Kawai piano in 7 questions',
    images: ['/images/og/piano-finder-tool.jpg']
  },
  alternates: {
    canonical: 'https://kawai.com/find-my-piano'
  }
}

// Loading Skeletons for each section
function HeroSkeleton() {
  return (
    <section className="relative bg-gradient-to-b from-kawai-pearl to-white py-16 sm:py-20 lg:py-28 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <div className="h-4 bg-kawai-black/10 rounded w-48 mx-auto mb-6"></div>
          <div className="h-16 bg-kawai-black/10 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-24 bg-kawai-black/10 rounded w-full max-w-4xl mx-auto mb-8"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-14 bg-kawai-red/20 rounded-lg w-64"></div>
            <div className="h-14 bg-kawai-black/10 rounded-lg w-48"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuizSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="h-2 bg-gray-200 rounded-full mb-8"></div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="h-4 bg-kawai-black/10 rounded w-32 mx-auto mb-6"></div>
        <div className="h-12 bg-kawai-black/10 rounded w-2/3 mx-auto mb-12"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-kawai-black/5 rounded-xl"></div>
          <div className="h-64 bg-kawai-black/5 rounded-xl"></div>
        </div>
      </div>
    </section>
  )
}

// Main Page Content Component
async function FindMyPianoContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero with Value Proposition */}
      <FinderHero />

      {/* Section 2: Interactive Quiz Tool */}
      <section 
        id="quiz-tool" 
        className="py-16 sm:py-20 lg:py-24 bg-white scroll-mt-20"
        aria-labelledby="quiz-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
              Interactive Assessment
            </div>
            <h2 
              id="quiz-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-kawai-black mb-6"
            >
              Your Personalized Piano{" "}
              <span className="text-kawai-red">Recommendation</span>
            </h2>
            <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto">
              Answer 7 thoughtful questions about your musical journey, and we'll match you with 
              the perfect Kawai piano for your needs, budget, and goals.
            </p>
          </div>

          {/* Existing Quiz Tool */}
          <Suspense fallback={<QuizSkeleton />}>
            <PianoFinder />
          </Suspense>
        </div>
      </section>

      {/* Section 3: How to Choose Your Piano Guide (800 words) */}
      <HowToChooseSection />

      {/* Section 4: Key Decision Factors (1,200 words - 4 sections) */}
      <DecisionFactorsSection />

      {/* Section 5: Piano Type Comparison (800 words) */}
      <PianoTypeComparison />

      {/* Section 6: Popular Use Cases (600 words) */}
      <UseCaseCards />

      {/* Section 7: FAQ Section (500 words) */}
      <FinderFAQSection />

      {/* Section 8: Conversion & Next Steps (300 words) */}
      <ConversionSection />

      {/* Schema Markup - Quiz, HowTo, BreadcrumbList */}
      <QuizSchemaMarkup />
      <HowToSchemaMarkup />
      <BreadcrumbSchemaMarkup />
    </div>
  )
}

// Schema Markup Components
function QuizSchemaMarkup() {
  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": "https://kawai.com/find-my-piano#quiz",
    "name": "Kawai Piano Finder: Find Your Perfect Piano",
    "description": "Answer 7 questions to discover which Kawai piano matches your skill level, budget, space, and musical goals. Get personalized piano recommendations from 95+ years of piano expertise.",
    "educationalUse": "Assessment",
    "educationalLevel": "All levels - beginner to professional",
    "typicalAgeRange": "5-95",
    "timeRequired": "PT3M",
    "author": {
      "@type": "Organization",
      "@id": "https://kawai.com/#organization",
      "name": "Kawai Musical Instruments",
      "url": "https://kawai.com"
    },
    "hasPart": [
      {
        "@type": "Question",
        "position": 1,
        "eduQuestionType": "Multiple choice",
        "text": "What's your musical experience?",
        "acceptedAnswer": [
          { "@type": "Answer", "text": "Beginner", "position": 1 },
          { "@type": "Answer", "text": "Intermediate", "position": 2 },
          { "@type": "Answer", "text": "Advanced", "position": 3 },
          { "@type": "Answer", "text": "Professional", "position": 4 }
        ]
      },
      {
        "@type": "Question",
        "position": 2,
        "eduQuestionType": "Multiple choice",
        "text": "What's your budget range?",
        "acceptedAnswer": [
          { "@type": "Answer", "text": "Under $5,000" },
          { "@type": "Answer", "text": "$5,000 - $15,000" },
          { "@type": "Answer", "text": "$15,000 - $30,000" },
          { "@type": "Answer", "text": "$30,000+" },
          { "@type": "Answer", "text": "Flexible" }
        ]
      },
      {
        "@type": "Question",
        "position": 3,
        "eduQuestionType": "Multiple choice",
        "text": "Where will your piano live?",
        "acceptedAnswer": [
          { "@type": "Answer", "text": "Apartment/Condo" },
          { "@type": "Answer", "text": "Dedicated Home Room" },
          { "@type": "Answer", "text": "Music Studio/Room" },
          { "@type": "Answer", "text": "Performance Venue" }
        ]
      }
    ],
    "about": {
      "@type": "Thing",
      "name": "Piano Selection and Purchasing"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
    />
  )
}

function HowToSchemaMarkup() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Choose the Perfect Piano for Your Needs",
    "description": "A comprehensive step-by-step guide to selecting the right piano based on your experience level, budget, space, and musical goals.",
    "image": "https://kawai.com/images/guides/how-to-choose-piano.jpg",
    "totalTime": "PT5M",
    "supply": [
      { "@type": "HowToSupply", "name": "Budget planning" },
      { "@type": "HowToSupply", "name": "Space measurements" }
    ],
    "tool": [
      { "@type": "HowToTool", "name": "Kawai Piano Finder Tool" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Determine Your Experience Level",
        "text": "Consider whether you're a beginner, intermediate, advanced player, or professional. Your skill level determines the complexity and features you need.",
        "url": "https://kawai.com/find-my-piano#experience-level"
      },
      {
        "@type": "HowToStep",
        "name": "Set Your Budget Range",
        "text": "Define your budget range considering not just purchase price but total cost of ownership including delivery, tuning, and maintenance.",
        "url": "https://kawai.com/find-my-piano#budget"
      },
      {
        "@type": "HowToStep",
        "name": "Assess Your Space and Living Situation",
        "text": "Measure your available space and consider noise constraints, especially for apartment dwellers. Digital pianos offer volume control and headphone options.",
        "url": "https://kawai.com/find-my-piano#space"
      },
      {
        "@type": "HowToStep",
        "name": "Understand Sound Preferences",
        "text": "Learn about warm vs bright piano tones. Kawai pianos are known for warm, European-inspired tonal character preferred by classical musicians.",
        "url": "https://kawai.com/find-my-piano#sound"
      },
      {
        "@type": "HowToStep",
        "name": "Try Pianos in Person",
        "text": "Visit an authorized Kawai dealer to experience the touch and tone firsthand. Schedule a showroom visit to try your recommended pianos.",
        "url": "https://kawai.com/experience/schedule-visit"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
  )
}

function BreadcrumbSchemaMarkup() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kawai.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Piano Finder",
        "item": "https://kawai.com/find-my-piano"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}

// Main Page Export with Suspense Boundaries
export default function FindMyPianoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <HeroSkeleton />
          <QuizSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      }
    >
      <FindMyPianoContent />
    </Suspense>
  )
}
