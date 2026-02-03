# DealerHours Component

Location: `/src/app/(frontend)/find-a-dealer/[slug]/components/DealerHours.tsx`

## Overview

The `DealerHours` component displays weekly business hours for a Kawai dealer in a clean, responsive grid format. It intelligently highlights the current day of the week and shows real-time "Open Now" or "Closed" status based on the current time.

## Features

- **Current Day Highlighting**: Visually emphasizes the current day of the week with a red border and bold text
- **Real-Time Status Badge**: Displays "Open Now" (green) or "Closed" (red) based on current time calculation
- **Responsive Grid Layout**: 2-column grid that works seamlessly on mobile and desktop
- **Multiple Time Format Support**: Parses both "10:00 AM" and "10:00" formats
- **Fallback UI**: Shows "Call for hours" button when no hours are provided
- **TypeScript Strict Mode**: Full compliance with strict mode and `exactOptionalPropertyTypes`
- **Null-Safe**: Comprehensive null/undefined checks for all data access

## Usage

### Basic Implementation

```tsx
import { DealerHours } from '@/app/(frontend)/find-a-dealer/[slug]/components/DealerHours'
import { getDealerBySlug } from '@/lib/payload/queries'

export default async function DealerPage({ params }) {
  const dealer = await getDealerBySlug(params.slug)

  return (
    <div className="space-y-8">
      <DealerHours dealer={dealer} />
    </div>
  )
}
```

### With Custom Styling

```tsx
<DealerHours
  dealer={dealer}
  className="max-w-md mx-auto"
/>
```

## Data Structure

The component expects a `Dealer` object from Payload CMS with the following structure:

```typescript
dealer.hours: Array<{
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  openTime?: string // e.g., "10:00 AM" or "10:00"
  closeTime?: string // e.g., "6:00 PM" or "18:00"
  isClosed?: boolean // If true, day shows as "Closed"
}>

dealer.contactInfo?: {
  phone?: string // Used for fallback "Call for hours" button
}
```

## Component Behavior

### With Hours Data

When hours are provided, the component displays:

1. **Header Section**
   - "Business Hours" title
   - "Open Now" or "Closed" badge (only on client after mount)

2. **Hours Grid**
   - 2 columns on all screen sizes
   - Day abbreviations (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
   - Hours formatted as "10:00 AM - 6:00 PM"
   - "Closed" text for isClosed days
   - Current day highlighted with red border and bold text

3. **Footer**
   - Helper text: "For holiday hours or special exceptions, please call us"
   - "Call us" link if phone number is available

### Without Hours Data (Fallback)

When no hours are provided:

- Displays "Hours not available online" message
- Shows "Call for Hours" button (if phone available)
- Or generic "Please contact the dealer directly" message

## Real-Time Status Calculation

The component automatically calculates whether the dealer is currently open:

1. **On Client Mount**: Determines current day and time
2. **Time Parsing**: Converts time strings to minutes (0-1439)
3. **Comparison**: Checks if current time falls within open/close range
4. **AM/PM Handling**: Properly converts 12-hour format to 24-hour

### Examples

- "10:00 AM" → 600 minutes
- "6:00 PM" → 1080 minutes
- Current time: 2:30 PM (14:30) → 870 minutes
- Status: "Open Now" if 600 ≤ 870 < 1080

## Current Day Highlighting

The component:

1. Gets current day using `new Date().getDay()` (0 = Sunday)
2. Maps to day name ('sunday', 'monday', etc.)
3. Applies conditional styling:
   - **Current day**: Red border, bold text, white background
   - **Other days**: Default gray styling

## TypeScript Strict Mode Compliance

The component handles TypeScript's strict settings:

- **exactOptionalPropertyTypes**: Uses `| undefined` for optional properties
- **noUncheckedIndexedAccess**: Validates array/object access with type guards
- **Null Checks**: All regex match results validated before access
- **State Types**: Properly typed state with union types

### Type-Safe Patterns Used

```typescript
// Regex match validation
if (ampmMatch && ampmMatch[1] && ampmMatch[2] && ampmMatch[3]) {
  // Safe to access match groups
}

// Nullable object access
if (dealer.contactInfo?.phone && typeof dealer.contactInfo.phone === 'string') {
  // Safe string operation
}

// State initialization
const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null)
```

## Styling Notes

- Uses Tailwind CSS classes from the KAWAI design system
- Color scheme:
  - **kawai-red** (#C41E3A): Primary brand color, current day highlight
  - **Green** (#10b981): "Open Now" badge background
  - **Red** (#ef4444): "Closed" badge background
  - **Gray**: Secondary text and inactive elements

## Performance Considerations

- **Client-Side Hydration**: Status calculation happens only after mount to prevent hydration mismatches
- **No Re-renders**: Single `useEffect` runs once on mount, state is stable
- **No External API Calls**: All logic is local time-based

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Clear badge labels ("Open Now" / "Closed")
- Sufficient color contrast for all text
- Phone link using `tel:` protocol for mobile support

## Error Handling

- Handles missing hours data gracefully
- Validates time string formats before parsing
- Provides fallback UI for missing contact information
- No errors thrown; always renders something useful

## Integration Points

### With DealerContactBar

Place `DealerHours` alongside `DealerContactBar` for a complete dealer info section:

```tsx
<div className="grid md:grid-cols-2 gap-8">
  <DealerContactBar dealer={dealer} />
  <DealerHours dealer={dealer} />
</div>
```

### With DealerInfo

Combine with dealer details in a comprehensive dealer page:

```tsx
<section className="space-y-8">
  <DealerContactBar dealer={dealer} />
  <div className="grid md:grid-cols-3 gap-8">
    <DealerHours dealer={dealer} className="md:col-span-1" />
    <DealerInfo dealer={dealer} className="md:col-span-2" />
  </div>
</section>
```

## Time Format Support

The component intelligently handles multiple time formats:

| Format | Example | Parsed As |
|--------|---------|-----------|
| 12-hour with AM/PM | 10:00 AM | 10:00 |
| 12-hour uppercase | 6:00 PM | 18:00 |
| 12-hour lowercase | 6:00 pm | 18:00 |
| 24-hour format | 18:00 | 18:00 |
| Midnight edge case | 12:00 AM | 00:00 |
| Noon edge case | 12:00 PM | 12:00 |

## Browser Compatibility

- Uses native `Date` API (all modern browsers)
- `useEffect` and `useState` hooks (React 16.8+)
- Regex patterns (all browsers)
- No external dependencies beyond React and Lucide icons

## Testing Considerations

When testing the component:

1. **Time Calculations**: Mock `Date()` to test "open/closed" status
2. **Hydration**: Ensure status only renders after client mount
3. **Fallback**: Test with empty `dealer.hours`
4. **Null Values**: Test with `null`/`undefined` contact info
5. **Format Parsing**: Test various time string formats

Example test setup:

```typescript
// Mock current time
vi.useFakeTimers()
vi.setSystemTime(new Date('2024-02-15 14:30:00'))

// Render component
render(<DealerHours dealer={mockDealer} />)

// Check status after hydration
await waitFor(() => {
  expect(screen.getByText('Open Now')).toBeInTheDocument()
})

vi.useRealTimers()
```

## Changelog

### v1.0.0 (Initial Release)

- Daily hours display in 2-column grid
- Current day highlighting
- Real-time "Open Now" / "Closed" status
- Time format parsing (12h and 24h)
- Fallback UI for missing hours
- Full TypeScript strict mode compliance
