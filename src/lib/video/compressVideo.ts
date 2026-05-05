/** Returns true for MP4/MOV files that should go through the video compressor */
export function isCompressibleVideo(file: File): boolean {
  return (
    file.type === 'video/mp4' ||
    file.type === 'video/quicktime' ||
    file.name.toLowerCase().endsWith('.mp4') ||
    file.name.toLowerCase().endsWith('.mov')
  )
}

export type VideoQuality = 'fast' | 'balanced' | 'high'
