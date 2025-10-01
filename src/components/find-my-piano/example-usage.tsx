/**
 * Example Usage: Piano Finder Page Integration
 *
 * This file demonstrates how to integrate the PianoTypeComparison and UseCaseCards
 * components into the main Piano Finder page (/find-my-piano).
 *
 * Copy this pattern to your actual page implementation.
 */

import { PianoTypeComparison, UseCaseCards } from '@/components/find-my-piano';

export default function PianoFinderPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section (your existing content) */}
      <section className="py-20 bg-kawai-black text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h1 className="text-6xl font-light font-serif mb-6">
            Find Your Perfect Piano
          </h1>
          <p className="text-2xl text-white/70 mb-12">
            Discover the ideal Kawai piano for your musical journey in 7 questions
          </p>
          {/* Quiz CTA */}
        </div>
      </section>

      {/* Interactive Quiz Section (your existing quiz tool) */}
      <section id="quiz" className="py-16 bg-white">
        {/* Your existing 7-question quiz component */}
      </section>

      {/* How to Choose Guide (Section 3 from strategy doc) */}
      <section className="py-20 bg-kawai-pearl">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl font-light font-serif text-center mb-12">
            How to Choose Your Piano
          </h2>
          {/* Quick-start decision framework content (~800 words) */}
        </div>
      </section>

      {/* Key Decision Factors (Section 4 from strategy doc) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* By Experience Level, Budget, Space, Sound sections (~1200 words) */}
        </div>
      </section>

      {/* SECTION 5: Piano Type Comparison */}
      <PianoTypeComparison />

      {/* SECTION 6: Use Case Cards */}
      <UseCaseCards />

      {/* FAQ Section (Section 7 from strategy doc) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* FAQ accordion with schema markup (~500 words) */}
        </div>
      </section>

      {/* Next Steps & Conversion (Section 8 from strategy doc) */}
      <section className="py-20 bg-kawai-pearl">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-5xl font-light font-serif mb-8">
            Ready to Find Your Piano?
          </h2>
          {/* Dealer locator, Calendly, Product browsing CTAs */}
        </div>
      </section>
    </main>
  );
}

/**
 * METADATA CONFIGURATION
 *
 * Add this to your page.tsx for SEO optimization:
 */

export const metadata = {
  title: 'Piano Finder - Find Your Perfect Kawai Piano | Interactive Tool',
  description: 'Use our expert piano finder to discover the perfect Kawai piano for your needs, budget, and goals. Get personalized recommendations in 7 questions. Compare grand, upright, digital, and hybrid pianos.',
  keywords: 'piano finder, find the right piano, piano selection tool, which piano should I buy, best piano for beginners, digital vs acoustic piano, piano buying guide',
  openGraph: {
    title: 'Find Your Perfect Piano in 7 Questions | Kawai Piano Finder',
    description: 'Interactive piano selection tool with expert guidance. Compare grand, upright, digital, and hybrid pianos. Get personalized Kawai piano recommendations.',
    type: 'website',
    url: 'https://kawai.com/find-my-piano',
    images: [
      {
        url: '/images/piano-finder-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai Piano Finder Tool'
      }
    ]
  }
};

/**
 * STRUCTURED DATA (Schema.org)
 *
 * Add this script tag to your page for rich snippets:
 */

const quizSchema = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": "Kawai Piano Finder Quiz",
  "description": "Interactive quiz to help you find the perfect Kawai piano for your needs, budget, and musical goals",
  "numberOfQuestions": 7,
  "educationalLevel": "Beginner to Professional",
  "educationalUse": "Piano Selection Guidance"
};

/**
 * ANALYTICS TRACKING
 *
 * Track user interactions for optimization:
 */

// Example analytics tracking functions (uncomment and use in your components)

/*
// Track section views
gtag('event', 'view_item', {
  event_category: 'Piano Finder',
  event_label: 'Piano Type Comparison',
  value: 1
});

// Track use case selection
gtag('event', 'select_content', {
  content_type: 'use_case',
  item_id: 'students_beginners'
});

// Track model click
gtag('event', 'select_item', {
  items: [{
    item_id: 'ES120',
    item_name: 'Kawai ES120',
    item_category: 'Digital Piano',
    item_category2: 'Beginner'
  }]
});
*/
