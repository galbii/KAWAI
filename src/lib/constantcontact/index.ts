/**
 * Constant Contact Integration Index
 *
 * Centralized exports for all Constant Contact functionality
 */

// Core authentication and client
export {
  ConstantContactAuth,
  createConstantContactAuth,
  MemoryTokenStorage,
  type ConstantContactTokens,
  type ConstantContactAuthConfig,
  type TokenStorage
} from './auth';

// API client
export {
  ConstantContactClient,
  createConstantContactClient,
  type ConstantContactError,
  type ApiResponse,
  type RateLimitInfo
} from './client';

// List management
export {
  ConstantContactListManager,
  type ContactList,
  type ListsResponse,
  type ListMembership,
  type Contact,
  type CreateContactRequest
} from './lists';

// Re-export hooks and components for convenience
export { useConstantContact, useConstantContactForm } from '@/hooks/useConstantContact';
export { ConstantContactForm } from '@/components/forms/ConstantContactForm';