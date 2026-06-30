import { BrandArrowLink, Reveal } from '@/components/brand'
import { TechMedia } from './TechMedia'
import type { Technology } from '../_data'

/**
 * One technology, presented minimally: a large image on one side, a few quiet
 * words on the other. Image and text sides alternate down the page. The full
 * feature/benefit detail is kept but de-emphasised beneath the lead copy.
 */
export function TechFeature({ tech, index }: { tech: Technology; index: number }) {
  const imageLeft = index % 2 === 1

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
        <TechMedia
          image={tech.image}
          imageAlt={tech.imageAlt ?? tech.name}
          videoId={tech.videoId}
          label={tech.name}
        />
      </div>

      <Reveal className={imageLeft ? 'lg:order-1' : 'lg:order-2'}>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-kawai-charcoal/55">
          {tech.category}
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.08] tracking-tight text-kawai-black">
          {tech.name}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-kawai-charcoal sm:text-lg">
          {tech.description}
        </p>
        <div className="mt-7">
          <BrandArrowLink href={tech.detailPath} tone="red">
            Learn more
          </BrandArrowLink>
        </div>

        {/* Detail kept, quietly */}
        <div className="mt-10 grid gap-x-10 gap-y-6 border-t border-kawai-black/10 pt-8 sm:grid-cols-2">
          <QuietList heading="Features" items={tech.features} />
          <QuietList heading="Benefits" items={tech.benefits} />
        </div>
      </Reveal>
    </div>
  )
}

function QuietList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-kawai-charcoal/45">
        {heading}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-snug text-kawai-charcoal/75">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
