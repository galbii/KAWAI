'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaqSearch } from './FaqSearch'

interface GroupWindow {
  href: string
  label: string
  heading: string
  description: string
}

const prompts = [
  'How do I connect via Bluetooth?',
  'What is the difference between GX and SK series?',
  'My keys feel uneven — how do I fix this?',
  'How long is the warranty on my CA piano?',
  'Regulation guide for upright technicians',
]

function TypingAnimation() {
  const [displayText, setDisplayText] = useState('')
  const [promptIndex, setPromptIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentPrompt = prompts[promptIndex] ?? ''

    if (phase === 'typing') {
      if (charIndex < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, charIndex + 1))
          setCharIndex((i) => i + 1)
        }, 58)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setPhase('erasing'), 2800)
        return () => clearTimeout(timeout)
      }
    }

    if (phase === 'erasing') {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setCharIndex((i) => i - 1)
          setDisplayText(currentPrompt.slice(0, charIndex - 1))
        }, 28)
        return () => clearTimeout(timeout)
      } else {
        setPromptIndex((i) => (i + 1) % prompts.length)
        setPhase('typing')
      }
    }

    return undefined
  }, [phase, charIndex, promptIndex])

  return (
    <p className="text-sm text-kawai-black font-[family-name:var(--font-brand-sans)] mt-3 h-5 tracking-wide">
      {displayText}
      <span className="inline-block w-[1px] h-[13px] bg-kawai-red ml-0.5 align-middle animate-pulse" />
    </p>
  )
}

export function TSDLandingHero({ groups }: { groups: GroupWindow[] }) {
  return (
    <div className="min-h-screen bg-kawai-pearl flex flex-col items-center justify-center px-6 py-32">

      {/* Support Center eyebrow — moved above cards */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-4 mb-16"
      >
        <div className="h-px w-12 bg-kawai-red/40" />
        <p className="text-[10px] text-kawai-black/60 tracking-[0.5em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
          Support Center
        </p>
        <div className="h-px w-12 bg-kawai-red/40" />
      </motion.div>

      {/* Hub Cards — full-width architectural panels */}
      <div className={`grid grid-cols-1 gap-px w-full mb-24 border border-kawai-black/[0.08] mx-auto ${
        groups.length === 1
          ? 'md:grid-cols-1 max-w-2xl'
          : groups.length === 2
            ? 'md:grid-cols-2 max-w-5xl'
            : groups.length === 4
              ? 'md:grid-cols-4 max-w-screen-2xl'
              : 'md:grid-cols-3 max-w-screen-2xl'
      }`}>
        {groups.map((win, index) => (
          <motion.div
            key={win.href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.14,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative h-full"
          >
            <Link
              href={win.href}
              className="group relative flex flex-col h-full min-h-[500px] md:min-h-[580px] overflow-hidden
                bg-white
                border-r border-kawai-black/[0.08] last:border-r-0
                hover:bg-[#F0EDE8]
                transition-colors duration-500"
            >
              {/* Left red accent bar — grows on hover */}
              <div className="absolute left-0 top-0 w-[3px] h-0 bg-kawai-red group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

              {/* Oversized ghost number — architectural backdrop */}
              <span
                aria-hidden
                className="absolute right-[-0.1em] bottom-[-0.15em] text-[14rem] md:text-[18rem] font-bold leading-none select-none
                  text-kawai-black/[0.04] group-hover:text-kawai-black/[0.07]
                  font-[family-name:var(--font-brand-sans)]
                  transition-colors duration-700"
              >
                {String(index + 1)}
              </span>

              <div className="relative flex flex-col flex-1 p-10 md:p-12 lg:p-16">

                {/* Small index tag */}
                <div className="flex items-center gap-3 mb-auto">
                  <span className="text-[9px] text-kawai-red/50 tracking-[0.45em] font-semibold font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red transition-colors duration-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-kawai-black/[0.08] group-hover:bg-kawai-red/20 transition-colors duration-500" />
                </div>

                {/* Main content — pushed to bottom */}
                <div className="mt-20 md:mt-24">

                  {/* Heading — large editorial serif */}
                  <h2 className="text-5xl md:text-[3.2rem] lg:text-[3.8rem] xl:text-[4.5rem] font-light leading-[1.05] tracking-tight
                    text-kawai-black group-hover:text-kawai-black
                    font-[family-name:var(--font-brand-serif)]
                    transition-colors duration-500 whitespace-pre-line">
                    {win.heading || win.label}
                  </h2>

                  {/* Animated red rule */}
                  <div className="mt-6 h-px w-6 bg-kawai-red/30 group-hover:w-14 group-hover:bg-kawai-red/70 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

                  {/* Description */}
                  <p className="mt-6 text-base text-kawai-black group-hover:text-kawai-black leading-relaxed
                    font-[family-name:var(--font-brand-sans)]
                    transition-colors duration-500 whitespace-pre-line max-w-[28ch]">
                    {win.description}
                  </p>

                  {/* Enter CTA */}
                  <div className="mt-10 flex items-center gap-2 overflow-hidden">
                    <span className="text-[11px] text-kawai-red/0 group-hover:text-kawai-red
                      font-[family-name:var(--font-brand-sans)] font-semibold tracking-[0.25em] uppercase
                      transition-colors duration-300">
                      Enter
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-kawai-red/0 group-hover:text-kawai-red group-hover:translate-x-1
                        transition-all duration-300"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom red sweep — fills on hover */}
              <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-kawai-red/60 to-kawai-red/10 transition-all duration-700 delay-100" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Search section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-3xl w-full"
      >
        <FaqSearch variant="hero" placeholder="Search for answers, guides, manuals…" />
      </motion.div>

      {/* Typing prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.5 }}
      >
        <TypingAnimation />
      </motion.div>

    </div>
  )
}
