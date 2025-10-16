'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

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

// Allow dynamic rendering for any dealer slug
export const dynamicParams = true;

export default function MusicSchoolEnrollmentPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const watchedValues = watch();

  // Smooth animation sequence - no delay gap
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); // Show intro for 3 seconds then smoothly transition

    return () => clearTimeout(introTimer);
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-12 px-4">
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
            className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-serif text-kawai-black mb-4">
            Welcome to KMS! 🎃
          </h2>
          <p className="text-xl text-kawai-black/70 mb-8">
            Your enrollment is complete! We'll contact you within 24 hours to schedule your <strong>FREE first lesson</strong>.
          </p>
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-xl mb-8">
            <p className="text-lg font-semibold text-orange-900 mb-3">
              🎉 Your Halloween Special Benefits:
            </p>
            <ul className="text-left space-y-3 text-orange-900">
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎹</span>
                <span className="font-medium">First lesson completely FREE</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">👻</span>
                <span className="font-medium">Registration fee WAIVED</span>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">🎃</span>
                <span className="font-medium">No tricks—just the treat of learning music!</span>
              </li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  // Main Page with Intro and Form
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Intro Animation - fades out smoothly */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-950 to-orange-950"
          >
            <div className="text-center px-4">
              {/* KMS Logo in intro */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-8"
              >
                <Image
                  src="/images/kms/KMS Logo.png"
                  alt="KMS Music School"
                  width={800}
                  height={100}
                  className="h-16 sm:h-20 md:h-24 w-auto mx-auto opacity-90"
                  priority
                />
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Learn a Trick,
              </motion.h1>
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 mt-4 drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Play a Treat
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content - fades in as intro fades out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          {/* KMS Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: showIntro ? 0 : 0.5 }}
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

          {/* Halloween Banner - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showIntro ? 0 : 1, scale: 1 }}
            transition={{ duration: 0.6, delay: showIntro ? 0 : 0.7 }}
            className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-2xl p-6 mb-8 shadow-xl"
          >
            <h1 className="text-2xl sm:text-3xl font-serif text-center mb-3">
              🎃 Halloween Special Enrollment 🎃
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎹</span>
                <span className="font-semibold">First Lesson FREE</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👻</span>
                <span className="font-semibold">Registration Fee WAIVED</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showIntro ? 0 : 1 }}
            transition={{ duration: 0.6, delay: showIntro ? 0 : 0.9 }}
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
                          ? 'bg-green-500 text-white'
                          : currentStep === step
                          ? 'bg-orange-500 text-white shadow-lg'
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
                      currentStep >= step ? 'text-orange-900' : 'text-gray-500'
                    }`}>
                      {step === 1 ? 'Student' : step === 2 ? 'Musical' : step === 3 ? 'Lessons' : 'Contact'}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step + 1 ? 'bg-green-500' : currentStep > step ? 'bg-orange-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: showIntro ? 0 : 1.1 }}
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
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('studentFirstName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="First name"
                        />
                        {errors.studentFirstName && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('studentLastName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="Last name"
                        />
                        {errors.studentLastName && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentLastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          Birth Year *
                        </label>
                        <input
                          type="text"
                          {...register('studentBirthYear')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="e.g., 2010"
                          maxLength={4}
                        />
                        {errors.studentBirthYear && (
                          <p className="text-red-600 text-sm mt-2">{errors.studentBirthYear.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          Gender *
                        </label>
                        <select
                          {...register('studentGender')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
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
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          School Grade <span className="text-sm font-normal text-gray-500">(optional)</span>
                        </label>
                        <input
                          type="text"
                          {...register('schoolGrade')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="e.g., 5th grade"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          Current School <span className="text-sm font-normal text-gray-500">(optional)</span>
                        </label>
                        <input
                          type="text"
                          {...register('currentSchool')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
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
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Instrument of Interest *
                      </label>
                      <select
                        {...register('instrument')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select an instrument...</option>
                        <option value="piano">🎹 Piano</option>
                        <option value="keyboard">🎹 Keyboard</option>
                        <option value="voice">🎤 Voice/Singing</option>
                        <option value="guitar">🎸 Guitar</option>
                        <option value="violin">🎻 Violin</option>
                        <option value="other">🎵 Other</option>
                      </select>
                      {errors.instrument && (
                        <p className="text-red-600 text-sm mt-2">{errors.instrument.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Length of Previous Study *
                      </label>
                      <select
                        {...register('lengthOfPreviousStudy')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
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
                          { value: 'in-person', label: 'In-Person Lessons', icon: '👤' },
                          { value: 'online', label: 'Online Lessons', icon: '💻' },
                          { value: 'hybrid', label: 'Hybrid (Both In-Person & Online)', icon: '🔄' },
                          { value: 'undecided', label: 'Not sure yet', icon: '🤔' }
                        ].map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer group"
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('privateLessonType')}
                              className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                            />
                            <span className="ml-3 text-2xl">{type.icon}</span>
                            <span className="ml-2 text-base font-medium text-kawai-black group-hover:text-orange-700">
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
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Preferred Price Range *
                      </label>
                      <select
                        {...register('lessonPrice')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
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
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Preferred Lesson Time *
                      </label>
                      <select
                        {...register('preferredTime')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base bg-white cursor-pointer text-kawai-black"
                      >
                        <option value="">Select a time...</option>
                        <option value="weekday-morning">🌅 Weekday Mornings (9am - 12pm)</option>
                        <option value="weekday-afternoon">☀️ Weekday Afternoons (12pm - 5pm)</option>
                        <option value="weekday-evening">🌆 Weekday Evenings (5pm - 8pm)</option>
                        <option value="weekend-morning">🌄 Weekend Mornings (9am - 12pm)</option>
                        <option value="weekend-afternoon">🌤️ Weekend Afternoons (12pm - 5pm)</option>
                        <option value="flexible">✨ Flexible - Any time</option>
                      </select>
                      {errors.preferredTime && (
                        <p className="text-red-600 text-sm mt-2">{errors.preferredTime.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Additional Notes or Questions <span className="text-sm font-normal text-gray-500">(optional)</span>
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base resize-none text-kawai-black"
                        placeholder="Tell us about musical goals, scheduling needs, or any questions..."
                      />
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">🎁</div>
                        <div>
                          <h3 className="font-semibold text-orange-900 mb-1">
                            Almost done!
                          </h3>
                          <p className="text-sm text-orange-800">
                            One more step to complete your enrollment and claim your <strong>FREE first lesson</strong>!
                          </p>
                        </div>
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
                        Emergency Contact
                      </h2>
                      <p className="text-kawai-black/60">
                        Who should we contact in case of emergency?
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('emergencyContactFirstName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="First name"
                        />
                        {errors.emergencyContactFirstName && (
                          <p className="text-red-600 text-sm mt-2">{errors.emergencyContactFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-kawai-black mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('emergencyContactLastName')}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                          placeholder="Last name"
                        />
                        {errors.emergencyContactLastName && (
                          <p className="text-red-600 text-sm mt-2">{errors.emergencyContactLastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('emergencyContactPhone')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                        placeholder="(555) 123-4567"
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-red-600 text-sm mt-2">{errors.emergencyContactPhone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-kawai-black mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('emergencyContactEmail')}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-base text-kawai-black"
                        placeholder="emergency.contact@example.com"
                      />
                      {errors.emergencyContactEmail && (
                        <p className="text-red-600 text-sm mt-2">{errors.emergencyContactEmail.message}</p>
                      )}
                    </div>

                    <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('agreeToTerms')}
                          className="mt-0.5 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-kawai-black/80 leading-relaxed">
                          I agree to receive communications from KMS Music School regarding enrollment, lesson scheduling, and promotional offers. I understand the free first lesson and waived registration fee are part of this Halloween promotion. *
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
                      : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
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
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
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
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Enrolling...
                      </>
                    ) : (
                      '🎃 Claim Free Lesson! 🎃'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Trust Elements */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>🎵</span>
                  <span>Professional Instructors</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>Award-Winning</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span>❤️</span>
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
