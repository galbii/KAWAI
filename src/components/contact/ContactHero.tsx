'use client'

import Image from 'next/image';
import type { ShowroomSectionData } from '@/lib/types/homepage';

interface ContactHeroProps {
  data?: ShowroomSectionData;
}

const DEFAULT_SHOWROOM_DATA: ShowroomSectionData = {
  sectionHeader: "Our Showroom",
  showroomTitle: "Visit Our Location",
  showroomDescription: "Experience the artistry of Kawai pianos",
  showroomInfo: {
    name: "Kawai Piano Gallery St. Louis",
    address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
    phone: "636-265-2866",
    serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
  },
  hours: [],
  features: [],
  showroomCtas: {
    directionsText: "Get Directions",
    directionsLink: "https://maps.google.com",
    scheduleText: "Schedule Visit",
    scheduleLink: "/contact/schedule-visit"
  }
};

export function ContactHero({
  data = DEFAULT_SHOWROOM_DATA,
  establishedText
}: ContactHeroProps & { establishedText?: string }) {
  // Remove "Kawai" from the beginning of the storefront name
  const displayName = data.showroomInfo.name.replace(/^Kawai\s+/i, '');

  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden w-full">
      {/* Video Background - Same as Arlington */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.currentTime = 13.10;
          video.play().catch(() => {
            // Fallback if autoplay fails
          });
        }}
      >
        <source src="/videos/CA.webm" type="video/webm" />
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>

      {/* Lighter overlay for better visibility */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Content - Centered Logo and Storefront Name */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Flex container - vertical on mobile, horizontal on desktop */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* Kawai Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/Kawai (Red)(2).png"
                alt="KAWAI Logo"
                width={400}
                height={120}
                priority
                className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto drop-shadow-2xl"
              />
            </div>

            {/* Storefront Name and Subtitle */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide font-sans drop-shadow-2xl uppercase text-center md:text-left">
                {displayName}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-white drop-shadow-2xl text-center md:text-left uppercase">
                Instrumental to Life
              </p>
            </div>
          </div>

          {/* Established Text - Centered below everything (from CMS or default) */}
          <p className="text-base sm:text-lg md:text-xl font-light text-kawai-red drop-shadow-xl text-center tracking-wider">
            {establishedText || 'Est. 1927'}
          </p>
        </div>
      </div>
    </section>
  );
}