import { PianoComparison } from '@/components/piano/comparison'
import { ResponsiveContainer } from '@/components/ui/responsive-container'
import { ShowroomCTA } from '@/components/ui/showroom-cta'

export default function PianoComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <ResponsiveContainer size="lg" padding="lg">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Compare Kawai Pianos
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Compare up to 4 piano models side-by-side to understand their differences 
              and find the perfect instrument for your needs.
            </p>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <ResponsiveContainer size="lg" padding="lg">
          <PianoComparison maxComparisons={4} />
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12">
        <ResponsiveContainer size="lg" padding="lg">
          <ShowroomCTA 
            variant="banner"
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          />
        </ResponsiveContainer>
      </section>
    </div>
  )
}

export const metadata = {
  title: 'Piano Comparison - Compare Kawai Piano Models',
  description: 'Compare Kawai piano models side-by-side to understand their features, specifications, and find the perfect instrument.',
}