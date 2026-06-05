import { JobApplyButton } from './JobApplyButton'

interface Props {
  jobTitle: string
}

export function MobileApplyBar({ jobTitle }: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-[80] bg-kawai-pearl/95 backdrop-blur-md border-t border-kawai-neutral/50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(30,27,22,0.06)]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/55 font-[family-name:var(--font-brand-sans)] leading-tight">
            Open Role
          </p>
          <p className="text-sm font-[family-name:var(--font-brand-luxury)] text-kawai-black truncate">
            {jobTitle}
          </p>
        </div>
        <JobApplyButton variant="mobile" label="Apply" />
      </div>
    </div>
  )
}
