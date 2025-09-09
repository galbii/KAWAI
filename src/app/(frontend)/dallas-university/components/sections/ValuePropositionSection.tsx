import { GraduationCap, Piano, Shield, Phone } from 'lucide-react';
import { trackKawaiEvent } from '../lib/analytics';

export default function ValuePropositionSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      
      {/* Background Image */}
      <div className="value-prop-background-fixed"></div>
      
      {/* Simple Dark Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>
    
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 opacity-0 animate-fade-in-up">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Special University Pricing
          </h2>
          <p className="font-body text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Exclusive savings for the UTD community with flexible financing options
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
          
          {/* University Pricing */}
          <div className="text-center space-y-4 md:space-y-6 opacity-0 animate-fade-in-up [animation-delay:200ms]">
            <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="font-heading text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                University Pricing
              </h3>
              <p className="font-body text-white/80 leading-relaxed text-sm sm:text-base max-w-xs mx-auto">
                Exclusive discounts for UTD students, faculty, and staff with special financing available
              </p>
            </div>
          </div>

          {/* Premium Selection */}
          <div className="text-center space-y-4 md:space-y-6 opacity-0 animate-fade-in-up [animation-delay:400ms]">
            <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
              <Piano className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="font-heading text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                Premium Selection
              </h3>
              <p className="font-body text-white/80 leading-relaxed text-sm sm:text-base max-w-xs mx-auto">
                Hand-selected KAWAI pianos offering exceptional value with professional-grade performance and complimentary delivery & tuning
              </p>
            </div>
          </div>

          {/* Protection & Support */}
          <div className="text-center space-y-4 md:space-y-6 opacity-0 animate-fade-in-up [animation-delay:600ms]">
            <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="font-heading text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                Protection & Support
              </h3>
              <p className="font-body text-white/80 leading-relaxed text-sm sm:text-base max-w-xs mx-auto">
                Comprehensive warranties, ongoing support, and free professional tuning to protect your investment for years to come
              </p>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center opacity-0 animate-fade-in-up [animation-delay:800ms]">
          <div className="max-w-2xl mx-auto mb-6">
            <p className="font-body text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
              Don&apos;t miss this limited-time opportunity to own a world-class KAWAI piano at university pricing.
            </p>
            <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Limited Dallas appointment slots - UTD priority access</span>
            </div>
          </div>
          <a 
            href="tel:9726452514"
            onClick={() => trackKawaiEvent.callPhone('value_proposition_section')}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 sm:px-8 py-3 sm:py-4 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 transform"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <div className="text-left">
              <p className="font-body text-white/70 text-xs sm:text-sm">
                Call now for appointment priority - Dallas event
              </p>
              <p className="font-heading text-white text-base sm:text-lg font-medium">
                (972) 645-2514
              </p>
            </div>
          </a>
          <p className="text-white/60 text-xs sm:text-sm mt-3">
            UTD partnership exclusive • Only 8 Dallas appointment slots remaining
          </p>
        </div>

      </div>
    </section>
  );
}