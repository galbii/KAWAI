"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  links?: { text: string; href: string }[];
}

export function FinderFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const faqs: FAQItem[] = [
    {
      question: "Which piano should I buy?",
      answer: "The right piano depends on your skill level, space, and budget. Beginners often thrive with a quality digital piano featuring 88 weighted keys, like the Kawai ES120 or CA401. Acoustic pianos offer authentic touch and tone but require more space and maintenance. Use our Piano Finder tool to get personalized recommendations based on your specific needs, whether you're a beginner, intermediate player, or professional musician.",
      links: [
        { text: "Take the Piano Finder Quiz", href: "/find-my-piano#quiz" },
        { text: "Browse Digital Pianos", href: "/pianos/digital" }
      ]
    },
    {
      question: "What piano is best for beginners?",
      answer: "The best piano for beginners has 88 fully-weighted keys to develop proper technique from day one. Digital pianos like the Kawai ES120 or KDP120 offer authentic touch, built-in metronome, and headphone jacks for quiet practice—perfect for apartments. Acoustic uprights provide traditional piano feel but cost more. Budget $500-1500 for a quality beginner digital piano that won't limit your progress as skills develop.",
      links: [
        { text: "View Beginner Piano Guide", href: "/guides/first-piano" },
        { text: "Compare Beginner Models", href: "/pianos/digital" }
      ]
    },
    {
      question: "How do I choose a piano?",
      answer: "Start by defining your priorities: touch quality, sound realism, budget, and space. Always choose 88 weighted keys for proper technique development. Consider digital vs acoustic based on your living situation—digital pianos excel in apartments with volume control and headphone outputs. Test multiple models in person to experience different key actions. Kawai's wooden key actions (Grand Feel, Responsive Hammer) provide the most realistic acoustic piano feel in digital instruments.",
      links: [
        { text: "Read Complete Piano Selection Guide", href: "/guides/digital-piano" },
        { text: "Find a Showroom Near You", href: "/#dealer-locations" }
      ]
    },
    {
      question: "What's the difference between digital and acoustic piano?",
      answer: "Digital pianos use sampled sounds and weighted key mechanisms to replicate acoustic piano feel, offering volume control, headphone capability, and zero tuning costs. Acoustic pianos produce sound through physical hammers striking strings, delivering nuanced resonance and authentic touch that digital instruments approximate. For apartments or budget-conscious buyers, quality digital pianos like Kawai's CA series with wooden key actions provide 90% of the acoustic experience at a fraction of the cost and maintenance.",
      links: [
        { text: "Digital vs Acoustic Comparison", href: "/guides/digital-piano" },
        { text: "Explore Hybrid Pianos", href: "/pianos/hybrid" }
      ]
    },
    {
      question: "Do I need 88 keys?",
      answer: "Yes, for serious piano learning. 88 keys is the standard piano keyboard range required for classical repertoire and advanced music. While 61-key keyboards work for casual play, they limit your repertoire and don't develop full-range technique. Teachers strongly recommend 88 keys from the start to avoid re-learning hand positions when upgrading. All Kawai digital pianos feature full 88-key weighted keyboards designed for proper piano technique development.",
      links: [
        { text: "View 88-Key Digital Pianos", href: "/pianos/digital" }
      ]
    },
    {
      question: "What age to start piano lessons?",
      answer: "Most children can start piano lessons at age 5-7 when fine motor skills and attention span develop sufficiently. Some students begin as early as 4 with specialized teaching methods. Adults can start at any age—many successful pianists began in their 30s, 40s, or beyond. The key is consistent practice and a quality instrument with proper weighted keys. Kawai offers models suitable for small hands (like the KDP120) and adult beginners (ES120, CA401) alike.",
      links: [
        { text: "Piano for Students Guide", href: "/guides/first-piano" },
        { text: "Find Beginner Models", href: "/pianos/digital" }
      ]
    },
    {
      question: "Should I get digital or acoustic piano for apartment?",
      answer: "Digital pianos are ideal for apartments. They offer headphone jacks for silent practice, volume control for neighbor-friendly playing, and no tuning requirements. Quality digital pianos like the Kawai CA901 or CN301 with wooden key actions deliver authentic acoustic feel without disturbing neighbors. They also maintain performance in varying humidity and temperature, common challenges in apartment living. Acoustic pianos require climate control and can create noise issues in multi-unit buildings.",
      links: [
        { text: "Best Pianos for Apartments", href: "/pianos/digital" },
        { text: "Explore Compact Models", href: "/pianos/digital" }
      ]
    },
    {
      question: "What makes piano tone warm vs bright?",
      answer: "Piano tone character comes from soundboard design, hammer hardness, and string materials. Warm tone features rich lower harmonics, singing sustain, and mellow treble—characteristic of Kawai pianos and preferred for classical music. Bright tone emphasizes upper harmonics with crisp attack and brilliant treble, common in some mass-market brands. Kawai's tapered soundboards and precision voicing create the warm, European-style tone that conservatories and professional pianists favor for expressive playing.",
      links: [
        { text: "Discover Kawai Sound Quality", href: "/technology" },
        { text: "Experience Shigeru Kawai", href: "/pianos/shigeru-kawai" }
      ]
    },
    {
      question: "Why are wooden key actions better?",
      answer: "Wooden key actions replicate the precise weight, balance, and momentum of acoustic grand piano keys—crucial for developing advanced technique and expressive control. Plastic actions feel lighter and less responsive, limiting dynamic range and touch sensitivity. Kawai's Grand Feel and Responsive Hammer Compact wooden key actions use real wood keys with extended length, providing authentic leverage and inertia that plastic cannot match. This translates to better control from pianissimo to fortissimo and seamless transition to acoustic grands.",
      links: [
        { text: "Learn About Grand Feel Action", href: "/technology" },
        { text: "Compare Key Action Types", href: "/pianos/digital" }
      ]
    },
    {
      question: "How much should I spend on a first piano?",
      answer: "Budget $800-1500 for a quality first digital piano with 88 weighted keys that supports long-term development. Under $800, you risk compromising key action quality and sound realism. The Kawai ES120 ($1,299) and KDP120 ($1,599) offer professional-grade touch and tone at entry prices. Acoustic uprights start at $3,000-5,000 for new instruments. Investing in quality from day one prevents costly upgrades and maintains motivation—a poor-quality instrument frustrates beginners and limits progress.",
      links: [
        { text: "View Entry-Level Models", href: "/pianos/digital" },
        { text: "First Piano Buying Guide", href: "/guides/first-piano" }
      ]
    },
    {
      question: "What's the best piano for small apartment?",
      answer: "Compact digital pianos like the Kawai ES120 (portable, 52 inches wide) or KDP120 (furniture-style with small footprint) are perfect for apartments. They deliver authentic 88-key weighted touch in space-saving designs with essential features: headphone jacks for silent practice, volume control, and no tuning requirements. The CA401 offers upgraded wooden key action in a compact cabinet. All maintain full piano functionality without the 5-foot depth of acoustic uprights or climate control demands.",
      links: [
        { text: "Explore Compact Digital Pianos", href: "/pianos/digital" },
        { text: "Apartment Piano Guide", href: "/guides/digital-piano" }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* FAQ Schema - Added to page head via script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <section ref={sectionRef} className="relative bg-kawai-pearl py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 lg:mb-16"
          >
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
              Your Questions Answered
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
              Piano Selection{" "}
              <span className="text-kawai-red">FAQs</span>
            </h2>
            <p className="text-lg sm:text-xl text-kawai-black/70 max-w-2xl mx-auto leading-relaxed">
              Expert answers to help you choose the perfect piano for your needs and goals.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.05) }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-kawai-pearl/50 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between text-left hover:bg-kawai-pearl/20 transition-colors duration-200 min-h-[44px]"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg sm:text-xl font-medium text-kawai-black pr-8 leading-tight">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6 text-kawai-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2">
                        <p className="text-kawai-black/80 leading-relaxed text-base sm:text-lg mb-4">
                          {faq.answer}
                        </p>
                        {faq.links && faq.links.length > 0 && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-kawai-pearl">
                            {faq.links.map((link, linkIndex) => (
                              <Link
                                key={linkIndex}
                                href={link.href}
                                className="inline-flex items-center text-kawai-red font-medium hover:text-kawai-red/80 transition-colors text-sm group"
                              >
                                {link.text}
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
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              Not sure which piano is right for you?
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
    </>
  );
}
