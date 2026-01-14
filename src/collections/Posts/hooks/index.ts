/**
 * Posts Collection Hooks
 *
 * This file serves as a barrel export for all hooks used by the Posts collection.
 * Organizing hooks in a dedicated folder improves maintainability and reusability.
 *
 * Current hooks:
 * - populateAuthors: Populates author data while protecting user privacy
 *
 * Future hooks (will be moved here):
 * - revalidatePost: Triggers Next.js ISR revalidation on post changes
 */

export { populateAuthors } from './populateAuthors'
