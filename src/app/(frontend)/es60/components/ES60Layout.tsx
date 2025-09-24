'use client';

import { useState, useEffect, useRef } from 'react';
import { ES60CTA, FloatingCTA } from './ES60CTA';
import { ES60LoadingStates } from './ES60LoadingStates';
import { ES60ErrorHandling } from './ES60ErrorHandling';
import { ChevronUp, Menu, X } from 'lucide-react';

interface ES60LayoutProps {
  children: React.ReactNode;
  showFloatingCTA?: boolean;
  enableAnalytics?: boolean;
}

interface SectionData {
  id: string;
  title: string;
  component: React.ReactNode;
  priority: 'critical' | 'high' | 'medium' | 'low';
  trackingEnabled?: boolean;
}

export function ES60Layout({ 
  children, 
  showFloatingCTA = true,
  enableAnalytics = true 
}: ES60LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentSection, setCurrentSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Record<string, HTMLElement>>({});

  // Section navigation menu
  const sections = [
    { id: 'hero', title: 'Overview', anchor: '#hero' },
    { id: 'sound-demo', title: 'Sound Demo', anchor: '#sound-demo' },
    { id: 'features', title: 'Features', anchor: '#features' },
    { id: 'value-prop', title: 'Value', anchor: '#value-prop' },
    { id: 'social-proof', title: 'Reviews', anchor: '#social-proof' },
    { id: 'specifications', title: 'Specs', anchor: '#specifications' },
    { id: 'cta', title: 'Get Started', anchor: '#cta' }
  ];

  // Initialize loading and error handling
  useEffect(() => {
    const initializeLayout = async () => {
      try {
        // Simulate initial data loading
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializeLayout();
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setScrollProgress(progress);

      // Track scroll depth milestones for conversion optimization
      if (enableAnalytics && typeof window !== 'undefined' && (window as any).gtag) {
        const milestones = [25, 50, 75, 90];
        milestones.forEach(milestone => {
          if (progress >= milestone && !sessionStorage.getItem(`es60_scroll_${milestone}`)) {
            (window as any).gtag('event', 'scroll_depth', {
              event_category: 'ES60',
              event_label: `${milestone}% Scroll Depth`,
              value: milestone
            });
            sessionStorage.setItem(`es60_scroll_${milestone}`, 'true');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableAnalytics]);

  // Section visibility tracking with Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const isVisible = entry.isIntersecting;
          
          setSectionVisibility(prev => ({
            ...prev,
            [sectionId]: isVisible
          }));

          if (isVisible && entry.intersectionRatio > 0.5) {
            setCurrentSection(sectionId);
            
            // Track section visibility for conversion analysis
            if (enableAnalytics && typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'section_view', {
                event_category: 'ES60',
                event_label: `Section: ${sectionId}`,
                section_id: sectionId
              });
            }
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-50px 0px'
      }
    );

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
        sectionsRef.current[section.id] = element;
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableAnalytics]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Track navigation click
      if (enableAnalytics && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'section_navigation', {
          event_category: 'ES60',
          event_label: `Navigate to: ${sectionId}`
        });
      }
    }
    setIsNavOpen(false);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (enableAnalytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'scroll_to_top', {
        event_category: 'ES60',
        event_label: 'Back to Top'
      });
    }
  };

  if (isLoading) {
    return <ES60LoadingStates variant="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-2xl font-bold text-[#3C3530]">Something went wrong</h1>
          <p className="text-[#6B645C]">We're having trouble loading the ES60 page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#8B7355] text-white px-6 py-3 rounded-lg hover:bg-[#7A6448] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#F5F2ED]">
        <div 
          className="h-full bg-gradient-to-r from-[#8B7355] to-[#9CAF88] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Navigation */}
      <nav className="fixed top-1 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#8B7355]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#3C3530]">Kawai ES60</span>
              <span className="ml-2 text-sm text-[#8B7355] bg-[#8B7355]/10 px-2 py-1 rounded-full">
                $499
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentSection === section.id
                      ? 'bg-[#8B7355] text-white'
                      : 'text-[#3C3530] hover:bg-[#8B7355]/10 hover:text-[#8B7355]'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="md:hidden p-2 rounded-lg text-[#3C3530] hover:bg-[#8B7355]/10"
            >
              {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isNavOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-t border-[#8B7355]/10">
            <div className="px-4 py-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentSection === section.id
                      ? 'bg-[#8B7355] text-white'
                      : 'text-[#3C3530] hover:bg-[#8B7355]/10'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <ES60ErrorHandling>
          {children}
        </ES60ErrorHandling>
      </main>

      {/* Floating Elements */}
      {showFloatingCTA && <FloatingCTA />}

      {/* Scroll to Top Button */}
      {scrollProgress > 20 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 bg-[#8B7355] text-white p-3 rounded-full shadow-lg hover:bg-[#5D4E37] transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Kawai ES60 Digital Piano",
            "brand": {
              "@type": "Brand",
              "name": "Kawai"
            },
            "description": "Premium portable digital piano with authentic touch and Shigeru Kawai concert grand sound at $499",
            "offers": {
              "@type": "Offer",
              "price": "499.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Kawai Piano Gallery St. Louis"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })
        }}
      />
    </div>
  );
}

// Hook for section-specific analytics
export function useSectionAnalytics(sectionId: string, enableAnalytics: boolean = true) {
  const [timeOnSection, setTimeOnSection] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enableAnalytics) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTimeRef.current = Date.now();
          } else if (startTimeRef.current) {
            const timeSpent = Date.now() - startTimeRef.current;
            setTimeOnSection(prev => prev + timeSpent);
            
            // Track time on section
            if (typeof window !== 'undefined' && (window as any).gtag && timeSpent > 2000) {
              (window as any).gtag('event', 'section_engagement', {
                event_category: 'ES60',
                event_label: `Section: ${sectionId}`,
                value: Math.round(timeSpent / 1000),
                custom_parameters: {
                  time_spent: timeSpent,
                  section_id: sectionId
                }
              });
            }
            
            startTimeRef.current = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(sectionId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      if (startTimeRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        setTimeOnSection(prev => prev + timeSpent);
      }
    };
  }, [sectionId, enableAnalytics]);

  return { timeOnSection };
}