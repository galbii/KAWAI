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
    <p className="text-sm text-white/30 font-[family-name:var(--font-brand-sans)] mt-3 h-5 tracking-wide">
      {displayText}
      <span className="inline-block w-[1px] h-[13px] bg-kawai-red ml-0.5 align-middle animate-pulse" />
    </p>
  )
}

export function TSDLandingHero({ groups }: { groups: GroupWindow[] }) {
  return (
    <div className="min-h-screen bg-kawai-black flex flex-col items-center justify-center px-6 py-16">

      {/* Windows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl mb-10">
        {groups.map((win, index) => (
          <motion.div
            key={win.href}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: index * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              href={win.href}
              className="group relative flex flex-col min-h-[190px] md:min-h-[230px] rounded-2xl overflow-hidden transition-all duration-300
                bg-white/[0.03] border border-white/[0.08]
                hover:bg-white/[0.06] hover:border-kawai-red/40
                hover:shadow-[0_0_32px_rgba(225,25,34,0.08)]"
            >
              {/* Red top accent bar */}
              <div className="h-[2px] w-full bg-gradient-to-r from-kawai-red/60 via-kawai-red to-kawai-red/30 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex flex-col flex-1 p-6 md:p-7">
                {/* Number */}
                <span className="text-[10px] text-kawai-red/50 tracking-[0.35em] font-semibold mb-auto font-[family-name:var(--font-brand-sans)] group-hover:text-kawai-red/80 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Label */}
                <div className="mt-6">
                  <span className="block text-2xl md:text-[1.6rem] font-light text-white/80 group-hover:text-white leading-tight font-[family-name:var(--font-brand-serif)] transition-colors duration-300 whitespace-pre-line">
                    {win.heading || win.label}
                  </span>

                  {/* Descriptor */}
                  <span className="block text-[11px] text-white/25 group-hover:text-white/40 leading-relaxed font-[family-name:var(--font-brand-sans)] mt-2.5 transition-colors duration-300 whitespace-pre-line">
                    {win.description}
                  </span>
                </div>

                {/* Bottom arrow — appears on hover */}
                <div className="mt-4 flex items-center gap-1 text-[10px] text-kawai-red/0 group-hover:text-kawai-red/70 transition-all duration-300 font-[family-name:var(--font-brand-sans)] font-medium tracking-wide">
                  Get started
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Support Center label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42, duration: 0.5 }}
        className="text-[10px] text-white/20 tracking-[0.45em] uppercase font-medium mb-5 font-[family-name:var(--font-brand-sans)]"
      >
        Support Center
      </motion.p>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-2xl w-full"
      >
        <FaqSearch variant="hero" placeholder="Search for answers, guides, manuals…" />
      </motion.div>

      {/* Typing prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <TypingAnimation />
      </motion.div>

    </div>
  )
}
