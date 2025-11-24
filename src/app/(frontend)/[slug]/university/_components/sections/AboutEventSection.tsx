
'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from '../ImageModal';
import PdfViewer from '../PdfViewer';
import { useIntersectionAnimation } from '../hooks/useIntersectionAnimation';

interface AboutEventSectionProps {
  onOpenConsultation: () => void;
}

export default function AboutEventSection({ onOpenConsultation }: AboutEventSectionProps) {
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

  // Animation hooks
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
      {/* Piano Types Header - Moved higher to separate sections */}
      <div ref={headerRef} className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Desktop version - normal text */}
          <h2 className={`hidden md:block text-sm md:text-base font-normal text-gray-500 tracking-wider leading-relaxed opacity-80 transition-all duration-700 ${headerVisible ? 'translate-y-0 opacity-80' : '-translate-y-5 opacity-0'}`}>
            HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span className="text-kawai-red">USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
          </h2>
          {/* Mobile version - wrapped text */}
          <div className="md:hidden">
            <h2 className={`text-sm font-normal text-gray-500 tracking-wider leading-relaxed opacity-80 break-words transition-all duration-700 ${headerVisible ? 'translate-y-0 opacity-80' : '-translate-y-5 opacity-0'}`}>
              HOUSTON PIANO SALES | BABY GRANDS | UPRIGHTS | DIGITALS | <span className="text-kawai-red">USED PIANOS HOUSTON</span> | FINANCING AVAILABLE
            </h2>
          </div>
        </div>
      </div>

      <section id="about-event" className="py-16 sm:py-20 lg:py-24 bg-white scroll-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Event Description */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Image 
                src="/images/Kawai (Red)(2).png"
                alt="KAWAI Piano Sales Houston - Premium Piano Gallery"
                width={240}
                height={60}
                className={`h-16 w-auto mb-4 transition-all duration-600 delay-200 ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              />
              <h3 className={`text-2xl md:text-3xl font-bold tracking-tight text-black transition-all duration-600 delay-400 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Houston&apos;s Premier <span className="text-kawai-red">Piano Sale Event</span>
              </h3>
            </div>

            {/* Mobile Letter PDF - Shown on mobile right after title */}
            <div className={`lg:hidden relative mb-8 transition-all duration-700 delay-500 ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="max-w-xs sm:max-w-sm mx-auto">
                <PdfViewer
                  file="/tsu_letter.pdf"
                  className="cursor-pointer hover:shadow-sm transition-shadow rounded-lg overflow-hidden"
                  width={768}
                  onClick={() => openImageModal("/tsu_letter.pdf", "TSU Houston Piano Sale Event Letter - Piano Deals Houston", 800, 600)}
                  loading="Loading piano sale letter..."
                  error="Unable to load letter PDF"
                />
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className={`text-base transition-all duration-600 delay-600 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                For over five years, our exclusive partnership with Texas Southern University has made us Houston&apos;s trusted Piano Gallery, bringing Greater Houston Area families access to premium KAWAI piano sales at specially negotiated pricing.
              </p>
              
              <p className={`text-base transition-all duration-600 delay-750 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                This four-day exclusive Houston piano sale event features carefully selected digital and acoustic instruments. From used pianos Houston families love to brand new grand pianos, each instrument meets TSU&apos;s rigorous quality standards for exceptional sound and craftsmanship.
              </p>
              
              <p className={`text-base transition-all duration-600 delay-900 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Whether you&apos;re seeking piano deals Houston residents can trust, need piano lessons Houston area, or want professional-grade instruments, this event offers unmatched piano sales Houston has to offer with institutional endorsement.
              </p>
            </div>

            <div className={`bg-gradient-to-r from-kawai-red/5 to-tsu-blue/5 rounded-lg p-6 border border-kawai-red/20 transition-all duration-700 delay-1100 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-black mb-2">Limited Houston Event Capacity - TSU Priority Access</h4>
                <p className="text-sm text-muted-foreground mb-4">Only 25 private consultation slots available for this exclusive Houston event. <span className="text-kawai-red/80 font-medium">TSU VIP early access bookings get guaranteed first selection</span> plus <span className="text-kawai-red font-medium">complimentary Houston delivery and premium tuning service</span></p>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  68% of Houston slots already reserved
                </div>
                <div className="space-y-3">
                  <button
                    onClick={onOpenConsultation}
                    className="block w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    style={{backgroundColor: '#CC0000', color: '#FFFFFF'}}
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
                    className="block w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-in-out"
                  >
                    View Featured Deals
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Letter PDF - Hidden on mobile */}
          <div className={`hidden lg:block relative transition-all duration-700 delay-700 ${contentVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-95'}`}>
            <PdfViewer
              file="/tsu_letter.pdf"
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
              width={1200}
              onClick={() => openImageModal("/tsu_letter.pdf", "TSU Houston Piano Sale Event Letter - Piano Deals Houston", 800, 600)}
              loading="Loading piano sale letter..."
              error="Unable to load letter PDF"
            />
          </div>
        </div>

        {/* Bento Grid Gallery */}
        <div ref={galleryRef} className="mt-12 sm:mt-16 overflow-hidden">
          {/* Desktop Gallery - Complex Bento Grid */}
          <div className="hidden md:grid grid-cols-6 gap-0 min-h-[40rem] w-full max-w-full">
            {/* KAWAI CA901 - Hero */}
            <div 
              className={`col-span-3 row-span-2 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-700 ${galleryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              onClick={() => openImageModal("/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp", "KAWAI CA901 Digital Piano", 800, 600)}
            >
              <Image 
                src="/images/optimized/gallery/KAWAI-CA901B-24 copy_800.webp"
                alt="KAWAI CA901 Digital Piano"
                fill
                sizes="50vw"
                className="object-cover pointer-events-none"
              />
            </div>

            {/* KAWAI CA501 */}
            <div 
              className={`col-span-3 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-150 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
              className={`col-span-2 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-300 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => openImageModal("/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp", "KAWAI CA401 Digital Piano", 800, 600)}
            >
              <Image 
                src="/images/optimized/gallery/KAWAI_CA401B-43 copy_800.webp"
                alt="KAWAI CA401 Digital Piano"
                fill
                sizes="33vw"
                className="object-cover pointer-events-none"
              />
            </div>

            {/* Connectivity */}
            <div 
              className={`col-span-1 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-450 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => openImageModal("/images/optimized/gallery/connectivity_800.webp", "Connectivity Features", 800, 600)}
            >
              <Image 
                src="/images/optimized/gallery/connectivity_800.webp"
                alt="Connectivity Features"
                fill
                sizes="16vw"
                className="object-cover pointer-events-none"
              />
            </div>

            {/* CA401 Supplement */}
            <div 
              className={`col-span-3 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-600 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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

            {/* CA701R */}
            <div 
              className={`col-span-2 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-750 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => openImageModal("/images/optimized/gallery/CA701R-43 copy_800.webp", "KAWAI CA701R Digital Piano", 800, 600)}
            >
              <Image 
                src="/images/optimized/gallery/CA701R-43 copy_800.webp"
                alt="KAWAI CA701R Digital Piano"
                fill
                sizes="33vw"
                className="object-cover pointer-events-none"
              />
            </div>

            {/* SK Series */}
            <div 
              className={`col-span-1 row-span-1 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-900 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => openImageModal("/images/optimized/gallery/SK_800.webp", "KAWAI SK Series", 800, 600)}
            >
              <Image 
                src="/images/optimized/gallery/SK_800.webp"
                alt="KAWAI SK Series"
                fill
                sizes="16vw"
                className="object-cover pointer-events-none"
              />
            </div>
          </div>

          {/* Mobile Gallery - Simple 2-Column Grid */}
          <div className="md:hidden grid grid-cols-2 gap-2 sm:gap-3">
            {/* KAWAI CA901 - Hero (spans 2 columns) */}
            <div 
              className={`col-span-2 h-48 sm:h-56 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-700 rounded-lg ${galleryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
              className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-150 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
              className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-300 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
              className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-450 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
              className={`h-32 sm:h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-600 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                className={`h-20 sm:h-24 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-750 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                className={`h-20 sm:h-24 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-600 delay-900 rounded-lg ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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