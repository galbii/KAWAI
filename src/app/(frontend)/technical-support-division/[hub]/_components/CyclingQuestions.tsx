'use client'

import { useState, useEffect } from 'react'

interface CyclingQuestionsProps {
  questions: string[]
}

export function CyclingQuestions({ questions }: CyclingQuestionsProps) {
  const [displayText, setDisplayText] = useState('')
  const [promptIndex, setPromptIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'erasing'>('typing')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (questions.length === 0) return
    const currentPrompt = questions[promptIndex % questions.length] ?? ''

    if (phase === 'typing') {
      if (charIndex < currentPrompt.length) {
        const t = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, charIndex + 1))
          setCharIndex((i) => i + 1)
        }, 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('erasing'), 3000)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'erasing') {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setCharIndex((i) => i - 1)
          setDisplayText(currentPrompt.slice(0, charIndex - 1))
        }, 25)
        return () => clearTimeout(t)
      } else {
        setPromptIndex((i) => (i + 1) % questions.length)
        setPhase('typing')
      }
    }

    return undefined
  }, [phase, charIndex, promptIndex, questions])

  if (questions.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-12 border-b border-kawai-black/[0.08]">
      <div className="flex items-center gap-6 mb-6">
        <span className="text-[10px] font-semibold tracking-[0.45em] uppercase text-kawai-black/60 font-[family-name:var(--font-brand-sans)]">
          People also ask
        </span>
        <div className="flex-1 h-px bg-kawai-black/[0.07]" />
      </div>
      <p className="text-xl md:text-2xl font-light text-kawai-black font-[family-name:var(--font-brand-serif)] h-8 leading-8">
        {displayText}
        <span className="inline-block w-[1px] h-5 bg-kawai-red ml-1 align-middle animate-pulse" />
      </p>
    </div>
  )
}
