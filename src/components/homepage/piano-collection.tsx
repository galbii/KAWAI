"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import { PianoCollectionProps, DEFAULT_PIANO_COLLECTION_DATA } from '@/lib/types/homepage';

export function PianoCollection({ data = DEFAULT_PIANO_COLLECTION_DATA }: PianoCollectionProps) {
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

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

        {/* Featured Pianos with Video - Mobile optimized */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4 sm:mb-6">
              {data.collectionSectionHeader}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-kawai-black mb-6 sm:mb-8 font-serif leading-tight">
              {data.collectionTitle.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < data.collectionTitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-kawai-black/70 mb-8 sm:mb-12 leading-relaxed">
              {data.collectionDescription}
            </p>
            <Link
              href={data.collectionCta.link}
              className="inline-flex items-center text-kawai-red font-medium text-base sm:text-lg group min-h-[44px] touch-manipulation"
            >
              {data.collectionCta.text}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* YouTube Video — facade pattern: shows thumbnail until user clicks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 relative order-1 lg:order-2"
          >
            <YouTubeEmbed
              videoId={data.featuredVideo?.youtubeId || "1cmwb6evs2A"}
              title="Kawai Piano Collection"
              aspectRatio="video"
              className="rounded-lg shadow-lg"
              privacy={true}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}