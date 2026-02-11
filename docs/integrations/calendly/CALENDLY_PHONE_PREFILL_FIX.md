# Calendly Phone Number Prefill Fix

**Date:** 2026-02-10
**Status:** ✅ Implemented
**Files Modified:**
- `/src/components/pages/signature/CalendlyBookingWidget.tsx`

## Problem

Phone numbers collected from the BookingPreForm were not being pre-filled in the Calendly InlineWidget booking form, even though email, firstName, and lastName were working correctly.

## Root Cause

Calendly's embed API **does not support a direct `phone` field** in the `prefill` object. According to the official Calendly documentation:

> Custom answers to invitee questions are numbered sequentially from `a1` to `a10`.

Phone numbers must be passed through the `customAnswers` object (e.g., `a1`, `a2`, etc.) if the Calendly event type has a custom question configured for phone numbers.

### Incorrect Implementation (Before)

```typescript
interface CalendlyPrefillData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string  // ❌ Not supported by Calendly API
}

// This would fail silently
const prefill = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '555-123-4567'  // ❌ Ignored by Calendly
}
```

## Solution

### 1. Updated Type Definitions

Created separate interfaces for input data vs. Calendly's expected format:

```typescript
// Input data structure (what we receive from BookingPreForm)
interface PrefillInputData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string  // ✅ Can receive phone from form
}

// Calendly prefill structure (what InlineWidget expects)
interface CalendlyPrefillData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  customAnswers?: {
    a1?: string  // Phone number (Calendly uses custom answers for phone)
    a2?: string
    a3?: string
    // ... up to a10
  }
}
```

### 2. Updated Prefill Builder

Modified `buildPrefillObject()` to transform phone numbers into the correct format:

```typescript
const buildPrefillObject = (): CalendlyPrefillData | undefined => {
  if (prefillData) {
    const prefill: CalendlyPrefillData = {}

    if (prefillData.email) prefill.email = prefillData.email
    if (prefillData.firstName) prefill.firstName = prefillData.firstName
    if (prefillData.lastName) prefill.lastName = prefillData.lastName

    // ✅ Phone number passed via customAnswers
    if (prefillData.phone) {
      prefill.customAnswers = {
        a1: prefillData.phone  // Phone number as first custom answer
      }
    }

    // Build full name if we have firstName and lastName
    if (prefillData.firstName && prefillData.lastName) {
      prefill.name = `${prefillData.firstName} ${prefillData.lastName}`
    }

    return Object.keys(prefill).length > 0 ? prefill : undefined
  }

  return undefined
}
```

### 3. Enhanced Logging

Added comprehensive logging to verify phone data flow:

```typescript
console.log('📧 Prefill data input:', prefillData)
console.log('📋 Prefill object being passed to InlineWidget:', buildPrefillObject())
console.log('🔧 Built prefill object for Calendly:', JSON.stringify(prefill, null, 2))
```

## Calendly Event Type Configuration

For phone prefill to work, the Calendly event type MUST have a phone number custom question configured:

1. Go to Calendly event settings
2. Navigate to "Invitee Questions"
3. Add a custom question with type "Phone Number"
4. Ensure it's at position 1 (will be `a1` in the API)

Example Calendly event type configuration:

```json
{
  "custom_questions": [
    {
      "name": "Phone Number",
      "type": "phone_number",
      "position": 0,
      "enabled": true,
      "required": true
    }
  ]
}
```

## How It Works

### Data Flow

```
BookingPreForm (User Input)
  ↓
  {
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-123-4567'
  }
  ↓
buildPrefillObject() Transformation
  ↓
  {
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    customAnswers: {
      a1: '555-123-4567'  // ✅ Phone as custom answer
    }
  }
  ↓
InlineWidget (Calendly Embed)
  ↓
Calendly Booking Form (Pre-filled)
```

### Component Integration

**BookingModalBlock:**
```tsx
<CalendlyBookingWidget
  isOpen={true}
  onClose={handleModalClose}
  calendlyUrl={calendlyUrl}
  displayMode="inline"
  prefillData={prefillData}  // Contains phone field
/>
```

**CalendlyEmbedBlock:**
```tsx
<InlineWidget
  url={calendlyUrl}
  {...(prefillData && { prefill: prefillData })}  // Transformed with customAnswers
/>
```

## Testing

### Verify Phone Prefill

1. Navigate to a page with BookingModalBlock or CalendlyEmbedBlock
2. Fill out the pre-booking form with phone number
3. Open browser console to see logs:
   ```
   📝 Pre-form data collected: { email: "...", phone: "..." }
   🔧 Built prefill object for Calendly: { "customAnswers": { "a1": "555-123-4567" } }
   ```
4. Verify phone number appears in Calendly form

### Console Logs to Monitor

```javascript
// Pre-form submission
📝 Pre-form data collected: {email, firstName, lastName, phone}

// Prefill transformation
🔧 Built prefill object for Calendly: {customAnswers: {a1: "..."}}

// Widget initialization
📧 Prefill data input: {phone: "[PRESENT]"}
📋 Prefill object being passed to InlineWidget: {customAnswers: {...}}

// Event tracking (after booking)
📊 Contact data prepared for tracking: {phone: "[PRESENT: 555-123-4567]"}
```

## Important Notes

### Custom Question Position

This implementation assumes phone is at position `a1`. If your Calendly event has multiple custom questions, you may need to adjust the position:

```typescript
if (prefillData.phone) {
  prefill.customAnswers = {
    a1: 'Some other answer',
    a2: 'Another answer',
    a3: prefillData.phone  // Phone at position 3
  }
}
```

### Multiple Custom Answers

You can prefill multiple custom questions at once:

```typescript
prefill.customAnswers = {
  a1: prefillData.phone,
  a2: prefillData.companyName,
  a3: prefillData.referralSource,
  // ... up to a10
}
```

### Phone Validation

The BookingPreForm already validates phone format:

```typescript
phone: z.string().min(10, 'Please enter a valid phone number')
```

Calendly will also validate phone format based on your event settings.

## References

### Calendly Documentation

- [Embed Recipes - Pre-Fill Questions](https://developer.calendly.com/api-docs/19a0a0497b436-embed-recipes)
- [Event Type Custom Questions](https://developer.calendly.com/api-docs/f3185c91567db-event-type)

Key quote from docs:
> "Custom answers to invitee questions are numbered sequentially from `a1` to `a10`."

### react-calendly Library

- [GitHub: tcampb/react-calendly](https://github.com/tcampb/react-calendly)
- Prefill prop matches Calendly's official embed API

## Related Files

- `/src/components/pages/signature/CalendlyBookingWidget.tsx` - Main widget component
- `/src/components/blocks/BookingModalBlock.tsx` - Modal implementation
- `/src/components/blocks/CalendlyEmbedBlock.tsx` - Embed implementation
- `/src/components/ui/BookingPreForm.tsx` - Pre-form data collection

## Future Improvements

1. **Dynamic Custom Answer Position**: Fetch Calendly event type config via API to determine phone question position
2. **Phone Formatting**: Standardize phone format before passing to Calendly (e.g., E.164 format)
3. **Additional Custom Questions**: Support other custom questions (company, notes, etc.)
4. **Error Handling**: Gracefully handle when phone custom question is missing from event
