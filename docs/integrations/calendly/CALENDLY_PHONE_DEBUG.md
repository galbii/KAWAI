# Calendly Phone Number Prefill Debugging Guide

## Quick Diagnosis

The code is **correctly implemented**. The issue is likely **Calendly event configuration**.

---

## Step-by-Step Debugging

### 1. Verify Data Collection

Open browser DevTools → Console tab → Submit the pre-form

**Look for these logs:**

```
✅ GOOD: You should see this
📝 Pre-form data collected: {
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  phone: "+1234567890"  ← Phone is here!
}
```

**If phone is missing** → Check `BookingPreForm.tsx` validation schema

---

### 2. Verify Data Transformation

**Look for these logs:**

```
✅ GOOD: CalendlyEmbedBlock
📋 [CalendlyEmbedBlock] Transformed prefill data: {
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  customAnswers: {
    a1: "+1234567890"  ← Phone mapped to a1!
  }
}
```

```
✅ GOOD: CalendlyBookingWidget
🔧 Built prefill object for Calendly: {
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "name": "John Doe",
  "customAnswers": {
    "a1": "+1234567890"  ← Phone mapped to a1!
  }
}
```

**If customAnswers is missing or empty** → Phone wasn't in prefillData

---

### 3. Check Calendly Event Configuration

**This is the most common issue!**

#### What is `a1`, `a2`, `a3`?

Calendly maps custom questions to numbered slots:
- `a1` = 1st custom question
- `a2` = 2nd custom question
- `a3` = 3rd custom question

**Our code assumes phone is the 1st custom question (`a1`).**

#### How to Check Your Calendly Event

1. Log into **Calendly.com**
2. Go to **Event Types** → Select your event
3. Click **Edit** → Scroll to **"What information do you need from invitees?"**
4. Check the order of **Custom Questions**

**Example Correct Configuration:**

```
Standard Questions:
✓ Name (required)
✓ Email (required)

Custom Questions:
1️⃣ Phone Number (Text field) ← This becomes `a1`
2️⃣ Company Name (Text field) ← This becomes `a2`
3️⃣ Additional Notes (Textarea) ← This becomes `a3`
```

**Example WRONG Configuration (Phone won't prefill):**

```
Standard Questions:
✓ Name (required)
✓ Email (required)

Custom Questions:
1️⃣ Company Name (Text field) ← This is `a1` (NOT phone!)
2️⃣ Phone Number (Text field) ← This is `a2` (code uses `a1`!)
3️⃣ Additional Notes (Textarea) ← This is `a3`
```

---

## Solutions

### Option 1: Reorder Calendly Questions (Recommended)

**Make phone the 1st custom question:**

1. Go to Calendly event settings
2. Drag "Phone Number" to be the **first custom question**
3. Save the event
4. Test again

### Option 2: Update Code to Match Your Question Order

If phone is the **2nd custom question** in Calendly, change the code:

**File: `src/components/blocks/CalendlyEmbedBlock.tsx` (Line 151)**

```typescript
// BEFORE (assumes phone is 1st question)
if (prefillData.phone) {
  prefill.customAnswers = {
    a1: prefillData.phone,  // ❌ Wrong if phone is 2nd question
  }
}

// AFTER (if phone is 2nd question)
if (prefillData.phone) {
  prefill.customAnswers = {
    a2: prefillData.phone,  // ✅ Correct for 2nd question
  }
}
```

**File: `src/components/pages/signature/CalendlyBookingWidget.tsx` (Line 347)**

```typescript
// BEFORE
if (prefillData.phone) {
  prefill.customAnswers = {
    a1: prefillData.phone  // ❌ Wrong if phone is 2nd question
  }
}

// AFTER
if (prefillData.phone) {
  prefill.customAnswers = {
    a2: prefillData.phone  // ✅ Correct for 2nd question
  }
}
```

### Option 3: Dynamic Question Mapping (Advanced)

If you have multiple Calendly events with different question orders, you can make it configurable:

**Add to block definition:**

```typescript
{
  name: 'phoneQuestionPosition',
  type: 'select',
  label: 'Phone Question Position',
  defaultValue: 'a1',
  options: [
    { label: '1st Question (a1)', value: 'a1' },
    { label: '2nd Question (a2)', value: 'a2' },
    { label: '3rd Question (a3)', value: 'a3' },
    { label: '4th Question (a4)', value: 'a4' },
  ],
  admin: {
    description: 'Which custom question is the phone number in your Calendly event?',
  },
}
```

---

## Common Issues

### Issue 1: Phone Question Doesn't Exist

**Symptom:** Phone field never appears in Calendly widget

**Solution:** Add a custom "Phone Number" question to your Calendly event:
1. Event Settings → Invitee Questions
2. Click "Add Custom Question"
3. Type: Text field
4. Label: "Phone Number"
5. Make it the **1st custom question**

### Issue 2: Phone Question is Optional

**Symptom:** Phone shows in Calendly but isn't required

**Solution:** In Calendly event settings, make the phone question **required**

### Issue 3: Wrong Field Type

**Symptom:** Phone prefills but looks wrong

**Calendly Field Types:**
- ✅ Use "Text field" for phone
- ❌ Don't use "Phone number" (may not support prefill)
- ❌ Don't use "Dropdown" or other types

### Issue 4: Special Characters in Phone

**Symptom:** Phone with `+1 (555) 123-4567` doesn't prefill

**Solution:** Calendly may strip formatting. Test with:
```
+15551234567     ← International format
(555) 123-4567   ← US format with parentheses
555-123-4567     ← US format with dashes
5551234567       ← Plain numbers
```

---

## Testing Checklist

- [ ] Console shows `phone` in pre-form data
- [ ] Console shows `customAnswers.a1` with phone value
- [ ] Calendly event has a phone custom question
- [ ] Phone question is at the correct position (1st = a1)
- [ ] Phone question is a "Text field" type
- [ ] Phone question matches the `a1` mapping in code
- [ ] Test with different phone formats

---

## Still Not Working?

### Enable Extended Debugging

Add this to **CalendlyBookingWidget.tsx** (after line 482):

```typescript
<InlineWidget
  url={buildCalendlyUrl()}
  styles={{...}}
  pageSettings={{...}}
  {...(prefillData && {
    prefill: (() => {
      const p = buildPrefillObject();
      console.log('🔍 FINAL PREFILL PASSED TO CALENDLY:', JSON.stringify(p, null, 2));
      console.log('🔍 prefillData.phone value:', prefillData?.phone);
      console.log('🔍 customAnswers object:', p?.customAnswers);
      return p;
    })()
  })}
/>
```

### Check Calendly Limitations

Some Calendly plans may not support custom answer prefilling:
- **Free Plan:** Limited prefill support
- **Essentials:** Should support prefilling
- **Professional/Teams:** Full prefill support

Check: https://help.calendly.com/hc/en-us/articles/360054127753

---

## Quick Fix Summary

**Most likely issue:** Phone is NOT the 1st custom question in Calendly.

**Quick fix:**
1. Go to Calendly event settings
2. Make "Phone Number" the **1st custom question**
3. Save and test

**That's it!** 🎉
