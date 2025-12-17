'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

// Allow dynamic rendering for any dealer slug
export const dynamicParams = true;

interface LandingPageProps {
  params: Promise<{ slug: string }>;
}

export default function GiftOfMusicLandingPage({ params }: LandingPageProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const [dealerSlug, setDealerSlug] = useState<string>('');
  const [spotsRemaining, setSpotsRemaining] = useState(20);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => setDealerSlug(p.slug));
  }, [params]);

  // Countdown to January 3rd, 2026
  useEffect(() => {
    const deadline = new Date('2026-01-03T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate spots decreasing (for demo purposes - in production, this would come from your backend)
  useEffect(() => {
    const randomDecrease = Math.floor(Math.random() * 3); // 0-2 spots already taken
    setSpotsRemaining(20 - randomDecrease);
  }, []);

  const handleReserveClick = () => {
    // Track button click
    if (posthog) {
      posthog.capture('giftofmusic_landing_cta_click', {
        spots_remaining: spotsRemaining,
        time_remaining_days: timeRemaining.days
      });
    }

    // Navigate to enrollment form
    router.push(`/${dealerSlug}/the-gift-of-music`);
  };

  const percentageFilled = ((20 - spotsRemaining) / 20) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50">
      {/* Sticky Header with Urgency */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-kawai-red via-emerald-700 to-kawai-red text-white py-3 px-4 shadow-lg border-b-2 border-kawai-gold/50"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-yellow-300">🔴</span>
            <span className="font-bold">{spotsRemaining} SPOTS LEFT</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span className="font-bold hidden sm:inline">ENDS:</span>
            <span className="font-mono">
              {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Image
            src="/images/kms/KMS Logo.png"
            alt="KMS Music School"
            width={600}
            height={80}
            className="h-12 sm:h-16 w-auto mx-auto"
            priority
          />
          <div className="flex items-center justify-center gap-1 mt-3">
            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
            <span className="text-sm text-gray-600 ml-2">4.9/5 from 230+ families</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-kawai-black mb-4 leading-tight">
            🎄 Give Your Child the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawai-red via-emerald-700 to-kawai-gold">
              Gift of Music
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-6 font-semibold">
            FREE First Lesson + $100 Registration Fee WAIVED
          </p>
          <div className="inline-block bg-gradient-to-r from-kawai-gold/20 to-emerald-100 border-2 border-kawai-gold/50 rounded-xl px-6 py-3">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
              $175 <span className="line-through text-gray-500 text-xl">$175</span> → $0 Today
            </p>
            <p className="text-sm text-emerald-800 mt-1">You Save $175</p>
          </div>
        </motion.div>

        {/* Countdown Timer - Prominent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-kawai-red"
        >
          <div className="text-center mb-6">
            <p className="text-sm sm:text-base text-gray-600 mb-2">⚠️ THIS OFFER ENDS IN:</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
              {[
                { label: 'Days', value: timeRemaining.days },
                { label: 'Hours', value: timeRemaining.hours },
                { label: 'Minutes', value: timeRemaining.minutes },
                { label: 'Seconds', value: timeRemaining.seconds }
              ].map((item) => (
                <div key={item.label} className="bg-gradient-to-br from-kawai-red to-red-600 text-white rounded-xl p-3 sm:p-4">
                  <div className="text-2xl sm:text-4xl font-bold font-mono">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm mt-1 opacity-90">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">Deadline: January 3rd, 2026</p>
          </div>

          {/* Spots Remaining Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Spots Remaining:</span>
              <span className="text-lg font-bold text-kawai-red">{spotsRemaining} / 20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentageFilled}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="bg-gradient-to-r from-kawai-red to-red-600 h-3 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              ⚡ {20 - spotsRemaining} families enrolled today
            </p>
          </div>

          {/* Primary CTA Button */}
          <motion.button
            onClick={handleReserveClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-5 px-8 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all transform hover:shadow-2xl"
          >
            🎁 RESERVE MY FREE LESSON NOW 🎄
          </motion.button>
          <p className="text-xs text-gray-500 text-center mt-3">
            🔒 No credit card required • No obligation
          </p>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-center text-kawai-black mb-6">
            What Your Child Gets (FREE):
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: '🎹',
                title: '45-Minute Private Lesson',
                value: '$75 Value',
                description: 'Learn your first song in one session'
              },
              {
                icon: '💰',
                title: 'Registration Fee WAIVED',
                value: '$100 Value',
                description: 'No upfront costs or hidden fees'
              },
              {
                icon: '📋',
                title: 'Personalized Learning Plan',
                value: 'Included',
                description: 'Customized to skill level & goals'
              },
              {
                icon: '👨‍🏫',
                title: 'Professional Assessment',
                value: 'Included',
                description: 'Expert guidance from certified instructors'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-green-50 rounded-xl border border-kawai-gold/30"
              >
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-kawai-red font-semibold mb-1">{item.value}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emotional Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-center mb-6">
            Music Lessons Teach More Than Notes
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🎯', label: 'Discipline', description: 'Practicing builds work ethic' },
              { icon: '🧠', label: 'Problem-Solving', description: 'Learning requires thinking' },
              { icon: '💪', label: 'Confidence', description: 'Performing builds self-esteem' },
              { icon: '❤️', label: 'Emotional Intelligence', description: 'Music teaches feelings' },
              { icon: '🏆', label: 'Achievement', description: 'Finishing a song feels incredible' },
              { icon: '👥', label: 'Social Skills', description: 'Music brings people together' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold">{item.label}</h3>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-lg font-semibold text-kawai-gold">
            These aren't just music lessons. They're life lessons.
          </p>
        </motion.div>

        {/* Social Proof - Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-center text-kawai-black mb-6">
            What Parents Are Saying:
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                stars: 5,
                text: "My daughter went from shy to confident in just 3 months. The instructors are incredible!",
                author: "Sarah M.",
                role: "Parent of 7-year-old"
              },
              {
                stars: 5,
                text: "Best decision we made. My son practices every day without being asked. He loves it!",
                author: "Michael T.",
                role: "Parent of 8-year-old"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-red-50 to-green-50 rounded-xl border-2 border-kawai-gold/30">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructor Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="bg-gradient-to-br from-kawai-black to-gray-800 text-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-center mb-6">
            Learn From Certified Experts
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: '🎓', label: 'Master Degree Instructors' },
              { icon: '⏱️', label: '15+ Years Experience' },
              { icon: '👨‍👩‍👧‍👦', label: '500+ Students Taught' }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-xl backdrop-blur">
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-kawai-gold mb-2">✓ Certified by National Association for Music Education</p>
            <p className="text-kawai-gold">✓ Background-checked & insured instructors</p>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center border-4 border-kawai-red"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-kawai-black mb-4">
            Don't Let Your Child Miss This Opportunity
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-kawai-red font-bold">⏰ Deadline</p>
              <p className="text-gray-700">January 3rd, 2026</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-kawai-red font-bold">🔴 Spots Left</p>
              <p className="text-gray-700 text-2xl font-bold">{spotsRemaining}</p>
            </div>
          </div>
          <motion.button
            onClick={handleReserveClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-5 px-8 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all transform hover:shadow-2xl mb-3"
          >
            🎁 CLAIM MY FREE LESSON NOW 🎄
          </motion.button>
          <p className="text-xs text-gray-500">
            🔒 Secure Registration • No Credit Card Required • Privacy Guaranteed
          </p>
        </motion.div>

        {/* Trust Badges Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>SSL Secured</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>No Hidden Fees</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom CTA (Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-kawai-red shadow-2xl p-4 sm:hidden z-40"
      >
        <button
          onClick={handleReserveClick}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg"
        >
          🎁 RESERVE FREE LESSON ({spotsRemaining} LEFT)
        </button>
      </motion.div>
    </div>
  );
}
