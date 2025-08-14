'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Info, CheckCircle, Star, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Specification {
  label: string
  value: string
  description?: string
  highlight?: boolean
}

interface SpecificationGroup {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  specifications: Specification[]
}

interface TechnicalSpecificationsProps {
  groups: SpecificationGroup[]
  className?: string
  collapsible?: boolean
  showHighlights?: boolean
}

export function TechnicalSpecifications({ 
  groups, 
  className, 
  collapsible = false,
  showHighlights = true
}: TechnicalSpecificationsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    new Set(collapsible ? [] : Array.from(Array(groups.length).keys()))
  )

  const toggleGroup = (index: number) => {
    if (!collapsible) return
    
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedGroups(newExpanded)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group, groupIndex) => {
        const isExpanded = expandedGroups.has(groupIndex)
        const GroupIcon = group.icon
        
        return (
          <div key={groupIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              className={cn(
                "p-6 border-b border-gray-200",
                collapsible && "cursor-pointer hover:bg-gray-50"
              )}
              onClick={() => toggleGroup(groupIndex)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {GroupIcon && (
                    <GroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
                </div>
                {collapsible && (
                  <div className="flex items-center text-gray-400">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <div className="space-y-4">
                  {group.specifications.map((spec, specIndex) => (
                    <SpecificationRow 
                      key={specIndex} 
                      specification={spec}
                      showHighlights={showHighlights}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SpecificationRow({ 
  specification, 
  showHighlights 
}: { 
  specification: Specification
  showHighlights: boolean 
}) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className={cn(
      "py-3 border-b border-gray-100 last:border-b-0",
      specification.highlight && showHighlights && "bg-blue-50 -mx-2 px-2 rounded"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {specification.highlight && showHighlights && (
            <Star className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
          )}
          <span className="font-medium text-gray-900">{specification.label}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700 text-right">{specification.value}</span>
          {specification.description && (
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {specification.description && showDescription && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          {specification.description}
        </div>
      )}
    </div>
  )
}

interface FeatureHighlightsProps {
  features: {
    title: string
    description: string
    icon?: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
  className?: string
}

export function FeatureHighlights({ features, className }: FeatureHighlightsProps) {
  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {features.map((feature, index) => {
        const FeatureIcon = feature.icon || CheckCircle
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FeatureIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  {feature.badge && (
                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface ComparisonTableProps {
  pianos: {
    id: string
    name: string
    image?: string
    specifications: Record<string, string | number>
  }[]
  specificationLabels: Record<string, string>
  className?: string
}

export function ComparisonTable({ pianos, specificationLabels, className }: ComparisonTableProps) {
  const allSpecs = Object.keys(specificationLabels)

  return (
    <div className={cn("bg-white rounded-lg shadow-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header with piano names */}
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900 border-r border-gray-200">
                Specification
              </th>
              {pianos.map((piano) => (
                <th key={piano.id} className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200 min-w-40">
                  <div className="space-y-2">
                    <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded mx-auto flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div className="font-bold text-sm">{piano.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Specification rows */}
          <tbody className="divide-y divide-gray-200">
            {allSpecs.map((specKey) => (
              <tr key={specKey} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 border-r border-gray-200 bg-gray-50">
                  {specificationLabels[specKey]}
                </td>
                {pianos.map((piano) => (
                  <td key={piano.id} className="p-4 text-center border-r border-gray-200">
                    <span className="text-gray-700">
                      {piano.specifications[specKey] || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TechnologyShowcaseProps {
  technologies: {
    name: string
    description: string
    benefits: string[]
    icon?: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
  className?: string
}

export function TechnologyShowcase({ technologies, className }: TechnologyShowcaseProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {technologies.map((tech, index) => {
        const TechIcon = tech.icon || Award
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TechIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{tech.name}</h3>
                  {tech.badge && (
                    <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tech.badge}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">{tech.description}</p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {tech.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}