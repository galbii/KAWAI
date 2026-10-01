'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PromoPopupShell,
  PromoSheetHandle,
  PromoCta,
  PROMO_TOKENS,
  type PromoFrequency,
} from '@/components/ui/promo-popup-shell'

export interface PromoPopupProps {
  /** Full storage key remembering dismissal (e.g. `kawai-product-promo-{slug}`) */
  storageKey: string
  /** Where the CTA button navigates */
  href: string
  /** Popup headline — callers compute their own fallback before passing */
  headline: string
  imageUrl?: string | null | undefined
  /** Alt text for the promo image — defaults to the headline */
  imageAlt?: string | undefined
  /** Small uppercase label above the headline; omitted entirely when empty */
  eyebrow?: string | null | undefined
  message?: string | null | undefined
  ctaLabel?: string | null | undefined
  /** Optional lineage marque row ("{from} → {to}") above the content */
  marque?: { from: string; to: string } | null | undefined
  /** Label for the stay-here text button under the CTA */
  dismissLabel?: string | undefined
  frequency?: PromoFrequency | null | undefined
  delaySeconds?: number | null | undefined
}

/**
 * Single-subject promo modal — image over centered copy and one CTA. Chrome,
 * dismissal memory and a11y come from PromoPopupShell.
 *
 * Used by the collection successor promo (SuccessorPromoPopup wrapper) and the
 * product Promo tab. For a multi-product bundle, use BundlePromoPopup instead.
 */
export function PromoPopup({
  storageKey,
  href,
  headline,
  imageUrl,
  imageAlt,
  eyebrow,
  message,
  ctaLabel,
  marque,
  dismissLabel,
  frequency = 'session',
  delaySeconds = 2,
}: PromoPopupProps) {
  return (
    <PromoPopupShell
      storageKey={storageKey}
      frequency={frequency}
      delaySeconds={delaySeconds}
      labelledBy="kawai-promo-popup-title"
      describedBy={message ? 'kawai-promo-popup-message' : undefined}
      closeOverImage={Boolean(imageUrl)}
    >
      {({ dismiss, reduceMotion, fadeUp }) => (
        <>
          {/* Promo image — settles from a slow zoom, vignette for legibility */}
          {imageUrl && (
            <div className="relative w-full h-[200px] sm:h-[310px] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { scale: 1.08 },
                      animate: { scale: 1 },
                      transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
                    })}
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt || headline}
                  fill
                  sizes="(max-width: 640px) 100vw, 680px"
                  className="object-cover"
                  priority
                />
              </motion.div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.18) 100%)' }}
                aria-hidden
              />
            </div>
          )}

          <PromoSheetHandle />

          {/* Lineage marque — "{from} → {to}" pairing when the promo announces a
              succession. Same hairline-divider motif as the collection page's
              Gallery rule; weight shifts from the outgoing name to the target. */}
          {marque && (
            <motion.div
              {...fadeUp(0)}
              className="flex items-center gap-3 px-7 sm:px-12 pt-6 sm:pt-8"
              style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
            >
              <div className="h-px flex-1 bg-kawai-black/10" aria-hidden />
              <span className="text-[9px] tracking-[0.28em] uppercase font-semibold text-kawai-black/40 whitespace-nowrap">
                {marque.from}
              </span>
              <svg
                viewBox="0 0 26 8"
                className="w-6 h-2.5 text-kawai-red shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M0 4h23M20 1l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px] tracking-[0.28em] uppercase font-bold text-kawai-black whitespace-nowrap">
                {marque.to}
              </span>
              <div className="h-px flex-1 bg-kawai-black/10" aria-hidden />
            </motion.div>
          )}

          {/* Content */}
          <div className="px-7 sm:px-12 pt-6 sm:pt-8 pb-9 sm:pb-11 text-center">
            {eyebrow && (
              <motion.p
                {...fadeUp(1)}
                className="text-[9px] tracking-[0.45em] uppercase font-bold text-kawai-red mb-3.5"
                style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
              >
                {eyebrow}
              </motion.p>
            )}

            <motion.h3
              {...fadeUp(2)}
              id="kawai-promo-popup-title"
              className="text-[28px] sm:text-[36px]"
              style={{
                fontFamily: 'var(--font-brand-luxury, Georgia, serif)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: PROMO_TOKENS.titleColor,
                margin: '0 0 12px',
                letterSpacing: '-0.01em',
              }}
            >
              {headline}
            </motion.h3>

            {message && (
              <motion.p
                {...fadeUp(3)}
                id="kawai-promo-popup-message"
                className="max-w-[460px] mx-auto"
                style={{
                  fontFamily: 'var(--font-brand-sans, system-ui)',
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: PROMO_TOKENS.messageColor,
                  margin: '0 auto 24px',
                  fontWeight: 400,
                }}
              >
                {message}
              </motion.p>
            )}

            <motion.div {...fadeUp(4)}>
              <PromoCta
                href={href}
                label={ctaLabel || 'Learn More'}
                onNavigate={dismiss}
                onDismiss={dismiss}
                dismissLabel={dismissLabel || 'No thanks, continue browsing'}
                className={message ? '' : 'mt-6'}
              />
            </motion.div>
          </div>
        </>
      )}
    </PromoPopupShell>
  )
}
