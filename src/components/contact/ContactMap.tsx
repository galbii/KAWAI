'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import type { ShowroomSectionData } from '@/lib/types/homepage';

interface ContactMapProps {
  data?: ShowroomSectionData;
}

const DEFAULT_MAP_DATA: ShowroomSectionData = {
  sectionHeader: "Find Us",
  showroomTitle: "Lake St. Louis Location",
  showroomDescription: "Located in the heart of Lake St. Louis, our showroom is easily accessible from throughout the St. Louis metropolitan area.",
  showroomInfo: {
    name: "Kawai Piano Gallery St. Louis",
    address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
    phone: "636-265-2866",
    serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
  },
  hours: [],
  features: [],
  mapApiKey: undefined,
  showroomCtas: {
    directionsText: "Get Directions",
    directionsLink: "https://maps.google.com/?q=21+Meadows+Circle+Drive,+Suite+312,+Lake+St.+Louis,+MO+63367",
    scheduleText: "Schedule Visit",
    scheduleLink: "/contact/schedule-visit"
  }
};

export function ContactMap({ data = DEFAULT_MAP_DATA }: ContactMapProps) {
  const [mapError, setMapError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    if (data.mapApiKey) {
      // Use API key if available for enhanced maps
      const encodedAddress = encodeURIComponent(data.showroomInfo.address);
      return `https://www.google.com/maps/embed/v1/place?key=${data.mapApiKey}&q=${encodedAddress}&zoom=15`;
    } else {
      // Fallback to basic embed without API key
      const encodedAddress = encodeURIComponent(data.showroomInfo.address);
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3127.234567!2d-90.1234567!3d38.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodedAddress}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
    }
  };

  // Handle map loading errors
  const handleMapError = () => {
    setMapError(true);
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  // If no API key and we want to show the map section
  if (!data.mapApiKey) {
    return (
      <section className="py-16 bg-kawai-black">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-pearl mb-6">
              {data.sectionHeader || "Visit Our Showroom"}
            </h2>
            <p className="text-lg text-kawai-pearl/70 max-w-2xl mx-auto">
              {data.showroomDescription}
            </p>
          </div>

          {/* Location Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="md:flex">
                {/* Location Info */}
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-6">
                    <MapPinIcon className="w-8 h-8 text-kawai-red mr-3" />
                    <h3 className="text-2xl font-semibold text-kawai-black">
                      {data.showroomInfo.name}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-kawai-black/70 leading-relaxed">
                      {data.showroomInfo.address}
                    </p>
                    <p className="text-kawai-black/60 text-sm">
                      {data.showroomInfo.serviceArea}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <a
                      href={data.showroomCtas.directionsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-sm transition-colors"
                    >
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      {data.showroomCtas.directionsText}
                    </a>
                    
                    <a
                      href={data.showroomCtas.scheduleLink}
                      className="w-full inline-flex items-center justify-center px-6 py-4 border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white font-medium rounded-sm transition-colors"
                    >
                      {data.showroomCtas.scheduleText}
                    </a>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="md:w-1/2 bg-kawai-pearl/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <MapPinIcon className="w-16 h-16 text-kawai-red/50 mx-auto mb-4" />
                    <p className="text-kawai-black/60 mb-4">Interactive Map</p>
                    <a
                      href={data.showroomCtas.directionsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-kawai-red hover:text-kawai-black font-medium"
                    >
                      Open in Google Maps
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If API key is available, show embedded map
  return (
    <section className="py-16 bg-kawai-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-pearl mb-6">
            {data.sectionHeader || "Visit Our Showroom"}
          </h2>
          <p className="text-lg text-kawai-pearl/70 max-w-2xl mx-auto">
            {data.showroomDescription}
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Location Info */}
              <div className="md:w-1/3 p-8">
                <div className="flex items-center mb-6">
                  <MapPinIcon className="w-8 h-8 text-kawai-red mr-3" />
                  <h3 className="text-xl font-semibold text-kawai-black">
                    {data.showroomInfo.name}
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-kawai-black/70 leading-relaxed">
                    {data.showroomInfo.address}
                  </p>
                  <p className="text-kawai-black/60 text-sm">
                    {data.showroomInfo.serviceArea}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={data.showroomCtas.directionsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-kawai-red hover:bg-kawai-black text-white font-medium rounded-sm transition-colors"
                  >
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {data.showroomCtas.directionsText}
                  </a>
                  
                  <a
                    href={data.showroomCtas.scheduleLink}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white font-medium rounded-sm transition-colors"
                  >
                    {data.showroomCtas.scheduleText}
                  </a>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="md:w-2/3 relative">
                {!isMapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-kawai-pearl/20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kawai-red mx-auto mb-2"></div>
                      <p className="text-kawai-black/60">Loading map...</p>
                    </div>
                  </div>
                )}
                
                {mapError ? (
                  <div className="h-96 flex items-center justify-center bg-kawai-pearl/20">
                    <div className="text-center">
                      <MapPinIcon className="w-16 h-16 text-kawai-red/50 mx-auto mb-4" />
                      <p className="text-kawai-black/60 mb-4">Map temporarily unavailable</p>
                      <a
                        href={data.showroomCtas.directionsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-kawai-red hover:text-kawai-black font-medium"
                      >
                        Open in Google Maps
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={getMapEmbedUrl()}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleMapLoad}
                    onError={handleMapError}
                    title={`Map showing location of ${data.showroomInfo.name}`}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}