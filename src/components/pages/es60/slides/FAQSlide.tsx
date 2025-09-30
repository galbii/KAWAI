"use client";

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * FAQ Slide - Cinematic Integration
 *
 * Strategically optimized FAQ within the scroll experience.
 * Maintains visual consistency with other slides while providing
 * SEO-rich, conversion-focused answers to key objections.
 */

interface FAQItem {
  question: string;
  answer: string;
}

// Strategic FAQ selection - most critical 8 questions for the cinematic flow
const cinematicFAQData: FAQItem[] = [
  {
    question: "Is the Kawai ES60 good for beginners?",
    answer: "Absolutely. The ES60 is specifically designed as the best affordable digital piano for beginners. Features authentic 88 weighted keys with Responsive Hammer Lite action, professional Shigeru Kawai SK-EX concert grand sound, and intuitive controls. Perfect for students, adult learners, and anyone starting their musical journey at only $499."
  },
  {
    question: "Why is the ES60 so affordable?",
    answer: "Smart engineering, not compromised quality. Kawai focused on essential features that matter most - authentic SK-EX concert grand sampling (same sound as $2000+ models), 88 weighted keys, and 192-note polyphony. You get professional sound without paying for unnecessary extras. Only $499 for the best value under $500."
  },
  {
    question: "Does it feel like a real piano?",
    answer: "Yes. The Responsive Hammer Lite action provides authentic weighted feel with graded weighting - heavier in bass, lighter in treble, just like acoustic pianos. Builds proper technique and prepares you for any piano. Exceptionally quiet operation lets you focus on expression."
  },
  {
    question: "Can I practice silently?",
    answer: "Absolutely. Dual headphone outputs let you practice completely silently anytime. Professional reviewers call it \"the most realistic acoustic grand piano reproduction through headphones from a $500 digital piano.\" Perfect for apartments, dorms, and late-night practice."
  },
  {
    question: "Will I outgrow it?",
    answer: "Not for years. The ES60 supports beginners through advanced intermediate levels. Authentic SK-EX sampling, 88 weighted keys, and 192-note polyphony are professional-grade features. Many serious pianists keep an ES60 as a portable practice instrument. Excellent long-term investment at only $499."
  },
  {
    question: "Is it portable for students?",
    answer: "Exceptionally portable. Just 24 pounds (11kg) - light enough for dorm rooms, lessons, and performances. Full 88-key weighted action with no compromise. Compact design fits vehicles and doorways easily. Ideal for student mobility."
  },
  {
    question: "Works with learning apps?",
    answer: "Yes - seamless integration. USB connectivity works with Simply Piano, Flowkey, Playground Sessions, and DAWs. PianoRemote app adds MIDI recording and visual rhythm patterns. Professional 1/4\" outputs for external speakers. Modern learning meets authentic piano experience."
  },
  {
    question: "Good for adult learners?",
    answer: "Ideal for adult learners. Authentic weighted action teaches proper technique from day one. Professional SK-EX sound makes practice inspiring. Silent practice fits busy schedules. Only $499 makes starting piano accessible. Portable design fits modern lifestyles. Adult learners report the authentic feel keeps them motivated."
  }
];

interface FAQItemComponentProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}

function FAQItemComponent({ item, index, isOpen, onToggle, isInView }: FAQItemComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20
      }}
      transition={{
        delay: isInView ? index * 0.1 : 0,
        duration: 0.6
      }}
      className="border-b border-white/10 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-4 md:py-5 px-2 flex items-start justify-between text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-semibold text-white pr-6 group-hover:text-red-400 transition-colors duration-200">
          {item.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors duration-200" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-5">
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSlide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden scroll-snap-slide"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.5 }}
    >
      {/* Ambient background elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
            animate={{
              scale: isInView ? [1, 1.5, 1] : 1,
              opacity: isInView ? [0.2, 0.5, 0.2] : 0.2,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: isInView ? Infinity : 0,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center overflow-y-auto scrollbar-hide py-12">
        <div className="w-full max-w-3xl mx-auto px-6 md:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 1.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="text-blue-400 text-sm md:text-base font-medium mb-4 tracking-wide uppercase">
              Questions & Answers
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You
              <span className="block text-blue-400">Need to Know</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              Common questions from beginners, students, and adult learners
            </p>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20
            }}
            transition={{ delay: isInView ? 0.5 : 0, duration: 1 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {cinematicFAQData.map((item, index) => (
                <FAQItemComponent
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => toggleQuestion(index)}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20
            }}
            transition={{ delay: isInView ? 1.5 : 0, duration: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-white/60 text-sm md:text-base mb-4">
              Still have questions about the ES60?
            </p>
            <motion.a
              href="/contact?product=es60&source=cinematic-faq"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Our Experts
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
