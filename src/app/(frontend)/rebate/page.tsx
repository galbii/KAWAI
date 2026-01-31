import type { Metadata } from 'next'
import Link from 'next/link'
import { RebateHero } from './components/RebateHero'
import { RebateGrid } from './components/RebateGrid'
import { RebateCTA } from './components/RebateCTA'

export const metadata: Metadata = {
  title: 'Instant Rebate Event | Premium Piano Savings | KAWAI',
  description: 'Save up to $2,500 on select KAWAI piano models. Limited-time instant rebates on professional uprights and grand pianos. Explore premium instruments with exceptional savings.',
  openGraph: {
    title: 'Instant Rebate Event | Save Up To $2,500 | KAWAI',
    description: 'Exclusive savings on KAWAI ATX4, Aures2, and Grand Piano models. Limited-time instant rebates available now.',
  }
}

export const revalidate = 300 // 5 minutes

const rebateModels = [
  {
    model: 'K15EP ATX3',
    slug: 'k-15-ep-atx3',
    rebate: 500,
    category: 'Professional Upright',
    description: 'Entry-level professional upright with ATX3 hybrid technology',
    features: ['ATX3 Silent System', 'Millennium III Action', '88-Key Hammer Action']
  },
  {
    model: 'K200EP ATX4',
    slug: 'k-200-ep-atx4',
    rebate: 750,
    category: 'Professional Upright',
    description: 'Premium upright piano with advanced ATX4 silent system',
    features: ['ATX4 Silent System', 'Extended Soundboard', 'Premium Hammers']
  },
  {
    model: 'K300EP Aures2',
    slug: 'k-300-ep-aures2',
    rebate: 1000,
    category: 'Professional Upright',
    description: 'Flagship upright with Aures2 hybrid technology',
    features: ['Aures2 Technology', 'Extended Soundboard', 'Ultra-responsive Action']
  },
  {
    model: 'K500EP Aures2',
    slug: 'k-500-ep-aures2',
    rebate: 1500,
    category: 'Professional Upright',
    description: 'Ultimate professional upright with Aures2 hybrid system',
    features: ['Aures2 Technology', 'Mahogany Rim Construction', 'Concert-grade Performance']
  },
  {
    model: 'GL10EP ATX4',
    slug: 'gl-10-ep-atx4',
    rebate: 2000,
    category: 'Baby Grand',
    description: 'Compact grand piano with ATX4 silent technology',
    features: ['ATX4 Silent System', "5'0\" Grand Piano", 'Full Concert Sound']
  },
  {
    model: 'GL30EP Aures2',
    slug: 'gl-30-ep-aures2',
    rebate: 2500,
    category: 'Grand Piano',
    description: 'Professional grand piano with premium Aures2 technology',
    features: ['Aures2 Technology', "5'11\" Grand Piano", 'Premium Soundboard']
  },
  {
    model: 'GX2EP Aures2',
    slug: 'gx-2-ep-aures2',
    rebate: 2500,
    category: 'Grand Piano',
    description: 'Professional GX Series grand with Aures2 hybrid system',
    features: ['Aures2 Technology', 'GX Series Excellence', 'Professional Performance']
  }
]

export default function RebatePage() {
  return (
    <div className="min-h-screen">
      <RebateHero />
      <RebateGrid models={rebateModels} />
      <RebateCTA />
    </div>
  )
}
