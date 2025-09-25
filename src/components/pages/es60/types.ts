// TypeScript interfaces for ES60 landing page components

export interface ValueCarouselItem {
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

export interface AudioControlState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export interface WaveformProps {
  isPlaying: boolean;
  amplitude: number;
  color: string;
}

export interface FeatureHotspot {
  id: string;
  title: string;
  description: string;
  benefit: string;
  demographic: string;
  position: {
    x: number; // Percentage from left
    y: number; // Percentage from top
  };
  icon: React.ReactNode;
}

export interface TooltipProps {
  hotspot: FeatureHotspot;
  onClose: () => void;
  position: { x: number; y: number };
}

export interface ES60ComponentProps {
  className?: string;
  id?: string;
}

// Animation variants type for framer-motion
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: (delay?: number) => {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition: {
      duration: number;
      delay: number;
      ease?: string;
    };
  };
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

// Audio sample configuration
export interface AudioSample {
  url: string;
  title: string;
  description: string;
}

export interface AudioSamples {
  standard: string;
  es60: string;
}

// ES60 color palette type
export interface ES60ColorPalette {
  primaryBackground: string;
  secondaryBackground: string;
  accentEarth: string;
  deepEarth: string;
  sageGreen: string;
  warmGray: string;
  textPrimary: string;
  textSecondary: string;
}

// Default ES60 earthy color palette
export const ES60_COLORS: ES60ColorPalette = {
  primaryBackground: '#FAF8F5',
  secondaryBackground: '#F5F2ED',
  accentEarth: '#8B7355',
  deepEarth: '#5D4E37',
  sageGreen: '#9CAF88',
  warmGray: '#A8A5A0',
  textPrimary: '#3C3530',
  textSecondary: '#6B645C'
};

// Component error types
export class ES60ComponentError extends Error {
  constructor(
    message: string,
    public componentName: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ES60ComponentError';
  }
}