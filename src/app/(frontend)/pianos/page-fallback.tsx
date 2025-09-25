"use client"

import Link from "next/link"
import { Piano, ArrowRight, Award, Crown, Music, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollAnimation, fadeUpClass } from "@/lib/hooks/useScrollAnimation"
import { useCallback, useEffect, useRef, useState } from "react"
import { getPianosPageData, resolveMediaUrl } from "@/lib/payload"
import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { ErrorBoundary, PianoSectionErrorFallback } from '@/components/ui/error-boundary'
import { 
  PianoLoadingSkeleton, 
  FeaturedCarouselSkeleton, 
  CategorySectionSkeleton,
  LoadingState 
} from '@/components/ui/loading-states'

// Fallback data - original hardcoded data
const fallbackPianoCategories = [
  {
    slug: "grand",
    name: "Acoustic Grand Pianos",
    description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
    image: "/images/piano-categories/grand.jpg",
    priceRange: "$45,000 - $185,000",
    features: ["Millennium III Action", "Carbon Fiber Components", "Neotex Key Surface", "Konami Tuning Pins"],
    icon: Piano,
    badge: "Professional",
    highlight: "GX BLAK Performance Series"
  },
  {
    slug: "upright",
    name: "Acoustic Upright Pianos",
    description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
    image: "/images/piano-categories/upright.png",
    priceRange: "$8,999 - $35,000",
    features: ["Extended Length Keys", "Millennium III Prep", "Soft-Close Fallboard", "Premium Hammers"],
    icon: Music,
    badge: "Classic",
    highlight: "K Professional Series"
  },
  {
    slug: "digital",
    name: "Digital Pianos",
    description: "Cutting-edge digital instruments with authentic piano touch and sound",
    image: "/images/piano-categories/digital.png",
    priceRange: "$1,999 - $12,999",
    features: ["Grand Feel III Action", "Harmonic Imaging XL", "Onkyo Audio", "Bluetooth Connectivity"],
    icon: Zap,
    badge: "Innovation",
    highlight: "Concert Artist Series"
  },
  {
    slug: "hybrid",
    name: "Hybrid Pianos",
    description: "Revolutionary instruments combining acoustic action with digital versatility",
    image: "/images/piano-categories/hybrid.jpg",
    priceRange: "$12,999 - $24,999",
    features: ["Real Grand Action", "Silent Practice Mode", "Digital Recording", "Millennium III Action"],
    icon: Award,
    badge: "Hybrid Technology",
    highlight: "NOVUS & AnyTime Series"
  }
]

const fallbackFeaturedModels = [
  {
    name: "GX-7 BLAK",
    category: "GX BLAK Performance Series",
    image: "/images/banners/GX-7-BLAK-grand-styling.webp",
    badge: "Performance Series",
    description: "Professional concert grand featuring revolutionary carbon fiber action technology, delivering unprecedented responsiveness and durability for the modern virtuoso."
  },
  {
    name: "CA99",
    category: "Concert Artist Digital",
    image: "/images/banners/CA99-digital-styling.webp",
    badge: "Flagship Digital",
    description: "The ultimate digital piano experience with Grand Feel III wooden-key action and authentic concert grand samples captured in stunning detail."
  },
  {
    name: "NOVUS NV-10S",
    category: "Hybrid Innovation",
    image: "/images/banners/NV10S_along the keyboard_whiteBG.jpg",
    badge: "Revolutionary",
    description: "Revolutionary hybrid piano combining a real grand piano action with advanced digital technology, offering the authentic touch of an acoustic grand with silent practice capabilities."
  }
]

// Image Placeholder Grid Component
function ImagePlaceholderGrid({ category }: { category: string }) {
  const getPlaceholderTheme = (cat: string) => {
    switch (cat) {
      case 'grand':
        return {
          gradient: 'bg-gradient-to-br from-kawai-neutral/15 via-kawai-neutral/8 to-kawai-neutral/3',
          pattern: 'piano-curve',
          description: 'Grand piano showcase placeholder'
        };
      case 'digital':
        return {
          gradient: 'bg-gradient-to-r from-kawai-neutral/12 via-kawai-neutral/6 to-kawai-neutral/4',
          pattern: 'digital-grid',
          description: 'Digital piano showcase placeholder'
        };
      case 'upright':
        return {
          gradient: 'bg-gradient-to-b from-kawai-neutral/10 via-kawai-neutral/8 to-kawai-neutral/5',
          pattern: 'upright-lines',
          description: 'Upright piano showcase placeholder'
        };
      case 'hybrid':
        return {
          gradient: 'bg-gradient-to-tl from-kawai-neutral/14 via-kawai-neutral/7 to-kawai-neutral/3',
          pattern: 'hybrid-blend',
          description: 'Hybrid piano showcase placeholder'
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-kawai-neutral/10 to-kawai-neutral/5',
          pattern: 'default',
          description: 'Piano showcase placeholder'
        };
    }
  };

  const theme = getPlaceholderTheme(category);
  const placeholderCount = 3;

  return (
    <div className="w-full py-8 -mx-6">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
          {Array.from({ length: placeholderCount }, (_, index) => (
            <div
              key={index}
              className={`
                relative w-full h-80 md:h-96 overflow-hidden 
                ${theme.gradient} 
                border border-kawai-neutral/20
                transition-all duration-500 ease-out
                hover:scale-[1.02] hover:shadow-lg hover:border-kawai-neutral/30
                group cursor-default
              `}
              role="img"
              aria-label={`${theme.description} ${index + 1}`}
            >
            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
              {theme.pattern === 'piano-curve' && (
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-kawai-neutral/20 to-transparent rounded-b-xl" />
              )}
              {theme.pattern === 'digital-grid' && (
                <>
                  <div className="absolute top-1/3 left-0 w-full h-px bg-kawai-neutral/30" />
                  <div className="absolute top-2/3 left-0 w-full h-px bg-kawai-neutral/20" />
                  <div className="absolute top-0 left-1/3 w-px h-full bg-kawai-neutral/25" />
                  <div className="absolute top-0 right-1/3 w-px h-full bg-kawai-neutral/25" />
                </>
              )}
              {theme.pattern === 'upright-lines' && (
                <>
                  <div className="absolute top-0 left-1/4 w-px h-full bg-kawai-neutral/30" />
                  <div className="absolute top-0 left-1/2 w-px h-full bg-kawai-neutral/20" />
                  <div className="absolute top-0 right-1/4 w-px h-full bg-kawai-neutral/30" />
                </>
              )}
              {theme.pattern === 'hybrid-blend' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-kawai-neutral/15 to-transparent rounded-tl-xl" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-kawai-neutral/10 to-transparent rounded-br-xl" />
                </>
              )}
            </div>

            {/* Subtle Content Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <Piano className="w-8 h-8 text-kawai-black" />
            </div>

            {/* Future Image Indicator */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-kawai-neutral/40 rounded-full opacity-60" />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

// Featured Piano Carousel Component
function FeaturedPianoCarousel({ models }: { models: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextPiano = useCallback(() => {
    if (isTransitioning || models.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % models.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, models.length]);

  const prevPiano = useCallback(() => {
    if (isTransitioning || models.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, models.length]);

  const goToPiano = (index: number) => {
    if (isTransitioning || index === currentIndex || models.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') prevPiano();
      if (event.key === 'ArrowRight') nextPiano();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPiano, prevPiano]);

  if (models.length === 0) {
    return <FeaturedCarouselSkeleton />
  }

  const currentPiano = models[currentIndex];

  return (
    <div className="relative min-h-[70vh] max-h-[85vh] rounded-2xl overflow-hidden group bg-kawai-black">
      {/* CSS Grid Layout */}
      <div className="grid lg:grid-cols-2 h-full">
        {/* Piano Image Section */}
        <div className="relative order-2 lg:order-1 min-h-[40vh] lg:min-h-full">
          <MediaRenderer
            media={currentPiano.image}
            preset="hero"
            priority
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isTransitioning ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
            }`}
          />
          {/* Subtle overlay for text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Text Content Section */}
        <div className={`relative order-1 lg:order-2 flex items-center justify-center lg:justify-start p-8 lg:p-12 xl:p-16 bg-gradient-to-r from-black/95 via-black/80 to-black/60 lg:bg-gradient-to-l lg:from-black/95 lg:via-black/70 lg:to-transparent transition-all duration-500 ease-out ${
          isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}>
          <div className="max-w-2xl xl:max-w-3xl text-center lg:text-left">
            {currentPiano.badge && (
              <div className="inline-block bg-kawai-red text-white px-4 py-2 rounded-full text-sm font-medium mb-4 lg:mb-6">
                {currentPiano.badge}
              </div>
            )}
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 lg:mb-4 tracking-tight leading-tight">
              {currentPiano.name}
            </h3>
            <p className="text-xl lg:text-2xl xl:text-3xl text-kawai-red font-medium mb-4 lg:mb-6">
              {currentPiano.category}
            </p>
            <p className="text-base lg:text-lg xl:text-xl text-white/90 leading-relaxed mb-8 lg:mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
              {currentPiano.description}
            </p>
            <Link
              href={`/pianos/${currentPiano.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 bg-white hover:bg-kawai-pearl text-kawai-black font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-base lg:text-lg"
            >
              <span>Discover {currentPiano.name}</span>
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {models.length > 1 && (
        <>
          <button
            onClick={prevPiano}
            disabled={isTransitioning}
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-10"
            aria-label="Previous piano"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </button>
          
          <button
            onClick={nextPiano}
            disabled={isTransitioning}
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-10"
            aria-label="Next piano"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {models.length > 1 && (
        <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0 flex space-x-2 z-10">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPiano(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-kawai-red scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to piano ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Animated Section Component for staggered reveals
function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Start heading animation
          setIsHeadingVisible(true);
          
          // Start content animation after delay
          setTimeout(() => {
            setIsContentVisible(true);
          }, 400);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      <div className={`transition-all duration-700 ease-out ${
        isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {children}
      </div>
    </section>
  );
}

// Animated Piano Category Section Component
function PianoCategorySection({ category, index }: { category: any, index: number }) {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Start image animation immediately
          setIsImageVisible(true);
          
          // Start text animation after a delay
          setTimeout(() => {
            setIsTextVisible(true);
          }, 300);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const IconComponent = category.icon;
  const isEven = index % 2 === 0;

  return (
    <section 
      ref={sectionRef}
      className="min-h-[60vh] flex items-center py-8"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Content */}
          <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}>
            <div className={`space-y-4 transition-all duration-700 ease-out ${
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black">
                {category.name}
              </h2>
              
              <p className="text-lg md:text-xl leading-relaxed text-kawai-black/80 max-w-2xl">
                {category.description}
              </p>
            </div>
            
            <div className={`pt-2 transition-all duration-700 ease-out delay-100 ${
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <Link
                href={`/pianos/${category.slug}`}
                className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
              >
                <span>Explore {category.name}</span>
                <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Image/Icon */}
          <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
            <div className={`relative transition-all duration-800 ease-out ${
              isImageVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isEven ? 'translate-x-12' : '-translate-x-12'}`
            }`}>
              <div className="aspect-[4/3] bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 rounded-2xl flex items-center justify-center relative overflow-hidden hover:from-kawai-neutral/30 hover:to-kawai-neutral/50 transition-all duration-300">
                <IconComponent className="h-28 w-28 text-kawai-black/50 transition-transform duration-300 hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Placeholders */}
        <ImagePlaceholderGrid category={category.slug} />
      </div>
    </section>
  );
}

export default function PianosPage() {
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const heroAnimation = useScrollAnimation({ threshold: 0.1 })

  // Load CMS data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPianosPageData()
        if (data) {
          setPageData(data)
        }
      } catch (error) {
        console.error('Error loading CMS data, using fallbacks:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Use fallback data if CMS data is not available
  const heroData = pageData?.hero || {
    heroTitle: "Experience the Complete Kawai Piano Collection",
    heroDescription: "From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.",
    heroBackgroundImage: "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
    heroCta: { text: "Explore Categories", link: "#categories" }
  }

  const featuredData = pageData?.featuredModels || fallbackFeaturedModels
  const categoriesData = pageData?.categories || fallbackPianoCategories
  const ctaData = pageData?.cta || {
    title: "Experience the Difference",
    description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
    ctaText: "Schedule Showroom Visit",
    ctaLink: "/contact/schedule-visit"
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PianoLoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroAnimation.ref as React.RefObject<HTMLElement>} 
        className="relative py-24 lg:py-32 bg-cover bg-no-repeat bg-[url('/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg')] !bg-position-[-60%_center]"
        style={pageData?.hero?.heroBackgroundImage ? {
          backgroundImage: `url('${heroData.heroBackgroundImage}')`,
          backgroundPosition: '-60% center'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-kawai-black mb-6 ${fadeUpClass(heroAnimation.isVisible)}`}>
              {heroData.heroTitle}
            </h1>
            <p className={`text-xl md:text-2xl leading-relaxed text-kawai-black/80 mb-8 ${fadeUpClass(heroAnimation.isVisible, 200)}`}>
              {heroData.heroDescription}
            </p>
            <div className={`${fadeUpClass(heroAnimation.isVisible, 400)}`}>
              <Link
                href={heroData.heroCta?.link || "#categories"}
                className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
              >
                <span>{heroData.heroCta?.text || "Explore Categories"}</span>
                <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Carousel */}
      <AnimatedSection className="py-12 lg:py-16 bg-kawai-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-4">
              {pageData?.featuredModelsSection?.title || "Flagship & Featured Models"}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto">
              {pageData?.featuredModelsSection?.description || "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."}
            </p>
          </div>
          
          <ErrorBoundary fallback={PianoSectionErrorFallback}>
            <FeaturedPianoCarousel models={featuredData} />
          </ErrorBoundary>
        </div>
      </AnimatedSection>

      {/* Piano Categories */}
      <div id="categories" className="bg-kawai-pearl">
        {categoriesData.map((category: any, index: number) => (
          <ErrorBoundary key={category.slug} fallback={PianoSectionErrorFallback}>
            <PianoCategorySection category={category} index={index} />
          </ErrorBoundary>
        ))}
      </div>

      {/* CTA Section */}
      <AnimatedSection className="py-16 lg:py-24 text-center bg-kawai-pearl">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            {ctaData.title}
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            {ctaData.description}
          </p>
          
          <Link
            href={ctaData.ctaLink}
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>{ctaData.ctaText}</span>
            <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}