'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { HeroFeature } from '../../event.config';
import {
  fadeUp,
  fadeUpSlow,
  fadeIn,
  staggerContainer,
  EASE_ELEGANT,
} from '../animations';

interface HeroSectionProps {
  config: {
    videoSources: { src: string; type: string }[]
    videoStartTime: number
    heroGradient: string
    mobileOverlay: string
    ghostWatermarkText: string
    headline: string
    subtext: string
    supportText: string
    features: HeroFeature[]
    primaryCtaLabel: string
    secondaryCtaLabel: string
    secondaryCtaScrollTarget: string
  }
  partnerLogoUrl: string
  kawaiLogoUrl: string
  eventDateDisplay: string
  onOpenConsultation: () => void
  venueInfo: {
    venue: string
    parking: string
    mapsUrl: string
  }
}

export default function HeroSection({ config, partnerLogoUrl, kawaiLogoUrl, eventDateDisplay, onOpenConsultation, venueInfo }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const videoY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '12%'],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -40],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 0.9, 0.3],
  );

  const handleExploreCollectionClick = () => {
    const featuredDealsSection =
      document.getElementById(config.secondaryCtaScrollTarget) ??
      document.querySelector<HTMLElement>('.piano-gallery, .featured-deals');
    if (featuredDealsSection) {
      featuredDealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReserveAppointmentClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenConsultation();
  };

  const ghostLines = config.ghostWatermarkText.split('\n');

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden flex">

      {/* ── Video background with parallax ───────────────── */}
      <div className="absolute z-0" style={{ top: '-5%', bottom: '-5%', left: 0, right: 0 }}>
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="w-full h-full object-cover"
          style={{ pointerEvents: 'none', y: videoY }}
          onLoadedData={(e) => {
            const video = e.target as HTMLVideoElement;
            video.currentTime = config.videoStartTime;
            video.play().catch(() => {});
          }}
        >
          {config.videoSources.map((source, i) => (
            <source key={i} src={source.src} type={source.type} />
          ))}
        </motion.video>
      </div>

      {/* ── Dark base layer ────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-black/45" />

      {/* ── Maroon gradient wash (left → transparent right) ─ */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: config.heroGradient }}
      />

      {/* Mobile: extra fill so text is readable on narrow screens */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none md:hidden"
        style={{ background: config.mobileOverlay }}
      />

      {/* ── Ghost watermark headline ────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute z-[3] pointer-events-none select-none hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.1, ease: EASE_ELEGANT }}
        style={{
          top: '50%',
          left: '-1%',
          transform: 'translateY(-52%)',
          fontFamily: 'var(--font-tcu-script)',
          fontSize: 'clamp(110px, 22vw, 280px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.042)',
          lineHeight: 0.87,
          letterSpacing: '-0.025em',
          whiteSpace: 'nowrap',
        }}
      >
        {ghostLines[0]}{ghostLines.length > 1 && <><br />{ghostLines[1]}</>}
      </motion.div>

      {/* ── TCU logo — desktop only, right column ──────── */}
      <motion.div
        className="absolute z-[4] hidden md:flex items-start justify-center pt-40 lg:pt-56"
        style={{ left: '55%', right: 0, top: 0, bottom: 0 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE_ELEGANT }}
      >
        <Image
          src={partnerLogoUrl}
          alt="University Partner"
          width={400}
          height={400}
          className="drop-shadow-2xl"
          style={{ height: 'clamp(140px, 22vw, 360px)', width: 'auto', maxWidth: '400px' }}
          priority
        />
      </motion.div>

      {/* ── Main content ───────────────────────────────── */}
      <motion.div
        className="relative z-[4] flex flex-col justify-between min-h-screen w-full md:max-w-[60%] px-6 sm:px-10 lg:px-16 py-10 lg:py-14"
        style={{ y: contentY, opacity: contentOpacity }}
        variants={staggerContainer(0.13, 0.25)}
        initial="hidden"
        animate="visible"
      >

        {/* TCU logo — mobile only, top of content */}
        <motion.div className="flex md:hidden" variants={fadeUp}>
          <Image
            src={partnerLogoUrl}
            alt="University Partner"
            width={200}
            height={200}
            className="drop-shadow-xl"
            style={{ height: '100px', width: 'auto', maxWidth: '120px' }}
            priority
          />
        </motion.div>

        {/* Middle: headline + brought to you by */}
        <div className="flex-1 flex flex-col justify-center py-4 sm:py-8">
          <motion.h1
            className="font-heading uppercase text-white whitespace-nowrap"
            style={{
              fontSize: 'clamp(56px, 10vw, 132px)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '0.01em',
            }}
            variants={fadeUpSlow}
          >
            {config.headline}
          </motion.h1>

          {/* Brought to you by KAWAI */}
          <motion.div className="flex items-center gap-3 mt-4 sm:mt-5" variants={fadeUp}>
            <span
              className="text-white/45 font-light tracking-widest uppercase"
              style={{ fontSize: 'clamp(10px, 1vw, 12px)' }}
            >
              Brought to you by
            </span>
            <Image
              src={kawaiLogoUrl}
              alt="KAWAI"
              width={100}
              height={30}
              className="drop-shadow"
              style={{ height: 'clamp(20px, 2.2vw, 28px)', width: 'auto', maxWidth: '120px' }}
            />
          </motion.div>

          <motion.p
            className="text-white/50 font-light mt-4 max-w-sm"
            style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 1.65 }}
            variants={fadeUp}
          >
            {config.subtext}
          </motion.p>
        </div>

        {/* Bottom: feature grid → date + CTAs */}
        <div className="space-y-4 sm:space-y-5">

          {/* 3-column feature strip */}
          <motion.div
            className="grid grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            variants={staggerContainer(0.1)}
          >
            {config.features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p className="text-white font-semibold leading-tight mb-1.5" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                  {f.label}
                </p>
                <p className="text-white/55 font-light leading-snug" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Date + CTA buttons — centered */}
          <div className="flex flex-col items-center gap-4 pb-2">
            <motion.p
              className="font-heading uppercase text-white font-bold"
              style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}
              variants={fadeUp}
            >
              {eventDateDisplay}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto" variants={staggerContainer(0.08)}>
              <motion.button
                onClick={handleReserveAppointmentClick}
                type="button"
                className="cursor-pointer"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                  background: 'white',
                  color: '#4D1979',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
                variants={fadeUp}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {config.primaryCtaLabel}
              </motion.button>
              <motion.button
                onClick={handleExploreCollectionClick}
                type="button"
                className="cursor-pointer"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                  background: 'transparent',
                  color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}
                variants={fadeUp}
                whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.1)', transition: { duration: 0.2 } }}
              >
                {config.secondaryCtaLabel}
              </motion.button>
            </motion.div>

            <motion.p className="text-white/38 italic" style={{ fontSize: '13px' }} variants={fadeIn}>
              {config.supportText}
            </motion.p>

            {/* ── Venue & directions strip ── */}
            <motion.a
              href={venueInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 w-full group"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: '14px',
                marginTop: '4px',
                textDecoration: 'none',
              }}
              variants={fadeIn}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <div>
                <p className="text-white/75 leading-snug group-hover:text-white transition-colors" style={{ fontSize: '12px' }}>
                  {venueInfo.venue}
                </p>
                <p className="text-white/45 mt-0.5 group-hover:text-white/65 transition-colors" style={{ fontSize: '11px' }}>
                  Parking: {venueInfo.parking}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-white/50 group-hover:text-white/80 transition-colors" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Get Directions
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
