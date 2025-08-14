import { PianoFinder } from '@/components/piano/piano-finder'
import { ResponsiveContainer } from '@/components/ui/responsive-container'
import { EducationalSidebar } from '@/components/layout/educational-nav'

export default function PianoFinderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <ResponsiveContainer size="lg" padding="lg">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect Piano
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Answer a few questions about your musical goals, space, and preferences, 
              and we'll recommend the ideal Kawai piano for your journey.
            </p>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <ResponsiveContainer size="lg" padding="lg">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Piano Finder Tool */}
            <div className="lg:col-span-3">
              <PianoFinder />
            </div>

            {/* Educational Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <EducationalSidebar />
                
                {/* Quick Tips */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Piano Selection Tips</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong>Space:</strong> Measure your room before choosing between grand, upright, or digital pianos.
                    </div>
                    <div>
                      <strong>Budget:</strong> Consider total cost including delivery, tuning, and maintenance.
                    </div>
                    <div>
                      <strong>Touch:</strong> The key action determines how the piano feels and responds to your playing.
                    </div>
                    <div>
                      <strong>Sound:</strong> Each piano has unique tonal characteristics that suit different musical styles.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    </div>
  )
}

export const metadata = {
  title: 'Piano Finder - Find Your Perfect Kawai Piano',
  description: 'Use our interactive piano finder tool to discover the perfect Kawai piano for your needs, budget, and musical goals.',
}