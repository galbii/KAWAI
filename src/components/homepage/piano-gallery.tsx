"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PianoModel {
  id: string;
  model: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const pianoModels: PianoModel[] = [
  {
    id: "grand",
    model: "Grand",
    title: "Grand Pianos",
    description: "Professional acoustic grand pianos for concert halls, studios, and discerning homes. Experience the ultimate in touch, tone, and musical expression with instruments trusted by professional musicians worldwide.",
    image: "/images/banners/SK-EX-grand-styling.webp",
    href: "/pianos/grand"
  },
  {
    id: "digital",
    model: "Digital",
    title: "Digital Pianos",
    description: "Advanced digital pianos featuring realistic wooden-key actions and premium sound systems. Combining authentic acoustic piano experience with modern technology and convenient features for today's musicians.",
    image: "/images/banners/CA901EP-bench-styling.webp", 
    href: "/pianos/digital"
  },
  {
    id: "upright",
    model: "Upright",
    title: "Upright Pianos",
    description: "Space-efficient acoustic pianos delivering exceptional touch and tone quality. Perfect for homes, studios, schools, and institutions where space is at a premium but musical excellence cannot be compromised.",
    image: "/images/banners/K800-upright-styling.webp",
    href: "/pianos/upright"
  },
  {
    id: "hybrid",
    model: "Hybrid",
    title: "Hybrid Pianos",
    description: "Revolutionary instruments combining real grand piano actions with advanced digital sound technology. Experience the authentic touch of acoustic keys with the versatility and innovation of digital sound.",
    image: "/images/banners/NV10S-hybrid-styling.webp",
    href: "/pianos/hybrid"
  }
];

interface PianoSectionProps {
  piano: PianoModel;
  index: number;
}

function PianoSection({ piano, index }: PianoSectionProps) {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start image animation immediately
          setIsImageVisible(true);
          
          // Start text animation after a delay
          setTimeout(() => {
            setIsTextVisible(true);
          }, 500);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section 
      ref={sectionRef}
      className="min-h-[60vh] flex items-center py-8"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Content */}
          <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}>
            <div className={`space-y-4 transition-all duration-700 ease-out ${
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black">
                {piano.title}
              </h2>
              
              <p className="text-lg md:text-xl leading-relaxed text-kawai-black/80 max-w-2xl">
                {piano.description}
              </p>
            </div>
            
            <div className={`pt-2 transition-all duration-700 ease-out delay-100 ${
              isTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <Link
                href={piano.href}
                className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
              >
                <span>Explore {piano.model} Pianos</span>
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
            </div>
          </div>

          {/* Image */}
          <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
            <div className={`relative transition-all duration-800 ease-out ${
              isImageVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${isEven ? 'translate-x-12' : '-translate-x-12'}`
            }`}>
              <Image
                src={piano.image}
                alt={piano.title}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PianoGallery() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-kawai-pearl">
      {/* Section Header */}
      <section ref={heroRef} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-kawai-black mb-6 transition-all duration-700 ease-out ${
            isHeroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            Explore Our Piano Collection
          </h1>
          <p className={`text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto transition-all duration-700 ease-out delay-200 ${
            isHeroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            Discover the full range of Kawai pianos, from handcrafted grand pianos to innovative digital and hybrid instruments. Each piano represents our commitment to exceptional craftsmanship and musical excellence.
          </p>
        </div>
      </section>

      {/* Piano Models */}
      {pianoModels.map((piano, index) => (
        <PianoSection key={piano.id} piano={piano} index={index} />
      ))}
    </div>
  );
}