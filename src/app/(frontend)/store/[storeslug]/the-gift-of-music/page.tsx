'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { trackSubmitApplication } from '@/components/MetaPixel';
import StickyHeader from '@/components/campaigns/gift-of-music/StickyHeader';
import HeroSection from '@/components/campaigns/gift-of-music/HeroSection';
import ValueProposition from '@/components/campaigns/gift-of-music/ValueProposition';
import EmotionalBenefits from '@/components/campaigns/gift-of-music/EmotionalBenefits';
import InstructorCredentials from '@/components/campaigns/gift-of-music/InstructorCredentials';
import LocationSection from '@/components/campaigns/gift-of-music/LocationSection';

// Form validation schema - split by step
const step1Schema = z.object({
  studentFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  studentLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  studentBirthYear: z.string().regex(/^\d{4}$/, 'Please enter a valid year (e.g., 2010)').refine((year) => {
    const numYear = parseInt(year);
    const currentYear = new Date().getFullYear();
    return numYear >= 1920 && numYear <= currentYear;
  }, 'Please enter a valid birth year'),
  studentGender: z.string().min(1, 'Please select a gender'),
  schoolGrade: z.string().optional(),
  currentSchool: z.string().optional(),
});

const step2Schema = z.object({
  instrument: z.string().min(1, 'Please select an instrument'),
  lengthOfPreviousStudy: z.string().min(1, 'Please select previous study length'),
  privateLessonType: z.string().min(1, 'Please select a lesson type'),
});

const step3Schema = z.object({
  lessonPrice: z.string().min(1, 'Please select a price range'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  notes: z.string().optional(),
});

const step4Schema = z.object({
  emergencyContactFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  emergencyContactLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  emergencyContactPhone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContactEmail: z.string().email('Please enter a valid email address'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

type EnrollmentFormData = z.infer<typeof fullSchema>;

// Allow dynamic rendering for any dealer storeslug
export const dynamicParams = true;

export default function MusicSchoolEnrollmentPage({
  params
}: {
  params: Promise<{ storeslug: string }>
}) {
  // ✅ CORRECT: Use React's `use` hook to unwrap params Promise (Next.js 15)
  const { storeslug } = use(params);

  const [showLandingPage, setShowLandingPage] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState(20);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [locationName, setLocationName] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [locationPhone, setLocationPhone] = useState<string>('');
  const hasFetchedRef = useRef<string>(''); // Track which storeslug we've fetched
  const posthog = usePostHog();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  });

  // Fetch storefront data - runs once when storeslug changes
  useEffect(() => {
    if (!storeslug) return;

    // Don't refetch if we already fetched this storeslug
    if (hasFetchedRef.current === storeslug) return;

    const fetchStorefrontData = async () => {
      try {
        console.log('[LocationFetch] Fetching data for storeslug:', storeslug);

        // Fetch header data for location name
        const headerResponse = await fetch(`/api/storefronts/header/${storeslug}`);
        const headerResult = await headerResponse.json();

        if (headerResult.success && headerResult.data) {
          setLocationName(headerResult.data.locationName);
        }

        // Fetch full storefront data for address and phone
        const response = await fetch(`/api/storefronts/by-storeslug/${storeslug}`);
        const result = await response.json();

        if (result.success && result.data?.showroomSection?.showroomInfo) {
          const info = result.data.showroomSection.showroomInfo;
          setLocationAddress(info.address || '');
          setLocationPhone(info.phone || '');
        }

        // Mark this storeslug as fetched
        hasFetchedRef.current = storeslug;
        console.log('[LocationFetch] Fetch complete for storeslug:', storeslug);
      } catch (error) {
        console.error('Failed to fetch storefront data:', error);
      }
    };

    fetchStorefrontData();
  }, [storeslug]); // Only depend on storeslug

  const watchedValues = watch();

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

  // Simulate spots decreasing (for demo - in production, fetch from backend)
  useEffect(() => {
    const randomDecrease = Math.floor(Math.random() * 3); // 0-2 spots already taken
    setSpotsRemaining(20 - randomDecrease);
  }, []);

  const handleCTAClick = useCallback(() => {
    // Track CTA click
    if (posthog) {
      posthog.capture('giftofmusic_landing_cta_click', {
        spots_remaining: spotsRemaining,
        time_remaining_days: timeRemaining.days
      });
    }

    // Transition to form
    setShowLandingPage(false);
  }, [posthog, spotsRemaining, timeRemaining.days]);

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof EnrollmentFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['studentFirstName', 'studentLastName', 'studentBirthYear', 'studentGender'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['instrument', 'lengthOfPreviousStudy', 'privateLessonType'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['lessonPrice', 'preferredTime'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Enrollment submitted:', data);

      // Submit to Constant Contact API
      const response = await fetch('/api/music-school/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Enrollment submission failed:', result);
        alert(`Enrollment failed: ${result.error || 'Unknown error'}\n\nPlease try again or contact us directly.`);
        setIsSubmitting(false);
        return;
      }

      console.log('Enrollment successful:', result);

      // Track successful application submission with Meta Pixel
      trackSubmitApplication({
        content_name: `${data.studentFirstName} ${data.studentLastName} - Music School Enrollment (Holiday Special)`,
        content_category: data.instrument,
        value: 0, // Free first lesson promotion
        currency: 'USD',
        status: 'completed'
      });

      // Track custom PostHog event
      if (posthog) {
        posthog.capture('giftofmusic_submit');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred while submitting your enrollment. Please try again or contact us directly.');
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      return !!(
        watchedValues.studentFirstName &&
        watchedValues.studentLastName &&
        watchedValues.studentBirthYear &&
        watchedValues.studentGender
      );
    } else if (step === 2) {
      return !!(
        watchedValues.instrument &&
        watchedValues.lengthOfPreviousStudy &&
        watchedValues.privateLessonType
      );
    } else if (step === 3) {
      return !!(
        watchedValues.lessonPrice &&
        watchedValues.preferredTime
      );
    } else if (step === 4) {
      return !!(
        watchedValues.emergencyContactFirstName &&
        watchedValues.emergencyContactLastName &&
        watchedValues.emergencyContactPhone &&
        watchedValues.emergencyContactEmail &&
        watchedValues.agreeToTerms
      );
    }
    return false;
  };

  // Success State
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-kawai-red to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-serif text-kawai-black mb-4">
            Welcome to KMS! 🎄
          </h2>
          <p className="text-xl text-kawai-black/70 mb-8">
            Your enrollment is complete! We'll contact you within 24 hours to schedule your <strong>FREE first lesson</strong>.
          </p>
          <div className="bg-gradient-to-r from-red-50 to-green-50 border-2 border-kawai-gold/30 p-6 rounded-xl mb-8">
            <p className="text-lg font-semibold text-emerald-900 mb-3">
              Your Holiday Special Benefits:
            </p>
            <ul className="text-left space-y-3 text-emerald-900">
              <li className="flex items-center">
                <span className="font-medium">First lesson completely FREE</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium">Registration fee WAIVED</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium">The Gift of Music—celebrate with KMS!</span>
              </li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-kawai-red to-emerald-700 hover:from-kawai-red/90 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  // Main Page with Landing Page and Form
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* High-Converting Landing Page - fades out when CTA clicked */}
      <AnimatePresence>
        {showLandingPage && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-20 overflow-y-auto bg-gradient-to-br from-red-50 via-green-50 to-red-50"
          >
            <StickyHeader
              spotsRemaining={spotsRemaining}
              timeRemaining={timeRemaining}
            />

            {/* Full-width sections */}
            <div className="pb-24">
              {/* Hero Section - Full Width */}
              <HeroSection
                locationName={locationName}
                spotsRemaining={spotsRemaining}
                onCTAClick={handleCTAClick}
              />

              {/* Location Section with CTA */}
              <LocationSection
                locationName={locationName}
                address={locationAddress}
                phone={locationPhone}
                spotsRemaining={spotsRemaining}
                onCTAClick={handleCTAClick}
              />

              {/* Full-width sections */}
              <EmotionalBenefits onCTAClick={handleCTAClick} />
              <ValueProposition />
              <InstructorCredentials />

              {/* Final CTA Section - Constrained */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
                <div className="bg-white rounded-none border-t-4 border-kawai-gold shadow-[0_12px_50px_rgba(0,0,0,0.25)] p-10 sm:p-14 lg:p-20 text-center relative overflow-hidden">
                  {/* Subtle decorative accents */}
                  <div className="absolute top-0 left-8 text-kawai-red text-2xl opacity-30">✦</div>
                  <div className="absolute top-0 right-8 text-emerald-600 text-2xl opacity-30">✦</div>

                  <div className="relative z-10">
                    {/* KMS Logo */}
                    <div className="flex justify-center mb-8">
                      <Image
                        src="/images/kms/KMS Logo.png"
                        alt="KMS Music School"
                        width={400}
                        height={50}
                        className="h-12 sm:h-14 w-auto opacity-90"
                      />
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-kawai-black mb-4 leading-tight">
                      Reserve Your Place at Dallas's
                      <br />
                      Premier Music Academy
                    </h2>

                    <p className="text-base sm:text-lg text-gray-600 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
                      Limited Spots in Our State-of-the-Art Facility
                    </p>

                    <div className="w-32 h-1 bg-gradient-to-r from-kawai-red via-kawai-gold to-emerald-600 mx-auto mb-10" />

                    {/* Urgency Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-10 pb-10 border-b-2 border-gray-100">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 font-light mb-2 uppercase tracking-wide">Holiday Special Deadline</p>
                        <p className="text-2xl sm:text-3xl font-serif text-kawai-black">January 3rd, 2026</p>
                      </div>
                      <div className="hidden sm:block w-px h-16 bg-gray-200"></div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 font-light mb-2 uppercase tracking-wide">Remaining Spots</p>
                        <p className="text-5xl sm:text-6xl font-bold text-kawai-red tabular-nums">{spotsRemaining}</p>
                      </div>
                    </div>

                    {/* Premium Description */}
                    <div className="max-w-3xl mx-auto mb-10">
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light mb-6">
                        Since opening in 2018, Kawai School of Music Dallas has maintained the highest standards in musical education. Our 200-seat concert hall, professional recording studio, and Shigeru Kawai SK-EX concert grand—Kawai's flagship instrument—represent an investment in excellence, and this is your opportunity to experience it free.
                      </p>
                      <p className="text-lg sm:text-xl font-serif text-kawai-black">
                        Only <span className="text-kawai-red font-bold text-2xl">{spotsRemaining}</span> students will secure enrollment before spaces fill.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleCTAClick}
                      className="bg-kawai-red hover:bg-kawai-red/90 text-white px-12 py-5 font-bold text-lg sm:text-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 w-full sm:w-auto"
                    >
                      Contact for More Information
                    </button>

                    {/* Contact Phone */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-light mb-2">
                        Questions? Call us at:
                      </p>
                      <a
                        href="tel:972-955-3339"
                        className="text-2xl font-bold text-kawai-red hover:text-kawai-red/80 transition-colors"
                      >
                        972-955-3339
                      </a>
                    </div>

                    <p className="text-sm sm:text-base text-gray-600 font-light">
                      Enrollment closes January 3rd or when all {spotsRemaining} spots are filled—whichever comes first.
                    </p>
                  </div>
                </div>

                {/* Trust Badges - Premium Facility Focus */}
                <div className="mt-10 text-center">
                  <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 font-light">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-kawai-gold rounded-full" />
                      <span>Est. 2018</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-kawai-gold rounded-full" />
                      <span>Competition-Winning Faculty</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-kawai-gold rounded-full" />
                      <span>200-Seat Concert Hall</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom CTA (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-kawai-red shadow-2xl p-4 sm:hidden z-40">
              <button
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-kawai-red to-red-700 hover:from-kawai-red/90 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg"
              >
                🎁 RESERVE FREE LESSON
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content - fades in when landing page fades out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLandingPage ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: showLandingPage ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: showLandingPage ? 0 : 0.3 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowLandingPage(true)}
              className="inline-flex items-center gap-2 text-kawai-red hover:text-red-700 font-semibold transition-colors duration-200 group"
            >
              <svg
                className="w-5 h-5 transform transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Offer
            </button>
          </motion.div>

          {/* KMS Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showLandingPage ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: showLandingPage ? 0 : 0.5 }}
            className="text-center mb-6"
          >
            <Image
              src="/images/kms/KMS Logo.png"
              alt="KMS Music School"
              width={800}
              height={100}
              className="h-14 sm:h-16 w-auto mx-auto"
              priority
            />
          </motion.div>

          {/* Holiday Banner - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showLandingPage ? 0 : 1, scale: 1 }}
            transition={{ duration: 0.6, delay: showLandingPage ? 0 : 0.7 }}
            className="bg-gradient-to-r from-kawai-red via-emerald-700 to-kawai-red text-white rounded-2xl p-6 mb-8 shadow-xl border-2 border-kawai-gold/30"
          >
            <h1 className="text-2xl sm:text-3xl font-serif text-center mb-3">
              🎄 The Gift of Music 🎁
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="font-semibold">First Lesson FREE</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Registration Fee WAIVED</span>
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm mt-3 text-white/90">
              Valid through January 3rd, 2026
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showLandingPage ? 0 : 1 }}
            transition={{ duration: 0.6, delay: showLandingPage ? 0 : 0.9 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: currentStep === step ? 1.1 : 1,
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        currentStep > step
                          ? 'bg-emerald-600 text-white'
                          : currentStep === step
                          ? 'bg-kawai-red text-white shadow-lg'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {currentStep > step ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </motion.div>
                    <div className={`mt-2 text-xs font-medium text-center ${
                      currentStep >= step ? 'text-emerald-900' : 'text-gray-500'
                    }`}>
                      {step === 1 ? 'Student' : step === 2 ? 'Musical' : step === 3 ? 'Lessons' : 'Contact'}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step + 1 ? 'bg-emerald-600' : currentStep > step ? 'bg-kawai-red' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showLandingPage ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: showLandingPage ? 0 : 1.1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Student Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-kawai-black mb-2">
                        Student Information
                      </h2>
                      <p className="text-kawai-black/60">
                        Tell us about the student enrolling
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gift-studentFirstName" className="block text-base font-semibold text-kawai-black mb-2">
                          First Name *
                        </label>
                        <input
                          id="gift-studentFirstName"
                          type="text"
                          {...register('studentFirstName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="First name"
                        />
                        {errors.studentFirstName && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="gift-studentLastName" className="block text-base font-semibold text-kawai-black mb-2">
                          Last Name *
                        </label>
                        <input
                          id="gift-studentLastName"
                          type="text"
                          {...register('studentLastName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="Last name"
                        />
                        {errors.studentLastName && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentLastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gift-studentBirthYear" className="block text-base font-semibold text-kawai-black mb-2">
                          Birth Year *
                        </label>
                        <input
                          id="gift-studentBirthYear"
                          type="text"
                          {...register('studentBirthYear')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="e.g., 2010"
                          maxLength={4}
                        />
                        {errors.studentBirthYear && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentBirthYear.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="gift-studentGender" className="block text-base font-semibold text-kawai-black mb-2">
                          Gender *
                        </label>
                        <select
                          id="gift-studentGender"
                          {...register('studentGender')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                        >
                          <option value="">Select...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        {errors.studentGender && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentGender.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gift-schoolGrade" className="block text-base font-semibold text-kawai-black mb-2">
                          School Grade <span className="text-sm font-normal text-gray-500">(if applicable)</span>
                        </label>
                        <input
                          id="gift-schoolGrade"
                          type="text"
                          {...register('schoolGrade')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="e.g., 5th grade"
                        />
                      </div>

                      <div>
                        <label htmlFor="gift-currentSchool" className="block text-base font-semibold text-kawai-black mb-2">
                          Current School <span className="text-sm font-normal text-gray-500">(if applicable)</span>
                        </label>
                        <input
                          id="gift-currentSchool"
                          type="text"
                          {...register('currentSchool')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="School name"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Musical Background */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-kawai-black mb-2">
                        Musical Background
                      </h2>
                      <p className="text-kawai-black/60">
                        Help us understand their musical experience
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gift-instrument" className="block text-base font-semibold text-kawai-black mb-2">
                        Instrument of Interest *
                      </label>
                      <select
                        id="gift-instrument"
                        {...register('instrument')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select an instrument...</option>
                        <option value="piano">Piano</option>
                        <option value="keyboard">Keyboard</option>
                        <option value="voice">Voice/Singing</option>
                        <option value="guitar">Guitar</option>
                        <option value="violin">Violin</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.instrument && (
                        <p className="text-red-600 text-sm mt-2">{errors.instrument.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gift-lengthOfPreviousStudy" className="block text-base font-semibold text-kawai-black mb-2">
                        Length of Previous Study *
                      </label>
                      <select
                        id="gift-lengthOfPreviousStudy"
                        {...register('lengthOfPreviousStudy')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select experience...</option>
                        <option value="none">No previous experience</option>
                        <option value="less-than-1-year">Less than 1 year</option>
                        <option value="1-2-years">1-2 years</option>
                        <option value="3-5-years">3-5 years</option>
                        <option value="5-plus-years">5+ years</option>
                      </select>
                      {errors.lengthOfPreviousStudy && (
                        <p className="text-red-600 text-sm mt-2">{errors.lengthOfPreviousStudy.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Private Lesson Type *
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'in-person', label: 'In-Person Lessons' },
                          { value: 'online', label: 'Online Lessons' },
                          { value: 'hybrid', label: 'Hybrid (Both In-Person & Online)' },
                          { value: 'undecided', label: 'Not sure yet' }
                        ].map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all cursor-pointer group"
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('privateLessonType')}
                              className="w-5 h-5 text-kawai-red border-gray-300 focus:ring-kawai-red focus:ring-2"
                            />
                            <span className="ml-3 text-base font-medium text-kawai-black group-hover:text-red-700">
                              {type.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.privateLessonType && (
                        <p className="text-red-600 text-sm mt-2">{errors.privateLessonType.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Lesson Preferences & Pricing */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-kawai-black mb-2">
                        Lesson Preferences
                      </h2>
                      <p className="text-kawai-black/60">
                        Help us find the perfect schedule and pricing
                      </p>
                    </div>

                    <div>
                      <label htmlFor="gift-lessonPrice" className="block text-base font-semibold text-kawai-black mb-2">
                        Preferred Price Range *
                      </label>
                      <select
                        id="gift-lessonPrice"
                        {...register('lessonPrice')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select a price range...</option>
                        <option value="$25-$40">$25 - $40 per lesson</option>
                        <option value="$40-$60">$40 - $60 per lesson</option>
                        <option value="$60-$80">$60 - $80 per lesson</option>
                        <option value="$80+">$80+ per lesson</option>
                        <option value="flexible">Flexible - discuss options</option>
                      </select>
                      {errors.lessonPrice && (
                        <p className="text-red-600 text-sm mt-2">{errors.lessonPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gift-preferredTime" className="block text-base font-semibold text-kawai-black mb-2">
                        Preferred Lesson Time *
                      </label>
                      <select
                        id="gift-preferredTime"
                        {...register('preferredTime')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select a time...</option>
                        <option value="weekday-morning">Weekday Mornings (9am - 12pm)</option>
                        <option value="weekday-afternoon">Weekday Afternoons (12pm - 5pm)</option>
                        <option value="weekday-evening">Weekday Evenings (5pm - 8pm)</option>
                        <option value="weekend-morning">Weekend Mornings (9am - 12pm)</option>
                        <option value="weekend-afternoon">Weekend Afternoons (12pm - 5pm)</option>
                        <option value="flexible">Flexible - Any time</option>
                      </select>
                      {errors.preferredTime && (
                        <p className="text-red-600 text-sm mt-2">{errors.preferredTime.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gift-notes" className="block text-base font-semibold text-kawai-black mb-2">
                        Additional Notes or Questions <span className="text-sm font-normal text-gray-500">(optional)</span>
                      </label>
                      <textarea
                        id="gift-notes"
                        {...register('notes')}
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base resize-none text-kawai-black"
                        placeholder="Tell us about musical goals, scheduling needs, or any questions..."
                      />
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-green-50 p-6 rounded-xl border-2 border-kawai-gold/30">
                      <div>
                        <h3 className="font-semibold text-emerald-900 mb-1">
                          Almost done!
                        </h3>
                        <p className="text-sm text-emerald-800">
                          One more step to complete your enrollment and claim your <strong>FREE first lesson</strong>!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Emergency Contact */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-kawai-black mb-2">
                        Primary Contact
                      </h2>
                      <p className="text-kawai-black/60">
                        Who should we contact regarding this enrollment?
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="gift-emergencyContactFirstName" className="block text-base font-semibold text-kawai-black mb-2">
                          First Name *
                        </label>
                        <input
                          id="gift-emergencyContactFirstName"
                          type="text"
                          {...register('emergencyContactFirstName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="First name"
                        />
                        {errors.emergencyContactFirstName && (
                          <p className="text-red-600 text-sm mt-2">{errors.emergencyContactFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="gift-emergencyContactLastName" className="block text-base font-semibold text-kawai-black mb-2">
                          Last Name *
                        </label>
                        <input
                          id="gift-emergencyContactLastName"
                          type="text"
                          {...register('emergencyContactLastName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="Last name"
                        />
                        {errors.emergencyContactLastName && (
                          <p className="text-red-600 text-sm mt-2">{errors.emergencyContactLastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="gift-emergencyContactPhone" className="block text-base font-semibold text-kawai-black mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="gift-emergencyContactPhone"
                        type="tel"
                        {...register('emergencyContactPhone')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                        placeholder="(555) 123-4567"
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-red-600 text-sm mt-2">{errors.emergencyContactPhone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gift-emergencyContactEmail" className="block text-base font-semibold text-kawai-black mb-2">
                        Email Address *
                      </label>
                      <input
                        id="gift-emergencyContactEmail"
                        type="email"
                        {...register('emergencyContactEmail')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kawai-red focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-base text-kawai-black"
                        placeholder="emergency.contact@example.com"
                      />
                      {errors.emergencyContactEmail && (
                        <p className="text-red-600 text-sm mt-2">{errors.emergencyContactEmail.message}</p>
                      )}
                    </div>

                    <div className="bg-red-50 rounded-xl p-5 border-2 border-kawai-gold/30">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('agreeToTerms')}
                          className="mt-0.5 w-5 h-5 text-kawai-red border-gray-300 rounded focus:ring-kawai-red focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-kawai-black/80 leading-relaxed">
                          I agree to receive communications from KMS Music School regarding enrollment, lesson scheduling, and promotional offers. I understand the free first lesson and waived registration fee are part of this Holiday Special promotion through January 3rd, 2026. *
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="text-red-600 text-sm mt-2 ml-8">{errors.agreeToTerms.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-kawai-red hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  ← Back
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepComplete(currentStep)}
                    className={`px-8 py-4 rounded-xl font-bold text-base transition-all transform ${
                      isStepComplete(currentStep)
                        ? 'bg-gradient-to-r from-kawai-red to-emerald-700 hover:from-kawai-red/90 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepComplete(4) || isSubmitting}
                    className={`px-8 py-4 rounded-xl font-bold text-base transition-all transform ${
                      isStepComplete(4) && !isSubmitting
                        ? 'bg-gradient-to-r from-kawai-red to-emerald-700 hover:from-kawai-red/90 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      'Enrolling...'
                    ) : (
                      '🎁 Claim Free Lesson! 🎄'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Trust Elements */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Professional Instructors</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span>Award-Winning</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span>Family-Friendly</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
