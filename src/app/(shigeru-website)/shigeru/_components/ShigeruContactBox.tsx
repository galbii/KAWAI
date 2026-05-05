'use client'

import { useState } from 'react'
import { submitShigeruContact } from '../_actions/contact'
import type { ShigeruContactResult } from '../_actions/contact'

type FormState = {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ShigeruContactBox() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ShigeruContactResult | null>(null)

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await submitShigeruContact({
        name: form.name,
        email: form.email,
        pianoInterest: 'general',
        message: form.message,
      })
      setResult(res)
      setStatus(res.success ? 'success' : 'error')
    } catch {
      setStatus('error')
      setResult({ success: false, message: 'Something went wrong. Please try again.' })
    }
  }

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
            <a
              href="mailto:contact@kawaius.com"
              className="inline-flex items-center gap-2 text-white/35 hover:text-kawai-gold transition-colors duration-300"
              style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              contact@kawaius.com
            </a>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              /* Success state */
              <div className="border border-kawai-gold/25 p-10 flex flex-col items-start gap-6">
                <span className="block h-px w-10 bg-kawai-gold opacity-40" />
                <p
                  className="text-white font-light italic"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                  }}
                >
                  Thank you, {form.name.split(' ')[0] ?? form.name}.
                </p>
                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {result?.message ?? 'A Shigeru Kawai specialist will be in touch shortly.'}
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }}
                  className="mt-2 text-white/30 hover:text-kawai-gold transition-colors duration-300 text-[10px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  Send another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

                {/* Name */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="sk-name"
                    className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                    style={{ fontFamily: 'var(--font-oswald)' }}
                  >
                    Full Name
                  </label>
                  <input
                    id="sk-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your name"
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-base py-3 outline-none placeholder:text-white/25 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="sk-email"
                    className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                    style={{ fontFamily: 'var(--font-oswald)' }}
                  >
                    Email Address
                  </label>
                  <input
                    id="sk-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="your@email.com"
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-base py-3 outline-none placeholder:text-white/25 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="sk-message"
                    className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase"
                    style={{ fontFamily: 'var(--font-oswald)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="sk-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us which model interests you, or ask a question…"
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-base py-3 outline-none placeholder:text-white/25 transition-colors duration-300 resize-none leading-relaxed"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && result && (
                  <p
                    className="text-red-400/70 text-sm"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {result.message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="self-start mt-2 inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-10 py-5 transition-all duration-300 disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
