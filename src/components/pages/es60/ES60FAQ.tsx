'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * ES60 FAQ Component - SEO Optimized
 *
 * Strategically designed to:
 * - Target "best beginner digital piano" and "affordable" positioning
 * - Address psychological objections at each funnel stage
 * - Support featured snippet optimization
 * - Never mention competitors by name
 * - Include long-form answers with natural keyword usage
 */

interface FAQItem {
  question: string;
  answer: string;
  category?: 'beginner' | 'technical' | 'value' | 'practical' | 'lifestyle';
}

const faqData: FAQItem[] = [
  {
    question: "Is the Kawai ES60 good for beginners?",
    answer: "Absolutely. The ES60 is specifically designed as the best affordable digital piano for beginners. It features authentic 88 weighted keys with Responsive Hammer Lite action that teaches proper finger technique from day one - essential for developing good habits. The Shigeru Kawai SK-EX concert grand sampling provides professional sound quality that inspires practice and accelerates learning. With intuitive controls, dual headphone outputs for silent practice, and ultra-portable 24 lb design, it's perfect for students, adult learners, and anyone starting their piano journey. Professional music educators consistently recommend the ES60 for serious beginners who want authentic piano feel without the premium price.",
    category: 'beginner'
  },
  {
    question: "Why is the ES60 so affordable compared to pianos with similar sound quality?",
    answer: "The ES60's affordability comes from smart engineering, not compromised quality. Kawai focused on essential features that matter most for learning and playing, rather than adding excessive voice options or complex features. The Shigeru Kawai SK-EX concert grand sampling - the same professional sound engine found in Kawai's premium models costing thousands more - is now accessible at $499 through efficient manufacturing and strategic feature selection. You're getting authentic concert grand sound, 88 weighted keys, and 192-note polyphony without paying for features most beginners won't use. This makes it the best value in digital pianos under $500, offering professional sound quality that reviewers consistently rate as superior to similarly-priced alternatives.",
    category: 'value'
  },
  {
    question: "Does the ES60 feel like a real piano?",
    answer: "Yes. The ES60's Responsive Hammer Lite (RHL) action provides authentic weighted key feel with 57-gram down-weight on middle C, closely approximating acoustic piano touch. The graded weighting means lower keys feel heavier and upper keys feel lighter - just like a real piano. This authentic feel is crucial for developing proper technique and building the muscle memory needed for serious piano playing. The remarkably quiet operation through upgraded cushioning materials allows you to focus on expression without mechanical noise. While it's a digital piano, the ES60's key action is specifically engineered to provide the authentic weighted resistance that prepares you to play acoustic pianos confidently.",
    category: 'technical'
  },
  {
    question: "Can I practice piano silently with the ES60?",
    answer: "Absolutely - this is one of the ES60's standout features for beginners and students. The dual headphone outputs let you practice completely silently at any time without disturbing family, roommates, or neighbors. Many users report the headphone experience as particularly exceptional, with professional reviewers calling the ES60's through-headphone sound quality \"the most realistic acoustic grand piano reproduction I have ever heard from a $500 digital piano.\" The dual outputs even allow two people to practice together or enable a teacher and student to hear simultaneously during lessons. This silent practice capability makes the ES60 perfect for late-night practice sessions, apartment living, dorms, and any situation where noise control matters.",
    category: 'lifestyle'
  },
  {
    question: "Is the ES60 good for apartment living?",
    answer: "Perfect for apartments and shared spaces. The ES60 was designed with space-constrained living in mind. The dual headphone outputs provide completely silent practice capability - no noise complaints from neighbors. At just 24 pounds (11kg), it's easy to move between rooms or store when needed. The compact footprint fits comfortably in apartments, studios, or dorm rooms. The exceptionally quiet key action through upgraded cushioning means even unplugged practice won't disturb others. When you do use the built-in speakers, the upward-facing dual 10W speaker system provides clear, focused sound without overwhelming small spaces. The ES60 is genuinely apartment-friendly without compromising on the professional features serious learners need.",
    category: 'lifestyle'
  },
  {
    question: "What is Shigeru Kawai SK-EX sampling and why does it matter?",
    answer: "Shigeru Kawai SK-EX sampling is what sets the ES60 apart from other digital pianos under $500. The SK-EX is Kawai's flagship concert grand piano - a world-class instrument trusted by concert halls and professional pianists globally. Every note in the ES60 is sampled from this legendary piano, capturing the rich harmonics, natural resonance, and expressive capability of a concert grand. This is the same sound engine found in Kawai's premium digital pianos costing thousands more. The result is authentic piano tone that responds naturally to your playing dynamics, with Harmonic Imaging technology delivering smooth transitions from soft to loud. This professional sound quality inspires practice and helps develop musical expression - crucial for serious learning.",
    category: 'technical'
  },
  {
    question: "Will I outgrow the ES60 as I improve?",
    answer: "Not for many years of serious study. The ES60 provides professional-grade features that support players from complete beginner through advanced intermediate levels. The authentic Shigeru Kawai SK-EX concert grand sampling, 88 weighted keys with graded action, and 192-note polyphony are the same core features found in instruments used by advanced players and professionals. The authentic weighted key action ensures you're building proper technique that translates to any piano. Many serious pianists keep an ES60 as a portable practice instrument or secondary piano even after acquiring premium models. While concert pianists eventually need the advanced features of flagship models, the ES60 will support years of dedicated practice and musical growth - making it an excellent long-term investment at $499.",
    category: 'beginner'
  },
  {
    question: "How portable is the ES60 for students?",
    answer: "Exceptionally portable - this is a major advantage for student life. At just 24 pounds (11kg), the ES60 is light enough to carry between dorm rooms, transport to lessons, move between apartments, or take to performances. Despite this ultra-portable weight, it maintains a full 88-key weighted action - no compromise on authentic piano feel. The compact design fits easily in vehicles and through doorways. Many students moving between home and college keep the ES60 with them for continuous practice access. The included sustain pedal and simple setup mean you can be playing within minutes of arriving anywhere. This portability combined with professional sound quality makes the ES60 ideal for the mobile lifestyle of modern students.",
    category: 'lifestyle'
  },
  {
    question: "What makes the ES60 the best digital piano under $500?",
    answer: "The ES60's competitive advantage is delivering premium features at an entry-level price. You're getting authentic Shigeru Kawai SK-EX concert grand sampling - professional sound quality that reviewers consistently rate as the best available under $500. The 88-key Responsive Hammer Lite action provides authentic weighted feel that teaches proper technique. The 192-note polyphony ensures no dropped notes during complex passages. The dual headphone outputs with exceptional through-headphone sound quality make it perfect for silent practice. At 24 pounds, it's genuinely portable for students. The combination of professional concert grand sound, authentic piano feel, practical features for modern learners, and unbeatable $499 price point makes it the clear choice for beginners and students who want serious results without the premium investment.",
    category: 'value'
  },
  {
    question: "Does the ES60 work with piano learning apps?",
    answer: "Yes - the ES60 integrates seamlessly with modern learning technology. The USB connectivity enables MIDI connection to popular learning apps like Simply Piano, Flowkey, and Playground Sessions on smartphones, tablets, and computers. The included PianoRemote app provides comprehensive control and adds features like visual rhythm patterns and MIDI recording capability, effectively transforming your device into a sophisticated control interface. You can also connect the ES60 to digital audio workstations (DAWs) for recording and composition. The professional dual 1/4\" stereo line outputs allow connection to external speakers or recording equipment. This smart connectivity makes the ES60 compatible with virtually any modern learning method or creative application while maintaining the authentic acoustic piano experience.",
    category: 'technical'
  },
  {
    question: "Can adult learners use the ES60?",
    answer: "Absolutely - the ES60 is ideal for adult learners starting their piano journey. Adult learners particularly benefit from the authentic weighted key action that teaches proper technique from the start, the professional Shigeru Kawai SK-EX concert grand sound quality that makes practice enjoyable and inspiring, and the silent practice capability that fits busy adult schedules and shared living spaces. The intuitive controls are easy to understand without overwhelming complexity. The $499 price point makes starting piano lessons accessible without a major financial commitment. The portable 24 lb design fits modern lifestyles and space-constrained homes. Many adult learners report the ES60's authentic piano feel and professional sound quality keeps them motivated to practice consistently - crucial for adult learning success.",
    category: 'beginner'
  },
  {
    question: "What's included with the ES60?",
    answer: "The ES60 comes ready to play out of the box. Included with your purchase: the ES60 88-key digital piano, sustain pedal (essential for authentic piano playing), power adapter, and music rest. The piano features built-in dual 10W speakers, so you can start playing immediately without external amplification. The dual headphone outputs are built-in for silent practice. You'll also get access to the PianoRemote app for enhanced control and features. For a complete setup, most players add: a furniture-style stand or X-stand, a piano bench at proper height, and quality headphones for silent practice. The included sustain pedal and built-in speakers mean you can begin learning piano the moment you unbox the ES60 - just add a stand and bench based on your space and budget.",
    category: 'practical'
  }
];

interface FAQAccordionItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQAccordionItem({ faq, isOpen, onToggle, index }: FAQAccordionItemProps) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: '#F5F2ED',
        border: isOpen ? '2px solid #E11922' : '2px solid transparent'
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:bg-white/50"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        style={{ color: '#3C3530' }}
      >
        <span className="flex-1 font-semibold text-lg pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className="w-6 h-6"
            style={{ color: isOpen ? '#E11922' : '#8B7355' }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-5 pt-2 leading-relaxed"
              style={{ color: '#6B645C' }}
            >
              <p className="text-base">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ES60FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate JSON-LD schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section
        className="py-20 lg:py-24"
        style={{ backgroundColor: '#FAF8F5' }}
        aria-labelledby="faq-heading"
      >
        <div className="container-brand max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle
                className="w-8 h-8"
                style={{ color: '#E11922' }}
              />
              <h2
                id="faq-heading"
                className="text-4xl lg:text-5xl font-bold"
                style={{ color: '#3C3530' }}
              >
                Frequently Asked Questions
              </h2>
            </div>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: '#6B645C' }}
            >
              Common questions from beginners, students, and adult learners considering the best affordable digital piano under $500
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4" role="list">
            {faqData.map((faq, index) => (
              <FAQAccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-16 text-center">
            <div
              className="rounded-2xl p-8 inline-block"
              style={{
                backgroundColor: '#8B7355',
                boxShadow: '0 10px 30px rgba(139, 115, 85, 0.2)'
              }}
            >
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: '#FAF8F5' }}
              >
                Still Have Questions?
              </h3>
              <p
                className="text-base mb-6 max-w-md"
                style={{ color: '#F5F2ED' }}
              >
                Our piano experts are here to help you find the perfect instrument.
                Get personalized advice and schedule a demo.
              </p>
              <motion.button
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#3C3530',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/contact?product=es60&source=faq';
                  }
                }}
              >
                Contact Our Experts
              </motion.button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: '#E11922' }}
              >
                4.8★
              </div>
              <div
                className="text-sm"
                style={{ color: '#6B645C' }}
              >
                Customer Rating
              </div>
            </div>
            <div
              className="w-px h-12"
              style={{ backgroundColor: '#E8E3DB' }}
            />
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: '#E11922' }}
              >
                $499
              </div>
              <div
                className="text-sm"
                style={{ color: '#6B645C' }}
              >
                Best Value
              </div>
            </div>
            <div
              className="w-px h-12"
              style={{ backgroundColor: '#E8E3DB' }}
            />
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: '#E11922' }}
              >
                95+
              </div>
              <div
                className="text-sm"
                style={{ color: '#6B645C' }}
              >
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
