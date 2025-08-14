'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, X, Info, HelpCircle, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FilterOptions {
  category: string[]
  priceRange: [number, number]
  series: string[]
  features: string[]
  availability: string[]
  sortBy: string
}

interface Piano {
  id: string
  name: string
  model: string
  category: string
  series: string
  price: number
  originalPrice?: number
  priceDisplay: string
  image: string
  rating: number
  reviews: number
  features: string[]
  availability: 'in-stock' | 'out-of-stock' | 'pre-order'
  isRecommended?: boolean
  educationalNote?: string
}

// Sample piano data with educational context
const samplePianos: Piano[] = [
  {
    id: 'ca901',
    name: 'Concert Artist CA901',
    model: 'CA901',
    category: 'Digital Piano',
    series: 'CA Series',
    price: 6999,
    originalPrice: 7999,
    priceDisplay: '$6,999',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 124,
    features: ['Grand Feel III Action', 'Onkyo Sound', 'Bluetooth', '90 Voices'],
    availability: 'in-stock',
    isRecommended: true,
    educationalNote: 'Perfect for advanced students and professional practice with authentic grand piano touch.'
  },
  {
    id: 'cn301',
    name: 'CN301',
    model: 'CN301',
    category: 'Digital Piano',
    series: 'CN Series',
    price: 2499,
    priceDisplay: '$2,499',
    image: '/api/placeholder/300/200',
    rating: 4,
    reviews: 89,
    features: ['Responsive Hammer III', 'Built-in Lessons', 'USB Recording'],
    availability: 'in-stock',
    educationalNote: 'Ideal for beginners and intermediate players, with built-in learning features.'
  },
  {
    id: 'gx3',
    name: 'GX-3 Grand Piano',
    model: 'GX-3',
    category: 'Grand Piano',
    series: 'GX Series',
    price: 85000,
    priceDisplay: 'Contact for Price',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 43,
    features: ['Millennium III Action', 'Solid Spruce Soundboard', 'Concert Quality'],
    availability: 'in-stock',
    educationalNote: 'Professional concert instrument for serious musicians and performance venues.'
  },
  {
    id: 'k200',
    name: 'K-200',
    model: 'K-200',
    category: 'Upright Piano',
    series: 'K Series',
    price: 8999,
    priceDisplay: '$8,999',
    image: '/api/placeholder/300/200',
    rating: 4,
    reviews: 67,
    features: ['Extended Length Keys', 'Soft-Close Fallboard', 'Premium Hammers'],
    availability: 'in-stock',
    educationalNote: 'Traditional acoustic upright perfect for home practice and music education.'
  },
  {
    id: 'nv10',
    name: 'NV10 Hybrid',
    model: 'NV10',
    category: 'Hybrid Piano',
    series: 'N Series',
    price: 15999,
    priceDisplay: '$15,999',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 31,
    features: ['Real Grand Action', 'Silent Practice', 'Touch Screen'],
    availability: 'pre-order',
    educationalNote: 'Best of both worlds - acoustic piano touch with digital convenience.'
  }
]

const educationalContent = {
  categories: {
    'Digital Piano': {
      description: 'Modern instruments that replicate acoustic piano sound and feel using digital technology.',
      bestFor: 'Apartments, beginners, recording, practice with headphones',
      priceRange: '$1,000 - $10,000',
      considerations: ['No tuning required', 'Volume control', 'Built-in features', 'Portable options available']
    },
    'Grand Piano': {
      description: 'Acoustic pianos with horizontal strings and soundboard, offering the ultimate musical expression.',
      bestFor: 'Performance venues, advanced musicians, studios',
      priceRange: '$25,000 - $200,000+',
      considerations: ['Requires regular tuning', 'Significant space needed', 'Climate sensitive', 'Investment quality']
    },
    'Upright Piano': {
      description: 'Traditional acoustic pianos with vertical strings, perfect for homes and studios.',
      bestFor: 'Home practice, music education, smaller spaces',
      priceRange: '$5,000 - $30,000',
      considerations: ['Space efficient', 'Authentic acoustic sound', 'Regular maintenance needed', 'Good resale value']
    },
    'Hybrid Piano': {
      description: 'Combines real piano action with digital sound, offering acoustic feel with digital convenience.',
      bestFor: 'Serious players wanting acoustic touch with digital features',
      priceRange: '$8,000 - $20,000',
      considerations: ['Real piano action', 'Silent practice mode', 'Digital features', 'No tuning required']
    }
  }
}

export function PianoSearchFilter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 100000],
    series: [],
    features: [],
    availability: [],
    sortBy: 'recommended'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filteredPianos, setFilteredPianos] = useState<Piano[]>(samplePianos)
  const [showEducationalInfo, setShowEducationalInfo] = useState<string | null>(null)

  // Filter and search logic
  useEffect(() => {
    const result = samplePianos.filter(piano => {
      // Search term filter
      if (searchTerm && !piano.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !piano.model.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !piano.series.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(piano.category)) {
        return false
      }

      // Price range filter
      if (piano.price < filters.priceRange[0] || piano.price > filters.priceRange[1]) {
        return false
      }

      // Series filter
      if (filters.series.length > 0 && !filters.series.includes(piano.series)) {
        return false
      }

      // Features filter
      if (filters.features.length > 0 && !filters.features.some(f => piano.features.includes(f))) {
        return false
      }

      // Availability filter
      if (filters.availability.length > 0 && !filters.availability.includes(piano.availability)) {
        return false
      }

      return true
    })

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'recommended':
      default:
        result.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1
          if (!a.isRecommended && b.isRecommended) return 1
          return b.rating - a.rating
        })
        break
    }

    setFilteredPianos(result)
  }, [searchTerm, filters])

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = <K extends keyof FilterOptions>(key: K, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as FilterOptions[K])
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 100000],
      series: [],
      features: [],
      availability: [],
      sortBy: 'recommended'
    })
    setSearchTerm('')
  }

  const hasActiveFilters = searchTerm || filters.category.length > 0 || 
    filters.series.length > 0 || filters.features.length > 0 || 
    filters.availability.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 100000

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Finding Your Perfect Piano</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Choosing a piano is a personal journey. Consider your space, budget, musical goals, and playing style. 
              Our educational approach helps you understand each instrument's unique characteristics and benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Header */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pianos by name, model, or series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2",
            hasActiveFilters && "border-blue-500 text-blue-600"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter with Educational Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-medium text-gray-900">Piano Type</label>
                <HelpCircle 
                  className="h-4 w-4 text-gray-400 cursor-help" 
                  onClick={() => setShowEducationalInfo(showEducationalInfo === 'category' ? null : 'category')}
                />
              </div>
              <div className="space-y-2">
                {Object.keys(educationalContent.categories).map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleArrayFilter('category', category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Series Filter */}
            <div>
              <label className="font-medium text-gray-900 mb-3 block">Series</label>
              <div className="space-y-2">
                {['CA Series', 'CN Series', 'GX Series', 'K Series', 'N Series'].map(series => (
                  <label key={series} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.series.includes(series)}
                      onChange={() => toggleArrayFilter('series', series)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{series}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="font-medium text-gray-900 mb-3 block">Availability</label>
              <div className="space-y-2">
                {[
                  { value: 'in-stock', label: 'In Stock' },
                  { value: 'pre-order', label: 'Pre-Order' },
                  { value: 'out-of-stock', label: 'Out of Stock' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(value)}
                      onChange={() => toggleArrayFilter('availability', value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Info Panel */}
          {showEducationalInfo === 'category' && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Piano Type Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(educationalContent.categories).map(([type, info]) => (
                  <div key={type} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{type}</h5>
                    <p className="text-sm text-gray-700 mb-3">{info.description}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div><strong>Best for:</strong> {info.bestFor}</div>
                      <div><strong>Price range:</strong> {info.priceRange}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredPianos.length} Piano{filteredPianos.length !== 1 ? 's' : ''} Found
          </h2>
          {hasActiveFilters && (
            <p className="text-gray-600 text-sm">
              Filtered results • <button onClick={clearFilters} className="text-blue-600 hover:underline">Clear filters</button>
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Compare Selected
          </Button>
          <Button variant="outline" size="sm">
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Piano Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPianos.map((piano) => (
          <PianoCard key={piano.id} piano={piano} />
        ))}
      </div>

      {filteredPianos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pianos found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button onClick={clearFilters} variant="outline">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}

function PianoCard({ piano }: { piano: Piano }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Badges */}
      <div className="relative">
        {piano.isRecommended && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Recommended
            </span>
          </div>
        )}
        {piano.availability === 'pre-order' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Pre-Order
            </span>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-[3/2] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Piano Image</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{piano.name}</h3>
            <p className="text-gray-600 text-sm">{piano.series} • {piano.category}</p>
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(piano.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({piano.reviews})</span>
        </div>

        {/* Educational Note */}
        {piano.educationalNote && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-blue-800 text-sm">{piano.educationalNote}</p>
          </div>
        )}

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {piano.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {feature}
              </span>
            ))}
            {piano.features.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{piano.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-gray-900">{piano.priceDisplay}</p>
            {piano.originalPrice && (
              <p className="text-sm text-gray-500 line-through">${piano.originalPrice.toLocaleString()}</p>
            )}
          </div>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            piano.availability === 'in-stock' ? "bg-green-100 text-green-800" :
            piano.availability === 'pre-order' ? "bg-orange-100 text-orange-800" :
            "bg-red-100 text-red-800"
          )}>
            {piano.availability === 'in-stock' ? 'In Stock' :
             piano.availability === 'pre-order' ? 'Pre-Order' : 'Out of Stock'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="w-full">
            Compare
          </Button>
          <Button size="sm" className="w-full" asChild>
            <Link href={`/pianos/${piano.category.toLowerCase().replace(' ', '-')}/${piano.model.toLowerCase()}`}>
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}