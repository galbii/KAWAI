import Image from 'next/image';
import type { MouseEvent } from 'react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {

  const handleExploreCollectionClick = () => {
    const featuredDealsSection =
      document.getElementById('featured-deals') ??
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

  return (
    <section className="relative min-h-screen overflow-hidden flex">

      {/* ── Video background ───────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.currentTime = 13.10;
          video.play().catch(() => {});
        }}
      >
        <source src="/videos/CA.webm" type="video/webm" />
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>

      {/* ── Dark base layer ────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-black/45" />

      {/* ── Maroon gradient wash (left → transparent right) ─ */}
      {/* Mirrors the TCU ad left-panel feel over the video */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(77,25,121,0.96) 0%, rgba(77,25,121,0.88) 28%, rgba(60,18,96,0.52) 50%, rgba(50,12,80,0.14) 66%, transparent 80%)',
        }}
      />

      {/* Mobile: extra fill so text is readable on narrow screens */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none md:hidden"
        style={{ background: 'rgba(77,25,121,0.45)' }}
      />

      {/* ── Ghost watermark headline ────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute z-[3] pointer-events-none select-none hidden sm:block"
        style={{
          top: '50%',
          left: '-1%',
          transform: 'translateY(-52%)',
          fontFamily: 'var(--font-playfair-display), Georgia, serif',
          fontSize: 'clamp(110px, 22vw, 280px)',
          fontWeight: 900,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.042)',
          lineHeight: 0.87,
          letterSpacing: '-0.025em',
          whiteSpace: 'nowrap',
        }}
      >
        Piano<br />Sale
      </div>

      {/* ── TCU logo — desktop only, right column ──────── */}
      <div
        className="absolute z-[4] hidden md:flex items-start justify-center pt-40 lg:pt-56"
        style={{ left: '55%', right: 0, top: 0, bottom: 0 }}
      >
        <Image
          src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/logo_-texas-christian-university-horned-frogs-tcu-frog.webp"
          alt="Texas Christian University"
          width={400}
          height={400}
          className="drop-shadow-2xl"
          style={{ height: 'clamp(140px, 22vw, 360px)', width: 'auto', maxWidth: '400px' }}
          priority
        />
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div
        className="relative z-[4] flex flex-col justify-between min-h-screen w-full md:max-w-[60%] px-6 sm:px-10 lg:px-16 py-10 lg:py-14"
      >

        {/* TCU logo — mobile only, top of content */}
        <div className="flex md:hidden">
          <Image
            src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/logo_-texas-christian-university-horned-frogs-tcu-frog.webp"
            alt="Texas Christian University"
            width={200}
            height={200}
            className="drop-shadow-xl"
            style={{ height: '100px', width: 'auto', maxWidth: '120px' }}
            priority
          />
        </div>

        {/* Middle: headline + brought to you by */}
        <div className="flex-1 flex flex-col justify-center py-4 sm:py-8">
          <h1
            className="font-heading italic text-white whitespace-nowrap"
            style={{
              fontSize: 'clamp(56px, 10vw, 132px)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            Piano Sale
          </h1>

          {/* Brought to you by KAWAI */}
          <div className="flex items-center gap-3 mt-4 sm:mt-5">
            <span
              className="text-white/45 font-light tracking-widest uppercase"
              style={{ fontSize: 'clamp(10px, 1vw, 12px)' }}
            >
              Brought to you by
            </span>
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={100}
              height={30}
              className="drop-shadow"
              style={{ height: 'clamp(20px, 2.2vw, 28px)', width: 'auto', maxWidth: '120px' }}
            />
          </div>

          <p
            className="text-white/50 font-light mt-4 max-w-sm"
            style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 1.65 }}
          >
            Book your appointment for special event pricing on a wide
            variety of Kawai pianos — with free delivery and tuning.
          </p>
        </div>

        {/* Bottom: feature grid → date + CTAs */}
        <div className="space-y-4 sm:space-y-5">

          {/* 3-column feature strip */}
          <div
            className="grid grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div>
              <p className="text-white font-semibold leading-tight mb-1.5" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                Digital Piano Rebates
              </p>
              <p className="text-white/55 font-light leading-snug" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                Get up to $400 off
              </p>
            </div>
            <div>
              <p className="text-white font-semibold leading-tight mb-1.5" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                Financing
              </p>
              <p className="text-white/55 font-light leading-snug" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                36 months<br />0% APR
              </p>
            </div>
            <div>
              <p className="text-white font-semibold leading-tight mb-1.5" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                Exclusive TCU Pricing
              </p>
              <p className="text-white/55 font-light leading-snug" style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                Up to 10% Off MSRP
              </p>
            </div>
          </div>

          {/* Date + CTA buttons — centered */}
          <div className="flex flex-col items-center gap-4 pb-2">
            <p
              className="font-heading italic text-white font-bold"
              style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}
            >
              December 4 – 7, 2025
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleReserveAppointmentClick}
                type="button"
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
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
              >
                Book Appointment
              </button>
              <button
                onClick={handleExploreCollectionClick}
                type="button"
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
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
              >
                View Collection
              </button>
            </div>
            <p className="text-white/38 italic" style={{ fontSize: '13px' }}>
              Your purchase supports the TCU Music Department
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
