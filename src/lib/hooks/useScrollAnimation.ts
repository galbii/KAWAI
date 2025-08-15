"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

interface AnimationState {
  isVisible: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}): AnimationState {
  const { threshold = 0.3, rootMargin = "0px 0px -10% 0px", delay = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (prefersReducedMotion) {
            // Immediately show content for users who prefer reduced motion
            setIsVisible(true);
          } else if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return { isVisible, ref };
}

// Hook for staggered animations with multiple elements
export function useStaggeredAnimation(count: number, staggerDelay: number = 200) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger staggered animations
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * staggerDelay);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [count, staggerDelay]);

  return { visibleItems, ref };
}

// Animation class generators
export const fadeUpClass = (isVisible: boolean, delay: number = 0) => `
  transition-all duration-700 ease-out ${delay > 0 ? `delay-${delay}` : ''}
  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
`;

export const slideInClass = (isVisible: boolean, direction: 'left' | 'right', delay: number = 0) => `
  transition-all duration-800 ease-out ${delay > 0 ? `delay-${delay}` : ''}
  ${isVisible 
    ? 'opacity-100 translate-x-0' 
    : `opacity-0 ${direction === 'left' ? '-translate-x-12' : 'translate-x-12'}`
  }
`;

export const scaleInClass = (isVisible: boolean, delay: number = 0) => `
  transition-all duration-500 ease-out ${delay > 0 ? `delay-${delay}` : ''}
  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
`;