'use client';

import { useState } from 'react';
import { useScrollAnimations } from './_components/hooks/useScrollAnimations';
import { usePageTracking } from './_components/hooks/usePageTracking';
import HeroSection from './_components/sections/HeroSection';
import ValuePropositionSection from './_components/sections/ValuePropositionSection';
import AboutEventSection from './_components/sections/AboutEventSection';
import { FeaturedDeals } from './_components/sections/piano-gallery';
import BookingSection from './_components/sections/BookingSection';
import { ShowroomLocation } from './_components/sections/showroom-location';
import { Footer } from './_components/Footer';
import { StructuredData } from './_components/SEO/StructuredData';
import { CountdownTimer } from './_components/CountdownTimer';
import { NewsletterPopup } from './_components/NewsletterPopup';
import PianoConsultationDialog from './_components/PianoConsultationDialog';

export default function ClientHomePage() {
  useScrollAnimations();

  // Shared modal state - single instance for entire page
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

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
      <HeroSection onOpenConsultation={() => setIsConsultationModalOpen(true)} />
      <AboutEventSection onOpenConsultation={() => setIsConsultationModalOpen(true)} />
      <ValuePropositionSection />
      <FeaturedDeals onOpenConsultation={() => setIsConsultationModalOpen(true)} />
      <BookingSection />
      <ShowroomLocation />
      <CountdownTimer />
      <NewsletterPopup />

      {/* Single shared consultation modal for entire page */}
      <PianoConsultationDialog
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </div>
  );
}