import { Phone } from 'lucide-react';
import type { ValueProp } from '../../event.config';

interface ValuePropositionSectionProps { valueProps: ValueProp[]; phone: string; note: string }

export default function ValuePropositionSection({ valueProps, phone, note }: ValuePropositionSectionProps) {
  const phoneDigits = phone.replace(/\D/g, '');

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#1a0d2e' }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          opacity: 0.6,
        }}
      />

      {/* Subtle purple gradient bloom — top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(77,25,121,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-20 lg:py-28">

        {/* Eyebrow row */}
        <div className="flex items-center gap-4 mb-16 lg:mb-20">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <p
            className="text-[10px] tracking-[0.35em] uppercase font-[family-name:var(--font-brand-sans)]"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Why this event
          </p>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Heading */}
        <div className="mb-16 lg:mb-20 max-w-xl">
          <h2
            className="font-[family-name:var(--font-family-cormorant)] leading-[1.05] mb-4"
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Exclusive benefits,<br />
            <span style={{ color: 'rgba(180,140,220,0.85)' }}>only at this event.</span>
          </h2>
          <p
            className="text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            Rebates, zero-interest financing, and invitation pricing — unavailable anywhere else.
          </p>
        </div>

        {/* Feature row */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="group relative py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                ...(index > 0
                  ? { borderLeft: '0' }
                  : {}),
              }}
            >
              {/* Vertical divider for md+ */}
              {index > 0 && (
                <div
                  className="hidden md:block absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />
              )}

              {/* Number */}
              <p
                className="font-[family-name:var(--font-family-cormorant)] mb-6 transition-colors duration-500"
                style={{
                  fontSize: 'clamp(5rem, 9vw, 8rem)',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.15)',
                  letterSpacing: '-0.03em',
                }}
              >
                0{index + 1}
              </p>

              {/* Title */}
              <h3
                className="font-[family-name:var(--font-family-cormorant)] mb-3 leading-snug"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                  fontWeight: 500,
                  color: '#ffffff',
                }}
              >
                {prop.title}
              </h3>

              {/* Thin accent line — slides in on hover */}
              <div
                className="mb-5 h-px w-8 transition-all duration-500 group-hover:w-16"
                style={{ background: 'rgba(77,25,121,0.6)' }}
              />

              {/* Description */}
              <p
                className="text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 lg:mt-20 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Note pill */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#7c3aed' }}
            />
            <span
              className="text-[11px] tracking-[0.18em] uppercase font-[family-name:var(--font-brand-sans)]"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {note}
            </span>
          </div>

          {/* Phone — minimal text link */}
          <a
            href={`tel:${phoneDigits}`}
            className="group inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-70"
          >
            <Phone
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: 'rgba(180,140,220,0.7)' }}
            />
            <span
              className="font-[family-name:var(--font-brand-sans)] text-sm tracking-wide"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {phone}
            </span>
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: 'rgba(180,140,220,0.5)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
