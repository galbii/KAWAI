import type { Metadata } from "next";
import { Suspense } from 'react'
import { UTMCapture } from '@/components/analytics/UTMCapture'

export const metadata: Metadata = {
  title: 'Kawai ES60 Digital Piano | Best for Beginners Under $500 | 88 Weighted Keys',
  description: 'The Kawai ES60 is the best digital piano for beginners under $500. Features authentic Shigeru Kawai SK-EX concert grand sampling, 88 weighted keys, 192-note polyphony, silent practice with dual headphones, and ultra-portable 24 lb design. Perfect for students, adult learners, and apartment living. Exceptional value at only $499.',
  keywords: [
    'kawai es60',
    'kawai digital piano',
    'best digital piano',
    'best digital piano for beginners',
    'best digital piano under 500',
    'digital piano with weighted keys',
    'best beginner digital piano',
    'affordable digital piano',
    'digital piano under $500',
    'beginner piano with weighted keys',
    'portable digital piano for students',
    'silent practice piano',
    'apartment-friendly piano',
    'Kawai ES60 review',
    'kawai es60 vs es120',
    'concert grand sound affordable',
    'best digital piano for adult learners',
    'kawai digital piano models',
    'kawai digital piano price',
    'es60 digital piano'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Kawai ES60 Digital Piano | Best for Beginners Under $500 | 88 Weighted Keys',
    description: 'The Kawai ES60 is the best digital piano for beginners under $500. Authentic Shigeru Kawai SK-EX concert grand sampling, 88 weighted keys, silent practice capability, and ultra-portable design. Perfect for students and adult learners. Only $499.',
    url: 'https://kawaipianogallery.com/es60',
    siteName: 'Kawai Piano Gallery',
    type: 'website',
    images: [
      {
        url: 'https://kawaipianogallery.com/images/es60-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai ES60 Digital Piano - 88 weighted keys with authentic concert grand sound, perfect for beginners under $500',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai ES60 Digital Piano | Best for Beginners Under $500',
    description: 'Best digital piano for beginners. Shigeru Kawai SK-EX concert grand sampling, 88 weighted keys, silent practice, ultra-portable. Only $499.',
    images: ['https://kawaipianogallery.com/images/es60-hero.jpg'],
    creator: '@KawaiPianos',
  },
  alternates: {
    canonical: 'https://kawaipianogallery.com/es60',
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