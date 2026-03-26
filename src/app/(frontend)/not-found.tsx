import Link from 'next/link'

const links = [
  { href: '/pianos', label: 'Browse Pianos' },
  { href: '/find-a-dealer', label: 'Find a Dealer' },
  { href: '/blog', label: 'Blog' },
  { href: '/', label: 'Back to Home' },
]

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-24 text-center bg-kawai-pearl">
      <p className="text-sm font-medium tracking-[0.2em] uppercase text-kawai-red mb-4">
        Page Not Found
      </p>

      <h1 className="text-[8rem] leading-none font-[family-name:var(--font-brand-luxury)] text-kawai-black/10 select-none mb-2">
        404
      </h1>

      <h2 className="text-2xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3">
        This page doesn&apos;t exist
      </h2>

      <p className="text-kawai-charcoal max-w-md mb-10">
        The page you&apos;re looking for may have been moved, renamed, or removed. Try one of the
        links below or return to the homepage.
      </p>

      <nav className="flex flex-wrap justify-center gap-3">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              href === '/'
                ? 'inline-flex items-center px-5 py-2.5 text-sm border border-kawai-neutral text-kawai-charcoal rounded hover:border-kawai-red hover:text-kawai-red transition-colors'
                : 'inline-flex items-center px-5 py-2.5 text-sm bg-kawai-red text-white rounded hover:bg-kawai-red-700 transition-colors'
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
