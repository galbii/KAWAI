import Link from 'next/link';
import { MediaRenderer } from '@/components/ui/media/MediaRenderer';
import type { HeroSectionData } from '@/lib/types/homepage';

interface ContactHeroProps {
  data?: HeroSectionData;
}

const DEFAULT_CONTACT_HERO_DATA: HeroSectionData = {
  locationText: "St. Louis's Premier Piano Gallery",
  establishedText: "Est. 1927 • Lake St. Louis, Missouri",
  titlePrefix: "Contact",
  titleMain: "OUR TEAM",
  titleSuffix: "Today",
  description: "Ready to find your perfect piano? Our Lake St. Louis showroom experts are here to help guide your musical journey. Schedule a visit, ask questions, or request more information about our complete collection of Kawai instruments.",
  primaryCta: {
    text: "Schedule Showroom Visit",
    link: "/contact/schedule-visit"
  },
  secondaryCta: {
    text: "Call Us Now",
    link: "tel:636-265-2866"
  },
  backgroundVideo: null
};

export function ContactHero({ data = DEFAULT_CONTACT_HERO_DATA }: ContactHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-kawai-black">
      {/* Background Video */}
      {data.backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <MediaRenderer
            media={data.backgroundVideo}
            preset="hero"
            priority
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-kawai-black/60"></div>
        </div>
      )}

      {/* Fallback gradient background */}
      {!data.backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-kawai-black via-kawai-black/95 to-kawai-black/90"></div>
        </div>
      )}

      {/* Content */}
      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        <div className="max-w-4xl">
          {/* Location Text */}
          <p className="text-kawai-pearl/80 text-sm md:text-base font-medium tracking-wider uppercase mb-4">
            {data.locationText}
          </p>

          {/* Established Text */}
          <p className="text-kawai-pearl/60 text-xs md:text-sm font-light tracking-wide mb-8">
            {data.establishedText}
          </p>

          {/* Main Title */}
          <h1 className="text-kawai-pearl font-serif mb-8">
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">
              {data.titlePrefix}
            </span>
            <span className="block text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight -mt-2 mb-2">
              {data.titleMain}
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">
              {data.titleSuffix}
            </span>
          </h1>

          {/* Description */}
          <p className="text-kawai-pearl/90 text-lg md:text-xl leading-relaxed mb-12 max-w-3xl">
            {data.description}
          </p>

          {/* Call-to-Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA */}
            <Link
              href={data.primaryCta.link}
              className="inline-flex items-center justify-center px-8 py-4 bg-kawai-red hover:bg-kawai-red/90 text-white font-medium text-lg rounded-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {data.primaryCta.text}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={data.secondaryCta.link}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-kawai-pearl/30 hover:border-kawai-pearl text-kawai-pearl hover:text-kawai-pearl font-medium text-lg rounded-sm transition-all duration-300 hover:bg-kawai-pearl/10"
            >
              {data.secondaryCta.text}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kawai-pearl/10 to-transparent z-5"></div>
    </section>
  );
}