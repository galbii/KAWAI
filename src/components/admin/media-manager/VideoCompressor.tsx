'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { compressVideoToWebM, type VideoQuality } from '@/lib/video/compressVideo'

// ─── Design tokens (matches MediaManagerModal dark theme) ────────────────────
const c = {
  bg:      '#0C0C0F',
  panel:   '#111116',
  surface: '#16161E',
  card:    '#1C1C26',
  line:    '#252535',
  lineSub: '#1C1C28',
  lineFocus: '#6366F1',
  high:    '#ECECF2',
  mid:     '#8484A0',
  lo:      '#4C4C68',
  violet:     '#6366F1',
  violetHov:  '#5558E0',
  violetGlow: 'rgba(99,102,241,0.10)',
  violetRing: 'rgba(99,102,241,0.25)',
  jade:    '#2EC4A0',
  jadeFill:'rgba(46,196,160,0.08)',
  rose:    '#F16C6C',
  roseFill:'rgba(241,108,108,0.08)',
  gold:    '#E8A84E',
  white:   '#ffffff',
  backdrop:'rgba(4,4,8,0.88)',
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

  useEffect(() => {
    return () => { isMounted.current = false }
  }, [])

  const startCompression = useCallback(async () => {
    if (isRunning.current) return
    isRunning.current = true
    setPhase('compressing')
    setProgress(0)
    setError(null)

    try {
      const compressed = await compressVideoToWebM(file, {
        quality,
        onProgress: (r) => { if (isMounted.current) setProgress(r) },
        onStatus: (s) => { if (isMounted.current) setStatus(s) },
      })

      if (!isMounted.current) return
      setSavedBytes(file.size - compressed.size)
      setPhase('done')
      setProgress(1)

      // Short pause so the "Done" state is visible, then hand off
      setTimeout(() => {
        if (isMounted.current) onComplete(compressed)
      }, 900)
    } catch (err) {
      if (!isMounted.current) return
      isRunning.current = false
      setError(err instanceof Error ? err.message : 'Compression failed')
      setPhase('error')
    }
  }, [file, quality, onComplete])

  const pct = Math.round(progress * 100)

  return (
    <>
      <style>{`
        @keyframes vcSpin { to { transform: rotate(360deg) } }
        @keyframes vcIn { from { opacity:0; transform:scale(0.97) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes vcBarFill { from { width: 0% } }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10010,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        background: c.backdrop,
        backdropFilter: 'blur(8px)',
      }}>

        {/* Card */}
        <div style={{
          position: 'relative',
          width: '100%', maxWidth: 520,
          background: c.bg,
          border: `1px solid ${c.line}`,
          borderRadius: 16,
          boxShadow: '0 32px 96px rgba(0,0,0,0.85), 0 8px 32px rgba(0,0,0,0.5)',
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
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: c.high, lineHeight: 1.3 }}>
                Compress Video
              </div>
              <div style={{ fontSize: 12.5, color: c.mid, marginTop: 2 }}>
                Convert to WebM (VP9) for optimised web delivery
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 22px 24px' }}>

            {/* File info */}
            <div style={{
              padding: '11px 14px',
              background: c.surface,
              border: `1px solid ${c.lineSub}`,
              borderRadius: 9,
              marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
              <span style={{ fontSize: 13.5, color: c.high, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {file.name}
              </span>
              <span style={{ fontSize: 12.5, color: c.lo, flexShrink: 0 }}>
                {formatBytes(file.size)}
              </span>
            </div>

            {/* Quality selector — only shown in ready/error state */}
            {(phase === 'ready' || phase === 'error') && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.lo, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  Quality
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['fast', 'balanced', 'high'] as const).map((q) => {
                    const labels: Record<VideoQuality, string> = { fast: 'Fast', balanced: 'Balanced', high: 'High Quality' }
                    const hints: Record<VideoQuality, string> = { fast: 'Quickest', balanced: 'Recommended', high: 'Slowest' }
                    const active = quality === q
                    return (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        style={{
                          flex: 1,
                          padding: '9px 8px',
                          borderRadius: 8,
                          background: active ? c.violetGlow : c.surface,
                          border: `1px solid ${active ? c.violet : c.line}`,
                          color: active ? c.violet : c.mid,
                          cursor: 'pointer', outline: 'none',
                          transition: 'all 0.12s',
                          textAlign: 'center' as const,
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{labels[q]}</div>
                        <div style={{ fontSize: 11, color: active ? c.violet : c.lo, marginTop: 2 }}>{hints[q]}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Progress — shown while compressing or done */}
            {(phase === 'compressing' || phase === 'done') && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: c.mid }}>{status || 'Processing…'}</span>
                  <span style={{ fontSize: 13, color: phase === 'done' ? c.jade : c.violet, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    {pct}%
                  </span>
                </div>
                <div style={{
                  height: 6, background: c.surface, borderRadius: 999,
                  border: `1px solid ${c.lineSub}`, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: phase === 'done'
                      ? `linear-gradient(90deg, ${c.jade}, #5FD4B8)`
                      : `linear-gradient(90deg, ${c.violet}, #818CF8)`,
                    borderRadius: 999,
                    transition: 'width 0.3s ease',
                  }} />
                </div>

                {phase === 'done' && savedBytes !== null && (
                  <div style={{
                    marginTop: 12, padding: '9px 12px',
                    background: c.jadeFill,
                    border: `1px solid rgba(46,196,160,0.2)`,
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.jade} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 13, color: c.jade }}>
                      {savedBytes > 0
                        ? `Saved ${formatBytes(savedBytes)} (${Math.round((savedBytes / file.size) * 100)}% smaller)`
                        : 'Compression complete — uploading…'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {phase === 'error' && error && (
              <div style={{
                marginBottom: 18, padding: '10px 12px',
                background: c.roseFill, border: `1px solid rgba(241,108,108,0.25)`,
                borderRadius: 8,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <div style={{ fontSize: 13, color: c.rose, fontWeight: 500 }}>Compression failed</div>
                  <div style={{ fontSize: 12, color: c.mid, marginTop: 3, wordBreak: 'break-word' }}>{error}</div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {phase === 'ready' && (
                <>
                  <button
                    onClick={startCompression}
                    style={{
                      flex: 1, height: 42, borderRadius: 8,
                      background: c.violet, border: 'none',
                      color: c.white, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', outline: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.violetHov }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Compress & Upload
                  </button>
                  <button
                    onClick={() => onSkip(file)}
                    style={{
                      height: 42, padding: '0 16px', borderRadius: 8,
                      background: 'transparent', border: `1px solid ${c.line}`,
                      color: c.mid, fontSize: 13.5, fontWeight: 500,
                      cursor: 'pointer', outline: 'none',
                      transition: 'background 0.1s, color 0.1s',
                      whiteSpace: 'nowrap' as const,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={onCancel}
                    style={{
                      height: 42, padding: '0 14px', borderRadius: 8,
                      background: 'transparent', border: `1px solid ${c.line}`,
                      color: c.lo, fontSize: 13.5,
                      cursor: 'pointer', outline: 'none',
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
                <button
                  onClick={() => onSkip(file)}
                  style={{
                    flex: 1, height: 42, borderRadius: 8,
                    background: 'transparent', border: `1px solid ${c.line}`,
                    color: c.mid, fontSize: 13.5, fontWeight: 500,
                    cursor: 'pointer', outline: 'none',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                >
                  Skip — Upload Original
                </button>
              )}

              {phase === 'error' && (
                <>
                  <button
                    onClick={() => { isRunning.current = false; startCompression() }}
                    style={{
                      flex: 1, height: 42, borderRadius: 8,
                      background: c.violet, border: 'none',
                      color: c.white, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', outline: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.violetHov }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => onSkip(file)}
                    style={{
                      flex: 1, height: 42, borderRadius: 8,
                      background: 'transparent', border: `1px solid ${c.line}`,
                      color: c.mid, fontSize: 13.5, fontWeight: 500,
                      cursor: 'pointer', outline: 'none',
                      transition: 'background 0.1s, color 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.high }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.mid }}
                  >
                    Upload Original
                  </button>
                  <button
                    onClick={onCancel}
                    style={{
                      height: 42, padding: '0 14px', borderRadius: 8,
                      background: 'transparent', border: `1px solid ${c.line}`,
                      color: c.lo, fontSize: 13.5,
                      cursor: 'pointer', outline: 'none',
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Tip */}
            {phase === 'ready' && (
              <p style={{ margin: '14px 0 0', fontSize: 12, color: c.lo, lineHeight: 1.5 }}>
                WebM (VP9) is ~30–40% smaller than MP4 with the same visual quality and plays natively in all modern browsers.
              </p>
            )}
            {phase === 'compressing' && (
              <p style={{ margin: '14px 0 0', fontSize: 12, color: c.lo, lineHeight: 1.5 }}>
                Encoding runs in your browser via WebAssembly. Large files may take a few minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
