import type { Metadata } from 'next'
import WarrantyPageContent from './WarrantyPageContent'

export const metadata: Metadata = {
  title: 'Instrument Warranty | Kawai Pianos',
  description:
    'Kawai America Corporation backs every instrument with a limited warranty covering defects in materials and workmanship. Review full coverage details, duration, and how to initiate a claim.',
  alternates: {
    canonical: '/warranty',
  },
}

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Header */}
      <section className="bg-kawai-charcoal text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Instrument Warranty</h1>
          <p className="text-gray-300 text-lg">
            Kawai America Corporation &nbsp;·&nbsp; Limited Warranty Coverage
          </p>
        </div>
      </section>

      <WarrantyPageContent />
    </div>
  )
}
