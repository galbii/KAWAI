import { GraduationCap, Piano, Shield, Phone } from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import type { ValueProp } from '../../event.config';

const iconMap: Record<ValueProp['icon'], ComponentType<{ className?: string; style?: CSSProperties }>> = {
  'graduation-cap': GraduationCap,
  'piano': Piano,
  'shield': Shield,
};

const animationDelays = ['[animation-delay:200ms]', '[animation-delay:400ms]', '[animation-delay:600ms]'];

interface ValuePropositionSectionProps { valueProps: ValueProp[]; phone: string; note: string }

export default function ValuePropositionSection({ valueProps, phone, note }: ValuePropositionSectionProps) {
  const phoneDigits = phone.replace(/\D/g, '');

  return (
    <section className="relative overflow-hidden py-16 lg:py-20 border-t border-[rgba(77,25,121,0.12)]" style={{ background: '#FAFAFE' }}>

      <span
        aria-hidden="true"
        className="font-script absolute pointer-events-none select-none"
        style={{
          right: '-2%',
          left: 'auto',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(200px, 35vw, 500px)',
          fontWeight: 400,
          lineHeight: 0.85,
          whiteSpace: 'nowrap',
          color: 'rgba(77,25,121,0.05)',
          zIndex: 0,
        }}
      >
        MUSIC
      </span>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 opacity-0 animate-fade-in-up">
          <p className="text-xs tracking-[0.2em] uppercase font-light mb-4" style={{ color: 'rgba(26,13,46,0.45)' }}>
            Why Choose This Event
          </p>
          <h2 className="font-heading italic text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight" style={{ color: '#1a0d2e' }}>
            Special University Pricing
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#3a2060' }}>
            Exclusive savings for the TSU community with flexible financing options
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">

          {valueProps.map((prop, index) => {
            const Icon = iconMap[prop.icon];
            const delay = animationDelays[index] ?? '';
            return (
              <div
                key={index}
                className={`text-center space-y-4 md:space-y-6 opacity-0 animate-fade-in-up rounded-lg p-6 border ${delay}`}
                style={{ background: '#F4F0FB', borderColor: 'rgba(77,25,121,0.15)' }}
              >
                <div className="flex justify-center">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center border"
                    style={{ background: 'rgba(77,25,121,0.1)', borderColor: 'rgba(77,25,121,0.25)' }}
                  >
                    <Icon className="w-7 h-7 text-[#4D1979]" />
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold" style={{ color: '#1a0d2e' }}>
                    {prop.title}
                  </h3>
                  <p className="leading-relaxed text-sm sm:text-base max-w-xs mx-auto" style={{ color: 'rgba(26,13,46,0.65)' }}>
                    {prop.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center opacity-0 animate-fade-in-up [animation-delay:800ms]">
          <div className="max-w-2xl mx-auto mb-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 border"
              style={{ background: 'rgba(77,25,121,0.04)', borderColor: 'rgba(77,25,121,0.15)' }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4D1979' }}></div>
              <span className="text-sm font-medium" style={{ color: 'rgba(26,13,46,0.45)' }}>{note}</span>
            </div>
          </div>
          <a
            href={`tel:${phoneDigits}`}
            onClick={() => {}}
            className="inline-flex items-center gap-3 rounded-xl px-6 sm:px-8 py-3 sm:py-4 border transition-all duration-300 group"
            style={{ background: '#F4F0FB', borderColor: 'rgba(77,25,121,0.2)' }}
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#4D1979' }} />
            <div className="text-left">
              <p className="text-xs sm:text-sm" style={{ color: 'rgba(26,13,46,0.45)' }}>
                Call now
              </p>
              <p className="font-heading text-base sm:text-lg font-medium transition-colors" style={{ color: '#1a0d2e' }}>
                {phone}
              </p>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}
