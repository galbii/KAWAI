'use client';

import { useState } from 'react';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { usePageTracking } from '@/hooks/usePageTracking';
import type { Product } from '@/payload-types';
import { TCU_2025 } from './event.config';
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

interface UniversityPageProps {
  products: Product[]
}

export default function UniversityPage({ products }: UniversityPageProps) {
  useScrollAnimations();

  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const openConsultation = () => setIsConsultationModalOpen(true);
  const closeConsultation = () => setIsConsultationModalOpen(false);

  usePageTracking({
    pageName: TCU_2025.tracking.pageName,
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableExitIntent: true,
    scrollThresholds: [25, 50, 75, 90],
    timeUpdateInterval: 30000,
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <StructuredData config={TCU_2025} />
      <HeroSection config={TCU_2025.hero} partnerLogoUrl={TCU_2025.partnerLogoUrl} kawaiLogoUrl={TCU_2025.kawaiLogoUrl} eventDateDisplay={TCU_2025.eventDateDisplay} onOpenConsultation={openConsultation} />
      <AboutEventSection partnerName={TCU_2025.partnerName} partnerShortName={TCU_2025.partnerShortName} onOpenConsultation={openConsultation} />
      <ValuePropositionSection valueProps={TCU_2025.valueProps} phone={TCU_2025.valuePropsPhone} note={TCU_2025.valuePropsNote} />
      <FeaturedDeals products={products} onOpenConsultation={openConsultation} />
      <BookingSection onOpenConsultation={openConsultation} eventDateDisplay={TCU_2025.eventDateDisplay} />
      <ShowroomLocation eventLocation={TCU_2025.eventLocation} />
      <CountdownTimer targetDate={TCU_2025.eventStartDate} onOpenConsultation={openConsultation} isConsultationModalOpen={isConsultationModalOpen} />
      <NewsletterPopup />
      <PianoConsultationDialog isOpen={isConsultationModalOpen} onClose={closeConsultation} calendlyUrl={TCU_2025.calendlyUrl} eventName={TCU_2025.eventName} tags={['university-sale', 'uta-2025']} />
      <Footer businessLocation={TCU_2025.businessLocation} />
    </div>
  );
}
