'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

interface CountdownTimerProps {
  targetDate: string;
  onOpenConsultation: () => void;
  isConsultationModalOpen: boolean;
}

export function CountdownTimer({ targetDate, onOpenConsultation, isConsultationModalOpen }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

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
    return undefined;
  }, [hasScrolled, isMinimized, hasBeenDismissed, isVisible]);

  useEffect(() => {
    if (!mounted) return;

    const targetTimestamp = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

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
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [mounted, targetDate]);

  const handleBookNowClick = () => {
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
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6" style={{ paddingRight: '12px', paddingTop: '12px', zIndex: 1050 }}>
        {isVisible && !isConsultationModalOpen && (
          <>
            {isMinimized ? (
              <div
                onClick={handleExpand}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#4D1979',
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
                  zIndex: 999,
                  boxShadow: '0 0 20px rgba(77,25,121,0.4)',
                }}
              >
                <span>...</span>
              </div>
            ) : (
              <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 999,
                  width: '220px',
                  backgroundColor: '#0D0714',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '12px',
                  boxShadow: '0 0 30px rgba(77,25,121,0.3)',
                  padding: '16px',
                }}
              >
                <button
                  onClick={handleMinimize}
                  aria-label="Minimize timer"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: 'rgba(255,255,255,0.30)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
                >
                  <X size={14} />
                </button>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#4D1979',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.70)',
                      }}
                    >
                      Exclusive Event
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr auto 1fr',
                    alignItems: 'center',
                    textAlign: 'center',
                    marginBottom: '12px',
                    gap: '2px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1,
                        marginBottom: '4px',
                        fontFamily: 'var(--font-tcu-display)',
                      }}
                    >
                      {timeLeft.days}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        fontFamily: 'var(--font-tcu-display)',
                        fontWeight: 700,
                      }}
                    >
                      Days
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', paddingBottom: '14px' }}>:</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1,
                        marginBottom: '4px',
                        fontFamily: 'var(--font-tcu-display)',
                      }}
                    >
                      {timeLeft.hours}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        fontFamily: 'var(--font-tcu-display)',
                        fontWeight: 700,
                      }}
                    >
                      Hours
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', paddingBottom: '14px' }}>:</div>
                  <div>
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1,
                        marginBottom: '4px',
                        fontFamily: 'var(--font-tcu-display)',
                      }}
                    >
                      {timeLeft.minutes}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        fontFamily: 'var(--font-tcu-display)',
                        fontWeight: 700,
                      }}
                    >
                      Min
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.45)',
                    textAlign: 'center',
                    marginBottom: '10px',
                  }}
                >
                  Limited spots available
                </div>

                <button
                  onClick={handleBookNowClick}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'white',
                    color: '#4D1979',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  Book Now
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
