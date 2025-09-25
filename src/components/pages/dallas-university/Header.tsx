'use client';

import Image from 'next/image';

export default function Header() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50 header-enhanced cursor-pointer group header-clickable w-full overflow-x-hidden"
      onClick={scrollToTop}
      role="button"
      aria-label="Scroll to top"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center h-16 sm:h-18 lg:h-20 header-content px-4 w-full">
          {/* KAWAI Logo with Tagline */}
          <div className="flex items-end gap-4">
            <div className="relative w-32 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-14 header-logo transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <Image
                src="/images/optimized/logos/Kawai-Red.webp"
                alt="KAWAI"
                fill
                className="object-contain transition-all duration-300 group-hover:brightness-110"
                priority
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-sm text-gray-500 font-light tracking-wide opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:text-kawai-red">
                Instrumental to Life.
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}