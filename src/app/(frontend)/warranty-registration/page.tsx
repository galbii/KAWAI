import type { Metadata } from 'next'
import { getRegisterConfig } from '@/components/layout/header-dynamic'
import { WarrantyRegistrationForm } from '@/components/warranty/WarrantyRegistrationForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Warranty Registration | KAWAI Piano',
  description: 'Register your KAWAI piano to activate your warranty and unlock exclusive owner benefits.',
}

const DEFAULT_EMBED_URL = 'https://js.hsforms.net/forms/embed/21987263.js'
const DEFAULT_FORM_ID = '2d83f40a-44fe-421e-a4a5-3b4efcd80100'
const DEFAULT_PORTAL_ID = '21987263'
const DEFAULT_REGION = 'na1'

const benefits = [
  {
    num: '01',
    title: 'Warranty Activation',
    body: 'Secure full manufacturer coverage from your purchase date — protecting your instrument for years to come.',
  },
  {
    num: '02',
    title: 'Owner Communications',
    body: 'Receive care guides, firmware updates, and exclusive offers crafted specifically for KAWAI owners.',
  },
  {
    num: '03',
    title: 'Learn with the Best',
    body: 'Unlock access to TomPlay, PianoMarvel, and Skoove — premium learning platforms included with your registration.',
  },
]

export default async function WarrantyRegistrationPage() {
  const config = await getRegisterConfig()

  const scriptUrl = config.hubspotEmbedUrl ?? DEFAULT_EMBED_URL
  const formId = config.hubspotFormId ?? DEFAULT_FORM_ID
  const portalId = config.hubspotPortalId ?? DEFAULT_PORTAL_ID
  const region = config.hubspotRegion ?? DEFAULT_REGION
  const bannerImageUrl = config.bannerImageUrl

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1E1B16]" style={{ minHeight: '380px' }}>
        {/* Banner image — no overlay, shown at full opacity */}
        {bannerImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Fine horizontal rule at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, #E11922 0%, rgba(225,25,34,0.15) 60%, transparent 100%)' }} />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10" style={{ paddingTop: '96px', paddingBottom: '80px' }}>
          {/* Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-brand-sans)',
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#E11922',
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}
          >
            Warranty Registration
          </h1>

          {/* Sub-copy */}
          <p
            className="mt-5 max-w-md leading-relaxed"
            style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '14px', color: '#FAF8F5', opacity: 0.65, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
          >
            Activate your warranty and claim your free trial for TomPlay, PianoMarvel, and Skoove.
          </p>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 sm:px-10 py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] lg:gap-20">

          {/* LEFT — editorial benefit list */}
          <div className="order-2 lg:order-1 lg:pt-2">

            <p
              className="mb-10 text-[#1E1B16]/40 leading-relaxed max-w-sm"
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '13px' }}
            >
              Your registration takes less than two minutes and ensures your piano is covered from the moment you play.
            </p>

            {/* Benefit items */}
            <div className="space-y-0">
              {benefits.map((item, i) => (
                <div
                  key={item.num}
                  className="group relative flex gap-8 py-8"
                  style={{ borderTop: '1px solid #DBDBDB' }}
                >
                  {/* Ordinal number */}
                  <span
                    className="flex-shrink-0 select-none"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#E11922',
                      letterSpacing: '0.05em',
                      paddingTop: '3px',
                      opacity: 0.7,
                    }}
                  >
                    {item.num}
                  </span>

                  {/* Text */}
                  <div>
                    <p
                      className="mb-1.5"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: '19px',
                        fontWeight: 400,
                        color: '#1E1B16',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-brand-sans)',
                        fontSize: '13px',
                        color: '#1E1B16',
                        opacity: 0.5,
                        maxWidth: '340px',
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
              {/* Final rule */}
              <div style={{ borderTop: '1px solid #DBDBDB' }} />
            </div>

            {/* Fine print */}
            <p
              className="mt-10"
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '11px', color: '#1E1B16', opacity: 0.3, lineHeight: 1.7 }}
            >
              Kawai America Corporation. All registrations are processed securely.<br />
              Your information is never sold or shared with third parties.
            </p>
          </div>

          {/* RIGHT — form card */}
          <div className="order-1 lg:order-2">
            <div
              style={{
                background: '#fff',
                border: '1px solid #DBDBDB',
                boxShadow: '0 2px 40px rgba(30,27,22,0.07), 0 1px 4px rgba(30,27,22,0.04)',
              }}
            >
              {/* Card header stripe */}
              <div
                style={{
                  background: '#1E1B16',
                  padding: '24px 32px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-brand-sans)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#E11922',
                    margin: '0 0 6px',
                  }}
                >
                  Warranty Registration
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#FAF8F5',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Complete Your Registration
                </p>
              </div>

              {/* Form area */}
              <div style={{ padding: '32px' }}>
                <WarrantyRegistrationForm
                  scriptUrl={scriptUrl}
                  formId={formId}
                  portalId={portalId}
                  region={region}
                />
              </div>
            </div>
          </div>

        </div>
      </section>


    </main>
  )
}
