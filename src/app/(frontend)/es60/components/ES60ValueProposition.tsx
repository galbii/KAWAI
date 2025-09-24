'use client';

import { useState, useEffect } from 'react';
import { Star, Award, Music, Users, GraduationCap, Heart } from 'lucide-react';

// Demographic detection types
type DemographicType = 'adult-beginner' | 'education-parent' | 'rediscovering-adult' | 'college-student' | 'default';

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface DemographicContent {
  headline: string;
  subheadline: string;
  valueProps: ValueProp[];
  competitiveNote: string;
  priceContext: string;
}

export function ES60ValueProposition() {
  const [demographic, setDemographic] = useState<DemographicType>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple demographic detection based on URL params or user behavior
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const age = urlParams.get('age');
    
    if (source === 'education' || urlParams.get('type') === 'parent') {
      setDemographic('education-parent');
    } else if (age && parseInt(age) > 45) {
      setDemographic('rediscovering-adult');
    } else if (source === 'student' || urlParams.get('type') === 'student') {
      setDemographic('college-student');
    } else {
      setDemographic('adult-beginner'); // Default to primary demographic
    }

    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getDemographicContent = (): DemographicContent => {
    switch (demographic) {
      case 'education-parent':
        return {
          headline: "Give Your Child the Musical Foundation That Lasts",
          subheadline: "Teachers recommend starting with quality - the ES60 delivers professional sound that inspires proper technique and musical growth.",
          valueProps: [
            {
              icon: <GraduationCap className="w-8 h-8" />,
              title: "Teacher-Recommended Quality",
              description: "Music educators choose Kawai for proper technique development and authentic piano sound.",
              highlight: "95% of teachers prefer"
            },
            {
              icon: <Music className="w-8 h-8" />,
              title: "Same Sound as $2,000+ Models",
              description: "Shigeru Kawai SK-EX concert grand samples - the same premium sound found in our professional models.",
              highlight: "$1,500 savings"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Dual Headphone Outputs",
              description: "Perfect for lessons - teacher and student can both hear every nuance, anytime.",
              highlight: "Lesson-optimized"
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "Weighted Keys Build Strength",
              description: "Responsive Hammer Lite action teaches proper finger technique from day one.",
              highlight: "Future-proof learning"
            }
          ],
          competitiveNote: "Compare: Yamaha P-225 ($699) lacks authentic samples. Roland FP-30X ($749) missing dual headphones.",
          priceContext: "Professional-grade education tool, not just a beginner keyboard."
        };

      case 'rediscovering-adult':
        return {
          headline: "Sophisticated Sound for Discerning Adults",
          subheadline: "Never too late for concert quality. Rediscover music with the sound professionals choose, designed for adult sophistication.",
          valueProps: [
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Cognitive Health Benefits",
              description: "Piano playing enhances memory, coordination, and mental agility at any age.",
              highlight: "Scientifically proven"
            },
            {
              icon: <Music className="w-8 h-8" />,
              title: "Concert Grand Heritage",
              description: "Authentic Shigeru Kawai SK-EX samples - the same piano used in concert halls worldwide.",
              highlight: "World-class sound"
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "Premium Touch, Portable Design",
              description: "Weighted keys with authentic feel, only 24 lbs for easy placement anywhere in your home.",
              highlight: "No compromise quality"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Silent Practice Freedom",
              description: "High-quality headphone experience lets you practice anytime without disturbing others.",
              highlight: "Apartment-friendly"
            }
          ],
          competitiveNote: "Superior to many acoustic uprights costing $3,000+. More sophisticated than basic digital pianos.",
          priceContext: "Investment in personal enrichment and cognitive wellness."
        };

      case 'college-student':
        return {
          headline: "Studio Sound for Student Budget",
          subheadline: "24 lbs of professional quality. Dorm-friendly design with the same premium sound found in $2,000+ models.",
          valueProps: [
            {
              icon: <Music className="w-8 h-8" />,
              title: "Portable Powerhouse",
              description: "Only 24 lbs but delivers full 88-key weighted action and concert grand sound.",
              highlight: "Dorm-room friendly"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Social & Practice Ready",
              description: "Dual headphone outputs for jamming with friends or quiet late-night practice.",
              highlight: "Roommate approved"
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "Professional Credibility",
              description: "Kawai heritage and Shigeru Kawai samples give you serious musician credibility.",
              highlight: "Artist-level quality"
            },
            {
              icon: <GraduationCap className="w-8 h-8" />,
              title: "Future Investment",
              description: "Quality that grows with your skills - from beginner to advanced performance.",
              highlight: "Long-term value"
            }
          ],
          competitiveNote: "Better value than P-225 or FP-30X. Sounds better than most acoustic pianos on campus.",
          priceContext: "Smart investment in your musical future and creative expression."
        };

      default: // adult-beginner
        return {
          headline: "Professional Sound Made Accessible",
          subheadline: "Start with the sound professionals choose. Concert grand heritage meets accessible excellence at $499.",
          valueProps: [
            {
              icon: <Star className="w-8 h-8" />,
              title: "Same Sound as $2,000+ Models",
              description: "Authentic Shigeru Kawai SK-EX concert grand samples - premium quality at an accessible price.",
              highlight: "75% savings"
            },
            {
              icon: <Music className="w-8 h-8" />,
              title: "Weighted Keys Teach Proper Technique",
              description: "Responsive Hammer Lite action builds finger strength and teaches authentic piano touch.",
              highlight: "Learn correctly from day one"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Silent Practice, Full Experience",
              description: "High-quality headphone experience with professional sound isolation.",
              highlight: "Practice anytime"
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: "Ultra-Portable Quality",
              description: "Only 24 lbs - easily portable for lessons, moving, or different practice spaces.",
              highlight: "Take it anywhere"
            }
          ],
          competitiveNote: "Compare: Yamaha P-225 ($699) and Roland FP-30X ($749) cost more with inferior sound quality.",
          priceContext: "Professional quality without the premium price."
        };
    }
  };

  const content = getDemographicContent();

  return (
    <section className="py-20" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#3C3530' }}>
            {content.headline}
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#6B645C' }}>
            {content.subheadline}
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {content.valueProps.map((prop, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                backgroundColor: '#F5F2ED',
                transitionDelay: `${200 + index * 100}ms`
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: '#9CAF88', color: '#3C3530' }}
                >
                  {prop.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#3C3530' }}>
                    {prop.title}
                  </h3>
                  {prop.highlight && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                      style={{ backgroundColor: '#E11922', color: '#FAF8F5' }}
                    >
                      {prop.highlight}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-lg leading-relaxed" style={{ color: '#6B645C' }}>
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        {/* Competitive Context & Pricing */}
        <div className={`transition-all duration-700 ease-out delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div 
            className="rounded-2xl p-8 text-center shadow-lg"
            style={{ backgroundColor: '#8B7355' }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#FAF8F5' }}>
              Why ES60 Wins
            </h3>
            <p className="text-lg mb-4" style={{ color: '#F5F2ED' }}>
              {content.competitiveNote}
            </p>
            <div className="border-t pt-4" style={{ borderColor: '#E11922' }}>
              <p className="text-xl font-semibold" style={{ color: '#FAF8F5' }}>
                Starting at <span style={{ color: '#E11922', backgroundColor: '#FAF8F5', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>$499</span> - {content.priceContext}
              </p>
            </div>
          </div>
        </div>

        {/* Heritage Badge */}
        <div className={`mt-12 text-center transition-all duration-700 ease-out delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2"
            style={{ backgroundColor: '#5D4E37', color: '#FAF8F5', borderColor: '#E11922' }}
          >
            <Award className="w-5 h-5" style={{ color: '#E11922' }} />
            <span className="font-semibold">97 Years of <span style={{ color: '#E11922' }}>Kawai</span> Excellence • Concert Grand Heritage</span>
          </div>
        </div>
      </div>
    </section>
  );
}