'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface FacultyMember {
  id?: string
  name: string
  title?: string
  role?: string
  photo?: Media | string | null
  specialties?: string
  teachingFocus?: string
  background?: string
  education?: Array<{ degree?: string; id?: string }>
}

interface Props {
  faculty: FacultyMember[]
  storeslug: string
}

function isMedia(val: unknown): val is Media {
  return typeof val === 'object' && val !== null && 'url' in val
}

const PREVIEW_LENGTH = 160

export function FacultyPageCarousel({ faculty, storeslug }: Props) {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [bgExpanded, setBgExpanded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-advance respects a user-operable play/pause control (WCAG 2.2.2) and
  // pauses on hover/focus. Reduced-motion users start paused.
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const shouldRun = isPlaying && !isPaused

  const total = faculty.length
  const member = faculty[index]

  function go(next: number) {
    if (animating) return
    if (timerRef.current) clearTimeout(timerRef.current)
    const nextIndex = (next + total) % total
    if (nextIndex === index) return
    setAnimating(true)
    setIndex(nextIndex)
    setBgExpanded(false)
    setTimeout(() => setAnimating(false), 350)
  }

  // Respect prefers-reduced-motion: start paused and follow live changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setIsPlaying(false)
    const onChange = (e: MediaQueryListEvent) => setIsPlaying(!e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!shouldRun || total <= 1) return
    timerRef.current = setTimeout(() => go(index + 1), 3000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [index, shouldRun, total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!member) return null

  const photo = isMedia(member.photo) ? member.photo : null
  const initials = member.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const pad = (n: number) => String(n).padStart(2, '0')

  const bgNeedsExpand = member.background && member.background.length > PREVIEW_LENGTH
  const bgPreview = bgNeedsExpand
    ? member.background!.slice(0, PREVIEW_LENGTH).trimEnd() + '…'
    : member.background

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes faculty-page-enter {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="grid md:grid-cols-[1fr_1fr] min-h-[calc(100vh-64px)]">

        {/* Photo panel */}
        <div className="relative bg-kawai-black overflow-hidden min-h-[50vh] md:min-h-0 md:sticky md:top-16 md:h-[calc(100vh-64px)]">
          <div
            key={`photo-${index}`}
            className="absolute inset-0"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'scale(1.02)' : 'scale(1)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {photo?.url ? (
              <Image
                src={photo.url}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/10 text-9xl font-[family-name:var(--font-brand-luxury)] select-none">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Index indicator overlay */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            {faculty.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to faculty member ${i + 1}`}
                className="transition-all duration-200"
                style={{
                  width: i === index ? '24px' : '6px',
                  height: '2px',
                  background: i === index ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="bg-kawai-pearl px-10 py-14 md:px-14 lg:px-20 overflow-y-auto">

          {/* Counter + nav */}
          <div className="flex items-center justify-between mb-12">
            <span className="text-[11px] font-mono text-kawai-charcoal/30 tracking-widest">
              {pad(index + 1)} / {pad(total)}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause automatic rotation' : 'Play automatic rotation'}
                className="w-9 h-9 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black text-kawai-charcoal/40 hover:text-kawai-black rounded transition-colors"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous"
                className="w-9 h-9 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black text-kawai-charcoal/40 hover:text-kawai-black rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                </svg>
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next"
                className="w-9 h-9 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black text-kawai-charcoal/40 hover:text-kawai-black rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Member detail */}
          <div
            key={index}
            style={{ animation: 'faculty-page-enter 0.35s ease forwards' }}
          >
            <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight mb-3">
              {member.name}
            </h2>

            {member.title && (
              <p className="text-kawai-red text-sm font-medium tracking-wide mb-1">
                {member.title}
              </p>
            )}
            {member.role && member.role !== member.title && (
              <p className="text-kawai-charcoal/55 text-sm mb-0">{member.role}</p>
            )}

            <div className="h-px bg-kawai-neutral my-8" />

            <div className="space-y-7">
              {member.education && member.education.length > 0 && (
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-3">
                    Education
                  </h3>
                  <ul className="space-y-2">
                    {member.education.map((edu) => (
                      <li
                        key={edu.id ?? edu.degree}
                        className="flex items-start gap-2.5 text-kawai-charcoal text-sm leading-snug"
                      >
                        <span className="mt-2 w-1 h-1 rounded-full bg-kawai-red flex-shrink-0" />
                        {edu.degree}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.specialties && (
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2">
                    Specialties
                  </h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">{member.specialties}</p>
                </div>
              )}

              {member.teachingFocus && (
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2">
                    Teaching Focus
                  </h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">{member.teachingFocus}</p>
                </div>
              )}

              {member.background && (
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-2">
                    Background
                  </h3>
                  <p className="text-kawai-charcoal text-sm leading-relaxed">
                    {bgExpanded ? member.background : bgPreview}
                    {bgNeedsExpand && (
                      <button
                        onClick={() => setBgExpanded((v) => !v)}
                        className="ml-1.5 text-kawai-red/70 hover:text-kawai-red text-xs font-medium transition-colors"
                      >
                        {bgExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
