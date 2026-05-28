import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionEyebrowProps = {
  children: ReactNode
  /** 'dark' for light backgrounds (red), 'light' for dark backgrounds (gold). */
  tone?: 'dark' | 'light'
  className?: string
}

/** Uppercase kicker + hairline rule that opens each section. */
export default function SectionEyebrow({ children, tone = 'dark', className }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em]',
        tone === 'light' ? 'text-kawai-gold' : 'text-kawai-red',
        className,
      )}
    >
      <span className={cn('h-px w-8', tone === 'light' ? 'bg-kawai-gold' : 'bg-kawai-red')} />
      {children}
    </p>
  )
}
