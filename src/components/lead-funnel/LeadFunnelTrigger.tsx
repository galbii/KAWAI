'use client'

/**
 * Lead Funnel — convenience trigger button.
 *
 * A drop-in <button> that opens the funnel popup. Must be rendered inside a
 * <LeadFunnelProvider>. For custom CTAs, call useLeadFunnel().open() directly
 * instead of using this component.
 */

import { useLeadFunnel } from './LeadFunnelProvider'

interface LeadFunnelTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function LeadFunnelTrigger({ children, onClick, ...rest }: LeadFunnelTriggerProps) {
  const { open } = useLeadFunnel()

  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        open()
      }}
    >
      {children}
    </button>
  )
}
