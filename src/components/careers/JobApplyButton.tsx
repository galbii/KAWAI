'use client'

import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'primary' | 'mobile'
  label?: string
  targetId?: string
}

function scrollToTarget(targetId: string) {
  if (typeof window === 'undefined') return
  const el = document.getElementById(targetId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function JobApplyButton({ variant = 'primary', label = 'Apply Now', targetId = 'apply' }: Props) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    scrollToTarget(targetId)
  }

  if (variant === 'mobile') {
    return (
      <a
        href={`#${targetId}`}
        onClick={handleClick}
        className={cn(
          'flex-1 inline-flex items-center justify-center gap-2 bg-kawai-red text-white rounded-full py-3.5 px-6',
          'text-sm font-semibold uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)]',
          'shadow-brand-red-glow active:scale-[0.98] transition-transform duration-150',
        )}
      >
        {label}
        <ArrowDown size={16} strokeWidth={1.8} />
      </a>
    )
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        'group relative inline-flex w-full items-center justify-center gap-2.5 bg-kawai-red text-white rounded-full py-4 px-6',
        'text-[13px] font-semibold uppercase tracking-[0.14em] font-[family-name:var(--font-brand-sans)]',
        'shadow-brand-red-glow hover:shadow-[0_8px_28px_rgba(225,25,34,0.32)] hover:bg-kawai-red-700',
        'transition-all duration-200',
      )}
    >
      {label}
      <ArrowDown
        size={16}
        strokeWidth={1.8}
        className="transition-transform duration-200 group-hover:translate-y-0.5"
      />
    </a>
  )
}
