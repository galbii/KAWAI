'use client';

import { useState } from 'react';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { usePageTracking } from '@/hooks/usePageTracking';
import { TSU_2025 } from './event.config';
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

export default function UniversityPage() {
  useScrollAnimations();

  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const openConsultation = () => setIsConsultationModalOpen(true);
  const closeConsultation = () => setIsConsultationModalOpen(false);

  usePageTracking({
    pageName: TSU_2025.tracking.pageName,
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableExitIntent: true,
    scrollThresholds: [25, 50, 75, 90],
    timeUpdateInterval: 30000,
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <StructuredData config={TSU_2025} />
      <HeroSection config={TSU_2025.hero} partnerLogoUrl={TSU_2025.partnerLogoUrl} kawaiLogoUrl={TSU_2025.kawaiLogoUrl} eventDateDisplay={TSU_2025.eventDateDisplay} onOpenConsultation={openConsultation} />
      <AboutEventSection partnerName={TSU_2025.partnerName} partnerShortName={TSU_2025.partnerShortName} onOpenConsultation={openConsultation} />
      <ValuePropositionSection valueProps={TSU_2025.valueProps} phone={TSU_2025.valuePropsPhone} note={TSU_2025.valuePropsNote} />
      <FeaturedDeals pianos={TSU_2025.pianos} onOpenConsultation={openConsultation} />
      <BookingSection onOpenConsultation={openConsultation} eventDateDisplay={TSU_2025.eventDateDisplay} />
      <ShowroomLocation eventLocation={TSU_2025.eventLocation} />
      <CountdownTimer targetDate={TSU_2025.eventStartDate} onOpenConsultation={openConsultation} isConsultationModalOpen={isConsultationModalOpen} />
      <NewsletterPopup />
      <PianoConsultationDialog isOpen={isConsultationModalOpen} onClose={closeConsultation} calendlyUrl={TSU_2025.calendlyUrl} eventName={TSU_2025.eventName} tags={['university-sale', 'uta-2025']} />
      <Footer businessLocation={TSU_2025.businessLocation} />
    </div>
  );
}
