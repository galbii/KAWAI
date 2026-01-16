/**
 * Centralized hooks barrel export
 *
 * All custom React hooks should be placed in this directory and exported from here.
 * Import hooks using: import { useHookName } from '@/hooks'
 */

// Audio
export { useAudioPlayer } from './useAudioPlayer'

// Analytics & Tracking
export { default as useCalendlyTracking } from './useCalendlyTracking'
export type { CalendlyPrefillData, CalendlyTrackingConfig } from './useCalendlyTracking'
export { usePageTracking } from './usePageTracking'

// Constant Contact Integration
export { useConstantContact, useConstantContactForm } from './useConstantContact'
export type { ContactList, CreateContactData, UseConstantContactState, UseConstantContactActions } from './useConstantContact'
export { useConstantContactAuth, useConstantContactAuthStatus } from './useConstantContactAuth'
export type { AuthStatus, UseConstantContactAuthResult } from './useConstantContactAuth'
export { useConstantContactIntegration } from './useConstantContactIntegration'
export type { ConstantContactConfig, ConstantContactSubmissionData, ConstantContactIntegrationState, ConstantContactIntegrationActions } from './useConstantContactIntegration'

// Animation & Scroll
export { useScrollAnimation, useStaggeredAnimation, fadeUpClass, slideInClass, scaleInClass } from './useScrollAnimation'
export { useScrollDirection } from './useScrollDirection'
export type { ScrollDirection } from './useScrollDirection'
export { useIntersectionAnimation } from './useIntersectionAnimation'

// UI State Management
export { useModal } from './useModal'
export type { UseModalOptions, UseModalReturn } from './useModal'
