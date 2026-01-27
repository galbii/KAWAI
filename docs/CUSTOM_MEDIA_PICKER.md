# Custom Media Picker Integration

This document explains how the custom media picker is integrated with Payload CMS upload fields, allowing users to select media from the existing library OR upload new files.

## Overview

The custom media picker system consists of three main components:

1. **MediaManager Enhancement** - Modal with selection mode support
2. **MediaSelectorButton** - Admin component that integrates with upload fields
3. **Field Factory Functions** - Reusable field configurations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Payload Admin UI                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AdminRootProvider (wraps entire admin)               │   │
│  │   └─> MediaManagerProvider                          │   │
│  │        ├─> All admin pages have access              │   │
│  │        ├─> Dashboard (MediaManager button/modal)    │   │
│  │        └─> Edit Views (MediaSelectorButton)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Field Level:
┌─────────────────────────────────────────────────────────┐
│  Collection Field (Upload)                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ MediaSelectorButton (beforeInput component)        │ │
│  │   └─> useMediaManager() hook (from context)       │ │
│  │        └─> Opens MediaManager in 'select' mode     │ │
│  │             └─> User selects media                 │ │
│  │                  └─> onSelect callback             │ │
│  │                       └─> Sets field value         │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Standard Payload Upload Field                      │ │
│  │   └─> Drag-drop OR file browser upload            │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Components

### 0. AdminRootProvider (Required Setup)

**Location**: `src/components/admin/AdminRootProvider.tsx`

**Purpose**: Wraps the entire Payload admin UI with necessary providers, including `MediaManagerProvider` and renders the `MediaManagerModal` globally.

**Why it's needed**:
1. Field components (like `MediaSelectorButton`) are rendered throughout the admin UI (edit views, list views, etc.). They need access to the `useMediaManager()` hook, which requires the `MediaManagerProvider` to be available at the root level.
2. The modal must be available on ALL admin pages (not just dashboard), so it's rendered at the root level.

**Configuration** (already set up in `payload.config.ts`):
```typescript
admin: {
  components: {
    providers: ['/components/admin/AdminRootProvider#AdminRootProvider'],
  }
}
```

**What it provides**:
- `MediaManagerProvider` context available everywhere in admin UI
- `MediaManagerModal` rendered globally (available on all pages)
- Ensures all field components can use `useMediaManager()` hook
- Supports both dashboard components AND field components

### 1. MediaManager (Enhanced)

**Location**: `src/components/admin/media-manager/`

**New Features**:
- `mode` prop: `'browse'` | `'select'`
- `onSelect` callback: Fired when media is selected in selection mode
- Visual indicators for selection mode
- "Select This Media" button (only visible in selection mode)
- Hides edit/move buttons in selection mode for cleaner UX

**Types** (`types.ts`):
```typescript
interface MediaManagerModalOptions {
  mode?: 'browse' | 'select'
  onSelect?: (media: MediaItem) => void
  allowMultiple?: boolean // Future enhancement
  filterMimeType?: string // Future enhancement
}
```

**Usage**:
```typescript
import { useMediaManager } from './media-manager/MediaManagerProvider'

const { openModal } = useMediaManager()

// Open in selection mode
openModal({
  mode: 'select',
  onSelect: (media) => {
    console.log('Selected media:', media.id)
  }
})

// Open in browse mode (default)
openModal()
```

### 2. MediaSelectorButton

**Location**: `src/components/admin/MediaSelectorButton.tsx`

**Purpose**: Admin component that integrates with Payload's upload fields to provide a "Browse Media Library" button.

**How it works**:
1. Uses Payload's `useField` hook to access field value and setter
2. Opens MediaManager in selection mode
3. Sets field value to selected media ID via `onSelect` callback
4. Shows success indicator when media is selected from library

**Integration** (via field config):
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    components: {
      beforeInput: ['/components/admin/MediaSelectorButton#MediaSelectorButton'],
    },
  },
}
```

### 3. Field Factory Functions

**Location**: `src/lib/payload/fields/media.ts`

**Purpose**: Reusable field configurations that automatically include the MediaSelectorButton.

**Available Functions**:

#### `mediaField(name, options?)`
Basic upload field with media selector.

```typescript
import { mediaField } from '@/lib/payload/fields'

fields: [
  mediaField('featuredImage', {
    required: true,
    admin: {
      description: 'Main product image',
    },
  })
]
```

#### `imageField(name, options?)`
Upload field filtered to images only.

```typescript
import { imageField } from '@/lib/payload/fields'

fields: [
  imageField('thumbnail', {
    required: true,
    admin: {
      description: 'Product thumbnail (recommended: 400x300px)',
    },
  })
]
```

#### `videoField(name, options?)`
Upload field filtered to videos only.

```typescript
import { videoField } from '@/lib/payload/fields'

fields: [
  videoField('demoVideo', {
    admin: {
      description: 'Product demonstration video',
    },
  })
]
```

#### `mediaArrayField(name, options?)`
Array field for galleries/multiple images.

```typescript
import { mediaArrayField } from '@/lib/payload/fields'

fields: [
  mediaArrayField('gallery', {
    minRows: 1,
    maxRows: 12,
    admin: {
      description: 'Product image gallery (drag to reorder)',
    },
  })
]
```

#### `responsiveImageGroup(label?)`
Group field with desktop and mobile image fields.

```typescript
import { responsiveImageGroup } from '@/lib/payload/fields'

fields: [
  responsiveImageGroup('Hero Images')
]
// Creates: responsiveImages.desktop and responsiveImages.mobile
```

## Usage Examples

### Basic Usage

```typescript
import type { CollectionConfig } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    imageField('featuredImage', {
      required: true,
      admin: {
        description: 'Main product image',
      },
    }),
  ],
}
```

### Multiple Media Types

```typescript
import { imageField, videoField } from '@/lib/payload/fields'

fields: [
  imageField('thumbnail'),
  videoField('backgroundVideo', {
    required: false,
    admin: {
      description: 'Optional hero background video',
    },
  }),
]
```

### Image Gallery

```typescript
import { mediaArrayField } from '@/lib/payload/fields'

fields: [
  mediaArrayField('productGallery', {
    minRows: 1,
    maxRows: 8,
    admin: {
      description: 'Product images (first image is primary)',
    },
  })
]
```

### Responsive Images

```typescript
import { responsiveImageGroup } from '@/lib/payload/fields'

fields: [
  responsiveImageGroup('Hero Images')
]
// User will see:
// - responsiveImages.desktop
// - responsiveImages.mobile
```

### Advanced: Conditional Fields

```typescript
import { imageField } from '@/lib/payload/fields'

fields: [
  {
    name: 'mediaType',
    type: 'select',
    options: ['image', 'video'],
  },
  imageField('image', {
    admin: {
      condition: (data) => data.mediaType === 'image',
    },
  }),
]
```

### Advanced: With maxDepth

```typescript
import { imageField } from '@/lib/payload/fields'

// In variations array - prevent deep fetching for performance
{
  name: 'variations',
  type: 'array',
  fields: [
    imageField('image', {
      maxDepth: 0, // Only fetch ID, not full media object
    }),
  ],
}
```

## Collections Updated

The following collections have been updated to use the new media field factories:

| Collection | Fields Updated | Factory Used |
|-----------|----------------|--------------|
| **Products** | `variations[].image`, `seo.ogImage` | `imageField()` |
| **Posts** | `featuredImage`, `seo.ogImage` | `imageField()` |
| **Storefronts** | `backgroundVideo`, `news[].image`, `testimonials.customerPhoto`, `testimonials.videoTestimonial`, `seo.openGraphImage` | `imageField()`, `videoField()` |

## User Experience

### For Content Editors

When editing a document with an upload field that uses the custom media picker:

1. **Browse Media Library** button appears above the upload area
2. Click to open the media library in selection mode
3. Navigate folders, search, or filter media
4. Click on desired media to select it
5. Click "Select This Media" button
6. Modal closes and field is populated with selected media
7. **OR** skip the library and upload new files directly via drag-drop

### Selection Mode Features

When MediaManager opens in selection mode:

- **Title**: Changes to "Select Media"
- **Badge**: "Selection Mode" indicator
- **Select Button**: Prominent "Select This Media" button
- **Edit Metadata**: Edit button available to update media details before selecting
- **Simplified UI**: Move button is hidden (selection-focused workflow)
- **Focus**: Clearer focus on media selection workflow

## Benefits

### For Developers

✅ **Consistent API** - All upload fields use the same pattern
✅ **Less Code** - Field factories eliminate repetition
✅ **Type Safety** - Full TypeScript support
✅ **Easy to Extend** - Add new field types by wrapping `mediaField()`
✅ **Performance** - Built-in `maxDepth` control

### For Content Editors

✅ **Better UX** - Choose from existing media OR upload new
✅ **No Duplicates** - Easier to reuse existing media
✅ **Organized** - Browse folders and search
✅ **Metadata** - All media has proper alt text, captions, etc.
✅ **Fast** - Selection is instant, no re-upload needed

## Future Enhancements

Potential improvements to consider:

- **Multi-select mode**: Select multiple media items at once
- **MIME type filtering**: Filter by image/video/audio in selection mode
- **Recently used**: Quick access to recently uploaded media
- **Favorites**: Star/favorite frequently used media
- **Drag-to-reorder**: Reorder selected media in arrays
- **Preview pane**: Larger preview when hovering over media

## API Reference

### MediaManagerProvider

```typescript
const {
  openModal,      // (options?) => void
  closeModal,     // () => void
  isOpen,         // boolean
  modalOptions,   // MediaManagerModalOptions | null
} = useMediaManager()
```

### MediaSelectorButton Props

No props required - automatically integrates with Payload's field context via `useField()` hook.

### Field Factory Options

All field factories accept standard Payload `UploadField` options:

- `required`: boolean
- `admin`: Field admin config
  - `description`: string
  - `condition`: (data, siblingData) => boolean
  - `readOnly`: boolean
- `filterOptions`: Query constraints for media
- `maxDepth`: number (0 for ID only, 1+ for populated object)
- `localized`: boolean
- `access`: Field-level access control

## Troubleshooting

### Error: "useMediaManager must be used within MediaManagerProvider"

**Cause**: The `MediaSelectorButton` is trying to use the `useMediaManager()` hook, but it's not wrapped in the `MediaManagerProvider`.

**Solution**: Ensure `AdminRootProvider` is registered in `payload.config.ts`:
```typescript
admin: {
  components: {
    providers: ['/components/admin/AdminRootProvider#AdminRootProvider'],
  }
}
```

**Verification**:
1. Check `payload.config.ts` has `providers` array
2. Restart development server (`bun run dev`)
3. Clear browser cache if needed

### Button doesn't appear

Check that:
1. Field uses `imageField()`, `videoField()`, or `mediaField()`
2. Import is correct: `import { imageField } from '@/lib/payload/fields'`
3. Collection is saved and server restarted
4. `AdminRootProvider` is registered (see above)

### Selection doesn't update field

Verify:
1. `MediaSelectorButton` is properly registered in `beforeInput`
2. No errors in browser console
3. `AdminRootProvider` is providing `MediaManagerProvider`
4. Field is an upload field with `relationTo: 'media'`

### TypeScript errors

Ensure:
1. `bun run build` has been run to generate types
2. Imports use correct paths: `@/lib/payload/fields`
3. Field options match `UploadField` type
4. No circular dependencies in imports

## Migration Guide

### Updating Existing Fields

**Before**:
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Main image',
  },
}
```

**After**:
```typescript
import { imageField } from '@/lib/payload/fields'

imageField('featuredImage', {
  admin: {
    description: 'Main image',
  },
})
```

### Adding to New Collections

```typescript
import type { CollectionConfig } from 'payload'
import { imageField, videoField, mediaArrayField } from '@/lib/payload/fields'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  fields: [
    imageField('thumbnail', { required: true }),
    videoField('backgroundVideo'),
    mediaArrayField('gallery', { maxRows: 10 }),
  ],
}
```

## Technical Details

### How beforeInput Works

Payload's `beforeInput` component slot:
1. Renders BEFORE the main field input
2. Receives field context via `useField()` hook
3. Can modify field value via `setValue()`
4. Shares same validation/state as main field

### State Flow

```
User clicks "Browse Media Library"
  ↓
MediaSelectorButton calls openModal({ mode: 'select', onSelect })
  ↓
MediaManagerProvider updates state with modalOptions
  ↓
MediaManagerModal reads modalOptions and shows selection UI
  ↓
User selects media and clicks "Select This Media"
  ↓
Modal calls onSelect(media) callback
  ↓
Callback calls setValue(media.id) from useField()
  ↓
Payload updates field value and validation
  ↓
Modal closes via closeModal()
```

### Performance Considerations

- **maxDepth: 0** - Use in arrays to prevent deep fetching
- **filterOptions** - Reduce query results with MIME type filtering
- **Pagination** - Media library is paginated (24 items per page)
- **Lazy loading** - Modal content only loads when opened

## Related Files

- `src/components/admin/AdminRootProvider.tsx` - **Root provider (wraps entire admin UI)**
- `src/components/admin/media-manager/types.ts` - Type definitions
- `src/components/admin/media-manager/MediaManagerProvider.tsx` - Context provider
- `src/components/admin/media-manager/MediaManagerModal.tsx` - Modal component
- `src/components/admin/media-manager/MediaManager.tsx` - Dashboard component
- `src/components/admin/MediaSelectorButton.tsx` - Field component
- `src/lib/payload/fields/media.ts` - Field factories
- `src/lib/payload/fields/index.ts` - Barrel exports
- `src/collections/Media.ts` - Media collection config
- `src/payload.config.ts` - Payload configuration (providers registration)
