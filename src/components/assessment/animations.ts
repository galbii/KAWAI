/**
 * Assessment Animation Configurations
 * Centralized animation definitions for consistent, elegant motion design
 */

import type { Variants, Transition } from 'framer-motion'

// Timing configurations for consistent feel
export const TIMING = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8
} as const

export const EASING = {
  default: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.46, 0.45, 0.94],
  spring: { type: 'spring', stiffness: 300, damping: 30 }
} as const

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    x: 50, 
    scale: 0.98 
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.default
    }
  },
  exit: { 
    opacity: 0, 
    x: -50, 
    scale: 1.02,
    transition: {
      duration: TIMING.normal,
      ease: EASING.default
    }
  }
}

// Question entrance animations
export const questionEntrance: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth,
      staggerChildren: 0.1
    }
  }
}

// Option button animations
export const optionButton: Variants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1 
  },
  hover: { 
    scale: 1.02,
    y: -2,
    transition: { 
      duration: TIMING.fast,
      ease: EASING.default
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1 
    }
  },
  selected: {
    scale: 1,
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
    transition: {
      duration: TIMING.normal,
      ease: EASING.bounce
    }
  }
}

// Progress indicator animations
export const progressDot: Variants = {
  inactive: { 
    scale: 1, 
    opacity: 0.4,
    backgroundColor: '#d1d5db'
  },
  active: { 
    scale: 1.2, 
    opacity: 1,
    backgroundColor: '#3b82f6',
    transition: {
      duration: TIMING.normal,
      ease: EASING.bounce
    }
  },
  completed: { 
    scale: 1, 
    opacity: 1,
    backgroundColor: '#10b981',
    transition: {
      duration: TIMING.normal,
      ease: EASING.default
    }
  }
}

// Progress bar fill animation
export const progressFill: Variants = {
  initial: { 
    width: '0%' 
  },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth
    }
  })
}

// Header text animations
export const headerText: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      delay: delay * 0.1,
      ease: EASING.default
    }
  })
}

// Navigation button animations
export const navigationButton: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: { 
      duration: TIMING.fast 
    }
  },
  tap: { 
    scale: 0.95 
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
    cursor: 'not-allowed'
  }
}

// Welcome message animation
export const welcomeMessage: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: -30 
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: TIMING.verySlow,
      ease: EASING.bounce,
      delay: 0.2
    }
  }
}

// Completion celebration animation
export const completionCelebration: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    rotate: -10 
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: TIMING.verySlow,
      ease: EASING.bounce
    }
  }
}

// Error message animation
export const errorMessage: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10, 
    scale: 0.9 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: TIMING.normal,
      ease: EASING.default
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.9,
    transition: {
      duration: TIMING.fast
    }
  }
}

// Loading spinner animation
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// Pulse effect for current step
export const pulseEffect = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: EASING.smooth
  }
}

// Floating animation for decorative elements
export const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}

// Stagger configuration for list animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.normal,
      ease: EASING.default
    }
  }
}

// Slide in from direction utilities
export const slideInFrom = {
  left: (distance = 50) => ({
    initial: { opacity: 0, x: -distance },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: distance }
  }),
  right: (distance = 50) => ({
    initial: { opacity: 0, x: distance },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -distance }
  }),
  top: (distance = 50) => ({
    initial: { opacity: 0, y: -distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance }
  }),
  bottom: (distance = 50) => ({
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance }
  })
}

// Custom transition configurations
export const transitions = {
  default: {
    duration: TIMING.normal,
    ease: EASING.default
  },
  smooth: {
    duration: TIMING.slow,
    ease: EASING.smooth
  },
  bouncy: {
    duration: TIMING.normal,
    ease: EASING.bounce
  },
  spring: EASING.spring,
  quick: {
    duration: TIMING.fast,
    ease: EASING.default
  }
}