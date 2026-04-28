import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-kawai-red font-medium mb-4">404</p>
      <h1 className="text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-pearl mb-4">
        Page not found
      </h1>
      <p className="text-kawai-pearl/60 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="bg-kawai-red text-white px-6 py-3 text-sm font-medium hover:bg-kawai-red-700 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/pianos"
          className="border border-kawai-pearl/30 text-kawai-pearl px-6 py-3 text-sm font-medium hover:border-kawai-pearl transition-colors"
        >
          Browse pianos
        </Link>
      </div>
    </div>
  )
}
