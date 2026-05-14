
'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from '../ImageModal';
import PdfViewer from '../PdfViewer';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';

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
  }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  const { ref: galleryRef, isVisible: galleryVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -150px 0px'
  });

  const openImageModal = (src: string, alt: string, width?: number, height?: number) => {
    setImageModal({
      isOpen: true,
      src,
      alt,
      ...(width && { width }),
      ...(height && { height })
    });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', alt: '' });
  };

  return (
    <>
      {/* Piano Types Header */}
      <div ref={headerRef} className="border-t border-[rgba(77,25,121,0.12)]" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          {/* Desktop version */}
          <h2 className={`hidden md:block text-xs font-light tracking-[0.2em] uppercase transition-all duration-700 ${headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`} style={{ color: 'rgba(26,13,46,0.45)' }}>
            HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span style={{ color: 'rgba(77,25,121,0.9)' }}>USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
          </h2>
          {/* Mobile version */}
          <div className="md:hidden">
            <h2 className={`text-xs font-light tracking-[0.2em] uppercase leading-relaxed break-words transition-all duration-700 ${headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`} style={{ color: 'rgba(26,13,46,0.45)' }}>
              HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span style={{ color: 'rgba(77,25,121,0.9)' }}>USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
            </h2>
          </div>
        </div>
      </div>

      <section id="about-event" className="py-16 sm:py-20 lg:py-24 border-t border-[rgba(77,25,121,0.12)] scroll-container" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <span
          aria-hidden="true"
          className="font-script absolute pointer-events-none select-none"
          style={{
            left: '-2%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(200px, 35vw, 500px)',
            fontWeight: 400,
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            color: 'rgba(77,25,121,0.05)',
            zIndex: 0,
          }}
        >
          FROGS
        </span>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* Event Description */}
          <div ref={contentRef} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center text-center mb-6">
                <p className={`text-xs tracking-[0.2em] uppercase font-light mb-4 transition-all duration-600 delay-100 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: 'rgba(26,13,46,0.45)' }}>
                  Official Partnership
                </p>
                <h3 className={`font-heading italic text-2xl md:text-3xl font-black tracking-tight leading-tight transition-all duration-600 delay-400 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: '#1a0d2e' }}>
                  Houston&apos;s Premier <span style={{ color: '#4D1979' }}>Piano Sale Event</span>
                </h3>
              </div>

              {/* Mobile Letter PDF */}
              <div className={`lg:hidden relative mb-8 transition-all duration-700 delay-500 ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="max-w-xs sm:max-w-sm mx-auto rounded-lg overflow-hidden border border-[rgba(77,25,121,0.15)]" style={{ background: '#F4F0FB', backdropFilter: 'blur(8px)' }}>
                  <PdfViewer
                    file="/tsu_letter.pdf"
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    width={768}
                    onClick={() => openImageModal("/tsu_letter.pdf", "TSU Houston Piano Sale Event Letter - Piano Deals Houston", 800, 600)}
                    loading="Loading piano sale letter..."
                    error="Unable to load letter PDF"
                    showPageCount={false}
                  />
                </div>
              </div>

              <div className="space-y-4 leading-relaxed">
                <p className={`text-base transition-all duration-600 delay-600 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: '#3a2060' }}>
                  For over five years, our exclusive partnership with {partnerName} has made us Houston&apos;s trusted Piano Gallery, bringing Greater Houston Area families access to premium KAWAI piano sales at specially negotiated pricing.
                </p>

                <p className={`text-base transition-all duration-600 delay-750 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: '#3a2060' }}>
                  This four-day exclusive Houston piano sale event features carefully selected digital and acoustic instruments. From used pianos Houston families love to brand new grand pianos, each instrument meets {partnerShortName}&apos;s rigorous quality standards for exceptional sound and craftsmanship.
                </p>

                <p className={`text-base transition-all duration-600 delay-900 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: '#3a2060' }}>
                  Whether you&apos;re seeking piano deals Houston residents can trust, need piano lessons Houston area, or want professional-grade instruments, this event offers unmatched piano sales Houston has to offer with institutional endorsement.
                </p>
              </div>

              {/* Capacity Badge + CTAs */}
              <div className={`rounded-lg p-6 border transition-all duration-700 delay-1100 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ background: 'rgba(77,25,121,0.08)', borderColor: 'rgba(77,25,121,0.25)' }}>
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#1a0d2e' }}>Limited Houston Event Capacity — {partnerShortName} Priority Access</h4>
                  <p className="text-sm mb-4" style={{ color: '#3a2060' }}>
                    Only 25 private consultation slots available for this exclusive Houston event.{' '}
                    <span className="font-medium" style={{ color: 'rgba(77,25,121,0.9)' }}>{partnerShortName} VIP early access bookings get guaranteed first selection</span>{' '}
                    plus <span className="font-medium" style={{ color: '#1a0d2e' }}>complimentary Houston delivery and premium tuning service</span>
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border" style={{ background: '#F4F0FB', borderColor: 'rgba(77,25,121,0.2)', color: '#4D1979' }}>
                    <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    68% of Houston slots already reserved
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={onOpenConsultation}
                      className="block w-full transition-opacity hover:opacity-90"
                      style={{ background: '#4D1979', color: 'white', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 32px', border: 'none' }}
                    >
                      Secure My Savings
                    </button>
                    <button
                      onClick={() => {
                        const featuredDeals = document.querySelector('#featured-deals') || document.querySelector('[id*="deals"]');
                        if (featuredDeals) {
                          featuredDeals.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="block w-full transition-opacity hover:opacity-80"
                      style={{ background: 'transparent', color: '#4D1979', border: '1.5px solid rgba(77,25,121,0.4)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 32px' }}
                    >
                      View Featured Deals
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Letter PDF */}
            <div className={`hidden lg:block relative transition-all duration-700 delay-700 ${contentVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-95'}`}>
              <div className="rounded-lg overflow-hidden border border-[rgba(77,25,121,0.15)]" style={{ background: '#F4F0FB', backdropFilter: 'blur(8px)' }}>
                <PdfViewer
                  file="/tsu_letter.pdf"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  width={1200}
                  onClick={() => openImageModal("/tsu_letter.pdf", "TSU Houston Piano Sale Event Letter - Piano Deals Houston", 800, 600)}
                  loading="Loading piano sale letter..."
                  error="Unable to load letter PDF"
                  showPageCount={false}
                />
              </div>
            </div>
          </div>

          {/* Bento Grid Gallery */}
          <div ref={galleryRef} className="mt-12 sm:mt-16 overflow-hidden">
            {/* Desktop Gallery - Complex Bento Grid */}
            <div className="hidden md:grid grid-cols-6 gap-1 min-h-[40rem] w-full max-w-full">
              {/* KAWAI CA901 - Hero */}
              <div
                className={`col-span-3 row-span-2 relative overflow-hidden cursor-pointer transition-all duration-700 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp", "KAWAI CA901 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp"
                  alt="KAWAI CA901 Digital Piano"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* KAWAI CA501 */}
              <div
                className={`col-span-3 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-150 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI-CA501W-39 copy_800.webp", "KAWAI CA501 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI-CA501W-39 copy_800.webp"
                  alt="KAWAI CA501 Digital Piano"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* KAWAI CA401 */}
              <div
                className={`col-span-2 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-300 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp", "KAWAI CA401 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp"
                  alt="KAWAI CA401 Digital Piano"
                  fill
                  sizes="33vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Connectivity */}
              <div
                className={`col-span-1 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-450 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/connectivity_800.webp", "Connectivity Features", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/connectivity_800.webp"
                  alt="Connectivity Features"
                  fill
                  sizes="16vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* CA401 Supplement */}
              <div
                className={`col-span-3 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-600 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/CA401 Supplement Image_800.webp", "KAWAI CA401 Supplement", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/CA401 Supplement Image_800.webp"
                  alt="KAWAI CA401 Supplement"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* CA701R */}
              <div
                className={`col-span-2 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-750 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/CA701R-43 copy_800.webp", "KAWAI CA701R Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/CA701R-43 copy_800.webp"
                  alt="KAWAI CA701R Digital Piano"
                  fill
                  sizes="33vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* SK Series */}
              <div
                className={`col-span-1 row-span-1 relative overflow-hidden cursor-pointer transition-all duration-600 delay-900 rounded-sm border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB' }}
                onClick={() => openImageModal("/images/optimized/gallery/SK_800.webp", "KAWAI SK Series", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/SK_800.webp"
                  alt="KAWAI SK Series"
                  fill
                  sizes="16vw"
                  className="object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Mobile Gallery - Simple 2-Column Grid */}
            <div className="md:hidden grid grid-cols-2 gap-2 sm:gap-3">
              {/* KAWAI CA901 - Hero (spans 2 columns) */}
              <div
                className={`col-span-2 h-48 sm:h-56 relative overflow-hidden cursor-pointer transition-all duration-700 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp", "KAWAI CA901 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp"
                  alt="KAWAI CA901 Digital Piano"
                  fill
                  sizes="100vw"
                  className="object-cover pointer-events-none"
                />
              </div>

              {/* KAWAI CA501 */}
              <div
                className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer transition-all duration-600 delay-150 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI-CA501W-39 copy_800.webp", "KAWAI CA501 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI-CA501W-39 copy_800.webp"
                  alt="KAWAI CA501 Digital Piano"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none"
                />
              </div>

              {/* KAWAI CA401 */}
              <div
                className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer transition-all duration-600 delay-300 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                onClick={() => openImageModal("/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp", "KAWAI CA401 Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp"
                  alt="KAWAI CA401 Digital Piano"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none"
                />
              </div>

              {/* CA701R */}
              <div
                className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer transition-all duration-600 delay-450 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                onClick={() => openImageModal("/images/optimized/gallery/CA701R-43 copy_800.webp", "KAWAI CA701R Digital Piano", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/CA701R-43 copy_800.webp"
                  alt="KAWAI CA701R Digital Piano"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none"
                />
              </div>

              {/* CA401 Supplement */}
              <div
                className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer transition-all duration-600 delay-600 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                onClick={() => openImageModal("/images/optimized/gallery/CA401 Supplement Image_800.webp", "KAWAI CA401 Supplement", 800, 600)}
              >
                <Image
                  src="/images/optimized/gallery/CA401 Supplement Image_800.webp"
                  alt="KAWAI CA401 Supplement"
                  fill
                  sizes="50vw"
                  className="object-cover pointer-events-none"
                />
              </div>

              {/* Connectivity + SK Series combined for mobile */}
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div
                  className={`h-20 sm:h-24 relative overflow-hidden cursor-pointer transition-all duration-600 delay-750 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                  onClick={() => openImageModal("/images/optimized/gallery/connectivity_800.webp", "Connectivity Features", 800, 600)}
                >
                  <Image
                    src="/images/optimized/gallery/connectivity_800.webp"
                    alt="Connectivity Features"
                    fill
                    sizes="25vw"
                    className="object-cover pointer-events-none"
                  />
                </div>
                <div
                  className={`h-20 sm:h-24 relative overflow-hidden cursor-pointer transition-all duration-600 delay-900 rounded-lg border border-[rgba(77,25,121,0.15)] ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ background: '#F4F0FB', backdropFilter: 'blur(4px)' }}
                  onClick={() => openImageModal("/images/optimized/gallery/SK_800.webp", "KAWAI SK Series", 800, 600)}
                >
                  <Image
                    src="/images/optimized/gallery/SK_800.webp"
                    alt="KAWAI SK Series"
                    fill
                    sizes="25vw"
                    className="object-cover pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
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
