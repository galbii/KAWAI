'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FacultyMember {
  id?: string
  name: string
  title?: string
  role?: string
  photoUrl?: string | null
  specialties?: string
  background?: string
}

interface Props {
  faculty: FacultyMember[]
  schoolName: string
  about?: string
  baseUrl: string
}

const PREVIEW_LENGTH = 120

export function MusicSchoolFacultyCarousel({ faculty, schoolName, about, baseUrl }: Props) {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const animatingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-advance respects a user-operable play/pause control (WCAG 2.2.2) and
  // pauses on hover/focus. Reduced-motion users start paused.
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const shouldRun = isPlaying && !isPaused

  const total = faculty.length
  const member = faculty[index]

  // Keep ref in sync with state so closures always read current value
  function setAnimatingBoth(val: boolean) {
    animatingRef.current = val
    setAnimating(val)
  }

  function advance(next: number) {
    const nextIndex = (next + total) % total
    setAnimatingBoth(true)
    setIndex(nextIndex)
    setTimeout(() => setAnimatingBoth(false), 700)
  }

  function go(next: number) {
    if (animatingRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    advance(next)
  }

  // Respect prefers-reduced-motion: start paused and follow live changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setIsPlaying(false)
    const onChange = (e: MediaQueryListEvent) => setIsPlaying(!e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Auto-advance: reads ref so it's never stale (gated on play state + hover/focus)
  useEffect(() => {
    if (!shouldRun || total <= 1) return
    timerRef.current = setTimeout(() => {
      if (!animatingRef.current) {
        advance(index + 1)
      }
    }, 3000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [index, shouldRun, total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!member) return null

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const pad = (n: number) => String(n).padStart(2, '0')

  const aboutNeedsExpand = about && about.length > PREVIEW_LENGTH
  const aboutPreview = aboutNeedsExpand ? about!.slice(0, PREVIEW_LENGTH).trimEnd() + '…' : about

  return (
    <div
      className="grid md:grid-cols-[5fr_6fr] min-h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >

      {/* Photo panel */}
      <div className="relative bg-kawai-black overflow-hidden min-h-[400px] md:min-h-0">
        <div
          key={`photo-${index}`}
          className="absolute inset-0"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'scale(1.015)' : 'scale(1)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/10 text-8xl font-[family-name:var(--font-brand-luxury)] select-none">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Arrows on photo */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous faculty member"
            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
            </svg>
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next faculty member"
            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content panel */}
      <div className="flex flex-col justify-between px-10 py-12 md:px-14 lg:px-20 bg-white">

        {/* Logo */}
        <div className="mb-10">
          <img
            src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/KMS%20Logo.webp"
            alt="Kawai Music School"
            className="h-14 w-auto opacity-90"
          />
        </div>

        {/* About — truncated with read more */}
        {about && (
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-kawai-charcoal/40 mb-2">
              About
            </p>
            <p className="text-kawai-charcoal/70 text-sm leading-relaxed max-w-sm">
              {aboutExpanded ? about : aboutPreview}
              {aboutNeedsExpand && (
                <button
                  onClick={() => setAboutExpanded((v) => !v)}
                  className="ml-1.5 text-kawai-red/80 hover:text-kawai-red text-xs font-medium transition-colors"
                >
                  {aboutExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Faculty detail */}
        <div
          key={index}
          className="flex-1"
          style={{ animation: 'faculty-enter 0.7s ease forwards' }}
        >
          <style>{`
            @keyframes faculty-enter {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-kawai-charcoal/40 mb-5">
            Faculty
          </p>

          <h3 className="text-4xl md:text-5xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-3">
            {member.name}
          </h3>

          {member.title && (
            <p className="text-kawai-red text-sm font-medium tracking-wide mb-1">
              {member.title}
            </p>
          )}
          {member.role && member.role !== member.title && (
            <p className="text-kawai-charcoal/60 text-sm">{member.role}</p>
          )}

          {member.specialties && (
            <p className="text-kawai-charcoal/65 text-sm mt-6 leading-relaxed max-w-xs">
              {member.specialties}
            </p>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t-2 border-kawai-neutral">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono text-kawai-charcoal/40 tracking-widest select-none">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause automatic rotation' : 'Play automatic rotation'}
              className="w-8 h-8 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black text-kawai-charcoal/50 hover:text-kawai-black rounded transition-colors"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`${baseUrl}/programs`}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white transition-colors px-5 py-3 rounded"
            >
              Free First Lesson
            </Link>
            <Link
              href={baseUrl}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase bg-kawai-red hover:bg-kawai-red-700 text-white transition-colors px-5 py-3 rounded"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
