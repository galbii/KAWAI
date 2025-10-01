"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DecisionFactor {
  id: string;
  icon: string;
  title: string;
  shortDescription: string;
  fullContent: {
    overview: string;
    considerations: string[];
    recommendations: string;
    cta?: {
      text: string;
      href: string;
    };
  };
}

export function DecisionFactorsSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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

  const decisionFactors: DecisionFactor[] = [
    {
      id: "experience-level",
      icon: "🎓",
      title: "By Experience Level",
      shortDescription: "Finding the right piano for your skill level ensures you have an instrument that grows with your musical journey, from first lessons to professional performance.",
      fullContent: {
        overview: "Your experience level fundamentally shapes what you need from a piano. Beginners benefit from instruments that encourage proper technique development, while advanced players require sophisticated touch and tonal capabilities that match their artistic expression.",
        considerations: [
          "Beginners (0-2 years): Focus on proper weighted key action, consistent touch across all 88 keys, and built-in learning features like metronomes and recording",
          "Intermediate (2-5 years): Prioritize responsive touch sensitivity, improved sound quality, and features that support advancing repertoire complexity",
          "Advanced (5-10 years): Require professional-grade action with fast repetition, nuanced tonal control, and dynamic range for expressive playing",
          "Professional/Teachers: Demand concert-quality instruments with exceptional durability, precise regulation, and tonal characteristics suitable for performance and instruction"
        ],
        recommendations: "Kawai's ES series digital pianos provide excellent entry points for beginners with authentic weighted action, while the CA series offers intermediate players the Responsive Hammer III action for developing advanced technique. Serious students and professionals should explore the Novus hybrid series or Shigeru Kawai acoustic grands, which deliver the touch sensitivity and tonal depth required for conservatory-level work. The key is matching your current skill level while allowing room to grow—a quality instrument won't limit your progress.",
        cta: {
          text: "Explore Pianos for Your Level",
          href: "/pianos"
        }
      }
    },
    {
      id: "budget-range",
      icon: "💰",
      title: "By Budget Range",
      shortDescription: "Understanding piano pricing tiers helps you maximize value while investing in quality that will serve you for decades, not just years.",
      fullContent: {
        overview: "Piano pricing reflects the complexity of engineering, materials, and craftsmanship involved. While budget constraints are real, investing in a quality instrument from a reputable manufacturer like Kawai delivers better long-term value than purchasing a cheap piano that may frustrate progress or require replacement.",
        considerations: [
          "Under $5,000: Entry-level digital pianos with weighted keys, basic sound engines, and essential features—ideal for beginners testing commitment",
          "$5,000-$15,000: Mid-range digitals and entry acoustic uprights offering wooden key actions, advanced sound sampling, and superior build quality",
          "$15,000-$30,000: Premium digital hybrids and quality acoustic uprights/baby grands with professional-grade components and exceptional longevity",
          "$30,000+: Hand-crafted acoustic grands, concert instruments, and flagship digitals representing the pinnacle of piano engineering and artistry"
        ],
        recommendations: "Kawai's approach to value means you get professional-quality features at every price point. The ES120 ($999-$1,499) delivers authentic weighted action found in instruments costing twice as much. The CA series ($3,000-$6,000) incorporates wooden key technology typically reserved for pianos over $10,000. For those investing in acoustic instruments, Kawai uprights ($7,000-$15,000) compete with European brands costing 30-50% more, thanks to efficient Japanese manufacturing without sacrificing craftsmanship. Remember: a well-maintained Kawai piano retains 50-70% of its value after 10-15 years, making it an investment, not an expense.",
        cta: {
          text: "View Pianos by Price Range",
          href: "/pianos/search?sort=price"
        }
      }
    },
    {
      id: "space-living",
      icon: "🏠",
      title: "By Space & Living Situation",
      shortDescription: "Your home environment—whether apartment, house, studio, or performance venue—determines the practical constraints and optimal piano type for your situation.",
      fullContent: {
        overview: "Space and living situation have become the deciding factor for most modern piano buyers, particularly urban dwellers. The good news: today's digital and hybrid pianos deliver authentic playing experiences in compact, neighbor-friendly packages that would have been impossible a generation ago.",
        considerations: [
          "Apartments & Condos: Require volume control (headphone capability), compact footprint, and minimal floor vibration—digital pianos excel here",
          "Home Dedicated Room: Allows for upright or small grand acoustics, but consider adjacent rooms and noise transmission",
          "Teaching Studios: Need durability for heavy daily use, dual-piano capability for lessons, and professional sound quality for student development",
          "Performance Venues: Demand full-sized grand acoustics or flagship digital pianos with concert-quality amplification systems"
        ],
        recommendations: "For apartment living, Kawai's CA99 and CA901 digital grands provide authentic grand piano touch and tone with master volume control and headphone jacks—practice at midnight without disturbing neighbors. The compact ES120 fits in studio apartments while delivering full 88-key weighted action. Those with dedicated space should consider the Kawai K-200 upright (45\" height), which offers true acoustic sound in a footprint smaller than most sofas. The revolutionary Novus NV10 hybrid combines a full grand piano action with digital sound generation, giving apartment dwellers authentic grand piano touch impossible with traditional digitals. Silent system options on acoustic Kawai pianos allow the best of both worlds: acoustic performance when desired, silent practice via headphones when needed.",
        cta: {
          text: "Find Space-Efficient Pianos",
          href: "/guides/piano-for-apartments"
        }
      }
    },
    {
      id: "sound-preferences",
      icon: "🎵",
      title: "By Sound Preferences",
      shortDescription: "Understanding the difference between warm and bright piano tones—and knowing which suits your musical goals—is essential to long-term satisfaction with your instrument.",
      fullContent: {
        overview: "Piano tone character fundamentally shapes your musical experience and expression. The warm vs. bright distinction represents two philosophies in piano design, each with devoted followers. Warm pianos produce a singing, rich tone with complex overtones and longer sustain, ideal for classical, romantic, and expressive playing. Bright pianos deliver a more direct, crisp sound with immediate attack, often preferred for jazz, pop, and contemporary styles.",
        considerations: [
          "Warm Tone Characteristics: Rich harmonic content, singing treble, lush bass response, longer sustain, complex tonal palette—exemplified by Kawai and Vienna-school European makers",
          "Bright Tone Characteristics: Clear attack, brilliant treble, defined bass, shorter sustain, cut-through projection—typified by some Yamaha and American brands",
          "Musical Genre Alignment: Classical repertoire (Chopin, Debussy, Rachmaninoff) particularly suits warm-toned pianos; jazz and contemporary benefit from brighter instruments",
          "Personal Preference: Ultimately subjective—serious pianists should experience both in person before deciding"
        ],
        recommendations: "Kawai has built its reputation on a distinctly warm, European-inspired tonal character, achieved through tapered soundboards, premium solid spruce, and meticulous hand-voicing. This warmth makes Kawai pianos the choice of conservatories, classical musicians, and institutions worldwide—they excel at the expressive, nuanced playing demanded by classical repertoire. The Shigeru Kawai line represents the pinnacle of this warm tonal philosophy, while still maintaining the clarity needed for rapid passages. For those wanting bright-to-neutral tone, Kawai's K series uprights offer slightly more direct sound while retaining the brand's characteristic singing quality. Digital models like the CA99 allow tonal customization through voicing controls, letting you adjust brightness to taste. If you're drawn to the lyrical sound of great European pianos but want Japanese reliability and value, Kawai delivers both.",
        cta: {
          text: "Learn About Kawai Sound Quality",
          href: "/guides/piano-sound-characteristics"
        }
      }
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="relative bg-white py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Key Considerations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
            Find Your Piano by{" "}
            <span className="text-kawai-red">What Matters Most</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            Every pianist has unique needs. Explore the key decision factors that will guide you to the perfect Kawai piano for your musical journey.
          </p>
        </motion.div>

        {/* Decision Factor Cards - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {decisionFactors.map((factor, index) => (
            <motion.article
              key={factor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
              className="bg-kawai-pearl rounded-xl shadow-sm border border-kawai-pearl/50 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Header - Always Visible */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl sm:text-5xl" role="img" aria-label={factor.title}>
                    {factor.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-light font-serif text-kawai-black mb-3 leading-tight">
                      {factor.title}
                    </h3>
                  </div>
                </div>

                {/* Core Content - Always Visible for SEO */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-kawai-black/80 leading-relaxed text-base sm:text-lg mb-6">
                    {factor.shortDescription}
                  </p>

                  {/* First 100-150 words visible */}
                  <p className="text-kawai-black/70 leading-relaxed text-base mb-4">
                    {factor.fullContent.overview}
                  </p>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleCard(factor.id)}
                  className="inline-flex items-center gap-2 text-kawai-red font-medium hover:text-kawai-red/80 transition-colors text-sm sm:text-base mt-4 group min-h-[44px]"
                  aria-expanded={expandedCard === factor.id}
                  aria-controls={`factor-details-${factor.id}`}
                >
                  <span>{expandedCard === factor.id ? "Show Less" : "Read More"}</span>
                  <motion.div
                    animate={{ rotate: expandedCard === factor.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
              </div>

              {/* Expandable Detailed Content */}
              <AnimatePresence>
                {expandedCard === factor.id && (
                  <motion.div
                    id={`factor-details-${factor.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden border-t border-kawai-pearl"
                  >
                    <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-6">
                      {/* Key Considerations */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-kawai-black mb-4">
                          Key Considerations:
                        </h4>
                        <ul className="space-y-3">
                          {factor.fullContent.considerations.map((consideration, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-kawai-red mt-1 flex-shrink-0">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-kawai-black/80 text-sm sm:text-base leading-relaxed">
                                {consideration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-kawai-black mb-3">
                          Our Recommendations:
                        </h4>
                        <p className="text-kawai-black/70 leading-relaxed text-sm sm:text-base">
                          {factor.fullContent.recommendations}
                        </p>
                      </div>

                      {/* CTA Link */}
                      {factor.fullContent.cta && (
                        <div className="pt-4 border-t border-kawai-pearl">
                          <Link
                            href={factor.fullContent.cta.href}
                            className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red/80 transition-colors text-sm sm:text-base group"
                          >
                            {factor.fullContent.cta.text}
                            <svg
                              className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
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
            Need personalized guidance? Take our interactive quiz to find your perfect piano.
          </p>
          <Link
            href="/find-my-piano#quiz"
            className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[44px]"
          >
            Take the Piano Finder Quiz
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
