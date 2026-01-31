'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  links?: { text: string; href: string }[]
}

export function ConcertArtistFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const faqs: FAQItem[] = [
    {
      question: 'Why do wooden keys matter for serious pianists?',
      answer:
        'Wooden keys are fundamental to authentic piano feel because they absorb moisture from your fingertips, creating a tactile connection that plastic keys cannot replicate. This natural moisture absorption prevents slipping during extended practice sessions and provides the subtle grip that professionals rely on for precise control. The Concert Artist series uses solid spruce wooden keys—the same premium material found in acoustic grand pianos—delivering genuine acoustic piano feel even in a digital instrument. For serious and classical pianists, this authentic touch response is essential for developing proper technique, maintaining muscle memory between acoustic and digital practice, and achieving the nuanced expression demanded by advanced repertoire. The wooden key construction also provides the proper weight distribution and return speed that mirrors acoustic piano actions, making transitions between instruments seamless.',
      links: [{ text: 'Find Your Nearest Dealer', href: '/find-a-dealer' }],
    },
    {
      question: 'How does the Concert Artist series replicate acoustic piano feel?',
      answer:
        'The Concert Artist series achieves authentic acoustic piano feel through three integrated technologies working in harmony. First, the Grand Feel action system (Grand Feel Compact III in CA401/CA501, Grand Feel III in CA701/CA901) replicates the complex mechanics of a grand piano action, including escapement, let-off simulation, and counterweights that mirror the exact touch weight progression of an acoustic grand. Second, the solid wooden keys provide the natural surface texture and moisture absorption characteristic of premium acoustic pianos. Third, the SK-EX concert grand sampling captures every tonal nuance of Kawai\'s flagship 9-foot concert grand piano, including string resonance, damper noise, and key-off samples. The CA701 and CA901 models add the revolutionary TwinDrive soundboard speaker system, which uses the wooden soundboard itself as a resonator—exactly like an acoustic piano—creating physical vibrations you can feel through the keys and bench. This multi-dimensional approach to replicating acoustic piano feel makes the Concert Artist series the closest digital piano experience to playing a world-class grand piano.',
      links: [
        { text: 'Compare CA Models', href: '/concert-artist#models' },
        { text: 'Explore Digital Pianos', href: '/pianos/digital' },
      ],
    },
    {
      question: 'Is the Concert Artist series suitable for classical piano practice?',
      answer:
        'Absolutely. The Concert Artist series is specifically engineered for classical pianists and is used by conservatory students, piano teachers, and professional musicians worldwide for serious classical practice. The Grand Feel action delivers the precise escapement, let-off, and key return speed essential for classical technique development—from rapid Chopin passages to the subtle voicing required in Bach counterpoint. The wooden keys provide the tactile feedback necessary for developing proper finger placement and touch sensitivity across the dynamic range from pianissimo to fortissimo. The SK-EX concert grand sampling offers the tonal palette and harmonic complexity that classical repertoire demands, with separate samples for different velocity levels ensuring authentic tonal response. Advanced features like individual note voicing, damper resonance, and string resonance simulation capture the acoustic complexity of classical music. Many piano teachers recommend the Concert Artist series because students can practice at home on an instrument that closely matches the touch and tone of the acoustic grands they encounter in lessons, recitals, and competitions.',
      links: [
        { text: 'View Concert Artist Models', href: '/concert-artist#models' },
        { text: 'See Artist Endorsements', href: '/artists' },
      ],
    },
    {
      question: "What's the difference between CA401, CA501, CA701, and CA901?",
      answer:
        'The four Concert Artist models share core DNA—wooden keys, SK-EX sampling, premium build quality—but differ in action sophistication, sound system, and cabinet design. The CA401 features the Grand Feel Compact III action and a 4-speaker system in a streamlined cabinet, ideal for apartments or studios where space is at a premium. The CA501 upgrades to an enhanced 5-speaker configuration with improved bass response and onboard recording capabilities, perfect for musicians who want to capture and share their performances. The CA701 represents a significant leap with the full Grand Feel III action (found in flagship models) offering longer key length and improved repetition speed, plus a premium 6-speaker array and grand piano-style cabinet with wooden key blocks. The CA901 is the flagship, adding the revolutionary TwinDrive soundboard speaker system that vibrates the wooden soundboard for acoustic-like resonance, Bluetooth audio streaming, and the most refined cabinetry with premium wood finishes. For classical pianists and serious students, the CA701 or CA901 are recommended for their superior action and sound projection. Each model delivers authentic wooden key touch and professional-grade sound quality.',
      links: [
        { text: 'Compare All Models', href: '/concert-artist#models' },
        { text: 'Schedule a Showroom Visit', href: '/find-a-dealer' },
      ],
    },
    {
      question: 'Can I use headphones without losing the acoustic piano feel?',
      answer:
        'Yes—the tactile acoustic piano feel of the Concert Artist series remains completely intact when using headphones because the action mechanics are independent of sound reproduction. The wooden keys, Grand Feel action, and key weight calibration provide the same authentic touch response whether you\'re using the built-in speakers, headphones, or external audio equipment. In fact, the Concert Artist series features spatial headphone sound technology that creates a three-dimensional audio image, simulating the experience of sound emanating from the piano\'s soundboard rather than feeling like sound "inside your head." The headphone output also includes adjustable EQ and volume settings optimized specifically for private listening. This makes the Concert Artist series perfect for apartment living, late-night practice, or any situation where silent practice is needed without compromising on the authentic piano experience. Many professional pianists use headphones during focused technical practice to eliminate room acoustics and concentrate purely on touch and technique development.',
      links: [{ text: 'Explore All Digital Pianos', href: '/pianos/digital' }],
    },
    {
      question: 'How long do wooden keys last in a digital piano?',
      answer:
        'Wooden keys in Concert Artist pianos are built to last decades with minimal maintenance, often outlasting the electronic components. Kawai uses premium-grade spruce wood with moisture-resistant treatment, making the keys highly durable and stable across varying humidity conditions. Unlike plastic keys that can develop shiny wear patterns or become brittle over time, wooden keys develop a natural patina that many pianists prefer, similar to fine acoustic pianos. The keys are precision-milled and individually balanced, mounted on a metal rail that prevents warping. Under normal use, wooden keys will maintain their structural integrity and tactile properties for 20-30+ years. Maintenance is minimal: occasional cleaning with a slightly damp cloth is sufficient, and unlike acoustic piano keys (which can chip or crack), digital piano wooden keys are protected from hammers and other mechanical stress points. All Concert Artist models include Kawai\'s comprehensive warranty coverage, and the brand\'s reputation for long-term reliability means these instruments maintain their playability and value for generations. Compared to plastic keys, wooden keys actually improve with use as the natural oils from your fingers enhance the grip.',
      links: [{ text: 'Learn About Warranty Coverage', href: '/support' }],
    },
    {
      question: 'Which Concert Artist model is right for me?',
      answer:
        'Choosing the right Concert Artist model depends on your skill level, practice goals, and space considerations. For advancing students and hobbyist pianists, the CA401 delivers exceptional value with wooden keys and the essential Grand Feel Compact III action—perfect for developing proper technique in apartments or smaller spaces. Intermediate to advanced players who practice 1-2 hours daily should consider the CA501 for its enhanced sound system and recording features that help track your progress. Serious classical pianists, piano teachers, and conservatory students benefit most from the CA701 or CA901 for the superior Grand Feel III action with longer keys and professional-grade touch response that mirrors acoustic grands. The CA901 is the ultimate choice if you want the TwinDrive soundboard technology and the closest possible approximation to a concert grand piano experience. If space allows and you frequently perform or teach, the CA901\'s grand piano aesthetics and projection capabilities stand out. Each model in the Concert Artist series provides the same authentic wooden key construction and SK-EX concert grand sampling—the differences lie in action refinement and sound reproduction. Still unsure? Visit an authorized Kawai dealer to play each model side-by-side—most pianists know immediately which action and sound profile feels like home.',
      links: [
        { text: 'Find My Perfect Piano', href: '/find-my-piano' },
        { text: 'Locate a Dealer', href: '/find-a-dealer' },
      ],
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
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
              Concert Artist Series{' '}
              <span className="text-kawai-red">Frequently Asked Questions</span>
            </h2>
            <p className="text-lg sm:text-xl text-kawai-black/70 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about wooden keys, acoustic piano feel, and choosing the
              right model.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
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
                        animate={{ height: 'auto', opacity: 1 }}
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
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 5l7 7-7 7"
                                    />
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
            <h3 className="text-2xl font-serif mb-4 text-kawai-black">Still have questions?</h3>
            <p className="text-kawai-black/70 mb-6 text-lg">
              Visit a dealer to experience wooden keys in person
            </p>
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center px-8 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[44px]"
            >
              Find Your Nearest Dealer
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
