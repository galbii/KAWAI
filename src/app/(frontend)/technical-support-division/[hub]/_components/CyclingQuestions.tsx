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
    <div className="max-w-3xl mx-auto px-6 py-8 border-b border-kawai-neutral/30">
      <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-kawai-charcoal/25 mb-3 font-[family-name:var(--font-brand-sans)]">
        People also ask
      </p>
      <p className="text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] h-5 leading-5">
        {displayText}
        <span className="inline-block w-[1px] h-[13px] bg-kawai-red/60 ml-0.5 align-middle animate-pulse" />
      </p>
    </div>
  )
}
