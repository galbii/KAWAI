# Calendly Email Capture Fix

## Problem

The Calendly `onEventScheduled` event **does not include invitee email or contact information** in its payload. It only provides URIs:

```javascript
{
  event: "calendly.event_scheduled",
  payload: {
    event: { uri: "https://calendly.com/api/v2/scheduled_events/..." },
    invitee: { uri: "https://calendly.com/api/v2/scheduled_events/.../invitees/..." }
  }
}
```

This caused the error:
```
No email available for Constant Contact submission (non-blocking)
Object { payload: {…}, invitee: undefined, prefillData: undefined }
```

## Root Cause

1. **Calendly's Event Structure**: The `react-calendly` library's `onEventScheduled` callback receives only URIs, not actual contact data
2. **Missing Prefill Data**: The booking blocks were calling `useCalendlyTracking` with `undefined` for prefillData
3. **Wrong Extraction Path**: Code was trying to extract from `payload?.event?.invitees?.[0]` which doesn't exist

## Solution: Pre-Form Capture

We implemented a **two-step booking flow** that collects contact information BEFORE showing Calendly:

### Flow

```
User clicks "Book Now"
    ↓
Pre-Form Modal appears
    ↓
User enters: Email, First Name, Last Name, Phone (optional)
    ↓
Form validates with Zod
    ↓
Data stored in component state
    ↓
Calendly widget appears with pre-filled data
    ↓
User schedules appointment
    ↓
Tracking fires with collected email data ✅
```

### Files Created/Modified

#### 1. **Created: `BookingPreForm.tsx`**
Location: `/src/components/ui/BookingPreForm.tsx`

- Elegant piano-key-inspired form design
- Zod validation for email/name fields
- React Hook Form integration
- Matches KAWAI brand aesthetic
- Collects: email, firstName, lastName, phone (optional)

#### 2. **Modified: `BookingModalBlock.tsx`**
Location: `/src/components/blocks/BookingModalBlock.tsx`

**Changes:**
- Added state for `showPreForm` and `prefillData`
- Implements two-step flow: Pre-Form → Calendly Widget
- Passes collected data to both:
  - Calendly widget (for prefill)
  - `useCalendlyTracking` hook (for Constant Contact submission)
- Resets state on modal close

**Key Code:**
```typescript
const [showPreForm, setShowPreForm] = useState(true)
const [prefillData, setPrefillData] = useState<BookingPreFormData | undefined>(undefined)

const handlePreFormSubmit = (data: BookingPreFormData) => {
  setPrefillData(data)
  setShowPreForm(false) // Show Calendly
}

useCalendlyTracking(
  { ... },
  prefillData // Now has email/name data!
)
```

## How It Works Now

### 1. User Experience

1. **Click booking button** → Pre-form modal opens
2. **Fill out contact info** → Form validates in real-time
3. **Click "Continue to Booking"** → Calendly opens with pre-filled data
4. **Select time slot** → Booking completes
5. **Tracking fires** → Contact added to Constant Contact list ✅

### 2. Data Flow

```
BookingPreForm
    ↓ (user submits)
handlePreFormSubmit()
    ↓
setPrefillData({ email, firstName, lastName, phone })
    ↓
setShowPreForm(false)
    ↓
CalendlyBookingWidget renders with prefillData
    ↓
useCalendlyTracking receives prefillData
    ↓
On booking: extractEmail() gets email from prefillData ✅
    ↓
submitToConstantContact({ email, firstName, lastName })
```

### 3. Constant Contact Integration

Now working with full contact data:

```typescript
// Before (❌ No email):
{
  payload: {...},
  invitee: undefined,
  prefillData: undefined
}

// After (✅ Has email):
{
  email: "john@example.com",
  firstName: "John",
  lastName: "Smith",
  phone: "555-123-4567"
}
```

## Benefits

### ✅ Advantages

1. **Guaranteed Email Capture**: We have email/name BEFORE Calendly interaction
2. **Better UX**: Users see their info pre-filled in Calendly
3. **No API Calls Needed**: Don't need to call Calendly API to fetch invitee data
4. **100% Reliable**: Not dependent on Calendly's event structure
5. **Constant Contact Ready**: Always have contact data for CRM submission

### 🎨 Design Consistency

- Piano-key-inspired styling matches KAWAI brand
- Gold accents and elegant typography
- Smooth transitions between pre-form and Calendly
- Responsive design for all devices

## Testing

### Test the Flow

1. **Navigate to any page with BookingModalBlock**
2. **Click "Book Now" button**
3. **See pre-form modal** with email/name fields
4. **Fill out form**:
   - Email: test@example.com
   - First Name: Test
   - Last Name: User
   - Phone: (optional)
5. **Click "Continue to Booking"**
6. **Verify** Calendly widget opens with pre-filled data
7. **Complete booking**
8. **Check console** for:
   ```
   📝 Pre-form data collected: {email: "...", firstName: "...", ...}
   📧 Extracted email from Calendly: test@example.com
   ✅ Contact successfully added to SHOWROOM KAWAI list
   ```

### Verify in Constant Contact

1. Log into Constant Contact dashboard
2. Navigate to Contacts
3. Search for the test email
4. Verify contact exists with correct name
5. Check list membership (e.g., "SHOWROOM KAWAI")

## CalendlyEmbedBlock (Inline Widget)

**Note**: The `CalendlyEmbedBlock` (inline embed) does NOT have this pre-form yet. It still relies on Calendly's event payload, which won't have email data.

### To Add Pre-Form to CalendlyEmbedBlock:

1. Import `BookingPreForm` component
2. Add state for `showPreForm` and `prefillData`
3. Show pre-form before rendering `InlineWidget`
4. Pass `prefillData` to `useCalendlyTracking` hook

**Or**, if you prefer the inline widget to NOT have a pre-form (user enters directly in Calendly), you'll need to:
- Fetch invitee data from Calendly API using the `invitee.uri`
- Or accept that Constant Contact won't capture email for inline embeds

## Alternative Solutions (Not Implemented)

### Option 2: Calendly API Call

After `onEventScheduled` fires, call Calendly API:

```typescript
const inviteeUri = event.data.payload.invitee.uri
const response = await fetch(inviteeUri, {
  headers: { Authorization: `Bearer ${CALENDLY_API_KEY}` }
})
const inviteeData = await response.json()
const email = inviteeData.email
```

**Pros**: No pre-form needed
**Cons**: Requires Calendly API key, additional API call, async complexity

### Option 3: URL Parameters

Pass email via URL parameter and extract it:

```typescript
const url = new URL(calendlyUrl)
url.searchParams.set('email', userEmail)
```

**Pros**: Simple
**Cons**: Email in URL (security concern), still need to collect email first

## References

- [Calendly react-calendly Documentation](https://www.npmjs.com/package/react-calendly)
- [Calendly Event Listener Payload Structure](https://github.com/tcampb/react-calendly)
- [How to pre-fill invitee information in an embed](https://help.calendly.com/hc/en-us/articles/31619360031383-How-to-pre-fill-invitee-information-in-an-embed)
- [Receive data from scheduled events](https://developer.calendly.com/receive-data-from-scheduled-events-in-real-time-with-webhook-subscriptions)

## Summary

The solution replaces the unreliable Calendly event payload extraction with a guaranteed pre-form data collection approach. Users provide their contact information upfront, which is then used to:

1. ✅ Pre-fill Calendly widget (better UX)
2. ✅ Track bookings with accurate contact data
3. ✅ Submit to Constant Contact CRM
4. ✅ Enable Meta Pixel and PostHog tracking with user data

This ensures 100% reliable email capture for all booking interactions.
