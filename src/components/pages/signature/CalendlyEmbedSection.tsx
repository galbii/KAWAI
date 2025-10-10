'use client'

import { useState } from 'react'
import { CalendlyBookingWidget } from './CalendlyBookingWidget'
import { QuickContactModal, type QuickContactData } from './QuickContactModal'
import { motion } from 'framer-motion'

interface CalendlyEmbedSectionProps {
  slug: string
  calendlyUrl?: string
}

/**
 * CalendlyEmbedSection - Direct Calendly widget embed for signature2 page
 *
 * This component replaces the full SignatureExperience flow with a direct
 * inline Calendly booking widget. Used exclusively on the signature2 page
 * to provide a streamlined booking experience without the assessment flow.
 */
export function CalendlyEmbedSection({
  slug,
  calendlyUrl = 'https://calendly.com/kawaipianogallery/dallas-baby-grand-sale-clone'
}: CalendlyEmbedSectionProps) {

  const [showQuickContact, setShowQuickContact] = useState(false)
  const [contactData, setContactData] = useState<QuickContactData | null>(null)
  const [showCalendly, setShowCalendly] = useState(false)

  // NOTE: Constant Contact integration is handled internally by CalendlyBookingWidget
  // No need for separate integration here to avoid duplicate submissions

  // Handle quick contact form submission
  const handleQuickContactSubmit = (data: QuickContactData) => {
    console.log('✅ Contact form submitted for inline booking:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || '[NOT PROVIDED]'
    })

    // Store contact data
    setContactData(data)

    // Close modal and show Calendly
    setShowQuickContact(false)
    setShowCalendly(true)

    console.log('🎯 Showing Calendly inline with pre-filled data')
  }

  // Handle Calendly booking completion
  // NOTE: All tracking (Meta Pixel, PostHog, Constant Contact) is handled
  // internally by CalendlyBookingWidget. This callback is just for logging.
  const handleCalendlyBooking = async (eventData: any) => {
    console.log('✅ Inline Calendly booking completed:', eventData)
    console.log('📊 Tracking handled by CalendlyBookingWidget: Meta Pixel SubmitApplication + PostHog signature_dallas_booking + Constant Contact')
    console.log('📧 Contact data passed via prefillData:', {
      email: contactData?.email ? '[PRESENT]' : '[MISSING]',
      firstName: contactData?.firstName ? '[PRESENT]' : '[MISSING]',
      lastName: contactData?.lastName ? '[PRESENT]' : '[MISSING]',
      phone: contactData?.phone ? '[PRESENT]' : '[MISSING]'
    })
  }

  return (
    <section className="relative bg-gradient-to-b from-kawai-black via-gray-900 to-kawai-black py-16 md:py-24">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-kawai-gold/5 via-transparent to-transparent opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-kawai-pearl mb-4">
            <span className="text-kawai-red">Signature</span> Event
          </h2>
          <p className="text-kawai-pearl/70 text-lg md:text-xl max-w-2xl mx-auto">
            Secure your special financing, tuning, and delivery priority
          </p>
        </motion.div>

        {/* Calendly Widget Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/50 to-kawai-black/50 rounded-2xl border border-kawai-gold/20 overflow-hidden shadow-2xl backdrop-blur-sm"
        >
          {!showCalendly ? (
            /* CTA to open contact form */
            <div className="min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-light text-kawai-pearl mb-4">
                Ready to Reserve Your <span className="text-kawai-gold">Exclusive</span> Appointment?
              </h3>
              <p className="text-kawai-pearl/70 text-lg mb-8 max-w-xl">
                Complete a quick form and we'll show you available times for your private consultation.
              </p>
              <motion.button
                onClick={() => setShowQuickContact(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-kawai-gold to-kawai-gold/90 text-kawai-black rounded-lg font-medium tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          ) : (
            /* Inline Calendly Widget (after contact form submitted) */
            <div className="min-h-[700px] md:min-h-[800px]">
              <CalendlyBookingWidget
                isOpen={true}
                onClose={() => {}} // Not needed for inline mode
                signaturePageSlug={slug}
                calendlyUrl={calendlyUrl}
                displayMode="inline"
                className="w-full h-full"
                {...(contactData && {
                  prefillData: {
                    email: contactData.email,
                    firstName: contactData.firstName,
                    lastName: contactData.lastName,
                    name: `${contactData.firstName} ${contactData.lastName}`,
                    ...(contactData.phone && { phone: contactData.phone })
                  }
                })}
                onEventScheduled={handleCalendlyBooking}
              />
            </div>
          )}
        </motion.div>

        {/* Quick Contact Modal */}
        <QuickContactModal
          isOpen={showQuickContact}
          onClose={() => setShowQuickContact(false)}
          onSubmit={handleQuickContactSubmit}
          loading={false}
        />

        {/* Optional: Trust indicators below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-kawai-pearl/60 text-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-kawai-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Commitment Required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-kawai-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Private Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-kawai-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Expert Guidance</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}