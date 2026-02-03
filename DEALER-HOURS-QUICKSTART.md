# DealerHours Component - Quick Start Guide

## Installation

The component is already created and ready to use!

**File Location**: `/src/app/(frontend)/find-a-dealer/[slug]/components/DealerHours.tsx`

## Import

```tsx
import { DealerHours } from '@/app/(frontend)/find-a-dealer/[slug]/components/DealerHours'
```

## Basic Usage

```tsx
export function DealerDetailPage({ dealer }: { dealer: Dealer }) {
  return <DealerHours dealer={dealer} />
}
```

## What It Does

| Feature | Description |
|---------|-------------|
| **Hours Grid** | Displays all 7 days in a 2-column responsive grid |
| **Current Day** | Highlights today's day with red border and bold text |
| **Status Badge** | Shows "Open Now" (green) or "Closed" (red) based on local time |
| **Time Parsing** | Handles "10:00 AM", "10:00 am", and "10:00" formats |
| **Fallback** | Shows "Call for Hours" when no hours provided |
| **Mobile Ready** | Fully responsive, works on all screen sizes |

## Props

```typescript
interface DealerHoursProps {
  // Required: Dealer object from Payload CMS
  dealer: Dealer

  // Optional: Custom CSS class name
  className?: string
}
```

## Example Data Structure

```typescript
const dealer = {
  id: '123',
  dealerName: 'Kawai Piano Gallery',
  hours: [
    { day: 'monday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
    { day: 'tuesday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
    { day: 'wednesday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
    { day: 'thursday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
    { day: 'friday', openTime: '10:00 AM', closeTime: '8:00 PM', isClosed: false },
    { day: 'saturday', openTime: '10:00 AM', closeTime: '5:00 PM', isClosed: false },
    { day: 'sunday', openTime: '', closeTime: '', isClosed: true }
  ],
  contactInfo: {
    phone: '(636) 265-2866',
    email: 'info@example.com'
  }
}

// Render
<DealerHours dealer={dealer} />
```

## Common Layouts

### Two-Column Layout
```tsx
<div className="grid md:grid-cols-2 gap-8">
  <section>
    <h2>Contact Info</h2>
    <DealerContactBar dealer={dealer} />
  </section>

  <section>
    <h2>Hours</h2>
    <DealerHours dealer={dealer} />
  </section>
</div>
```

### Sidebar Layout
```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div className="md:col-span-2">
    {/* Main content */}
  </div>

  <aside className="space-y-6">
    <DealerHours dealer={dealer} />
  </aside>
</div>
```

### Stacked on Mobile
```tsx
<div className="space-y-6">
  <DealerContactBar dealer={dealer} />
  <DealerHours dealer={dealer} />
</div>
```

## Styling Notes

The component comes with built-in styling:
- Gray background container
- Red accent color for current day
- Green for "Open Now", Red for "Closed"
- Responsive padding and spacing
- Uses Tailwind CSS and KAWAI brand colors

To customize, pass a `className`:
```tsx
<DealerHours dealer={dealer} className="max-w-sm shadow-lg" />
```

## Time Formats Supported

All of these work automatically:
```
✅ "10:00 AM"
✅ "10:00 am"
✅ "6:00 PM"
✅ "6:00 pm"
✅ "10:00"       (24-hour format)
✅ "18:00"       (24-hour format)
```

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| No hours provided | Shows "Hours not available online" + "Call for Hours" button |
| No phone number | Shows fallback text without button |
| All days closed | Displays "Closed" for all days |
| Invalid time format | Treated as "Closed" |
| Midnight (12:00 AM) | Correctly parsed as 00:00 |
| Noon (12:00 PM) | Correctly parsed as 12:00 |

## Real-Time Updates

**Important**: The "Open Now" / "Closed" badge:
- Only appears AFTER component mounts on client
- Uses browser's local time (client timezone)
- Doesn't update every minute (static calculation)
- If exact real-time status needed, you'd need to add `setInterval`

To add live updates:
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Recalculate and update status
    setCurrentStatus(calculateStatus())
  }, 60000) // Every minute

  return () => clearInterval(interval)
}, [])
```

## Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { DealerHours } from './DealerHours'

describe('DealerHours', () => {
  it('displays hours', () => {
    render(<DealerHours dealer={mockDealer} />)
    expect(screen.getByText('Business Hours')).toBeInTheDocument()
  })

  it('shows status badge after mount', async () => {
    render(<DealerHours dealer={mockDealer} />)
    await waitFor(() => {
      expect(screen.getByText(/Open Now|Closed/)).toBeInTheDocument()
    })
  })
})
```

## Accessibility

The component is fully accessible:
- ✅ Semantic HTML
- ✅ Clear text labels
- ✅ Phone links use `tel:` protocol
- ✅ Good color contrast
- ✅ Works with screen readers

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Requires JavaScript enabled

## Performance

- Single `useEffect` hook
- No external API calls
- No polling or timers
- Lightweight component
- No performance issues even with many dealers displayed

## Troubleshooting

### Badge Not Showing
- Make sure component is mounted before checking
- Badge only renders after client hydration
- Use `waitFor()` in tests

### Times Not Parsing
- Check time format: "10:00 AM" or "10:00"
- Verify there's no extra whitespace
- Check capitalization of AM/PM (case-insensitive)

### Wrong Status
- Verify dealer's timezone matches browser timezone
- Component uses client's local time
- Status changes at midnight local time

### Phone Link Not Working
- Ensure `dealer.contactInfo.phone` is provided
- Check format: "(555) 555-1234" or "555-555-1234"
- Test on mobile device (tel: links work better there)

## Related Components

- **DealerContactBar** - Sticky action bar with call/directions/email buttons
- **DealerCard** - Card display for dealer in list views
- **DealerInfo** - Detailed dealer information section

## More Information

For detailed documentation, see:
- `/docs/DEALER-HOURS-COMPONENT.md` - Full feature documentation
- `/docs/DEALER-HOURS-EXAMPLES.md` - 12+ usage examples
- `/DEALER-HOURS-IMPLEMENTATION.md` - Implementation details

## Need Help?

This component follows all KAWAI codebase patterns:
- TypeScript strict mode compliant
- Uses `cn()` utility for class names
- Uses Lucide icons for consistent iconography
- Follows React/Next.js best practices
- Uses Tailwind CSS for styling
