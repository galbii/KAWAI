/**
 * Constant Contact Demo Page
 *
 * Testing interface for Constant Contact integration with OAuth flow,
 * list management, and contact form testing
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ConstantContactForm } from '@/components/forms/ConstantContactForm';
import { useConstantContact } from '@/hooks/useConstantContact';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserGroupIcon,
  EnvelopeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface OAuthParams {
  success: string | null;
  error: string | null;
  description: string | null;
}

function ConstantContactDemoContent({ oauthParams }: { oauthParams: OAuthParams }) {
  const {
    isAuthenticated,
    isAuthenticating,
    authError,
    lists,
    isLoadingLists,
    listsError,
    isSubmitting,
    submitError,
    lastSubmitResult,
    startOAuthFlow,
    loadLists,
    clearAuthError,
    clearListsError,
    clearSubmitError,
    reset
  } = useConstantContact();

  const [pageStatus, setPageStatus] = useState<'loading' | 'ready'>('loading');

  // Handle OAuth callback parameters
  useEffect(() => {
    if (oauthParams.success === 'true') {
      // OAuth success - the hook will automatically detect authentication
      console.log('OAuth flow completed successfully');
    } else if (oauthParams.error) {
      console.error('OAuth error:', oauthParams.error, oauthParams.description);
    }

    setPageStatus('ready');
  }, [oauthParams]);

  const handleFormSuccess = (data: any) => {
    console.log('Form submission successful:', data);
  };

  const handleFormError = (error: string) => {
    console.error('Form submission error:', error);
  };

  if (pageStatus === 'loading' || isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Constant Contact demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Constant Contact Integration Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test OAuth authentication, list management, and contact form functionality
          </p>
        </div>

        {/* OAuth Status Messages */}
        <div className="mb-8">
          {oauthParams.success === 'true' && (
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  OAuth Authentication Successful
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You have been successfully authenticated with Constant Contact.
                </p>
              </div>
            </div>
          )}

          {oauthParams.error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  OAuth Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {oauthParams.description || oauthParams.error}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Cog6ToothIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Authentication
              </h2>
            </div>

            <div className="space-y-4">
              {/* Auth Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <span className={`text-sm font-medium ${
                  isAuthenticated
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>

              {/* Auth Error */}
              {authError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{authError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAuthError}
                    className="mt-2"
                  >
                    Clear Error
                  </Button>
                </div>
              )}

              {/* Auth Actions */}
              <div className="space-y-2">
                {!isAuthenticated ? (
                  <Button
                    onClick={startOAuthFlow}
                    className="w-full"
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </>
                    ) : (
                      'Start OAuth Flow'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="w-full"
                  >
                    Reset Authentication
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Lists Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Contact Lists
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadLists}
                disabled={!isAuthenticated || isLoadingLists}
              >
                <ArrowPathIcon className={`w-4 h-4 ${isLoadingLists ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Lists Error */}
              {listsError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{listsError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearListsError}
                    className="mt-2"
                  >
                    Clear Error
                  </Button>
                </div>
              )}

              {/* Lists Content */}
              {!isAuthenticated ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Please authenticate first to view contact lists.
                </p>
              ) : isLoadingLists ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center space-x-3 p-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              ) : lists.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No contact lists found.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lists.map((list) => (
                    <div key={list.value} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {list.label}
                      </div>
                      {list.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {list.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form Panel */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <EnvelopeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Form Test
            </h2>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Please authenticate first to test the contact form.
              </p>
              <Button onClick={startOAuthFlow}>
                Start OAuth Flow
              </Button>
            </div>
          ) : (
            <div>
              <ConstantContactForm
                formConfig={{
                  title: '', // No title since showTitle was false
                  fields: [
                    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
                    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com', required: true },
                    { name: 'phone', label: 'Phone Number (optional)', type: 'tel', placeholder: '(555) 123-4567' },
                  ],
                  className: "max-w-none"
                }}
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />

              {/* Submit Results */}
              {submitError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSubmitError}
                    className="mt-2"
                  >
                    Clear Error
                  </Button>
                </div>
              )}

              {lastSubmitResult && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    Last Submit Result:
                  </h4>
                  <pre className="text-xs text-green-700 dark:text-green-300 overflow-x-auto">
                    {JSON.stringify(lastSubmitResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Testing Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>Click "Start OAuth Flow" to authenticate with Constant Contact</li>
            <li>You'll be redirected to Constant Contact for authorization</li>
            <li>After successful authorization, you'll return here with access to lists</li>
            <li>Use the contact form to test creating contacts in your lists</li>
            <li>Check the results and any error messages for debugging</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function ConstantContactDemoWrapper() {
  const searchParams = useSearchParams();

  const oauthParams: OAuthParams = {
    success: searchParams.get('success'),
    error: searchParams.get('error'),
    description: searchParams.get('description')
  };

  return <ConstantContactDemoContent oauthParams={oauthParams} />;
}

function ConstantContactDemoFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading Constant Contact demo...</p>
      </div>
    </div>
  );
}

export default function ConstantContactDemo() {
  return (
    <Suspense fallback={<ConstantContactDemoFallback />}>
      <ConstantContactDemoWrapper />
    </Suspense>
  );
}