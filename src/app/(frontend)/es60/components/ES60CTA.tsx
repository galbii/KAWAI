'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  Download,
  Users,
  Play,
  Shield,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface CTAOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  variant: 'primary' | 'secondary' | 'tertiary';
  urgency?: string;
}

interface ES60CTAProps {
  className?: string;
  compact?: boolean;
  stickyMobile?: boolean;
}

export function ES60CTA({ className = '', compact = false, stickyMobile = false }: ES60CTAProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  // Detect user location for personalized CTAs
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock location detection - in production, use reverse geocoding
          setUserLocation('St. Louis area');
        },
        () => {
          setUserLocation('');
        }
      );
    }
  }, []);

  const handlePrimaryAction = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Track expansion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cta_expand', {
          event_category: 'ES60',
          event_label: 'Primary CTA Expanded'
        });
      }
    }
  };

  const handleTryInStore = () => {
    // Track store visit intent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'store_visit_intent', {
        event_category: 'ES60',
        event_label: 'Try In Store'
      });
    }
    window.location.href = '/contact?action=visit&product=es60&source=landing';
  };

  const handleScheduleDemo = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'demo_schedule_intent', {
        event_category: 'ES60',
        event_label: 'Schedule Video Demo'
      });
    }
    window.location.href = '/contact?action=demo&product=es60&source=landing';
  };

  const handleGetPricing = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pricing_request', {
        event_category: 'ES60',
        event_label: 'Get Pricing Info'
      });
    }
    window.location.href = '/contact?action=pricing&product=es60&source=landing';
  };

  const handleCompare = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'comparison_intent', {
        event_category: 'ES60',
        event_label: 'Compare to Others'
      });
    }
    window.location.href = '/piano-finder?featured=es60&source=landing';
  };

  const primaryOptions: CTAOption[] = [
    {
      id: 'try-store',
      title: userLocation ? `Try in ${userLocation} Store` : 'Try in Store',
      description: 'Feel the authentic touch and hear the premium sound',
      icon: <MapPin className="w-5 h-5" />,
      action: handleTryInStore,
      variant: 'primary',
      urgency: 'In stock now'
    },
    {
      id: 'video-demo',
      title: 'Schedule Video Demo',
      description: 'Personal walkthrough with our piano experts',
      icon: <Calendar className="w-5 h-5" />,
      action: handleScheduleDemo,
      variant: 'primary'
    },
    {
      id: 'pricing',
      title: 'Get Pricing Info',
      description: 'Current pricing and financing options',
      icon: <ArrowRight className="w-5 h-5" />,
      action: handleGetPricing,
      variant: 'secondary',
      urgency: 'Limited time pricing'
    },
    {
      id: 'compare',
      title: 'Compare to Others',
      description: 'See how ES60 stands against competitors',
      icon: <ExternalLink className="w-5 h-5" />,
      action: handleCompare,
      variant: 'secondary'
    }
  ];

  const secondaryActions = [
    {
      title: 'Download Spec Sheet',
      action: () => {
        // Track download
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'spec_download', {
            event_category: 'ES60',
            event_label: 'Spec Sheet Download'
          });
        }
        // Mock download - replace with actual PDF URL
        window.open('/downloads/kawai-es60-specifications.pdf', '_blank');
      },
      icon: <Download className="w-4 h-4" />
    },
    {
      title: 'Find Local Teacher',
      action: () => {
        window.location.href = '/teachers?product=es60&source=landing';
      },
      icon: <Users className="w-4 h-4" />
    },
    {
      title: 'Watch Video Review',
      action: () => {
        // Track video engagement
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'video_view_intent', {
            event_category: 'ES60',
            event_label: 'Video Review'
          });
        }
        window.open('https://youtube.com/watch?v=kawai-es60-review', '_blank');
      },
      icon: <Play className="w-4 h-4" />
    }
  ];

  if (compact) {
    return (
      <div className={`bg-[#FAF8F5] border border-[#8B7355]/20 rounded-2xl p-6 ${className}`}>
        <div className="space-y-4">
          <button
            onClick={handlePrimaryAction}
            className="w-full bg-[#E11922] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#C7161F] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Experience the ES60
          </button>
          <div className="flex items-center justify-center gap-4 text-sm text-[#3C3530]">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>(636) 265-2866</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>30-day return</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${stickyMobile ? 'fixed bottom-0 left-0 right-0 z-50 md:relative' : ''} ${className}`}>
      <div className="bg-[#FAF8F5] border-t border-[#8B7355]/20 md:border md:rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Primary CTA Section */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-[#3C3530]">
              Ready to Experience the ES60?
            </h3>
            <p className="text-[#3C3530]/80 max-w-2xl mx-auto">
              Join thousands of pianists who've discovered professional sound at an accessible price.
            </p>
            
            {!isExpanded ? (
              <button
                onClick={handlePrimaryAction}
                className="inline-flex items-center gap-3 bg-[#E11922] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#C7161F] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Experience the ES60</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {primaryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={option.action}
                      className={`group relative p-4 rounded-xl text-left transition-all duration-300 hover:transform hover:scale-[1.02] ${
                        option.variant === 'primary'
                          ? 'bg-[#E11922] text-white hover:bg-[#C7161F] shadow-lg'
                          : 'bg-white border-2 border-[#E11922] text-[#3C3530] hover:bg-[#E11922] hover:text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${option.variant === 'primary' ? 'text-white' : 'text-[#E11922] group-hover:text-white'}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{option.title}</h4>
                            {option.urgency && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                option.variant === 'primary'
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#9CAF88] text-white'
                              }`}>
                                {option.urgency}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            option.variant === 'primary' 
                              ? 'text-white/90' 
                              : 'text-[#3C3530]/70 group-hover:text-white/90'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Actions */}
          {isExpanded && (
            <div className="border-t border-[#8B7355]/20 pt-6">
              <div className="flex flex-wrap justify-center gap-4">
                {secondaryActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="inline-flex items-center gap-2 text-[#E11922] hover:text-[#C7161F] font-medium transition-colors duration-200"
                  >
                    {action.icon}
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trust Signals & Contact */}
          <div className="border-t border-[#8B7355]/20 pt-6 space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#3C3530]/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E11922]" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E11922]" />
                <span>Authorized <span style={{ color: '#E11922', fontWeight: 'bold' }}>Kawai</span> dealer</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E11922]" />
                <span>In stock now</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-[#3C3530]">
                <Phone className="w-5 h-5" />
                <span className="font-semibold text-lg">(636) 265-2866</span>
              </div>
              <div className="text-sm text-[#3C3530]/70">
                <div>21 Meadows Circle Drive, Lake St. Louis, MO</div>
                <div>Mon-Fri 10AM-7PM • Sat 10AM-6PM • Sun 1PM-5PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating CTA for mobile
export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsVisible(scrolled > viewportHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-[#E11922] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-[#C7161F]">
        <div>
          <div className="font-semibold">ES60 - <span className="text-[#FAF8F5] bg-[#C7161F] px-2 py-1 rounded text-sm">$499</span></div>
          <div className="text-sm text-white/90">Limited time pricing</div>
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'floating_cta_click', {
                event_category: 'ES60',
                event_label: 'Mobile Floating CTA'
              });
            }
            window.location.href = '/contact?action=demo&product=es60&source=floating-cta';
          }}
          className="bg-white text-[#E11922] px-4 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors"
        >
          Get Demo
        </button>
      </div>
    </div>
  );
}