# GL-10 Signature Landing Page Components

## Overview

Three key components for the GL-10 Baby Grand Signature landing page experience:
- **GL10Booking**: Calendly booking section with invitation messaging
- **GL10ProgressBar**: Sticky progress indicator
- **GL10SuccessOverlay**: Full-screen completion overlay with confetti

---

## Installation

First, install the required dependency for the success overlay confetti animation:

```bash
bun add canvas-confetti
bun add -D @types/canvas-confetti
```

---

## Components

### 1. GL10Booking

Calendly booking section with two-column layout featuring invitation messaging and inline booking widget.

**Features:**
- Responsive two-column layout (stacked on mobile)
- Benefits list with icons
- Scarcity indicator
- Calendly integration with prefill data
- Scroll-triggered animations
- Full tracking integration (PostHog, Meta Pixel, Constant Contact)

**Props:**
```typescript
interface GL10BookingProps {
  prefillData?: {
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
  }
  onBookingComplete?: () => void
  className?: string
}
```

**Usage:**
```tsx
import { GL10Booking } from './components'

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleBookingComplete = () => {
    console.log('Booking completed!')
    // Show success overlay, track event, etc.
  }

  return (
    <GL10Booking
      prefillData={formData}
      onBookingComplete={handleBookingComplete}
    />
  )
}
```

---

### 2. GL10ProgressBar

Sticky progress indicator that shows completion percentage and optionally displays section labels.

**Features:**
- Fixed position at top of page
- Smooth spring animation
- Glass morphism effect with backdrop blur
- Section markers with hover tooltips (optional)
- Shows after scrolling down 100px
- Responsive design

**Props:**
```typescript
interface GL10ProgressBarProps {
  completedSections: string[]       // Array of completed section IDs
  totalSections: number              // Total number of sections
  className?: string
  sectionLabels?: string[]           // Optional labels for hover tooltips
}
```

**Usage:**
```tsx
import { GL10ProgressBar } from './components'

export default function Page() {
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const totalSections = 5
  const sectionLabels = [
    'Welcome',
    'Assessment',
    'Showcase',
    'Contact',
    'Booking'
  ]

  return (
    <>
      <GL10ProgressBar
        completedSections={completedSections}
        totalSections={totalSections}
        sectionLabels={sectionLabels}
      />
      {/* Rest of page content */}
    </>
  )
}
```

---

### 3. GL10SuccessOverlay

Full-screen overlay that appears after successful booking completion, featuring confetti animation and benefit cards.

**Features:**
- Full-screen modal with backdrop blur
- Confetti celebration animation
- Three benefit cards with icons
- Framer Motion entrance/exit animations
- Close button and click-outside-to-close
- Responsive design

**Props:**
```typescript
interface GL10SuccessOverlayProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}
```

**Usage:**
```tsx
import { GL10SuccessOverlay } from './components'

export default function Page() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleBookingComplete = () => {
    setShowSuccess(true)
  }

  return (
    <>
      {/* Your page content */}

      <GL10SuccessOverlay
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}
```

---

## Complete Integration Example

```tsx
'use client'

import { useState } from 'react'
import {
  GL10Booking,
  GL10ProgressBar,
  GL10SuccessOverlay
} from './components'

export default function GL10SignaturePage() {
  // Progress tracking
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const totalSections = 5
  const sectionLabels = ['Welcome', 'Assessment', 'Showcase', 'Contact', 'Booking']

  // Form data for prefill
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  // Success overlay
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle section completion
  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
  }

  // Handle booking completion
  const handleBookingComplete = () => {
    handleSectionComplete('booking')
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <GL10ProgressBar
        completedSections={completedSections}
        totalSections={totalSections}
        sectionLabels={sectionLabels}
      />

      {/* Page Sections */}
      <section id="welcome">
        {/* Welcome content */}
      </section>

      <section id="assessment">
        {/* Assessment content */}
      </section>

      <section id="showcase">
        {/* Showcase content */}
      </section>

      <section id="contact">
        {/* Contact form that captures formData */}
      </section>

      {/* Booking Section */}
      <GL10Booking
        prefillData={formData}
        onBookingComplete={handleBookingComplete}
      />

      {/* Success Overlay */}
      <GL10SuccessOverlay
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  )
}
```

---

## Styling Customization

All components use Tailwind CSS with Kawai brand colors. The following CSS variables are used:

```css
/* In your tailwind.config.ts */
colors: {
  kawai: {
    red: '#C41E3A',
    gold: '#D4AF37',
    charcoal: '#2C2C2C',
    pearl: '#F8F8F8',
    black: '#000000'
  }
}
```

To customize colors, you can pass className props or modify the component files directly.

---

## Dependencies

Required packages (already installed in this project):
- `react-calendly` - Calendly widget integration
- `framer-motion` - Animations
- `canvas-confetti` - Confetti animation (needs to be installed)
- `posthog-js` - Analytics tracking
- `@/hooks/useConstantContactIntegration` - CRM integration
- `@/components/MetaPixel` - Meta Pixel tracking

---

## Notes

1. **Calendly URL**: The GL10Booking component uses `https://calendly.com/kawaipianogallery/gl10-signature`. Update this URL in the component if needed.

2. **Tracking**: All three components integrate with the existing tracking infrastructure:
   - PostHog for analytics
   - Meta Pixel for ad conversion tracking
   - Constant Contact for CRM (SHOWROOM KAWAI list)

3. **Animations**: Components use Framer Motion for smooth animations. The GL10SuccessOverlay uses canvas-confetti for the celebration effect.

4. **Responsive**: All components are fully responsive and work on mobile, tablet, and desktop.

5. **Accessibility**: Close buttons include proper ARIA labels and keyboard navigation support.
