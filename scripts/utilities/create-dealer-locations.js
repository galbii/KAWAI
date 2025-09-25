// Simple script to create dealer locations manually
// Run with: node create-dealer-locations.js

const dealerLocations = [
  {
    slug: 'dallas-signature',
    locationName: 'Dallas Signature Piano Gallery',
    isActive: true,
    locationText: 'Dallas\'s Premier Piano Gallery',
    establishedText: 'Est. 1985 • Dallas, Texas',
    titlePrefix: 'The',
    titleMain: 'INSTRUMENTAL',
    titleSuffix: 'to Life',
    description: 'Every musician harbors a vision. Every performance seeks perfection. Since 1985, we\'ve been crafting the instruments that transform inspiration into reality. Visit our Dallas showroom and discover why we\'re Texas\'s trusted Kawai piano experts.',
    primaryCta: {
      text: 'View Our Piano Collection',
      link: '/pianos'
    },
    secondaryCta: {
      text: 'Visit Our Dallas Showroom',
      link: '/contact'
    },
    sectionHeader: 'Our Showroom',
    showroomTitle: 'Visit Our Dallas',
    showroomDescription: 'Experience the artistry of Kawai pianos in Texas\'s premier Piano Gallery.',
    showroomInfo: {
      name: 'Kawai Piano Gallery Dallas',
      address: '123 Music Row, Suite 500, Dallas, TX 75201',
      phone: '214-555-0123',
      serviceArea: 'Serving Dallas, Fort Worth, Richardson, Plano & surrounding Texas areas'
    },
    hours: [
      { day: 'Monday', time: '10:00 am–7:00 pm' },
      { day: 'Tuesday', time: '10:00 am–7:00 pm' },
      { day: 'Wednesday', time: '10:00 am–7:00 pm' },
      { day: 'Thursday', time: '10:00 am–7:00 pm' },
      { day: 'Friday', time: '10:00 am–7:00 pm' },
      { day: 'Saturday', time: '10:00 am–6:00 pm' },
      { day: 'Sunday', time: '1:00 pm–5:00 pm' }
    ],
    features: [
      { icon: 'award', title: 'Expert Piano Consultation', description: 'Personalized guidance from our Piano Gallery specialists' },
      { icon: 'piano', title: 'Complete Piano Services', description: 'Professional tuning, repair, and maintenance by certified piano technicians' },
      { icon: 'shield', title: 'Piano Financing Available', description: 'Flexible payment options to make your perfect piano accessible' }
    ],
    showroomCtas: {
      directionsText: 'Get Directions',
      directionsLink: 'https://maps.google.com/?q=Dallas+TX',
      scheduleText: 'Schedule Visit',
      scheduleLink: '/contact/schedule-visit'
    },
    collectionSectionHeader: 'Featured Models',
    collectionTitle: 'Kawai K-500 &\nGX2 Limited Edition',
    collectionDescription: 'Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments',
    collectionCta: {
      text: 'Explore Collection',
      link: '/pianos'
    },
    featuredVideo: {
      youtubeId: '1cmwb6evs2A',
      width: 800,
      height: 500
    },
    contactTitle: 'Find Your Perfect',
    contactTitleHighlight: 'Piano',
    contactDescription: 'Get your free Piano Buying Guide and personalized recommendations from our Dallas Piano Gallery specialists.',
    stepTitles: [
      { step: 'Tell us about your piano journey' },
      { step: 'Help us understand your needs' },
      { step: 'Get your free piano buying guide' }
    ],
    trustMessage: 'Trusted by Dallas area piano families since 1985',
    benefits: [
      { icon: 'shield-check', text: 'Free comprehensive Piano Buying Guide (PDF)' },
      { icon: 'users', text: 'Personalized piano recommendations' },
      { icon: 'award', text: 'Exclusive offers and updates' }
    ],
    formOptions: {
      experienceLevels: [
        { level: 'Beginner' },
        { level: 'Intermediate' },
        { level: 'Advanced' },
        { level: 'Professional' }
      ],
      pianoTypes: [
        { type: 'Acoustic Grand' },
        { type: 'Acoustic Upright' },
        { type: 'Digital Piano' },
        { type: 'Hybrid Piano' },
        { type: 'Not Sure' }
      ],
      budgetRanges: [
        { range: 'Under $5,000' },
        { range: '$5,000 - $15,000' },
        { range: '$15,000 - $35,000' },
        { range: '$35,000 - $75,000' },
        { range: '$75,000+' }
      ],
      primaryUses: [
        { use: 'Learning/Practice' },
        { use: 'Family Entertainment' },
        { use: 'Teaching' },
        { use: 'Performance' },
        { use: 'Recording/Studio' }
      ]
    },
    seo: {
      metaTitle: 'Kawai Piano Gallery Dallas | Premier Piano Gallery Since 1985 | Dallas, TX',
      metaDescription: 'Dallas\'s premier Kawai Piano Gallery since 1985. Explore acoustic & digital pianos at our Dallas Piano Gallery. Expert consultation & service.',
      keywords: 'Kawai pianos, Dallas Piano Gallery, Dallas piano gallery, acoustic pianos, digital pianos, piano showroom, Texas Piano Gallery, piano sales, piano consultation'
    }
  },
  {
    slug: 'exclusive-collection',
    locationName: 'Exclusive Collection Piano Gallery',
    isActive: true,
    locationText: 'Exclusive Collection Piano Gallery',
    establishedText: 'Est. 1990 • Premium Location',
    titlePrefix: 'The',
    titleMain: 'EXCLUSIVE',
    titleSuffix: 'Experience',
    description: 'Discover our most prestigious instruments in an intimate setting designed for the discerning pianist.',
    primaryCta: {
      text: 'View Exclusive Collection',
      link: '/pianos'
    },
    secondaryCta: {
      text: 'Schedule Private Viewing',
      link: '/contact'
    },
    sectionHeader: 'Our Exclusive Gallery',
    showroomTitle: 'Visit Our Exclusive',
    showroomDescription: 'Experience the pinnacle of piano craftsmanship in our exclusive gallery.',
    showroomInfo: {
      name: 'Kawai Exclusive Collection Gallery',
      address: '456 Elite Avenue, Suite 100, Premium District',
      phone: '555-EXCLUSIVE',
      serviceArea: 'Serving exclusive clientele nationwide'
    },
    hours: [
      { day: 'Monday', time: 'By Appointment' },
      { day: 'Tuesday', time: 'By Appointment' },
      { day: 'Wednesday', time: 'By Appointment' },
      { day: 'Thursday', time: 'By Appointment' },
      { day: 'Friday', time: 'By Appointment' },
      { day: 'Saturday', time: 'By Appointment' },
      { day: 'Sunday', time: 'Closed' }
    ],
    features: [
      { icon: 'award', title: 'Private Consultation', description: 'One-on-one sessions with master piano specialists' },
      { icon: 'piano', title: 'Exclusive Instruments', description: 'Rare and limited edition Kawai pianos' },
      { icon: 'shield', title: 'Concierge Service', description: 'White-glove delivery and setup service' }
    ],
    showroomCtas: {
      directionsText: 'Get Directions',
      directionsLink: 'https://maps.google.com/?q=Exclusive+Collection',
      scheduleText: 'Schedule Private Visit',
      scheduleLink: '/contact/exclusive'
    },
    collectionSectionHeader: 'Exclusive Models',
    collectionTitle: 'Limited Edition\nCollection',
    collectionDescription: 'Handpicked instruments representing the absolute finest in piano craftsmanship',
    collectionCta: {
      text: 'View Exclusives',
      link: '/pianos'
    },
    featuredVideo: {
      youtubeId: '1cmwb6evs2A',
      width: 800,
      height: 500
    },
    contactTitle: 'Join Our Exclusive',
    contactTitleHighlight: 'Circle',
    contactDescription: 'Experience the pinnacle of piano excellence.',
    stepTitles: [
      { step: 'Share your musical aspirations' },
      { step: 'Define your exclusive requirements' },
      { step: 'Access our exclusive collection' }
    ],
    trustMessage: 'Trusted by elite musicians and collectors worldwide',
    benefits: [
      { icon: 'shield-check', text: 'Exclusive access to limited editions' },
      { icon: 'users', text: 'Private consultation services' },
      { icon: 'award', text: 'VIP client privileges' }
    ],
    formOptions: {
      experienceLevels: [
        { level: 'Advanced' },
        { level: 'Professional' },
        { level: 'Master' },
        { level: 'Collector' }
      ],
      pianoTypes: [
        { type: 'Concert Grand' },
        { type: 'Limited Edition Grand' },
        { type: 'Artist Series' },
        { type: 'Custom Instrument' }
      ],
      budgetRanges: [
        { range: '$75,000 - $150,000' },
        { range: '$150,000 - $300,000' },
        { range: '$300,000+' },
        { range: 'Investment Grade' }
      ],
      primaryUses: [
        { use: 'Concert Performance' },
        { use: 'Recording Studio' },
        { use: 'Private Collection' },
        { use: 'Investment' }
      ]
    },
    seo: {
      metaTitle: 'Exclusive Collection | Limited Edition Kawai Pianos | Premium Piano Gallery',
      metaDescription: 'Discover rare and limited edition Kawai pianos in our exclusive collection.',
      keywords: 'exclusive pianos, limited edition Kawai, rare pianos, premium piano gallery'
    }
  },
  {
    slug: 'heritage-series',
    locationName: 'Heritage Series Piano Gallery',
    isActive: true,
    locationText: 'Heritage Series Piano Gallery',
    establishedText: 'Celebrating 95+ Years of Excellence',
    titlePrefix: 'The',
    titleMain: 'HERITAGE',
    titleSuffix: 'Collection',
    description: 'Celebrating nearly a century of Kawai craftsmanship with our Heritage Series collection.',
    primaryCta: {
      text: 'Explore Heritage Collection',
      link: '/pianos'
    },
    secondaryCta: {
      text: 'Learn Our History',
      link: '/about'
    },
    sectionHeader: 'Our Heritage Gallery',
    showroomTitle: 'Visit Our Heritage',
    showroomDescription: 'Step into nearly a century of piano making excellence.',
    showroomInfo: {
      name: 'Kawai Heritage Series Gallery',
      address: '789 Legacy Boulevard, Heritage District',
      phone: '555-HERITAGE',
      serviceArea: 'Celebrating heritage and tradition nationwide'
    },
    hours: [
      { day: 'Monday', time: '10:00 am–6:00 pm' },
      { day: 'Tuesday', time: '10:00 am–6:00 pm' },
      { day: 'Wednesday', time: '10:00 am–6:00 pm' },
      { day: 'Thursday', time: '10:00 am–6:00 pm' },
      { day: 'Friday', time: '10:00 am–6:00 pm' },
      { day: 'Saturday', time: '10:00 am–5:00 pm' },
      { day: 'Sunday', time: '12:00 pm–4:00 pm' }
    ],
    features: [
      { icon: 'award', title: 'Heritage Expertise', description: 'Specialists in traditional piano craftsmanship' },
      { icon: 'piano', title: 'Historic Collection', description: 'Instruments spanning 95+ years of innovation' },
      { icon: 'shield', title: 'Legacy Service', description: 'Maintaining traditions of excellence' }
    ],
    showroomCtas: {
      directionsText: 'Get Directions',
      directionsLink: 'https://maps.google.com/?q=Heritage+Series',
      scheduleText: 'Schedule Heritage Tour',
      scheduleLink: '/contact/heritage'
    },
    collectionSectionHeader: 'Heritage Models',
    collectionTitle: 'Classic\nTradition',
    collectionDescription: 'Instruments that honor our legacy while embracing modern innovation',
    collectionCta: {
      text: 'Explore Heritage',
      link: '/pianos'
    },
    featuredVideo: {
      youtubeId: '1cmwb6evs2A',
      width: 800,
      height: 500
    },
    contactTitle: 'Discover Your',
    contactTitleHighlight: 'Heritage',
    contactDescription: 'Connect with our heritage of excellence.',
    stepTitles: [
      { step: 'Share your musical heritage' },
      { step: 'Explore traditional craftsmanship' },
      { step: 'Find your heritage piano' }
    ],
    trustMessage: 'Preserving musical heritage since 1927',
    benefits: [
      { icon: 'shield-check', text: 'Heritage piano expertise' },
      { icon: 'users', text: 'Traditional craftsmanship consultation' },
      { icon: 'award', text: 'Legacy instrument selection' }
    ],
    formOptions: {
      experienceLevels: [
        { level: 'Beginner' },
        { level: 'Intermediate' },
        { level: 'Advanced' },
        { level: 'Professional' }
      ],
      pianoTypes: [
        { type: 'Traditional Grand' },
        { type: 'Classic Upright' },
        { type: 'Heritage Digital' },
        { type: 'Restored Vintage' }
      ],
      budgetRanges: [
        { range: 'Under $10,000' },
        { range: '$10,000 - $25,000' },
        { range: '$25,000 - $50,000' },
        { range: '$50,000+' }
      ],
      primaryUses: [
        { use: 'Traditional Learning' },
        { use: 'Classical Performance' },
        { use: 'Heritage Collection' },
        { use: 'Family Heirloom' }
      ]
    },
    seo: {
      metaTitle: 'Heritage Series Collection | Traditional Kawai Pianos | Classic Piano Gallery',
      metaDescription: 'Discover the Heritage Series collection celebrating 95+ years of Kawai craftsmanship.',
      keywords: 'heritage pianos, traditional Kawai, classic pianos, vintage instruments'
    }
  },
  {
    slug: 'artist-collection',
    locationName: 'Artist Collection Piano Gallery',
    isActive: true,
    locationText: 'Artist Collection Piano Gallery',
    establishedText: 'Inspiring Artists Since 1927',
    titlePrefix: 'The',
    titleMain: 'ARTIST',
    titleSuffix: 'Collection',
    description: 'Instruments chosen by artists, for artists.',
    primaryCta: {
      text: 'View Artist Collection',
      link: '/pianos'
    },
    secondaryCta: {
      text: 'Meet Our Artists',
      link: '/artists'
    },
    sectionHeader: 'Our Artist Gallery',
    showroomTitle: 'Visit Our Artist',
    showroomDescription: 'Experience the instruments that inspire greatness.',
    showroomInfo: {
      name: 'Kawai Artist Collection Gallery',
      address: '321 Artist Way, Musician\'s Quarter',
      phone: '555-ARTIST1',
      serviceArea: 'Supporting artists and musicians nationwide'
    },
    hours: [
      { day: 'Monday', time: '11:00 am–8:00 pm' },
      { day: 'Tuesday', time: '11:00 am–8:00 pm' },
      { day: 'Wednesday', time: '11:00 am–8:00 pm' },
      { day: 'Thursday', time: '11:00 am–8:00 pm' },
      { day: 'Friday', time: '11:00 am–8:00 pm' },
      { day: 'Saturday', time: '10:00 am–6:00 pm' },
      { day: 'Sunday', time: '12:00 pm–5:00 pm' }
    ],
    features: [
      { icon: 'award', title: 'Artist Endorsed', description: 'Instruments chosen by professional musicians' },
      { icon: 'piano', title: 'Performance Ready', description: 'Concert-quality instruments for serious artists' },
      { icon: 'shield', title: 'Artist Support', description: 'Programs and services for performing musicians' }
    ],
    showroomCtas: {
      directionsText: 'Get Directions',
      directionsLink: 'https://maps.google.com/?q=Artist+Collection',
      scheduleText: 'Schedule Artist Session',
      scheduleLink: '/contact/artist'
    },
    collectionSectionHeader: 'Artist Models',
    collectionTitle: 'Artist\nEndorsed',
    collectionDescription: 'The instruments that inspire world-class performances',
    collectionCta: {
      text: 'Explore Artist Collection',
      link: '/pianos'
    },
    featuredVideo: {
      youtubeId: '1cmwb6evs2A',
      width: 800,
      height: 500
    },
    contactTitle: 'Join Our',
    contactTitleHighlight: 'Artists',
    contactDescription: 'Connect with the instruments that inspire greatness.',
    stepTitles: [
      { step: 'Share your artistic journey' },
      { step: 'Define your performance needs' },
      { step: 'Find your artist instrument' }
    ],
    trustMessage: 'Trusted by artists and performers worldwide',
    benefits: [
      { icon: 'shield-check', text: 'Artist-endorsed instruments' },
      { icon: 'users', text: 'Professional musician consultation' },
      { icon: 'award', text: 'Artist program benefits' }
    ],
    formOptions: {
      experienceLevels: [
        { level: 'Advanced Student' },
        { level: 'Emerging Artist' },
        { level: 'Professional' },
        { level: 'Concert Artist' }
      ],
      pianoTypes: [
        { type: 'Concert Grand' },
        { type: 'Performance Grand' },
        { type: 'Studio Grand' },
        { type: 'Artist Digital' }
      ],
      budgetRanges: [
        { range: '$25,000 - $50,000' },
        { range: '$50,000 - $100,000' },
        { range: '$100,000 - $200,000' },
        { range: '$200,000+' }
      ],
      primaryUses: [
        { use: 'Concert Performance' },
        { use: 'Studio Recording' },
        { use: 'Teaching/Masterclass' },
        { use: 'Competition' }
      ]
    },
    seo: {
      metaTitle: 'Artist Collection | Professional Kawai Pianos | Artist-Endorsed Instruments',
      metaDescription: 'Discover instruments chosen by professional artists.',
      keywords: 'artist pianos, professional Kawai, concert pianos, artist endorsed'
    }
  }
]

console.log('Dealer location data ready. Use this data to create dealer locations through the admin panel.')
console.log('Access /admin/collections/dealer-locations and create entries for:')
dealerLocations.forEach((location, index) => {
  console.log(`${index + 1}. ${location.locationName} (slug: ${location.slug})`)
})