import Image from 'next/image'
import { DISPLAY } from './tokens'

/**
 * The comp's sign-off: the KAWAI wordmark in Kawai red, a thin black rule the
 * width of the word, and the tagline in a smaller black serif tight under it.
 *
 * The wordmark is the brand's own red logo file (`/images/logos/
 * kawai-logo-new-red.png`, 1030×207), never re-set in a font. The tagline is
 * passed in by the campaign, like every other word on the page.
 */
export function Wordmark({
  tagline,
  className = '',
  tone = 'red',
}: {
  tagline: string
  className?: string
  /**
   * `red` (default): the red logo, black rule and tagline, for the white field.
   * `reversed`: the same logo file knocked out to white, with a white rule and
   * tagline, for a dark photograph (kawai-holiday-close-redesign v1). The
   * default output is unchanged.
   */
  tone?: 'red' | 'reversed'
}) {
  const reversed = tone === 'reversed'
  return (
    <div className={`inline-flex w-[9.5rem] flex-col items-stretch sm:w-[11rem] ${className}`}>
      <Image
        src="/images/logos/kawai-logo-new-red.png"
        alt="Kawai"
        width={1030}
        height={207}
        sizes="176px"
        className={reversed ? 'h-auto w-full brightness-0 invert' : 'h-auto w-full'}
      />
      <span aria-hidden className={`mt-2 block h-px w-full ${reversed ? 'bg-white/80' : 'bg-kawai-black'}`} />
      <span
        className={`mt-1.5 block whitespace-nowrap text-center ${reversed ? 'text-white' : 'text-kawai-black'}`}
        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '0.98rem', lineHeight: 1.15 }}
      >
        {tagline}
      </span>
    </div>
  )
}
