import { Metadata } from 'next';
import { Suspense } from 'react';
import { EnhancedCinematicPresentation } from '../components';
import '../components/cinematic-animations.css';
import '../components/enhanced-interactions.css';

export const metadata: Metadata = {
  title: 'Kawai ES60 Cinematic Experience | Concert Grand Heritage Revealed',
  description: 'Experience the revolutionary ES60 digital piano through an immersive cinematic presentation. Discover how concert grand heritage meets modern innovation at just $499.',
  keywords: 'Kawai ES60 cinematic, digital piano experience, interactive presentation, Shigeru Kawai SK-EX, concert grand transformation, premium piano demo',
  openGraph: {
    title: 'ES60 Cinematic Experience | Concert Grand Sound. $499.',
    description: 'Enter the revolutionary world of the ES60 through an immersive visual storytelling experience that reveals the magic behind concert grand sound.',
    type: 'website',
    images: [
      {
        url: '/images/es60-cinematic-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai ES60 Cinematic Experience'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/es60/cinematic'
  }
};

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
            <span>$499</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Warning for Low-End Devices
function PerformanceNotice() {
  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      <div className="bg-black/80 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4 text-yellow-300">
        <p className="text-sm">
          <strong>Performance Mode:</strong> This cinematic experience is optimized for modern devices. 
          <a href="/es60" className="underline hover:text-yellow-200 ml-1">
            View standard version
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ES60CinematicPage() {
  return (
    <>
      {/* Full-screen cinematic experience */}
      <main className="min-h-screen overflow-hidden">
        <Suspense fallback={<CinematicLoader />}>
          <EnhancedCinematicPresentation />
        </Suspense>
      </main>

      {/* Performance notice for compatibility */}
      <PerformanceNotice />

      {/* Preload critical assets */}
      <link rel="preload" href="/audio/es60-ambient.mp3" as="audio" type="audio/mpeg" />
      <link rel="preload" href="/images/es60-hero.jpg" as="image" />
      
      {/* Schema.org structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Kawai ES60 Digital Piano",
            "brand": {
              "@type": "Brand",
              "name": "Kawai"
            },
            "description": "Professional digital piano with Shigeru Kawai SK-EX concert grand samples, 88-key weighted action, and portable design.",
            "offers": {
              "@type": "Offer",
              "price": "499",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Kawai Piano Gallery"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            },
            "features": [
              "Shigeru Kawai SK-EX concert grand samples",
              "88-key Responsive Hammer Compact II Action",
              "192-note polyphony",
              "Dual headphone outputs",
              "24 pounds portable design"
            ]
          })
        }}
      />
    </>
  );
}