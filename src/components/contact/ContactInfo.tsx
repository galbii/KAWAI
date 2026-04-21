import React from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  StarIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import type { ShowroomSectionData } from '@/lib/types/homepage';

interface ContactInfoProps {
  data?: ShowroomSectionData;
}

const DEFAULT_CONTACT_INFO_DATA: ShowroomSectionData = {
  sectionHeader: "Visit Us",
  showroomTitle: "Lake St. Louis Showroom",
  showroomDescription: "Experience the artistry of Kawai pianos in Missouri's premier showroom. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.",
  showroomInfo: {
    name: "Kawai Piano Gallery St. Louis",
    address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
    phone: "636-265-2866",
    serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
  },
  hours: [
    { day: 'Monday', time: '10:00 am–7:00 pm' },
    { day: 'Tuesday', time: '10:00 am–7:00 pm' },
    { day: 'Wednesday', time: '10:00 am–7:00 pm' },
    { day: 'Thursday', time: '10:00 am–7:00 pm' },
    { day: 'Friday', time: '10:00 am–7:00 pm' },
    { day: 'Saturday', time: '10:00 am–6:00 pm' },
    { day: 'Sunday', time: '1:00 pm–5:00 pm' }
  ],
  features: [
    { icon: 'award', title: 'Expert Consultation', description: 'Personalized guidance from certified Kawai specialists' },
    { icon: 'piano', title: 'Full Service Center', description: 'Tuning, repair, and maintenance by certified technicians' },
    { icon: 'shield', title: 'Financing Available', description: 'Flexible payment options to make your piano dreams accessible' }
  ],
  showroomCtas: {
    directionsText: "Get Directions",
    directionsLink: "https://maps.google.com/?q=Lake+St.+Louis+MO",
    scheduleText: "Schedule Visit",
    scheduleLink: "/contact/schedule-visit"
  },
  trustBanner: [
    { text: '95+ Years Experience' },
    { text: 'Certified Kawai Specialists' },
    { text: "Missouri's Trusted Dealer" }
  ]
};

// Helper function to get the appropriate icon for features
function getFeatureIcon(iconName: string) {
  const iconMap = {
    'award': StarIcon,
    'piano': MusicalNoteIcon,
    'shield': ShieldCheckIcon,
    'users': UserGroupIcon,
    'clock': ClockIcon,
    'car': MapPinIcon,
    'headphones': MusicalNoteIcon,
    'music': MusicalNoteIcon,
  };
  
  return iconMap[iconName as keyof typeof iconMap] || StarIcon;
}

export function ContactInfo({ data = DEFAULT_CONTACT_INFO_DATA }: ContactInfoProps) {
  return (
    <section className="py-16 bg-kawai-pearl">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-4">
            {data.sectionHeader}
          </h2>
          <h3 className="text-2xl md:text-3xl font-medium text-kawai-black mb-6">
            {data.showroomTitle}
          </h3>
          <p className="text-lg text-kawai-black/70 max-w-3xl mx-auto">
            {data.showroomDescription}
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MapPinIcon className="w-8 h-8 text-kawai-red mr-3" />
              <h4 className="text-xl font-semibold text-kawai-black">Location & Contact</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-kawai-black mb-2">{data.showroomInfo.name}</h5>
                <p className="text-kawai-black/70 leading-relaxed">
                  {data.showroomInfo.address}
                </p>
              </div>

              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-kawai-red mr-3" />
                <Link
                  href={`tel:${data.showroomInfo.phone}`}
                  className="text-kawai-black hover:text-kawai-red font-medium transition-colors"
                >
                  {data.showroomInfo.phone}
                </Link>
              </div>

              {data.showroomInfo.email && (
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-kawai-red mr-3" />
                  <Link
                    href={`mailto:${data.showroomInfo.email}`}
                    className="text-kawai-black hover:text-kawai-red font-medium transition-colors"
                  >
                    {data.showroomInfo.email}
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-kawai-black/10">
                <p className="text-sm text-kawai-black/60">
                  {data.showroomInfo.serviceArea}
                </p>
              </div>
            </div>

            {/* Contact CTAs */}
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href={data.showroomCtas.directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-sm transition-colors"
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                {data.showroomCtas.directionsText}
              </Link>
              <Link
                href={data.showroomCtas.scheduleLink}
                className="inline-flex items-center justify-center px-6 py-3 border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white font-medium rounded-sm transition-colors"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                {data.showroomCtas.scheduleText}
              </Link>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <ClockIcon className="w-8 h-8 text-kawai-red mr-3" />
              <h4 className="text-xl font-semibold text-kawai-black">Showroom Hours</h4>
            </div>
            
            <div className="space-y-3">
              {data.hours.map((hour, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-kawai-black/10 last:border-b-0">
                  <span className="font-medium text-kawai-black">
                    {hour.day}
                  </span>
                  <span className="text-kawai-black/70">
                    {hour.time}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-kawai-pearl/50 rounded-md">
              <p className="text-sm text-kawai-black/70 text-center">
                <strong>Walk-ins welcome!</strong><br />
                For personalized consultations, we recommend scheduling ahead.
              </p>
            </div>
          </div>

          {/* Services & Features */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <WrenchScrewdriverIcon className="w-8 h-8 text-kawai-red mr-3" />
              <h4 className="text-xl font-semibold text-kawai-black">Our Services</h4>
            </div>
            
            <div className="space-y-6">
              {data.features.map((feature, index) => {
                const IconComponent = getFeatureIcon(feature.icon);
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-kawai-red" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-kawai-black mb-1">
                        {feature.title}
                      </h5>
                      <p className="text-kawai-black/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Banner - Dynamic from CMS */}
        {data.trustBanner && data.trustBanner.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center items-center space-x-8 opacity-70 flex-wrap gap-4">
              {data.trustBanner.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="w-px h-6 bg-kawai-black/20 hidden sm:block"></div>
                  )}
                  <div className="text-sm text-kawai-black/60">{item.text}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}