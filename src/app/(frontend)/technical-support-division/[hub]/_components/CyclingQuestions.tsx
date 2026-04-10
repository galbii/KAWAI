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
    <div className="bg-white border-b border-black/[0.06]">
      <div className="max-w-screen-2xl mx-auto px-10 md:px-20 xl:px-28 py-16">
        <div className="flex items-center gap-6 mb-8">
          <span className="text-[10px] font-semibold tracking-[0.45em] uppercase text-kawai-black/50 font-[family-name:var(--font-brand-sans)]">
            People also ask
          </span>
          <div className="flex-1 h-px bg-black/[0.07]" />
        </div>
        <p className="text-2xl md:text-3xl font-light text-kawai-black font-[family-name:var(--font-brand-serif)] h-10 leading-10">
          {displayText}
          <span className="inline-block w-[1px] h-6 bg-kawai-red ml-1 align-middle animate-pulse" />
        </p>
      </div>
    </div>
  )
}
