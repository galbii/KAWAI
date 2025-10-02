"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const itemRef = useRef<HTMLDivElement>(null);

  // Scroll into view when opened
  useEffect(() => {
    if (isOpen && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100); // Small delay to allow animation to start
    }
  }, [isOpen]);

  return (
    <motion.div
      ref={itemRef}
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
        className="w-full py-4 md:py-5 px-4 sm:px-6 flex items-start justify-between text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-base sm:text-lg font-semibold text-white pr-4 sm:pr-6 group-hover:text-red-400 transition-colors duration-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.85)' }}>
          {item.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors duration-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
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
            <div className="px-4 sm:px-6 pb-5">
              <p className="text-sm sm:text-base text-white leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
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
  const faqContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [outboundUrl, setOutboundUrl] = useState('https://kawaius.com/product/kawai-es60/');

  // Add webkit scrollbar styles
  useEffect(() => {
    if (!faqContainerRef.current) return;

    const style = document.createElement('style');
    style.textContent = `
      .faq-scrollable::-webkit-scrollbar {
        width: 8px;
      }
      .faq-scrollable::-webkit-scrollbar-track {
        background: transparent;
      }
      .faq-scrollable::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      .faq-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Build outbound URL with preserved UTM parameters and fbclid
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const baseUrl = 'https://kawaius.com/product/kawai-es60/';
      const outboundParams = new URLSearchParams();

      // Preserve all UTM parameters from the incoming URL
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
      utmParams.forEach(param => {
        const value = currentParams.get(param);
        if (value) {
          outboundParams.set(param, value);
        }
      });

      // Preserve fbclid (Facebook Click ID) - critical for attribution
      const fbclid = currentParams.get('fbclid');
      if (fbclid) {
        outboundParams.set('fbclid', fbclid);
      }

      // If no UTM parameters were found, use default ones
      if (!outboundParams.has('utm_source')) {
        outboundParams.set('utm_source', 'direct');
        outboundParams.set('utm_medium', 'referral');
        outboundParams.set('utm_campaign', 'es60_awareness_campaign');
        outboundParams.set('utm_content', 'faq_cta');
      }

      // Build final URL
      const finalUrl = `${baseUrl}?${outboundParams.toString()}`;
      setOutboundUrl(finalUrl);
    }
  }, []);

  // Handle external link click tracking
  const handleExternalLinkClick = () => {
    // Get UTM parameters from URL for tracking
    const urlParams = new URLSearchParams(window.location.search);
    const utmCampaign = urlParams.get('utm_campaign') || 'direct';
    const utmSource = urlParams.get('utm_source') || 'direct';
    const utmMedium = urlParams.get('utm_medium') || 'none';
    const utmContent = urlParams.get('utm_content') || 'none';

    // Track the outbound click as a conversion event with UTM data
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'ES60 Digital Piano',
        content_category: 'Digital Piano',
        value: 499,
        currency: 'USD',
        utm_campaign: utmCampaign,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_content: utmContent,
        source: 'es60_landing_page_faq'
      });

      // Also track as a custom event for additional granularity
      (window as any).fbq('trackCustom', 'ES60_ProductClick', {
        campaign: utmCampaign,
        value: 499,
        currency: 'USD',
        source: 'faq_slide'
      });
    }
  };

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

      <div className="relative z-10 h-full flex items-start justify-center py-6 sm:py-10 px-4">
        <div className="w-full max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30
            }}
            transition={{ duration: 1.5 }}
            className="text-center mb-4 md:mb-8"
          >
            <p className="text-blue-400 text-sm md:text-base font-medium mb-2 md:mb-3 tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)' }}>
              Questions & Answers
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.9)' }}>
              Everything You
              <span className="block text-blue-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.9)' }}>Need to Know</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9), 0 0 22px rgba(0,0,0,0.85)' }}>
              Common questions from beginners, students, and adult learners
            </p>
          </motion.div>

          {/* FAQ List - Scrollable container */}
          <motion.div
            ref={faqContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20
            }}
            transition={{ delay: isInView ? 0.5 : 0, duration: 1 }}
            className="faq-scrollable bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 overflow-y-auto mb-6"
            style={{
              maxHeight: 'min(55vh, 450px)',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
            }}
          >
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
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{
              delay: isInView ? 1.5 : 0,
              duration: 1,
              type: "spring"
            }}
            className="text-center"
          >
            <Button
              size="lg"
              className="px-6 md:px-12 py-3 md:py-5 text-sm md:text-lg lg:text-xl font-bold bg-white text-red-600 hover:bg-gray-100 rounded-xl md:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-md min-h-[44px]"
              asChild
            >
              <a
                href={outboundUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
              >
                Get Your ES60 Today
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
