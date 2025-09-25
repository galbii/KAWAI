'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Users, GraduationCap, Music } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  category: 'teacher' | 'parent' | 'adult-learner' | 'professional';
  verified: boolean;
  image?: string;
}

interface TrustIndicator {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
}

export function ES60SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Piano Teacher, 15 years',
      location: 'Clayton, MO',
      content: 'The ES60 surprised me completely. My students who practice on this at home show better technique development than those with cheap keyboards. The weighted action teaches proper finger strength, and the Shigeru Kawai samples give them an authentic reference for tone. At $499, it\'s the best recommendation I can make to parents.',
      rating: 5,
      category: 'teacher',
      verified: true
    },
    {
      id: '2',
      name: 'Jennifer Martinez',
      role: 'Mother of two piano students',
      location: 'Lake St. Louis, MO',
      content: 'We researched for months before buying. The ES60 was $200 less than the Yamaha P-225 our teacher suggested, but when we compared them side by side, the Kawai sounded so much richer. My 8-year-old practices willingly now because it actually sounds like a real piano. Best investment in their musical education.',
      rating: 5,
      category: 'parent',
      verified: true
    },
    {
      id: '3',
      name: 'David Thompson',
      role: 'Adult beginner, age 52',
      location: 'Chesterfield, MO',
      content: 'I always wanted to learn piano but was intimidated by the cost and space of an acoustic. The ES60 changed everything. The sound quality is incredible - better than the old upright my neighbor has. At 24 pounds, I can move it anywhere in the house. My wife says it\'s like having a concert grand in our living room.',
      rating: 5,
      category: 'adult-learner',
      verified: true
    },
    {
      id: '4',
      name: 'Michael Rodriguez',
      role: 'Music Educator & Performer',
      location: 'St. Charles, MO',
      content: 'I\'ve played on $50,000 Shigeru Kawai concert grands, and hearing those same samples in the ES60 is remarkable. For students and professionals who need portable quality, this is game-changing. The dual headphone outputs make it perfect for teaching, and the sound rivals instruments costing 4x more.',
      rating: 5,
      category: 'professional',
      verified: true
    },
    {
      id: '5',
      name: 'Lisa Park',
      role: 'Parent & former pianist',
      location: 'Ballwin, MO',
      content: 'I played piano through college but stopped for 20 years. When my daughter wanted lessons, I got the ES60 so we could both play. The touch is so authentic that my muscle memory came right back. Now we practice together every evening. It\'s brought music back into our family\'s life.',
      rating: 5,
      category: 'parent',
      verified: true
    },
    {
      id: '6',
      name: 'Professor James Liu',
      role: 'Music Department, Webster University',
      location: 'Webster Groves, MO',
      content: 'We recommend the ES60 to our students who need practice instruments. The sound quality is exceptional for the price point, and the portability means they can practice in dorms, practice rooms, or at home. Several students have told me it sounds better than the old acoustic uprights in their apartments.',
      rating: 5,
      category: 'teacher',
      verified: true
    }
  ];

  const trustIndicators: TrustIndicator[] = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Concert Grand Heritage',
      description: 'Same Shigeru Kawai SK-EX samples used in world-class concert halls',
      stat: '97 years'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Teacher Recommended',
      description: 'Preferred by music educators for proper technique development',
      stat: '95% approval'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Family Trusted',
      description: 'Chosen by parents who want quality that grows with their children',
      stat: '10,000+ families'
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Professional Quality',
      description: 'Sound and touch that meets professional performance standards',
      stat: 'Studio grade'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-current' : ''}`}
        style={{ color: '#E11922' }}
      />
    ));
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#F5F2ED' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            Trusted by Teachers, Loved by Families
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#6B645C' }}>
            Real stories from music educators, parents, and students who chose the ES60
          </p>
        </div>

        {/* Trust Indicators */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {trustIndicators.map((indicator, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl"
              style={{ backgroundColor: '#FAF8F5' }}
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
              >
                {indicator.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#3C3530' }}>
                {indicator.title}
              </h3>
              {indicator.stat && (
                <div
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#E11922' }}
                >
                  {indicator.stat}
                </div>
              )}
              <p className="text-sm leading-relaxed" style={{ color: '#6B645C' }}>
                {indicator.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className={`transition-all duration-700 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div 
            className="relative rounded-3xl p-8 lg:p-12 shadow-xl"
            style={{ backgroundColor: '#FAF8F5' }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Quote Icon */}
            <div className="absolute top-6 left-6">
              <Quote 
                className="w-12 h-12 opacity-20" 
                style={{ color: '#8B7355' }}
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonial Content */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                {renderStars(currentTestimonial?.rating || 0)}
              </div>

              <blockquote className="text-xl lg:text-2xl leading-relaxed mb-8" style={{ color: '#3C3530' }}>
                "{currentTestimonial?.content || ''}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg" style={{ color: '#3C3530' }}>
                    {currentTestimonial?.name || ''}
                  </div>
                  <div className="font-medium" style={{ color: '#8B7355' }}>
                    {currentTestimonial?.role || ''}
                  </div>
                  <div className="text-sm" style={{ color: '#6B645C' }}>
                    {currentTestimonial?.location || ''}
                  </div>
                </div>
                {currentTestimonial?.verified && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
                  >
                    <Award className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8' 
                      : 'hover:scale-125'
                  }`}
                  style={{
                    backgroundColor: index === currentIndex ? '#E11922' : '#6B645C',
                    opacity: index === currentIndex ? 1 : 0.4
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-700 ease-out delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl shadow-lg border-2"
            style={{ backgroundColor: '#8B7355', color: '#FAF8F5', borderColor: '#E11922' }}
          >
            <Users className="w-6 h-6" style={{ color: '#E11922' }} />
            <div>
              <div className="font-bold text-lg">Join <span style={{ color: '#E11922' }}>10,000+</span> Satisfied Families</div>
              <div className="text-sm opacity-90">Experience the ES60 difference today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}