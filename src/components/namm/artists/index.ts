/**
 * NAMM 2026 Artists Components
 *
 * Centralized export for all artist-related components
 */

export { default as ArtistHero } from './ArtistHero'
export { default as FeaturedArtistsGrid, ArtistCard } from './FeaturedArtistsGrid'
export { default as PerformanceSchedule, PerformanceEventCard } from './PerformanceSchedule'
export { default as ArtistProfiles, ProfileCard } from './ArtistProfiles'
export { default as ArtistsCTA } from './ArtistsCTA'

// Export types for external use
export type { FeaturedArtist } from './FeaturedArtistsGrid'
export type { PerformanceEvent } from './PerformanceSchedule'
export type { ArtistProfile } from './ArtistProfiles'
