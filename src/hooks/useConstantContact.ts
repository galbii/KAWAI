/**
 * useConstantContact Hook
 *
 * React hook for managing Constant Contact integration state and operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ContactList {
  value: string;
  label: string;
  description?: string;
}

export interface CreateContactData {
  email_address: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  list_ids: string[];
}

export interface UseConstantContactState {
  // Authentication state
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;

  // Lists state
  lists: ContactList[];
  isLoadingLists: boolean;
  listsError: string | null;

  // Contact operations state
  isSubmitting: boolean;
  submitError: string | null;
  lastSubmitResult: any | null;
}

export interface UseConstantContactActions {
  // Authentication
  startOAuthFlow: () => void;
  clearAuthError: () => void;

  // Lists management
  loadLists: () => Promise<void>;
  refreshLists: () => Promise<void>;
  clearListsError: () => void;

  // Contact operations
  createContact: (data: CreateContactData) => Promise<boolean>;
  clearSubmitError: () => void;
  clearLastResult: () => void;

  // Utility
  reset: () => void;
}

export function useConstantContact(): UseConstantContactState & UseConstantContactActions {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [lists, setLists] = useState<ContactList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [listsError, setListsError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmitResult, setLastSubmitResult] = useState<any | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load lists when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadLists();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsAuthenticating(true);

      // Check authentication status using dedicated endpoint
      const response = await fetch('/api/constantcontact/auth/status');
      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(data.authenticated);
        if (!data.authenticated) {
          setAuthError(null); // Clear any previous errors for normal unauthenticated state
        }
      } else {
        setIsAuthenticated(false);
        setAuthError(data.error || 'Failed to verify authentication status');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setAuthError(error instanceof Error ? error.message : 'Authentication check failed');
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const startOAuthFlow = useCallback(() => {
    setAuthError(null);
    // Redirect to OAuth authorization endpoint
    window.location.href = '/api/auth/constantcontact/authorize';
  }, []);

  const loadLists = useCallback(async () => {
    try {
      setIsLoadingLists(true);
      setListsError(null);

      const response = await fetch('/api/constantcontact/lists?format=ui');
      const data = await response.json();

      if (response.ok && data.success) {
        setLists(data.data || []);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setLists([]);
        setListsError('Authentication required');
      } else {
        setListsError(data.error || 'Failed to load lists');
      }
    } catch (error) {
      setListsError(error instanceof Error ? error.message : 'Network error');
    } finally {
      setIsLoadingLists(false);
    }
  }, []);

  const refreshLists = useCallback(async () => {
    await loadLists();
  }, [loadLists]);

  const createContact = useCallback(async (data: CreateContactData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setLastSubmitResult(null);

      const response = await fetch('/api/constantcontact/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLastSubmitResult(result.data);
        return true;
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setSubmitError('Authentication required');
        return false;
      } else {
        const error = result.error || 'Failed to create contact';
        setSubmitError(typeof error === 'string' ? error : error.error_message || 'Unknown error');
        return false;
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Network error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Error clearing functions
  const clearAuthError = useCallback(() => setAuthError(null), []);
  const clearListsError = useCallback(() => setListsError(null), []);
  const clearSubmitError = useCallback(() => setSubmitError(null), []);
  const clearLastResult = useCallback(() => setLastSubmitResult(null), []);

  // Reset all state
  const reset = useCallback(() => {
    setIsAuthenticated(false);
    setAuthError(null);
    setLists([]);
    setListsError(null);
    setSubmitError(null);
    setLastSubmitResult(null);
  }, []);

  return {
    // State
    isAuthenticated,
    isAuthenticating,
    authError,
    lists,
    isLoadingLists,
    listsError,
    isSubmitting,
    submitError,
    lastSubmitResult,

    // Actions
    startOAuthFlow,
    clearAuthError,
    loadLists,
    refreshLists,
    clearListsError,
    createContact,
    clearSubmitError,
    clearLastResult,
    reset
  };
}

// Utility hook for simplified contact form usage
export function useConstantContactForm() {
  const constantContact = useConstantContact();

  const submitForm = useCallback(async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    listIds: string[];
  }) => {
    const contactData: CreateContactData = {
      email_address: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phone,
      list_ids: formData.listIds
    };

    return await constantContact.createContact(contactData);
  }, [constantContact]);

  return {
    ...constantContact,
    submitForm
  };
}