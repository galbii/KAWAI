// Piano comparison, filtering, and selection tools

export interface PianoFilter {
  type?: string[]
  series?: string[]
  priceRange?: [number, number]
  keys?: number[]
  finishes?: string[]
  features?: string[]
  status?: string[]
  isPreOwned?: boolean
  availability?: string[]
}

export interface ComparisonPiano {
  id: string
  name: string
  model: string
  series: string
  type: string
  price: number
  image: string
  specifications: Record<string, any>
  features: string[]
  awards: any[]
  innovations: any[]
  score?: number
}

export interface FilterOption {
  label: string
  value: string
  count?: number
  disabled?: boolean
}

export interface FilterGroup {
  key: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

export class PianoFilterEngine {
  private pianos: any[]
  private filters: PianoFilter = {}

  constructor(pianos: any[]) {
    this.pianos = pianos
  }

  setFilter(key: keyof PianoFilter, value: any): this {
    this.filters[key] = value
    return this
  }

  clearFilter(key: keyof PianoFilter): this {
    delete this.filters[key]
    return this
  }

  clearAllFilters(): this {
    this.filters = {}
    return this
  }

  getFilters(): PianoFilter {
    return { ...this.filters }
  }

  apply(): any[] {
    return this.pianos.filter(piano => {
      // Type filter
      if (this.filters.type && this.filters.type.length > 0) {
        if (!this.filters.type.includes(piano.pianoType)) return false
      }

      // Series filter
      if (this.filters.series && this.filters.series.length > 0) {
        if (!this.filters.series.includes(piano.series?.slug)) return false
      }

      // Price range filter
      if (this.filters.priceRange) {
        const price = piano.pricing?.salePrice || piano.pricing?.msrp
        if (price) {
          const [min, max] = this.filters.priceRange
          if (price < min || price > max) return false
        }
      }

      // Keys filter
      if (this.filters.keys && this.filters.keys.length > 0) {
        if (!this.filters.keys.includes(piano.specifications?.keys)) return false
      }

      // Finishes filter
      if (this.filters.finishes && this.filters.finishes.length > 0) {
        const pianoFinishes = piano.specifications?.finishes?.map((f: any) => f.finish) || []
        if (!this.filters.finishes.some(finish => pianoFinishes.includes(finish))) return false
      }

      // Features filter
      if (this.filters.features && this.filters.features.length > 0) {
        const pianoFeatures = piano.features || []
        if (!this.filters.features.some(feature => pianoFeatures.includes(feature))) return false
      }

      // Status filter
      if (this.filters.status && this.filters.status.length > 0) {
        if (!this.filters.status.includes(piano.status)) return false
      }

      // Pre-owned filter
      if (this.filters.isPreOwned !== undefined) {
        if (piano.isPreOwned !== this.filters.isPreOwned) return false
      }

      // Availability filter
      if (this.filters.availability && this.filters.availability.length > 0) {
        const pianoAvailability = piano.availabilityRegions?.map((r: any) => r.availability) || []
        if (!this.filters.availability.some(avail => pianoAvailability.includes(avail))) return false
      }

      return true
    })
  }

  getFilterOptions(): FilterGroup[] {
    const filteredPianos = this.apply()

    return [
      {
        key: 'type',
        label: 'Piano Type',
        type: 'checkbox',
        options: this.generateOptions(this.pianos, 'pianoType', filteredPianos)
      },
      {
        key: 'series',
        label: 'Series',
        type: 'checkbox',
        options: this.generateOptions(
          this.pianos, 
          piano => piano.series?.name,
          filteredPianos,
          piano => piano.series?.slug
        )
      },
      {
        key: 'priceRange',
        label: 'Price Range',
        type: 'range',
        min: this.getMinPrice(),
        max: this.getMaxPrice(),
        step: 1000
      },
      {
        key: 'keys',
        label: 'Number of Keys',
        type: 'checkbox',
        options: this.generateOptions(this.pianos, 'specifications.keys', filteredPianos)
      },
      {
        key: 'finishes',
        label: 'Finishes',
        type: 'checkbox',
        options: this.generateFinishOptions(filteredPianos)
      },
      {
        key: 'status',
        label: 'Availability',
        type: 'checkbox',
        options: this.generateOptions(this.pianos, 'status', filteredPianos)
      }
    ]
  }

  private generateOptions(
    allPianos: any[], 
    field: string | ((piano: any) => any),
    filteredPianos: any[],
    valueField?: string | ((piano: any) => any)
  ): FilterOption[] {
    const getValue = typeof field === 'function' ? field : (piano: any) => this.getNestedValue(piano, field)
    const getValueForOption = valueField 
      ? (typeof valueField === 'function' ? valueField : (piano: any) => this.getNestedValue(piano, valueField))
      : getValue

    const allValues = [...new Set(allPianos.map(getValue).filter(Boolean))]
    const filteredValues = new Set(filteredPianos.map(getValue).filter(Boolean))

    return allValues.map(value => ({
      label: this.formatOptionLabel(value),
      value: getValueForOption(allPianos.find(p => getValue(p) === value)),
      count: filteredPianos.filter(p => getValue(p) === value).length,
      disabled: !filteredValues.has(value)
    }))
  }

  private generateFinishOptions(filteredPianos: any[]): FilterOption[] {
    const allFinishes = new Set<string>()
    const filteredFinishes = new Set<string>()

    this.pianos.forEach(piano => {
      piano.specifications?.finishes?.forEach((f: any) => {
        allFinishes.add(f.finish)
      })
    })

    filteredPianos.forEach(piano => {
      piano.specifications?.finishes?.forEach((f: any) => {
        filteredFinishes.add(f.finish)
      })
    })

    return Array.from(allFinishes).map(finish => ({
      label: finish,
      value: finish,
      count: filteredPianos.filter(p => 
        p.specifications?.finishes?.some((f: any) => f.finish === finish)
      ).length,
      disabled: !filteredFinishes.has(finish)
    }))
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private formatOptionLabel(value: any): string {
    if (typeof value === 'string') {
      return value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')
    }
    return String(value)
  }

  private getMinPrice(): number {
    const prices = this.pianos
      .map(p => p.pricing?.salePrice || p.pricing?.msrp)
      .filter(Boolean)
    return Math.min(...prices, 0)
  }

  private getMaxPrice(): number {
    const prices = this.pianos
      .map(p => p.pricing?.salePrice || p.pricing?.msrp)
      .filter(Boolean)
    return Math.max(...prices, 100000)
  }
}

export class PianoComparison {
  private pianos: ComparisonPiano[] = []
  private maxComparisons = 4

  add(piano: ComparisonPiano): boolean {
    if (this.pianos.length >= this.maxComparisons) return false
    if (this.pianos.some(p => p.id === piano.id)) return false
    
    this.pianos.push(piano)
    return true
  }

  remove(pianoId: string): boolean {
    const index = this.pianos.findIndex(p => p.id === pianoId)
    if (index === -1) return false
    
    this.pianos.splice(index, 1)
    return true
  }

  clear(): void {
    this.pianos = []
  }

  getPianos(): ComparisonPiano[] {
    return [...this.pianos]
  }

  getCount(): number {
    return this.pianos.length
  }

  isFull(): boolean {
    return this.pianos.length >= this.maxComparisons
  }

  contains(pianoId: string): boolean {
    return this.pianos.some(p => p.id === pianoId)
  }

  generateComparisonTable(): {
    headers: string[]
    rows: { label: string; values: (string | number | null)[] }[]
  } {
    if (this.pianos.length === 0) {
      return { headers: [], rows: [] }
    }

    const headers = ['Specification', ...this.pianos.map(p => p.name)]
    const specKeys = this.getAllSpecificationKeys()
    
    const rows = [
      {
        label: 'Model',
        values: this.pianos.map(p => p.model)
      },
      {
        label: 'Series',
        values: this.pianos.map(p => p.series)
      },
      {
        label: 'Type',
        values: this.pianos.map(p => p.type)
      },
      {
        label: 'Price',
        values: this.pianos.map(p => p.price ? `$${p.price.toLocaleString()}` : 'N/A')
      },
      ...specKeys.map(key => ({
        label: this.formatSpecLabel(key),
        values: this.pianos.map(p => p.specifications[key] || 'N/A')
      }))
    ]

    return { headers, rows }
  }

  private getAllSpecificationKeys(): string[] {
    const keys = new Set<string>()
    this.pianos.forEach(piano => {
      Object.keys(piano.specifications).forEach(key => keys.add(key))
    })
    return Array.from(keys).sort()
  }

  private formatSpecLabel(key: string): string {
    const labels: Record<string, string> = {
      keys: 'Number of Keys',
      pedals: 'Number of Pedals',
      voices: 'Voices',
      polyphony: 'Polyphony',
      actionType: 'Action Type',
      soundEngine: 'Sound Engine',
      weight: 'Weight',
      dimensions: 'Dimensions'
    }
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }
}

export class PianoRecommendationEngine {
  private pianos: any[]

  constructor(pianos: any[]) {
    this.pianos = pianos
  }

  recommend(criteria: {
    budget?: number
    experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
    usage?: 'practice' | 'performance' | 'recording' | 'teaching'
    space?: 'apartment' | 'house' | 'studio' | 'concert-hall'
    preferences?: string[]
  }): any[] {
    return this.pianos
      .map(piano => ({
        ...piano,
        score: this.calculateScore(piano, criteria)
      }))
      .filter(piano => piano.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  private calculateScore(piano: any, criteria: any): number {
    let score = 50 // Base score

    // Budget scoring
    if (criteria.budget) {
      const price = piano.pricing?.salePrice || piano.pricing?.msrp
      if (price) {
        if (price <= criteria.budget) {
          score += 20
        } else if (price <= criteria.budget * 1.2) {
          score += 10
        } else {
          score -= 30
        }
      }
    }

    // Experience level scoring
    if (criteria.experience) {
      const experienceScores = this.getExperienceScores(piano, criteria.experience)
      score += experienceScores
    }

    // Usage scoring
    if (criteria.usage) {
      const usageScores = this.getUsageScores(piano, criteria.usage)
      score += usageScores
    }

    // Space scoring
    if (criteria.space) {
      const spaceScores = this.getSpaceScores(piano, criteria.space)
      score += spaceScores
    }

    // Preferences scoring
    if (criteria.preferences && criteria.preferences.length > 0) {
      const preferenceScores = this.getPreferenceScores(piano, criteria.preferences)
      score += preferenceScores
    }

    return Math.max(0, score)
  }

  private getExperienceScores(piano: any, experience: string): number {
    const typeScores = {
      beginner: {
        digital: 15,
        upright: 10,
        grand: -10,
        hybrid: 5,
        silent: 8
      },
      intermediate: {
        digital: 5,
        upright: 10,
        grand: 5,
        hybrid: 15,
        silent: 12
      },
      advanced: {
        digital: 0,
        upright: 5,
        grand: 15,
        hybrid: 10,
        silent: 8
      },
      professional: {
        digital: -5,
        upright: 0,
        grand: 20,
        hybrid: 5,
        silent: 3
      }
    }

    return typeScores[experience as keyof typeof typeScores]?.[piano.pianoType as keyof typeof typeScores.beginner] || 0
  }

  private getUsageScores(piano: any, usage: string): number {
    const usageScores = {
      practice: {
        digital: 15,
        silent: 20,
        upright: 10,
        hybrid: 12,
        grand: 5
      },
      performance: {
        grand: 20,
        upright: 8,
        hybrid: 10,
        digital: 5,
        silent: 3
      },
      recording: {
        grand: 18,
        digital: 15,
        hybrid: 12,
        upright: 8,
        silent: 5
      },
      teaching: {
        upright: 15,
        digital: 12,
        grand: 10,
        hybrid: 8,
        silent: 6
      }
    }

    return usageScores[usage as keyof typeof usageScores]?.[piano.pianoType as keyof typeof usageScores.practice] || 0
  }

  private getSpaceScores(piano: any, space: string): number {
    const spaceScores = {
      apartment: {
        digital: 20,
        silent: 18,
        upright: 10,
        hybrid: 8,
        grand: -15
      },
      house: {
        upright: 15,
        grand: 10,
        hybrid: 12,
        digital: 8,
        silent: 10
      },
      studio: {
        grand: 15,
        digital: 12,
        hybrid: 10,
        upright: 8,
        silent: 5
      },
      'concert-hall': {
        grand: 25,
        upright: 5,
        hybrid: 3,
        digital: 0,
        silent: -5
      }
    }

    return spaceScores[space as keyof typeof spaceScores]?.[piano.pianoType as keyof typeof spaceScores.apartment] || 0
  }

  private getPreferenceScores(piano: any, preferences: string[]): number {
    let score = 0
    
    preferences.forEach(preference => {
      if (piano.features?.includes(preference)) score += 5
      if (piano.series?.name?.toLowerCase().includes(preference.toLowerCase())) score += 8
      if (piano.innovations?.some((i: any) => i.innovation?.name?.toLowerCase().includes(preference.toLowerCase()))) score += 10
    })

    return score
  }
}

export function createPianoSelectionWizard() {
  return {
    steps: [
      {
        id: 'budget',
        title: 'What is your budget?',
        type: 'range',
        options: [
          { label: 'Under $5,000', value: 5000 },
          { label: '$5,000 - $15,000', value: 15000 },
          { label: '$15,000 - $30,000', value: 30000 },
          { label: '$30,000 - $60,000', value: 60000 },
          { label: 'Over $60,000', value: 100000 }
        ]
      },
      {
        id: 'experience',
        title: 'What is your playing experience?',
        type: 'single',
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Professional', value: 'professional' }
        ]
      },
      {
        id: 'usage',
        title: 'How will you primarily use the piano?',
        type: 'single',
        options: [
          { label: 'Practice at home', value: 'practice' },
          { label: 'Performance', value: 'performance' },
          { label: 'Recording', value: 'recording' },
          { label: 'Teaching', value: 'teaching' }
        ]
      },
      {
        id: 'space',
        title: 'Where will the piano be placed?',
        type: 'single',
        options: [
          { label: 'Apartment', value: 'apartment' },
          { label: 'House', value: 'house' },
          { label: 'Studio', value: 'studio' },
          { label: 'Concert Hall', value: 'concert-hall' }
        ]
      },
      {
        id: 'preferences',
        title: 'Any specific preferences?',
        type: 'multiple',
        options: [
          { label: 'Touch sensitivity', value: 'touch sensitivity' },
          { label: 'Silent practice', value: 'silent' },
          { label: 'Recording capability', value: 'recording' },
          { label: 'Traditional feel', value: 'traditional' },
          { label: 'Modern features', value: 'modern' },
          { label: 'Compact size', value: 'compact' }
        ]
      }
    ]
  }
}