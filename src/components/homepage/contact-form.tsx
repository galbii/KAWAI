'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const formSchema = z.object({
  // Step 1: Experience & Intent
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  pianoType: z.enum(['acoustic-grand', 'upright', 'digital', 'not-sure']),
  primaryPlayer: z.enum(['myself', 'child', 'family', 'professional']),
  
  // Step 2: Qualification
  timeline: z.enum(['1-month', '1-3-months', '3-6-months', 'researching']),
  budget: z.enum(['under-5k', '5k-15k', '15k-30k', '30k-plus', 'need-guidance']),
  priority: z.enum(['sound-quality', 'touch', 'space', 'technology']),
  
  // Step 3: Contact
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  wantsConsultation: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const stepTitles = [
  'Tell us about your piano journey',
  'Help us understand your needs',
  'Get your free piano buying guide'
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out or returning to piano' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience, looking to advance' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced player seeking quality' }
];

const pianoTypes = [
  { value: 'acoustic-grand', label: 'Acoustic Grand', description: 'Traditional grand piano' },
  { value: 'upright', label: 'Upright', description: 'Space-efficient acoustic piano' },
  { value: 'digital', label: 'Digital', description: 'Modern digital piano' },
  { value: 'not-sure', label: 'Not Sure', description: 'Need guidance choosing' }
];

const primaryPlayers = [
  { value: 'myself', label: 'Myself', description: 'Adult learner or player' },
  { value: 'child', label: 'My Child', description: 'Student or young learner' },
  { value: 'family', label: 'Family', description: 'Multiple family members' },
  { value: 'professional', label: 'Professional Use', description: 'Teaching or performance' }
];

const timelines = [
  { value: '1-month', label: 'Within 1 Month', description: 'Ready to purchase soon' },
  { value: '1-3-months', label: '1-3 Months', description: 'Planning to buy this quarter' },
  { value: '3-6-months', label: '3-6 Months', description: 'Researching for future purchase' },
  { value: 'researching', label: 'Just Researching', description: 'Exploring options' }
];

const budgets = [
  { value: 'under-5k', label: 'Under $5,000', description: 'Entry level options' },
  { value: '5k-15k', label: '$5,000 - $15,000', description: 'Mid-range quality' },
  { value: '15k-30k', label: '$15,000 - $30,000', description: 'Premium instruments' },
  { value: '30k-plus', label: '$30,000+', description: 'Professional grade' },
  { value: 'need-guidance', label: 'Need Guidance', description: 'Help me understand pricing' }
];

const priorities = [
  { value: 'sound-quality', label: 'Sound Quality', description: 'Rich, authentic piano sound' },
  { value: 'touch', label: 'Touch & Feel', description: 'Authentic key action and response' },
  { value: 'space', label: 'Space Considerations', description: 'Fits my available space' },
  { value: 'technology', label: 'Technology Features', description: 'Modern digital capabilities' }
];

export function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        return ['timeline', 'budget', 'priority'];
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
            Find Your Perfect <span className="text-kawai-red">Piano</span>
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-2xl mx-auto">
            Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis piano experts. 
            Serving the St. Louis area for over 95 years.
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
            {stepTitles[currentStep - 1]}
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
                    {experienceLevels.map((level) => (
                      <label key={level.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={level.value}
                          {...register('experienceLevel')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.experienceLevel === level.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.experienceLevel === level.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{level.label}</div>
                          <div className="text-sm text-kawai-black/60">{level.description}</div>
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
                    {pianoTypes.map((type) => (
                      <label key={type.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={type.value}
                          {...register('pianoType')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.pianoType === type.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.pianoType === type.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{type.label}</div>
                          <div className="text-sm text-kawai-black/60">{type.description}</div>
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
                    Who will be the primary player?
                  </label>
                  <div className="grid gap-3">
                    {primaryPlayers.map((player) => (
                      <label key={player.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={player.value}
                          {...register('primaryPlayer')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.primaryPlayer === player.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.primaryPlayer === player.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{player.label}</div>
                          <div className="text-sm text-kawai-black/60">{player.description}</div>
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
                    What's your timeline for purchasing?
                  </label>
                  <div className="grid gap-3">
                    {timelines.map((timeline) => (
                      <label key={timeline.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={timeline.value}
                          {...register('timeline')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.timeline === timeline.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.timeline === timeline.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{timeline.label}</div>
                          <div className="text-sm text-kawai-black/60">{timeline.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.timeline && (
                    <p className="text-kawai-red text-sm mt-2">{errors.timeline.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What's your budget range?
                  </label>
                  <div className="grid gap-3">
                    {budgets.map((budget) => (
                      <label key={budget.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={budget.value}
                          {...register('budget')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.budget === budget.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.budget === budget.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{budget.label}</div>
                          <div className="text-sm text-kawai-black/60">{budget.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.budget && (
                    <p className="text-kawai-red text-sm mt-2">{errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-kawai-black mb-4 block">
                    What's most important to you?
                  </label>
                  <div className="grid gap-3">
                    {priorities.map((priority) => (
                      <label key={priority.value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer">
                        <input
                          type="radio"
                          value={priority.value}
                          {...register('priority')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.priority === priority.value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.priority === priority.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-kawai-black">{priority.label}</div>
                          <div className="text-sm text-kawai-black/60">{priority.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.priority && (
                    <p className="text-kawai-red text-sm mt-2">{errors.priority.message}</p>
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
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-kawai-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free comprehensive Piano Buying Guide (PDF)
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-kawai-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Personalized piano recommendations
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-kawai-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Exclusive offers and updates
                    </li>
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
            Trusted by St. Louis area piano families since 1927
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