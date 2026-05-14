'use client';

interface Offer {
  label: string;
}

interface BookingSectionProps {
  onOpenConsultation: () => void;
  eventDateDisplay: string;
  offers?: Offer[];
}

const DEFAULT_OFFERS: Offer[] = [
  { label: '0% financing · 36 months' },
  { label: 'Free delivery & setup' },
  { label: 'Expert consultation' },
];

export default function BookingSection({ onOpenConsultation, eventDateDisplay, offers = DEFAULT_OFFERS }: BookingSectionProps) {
  return (
    <section id="booking-consultation" className="border-t border-[rgba(77,25,121,0.12)] py-20 md:py-28" style={{ background: '#FAFAFE' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-10" style={{ background: 'rgba(77,25,121,0.5)' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#4D1979' }} />
          <div className="h-px w-10" style={{ background: 'rgba(77,25,121,0.5)' }} />
        </div>

        <h2
          className="font-heading italic leading-tight mb-6"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#4D1979' }}
        >
          Reserve Your Spot.
        </h2>

        <p style={{ color: '#3a2060' }} className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
          Book a private appointment and lock in exclusive event pricing on Kawai pianos — with free delivery and expert guidance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {offers.map((offer) => (
            <span
              key={offer.label}
              className="px-4 py-1.5 rounded-full text-xs tracking-[0.15em] uppercase font-medium"
              style={{ background: 'rgba(77,25,121,0.07)', border: '1px solid rgba(77,25,121,0.2)', color: '#4D1979' }}
            >
              {offer.label}
            </span>
          ))}
        </div>

        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 group"
          style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '16px 40px', background: '#4D1979', color: 'white', border: 'none' }}
        >
          <span>Book Appointment</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <p className="mt-5 italic" style={{ color: 'rgba(26,13,46,0.40)', fontSize: '13px' }}>
          No commitment required — just come play.
        </p>

      </div>
    </section>
  );
}
