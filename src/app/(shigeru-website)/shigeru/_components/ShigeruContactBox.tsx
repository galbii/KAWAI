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
      className="bg-[#0a0a0a] sk-section"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — heading copy */}
          <div className="lg:pt-2">
            <p
              className="sk-eyebrow text-kawai-gold mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Private Inquiry
            </p>
            <h2
              className="text-white font-light italic leading-tight mb-8"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              }}
            >
              Arrange a Private
              <br />
              Audition
            </h2>
            <p
              className="text-white/35 text-sm leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Shigeru Kawai grand pianos are available by private appointment through our network of
              45 authorized dealers across North America.
            </p>
            <a
              href="mailto:contact@kawaius.com"
              className="inline-flex items-center gap-2 text-kawai-gold/50 hover:text-kawai-gold transition-colors duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.6875rem', letterSpacing: '0.15em' }}
            >
              contact@kawaius.com
            </a>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              /* Success state */
              <div className="border border-kawai-gold/20 p-10 flex flex-col items-start gap-6">
                <span className="sk-rule w-10" />
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
                  className="text-white/40 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {result?.message ?? 'A Shigeru Kawai specialist will be in touch shortly.'}
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }}
                  className="mt-2 sk-eyebrow text-white/25 hover:text-kawai-gold transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.3em' }}
                >
                  Send another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sk-name"
                    className="sk-eyebrow text-white/30"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.35em' }}
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
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-sm py-3 outline-none placeholder:text-white/20 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sk-email"
                    className="sk-eyebrow text-white/30"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.35em' }}
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
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-sm py-3 outline-none placeholder:text-white/20 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="sk-message"
                    className="sk-eyebrow text-white/30"
                    style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.35em' }}
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
                    className="bg-transparent border-b border-white/15 focus:border-kawai-gold text-white text-sm py-3 outline-none placeholder:text-white/20 transition-colors duration-300 resize-none"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && result && (
                  <p
                    className="text-red-400/70 text-xs"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {result.message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="self-start mt-2 inline-flex items-center gap-3 border border-kawai-gold/40 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-9 py-4 transition-all duration-300 disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
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
