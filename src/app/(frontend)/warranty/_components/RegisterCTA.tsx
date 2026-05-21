import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RegisterCTAProps {
  /** "full" (section with heading, detail pages) or "inline" (single line link) */
  variant?: 'full' | 'inline'
}

export function RegisterCTA({ variant = 'full' }: RegisterCTAProps) {
  if (variant === 'inline') {
    return (
      <p className="text-[14px] text-kawai-charcoal/70">
        <span className="font-medium text-kawai-charcoal">New Kawai?</span>{' '}
        <Link href="/warranty-registration" className="text-kawai-red hover:underline">
          Register your piano →
        </Link>
        {' '}so your coverage is on file.
      </p>
    )
  }

  return (
    <section id="register" className="scroll-mt-[8rem]">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-4">
        Register Your Instrument
      </h2>
      <div className="space-y-4 max-w-2xl">
        <p className="text-[15px] text-kawai-charcoal/75 leading-relaxed">
          Activate your warranty by registering your instrument. Registration takes less than two
          minutes, confirms your purchase date, and unlocks owner benefits including free
          learning platform access.
        </p>
        <Link
          href="/warranty-registration"
          className="inline-flex items-center gap-1.5 text-kawai-red hover:text-kawai-red-700 font-semibold text-[15px]"
        >
          Register your Kawai
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
