import type { Metadata } from 'next'
import { Hero } from './components/Hero'
import { RebateSchedule } from './components/RebateSchedule'
import type { RebateSeries, RebateModel } from './components/RebateSchedule'
import { FindDealerCta } from './components/FindDealerCta'

export type { RebateSeries, RebateModel }

export const metadata: Metadata = {
  title: 'Save Up To $400 on Kawai Digital Pianos | Spring 2026 Rebate',
  description:
    'Limited-time savings on Kawai CN, CA, DG, ES, CX, and MP Series digital pianos. Instant rebate up to $400 at participating dealers. April 1–June 30, 2026.',
  openGraph: {
    title: 'Kawai Digital Piano Rebate Event | Save Up To $400',
    description: 'Instant savings on select Kawai digital pianos at participating dealers. April 1–June 30, 2026.',
  },
}

export const revalidate = 3600

export const REBATE_SCHEDULE: RebateSeries[] = [
  {
    seriesName: 'CN Series',
    models: [
      { model: 'CN201', finishes: 'All Finishes', consumerRebate: 150 },
      { model: 'CN301', finishes: 'All Finishes', consumerRebate: 200 },
    ],
  },
  {
    seriesName: 'CA Series',
    models: [
      { model: 'CA401', finishes: 'All Finishes', consumerRebate: 200 },
      { model: 'CA501', finishes: 'All Finishes', consumerRebate: 250 },
      { model: 'CA701', finishes: 'All Finishes', consumerRebate: 300 },
      { model: 'CA901', finishes: 'All Finishes', consumerRebate: 400 },
    ],
  },
  {
    seriesName: 'DG Series',
    models: [
      { model: 'DG-30', finishes: 'EP', consumerRebate: 400 },
    ],
  },
  {
    seriesName: 'ES Series',
    models: [
      { model: 'ES60', finishes: 'Black', consumerRebate: 30 },
      { model: 'ES120', finishes: 'Black / White / Gold', consumerRebate: 50 },
      { model: 'ES920', finishes: 'Black / White', consumerRebate: 100 },
    ],
  },
  {
    seriesName: 'CX Line',
    models: [
      { model: 'CX102', finishes: 'Black / White', consumerRebate: 75 },
      { model: 'CX202', finishes: 'Rosewood / Satin Black / White', consumerRebate: 100 },
    ],
  },
  {
    seriesName: 'MP Series',
    models: [
      { model: 'MP7SE', finishes: 'Black', consumerRebate: 150 },
      { model: 'MP11SE', finishes: 'Black', consumerRebate: 200 },
    ],
  },
  {
    seriesName: 'VPC Controllers',
    models: [
      { model: 'VPC1', finishes: 'Black', consumerRebate: 175 },
    ],
  },
]

export default function DigitalPianoRebatePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <RebateSchedule schedule={REBATE_SCHEDULE} />
      <FindDealerCta />
    </main>
  )
}
