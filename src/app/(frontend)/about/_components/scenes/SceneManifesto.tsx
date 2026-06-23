'use client'

import { motion, type MotionValue, type Variants } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { useSceneActive } from '../useSceneActive'
import { SCENE_WINDOWS, manifestoCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

const quote: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.15 } },
}

const wordV: Variants = {
  hide: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
}

export default function SceneManifesto({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.manifesto)
  const tokens = manifestoCopy.split(/(\s+)/)
  const state = reduce ? 'show' : active ? 'show' : 'hide'

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.manifesto} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            aria-hidden
            initial={reduce ? false : { scale: 0.7, opacity: 0, filter: 'blur(8px)' }}
            animate={
              reduce
                ? {}
                : {
                    scale: active ? 1 : 0.7,
                    opacity: active ? 1 : 0,
                    filter: active ? 'blur(0px)' : 'blur(8px)',
                  }
            }
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mb-3 block font-[family-name:var(--font-brand-serif)] text-7xl leading-none text-kawai-red md:text-8xl"
          >
            &ldquo;
          </motion.span>

          <motion.blockquote
            variants={quote}
            initial={reduce ? false : 'hide'}
            animate={state}
            className="font-[family-name:var(--font-brand-serif)] text-[clamp(1.6rem,3.4vw,2.75rem)] font-light italic leading-[1.3] tracking-tight text-white"
          >
            {tokens.map((token, i) => {
              if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
              return (
                <motion.span key={i} variants={wordV} className="inline-block">
                  {token}
                </motion.span>
              )
            })}
          </motion.blockquote>

          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            animate={reduce ? {} : { scaleX: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.9 }}
            style={{ originX: 0.5 }}
            className="mx-auto mt-10 h-px w-16 bg-kawai-red"
          />
        </div>
      </div>
    </SceneLayer>
  )
}
