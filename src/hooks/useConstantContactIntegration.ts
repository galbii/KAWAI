/**
 * useConstantContactIntegration Hook
 *
 * Modular hook for Constant Contact integration that can be used across the application.
 * Handles list management, contact creation, error handling, and automatic authentication.
 *
 * Features:
 * - Automatic token refresh (99% of cases - handled silently by backend)
 * - OAuth redirect only when refresh token expires (rare - requires user interaction)
 * - Returns user to original page after OAuth with automatic submission retry
 * - Seamless user experience with minimal interruption
 *
 * Flow:
 * 1. Submit → Backend attempts automatic token refresh
 * 2. If refresh succeeds → Contact created ✅
 * 3. If refresh fails → Redirect to OAuth → Return with retry → Contact created ✅
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useConstantContact } from './useConstantContact';
import { useConstantContactAuth } from './useConstantContactAuth';
import {
  ensureShowroomKawaiList,
  ensureListExists,
  formatSignatureContact,
  type SignatureContactData
} from '@/lib/constantcontact/signature-utils';

export interface ConstantContactConfig {
  /** Target list name or 'SHOWROOM KAWAI' for the signature experience */
  targetList?: string;
  /** Custom list ID if you know it (bypasses list search) */
  targetListId?: string;
  /** Whether to create the list if it doesn't exist */
  createListIfMissing?: boolean;
  /** Custom list description for creation */
  listDescription?: string;
  /** Whether to show authentication prompts */
  showAuthPrompts?: boolean;
}

export interface ConstantContactSubmissionData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  optInMarketing?: boolean;
}

export interface ConstantContactIntegrationState {
  /** Whether currently submitting to Constant Contact */
  isSubmitting: boolean;
  /** Any error that occurred during submission */
  submitError: string | null;
  /** Whether submission was successful */
  submitSuccess: boolean;
  /** Whether Constant Contact is authenticated */
  isAuthenticated: boolean;
  /** Available contact lists */
  lists: any[];
  /** Whether lists are currently loading */
  isLoadingLists: boolean;
  /** Whether just returned from successful OAuth authentication */
  authSuccessShown: boolean;
}

export interface ConstantContactIntegrationActions {
  /** Submit contact data to Constant Contact */
  submitToConstantContact: (data: ConstantContactSubmissionData) => Promise<boolean>;
  /** Clear error state */
  clearError: () => void;
  /** Clear success state */
  clearSuccess: () => void;
  /** Reset all states */
  reset: () => void;
  /** Start OAuth flow for authentication */
  authenticate: () => void;
  /** Refresh contact lists */
  refreshLists: () => Promise<void>;
}

const DEFAULT_CONFIG: ConstantContactConfig = {
  targetList: 'SHOWROOM KAWAI',
  createListIfMissing: true,
  listDescription: 'Heritage Collection Preview - Premium piano showroom inquiries',
  showAuthPrompts: true
};

/**
 * Custom hook for Constant Contact integration with automatic authentication
 */
export function useConstantContactIntegration(config: ConstantContactConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<ConstantContactSubmissionData | null>(null);
  const [authSuccessShown, setAuthSuccessShown] = useState(false);

  // Ref to store the submission function for retry
  const retrySubmissionRef = useRef<(() => Promise<void>) | null>(null);

  // Constant Contact hooks
  const {
    isAuthenticated,
    lists,
    loadLists,
    isLoadingLists,
    startOAuthFlow
  } = useConstantContact();

  // Authentication hook with auto-redirect disabled (we'll handle it manually)
  const {
    isChecking: isCheckingAuth,
    needsReauth,
    redirectToAuth
  } = useConstantContactAuth({
    autoRedirect: false, // We'll handle redirect manually for better UX
    checkOnMount: true
  });

  // Handle successful authentication return
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth_success') === 'true' && !authSuccessShown) {
        setAuthSuccessShown(true);
        console.log('Constant Contact: Authentication successful, ready to submit');

        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);

        // If there's a pending submission and retry function, execute it
        if (pendingSubmission && retrySubmissionRef.current) {
          console.log('Constant Contact: Retrying pending submission after auth');
          setTimeout(() => {
            retrySubmissionRef.current?.();
            setPendingSubmission(null);
            retrySubmissionRef.current = null;
          }, 500);
        }
      }
    }
  }, [authSuccessShown, pendingSubmission]);

  /**
   * Core submission logic (used by both initial submission and retry)
   * Backend automatically handles token refresh via getValidAccessToken()
   */
  const executeSubmission = useCallback(async (
    data: ConstantContactSubmissionData
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Note: We don't check authentication here - the backend will automatically
      // refresh tokens if needed via getValidAccessToken(). We only handle
      // reauth_required responses if refresh token is expired.

      // Determine target list
      let targetListId = finalConfig.targetListId;

      if (!targetListId) {
        if (finalConfig.targetList === 'SHOWROOM KAWAI') {
          // Use the existing SHOWROOM KAWAI list logic (has special fallback handling)
          const listResult = await ensureShowroomKawaiList(lists, loadLists);

          if (listResult.listId) {
            targetListId = listResult.listId;
          } else {
            const errorMsg = listResult.error || 'Unable to access target mailing list';
            console.error('List access error:', errorMsg);
            setSubmitError(errorMsg);
            return false;
          }
        } else if (finalConfig.targetList) {
          // Generic list handling for ALL other lists (including TSU2025)
          // This uses the enhanced ensureListExists function with API search + creation
          console.log(`Constant Contact: Ensuring list exists: "${finalConfig.targetList}"`);

          const listResult = await ensureListExists(
            finalConfig.targetList,
            finalConfig.listDescription || `${finalConfig.targetList} - Contact list`,
            lists,
            loadLists
          );

          if (listResult.listId) {
            targetListId = listResult.listId;
            console.log(`Constant Contact: Successfully found/created list "${finalConfig.targetList}" with ID:`, targetListId);
          } else {
            const errorMsg = listResult.error || `Unable to find or create list: ${finalConfig.targetList}`;
            console.error('List access error:', errorMsg);
            setSubmitError(errorMsg);
            return false;
          }
        } else {
          setSubmitError('No target list specified');
          return false;
        }
      }

      if (!targetListId) {
        setSubmitError('No target list available for contact submission');
        return false;
      }

      // Format contact data
      const signatureContactData: SignatureContactData = {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        email: data.email,
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.optInMarketing !== undefined && { optInMarketing: data.optInMarketing })
      };

      const contactData = formatSignatureContact(signatureContactData, targetListId);

      console.log('Submitting contact to Constant Contact:', {
        email: contactData.email_address,
        listId: targetListId,
        listName: finalConfig.targetList
      });

      // Submit to Constant Contact - backend handles automatic token refresh
      const response = await fetch('/api/constant-contact/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      // Check if reauth is required (refresh token expired)
      if (result.reauth_required && result.auth_url) {
        console.log('Constant Contact: Refresh token expired, initiating OAuth flow...');

        // Store submission for retry after auth
        setPendingSubmission(data);

        // Create retry function
        retrySubmissionRef.current = async () => {
          console.log('Executing retry submission after re-authentication...');
          await executeSubmission(data);
        };

        if (finalConfig.showAuthPrompts) {
          setSubmitError('Re-authentication required. Redirecting...');
        }

        // Redirect to OAuth flow
        setTimeout(() => {
          redirectToAuth();
        }, 1000);

        return false;
      }

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        console.log('Successfully added contact to Constant Contact');
        return true;
      } else {
        const errorMsg = result.error || 'Failed to add contact to mailing list';
        setSubmitError(typeof errorMsg === 'string' ? errorMsg : errorMsg.error_message || 'Unknown error');
        return false;
      }

    } catch (error) {
      const errorMsg = 'Failed to process mailing list signup';
      setSubmitError(errorMsg);
      console.error('Constant Contact submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    lists,
    loadLists,
    finalConfig,
    redirectToAuth
  ]);

  /**
   * Submit contact data to Constant Contact
   *
   * Backend automatically handles token refresh. Only redirects to OAuth
   * if the backend returns reauth_required (when refresh token is expired).
   */
  const submitToConstantContact = useCallback(async (
    data: ConstantContactSubmissionData
  ): Promise<boolean> => {
    // Always attempt submission - backend will handle token refresh automatically
    // via getValidAccessToken() which tries to refresh before returning error
    return await executeSubmission(data);
  }, [executeSubmission]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setSubmitError(null);
  }, []);

  /**
   * Clear success state
   */
  const clearSuccess = useCallback(() => {
    setSubmitSuccess(false);
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  /**
   * Start authentication flow
   */
  const authenticate = useCallback(() => {
    startOAuthFlow();
  }, [startOAuthFlow]);

  /**
   * Refresh contact lists
   */
  const refreshLists = useCallback(async () => {
    await loadLists();
  }, [loadLists]);

  // Return state and actions
  const state: ConstantContactIntegrationState = {
    isSubmitting,
    submitError,
    submitSuccess,
    isAuthenticated: isAuthenticated && !needsReauth,
    lists,
    isLoadingLists: isLoadingLists || isCheckingAuth,
    authSuccessShown
  };

  const actions: ConstantContactIntegrationActions = {
    submitToConstantContact,
    clearError,
    clearSuccess,
    reset,
    authenticate,
    refreshLists
  };

  return {
    ...state,
    ...actions,
    config: finalConfig
  };
}

export default useConstantContactIntegration;