'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { VideoQuality } from '@/lib/video/compressVideo'

// ─── Design tokens (matches MediaManagerModal) ───────────────────────────────
const c = {
  bg:         '#0C0C0F',
  panel:      '#111116',
  surface:    '#16161E',
  card:       '#1C1C26',
  line:       '#252535',
  lineSub:    '#1C1C28',
  high:       '#ECECF2',
  mid:        '#8484A0',
  lo:         '#4C4C68',
  violet:     '#6366F1',
  violetHov:  '#5558E0',
  violetGlow: 'rgba(99,102,241,0.10)',
  violetRing: 'rgba(99,102,241,0.25)',
  jade:       '#2EC4A0',
  jadeFill:   'rgba(46,196,160,0.08)',
  rose:       '#F16C6C',
  roseFill:   'rgba(241,108,108,0.08)',
  white:      '#ffffff',
  backdrop:   'rgba(4,4,8,0.88)',
}

// Cache blob URLs across component mounts — only download once per session.
// Uses @ffmpeg/core-mt (multi-threaded) so ffmpeg.exec() runs in a Worker,
// keeping the main thread free to receive progress events and update React state.
// Requires SharedArrayBuffer — enabled by the COEP/COOP headers on /admin routes.
const CDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/umd'
let _coreURL: string | null = null
let _wasmURL: string | null = null
let _workerURL: string | null = null

async function getBlobURLs(onStatus: (s: string) => void): Promise<{ coreURL: string; wasmURL: string; workerURL: string }> {
  if (_coreURL && _wasmURL && _workerURL) {
    return { coreURL: _coreURL, wasmURL: _wasmURL, workerURL: _workerURL }
  }

  onStatus('Downloading encoder (~33 MB, one-time)…')
  const { toBlobURL } = await import('@ffmpeg/util')

  const [coreURL, wasmURL, workerURL] = await Promise.all([
    toBlobURL(`${CDN}/ffmpeg-core.js`, 'text/javascript'),
    toBlobURL(`${CDN}/ffmpeg-core.wasm`, 'application/wasm'),
    toBlobURL(`${CDN}/ffmpeg-core.worker.js`, 'text/javascript'),
  ])

  _coreURL = coreURL
  _wasmURL = wasmURL
  _workerURL = workerURL
  return { coreURL, wasmURL, workerURL }
}

const PRESETS: Record<VideoQuality, { crf: string; cpuUsed: string; deadline: string }> = {
  fast:     { crf: '40', cpuUsed: '5', deadline: 'realtime' },
  balanced: { crf: '33', cpuUsed: '4', deadline: 'good' },
  high:     { crf: '28', cpuUsed: '2', deadline: 'good' },
}

type Phase = 'ready' | 'compressing' | 'done' | 'error'

interface Props {
  file: File
  onComplete: (compressed: File) => void
  onSkip: (original: File) => void
  onCancel: () => void
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function VideoCompressor({ file, onComplete, onSkip, onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [quality, setQuality] = useState<VideoQuality>('balanced')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [savedBytes, setSavedBytes] = useState<number | null>(null)

  const isMounted = useRef(true)
  const isRunning = useRef(false)
  // Per-docs pattern: one FFmpeg instance per compression run, stored in a ref
  const ffmpegRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      isMounted.current = false
      try { ffmpegRef.current?.terminate?.() } catch {}
    }
  }, [])

  const startCompression = useCallback(async () => {
    if (isRunning.current) return
    isRunning.current = true
    setPhase('compressing')
    setProgress(0)
    setStatus('')
    setError(null)

    try {
      // Dynamic import keeps @ffmpeg/ffmpeg out of the SSR bundle
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile } = await import('@ffmpeg/util')

      // Create a fresh instance per the documented pattern
      const ffmpeg = new FFmpeg()
      ffmpegRef.current = ffmpeg

      // Attach listeners BEFORE load() — required by the library
      ffmpeg.on('log', ({ message }: { message: string }) => {
        console.debug('[FFmpeg]', message)
      })
      ffmpeg.on('progress', ({ progress: p }: { progress: number }) => {
        if (isMounted.current) setProgress(Math.max(0, Math.min(1, p)))
      })

      // Fetch + cache blob URLs
      const { coreURL, wasmURL, workerURL } = await getBlobURLs((s) => {
        if (isMounted.current) setStatus(s)
      })

      if (isMounted.current) setStatus('Loading encoder…')
      await ffmpeg.load({ coreURL, wasmURL, workerURL })

      // Write input
      if (isMounted.current) setStatus('Reading file…')
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
      const inputName = `input.${ext}`
      await ffmpeg.writeFile(inputName, await fetchFile(file))

      // Encode
      if (isMounted.current) setStatus('Compressing to WebM (VP9)…')
      const preset = PRESETS[quality]
      await ffmpeg.exec([
        '-i', inputName,
        '-c:v', 'libvpx-vp9',
        '-crf', preset.crf,
        '-b:v', '0',
        '-deadline', preset.deadline,
        '-cpu-used', preset.cpuUsed,
        '-c:a', 'libopus',
        '-b:a', '128k',
        'output.webm',
      ])

      // Read output
      if (isMounted.current) setStatus('Finalizing…')
      const data = await ffmpeg.readFile('output.webm')
      // Wrap in new Uint8Array to get a concrete ArrayBuffer (not SharedArrayBuffer)
      const bytes = new Uint8Array(data as Uint8Array)
      const compressed = new File(
        [bytes],
        file.name.replace(/\.[^.]+$/, '.webm'),
        { type: 'video/webm' }
      )

      if (!isMounted.current) return
      setSavedBytes(file.size - compressed.size)
      setPhase('done')
      setProgress(1)
      setStatus('Done!')

      // Brief pause so the success state is visible before handing off
      setTimeout(() => {
        if (isMounted.current) onComplete(compressed)
      }, 1200)
    } catch (err) {
      if (!isMounted.current) return
      isRunning.current = false
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[VideoCompressor] failed:', msg, err)
      setError(msg)
      setPhase('error')
    }
  }, [file, quality, onComplete])

  const handleRetry = useCallback(() => {
    isRunning.current = false
    setError(null)
    setProgress(0)
    setStatus('')
    setPhase('ready')
  }, [])

  const pct = Math.round(progress * 100)
  const isDownloading = phase === 'compressing' && pct === 0

  return (
    <>
      <style>{`
        @keyframes vcIn { from { opacity:0; transform:scale(0.97) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes vcPulse { 0%,100% { opacity:0.45 } 50% { opacity:1 } }
        @keyframes vcShimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 10010,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        background: c.backdrop,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          width: '100%', maxWidth: 520,
          background: c.bg,
          border: `1px solid ${c.line}`,
          borderRadius: 16,
          boxShadow: '0 32px 96px rgba(0,0,0,0.85)',
          color: c.high,
          overflow: 'hidden',
          animation: 'vcIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards',
        }}>

          {/* Header */}
          <div style={{
            padding: '20px 22px 18px',
            borderBottom: `1px solid ${c.line}`,
            background: c.panel,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: c.violetGlow, border: `1px solid ${c.violetRing}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>Compress Video</div>
              <div style={{ fontSize: 12.5, color: c.mid, marginTop: 2 }}>Convert to WebM / VP9 for optimised web delivery</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 22px 24px' }}>

            {/* File info */}
            <div style={{
              padding: '11px 14px', background: c.surface,
              border: `1px solid ${c.lineSub}`, borderRadius: 9, marginBottom: 22,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
              <span style={{ fontSize: 13.5, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
              <span style={{ fontSize: 12.5, color: c.lo, flexShrink: 0 }}>{formatBytes(file.size)}</span>
            </div>

            {/* Quality picker — ready or error only */}
            {(phase === 'ready' || phase === 'error') && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: c.lo, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  Quality
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['fast', 'balanced', 'high'] as const).map((q) => {
                    const labels = { fast: 'Fast', balanced: 'Balanced', high: 'High Quality' }
                    const hints  = { fast: 'Quickest', balanced: 'Recommended', high: 'Slowest' }
                    const active = quality === q
                    return (
                      <button key={q} onClick={() => setQuality(q)} style={{
                        flex: 1, padding: '9px 8px', borderRadius: 8, cursor: 'pointer', outline: 'none',
                        background: active ? c.violetGlow : c.surface,
                        border: `1px solid ${active ? c.violet : c.line}`,
                        color: active ? c.violet : c.mid,
                        transition: 'all 0.12s', textAlign: 'center' as const,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{labels[q]}</div>
                        <div style={{ fontSize: 11, color: active ? c.violet : c.lo, marginTop: 2 }}>{hints[q]}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Progress */}
            {(phase === 'compressing' || phase === 'done') && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{
                    fontSize: 13, color: c.mid,
                    animation: isDownloading ? 'vcPulse 1.6s ease-in-out infinite' : 'none',
                  }}>
                    {status || 'Working…'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: phase === 'done' ? c.jade : c.violet }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: c.surface, borderRadius: 999, border: `1px solid ${c.lineSub}`, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: isDownloading ? '100%' : `${pct}%`,
                    borderRadius: 999,
                    transition: isDownloading ? 'none' : 'width 0.4s ease',
                    background: isDownloading
                      ? `linear-gradient(90deg, ${c.surface} 0%, ${c.violet} 40%, #818CF8 60%, ${c.surface} 100%)`
                      : phase === 'done'
                        ? `linear-gradient(90deg, ${c.jade}, #5FD4B8)`
                        : `linear-gradient(90deg, ${c.violet}, #818CF8)`,
                    backgroundSize: isDownloading ? '200% 100%' : '100% 100%',
                    animation: isDownloading ? 'vcShimmer 1.6s linear infinite' : 'none',
                  }} />
                </div>

                {phase === 'done' && savedBytes !== null && (
                  <div style={{
                    marginTop: 12, padding: '9px 12px',
                    background: c.jadeFill, border: `1px solid rgba(46,196,160,0.2)`, borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.jade} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 13, color: c.jade }}>
                      {savedBytes > 0
                        ? `Saved ${formatBytes(savedBytes)} — ${Math.round((savedBytes / file.size) * 100)}% smaller`
                        : 'Compression complete — uploading…'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {phase === 'error' && error && (
              <div style={{
                marginBottom: 18, padding: '10px 12px',
                background: c.roseFill, border: `1px solid rgba(241,108,108,0.25)`, borderRadius: 8,
              }}>
                <div style={{ fontSize: 13, color: c.rose, fontWeight: 500, marginBottom: 4 }}>Compression failed</div>
                <div style={{ fontSize: 12, color: c.mid, wordBreak: 'break-word', lineHeight: 1.5 }}>{error}</div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {phase === 'ready' && (
                <>
                  <button onClick={startCompression} style={{
                    flex: 1, height: 42, borderRadius: 8, border: 'none',
                    background: c.violet, color: c.white, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', outline: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'background 0.12s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.violetHov }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Compress &amp; Upload
                  </button>
                  <button onClick={() => onSkip(file)} style={{
                    height: 42, padding: '0 16px', borderRadius: 8,
                    background: 'transparent', border: `1px solid ${c.line}`,
                    color: c.mid, fontSize: 13.5, fontWeight: 500,
                    cursor: 'pointer', outline: 'none', whiteSpace: 'nowrap' as const,
                    transition: 'background 0.1s, color 0.1s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                  >
                    Skip
                  </button>
                  <button onClick={onCancel} style={{
                    height: 42, padding: '0 14px', borderRadius: 8,
                    background: 'transparent', border: `1px solid ${c.line}`,
                    color: c.lo, fontSize: 13.5, cursor: 'pointer', outline: 'none',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.roseFill; e.currentTarget.style.color = c.rose }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.lo }}
                  >
                    Cancel
                  </button>
                </>
              )}

              {phase === 'compressing' && (
                <button onClick={() => onSkip(file)} style={{
                  flex: 1, height: 42, borderRadius: 8,
                  background: 'transparent', border: `1px solid ${c.line}`,
                  color: c.mid, fontSize: 13.5, fontWeight: 500,
                  cursor: 'pointer', outline: 'none', transition: 'background 0.1s, color 0.1s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                >
                  Skip — Upload Original
                </button>
              )}

              {phase === 'error' && (
                <>
                  <button onClick={handleRetry} style={{
                    flex: 1, height: 42, borderRadius: 8, border: 'none',
                    background: c.violet, color: c.white, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', outline: 'none', transition: 'background 0.12s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.violetHov }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
                  >
                    Retry
                  </button>
                  <button onClick={() => onSkip(file)} style={{
                    flex: 1, height: 42, borderRadius: 8,
                    background: 'transparent', border: `1px solid ${c.line}`,
                    color: c.mid, fontSize: 13.5, fontWeight: 500,
                    cursor: 'pointer', outline: 'none', transition: 'background 0.1s, color 0.1s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                  >
                    Upload Original
                  </button>
                  <button onClick={onCancel} style={{
                    height: 42, padding: '0 14px', borderRadius: 8,
                    background: 'transparent', border: `1px solid ${c.line}`,
                    color: c.lo, fontSize: 13.5, cursor: 'pointer', outline: 'none',
                  }}>
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Hints */}
            {phase === 'ready' && (
              <p style={{ margin: '14px 0 0', fontSize: 12, color: c.lo, lineHeight: 1.5 }}>
                WebM / VP9 is ~30–40% smaller than MP4 at the same visual quality and plays natively in all modern browsers. The encoder (~33 MB) downloads once and stays cached for your session.
              </p>
            )}
            {phase === 'compressing' && isDownloading && (
              <p style={{ margin: '14px 0 0', fontSize: 12, color: c.lo, lineHeight: 1.5 }}>
                Downloading the WebAssembly encoder for the first time — this is a one-time ~33 MB download cached for your session.
              </p>
            )}
            {phase === 'compressing' && !isDownloading && (
              <p style={{ margin: '14px 0 0', fontSize: 12, color: c.lo, lineHeight: 1.5 }}>
                Encoding runs locally in your browser. Large files may take a few minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
