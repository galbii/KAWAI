'use client'

import { useState } from 'react';
import PianoConsultationDialog from '../PianoConsultationDialog';
import { TCU_2025 } from '../../event.config';

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-accent"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full translate-x-48"></div>
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6 tracking-tight">
            Visit Our <span className="text-gradient-primary">Showroom</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed">
            Experience our pianos in person at our state-of-the-art showroom
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info Card */}
          <div className="card-premium rounded-3xl p-8 animate-slide-in-left">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-dark">Location & Contact</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-dark mb-1">Event Address</h4>
                  <p className="text-gray-medium leading-relaxed">
                    2900 W Lowden St<br />
                    Fort Worth, TX 76109<br />
                    <span className="text-sm text-primary font-medium">Boschini Music Center – TCU Campus</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-dark mb-1">Phone & Email</h4>
                  <p className="text-gray-medium">
                    <a
                      href="tel:9723792200"
                      className="hover:text-primary transition-colors"
                    >
                      (972) 379-2200
                    </a><br />
                    <a
                      href="mailto:info@kawaipianosdallas.com"
                      className="hover:text-primary transition-colors"
                    >
                      info@kawaipianosdallas.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-dark mb-1">Event Hours</h4>
                  <p className="text-gray-medium text-sm">
                    Thu–Sat, May 28–30: 10:00 AM – 6:00 PM<br />
                    Sunday, May 31: 12:00 PM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button
                onClick={() => window.open('https://maps.google.com/maps?q=2900+W+Lowden+St,+Fort+Worth,+TX+76109', '_blank')}
                className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
              >
                Get Directions
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full border-2 border-primary text-primary font-semibold py-3 px-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                Schedule Private Tour
              </button>
            </div>
          </div>
          
          {/* Map Card */}
          <div className="card-premium rounded-3xl p-8 animate-slide-in-right">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-blue-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-dark">Find Us</h3>
            </div>
            
            <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-xl font-bold text-gray-dark mb-2">Interactive Map</h4>
                  <p className="text-gray-medium mb-6">Click to view detailed directions<br />and parking information</p>
                  <button
                    onClick={() => window.open('https://maps.google.com/maps?q=2900+W+Lowden+St,+Fort+Worth,+TX+76109', '_blank')}
                    className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Open Map
                  </button>
                </div>
              </div>
              
              {/* Decorative map elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
              <div className="absolute bottom-6 right-6 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-8 w-1 h-1 bg-gold rounded-full animate-bounce"></div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="font-semibold text-gray-dark">🏏 Parking</div>
                <div className="text-gray-medium">Free valet available</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="font-semibold text-gray-dark">🚇 Transit</div>
                <div className="text-gray-medium">Metro Rail nearby</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Piano Consultation Dialog */}
      <PianoConsultationDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calendlyUrl={TCU_2025.calendlyUrl}
        eventName={TCU_2025.eventName}
        tags={['university-sale', 'uta-2025']}
      />
    </section>
  );
}