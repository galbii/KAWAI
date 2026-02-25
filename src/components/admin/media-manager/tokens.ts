/**
 * Media Manager Design Tokens
 * Single source of truth for all colors used across media manager components.
 * Import this instead of redeclaring colors in each file.
 */

export const mm = {
  // Backgrounds
  bg:      '#0C0C0F',
  panel:   '#111116',
  surface: '#16161E',
  card:    '#1C1C26',
  input:   '#12121A',
  hover:   '#1E1E2A',

  // Borders
  line:      '#252535',
  lineSub:   '#1C1C28',
  lineFocus: '#6366F1',

  // Text
  high: '#ECECF2',
  mid:  '#8484A0',
  lo:   '#4C4C68',

  // Accent — indigo/violet
  violet:     '#6366F1',
  violetHov:  '#5558E0',
  violetGlow: 'rgba(99,102,241,0.10)',
  violetRing: 'rgba(99,102,241,0.25)',

  // Semantic
  jade:     '#2EC4A0',
  jadeFill: 'rgba(46,196,160,0.08)',
  rose:     '#F16C6C',
  roseFill: 'rgba(241,108,108,0.08)',
  gold:     '#E8A84E',
  goldFill: 'rgba(232,168,78,0.10)',

  white:    '#ffffff',
  black:    '#000000',
  backdrop: 'rgba(4,4,8,0.82)',
} as const

export type MmTokens = typeof mm
