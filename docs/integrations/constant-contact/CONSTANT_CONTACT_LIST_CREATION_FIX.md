# Constant Contact List Creation Fix

**Date**: February 10, 2026
**Issue**: Booking blocks failing with JSON parsing errors when creating Constant Contact lists
**Status**: ✅ Fixed

## Problem Summary

Users were experiencing errors when booking consultations through the KAWAI booking blocks:

```
ensureListExists: Error during list creation: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data
List access error: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data
Constant Contact API: List not found: SHSU Feb
```

### Root Cause

The booking blocks (BookingModalBlock and CalendlyEmbedBlock) use `ensureListExists()` from `/src/lib/constantcontact/signature-utils.ts` to automatically create Constant Contact lists if they don't exist.

**The bug**: The `ensureListExists()` function was calling `POST /api/constant-contact/lists` to create lists, but **this endpoint didn't have a POST handler** - it only had a disabled GET handler that returned a 403 response.

When the code tried to parse the 403 response as JSON, it failed with:
```
JSON.parse: unexpected end of data at line 1 column 1 of the JSON data
```

## How List Creation Works

### Flow Diagram

```
User Books Consultation
         ↓
useCalendlyTracking Hook
         ↓
useConstantContactIntegration Hook
         ↓
ensureListExists(listName)
         ↓
┌─────────────────────────────────────┐
│ Step 1: Search Local Cache          │ (fastest)
│ → Found? Return list ID ✅           │
└─────────────────────────────────────┘
         ↓ Not found
┌─────────────────────────────────────┐
│ Step 2: Search API by Name          │
│ POST /api/constant-contact/         │
│      lists/search-by-name           │
│ → Found? Return list ID ✅           │
└─────────────────────────────────────┘
         ↓ Not found (404)
┌─────────────────────────────────────┐
│ Step 3: Create New List ⚠️ BUG HERE │
│ POST /api/constant-contact/lists    │
│ ❌ Endpoint had no POST handler      │
│ ❌ Returned 403 instead of JSON      │
└─────────────────────────────────────┘
         ↓
JSON Parsing Error 💥
```

## The Fix

### 1. Added POST Handler to `/src/app/api/constant-contact/lists/route.ts`

**Before**: Only had a disabled GET handler

**After**: Added proper POST handler using the Constant Contact client

```typescript
/**
 * POST /api/constant-contact/lists
 * Create a new contact list
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { name, description } = body

    // Validate list name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'List name is required and must be a non-empty string'
        },
        { status: 400 }
      )
    }

    // Initialize client and list manager
    const client = createConstantContactClient(payload)
    const listManager = new ConstantContactListManager(client)

    // Create the list
    const result = await listManager.createList(name.trim(), description?.trim())

    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create list'
        },
        { status: result.status || 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
```

### 2. Improved Error Handling in `ensureListExists()`

Added proper JSON content-type checking and error handling in `/src/lib/constantcontact/signature-utils.ts`:

**Before**: Blindly tried to parse any response as JSON

**After**: Check content-type header and handle non-JSON responses gracefully

```typescript
// Step 2: API Search - Check content-type before parsing
const contentType = apiSearchResult.headers.get('content-type')
if (contentType && contentType.includes('application/json')) {
  const searchData = await apiSearchResult.json()
  // ... handle response
} else {
  console.warn('ensureListExists: API search returned non-JSON response')
}

// Step 3: List Creation - Check content-type before parsing
const createContentType = createResponse.headers.get('content-type')
if (!createContentType || !createContentType.includes('application/json')) {
  const errorText = await createResponse.text()
  console.error('ensureListExists: Error during list creation - non-JSON response:', errorText)
  return {
    listId: null,
    error: `List creation failed: Received non-JSON response (${createResponse.status})`
  }
}

const createResult = await createResponse.json()
// ... handle response
```

### 3. Applied Same Fix to `ensureShowroomKawaiList()`

The SHOWROOM KAWAI list uses the same pattern, so applied identical error handling improvements.

## Testing the Fix

### How to Test

1. **Create a new booking block** in Payload CMS:
   - Navigate to any page
   - Add a BookingModalBlock or CalendlyEmbedBlock
   - Set `constantContact.targetList` to a new list name (e.g., "SHSU Feb")
   - Set `constantContact.createListIfMissing` to `true`

2. **Book a consultation**:
   - Visit the page with the booking block
   - Click the booking button
   - Fill out the pre-form
   - Complete a Calendly booking

3. **Verify list creation**:
   - Check the browser console for logs:
     ```
     ensureListExists: List not found via API search, attempting creation...
     ensureListExists: Successfully created list with ID: [UUID]
     ✅ Contact successfully added to [LIST NAME] list
     ```
   - Check Constant Contact dashboard to confirm the list exists
   - Verify the contact was added to the list

### Expected Behavior

✅ No JSON parsing errors
✅ Lists are created automatically if they don't exist
✅ Contacts are added to the correct lists
✅ Clear error messages if creation fails
✅ Works for both BookingModalBlock and CalendlyEmbedBlock

## Files Modified

1. **`/src/app/api/constant-contact/lists/route.ts`**
   - Added POST handler for list creation
   - Imported Constant Contact client and list manager
   - Added proper validation and error handling

2. **`/src/lib/constantcontact/signature-utils.ts`**
   - Improved `ensureListExists()` error handling
   - Added content-type checking before JSON parsing
   - Improved `ensureShowroomKawaiList()` error handling

## How List Management Works

### Affected Booking Blocks

Both booking blocks use the same list management system:

1. **BookingModalBlock** (`/src/components/blocks/BookingModalBlock.tsx`)
2. **CalendlyEmbedBlock** (`/src/components/blocks/CalendlyEmbedBlock.tsx`)

### Integration Flow

```
BookingModalBlock/CalendlyEmbedBlock
         ↓
useCalendlyTracking Hook
         ↓ (on booking complete)
handleConstantContactSubmission()
         ↓
useConstantContactIntegration Hook
         ↓
submitToConstantContact()
         ↓
ensureListExists(targetList)
         ↓
1. Search local cache
2. Search API by name
3. Create list if missing ← FIX APPLIED HERE
         ↓
formatSignatureContact()
         ↓
POST /api/constant-contact/contacts
```

### List Manager API

The `ConstantContactListManager` class provides:

- `findListByName()` - Search for list by exact name
- `createList()` - Create new list with name and description
- `getAllLists()` - Fetch all lists from Constant Contact
- `getList()` - Get specific list by ID
- `updateList()` - Update list name/description
- `deleteList()` - Delete a list

## Configuration

### Block Configuration

```typescript
{
  constantContact: {
    enabled: true,
    targetList: "SHSU Feb",              // List name
    createListIfMissing: true,            // Auto-create if doesn't exist
    showAuthPrompts: false,               // Don't show auth prompts to users
    listDescription: "SHSU February 2026 Event Leads"
  }
}
```

### Environment Variables Required

```bash
# Constant Contact OAuth Credentials (in database)
# No environment variables needed - uses Payload CMS storage
```

## Constant Contact API Reference

### Create List Endpoint

```http
POST https://api.cc.email/v3/contact_lists
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "SHSU Feb",
  "description": "SHSU February 2026 Event Leads"
}
```

**Response**:
```json
{
  "list_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "SHSU Feb",
  "description": "SHSU February 2026 Event Leads",
  "favorite": false,
  "created_at": "2026-02-10T12:00:00.000Z",
  "updated_at": "2026-02-10T12:00:00.000Z",
  "membership_count": 0
}
```

### Search List by Name Endpoint

```http
GET https://api.cc.email/v3/contact_lists?name={encoded_name}
Authorization: Bearer {access_token}
```

## Error Handling

### Possible Errors

1. **List name already exists**: Returns "not unique" error
   - Fix: Fetch fresh lists and retry search

2. **Invalid list name**: Returns 400 error
   - Fix: Validate list name before API call

3. **Authentication failure**: Returns 401 error
   - Fix: Automatic token refresh via `getValidAccessToken()`

4. **Network error**: Fetch fails
   - Fix: Graceful error handling, clear error messages

## Related Documentation

- Constant Contact Integration: `/docs/CONSTANT_CONTACT_INTEGRATION.md` (if exists)
- Booking Blocks: `/docs/BLOCKS.md`
- Calendly Integration: `/docs/CALENDLY_EMAIL_CAPTURE_FIX.md`

## Additional Notes

### Why This Bug Existed

The `/api/constant-contact/lists` endpoint was originally created as a **setup/debugging endpoint** to list available Constant Contact lists. It was later disabled for security reasons (returning 403).

However, the code continued to call `POST /api/constant-contact/lists` expecting list creation, but the POST handler was never implemented.

### Long-term Improvements

1. **Add integration tests** for list creation flow
2. **Add retry logic** for transient API failures
3. **Cache list lookups** to reduce API calls
4. **Add rate limiting** for list creation to prevent abuse

## Conclusion

This fix resolves the JSON parsing errors when booking consultations through KAWAI booking blocks. Lists are now created automatically and reliably when they don't exist, providing a seamless user experience.

**Before**: ❌ JSON parsing errors, bookings failed
**After**: ✅ Lists created automatically, bookings succeed
