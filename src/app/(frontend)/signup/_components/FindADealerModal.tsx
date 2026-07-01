'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'

type Props = {
  isOpen: boolean
  onClose: () => void
}

/**
 * Lightweight "Dealers Near You" modal for the /signup hero. Collects a ZIP or
 * city and hands off to the full dealer finder (/find-a-dealer), which reads the
 * `search` param on arrival and runs the search automatically (see SearchBar).
 */
export default function FindADealerModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/find-a-dealer?search=${encodeURIComponent(q)}` : '/find-a-dealer')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className="bg-kawai-pearl text-kawai-black">
      <DialogTitle className="font-[family-name:var(--font-brand-serif)] text-2xl font-light text-kawai-black">
        Find a Dealer Near You
      </DialogTitle>
      <DialogDescription className="mt-2 font-[family-name:var(--font-brand-sans)] text-sm text-kawai-charcoal">
        Enter your ZIP or city to find your nearest Authorized Kawai dealer.
      </DialogDescription>

      <form onSubmit={submit} className="mt-5">
        <label htmlFor="dealer-search-zip" className="sr-only">
          ZIP code or city
        </label>
        <div className="flex gap-2">
          <input
            id="dealer-search-zip"
            type="text"
            autoComplete="postal-code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ZIP code or city"
            aria-label="ZIP code or city"
            autoFocus
            className="min-w-0 flex-1 border border-kawai-neutral bg-white px-4 py-3 font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder:text-kawai-charcoal/40 focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/30"
          />
          <button
            type="submit"
            className="inline-flex flex-shrink-0 items-center bg-kawai-red px-6 py-3 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-kawai-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      <Link
        href="/find-a-dealer"
        onClick={onClose}
        className="mt-4 inline-block font-[family-name:var(--font-brand-sans)] text-sm font-medium text-kawai-charcoal underline-offset-4 hover:text-kawai-red hover:underline"
      >
        Or browse all dealers →
      </Link>
    </Modal>
  )
}
