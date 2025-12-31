# Simple Customer Signup Form (Modal Popup)

A minimal customer signup form that displays as a modal popup on page load and integrates with Shopify Admin API to create/update customers with storefront-based tagging.

## Overview

The `SimpleCustomerSignup` component provides a streamlined way to capture customer information (email, first name, last name) and automatically tag them with their storefront location in Shopify. The form appears as a centered modal popup that overlays the page content.

## Features

- ✅ **Modal Popup** - Displays as centered overlay on page load
- ✅ **Configurable Delay** - Control when the modal appears (default: 1 second)
- ✅ Minimal form fields (email, firstName, lastName)
- ✅ Client-side validation with Zod
- ✅ Server-side validation and error handling
- ✅ Automatic customer creation/update in Shopify
- ✅ Storefront-based tagging for customer segmentation
- ✅ Success/error states with user feedback
- ✅ **Backdrop Click to Close** - Click outside to dismiss
- ✅ **X Button** - Close button in top-right corner
- ✅ **Body Scroll Lock** - Prevents background scrolling when open
- ✅ **Smooth Animations** - Fade and zoom entrance effects
- ✅ TypeScript strict mode compliant
- ✅ Kawai brand styling

## Usage

### Basic Example

```tsx
import { SimpleCustomerSignup } from '@/components/forms/SimpleCustomerSignup'

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <SimpleCustomerSignup storefrontSlug={params.slug} />
    </main>
  )
}
```

### With Custom Text and Delay

```tsx
<SimpleCustomerSignup
  storefrontSlug="dallas"
  title="Join Our Dallas Community"
  description="Sign up to receive exclusive updates about our Dallas showroom events and new piano arrivals."
  submitButtonText="Get Updates"
  showDelay={2000}  // Show after 2 seconds
/>
```

### Instant Popup (No Delay)

```tsx
<SimpleCustomerSignup
  storefrontSlug="dallas"
  showDelay={0}  // Show immediately on page load
/>
```

### In a Storefront Contact Section

```tsx
export default async function DallasStorefrontPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Showroom Info */}
      <ShowroomSection />

      {/* Customer Signup */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-lg">
          <SimpleCustomerSignup storefrontSlug="dallas" />
        </div>
      </section>
    </>
  )
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `storefrontSlug` | `string` | Yes | - | Storefront location slug (e.g., "dallas", "st-louis") used for customer tagging |
| `title` | `string` | No | "Stay Connected" | Modal title/heading |
| `description` | `string` | No | Default description | Modal description text |
| `submitButtonText` | `string` | No | "Sign Up" | Submit button text |
| `showDelay` | `number` | No | `1000` | Delay in milliseconds before showing the modal popup (e.g., `0` = instant, `2000` = 2 seconds) |
| `successTitle` | `string` | No | "Thank You for Signing Up!" | Success message headline shown after form submission |
| `successMessage` | `string` | No | Default message | Success message description shown after form submission |

## How It Works

### 0. Modal Popup Behavior

When you add the component to a page:

1. **Page Loads** → Component renders but stays hidden
2. **Delay Timer** → Waits for `showDelay` milliseconds (default: 1000ms)
3. **Modal Appears** → Fades in with smooth animation
4. **Body Scroll Locked** → Background page can't scroll while modal is open
5. **User Interaction**:
   - Fill form → Submit → Success/error message
   - Click X button → Modal closes
   - Click backdrop (outside modal) → Modal closes
   - Press Escape key → Modal closes (browser default)

### 1. Form Submission Flow

```
User fills form → Client validation → Server action → Shopify Admin API → Success/Error response
```

### 2. Customer Tagging

When a customer submits the form:
- **New Customer**: Created in Shopify with tag `["dallas"]`
- **Existing Customer**: Tag `"dallas"` appended to existing tags

Example tags in Shopify:
```
Customer A (new): ["dallas"]
Customer B (existing, from St. Louis): ["st-louis", "dallas"]
```

### 3. Server Action

Located at `src/lib/actions/simple-customer-signup.ts`:

```typescript
// Validates input
const validationResult = simpleSignupSchema.safeParse(rawData)

// Creates/updates customer via Shopify Admin API
await upsertCustomer({
  email: signupData.email,
  firstName: signupData.firstName,
  lastName: signupData.lastName,
  tags: [signupData.storefrontSlug]  // e.g., ["dallas"]
})
```

### 4. Shopify Integration

Uses the optimized `upsertCustomer()` function:
- **ONE API call** (not 2-3 like traditional approach)
- **Automatic create/update** based on email
- **Tag appending** (preserves existing tags)
- **OAuth authentication** (no manual token management)

## Validation

### Client-Side (Zod Schema)

```typescript
const signupFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address')
})
```

### Server-Side (Duplicate Validation)

Server action validates the same schema to prevent client-side bypass.

## Error Handling

### Validation Errors

```tsx
// Inline field errors
{errors.firstName && (
  <p className="text-kawai-red text-sm mt-1">{errors.firstName.message}</p>
)}
```

### Server Errors

```tsx
// Server error banner
{formState && !formState.success && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-700">{formState.message}</p>
  </div>
)}
```

## Success State

After successful submission:
- Form is hidden
- Success message displayed with checkmark icon
- Option to "Sign Up Another Person" (resets form)

## Styling

Uses Kawai brand design system:
- Primary color: `bg-kawai-red`
- Hover state: `hover:bg-kawai-black`
- Text: `text-kawai-black`
- Background: `bg-kawai-pearl/30`

## TypeScript

Fully typed with TypeScript strict mode:

```typescript
interface SimpleCustomerSignupProps {
  storefrontSlug: string
  title?: string
  description?: string
  submitButtonText?: string
}
```

## Environment Variables

Requires Shopify Admin API credentials:

```bash
SHOPIFY_APP_API_KEY=your-client-id
SHOPIFY_APP_CLIENT_SECRET=shpss_your-client-secret
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_API_VERSION=2025-01
```

## Related Files

- **Server Action**: `src/lib/actions/simple-customer-signup.ts`
- **Component**: `src/components/forms/SimpleCustomerSignup.tsx`
- **Shopify Customer API**: `src/lib/shopify/customers.ts`
- **Types**: `src/lib/shopify/types.ts`

## Troubleshooting

### "Service unavailable" Error

**Cause**: Missing Shopify environment variables

**Solution**: Verify `.env.local` has all required variables

### "Failed to complete signup" Error

**Cause**: Shopify API error (OAuth, network, etc.)

**Solution**: Check server logs for detailed error message

### Customer Not Tagged

**Cause**: Tag validation or API scope issue

**Solution**:
1. Verify `write_customers` scope enabled in Shopify app
2. Check server logs for tag array
3. Verify storefront slug is valid

## Best Practices

1. **Always pass storefront slug**: Required for customer segmentation
2. **Validate slug format**: Use lowercase, hyphenated slugs (e.g., "st-louis", not "St. Louis")
3. **Customize messaging**: Use custom title/description for context-specific forms
4. **Monitor submissions**: Check Shopify Admin → Customers to verify tagging

## Examples

### Newsletter Signup

```tsx
<SimpleCustomerSignup
  storefrontSlug="dallas"
  title="Get Our Piano Newsletter"
  description="Monthly tips, new arrivals, and exclusive offers from our Dallas showroom."
  submitButtonText="Subscribe"
/>
```

### Event Registration

```tsx
<SimpleCustomerSignup
  storefrontSlug="dallas"
  title="Reserve Your Spot"
  description="Sign up to attend our exclusive grand piano showcase event."
  submitButtonText="Register for Event"
/>
```

### Lead Capture

```tsx
<SimpleCustomerSignup
  storefrontSlug="dallas"
  title="Get Your Free Piano Buying Guide"
  description="Download our comprehensive guide and get personalized recommendations."
  submitButtonText="Download Guide"
/>
```
