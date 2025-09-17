/**
 * ConstantContactForm Usage Examples
 *
 * Demonstrates how to use the modular ConstantContactForm component
 * in different scenarios across the application.
 */

'use client';

import React from 'react';
import { ConstantContactForm, getSignatureFormConfig, type FormConfig } from './ConstantContactForm';
import type { ConstantContactConfig } from '@/hooks/useConstantContactIntegration';

/**
 * Example 1: Signature Experience Form (Heritage Collection)
 * Replaces the complex email capture form in DualConversion
 */
export function SignatureExperienceForm({ onComplete, assessmentResults, location }: {
  onComplete: (type: 'email', data: any) => void;
  assessmentResults: any;
  location: string;
}) {
  return (
    <ConstantContactForm
      constantContactConfig={{
        targetList: 'SHOWROOM KAWAI',
        createListIfMissing: true,
        showAuthPrompts: true
      }}
      formConfig={getSignatureFormConfig()}
      onSuccess={(data) => {
        // Handle success - call the original onComplete callback
        onComplete('email', {
          ...data,
          conversionType: 'digital',
          assessmentResults,
          location
        });
      }}
      onError={(error) => {
        console.error('Heritage collection signup error:', error);
        // Form continues to work even if Constant Contact fails
      }}
      additionalData={{
        assessmentResults,
        location,
        formType: 'signature-experience'
      }}
    />
  );
}

/**
 * Example 2: Simple Newsletter Signup
 * Can be used anywhere in the application
 */
export function NewsletterSignupForm() {
  const formConfig: FormConfig = {
    title: 'Stay Updated',
    description: 'Subscribe to receive the latest piano news and exclusive offers.',
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
      {
        name: 'optInMarketing',
        label: 'I agree to receive marketing emails',
        type: 'checkbox'
      }
    ],
    submitText: 'Subscribe',
    loadingText: 'Subscribing...',
    theme: 'minimal'
  };

  return (
    <ConstantContactForm
      constantContactConfig={{
        targetList: 'Newsletter Subscribers',
        showAuthPrompts: false
      }}
      formConfig={formConfig}
      onSuccess={(data) => {
        console.log('Newsletter subscription successful:', data);
        // Show success message or redirect
      }}
      onError={(error) => {
        console.error('Newsletter subscription failed:', error);
        // Show error message
      }}
    />
  );
}

/**
 * Example 3: Contact Us Form with Lead Capture
 * For general inquiries with Constant Contact integration
 */
export function ContactForm() {
  const formConfig: FormConfig = {
    title: 'Get in Touch',
    description: 'Send us a message and we\'ll get back to you soon.',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567' },
      {
        name: 'optInMarketing',
        label: 'Keep me updated about new products and events',
        type: 'checkbox'
      }
    ],
    submitText: 'Send Message',
    loadingText: 'Sending...',
    theme: 'default'
  };

  return (
    <ConstantContactForm
      constantContactConfig={{
        targetList: 'General Inquiries',
        createListIfMissing: true
      }}
      formConfig={formConfig}
      onSuccess={(data) => {
        console.log('Contact form submitted:', data);
        // Send email, show thank you page, etc.
      }}
      onError={(error) => {
        console.error('Contact form submission failed:', error);
      }}
      additionalData={{
        source: 'contact-page',
        timestamp: new Date().toISOString()
      }}
    />
  );
}

/**
 * Example 4: Custom Styled Form
 * Shows how to use custom themes and styling
 */
export function CustomStyledForm() {
  const formConfig: FormConfig = {
    title: 'VIP Piano Consultation',
    description: 'Exclusive access to our premium piano collection.',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel' },
    ],
    submitText: 'Request VIP Access',
    loadingText: 'Processing...',
    successMessage: 'VIP consultation request submitted successfully!',
    theme: 'signature',
    className: 'max-w-md mx-auto'
  };

  return (
    <ConstantContactForm
      constantContactConfig={{
        targetList: 'VIP Consultations',
        createListIfMissing: true
      }}
      formConfig={formConfig}
      onSuccess={(data) => {
        console.log('VIP consultation request:', data);
      }}
    />
  );
}

/**
 * Example 5: Using with Specific List ID (Advanced)
 * When you know the exact list ID to avoid lookup
 */
export function AdvancedForm() {
  const constantContactConfig: ConstantContactConfig = {
    targetListId: '40d1d690-8d9d-11f0-9bdc-fa163ea70839', // Direct list ID
    showAuthPrompts: true
  };

  const formConfig: FormConfig = {
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true }
    ],
    submitText: 'Join List',
    theme: 'minimal'
  };

  return (
    <ConstantContactForm
      constantContactConfig={constantContactConfig}
      formConfig={formConfig}
      onSuccess={(data) => console.log('Success:', data)}
    />
  );
}

/**
 * HOW TO REFACTOR EXISTING DUALCONVERSION COMPONENT
 *
 * Before (complex, tightly coupled):
 * - 150+ lines of Constant Contact integration code
 * - Form state management mixed with business logic
 * - Hard to reuse or test
 *
 * After (modular, clean):
 * Replace the entire email form section (lines 297-439 in DualConversion.tsx) with:
 *
 * ```tsx
 * {selectedPath === 'digital' && (
 *   <motion.div
 *     key="digital-form"
 *     initial={{ opacity: 0, x: 50 }}
 *     animate={{ opacity: 1, x: 0 }}
 *     exit={{ opacity: 0, x: -50 }}
 *     className="bg-white rounded-2xl shadow-xl p-8"
 *   >
 *     <SignatureExperienceForm
 *       onComplete={onComplete}
 *       assessmentResults={assessmentResults}
 *       location={location}
 *     />
 *   </motion.div>
 * )}
 * ```
 *
 * Benefits:
 * ✅ 90% less code in DualConversion
 * ✅ Reusable across the application
 * ✅ Testable in isolation
 * ✅ Consistent Constant Contact integration
 * ✅ Easy to maintain and update
 */