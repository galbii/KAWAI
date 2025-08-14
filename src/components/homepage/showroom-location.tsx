'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function ShowroomLocation() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { AdvancedMarkerElement } = await loader.importLibrary('marker');

      const position = {
        lat: 38.7881,
        lng: -90.7095
      };

      const map = new Map(mapRef.current as HTMLElement, {
        zoom: 15,
        center: position,
        mapId: 'kawai-showroom-map',
        styles: [
          {
            featureType: 'all',
            stylers: [
              { saturation: -20 },
              { lightness: 10 }
            ]
          },
          {
            featureType: 'poi',
            stylers: [
              { visibility: 'simplified' }
            ]
          }
        ]
      });

      new AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Kawai Piano Gallery - St. Louis'
      });
    };

    initMap();
  }, []);

  const showroomInfo = {
    name: 'Kawai Piano Gallery - St. Louis',
    address: '21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367',
    website: 'https://kawaipianostlouis.com/',
    phone: '636-265-2866',
    hours: [
      { day: 'Monday', time: '10:00 am–7:00 pm' },
      { day: 'Tuesday', time: '10:00 am–7:00 pm' },
      { day: 'Wednesday', time: '10:00 am–7:00 pm' },
      { day: 'Thursday', time: '10:00 am–7:00 pm' },
      { day: 'Friday', time: '10:00 am–7:00 pm' },
      { day: 'Saturday', time: '10:00 am–6:00 pm' },
      { day: 'Sunday', time: '1:00 pm–5:00 pm' }
    ]
  };

  return (
    <section className="relative bg-white">
      {/* Full-width map with overlay */}
      <div className="relative h-[80vh] min-h-[700px]">
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
        
        {/* Elegant overlay card */}
        <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-sm p-8 rounded-none shadow-2xl max-w-sm">
          <h3 className="text-2xl font-serif text-kawai-black mb-6">
            {showroomInfo.name}
          </h3>
          
          <div className="space-y-4 text-kawai-black/80 mb-8">
            <p className="text-sm leading-relaxed">
              {showroomInfo.address}
            </p>
            <p className="text-sm">
              <a 
                href={`tel:${showroomInfo.phone}`} 
                className="hover:text-kawai-red transition-colors"
              >
                {showroomInfo.phone}
              </a>
            </p>
          </div>

          {/* Simplified hours - just weekday/weekend */}
          <div className="mb-8 text-sm text-kawai-black/60">
            <p>Mon–Fri: 10am–7pm</p>
            <p>Saturday: 10am–6pm</p>
            <p>Sunday: 1pm–5pm</p>
          </div>

          {/* Single, prominent CTA */}
          <a 
            href={`https://maps.google.com?q=${encodeURIComponent(showroomInfo.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-kawai-red hover:bg-kawai-black text-white py-4 text-center font-medium transition-colors text-sm tracking-wide uppercase"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Visit Showroom CTA */}
      <div className="py-24 text-center bg-kawai-pearl">
        <a 
          href="/contact"
          className="inline-block bg-kawai-red hover:bg-kawai-black text-white px-12 py-6 text-lg font-medium transition-colors tracking-wide uppercase"
        >
          Visit Our Showroom
        </a>
      </div>
    </section>
  );
}