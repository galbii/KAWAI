"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function InnovationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const innovations = [
    {
      title: "Millennium III Carbon Fiber Action",
      description: "What makes Kawai pianos different? The revolutionary Millennium III action combines ABS-Carbon composite materials for unparalleled speed, control, and consistency. This advanced piano key action delivers lightning-fast response without compromising the nuanced control pianists demand.",
      benefits: [
        "5x stronger than wood",
        "Impervious to humidity changes",
        "Lightning-fast repetition speed",
        "Consistent touch across all 88 keys"
      ],
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "AnyTime Silent System",
      description: "Practice anytime without disturbing others. The AnyTime system seamlessly integrates digital silence technology with acoustic piano performance, giving you the freedom to play 24/7 with headphones while maintaining authentic piano touch and response.",
      benefits: [
        "Silent practice mode",
        "Authentic acoustic feel",
        "High-quality digital sounds",
        "Record your performances"
      ],
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M17 7v10M7 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: "Premium Materials & Precision Engineering",
      description: "Every component is engineered to exacting standards. From genuine mahogany hammer molds to precision-tapered soundboards, Kawai's advanced piano technology ensures structural integrity and tonal excellence that lasts generations.",
      benefits: [
        "Genuine mahogany parts",
        "Precision-tapered soundboards",
        "Extended tuning stability",
        "Lifetime durability"
      ],
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Innovation & Technology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
            Innovation That You Can <span className="text-kawai-red">Feel</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            What makes Kawai pianos different? Cutting-edge technology meets traditional craftsmanship.
            Experience the advanced piano technology that sets Kawai apart from every other piano brand.
          </p>
        </motion.div>

        {/* Featured Innovation - Millennium III */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12 bg-kawai-pearl rounded-2xl overflow-hidden shadow-xl border border-kawai-pearl"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-kawai-black mb-4">
                {innovations[0]?.title}
              </h3>
              <p className="text-lg text-kawai-black/80 mb-6 leading-relaxed">
                {innovations[0]?.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {innovations[0]?.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-kawai-black/70">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/technology"
                className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red/80 transition-colors group"
              >
                Learn More About Millennium III Action
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Visual */}
            <div className="relative min-h-[300px] lg:min-h-[400px] overflow-hidden">
              <Image
                src="https://kawai.com.au/wp-content/uploads/2019/12/millennium3SK.jpg"
                alt="Millennium III Carbon Fiber Action"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>

        {/* Secondary Innovations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {innovations.slice(1).map((innovation, index) => (
            <motion.div
              key={innovation.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
              className="bg-white border border-kawai-pearl rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-kawai-red/10 text-kawai-red rounded-lg mb-4">
                {innovation.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-kawai-black mb-3">
                {innovation.title}
              </h3>
              <p className="text-kawai-black/70 mb-4 leading-relaxed">
                {innovation.description}
              </p>
              <div className="space-y-2">
                {innovation.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-kawai-red mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-kawai-black/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/pianos"
            className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            Experience These Innovations
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
