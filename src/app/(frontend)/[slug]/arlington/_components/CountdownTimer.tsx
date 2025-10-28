'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, X } from 'lucide-react';
import PianoConsultationDialog from './PianoConsultationDialog';
import QuickContactForm from './QuickContactForm';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

interface CalendlyPrefillData {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [prefillData, setPrefillData] = useState<CalendlyPrefillData | undefined>(undefined);
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

    const targetDate = new Date('2025-11-13T00:00:00').getTime();

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
    // Reset state and open modal with form
    setShowForm(true);
    setPrefillData(undefined);
    setIsModalOpen(true);
  };

  const handleFormSuccess = (data: { email: string; firstName: string; lastName: string }) => {
    console.log('CountdownTimer: Form submitted successfully, showing Calendly with prefill:', data);

    // Set prefill data and hide form
    setPrefillData({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Hide form to show Calendly
    setShowForm(false);
  };

  const handleSkip = () => {
    console.log('CountdownTimer: User skipped form, showing Calendly without prefill');
    setShowForm(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset for next time
    setTimeout(() => {
      setShowForm(true);
      setPrefillData(undefined);
    }, 300);
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6" style={{ paddingRight: '12px', paddingTop: '12px', zIndex: 1050 }}>
        {isVisible && (
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

      {/* Two-Step Booking Modal with Form */}
      {showForm && isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-md w-full p-0 overflow-hidden">
            <DialogTitle className="sr-only">
              Secure Your Spot
            </DialogTitle>
            <div className="p-6">
              <QuickContactForm
                onSuccess={handleFormSuccess}
                onSkip={handleSkip}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Calendly Modal with Prefill */}
      {!showForm && isModalOpen && (
        <PianoConsultationDialog
          isOpen={true}
          onClose={handleCloseModal}
          {...(prefillData ? { prefillData } : {})}
        />
      )}
    </>
  );
}