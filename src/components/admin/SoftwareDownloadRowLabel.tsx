'use client'

/**
 * Row label for the `downloads` array on software-releases, so a collapsed row
 * reads "System — v1.25" instead of "Download 01".
 */
export function SoftwareDownloadRowLabel({
  data,
}: {
  data?: { label?: string; version?: string }
}) {
  const label = data?.label?.trim()
  const version = data?.version?.trim()
  if (!label && !version) return 'New download'
  if (!version) return label ?? 'New download'
  return `${label ?? 'Download'} — v${version}`
}
