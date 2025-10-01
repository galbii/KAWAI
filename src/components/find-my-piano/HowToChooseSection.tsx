"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/**
 * HowToChooseSection Component
 *
 * Comprehensive educational guide section targeting SEO keywords:
 * - "how to choose a piano"
 * - "piano buying guide"
 * - "find the right piano"
 *
 * Features:
 * - 800+ words of SEO-optimized content
 * - Visual decision framework diagram
 * - Key decision factors with highlight cards
 * - Internal links to guide spoke pages
 * - Addresses buyer journey stages (awareness → consideration)
 * - Highlights Kawai's warm tone and wooden key action advantages
 *
 * Design follows Kawai brand patterns with IntersectionObserver animations
 */

interface HowToChooseSectionProps {
  className?: string;
}

export function HowToChooseSection({ className = "" }: HowToChooseSectionProps) {
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

  // Key decision factors with stat highlights
  const decisionFactors = [
    {
      title: "Touch & Key Action",
      description: "The most critical factor in piano selection",
      icon: "🎹",
      stat: "#1 Priority",
      color: "text-kawai-red"
    },
    {
      title: "Sound Quality",
      description: "Warm vs bright tone characteristics",
      icon: "🎵",
      stat: "Distinctive",
      color: "text-kawai-gold"
    },
    {
      title: "Space & Budget",
      description: "Practical considerations for your home",
      icon: "🏠",
      stat: "Essential",
      color: "text-kawai-black"
    },
    {
      title: "Skill Level",
      description: "Room to grow with your playing",
      icon: "📈",
      stat: "Future-proof",
      color: "text-kawai-red"
    }
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`relative bg-white py-16 sm:py-20 lg:py-28 ${className}`}
      aria-labelledby="how-to-choose-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6"
          >
            Your Guide
          </motion.div>

          <motion.h2
            id="how-to-choose-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black leading-tight"
          >
            How to Choose Your{" "}
            <span className="text-kawai-red">Perfect Piano</span>
          </motion.h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-lg text-kawai-black/80 leading-relaxed"
          >
            {/* Introduction - Keyword: "how to choose a piano" */}
            <p>
              Selecting the right piano is one of the most important decisions in your musical journey.
              With countless models ranging from compact digitals to concert grands, understanding{" "}
              <strong className="font-medium text-kawai-black">how to choose a piano</strong> that matches
              your needs, space, and budget requires careful consideration of several key factors.
            </p>

            {/* Digital vs Acoustic Decision - High-value keyword cluster */}
            <p>
              The first major decision in any{" "}
              <strong className="font-medium text-kawai-black">piano buying guide</strong> is choosing between
              acoustic and digital instruments. Acoustic pianos offer unmatched organic resonance and the
              traditional piano experience, while digital pianos provide versatility, volume control for
              apartment living, and lower maintenance requirements. Modern premium digital pianos like Kawai's
              CA and NV series feature wooden key actions and advanced sound sampling that faithfully recreate
              the acoustic grand piano experience.
            </p>

            {/* Touch Quality - Kawai's competitive advantage */}
            <p>
              Touch quality is the single most critical factor when learning{" "}
              <strong className="font-medium text-kawai-black">how to find the right piano</strong>.
              The key action determines how the instrument responds to your playing, affecting everything from
              basic technique development to advanced musical expression. Kawai pioneered wooden key actions
              in digital pianos with our innovative Millennium III and Grand Feel III mechanisms, providing
              the authentic touch and response of a grand piano with the practical benefits of digital technology.
            </p>

            {/* Sound Character - Differentiation opportunity */}
            <p>
              Sound character varies dramatically between piano brands and models. Kawai pianos are renowned
              for their{" "}
              <strong className="font-medium text-kawai-black">warm, rich tone</strong> that classical
              pianists worldwide prefer for its singing quality and tonal depth. This distinctive sound
              comes from our proprietary soundboard designs and the same concert grand piano sampling used
              in prestigious conservatories. Understanding whether you prefer a warm or bright piano tone
              helps narrow your{" "}
              <Link
                href="/guides/piano-sound-characteristics"
                className="text-kawai-red hover:underline font-medium"
              >
                piano selection process
              </Link> significantly.
            </p>

            {/* Budget & Value - High search volume keyword */}
            <p>
              Budget considerations extend beyond the initial purchase price. A comprehensive{" "}
              <strong className="font-medium text-kawai-black">piano buying guide</strong> must account
              for long-term value, including durability, maintenance costs, and resale value. Entry-level
              Kawai digitals start around $700-$1,000, mid-range instruments with advanced features range
              from $2,000-$4,000, and our premium models offering the ultimate acoustic piano replication
              reach $5,000-$10,000. For{" "}
              <Link
                href="/guides/piano-budget-guide"
                className="text-kawai-red hover:underline font-medium"
              >
                detailed budget guidance
              </Link>, explore our comprehensive pricing breakdown.
            </p>

            {/* Space & Living Situation - High-intent use case */}
            <p>
              Your living situation dramatically impacts{" "}
              <strong className="font-medium text-kawai-black">which piano you should buy</strong>.
              Apartment dwellers benefit from digital pianos with headphone capabilities and volume control,
              while those with dedicated music rooms might prioritize full-sized instruments with maximum
              acoustic projection. Kawai's compact designs and{" "}
              <Link
                href="/guides/piano-for-apartments"
                className="text-kawai-red hover:underline font-medium"
              >
                silent practice technology
              </Link> solve the challenge of enjoying premium piano quality in space-constrained environments.
            </p>

            {/* Skill Level & Growth - Student/beginner focus */}
            <p>
              Matching a piano to your current skill level while allowing room for growth prevents costly
              upgrades later. Beginning students need responsive touch and quality sound to develop proper
              technique, while intermediate and advanced players require instruments capable of sophisticated
              musical expression. Our{" "}
              <Link
                href="/guides/piano-for-students"
                className="text-kawai-red hover:underline font-medium"
              >
                student piano guide
              </Link> helps parents and teachers select instruments that inspire practice and accommodate
              years of musical development without limitations.
            </p>

            {/* Try Before You Buy - Expert recommendation */}
            <p>
              The most important step in{" "}
              <strong className="font-medium text-kawai-black">choosing the right piano</strong> is
              testing instruments in person. Touch sensitivity, sound character, and overall feel vary
              between models in ways specifications cannot convey. Visit a{" "}
              <Link
                href="/dealers"
                className="text-kawai-red hover:underline font-medium"
              >
                Kawai dealer near you
              </Link> to experience the difference our wooden key actions and warm tonal character make,
              and receive personalized guidance from piano experts who understand your unique musical needs.
            </p>
          </motion.div>

          {/* Visual Decision Framework */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Decision Tree Visual */}
            <div className="bg-kawai-pearl rounded-2xl p-8 shadow-lg border border-kawai-pearl">
              <h3 className="text-2xl font-serif font-light text-kawai-black mb-6">
                Piano Selection Framework
              </h3>

              <div className="space-y-4">
                {/* Decision Step 1 */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-kawai-red">
                  <div className="font-medium text-kawai-black mb-2">
                    1. Define Your Primary Use
                  </div>
                  <ul className="text-sm text-kawai-black/70 space-y-1 ml-4">
                    <li>• Learning & practice</li>
                    <li>• Performance & recording</li>
                    <li>• Teaching studio</li>
                    <li>• Home entertainment</li>
                  </ul>
                </div>

                {/* Decision Step 2 */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-kawai-gold">
                  <div className="font-medium text-kawai-black mb-2">
                    2. Assess Your Space
                  </div>
                  <ul className="text-sm text-kawai-black/70 space-y-1 ml-4">
                    <li>• Available floor space</li>
                    <li>• Noise restrictions</li>
                    <li>• Aesthetic preferences</li>
                    <li>• Portability needs</li>
                  </ul>
                </div>

                {/* Decision Step 3 */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-kawai-red">
                  <div className="font-medium text-kawai-black mb-2">
                    3. Set Your Budget Range
                  </div>
                  <ul className="text-sm text-kawai-black/70 space-y-1 ml-4">
                    <li>• Entry: $700-$1,500</li>
                    <li>• Mid-range: $2,000-$4,000</li>
                    <li>• Premium: $5,000-$10,000+</li>
                    <li>• Acoustic: $10,000-$100,000+</li>
                  </ul>
                </div>

                {/* Decision Step 4 */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-kawai-gold">
                  <div className="font-medium text-kawai-black mb-2">
                    4. Prioritize Key Features
                  </div>
                  <ul className="text-sm text-kawai-black/70 space-y-1 ml-4">
                    <li>• Weighted wooden keys</li>
                    <li>• Warm vs bright tone</li>
                    <li>• Silent practice capability</li>
                    <li>• Recording & connectivity</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-kawai-pearl/50">
                <Link
                  href="/guides/first-piano"
                  className="text-kawai-red hover:underline font-medium text-sm inline-flex items-center gap-2"
                >
                  Complete First Piano Guide
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Key Decision Factors Cards */}
            <div className="grid grid-cols-2 gap-4">
              {decisionFactors.map((factor, index) => (
                <motion.div
                  key={factor.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  className="bg-white rounded-lg p-6 shadow-md border border-kawai-pearl hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{factor.icon}</div>
                  <div className={`text-xs font-medium ${factor.color} uppercase tracking-wider mb-2`}>
                    {factor.stat}
                  </div>
                  <h4 className="font-serif text-lg text-kawai-black mb-2">
                    {factor.title}
                  </h4>
                  <p className="text-sm text-kawai-black/70">
                    {factor.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA to Quiz */}
            <div className="bg-gradient-to-br from-kawai-red to-kawai-red/80 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-serif font-light mb-3">
                Not Sure Where to Start?
              </h3>
              <p className="text-white/90 mb-6 text-sm">
                Our intelligent piano finder analyzes your needs and recommends the perfect Kawai instrument
                in just 7 questions.
              </p>
              <button
                onClick={() => {
                  const element = document.getElementById("quiz-tool");
                  if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="bg-white text-kawai-red hover:bg-kawai-pearl font-medium px-6 py-3 rounded-md transition-colors w-full text-center"
              >
                Take the Piano Finder Quiz
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Resources Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-kawai-pearl"
        >
          <h3 className="text-2xl font-serif font-light text-kawai-black mb-8 text-center">
            Explore Specialized Piano Guides
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/guides/digital-piano"
              className="group bg-kawai-pearl hover:bg-kawai-red hover:text-white rounded-lg p-6 transition-colors"
            >
              <h4 className="font-medium text-lg mb-2 group-hover:text-white">Digital Piano Guide</h4>
              <p className="text-sm opacity-80">Features, benefits, and selection tips</p>
            </Link>

            <Link
              href="/guides/acoustic-piano"
              className="group bg-kawai-pearl hover:bg-kawai-red hover:text-white rounded-lg p-6 transition-colors"
            >
              <h4 className="font-medium text-lg mb-2 group-hover:text-white">Acoustic Piano Guide</h4>
              <p className="text-sm opacity-80">Grand vs upright comparison</p>
            </Link>

            <Link
              href="/guides/piano-for-apartments"
              className="group bg-kawai-pearl hover:bg-kawai-red hover:text-white rounded-lg p-6 transition-colors"
            >
              <h4 className="font-medium text-lg mb-2 group-hover:text-white">Apartment Pianos</h4>
              <p className="text-sm opacity-80">Compact, quiet practice solutions</p>
            </Link>

            <Link
              href="/guides/piano-for-students"
              className="group bg-kawai-pearl hover:bg-kawai-red hover:text-white rounded-lg p-6 transition-colors"
            >
              <h4 className="font-medium text-lg mb-2 group-hover:text-white">Student Pianos</h4>
              <p className="text-sm opacity-80">Age-specific recommendations</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
