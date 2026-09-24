/**
 * Tests for the software/firmware search-intent matcher.
 * Run with: bun test src/lib/software/intent.test.ts
 */

import { describe, test, expect } from 'bun:test'
import { matchesSoftwareIntent, stripSoftwareTerms } from './intent'

describe('matchesSoftwareIntent', () => {
  test('matches the plain terms people actually type', () => {
    for (const q of ['software', 'firmware', 'update', 'updates', 'downloads', 'os']) {
      expect(matchesSoftwareIntent(q)).toBe(true)
    }
  })

  test('is case- and whitespace-insensitive', () => {
    expect(matchesSoftwareIntent('  FIRMWARE ')).toBe(true)
    expect(matchesSoftwareIntent('Software')).toBe(true)
  })

  test('matches a term embedded in a longer query', () => {
    expect(matchesSoftwareIntent('es920 firmware')).toBe(true)
    expect(matchesSoftwareIntent('how do I update my piano')).toBe(true)
  })

  test('matches decisive phrases', () => {
    expect(matchesSoftwareIntent('what software version am I on')).toBe(true)
    expect(matchesSoftwareIntent('operating system')).toBe(true)
  })

  test('does not fire on partial words', () => {
    expect(matchesSoftwareIntent('updated')).toBe(false)
    expect(matchesSoftwareIntent('downloader')).toBe(false)
    expect(matchesSoftwareIntent('softwareish')).toBe(false)
  })

  test('ignores unrelated queries', () => {
    for (const q of ['bluetooth', 'grand piano', 'st louis', 'warranty', 'es920']) {
      expect(matchesSoftwareIntent(q)).toBe(false)
    }
  })

  test('ignores queries too short to search on', () => {
    expect(matchesSoftwareIntent('')).toBe(false)
    expect(matchesSoftwareIntent('s')).toBe(false)
  })
})

describe('stripSoftwareTerms', () => {
  test('leaves the model behind', () => {
    expect(stripSoftwareTerms('es920 firmware')).toBe('es920')
    expect(stripSoftwareTerms('firmware for CA901')).toBe('for ca901')
    expect(stripSoftwareTerms('NV12 software update')).toBe('nv12')
  })

  test('returns empty when only errand words were typed', () => {
    expect(stripSoftwareTerms('firmware')).toBe('')
    expect(stripSoftwareTerms('software update')).toBe('')
    expect(stripSoftwareTerms('downloads')).toBe('')
  })

  test('leaves unrelated queries intact', () => {
    expect(stripSoftwareTerms('bluetooth pairing')).toBe('bluetooth pairing')
  })
})
