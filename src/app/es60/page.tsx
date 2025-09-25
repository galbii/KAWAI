import { Suspense } from 'react';
import { SimplifiedCinematicPresentation } from '../(frontend)/es60/components/SimplifiedCinematicPresentation';
import '../(frontend)/es60/components/scroll-cinematic.css';

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
            <span>$499</span>
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
      {/* Full-screen cinematic experience */}
      <Suspense fallback={<CinematicLoader />}>
        <SimplifiedCinematicPresentation />
      </Suspense>


      {/* Preload critical assets for better performance */}
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