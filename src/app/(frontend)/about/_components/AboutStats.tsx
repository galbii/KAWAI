import { cn } from '@/lib/utils'
import Reveal from './Reveal'
import Counter from './Counter'

const stats = [
  { value: '1927', label: 'Founded' },
  { value: '2.4M+', label: 'Pianos Built' },
  { value: '50+', label: 'Awards' },
  { value: '61+', label: 'Competition Victories' },
  { value: '3', label: 'Generations' },
]

export default function AboutStats() {
  return (
    <section className="bg-kawai-black py-20 text-white md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-y-0">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.1}
              className={cn(
                'px-4 text-center md:border-l md:border-white/10',
                index === 0 && 'md:border-l-0',
                index === stats.length - 1 && 'col-span-2 md:col-span-1',
              )}
            >
              <div className="font-[family-name:var(--font-brand-serif)] text-5xl font-medium leading-none md:text-6xl">
                <Counter value={stat.value} />
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-kawai-gold/80">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
