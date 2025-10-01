"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PianoType {
  type: string;
  bestFor: string;
  spaceRequired: string;
  priceRange: string;
  soundCharacter: string;
  maintenance: string;
  keyAdvantages: string[];
  kawaiModels: string[];
  categoryLink: string;
}

export function PianoTypeComparison() {
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

  const pianoTypes: PianoType[] = [
    {
      type: "Grand Piano",
      bestFor: "Professional musicians, serious students, concert performance, recording studios, and dedicated music rooms",
      spaceRequired: "Large: 5' to 9' length, requires 8-10' ceiling height for optimal acoustics",
      priceRange: "$15,000 - $180,000+",
      soundCharacter: "Rich, full-bodied tone with exceptional projection and sustain. Superior dynamic range from delicate pianissimo to powerful fortissimo. Complex harmonic overtones create singing, resonant sound.",
      maintenance: "Professional tuning 2-4x yearly, humidity control essential (40-50%), periodic regulation and voicing by certified technician every 5-10 years",
      keyAdvantages: [
        "Unmatched tonal complexity and projection",
        "Superior touch response with longer keys and optimized leverage",
        "Ideal for advanced classical repertoire and professional performance",
        "Commanding visual presence as centerpiece furniture"
      ],
      kawaiModels: ["Shigeru Kawai SK-EX", "GX-7", "GX-3", "GL-30", "GL-10"],
      categoryLink: "/pianos/grand"
    },
    {
      type: "Upright Piano",
      bestFor: "Home practice, intermediate to advanced students, teaching studios, space-conscious classical pianists, and traditional piano enthusiasts",
      spaceRequired: "Moderate: 5' wide x 2' deep x 4-5' tall, fits against wall in most rooms",
      priceRange: "$4,000 - $25,000",
      soundCharacter: "Warm, full tone with good projection for room size. Vertical design offers surprising depth and resonance, especially in premium models with longer strings and larger soundboards.",
      maintenance: "Professional tuning 2x yearly minimum, humidity control recommended (40-50%), periodic regulation every 5-10 years, less intensive than grand piano care",
      keyAdvantages: [
        "Authentic acoustic piano experience in space-efficient design",
        "Excellent value for quality craftsmanship and tonal depth",
        "Full 88-key range with traditional weighted action",
        "Heritage aesthetic complements classic home décor"
      ],
      kawaiModels: ["K-800 ATX4", "K-500", "K-300", "ND-21"],
      categoryLink: "/pianos/upright"
    },
    {
      type: "Digital Piano",
      bestFor: "Beginners, apartment dwellers, silent practice needs, home entertainment, portable performance, and budget-conscious families",
      spaceRequired: "Compact: Console models 4.5' wide, portable keyboards even smaller, minimal depth",
      priceRange: "$500 - $8,000",
      soundCharacter: "Sampled from concert grands with advanced modeling technology. Premium models like Kawai's CA901 deliver remarkably authentic grand piano tone with multi-dimensional sampling and onboard speaker systems.",
      maintenance: "Virtually maintenance-free: no tuning required, dust regularly, avoid liquids near instrument. Solid-state technology ensures consistent performance for decades.",
      keyAdvantages: [
        "Silent practice with headphones - ideal for apartments and noise-sensitive environments",
        "Built-in metronome, recording, and learning features enhance practice efficiency",
        "Multiple instrument voices and connectivity (USB-MIDI, Bluetooth) for modern music creation",
        "Lightweight and portable options available for gigging musicians"
      ],
      kawaiModels: ["CA901", "CA701", "ES920", "ES520", "ES120"],
      categoryLink: "/pianos/digital"
    },
    {
      type: "Hybrid Piano",
      bestFor: "Serious pianists seeking authentic touch with digital versatility, recording artists, educators needing both acoustic feel and technology integration",
      spaceRequired: "Same as upright pianos: 5' wide x 2' deep x 4-5' tall, console design",
      priceRange: "$6,000 - $18,000",
      soundCharacter: "Combines Kawai's premium digital piano sound engine with authentic grand piano action. Delivers concert grand tone quality with the convenience of digital technology and volume control.",
      maintenance: "Minimal: no acoustic tuning needed, but real wooden keys require same humidity consideration as acoustic pianos (40-50% RH recommended)",
      keyAdvantages: [
        "Real wooden-key grand piano action (Grand Feel, Millennium III) - the most authentic digital touch available",
        "Silent practice capability while maintaining professional-grade playing experience",
        "Advanced sound technology rivaling acoustic grands with convenience of digital features",
        "Bridge between acoustic tradition and digital innovation - best of both worlds"
      ],
      kawaiModels: ["Novus NV10S", "Novus NV5S", "CA901 (premium digital)", "Aures Series"],
      categoryLink: "/pianos/hybrid"
    }
  ];

  return (
    <section ref={sectionRef} className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Piano Types
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
            Understanding Your{" "}
            <span className="text-kawai-red">Piano Options</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            Each piano type offers unique advantages for different musical goals, spaces, and budgets.
            Discover which piano design best matches your needs and lifestyle.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Scrollable Table */}
        <div className="hidden lg:block overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-max"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-kawai-black text-white">
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide">Piano Type</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[280px]">Best For</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[200px]">Space Required</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[180px]">Price Range</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[280px]">Sound Character</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[280px]">Maintenance</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[300px]">Key Advantages</th>
                  <th className="px-6 py-4 text-left font-medium text-sm tracking-wide min-w-[200px]">Kawai Models</th>
                </tr>
              </thead>
              <tbody>
                {pianoTypes.map((piano, index) => (
                  <motion.tr
                    key={piano.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="border-b border-kawai-pearl hover:bg-white/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-6">
                      <Link
                        href={piano.categoryLink}
                        className="font-semibold text-kawai-red hover:text-kawai-black transition-colors duration-200 text-lg"
                      >
                        {piano.type}
                      </Link>
                    </td>
                    <td className="px-6 py-6 text-kawai-black/80 leading-relaxed text-sm">{piano.bestFor}</td>
                    <td className="px-6 py-6 text-kawai-black/80 leading-relaxed text-sm">{piano.spaceRequired}</td>
                    <td className="px-6 py-6 text-kawai-black font-medium text-sm">{piano.priceRange}</td>
                    <td className="px-6 py-6 text-kawai-black/80 leading-relaxed text-sm">{piano.soundCharacter}</td>
                    <td className="px-6 py-6 text-kawai-black/80 leading-relaxed text-sm">{piano.maintenance}</td>
                    <td className="px-6 py-6">
                      <ul className="space-y-2">
                        {piano.keyAdvantages.map((advantage, idx) => (
                          <li key={idx} className="flex items-start text-sm text-kawai-black/80">
                            <svg className="w-4 h-4 text-kawai-red mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-2">
                        {piano.kawaiModels.map((model) => (
                          <span
                            key={model}
                            className="inline-block px-3 py-1 bg-kawai-red/10 text-kawai-red rounded-full text-xs font-medium"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="lg:hidden space-y-6">
          {pianoTypes.map((piano, index) => (
            <motion.div
              key={piano.type}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="bg-white rounded-xl shadow-sm border border-kawai-pearl/50 overflow-hidden"
            >
              <div className="bg-kawai-black px-6 py-4">
                <Link
                  href={piano.categoryLink}
                  className="text-xl font-semibold text-white hover:text-kawai-red transition-colors duration-200"
                >
                  {piano.type}
                </Link>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Best For</h4>
                  <p className="text-kawai-black/80 leading-relaxed">{piano.bestFor}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Space Required</h4>
                  <p className="text-kawai-black/80 leading-relaxed">{piano.spaceRequired}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Price Range</h4>
                  <p className="text-kawai-black font-medium text-lg">{piano.priceRange}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Sound Character</h4>
                  <p className="text-kawai-black/80 leading-relaxed">{piano.soundCharacter}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Maintenance</h4>
                  <p className="text-kawai-black/80 leading-relaxed">{piano.maintenance}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Key Advantages</h4>
                  <ul className="space-y-2">
                    {piano.keyAdvantages.map((advantage, idx) => (
                      <li key={idx} className="flex items-start text-kawai-black/80">
                        <svg className="w-5 h-5 text-kawai-red mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-kawai-red mb-2 uppercase tracking-wide">Kawai Models</h4>
                  <div className="flex flex-wrap gap-2">
                    {piano.kawaiModels.map((model) => (
                      <span
                        key={model}
                        className="inline-block px-3 py-1.5 bg-kawai-red/10 text-kawai-red rounded-full text-sm font-medium"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={piano.categoryLink}
                  className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-black transition-colors duration-200 pt-4 border-t border-kawai-pearl group"
                >
                  Explore {piano.type}s
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-kawai-black/70 mb-6 text-lg">
            Still unsure which piano type is right for you?
          </p>
          <Link
            href="/find-my-piano#quiz"
            className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[44px]"
          >
            Take Our Piano Finder Quiz
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
