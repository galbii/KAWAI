/**
 * Lead Funnel — theme tokens
 *
 * Lifted from NewsletterPopupRenderer so the funnel matches the existing
 * popup styling across light / dark / red brand themes.
 */
import type { LeadFunnelTheme } from './types'

export interface ThemeTokens {
  bg: string
  border: string
  accentBar: string
  heading: string
  subheading: string
  bodyText: string
  mutedText: string
  successIcon: string
  submitBg: string
  submitBgHover: string
  submitFg: string
  inputBg: string
  inputBorder: string
  /** Background for a selected dealer card. */
  cardSelectedBg: string
  cardBorder: string
}

export const THEMES: Record<LeadFunnelTheme, ThemeTokens> = {
  light: {
    bg: '#FAF8F5',
    border: 'rgba(30,27,22,0.08)',
    accentBar: '#E11922',
    heading: '#1E1B16',
    subheading: '#6B7280',
    bodyText: '#1E1B16',
    mutedText: 'rgba(30,27,22,0.55)',
    successIcon: '#E11922',
    submitBg: '#E11922',
    submitBgHover: '#c7151c',
    submitFg: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(30,27,22,0.15)',
    cardSelectedBg: 'rgba(225,25,34,0.06)',
    cardBorder: 'rgba(30,27,22,0.12)',
  },
  dark: {
    bg: '#1E1B16',
    border: 'rgba(255,255,255,0.08)',
    accentBar: '#d5c78c',
    heading: '#FFFFFF',
    subheading: '#9CA3AF',
    bodyText: '#F5F5F5',
    mutedText: 'rgba(255,255,255,0.45)',
    successIcon: '#d5c78c',
    submitBg: '#d5c78c',
    submitBgHover: '#c4b57c',
    submitFg: '#1E1B16',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.12)',
    cardSelectedBg: 'rgba(213,199,140,0.12)',
    cardBorder: 'rgba(255,255,255,0.14)',
  },
  red: {
    bg: '#E11922',
    border: 'rgba(255,255,255,0.15)',
    accentBar: '#FFFFFF',
    heading: '#FFFFFF',
    subheading: 'rgba(255,255,255,0.82)',
    bodyText: '#FFFFFF',
    mutedText: 'rgba(255,255,255,0.62)',
    successIcon: '#FFFFFF',
    submitBg: '#FFFFFF',
    submitBgHover: '#F0F0F0',
    submitFg: '#E11922',
    inputBg: 'rgba(255,255,255,0.15)',
    inputBorder: 'rgba(255,255,255,0.25)',
    cardSelectedBg: 'rgba(255,255,255,0.18)',
    cardBorder: 'rgba(255,255,255,0.25)',
  },
}
