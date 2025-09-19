/**
 * ConstantContactForm Component
 *
 * Reusable form component with Constant Contact integration.
 * Can be configured for different use cases and styling.
 */

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import useConstantContactIntegration, {
  type ConstantContactConfig,
  type ConstantContactSubmissionData
} from '@/hooks/useConstantContactIntegration';

// Field configuration interfaces
export interface FormField {
  name: keyof ConstantContactSubmissionData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export interface FormConfig {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Fields to display */
  fields: FormField[];
  /** Submit button text */
  submitText?: string;
  /** Loading button text */
  loadingText?: string;
  /** Success message */
  successMessage?: string;
  /** Show authentication prompts */
  showAuthPrompts?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Styling theme */
  theme?: 'default' | 'signature' | 'minimal' | 'signature-minimal';
}

export interface ConstantContactFormProps {
  /** Constant Contact configuration */
  constantContactConfig?: ConstantContactConfig;
  /** Form configuration */
  formConfig: FormConfig;
  /** Callback when form is successfully submitted */
  onSuccess?: (data: ConstantContactSubmissionData & { constantContactAdded: boolean }) => void;
  /** Callback when form submission fails */
  onError?: (error: string) => void;
  /** Additional form data to include in success callback */
  additionalData?: Record<string, unknown>;
}

// Default configurations
const DEFAULT_FORM_CONFIG: Partial<FormConfig> = {
  title: 'Join Our Mailing List',
  description: 'Stay updated with our latest news and exclusive offers.',
  submitText: 'Subscribe',
  loadingText: 'Subscribing...',
  successMessage: 'Successfully subscribed to our mailing list!',
  showAuthPrompts: true,
  theme: 'default'
};

const SIGNATURE_FORM_CONFIG: Partial<FormConfig> = {
  title: 'Access Your Exclusive Heritage Preview',
  description: 'Receive your formal consultation invitation and exclusive access to our master craftsman collection catalog.',
  submitText: 'Secure My Invitation',
  loadingText: 'Securing Access...',
  successMessage: 'Successfully added to heritage collection mailing list!',
  theme: 'signature'
};

// Theme styles
const THEME_STYLES = {
  default: {
    container: 'bg-white rounded-lg shadow-sm border p-6',
    title: 'text-xl font-semibold text-gray-900 mb-2',
    description: 'text-gray-600 mb-6',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    button: 'w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50',
    error: 'text-red-600 text-sm mt-1',
    success: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md',
    authPrompt: 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md'
  },
  signature: {
    container: 'bg-white rounded-2xl shadow-xl p-8',
    title: 'text-2xl font-bold text-gray-900 mb-2',
    description: 'text-gray-600 mb-6',
    input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    button: 'w-full bg-gradient-to-r from-kawai-red to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50',
    error: 'text-red-600 text-sm mt-1',
    success: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg',
    authPrompt: 'bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg'
  },
  minimal: {
    container: 'space-y-4',
    title: 'text-lg font-medium text-gray-900 mb-3',
    description: 'text-gray-600 text-sm mb-4',
    input: 'w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
    button: 'w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50',
    error: 'text-red-600 text-xs mt-1',
    success: 'bg-green-100 text-green-800 px-3 py-2 rounded text-sm',
    authPrompt: 'bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm'
  },
  'signature-minimal': {
    container: 'space-y-4',
    title: 'text-lg font-medium text-gray-900 mb-3',
    description: 'text-gray-600 text-sm mb-4',
    input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-kawai-red',
    button: 'w-full bg-kawai-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50',
    error: 'text-red-600 text-xs mt-1',
    success: 'bg-green-100 text-green-800 px-3 py-2 rounded text-sm',
    authPrompt: 'bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm'
  }
};

/**
 * Get predefined form configuration for signature experience
 */
export function getSignatureFormConfig(customFields?: Partial<FormField>[]): FormConfig {
  return {
    ...DEFAULT_FORM_CONFIG,
    ...SIGNATURE_FORM_CONFIG,
    fields: [
      { name: 'firstName' as keyof ConstantContactSubmissionData, label: 'First Name', type: 'text' as const, placeholder: 'John' },
      { name: 'lastName' as keyof ConstantContactSubmissionData, label: 'Last Name', type: 'text' as const, placeholder: 'Doe' },
      { name: 'email' as keyof ConstantContactSubmissionData, label: 'Email Address', type: 'email' as const, placeholder: 'john.doe@example.com', required: true },
      { name: 'phone' as keyof ConstantContactSubmissionData, label: 'Phone Number (optional)', type: 'tel' as const, placeholder: '(555) 123-4567' },
      {
        name: 'optInMarketing' as keyof ConstantContactSubmissionData,
        label: "I'd like to receive exclusive heritage collection updates and limited access opportunities",
        type: 'checkbox' as const
      }
    ].map(field => customFields?.find(custom => custom.name === field.name) ? { ...field, ...customFields.find(custom => custom.name === field.name) } : field)
  };
}

/**
 * Main ConstantContactForm component
 */
export const ConstantContactForm: React.FC<ConstantContactFormProps> = ({
  constantContactConfig,
  formConfig,
  onSuccess,
  onError,
  additionalData
}) => {
  const finalFormConfig = { ...DEFAULT_FORM_CONFIG, ...formConfig };
  const styles = THEME_STYLES[finalFormConfig.theme || 'default'];

  // Constant Contact integration
  const {
    isSubmitting,
    submitError,
    submitSuccess,
    isAuthenticated,
    submitToConstantContact,
    clearError,
    clearSuccess,
    authenticate
  } = useConstantContactIntegration(constantContactConfig);

  // Build validation schema that matches ConstantContactSubmissionData interface
  const emailField = finalFormConfig.fields.find(f => f.name === 'email');
  const firstNameField = finalFormConfig.fields.find(f => f.name === 'firstName');
  const lastNameField = finalFormConfig.fields.find(f => f.name === 'lastName');
  const phoneField = finalFormConfig.fields.find(f => f.name === 'phone');

  // Create schema based on field requirements
  const schema = z.object({
    firstName: firstNameField?.required
      ? z.string().min(1, 'First name is required')
      : z.string().optional(),
    lastName: lastNameField?.required
      ? z.string().min(1, 'Last name is required')
      : z.string().optional(),
    // Email is always required in ConstantContactSubmissionData interface
    email: emailField?.required
      ? z.string().min(1, 'Email is required').email('Please enter a valid email address')
      : z.string().email('Please enter a valid email address'),
    phone: phoneField?.required
      ? z.string().min(1, 'Phone number is required')
      : z.string().optional(),
    optInMarketing: z.boolean().optional(),
  });

  // Form management - let TypeScript infer types from schema
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange' as const
  });

  // Handle form submission
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    // Convert form data to ConstantContactSubmissionData
    const submissionData: ConstantContactSubmissionData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      optInMarketing: data.optInMarketing,
    };
    try {
      clearError();
      clearSuccess();

      // Submit to Constant Contact
      const constantContactAdded = await submitToConstantContact(submissionData);

      // Call success callback
      if (onSuccess) {
        onSuccess({
          ...submissionData,
          constantContactAdded,
          ...additionalData
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Form submission failed';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Handle errors
  useEffect(() => {
    if (submitError && onError) {
      onError(submitError);
    }
  }, [submitError, onError]);

  return (
    <div className={cn(styles.container, finalFormConfig.className)}>
      {/* Header */}
      {finalFormConfig.title && (
        <h3 className={styles.title}>
          {finalFormConfig.title}
        </h3>
      )}

      {finalFormConfig.description && (
        <p className={styles.description}>
          {finalFormConfig.description}
        </p>
      )}

      {/* Status Messages */}
      {!isAuthenticated && finalFormConfig.showAuthPrompts && (
        <div className={cn(styles.authPrompt, 'mb-4')}>
          <p className="text-sm">
            📧 To receive updates:{' '}
            <button
              onClick={authenticate}
              className="underline hover:no-underline font-medium"
            >
              Connect to our mailing system
            </button>
          </p>
        </div>
      )}

      {submitSuccess && (
        <div className={cn(styles.success, 'mb-4')}>
          <p className="text-sm flex items-center">
            ✓ {finalFormConfig.successMessage}
          </p>
        </div>
      )}

      {submitError && (
        <div className={cn(styles.success.replace('green', 'red'), 'mb-4')}>
          <p className="text-sm">
            ⚠️ {submitError}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {finalFormConfig.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.required && <span className="text-red-500 mr-1">*</span>}
              {field.label}
            </label>

            {field.type === 'checkbox' ? (
              <label className="flex items-center space-x-2">
                <input
                  {...form.register(field.name)}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {field.description || field.label}
                </span>
              </label>
            ) : (
              <input
                {...form.register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
                className={styles.input}
              />
            )}

            {form.formState.errors[field.name] && (
              <p className={styles.error}>
                {form.formState.errors[field.name]?.message}
              </p>
            )}

            {field.description && field.type !== 'checkbox' && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.button}
        >
          {isSubmitting ? finalFormConfig.loadingText : finalFormConfig.submitText}
        </button>
      </form>
    </div>
  );
};

export default ConstantContactForm;