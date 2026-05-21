'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EmptyState } from './EmptyState'
import { DateStep } from './DateStep'
import { StatusPanel } from './StatusPanel'
import type { CoverageStep, ProductHit } from './types'

const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function CoverageCheck() {
  const [step, setStep] = useState<CoverageStep>({ kind: 'empty' })

  const handlePickProduct = (product: ProductHit) => setStep({ kind: 'date', product })

  const handleSubmitDate = (purchaseDate: Date) => {
    if (step.kind !== 'date') return
    setStep({ kind: 'status', product: step.product, purchaseDate })
  }

  const handleChangeModel = () => setStep({ kind: 'empty' })

  const handleChangeDate = () => {
    if (step.kind === 'status') setStep({ kind: 'date', product: step.product })
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step.kind}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {step.kind === 'empty' && <EmptyState onPick={handlePickProduct} />}
        {step.kind === 'date' && (
          <DateStep
            product={step.product}
            onSubmit={handleSubmitDate}
            onChange={handleChangeModel}
          />
        )}
        {step.kind === 'status' && (
          <StatusPanel
            product={step.product}
            purchaseDate={step.purchaseDate}
            onChangeModel={handleChangeModel}
            onChangeDate={handleChangeDate}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
