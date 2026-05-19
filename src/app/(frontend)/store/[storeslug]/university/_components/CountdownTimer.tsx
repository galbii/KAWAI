'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollable = documentHeight - windowHeight;

      // If the page isn't scrollable (fits in viewport), show immediately.
      // Guard against NaN/Infinity from division by zero.
      if (scrollable <= 0) {
        setIsVisible(true);
        return;
      }

      const scrollPercentage = (scrollPosition / scrollable) * 100;
      if (scrollPercentage >= 25) {
        setIsVisible(true);
      }
    };

    // Check current position immediately (handles reload-while-scrolled case).
    checkScroll();

    window.addEventListener('scroll', checkScroll, { passive: true });

    // Fallback: show after 4 seconds regardless of scroll, so it's never
    // permanently hidden if the scroll threshold is never reached.
    const fallbackTimer = setTimeout(() => setIsVisible(true), 4000);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      clearTimeout(fallbackTimer);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const targetTimestamp = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const difference = targetTimestamp - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [mounted, targetDate]);

  if (!mounted || !isVisible || isDismissed || isConsultationModalOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '16px',
        zIndex: 2147483647, // max z-index — above everything
        width: '200px',
        backgroundColor: '#0D0714',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '12px',
        boxShadow: '0 0 30px rgba(77,25,121,0.3)',
        padding: '14px',
        // Explicit isolation to prevent stacking context bleed
        isolation: 'isolate',
      }}
    >
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: 'rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <X size={12} />
      </button>

      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4D1979', flexShrink: 0 }} />
        <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)' }}>
          Exclusive Event
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', textAlign: 'center', marginBottom: '10px', gap: '2px' }}>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '3px', fontFamily: 'var(--font-tcu-display)' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Days</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', paddingBottom: '12px' }}>:</div>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '3px', fontFamily: 'var(--font-tcu-display)' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Hrs</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.30)', paddingBottom: '12px' }}>:</div>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '3px', fontFamily: 'var(--font-tcu-display)' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>Min</div>
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.40)', textAlign: 'center', marginBottom: '10px' }}>
        Limited spots available
      </div>

      <button
        onClick={onOpenConsultation}
        style={{ display: 'block', width: '100%', background: 'white', color: '#4D1979', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '9px 16px', border: 'none', cursor: 'pointer', textAlign: 'center', borderRadius: '2px' }}
      >
        Book Now
      </button>
    </div>,
    document.body,
  );
}
