import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DialogTitle } from '@/components/ui/dialog'

/**
 * SimpleCustomerSignupSuccess — confirmation state.
 *
 * Content-only: it renders *inside* the existing signup Modal (it no longer
 * paints its own overlay, which previously stacked a second modal on top of
 * the open one). Presentation mirrors the form's restrained treatment.
 */

interface SimpleCustomerSignupSuccessProps {
  title?: string
  message?: string
  onClose: () => void
}

export function SimpleCustomerSignupSuccess({
  title = 'Thank You for Signing Up!',
  message = "We'll be in touch soon with updates about our piano collection.",
  onClose,
}: SimpleCustomerSignupSuccessProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-white px-8 pb-12 pt-14 text-center sm:px-12">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-20 text-kawai-black/40 transition-colors hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-kawai-red/40">
        <CheckIcon className="h-6 w-6 text-kawai-red" strokeWidth={1.5} />
      </div>

      <DialogTitle className="mt-7 font-serif font-normal text-3xl leading-[1.1] tracking-tight text-kawai-black sm:text-[2rem]">
        {title}
      </DialogTitle>

      <div aria-hidden="true" className="mx-auto mt-5 h-px w-12 bg-kawai-red" />

      <p className="mt-5 max-w-sm text-sm leading-relaxed text-kawai-muted">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className="mt-9 border border-kawai-black/20 px-10 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-kawai-black transition-colors hover:bg-kawai-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2"
      >
        Close
      </button>
    </div>
  )
}
