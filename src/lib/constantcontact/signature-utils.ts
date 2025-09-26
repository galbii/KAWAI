/**
 * Signature Experience Constant Contact Utilities
 *
 * Helper functions for managing the "showroom kawai" list and signature form integration
 */

import type { ContactList } from '@/hooks/useConstantContact'

// Constants for the showroom kawai list
export const SHOWROOM_KAWAI_LIST_NAME = 'SHOWROOM KAWAI'
export const SHOWROOM_KAWAI_LIST_DESCRIPTION = 'Heritage Collection Preview - Premium piano showroom inquiries'

// Constants for the signature uncommitted list
export const SIGNATURE_UNCOMMITTED_LIST_NAME = 'SIGNATURE UNCOMMITTED'
export const SIGNATURE_UNCOMMITTED_LIST_DESCRIPTION = 'Signature Experience Results Viewers - Users who have seen their assessment results but have not yet committed to booking'

/**
 * Find the signature uncommitted list from available lists
 */
export function findSignatureUncommittedList(lists: ContactList[]): ContactList | null {
  console.log('findSignatureUncommittedList: Searching through', lists.length, 'lists')
  console.log('findSignatureUncommittedList: Looking for list:', SIGNATURE_UNCOMMITTED_LIST_NAME)

  // Validate input
  if (!Array.isArray(lists) || lists.length === 0) {
    console.log('findSignatureUncommittedList: No lists provided or empty array')
    return null
  }

  // Try exact match first (case-insensitive)
  let uncommittedList = lists.find(list => {
    if (!list || !list.label) {
      console.log('findSignatureUncommittedList: Invalid list item found:', list)
      return false
    }
    const match = list.label.toLowerCase().trim() === SIGNATURE_UNCOMMITTED_LIST_NAME.toLowerCase().trim()
    if (match) console.log('findSignatureUncommittedList: Exact match candidate:', list.label, '===', SIGNATURE_UNCOMMITTED_LIST_NAME)
    return match
  })

  if (uncommittedList) {
    console.log('findSignatureUncommittedList: Found exact match:', uncommittedList.label)
    return uncommittedList
  }

  // If not found, try partial match
  uncommittedList = lists.find(list => {
    if (!list || !list.label) return false
    const label = list.label.toLowerCase().trim()
    const match = label.includes('signature') && label.includes('uncommitted')
    if (match) console.log('findSignatureUncommittedList: Partial match candidate:', list.label)
    return match
  })

  if (uncommittedList) {
    console.log('findSignatureUncommittedList: Found partial match:', uncommittedList.label)
    return uncommittedList
  }

  // If still not found, try variations
  uncommittedList = lists.find(list => {
    if (!list || !list.label) return false
    const label = list.label.toLowerCase().trim()
    const match = (
      label.includes('uncommitted') ||
      label.includes('signature') ||
      label.includes('assessment') ||
      label.includes('results')
    )
    if (match) console.log('findSignatureUncommittedList: Variation match candidate:', list.label)
    return match
  })

  if (uncommittedList) {
    console.log('findSignatureUncommittedList: Found variation match:', uncommittedList.label)
    return uncommittedList
  }

  console.log('findSignatureUncommittedList: No matching list found')
  return null
}

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
 * Get the signature uncommitted list ID, with fallback options
 */
export function getSignatureUncommittedListId(lists: ContactList[]): string | null {
  const uncommittedList = findSignatureUncommittedList(lists)

  if (uncommittedList) {
    return uncommittedList.value
  }

  // No fallback for this list - it should be created if it doesn't exist
  console.warn('Signature uncommitted list not found, should be created')
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
    console.warn('Showroom kawai list not found, using fallback list:', lists[0]?.label)
    return lists[0]?.value || null
  }

  return null
}

/**
 * Create the signature uncommitted list via API
 */
export async function createSignatureUncommittedList(): Promise<{ success: boolean; listId?: string; error?: string }> {
  try {
    const response = await fetch('/api/constantcontact/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: SIGNATURE_UNCOMMITTED_LIST_NAME,
        description: SIGNATURE_UNCOMMITTED_LIST_DESCRIPTION
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
 * Ensure the signature uncommitted list exists
 */
export async function ensureSignatureUncommittedList(
  lists: ContactList[],
  onListsUpdate?: () => Promise<void>
): Promise<{ listId: string | null; error?: string }> {
  console.log('ensureSignatureUncommittedList: Starting list discovery')
  console.log('ensureSignatureUncommittedList: Local cache has', lists.length, 'lists')

  // Step 1: Try to find existing list in local cache first (fastest)
  const existingListId = getSignatureUncommittedListId(lists)
  if (existingListId) {
    console.log('ensureSignatureUncommittedList: Found in local cache with ID:', existingListId)
    return { listId: existingListId }
  }

  // Step 2: Try to create the list
  console.log('ensureSignatureUncommittedList: List not found in cache, attempting creation...')
  const createResult = await createSignatureUncommittedList()

  // Step 3: Handle creation response
  if (createResult.success && createResult.listId) {
    console.log('ensureSignatureUncommittedList: Successfully created list with ID:', createResult.listId)
    // Refresh lists if callback provided
    if (onListsUpdate) {
      await onListsUpdate()
    }
    return { listId: createResult.listId }
  }

  // Step 4: If creation fails with "not unique" error, list exists but we missed it
  if (!createResult.success && createResult.error?.includes('not unique')) {
    console.log('ensureSignatureUncommittedList: Creation failed - list already exists. Refreshing cache...')

    // Refresh lists and try one more search
    if (onListsUpdate) {
      console.log('ensureSignatureUncommittedList: Refreshing local list cache...')
      await onListsUpdate()
    }

    // Try to find it again after refresh
    // Note: We don't have a known production list ID for this one like we do for showroom
    const refreshedListId = getSignatureUncommittedListId(lists)
    if (refreshedListId) {
      console.log('ensureSignatureUncommittedList: Found after cache refresh with ID:', refreshedListId)
      return { listId: refreshedListId }
    }
  }

  // Step 5: Complete failure
  const error = `Failed to find or create SIGNATURE UNCOMMITTED list: ${createResult.error}`
  console.error('ensureSignatureUncommittedList: Complete failure -', error)
  return { listId: null, error }
}

/**
 * Ensure the showroom kawai list exists with improved API-level search
 */
export async function ensureShowroomKawaiList(
  lists: ContactList[],
  onListsUpdate?: () => Promise<void>
): Promise<{ listId: string | null; error?: string }> {
  console.log('ensureShowroomKawaiList: Starting enhanced list discovery')
  console.log('ensureShowroomKawaiList: Local cache has', lists.length, 'lists')

  // Step 1: Try to find existing list in local cache first (fastest)
  const existingListId = getShowroomKawaiListId(lists)
  if (existingListId) {
    console.log('ensureShowroomKawaiList: Found in local cache with ID:', existingListId)
    return { listId: existingListId }
  }

  // Step 2: If not in cache, search API directly by name
  console.log('ensureShowroomKawaiList: Not found in cache, searching API by name...')
  try {
    const apiSearchResult = await fetch('/api/constantcontact/lists/search-by-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: SHOWROOM_KAWAI_LIST_NAME })
    })

    if (apiSearchResult.ok) {
      const searchData = await apiSearchResult.json()
      if (searchData.success && searchData.data) {
        console.log('ensureShowroomKawaiList: Found via API search with ID:', searchData.data.list_id)
        // Refresh local cache if callback provided
        if (onListsUpdate) {
          await onListsUpdate()
        }
        return { listId: searchData.data.list_id }
      }
    }
  } catch (apiError) {
    console.warn('ensureShowroomKawaiList: API search failed, continuing with creation attempt')
  }

  // Step 3: If API search fails, try to create the list
  console.log('ensureShowroomKawaiList: List not found via API search, attempting creation...')
  const createResult = await createShowroomKawaiList()

  // Step 4: Handle creation response
  if (createResult.success && createResult.listId) {
    console.log('ensureShowroomKawaiList: Successfully created list with ID:', createResult.listId)
    // Refresh lists if callback provided
    if (onListsUpdate) {
      await onListsUpdate()
    }
    return { listId: createResult.listId }
  }

  // Step 5: If creation fails with "not unique" error, list exists but API search missed it
  if (!createResult.success && createResult.error?.includes('not unique')) {
    console.log('ensureShowroomKawaiList: Creation failed - list already exists. Using fallback strategy...')

    // Refresh lists and try one more search
    if (onListsUpdate) {
      console.log('ensureShowroomKawaiList: Refreshing local list cache...')
      await onListsUpdate()
    }

    // Use the known production list ID as last resort
    const fallbackListId = '40d1d690-8d9d-11f0-9bdc-fa163ea70839'
    console.log('ensureShowroomKawaiList: Using known production list ID as fallback:', fallbackListId)
    return { listId: fallbackListId }
  }

  // Step 6: Complete failure
  const error = `Failed to find or create SHOWROOM KAWAI list: ${createResult.error}`
  console.error('ensureShowroomKawaiList: Complete failure -', error)
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
  const trimmedFirstName = data.firstName?.trim()
  const trimmedLastName = data.lastName?.trim()
  const trimmedPhone = data.phone?.trim()

  return {
    email_address: data.email.trim().toLowerCase(),
    ...(trimmedFirstName && { first_name: trimmedFirstName }),
    ...(trimmedLastName && { last_name: trimmedLastName }),
    ...(trimmedPhone && { phone_number: trimmedPhone }),
    list_ids: [listId]
  }
}

/**
 * Add a user to the signature uncommitted list when they see their results
 */
export async function addUserToSignatureUncommittedList(
  emailData: SignatureContactData
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('addUserToSignatureUncommittedList: Starting to add user:', emailData.email)

    // Step 1: Get available lists first
    const listsResponse = await fetch('/api/constantcontact/lists?format=ui')
    if (!listsResponse.ok) {
      throw new Error('Failed to fetch Constant Contact lists')
    }

    const listsData = await listsResponse.json()
    if (!listsData.success || !Array.isArray(listsData.data)) {
      throw new Error('Invalid lists response from API')
    }

    const lists = listsData.data as ContactList[]
    console.log('addUserToSignatureUncommittedList: Retrieved', lists.length, 'lists')

    // Step 2: Ensure the signature uncommitted list exists
    const listResult = await ensureSignatureUncommittedList(lists)
    if (!listResult.listId) {
      throw new Error(listResult.error || 'Failed to get signature uncommitted list ID')
    }

    console.log('addUserToSignatureUncommittedList: Using list ID:', listResult.listId)

    // Step 3: Format the contact data
    const contactData = formatSignatureContact(emailData, listResult.listId)
    console.log('addUserToSignatureUncommittedList: Formatted contact data:', {
      email: contactData.email_address,
      firstName: contactData.first_name,
      lastName: contactData.last_name,
      listId: listResult.listId
    })

    // Step 4: Add the contact to Constant Contact
    const contactResponse = await fetch('/api/constantcontact/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    })

    const contactResult = await contactResponse.json()

    if (!contactResponse.ok || !contactResult.success) {
      console.error('addUserToSignatureUncommittedList: Failed to add contact:', contactResult)
      throw new Error(contactResult.error || 'Failed to add contact to Constant Contact')
    }

    console.log('addUserToSignatureUncommittedList: Successfully added user to signature uncommitted list:', {
      contactId: contactResult.data?.contact_id,
      email: emailData.email,
      listId: listResult.listId
    })

    return { success: true }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('addUserToSignatureUncommittedList: Error adding user to list:', errorMessage)
    return {
      success: false,
      error: errorMessage
    }
  }
}