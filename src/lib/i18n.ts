// Internationalization support for global Kawai presence

export interface LocaleConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  currency: string
  currencySymbol: string
  region: string
  rtl?: boolean
}

export interface TranslationKeys {
  // Navigation
  'nav.home': string
  'nav.pianos': string
  'nav.series': string
  'nav.artists': string
  'nav.technology': string
  'nav.heritage': string
  'nav.dealers': string
  'nav.support': string

  // Common
  'common.price': string
  'common.currency': string
  'common.specifications': string
  'common.features': string
  'common.learn_more': string
  'common.contact_dealer': string
  'common.request_quote': string
  'common.compare': string
  'common.favorite': string
  'common.share': string
  'common.download_brochure': string

  // Piano Types
  'piano.type.grand': string
  'piano.type.upright': string
  'piano.type.digital': string
  'piano.type.hybrid': string
  'piano.type.silent': string

  // Piano Specifications
  'spec.keys': string
  'spec.pedals': string
  'spec.voices': string
  'spec.polyphony': string
  'spec.dimensions': string
  'spec.weight': string
  'spec.action_type': string
  'spec.sound_engine': string
  'spec.finishes': string

  // Search and Filters
  'search.placeholder': string
  'filter.type': string
  'filter.series': string
  'filter.price_range': string
  'filter.clear_all': string
  'filter.apply': string

  // Messages
  'message.no_results': string
  'message.loading': string
  'message.error': string
  'message.success': string

  // Forms
  'form.name': string
  'form.email': string
  'form.phone': string
  'form.message': string
  'form.submit': string
  'form.required': string

  // Piano Details
  'piano.overview': string
  'piano.specifications': string
  'piano.audio_samples': string
  'piano.videos': string
  'piano.awards': string
  'piano.innovations': string
  'piano.artist_endorsements': string
  'piano.availability': string
  'piano.request_demo': string

  // Company
  'company.about': string
  'company.heritage': string
  'company.mission': string
  'company.values': string
  'company.innovation': string
  'company.sustainability': string

  // Contact
  'contact.find_dealer': string
  'contact.authorized_dealers': string
  'contact.customer_service': string
  'contact.technical_support': string
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'en-US',
    name: 'English (United States)',
    nativeName: 'English',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    region: 'North America'
  },
  {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    region: 'Europe'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    region: 'Asia'
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    region: 'Europe'
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    region: 'Europe'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    region: 'Europe'
  },
  {
    code: 'it-IT',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
    region: 'Europe'
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    currency: 'CNY',
    currencySymbol: '¥',
    region: 'Asia'
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    currency: 'KRW',
    currencySymbol: '₩',
    region: 'Asia'
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    region: 'South America'
  },
  {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    currency: 'RUB',
    currencySymbol: '₽',
    region: 'Europe/Asia'
  },
  {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    region: 'Middle East',
    rtl: true
  }
]

export const DEFAULT_LOCALE = 'en-US'

export class I18nManager {
  private currentLocale: string = DEFAULT_LOCALE
  private translations: Map<string, Partial<TranslationKeys>> = new Map()
  private fallbackTranslations: Partial<TranslationKeys> = {}

  constructor() {
    this.loadTranslations()
  }

  private async loadTranslations(): Promise<void> {
    try {
      // Load fallback translations (English)
      const fallback = await import('../translations/en-US.json')
      this.fallbackTranslations = fallback.default

      // Load current locale translations
      if (this.currentLocale !== DEFAULT_LOCALE) {
        await this.loadLocaleTranslations(this.currentLocale)
      }
    } catch (error) {
      console.warn('Failed to load translations:', error)
    }
  }

  private async loadLocaleTranslations(locale: string): Promise<void> {
    try {
      const translations = await import(`../translations/${locale}.json`)
      this.translations.set(locale, translations.default)
    } catch (error) {
      console.warn(`Failed to load translations for locale ${locale}:`, error)
    }
  }

  setLocale(locale: string): void {
    if (!this.isValidLocale(locale)) {
      console.warn(`Invalid locale: ${locale}`)
      return
    }

    this.currentLocale = locale
    this.loadLocaleTranslations(locale)
  }

  getCurrentLocale(): string {
    return this.currentLocale
  }

  getLocaleConfig(locale?: string): LocaleConfig | undefined {
    return SUPPORTED_LOCALES.find(l => l.code === (locale || this.currentLocale))
  }

  isValidLocale(locale: string): boolean {
    return SUPPORTED_LOCALES.some(l => l.code === locale)
  }

  t(key: keyof TranslationKeys, params?: Record<string, string | number>): string {
    const localeTranslations = this.translations.get(this.currentLocale) || {}
    let translation = localeTranslations[key] || this.fallbackTranslations[key] || key

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  formatPrice(price: number, locale?: string): string {
    const localeConfig = this.getLocaleConfig(locale)
    if (!localeConfig) return `$${price.toLocaleString()}`

    return new Intl.NumberFormat(locale || this.currentLocale, {
      style: 'currency',
      currency: localeConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(this.currentLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    })
  }

  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return number.toLocaleString(this.currentLocale, options)
  }

  getRegionalPianos(pianos: any[]): any[] {
    const localeConfig = this.getLocaleConfig()
    if (!localeConfig) return pianos

    return pianos.filter(piano => {
      const availability = piano.availabilityRegions?.find((region: any) => 
        region.region === localeConfig.region || region.region === 'Global'
      )
      return availability?.availability === 'available'
    })
  }

  getLocalizedContent(content: any, field: string): string {
    if (!content) return ''
    
    // Try to get localized version first
    const localizedField = `${field}_${this.currentLocale}`
    if (content[localizedField]) {
      return content[localizedField]
    }

    // Fallback to default language
    const defaultField = `${field}_${DEFAULT_LOCALE}`
    if (content[defaultField]) {
      return content[defaultField]
    }

    // Finally, fallback to the base field
    return content[field] || ''
  }

  detectUserLocale(): string {
    if (typeof navigator === 'undefined') return DEFAULT_LOCALE

    // Try to get user's preferred language
    const userLanguages = [
      navigator.language,
      ...(navigator.languages || [])
    ]

    for (const lang of userLanguages) {
      // Try exact match first
      if (this.isValidLocale(lang)) {
        return lang
      }

      // Try language without region
      const languageCode = lang.split('-')[0]
      const matchedLocale = SUPPORTED_LOCALES.find(locale => 
        locale.code.startsWith(languageCode)
      )
      
      if (matchedLocale) {
        return matchedLocale.code
      }
    }

    return DEFAULT_LOCALE
  }

  getDirectionality(locale?: string): 'ltr' | 'rtl' {
    const config = this.getLocaleConfig(locale)
    return config?.rtl ? 'rtl' : 'ltr'
  }

  getLanguageAlternatives(path: string): Array<{ locale: string; url: string; name: string }> {
    return SUPPORTED_LOCALES.map(locale => ({
      locale: locale.code,
      url: locale.code === DEFAULT_LOCALE ? path : `/${locale.code}${path}`,
      name: locale.nativeName
    }))
  }
}

// Regional pricing support
export class RegionalPricing {
  private exchangeRates: Map<string, number> = new Map()
  private lastUpdated: Date = new Date()

  constructor() {
    this.loadExchangeRates()
  }

  private async loadExchangeRates(): Promise<void> {
    try {
      // In a real implementation, this would fetch from a currency API
      // For now, using static rates
      this.exchangeRates.set('USD', 1.0)
      this.exchangeRates.set('EUR', 0.85)
      this.exchangeRates.set('GBP', 0.73)
      this.exchangeRates.set('JPY', 110.0)
      this.exchangeRates.set('CNY', 6.45)
      this.exchangeRates.set('KRW', 1180.0)
      this.exchangeRates.set('BRL', 5.2)
      this.exchangeRates.set('RUB', 73.0)
      this.exchangeRates.set('SAR', 3.75)
      
      this.lastUpdated = new Date()
    } catch (error) {
      console.warn('Failed to load exchange rates:', error)
    }
  }

  convertPrice(priceUSD: number, targetCurrency: string): number {
    const rate = this.exchangeRates.get(targetCurrency)
    if (!rate) return priceUSD
    
    return priceUSD * rate
  }

  getRegionalPrice(piano: any, locale: string): number {
    const localeConfig = SUPPORTED_LOCALES.find(l => l.code === locale)
    if (!localeConfig) return piano.pricing?.msrp || 0

    const basePrice = piano.pricing?.salePrice || piano.pricing?.msrp || 0
    return this.convertPrice(basePrice, localeConfig.currency)
  }

  formatRegionalPrice(piano: any, locale: string): string {
    const localeConfig = SUPPORTED_LOCALES.find(l => l.code === locale)
    if (!localeConfig) return '$0'

    const price = this.getRegionalPrice(piano, locale)
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: localeConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
}

// SEO support for multiple languages
export function generateHrefLangTags(path: string): Array<{ hrefLang: string; href: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawai-piano.com'
  
  return SUPPORTED_LOCALES.map(locale => ({
    hrefLang: locale.code,
    href: locale.code === DEFAULT_LOCALE 
      ? `${baseUrl}${path}`
      : `${baseUrl}/${locale.code}${path}`
  }))
}

export function getCanonicalUrl(path: string, locale: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawai-piano.com'
  return locale === DEFAULT_LOCALE 
    ? `${baseUrl}${path}`
    : `${baseUrl}/${locale}${path}`
}

// Global instance
export const i18n = new I18nManager()
export const regionalPricing = new RegionalPricing()

// React hooks would go here if this was a React component
export function useTranslation() {
  return {
    t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => i18n.t(key, params),
    locale: i18n.getCurrentLocale(),
    setLocale: (locale: string) => i18n.setLocale(locale),
    formatPrice: (price: number) => i18n.formatPrice(price),
    formatDate: (date: Date | string) => i18n.formatDate(date)
  }
}

export function useRegionalPricing() {
  return {
    convertPrice: (price: number, currency: string) => regionalPricing.convertPrice(price, currency),
    formatRegionalPrice: (piano: any, locale: string) => regionalPricing.formatRegionalPrice(piano, locale)
  }
}