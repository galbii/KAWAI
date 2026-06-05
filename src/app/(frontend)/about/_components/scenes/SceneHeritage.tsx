'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandArrowLink, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, heritageCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

export default function SceneHeritage({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.heritage
  const span = end - start
  const plateY = useTransform(progress, [start, start + span * 0.18], ['24px', '0px'])
  const plateOpacity = useTransform(progress, [start, start + span * 0.2], [0, 1])

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.heritage}
      yOffset={20}
      className="items-center"
    >
      <div id="story" className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            {...(reduce ? {} : { style: { opacity: plateOpacity, y: plateY } })}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-baseline gap-4 border-l-2 border-kawai-red pl-5">
              <span className="font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
                {heritageCopy.plate.kicker}
              </span>
              <span className="font-[family-name:var(--font-brand-serif)] text-4xl font-light tracking-tight text-white">
                {heritageCopy.plate.year}
              </span>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="mb-5">
              <BrandEyebrow>{heritageCopy.eyebrow}</BrandEyebrow>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.04] tracking-tight text-white">
              {heritageCopy.headline}
            </h2>
            <p className="mb-8 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78">
              {heritageCopy.body}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              {heritageCopy.links.map((link, i) => (
                <BrandArrowLink key={link.href} href={link.href} tone={i === 0 ? 'light' : 'muted'}>
                  {link.label}
                </BrandArrowLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SceneLayer>
  )
}
