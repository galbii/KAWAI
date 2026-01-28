# Storefront Promotional Popup - Debug Guide

## Fixes Applied

### 1. **Fixed useModal Dependency Array Bug** ✅
**File**: `src/hooks/useModal.ts`
**Problem**: The useEffect had an incorrect dependency array that used `autoShow?.delay` and `autoShow?.storageKey` instead of the full `autoShow` object, creating a stale closure.
**Fix**: Changed dependencies to `[autoShow, onOpen]` to properly track the entire object.

### 2. **Added Comprehensive Debugging** ✅
Added console.log statements throughout the flow:
- `[StorefrontContent]` - CMS settings and configuration
- `[SimpleCustomerSignup]` - Component mount, props, and state changes
- `[useModal]` - Auto-show logic, timers, and localStorage checks

---

## Testing Steps

### Step 1: Clear Browser Storage
Before testing, clear localStorage to reset the "already shown" flag:

**Option A: Using Browser DevTools**
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** → `http://localhost:3000`
4. Look for keys like `signup-modal-st-louis`
5. Delete them or click "Clear All"

**Option B: Using Console**
```javascript
// In browser console
localStorage.clear()
// Or remove specific key
localStorage.removeItem('signup-modal-st-louis')
```

### Step 2: Check Browser Console
1. Open DevTools Console tab
2. Refresh the storefront page
3. Look for debug logs in this order:

**Expected Console Output**:
```
[StorefrontContent] Signup modal config for st-louis {
  hasSignupModalSettings: true/false,
  isModalEnabled: true/false,
  enabled: true/undefined,
  showDelay: 1000/undefined,
  title: "Stay Connected"/undefined,
  storageKey: "signup-modal-st-louis"
}

[SimpleCustomerSignup] Component mounted with props: {
  storefrontSlug: "st-louis",
  showDelay: 1000,
  storageKey: "signup-modal-st-louis",
  title: "Stay Connected",
  ...
}

[SimpleCustomerSignup] autoShowConfig created: {
  delay: 1000,
  storageKey: "signup-modal-st-louis"
}

[useModal] Auto-show configured: {
  delay: 1000,
  storageKey: "signup-modal-st-louis"
}

[useModal] Modal not previously shown, will auto-show after delay

[useModal] Setting timer to show modal in 1000ms

[useModal] Timer fired, opening modal

[SimpleCustomerSignup] isOpen changed to: true
```

### Step 3: Verify CMS Configuration

**Go to Payload CMS Admin**:
1. Navigate to `http://localhost:3000/admin`
2. Go to **Storefronts** collection
3. Edit the storefront (e.g., "St. Louis")
4. Click on **Promotions** tab

**Check these settings**:
- ✅ **Enable Signup Modal Popup**: Should be checked (enabled)
- ✅ **Show Delay**: Should be set (e.g., 1000 = 1 second)
- ✅ **Title**: Should have text (default: "Stay Connected")
- ✅ **Description**: Should have text
- ✅ **Submit Button Text**: Should have text (default: "Sign Up")

**If these fields are empty/undefined**:
The component will use default values from `SimpleCustomerSignup.tsx`:
- `title`: 'Stay Connected'
- `description`: 'Sign up to receive updates about our piano collection and exclusive offers.'
- `submitButtonText`: 'Sign Up'
- `showDelay`: 1000 (ms)

---

## Troubleshooting

### Issue: Modal Never Appears

**Check 1: Is the component rendering?**
Look for `[SimpleCustomerSignup] Component mounted` in console.
- ❌ **Not present**: Component is not rendering. Check `isModalEnabled` in `[StorefrontContent]` log.
- ✅ **Present**: Component is rendering. Continue to Check 2.

**Check 2: Is auto-show configured?**
Look for `[useModal] Auto-show configured` in console.
- ❌ **Not present**: `autoShow` is undefined. Check `autoShowConfig` log.
- ✅ **Present**: Auto-show is configured. Continue to Check 3.

**Check 3: Is localStorage blocking?**
Look for `[useModal] Modal already shown (localStorage check), skipping auto-show`.
- ✅ **Present**: Modal was previously shown. Clear localStorage and refresh.
- ❌ **Not present**: Continue to Check 4.

**Check 4: Does timer fire?**
Look for `[useModal] Timer fired, opening modal` after the delay.
- ❌ **Not present**: Timer was cancelled or component unmounted. Check for errors.
- ✅ **Present**: Timer fired. Continue to Check 5.

**Check 5: Does isOpen change?**
Look for `[SimpleCustomerSignup] isOpen changed to: true`.
- ❌ **Not present**: State update failed. Check React DevTools.
- ✅ **Present**: State updated but modal not visible. Check CSS/z-index.

### Issue: Modal Shows Every Time (Doesn't Remember "Already Shown")

**Check**: localStorage is being saved when modal closes.
1. Open the modal
2. Close it
3. Look for `[useModal] Saving to localStorage: signup-modal-st-louis`
4. Check localStorage in DevTools - should see key with value `"true"`

**If not saving**:
- Check browser privacy settings (localStorage may be blocked)
- Check if `storageKey` is undefined in props

### Issue: "isModalEnabled is false"

This means the CMS has `signupModal.enabled` set to `false`.

**Fix**:
1. Go to CMS → Storefronts → Edit storefront
2. Go to **Promotions** tab
3. Check **"Enable Signup Modal Popup"** checkbox
4. Click **Save**
5. Refresh the storefront page

### Issue: "hasSignupModalSettings is false"

This means the storefront document doesn't have the `signupModal` field group.

**Fix**:
1. This storefront was created before the Promotions feature was added
2. Go to CMS → Edit storefront → **Promotions** tab
3. Configure the settings (even just enabling it will create the field)
4. Click **Save**

---

## Expected Behavior

### First Visit
1. Page loads
2. Wait `showDelay` milliseconds (default 1000ms = 1 second)
3. Modal slides up from bottom (mobile) or fades in center (desktop)
4. User can:
   - Fill out form and submit
   - Close modal (X button, ESC key, or click outside)

### After Closing Modal
1. Modal saves to localStorage: `signup-modal-{slug}: "true"`
2. On refresh or return visit, modal does NOT show again
3. To show again: Clear localStorage

### Without storageKey
If no `storageKey` is provided:
- Modal shows every visit (no persistence)
- Useful for testing

---

## How to Disable Modal for Testing

**Temporary (This Session)**:
```javascript
// In browser console
localStorage.setItem('signup-modal-st-louis', 'true')
```

**Permanent (CMS)**:
1. Go to Admin → Storefronts → Edit
2. Promotions tab
3. Uncheck **"Enable Signup Modal Popup"**
4. Save

---

## Console Logs Cheat Sheet

| Log Message | Meaning |
|-------------|---------|
| `[StorefrontContent] Signup modal config` | CMS settings loaded |
| `[SimpleCustomerSignup] Component mounted` | Client component rendered |
| `[SimpleCustomerSignup] autoShowConfig created` | Config memoized |
| `[useModal] Auto-show configured` | useModal received config |
| `[useModal] Modal already shown` | localStorage blocked auto-show |
| `[useModal] Modal not previously shown` | Auto-show will proceed |
| `[useModal] Setting timer` | setTimeout started |
| `[useModal] Timer fired` | setTimeout completed, opening modal |
| `[SimpleCustomerSignup] isOpen changed to: true` | State updated, modal should be visible |
| `[SimpleCustomerSignup] Closing modal` | User closed modal |
| `[useModal] Closing modal` | Close handler called |
| `[useModal] Saving to localStorage` | Marking as shown for future visits |

---

## Removing Debug Logs (Production)

Once the issue is resolved, remove debug console.log statements from:
1. `src/app/(frontend)/store/[storeslug]/page.tsx` (line ~291-300)
2. `src/components/forms/SimpleCustomerSignup.tsx` (lines with `console.log`)
3. `src/hooks/useModal.ts` (lines with `console.log`)

**Search & Replace**:
```bash
# Find all debug logs
grep -r "console.log.*useModal\|SimpleCustomerSignup\|StorefrontContent" src/
```

---

## Testing on Different Storefronts

Each storefront has its own localStorage key:
- `/store/st-louis` → `signup-modal-st-louis`
- `/store/dallas` → `signup-modal-dallas`
- `/store/chicago` → `signup-modal-chicago`

You can test different configurations on different storefronts.

---

## Next Steps

1. ✅ Clear localStorage
2. ✅ Open browser console
3. ✅ Visit a storefront page (e.g., `/store/st-louis`)
4. ✅ Watch console logs appear
5. ✅ Wait for modal to appear after delay
6. ✅ Test closing and reopening (localStorage persistence)

If modal still doesn't appear after following this guide, share the **exact console output** for further debugging.
