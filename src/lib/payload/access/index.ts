import type { Access } from 'payload'

/**
 * Access Control Utilities for Payload CMS
 *
 * These functions provide reusable, standardized access control patterns
 * for collections and fields across the KAWAI platform.
 *
 * @see CLAUDE.md for security best practices
 */

/**
 * Public access - anyone can access
 * Use for: Public content, media, published posts
 */
export const anyone: Access = () => true

/**
 * Authenticated users only
 * Use for: Create/update operations, draft content
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/**
 * Admin-only access
 * Use for: Delete operations, system settings
 */
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

/**
 * Authenticated users OR published content
 * Use for: Blog posts, products - admins see all, public sees published only
 *
 * Returns:
 * - true: if user is authenticated (see all content)
 * - query constraint: if not authenticated (see only published content)
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  // Authenticated users can see all content
  if (user) return true

  // Public users can only see published content
  return {
    status: {
      equals: 'published',
    },
  }
}
