import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ArrowLinkProps = {
  href: string
  children: ReactNode
  /** 'red' for light backgrounds, 'light' (white→gold) for dark backgrounds. */
  tone?: 'red' | 'muted' | 'light'
  className?: string
}

/** Inline call-to-action link with an arrow that nudges right on hover. */
export default function ArrowLink({ href, children, tone = 'red', className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-medium transition-colors duration-200',
        tone === 'red' && 'text-kawai-red hover:text-kawai-red-700',
        tone === 'muted' && 'text-sm text-kawai-charcoal hover:text-kawai-red',
        tone === 'light' && 'text-white/90 hover:text-kawai-gold',
        className,
      )}
    >
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
