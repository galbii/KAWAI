/**
 * Performance Calendar Day Themes
 *
 * Vibrant color schemes for each day of NAMM 2026
 * Inspired by FeaturedProductsSection gradient treatments
 */

export interface DayTheme {
  // Background gradients (for day headers)
  background: string
  backgroundSolid: string

  // Accent colors
  accent: string
  secondaryAccent: string

  // Card-specific colors (NEW - for white cards)
  cardLeftBorder: string // Colored left border
  genreBadgeBg: string // Genre badge background
  genreBadgeText: string // Genre badge text

  // Effects
  glow: string
  badge: string
  cardBorder: string
  cardBorderHover: string

  // Text colors
  text: string
  textMuted: string

  // Interactive elements
  dot: string
  dotBg: string

  // Pattern overlays
  pattern: 'crystalline' | 'artistic' | 'tech-grid'
}

/**
 * THURSDAY - Artistic Theme (Purple/Magenta)
 * Opening day excitement, vibrant energy, artistic performances
 */
export const THURSDAY_THEME: DayTheme = {
  background: 'from-purple-900 via-fuchsia-900 to-pink-900',
  backgroundSolid: 'bg-purple-900',
  accent: 'fuchsia-500',
  secondaryAccent: 'pink-500',
  cardLeftBorder: '#9333EA', // Purple left border for white cards
  genreBadgeBg: '#9333EA', // Purple genre badge
  genreBadgeText: '#FFFFFF', // White text
  glow: 'from-fuchsia-500/25 via-transparent to-transparent',
  badge: 'from-fuchsia-500/20 to-pink-500/20',
  cardBorder: 'border-fuchsia-500/30',
  cardBorderHover: 'hover:border-fuchsia-400/50',
  text: 'fuchsia-100',
  textMuted: 'purple-50',
  dot: 'bg-fuchsia-400',
  dotBg: 'from-fuchsia-500/30 to-pink-500/30',
  pattern: 'artistic'
}

/**
 * FRIDAY - NAMM Blue Theme
 * Mid-event sophistication, NAMM brand blue, premium elegance
 */
export const FRIDAY_THEME: DayTheme = {
  background: 'from-zinc-900 via-slate-900 to-zinc-950',
  backgroundSolid: 'bg-slate-900',
  accent: 'cyan-500',
  secondaryAccent: 'blue-500',
  cardLeftBorder: '#2563EB', // NAMM blue left border for white cards
  genreBadgeBg: '#2563EB', // Blue genre badge
  genreBadgeText: '#FFFFFF', // White text
  glow: 'from-cyan-500/20 via-transparent to-transparent',
  badge: 'from-cyan-500/20 to-blue-500/20',
  cardBorder: 'border-cyan-500/30',
  cardBorderHover: 'hover:border-cyan-400/50',
  text: 'cyan-100',
  textMuted: 'zinc-300',
  dot: 'bg-cyan-400',
  dotBg: 'from-cyan-500/20 to-blue-500/20',
  pattern: 'crystalline'
}

/**
 * SATURDAY - Warm Finale Theme (Orange/Amber)
 * Closing day warmth, finale celebration, energetic conclusion
 */
export const SATURDAY_THEME: DayTheme = {
  background: 'from-slate-900 via-zinc-900 to-stone-900',
  backgroundSolid: 'bg-zinc-900',
  accent: 'emerald-500',
  secondaryAccent: 'teal-500',
  cardLeftBorder: '#F59E0B', // Orange/amber left border for white cards
  genreBadgeBg: '#F59E0B', // Orange genre badge
  genreBadgeText: '#FFFFFF', // White text
  glow: 'from-emerald-500/15 via-transparent to-transparent',
  badge: 'from-emerald-500/20 to-teal-500/20',
  cardBorder: 'border-emerald-500/30',
  cardBorderHover: 'hover:border-emerald-400/50',
  text: 'emerald-100',
  textMuted: 'zinc-200',
  dot: 'bg-emerald-400',
  dotBg: 'from-emerald-500/20 to-teal-500/20',
  pattern: 'tech-grid'
}

/**
 * Day theme mapping for easy lookup
 */
export const DAY_THEMES: Record<'thursday' | 'friday' | 'saturday', DayTheme> = {
  thursday: THURSDAY_THEME,
  friday: FRIDAY_THEME,
  saturday: SATURDAY_THEME
}

/**
 * Get theme by day ID
 */
export function getThemeForDay(day: 'thursday' | 'friday' | 'saturday'): DayTheme {
  return DAY_THEMES[day]
}

/**
 * Pattern overlay components for background effects
 */
export const PATTERN_OVERLAYS = {
  /**
   * Crystalline pattern - Glass reflection effects
   * Used for Friday (Crystal theme)
   */
  crystalline: (
    <div className="absolute inset-0 opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)',
          backgroundSize: '60px 60px, 80px 80px'
        }}
      />
    </div>
  ),

  /**
   * Artistic pattern - Paint splatter effects
   * Used for Thursday (Artistic theme)
   */
  artistic: (
    <div className="absolute inset-0 opacity-[0.06]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 3px, transparent 3px), radial-gradient(circle at 60% 50%, white 1.5px, transparent 1.5px)',
          backgroundSize: '100px 100px, 120px 120px, 80px 80px'
        }}
      />
    </div>
  ),

  /**
   * Tech grid pattern - Blueprint-style technical grid
   * Used for Saturday (Tech theme)
   */
  'tech-grid': (
    <div className="absolute inset-0 opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  )
} as const
