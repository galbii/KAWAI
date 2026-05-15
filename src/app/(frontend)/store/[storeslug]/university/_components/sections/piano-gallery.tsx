"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import type { Product } from '@/payload-types';

interface FeaturedPiano {
  id: string;
  model: string;
  title: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  keyFeatures: string[];
  availability: string;
}

interface PianoSectionProps {
  piano: FeaturedPiano;
  index: number;
  hasTrackedAnyPiano: React.MutableRefObject<boolean>;
}

function PianoSection({ piano, index, hasTrackedAnyPiano }: PianoSectionProps) {
  const { ref: sectionRef, isVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  const activeTimer = useRef<NodeJS.Timeout | null>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    if (activeTimer.current) {
      clearTimeout(activeTimer.current);
      activeTimer.current = null;
    }

    if (isVisible && !hasTrackedAnyPiano.current) {
      activeTimer.current = setTimeout(() => {
        if (!hasTrackedAnyPiano.current) {
          hasTrackedAnyPiano.current = true;
        }
        activeTimer.current = null;
      }, 6000);
    }

    return () => {
      if (activeTimer.current) {
        clearTimeout(activeTimer.current);
        activeTimer.current = null;
      }
    };
  }, [isVisible, piano.model, piano.salePrice, piano.category, hasTrackedAnyPiano]);

  return (
    <section
      ref={sectionRef}
      className="py-10"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div
          className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
            isEven ? '' : 'lg:grid-flow-col-dense'
          }`}
          style={{
            background: '#FFFFFF',
            borderColor: 'rgba(77,25,121,0.12)',
            boxShadow: '0 2px 20px rgba(77,25,121,0.08)',
          }}
        >
          <div className={`grid lg:grid-cols-2 items-stretch`}>
            {/* Image */}
            <div className={`relative ${isEven ? 'order-1 lg:order-2' : 'order-1 lg:col-start-1'}`}>
              <div
                className={`relative h-72 lg:h-full min-h-[300px] transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                }`}
              >
                <Image
                  src={piano.image}
                  alt={`${piano.title} - Available at the TCU Piano Sale Fort Worth`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d2e]/20 to-transparent" />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wider uppercase font-medium"
                  style={{
                    background: 'rgba(77,25,121,0.08)',
                    border: '1px solid rgba(77,25,121,0.25)',
                    color: '#4D1979',
                  }}
                >
                  {piano.model}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`p-8 lg:p-10 flex flex-col justify-center space-y-6 ${isEven ? 'order-2 lg:order-1' : 'order-2 lg:col-start-2'}`}>
              <div
                className={`space-y-1 transition-all duration-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(26,13,46,0.45)' }}>
                  {piano.category}
                </div>
                <h2 className="font-heading italic text-[#1a0d2e] text-2xl md:text-3xl lg:text-4xl font-black">
                  {piano.title}
                </h2>
              </div>

              {/* Pricing */}
              <div
                className={`space-y-2 transition-all duration-600 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-end gap-3 flex-wrap">
                  {piano.salePrice > 0 ? (
                    <span className="text-3xl font-bold" style={{ color: '#4D1979' }}>
                      ${piano.salePrice.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-lg font-medium" style={{ color: 'rgba(26,13,46,0.55)' }}>
                      Contact for pricing
                    </span>
                  )}
                  {piano.originalPrice > piano.salePrice && piano.salePrice > 0 && (
                    <span className="text-sm line-through" style={{ color: 'rgba(26,13,46,0.40)' }}>
                      ${piano.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {piano.savings > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(244,125,32,0.2)',
                        border: '1px solid rgba(244,125,32,0.5)',
                        color: '#F47D20',
                      }}
                    >
                      Save ${piano.savings.toLocaleString()}
                    </span>
                  )}
                </div>
                {piano.salePrice > 0 && (
                  <div className="text-sm" style={{ color: 'rgba(26,13,46,0.65)' }}>
                    As low as ${Math.round(piano.salePrice / 36).toLocaleString()}/mo · 36-month 0% financing
                  </div>
                )}
              </div>

              {/* Features */}
              <div
                className={`space-y-2 transition-all duration-600 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <ul className="space-y-2">
                  {piano.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: '#4D1979' }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm" style={{ color: '#3a2060' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability + CTA */}
              <div
                className={`space-y-4 transition-all duration-600 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-xs" style={{ color: 'rgba(26,13,46,0.45)' }}>
                  {piano.availability}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function mapProduct(product: Product): FeaturedPiano {
  const variation = product.variations?.[0]
  const salePrice = variation?.price ?? 0
  const compareAtPrice = variation?.compareAtPrice ?? product.price?.msrp ?? 0
  const savings = compareAtPrice > salePrice ? compareAtPrice - salePrice : 0

  const keyFeatures = (product.highlights ?? [])
    .slice(0, 4)
    .map(h => h.highlight ?? '')
    .filter(Boolean)

  return {
    id: product.model,
    model: product.model,
    title: product.name ?? product.model,
    description: product.description ?? '',
    image: product.imageUrl ?? '/images/optimized/pianos/es120.webp',
    category: product.type ?? product.category ?? '',
    originalPrice: compareAtPrice,
    salePrice,
    savings,
    keyFeatures,
    availability: 'Available at the event · Fort Worth',
  }
}

interface FeaturedDealsProps {
  products: Product[]
  onOpenConsultation: () => void;
}

export function FeaturedDeals({ products, onOpenConsultation }: FeaturedDealsProps) {
  const pianos = products.map(mapProduct);
  const hasTrackedAnyPiano = useRef<boolean>(false);
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div id="featured-deals" style={{ background: '#FAFAFE' }} className="border-t border-[rgba(77,25,121,0.12)]">
      {/* Section Header */}
      <section ref={headerRef} className="pt-16 pb-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div
            className={`mb-8 transition-all duration-600 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div
              className={`text-xs tracking-[0.2em] uppercase mb-4 transition-all duration-600 ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ color: 'rgba(26,13,46,0.45)' }}
            >
              Featured Models
            </div>

            <h1 className="font-heading italic text-[#1a0d2e] text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              TCU Piano Sale
            </h1>

            <div
              className={`flex items-center justify-center gap-4 flex-wrap transition-all duration-600 delay-300 ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span
                className="text-xs tracking-wider uppercase px-4 py-2 rounded"
                style={{
                  background: 'rgba(77,25,121,0.06)',
                  border: '1px solid rgba(77,25,121,0.15)',
                  color: 'rgba(26,13,46,0.65)',
                }}
              >
                Exclusive Showcase &nbsp;·&nbsp; May 28th – 31st, 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Models */}
      {pianos.map((piano, index) => (
        <PianoSection key={piano.id} piano={piano} index={index} hasTrackedAnyPiano={hasTrackedAnyPiano} />
      ))}

      {/* CTA Section */}
      <section className="py-16 text-center border-t border-[rgba(77,25,121,0.12)]" style={{ background: 'rgba(77,25,121,0.04)' }}>
        <div className="max-w-2xl mx-auto px-6 space-y-5">
          <h3 className="font-heading italic text-[#1a0d2e] text-2xl md:text-3xl font-black">
            Schedule Your Personal Appointment
          </h3>
          <p className="text-sm md:text-base max-w-lg mx-auto" style={{ color: '#3a2060' }}>
            Get priority access to special university pricing and deals when you book your appointment. See more models in person and connect with our KAWAI piano experts for personalized recommendations.
          </p>
          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenConsultation}
              style={{
                background: '#4D1979',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <span>Book Appointment</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-xs" style={{ color: 'rgba(26,13,46,0.45)' }}>
              May 28th–31st experiences available · Appointment only
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
