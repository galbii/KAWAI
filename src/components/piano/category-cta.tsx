"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface CategoryCTAProps {
  category: string;
  title: string;
  description: string;
  ctaText: string;
  backgroundTheme?: string;
}

export function CategoryCTA({ 
  category, 
  title, 
  description, 
  ctaText,
  backgroundTheme = "#dc2626" // Default to Kawai red
}: CategoryCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={ctaRef}
      className="py-16 lg:py-24 bg-kawai-pearl text-center relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Category Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span 
            className="px-4 py-2 rounded-full text-white text-sm font-medium tracking-wide"
            style={{ backgroundColor: backgroundTheme }}
          >
            {category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12"
        >
          {description}
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA */}
          <Link
            href="/showroom"
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>{ctaText}</span>
            <svg
              className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 border-2 border-kawai-black text-kawai-black hover:bg-kawai-black hover:text-kawai-pearl font-medium rounded-md transition-all duration-300 group text-lg"
          >
            <span>Contact Specialist</span>
            <svg
              className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-kawai-black/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-kawai-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-kawai-black">Visit Showroom</h3>
            <p className="text-sm text-kawai-black/60">Experience instruments in person with expert guidance</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-kawai-black/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-kawai-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-kawai-black">Expert Consultation</h3>
            <p className="text-sm text-kawai-black/60">Get personalized recommendations from piano specialists</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-kawai-black/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-kawai-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-kawai-black">Financing Available</h3>
            <p className="text-sm text-kawai-black/60">Flexible payment options to make your dream piano affordable</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}