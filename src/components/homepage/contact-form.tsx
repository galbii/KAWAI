'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormProps } from '@/lib/types/homepage';
import {
  withFallback,
  FALLBACK_CONTACT_FORM_DATA
} from '@/lib/fallbacks';
import { trackFormInteraction } from '@/lib/analytics/unified-tracking';

// Create dynamic form validation schema based on data
const createFormSchema = (formOptions: any) => z.object({
  // Step 1: Experience & Intent
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  pianoType: z.string().min(1, 'Please select a piano type'),
  primaryPlayer: z.string().min(1, 'Please select the primary player'),
  
  // Step 2: Qualification
  budget: z.string().min(1, 'Please select a budget range'),
  
  // Step 3: Contact
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  wantsConsultation: z.boolean().optional(),
});

type FormData = {
  experienceLevel: string;
  pianoType: string;
  primaryPlayer: string;
  budget: string;
  name: string;
  email: string;
  phone?: string;
  wantsConsultation?: boolean;
};








export function ContactForm({ data }: ContactFormProps) {
  // Use comprehensive fallback system
  const formData = withFallback(data, FALLBACK_CONTACT_FORM_DATA);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasStartedTracking = useRef(false);

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

  const formSchema = createFormSchema(formData.formOptions);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    mode: 'onChange',
    defaultValues: {
      wantsConsultation: false
    }
  });

  const watchedValues = watch();

  const handleFormStart = () => {
    if (hasStartedTracking.current) return;
    hasStartedTracking.current = true;
    trackFormInteraction({
      blockType: 'marketing-contact-form',
      blockData: {},
      action: 'form_start',
      formName: 'Find Your Perfect Piano',
    });
  };

  const handleNextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ['experienceLevel', 'pianoType', 'primaryPlayer'];
      case 2:
        return ['budget'];
      case 3:
        return ['name', 'email'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      trackFormInteraction({
        blockType: 'marketing-contact-form',
        blockData: {},
        action: 'form_submit',
        formName: 'Find Your Perfect Piano',
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isStepComplete = (step: number): boolean => {
    const fields = getFieldsForStep(step);
    return fields.every(field => watchedValues[field] !== undefined && watchedValues[field] !== '');
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-kawai-pearl">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-white rounded-lg shadow-xl p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-kawai-black mb-4">
              Thank You!
            </h2>
            <p className="text-lg text-kawai-black/70 mb-8">
              Your free Piano Buying Guide is on its way to your inbox. We'll also be in touch soon to help you find your perfect piano.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="/pianos" 
                className="bg-kawai-red hover:bg-kawai-black text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Explore Our Pianos
              </a>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                }}
                className="border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 bg-kawai-pearl">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header with better mobile typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light font-serif text-kawai-black mb-4 sm:mb-6 px-4 sm:px-0">
            {formData.contactTitle} <span className="text-kawai-red">{formData.contactTitleHighlight}</span>
          </h2>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-2xl mx-auto px-4 sm:px-0">
            {formData.contactDescription}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-kawai-red text-white' 
                    : isStepComplete(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-kawai-black/20 text-kawai-black/60'
                  }
                `}>
                  {isStepComplete(step) && currentStep > step ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-kawai-red' : 'bg-kawai-black/20'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form with better mobile padding */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-12 mx-4 sm:mx-0"
        >
          <h3 className="text-xl sm:text-2xl font-serif text-kawai-black mb-6 sm:mb-8 text-center">
            {formData.stepTitles[currentStep - 1]?.step || `Step ${currentStep}`}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Experience & Intent */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What's your piano experience level?
                  </label>
                  <div className="grid gap-3">
                    {formData.formOptions.experienceLevels.map((level, index) => (
                      <label key={level.level} className="flex items-center p-3 sm:p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer touch-manipulation min-h-[44px]">
                        <input
                          type="radio"
                          value={level.level.toLowerCase()}
                          {...register('experienceLevel')}
                          onFocus={handleFormStart}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.experienceLevel === level.level.toLowerCase() 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.experienceLevel === level.level.toLowerCase() && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{level.level}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.experienceLevel && (
                    <p className="text-kawai-red text-sm mt-2">{errors.experienceLevel.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What type of piano interests you most?
                  </label>
                  <div className="grid gap-3">
                    {formData.formOptions.pianoTypes.map((type) => (
                      <label key={type.type} className="flex items-center p-3 sm:p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer touch-manipulation min-h-[44px]">
                        <input
                          type="radio"
                          value={type.type.toLowerCase().replace(/\s+/g, '-')}
                          {...register('pianoType')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.pianoType === type.type.toLowerCase().replace(/\s+/g, '-')
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.pianoType === type.type.toLowerCase().replace(/\s+/g, '-') && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{type.type}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.pianoType && (
                    <p className="text-kawai-red text-sm mt-2">{errors.pianoType.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What will be the primary use for your piano?
                  </label>
                  <div className="grid gap-3">
                    {formData.formOptions.primaryUses.map((use) => (
                      <label key={use.use} className="flex items-center p-3 sm:p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer touch-manipulation min-h-[44px]">
                        <input
                          type="radio"
                          value={use.use.toLowerCase().replace(/\s+/g, '-')}
                          {...register('primaryPlayer')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.primaryPlayer === use.use.toLowerCase().replace(/\s+/g, '-')
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.primaryPlayer === use.use.toLowerCase().replace(/\s+/g, '-') && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{use.use}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.primaryPlayer && (
                    <p className="text-kawai-red text-sm mt-2">{errors.primaryPlayer.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Qualification */}
            {currentStep === 2 && (
              <div className="space-y-8">

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What's your budget range?
                  </label>
                  <div className="grid gap-3">
                    {formData.formOptions.budgetRanges.map((budget) => (
                      <label key={budget.range} className="flex items-center p-3 sm:p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer touch-manipulation min-h-[44px]">
                        <input
                          type="radio"
                          value={budget.range.toLowerCase().replace(/[\s$,+]/g, '-')}
                          {...register('budget')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.budget === budget.range.toLowerCase().replace(/[\s$,+]/g, '-')
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.budget === budget.range.toLowerCase().replace(/[\s$,+]/g, '-') && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{budget.range}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.budget && (
                    <p className="text-kawai-red text-sm mt-2">{errors.budget.message}</p>
                  )}
                </div>

              </div>
            )}

            {/* Step 3: Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-lg font-medium text-kawai-black mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full p-3 sm:p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors min-h-[44px] text-base"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-kawai-red text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-lg font-medium text-kawai-black mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full p-3 sm:p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors min-h-[44px] text-base"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-kawai-red text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-2 block">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full p-3 sm:p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors min-h-[44px] text-base"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('wantsConsultation')}
                      className="mt-1 w-5 h-5 text-kawai-red border-kawai-black/30 rounded focus:ring-kawai-red"
                    />
                    <div>
                      <div className="font-medium text-kawai-black">
                        Yes, I'd like a complimentary consultation
                      </div>
                      <div className="text-sm text-kawai-black/60">
                        Our piano experts will help you find the perfect instrument for your needs
                      </div>
                    </div>
                  </label>
                </div>

                <div className="bg-kawai-pearl/50 p-6 rounded-md">
                  <h4 className="font-medium text-kawai-black mb-2">What you'll receive:</h4>
                  <ul className="space-y-2 text-sm text-kawai-black/70">
                    {formData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-kawai-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Mobile optimized */}
            <div className="flex justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-kawai-black/10">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-kawai-black/40 cursor-not-allowed'
                    : 'text-kawai-black hover:text-kawai-red'
                }`}
              >
                ← Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-md font-medium transition-colors text-sm sm:text-base ${
                    isStepComplete(currentStep)
                      ? 'bg-kawai-red hover:bg-kawai-black text-white'
                      : 'bg-kawai-black/20 text-kawai-black/40 cursor-not-allowed'
                  }`}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-md font-medium transition-colors text-sm sm:text-base ${
                    isValid
                      ? 'bg-kawai-red hover:bg-kawai-black text-white'
                      : 'bg-kawai-black/20 text-kawai-black/40 cursor-not-allowed'
                  }`}
                >
                  Get My Free Guide →
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-kawai-black/60 mb-4">
            {formData.trustMessage}
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-xs text-kawai-black/40">Lake St. Louis Showroom</div>
            <div className="w-px h-4 bg-kawai-black/20"></div>
            <div className="text-xs text-kawai-black/40">95+ Years Experience</div>
            <div className="w-px h-4 bg-kawai-black/20"></div>
            <div className="text-xs text-kawai-black/40">Missouri's Kawai Experts</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}