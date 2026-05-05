import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Shigeru Kawai | Sales & Technical Inquiries',
  description:
    "Contact the Shigeru Kawai team for sales inquiries, technical assistance, or to learn more about the world's premier handcrafted grand pianos.",
}

const contactOptions = [
  {
    category: 'Sales Inquiries',
    value: '+1 310-631-1771',
    note: 'Press 3 for Sales',
    description:
      'Speak directly with a Shigeru Kawai sales specialist. Available Monday through Friday, 9 AM – 5 PM Pacific.',
  },
  {
    category: 'Technical Assistance',
    value: '+1 310-761-6883',
    note: 'Direct Line',
    description:
      'For warranty service, regulation inquiries, and technical questions about your Shigeru Kawai instrument.',
  },
  {
    category: 'Mailing Address',
    value: '2055 E University Dr',
    note: 'Rancho Dominguez, CA 90220',
    description:
      'Kawai America Corporation. Written correspondence and institutional procurement inquiries welcome.',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-36 pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(213,199,140,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <p
            className="text-kawai-charcoal/30 text-[11px] tracking-[0.55em] uppercase mb-14"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Shigeru Kawai
          </p>
          <h1
            className="text-kawai-black font-extrabold uppercase leading-none mb-10"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              letterSpacing: '0.04em',
            }}
          >
            Get in Touch
          </h1>
          <span className="block h-px w-14 bg-kawai-gold mb-10" style={{ opacity: 0.4 }} />
          <p
            className="text-kawai-charcoal/45 text-sm"
            style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
          >
            We welcome your inquiry and respond within one business day
          </p>
        </div>
      </section>

      {/* ── CONTACT OPTIONS ──────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="flex items-center gap-6 mb-20">
            <p
              className="text-kawai-gold text-[11px] tracking-[0.5em] uppercase whitespace-nowrap"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              Direct Contact
            </p>
            <span className="block h-px flex-1 bg-white/[0.07]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {contactOptions.map((option) => (
              <div
                key={option.category}
                className="bg-[#0a0a0a] px-10 py-14 flex flex-col"
              >
                <span className="block w-8 h-px bg-kawai-gold opacity-50 mb-8" />
                <p
                  className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-6"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  {option.category}
                </p>
                <p
                  className="text-white font-bold uppercase leading-tight mb-3"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {option.value}
                </p>
                <p
                  className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-8"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  {option.note}
                </p>
                <p
                  className="text-white/50 text-sm leading-relaxed mt-auto"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────── */}
      <section className="bg-white px-6 py-28 border-t border-kawai-black/[0.07]">
        <div className="max-w-2xl mx-auto">

          {/* Section header */}
          <div className="mb-16">
            <p
              className="text-kawai-gold text-[11px] tracking-[0.5em] uppercase mb-8"
              style={{ fontFamily: 'var(--font-oswald)' }}
            >
              Send a Message
            </p>
            <h2
              className="text-kawai-black font-bold uppercase leading-tight"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                letterSpacing: '0.05em',
              }}
            >
              We Respond Within<br />One Business Day
            </h2>
          </div>

          <form className="flex flex-col gap-8">

            {/* Name */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="name"
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-kawai-black/15 focus:border-kawai-gold text-kawai-black text-base px-0 py-3 outline-none transition-colors duration-300 placeholder:text-kawai-charcoal/30"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="email"
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-kawai-black/15 focus:border-kawai-gold text-kawai-black text-base px-0 py-3 outline-none transition-colors duration-300 placeholder:text-kawai-charcoal/30"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="phone"
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (000) 000-0000"
                className="w-full bg-transparent border-b border-kawai-black/15 focus:border-kawai-gold text-kawai-black text-base px-0 py-3 outline-none transition-colors duration-300 placeholder:text-kawai-charcoal/30"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="department"
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Department
              </label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  className="w-full appearance-none bg-transparent border-b border-kawai-black/15 focus:border-kawai-gold text-kawai-black text-base px-0 py-3 outline-none transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  <option value="">Select a department</option>
                  <option value="sales">Sales</option>
                  <option value="technical">Technical</option>
                  <option value="dealer">Dealer Inquiry</option>
                  <option value="other">Other</option>
                </select>
                <span
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-kawai-gold/40 text-sm"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="message"
                className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us about your inquiry…"
                className="w-full bg-transparent border-b border-kawai-black/15 focus:border-kawai-gold text-kawai-black text-base px-0 py-3 outline-none transition-colors duration-300 placeholder:text-kawai-charcoal/30 resize-none leading-relaxed"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] py-5 transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
              >
                Send Inquiry
              </button>
            </div>

            <p
              className="text-kawai-charcoal/30 text-xs text-center tracking-wide"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Your information is kept strictly confidential and will not be shared with third parties.
            </p>
          </form>
        </div>
      </section>

      {/* ── DEALER LOCATOR CTA ───────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-28 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-12" />
          <p
            className="text-kawai-gold text-[11px] tracking-[0.5em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Visit in Person
          </p>
          <h2
            className="text-white font-bold uppercase leading-tight mb-8"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              letterSpacing: '0.05em',
            }}
          >
            Find a Dealer Near You
          </h2>
          <p
            className="text-white/55 text-base leading-relaxed mb-12 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            45 authorized Shigeru Kawai dealers across North America are ready to introduce you to
            the world&apos;s finest handcrafted grand pianos.
          </p>
          <Link
            href="/shigeru/dealers"
            className="inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-10 py-5 transition-all duration-300"
            style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
          >
            Find an Authorized Dealer
          </Link>
          <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mt-12" />
        </div>
      </section>

    </div>
  )
}
