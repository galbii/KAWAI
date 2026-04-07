import type { Metadata } from 'next'
import { Hero } from './components/Hero'
import { RebateSchedule } from './components/RebateSchedule'
import { FindDealerCta } from './components/FindDealerCta'

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

export type RebateSeries = {
  seriesName: string
  models: RebateModel[]
}

export type RebateModel = {
  model: string
  finishes: string
  consumerRebate: number
  kawaiPortion: number
  dealerPortion: number
}

export const REBATE_SCHEDULE: RebateSeries[] = [
  {
    seriesName: 'CN Series',
    models: [
      { model: 'CN201', finishes: 'All Finishes', consumerRebate: 150, kawaiPortion: 75, dealerPortion: 75 },
      { model: 'CN301', finishes: 'All Finishes', consumerRebate: 200, kawaiPortion: 100, dealerPortion: 100 },
    ],
  },
  {
    seriesName: 'CA Series',
    models: [
      { model: 'CA401', finishes: 'All Finishes', consumerRebate: 200, kawaiPortion: 100, dealerPortion: 100 },
      { model: 'CA501', finishes: 'All Finishes', consumerRebate: 250, kawaiPortion: 125, dealerPortion: 125 },
      { model: 'CA701', finishes: 'All Finishes', consumerRebate: 300, kawaiPortion: 150, dealerPortion: 150 },
      { model: 'CA901', finishes: 'All Finishes', consumerRebate: 400, kawaiPortion: 200, dealerPortion: 200 },
    ],
  },
  {
    seriesName: 'DG Series',
    models: [
      { model: 'DG-30', finishes: 'EP', consumerRebate: 400, kawaiPortion: 200, dealerPortion: 200 },
    ],
  },
  {
    seriesName: 'ES Series',
    models: [
      { model: 'ES60', finishes: 'Black', consumerRebate: 30, kawaiPortion: 15, dealerPortion: 15 },
      { model: 'ES120', finishes: 'Black / White / Gold', consumerRebate: 50, kawaiPortion: 25, dealerPortion: 25 },
      { model: 'ES920', finishes: 'Black / White', consumerRebate: 100, kawaiPortion: 50, dealerPortion: 50 },
    ],
  },
  {
    seriesName: 'CX Line',
    models: [
      { model: 'CX102', finishes: 'Black / White', consumerRebate: 75, kawaiPortion: 37.50, dealerPortion: 37.50 },
      { model: 'CX202', finishes: 'Rosewood / Satin Black / White', consumerRebate: 100, kawaiPortion: 50, dealerPortion: 50 },
    ],
  },
  {
    seriesName: 'MP Series',
    models: [
      { model: 'MP7SE', finishes: 'Black', consumerRebate: 150, kawaiPortion: 75, dealerPortion: 75 },
      { model: 'MP11SE', finishes: 'Black', consumerRebate: 200, kawaiPortion: 100, dealerPortion: 100 },
    ],
  },
  {
    seriesName: 'VPC Controllers',
    models: [
      { model: 'VPC1', finishes: 'Black', consumerRebate: 175, kawaiPortion: 87.50, dealerPortion: 87.50 },
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
