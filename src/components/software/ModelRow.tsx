import { formatBytes } from '@/lib/software/grouping'
import type { SoftwareModel } from '@/lib/software/types'

/**
 * One instrument in the register: model, version, and the actions for it, on a
 * single ruled line.
 *
 * Rendered as ruled rows rather than cards — 55 bordered cards turn the page into
 * a scroll of boxes, and the repeating unit here is a record, not an object.
 *
 * The model name is deliberately a <div>, not a heading: 55 model headings would
 * bury the page structure for screen-reader heading navigation. The category and
 * series headings carry that job.
 */
export function ModelRow({ model }: { model: SoftwareModel }) {
  const multi = model.downloads.length > 1

  return (
    <div id={model.slug} className="scroll-mt-44 border-b border-kawai-neutral/60 last:border-b-0">
      {model.downloads.map((d, i) => {
        const size = formatBytes(d.fileBytes)
        return (
          <div
            key={`${d.label}-${d.version}`}
            className={[
              'grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 py-3',
              'sm:grid-cols-[minmax(7rem,9rem)_minmax(5rem,13rem)_minmax(0,1fr)]',
              i > 0 ? 'border-t border-dashed border-kawai-neutral/50' : '',
            ].join(' ')}
          >
            {/* Model name — printed once per instrument, not once per file. */}
            <div className="col-span-2 sm:col-span-1">
              {i === 0 ? (
                <span className="font-medium text-kawai-black">{model.model}</span>
              ) : (
                <span className="sr-only">{model.model}</span>
              )}
            </div>

            <div className="flex items-baseline gap-2.5 text-sm">
              {multi ? (
                <span className="whitespace-nowrap text-[12px] text-kawai-charcoal/70">
                  {d.label}
                </span>
              ) : null}
              {d.version ? (
                <span className="tabular-nums tracking-[0.01em] text-kawai-black">{d.version}</span>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-4 justify-self-end">
              {d.instructionsUrl ? (
                <a
                  href={d.instructionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${model.model} ${d.label} update instructions, PDF`}
                  className="text-[13px] text-kawai-charcoal underline decoration-kawai-neutral underline-offset-4 transition-colors hover:text-kawai-black hover:decoration-kawai-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-charcoal"
                >
                  Instructions
                </a>
              ) : null}

              <a
                href={d.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${model.model} ${d.label} firmware${d.version ? ` version ${d.version}` : ''}${size ? `, ${size}` : ''}`}
                className="inline-flex items-center gap-2 rounded-sm bg-kawai-red px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-kawai-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
              >
                <DownloadIcon />
                Download
                {size ? <span className="font-normal tabular-nums text-white/70">{size}</span> : null}
              </a>
            </div>

            {i === 0 && model.notes ? (
              <p className="col-span-2 text-[13px] leading-relaxed text-kawai-charcoal/70 sm:col-span-3">
                {model.notes}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2.5v7m0 0L5.25 6.75M8 9.5l2.75-2.75M3 13h10" />
    </svg>
  )
}
