import { Suspense } from 'react';
import { SimplifiedCinematicPresentation } from './components/SimplifiedCinematicPresentation';
import { ES60SEOContent } from './components/ES60SEOContent';
import './components/scroll-cinematic.css';

// Metadata is handled by layout.tsx

// Cinematic Loading Component
function CinematicLoader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500/50 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Kawai Branding */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-red-500 tracking-wider animate-pulse">
            KAWAI
          </h1>
          <p className="text-white/70 text-lg">
            Preparing Cinematic Experience
          </p>
          <div className="flex justify-center items-center gap-2 text-white/50 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Concert Grand Sound</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>$799</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Helper
function NavigationHelper() {
  return (
    <div className="fixed top-4 left-4 z-40 max-w-sm">
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <p className="text-white text-sm">
          <a href="/" className="underline hover:text-red-400 transition-colors">
            ← Return to Homepage
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ES60CinematicPage() {
  return (
    <>
      {/* SEO-optimized content (hidden but crawlable) */}
      <ES60SEOContent />

      {/* Full-screen cinematic experience (now includes FAQ slide) */}
      <Suspense fallback={<CinematicLoader />}>
        <SimplifiedCinematicPresentation />
      </Suspense>

      {/* Preload critical assets for better performance */}
      <link rel="preload" href="/images/es60-hero.jpg" as="image" />

      {/* Schema.org Product structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Kawai ES60 Digital Piano",
            "model": "ES60",
            "category": "Digital Piano",
            "brand": {
              "@type": "Brand",
              "name": "Kawai"
            },
            "description": "The Kawai ES60 is the best affordable beginner digital piano featuring authentic Shigeru Kawai SK-EX concert grand sampling - the same professional sound found in pianos costing thousands more. With 88 weighted keys, 192-note polyphony, ultra-portable 24 lb design, and silent practice capability, it offers exceptional value for students, adult learners, and apartment dwellers. Professional reviewers rate it as having the best piano sound quality under $500.",
            "image": "https://kawaipianogallery.com/images/es60-hero.jpg",
            "offers": {
              "@type": "Offer",
              "price": "799",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2025-12-31",
              "url": "https://kawaipianogallery.com/canada-es60",
              "seller": {
                "@type": "Organization",
                "name": "Kawai Piano Gallery"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "reviewCount": "127"
            },
            "review": {
              "@type": "Review",
              "author": {
                "@type": "Organization",
                "name": "AZ Piano Reviews"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "reviewBody": "The Kawai ES60 delivers exceptional value with authentic Shigeru Kawai SK-EX concert grand sound quality typically found in pianos costing significantly more. Outstanding choice for beginners and students."
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Beginners, students, adult learners, apartment dwellers"
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Number of Keys",
                "value": "88 weighted keys"
              },
              {
                "@type": "PropertyValue",
                "name": "Key Action",
                "value": "Responsive Hammer Lite Action with 57g downweight"
              },
              {
                "@type": "PropertyValue",
                "name": "Polyphony",
                "value": "192 notes"
              },
              {
                "@type": "PropertyValue",
                "name": "Sound Source",
                "value": "Shigeru Kawai SK-EX concert grand samples"
              },
              {
                "@type": "PropertyValue",
                "name": "Weight",
                "value": "24 pounds (11 kg) - ultra portable"
              },
              {
                "@type": "PropertyValue",
                "name": "Headphone Outputs",
                "value": "2 (dual headphone jacks for silent practice)"
              },
              {
                "@type": "PropertyValue",
                "name": "Speakers",
                "value": "Dual 10W upward-facing speakers"
              },
              {
                "@type": "PropertyValue",
                "name": "Voices",
                "value": "17 meticulously sampled instrument voices"
              },
              {
                "@type": "PropertyValue",
                "name": "Connectivity",
                "value": "USB-MIDI, dual 1/4\" stereo outputs, PianoRemote app"
              },
              {
                "@type": "PropertyValue",
                "name": "Ideal For",
                "value": "Beginners, students, adult learners, apartment living, portable practice"
              },
              {
                "@type": "PropertyValue",
                "name": "Best For",
                "value": "Best affordable digital piano under $500 with professional sound quality"
              }
            ],
            "features": [
              "Shigeru Kawai SK-EX concert grand samples - same sound as premium models",
              "88-key Responsive Hammer Lite Action with authentic weighted feel",
              "192-note polyphony - never drop notes during complex passages",
              "Dual headphone outputs for silent practice anytime",
              "24 pounds ultra-portable design perfect for students",
              "Best affordable digital piano for beginners under $500",
              "Professional concert grand sound quality verified by reviewers",
              "Ideal for apartments, dorms, and shared living spaces",
              "Perfect for students and adult learners",
              "17 meticulously sampled high-quality voices",
              "PianoRemote app integration for enhanced functionality",
              "Exceptionally quiet key action for apartment-friendly practice"
            ]
          })
        }}
      />

      {/* Schema.org BreadcrumbList for better navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://kawaipianogallery.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Digital Pianos",
                "item": "https://kawaipianogallery.com/pianos/digital"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "ES60",
                "item": "https://kawaipianogallery.com/canada-es60"
              }
            ]
          })
        }}
      />

      {/* Schema.org FAQ structured data for SEO - Integrated Cinematic FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is the Kawai ES60 good for beginners?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. The ES60 is specifically designed as the best affordable digital piano for beginners. It features authentic 88 weighted keys with Responsive Hammer Lite action that teaches proper finger technique from day one - essential for developing good habits. The Shigeru Kawai SK-EX concert grand sampling provides professional sound quality that inspires practice and accelerates learning. With intuitive controls, dual headphone outputs for silent practice, and ultra-portable 24 lb design, it's perfect for students, adult learners, and anyone starting their piano journey. Professional music educators consistently recommend the ES60 for serious beginners who want authentic piano feel without the premium price."
                }
              },
              {
                "@type": "Question",
                "name": "Why is the ES60 so affordable compared to pianos with similar sound quality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The ES60's affordability comes from smart engineering, not compromised quality. Kawai focused on essential features that matter most for learning and playing, rather than adding excessive voice options or complex features. The Shigeru Kawai SK-EX concert grand sampling - the same professional sound engine found in Kawai's premium models costing thousands more - is now accessible at $799 through efficient manufacturing and strategic feature selection. You're getting authentic concert grand sound, 88 weighted keys, and 192-note polyphony without paying for features most beginners won't use. This makes it the best value in digital pianos under $1000."
                }
              },
              {
                "@type": "Question",
                "name": "Does the ES60 feel like a real piano?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The ES60's Responsive Hammer Lite (RHL) action provides authentic weighted key feel with 57-gram down-weight on middle C, closely approximating acoustic piano touch. The graded weighting means lower keys feel heavier and upper keys feel lighter - just like a real piano. This authentic feel is crucial for developing proper technique and building the muscle memory needed for serious piano playing."
                }
              },
              {
                "@type": "Question",
                "name": "Can I practice piano silently with the ES60?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely - this is one of the ES60's standout features for beginners and students. The dual headphone outputs let you practice completely silently at any time without disturbing family, roommates, or neighbors. Many users report the headphone experience as particularly exceptional, with professional reviewers calling the ES60's through-headphone sound quality the most realistic acoustic grand piano reproduction they have heard from a $500 digital piano. Perfect for late-night practice sessions, apartment living, dorms, and any situation where noise control matters."
                }
              },
              {
                "@type": "Question",
                "name": "Will I outgrow the ES60 as I improve?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not for many years of serious study. The ES60 provides professional-grade features that support players from complete beginner through advanced intermediate levels. The authentic Shigeru Kawai SK-EX concert grand sampling, 88 weighted keys with graded action, and 192-note polyphony are the same core features found in instruments used by advanced players and professionals. Many serious pianists keep an ES60 as a portable practice instrument even after acquiring premium models."
                }
              },
              {
                "@type": "Question",
                "name": "How portable is the ES60 for students?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Exceptionally portable - this is a major advantage for student life. At just 24 pounds (11kg), the ES60 is light enough to carry between dorm rooms, transport to lessons, move between apartments, or take to performances. Despite this ultra-portable weight, it maintains a full 88-key weighted action - no compromise on authentic piano feel. This portability combined with professional sound quality makes the ES60 ideal for the mobile lifestyle of modern students."
                }
              },
              {
                "@type": "Question",
                "name": "Does the ES60 work with piano learning apps?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes - the ES60 integrates seamlessly with modern learning technology. The USB connectivity enables MIDI connection to popular learning apps like Simply Piano, Flowkey, and Playground Sessions on smartphones, tablets, and computers. The included PianoRemote app provides comprehensive control and adds features like visual rhythm patterns and MIDI recording capability. This smart connectivity makes the ES60 compatible with virtually any modern learning method while maintaining the authentic acoustic piano experience."
                }
              },
              {
                "@type": "Question",
                "name": "Can adult learners use the ES60?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely - the ES60 is ideal for adult learners starting their piano journey. Adult learners particularly benefit from the authentic weighted key action that teaches proper technique from the start, the professional Shigeru Kawai SK-EX concert grand sound quality that makes practice enjoyable and inspiring, and the silent practice capability that fits busy adult schedules and shared living spaces. The $799 price point makes starting piano lessons accessible without a major financial commitment."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
