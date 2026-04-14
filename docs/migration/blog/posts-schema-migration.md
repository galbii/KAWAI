# Posts Collection Schema Migration Plan

**Phase 2.2 of Blog Migration: Orca-Web → KAWAI**

---

## Executive Summary

This document provides a comprehensive, step-by-step plan for migrating the KAWAI Posts collection schema from its current state to adopt proven patterns from the orca-web template. This is a **planning document only** - no implementation should occur until this plan is approved and understood.

**Migration Type**: Schema Evolution with Backward Compatibility
**Risk Level**: Medium-High (database schema changes required)
**Estimated Duration**: 2-3 days implementation + 1 day testing
**Rollback Complexity**: Medium (requires database backup restoration)

---

## Table of Contents

1. [Schema Comparison](#schema-comparison)
2. [Field-by-Field Migration Plan](#field-by-field-migration-plan)
3. [Backward Compatibility Strategy](#backward-compatibility-strategy)
4. [Risk Assessment](#risk-assessment)
5. [Implementation Order](#implementation-order)
6. [Data Migration Scripts](#data-migration-scripts)
7. [Rollback Plan](#rollback-plan)
8. [Testing Strategy](#testing-strategy)
9. [Success Criteria](#success-criteria)

---

## Schema Comparison

### High-Level Differences

| Feature | KAWAI (Current) | Orca-Web (Target) | Action |
|---------|-----------------|-------------------|--------|
| **Author Field** | Single relationship (`author`) | Multiple relationships (`authors` + `populatedAuthors`) | Add hasMany, keep old field temporarily |
| **Categories** | Select field (hardcoded options) | Relationship to Categories collection | Add relationship field, keep select temporarily |
| **Related Posts** | Not present | Self-referential relationship | Add new field |
| **Hero Image** | `featuredImage` | `heroImage` | Rename or alias |
| **Access Control** | Custom function | `authenticated` + `authenticatedOrPublished` utilities | Adopt utilities |
| **Slug Generation** | Manual hook | `slugField()` helper from Payload | Adopt helper |
| **Content Blocks** | Separate `contentBlocks` field | Integrated into `content` richText via `BlocksFeature` | Keep both approaches (KAWAI has complex blocks) |
| **Rich Text Blocks** | No Banner/Code in richText | Banner + Code blocks in richText | Add blocks to richText |
| **Status Field** | Custom select (draft/published/scheduled/archived) | Drafts plugin (`_status` field) | Keep custom (more statuses), consider drafts plugin later |
| **Publishing** | `publishedDate` field + manual hook | `publishedAt` field + hook | Rename field |
| **Tabs Structure** | Content / Settings / SEO | Content / Meta / SEO | Reorganize tabs |
| **SEO Fields** | Custom `seo` group | SEO plugin fields in `meta` | Optional: Adopt SEO plugin (Phase 4) |
| **Admin Columns** | `['title', 'author', 'status', 'publishedDate', 'updatedAt']` | `['title', 'slug', 'updatedAt']` | Update columns |
| **defaultPopulate** | Not configured | Configured for performance | Add configuration |
| **Versions** | Not enabled | Drafts with autosave + schedulePublish | Add drafts support |

---

## Field-by-Field Migration Plan

### 1. Author Field: Single → Multiple Authors

#### Current State (KAWAI)
```typescript
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  required: true,
  admin: {
    description: 'Post author',
    position: 'sidebar',
  },
}
```

#### Target State (Orca-Web)
```typescript
// Visible field
{
  name: 'authors',
  type: 'relationship',
  relationTo: 'users',
  hasMany: true,
  admin: {
    position: 'sidebar',
  },
}

// Hidden field for privacy-conscious population
{
  name: 'populatedAuthors',
  type: 'array',
  access: {
    update: () => false,
  },
  admin: {
    disabled: true,
    readOnly: true,
  },
  fields: [
    { name: 'id', type: 'text' },
    { name: 'name', type: 'text' },
  ],
}
```

#### Migration Steps
1. **Add new field** `authors` (hasMany relationship)
2. **Keep old field** `author` temporarily (mark as deprecated in UI)
3. **Add** `populatedAuthors` hidden array field
4. **Create migration hook** to sync `author` → `authors[0]` on save
5. **Add** `populateAuthors` afterRead hook
6. **Update frontend** to use `populatedAuthors` instead of raw `author`
7. **After migration complete** (all posts migrated), remove old `author` field

#### Why Multiple Authors?
- **Flexibility**: Blog posts can have co-authors
- **Privacy**: `populatedAuthors` hides sensitive user data (email, password hash)
- **Security**: Users collection has restricted access control

#### Backward Compatibility
```typescript
// Transition period: Sync old field to new field
hooks: {
  beforeChange: [
    async ({ data, operation, context }) => {
      // Prevent infinite loop
      if (context.skipAuthorSync) return data

      // If old 'author' field is set, sync to 'authors' array
      if (data.author && (!data.authors || data.authors.length === 0)) {
        data.authors = [data.author]
      }

      // If 'authors' is set, sync first author back to 'author' for backward compat
      if (data.authors && data.authors.length > 0 && !data.author) {
        data.author = data.authors[0]
      }

      return data
    }
  ]
}
```

---

### 2. Categories: Select → Relationship

#### Current State (KAWAI)
```typescript
{
  name: 'categories',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'Piano Education', value: 'education' },
    { label: 'Product News', value: 'product-news' },
    { label: 'Artist Spotlights', value: 'artists' },
    { label: 'Maintenance & Care', value: 'maintenance' },
    { label: 'Buying Guides', value: 'buying-guides' },
    { label: 'Events', value: 'events' },
    { label: 'Company News', value: 'company-news' },
    { label: 'Technology', value: 'technology' },
  ],
}
```

#### Target State (Orca-Web)
```typescript
{
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  admin: {
    position: 'sidebar',
  },
}
```

#### Migration Steps
1. **Create Categories collection** (see Phase 1.1 of main migration plan)
2. **Seed Categories collection** with existing values from select options
3. **Rename current field** to `categories_old` (temporary)
4. **Add new field** `categories` as relationship
5. **Create migration script** to convert:
   - `categories_old: ['education', 'product-news']`
   - → `categories: [categoryId1, categoryId2]`
6. **Test migration** in dev environment
7. **After migration complete**, remove `categories_old` field

#### Why Relationship?
- **Dynamic Management**: Add/edit categories without code changes
- **SEO per Category**: Each category can have its own metadata, slug, description
- **Nested Categories**: Future support for category hierarchies
- **Icons/Images**: Categories can have visual elements

#### Data Transformation
```typescript
// Migration script pseudocode
const categoryMap = {
  'education': '<category-id-1>',
  'product-news': '<category-id-2>',
  'artists': '<category-id-3>',
  'maintenance': '<category-id-4>',
  'buying-guides': '<category-id-5>',
  'events': '<category-id-6>',
  'company-news': '<category-id-7>',
  'technology': '<category-id-8>',
}

// For each post
post.categories = post.categories_old.map(slug => categoryMap[slug])
```

---

### 3. Related Posts: Add Self-Referential Relationship

#### Current State (KAWAI)
Not present.

#### Target State (Orca-Web)
```typescript
{
  name: 'relatedPosts',
  type: 'relationship',
  relationTo: 'posts',
  hasMany: true,
  filterOptions: ({ id }) => {
    return {
      id: {
        not_in: [id],
      },
    }
  },
  admin: {
    position: 'sidebar',
  },
}
```

#### Migration Steps
1. **Add new field** `relatedPosts` to Posts collection
2. **No data migration needed** (new field, defaults to empty)
3. **Update frontend** `/blog/[slug]/page.tsx` to display related posts section
4. **Create RelatedPosts component** to render related posts

#### Why Related Posts?
- **User Engagement**: Keeps readers on site longer
- **SEO**: Internal linking improves page authority
- **Content Discovery**: Surfaces relevant content

#### filterOptions Explanation
```typescript
filterOptions: ({ id }) => ({
  id: { not_in: [id] }
})
```
- Prevents a post from being related to itself
- `id` is the current post being edited
- `not_in` excludes the current post from the dropdown

---

### 4. Hero Image: Rename featuredImage → heroImage

#### Current State (KAWAI)
```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Featured image for post header and social sharing',
  },
}
```

#### Target State (Orca-Web)
```typescript
{
  name: 'heroImage',
  type: 'upload',
  relationTo: 'media',
}
```

#### Migration Steps

**Option A: Rename Field (Requires Data Migration)**
1. Add new field `heroImage`
2. Create migration script to copy `featuredImage` → `heroImage`
3. Keep `featuredImage` temporarily for backward compat
4. Update all frontend references
5. Remove `featuredImage` after migration

**Option B: Keep Both Names (Aliasing)**
1. Keep `featuredImage` as primary field
2. Add virtual field `heroImage` that returns `featuredImage`
3. No data migration needed
4. Frontend can use either name

**Recommendation: Option B (Keep featuredImage)**
- **Lower risk**: No database migration
- **Semantic clarity**: "Featured image" is clearer for blog posts
- **No breaking changes**: Existing data works as-is

#### Decision
**Keep `featuredImage`** - The name is semantically appropriate for blog posts. Orca-web uses `heroImage` for pages/landing pages, but `featuredImage` is more conventional for blog posts.

**Action**: No change needed.

---

### 5. Access Control: Custom → Utilities

#### Current State (KAWAI)
```typescript
access: {
  read: ({ req: { user } }) => {
    // Public can only read published posts
    if (!user) {
      return {
        status: {
          equals: 'published',
        },
      }
    }
    // Admins can read all posts
    return true
  },
}
```

#### Target State (Orca-Web)
```typescript
access: {
  create: authenticated,
  read: authenticatedOrPublished,
  update: authenticated,
  delete: authenticated,
}
```

#### Migration Steps
1. **Create access utilities** in `src/lib/payload/access/index.ts`:
   ```typescript
   export const authenticated = ({ req: { user } }) => Boolean(user)
   export const authenticatedOrPublished = ({ req: { user } }) => {
     if (user) return true
     return { _status: { equals: 'published' } }
   }
   ```
2. **Update Posts collection** to import and use utilities
3. **Add missing access controls** (create, update, delete)

#### Why Utilities?
- **Reusability**: Use across collections
- **Consistency**: Standardized security patterns
- **Maintainability**: Change once, apply everywhere
- **Testability**: Easier to unit test

#### Difference: `status` vs `_status`
- **KAWAI Current**: Uses custom `status` field
- **Orca-Web**: Uses Payload drafts plugin with `_status` field
- **Action**: Keep custom `status` field for now (has more statuses: scheduled, archived)
- **Update access control** to check `status` field:
  ```typescript
  export const authenticatedOrPublished = ({ req: { user } }) => {
    if (user) return true
    return { status: { equals: 'published' } } // KAWAI-specific
  }
  ```

---

### 6. Slug Generation: Manual Hook → slugField()

#### Current State (KAWAI)
```typescript
{
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
}

// Manual hook
hooks: {
  beforeChange: [
    async ({ data }) => {
      if (data.title && !data.slug) {
        data.slug = data.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      }
      return data
    }
  ]
}
```

#### Target State (Orca-Web)
```typescript
import { slugField } from 'payload'

// In fields array
slugField()
```

#### Migration Steps
1. **Remove manual slug field** definition
2. **Remove beforeChange hook** for slug generation
3. **Add** `import { slugField } from 'payload'`
4. **Add** `slugField()` to fields array (outside of tabs)
5. **No data migration needed** (existing slugs remain valid)

#### Why slugField()?
- **Built-in functionality**: Auto-generates from `title` or `name`
- **Uniqueness validation**: Handles uniqueness checking
- **Customizable**: Can specify source field, format, overrides
- **Less code**: Replaces ~10 lines of hook code

#### slugField() Options
```typescript
slugField({
  fieldToUse: 'title',    // Source field (default: 'title' or 'name')
  overwrite: false,       // Allow manual edits
  // Position can be set if needed
})
```

---

### 7. Content Blocks: Separate Field + RichText Blocks

#### Current State (KAWAI)
```typescript
// Rich text content (no blocks)
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor(),
}

// Separate blocks field
{
  name: 'contentBlocks',
  type: 'blocks',
  blocks: [], // References: image, text, video, spacer, divider, columns
}
```

#### Target State (Orca-Web)
```typescript
{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HorizontalRuleFeature(),
    ],
  }),
}
```

#### Migration Steps

**Keep Both Approaches** (KAWAI has unique needs)

1. **Add blocks to richText** via `BlocksFeature`:
   - Banner block (info, warning, error, success)
   - Code block (syntax highlighting)
   - MediaBlock (images within content)

2. **Keep contentBlocks field** for complex layouts:
   - Columns layouts
   - Product showcases
   - Complex multi-media sections

3. **Reasoning**:
   - RichText blocks: Inline content (callouts, code snippets, images)
   - contentBlocks: Page builder for complex layouts
   - Both serve different purposes

#### Why Both?
- **RichText Blocks**: Embedded within prose (Banner callout mid-paragraph)
- **Content Blocks**: Full-width, complex layouts (2-column product comparison)
- **Flexibility**: Authors choose the right tool for each section

---

### 8. Publishing: publishedDate → publishedAt

#### Current State (KAWAI)
```typescript
{
  name: 'publishedDate',
  type: 'date',
  admin: {
    description: 'Published date (auto-set on first publish)',
  },
}

// Hook
hooks: {
  beforeChange: [
    ({ data }) => {
      if (data.status === 'published' && !data.publishedDate) {
        data.publishedDate = new Date().toISOString()
      }
      return data
    }
  ]
}
```

#### Target State (Orca-Web)
```typescript
{
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData._status === 'published' && !value) {
          return new Date()
        }
        return value
      },
    ],
  },
}
```

#### Migration Steps

**Option A: Rename Field**
1. Add new field `publishedAt`
2. Create migration script to copy `publishedDate` → `publishedAt`
3. Keep both temporarily
4. Update frontend to use `publishedAt`
5. Remove `publishedDate`

**Option B: Keep publishedDate**
1. Update hook to use field-level `beforeChange` (cleaner)
2. No migration needed

**Recommendation: Option B**
- No breaking changes
- Same functionality
- Adopt field-level hook pattern

#### Improved Hook (Field-Level)
```typescript
{
  name: 'publishedDate',
  type: 'date',
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData.status === 'published' && !value) {
          return new Date()
        }
        return value
      },
    ],
  },
}
```

---

### 9. Admin Configuration: Columns & defaultPopulate

#### Current State (KAWAI)
```typescript
admin: {
  defaultColumns: ['title', 'author', 'status', 'publishedDate', 'updatedAt'],
  // No defaultPopulate
}
```

#### Target State (Orca-Web)
```typescript
admin: {
  defaultColumns: ['title', 'slug', 'updatedAt'],
}

defaultPopulate: {
  title: true,
  slug: true,
  categories: true,
  meta: {
    image: true,
    description: true,
  },
}
```

#### Migration Steps
1. **Update defaultColumns**:
   - Remove `author`, `status`, `publishedDate` (keep list clean)
   - Keep `title`, `slug`, `updatedAt`
   - Optional: Add `status` back if useful

2. **Add defaultPopulate**:
   - Defines what's populated when post is referenced elsewhere
   - Improves performance by avoiding over-fetching
   - Type-safe when using `CollectionConfig<'posts'>`

#### Why defaultPopulate?
When posts are referenced in relationships (e.g., `relatedPosts`), Payload auto-populates fields. By default, it populates everything (depth: 2). `defaultPopulate` limits this to only what's needed.

**Example**:
```typescript
// Without defaultPopulate: Fetches all fields (slow)
const page = await payload.find({
  collection: 'pages',
  depth: 2, // Posts fully populated
})

// With defaultPopulate: Only fetches specified fields
defaultPopulate: {
  title: true,
  slug: true,
  categories: true,
}
```

---

### 10. Versions: Add Drafts Support

#### Current State (KAWAI)
Not present.

#### Target State (Orca-Web)
```typescript
versions: {
  drafts: {
    autosave: {
      interval: 100, // Milliseconds (optimal for live preview)
    },
    schedulePublish: true,
  },
  maxPerDoc: 50,
}
```

#### Migration Steps
1. **Add versions config** to Posts collection
2. **Enable drafts with autosave** (every 100ms for live preview)
3. **Enable schedulePublish** (posts can be scheduled for future publish)
4. **Set maxPerDoc** to 50 (prevents database bloat)
5. **Decide on status field**:
   - Option A: Keep custom `status` field + drafts (two systems)
   - Option B: Replace custom `status` with `_status` from drafts plugin

**Recommendation: Keep Custom Status (For Now)**

KAWAI has more statuses than drafts plugin:
- draft
- published
- scheduled (already implemented)
- archived

Orca-web only uses:
- draft (via `_status: 'draft'`)
- published (via `_status: 'published'`)

**Action**: Add versions/drafts, but keep custom `status` field. They serve different purposes:
- `_status`: Payload versioning/preview system
- `status`: Business logic (archived, scheduled)

---

### 11. Hooks: Revalidation & Author Population

#### Current State (KAWAI)
```typescript
hooks: {
  beforeChange: [
    // Slug generation
    // publishedDate auto-set
  ],
  afterChange: [
    // ISR revalidation (fetch to /api/revalidate)
    // Context flag: skipRevalidation
  ],
}
```

#### Target State (Orca-Web)
```typescript
hooks: {
  afterChange: [revalidatePost],
  afterRead: [populateAuthors],
  afterDelete: [revalidateDelete],
}
```

#### Migration Steps

**1. Adopt Cleaner Revalidation Pattern**

Current (KAWAI):
```typescript
afterChange: [
  async ({ doc, req, context }) => {
    if (context.skipRevalidation) return doc

    // Fire-and-forget fetch to /api/revalidate
    fetch(revalidateUrl, { /* ... */ })
      .then(/* ... */)
      .catch(/* ... */)

    return doc
  }
]
```

Target (Orca-Web):
```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

afterChange: [
  ({ doc, previousDoc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      if (doc._status === 'published') {
        revalidatePath(`/posts/${doc.slug}`)
        revalidateTag('posts-sitemap')
      }
    }
    return doc
  }
]
```

**Differences**:
- Orca-web uses Next.js native `revalidatePath()` (server-side only)
- KAWAI uses fetch to `/api/revalidate` (works from CMS hooks)
- Context flag: `skipRevalidation` vs `disableRevalidate`

**Decision**: Keep KAWAI's fetch approach (more flexible), but adopt cleaner context flag name.

**2. Add populateAuthors Hook**

```typescript
import { populateAuthors } from './hooks/populateAuthors'

hooks: {
  afterRead: [populateAuthors],
}
```

**3. Add revalidateDelete Hook**

Currently missing in KAWAI. When a post is deleted, its page should be revalidated.

```typescript
afterDelete: [
  async ({ doc, context }) => {
    if (context.skipRevalidation) return doc

    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      body: JSON.stringify({
        secret: process.env.REVALIDATION_SECRET,
        path: `/blog/${doc.slug}`,
      }),
    })

    return doc
  }
]
```

---

### 12. Tab Structure: Content / Settings / SEO → Content / Meta / SEO

#### Current State (KAWAI)
```typescript
{
  type: 'tabs',
  tabs: [
    {
      label: 'Content',
      fields: [
        // title, slug, excerpt, featuredImage, content, contentBlocks
      ],
    },
    {
      label: 'Settings',
      fields: [
        // author, categories, tags, status, publishedDate, featured
      ],
    },
    {
      label: 'SEO',
      fields: [
        // seo group
      ],
    },
  ],
}
```

#### Target State (Orca-Web)
```typescript
// title outside of tabs (shown in header)
{ name: 'title', type: 'text', required: true },

{
  type: 'tabs',
  tabs: [
    {
      label: 'Content',
      fields: [
        // heroImage, content
      ],
    },
    {
      label: 'Meta',
      fields: [
        // relatedPosts, categories (sidebar)
      ],
    },
    {
      name: 'meta',
      label: 'SEO',
      fields: [
        // SEO plugin fields
      ],
    },
  ],
}

// publishedAt, authors outside tabs (sidebar)
```

#### Migration Steps

**Reorganization Strategy**:

1. **Move `title` outside tabs** (always visible)
2. **Rename "Settings" → "Meta"** (clearer purpose)
3. **Move sidebar fields outside tabs**:
   - `authors` (outside tabs, sidebar)
   - `publishedDate` (outside tabs, sidebar)
   - `status` (outside tabs, sidebar)
   - `featured` (outside tabs, sidebar)
4. **Content tab**: Visual content only
   - `slug`
   - `excerpt`
   - `featuredImage`
   - `content`
   - `contentBlocks`
5. **Meta tab**: Taxonomies and relationships
   - `categories`
   - `tags`
   - `relatedPosts`
6. **SEO tab**: SEO fields
   - Keep existing `seo` group

#### Why Reorganize?
- **Cleaner UI**: Sidebar fields always visible (no tab switching)
- **Logical grouping**: Content vs metadata vs SEO
- **Better UX**: Most-used fields in sidebar

---

## Backward Compatibility Strategy

### Phase 1: Additive Changes (No Breaking Changes)

**Principle**: Add new fields, keep old fields temporarily

1. **Add new fields** alongside old fields:
   - `authors` (keep `author`)
   - `categories` relationship (keep `categories` select as `categories_old`)
   - `relatedPosts` (new, no conflict)
   - `populatedAuthors` (new, hidden)

2. **Sync old → new in hooks**:
   ```typescript
   beforeChange: [
     ({ data, context }) => {
       if (context.skipSync) return data

       // Sync author → authors
       if (data.author && !data.authors) {
         data.authors = [data.author]
       }

       return data
     }
   ]
   ```

3. **Update frontend to read new fields** but keep old fields as fallback:
   ```typescript
   // Frontend component
   const authors = post.populatedAuthors || [post.author]
   const categories = post.categories || post.categories_old
   ```

### Phase 2: Data Migration

**Execute migration scripts in dev environment first**

1. **Backup database** (mandatory):
   ```bash
   mongodump --uri="$DATABASE_URI" --out=./backup-$(date +%Y%m%d)
   ```

2. **Run migration scripts**:
   - Convert `author` → `authors`
   - Convert `categories` select → category IDs
   - Test thoroughly

3. **Deploy to production**:
   - Run migration script
   - Monitor for errors
   - Keep old fields temporarily

### Phase 3: Deprecation

**After migration is stable (1-2 weeks)**

1. **Remove old fields** from schema:
   - `author`
   - `categories_old`

2. **Remove sync hooks**

3. **Update frontend** to only use new fields

### Context Flags to Prevent Loops

```typescript
// Example: Author sync hook
beforeChange: [
  async ({ data, req, context }) => {
    if (context.skipAuthorSync) return data

    // Perform sync
    if (data.author) {
      await req.payload.update({
        collection: 'posts',
        id: data.id,
        data: { authors: [data.author] },
        context: { skipAuthorSync: true }, // Prevent loop
      })
    }

    return data
  }
]
```

**Critical**: Always use context flags when hooks trigger other hooks.

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Database schema migration fails** | **Critical** | Low | Full database backup before migration; test in dev first |
| **Data loss during category conversion** | **High** | Low | Keep `categories_old` field as backup; verify migration script output |
| **Breaking existing blog post pages** | **High** | Medium | Gradual migration; keep old fields temporarily; comprehensive testing |
| **Infinite hook loops (author/category sync)** | **Medium** | Medium | Use context flags; thorough testing of hook chains |
| **populateAuthors hook performance impact** | **Medium** | Low | Caching; limit to published posts; monitor performance |
| **Frontend rendering errors (new schema)** | **Medium** | Medium | Fallback to old fields; error boundaries; gradual rollout |
| **slugField() conflicts with existing slugs** | **Low** | Low | Keep existing slugs; slugField() only generates for new posts |
| **Drafts plugin conflicts with custom status** | **Low** | Low | Keep both systems; they serve different purposes |
| **Categories collection seed data errors** | **Low** | Low | Manual verification of seeded data; rollback capability |
| **Related posts circular references** | **Low** | Very Low | filterOptions prevents self-reference; test edge cases |

### High-Risk Changes

1. **Categories: Select → Relationship**
   - **Why Risky**: Requires data transformation
   - **Mitigation**: Keep old field, test migration script thoroughly
   - **Rollback**: Revert to `categories_old` field

2. **Author: Single → Multiple**
   - **Why Risky**: Changes data structure
   - **Mitigation**: Sync hooks, keep old field temporarily
   - **Rollback**: Remove `authors` field, use `author`

3. **Tab Reorganization**
   - **Why Risky**: Could confuse content editors
   - **Mitigation**: Training, documentation, gradual rollout
   - **Rollback**: Revert schema to old tab structure

### Medium-Risk Changes

1. **populateAuthors Hook**
   - **Why Risky**: Adds database queries on every read
   - **Mitigation**: Optimize query, add caching
   - **Rollback**: Remove hook, use raw author data

2. **slugField() Adoption**
   - **Why Risky**: Changes slug generation logic
   - **Mitigation**: Keep existing slugs, only affects new posts
   - **Rollback**: Revert to manual slug field + hook

### Low-Risk Changes

1. **Add relatedPosts**
   - **Why Low Risk**: New field, no existing data
   - **Mitigation**: None needed
   - **Rollback**: Remove field

2. **Add access control utilities**
   - **Why Low Risk**: Additive change, no data impact
   - **Mitigation**: None needed
   - **Rollback**: Revert to inline functions

3. **Add content blocks to richText**
   - **Why Low Risk**: Additive change, no data impact
   - **Mitigation**: None needed
   - **Rollback**: Remove BlocksFeature from config

---

## Implementation Order

### Step-by-Step Execution Plan

#### Prerequisites (Before Starting)

- [ ] **Full database backup** (MongoDB)
- [ ] **Create feature branch**: `feature/posts-schema-migration`
- [ ] **Set up dev environment** with copy of production data
- [ ] **Review and approve this migration plan**
- [ ] **Notify team** of upcoming schema changes

---

#### Phase 1: Additive Changes (Day 1 - Morning)

**Goal**: Add new fields without breaking existing functionality

1. **Create access control utilities**
   - [ ] Create `src/lib/payload/access/index.ts`
   - [ ] Add `authenticated` function
   - [ ] Add `authenticatedOrPublished` function (KAWAI-specific: checks `status`, not `_status`)
   - [ ] Export both functions

2. **Add new fields to Posts collection** (keep old fields):
   - [ ] Add `authors` relationship (hasMany: true)
   - [ ] Rename `categories` → `categories_old`
   - [ ] Add new `categories` relationship field
   - [ ] Add `relatedPosts` relationship
   - [ ] Add `populatedAuthors` hidden array field
   - [ ] Mark old fields with admin descriptions: "DEPRECATED: Migrate to new field"

3. **Import and use access utilities**:
   - [ ] Update `access` config to use utilities
   - [ ] Test access control behavior

4. **Deploy to dev environment**:
   - [ ] `bun run build` (generates types)
   - [ ] Verify admin UI loads without errors
   - [ ] Test creating a new post with new fields

---

#### Phase 2: Create Categories Collection (Day 1 - Afternoon)

**Goal**: Set up Categories collection and seed data

1. **Create Categories collection**:
   - [ ] Create `src/collections/Categories.ts`
   - [ ] Copy structure from orca-web
   - [ ] Use `slugField()`
   - [ ] Add to `payload.config.ts` collections array

2. **Create category seed script**:
   - [ ] Create `scripts/seed-categories.ts`
   - [ ] Map KAWAI's current category options to new collection
   - [ ] Run seed script: `bun run seed-categories`

3. **Verify Categories collection**:
   - [ ] Check admin UI: `/admin/collections/categories`
   - [ ] Verify all 8 categories exist with correct slugs
   - [ ] Test creating/editing categories

---

#### Phase 3: Add Hooks (Day 1 - Evening)

**Goal**: Add author population and improved revalidation

1. **Create populateAuthors hook**:
   - [ ] Create `src/collections/Posts/hooks/populateAuthors.ts`
   - [ ] Copy implementation from orca-web
   - [ ] Add to Posts collection `afterRead` hook
   - [ ] Test: Verify `populatedAuthors` is populated on read

2. **Add revalidateDelete hook**:
   - [ ] Add to Posts collection `afterDelete` hook
   - [ ] Test: Delete a post, verify ISR revalidation

3. **Improve beforeChange hook**:
   - [ ] Move `publishedDate` logic to field-level hook
   - [ ] Keep slug generation logic (or adopt `slugField()` - see Phase 4)
   - [ ] Test: Publish a draft, verify `publishedDate` is set

---

#### Phase 4: Data Migration Preparation (Day 2 - Morning)

**Goal**: Create and test migration scripts

1. **Create author migration script**:
   - [ ] Create `scripts/migrate-author-to-authors.ts`
   - [ ] Script logic: `authors = [author]` for all posts
   - [ ] Add flag: `--dry-run` to preview changes
   - [ ] Run with `--dry-run`, verify output

2. **Create category migration script**:
   - [ ] Create `scripts/migrate-categories.ts`
   - [ ] Build mapping: `{ 'education': categoryId1, ... }`
   - [ ] Script logic: Replace select values with category IDs
   - [ ] Add flag: `--dry-run`
   - [ ] Run with `--dry-run`, verify output

3. **Test migration scripts in dev**:
   - [ ] Restore dev database from production backup
   - [ ] Run author migration (without `--dry-run`)
   - [ ] Run category migration (without `--dry-run`)
   - [ ] Verify data integrity:
     - [ ] All posts have `authors` array
     - [ ] All posts have `categories` relationships
     - [ ] No data loss
   - [ ] Test frontend rendering with migrated data

---

#### Phase 5: Frontend Updates (Day 2 - Afternoon)

**Goal**: Update frontend to use new fields (with fallbacks)

1. **Update blog post page** (`/blog/[slug]/page.tsx`):
   - [ ] Use `populatedAuthors` instead of raw `author`:
     ```typescript
     const authors = post.populatedAuthors || (post.author ? [post.author] : [])
     ```
   - [ ] Use `categories` relationship instead of select:
     ```typescript
     const categories = post.categories || post.categories_old || []
     ```
   - [ ] Test: Verify posts render correctly with old and new data

2. **Update blog list page** (`/blog/page.tsx`):
   - [ ] Update filters to use Categories collection
   - [ ] Test: Verify category filtering works

3. **Add RelatedPosts component**:
   - [ ] Create `src/components/blog/RelatedPosts.tsx`
   - [ ] Add to blog post page
   - [ ] Test: Verify related posts display (if set)

---

#### Phase 6: Optional Enhancements (Day 2 - Evening)

**Goal**: Adopt advanced features from orca-web

1. **Adopt slugField() helper**:
   - [ ] Remove manual `slug` field definition
   - [ ] Remove slug generation from `beforeChange` hook
   - [ ] Add `import { slugField } from 'payload'`
   - [ ] Add `slugField()` to fields array
   - [ ] Test: Create new post, verify slug auto-generates

2. **Add defaultPopulate**:
   - [ ] Add `defaultPopulate` config to Posts collection
   - [ ] Specify: `title`, `slug`, `categories`, `meta`
   - [ ] Test: Verify relationships populate efficiently

3. **Add versions/drafts**:
   - [ ] Add `versions` config to Posts collection
   - [ ] Enable `drafts.autosave` (interval: 100)
   - [ ] Enable `drafts.schedulePublish`
   - [ ] Test: Create draft, verify autosave works
   - [ ] Test: Schedule a post for future publish

4. **Reorganize tabs** (Optional):
   - [ ] Move `title` outside tabs
   - [ ] Rename "Settings" → "Meta"
   - [ ] Move sidebar fields outside tabs
   - [ ] Test: Verify admin UI is usable

---

#### Phase 7: Production Deployment (Day 3)

**Goal**: Deploy to production with zero downtime

1. **Pre-deployment checklist**:
   - [ ] All tests pass in dev environment
   - [ ] Migration scripts tested and verified
   - [ ] Database backup created
   - [ ] Rollback plan documented
   - [ ] Team notified of deployment window

2. **Deploy schema changes**:
   - [ ] Merge feature branch to main
   - [ ] Deploy to production (schema changes only, no data migration yet)
   - [ ] Verify admin UI loads
   - [ ] Verify new fields appear in admin

3. **Run data migration**:
   - [ ] SSH to production server
   - [ ] Run author migration script: `bun run migrate-author-to-authors`
   - [ ] Verify output: Check logs for errors
   - [ ] Run category migration script: `bun run migrate-categories`
   - [ ] Verify output: Check logs for errors

4. **Verify production**:
   - [ ] Check frontend: All blog posts render correctly
   - [ ] Check admin: Create new post with new fields
   - [ ] Check admin: Edit existing post, verify data integrity
   - [ ] Monitor logs for errors (24 hours)

5. **Post-deployment**:
   - [ ] Update team: Migration complete
   - [ ] Document changes in CHANGELOG.md
   - [ ] Schedule deprecation of old fields (1-2 weeks)

---

#### Phase 8: Cleanup (Day 3 + 1-2 Weeks)

**Goal**: Remove deprecated fields after migration is stable

1. **Monitoring period** (1-2 weeks):
   - [ ] Monitor for errors
   - [ ] Ensure all content editors are using new fields
   - [ ] Verify no data inconsistencies

2. **Remove deprecated fields**:
   - [ ] Remove `author` field (single relationship)
   - [ ] Remove `categories_old` field (select)
   - [ ] Remove sync hooks for deprecated fields
   - [ ] Deploy to production

3. **Final verification**:
   - [ ] Verify admin UI still works
   - [ ] Verify frontend still renders correctly
   - [ ] Update documentation

---

## Data Migration Scripts

### Script 1: Migrate Author → Authors

**File**: `scripts/migrate-author-to-authors.ts`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

async function migrateAuthorToAuthors(dryRun = false) {
  const payload = await getPayload({ config })

  console.log(`🔄 Starting author migration (dry-run: ${dryRun})`)

  // Find all posts with 'author' field
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 1000,
    depth: 0,
  })

  console.log(`📊 Found ${posts.length} posts to migrate`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const post of posts) {
    try {
      // Check if already migrated
      if (post.authors && post.authors.length > 0) {
        console.log(`⏭️  Post "${post.title}" already has authors, skipping`)
        skipped++
        continue
      }

      // Check if old 'author' field exists
      if (!post.author) {
        console.log(`⚠️  Post "${post.title}" has no author field, skipping`)
        skipped++
        continue
      }

      if (dryRun) {
        console.log(`[DRY RUN] Would migrate post "${post.title}": author → authors[0]`)
        migrated++
        continue
      }

      // Migrate: author → authors
      await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          authors: [typeof post.author === 'string' ? post.author : post.author.id],
        },
        context: { skipAuthorSync: true }, // Prevent hook loop
      })

      console.log(`✅ Migrated post "${post.title}"`)
      migrated++
    } catch (error) {
      console.error(`❌ Error migrating post "${post.title}":`, error)
      errors++
    }
  }

  console.log(`\n📈 Migration Summary:`)
  console.log(`   Migrated: ${migrated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors: ${errors}`)
  console.log(`   Total: ${posts.length}`)

  if (errors > 0) {
    throw new Error(`Migration failed with ${errors} errors`)
  }
}

// Run script
const dryRun = process.argv.includes('--dry-run')
migrateAuthorToAuthors(dryRun)
  .then(() => {
    console.log('✅ Migration complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
```

**Usage**:
```bash
# Preview changes
bun run scripts/migrate-author-to-authors.ts --dry-run

# Execute migration
bun run scripts/migrate-author-to-authors.ts
```

---

### Script 2: Migrate Categories (Select → Relationship)

**File**: `scripts/migrate-categories.ts`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

async function migrateCategories(dryRun = false) {
  const payload = await getPayload({ config })

  console.log(`🔄 Starting category migration (dry-run: ${dryRun})`)

  // Step 1: Fetch all categories from Categories collection
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0,
  })

  // Build mapping: slug → id
  const categoryMap: Record<string, string> = {}
  categories.forEach(cat => {
    if (cat.slug) {
      categoryMap[cat.slug] = cat.id
    }
  })

  console.log(`📊 Category mapping:`, categoryMap)

  // Step 2: Fetch all posts
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 1000,
    depth: 0,
  })

  console.log(`📊 Found ${posts.length} posts to migrate`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const post of posts) {
    try {
      // Check if already migrated
      if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
        // Check if categories are IDs (already migrated) or strings (old format)
        const firstCat = post.categories[0]
        if (typeof firstCat === 'object' || (typeof firstCat === 'string' && firstCat.length === 24)) {
          console.log(`⏭️  Post "${post.title}" already has category relationships, skipping`)
          skipped++
          continue
        }
      }

      // Check if old categories_old field exists
      const oldCategories = post.categories_old || post.categories
      if (!oldCategories || oldCategories.length === 0) {
        console.log(`⚠️  Post "${post.title}" has no categories, skipping`)
        skipped++
        continue
      }

      // Map old category slugs to new category IDs
      const newCategoryIds = oldCategories
        .map((slug: string) => categoryMap[slug])
        .filter(Boolean) // Remove undefined values

      if (newCategoryIds.length === 0) {
        console.warn(`⚠️  Post "${post.title}" has categories but none matched: ${oldCategories}`)
        skipped++
        continue
      }

      if (dryRun) {
        console.log(`[DRY RUN] Would migrate post "${post.title}":`, oldCategories, '→', newCategoryIds)
        migrated++
        continue
      }

      // Migrate: categories (select) → categories (relationship)
      await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          categories: newCategoryIds,
        },
        context: { skipCategorySync: true }, // Prevent hook loop
      })

      console.log(`✅ Migrated post "${post.title}": ${oldCategories.length} categories`)
      migrated++
    } catch (error) {
      console.error(`❌ Error migrating post "${post.title}":`, error)
      errors++
    }
  }

  console.log(`\n📈 Migration Summary:`)
  console.log(`   Migrated: ${migrated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors: ${errors}`)
  console.log(`   Total: ${posts.length}`)

  if (errors > 0) {
    throw new Error(`Migration failed with ${errors} errors`)
  }
}

// Run script
const dryRun = process.argv.includes('--dry-run')
migrateCategories(dryRun)
  .then(() => {
    console.log('✅ Migration complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
```

**Usage**:
```bash
# Preview changes
bun run scripts/migrate-categories.ts --dry-run

# Execute migration
bun run scripts/migrate-categories.ts
```

---

## Rollback Plan

### If Migration Fails: Immediate Rollback

**Scenario**: Migration scripts fail or introduce data corruption

#### Step 1: Stop All Operations
```bash
# Stop production server (if possible)
# Prevent further writes to database
```

#### Step 2: Restore Database from Backup
```bash
# MongoDB restore
mongorestore --uri="$DATABASE_URI" ./backup-YYYYMMDD --drop

# Verify restoration
mongo "$DATABASE_URI" --eval "db.posts.countDocuments()"
```

#### Step 3: Revert Code Changes
```bash
# Revert to previous commit
git revert <migration-commit-hash>

# Or checkout previous version
git checkout <previous-tag>

# Redeploy
bun run build
bun run start
```

#### Step 4: Verify Rollback
- [ ] Check admin UI: Posts collection loads
- [ ] Check frontend: Blog posts render
- [ ] Check logs: No errors

---

### If Migration Partially Succeeds: Gradual Rollback

**Scenario**: Some posts migrated successfully, some failed

#### Step 1: Identify Failed Posts
```typescript
// Query posts without migrated data
const failedPosts = await payload.find({
  collection: 'posts',
  where: {
    or: [
      { authors: { exists: false } },
      { 'authors.0': { exists: false } },
    ],
  },
})

console.log(`❌ ${failedPosts.totalDocs} posts failed to migrate`)
```

#### Step 2: Manual Remediation

**Option A**: Re-run migration for failed posts only
```bash
# Modify migration script to target specific IDs
bun run scripts/migrate-author-to-authors.ts --ids="id1,id2,id3"
```

**Option B**: Manually fix in admin UI
- Edit each failed post
- Set `authors` field manually
- Save

#### Step 3: Verify Data Integrity
```typescript
// Check for inconsistencies
const posts = await payload.find({ collection: 'posts', limit: 1000 })
const inconsistencies = posts.docs.filter(post => {
  return post.author && (!post.authors || post.authors.length === 0)
})

console.log(`⚠️  ${inconsistencies.length} posts have inconsistent author data`)
```

---

### If Frontend Breaks: Temporary Fixes

**Scenario**: Frontend fails to render posts with new schema

#### Step 1: Add Fallback Logic
```typescript
// pages/blog/[slug]/page.tsx
const authors = post.populatedAuthors || (post.author ? [post.author] : [])
const categories = post.categories || post.categories_old || []
```

#### Step 2: Deploy Hotfix
```bash
# Deploy frontend fix without reverting migration
git checkout -b hotfix/blog-rendering
# Make changes
git commit -m "fix: Add fallback logic for post schema"
git push origin hotfix/blog-rendering
# Deploy
```

---

### Rollback Decision Matrix

| Issue | Severity | Action | Rollback? |
|-------|----------|--------|-----------|
| Migration script fails (0% migrated) | **Critical** | Restore database backup | ✅ Yes |
| Migration partially succeeds (<50%) | **High** | Restore database backup | ✅ Yes |
| Migration partially succeeds (>50%) | **Medium** | Re-run script for failed posts | ❌ No (remediate) |
| Frontend rendering errors | **Medium** | Add fallback logic, deploy hotfix | ❌ No (fix forward) |
| Admin UI slow performance | **Low** | Optimize queries, add indexes | ❌ No (optimize) |
| Content editors report confusion | **Low** | Training, documentation | ❌ No (support) |

---

## Testing Strategy

### Unit Tests

**File**: `src/collections/Posts/Posts.test.ts`

```typescript
import { expect, test, describe, beforeAll } from 'bun:test'
import { getPayload } from 'payload'
import config from '@payload-config'

describe('Posts Collection Schema Migration', () => {
  let payload: any

  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  test('should create post with multiple authors', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Test Post',
        authors: ['user-id-1', 'user-id-2'],
        status: 'draft',
        content: { root: { children: [] } },
      },
    })

    expect(post.authors).toHaveLength(2)
  })

  test('should populate authors on read', async () => {
    const post = await payload.findByID({
      collection: 'posts',
      id: 'test-post-id',
    })

    expect(post.populatedAuthors).toBeDefined()
    expect(post.populatedAuthors[0]).toHaveProperty('id')
    expect(post.populatedAuthors[0]).toHaveProperty('name')
  })

  test('should create post with category relationships', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Test Post',
        categories: ['category-id-1', 'category-id-2'],
        authors: ['user-id-1'],
        status: 'draft',
        content: { root: { children: [] } },
      },
    })

    expect(post.categories).toHaveLength(2)
  })

  test('should prevent self-referential related posts', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Test Post',
        authors: ['user-id-1'],
        status: 'draft',
        content: { root: { children: [] } },
      },
    })

    // Attempt to add self as related post (should be filtered by filterOptions)
    const updated = await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        relatedPosts: [post.id], // Self-reference
      },
    })

    // filterOptions should prevent this, but verify frontend handles it gracefully
    expect(updated.relatedPosts).toBeDefined()
  })
})
```

---

### Integration Tests

**File**: `tests/integration/posts-migration.test.ts`

```typescript
import { expect, test, describe, beforeAll, afterAll } from 'bun:test'
import { getPayload } from 'payload'
import config from '@payload-config'

describe('Posts Migration Integration Tests', () => {
  let payload: any
  let testPostId: string

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test post with old schema
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Migration Test Post',
        author: 'user-id-1', // Old field
        categories_old: ['education', 'product-news'], // Old field
        status: 'draft',
        content: { root: { children: [] } },
      },
    })
    testPostId = post.id
  })

  afterAll(async () => {
    // Cleanup
    await payload.delete({ collection: 'posts', id: testPostId })
  })

  test('should sync author to authors on save', async () => {
    const post = await payload.findByID({
      collection: 'posts',
      id: testPostId,
    })

    expect(post.authors).toBeDefined()
    expect(post.authors).toContain('user-id-1')
  })

  test('should convert categories on migration', async () => {
    // Run migration script logic inline
    const categoryMap = await getCategoryMapping(payload)

    const post = await payload.findByID({
      collection: 'posts',
      id: testPostId,
    })

    const oldCategories = post.categories_old || []
    const newCategories = oldCategories.map((slug: string) => categoryMap[slug])

    await payload.update({
      collection: 'posts',
      id: testPostId,
      data: { categories: newCategories },
    })

    const updated = await payload.findByID({
      collection: 'posts',
      id: testPostId,
    })

    expect(updated.categories).toHaveLength(2)
    expect(typeof updated.categories[0]).toBe('string') // ID format
  })
})

async function getCategoryMapping(payload: any) {
  const { docs } = await payload.find({ collection: 'categories', limit: 100 })
  const map: Record<string, string> = {}
  docs.forEach((cat: any) => {
    if (cat.slug) map[cat.slug] = cat.id
  })
  return map
}
```

---

### E2E Tests (Playwright)

**File**: `tests/e2e/blog-post-migration.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Blog Post Migration E2E', () => {
  test('should display post with multiple authors', async ({ page }) => {
    await page.goto('/blog/test-post-with-multiple-authors')

    // Check that multiple authors are displayed
    const authors = await page.locator('[data-testid="post-authors"]').textContent()
    expect(authors).toContain('Author One')
    expect(authors).toContain('Author Two')
  })

  test('should display category links', async ({ page }) => {
    await page.goto('/blog/test-post')

    // Check that categories are links to category pages
    const categories = page.locator('[data-testid="post-categories"] a')
    await expect(categories).toHaveCount(2)

    await categories.first().click()
    await expect(page).toHaveURL(/\/blog\/category\//)
  })

  test('should display related posts section', async ({ page }) => {
    await page.goto('/blog/test-post-with-related')

    // Check that related posts section exists
    const relatedPosts = page.locator('[data-testid="related-posts"]')
    await expect(relatedPosts).toBeVisible()

    const relatedCards = relatedPosts.locator('[data-testid="blog-card"]')
    await expect(relatedCards).toHaveCount(3)
  })

  test('should render post without errors after migration', async ({ page }) => {
    await page.goto('/blog')

    // Click on first post
    await page.locator('[data-testid="blog-card"]').first().click()

    // Check that post content renders
    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()

    // Check for console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })
})
```

---

### Manual Testing Checklist

#### Admin UI Testing

- [ ] **Create new post**:
  - [ ] Select multiple authors (if implemented)
  - [ ] Select categories (relationship, not select)
  - [ ] Add related posts
  - [ ] Verify slug auto-generates
  - [ ] Verify publishedDate auto-sets on publish
  - [ ] Save successfully

- [ ] **Edit existing post**:
  - [ ] Verify old data displays correctly
  - [ ] Verify new fields appear
  - [ ] Edit authors/categories
  - [ ] Save successfully

- [ ] **List view**:
  - [ ] Verify columns display correctly
  - [ ] Verify search works
  - [ ] Verify filters work

#### Frontend Testing

- [ ] **Blog list page** (`/blog`):
  - [ ] Posts display with correct authors
  - [ ] Categories display as links
  - [ ] Pagination works
  - [ ] Category filter works

- [ ] **Blog post page** (`/blog/[slug]`):
  - [ ] Post content renders
  - [ ] Authors display correctly (multiple if applicable)
  - [ ] Categories display as links
  - [ ] Related posts section displays (if set)
  - [ ] No console errors

- [ ] **Category page** (`/blog/category/[slug]`):
  - [ ] Lists posts in category
  - [ ] Category metadata displays

---

## Success Criteria

### Must-Have (Required for Migration to be Considered Successful)

- [ ] **All existing posts render without errors** on frontend
- [ ] **All data migrated successfully**:
  - [ ] All posts have `authors` array (migrated from `author`)
  - [ ] All posts have `categories` relationships (migrated from select)
  - [ ] No data loss
- [ ] **New features work**:
  - [ ] Multiple authors can be assigned
  - [ ] Categories are manageable in admin UI
  - [ ] Related posts display correctly
  - [ ] populatedAuthors hides sensitive user data
- [ ] **Admin UI is functional**:
  - [ ] Posts can be created
  - [ ] Posts can be edited
  - [ ] Posts can be deleted
  - [ ] No errors in console
- [ ] **Access control works correctly**:
  - [ ] Public users see only published posts
  - [ ] Authenticated users see all posts
- [ ] **ISR revalidation works**:
  - [ ] Post pages revalidate on publish
  - [ ] Blog list revalidates on post change
  - [ ] Deleted posts revalidate

### Nice-to-Have (Optional Enhancements)

- [ ] **Drafts plugin integrated** (autosave, schedule publish)
- [ ] **SEO plugin integrated** (professional SEO fields)
- [ ] **Tab reorganization** (cleaner UI for content editors)
- [ ] **slugField() adopted** (cleaner slug generation)
- [ ] **defaultPopulate configured** (performance optimization)

### Performance Metrics

- [ ] **Admin UI load time**: < 2s
- [ ] **Blog list page load time**: < 1s
- [ ] **Blog post page load time**: < 1.5s
- [ ] **populateAuthors hook**: < 100ms per post

### Data Integrity Checks

```typescript
// Run these queries to verify migration success

// Check 1: All posts have authors array
const postsWithoutAuthors = await payload.find({
  collection: 'posts',
  where: {
    or: [
      { authors: { exists: false } },
      { 'authors.0': { exists: false } },
    ],
  },
})
console.assert(postsWithoutAuthors.totalDocs === 0, 'All posts should have authors')

// Check 2: All posts have categories
const postsWithoutCategories = await payload.find({
  collection: 'posts',
  where: {
    or: [
      { categories: { exists: false } },
      { 'categories.0': { exists: false } },
    ],
  },
})
// This is OK - some posts may not have categories

// Check 3: No orphaned category references
const posts = await payload.find({ collection: 'posts', limit: 1000 })
for (const post of posts.docs) {
  for (const catId of post.categories || []) {
    const cat = await payload.findByID({ collection: 'categories', id: catId })
    console.assert(cat, `Category ${catId} should exist`)
  }
}
```

---

## Appendix: Field Mapping Reference

### Complete Field Mapping Table

| Field Name | Type (Current) | Type (Target) | Migration Action | Data Transform | Risk |
|------------|----------------|---------------|------------------|----------------|------|
| `title` | text | text | No change | None | None |
| `slug` | text (manual) | text (slugField) | Replace with helper | None | Low |
| `excerpt` | textarea | textarea | No change | None | None |
| `featuredImage` | upload | *(keep as-is)* | No change | None | None |
| `content` | richText (basic) | richText (BlocksFeature) | Add blocks | None | Low |
| `contentBlocks` | blocks | *(keep as-is)* | No change | None | None |
| `author` | relationship (single) | **(deprecated)** | Keep temporarily | Sync to `authors` | High |
| **`authors`** | *(new)* | relationship (hasMany) | Add new field | Copy from `author` | High |
| **`populatedAuthors`** | *(new)* | array (hidden) | Add new field | Populated by hook | Low |
| `categories` | select | **(deprecated)** | Rename to `categories_old` | Convert to IDs | High |
| **`categories`** (new) | *(new)* | relationship (hasMany) | Add new field | Map slugs to IDs | High |
| **`relatedPosts`** | *(new)* | relationship (hasMany, self) | Add new field | None | Low |
| `tags` | text | text | No change | None | None |
| `status` | select | select | No change | None | None |
| `publishedDate` | date | date | No change (or rename to `publishedAt`) | None | Low |
| `featured` | checkbox | checkbox | No change | None | None |
| `seo` | group | group | No change (or adopt SEO plugin) | None | Low |

---

## Conclusion

This migration plan provides a comprehensive, step-by-step strategy for upgrading the KAWAI Posts collection schema to adopt proven patterns from orca-web. Key highlights:

### Benefits of Migration

1. **Flexibility**: Multiple authors per post
2. **Scalability**: Dynamic category management
3. **Privacy**: Author data protection via `populatedAuthors`
4. **Engagement**: Related posts for content discovery
5. **Maintainability**: Reusable access control utilities
6. **Code Simplicity**: Adopting `slugField()` and field-level hooks

### Risk Mitigation

1. **Backward compatibility**: Keep old fields during transition
2. **Gradual migration**: Phase-by-phase implementation
3. **Rollback plan**: Database backups + revert strategy
4. **Testing**: Unit, integration, E2E tests
5. **Dry-run scripts**: Preview migrations before execution

### Next Steps

1. **Review this document** with team
2. **Approve migration plan**
3. **Schedule implementation window** (3-day sprint)
4. **Execute Phase 1** (additive changes)
5. **Test in dev environment** thoroughly
6. **Deploy to production** with monitoring

**Estimated Timeline**: 3 days implementation + 1 day testing + 1-2 weeks monitoring before cleanup

**Recommended Go-Live**: After approval and successful dev environment testing

---

**Document Version**: 1.0
**Created**: 2026-01-14
**Author**: Migration Planning Agent
**Status**: Ready for Review
