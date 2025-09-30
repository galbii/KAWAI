// ES60 Cinematic Slides - Modular scroll-triggered components

import { OpeningSlide } from './OpeningSlide';
import { HeritageSlide } from './HeritageSlide';
import { TransformationSlide } from './TransformationSlide';
import { ExperienceSlide } from './ExperienceSlide';
import { FAQSlide } from './FAQSlide';
import { FinaleSlide } from './FinaleSlide';

// Re-export individual components
export { OpeningSlide, HeritageSlide, TransformationSlide, ExperienceSlide, FAQSlide, FinaleSlide };

// Slide configuration for the cinematic presentation
export const SLIDE_COMPONENTS = [
  OpeningSlide,
  HeritageSlide,
  TransformationSlide,
  ExperienceSlide,
  FAQSlide,
  FinaleSlide
] as const;

export const SLIDE_NAMES = [
  'Opening',
  'Heritage',
  'Transformation',
  'Experience',
  'FAQ',
  'Finale'
] as const;