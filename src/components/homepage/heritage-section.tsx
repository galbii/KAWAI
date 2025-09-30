"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeritageSection() {
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

  const stats = [
    { label: "Established", value: "1927" },
    { label: "Experience", value: "95+ Years" },
    { label: "Heritage", value: "Family Owned" },
    { label: "Tradition", value: "Japanese Craftsmanship" }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Section Label */}
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase">
              Our Heritage
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black leading-tight">
              95+ Years of Japanese Piano{" "}
              <span className="text-kawai-red">Craftsmanship</span>
            </h2>

            {/* Body Copy - SEO optimized with semantic keywords */}
            <div className="space-y-4 text-lg sm:text-xl text-kawai-black/80 leading-relaxed">
              <p>
                Since 1927, the Kawai name has represented the pinnacle of{" "}
                <strong className="font-medium text-kawai-black">Japanese piano craftsmanship</strong> and
                innovation. What began as a vision to create quality piano brands that rival the finest
                European instruments has grown into a legacy of precision, artistry, and unwavering dedication
                to musical excellence.
              </p>
              <p>
                Every Kawai piano embodies our founder's philosophy: blend{" "}
                <strong className="font-medium text-kawai-black">traditional piano making</strong> techniques
                with fearless innovation. This unique approach to piano manufacturing has made Kawai pianos
                the choice of concert halls, conservatories, and discerning musicians worldwide who demand
                both heritage and cutting-edge performance.
              </p>
              <p>
                Our commitment to{" "}
                <strong className="font-medium text-kawai-black">piano manufacturing expertise</strong> spans
                nearly a century, yet we remain family-owned, ensuring that every instrument reflects the
                values and vision that have defined Japanese piano brands: meticulous attention to detail,
                uncompromising quality, and respect for the musical tradition.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-kawai-pearl">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-kawai-red mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-kawai-black/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/heritage/kawai-craftsman.jpg"
                alt="Kawai piano craftsman demonstrating Japanese piano craftsmanship and traditional piano making techniques"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-kawai-pearl">
              <div className="text-center">
                <div className="text-4xl font-bold text-kawai-red mb-1">1927</div>
                <div className="text-sm text-kawai-black/70 font-medium">Est.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
