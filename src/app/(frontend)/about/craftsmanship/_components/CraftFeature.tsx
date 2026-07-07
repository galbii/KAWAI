import { BrandArrowLink, Reveal } from '@/components/brand'
import { CraftMedia } from './CraftMedia'
import type { CraftFeature as CraftFeatureData } from '../_data'

/**
 * One material / process story, presented editorially: a large image on one
 * side, quiet copy and a short list of supporting points on the other. Image
 * and text sides alternate down the page. Titles render as <h2>; the supporting
 * list is captioned with an <h3> to preserve heading order.
 */
export function CraftFeature({ feature, index }: { feature: CraftFeatureData; index: number }) {
  const imageLeft = index % 2 === 1

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
        <CraftMedia
          image={feature.image}
          imageAlt={feature.imageAlt ?? feature.title}
          label={feature.mediaLabel}
        />
      </div>

      <Reveal className={imageLeft ? 'lg:order-1' : 'lg:order-2'}>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-kawai-charcoal/55">
          {feature.category}
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.08] tracking-tight text-kawai-black">
          {feature.title}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-kawai-charcoal sm:text-lg">
          {feature.description}
        </p>

        <div className="mt-9 border-t border-kawai-black/10 pt-8">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-kawai-charcoal/45">
            In detail
          </h3>
          <ul className="mt-4 space-y-3">
            {feature.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-kawai-charcoal">
                <span
                  aria-hidden
                  className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-kawai-red"
                />
                <span className="text-sm leading-relaxed sm:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {feature.link && (
          <div className="mt-8">
            <BrandArrowLink href={feature.link.href} tone="red">
              {feature.link.label}
            </BrandArrowLink>
          </div>
        )}
      </Reveal>
    </div>
  )
}
