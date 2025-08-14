'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, BookOpen, Lightbulb, Award, Users, Wrench, GraduationCap, Clock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  subsections?: {
    id: string
    title: string
    description: string
    href: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'all'
    readTime?: string
    featured?: boolean
  }[]
}

const educationalSections: NavigationSection[] = [
  {
    id: 'piano-basics',
    title: 'Piano Fundamentals',
    description: 'Understanding piano types, construction, and how they work',
    icon: BookOpen,
    subsections: [
      {
        id: 'types-overview',
        title: 'Piano Types Explained',
        description: 'Acoustic vs Digital vs Hybrid - Understanding the differences',
        href: '/learn/piano-types',
        level: 'beginner',
        readTime: '5 min',
        featured: true
      },
      {
        id: 'how-pianos-work',
        title: 'How Pianos Create Sound',
        description: 'The mechanics behind beautiful music',
        href: '/learn/how-pianos-work',
        level: 'beginner',
        readTime: '7 min'
      },
      {
        id: 'piano-anatomy',
        title: 'Piano Anatomy & Components',
        description: 'From soundboard to action - every part explained',
        href: '/learn/piano-anatomy',
        level: 'intermediate',
        readTime: '10 min'
      },
      {
        id: 'acoustic-vs-digital',
        title: 'Acoustic vs Digital Comparison',
        description: 'Detailed comparison to help you choose',
        href: '/learn/acoustic-vs-digital',
        level: 'all',
        readTime: '8 min',
        featured: true
      }
    ]
  },
  {
    id: 'kawai-innovation',
    title: 'Kawai Innovation',
    description: 'Discover the technologies that make Kawai pianos exceptional',
    icon: Lightbulb,
    subsections: [
      {
        id: 'millennium-action',
        title: 'Millennium III Action',
        description: 'Revolutionary piano action technology',
        href: '/learn/millennium-action',
        level: 'intermediate',
        readTime: '6 min',
        featured: true
      },
      {
        id: 'harmonic-imaging',
        title: 'Harmonic Imaging Sound',
        description: 'Advanced sound sampling technology',
        href: '/learn/harmonic-imaging',
        level: 'intermediate',
        readTime: '5 min'
      },
      {
        id: 'grand-feel-action',
        title: 'Grand Feel Action Technology',
        description: 'Authentic grand piano touch in digital instruments',
        href: '/learn/grand-feel-action',
        level: 'all',
        readTime: '4 min'
      },
      {
        id: 'craftsmanship',
        title: 'Japanese Craftsmanship',
        description: 'The art and science of piano making',
        href: '/learn/craftsmanship',
        level: 'all',
        readTime: '12 min'
      }
    ]
  },
  {
    id: 'heritage',
    title: 'Kawai Heritage',
    description: 'The story of 95+ years of piano excellence',
    icon: Award,
    subsections: [
      {
        id: 'kawai-story',
        title: 'The Kawai Story',
        description: 'From 1927 to today - a legacy of innovation',
        href: '/learn/kawai-story',
        level: 'all',
        readTime: '15 min',
        featured: true
      },
      {
        id: 'family-legacy',
        title: 'Three Generations of Excellence',
        description: 'The Kawai family dedication to perfect pianos',
        href: '/learn/family-legacy',
        level: 'all',
        readTime: '10 min'
      },
      {
        id: 'awards-recognition',
        title: 'Awards & Recognition',
        description: 'International acclaim and industry honors',
        href: '/learn/awards',
        level: 'all',
        readTime: '6 min'
      },
      {
        id: 'famous-artists',
        title: 'Artists & Kawai',
        description: 'World-renowned musicians who choose Kawai',
        href: '/learn/artists',
        level: 'all',
        readTime: '8 min'
      }
    ]
  },
  {
    id: 'buying-guide',
    title: 'Piano Buying Guide',
    description: 'Expert advice for choosing your perfect piano',
    icon: Users,
    subsections: [
      {
        id: 'first-piano',
        title: 'Buying Your First Piano',
        description: 'Complete guide for first-time piano buyers',
        href: '/learn/first-piano-guide',
        level: 'beginner',
        readTime: '12 min',
        featured: true
      },
      {
        id: 'budget-planning',
        title: 'Piano Budget Planning',
        description: 'Understanding costs beyond the initial purchase',
        href: '/learn/budget-planning',
        level: 'all',
        readTime: '8 min'
      },
      {
        id: 'space-considerations',
        title: 'Space & Placement Guide',
        description: 'Ensuring your piano fits perfectly in your home',
        href: '/learn/space-guide',
        level: 'all',
        readTime: '6 min'
      },
      {
        id: 'used-vs-new',
        title: 'New vs Pre-Owned Pianos',
        description: 'Making the right choice for your situation',
        href: '/learn/new-vs-used',
        level: 'intermediate',
        readTime: '10 min'
      }
    ]
  },
  {
    id: 'piano-care',
    title: 'Piano Care & Maintenance',
    description: 'Keep your piano in perfect condition for years to come',
    icon: Wrench,
    subsections: [
      {
        id: 'daily-care',
        title: 'Daily Piano Care',
        description: 'Simple habits to protect your investment',
        href: '/learn/daily-care',
        level: 'all',
        readTime: '5 min',
        featured: true
      },
      {
        id: 'tuning-guide',
        title: 'Piano Tuning Explained',
        description: 'When, why, and how often to tune your piano',
        href: '/learn/tuning-guide',
        level: 'all',
        readTime: '7 min'
      },
      {
        id: 'climate-control',
        title: 'Climate & Environment',
        description: 'Protecting your piano from environmental damage',
        href: '/learn/climate-control',
        level: 'intermediate',
        readTime: '8 min'
      },
      {
        id: 'troubleshooting',
        title: 'Common Issues & Solutions',
        description: 'Identifying and addressing piano problems',
        href: '/learn/troubleshooting',
        level: 'advanced',
        readTime: '12 min'
      }
    ]
  },
  {
    id: 'learning-music',
    title: 'Learning & Playing',
    description: 'Resources for musicians at every level',
    icon: GraduationCap,
    subsections: [
      {
        id: 'getting-started',
        title: 'Getting Started with Piano',
        description: 'Your first steps in piano playing',
        href: '/learn/getting-started',
        level: 'beginner',
        readTime: '10 min',
        featured: true
      },
      {
        id: 'practice-tips',
        title: 'Effective Practice Techniques',
        description: 'Make the most of your practice time',
        href: '/learn/practice-tips',
        level: 'intermediate',
        readTime: '9 min'
      },
      {
        id: 'music-theory',
        title: 'Music Theory Basics',
        description: 'Understanding the language of music',
        href: '/learn/music-theory',
        level: 'beginner',
        readTime: '15 min'
      },
      {
        id: 'advanced-techniques',
        title: 'Advanced Playing Techniques',
        description: 'Take your playing to the next level',
        href: '/learn/advanced-techniques',
        level: 'advanced',
        readTime: '20 min'
      }
    ]
  }
]

interface EducationalNavProps {
  showFeaturedOnly?: boolean
  maxSections?: number
  layout?: 'grid' | 'list' | 'compact'
}

export function EducationalNav({ 
  showFeaturedOnly = false, 
  maxSections,
  layout = 'grid' 
}: EducationalNavProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const sectionsToShow = maxSections ? educationalSections.slice(0, maxSections) : educationalSections

  if (layout === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Learn About Pianos</h3>
        <div className="space-y-2">
          {sectionsToShow.map(section => {
            const featuredSubsections = section.subsections?.filter(sub => sub.featured) || []
            return (
              <div key={section.id}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{section.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                {featuredSubsections.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {featuredSubsections.map(subsection => (
                      <Link
                        key={subsection.id}
                        href={subsection.href}
                        className="block text-xs text-gray-600 hover:text-blue-600 py-1"
                      >
                        {subsection.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {sectionsToShow.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <section.icon className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.includes(section.id) && section.subsections && (
              <div className="px-6 pb-4 border-t border-gray-100">
                <div className="grid gap-3 pt-4">
                  {section.subsections
                    .filter(sub => !showFeaturedOnly || sub.featured)
                    .map(subsection => (
                      <Link
                        key={subsection.id}
                        href={subsection.href}
                        className="group p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                {subsection.title}
                              </h4>
                              {subsection.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{subsection.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getLevelColor(subsection.level)
                              )}>
                                {subsection.level}
                              </span>
                              {subsection.readTime && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {subsection.readTime}
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 mt-1" />
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectionsToShow.map(section => (
        <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <section.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{section.description}</p>
            
            {section.subsections && (
              <div className="space-y-2">
                {section.subsections
                  .filter(sub => !showFeaturedOnly || sub.featured)
                  .slice(0, 3)
                  .map(subsection => (
                    <Link
                      key={subsection.id}
                      href={subsection.href}
                      className="block p-2 rounded hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                              {subsection.title}
                            </span>
                            {subsection.featured && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-xs font-medium",
                              getLevelColor(subsection.level)
                            )}>
                              {subsection.level}
                            </span>
                            {subsection.readTime && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {subsection.readTime}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </Link>
                  ))}
                
                {section.subsections.length > 3 && (
                  <div className="pt-2 border-t border-gray-100">
                    <Link
                      href={section.href || `/learn/${section.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all {section.subsections.length} articles →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Quick access educational sidebar component
export function EducationalSidebar() {
  const featuredArticles = educationalSections
    .flatMap(section => section.subsections || [])
    .filter(article => article.featured)
    .slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Featured Learning</h3>
      <div className="space-y-3">
        {featuredArticles.map(article => (
          <Link
            key={article.id}
            href={article.href}
            className="block group"
          >
            <div className="flex items-start gap-3">
              <Star className="h-4 w-4 text-yellow-500 fill-current mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    getLevelColor(article.level)
                  )}>
                    {article.level}
                  </span>
                  {article.readTime && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/learn"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All Learning Resources
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function getLevelColor(level: string) {
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-800'
    case 'intermediate': return 'bg-yellow-100 text-yellow-800'
    case 'advanced': return 'bg-red-100 text-red-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}