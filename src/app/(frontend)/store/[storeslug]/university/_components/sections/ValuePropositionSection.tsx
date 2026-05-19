'use client';

import { Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ValueProp } from '../../event.config';
import {
  fadeUp,
  fadeUpSlow,
  numberReveal,
  lineExpand,
  staggerContainer,
} from '../animations';

interface ValuePropositionSectionProps { valueProps: ValueProp[]; phone: string; note: string }

export default function ValuePropositionSection({ valueProps, phone, note }: ValuePropositionSectionProps) {
  const phoneDigits = phone.replace(/\D/g, '');
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#1a0d2e' }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          opacity: 0.6,
        }}
      />

      {/* Subtle purple gradient bloom — top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(77,25,121,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-20 lg:py-28">

        {/* Eyebrow row */}
        <motion.div
          className="flex items-center gap-4 mb-16 lg:mb-20"
          variants={staggerContainer(0.13)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="h-px flex-1"
            style={{ background: 'rgba(255,255,255,0.08)', originX: 0 }}
            variants={lineExpand}
          />
          <motion.p
            className="text-[10px] tracking-[0.35em] uppercase font-[family-name:var(--font-brand-sans)]"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            variants={fadeUp}
          >
            Why this event
          </motion.p>
          <motion.div
            className="h-px flex-1"
            style={{ background: 'rgba(255,255,255,0.08)', originX: 1 }}
            variants={lineExpand}
          />
        </motion.div>

        {/* Heading */}
        <motion.div
          className="mb-16 lg:mb-20 max-w-xl"
          variants={staggerContainer(0.13)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="font-[family-name:var(--font-family-cormorant)] leading-[1.05] mb-4"
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
            variants={fadeUpSlow}
          >
            Exclusive benefits,<br />
            <span style={{ color: 'rgba(180,140,220,0.85)' }}>only at this event.</span>
          </motion.h2>
          <motion.p
            className="text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]"
            style={{ color: 'rgba(255,255,255,0.38)' }}
            variants={fadeUp}
          >
            Rebates, zero-interest financing, and invitation pricing — unavailable anywhere else.
          </motion.p>
        </motion.div>

        {/* Feature row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3"
          variants={staggerContainer(shouldReduceMotion ? 0 : 0.18, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              className="group relative py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                ...(index > 0 ? { borderLeft: '0' } : {}),
              }}
              variants={staggerContainer(0.1)}
            >
              {/* Vertical divider for md+ */}
              {index > 0 && (
                <div
                  className="hidden md:block absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />
              )}

              {/* Number */}
              <motion.p
                className="font-[family-name:var(--font-family-cormorant)] mb-6"
                style={{
                  fontSize: 'clamp(5rem, 9vw, 8rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.15)',
                  letterSpacing: '-0.03em',
                }}
                variants={numberReveal}
              >
                0{index + 1}
              </motion.p>

              {/* Title */}
              <motion.h3
                className="font-[family-name:var(--font-family-cormorant)] mb-3 leading-snug"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                  fontWeight: 500,
                  color: '#ffffff',
                }}
                variants={fadeUp}
              >
                {prop.title}
              </motion.h3>

              {/* Thin accent line — grows on enter, extends further on hover */}
              <motion.div
                className="mb-5 h-px"
                style={{ background: 'rgba(77,25,121,0.6)', originX: 0, width: '2rem' }}
                variants={lineExpand}
                whileHover={{ width: '4rem', transition: { duration: 0.4 } }}
              />

              {/* Description */}
              <motion.p
                className="text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                variants={fadeUp}
              >
                {prop.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="mt-16 lg:mt-20 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          variants={staggerContainer(shouldReduceMotion ? 0 : 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.9 }}
        >
          {/* Note pill */}
          <motion.div className="flex items-center gap-2.5" variants={fadeUp}>
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#7c3aed' }}
            />
            <span
              className="text-[11px] tracking-[0.18em] uppercase font-[family-name:var(--font-brand-sans)]"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {note}
            </span>
          </motion.div>

          {/* Phone — minimal text link */}
          <motion.a
            href={`tel:${phoneDigits}`}
            className="group inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-70"
            variants={fadeUp}
          >
            <Phone
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: 'rgba(180,140,220,0.7)' }}
            />
            <span
              className="font-[family-name:var(--font-brand-sans)] text-sm tracking-wide"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {phone}
            </span>
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: 'rgba(180,140,220,0.5)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
