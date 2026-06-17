'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { SCENE_WINDOWS, manifestoCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

type WordProps = {
  progress: MotionValue<number>
  reduce: boolean
  word: string
  riseStart: number
  riseEnd: number
}

function ManifestoWord({ progress, reduce, word, riseStart, riseEnd }: WordProps) {
  const opacity = useTransform(progress, [riseStart, riseEnd], [0, 1])
  const y = useTransform(progress, [riseStart, riseEnd], [10, 0])
  return (
    <motion.span {...(reduce ? {} : { style: { opacity, y } })} className="inline-block">
      {word}
    </motion.span>
  )
}

export default function SceneManifesto({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.manifesto
  const span = end - start
  const mid = start + span * 0.35
  const glyphScale = useTransform(progress, [start, mid], [0.7, 1])
  const glyphBlur = useTransform(progress, [start, mid], ['8px', '0px'])
  const glyphFilter = useTransform(glyphBlur, (b: string) => `blur(${b})`)
  const ruleScale = useTransform(progress, [mid, mid + 0.04], [0, 1])

  const tokens = manifestoCopy.split(/(\s+)/)
  const wordCount = tokens.filter((t) => !/^\s+$/.test(t)).length
  let wordIndex = -1

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.manifesto} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            aria-hidden
            {...(reduce ? {} : { style: { scale: glyphScale, filter: glyphFilter } })}
            className="mb-3 block font-[family-name:var(--font-brand-serif)] text-7xl leading-none text-kawai-red md:text-8xl"
          >
            &ldquo;
          </motion.span>

          <blockquote className="font-[family-name:var(--font-brand-serif)] text-[clamp(1.6rem,3.4vw,2.75rem)] font-light italic leading-[1.3] tracking-tight text-white">
            {tokens.map((token, i) => {
              if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
              wordIndex++
              const wordStart = start + span * (0.18 + (wordIndex / wordCount) * 0.55)
              const wordEnd = wordStart + span * 0.06
              return (
                <ManifestoWord
                  key={i}
                  progress={progress}
                  reduce={reduce}
                  word={token}
                  riseStart={wordStart}
                  riseEnd={wordEnd}
                />
              )
            })}
          </blockquote>

          <motion.div
            {...(reduce ? {} : { style: { scaleX: ruleScale, originX: 0.5 } })}
            transition={{ ease: EASE_OUT_EXPO }}
            className="mx-auto mt-10 h-px w-16 bg-kawai-red"
          />
        </div>
      </div>
    </SceneLayer>
  )
}
