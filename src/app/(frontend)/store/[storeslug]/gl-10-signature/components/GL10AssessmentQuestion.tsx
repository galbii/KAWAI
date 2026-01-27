'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AssessmentOption {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

export interface AssessmentQuestionData {
  id: string
  question: string
  options: AssessmentOption[]
}

interface GL10AssessmentQuestionProps {
  question: string
  options: AssessmentOption[]
  onSelect: (optionId: string) => void
  selectedValue?: string
  backgroundColor?: 'white' | 'pearl'
}

export default function GL10AssessmentQuestion({
  question,
  options,
  onSelect,
  selectedValue,
  backgroundColor = 'white',
}: GL10AssessmentQuestionProps) {
  const handleCardClick = (optionId: string) => {
    onSelect(optionId)
  }

  const handleKeyPress = (e: React.KeyboardEvent, optionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick(optionId)
    }
  }

  return (
    <section
      className={cn(
        'relative min-h-screen px-4',
        backgroundColor === 'pearl' ? 'bg-[#FAF8F5]' : 'bg-white'
      )}
    >
      <div className="w-full max-w-6xl mx-auto py-8 md:py-16">
        {/* Question Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight text-[#2C2C2C] max-w-4xl mx-auto px-2">
            {question}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-64">
          {options.map((option) => {
            const isSelected = selectedValue === option.id

            return (
              <div
                key={option.id}
                onClick={() => handleCardClick(option.id)}
                onKeyDown={(e) => handleKeyPress(e, option.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${option.title}${option.description ? `: ${option.description}` : ''}`}
                className={cn(
                  'relative group cursor-pointer',
                  'bg-white rounded-2xl p-5 md:p-6',
                  'border-2 transition-all duration-300',
                  'shadow-sm hover:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2',
                  'hover:-translate-y-1 active:scale-[0.98]',
                  isSelected
                    ? 'border-[#C41E3A] bg-[#8B7355]/5 shadow-lg'
                    : 'border-[#2C2C2C]/10 hover:border-[#C41E3A]'
                )}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#C41E3A] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                {option.icon && (
                  <div
                    className={cn(
                      'mb-3 text-3xl md:text-4xl transition-colors duration-300',
                      isSelected ? 'text-[#C41E3A]' : 'text-[#D4AF37]'
                    )}
                  >
                    {option.icon}
                  </div>
                )}

                {/* Title */}
                <h3
                  className={cn(
                    'font-serif text-lg md:text-xl mb-2 transition-colors duration-300',
                    isSelected ? 'text-[#C41E3A]' : 'text-[#2C2C2C] group-hover:text-[#C41E3A]'
                  )}
                >
                  {option.title}
                </h3>

                {/* Description */}
                {option.description && (
                  <p className="text-[#2C2C2C]/70 text-sm leading-relaxed">
                    {option.description}
                  </p>
                )}

                {/* Hover Effect Border */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl transition-opacity duration-300',
                    'bg-gradient-to-br from-[#C41E3A]/5 to-[#D4AF37]/5',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                  aria-hidden="true"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Assessment Question Data Constants
export const MUSICAL_IDENTITY_QUESTION: AssessmentQuestionData = {
  id: 'musical-identity',
  question: 'How would you describe your musical journey?',
  options: [
    {
      id: 'beginning',
      title: 'Beginning My Journey',
      description: 'Exploring the world of piano for the first time',
      icon: '🌱',
    },
    {
      id: 'returning',
      title: 'Returning to Music',
      description: 'Rekindling a passion from years past',
      icon: '🔄',
    },
    {
      id: 'active',
      title: 'Active Musician',
      description: 'Regularly playing and developing my skills',
      icon: '🎹',
    },
    {
      id: 'professional',
      title: 'Professional Performer',
      description: 'Music is my career and calling',
      icon: '🎼',
    },
    {
      id: 'legacy',
      title: 'Family Legacy',
      description: 'Continuing a tradition for generations to come',
      icon: '👨‍👩‍👧‍👦',
    },
  ],
}

export const TIMELINE_QUESTION: AssessmentQuestionData = {
  id: 'timeline',
  question: "What's your timeline for finding your perfect piano?",
  options: [
    {
      id: 'ready-now',
      title: 'Ready Now',
      description: 'Looking to make a decision within 30 days',
      icon: '⚡',
    },
    {
      id: 'actively-exploring',
      title: 'Actively Exploring',
      description: 'Researching options over the next 2-6 months',
      icon: '🔍',
    },
    {
      id: 'planning-ahead',
      title: 'Planning Ahead',
      description: 'Considering a purchase sometime this year',
      icon: '📅',
    },
    {
      id: 'future-consideration',
      title: 'Future Consideration',
      description: 'Gathering information for a future decision',
      icon: '🌟',
    },
  ],
}
