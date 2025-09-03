'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormProps, DEFAULT_CONTACT_FORM_DATA } from '@/lib/types/homepage';

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








export function ContactForm({ data = DEFAULT_CONTACT_FORM_DATA }: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formSchema = createFormSchema(data.formOptions);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      wantsConsultation: false
    }
  });

  const watchedValues = watch();

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
    <section className="py-24 bg-kawai-pearl">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-light font-serif text-kawai-black mb-6">
            {data.contactTitle} <span className="text-kawai-red">{data.contactTitleHighlight}</span>
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto">
            {data.contactDescription}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
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
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h3 className="text-2xl font-serif text-kawai-black mb-8 text-center">
            {data.stepTitles[currentStep - 1]?.step || `Step ${currentStep}`}
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
                    {data.formOptions.experienceLevels.map((level, index) => (
                      <label key={level.level} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={level.level.toLowerCase()}
                          {...register('experienceLevel')}
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
                    {data.formOptions.pianoTypes.map((type) => (
                      <label key={type.type} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
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
                    {data.formOptions.primaryUses.map((use) => (
                      <label key={use.use} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
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
                    {data.formOptions.budgetRanges.map((budget) => (
                      <label key={budget.range} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
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
                      className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors"
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
                      className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors"
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
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors"
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
                    {data.benefits.map((benefit, index) => (
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

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-kawai-black/10">
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
                  className={`px-8 py-3 rounded-md font-medium transition-colors ${
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
                  className={`px-8 py-3 rounded-md font-medium transition-colors ${
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
        </div>

        {/* Trust Elements */}
        <div className="mt-12 text-center">
          <p className="text-sm text-kawai-black/60 mb-4">
            {data.trustMessage}
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-xs text-kawai-black/40">Lake St. Louis Showroom</div>
            <div className="w-px h-4 bg-kawai-black/20"></div>
            <div className="text-xs text-kawai-black/40">95+ Years Experience</div>
            <div className="w-px h-4 bg-kawai-black/20"></div>
            <div className="text-xs text-kawai-black/40">Missouri's Kawai Experts</div>
          </div>
        </div>
      </div>
    </section>
  );
}