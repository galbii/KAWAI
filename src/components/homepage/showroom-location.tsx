'use client';

import Image from 'next/image';
import { GoogleMapsEmbed } from '@next/third-parties/google';
import type { ShowroomLocationProps } from "@/lib/types/homepage";
import { DEFAULT_SHOWROOM_DATA } from "@/lib/types/homepage";

// Helper function to get SVG icon based on icon name
function getFeatureIconSvg(iconName: string) {
  const iconMap: Record<string, string> = {
    award: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    piano: 'M14.5 8.25A2.25 2.25 0 0112.25 6v0A2.25 2.25 0 0110 8.25v7.5A2.25 2.25 0 0112.25 18v0a2.25 2.25 0 012.25-2.25h5.25A2.25 2.25 0 0122 13.5V8.25A2.25 2.25 0 0119.75 6H14.5z',
    shield: 'M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm4.64-1.96l3.54 3.54 5.66-5.66L17 9.08l-4.24 4.24-2.12-2.12L8.64 10.04z',
    users: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    music: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
    car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
    headphones: 'M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z'
  };

  return iconMap[iconName] || iconMap['award']; // Default to award icon
}

export function ShowroomLocation({ data = DEFAULT_SHOWROOM_DATA }: ShowroomLocationProps) {

  return (
    <section className="relative bg-kawai-pearl">
      {/* Section Header */}
      <div className="container mx-auto px-6 pt-24 pb-16 text-center">
        <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
          {data.sectionHeader}
        </div>
        <h2 className="text-5xl md:text-6xl font-light font-serif text-kawai-black mb-8 leading-tight">
          {data.showroomTitle}
        </h2>
        <p className="text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
          {data.showroomDescription}
        </p>
      </div>

      {/* Elegant Map Container */}
      <div className="container mx-auto px-6 pb-24">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Map Section - Full Width */}
          <div className="relative w-full">
            <GoogleMapsEmbed
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
              height={600}
              width="100%"
              mode="place"
              q={data.showroomInfo.address}
              zoom="15"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Information Panel - Below Map */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-white to-kawai-pearl">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Left Column: Logo, Title, Contact */}
                <div className="lg:col-span-1">
                  {/* KAWAI Logo */}
                  <div className="mb-4">
                    <Image
                      src="/images/Kawai (Red)(2).png"
                      alt="KAWAI"
                      width={200}
                      height={60}
                      className="h-5 w-auto md:h-6"
                    />
                  </div>

                  {/* Showroom Title */}
                  <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-bold text-kawai-black mb-3 leading-tight uppercase">
                      {data.showroomInfo.name}
                    </h3>
                    <div className="w-16 h-px bg-kawai-red mb-6"></div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-1">Address</p>
                        <p className="text-kawai-black/70 text-sm leading-relaxed">
                          {data.showroomInfo.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-1">Phone</p>
                        <a
                          href={`tel:${data.showroomInfo.phone}`}
                          className="text-kawai-black/70 hover:text-kawai-red transition-colors text-sm"
                        >
                          {data.showroomInfo.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-1">Service Area</p>
                        <p className="text-kawai-black/70 text-xs leading-relaxed">
                          {data.showroomInfo.serviceArea}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column: Hours */}
                <div className="lg:col-span-1">
                  <h4 className="text-kawai-black font-semibold text-lg mb-6">Showroom Hours</h4>
                  <div className="space-y-3 text-sm text-kawai-black/70">
                    {data.hours.map((hour, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-kawai-black/10 last:border-b-0">
                        <span className="font-medium text-kawai-black">{hour.day}</span>
                        <span>{hour.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: CTA */}
                <div className="lg:col-span-1 flex flex-col justify-center">
                  <a
                    href={data.showroomCtas.directionsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-kawai-red hover:bg-kawai-black text-white py-4 text-center font-medium transition-colors text-sm tracking-wide uppercase rounded-lg shadow-lg hover:shadow-xl"
                  >
                    {data.showroomCtas.directionsText}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - Dynamic from CMS - Moved under map */}
          <div className="bg-gradient-to-br from-white to-kawai-pearl py-16 px-12 rounded-b-2xl">
            <div className={`grid gap-8 max-w-5xl mx-auto ${
              data.features.length === 3 ? 'md:grid-cols-3' :
              data.features.length === 2 ? 'md:grid-cols-2' :
              'md:grid-cols-1'
            }`}>
              {data.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={getFeatureIconSvg(feature.icon)}/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-kawai-black mb-2">{feature.title}</h3>
                  <p className="text-kawai-black/70 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}