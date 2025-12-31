'use client'

import { useEffect, useState } from 'react'

interface ReadingProgressBarProps {
  className?: string
}

export function ReadingProgressBar({ className = '' }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const totalScroll = documentHeight - windowHeight
      const currentProgress = (scrollTop / totalScroll) * 100

      setProgress(Math.min(currentProgress, 100))
    }

    // Calculate on mount
    calculateProgress()

    // Add scroll listener
    window.addEventListener('scroll', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', calculateProgress)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-kawai-red transition-[width] duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
