'use server'

import { isIP } from 'node:net'
import type { ServerHubSpotSubmitResult } from '@/lib/hubspot/server-submit'

/**
 * Lead form → HubSpot, from the server, with the lead's owner in the hidden
 * `rsm` field (kawai-lead-rsm-holiday v2, Nov 25, 2026). Called by the
 * campaign LeadForm through src/lib/hubspot/routed-submit.ts; see
 * src/lib/hubspot/server-submit.ts for the contract and the fallbacks.
 *
 * Only allow-listed forms are submitted here; anything unexpected answers
 * `retryInBrowser` and the browser submits exactly as before. The response
 * carries no owner name or address — only ok / error / retryInBrowser.
 *
 * Heavy, server-only modules (routing → Payload) are imported inside the
 * function so the client bundle that references this action never pulls them.
 */
export async function submitLeadToHubSpot(input: unknown): Promise<ServerHubSpotSubmitResult> {
  try {
    const [{ submitLeadServerSide }, { resolveLeadOwnerLabel }, { headers }] = await Promise.all([
      import('@/lib/hubspot/server-submit'),
      import('@/lib/rsm/resolve-lead-owner'),
      import('next/headers'),
    ])
    return await submitLeadServerSide(input, {
      resolveOwnerLabel: resolveLeadOwnerLabel,
      fetch,
      ipAddress: visitorIp(await headers()),
    })
  } catch (err) {
    console.error('[submit-lead-hubspot] Failed — browser submits instead:', err)
    return { ok: false, retryInBrowser: true }
  }
}

/** The visitor's IP from the proxy headers (Cloudflare first), or null. Only a valid IP is passed on. */
function visitorIp(h: Headers): string | null {
  const candidates = [
    h.get('cf-connecting-ip'),
    h.get('x-real-ip'),
    h.get('x-forwarded-for')?.split(',')[0],
  ]
  for (const c of candidates) {
    const ip = c?.trim()
    if (ip && isIP(ip)) return ip
  }
  return null
}
