'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X, Plus, Check, Star, ArrowRight, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Piano {
  id: string
  name: string
  model: string
  category: string
  series: string
  price: string
  originalPrice?: string
  image: string
  rating: number
  reviews: number
  specifications: {
    keys: number
    pedals: number
    voices?: number
    polyphony?: number
    dimensions: {
      width: string
      height: string
      depth: string
      weight: string
    }
    features: string[]
  }
  keyFeatures: string[]
  highlights: string[]
  isAvailable: boolean
}

// Sample piano data - in a real app, this would come from an API
const samplePianos: Piano[] = [
  {
    id: 'ca901',
    name: 'Concert Artist CA901',
    model: 'CA901',
    category: 'Digital Piano',
    series: 'CA Series',
    price: '$6,999',
    originalPrice: '$7,999',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 124,
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 90,
      polyphony: 256,
      dimensions: {
        width: '57.1"',
        height: '36.2"',
        depth: '18.5"',
        weight: '143 lbs'
      },
      features: [
        'Grand Feel III Action',
        'Onkyo 6-Speaker System',
        'Harmonic Imaging XL',
        'Bluetooth Connectivity',
        'USB Audio Recording'
      ]
    },
    keyFeatures: ['Grand Feel III Action', 'Premium Sound System', '90 Voices'],
    highlights: ['Best Seller', 'Award Winner'],
    isAvailable: true
  },
  {
    id: 'gx3',
    name: 'GX-3 Grand Piano',
    model: 'GX-3',
    category: 'Grand Piano',
    series: 'GX Series',
    price: 'Contact for Price',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 87,
    specifications: {
      keys: 88,
      pedals: 3,
      dimensions: {
        width: '59"',
        height: '40"',
        depth: '6\'1"',
        weight: '860 lbs'
      },
      features: [
        'Millennium III Action',
        'Solid Spruce Soundboard',
        'Tapered Solid Spruce Ribs',
        'Premium Duplex Scaling',
        'Soft-Close Fallboard'
      ]
    },
    keyFeatures: ['Millennium III Action', 'Concert Quality', 'Handcrafted'],
    highlights: ['Premium', 'Concert Quality'],
    isAvailable: true
  },
  {
    id: 'nv10',
    name: 'NV10 Hybrid Piano',
    model: 'NV10',
    category: 'Hybrid Piano',
    series: 'N Series',
    price: '$15,999',
    image: '/api/placeholder/300/200',
    rating: 5,
    reviews: 56,
    specifications: {
      keys: 88,
      pedals: 3,
      voices: 38,
      polyphony: 256,
      dimensions: {
        width: '57.5"',
        height: '40.2"',
        depth: '25.6"',
        weight: '253 lbs'
      },
      features: [
        'Real Grand Action',
        'Silent Practice Mode',
        'Harmonic Imaging',
        'Bluetooth Connectivity',
        'Touch Screen Display'
      ]
    },
    keyFeatures: ['Real Grand Action', 'Silent Practice', 'Touch Screen'],
    highlights: ['Innovative', 'Best of Both Worlds'],
    isAvailable: true
  }
]

interface PianoComparisonProps {
  initialPianos?: Piano[]
  maxComparisons?: number
}

export function PianoComparison({ initialPianos = [], maxComparisons = 4 }: PianoComparisonProps) {
  const [selectedPianos, setSelectedPianos] = useState<Piano[]>(initialPianos)
  const [availablePianos] = useState<Piano[]>(samplePianos)
  const [showAddModal, setShowAddModal] = useState(false)

  const addPiano = (piano: Piano) => {
    if (selectedPianos.length < maxComparisons && !selectedPianos.find(p => p.id === piano.id)) {
      setSelectedPianos([...selectedPianos, piano])
      setShowAddModal(false)
    }
  }

  const removePiano = (pianoId: string) => {
    setSelectedPianos(selectedPianos.filter(p => p.id !== pianoId))
  }

  const clearAll = () => {
    setSelectedPianos([])
  }

  if (selectedPianos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Kawai Pianos</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Select up to {maxComparisons} pianos to compare their features, specifications, and find the perfect instrument for your needs.
        </p>
        <Button onClick={() => setShowAddModal(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Pianos to Compare
        </Button>

        {/* Add Piano Modal */}
        {showAddModal && (
          <AddPianoModal
            pianos={availablePianos}
            selectedIds={selectedPianos.map(p => p.id)}
            onAdd={addPiano}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Piano Comparison</h2>
          <p className="text-gray-600">Comparing {selectedPianos.length} of {maxComparisons} pianos</p>
        </div>
        <div className="flex gap-2">
          {selectedPianos.length < maxComparisons && (
            <Button variant="outline" onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Piano
            </Button>
          )}
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Piano Cards Header */}
            <thead>
              <tr>
                <td className="w-48 p-4 border-r border-gray-200">
                  <div className="font-semibold text-gray-900">Models</div>
                </td>
                {selectedPianos.map((piano) => (
                  <td key={piano.id} className="p-4 border-r border-gray-200 min-w-80">
                    <PianoCard piano={piano} onRemove={() => removePiano(piano.id)} />
                  </td>
                ))}
              </tr>
            </thead>

            {/* Comparison Rows */}
            <tbody className="divide-y divide-gray-200">
              {/* Pricing */}
              <ComparisonRow
                label="Price"
                values={selectedPianos.map(piano => (
                  <div key={piano.id}>
                    <div className="text-xl font-bold text-gray-900">{piano.price}</div>
                    {piano.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">{piano.originalPrice}</div>
                    )}
                  </div>
                ))}
              />

              {/* Basic Specs */}
              <ComparisonRow
                label="Category"
                values={selectedPianos.map(piano => (
                  <span key={piano.id} className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                    {piano.category}
                  </span>
                ))}
              />

              <ComparisonRow
                label="Series"
                values={selectedPianos.map(piano => piano.series)}
              />

              <ComparisonRow
                label="Keys"
                values={selectedPianos.map(piano => `${piano.specifications.keys} keys`)}
              />

              <ComparisonRow
                label="Pedals"
                values={selectedPianos.map(piano => `${piano.specifications.pedals} pedals`)}
              />

              {/* Digital-specific specs */}
              {selectedPianos.some(p => p.specifications.voices) && (
                <ComparisonRow
                  label="Voices"
                  values={selectedPianos.map(piano => 
                    piano.specifications.voices ? `${piano.specifications.voices} voices` : 'N/A'
                  )}
                />
              )}

              {selectedPianos.some(p => p.specifications.polyphony) && (
                <ComparisonRow
                  label="Polyphony"
                  values={selectedPianos.map(piano => 
                    piano.specifications.polyphony ? `${piano.specifications.polyphony} notes` : 'N/A'
                  )}
                />
              )}

              {/* Dimensions */}
              <ComparisonRow
                label="Dimensions (W×H×D)"
                values={selectedPianos.map(piano => (
                  <div key={piano.id} className="text-sm">
                    <div>{piano.specifications.dimensions.width} × {piano.specifications.dimensions.height} × {piano.specifications.dimensions.depth}</div>
                    <div className="text-gray-500">Weight: {piano.specifications.dimensions.weight}</div>
                  </div>
                ))}
              />

              {/* Key Features */}
              <ComparisonRow
                label="Key Features"
                values={selectedPianos.map(piano => (
                  <div key={piano.id} className="space-y-1">
                    {piano.specifications.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                    {piano.specifications.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{piano.specifications.features.length - 3} more features
                      </div>
                    )}
                  </div>
                ))}
              />

              {/* Availability */}
              <ComparisonRow
                label="Availability"
                values={selectedPianos.map(piano => (
                  <span key={piano.id} className={cn(
                    "inline-block px-2 py-1 rounded-full text-xs font-medium",
                    piano.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  )}>
                    {piano.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                ))}
              />
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full">
              Download Comparison
            </Button>
            <Button variant="outline" className="w-full">
              Schedule Showroom Visit
            </Button>
            <Button className="w-full">
              Contact for Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Add Piano Modal */}
      {showAddModal && (
        <AddPianoModal
          pianos={availablePianos}
          selectedIds={selectedPianos.map(p => p.id)}
          onAdd={addPiano}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

function PianoCard({ piano, onRemove }: { piano: Piano; onRemove: () => void }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="aspect-[3/2] bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-3 flex items-center justify-center">
        <div className="text-gray-500 text-xs">Piano Image</div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">{piano.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{piano.series}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(piano.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({piano.reviews})</span>
        </div>

        <div className="space-y-1 mb-4">
          {piano.highlights.map((highlight, idx) => (
            <span key={idx} className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded mr-1">
              {highlight}
            </span>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/pianos/${piano.category.toLowerCase().replace(' ', '-')}/${piano.model.toLowerCase()}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function ComparisonRow({ label, values }: { label: string; values: (string | React.ReactNode)[] }) {
  return (
    <tr>
      <td className="w-48 p-4 border-r border-gray-200 font-medium text-gray-900 bg-gray-50">
        {label}
      </td>
      {values.map((value, idx) => (
        <td key={idx} className="p-4 border-r border-gray-200">
          {typeof value === 'string' ? <span className="text-gray-900">{value}</span> : value}
        </td>
      ))}
    </tr>
  )
}

function AddPianoModal({ 
  pianos, 
  selectedIds, 
  onAdd, 
  onClose 
}: { 
  pianos: Piano[]
  selectedIds: string[]
  onAdd: (piano: Piano) => void
  onClose: () => void
}) {
  const availablePianos = pianos.filter(p => !selectedIds.includes(p.id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add Piano to Comparison</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePianos.map((piano) => (
              <div key={piano.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="aspect-[3/2] bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-3 flex items-center justify-center">
                  <div className="text-gray-500 text-xs">Piano Image</div>
                </div>
                
                <h4 className="font-bold text-gray-900 mb-1">{piano.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{piano.category}</p>
                <p className="text-lg font-bold text-gray-900 mb-3">{piano.price}</p>
                
                <Button 
                  onClick={() => onAdd(piano)} 
                  className="w-full"
                  size="sm"
                >
                  Add to Compare
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}