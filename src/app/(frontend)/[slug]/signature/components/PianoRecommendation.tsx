'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import Image from 'next/image'

import type { 
  AssessmentResponse,
  PianoCategory
} from '../types'

// Custom interface to match what SignatureExperience passes
interface PianoRec {
  id: string
  name: string
  model: string
  series: string
  category: 'grand' | 'upright' | 'digital' | 'hybrid'
  image: string
  priceRange: string
  matchScore: number
  keyFeatures: string[]
  whyRecommended: string
  specifications: {
    length: string
    width: string
    weight: string
    finish: string
    warranty: string
  }
  availableFinishes: string[]
  inStock: boolean
  consultationRecommended: boolean
}

interface PianoRecommendationProps {
  recommendations: PianoRec[]
  assessmentResults: AssessmentResponse
  onSelect: (piano: PianoRec) => void
  showComparison?: boolean
  className?: string
}

/**
 * Piano Recommendation Display Component
 * Showcases personalized piano recommendations with elegant presentation
 */
export const PianoRecommendation: React.FC<PianoRecommendationProps> = ({
  recommendations,
  assessmentResults,
  onSelect,
  showComparison = false,
  className
}) => {
  const [selectedPiano, setSelectedPiano] = useState<PianoRec | null>(null)

  // Get category display name
  const getCategoryName = (category: PianoCategory): string => {
    switch (category) {
      case 'grand': return 'Grand Piano'
      case 'upright': return 'Upright Piano'
      case 'digital': return 'Digital Piano'
      case 'hybrid': return 'Hybrid Piano'
      default: return 'Piano'
    }
  }

  // Get match score color
  const getMatchScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const handlePianoSelect = (piano: PianoRec) => {
    setSelectedPiano(piano)
    onSelect(piano)
  }

  return (
    <div className={cn("max-w-6xl mx-auto space-y-8", className)}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Your Curated Selection
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Your Perfect Piano Match
        </h2>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your musical journey and preferences, we've selected these exceptional instruments for your consideration.
        </p>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid gap-8 lg:gap-12">
        {recommendations.map((piano, index) => (
          <motion.div
            key={piano.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Piano Image and Header */}
            <div className="relative">
              <div className="aspect-[16/9] lg:aspect-[21/9] relative bg-gray-100">
                <Image
                  {...getImagePropsWithFallback(
                    piano.image,
                    '/images/default/piano-placeholder.jpg',
                    'hero',
                    {
                      fill: true,
                      className: 'object-cover',
                      priority: index === 0
                    }
                  )}
                  alt={piano.name}
                />
              </div>
              
              {/* Match Score Badge */}
              <div className={cn(
                "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium",
                getMatchScoreColor(piano.matchScore)
              )}>
                {piano.matchScore}% Match
              </div>
              
              {/* Piano Header Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <div className="text-sm font-medium opacity-90 mb-1">
                    {piano.series} • {getCategoryName(piano.category)}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                    {piano.name}
                  </h3>
                  <div className="text-lg font-semibold opacity-95">
                    {piano.priceRange}
                  </div>
                </div>
              </div>
            </div>

            {/* Piano Details */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Why Recommended */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Why We Recommend This Piano
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {piano.whyRecommended}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {piano.keyFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Specifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 font-medium">Dimensions</div>
                    <div className="text-gray-900">{piano.specifications.length} × {piano.specifications.width}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">Weight</div>
                    <div className="text-gray-900">{piano.specifications.weight}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">Finish</div>
                    <div className="text-gray-900">{piano.specifications.finish}</div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    piano.inStock ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {piano.inStock ? "Available" : "Special Order"}
                  </div>
                  {piano.consultationRecommended && (
                    <div className="text-sm text-gray-600">
                      Consultation Recommended
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePianoSelect(piano)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Select This Piano
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      {showComparison && recommendations.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 lg:p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Compare Your Options
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Piano</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Price Range</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Match Score</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((piano) => (
                  <tr key={piano.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{piano.name}</div>
                      <div className="text-sm text-gray-600">{piano.series}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {getCategoryName(piano.category)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {piano.priceRange}
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        getMatchScoreColor(piano.matchScore)
                      )}>
                        {piano.matchScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PianoRecommendation