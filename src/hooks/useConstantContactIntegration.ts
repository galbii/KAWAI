/**
 * useConstantContactIntegration Hook
 *
 * Modular hook for Constant Contact integration that can be used across the application.
 * Handles list management, contact creation, and error handling.
 */

'use client';

import { useState, useCallback } from 'react';
import { useConstantContact } from './useConstantContact';
import {
  ensureShowroomKawaiList,
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
 * Custom hook for Constant Contact integration
 */
export function useConstantContactIntegration(config: ConstantContactConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Constant Contact hook
  const {
    createContact,
    isAuthenticated,
    lists,
    loadLists,
    isLoadingLists,
    submitError: ccSubmitError,
    startOAuthFlow
  } = useConstantContact();

  /**
   * Submit contact data to Constant Contact
   */
  const submitToConstantContact = useCallback(async (
    data: ConstantContactSubmissionData
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Check authentication
      if (!isAuthenticated) {
        if (finalConfig.showAuthPrompts) {
          setSubmitError('Please authenticate with Constant Contact first');
        }
        console.log('Constant Contact not authenticated, skipping submission');
        return false;
      }

      // Determine target list
      let targetListId = finalConfig.targetListId;

      if (!targetListId) {
        if (finalConfig.targetList === 'SHOWROOM KAWAI') {
          // Use the existing SHOWROOM KAWAI list logic
          const listResult = await ensureShowroomKawaiList(lists, loadLists);

          if (listResult.listId) {
            targetListId = listResult.listId;
          } else {
            const errorMsg = listResult.error || 'Unable to access target mailing list';
            console.error('List access error:', errorMsg);
            setSubmitError(errorMsg);
            return false;
          }
        } else {
          // Generic list lookup for other lists
          const targetList = lists.find(list =>
            list.label.toLowerCase() === finalConfig.targetList?.toLowerCase()
          );

          if (targetList) {
            targetListId = targetList.value;
          } else {
            setSubmitError(`Unable to find list: ${finalConfig.targetList}`);
            return false;
          }
        }
      }

      if (!targetListId) {
        setSubmitError('No target list available for contact submission');
        return false;
      }

      // Format contact data
      const signatureContactData: SignatureContactData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        optInMarketing: data.optInMarketing
      };

      const contactData = formatSignatureContact(signatureContactData, targetListId);

      console.log('Submitting contact to Constant Contact:', {
        email: contactData.email_address,
        listId: targetListId,
        listName: finalConfig.targetList
      });

      // Submit to Constant Contact
      const success = await createContact(contactData);

      if (success) {
        setSubmitSuccess(true);
        console.log('Successfully added contact to Constant Contact');
        return true;
      } else {
        const errorMsg = ccSubmitError || 'Failed to add contact to mailing list';
        setSubmitError(errorMsg);
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
    isAuthenticated,
    lists,
    loadLists,
    createContact,
    ccSubmitError,
    finalConfig
  ]);

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
    isAuthenticated,
    lists,
    isLoadingLists
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