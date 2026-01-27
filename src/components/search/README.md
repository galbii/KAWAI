# SearchBar Component

A sophisticated search component with debouncing, keyboard navigation, and smooth animations.

## Features

- **Debounced Search**: 300ms delay before API call to reduce server load
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close
- **Loading States**: Displays spinner while searching
- **Empty States**: Shows helpful message when no results found
- **Click Outside**: Automatically closes dropdown when clicking outside
- **Responsive Design**: Works on all screen sizes
- **Animations**: Smooth Framer Motion animations for dropdown
- **Accessibility**: Proper ARIA labels and keyboard support

## Usage

### Basic Example

```tsx
import { SearchBar } from '@/components/search'

export function Header() {
  return (
    <header>
      <SearchBar className="w-full max-w-md" />
    </header>
  )
}
```

### With Custom Styling

```tsx
<SearchBar className="w-96 shadow-lg" />
```

## API Endpoint

The component expects a `/api/search` endpoint that accepts a `q` query parameter:

```typescript
// app/api/search/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Your search logic here
  const results = await searchDatabase(query)

  return NextResponse.json({ results })
}
```

### Expected Response Format

```json
{
  "results": [
    {
      "id": "1",
      "title": "Kawai CA901",
      "doc": {
        "value": {
          "slug": "products/ca901",
          "category": "Digital Piano",
          "tags": ["Premium", "88 Keys"]
        },
        "relationTo": "pages"
      },
      "excerpt": "Premium digital piano with Grand Feel III action..."
    }
  ]
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes for the container |

## Keyboard Shortcuts

- **Arrow Down/Up**: Navigate through results
- **Enter**: Select highlighted result
- **Escape**: Close dropdown and clear focus

## Styling

The component uses Tailwind CSS with the following key classes:

- **Input**: `border-gray-300`, `focus:ring-kawai-red`
- **Dropdown**: `shadow-lg`, `max-h-96`
- **Selected Item**: `bg-gray-50`
- **Category Badge**: `bg-gray-100`, `text-gray-600`

## Animation Details

- **Duration**: 200ms
- **Initial State**: `opacity: 0`, `y: -10px`
- **Animate State**: `opacity: 1`, `y: 0`

## Minimum Query Length

The component requires at least **2 characters** before triggering a search.

## Examples

### In Navigation Header

```tsx
import { SearchBar } from '@/components/search'

export function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      <Logo />
      <SearchBar className="flex-1 max-w-xl" />
      <UserMenu />
    </nav>
  )
}
```

### Standalone Search Page

```tsx
import { SearchBar } from '@/components/search'

export default function SearchPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>
      <SearchBar className="w-full max-w-2xl mx-auto" />
    </div>
  )
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- `lucide-react`: Icons (Search, X, Loader2)
- `framer-motion`: Animations
- `next/navigation`: Routing
- `@/lib/utils`: cn() utility for className merging
