/**
 * Layout Components
 *
 * Central barrel export for all layout components in the KAWAI Piano website.
 * Includes header, footer, navigation, and structural components.
 *
 * @example Basic Usage
 * ```tsx
 * import { Header, Footer } from '@/components/layout'
 *
 * function Layout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <>
 *       <Header />
 *       <main>{children}</main>
 *       <Footer />
 *     </>
 *   )
 * }
 * ```
 *
 * @example Server-Side Dynamic Layout
 * ```tsx
 * import { HeaderDynamic, FooterDynamic } from '@/components/layout'
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <HeaderDynamic />
 *         {children}
 *         <FooterDynamic />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

// ============================================================================
// Core Layout Components (Client-Side)
// ============================================================================

export { Header } from './header'
export { Footer } from './footer'

// ============================================================================
// Dynamic Layout Components (Server-Side)
// ============================================================================

export { HeaderDynamic } from './header-dynamic'
export { FooterDynamic } from './footer-dynamic'

// ============================================================================
// Announcement Bar Components
// ============================================================================

export { AnnouncementBar } from './AnnouncementBar'
export { AnnouncementBarWrapper } from './AnnouncementBarWrapper'
export { LayoutSpacer } from './LayoutSpacer'

// ============================================================================
// Navigation Components
// ============================================================================

export { EducationalNav, EducationalSidebar } from './educational-nav'
