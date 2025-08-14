import { PianoSearchFilter } from '@/components/piano/search-filter'
import { ResponsiveContainer } from '@/components/ui/responsive-container'
import { EducationalNav } from '@/components/layout/educational-nav'

export default function PianoSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <ResponsiveContainer size="lg" padding="lg">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Search & Discover Pianos
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete piano collection with advanced search and filtering. 
              Learn about each instrument as you discover your perfect match.
            </p>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <ResponsiveContainer size="lg" padding="lg">
          <PianoSearchFilter />
        </ResponsiveContainer>
      </section>

      {/* Educational Section */}
      <section className="py-8 sm:py-12 bg-white">
        <ResponsiveContainer size="lg" padding="lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Learn More About Pianos
            </h2>
            <p className="text-lg text-gray-600">
              Enhance your piano knowledge with our educational resources
            </p>
          </div>
          <EducationalNav 
            showFeaturedOnly={true}
            maxSections={3}
            layout="grid"
          />
        </ResponsiveContainer>
      </section>
    </div>
  )
}

export const metadata = {
  title: 'Search Pianos - Find Your Perfect Kawai Piano',
  description: 'Search and filter through our complete collection of Kawai pianos with advanced tools and educational guidance.',
}