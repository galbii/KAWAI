'use client'

interface ProductErrorFallbackProps {
  error?: Error
  retry?: () => void
}

export function ProductErrorFallback({ error, retry }: ProductErrorFallbackProps) {
  const handleRetry = () => {
    if (retry) {
      retry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-kawai-pearl flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-16 h-16 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-kawai-black mb-2">Unable to Load Product</h1>
        <p className="text-kawai-black/70 mb-6">
          {error?.message || "We're having trouble loading this product page. Please try again later or browse our piano collection."}
        </p>
        <div className="space-x-4">
          <a 
            href="/pianos" 
            className="inline-flex items-center px-6 py-3 bg-kawai-red hover:bg-kawai-red/80 text-white font-medium rounded-md transition-colors"
          >
            Browse Pianos
          </a>
          <button 
            onClick={handleRetry}
            className="inline-flex items-center px-6 py-3 border border-kawai-red text-kawai-red hover:bg-kawai-red/5 font-medium rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}