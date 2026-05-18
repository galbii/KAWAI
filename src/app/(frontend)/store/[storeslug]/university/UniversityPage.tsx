'use client';

import { useState } from 'react';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { usePageTracking } from '@/hooks/usePageTracking';
import type { GrandSaleProduct } from '@/lib/payload/queries';
import { TCU_2025 } from './event.config';
import HeroSection from './_components/sections/HeroSection';
import ValuePropositionSection from './_components/sections/ValuePropositionSection';
import AboutEventSection from './_components/sections/AboutEventSection';
import { FeaturedDeals } from './_components/sections/piano-gallery';
import BookingSection from './_components/sections/BookingSection';
import { ShowroomLocation } from './_components/sections/showroom-location';
import { StructuredData } from './_components/SEO/StructuredData';
import { CountdownTimer } from './_components/CountdownTimer';
import { NewsletterPopup } from './_components/NewsletterPopup';
import PianoConsultationDialog from './_components/PianoConsultationDialog';

interface UniversityPageProps {
  products: GrandSaleProduct[]
  storeslug: string
}

export default function UniversityPage({ products, storeslug }: UniversityPageProps) {
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
    <div className="min-h-screen w-full">
      <StructuredData config={TCU_2025} />
      <HeroSection
        config={TCU_2025.hero}
        partnerLogoUrl={TCU_2025.partnerLogoUrl}
        kawaiLogoUrl={TCU_2025.kawaiLogoUrl}
        eventDateDisplay={TCU_2025.eventDateDisplay}
        onOpenConsultation={openConsultation}
        venueInfo={{
          venue: 'Orchestral Rehearsal Hall, Boschini Music Center — TCU Campus',
          parking: 'Van Cliburn Concert Hall Parking Lot (2900 W Lowden St)',
          mapsUrl: `https://maps.google.com?q=${encodeURIComponent('2900 W Lowden St, Fort Worth, TX 76109')}`,
        }}
      />
      <AboutEventSection partnerName={TCU_2025.partnerName} partnerShortName={TCU_2025.partnerShortName} onOpenConsultation={openConsultation} />
      <ValuePropositionSection valueProps={TCU_2025.valueProps} phone={TCU_2025.valuePropsPhone} note={TCU_2025.valuePropsNote} />
      <FeaturedDeals products={products} onOpenConsultation={openConsultation} />
      <BookingSection onOpenConsultation={openConsultation} eventDateDisplay={TCU_2025.eventDateDisplay} />
      <ShowroomLocation eventLocation={TCU_2025.eventLocation} />
      <CountdownTimer targetDate={TCU_2025.eventStartDate} onOpenConsultation={openConsultation} isConsultationModalOpen={isConsultationModalOpen} />
      <NewsletterPopup />
      <PianoConsultationDialog isOpen={isConsultationModalOpen} onClose={closeConsultation} calendlyUrl={TCU_2025.calendlyUrl} eventName={TCU_2025.eventName} tags={['tcu-2026']} storeslug={storeslug} />
    </div>
  );
}
