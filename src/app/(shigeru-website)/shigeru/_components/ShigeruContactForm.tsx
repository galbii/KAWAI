export function ShigeruContactForm() {
  return (
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
  )
}
