'use client';

import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from '@/lib/actions/contact-form';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import type { ContactFormSectionData } from '@/lib/types/homepage';

interface LocationContactFormProps {
  data?: ContactFormSectionData;
}

// Form validation schema for location-specific contact form
const contactFormSchema = z.object({
  // Contact Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Contact Preferences
  preferredContact: z.enum(['phone', 'email', 'text'], {
    required_error: 'Please select your preferred contact method',
  }),
  
  // Inquiry Details
  inquiryType: z.enum(['general', 'piano-consultation', 'service', 'financing', 'scheduling'], {
    required_error: 'Please select the type of inquiry',
  }),
  
  // Optional fields
  pianoInterest: z.string().optional(),
  message: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  
  // Consent
  subscribeToUpdates: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const DEFAULT_CONTACT_FORM_DATA: ContactFormSectionData = {
  contactTitle: "Get In Touch With",
  contactTitleHighlight: "Our Team",
  contactDescription: "Ready to find your perfect piano or need assistance with your current instrument? Our Lake St. Louis team is here to help with personalized consultations, service inquiries, and expert guidance.",
  stepTitles: [
    { step: 'Share your contact information' },
    { step: 'Tell us how we can help' },
    { step: 'We\'ll be in touch soon' }
  ],
  trustMessage: "Your privacy is important to us. We never share your information with third parties.",
  benefits: [
    { icon: 'users', text: 'Expert piano consultation and guidance' },
    { icon: 'clock', text: 'Response within 24 hours' },
    { icon: 'shield-check', text: 'No obligation - just helpful advice' }
  ],
  formOptions: {
    experienceLevels: [
      { level: 'Beginner' },
      { level: 'Intermediate' },
      { level: 'Advanced' },
      { level: 'Professional' }
    ],
    pianoTypes: [
      { type: 'Acoustic Grand' },
      { type: 'Acoustic Upright' },
      { type: 'Digital Piano' },
      { type: 'Hybrid Piano' },
      { type: 'Not Sure' }
    ],
    budgetRanges: [
      { range: 'Under $5,000' },
      { range: '$5,000 - $15,000' },
      { range: '$15,000 - $35,000' },
      { range: '$35,000 - $75,000' },
      { range: '$75,000+' }
    ],
    primaryUses: [
      { use: 'Learning/Practice' },
      { use: 'Family Entertainment' },
      { use: 'Teaching' },
      { use: 'Performance' },
      { use: 'Recording/Studio' }
    ]
  }
};

export function LocationContactForm({ data = DEFAULT_CONTACT_FORM_DATA }: LocationContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subscribeToUpdates: false
    }
  });

  const watchedValues = watch();

  const [formState, formAction] = useFormState(submitContactForm, null);

  const onSubmit = async (data: ContactFormData) => {
    // Create FormData object from the validated data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    setIsSubmitting(true);
    try {
      await formAction(formData);
      // Success will be handled by useFormState
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form was successfully submitted via server action
  React.useEffect(() => {
    if (formState?.success) {
      setIsSubmitted(true);
    }
  }, [formState]);

  if (isSubmitted) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-kawai-pearl rounded-lg shadow-xl p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-kawai-black mb-4">
              Thank You for Contacting Us!
            </h2>
            <p className="text-lg text-kawai-black/70 mb-8">
              We've received your message and will get back to you within 24 hours. 
              Our team is excited to help with your piano journey.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                }}
                className="bg-kawai-red hover:bg-kawai-black text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-6">
            {data.contactTitle} <span className="text-kawai-red">{data.contactTitleHighlight}</span>
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-3xl mx-auto">
            {data.contactDescription}
          </p>
        </div>

        {/* Server Error Display */}
        {formState && !formState.success && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="font-medium text-red-800">Error submitting form</h4>
            </div>
            <p className="text-red-700 mb-2">{formState.message}</p>
            {formState.errors && (
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                {Object.entries(formState.errors).map(([field, error]) => (
                  <li key={field}>{field}: {error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-kawai-pearl/30 rounded-lg shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-2xl font-serif text-kawai-black mb-6 flex items-center">
                <UserIcon className="w-6 h-6 text-kawai-red mr-3" />
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-kawai-red text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-kawai-red text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-kawai-red text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-kawai-red text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Preferences */}
            <div>
              <h3 className="text-2xl font-serif text-kawai-black mb-6 flex items-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-kawai-red mr-3" />
                How Can We Help You?
              </h3>

              <div className="space-y-6">
                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-4">
                    Preferred Contact Method *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'phone', label: 'Phone Call', icon: PhoneIcon },
                      { value: 'email', label: 'Email', icon: EnvelopeIcon },
                      { value: 'text', label: 'Text Message', icon: ChatBubbleLeftRightIcon },
                    ].map(({ value, label, icon: Icon }) => (
                      <label key={value} className="flex items-center p-4 border border-kawai-black/20 rounded-md hover:border-kawai-red transition-colors cursor-pointer bg-white">
                        <input
                          type="radio"
                          value={value}
                          {...register('preferredContact')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          watchedValues.preferredContact === value 
                            ? 'border-kawai-red bg-kawai-red' 
                            : 'border-kawai-black/30'
                        }`}>
                          {watchedValues.preferredContact === value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <Icon className="w-5 h-5 text-kawai-red mr-3" />
                        <span className="font-medium text-kawai-black">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.preferredContact && (
                    <p className="text-kawai-red text-sm mt-2">{errors.preferredContact.message}</p>
                  )}
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-4">
                    What can we help you with? *
                  </label>
                  <select
                    {...register('inquiryType')}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="piano-consultation">Piano Consultation & Recommendations</option>
                    <option value="scheduling">Schedule Showroom Visit</option>
                    <option value="service">Piano Service & Maintenance</option>
                    <option value="financing">Financing Options</option>
                    <option value="general">General Questions</option>
                  </select>
                  {errors.inquiryType && (
                    <p className="text-kawai-red text-sm mt-1">{errors.inquiryType.message}</p>
                  )}
                </div>

                {/* Piano Interest (conditional) */}
                {watchedValues.inquiryType === 'piano-consultation' && (
                  <div>
                    <label className="block text-lg font-medium text-kawai-black mb-2">
                      What type of piano interests you most?
                    </label>
                    <select
                      {...register('pianoInterest')}
                      className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Select piano type</option>
                      {data.formOptions.pianoTypes.map((type) => (
                        <option key={type.type} value={type.type}>{type.type}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Best Time to Call (conditional) */}
                {watchedValues.preferredContact === 'phone' && (
                  <div>
                    <label className="block text-lg font-medium text-kawai-black mb-2">
                      Best time to call
                    </label>
                    <select
                      {...register('bestTimeToCall')}
                      className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 7 PM)</option>
                      <option value="anytime">Anytime during business hours</option>
                    </select>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-lg font-medium text-kawai-black mb-2">
                    Additional Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full p-4 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white resize-vertical"
                    placeholder="Tell us more about your piano needs or questions..."
                  />
                </div>

                {/* Newsletter Subscription */}
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('subscribeToUpdates')}
                      className="mt-1 w-5 h-5 text-kawai-red border-kawai-black/30 rounded focus:ring-kawai-red"
                    />
                    <div>
                      <div className="font-medium text-kawai-black">
                        Subscribe to updates
                      </div>
                      <div className="text-sm text-kawai-black/60">
                        Receive information about new pianos, events, and special offers
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white p-6 rounded-md">
              <h4 className="font-medium text-kawai-black mb-4">What to expect:</h4>
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

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-md font-medium text-lg transition-all ${
                  isSubmitting
                    ? 'bg-kawai-black/40 text-white cursor-not-allowed'
                    : 'bg-kawai-red hover:bg-kawai-black text-white hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
              
              <p className="text-sm text-kawai-black/60 mt-4">
                {data.trustMessage}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}