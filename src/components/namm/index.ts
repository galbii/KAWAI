/**
 * NAMM 2026 Landing Page Components
 *
 * High-conversion sections for the NAMM trade show landing page.
 * These components showcase featured products and booth experiences.
 */

// Hero Section & Core Components (Agent 1)
export { default as HeroSection } from './HeroSection'
export { default as EventInfoBox } from './EventInfoBox'
export { default as CountdownTimer } from './CountdownTimer'

// Navigation & SEO (Agent 4)
export { NAMMBreadcrumbs } from './NAMMBreadcrumbs'
export { NAMMStructuredData } from './NAMMStructuredData'

// Featured Products & Booth Experience (Agent 2)
export { default as FeaturedProductsSection } from './FeaturedProductsSection'
export type { ProductCardProps } from './FeaturedProductsSection'

export { default as BoothExperienceSection } from './BoothExperienceSection'
export type { BoothFeature } from './BoothExperienceSection'

// Artist Lineup & Visit Planning (Agent 3)
export { default as ArtistLineupSection } from './ArtistLineupSection'
export { default as PlanYourVisitSection } from './PlanYourVisitSection'
export { default as CantAttendCTA } from './CantAttendCTA'
