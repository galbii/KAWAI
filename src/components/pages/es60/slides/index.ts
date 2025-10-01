// ES60 Cinematic Slides - Modular scroll-triggered components

import { OpeningSlide } from './OpeningSlide';
import { PremiumSoundSlide } from './PremiumSoundSlide';
import { TransformationSlide } from './TransformationSlide';
import { ExperienceSlide } from './ExperienceSlide';
import { FAQSlide } from './FAQSlide';
import { FinaleSlide } from './FinaleSlide';

// Re-export individual components
export { OpeningSlide, PremiumSoundSlide, TransformationSlide, ExperienceSlide, FAQSlide, FinaleSlide };

// Slide configuration for the cinematic presentation
export const SLIDE_COMPONENTS = [
  OpeningSlide,
  ExperienceSlide,
  PremiumSoundSlide,
  TransformationSlide,
  FAQSlide,
  FinaleSlide
] as const;

export const SLIDE_NAMES = [
  'Opening',
  'Experience',
  'Premium Sound',
  'Transformation',
  'FAQ',
  'Finale'
] as const;