/**
 * Constant Contact Form Component
 *
 * A form for capturing leads and adding them to Constant Contact lists
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Form validation schema
const constantContactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  listIds: z.array(z.string()).min(1, 'Please select at least one list')
});

type ConstantContactFormData = z.infer<typeof constantContactFormSchema>;

interface ContactList {
  value: string;
  label: string;
  description?: string;
}

interface ConstantContactFormProps {
  className?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  preSelectedLists?: string[];
  showTitle?: boolean;
  title?: string;
  submitButtonText?: string;
}

export function ConstantContactForm({
  className = '',
  onSuccess,
  onError,
  preSelectedLists = [],
  showTitle = true,
  title = 'Join Our Mailing List',
  submitButtonText = 'Subscribe'
}: ConstantContactFormProps) {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listsLoading, setListsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ConstantContactFormData>({
    resolver: zodResolver(constantContactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      listIds: preSelectedLists
    }
  });

  const selectedLists = watch('listIds');

  // Load available lists on component mount
  useEffect(() => {
    loadLists();
  }, []);

  // Set pre-selected lists when they change
  useEffect(() => {
    if (preSelectedLists.length > 0) {
      setValue('listIds', preSelectedLists);
    }
  }, [preSelectedLists, setValue]);

  const loadLists = async () => {
    try {
      setListsLoading(true);
      const response = await fetch('/api/constantcontact/lists?format=ui');
      const data = await response.json();

      if (response.ok && data.success) {
        setLists(data.data || []);
      } else {
        console.error('Failed to load lists:', data.error);
        setLists([]);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      setLists([]);
    } finally {
      setListsLoading(false);
    }
  };

  const onSubmit = async (data: ConstantContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/constantcontact/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phone,
          list_ids: data.listIds
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        reset();
        onSuccess?.(result.data);
      } else {
        const error = result.error || 'Failed to subscribe';
        setErrorMessage(typeof error === 'string' ? error : error.error_message || 'Unknown error');
        setSubmitStatus('error');
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error occurred';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      onError?.(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleListToggle = (listId: string) => {
    const currentLists = selectedLists || [];
    const isSelected = currentLists.includes(listId);

    if (isSelected) {
      setValue('listIds', currentLists.filter(id => id !== listId));
    } else {
      setValue('listIds', [...currentLists, listId]);
    }
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {showTitle && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay updated with our latest news and piano offerings
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              {...register('firstName')}
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              className="pl-10"
              aria-invalid={errors.firstName ? 'true' : 'false'}
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              {...register('lastName')}
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              className="pl-10"
              aria-invalid={errors.lastName ? 'true' : 'false'}
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              {...register('phone')}
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="pl-10"
            />
          </div>
        </div>

        {/* List Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subscribe to *
          </label>

          {listsLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ) : lists.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              No mailing lists available. Please complete OAuth authentication first.
            </p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
              {lists.map((list) => (
                <label key={list.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLists?.includes(list.value) || false}
                    onChange={() => handleListToggle(list.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {list.label}
                    </div>
                    {list.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {list.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          {errors.listIds && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.listIds.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || lists.length === 0}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Subscribing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Successfully subscribed! Thank you for joining our mailing list.
            </p>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-200">
              {errorMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}