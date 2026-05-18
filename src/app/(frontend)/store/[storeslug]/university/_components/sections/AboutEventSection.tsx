'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from '../ImageModal';
import GallerySection from '../GallerySection';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';

const TCU_LETTER_URL =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Screenshot%202026-05-18%20at%204.12.00%E2%80%AFPM.webp';

interface AboutEventSectionProps {
  partnerName: string
  partnerShortName: string
  onOpenConsultation: () => void;
}

export default function AboutEventSection({ partnerName, partnerShortName, onOpenConsultation }: AboutEventSectionProps) {
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>({ isOpen: false, src: '', alt: '' });

  const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });
  const { ref: galleryRef, isVisible: galleryVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -150px 0px'
  });

  const openImageModal = (src: string, alt: string, width?: number, height?: number) => {
    setImageModal({ isOpen: true, src, alt, ...(width && { width }), ...(height && { height }) });
  };
  const closeImageModal = () => setImageModal({ isOpen: false, src: '', alt: '' });

  return (
    <>
      {/* Thin category strip */}
      <div className="border-t border-[rgba(77,25,121,0.1)]" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-6 overflow-x-auto">
          {['Baby Grand', 'Upright', 'Digital', 'Hybrid', '0% Financing'].map((label, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.25em] uppercase whitespace-nowrap font-[family-name:var(--font-brand-sans)] shrink-0"
              style={{ color: i === 4 ? 'rgba(77,25,121,0.7)' : 'rgba(26,13,46,0.3)' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <section
        id="about-event"
        className="relative overflow-hidden border-t border-[rgba(77,25,121,0.08)]"
        style={{ background: '#ffffff' }}
      >
        {/* Ghost watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute font-[family-name:var(--font-family-cormorant)]"
          style={{
            left: '-2%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(180px, 30vw, 420px)',
            fontWeight: 300,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            color: 'rgba(77,25,121,0.04)',
            zIndex: 0,
            letterSpacing: '-0.04em',
          }}
        >
          KAWAI
        </span>

        <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* ── Left column ── */}
            <div>
              {/* Eyebrow */}
              <div
                className={`flex items-center gap-3 mb-8 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <div className="h-px w-8" style={{ background: '#4D1979' }} />
                <p
                  className="text-[10px] tracking-[0.32em] uppercase font-[family-name:var(--font-brand-sans)]"
                  style={{ color: 'rgba(77,25,121,0.6)' }}
                >
                  Official Partnership · {partnerShortName}
                </p>
              </div>

              {/* Heading */}
              <h2
                className={`font-[family-name:var(--font-family-cormorant)] mb-8 leading-[1.05] transition-all duration-700 delay-100 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 400,
                  color: '#1a0d2e',
                  letterSpacing: '-0.01em',
                }}
              >
                Fort Worth&apos;s Premier<br />
                <span style={{ color: '#4D1979' }}>Piano Sale Event</span>
              </h2>

              {/* Body copy */}
              <div className="space-y-5 mb-10">
                {[
                  `Our exclusive partnership with ${partnerName} gives Fort Worth families access to premium KAWAI instruments at specially negotiated event pricing — unavailable in any showroom.`,
                  `This four-day event features a carefully curated selection of digital and acoustic pianos. Every instrument meets ${partnerShortName}'s quality standards for sound and craftsmanship.`,
                  `From entry-level digitals to professional grand pianos, each model is available for in-person trial with expert guidance from our KAWAI specialists.`,
                ].map((text, i) => (
                  <p
                    key={i}
                    className={`text-[15px] leading-relaxed font-[family-name:var(--font-brand-sans)] transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{
                      color: 'rgba(26,13,46,0.58)',
                      transitionDelay: `${200 + i * 120}ms`,
                    }}
                  >
                    {text}
                  </p>
                ))}
              </div>

              {/* ── CTA block ── */}
              <div
                className={`transition-all duration-700 delay-[560ms] ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ borderTop: '1px solid rgba(77,25,121,0.1)', paddingTop: '2rem' }}
              >
                {/* Scarcity signal */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7c3aed' }} />
                  <p
                    className="text-[11px] tracking-[0.18em] uppercase font-[family-name:var(--font-brand-sans)]"
                    style={{ color: 'rgba(77,25,121,0.65)' }}
                  >
                    Limited slots — {partnerShortName} priority access
                  </p>
                </div>

                {/* Two CTAs side-by-side */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onOpenConsultation}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white text-[11px] tracking-[0.18em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] transition-opacity hover:opacity-85"
                    style={{ background: '#4D1979' }}
                  >
                    Book Appointment
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => document.getElementById('featured-deals')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] transition-colors hover:bg-[rgba(77,25,121,0.06)]"
                    style={{
                      color: '#4D1979',
                      border: '1px solid rgba(77,25,121,0.25)',
                    }}
                  >
                    View Models
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right column — TCU letter ── */}
            <div
              className={`transition-all duration-700 delay-300 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {/* Desktop */}
              <div className="hidden lg:block relative">
                <div
                  className="overflow-hidden"
                  style={{
                    border: '1px solid rgba(77,25,121,0.12)',
                    boxShadow: '0 24px 64px rgba(26,13,46,0.08)',
                  }}
                >
                  <Image
                    src={TCU_LETTER_URL}
                    alt="Official TCU × KAWAI partnership letter"
                    width={1200}
                    height={1554}
                    className="w-full h-auto cursor-zoom-in hover:opacity-95 transition-opacity duration-300"
                    onClick={() => openImageModal(TCU_LETTER_URL, 'Official TCU × KAWAI partnership letter', 1200, 1554)}
                  />
                </div>
                <p
                  className="mt-3 text-[10px] tracking-[0.2em] uppercase text-center font-[family-name:var(--font-brand-sans)]"
                  style={{ color: 'rgba(26,13,46,0.25)' }}
                >
                  Click to enlarge
                </p>
              </div>

              {/* Mobile */}
              <div className="lg:hidden max-w-xs mx-auto">
                <div className="overflow-hidden" style={{ border: '1px solid rgba(77,25,121,0.12)' }}>
                  <Image
                    src={TCU_LETTER_URL}
                    alt="Official TCU × KAWAI partnership letter"
                    width={768}
                    height={994}
                    className="w-full h-auto cursor-zoom-in"
                    onClick={() => openImageModal(TCU_LETTER_URL, 'Official TCU × KAWAI partnership letter', 800, 1040)}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Gallery */}
          <div ref={galleryRef} className="mt-20 lg:mt-28">
            <GallerySection onImageClick={openImageModal} isVisible={galleryVisible} />
          </div>
        </div>

        <ImageModal
          isOpen={imageModal.isOpen}
          onClose={closeImageModal}
          src={imageModal.src}
          alt={imageModal.alt}
          {...(imageModal.width && { width: imageModal.width })}
          {...(imageModal.height && { height: imageModal.height })}
        />
      </section>
    </>
  );
}
