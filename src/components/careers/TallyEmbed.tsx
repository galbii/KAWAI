'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void }
  }
}

const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js'

export function TallyEmbed() {
  useEffect(() => {
    function loadEmbeds() {
      if (window.Tally) {
        window.Tally.loadEmbeds()
      } else {
        document.querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])').forEach((el) => {
          el.src = el.dataset.tallySrc ?? ''
        })
      }
    }

    if (window.Tally) {
      loadEmbeds()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TALLY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', loadEmbeds)
      return
    }

    const s = document.createElement('script')
    s.src = TALLY_SCRIPT
    s.onload = loadEmbeds
    s.onerror = loadEmbeds
    document.body.appendChild(s)
  }, [])

  return (
    <iframe
      data-tally-src="https://tally.so/embed/obKazN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="1605"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="Job application"
    />
  )
}
