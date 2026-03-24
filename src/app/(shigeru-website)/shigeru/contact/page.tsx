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
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(213,199,140,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <p
            className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-10"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Get in Touch
          </p>
          <h1
            className="text-white font-light italic leading-[0.9] mb-8"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            }}
          >
            Contact Shigeru Kawai
          </h1>
          <div className="flex items-center justify-center gap-5">
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
            <span
              className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase opacity-60"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              We Welcome Your Inquiry
            </span>
            <span className="block h-px w-16 bg-kawai-gold opacity-30" />
          </div>
        </div>
      </section>

      {/* ── CONTACT OPTIONS ──────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-kawai-charcoal/35 text-[10px] tracking-[0.45em] uppercase text-center mb-16"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Direct Contact
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-kawai-neutral/40">
            {contactOptions.map((option) => (
              <div
                key={option.category}
                className="bg-kawai-pearl px-8 py-12 flex flex-col"
              >
                <span className="block w-6 h-px bg-kawai-gold/40 mb-6" />
                <p
                  className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase mb-5"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontVariant: 'small-caps' }}
                >
                  {option.category}
                </p>
                <p
                  className="text-kawai-black font-light italic leading-tight mb-2"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                  }}
                >
                  {option.value}
                </p>
                <p
                  className="text-kawai-charcoal/50 text-xs tracking-wide mb-6"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {option.note}
                </p>
                <p
                  className="text-kawai-charcoal/55 text-sm leading-relaxed mt-auto"
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
      <section className="bg-[#0a0a0a] px-6 py-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Send a Message
            </p>
            <h2
              className="text-white font-light italic leading-tight"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              }}
            >
              We Respond Within One Business Day
            </h2>
          </div>

          {/* TODO: wire to Server Action */}
          <form className="flex flex-col gap-7">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-kawai-gold/50 text-white/80 px-5 py-4 text-sm outline-none transition-colors duration-200 placeholder:text-white/20"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-kawai-gold/50 text-white/80 px-5 py-4 text-sm outline-none transition-colors duration-200 placeholder:text-white/20"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (000) 000-0000"
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-kawai-gold/50 text-white/80 px-5 py-4 text-sm outline-none transition-colors duration-200 placeholder:text-white/20"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="department"
                className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Department
              </label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] focus:border-kawai-gold/50 text-white/80 px-5 py-4 text-sm outline-none transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  <option value="" className="bg-[#0a0a0a] text-white/60">
                    Select a department
                  </option>
                  <option value="sales" className="bg-[#0a0a0a] text-white/80">
                    Sales
                  </option>
                  <option value="technical" className="bg-[#0a0a0a] text-white/80">
                    Technical
                  </option>
                  <option value="dealer" className="bg-[#0a0a0a] text-white/80">
                    Dealer Inquiry
                  </option>
                  <option value="other" className="bg-[#0a0a0a] text-white/80">
                    Other
                  </option>
                </select>
                {/* Custom dropdown arrow */}
                <span
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-kawai-gold/40"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-kawai-gold text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us about your inquiry…"
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-kawai-gold/50 text-white/80 px-5 py-4 text-sm outline-none transition-colors duration-200 placeholder:text-white/20 resize-none leading-relaxed"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-10 py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Send Inquiry
              </button>
            </div>

            <p
              className="text-white/20 text-[10px] text-center tracking-wide"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Your information is kept strictly confidential and will not be shared with third parties.
            </p>
          </form>
        </div>
      </section>

      {/* ── DEALER LOCATOR CTA ───────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-kawai-charcoal/35 text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Visit in Person
          </p>
          <h2
            className="text-kawai-black font-light italic leading-tight mb-6"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            }}
          >
            Looking for a dealer near you?
          </h2>
          <p
            className="text-kawai-charcoal/55 text-sm leading-relaxed mb-10 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            45 authorized Shigeru Kawai dealers across North America are ready to introduce you to
            the world&apos;s finest handcrafted grand pianos.
          </p>
          <Link
            href="/shigeru/dealers"
            className="inline-flex items-center gap-3 border border-kawai-gold/40 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-10 py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Find an Authorized Dealer
          </Link>
        </div>
      </section>
    </div>
  )
}
