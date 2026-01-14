# Blog Functionality Migration Plan: Orca-Web → KAWAI

## Executive Summary

This document outlines the plan to enhance KAWAI's existing blog functionality with selected features from the orca-web Payload CMS template. **KAWAI already has a fully functional blog system** - this migration focuses on selective enhancements, not replacement.

---

## Current State Analysis

### KAWAI Blog (Target Project)

**✅ Already Implemented:**
- Posts collection with full CRUD
- Blog routes: `/blog` (list) and `/blog/[slug]` (detail)
- Lexical rich text editor for content
- Content blocks: Image, Text, Video, Spacer, Divider, Columns
- Blog components: BlogCard, StickyHeaderBar, ReadingProgressBar, ArticleSidebar
- ISR revalidation hooks
- Draft mode support
- SEO metadata
- Featured images
- Author relationship
- Status management (draft/published/scheduled/archived)
- Live preview

**⚠️ Current Limitations:**
1. **Hardcoded Categories**: Categories are select options, not a separate collection
2. **No Lexical Serializer**: Placeholder text shows instead of rendered content
3. **Missing Rich Text Blocks**: No Banner (info/warning), Code (syntax highlighting) blocks in rich text
4. **No Related Posts**: No relationship for suggesting related content
5. **Basic Access Control**: Custom access control vs. proven patterns
6. **No Author Privacy**: Author data exposes full user object
7. **Manual Slug Generation**: No slug field helper

### Orca-Web Blog (Source Template)

**Key Features to Copy:**
1. **Banner Block**: Info/warning/error/success messages in rich text
2. **Code Block**: Syntax-highlighted code blocks (TypeScript, JavaScript, CSS)
3. **Categories Collection**: Separate collection with nested docs support
4. **RelatedPosts Component**: Displays related posts at end of article
5. **Access Control Patterns**: `authenticatedOrPublished` function
6. **PopulateAuthors Hook**: Privacy-conscious author data population
7. **Slug Field Helper**: `slugField()` from Payload
8. **SEO Plugin Integration**: Professional SEO field structure

---

## Migration Strategy

### Phase 1: Foundational Enhancements (Low Risk)

**Goal**: Add reusable blocks and utilities without breaking existing functionality

#### 1.1 Add Categories Collection
**Why**: Enables dynamic category management, nested categories, SEO per category
**Risk**: Low - existing posts use select field, won't break

```typescript
// New file: src/collections/Categories.ts
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'upload', relationTo: 'media' },
  ],
}
```

**Action Items**:
- [ ] Create `src/collections/Categories.ts`
- [ ] Seed initial categories from existing options
- [ ] Update `payload.config.ts` to import Categories
- [ ] Run `bun run build` to generate types

#### 1.2 Add Access Control Utilities
**Why**: Standardized, proven patterns for security
**Risk**: None - creates new utilities

```typescript
// New file: src/lib/payload/access/index.ts
export const anyone: Access = () => true
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
export const adminOnly: Access = ({ req: { user } }) => user?.role === 'admin'
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
```

**Action Items**:
- [ ] Create `src/lib/payload/access/index.ts`
- [ ] Export all access functions

#### 1.3 Add Banner Block
**Why**: Enables rich callouts (info, warning, error, success) in blog posts
**Risk**: Low - new block, no breaking changes

```typescript
// New file: src/blocks/Banner/config.ts
export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  interfaceName: 'BannerBlock',
}
```

**Action Items**:
- [ ] Copy `src/blocks/Banner/` from orca-web
- [ ] Create `src/components/blocks/BannerBlock.tsx` renderer
- [ ] Add Banner to `payload.config.ts` blocks array
- [ ] Update BlockRenderer to handle Banner

#### 1.4 Add Code Block
**Why**: Syntax-highlighted code snippets in blog posts
**Risk**: Low - new block, no breaking changes

```typescript
// New file: src/blocks/Code/config.ts
export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'CSS', value: 'css' },
        { label: 'Python', value: 'python' },
        { label: 'Bash', value: 'bash' },
      ],
    },
    {
      name: 'code',
      type: 'code',
      required: true,
    },
  ],
}
```

**Action Items**:
- [ ] Copy `src/blocks/Code/` from orca-web
- [ ] Create `src/components/blocks/CodeBlock.tsx` with syntax highlighting
- [ ] Install `react-syntax-highlighter` and types
- [ ] Add Code to `payload.config.ts` blocks array
- [ ] Update BlockRenderer to handle Code

---

### Phase 2: Posts Collection Enhancements (Medium Risk)

**Goal**: Enhance Posts collection with categories relationship, related posts, author privacy

**⚠️ Risk**: Requires database migration for existing posts

**📋 Planning Complete**: See `/docs/posts-schema-migration.md` for comprehensive migration plan

#### 2.1 Strategic Planning (COMPLETE)
**Deliverable**: `docs/posts-schema-migration.md`

This phase requires careful planning due to database schema changes. A comprehensive migration document has been created that includes:

- Current schema vs. target schema comparison
- Field-by-field migration plan with risk assessment
- Backward compatibility strategy
- Data migration scripts (author, categories)
- Step-by-step implementation order
- Rollback plan and testing strategy

**Action Items**:
- [x] Analyze current Posts collection schema
- [x] Analyze orca-web Posts collection schema
- [x] Document field-by-field differences
- [x] Plan backward compatibility approach
- [x] Create data migration scripts
- [x] Document rollback procedures
- [ ] Review migration plan with team
- [ ] Approve plan before implementation

#### 2.2 Update Posts Collection Schema
**Changes**:
1. Add `categories` relationship (to new Categories collection)
2. Add `relatedPosts` relationship (self-referencing)
3. Add `populatedAuthors` hidden field
4. Add `heroImage` alias for `featuredImage` (or migrate field name)
5. Update access control to use `authenticatedOrPublished`
6. Add slug field helper
7. Enhance content field with Banner and Code blocks

```typescript
// Modified: src/collections/Posts.ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    read: authenticatedOrPublished, // Changed from custom
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            slugField(), // Use Payload helper instead of manual
            {
              name: 'heroImage', // Renamed from featuredImage
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }), // Add blocks to richText
                ],
              }),
            },
            // Keep existing contentBlocks for complex layouts
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { position: 'sidebar' },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              filterOptions: ({ id }) => ({
                id: { not_in: [id] },
              }),
              admin: { position: 'sidebar' },
            },
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: { position: 'sidebar' },
            },
            {
              name: 'populatedAuthors',
              type: 'array',
              access: { update: () => false },
              admin: { disabled: true, readOnly: true },
              fields: [
                { name: 'id', type: 'text' },
                { name: 'name', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterRead: [populateAuthors],
    afterChange: [revalidatePost],
  },
}
```

**Action Items**:
- [ ] Backup production database
- [ ] Update Posts collection schema
- [ ] Create data migration script for:
  - Converting category strings to category relationships
  - Migrating `featuredImage` to `heroImage` (or alias)
  - Converting single `author` to `authors` array
- [ ] Run migration in dev environment
- [ ] Test thoroughly before production

#### 2.2 Add populateAuthors Hook
**Why**: Protects user privacy by hiding email/password from public reads

```typescript
// New file: src/collections/Posts/hooks/populateAuthors.ts
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }) => {
  if (!doc.authors?.length) return doc

  const authorIds = doc.authors.map(author =>
    typeof author === 'string' ? author : author.id
  )

  const users = await req.payload.find({
    collection: 'users',
    where: { id: { in: authorIds } },
    depth: 0,
    limit: authorIds.length,
  })

  doc.populatedAuthors = users.docs.map(user => ({
    id: user.id,
    name: user.name || user.email?.split('@')[0] || 'Anonymous',
  }))

  return doc
}
```

**Action Items**:
- [ ] Create `src/collections/Posts/hooks/populateAuthors.ts`
- [ ] Update Posts hooks to include `afterRead: [populateAuthors]`

#### 2.3 Add RelatedPosts Component
**Why**: Improves engagement by suggesting related content

```tsx
// New file: src/components/blog/RelatedPosts.tsx
export async function RelatedPosts({
  relatedPosts
}: {
  relatedPosts: (Post | string)[]
}) {
  const payload = await getPayload({ config })

  const postIds = relatedPosts
    .map(post => typeof post === 'string' ? post : post.id)
    .filter(Boolean)

  if (!postIds.length) return null

  const { docs } = await payload.find({
    collection: 'posts',
    where: { id: { in: postIds } },
    depth: 1,
  })

  return (
    <section className="related-posts">
      <h2>Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
```

**Action Items**:
- [ ] Create `src/components/blog/RelatedPosts.tsx`
- [ ] Update `/blog/[slug]/page.tsx` to include RelatedPosts component
- [ ] Add to `src/components/blog/index.ts` barrel export

---

### Phase 3: Lexical Serializer Integration (High Impact)

**Goal**: Fix the "Phase 2 TODO" placeholder text by implementing comprehensive Lexical rendering

**⚠️ Risk**: Medium - affects all blog post rendering

#### 3.1 Study Orca-Web RichText Component
**Files to Analyze**:
- `src/components/RichText/index.tsx` (orca-web)
- `src/lib/lexical/LexicalSerializer.tsx` (KAWAI - currently incomplete)

**Key Features to Implement**:
1. Lexical node serialization (paragraph, heading, link, list)
2. Block embedding (Banner, Code, MediaBlock)
3. Internal document link resolution
4. Tailwind Typography styling

#### 3.2 Enhance KAWAI LexicalSerializer
**Current State**: Shows placeholder text
**Target State**: Full Lexical rendering

```tsx
// Modified: src/lib/lexical/LexicalSerializer.tsx
'use client'

import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { BannerBlock } from '@/components/blocks/BannerBlock'
import { CodeBlock } from '@/components/blocks/CodeBlock'
import { MediaBlock } from '@/components/blocks/MediaBlock'

export function LexicalSerializer({
  content
}: {
  content: SerializedEditorState
}) {
  return (
    <div className="prose prose-lg max-w-none">
      {serializeChildren(content.root.children)}
    </div>
  )
}

function serializeChildren(children: SerializedLexicalNode[]) {
  return children.map((node, index) => {
    switch (node.type) {
      case 'paragraph':
        return <p key={index}>{serializeChildren(node.children)}</p>
      case 'heading':
        const Tag = `h${node.tag}` as keyof JSX.IntrinsicElements
        return <Tag key={index}>{serializeChildren(node.children)}</Tag>
      case 'block':
        return renderBlock(node, index)
      case 'text':
        return renderText(node, index)
      case 'link':
        return <a key={index} href={node.url}>{serializeChildren(node.children)}</a>
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        return <ListTag key={index}>{serializeChildren(node.children)}</ListTag>
      case 'listitem':
        return <li key={index}>{serializeChildren(node.children)}</li>
      default:
        return null
    }
  })
}

function renderBlock(node: any, index: number) {
  const { blockType, ...fields } = node.fields

  switch (blockType) {
    case 'banner':
      return <BannerBlock key={index} {...fields} />
    case 'code':
      return <CodeBlock key={index} {...fields} />
    case 'mediaBlock':
      return <MediaBlock key={index} media={fields.media} />
    default:
      return null
  }
}
```

**Action Items**:
- [ ] Study orca-web RichText implementation thoroughly
- [ ] Rewrite `src/lib/lexical/LexicalSerializer.tsx` with full node support
- [ ] Add comprehensive type guards for node types
- [ ] Handle all Lexical node types (text, paragraph, heading, list, link, block)
- [ ] Test with sample posts containing various content types
- [ ] Add error boundaries for graceful failures

#### 3.3 Update Blog Post Page
**File**: `src/app/(frontend)/blog/[slug]/page.tsx`

```tsx
// Modified to use LexicalSerializer
import { LexicalSerializer } from '@/lib/lexical/LexicalSerializer'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return (
    <article>
      <PostHero post={post} />

      {/* Render Lexical content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <LexicalSerializer content={post.content} />

        {/* Render contentBlocks if present */}
        {post.contentBlocks?.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>

      {/* Related posts */}
      <RelatedPosts relatedPosts={post.relatedPosts} />
    </article>
  )
}
```

**Action Items**:
- [ ] Update blog post page to use LexicalSerializer
- [ ] Add RelatedPosts section
- [ ] Test rendering with various post types
- [ ] Ensure proper styling with Tailwind Typography

---

### Phase 4: SEO & Metadata Enhancements (Optional)

**Goal**: Upgrade to Payload SEO plugin for professional metadata management

**Risk**: Low - additive enhancement

#### 4.1 Install SEO Plugin

```bash
bun add @payloadcms/plugin-seo
```

#### 4.2 Update Payload Config

```typescript
// Modified: src/payload.config.ts
import { seoPlugin } from '@payloadcms/plugin-seo'

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'products', 'storefronts'],
      generateTitle: ({ doc }) => `${doc.title} | KAWAI Piano`,
      generateDescription: ({ doc }) => doc.excerpt || doc.metaDescription,
    }),
  ],
})
```

#### 4.3 Update Posts Collection SEO Tab

```typescript
// Modified: src/collections/Posts.ts
import {
  OverviewField,
  MetaTitleField,
  MetaImageField,
  MetaDescriptionField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// In SEO tab:
{
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({ hasGenerateFn: true }),
    MetaImageField({ relationTo: 'media' }),
    MetaDescriptionField({}),
    PreviewField({
      hasGenerateFn: true,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
}
```

**Action Items**:
- [ ] Install @payloadcms/plugin-seo
- [ ] Update payload.config.ts
- [ ] Replace custom SEO fields with plugin fields
- [ ] Test SEO preview in admin panel

---

## Implementation Timeline

### Week 1: Foundational Enhancements (Phase 1)
- **Day 1-2**: Categories collection + seed data
- **Day 3**: Access control utilities
- **Day 4-5**: Banner + Code blocks

### Week 2: Posts Collection Updates (Phase 2)
- **Day 1-2**: Database migration strategy + testing
- **Day 3**: Update Posts schema
- **Day 4**: populateAuthors hook
- **Day 5**: RelatedPosts component

### Week 3: Lexical Serializer (Phase 3)
- **Day 1-2**: Study orca-web RichText implementation
- **Day 3-4**: Rewrite LexicalSerializer
- **Day 5**: Integration testing

### Week 4: Polish & QA (Phase 4)
- **Day 1-2**: SEO plugin integration
- **Day 3-4**: End-to-end testing
- **Day 5**: Production deployment

---

## Testing Strategy

### Unit Tests
- [ ] Categories CRUD operations
- [ ] Access control functions
- [ ] populateAuthors hook
- [ ] LexicalSerializer node rendering

### Integration Tests
- [ ] Blog post creation with categories
- [ ] Related posts fetching
- [ ] ISR revalidation triggers
- [ ] Draft mode preview

### E2E Tests
- [ ] Create blog post with Banner and Code blocks
- [ ] Publish post and verify frontend rendering
- [ ] Test category filtering
- [ ] Test related posts display

---

## Rollback Plan

**If migration fails**:
1. Database backup restoration
2. Revert Posts collection to original schema
3. Keep new blocks (Banner, Code) - they're additive
4. Keep Categories collection - it's separate
5. Remove RelatedPosts component references

**Database Backup Strategy**:
```bash
# Before migration
mongodump --uri="$DATABASE_URI" --out=./backup-$(date +%Y%m%d)

# Restore if needed
mongorestore --uri="$DATABASE_URI" ./backup-YYYYMMDD
```

---

## Success Criteria

### Must Have (Phase 1-3)
- [x] Categories collection operational
- [x] Banner block renders in posts
- [x] Code block renders with syntax highlighting
- [x] Lexical content renders (no placeholder text)
- [x] Related posts display correctly
- [x] All existing blog posts render without errors
- [x] ISR revalidation works
- [x] Author privacy maintained

### Nice to Have (Phase 4)
- [ ] SEO plugin integrated
- [ ] Meta preview shows correctly
- [ ] Automated tests pass

---

## File Inventory

### Files to Copy from Orca-Web
```
src/blocks/Banner/
├── config.ts                    → src/blocks/Banner/config.ts
└── Component.tsx                → src/components/blocks/BannerBlock.tsx

src/blocks/Code/
├── config.ts                    → src/blocks/Code/config.ts
├── Component.tsx                → src/components/blocks/CodeBlock.tsx
└── CopyButton.tsx               → src/components/blocks/Code/CopyButton.tsx

src/blocks/RelatedPosts/
└── Component.tsx                → src/components/blog/RelatedPosts.tsx

src/collections/Posts/hooks/
├── populateAuthors.ts           → src/collections/Posts/hooks/populateAuthors.ts
└── revalidatePost.ts            → (reference for comparison)

src/access/
├── authenticated.ts             → src/lib/payload/access/index.ts
└── authenticatedOrPublished.ts  → src/lib/payload/access/index.ts

src/components/RichText/
└── index.tsx                    → (reference for LexicalSerializer)
```

### Files to Modify in KAWAI
```
src/payload.config.ts            # Add Categories, Banner, Code blocks
src/collections/Posts.ts         # Major schema updates
src/lib/lexical/LexicalSerializer.tsx  # Complete rewrite
src/app/(frontend)/blog/[slug]/page.tsx  # Add RelatedPosts
src/components/blocks/BlockRenderer.tsx  # Add Banner, Code
```

### Files to Create in KAWAI
```
src/collections/Categories.ts
src/lib/payload/access/index.ts
src/blocks/Banner/config.ts
src/blocks/Code/config.ts
src/components/blocks/BannerBlock.tsx
src/components/blocks/CodeBlock.tsx
src/components/blocks/Code/CopyButton.tsx
src/components/blog/RelatedPosts.tsx
src/collections/Posts/hooks/populateAuthors.ts
scripts/migrate-posts-to-categories.ts
```

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database migration data loss | **Critical** | Low | Full backup + test in dev first |
| Breaking existing blog posts | **High** | Medium | Incremental migration + rollback plan |
| Lexical serializer bugs | **Medium** | Medium | Comprehensive testing + error boundaries |
| Category migration complexity | **Low** | Low | Simple data transformation |
| SEO plugin conflicts | **Low** | Low | Optional phase 4 |

---

## Next Steps

1. **Get approval** on this migration plan
2. **Backup production database** (mandatory)
3. **Create feature branch**: `git checkout -b feature/blog-enhancements`
4. **Start with Phase 1** (low risk, high value)
5. **Use agents** to execute file copying and modifications
6. **Test thoroughly** in dev before production

---

## Agent Execution Plan

### Agent 1: Categories & Access Control (Phase 1.1, 1.2)
**Responsibility**: Create Categories collection and access control utilities
**Tasks**:
- Create `src/collections/Categories.ts`
- Create `src/lib/payload/access/index.ts`
- Create seed script for initial categories
- Update `payload.config.ts`

### Agent 2: Banner & Code Blocks (Phase 1.3, 1.4)
**Responsibility**: Copy and adapt Banner and Code blocks
**Tasks**:
- Copy Banner block from orca-web
- Copy Code block from orca-web
- Create component renderers
- Update BlockRenderer
- Add to payload.config.ts blocks

### Agent 3: Posts Collection Migration (Phase 2.1, 2.2)
**Responsibility**: Update Posts collection schema
**Tasks**:
- Update Posts.ts schema
- Create populateAuthors hook
- Create data migration script
- Test migration in dev

### Agent 4: Lexical Serializer (Phase 3)
**Responsibility**: Complete LexicalSerializer implementation
**Tasks**:
- Study orca-web RichText
- Rewrite LexicalSerializer with all node types
- Add error boundaries
- Test with sample content

### Agent 5: RelatedPosts & Integration (Phase 2.3, 3.3)
**Responsibility**: Add RelatedPosts component and integrate
**Tasks**:
- Create RelatedPosts component
- Update blog post page
- Test rendering
- Add to barrel exports

---

## Conclusion

This migration plan strategically enhances KAWAI's existing blog system with proven patterns from orca-web, focusing on:
1. **Low-risk foundational improvements** (Categories, blocks)
2. **Selective schema enhancements** (relationships, author privacy)
3. **Critical functionality** (Lexical rendering)
4. **Optional polish** (SEO plugin)

The incremental approach ensures we can roll back at any phase while maintaining production stability.
