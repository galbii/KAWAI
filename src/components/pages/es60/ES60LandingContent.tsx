'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Star, Music, Headphones, Volume2, Settings } from 'lucide-react';
import { ES60ValueProposition } from './ES60ValueProposition';
import { ES60SocialProof } from './ES60SocialProof';
import { ES60FAQ } from './ES60FAQ';
import { ES60Specifications } from './ES60Specifications';
import { ES60Reviews } from './ES60Reviews';

export function ES60LandingContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Removed features and specs arrays since they're now handled by individual components

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #3C3530, #5D4E37)' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Kawai
                <span className="block" style={{ color: '#9CAF88' }}>ES60</span>
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed" style={{ color: '#F5F2ED' }}>
                Concert Grand Heritage, Accessible Excellence
              </p>
              <p className="text-lg max-w-2xl" style={{ color: '#FAF8F5' }}>
                Same premium Shigeru Kawai SK-EX sound as $2,000+ models.
                Only $499. Professional quality that fits your budget and your space.
              </p>
            </div>

            {/* Price & CTA */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-3xl font-bold" style={{ color: '#9CAF88' }}>Starting at $499</p>
                <p className="text-sm" style={{ color: '#F5F2ED' }}>*MSRP - Limited time pricing available</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 hover:shadow-lg"
                  style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/contact?product=kawai-es60&action=demo';
                    }
                  }}
                >
                  Request Demo
                </button>
                <button
                  className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 hover:shadow-lg"
                  style={{ 
                    borderColor: '#9CAF88', 
                    color: '#9CAF88',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#9CAF88';
                    e.currentTarget.style.color = '#3C3530';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9CAF88';
                  }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/contact?product=kawai-es60&action=schedule-demo';
                    }
                  }}
                >
                  Schedule Demo
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-8" style={{ borderTop: '1px solid #8B7355' }}>
              <div className="flex items-center gap-3" style={{ color: '#F5F2ED' }}>
                <Phone className="w-5 h-5" />
                <span>(636) 265-2866</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: '#F5F2ED' }}>
                <MapPin className="w-5 h-5" />
                <span>21 Meadows Circle Drive, Lake St. Louis, MO</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: '#F5F2ED' }}>
                <Clock className="w-5 h-5" />
                <span>Mon-Fri 10AM-7PM, Sat 10AM-6PM, Sun 1PM-5PM</span>
              </div>
            </div>
          </div>

          {/* Piano Image */}
          <div className="relative">
            <div className="relative rounded-2xl p-8 shadow-2xl" style={{ background: 'linear-gradient(to right, #6B645C, #8B7355)' }}>
              {/* SVG Placeholder for ES60 Piano */}
              <div className="rounded-lg w-full h-auto flex items-center justify-center min-h-[400px]" style={{ backgroundColor: '#5D4E37' }}>
                <svg
                  width="600"
                  height="400"
                  viewBox="0 0 600 400"
                  className="w-full h-auto rounded-lg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="600" height="400" fill="#5D4E37" rx="8"/>
                  {/* Piano keyboard illustration */}
                  <rect x="50" y="250" width="500" height="120" fill="#3C3530" rx="4"/>
                  {/* White keys */}
                  <rect x="60" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="85" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="110" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="135" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="160" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="185" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  <rect x="210" y="260" width="20" height="100" fill="#FAF8F5" stroke="#F5F2ED"/>
                  {/* Black keys */}
                  <rect x="72" y="260" width="12" height="60" fill="#3C3530"/>
                  <rect x="97" y="260" width="12" height="60" fill="#3C3530"/>
                  <rect x="147" y="260" width="12" height="60" fill="#3C3530"/>
                  <rect x="172" y="260" width="12" height="60" fill="#3C3530"/>
                  <rect x="197" y="260" width="12" height="60" fill="#3C3530"/>
                  {/* Piano body */}
                  <rect x="50" y="150" width="500" height="100" fill="#8B7355" rx="8"/>
                  <rect x="60" y="160" width="480" height="80" fill="#6B645C" rx="4"/>
                  {/* Kawai logo area */}
                  <text x="300" y="200" textAnchor="middle" fill="#F5F2ED" fontSize="24" fontFamily="Arial">
                    KAWAI ES60
                  </text>
                  <text x="300" y="225" textAnchor="middle" fill="#FAF8F5" fontSize="14" fontFamily="Arial">
                    Digital Piano
                  </text>
                </svg>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg" style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}>
                $499 MSRP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Component */}
      <ES60ValueProposition />

      {/* Specifications Component */}
      <ES60Specifications />

      {/* Professional Reviews Component */}
      <ES60Reviews />

      {/* Social Proof Component (Customer Testimonials) */}
      <ES60SocialProof />

      {/* FAQ Component */}
      <ES60FAQ />

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to right, #9CAF88, #8B7355)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            Experience the ES60 Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#5D4E37' }}>
            Visit our Lake St. Louis showroom for a hands-on demonstration.
            Hear why the ES60 delivers $2,000+ sound quality for just $499.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#3C3530', color: '#FAF8F5' }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/contact?product=kawai-es60&action=purchase';
                }
              }}
            >
              Contact for Purchase
            </button>
            <button
              className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 hover:shadow-lg"
              style={{ 
                borderColor: '#3C3530', 
                color: '#3C3530',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3C3530';
                e.currentTarget.style.color = '#FAF8F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#3C3530';
              }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/contact?product=kawai-es60&action=visit';
                }
              }}
            >
              Schedule Visit
            </button>
            <div className="font-semibold" style={{ color: '#3C3530' }}>
              Call Now: (636) 265-2866
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <p className="font-medium mb-2" style={{ color: '#3C3530' }}>
              🎹 Expert Piano Consultation Available
            </p>
            <p className="text-sm" style={{ color: '#5D4E37' }}>
              Serving Missouri families since 1927 | Authorized Kawai Dealer
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}