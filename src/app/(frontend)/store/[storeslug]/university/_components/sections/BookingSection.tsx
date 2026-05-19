'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  fadeUp,
  fadeUpSlow,
  fadeIn,
  scaleReveal,
  lineExpand,
  staggerContainer,
} from '../animations';

interface Offer {
  label: string;
}

interface BookingSectionProps {
  onOpenConsultation: () => void;
  eventDateDisplay: string;
  offers?: Offer[];
}

const DEFAULT_OFFERS: Offer[] = [
  { label: '0% financing · 36 months' },
  { label: 'Free delivery & setup' },
  { label: 'Expert consultation' },
];

export default function BookingSection({ onOpenConsultation, eventDateDisplay, offers = DEFAULT_OFFERS }: BookingSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="booking-consultation" className="border-t border-[rgba(77,25,121,0.12)] py-20 md:py-28" style={{ background: '#FAFAFE' }}>
      <motion.div
        className="max-w-3xl mx-auto px-6 text-center"
        variants={staggerContainer(shouldReduceMotion ? 0 : 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >

        {/* Ornament: line · diamond · line */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          variants={staggerContainer(0.08)}
        >
          <motion.div
            className="h-px w-10"
            style={{ background: 'rgba(77,25,121,0.5)', originX: 0 }}
            variants={lineExpand}
          />
          <motion.div
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: '#4D1979' }}
            variants={scaleReveal}
          />
          <motion.div
            className="h-px w-10"
            style={{ background: 'rgba(77,25,121,0.5)', originX: 1 }}
            variants={lineExpand}
          />
        </motion.div>

        <motion.h2
          className="font-heading italic leading-tight mb-6"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#4D1979' }}
          variants={fadeUpSlow}
        >
          Reserve Your Spot.
        </motion.h2>

        <motion.p
          style={{ color: '#3a2060' }}
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12"
          variants={fadeUp}
        >
          Book a private appointment and lock in exclusive event pricing on Kawai pianos — with free delivery and expert guidance.
        </motion.p>

        {/* Offer pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
          variants={staggerContainer(shouldReduceMotion ? 0 : 0.1)}
        >
          {offers.map((offer) => (
            <motion.span
              key={offer.label}
              className="px-4 py-1.5 rounded-full text-xs tracking-[0.15em] uppercase font-medium"
              style={{ background: 'rgba(77,25,121,0.07)', border: '1px solid rgba(77,25,121,0.2)', color: '#4D1979' }}
              variants={scaleReveal}
            >
              {offer.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-3 group"
          style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '16px 40px', background: '#4D1979', color: 'white', border: 'none' }}
          variants={fadeUp}
          whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(77,25,121,0.35)', transition: { duration: 0.2 } }}
        >
          <span>Book Appointment</span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 2, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </motion.svg>
        </motion.button>

        <motion.p
          className="mt-5 italic"
          style={{ color: 'rgba(26,13,46,0.40)', fontSize: '13px' }}
          variants={fadeIn}
        >
          No commitment required — just come play.
        </motion.p>

      </motion.div>
    </section>
  );
}
