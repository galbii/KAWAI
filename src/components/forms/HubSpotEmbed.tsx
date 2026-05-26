'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  title: string
  initialHeight?: number
  className?: string
}

export function HubSpotEmbed({ src, title, initialHeight = 1100, className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(initialHeight)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const expectedOrigin = (() => {
      try {
        return new URL(src).origin
      } catch {
        return null
      }
    })()

    const handleMessage = (event: MessageEvent) => {
      if (expectedOrigin && event.origin !== expectedOrigin) return
      if (event.source !== iframe.contentWindow) return

      const data = event.data
      if (!data) return

      // HubSpot share embeds post a few shapes — accept any that carry a numeric height.
      // Shape 1: { type: 'embedded-form-height', height: 1234 }
      // Shape 2: { type: 'hsFormCallback', eventName: 'onFormResize', data: { height: 1234 } }
      // Shape 3: { height: 1234 }
      let next: number | undefined

      if (typeof data === 'object') {
        if (typeof data.height === 'number') next = data.height
        else if (data.data && typeof data.data.height === 'number') next = data.data.height
      }

      if (typeof next === 'number' && next > 0 && next < 10000) {
        setHeight(Math.ceil(next))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [src])

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className={className}
      style={{ height: `${height}px`, background: 'white' }}
      loading="lazy"
    />
  )
}
