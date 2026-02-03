# Instrumental To Life Block - Updates Summary

## Changes Made

### 1. **Customizable Section Label**

**What Changed:**
- Renamed `heading` field to `sectionLabel` for clarity
- This field controls the small uppercase text displayed above the main content (e.g., "INSTRUMENTAL TO LIFE")

**How to Use:**
In the CMS admin, when editing an Instrumental To Life block:
1. Find the "Section Label" field at the top
2. Enter your custom text (e.g., "ARTIST STORIES", "PERFORMANCE SERIES", "BEHIND THE SCENES")
3. This text will appear in small, uppercase, red letters above the video content

**Default Value:** "Instrumental To Life"

---

### 2. **Enhanced CTA (Call-to-Action) Configuration**

**What Changed:**
- Reorganized CTA fields into a clear "Call to Action (Optional)" group
- Each video can now have its own CTA button with full control over:
  - Button text
  - Link URL (internal or external)
  - Button style (Primary or Secondary)
  - Open in new tab option

**How to Use:**

For each video in the carousel:

1. **CTA Text** - Enter button text (e.g., "Learn More", "Explore This Piano", "Watch Full Performance")
   - Leave empty to hide the button for that video

2. **CTA Link** - Enter the destination URL
   - Internal links: `/products/sk-ex`, `/pianos/grand`, `/artists/john-doe`
   - External links: `https://example.com`, `https://youtube.com/@kawaipianos`
   - **Required** when CTA Text is provided

3. **Button Style** - Choose visual appearance:
   - **Primary** - Red background (Kawai brand red)
   - **Secondary** - White outline, transparent background

4. **Open in New Tab** - Check this box to:
   - Open the link in a new browser tab
   - Keep users on your site
   - **Recommended for external links**

---

## Technical Implementation

### Block Definition
**File:** `src/blocks/marketing/InstrumentalToLife.ts`

**Key Changes:**
```typescript
// Section label field (renamed from 'heading')
{
  name: 'sectionLabel',
  type: 'text',
  required: true,
  defaultValue: 'Instrumental To Life',
}

// CTA fields now organized in a group
{
  name: 'cta',
  type: 'group',
  fields: [
    { name: 'text', type: 'text' },
    { name: 'url', type: 'text' },
    { name: 'variant', type: 'select' },
    { name: 'openInNewTab', type: 'checkbox' },
  ],
}
```

### Frontend Renderer
**File:** `src/components/blocks/marketing/MarketingI2LRenderer.tsx`

**Key Changes:**
```typescript
// Uses new sectionLabel prop
<div className="section-label">
  {sectionLabel || 'Instrumental To Life'}
</div>

// Accesses nested CTA properties
{currentVideo.cta?.text && currentVideo.cta?.url && (
  <Button variant={currentVideo.cta.variant}>
    <Link
      href={currentVideo.cta.url}
      target={currentVideo.cta.openInNewTab ? '_blank' : undefined}
      rel={currentVideo.cta.openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {currentVideo.cta.text}
    </Link>
  </Button>
)}
```

### Type Safety
TypeScript types have been regenerated (`payload-types.ts`):

```typescript
export interface MarketingI2LBlock {
  sectionLabel: string;
  videos: {
    // ... other video fields
    cta?: {
      text?: string | null;
      url?: string | null;
      variant?: ('default' | 'outline') | null;
      openInNewTab?: boolean | null;
    };
  }[];
}
```

---

## Updated Documentation

The `docs/BLOCKS.md` file has been updated to reflect these changes:

```markdown
**Instrumental To Life Features:**
- YouTube video carousel with up to 6 videos
- **Customizable section label** (the "INSTRUMENTAL TO LIFE" heading above videos)
- **Per-video CTA buttons** with customizable text, URL, style, and new tab option
- [... other features]

**CTA Configuration:**
Each video can have its own call-to-action button with:
- Custom button text
- Internal or external link URL
- Two style variants: Primary (red) or Secondary (outline)
- Option to open in new tab (recommended for external links)
- Leave CTA text empty to hide the button for specific videos
```

---

## Migration Guide

### For Existing Blocks

If you have existing Instrumental To Life blocks in your CMS:

1. **Section Label**: The old `heading` field values will **not** automatically transfer to `sectionLabel`. You'll need to:
   - Edit each existing block
   - Enter your desired section label text
   - Or leave as default "Instrumental To Life"

2. **CTA Fields**: Old CTA data structure **will not** automatically migrate. For each video:
   - Re-enter CTA text
   - Re-enter CTA URL
   - Select button style
   - Check "Open in New Tab" if needed

**Note:** It's recommended to review and update all existing Instrumental To Life blocks after deploying this change.

---

## Testing Checklist

- [x] Build completes successfully
- [x] TypeScript types regenerated
- [x] Documentation updated
- [ ] Test in CMS admin:
  - [ ] Create new Instrumental To Life block
  - [ ] Customize section label
  - [ ] Add videos with CTAs
  - [ ] Test both internal and external links
  - [ ] Verify "Open in New Tab" works
- [ ] Test frontend rendering:
  - [ ] Section label displays correctly
  - [ ] CTA buttons render with correct styles
  - [ ] Links navigate correctly
  - [ ] New tab option works for external links

---

## Support

If you encounter any issues with these changes:

1. Clear your Next.js cache: `rm -rf .next`
2. Rebuild the project: `bun run build`
3. Check the browser console for errors
4. Verify your CMS admin shows the new fields correctly

For further assistance, refer to:
- `docs/BLOCKS.md` - Complete block system documentation
- `CLAUDE.md` - Project development guide
