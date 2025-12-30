import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News & Updates | KAWAI',
  description: 'Stay up to date with the latest news, updates, and announcements from KAWAI.',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kawai-pearl via-white to-gray-50">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 transition-colors mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Coming Soon Content */}
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-kawai-charcoal mb-6">
                News & Updates
              </h1>
              <div className="w-24 h-1.5 bg-kawai-red mx-auto mb-8"></div>
              <p className="text-2xl text-gray-600 font-light">
                Coming Soon
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6 text-gray-600">
              <p className="text-lg leading-relaxed">
                We're working on bringing you the latest news, updates, and announcements from KAWAI.
              </p>
              <p className="text-lg leading-relaxed">
                Stay tuned for exciting content featuring new product launches, artist spotlights, industry insights, and more.
              </p>
            </div>

            {/* Decorative Element */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">
                "Music is the universal language of mankind."
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12">
            <p className="text-gray-600 mb-6">
              In the meantime, explore our piano collection
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Explore Pianos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
