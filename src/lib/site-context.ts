import 'server-only'
import { headers } from 'next/headers'

export type Site = 'us' | 'cad'

export const SITE_URLS = {
  us: 'https://www.kawaius.com',
  cad: 'https://cad.kawaius.com',
} as const

export async function getSite(): Promise<Site> {
  const h = await headers()
  return (h.get('x-site') ?? 'us') as Site
}

export function getSiteName(site: Site): string {
  return site === 'cad' ? 'Kawai Canada' : 'Kawai America'
}

export function getSiteUrl(site: Site): string {
  return SITE_URLS[site]
}

/** Returns the alternates.languages object for use in Next.js Metadata hreflang tags */
export function getSiteAlternates(path: string) {
  return {
    'en-US': `${SITE_URLS.us}${path}`,
    'en-CA': `${SITE_URLS.cad}${path}`,
    'x-default': `${SITE_URLS.us}${path}`,
  }
}
