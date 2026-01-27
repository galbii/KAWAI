'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, X } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

interface CountdownTimerProps {
  onOpenConsultation: () => void;
  isConsultationModalOpen: boolean;
}

export function CountdownTimer({ onOpenConsultation, isConsultationModalOpen }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll and show timer based on scroll amount
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      // Show timer when user has scrolled 25% or more and hasn't been shown yet
      if (scrollPercentage >= 25 && !hasScrolled && !hasBeenDismissed) {
        console.log('🎯 User scrolled 25% - showing countdown timer');
        setHasScrolled(true);
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, hasScrolled, hasBeenDismissed]);

  // Auto-expand timer after it becomes visible
  useEffect(() => {
    if (hasScrolled && isMinimized && !hasBeenDismissed && isVisible) {
      console.log('🚀 Timer is visible - expanding after 3 seconds');

      const timeout = setTimeout(() => {
        console.log('📈 Expanding timer to full view');
        setIsMinimized(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined
  }, [hasScrolled, isMinimized, hasBeenDismissed, isVisible]);

  useEffect(() => {
    if (!mounted) return;

    const targetDate = new Date('2025-12-04T00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [mounted]);

  const handleBookNowClick = () => {
    // Open the shared piano consultation dialog via callback
    onOpenConsultation();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setHasBeenDismissed(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      {/* Hide countdown timer when consultation modal is open */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6" style={{ paddingRight: '12px', paddingTop: '12px', zIndex: 1050 }}>
        {isVisible && !isConsultationModalOpen && (
          <>
            {isMinimized ? (
              // Minimized State - Small circular button
              <div 
                className="timer-minimized"
                onClick={handleExpand}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#800000',
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  zIndex: 999
                }}
              >
                <span>...</span>
              </div>
            ) : (
              // Expanded State - Full timer
              <div className="timer-glassmorphism group timer-slide-in">
                {/* Close button */}
                <button 
                  className="timer-close-btn"
                  onClick={handleMinimize}
                  aria-label="Minimize timer"
                >
                  <X size={14} />
                </button>

                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 sm:p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-kawai-red timer-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">
                        Exclusive Event
                      </span>
                    </div>
                    
                    {/* Time Display */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-2 sm:mb-3">
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.days}>
                          {timeLeft.days}
                        </div>
                        <div className="timer-label">Days</div>
                      </div>
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.hours}>
                          {timeLeft.hours}
                        </div>
                        <div className="timer-label">Hours</div>
                      </div>
                      <div className="timer-digit-container">
                        <div className="timer-digit" key={timeLeft.minutes}>
                          {timeLeft.minutes}
                        </div>
                        <div className="timer-label">Min</div>
                      </div>
                    </div>

                    {/* Limited Spots */}
                    <div className="timer-limited-spots">
                      Limited spots available
                    </div>

                    {/* CTA */}
                    <div className="timer-cta-button" onClick={handleBookNowClick}>
                      Book Now
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}