export function ShigeruContactBox() {
  return (
    <section
      id="contact"
      aria-label="Contact Shigeru Kawai"
      className="bg-[#0a0a0a] sk-section border-t border-white/[0.06]"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — heading copy */}
          <div className="lg:pt-2">
            <p
              className="text-kawai-gold text-[11px] tracking-[0.5em] uppercase mb-8"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              Private Inquiry
            </p>
            <h2
              className="text-white font-extrabold uppercase leading-[0.9] mb-8"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(2.6rem, 4.5vw, 4rem)',
                letterSpacing: '0.04em',
              }}
            >
              Get in Touch
            </h2>
            <p
              className="text-white/55 text-base leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Shigeru Kawai grand pianos are available by private appointment through our network of
              45 authorized dealers across North America.
            </p>
          </div>

          {/* Right — contact links */}
          <div className="flex flex-col gap-10 lg:pt-2">
            <div className="flex flex-col gap-3">
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                General Inquiries
              </p>
              <a
                href="mailto:technical@shigerukawai.com"
                className="text-white/70 hover:text-kawai-gold transition-colors duration-300 text-base"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                technical@shigerukawai.com
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <p
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Technical Support
              </p>
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                For technical questions, visit our support center.
              </p>
              <a
                href="https://kawaius.com/support"
                className="inline-flex items-center gap-2 text-white/70 hover:text-kawai-gold transition-colors duration-300 text-sm"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                kawaius.com/support →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
