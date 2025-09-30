'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, Award, Music, GraduationCap, Users, CheckCircle, Trophy } from 'lucide-react';

interface ReviewHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ES60Reviews() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const reviewHighlights: ReviewHighlight[] = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Best Sound Under $500',
      description: 'Professional reviewers consistently rank the ES60 as having superior piano sound quality in its price range.'
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Superior Key Action',
      description: 'Responsive Hammer Lite action praised for authentic piano touch and proper technique development.'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Educator Recommended',
      description: 'Music teachers recommend the ES60 for students learning proper piano technique and musicality.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Exceptional Value',
      description: 'Professional-grade features and concert grand sound at an entry-level price point.'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="w-6 h-6 fill-current"
        style={{ color: '#E11922' }}
      />
    ));
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            What Professional Reviewers Say
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#6B645C' }}>
            Expert reviews consistently recognize the ES60 as the leader in sound quality and value
          </p>
        </div>

        {/* Hero Review - AZ Piano Reviews */}
        <div className={`mb-16 transition-all duration-700 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div
            className="relative rounded-3xl p-8 lg:p-12 shadow-2xl border-4"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E11922'
            }}
          >
            {/* Quote Icon Background */}
            <div className="absolute top-6 left-6">
              <Quote
                className="w-16 h-16 opacity-10"
                style={{ color: '#8B7355' }}
              />
            </div>

            {/* Content */}
            <div className="relative max-w-5xl mx-auto">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {renderStars(5)}
              </div>

              {/* Main Quote */}
              <blockquote className="text-2xl lg:text-3xl leading-relaxed mb-8 text-center font-medium" style={{ color: '#3C3530' }}>
                "By far the most realistic acoustic grand piano reproduction through headphones I have ever heard from a $500 digital piano."
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <div className="font-bold text-xl mb-2" style={{ color: '#8B7355' }}>
                    — AZ Piano Reviews
                  </div>
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Professional Piano Review Expert
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Highlights Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ease-out delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {reviewHighlights.map((highlight, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: '#F5F2ED',
                transitionDelay: `${100 * index}ms`
              }}
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
              >
                {highlight.icon}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#3C3530' }}>
                {highlight.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B645C' }}>
                {highlight.description}
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: '#E11922' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators Banner */}
        <div className={`transition-all duration-700 ease-out delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: '#8B7355' }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Overall Rating */}
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                  <div className="text-4xl font-bold" style={{ color: '#FAF8F5' }}>
                    4.9
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      {renderStars(5)}
                    </div>
                    <div className="text-sm" style={{ color: '#F5F2ED' }}>
                      out of 5 stars
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium" style={{ color: '#F5F2ED' }}>
                  Based on 100+ professional reviews
                </div>
              </div>

              {/* Divider */}
              <div
                className="hidden lg:block w-px h-16"
                style={{ backgroundColor: '#E11922', opacity: 0.5 }}
              />

              {/* Heritage Badge */}
              <div className="text-center">
                <div className="flex items-center gap-3 mb-2 justify-center">
                  <Award className="w-8 h-8" style={{ color: '#E11922' }} />
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#FAF8F5' }}>
                      97 Years
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#F5F2ED' }}>
                      of Piano Excellence
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                className="hidden lg:block w-px h-16"
                style={{ backgroundColor: '#E11922', opacity: 0.5 }}
              />

              {/* Professional Recognition */}
              <div className="text-center lg:text-right">
                <div className="font-bold text-xl mb-2" style={{ color: '#FAF8F5' }}>
                  Industry Leading
                </div>
                <div className="text-sm leading-relaxed max-w-xs" style={{ color: '#F5F2ED' }}>
                  Recognized by professional reviewers as the best-sounding digital piano under $500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Signal */}
        <div className={`mt-12 text-center transition-all duration-700 ease-out delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2"
            style={{ backgroundColor: '#3C3530', color: '#FAF8F5', borderColor: '#E11922' }}
          >
            <Trophy className="w-5 h-5" style={{ color: '#E11922' }} />
            <span className="font-semibold">
              Rated <span style={{ color: '#E11922' }}>Best Value</span> by Professional Piano Reviewers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
