"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * ConversionSection Component
 *
 * Bottom-of-page conversion section for the Piano Finder page featuring:
 * - Three clear conversion paths (Schedule Visit, Browse Collection, Contact Experts)
 * - SEO-optimized content targeting conversion stage keywords
 * - Trust elements highlighting Kawai's expertise and dealer network
 * - Staggered animation effects on scroll
 * - Mobile-responsive 3-column grid layout
 *
 * Conversion Strategy (from piano-finder-page-strategy-2025.md):
 * - Primary: Schedule showroom visit (highest intent)
 * - Secondary: Browse piano collection (consideration stage)
 * - Tertiary: Contact specialists (guidance seekers)
 *
 * Design follows Kawai's Japanese-inspired aesthetic with kawai-pearl background,
 * card-based layout, and prominent CTAs in brand colors.
 */

interface ConversionPath {
  title: string;
  icon: React.ReactNode;
  description: string;
  ctaText: string;
  ctaLink: string;
  variant: "primary" | "secondary";
}

export function ConversionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const conversionPaths: ConversionPath[] = [
    {
      title: "Schedule Showroom Visit",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>
      ),
      description:
        "Experience the authentic touch and tone of Kawai pianos firsthand. Try these recommended models in person at your nearest authorized Kawai dealer showroom and discover why pianists worldwide trust our instruments for their musical journey.",
      ctaText: "Schedule Your Visit",
      ctaLink: "/experience/schedule-visit",
      variant: "primary",
    },
    {
      title: "Browse Piano Collection",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
          />
        </svg>
      ),
      description:
        "Explore our complete range of pianos online, from entry-level digital models to concert-grade grand pianos. Compare specifications, view detailed imagery, read customer reviews, and discover the Kawai instrument that perfectly matches your needs and budget.",
      ctaText: "View All Pianos",
      ctaLink: "/pianos",
      variant: "secondary",
    },
    {
      title: "Contact Piano Experts",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      ),
      description:
        "Get personalized guidance from our knowledgeable piano specialists who understand the nuances of every Kawai model. Whether you have questions about features, financing options, or need help choosing between models, our experts are here to assist you.",
      ctaText: "Contact Us",
      ctaLink: "/contact",
      variant: "secondary",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white to-kawai-pearl py-16 sm:py-20 lg:py-28"
      aria-labelledby="conversion-section-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Ready to Find Your Piano?
          </div>
          <h2
            id="conversion-section-heading"
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight"
          >
            Experience Kawai Excellence at{" "}
            <span className="text-kawai-red">Your Local Dealer</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            You've discovered your ideal piano match. Now it's time to take the
            next step in your musical journey. Whether you prefer to experience
            our instruments in person, explore our complete collection online,
            or speak directly with our piano specialists, we're here to guide
            you every step of the way. Kawai dealers nationwide are ready to
            help you find the perfect piano that will inspire decades of
            musical excellence.
          </p>
        </motion.div>

        {/* Conversion Path Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {conversionPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="bg-white rounded-xl shadow-sm border border-kawai-pearl/50 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Card Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                {/* Icon */}
                <div className="text-kawai-red group-hover:scale-110 transition-transform duration-300 mb-6">
                  {path.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-semibold text-kawai-black mb-4 font-serif">
                  {path.title}
                </h3>

                {/* Description */}
                <p className="text-kawai-black/70 leading-relaxed mb-6 flex-grow">
                  {path.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={path.ctaLink}
                  className={`
                    inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center
                    ${
                      path.variant === "primary"
                        ? "bg-kawai-red hover:bg-kawai-red/90 text-white shadow-lg hover:shadow-xl"
                        : "border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white"
                    }
                  `}
                >
                  {path.ctaText}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-kawai-pearl/50 p-8 sm:p-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center md:text-left">
            {/* Trust Element 1 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-bold text-kawai-red mb-2">
                95+
              </div>
              <div className="text-sm sm:text-base text-kawai-black/70">
                Years of Piano
                <br />
                Craftsmanship
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-kawai-pearl" />

            {/* Trust Element 2 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-bold text-kawai-red mb-2">
                500+
              </div>
              <div className="text-sm sm:text-base text-kawai-black/70">
                Authorized Dealers
                <br />
                Nationwide
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-kawai-pearl" />

            {/* Trust Element 3 */}
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-bold text-kawai-red mb-2">
                #1
              </div>
              <div className="text-sm sm:text-base text-kawai-black/70">
                Preferred by Concert
                <br />
                Pianists Worldwide
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-kawai-black/60 max-w-2xl mx-auto">
            Kawai's commitment to excellence has made us the choice of
            conservatories, concert halls, and discerning musicians for nearly a
            century. Every piano we craft embodies Japanese precision, innovative
            technology, and an unwavering dedication to inspiring musical
            brilliance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
