'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, CheckCircle, Star, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface UserPreferences {
  experience: string
  budget: string
  space: string
  usage: string[]
  features: string[]
  sound: string
  maintenance: string
}

interface PianoRecommendation {
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
  matchScore: number
  whyRecommended: string[]
  keyFeatures: string[]
  pros: string[]
  considerations: string[]
  availability: 'in-stock' | 'pre-order' | 'out-of-stock'
}

const questions = [
  {
    id: 'experience',
    title: 'What\'s your musical experience?',
    subtitle: 'This helps us recommend the right complexity and features',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Beginner', description: 'Just starting or less than 2 years' },
      { value: 'intermediate', label: 'Intermediate', description: '2-5 years of playing experience' },
      { value: 'advanced', label: 'Advanced', description: '5+ years, serious practice and performance' },
      { value: 'professional', label: 'Professional', description: 'Professional musician or teacher' }
    ]
  },
  {
    id: 'budget',
    title: 'What\'s your budget range?',
    subtitle: 'We\'ll show options within your comfort zone',
    type: 'single',
    options: [
      { value: 'under-5k', label: 'Under $5,000', description: 'Entry-level to intermediate options' },
      { value: '5k-15k', label: '$5,000 - $15,000', description: 'Mid-range with premium features' },
      { value: '15k-30k', label: '$15,000 - $30,000', description: 'High-end digital and acoustic options' },
      { value: '30k-plus', label: '$30,000+', description: 'Premium and professional instruments' },
      { value: 'flexible', label: 'Flexible', description: 'Show me the best options regardless of price' }
    ]
  },
  {
    id: 'space',
    title: 'Where will your piano live?',
    subtitle: 'Space constraints help determine the best piano type',
    type: 'single',
    options: [
      { value: 'apartment', label: 'Apartment/Condo', description: 'Limited space, noise considerations' },
      { value: 'home-room', label: 'Dedicated Home Room', description: 'Moderate space, family environment' },
      { value: 'studio', label: 'Music Studio/Room', description: 'Dedicated music space with good acoustics' },
      { value: 'performance', label: 'Performance Venue', description: 'Concert hall, church, or event space' }
    ]
  },
  {
    id: 'usage',
    title: 'How will you use your piano?',
    subtitle: 'Select all that apply to your musical goals',
    type: 'multiple',
    options: [
      { value: 'learning', label: 'Learning & Practice', description: 'Daily practice and skill development' },
      { value: 'recording', label: 'Recording Music', description: 'Home studio and music production' },
      { value: 'performance', label: 'Live Performance', description: 'Concerts, recitals, and events' },
      { value: 'teaching', label: 'Teaching Others', description: 'Music instruction and lessons' },
      { value: 'entertainment', label: 'Family Entertainment', description: 'Casual playing and enjoyment' },
      { value: 'composition', label: 'Composing', description: 'Writing and arranging music' }
    ]
  },
  {
    id: 'features',
    title: 'Which features matter most?',
    subtitle: 'Help us prioritize what\'s important to you',
    type: 'multiple',
    options: [
      { value: 'authentic-touch', label: 'Authentic Piano Touch', description: 'Weighted keys that feel like acoustic piano' },
      { value: 'silent-practice', label: 'Silent Practice', description: 'Headphone capability for quiet practice' },
      { value: 'recording', label: 'Recording Capability', description: 'Built-in recording and playback features' },
      { value: 'connectivity', label: 'Bluetooth/App Integration', description: 'Connect to devices and learning apps' },
      { value: 'multiple-sounds', label: 'Multiple Instrument Sounds', description: 'Variety of voices beyond piano' },
      { value: 'learning-tools', label: 'Built-in Learning Tools', description: 'Lessons, metronome, and practice aids' }
    ]
  },
  {
    id: 'sound',
    title: 'What sound character do you prefer?',
    subtitle: 'Different pianos have distinct tonal characteristics',
    type: 'single',
    options: [
      { value: 'bright', label: 'Bright & Clear', description: 'Crisp, articulate sound with strong treble' },
      { value: 'warm', label: 'Warm & Rich', description: 'Full, rounded tone with deep bass' },
      { value: 'balanced', label: 'Balanced & Versatile', description: 'Even tone across all registers' },
      { value: 'powerful', label: 'Powerful & Dynamic', description: 'Strong projection and dramatic range' },
      { value: 'no-preference', label: 'No Strong Preference', description: 'Open to any quality piano sound' }
    ]
  },
  {
    id: 'maintenance',
    title: 'How do you feel about maintenance?',
    subtitle: 'Acoustic pianos require regular tuning and care',
    type: 'single',
    options: [
      { value: 'minimal', label: 'Prefer Minimal Maintenance', description: 'Want a piano that\'s always ready to play' },
      { value: 'some', label: 'Don\'t Mind Some Maintenance', description: 'Okay with occasional tuning and care' },
      { value: 'traditional', label: 'Embrace Traditional Care', description: 'Value the ritual of piano maintenance' },
      { value: 'no-preference', label: 'No Strong Preference', description: 'Focus on the music, not the maintenance' }
    ]
  }
]

// Sample recommendations based on user preferences
const generateRecommendations = (preferences: UserPreferences): PianoRecommendation[] => {
  const recommendations: PianoRecommendation[] = []

  // Logic to determine recommendations based on preferences
  if (preferences.experience === 'beginner') {
    recommendations.push({
      id: 'cn301',
      name: 'CN301',
      model: 'CN301',
      category: 'Digital Piano',
      series: 'CN Series',
      price: '$2,499',
      image: '/api/placeholder/300/200',
      rating: 4,
      reviews: 89,
      matchScore: 95,
      whyRecommended: [
        'Perfect for beginners with built-in learning features',
        'Responsive Hammer III action builds proper technique',
        'Compact design fits most spaces',
        'Built-in lessons and practice tools'
      ],
      keyFeatures: ['Responsive Hammer III Action', 'Built-in Lessons', 'USB Recording', 'Compact Design'],
      pros: ['Great value for beginners', 'Easy to use', 'No maintenance required', 'Volume control'],
      considerations: ['Limited advanced features', 'Plastic construction'],
      availability: 'in-stock'
    })
  }

  if (preferences.budget === '5k-15k' || preferences.budget === 'flexible') {
    recommendations.push({
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
      matchScore: 92,
      whyRecommended: [
        'Professional-grade digital piano',
        'Grand Feel III action provides authentic touch',
        'Premium Onkyo sound system',
        'Perfect for serious practice and performance'
      ],
      keyFeatures: ['Grand Feel III Action', 'Onkyo 6-Speaker System', 'Harmonic Imaging XL', 'Bluetooth'],
      pros: ['Concert-quality touch', 'Exceptional sound quality', 'Professional features', 'Great value'],
      considerations: ['Significant investment', 'Large footprint'],
      availability: 'in-stock'
    })
  }

  if (preferences.space === 'studio' || preferences.space === 'performance') {
    recommendations.push({
      id: 'gx3',
      name: 'GX-3 Grand Piano',
      model: 'GX-3',
      category: 'Grand Piano',
      series: 'GX Series',
      price: 'Contact for Price',
      image: '/api/placeholder/300/200',
      rating: 5,
      reviews: 43,
      matchScore: 88,
      whyRecommended: [
        'Professional concert grand piano',
        'Millennium III action for ultimate expression',
        'Exceptional dynamic range and tonal quality',
        'Investment-grade instrument'
      ],
      keyFeatures: ['Millennium III Action', 'Solid Spruce Soundboard', 'Concert Quality', 'Premium Materials'],
      pros: ['Ultimate musical expression', 'Investment quality', 'Concert performance', 'Exceptional craftsmanship'],
      considerations: ['Requires significant space', 'Regular tuning needed', 'Climate sensitive', 'Major investment'],
      availability: 'in-stock'
    })
  }

  if (preferences.features.includes('silent-practice')) {
    recommendations.push({
      id: 'nv10',
      name: 'NV10 Hybrid Piano',
      model: 'NV10',
      category: 'Hybrid Piano',
      series: 'N Series',
      price: '$15,999',
      image: '/api/placeholder/300/200',
      rating: 5,
      reviews: 31,
      matchScore: 90,
      whyRecommended: [
        'Real grand piano action with silent practice',
        'Best of acoustic and digital worlds',
        'Touch screen interface for modern features',
        'No tuning required'
      ],
      keyFeatures: ['Real Grand Action', 'Silent Practice Mode', 'Touch Screen', 'Hybrid Technology'],
      pros: ['Authentic grand piano touch', 'Silent practice capability', 'Modern features', 'No maintenance'],
      considerations: ['Premium price point', 'Complex technology'],
      availability: 'pre-order'
    })
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}

export function PianoFinder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({})
  const [recommendations, setRecommendations] = useState<PianoRecommendation[]>([])
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1

  const updatePreference = (questionId: string, value: string | string[]) => {
    setPreferences(prev => ({ ...prev, [questionId]: value }))
  }

  const nextStep = () => {
    if (isLastStep) {
      // Generate recommendations
      const recs = generateRecommendations(preferences as UserPreferences)
      setRecommendations(recs)
      setShowResults(true)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const restartFinder = () => {
    setCurrentStep(0)
    setPreferences({})
    setRecommendations([])
    setShowResults(false)
  }

  const isStepComplete = () => {
    const currentValue = preferences[currentQuestion.id as keyof UserPreferences]
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(currentValue) && currentValue.length > 0
    }
    return Boolean(currentValue)
  }

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Results Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Your Perfect Piano Matches</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your preferences, we've found these exceptional pianos that match your needs and goals.
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {recommendations.map((piano, index) => (
            <PianoRecommendationCard key={piano.id} piano={piano} rank={index + 1} />
          ))}
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience These Pianos?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            The best way to choose your perfect piano is to play it in person. Schedule a visit to our showroom 
            where you can try these recommended instruments and get expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/experience/schedule-visit">
                Schedule Showroom Visit
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pianos/compare">
                Compare These Models
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={restartFinder}>
              Start Over
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep + 1} of {questions.length}</span>
          <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
          <p className="text-gray-600">{currentQuestion.subtitle}</p>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestion.type === 'multiple' 
              ? (preferences[currentQuestion.id as keyof UserPreferences] as string[] || []).includes(option.value)
              : preferences[currentQuestion.id as keyof UserPreferences] === option.value

            return (
              <button
                key={option.value}
                onClick={() => {
                  if (currentQuestion.type === 'multiple') {
                    const current = (preferences[currentQuestion.id as keyof UserPreferences] as string[]) || []
                    const updated = isSelected 
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value]
                    updatePreference(currentQuestion.id, updated)
                  } else {
                    updatePreference(currentQuestion.id, option.value)
                  }
                }}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  isSelected 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 mt-0.5 mr-3",
                    currentQuestion.type === 'multiple' ? "w-5 h-5" : "w-5 h-5"
                  )}>
                    {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    {!isSelected && (
                      <div className={cn(
                        "w-5 h-5 border-2 border-gray-300 rounded",
                        currentQuestion.type === 'single' && "rounded-full"
                      )} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={!isStepComplete()}
            className="flex items-center"
          >
            {isLastStep ? 'Get Recommendations' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function PianoRecommendationCard({ piano, rank }: { piano: PianoRecommendation; rank: number }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* Rank and Image */}
        <div className="relative">
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
            {rank}
          </div>
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-gray-500">Piano Image</div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{piano.matchScore}% Match</div>
            <div className="flex items-center justify-center">
              <div className="flex">
                {[...Array(piano.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({piano.reviews})</span>
            </div>
          </div>
        </div>

        {/* Piano Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{piano.name}</h3>
              {piano.availability === 'pre-order' && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  Pre-Order
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{piano.series}</span>
              <span>•</span>
              <span>{piano.category}</span>
              <span>•</span>
              <span className="font-semibold text-lg text-gray-900">{piano.price}</span>
              {piano.originalPrice && (
                <span className="line-through text-gray-500">{piano.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Why Recommended */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why We Recommend This Piano:</h4>
            <ul className="space-y-1">
              {piano.whyRecommended.map((reason, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {piano.keyFeatures.map((feature, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
              <Link href={`/pianos/${piano.category.toLowerCase().replace(' ', '-')}/${piano.model.toLowerCase()}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline">
              Add to Compare
            </Button>
            <Button variant="outline">
              Schedule Visit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}