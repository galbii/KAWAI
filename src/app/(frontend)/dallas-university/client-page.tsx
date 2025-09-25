'use client';

import { useEffect } from 'react';
import { useScrollAnimations } from '@/components/pages/dallas-university/hooks/useScrollAnimations';
import { usePageTracking } from '@/components/pages/dallas-university/hooks/usePageTracking';
import Header from '@/components/pages/dallas-university/Header';
import HeroSection from '@/components/pages/dallas-university/sections/HeroSection';
import ValuePropositionSection from '@/components/pages/dallas-university/sections/ValuePropositionSection';
import AboutEventSection from '@/components/pages/dallas-university/sections/AboutEventSection';
import { FeaturedDeals } from '@/components/pages/dallas-university/sections/piano-gallery';
import BookingSection from '@/components/pages/dallas-university/sections/BookingSection';
import { ShowroomLocation } from '@/components/pages/dallas-university/sections/showroom-location';
import { Footer } from '@/components/pages/dallas-university/Footer';
import { StructuredData } from '@/components/pages/dallas-university/SEO/StructuredData';
import { CountdownTimer } from '@/components/pages/dallas-university/CountdownTimer';
import { NewsletterPopup } from '@/components/pages/dallas-university/NewsletterPopup';

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