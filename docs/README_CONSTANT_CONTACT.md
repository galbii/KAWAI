# Constant Contact Integration - Quick Reference

> **✅ STATUS**: FULLY OPERATIONAL  
> **📅 Date**: September 11, 2025

## 🎯 What This Integration Does

Your KAWAI piano website contact form automatically adds all submissions to your **"SHOWROOM KAWAI"** mailing list in Constant Contact using the official API v3.

## ⚡ Quick Facts

- **List**: SHOWROOM KAWAI  
- **List ID**: `40d1d690-8d9d-11f0-9bdc-fa163ea70839`
- **Integration**: Next.js Server Actions + Constant Contact API v3
- **Authentication**: OAuth2 with automatic token refresh
- **Fallback**: Forms work even if Constant Contact fails

## 🧪 Test Your Integration

```bash
# Test the contact form (this endpoint stays active)
curl -X POST http://localhost:3000/api/test-contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "phone": "555-123-4567",
    "preferredContact": "email",
    "inquiryType": "general",
    "subscribeToUpdates": true
  }'
```

**Expected Response**: 
```json
{
  "success": true,
  "message": "Test contact submission successful",
  "details": {
    "success": true,
    "message": "Thank you for your message! We'll get back to you within 24 hours."
  }
}
```

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/actions/contact-form.ts` | **Main server action** | ✅ Active |
| `src/components/contact/LocationContactForm.tsx` | **Contact form component** | ✅ Active |
| `src/app/api/test-contact/route.ts` | **Testing endpoint** | ✅ Active |
| `docs/CONSTANT_CONTACT_INTEGRATION.md` | **Complete documentation** | 📚 Reference |

## 🔒 Security Notes

**🚫 Setup endpoints have been disabled** for security:
- `/api/constant-contact/lists` → 403 Forbidden
- `/api/constant-contact/find-list-by-name` → 403 Forbidden  
- `/api/constant-contact/refresh-and-lists` → 403 Forbidden
- `/api/constant-contact/reauth` → 403 Forbidden

**✅ Production endpoints remain active**:
- `/api/test-contact` → For testing contact forms
- Contact form server actions → For live website forms

## ⚙️ Configuration

**Environment Variables** (`.env.local`):
```bash
CONSTANT_CONTACT_CLIENT_ID=3561b5f4-c8b5-473a-a5c4-939c195f0569
CONSTANT_CONTACT_CLIENT_SECRET=fMhjSGYhFgZtr1J2lZGcWg  
CONSTANT_CONTACT_REFRESH_TOKEN=vvPxarV3RkCOEzaNA25H-mJ-mD7x5VeZEmPiwOYa4ZA
CONSTANT_CONTACT_DEFAULT_LIST_ID=40d1d690-8d9d-11f0-9bdc-fa163ea70839
```

## 🚨 Maintenance

**Monthly**: Test contact form using the `/api/test-contact` endpoint

**Every 6 months**: Check if refresh token needs renewal (you'll see authentication errors if so)

**Reference Documentation**: `docs/CONSTANT_CONTACT_INTEGRATION.md` - Complete setup, troubleshooting, and future development guide

---

**🎹 Your piano website contact form integration is complete and production-ready!**