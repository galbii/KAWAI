import Link from 'next/link'

interface WarrantyHeroProps {
  title: string
  subtitle: string
  breadcrumb?: { label: string; href: string }
  /** "dark" (charcoal — detail pages) or "light" (pearl — hub) */
  variant?: 'dark' | 'light'
}

export function WarrantyHero({
  title,
  subtitle,
  breadcrumb,
  variant = 'dark',
}: WarrantyHeroProps) {
  if (variant === 'light') {
    return (
      <section className="bg-kawai-pearl pt-14 pb-2">
        <div className="container mx-auto px-6 max-w-2xl">
          {breadcrumb && (
            <nav aria-label="Breadcrumb" className="mb-3 text-[12px] text-kawai-muted">
              <Link href={breadcrumb.href} className="hover:text-kawai-charcoal transition-colors">
                {breadcrumb.label}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-kawai-muted">{title}</span>
            </nav>
          )}
          <p className="text-[12px] font-semibold uppercase tracking-widest text-kawai-red mb-2">
            {subtitle}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-kawai-charcoal tracking-tight">
            {title}
          </h1>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-kawai-charcoal text-white py-14">
      <div className="container mx-auto px-6 max-w-4xl">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-400">
            <Link href={breadcrumb.href} className="hover:text-white transition-colors">
              {breadcrumb.label}
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-300">{title}</span>
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-gray-300 text-[15px]">{subtitle}</p>
      </div>
    </section>
  )
}
