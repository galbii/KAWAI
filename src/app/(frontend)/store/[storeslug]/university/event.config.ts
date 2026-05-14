// ─── Types ────────────────────────────────────────────────────────────────────

export interface Piano {
  name: string
  model: string
  category: string
  price: string
  originalPrice: string
  savings: string
  monthlyPayment: string
  remaining: string
  features: string[]
  badge: string
  image: string
  webpImage?: string
  fallbackImage?: string
}

export interface Review {
  name: string
  location: string
  text: string
  timeAgo: string
  rating?: number
}

export interface LifestyleItem {
  title: string
  subtitle: string
  icon: string
  gradient: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ScheduleDay {
  day: string
  time: string
  highlight?: boolean
}

export interface Offer {
  icon: string
  title: string
  desc: string
}

export interface HeroFeature {
  label: string
  description: string
}

export interface ValueProp {
  icon: 'graduation-cap' | 'piano' | 'shield'
  title: string
  description: string
}

export interface Guarantee {
  title: string
  description: string
}

export interface ActivityFeedItem {
  name: string
  action: string
  timeAgo: string
}

export interface StatItem {
  value: string
  label: string
}

export interface LocationConfig {
  venueName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email?: string
  googleMapsEmbedUrl?: string
  constantContactFormId?: string
  hours: ScheduleDay[]
}

export interface TrackingConfig {
  pageName: string
  posthogEventName: string
  posthogModalEventName: string
  constantContactList: string
  constantContactListDescription: string
  utmCampaign: string
  utmSource: string
  metaPixel: {
    contentName: string
    contentNameModal: string
    contentCategory: string
    value: number
    currency: string
  }
}

export interface SeoConfig {
  title: string
  description: string
  ogImage: string
  priceRange: string
  ratingValue: number
  reviewCount: number
}

export interface StructuredDataAddressConfig {
  street: string
  city: string
  state: string
  zip: string
}

export interface UniversityEventConfig {
  // Identity
  eventName: string
  partnerName: string
  partnerShortName: string
  partnerLogoUrl: string
  kawaiLogoUrl: string

  // Dates
  eventStartDate: string    // ISO datetime
  eventEndDate: string      // ISO datetime
  eventDateDisplay: string  // Human-readable

  // Hero
  hero: {
    videoSources: { src: string; type: string }[]
    videoStartTime: number
    heroGradient: string
    mobileOverlay: string
    ghostWatermarkText: string
    headline: string
    subtext: string
    supportText: string
    features: HeroFeature[]
    primaryCtaLabel: string
    secondaryCtaLabel: string
    secondaryCtaScrollTarget: string
  }

  // Booking
  calendlyUrl: string

  // Location (event venue)
  eventLocation: LocationConfig

  // Business (showroom)
  businessLocation: LocationConfig

  // Schedule
  schedule: ScheduleDay[]

  // Offers
  offers: Offer[]

  // Value props
  valueProps: ValueProp[]
  valuePropsPhone: string
  valuePropsNote: string

  // Authority / trust
  authorityQuote: {
    text: string
    author: string
    role: string
  }
  guarantees: Guarantee[]

  // Social proof
  stats: StatItem[]
  activityFeed: ActivityFeedItem[]

  // Content
  pianos: Piano[]
  faqs: FAQItem[]
  testimonials: Review[]
  lifestyleItems: LifestyleItem[]

  // Tracking
  tracking: TrackingConfig

  // SEO
  seo: SeoConfig

  // Structured data
  structuredData: {
    businessName: string
    businessUrl: string
    businessAddress: StructuredDataAddressConfig
    businessPhone: string
    coordinates: { lat: number; lng: number }
    images: string[]
    eventLocationName: string
    eventAddress: StructuredDataAddressConfig
    startPrice: string
  }
}

// ─── TSU 2025 Config ──────────────────────────────────────────────────────────

export const TSU_2025: UniversityEventConfig = {
  eventName: 'TSU Piano Sale',
  partnerName: 'Texas Southern University',
  partnerShortName: 'TSU',
  partnerLogoUrl:
    'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/logo_-texas-christian-university-horned-frogs-tcu-frog.webp',
  kawaiLogoUrl: '/images/Kawai (Red)(2).png',

  eventStartDate: '2025-12-04T10:00:00',
  eventEndDate: '2025-12-07T17:00:00',
  eventDateDisplay: 'December 4 – 7, 2025',

  hero: {
    videoSources: [
      { src: '/videos/CA.webm', type: 'video/webm' },
      { src: '/videos/CA.mp4', type: 'video/mp4' },
    ],
    videoStartTime: 13.1,
    heroGradient:
      'linear-gradient(100deg, rgba(77,25,121,0.96) 0%, rgba(77,25,121,0.88) 28%, rgba(60,18,96,0.52) 50%, rgba(50,12,80,0.14) 66%, transparent 80%)',
    mobileOverlay: 'rgba(77,25,121,0.45)',
    ghostWatermarkText: 'Piano\nSale',
    headline: 'Piano Sale',
    subtext:
      'Book your appointment for special event pricing on a wide variety of Kawai pianos — with free delivery and tuning.',
    supportText: 'Your purchase supports the TCU Music Department',
    features: [
      { label: 'Digital Piano Rebates', description: 'Get up to $400 off' },
      { label: 'Financing', description: '36 months\n0% APR' },
      { label: 'Exclusive TCU Pricing', description: 'Up to 10% Off MSRP' },
    ],
    primaryCtaLabel: 'Book Appointment',
    secondaryCtaLabel: 'View Collection',
    secondaryCtaScrollTarget: 'featured-deals',
  },

  calendlyUrl: 'https://calendly.com/kawaipianogallery/uta-x-kawai-piano-sale-clone',

  eventLocation: {
    venueName: 'C.S. Lane Home Economics Center at Texas Southern University',
    address: '3100 Cleburne St',
    city: 'Houston',
    state: 'TX',
    zip: '77004',
    phone: '(713) 904-0001',
    email: 'info@kawaipianosdallas.com',
    constantContactFormId: '3ba8c9c8-796d-41fd-987f-7a506d7e03be',
    hours: [
      { day: 'Wednesday, Dec 4', time: '10:00 AM – 7:00 PM', highlight: false },
      { day: 'Thursday, Dec 5', time: '10:00 AM – 7:00 PM', highlight: true },
      { day: 'Friday, Dec 6', time: '10:00 AM – 7:00 PM', highlight: false },
      { day: 'Sunday, Dec 7', time: '12:00 PM – 5:00 PM', highlight: false },
    ],
  },

  businessLocation: {
    venueName: 'KAWAI Piano Gallery',
    address: '601 W. Plano Parkway, Suite 153',
    city: 'Plano',
    state: 'TX',
    zip: '75075',
    phone: '(713) 904-0001',
    email: 'info@kawaipianosdallas.com',
    hours: [
      { day: 'Wednesday–Friday', time: '10:00 AM – 7:00 PM' },
      { day: 'Sunday', time: '12:00 PM – 5:00 PM' },
    ],
  },

  schedule: [
    { day: 'Wednesday, Dec 4', time: '10:00 AM - 7:00 PM', highlight: false },
    { day: 'Thursday, Dec 5', time: '10:00 AM - 7:00 PM', highlight: true },
    { day: 'Friday, Dec 6', time: '10:00 AM - 7:00 PM', highlight: false },
    { day: 'Sunday, Dec 7', time: '12:00 PM - 5:00 PM', highlight: false },
  ],

  offers: [
    { icon: '💰', title: 'Up to 40% off select models', desc: 'Premium upright and grand pianos' },
    { icon: '🚚', title: 'Free delivery within 50 miles', desc: 'Professional setup included' },
    { icon: '🛡️', title: 'Extended warranty available', desc: 'Up to 10 years coverage' },
    { icon: '🔄', title: 'Trade-in program', desc: 'Upgrade your current instrument' },
  ],

  valueProps: [
    {
      icon: 'graduation-cap',
      title: 'University Pricing',
      description:
        'Exclusive pricing available through our partnership with Texas Southern University. TSU students, faculty, and staff receive additional discounts.',
    },
    {
      icon: 'piano',
      title: 'Premium Selection',
      description:
        'Access to our full inventory of digital pianos, upright acoustics, and grand pianos — all faculty-approved for quality.',
    },
    {
      icon: 'shield',
      title: 'Protection & Support',
      description:
        'Every piano includes comprehensive warranty coverage, free delivery, and lifetime tuning support from our certified technicians.',
    },
  ],
  valuePropsPhone: '(713) 904-0001',
  valuePropsNote: 'Limited Houston appointment slots – TSU priority access',

  authorityQuote: {
    text: 'Our partnership with Kawai ensures that our students and the Houston community have access to exceptional piano quality at prices that make musical education accessible to everyone.',
    author: 'Dr. Marcus Williams',
    role: 'Chair, Music Department',
  },
  guarantees: [
    { title: '10-Year Comprehensive Warranty', description: 'Full coverage on all instruments' },
    { title: 'Authorized Piano Gallery', description: 'Official Kawai dealer and service center' },
    { title: '30-Day Satisfaction Guarantee', description: 'Exchange or return, no questions asked' },
  ],

  stats: [
    { value: '847', label: 'Happy Families' },
    { value: '200+', label: 'TSU Students Served' },
    { value: '15+', label: 'Years Serving Houston' },
    { value: '48', label: 'Pianos Remaining' },
  ],

  activityFeed: [
    { name: 'Sarah M.', action: 'booked a consultation', timeAgo: '2 min ago' },
    { name: 'James T.', action: 'reserved an ES120', timeAgo: '5 min ago' },
    { name: 'Linda K.', action: 'scheduled a viewing', timeAgo: '8 min ago' },
    { name: 'Robert P.', action: 'booked a consultation', timeAgo: '12 min ago' },
    { name: 'Angela R.', action: 'reserved a GL10', timeAgo: '15 min ago' },
    { name: 'Michael S.', action: 'scheduled a viewing', timeAgo: '20 min ago' },
  ],

  pianos: [
    {
      name: 'Kawai ES120 Digital Piano',
      model: 'ES120',
      category: 'Digital',
      price: '$949',
      originalPrice: '$1,099',
      savings: '$150',
      monthlyPayment: '$79',
      remaining: '3 more',
      features: ['88 Weighted Keys', 'Premium Sound Engine', 'Bluetooth Ready', 'University Approved'],
      badge: 'STUDENT FAVORITE',
      image: '/images/optimized/pianos/es120.webp',
      webpImage: '/images/optimized/pianos/es120.webp',
      fallbackImage: '/images/optimized/pianos/es120.jpg',
    },
    {
      name: 'Kawai ES520 Digital Piano',
      model: 'ES520',
      category: 'Digital Premium',
      price: '$999',
      originalPrice: '$1,399',
      savings: '$400',
      monthlyPayment: '$83',
      remaining: '5 more',
      features: ['88 Keys', 'Bluetooth Ready', 'App Compatible', 'Faculty Choice'],
      badge: 'BEST VALUE',
      image: '/images/optimized/pianos/ES520W_above_1200.webp',
      webpImage: '/images/optimized/pianos/ES520W_above_1200.webp',
      fallbackImage: '/images/optimized/pianos/ES520W_above_1200.jpg',
    },
    {
      name: 'K200 Upright Acoustic Piano',
      model: 'K200',
      category: 'Upright',
      price: '$6,390',
      originalPrice: '$8,395',
      savings: '$2,005',
      monthlyPayment: '$532',
      remaining: '2 more',
      features: ['Perfect Home Size', 'Rich Acoustic Tone', 'University Standard', 'Free Setup'],
      badge: 'FAMILY FAVORITE',
      image: '/images/optimized/pianos/K-200_EP_styling_1200.webp',
      webpImage: '/images/optimized/pianos/K-200_EP_styling_1200.webp',
      fallbackImage: '/images/optimized/pianos/K-200_EP_styling_1200.jpg',
    },
    {
      name: 'GL10 Grand Piano',
      model: 'GL10',
      category: 'Grand',
      price: '$12,950',
      originalPrice: '$18,995',
      savings: '$6,045',
      monthlyPayment: '$1,079',
      remaining: '1 more',
      features: ['Performance Grade', 'Concert Quality', 'Faculty Approved', 'White Glove Delivery'],
      badge: 'PREMIUM SELECTION',
      image: '/images/optimized/pianos/GL10_1200.webp',
      webpImage: '/images/optimized/pianos/GL10_1200.webp',
      fallbackImage: '/images/optimized/pianos/GL10_1200.jpg',
    },
  ],

  faqs: [
    {
      question: 'Where can I find piano sales in Houston?',
      answer:
        'Our KAWAI piano sales Houston event at our Piano Gallery offers the best selection of digital and acoustic pianos in the Greater Houston Area. We\'re Houston\'s trusted Piano Gallery with over 5 years of partnership with TSU.',
    },
    {
      question: 'Do you have used pianos for sale in Houston?',
      answer:
        'Yes! Our Houston piano sale event features both new and carefully selected used pianos Houston families love. All used pianos are inspected by TSU music faculty and come with warranties. Prices start at $949 for digital pianos.',
    },
    {
      question: 'What piano deals are available in Houston during the event?',
      answer:
        'Piano deals Houston residents can save up to $6,000 on premium KAWAI instruments. Our event features special pricing on digital pianos, upright pianos, and grand pianos, plus free delivery and tuning for VIP early access customers. Limited quantities available — only 25 consultation slots for guaranteed first selection.',
    },
    {
      question: 'Do you offer piano lessons in Houston area?',
      answer:
        'While our primary focus is piano sales Houston, we can connect you with qualified piano teachers in the Houston area through our TSU Music Department partnership. Many of our piano customers also take advantage of piano lessons Houston has to offer.',
    },
    {
      question: 'Where is your Houston piano store located?',
      answer:
        'Our Houston piano sale event takes place at our KAWAI Piano Gallery Houston showroom at 601 W. Plano Parkway, Suite 153. As Houston\'s premier Piano Gallery, our convenient location makes it easy for Greater Houston Area families to shop for pianos.',
    },
    {
      question: 'What types of pianos are available at your Houston location?',
      answer:
        'Our piano store Houston event features KAWAI digital pianos, upright acoustic pianos, and grand pianos. From compact ES-120 models perfect for apartments to full-size GL-10 grand pianos, we have options for every Houston piano family.',
    },
    {
      question: 'Do you provide financing for piano purchases in Houston?',
      answer:
        'Yes! We offer financing options for our piano sales Houston event. Monthly payments start as low as $79 for digital pianos. VIP consultation customers receive priority approval and exclusive financing terms. Limited-time special rates available only during this event.',
    },
    {
      question: 'What makes your Houston piano sale different from other galleries?',
      answer:
        'Our partnership with Texas Southern University\'s Music Department ensures every piano meets institutional quality standards. Unlike other Piano Galleries Houston offers, our instruments are faculty-approved and your purchase directly supports TSU\'s music programs through our ongoing partnership.',
    },
    {
      question: 'How do I get priority booking for the Houston event?',
      answer:
        'TSU students, faculty, and staff receive automatic priority booking privileges. With only 15 VIP consultation slots available for Day 1 early access, we recommend booking within 48 hours to guarantee your preferred time slot and first selection of our premium Houston inventory.',
    },
    {
      question: 'How do I secure priority access to the best piano deals?',
      answer:
        'VIP consultation bookings receive guaranteed first selection privileges and early access to our premium inventory. With only 25 consultation slots available, booking early ensures you get priority access to the most sought-after instruments and exclusive early bird pricing.',
    },
  ],

  testimonials: [
    {
      name: 'Jennifer M.',
      location: 'Katy',
      text: 'Outstanding service! The university partnership really shows in the quality and expertise. Our daughter loves her new Kawai piano.',
      timeAgo: '1 week ago',
      rating: 5,
    },
    {
      name: 'David L.',
      location: 'Sugar Land',
      text: 'Professional, knowledgeable, and patient. They helped us choose the perfect piano for our family. Highly recommended!',
      timeAgo: '2 weeks ago',
      rating: 5,
    },
    {
      name: 'Maria R.',
      location: 'Houston',
      text: 'The consultation was invaluable. Their expertise and the university connection gave us confidence in our investment.',
      timeAgo: '3 weeks ago',
      rating: 5,
    },
  ],

  lifestyleItems: [
    { title: 'Concert Halls', subtitle: 'World-class venues', icon: '🎼', gradient: 'from-purple-600 to-blue-600' },
    { title: 'Master Craftsmen', subtitle: '90+ years expertise', icon: '🔨', gradient: 'from-amber-600 to-orange-600' },
    { title: 'Recording Studios', subtitle: 'Professional sound', icon: '🎤', gradient: 'from-green-600 to-emerald-600' },
    { title: 'Family Homes', subtitle: 'Cherished moments', icon: '🏠', gradient: 'from-rose-600 to-pink-600' },
    { title: 'Music Schools', subtitle: 'Next generation', icon: '🎹', gradient: 'from-blue-600 to-indigo-600' },
    { title: 'Concert Artists', subtitle: 'Global performers', icon: '⭐', gradient: 'from-yellow-600 to-amber-600' },
  ],

  tracking: {
    pageName: 'kawai_piano_sale_landing',
    posthogEventName: 'tsu_piano_booking',
    posthogModalEventName: 'tsu_piano_booking_modal',
    constantContactList: 'TSU2025',
    constantContactListDescription: 'TSU Piano Sale 2025 - Event consultation bookings',
    utmCampaign: 'tsu-piano-sale-2025',
    utmSource: 'kawai-landing-page',
    metaPixel: {
      contentName: 'TSU Piano Sale Consultation',
      contentNameModal: 'TSU Piano Sale Consultation (Modal)',
      contentCategory: 'appointment_booking',
      value: 1000,
      currency: 'USD',
    },
  },

  seo: {
    title: 'Piano Sales Houston | KAWAI Piano Deals & Used Pianos | TSU Event Dec 2025',
    description:
      'Houston piano sales event featuring KAWAI digital & acoustic pianos. Save up to $6,000 on new & used pianos. Piano deals Houston - TSU partnership Dec 4-7, 2025 at C.S. Lane Home Economics Center. Free delivery!',
    ogImage: '/images/optimized/misc/kawai-piano-hands_1200.webp',
    priceRange: '$949-$18,995',
    ratingValue: 4.9,
    reviewCount: 127,
  },

  structuredData: {
    businessName: 'KAWAI Piano Sales Houston – TSU Partnership Event',
    businessUrl: 'https://www.kawaius.com',
    businessAddress: {
      street: '601 W. Plano Parkway, Suite 153',
      city: 'Plano',
      state: 'TX',
      zip: '75075',
    },
    businessPhone: '+1-713-904-0001',
    coordinates: { lat: 33.0198, lng: -96.6989 },
    images: [
      '/images/optimized/misc/kawai-piano-hands_1200.webp',
      '/images/optimized/pianos/GL10_1200.webp',
      '/images/optimized/pianos/K-200_EP_styling_1200.webp',
    ],
    eventLocationName: 'C.S. Lane Home Economics Center at Texas Southern University',
    eventAddress: {
      street: '3100 Cleburne St',
      city: 'Houston',
      state: 'TX',
      zip: '77004',
    },
    startPrice: '949',
  },
}
