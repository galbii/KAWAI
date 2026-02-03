# DealerHours Component - Usage Examples

## Basic Usage

### Simple Integration in Dealer Page

```tsx
// src/app/(frontend)/find-a-dealer/[slug]/page.tsx

import { DealerHours } from './components/DealerHours'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function DealerPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'dealers',
    where: { slug: { equals: params.slug } },
    depth: 1,
  })

  const dealer = docs[0]

  if (!dealer) {
    return <div>Dealer not found</div>
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <DealerHours dealer={dealer} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          {/* Other dealer info */}
        </section>
      </div>
    </div>
  )
}
```

## With Sidebar Layout

```tsx
// Two-column layout: hours on the right sidebar

<div className="grid md:grid-cols-3 gap-8">
  {/* Main content - 2 columns */}
  <div className="md:col-span-2 space-y-8">
    <section>
      <h2>About This Dealer</h2>
      {/* Dealer description, services, etc. */}
    </section>

    <section>
      <h2>Featured Products</h2>
      {/* Product carousel */}
    </section>
  </div>

  {/* Sidebar - 1 column */}
  <aside className="space-y-6">
    <DealerHours dealer={dealer} />

    <section>
      <h2>Location</h2>
      {/* Map section */}
    </section>

    <section>
      <h2>Contact</h2>
      {/* Contact form */}
    </section>
  </aside>
</div>
```

## With Custom Container Width

```tsx
// Constrain the hours display to a specific width

<div className="max-w-sm mx-auto">
  <DealerHours
    dealer={dealer}
    className="max-w-xs"
  />
</div>
```

## Stacked with Contact Bar

```tsx
// Show both sticky contact bar and hours below it

import { DealerContactBar } from './components/DealerContactBar'
import { DealerHours } from './components/DealerHours'

<div className="space-y-8">
  {/* Sticky action bar */}
  <DealerContactBar dealer={dealer} />

  {/* Hours section below */}
  <div className="container mx-auto px-4">
    <DealerHours dealer={dealer} className="max-w-2xl" />
  </div>
</div>
```

## In a Card Layout

```tsx
// Display hours in a styled card with other dealer info

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
    <div>
      <h3 className="text-xl font-bold mb-4">{dealer.dealerName}</h3>
      <p className="text-gray-600">{dealer.address?.city}, {dealer.address?.state}</p>
    </div>

    <DealerHours dealer={dealer} className="bg-white" />

    <div className="pt-4 border-t">
      <a href={`tel:${dealer.contactInfo?.phone}`} className="text-kawai-red font-medium">
        Call Now
      </a>
    </div>
  </div>
</div>
```

## Multiple Dealers in List

```tsx
// Display hours for multiple dealers in a finder list

{dealers.map((dealer) => (
  <div key={dealer.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-bold mb-2">{dealer.dealerName}</h3>
        <p className="text-gray-600 mb-4">
          {dealer.address?.street}
          <br />
          {dealer.address?.city}, {dealer.address?.state} {dealer.address?.zipCode}
        </p>
      </div>

      <DealerHours dealer={dealer} />
    </div>
  </div>
))}
```

## With Responsive Grid Adjustment

```tsx
// Adapt layout based on screen size

<section className="py-12">
  <h2 className="text-3xl font-bold mb-8">Dealer Information</h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Column 1: Hours (full width on mobile) */}
    <div>
      <h3 className="font-semibold mb-4">Hours</h3>
      <DealerHours dealer={dealer} />
    </div>

    {/* Column 2: Services (full width on mobile) */}
    <div>
      <h3 className="font-semibold mb-4">Services</h3>
      <ul className="space-y-2 text-gray-600">
        {dealer.tags?.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>

    {/* Column 3: Additional Info (full width on mobile) */}
    <div>
      <h3 className="font-semibold mb-4">Quick Links</h3>
      {/* Links and actions */}
    </div>
  </div>
</section>
```

## Custom CSS Integration

```tsx
// Add custom styling with CSS modules or Tailwind

<style jsx>{`
  .dealer-hours-section {
    @apply bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8;
  }
`}</style>

<div className="dealer-hours-section">
  <DealerHours dealer={dealer} className="bg-white rounded-lg" />
</div>
```

## With Loading State

```tsx
// Handle async dealer loading

'use client'

import { DealerHours } from './components/DealerHours'
import { useAsync } from '@/hooks'

export function DealerHoursSection({ dealerId }: { dealerId: string }) {
  const { data: dealer, isLoading } = useAsync(
    () => fetchDealer(dealerId),
    [dealerId]
  )

  if (isLoading) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
  }

  if (!dealer) {
    return <div>Failed to load dealer information</div>
  }

  return <DealerHours dealer={dealer} />
}
```

## Edge Cases and Handling

### No Hours Provided

```tsx
// When dealer.hours is empty array or undefined

<DealerHours dealer={{
  dealerName: 'Test Dealer',
  // hours is undefined or []
  contactInfo: {
    phone: '(555) 123-4567'
  }
}} />

// Renders: "Hours not available online" + "Call for Hours" button
```

### No Phone Number

```tsx
// When dealer has no phone contact

<DealerHours dealer={{
  dealerName: 'Test Dealer',
  hours: [{
    day: 'monday',
    openTime: '10:00 AM',
    closeTime: '6:00 PM',
    isClosed: false
  }],
  // contactInfo.phone is missing
}} />

// Renders: Hours display + "Please contact the dealer directly" message
```

### All Days Closed

```tsx
// Special case: dealer with all days closed

const closedDealer = {
  dealerName: 'Holiday Closed',
  hours: [
    { day: 'monday', isClosed: true },
    { day: 'tuesday', isClosed: true },
    { day: 'wednesday', isClosed: true },
    { day: 'thursday', isClosed: true },
    { day: 'friday', isClosed: true },
    { day: 'saturday', isClosed: true },
    { day: 'sunday', isClosed: true }
  ],
  contactInfo: { phone: '(555) 123-4567' }
}

// Will show all days as "Closed", with "Closed" badge
```

### Mixed Time Formats

```tsx
// Hours can use different formats

const mixedFormatDealer = {
  hours: [
    { day: 'monday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
    { day: 'tuesday', openTime: '10:00', closeTime: '18:00', isClosed: false },
    { day: 'saturday', openTime: '9:00 am', closeTime: '5:00 pm', isClosed: false },
  ]
}

// All formats parse correctly and display as entered
```

## Testing Examples

### React Testing Library

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { DealerHours } from './DealerHours'
import type { Dealer } from '@/payload-types'

describe('DealerHours', () => {
  const mockDealer: Dealer = {
    id: '1',
    dealerName: 'Test Dealer',
    hours: [
      { day: 'monday', openTime: '10:00 AM', closeTime: '6:00 PM', isClosed: false },
      { day: 'sunday', isClosed: true },
    ],
    contactInfo: { phone: '555-1234' },
    // ... other required fields
  }

  it('displays business hours', () => {
    render(<DealerHours dealer={mockDealer} />)
    expect(screen.getByText('Business Hours')).toBeInTheDocument()
  })

  it('shows fallback when no hours', () => {
    const dealerNoHours = { ...mockDealer, hours: undefined }
    render(<DealerHours dealer={dealerNoHours} />)
    expect(screen.getByText('Hours not available online')).toBeInTheDocument()
  })

  it('displays status badge after mount', async () => {
    render(<DealerHours dealer={mockDealer} />)

    await waitFor(() => {
      const badge = screen.queryByText(/Open Now|Closed/)
      expect(badge).toBeInTheDocument()
    })
  })
})
```

## Accessibility Checklist

- [ ] Proper heading hierarchy (`<h3>` for section title)
- [ ] Color not the only indicator (status text + badge)
- [ ] Sufficient color contrast (WCAG AA standard)
- [ ] Keyboard accessible (all links are real `<a>` or `<button>` elements)
- [ ] Phone links use `tel:` protocol
- [ ] Clear, descriptive labels for all actions

```tsx
// Accessible implementation

<div
  role="region"
  aria-label="Business hours"
  className="bg-gray-50 rounded-lg p-6"
>
  <h3 className="text-sm font-semibold text-gray-900">Business Hours</h3>
  {/* Status badge with text label */}
  {status && (
    <div aria-live="polite" aria-label={`Currently ${status}`}>
      {/* Badge content */}
    </div>
  )}
  {/* Hours list */}
</div>
```
