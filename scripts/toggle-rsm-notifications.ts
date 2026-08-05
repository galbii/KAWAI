#!/usr/bin/env bun
/**
 * Toggle the "RSM Lead Notification Emails" flag on the Home Page singleton.
 *
 * Usage:
 *   bun scripts/toggle-rsm-notifications.ts --disable   # pause RSM emails
 *   bun scripts/toggle-rsm-notifications.ts --enable    # resume RSM emails
 *
 * (Same as unchecking/checking the sidebar box in /admin → Home Page.
 *  The server action caches the flag for 5 minutes, so allow that lag.)
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const enable = process.argv.includes('--enable')
const disable = process.argv.includes('--disable')

if (enable === disable) {
  console.error('Pass exactly one of --enable or --disable')
  process.exit(1)
}

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'home-page',
  limit: 1,
  depth: 0,
  select: { enableRsmLeadNotifications: true },
})

const doc = docs[0]
if (!doc) {
  console.error('No home-page document found')
  process.exit(1)
}

await payload.update({
  collection: 'home-page',
  id: doc.id,
  data: { enableRsmLeadNotifications: enable },
  context: { skipHook: true },
})

console.log(
  `✅ RSM lead notifications ${enable ? 'ENABLED' : 'DISABLED'} (was: ${
    doc.enableRsmLeadNotifications !== false ? 'enabled' : 'disabled'
  })`,
)
process.exit(0)
