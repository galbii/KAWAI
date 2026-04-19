import type { Metadata } from "next";
import { Suspense } from 'react'
import { UTMCapture } from '@/components/analytics/UTMCapture'

export const metadata: Metadata = {
  title: 'Kawai ES60 - Best Beginner Digital Piano Under $1000 | Concert Grand Sound for Students',
  description: 'Discover the best affordable digital piano for beginners. The Kawai ES60 features authentic Shigeru Kawai SK-EX concert grand sampling - the same professional sound quality found in pianos costing thousands more. Perfect for students, adult learners, and apartment living with 88 weighted keys, silent practice (dual headphones), 192-note polyphony, and ultra-portable 24 lb design. Exceptional value at only $799.',
  keywords: [
    'best beginner digital piano',
    'affordable digital piano',
    'digital piano under $1000',
    'beginner piano with weighted keys',
    'portable digital piano for students',
    'silent practice piano',
    'apartment-friendly piano',
    'Kawai ES60',
    'concert grand sound affordable',
    'best digital piano for adult learners'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Kawai ES60 - Best Affordable Beginner Digital Piano | Professional Sound Under $1000',
    description: 'The ultimate beginner digital piano with authentic Shigeru Kawai SK-EX concert grand sampling. Perfect for students and adult learners seeking professional sound quality at an affordable price. 88 weighted keys, silent practice capability, ultra-portable design. Only $799.',
    url: 'https://kawaipianogallery.com/canada-es60',
    siteName: 'Kawai Piano Gallery',
    type: 'website',
    images: [
      {
        url: 'https://kawaipianogallery.com/images/es60-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai ES60 Digital Piano - Best affordable beginner piano with concert grand sound and 88 weighted keys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai ES60 - Best Beginner Digital Piano Under $1000 | Concert Grand Sound',
    description: 'Professional Shigeru Kawai SK-EX concert grand sampling in an affordable beginner piano. Perfect for students, adult learners & apartments. 88 weighted keys, silent practice, ultra-portable. Only $799.',
    images: ['https://kawaipianogallery.com/images/es60-hero.jpg'],
    creator: '@KawaiPianos',
  },
  alternates: {
    canonical: 'https://kawaipianogallery.com/canada-es60',
  },
};

// Full-screen layout without header/footer for immersive cinematic experience
export default function CinematicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {children}
      <Suspense fallback={null}>
        <UTMCapture />
      </Suspense>
    </div>
  );
}
