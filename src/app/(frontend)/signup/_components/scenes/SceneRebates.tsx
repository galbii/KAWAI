'use client'

import { type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import RebateShowcase from '../RebateShowcase'
import { SCENE_WINDOWS } from '../scenes'
import type { RebateCategory } from '@/lib/payload/rebate-types'

type Props = {
  progress: MotionValue<number>
  reduce: boolean
  data: RebateCategory[]
}

/**
 * Scene 2 — the rebate showcase, directly under the hero. SceneLayer drives the
 * scroll crossfade; RebateShowcase supplies the category backdrop (which swaps
 * with the selected category) and the floating, spotlit carousel on top.
 */
export default function SceneRebates({ progress, reduce, data }: Props) {
  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.rebates} className="items-center">
      <RebateShowcase data={data} reduce={reduce} />
    </SceneLayer>
  )
}
