"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  links?: { text: string; href: string }[];
}

export function FAQSection() {
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
      question: "What makes Kawai pianos different from other piano brands?",
      answer: "Kawai pianos distinguish themselves through the revolutionary Millennium III Carbon Fiber Action, which provides unmatched speed and consistency compared to traditional wooden actions. Our 95+ years of Japanese craftsmanship combined with fearless innovation creates instruments that balance traditional piano-making artistry with cutting-edge technology. Each Kawai piano features precision-tapered soundboards, premium materials, and meticulous hand-voicing, delivering a warm, singing tone that professional musicians and institutions worldwide trust for both practice and performance.",
      links: [{ text: "Explore Our Piano Collection", href: "/pianos" }]
    },
    {
      question: "What are the benefits of carbon fiber action in Kawai pianos?",
      answer: "The Millennium III Carbon Fiber Action in Kawai grand pianos offers transformative advantages over traditional wooden actions. The ABS-Carbon composite is five times stronger than wood, providing lightning-fast repetition speed essential for advanced technique. It's completely impervious to humidity and temperature changes, ensuring consistent touch and response in any climate. The action delivers uniform weight and resistance across all 88 keys, giving pianists perfect control from the softest pianissimo to the most powerful fortissimo. This advanced piano key action technology maintains its precision for decades, requiring less regulation and offering superior long-term value.",
      links: [{ text: "Learn About Millennium III Technology", href: "/technology" }]
    },
    {
      question: "Are Kawai pianos good for classical music?",
      answer: "Absolutely. Kawai pianos are exceptionally well-suited for classical music and are the choice of conservatories, universities, and concert halls worldwide. The warm, singing tone characteristic of Kawai pianos provides the expressive capabilities demanded by classical repertoire, from Bach to contemporary composers. The exceptional dynamic range allows for subtle phrasing and powerful fortissimos, while the responsive touch enables the nuanced articulation essential to classical technique. The Shigeru Kawai line, our hand-crafted concert grand series, is specifically designed to meet the exacting standards of professional classical pianists and regularly graces international competition stages.",
      links: [{ text: "Discover Shigeru Kawai Pianos", href: "/pianos/shigeru-kawai" }]
    },
    {
      question: "What warranty coverage comes with a Kawai piano?",
      answer: "Kawai pianos come with industry-leading warranty coverage that reflects our confidence in build quality and longevity. New Kawai acoustic pianos include a comprehensive 10-year limited warranty covering parts and labor, one of the best warranties in the piano industry. Digital pianos include a 3-year warranty on parts and 1-year on labor. The warranty covers manufacturer defects and ensures your investment is protected. Additionally, our nationwide network of authorized Kawai dealers and certified technicians ensures professional service and support throughout your piano's lifetime. Specific warranty details vary by model and purchase, so consult with your authorized Kawai dealer for complete information.",
      links: [{ text: "Find Your Local Dealer", href: "/#dealer-locations" }]
    },
    {
      question: "What are the maintenance requirements for a Kawai piano?",
      answer: "Kawai pianos are designed for minimal maintenance while delivering maximum performance. Acoustic pianos should be tuned at least twice annually, though new pianos may require more frequent tuning during their first year as strings settle. Maintain consistent room temperature (ideally 68-72°F) and humidity levels (40-50%) to preserve your piano's integrity—a humidification system is recommended in dry climates. Keep your piano away from direct sunlight, heating vents, and exterior walls. Regular cleaning with a soft, dry cloth maintains the finish, and periodic regulation by a certified Kawai technician every 5-10 years ensures optimal touch and tone. Digital pianos require even less maintenance—simply dust regularly and avoid placing liquids near the instrument.",
      links: [{ text: "Piano Care Resources", href: "/guides" }]
    },
    {
      question: "Do Kawai pianos hold their value over time?",
      answer: "Yes, Kawai pianos are known for excellent value retention compared to many piano brands. Several factors contribute to strong resale value: Kawai's reputation for quality and reliability, the durability of materials like the carbon fiber action and premium soundboards, and the brand's position as one of the world's premier piano manufacturers. Well-maintained Kawai pianos often retain 50-70% of their original value after 10-15 years, with some models appreciating depending on market conditions. The hand-crafted Shigeru Kawai line holds value particularly well due to limited production and high demand among serious pianists. Proper maintenance, climate control, and regular servicing by authorized technicians maximize your piano's resale value.",
      links: [{ text: "View Current Inventory", href: "/pianos" }]
    },
    {
      question: "How does Kawai compare to European piano brands?",
      answer: "Kawai pianos offer a compelling alternative to European piano brands, combining Japanese precision engineering with traditional craftsmanship. While European pianos often feature a brighter, more direct tone, Kawai is renowned for a warmer, more singing tonal character that many musicians find more versatile across musical genres. Kawai's Millennium III action provides technological advantages in consistency and durability that traditional wooden actions cannot match. In terms of value, Kawai typically offers superior quality-to-price ratio compared to European brands of similar caliber. The Shigeru Kawai line directly competes with premium European concert grands in sound, touch, and artistry, while offering Japanese innovation and reliability. Ultimately, the choice comes down to personal preference in tone and touch.",
      links: [{ text: "Experience the Difference", href: "/showroom" }]
    },
    {
      question: "What is the Millennium III action and why is it important?",
      answer: "The Millennium III action is Kawai's revolutionary piano action system that replaces traditional wooden components with advanced ABS-Carbon composite materials. This represents the most significant advancement in piano action technology in over a century. The action is the heart of any piano—it's the complex system of levers, hammers, and springs that translates your finger pressure into musical sound. Traditional wooden actions are susceptible to humidity changes, warping, and wear over time. Kawai's carbon fiber composite is dimensionally stable, incredibly strong, and precisely engineered for optimal performance. This means faster repetition, more consistent touch across the keyboard, better control in extreme dynamics, and an action that maintains its regulation for decades. For serious pianists, the Millennium III action delivers the reliability and responsiveness that advanced technique demands.",
      links: [{ text: "Learn More About Kawai Innovation", href: "/technology" }]
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
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 lg:mb-16"
          >
            <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
              Your Questions Answered
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-kawai-black mb-6 leading-tight">
              Frequently Asked Questions About{" "}
              <span className="text-kawai-red">Kawai Pianos</span>
            </h2>
            <p className="text-lg sm:text-xl text-kawai-black/70 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about Kawai piano quality, technology, and value.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
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
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12 lg:mt-16"
          >
            <p className="text-kawai-black/70 mb-6 text-lg">
              Still have questions? We're here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[44px]"
            >
              Contact Our Piano Experts
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
