import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ArtistModelCardProps {
  product: {
    name: string | null
    slug: string
    imageUrl?: string | null
  }
  variant?: 'dark' | 'light'
  className?: string
}

export function ArtistModelCard({ product, variant = 'dark', className }: ArtistModelCardProps) {
  const isDark = variant === 'dark'

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        'group block rounded-xl overflow-hidden transition-all duration-300',
        isDark
          ? 'bg-kawai-black hover:ring-2 hover:ring-kawai-red/60'
          : 'bg-white border border-kawai-neutral hover:border-kawai-red/40 hover:shadow-brand-medium',
        className,
      )}
    >
      {product.imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name ?? 'KAWAI Piano'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="320px"
          />
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 to-transparent" />
          )}
        </div>
      )}
      <div className="p-4">
        <p className="text-kawai-red text-xs font-semibold uppercase tracking-widest mb-1.5">
          Their KAWAI
        </p>
        <p className={cn('font-bold text-base leading-tight mb-3', isDark ? 'text-white' : 'text-kawai-black')}>
          {product.name ?? 'KAWAI Piano'}
        </p>
        <span className="inline-flex items-center gap-1.5 text-kawai-red text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
          Explore
          <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
        </span>
      </div>
    </Link>
  )
}
