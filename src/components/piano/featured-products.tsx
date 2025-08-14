"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Piano {
  slug: string;
  name: string;
  series?: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  keyFeatures: string[];
  badge?: string;
}

interface FeaturedProductsProps {
  title: string;
  description: string;
  pianos: Piano[];
  categorySlug: string;
}

interface ProductCardProps {
  piano: Piano;
  index: number;
  categorySlug: string;
}

function ProductCard({ piano, index, categorySlug }: ProductCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-kawai-neutral/20 to-kawai-neutral/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {piano.image && piano.image !== "/api/placeholder/400/300" ? (
              <Image
                src={piano.image}
                alt={piano.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-24 h-24 text-kawai-black/40">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
                  <path d="M11 7h2v4h-2zM11 13h2v2h-2z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            {piano.series && (
              <p className="text-sm text-kawai-black/60 font-medium mb-1">
                {piano.series}
              </p>
            )}
            <h3 className="text-2xl font-bold text-kawai-black mb-2">
              {piano.name}
            </h3>
            <p className="text-kawai-black/70 leading-relaxed">
              {piano.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(piano.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-kawai-black/60">
              ({piano.reviews} reviews)
            </span>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-semibold text-kawai-black mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {piano.keyFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-sm text-kawai-black/70 flex items-start">
                  <span className="w-1.5 h-1.5 bg-kawai-red rounded-full mr-2 mt-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-kawai-neutral/20">
            <Link
              href={`/pianos/${categorySlug}/${piano.slug}`}
              className="block w-full text-center px-6 py-3 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-lg transition-all duration-300 group"
            >
              <span>Learn More</span>
              <svg
                className="w-4 h-4 ml-2 inline transition-transform duration-300 group-hover:translate-x-1"
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
      </div>
    </motion.div>
  );
}

export function FeaturedProducts({ 
  title, 
  description, 
  pianos, 
  categorySlug 
}: FeaturedProductsProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="featured-products" className="py-16 lg:py-24 bg-kawai-pearl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pianos.map((piano, index) => (
            <ProductCard 
              key={piano.slug} 
              piano={piano} 
              index={index}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}