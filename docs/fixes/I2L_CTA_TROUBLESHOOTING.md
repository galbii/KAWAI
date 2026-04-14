# Instrumental To Life - CTA Troubleshooting Guide

## ✅ Current Status

All CTA fields are **correctly implemented** in both the block definition and frontend renderer:

### Block Definition Fields
**Location:** `src/blocks/marketing/InstrumentalToLife.ts`

```typescript
{
  name: 'ctaText',      // ✅ Line 128-136
  name: 'ctaUrl',       // ✅ Line 138-154
  name: 'ctaVariant',   // ✅ Line 156-169
  name: 'ctaOpenInNewTab' // ✅ Line 171-179
}
```

### TypeScript Types
**Location:** `src/payload-types.ts`

```typescript
export interface MarketingI2LBlock {
  videos: {
    ctaText?: string | null;              // ✅
    ctaUrl?: string | null;               // ✅
    ctaVariant?: ('default' | 'outline') | null; // ✅
    ctaOpenInNewTab?: boolean | null;     // ✅
  }[];
}
```

### Frontend Renderer
**Location:** `src/components/blocks/marketing/MarketingI2LRenderer.tsx`

```typescript
{currentVideo.ctaText && currentVideo.ctaUrl && (
  <Button variant={currentVideo.ctaVariant || 'default'} size="lg" asChild>
    <Link
      href={currentVideo.ctaUrl}
      target={currentVideo.ctaOpenInNewTab ? '_blank' : undefined}
      rel={currentVideo.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
    >
      {currentVideo.ctaText}
    </Link>
  </Button>
)}
```

---

## 🔍 Why CTAs Might Not Appear

### 1. **Fields Hidden by Conditional Logic**

The CTA URL, Variant, and Open In New Tab fields are **conditionally displayed** based on whether CTA Text is filled:

```typescript
admin: {
  condition: (data: any) => Boolean(data?.ctaText),
}
```

**Solution:**
1. First fill in "CTA Button Text" (e.g., "Learn More")
2. Then the other CTA fields will appear automatically
3. Fill in "CTA Link URL" (required when text is present)

### 2. **Data Not Saved Yet**

The fields exist in the schema but haven't been populated with data.

**Solution:**
1. Open Payload CMS admin: `http://localhost:3000/admin`
2. Navigate to your Instrumental To Life block
3. Edit a video in the array
4. Scroll down to the CTA fields
5. Fill in **CTA Button Text** first (this reveals the other fields)
6. Fill in **CTA Link URL**
7. Choose button style and new tab option
8. Save the block

### 3. **Cached Data**

The frontend might be serving cached data without the CTA fields.

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear browser cache or open in incognito mode

# Restart dev server
bun run dev
```

### 4. **Database Not Updated**

If you had existing videos before adding the CTA fields, they won't have CTA data.

**Solution:**
- Edit each existing video and add CTA data manually
- OR delete and recreate videos with CTA data

---

## 🧪 Testing Steps

### Step 1: Verify Fields in CMS Admin

1. Start dev server: `bun run dev`
2. Open admin: `http://localhost:3000/admin`
3. Navigate to the page with Instrumental To Life block
4. Edit the block
5. Click into a video in the videos array
6. Scroll to the bottom - you should see:

```
☑️ CTA Button Text          [___________________]
   Optional call-to-action button text...

☑️ CTA Link URL             [___________________]  (shows after text is filled)
   Button destination URL...

☑️ CTA Button Style          [Default ▼]          (shows after text is filled)
   Visual style of the CTA button

☑️ Open Link in New Tab      [ ]                  (shows after text is filled)
   Check this to open the link...
```

### Step 2: Add Test Data

Fill in the fields:
- **CTA Button Text:** "Learn More"
- **CTA Link URL:** "/products/test"
- **CTA Button Style:** "Primary (Red background)"
- **Open Link in New Tab:** ✅ Checked

### Step 3: Save and View Frontend

1. Save the block
2. View the page on the frontend
3. Open browser console (F12)
4. Look for debug logs:

```
🎯 [I2L CTA Debug] {
  videoTitle: "Your Video Title",
  ctaText: "Learn More",
  ctaUrl: "/products/test",
  ctaVariant: "default",
  ctaOpenInNewTab: true,
  hasText: true,
  hasUrl: true,
  shouldShow: true
}
```

### Step 4: Verify Button Renders

The CTA button should appear:
- Below the video description
- With red background (if "default" variant)
- Labeled "Learn More"
- Clicking it navigates to `/products/test` in new tab

---

## 🐛 Debug Console Logs

I've added comprehensive debug logging to the frontend renderer. When in development mode, you'll see:

```javascript
console.log('🎯 [I2L CTA Debug]', {
  videoTitle: currentVideo.title,
  ctaText: currentVideo.ctaText,        // Should be your text
  ctaUrl: currentVideo.ctaUrl,          // Should be your URL
  ctaVariant: currentVideo.ctaVariant,  // Should be 'default' or 'outline'
  ctaOpenInNewTab: currentVideo.ctaOpenInNewTab, // Should be true/false
  hasText: !!currentVideo.ctaText,      // Should be true if filled
  hasUrl: !!currentVideo.ctaUrl,        // Should be true if filled
  shouldShow: !!(currentVideo.ctaText && currentVideo.ctaUrl), // Should be true to render
})
```

**What to look for:**
- If `ctaText` is `undefined` or `null` → Field not filled in CMS
- If `ctaUrl` is `undefined` or `null` → Field not filled in CMS
- If `shouldShow` is `false` → Button won't render (missing text or URL)
- If `shouldShow` is `true` but no button → Check CSS/styling issue

---

## 🎨 Button Styling

The CTA button uses these styles:

```tsx
<div className="mt-8 sm:mt-10">           {/* Margin top for spacing */}
  <Button
    variant="default"                      {/* Red background (kawai-red) */}
    size="lg"                              {/* Large button */}
    className="min-w-[180px] shadow-lg"   {/* Min width + shadow */}
  >
    <Link href={url} target="_blank">
      Learn More
    </Link>
  </Button>
</div>
```

**Variants:**
- `default` → Red background (`bg-primary` = `bg-kawai-red`)
- `outline` → White outline, transparent background

---

## ✅ Validation Rules

The block enforces these validation rules:

1. **CTA Text** is optional (can be empty to hide button)
2. **CTA URL** becomes **required** when CTA Text is provided
3. **CTA Variant** defaults to `'default'` if not specified
4. **Open In New Tab** defaults to `false` if not specified

Validation error example:
```
❌ CTA URL is required when CTA text is provided
```

This prevents creating buttons with text but no destination.

---

## 🔧 Quick Fixes

### Fix 1: Clear Everything and Rebuild
```bash
rm -rf .next
bun run payload generate:types
bun run dev
```

### Fix 2: Check Field Visibility
In CMS admin, ensure:
1. CTA Button Text is filled first
2. Other fields appear after text is entered
3. Save after filling all fields

### Fix 3: Verify Data in Database
If you have MongoDB access:
```javascript
// Check if video has CTA fields
db.pages.findOne({ "blocks.blockType": "marketing-i2l" })
// Look for: blocks[].videos[].ctaText, ctaUrl, etc.
```

### Fix 4: Test with Fresh Block
1. Delete existing Instrumental To Life block
2. Create new one from scratch
3. Add video with CTA fields
4. Save and test

---

## 📋 Checklist

- [ ] **Backend**: Fields defined in `InstrumentalToLife.ts` ✅
- [ ] **Types**: Generated in `payload-types.ts` ✅
- [ ] **Frontend**: Renderer uses correct field names ✅
- [ ] **Admin**: Can see CTA fields when editing video
- [ ] **Admin**: CTA URL field appears after filling CTA Text
- [ ] **Admin**: Can save video with CTA data
- [ ] **Frontend**: Console shows debug logs with CTA data
- [ ] **Frontend**: Button renders below video description
- [ ] **Frontend**: Button has correct text and styling
- [ ] **Frontend**: Clicking button navigates to correct URL
- [ ] **Frontend**: New tab option works correctly

---

## 📞 Next Steps

If CTAs still don't show after following this guide:

1. **Share console debug output** - Open browser console and share the 🎯 debug logs
2. **Share screenshot of CMS admin** - Show the video edit screen with CTA fields
3. **Check payload-types.ts** - Verify the interface includes CTA fields
4. **Test in incognito** - Rule out browser cache issues

The implementation is correct, so the issue is likely:
- Fields not filled with data yet
- Conditional fields hidden (fill CTA Text first)
- Cache serving old data without CTA fields
