// ES60 Landing Page Components
// Complete modular component system for the ES60 campaign

// ===== VISUAL & INTERACTIVE COMPONENTS (Agent 1) =====
export { ES60Hero } from './ES60Hero';
export { ES60SoundDemo } from './ES60SoundDemo';
export { ES60Features } from './ES60Features';

// ===== CONTENT & MESSAGING COMPONENTS (Agent 2) =====
export { ES60ValueProposition } from './ES60ValueProposition';
export { ES60SocialProof } from './ES60SocialProof';
export { ES60Specifications } from './ES60Specifications';

// ===== CONVERSION & NAVIGATION COMPONENTS (Agent 3) =====
export { ES60Layout, useSectionAnalytics } from './ES60Layout';
export { ES60CTA, FloatingCTA } from './ES60CTA';
export {
  ES60LoadingStates,
  ProgressiveImage,
  ComponentLoadingBoundary
} from './ES60LoadingStates';
export {
  ES60ErrorHandling,
  SuccessNotification,
  useNetworkErrorHandler
} from './ES60ErrorHandling';

// ===== ERROR BOUNDARIES & TESTING =====
export { ES60ErrorBoundary } from './ES60ErrorBoundary';
export { ES60IntegrationTest } from './ES60IntegrationTest';

// ===== TYPES & UTILITIES =====
export type * from './types';

// Legacy landing content (for reference)
export { ES60LandingContent } from './ES60LandingContent';

// ===== CINEMATIC PRESENTATION SYSTEM =====
export { ES60CinematicPresentation } from './ES60CinematicPresentation';
export { CinematicTrigger } from './CinematicTrigger';

// ===== ENHANCED INTERACTIVE PRESENTATION SYSTEM =====
export { EnhancedCinematicPresentation } from './EnhancedCinematicPresentation';
export { CinematicNavigation } from './CinematicNavigation';
export { InteractiveProductExplorer } from './InteractiveProductExplorer';
export { 
  AccessibilityProvider, 
  AccessibilityPanel, 
  useAccessibility 
} from './AccessibilityEnhancer';
export { MobileTouchInteractions } from './MobileTouchInteractions';
export { AdvancedInteractivityOverlays } from './AdvancedInteractivityOverlays';

// Type definitions for external consumption
export interface ES60ComponentProps {
  className?: string;
  enableAnalytics?: boolean;
  variant?: 'page' | 'section' | 'component';
}

export interface ConversionTrackingEvent {
  action: string;
  category: 'ES60';
  label: string;
  value?: number;
}

// Campaign configuration
export const ES60_CAMPAIGN_CONFIG = {
  price: 499,
  targetCPA: {
    adultBeginners: 125,
    parents: 100,
    rediscoveringAdults: 150,
    collegeStudents: 80
  },
  colors: {
    primaryBg: '#FAF8F5',
    secondaryBg: '#F5F2ED',
    accentEarth: '#8B7355',
    deepEarth: '#5D4E37',
    sageGreen: '#9CAF88',
    textPrimary: '#3C3530'
  },
  analytics: {
    conversionGoal: 'ES60_DEMO_REQUEST',
    secondaryGoals: ['CONTACT_FORM', 'PHONE_CALL', 'STORE_VISIT']
  }
} as const;