'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Sticky in-page nav for the rentals page. Sections opt in with
 * `data-rental-nav="Label"` and an `id`, so the list always matches what the
 * store actually shows (no rent-to-own, no event rates → no link). The
 * inquiry pill is server-rendered and always present.
 */

interface NavItem {
  id: string
  label: string
}

export function RentalsSectionNav({ inquiryHref, inquiryText }: { inquiryHref: string; inquiryText: string }) {
  const [items, setItems] = useState<NavItem[]>([])
  const [active, setActive] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-rental-nav][id]'))
    setItems(sections.map((el) => ({ id: el.id, label: el.dataset.rentalNav ?? el.id })))

    // A section is "current" while it crosses the band just under the bar.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Keep the current link visible in the scrolling strip on phones.
  useEffect(() => {
    const list = listRef.current
    const link = active ? list?.querySelector<HTMLElement>(`[data-target="${active}"]`) : null
    if (!list || !link) return
    const offset = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2
    list.scrollTo({ left: offset, behavior: 'smooth' })
  }, [active])

  return (
    <nav
      aria-label="On this page"
      className="sticky z-30 border-b border-kawai-black/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      style={{ top: 'var(--header-bottom, 70px)' }}
    >
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center gap-6 px-6 md:px-10">
        <ul
          ref={listRef}
          className="-mx-2 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                data-target={item.id}
                aria-current={active === item.id ? 'location' : undefined}
                className={cn(
                  'relative block px-2 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
                  active === item.id ? 'text-kawai-black' : 'text-kawai-black/50 hover:text-kawai-black',
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-2 bottom-0 h-px origin-left bg-kawai-red transition-transform duration-300',
                    active === item.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={inquiryHref}
          className="inline-flex shrink-0 items-center rounded-full bg-kawai-red px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
        >
          {inquiryText}
        </a>
      </div>
    </nav>
  )
}
