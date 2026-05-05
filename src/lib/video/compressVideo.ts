import type { FFmpeg } from '@ffmpeg/ffmpeg'

// Singleton — lazy loaded once, reused across uploads
let _instance: FFmpeg | null = null
let _loadPromise: Promise<FFmpeg> | null = null

const CDN = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

async function getInstance(): Promise<FFmpeg> {
  if (_instance) return _instance
  if (_loadPromise) return _loadPromise

  _loadPromise = (async () => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const ffmpeg = new FFmpeg()
    await ffmpeg.load({
      coreURL: `${CDN}/ffmpeg-core.js`,
      wasmURL: `${CDN}/ffmpeg-core.wasm`,
    })
    _instance = ffmpeg
    return ffmpeg
  })()

  return _loadPromise
}

export type VideoQuality = 'fast' | 'balanced' | 'high'

const QUALITY_PRESETS: Record<VideoQuality, { crf: string; cpuUsed: string; deadline: string }> = {
  fast:     { crf: '40', cpuUsed: '5', deadline: 'realtime' },
  balanced: { crf: '33', cpuUsed: '4', deadline: 'good' },
  high:     { crf: '28', cpuUsed: '2', deadline: 'good' },
}

export interface CompressOptions {
  quality?: VideoQuality
  onProgress?: (ratio: number) => void
  onStatus?: (status: string) => void
}

/** Returns true for file types we should offer to compress */
export function isCompressibleVideo(file: File): boolean {
  return (
    file.type === 'video/mp4' ||
    file.type === 'video/quicktime' ||
    file.name.toLowerCase().endsWith('.mp4') ||
    file.name.toLowerCase().endsWith('.mov')
  )
}

export async function compressVideoToWebM(file: File, opts: CompressOptions = {}): Promise<File> {
  const { quality = 'balanced', onProgress, onStatus } = opts
  const preset = QUALITY_PRESETS[quality]

  onStatus?.('Loading encoder…')
  const ffmpeg = await getInstance()

  const progressHandler = ({ progress }: { progress: number }) => {
    onProgress?.(Math.max(0, Math.min(1, progress)))
  }
  ffmpeg.on('progress', progressHandler)

  const ts = Date.now()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
  const inputName = `in_${ts}.${ext}`
  const outputName = `out_${ts}.webm`

  try {
    onStatus?.('Reading file…')
    const { fetchFile } = await import('@ffmpeg/util')
    await ffmpeg.writeFile(inputName, await fetchFile(file))

    onStatus?.('Compressing to WebM (VP9)…')
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libvpx-vp9',
      '-crf', preset.crf,
      '-b:v', '0',
      '-deadline', preset.deadline,
      '-cpu-used', preset.cpuUsed,
      '-c:a', 'libopus',
      '-b:a', '128k',
      outputName,
    ])

    onStatus?.('Finalizing…')
    const data = await ffmpeg.readFile(outputName)
    const outName = file.name.replace(/\.[^.]+$/, '.webm')
    // Wrap in new Uint8Array to guarantee ArrayBuffer (not SharedArrayBuffer)
    const bytes = new Uint8Array(data as Uint8Array)
    return new File([bytes], outName, { type: 'video/webm' })
  } finally {
    ffmpeg.off('progress', progressHandler)
    try { await ffmpeg.deleteFile(inputName) } catch {}
    try { await ffmpeg.deleteFile(outputName) } catch {}
  }
}
