import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';
import {
  ES60Hero,
  ES60SoundDemo,
  ES60Features,
  ES60ValueProposition,
  ES60SocialProof,
  ES60Specifications,
  ES60CTA,
  FloatingCTA,
  CinematicTrigger
} from './components';

export const metadata: Metadata = {
  title: 'Kawai ES60 Digital Piano | Concert Grand Sound. $499. | Kawai Piano Gallery',
  description: 'Experience concert grand heritage made accessible. The ES60 delivers the same Shigeru Kawai SK-EX samples found in $2,000+ models for just $499. Superior sound quality, weighted keys, and portable design.',
  keywords: 'Kawai ES60, digital piano $499, concert grand sound, Shigeru Kawai SK-EX, portable piano, weighted keys, budget digital piano, piano Lake St. Louis',
  openGraph: {
    title: 'Kawai ES60 | Concert Grand Heritage, Accessible Excellence',
    description: 'Concert grand sound for $499. The ES60 delivers professional piano experience with the same SK-EX samples found in premium models.',
    type: 'website',
  },
};

// Loading skeleton components for each section
function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="container mx-auto px-8 lg:px-16">
        <div className="max-w-5xl animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4 w-1/3"></div>
          <div className="h-16 bg-gray-300 rounded mb-8 w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded mb-12 w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-300 rounded w-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton({ height = "24" }: { height?: string }) {
  return (
    <section className={`py-${height}`} style={{ backgroundColor: '#F5F2ED' }}>
      <div className="container mx-auto px-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded mx-auto mb-6 w-64"></div>
        <div className="h-96 bg-gray-300 rounded"></div>
      </div>
    </section>
  );
}

function CTASkeleton() {
  return (
    <section className="py-32 text-center" style={{ backgroundColor: '#8B7355' }}>
      <div className="container mx-auto px-6 animate-pulse">
        <div className="h-12 bg-white/20 rounded mx-auto mb-6 w-96"></div>
        <div className="h-6 bg-white/20 rounded mx-auto mb-8 w-64"></div>
        <div className="h-14 bg-white/20 rounded mx-auto w-48"></div>
      </div>
    </section>
  );
}

// Cinematic Experience Banner Component
function CinematicExperienceBanner() {
  return (
    <div className="relative bg-black text-white py-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-red-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="font-bold text-red-400 text-sm uppercase tracking-wider">
                New Experience
              </span>
            </div>
            <div className="hidden sm:block text-sm text-white/80">
              Discover the ES60 through revolutionary cinematic storytelling
            </div>
          </div>
          
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white border-0 font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Link href="/es60/cinematic" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Watch Cinematic Experience</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ES60LandingPage() {
  return (
    <>
      {/* Main page content with progressive loading */}
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>

        {/* Cinematic Experience Banner */}
        <CinematicExperienceBanner />

        {/* Hero Section */}
        <Suspense fallback={<HeroSkeleton />}>
          <ES60Hero />
        </Suspense>

        {/* Sound Demo Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ES60SoundDemo />
        </Suspense>

        {/* Features Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ES60Features />
        </Suspense>

        {/* Value Proposition Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ES60ValueProposition />
        </Suspense>

        {/* Social Proof Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ES60SocialProof />
        </Suspense>

        {/* Specifications Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ES60Specifications />
        </Suspense>

        {/* Final CTA Section */}
        <Suspense fallback={<CTASkeleton />}>
          <ES60CTA />
        </Suspense>
      </div>

      {/* Floating mobile CTA */}
      <FloatingCTA />
      
      {/* Cinematic Experience Trigger */}
      <CinematicTrigger 
        variant="floating"
        delay={5000}
        showOnScroll={true}
      />
    </>
  );
}