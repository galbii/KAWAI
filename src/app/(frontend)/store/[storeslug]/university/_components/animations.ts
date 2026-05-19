import type { Variants } from 'framer-motion';

export const EASE_ELEGANT  = [0.25, 0.46, 0.45, 0.94] as const;
export const EASE_UI_SHARP = [0.4, 0, 0.2, 1]         as const;

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_ELEGANT } },
};

export const fadeUpSlow: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_ELEGANT } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_ELEGANT } },
};

export const slideFromLeft: Variants = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_ELEGANT } },
};

export const slideFromRight: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE_ELEGANT } },
};

export const scaleReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_ELEGANT } },
};

// Used for the 01/02/03 large number labels — enters with blur for a dramatic cinematic beat
export const numberReveal: Variants = {
  hidden:  { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_ELEGANT } },
};

// Horizontal line that grows from its origin point
export const lineExpand: Variants = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_UI_SHARP } },
};

// Factory — use `staggerContainer(shouldReduceMotion ? 0 : 0.1)` for reduced-motion compliance.
// Framer Motion automatically skips transforms when prefers-reduced-motion is active,
// but stagger delays are NOT skipped — pass 0 explicitly to collapse them.
export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
