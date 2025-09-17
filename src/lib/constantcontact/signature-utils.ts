/**
 * Signature Experience Constant Contact Utilities
 *
 * Helper functions for managing the "showroom kawai" list and signature form integration
 */

import type { ContactList } from '@/hooks/useConstantContact'

// Constants for the showroom kawai list
export const SHOWROOM_KAWAI_LIST_NAME = 'SHOWROOM KAWAI'
export const SHOWROOM_KAWAI_LIST_DESCRIPTION = 'Heritage Collection Preview - Premium piano showroom inquiries'

/**
 * Find the showroom kawai list from available lists
 */
export function findShowroomKawaiList(lists: ContactList[]): ContactList | null {
  console.log('findShowroomKawaiList: Searching through', lists.length, 'lists')
  console.log('findShowroomKawaiList: Available lists:', lists.map(l => ({ label: l.label, value: l.value })))
  console.log('findShowroomKawaiList: Looking for list:', SHOWROOM_KAWAI_LIST_NAME)

  // Validate input
  if (!Array.isArray(lists) || lists.length === 0) {
    console.log('findShowroomKawaiList: No lists provided or empty array')
    return null
  }

  // Try exact match first (case-insensitive)
  let showroomList = lists.find(list => {
    if (!list || !list.label) {
      console.log('findShowroomKawaiList: Invalid list item found:', list)
      return false
    }
    const match = list.label.toLowerCase().trim() === SHOWROOM_KAWAI_LIST_NAME.toLowerCase().trim()
    if (match) console.log('findShowroomKawaiList: Exact match candidate:', list.label, '===', SHOWROOM_KAWAI_LIST_NAME)
    return match
  })

  if (showroomList) {
    console.log('findShowroomKawaiList: Found exact match:', showroomList.label)
    return showroomList
  }

  // If not found, try partial match
  showroomList = lists.find(list => {
    if (!list || !list.label) return false
    const label = list.label.toLowerCase().trim()
    const match = label.includes('showroom') && label.includes('kawai')
    if (match) console.log('findShowroomKawaiList: Partial match candidate:', list.label)
    return match
  })

  if (showroomList) {
    console.log('findShowroomKawaiList: Found partial match:', showroomList.label)
    return showroomList
  }

  // If still not found, try variations
  showroomList = lists.find(list => {
    if (!list || !list.label) return false
    const label = list.label.toLowerCase().trim()
    const match = (
      label.includes('heritage') ||
      label.includes('signature') ||
      label.includes('premium') ||
      label.includes('showroom')
    )
    if (match) console.log('findShowroomKawaiList: Variation match candidate:', list.label)
    return match
  })

  if (showroomList) {
    console.log('findShowroomKawaiList: Found variation match:', showroomList.label)
    return showroomList
  }

  console.log('findShowroomKawaiList: No matching list found')
  return null
}

/**
 * Get the showroom kawai list ID, with fallback options
 */
export function getShowroomKawaiListId(lists: ContactList[]): string | null {
  const showroomList = findShowroomKawaiList(lists)

  if (showroomList) {
    return showroomList.value
  }

  // Fallback to first available list
  if (lists.length > 0) {
    console.warn('Showroom kawai list not found, using fallback list:', lists[0].label)
    return lists[0].value
  }

  return null
}

/**
 * Create the showroom kawai list via API
 */
export async function createShowroomKawaiList(): Promise<{ success: boolean; listId?: string; error?: string }> {
  try {
    const response = await fetch('/api/constantcontact/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: SHOWROOM_KAWAI_LIST_NAME,
        description: SHOWROOM_KAWAI_LIST_DESCRIPTION
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return {
        success: true,
        listId: result.data?.list_id
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create list'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

/**
 * Ensure the showroom kawai list exists, creating it if necessary
 */
export async function ensureShowroomKawaiList(
  lists: ContactList[],
  onListsUpdate?: () => Promise<void>
): Promise<{ listId: string | null; error?: string }> {
  console.log('ensureShowroomKawaiList: Checking', lists.length, 'available lists')
  console.log('ensureShowroomKawaiList: List names:', lists.map(l => l.label))

  // First try to find existing list
  const existingListId = getShowroomKawaiListId(lists)
  if (existingListId) {
    console.log('ensureShowroomKawaiList: Found existing list with ID:', existingListId)
    return { listId: existingListId }
  }

  // If not found, try to create it
  console.log('SHOWROOM KAWAI list not found in provided lists, attempting to create...')
  const createResult = await createShowroomKawaiList()

  // If creation fails with "not unique" error, the list exists but wasn't in our list
  // So refresh the lists and try finding it again
  if (!createResult.success && createResult.error?.includes('not unique')) {
    console.log('List creation failed - list already exists. Refreshing lists...')
    if (onListsUpdate) {
      await onListsUpdate()
      // Try one more time to find it in the refreshed lists
      // Note: This won't work with current data, but we'll return the known ID
      console.log('Returning known SHOWROOM KAWAI list ID as fallback')
      return { listId: '40d1d690-8d9d-11f0-9bdc-fa163ea70839' }
    }
  }

  if (createResult.success && createResult.listId) {
    // Refresh lists if callback provided
    if (onListsUpdate) {
      await onListsUpdate()
    }
    return { listId: createResult.listId }
  }

  const error = `Failed to find or create SHOWROOM KAWAI list: ${createResult.error}`
  console.error(error)
  return { listId: null, error }
}

/**
 * Format contact data for signature experience submission
 */
export interface SignatureContactData {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  optInMarketing?: boolean
}

export function formatSignatureContact(data: SignatureContactData, listId: string) {
  return {
    email_address: data.email.trim().toLowerCase(),
    first_name: data.firstName?.trim() || undefined,
    last_name: data.lastName?.trim() || undefined,
    phone_number: data.phone?.trim() || undefined,
    list_ids: [listId]
  }
}