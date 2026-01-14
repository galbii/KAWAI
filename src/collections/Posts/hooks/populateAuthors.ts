import type { CollectionAfterReadHook } from 'payload'
import type { User } from '@/payload-types'

/**
 * populateAuthors Hook
 *
 * Purpose: Protect user privacy by manually populating author data
 *
 * Background:
 * - The 'users' collection has access control that prevents public exposure
 * - This hook ensures author information is available on the frontend without exposing sensitive user data
 * - GraphQL cannot return mutated data that differs from the schema, so we use a separate field
 *
 * How it works:
 * 1. Checks for both single 'author' (legacy) and multiple 'authors' fields
 * 2. Fetches user data for each author from the database
 * 3. Populates a 'populatedAuthors' field with only safe data (id, name)
 * 4. Extracts name from user object, falls back to email username if name unavailable
 * 5. Hidden from admin UI to avoid confusion
 *
 * Security:
 * - Only exposes id and name (never email, password, or role)
 * - Uses depth: 0 to avoid over-fetching related data
 * - Gracefully handles errors without exposing system details
 */

export const populateAuthors: CollectionAfterReadHook = async ({
  doc,
  req,
  req: { payload },
}) => {
  // Early return if no authors to populate
  if (!doc) return doc

  // Support both legacy 'author' (single) and new 'authors' (multiple) fields
  const authorIds: string[] = []

  // Handle legacy single author field
  if (doc.author) {
    const authorId = typeof doc.author === 'object' ? doc.author.id : doc.author
    if (authorId) {
      authorIds.push(authorId)
    }
  }

  // Handle new multiple authors field
  if (doc.authors && Array.isArray(doc.authors) && doc.authors.length > 0) {
    for (const author of doc.authors) {
      const authorId = typeof author === 'object' ? author?.id : author
      if (authorId) {
        authorIds.push(authorId)
      }
    }
  }

  // Early return if no author IDs to process
  if (authorIds.length === 0) {
    return doc
  }

  try {
    // Fetch all author documents in one query for better performance
    const { docs: authorDocs } = await payload.find({
      collection: 'users',
      where: {
        id: {
          in: authorIds,
        },
      },
      depth: 0, // Don't populate relationships, only fetch user data
      limit: authorIds.length,
    })

    // Map author documents to safe, public-facing data
    if (authorDocs && authorDocs.length > 0) {
      doc.populatedAuthors = authorDocs.map((authorDoc: User) => {
        // Extract name from user, fallback to email username if not available
        let name = 'Anonymous'

        // Check if user has a name field (for future compatibility)
        if ('name' in authorDoc && typeof authorDoc.name === 'string') {
          name = authorDoc.name
        } else if (authorDoc.email) {
          // Extract username from email (everything before @)
          name = authorDoc.email.split('@')[0] || 'Anonymous'
        }

        return {
          id: authorDoc.id,
          name,
        }
      })
    }
  } catch (error) {
    // Log error for debugging but don't throw - we don't want this hook to break reads
    console.error('[populateAuthors] Error fetching author data:', error)

    // Set empty array to avoid undefined errors on frontend
    doc.populatedAuthors = []
  }

  return doc
}
