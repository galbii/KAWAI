import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GL-10 Baby Grand - KAWAI Signature Experience',
  description:
    'Discover the GL-10 Baby Grand piano - an award-winning 5\'0" masterpiece combining compact elegance with exceptional performance. Experience the exclusive KAWAI Signature collection.',
  keywords: [
    'GL-10',
    'baby grand piano',
    'KAWAI piano',
    'grand piano',
    'signature collection',
    'compact grand piano',
    'premium piano',
    'acoustic piano',
    'Millennium III Action',
  ],
  openGraph: {
    title: 'GL-10 Baby Grand - KAWAI Signature Experience',
    description:
      'Award-winning 5\'0" baby grand piano with Millennium III Action. Exclusive KAWAI Signature experience.',
    type: 'website',
    images: [
      {
        url: '/images/gl10-hero.jpg', // Update with actual image URL
        width: 1200,
        height: 630,
        alt: 'KAWAI GL-10 Baby Grand Piano',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GL-10 Baby Grand - KAWAI Signature Experience',
    description: 'Award-winning 5\'0" baby grand with exceptional performance.',
  },
}

export default function GL10SignatureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
