'use client';

import { useEffect } from 'react';
import { useScrollAnimations } from './components/hooks/useScrollAnimations';
import { usePageTracking } from './components/hooks/usePageTracking';
import Header from './components/Header';
import HeroSection from './components/sections/HeroSection';
import ValuePropositionSection from './components/sections/ValuePropositionSection';
import AboutEventSection from './components/sections/AboutEventSection';
import { FeaturedDeals } from './components/sections/piano-gallery';
import BookingSection from './components/sections/BookingSection';
import { ShowroomLocation } from './components/sections/showroom-location';
import { Footer } from './components/Footer';
import { StructuredData } from './components/SEO/StructuredData';
import { CountdownTimer } from './components/CountdownTimer';
import { NewsletterPopup } from './components/NewsletterPopup';

export default function ClientHomePage() {
  useScrollAnimations();
  
  // Enable comprehensive page tracking for the KAWAI piano sale landing page
  usePageTracking({
    pageName: 'kawai_piano_sale_landing',
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableExitIntent: true,
    scrollThresholds: [25, 50, 75, 90],
    timeUpdateInterval: 30000 // Update every 30 seconds
  });

  // Enhanced demographic tracking removed for basic setup

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <StructuredData />
      <Header />
      <HeroSection />
      <AboutEventSection />
      <ValuePropositionSection />
      <FeaturedDeals />
      <BookingSection />
      <ShowroomLocation />
      <Footer />
      <CountdownTimer />
      <NewsletterPopup />
    </div>
  );
}