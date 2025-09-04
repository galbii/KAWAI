'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollAnimatedSectionProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
}

export function ScrollAnimatedSection({ 
  children, 
  className, 
  threshold = 0.2,
  delay = 400 
}: ScrollAnimatedSectionProps) {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingVisible(true)
          setTimeout(() => {
            setIsContentVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, delay])

  return (
    <section ref={sectionRef} className={className}>
      <div className={cn(
        'transition-all duration-700 ease-out',
        isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        {children}
      </div>
    </section>
  )
}