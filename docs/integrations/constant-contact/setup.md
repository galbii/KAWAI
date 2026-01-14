# Constant Contact API Integration Setup Guide

This guide explains how to set up Constant Contact API v3 integration for your contact form submissions.

## Overview

The integration allows your contact forms to automatically:
- Add contacts to your Constant Contact account
- Subscribe users to email lists (with consent)
- Store contact preferences and form data as custom fields
- Handle form submissions securely via Next.js server actions

## Prerequisites

1. **Constant Contact Account**: You need an active Constant Contact account
2. **Developer Access**: Access to Constant Contact's Developer Portal
3. **Next.js App**: Your KAWAI piano website with the server action implementation

## Step 1: Create a Constant Contact App

### 1.1 Access the Developer Portal
1. Go to [Constant Contact Developer Portal](https://app.constantcontact.com/pages/dma/portal/)
2. Sign in with your Constant Contact account credentials
3. Navigate to "My Applications"

### 1.2 Create New Application
1. Click **"New Application"**
2. Fill out the application details:
   - **Application Name**: "KAWAI Piano Website Contact Forms"
   - **Description**: "Contact form integration for KAWAI piano dealer website"
   - **Website URL**: Your website domain (e.g., `https://yourdomain.com`)
   - **Redirect URI**: `https://yourdomain.com/api/auth/constant-contact/callback`

3. **Important**: Select the following scopes:
   - `contact_data` - Read and write contact data
   - `campaign_data` - Read campaign data (optional)
   - `account_read` - Read account information

4. Click **"Save"** to create your application

### 1.3 Get Application Credentials
After creating the app, you'll receive:
- **API Key** (Client ID)
- **App Secret** (Client Secret)

**⚠️ Important**: Keep these credentials secure and never commit them to your repository.

## Step 2: OAuth2 Authorization Flow

Since Constant Contact requires OAuth2, you need to complete the authorization flow to get a refresh token.

### 2.1 Authorization URL
Create an authorization URL with your credentials:

```
https://idfed.constantcontact.com/as/authorization.oauth2?client_id=YOUR_CLIENT_ID&scope=contact_data&response_type=code&redirect_uri=YOUR_REDIRECT_URI
```

Replace:
- `YOUR_CLIENT_ID` with your API Key
- `YOUR_REDIRECT_URI` with the redirect URI from Step 1.2

### 2.2 Complete Authorization
1. Visit the authorization URL in your browser
2. Log in to your Constant Contact account
3. Grant permissions to your application
4. You'll be redirected to your redirect URI with an authorization `code`

### 2.3 Exchange Code for Tokens
Use the authorization code to get your access and refresh tokens:

```bash
curl -X POST https://idfed.constantcontact.com/as/token.oauth2 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=YOUR_AUTH_CODE&redirect_uri=YOUR_REDIRECT_URI"
```

The response will include:
- `access_token` (expires in 24 hours)
- `refresh_token` (use this to get new access tokens)

**⚠️ Store the `refresh_token` securely** - this is what your server action will use.

## Step 3: Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# Constant Contact API Configuration
CONSTANT_CONTACT_CLIENT_ID=your-api-key-here
CONSTANT_CONTACT_CLIENT_SECRET=your-app-secret-here
CONSTANT_CONTACT_REFRESH_TOKEN=your-refresh-token-here
CONSTANT_CONTACT_DEFAULT_LIST_ID=1
```

### Getting Your List ID
To find your default list ID:

```bash
curl -X GET "https://api.cc.email/v3/contact_lists" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

Use the ID of the list where you want new contacts to be added.

## Step 4: Set Up Custom Fields (Optional)

To store additional form data, create custom fields in Constant Contact:

### 4.1 Via Constant Contact UI
1. Log in to your Constant Contact account
2. Go to **Contacts** > **Custom Fields**
3. Create these fields:
   - `preferred_contact_method` (Text)
   - `inquiry_type` (Text)  
   - `piano_interest` (Text)
   - `best_time_to_call` (Text)
   - `message` (Text Area)

### 4.2 Via API (Advanced)
```bash
curl -X POST "https://api.cc.email/v3/contact_custom_fields" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "preferred_contact_method",
    "label": "Preferred Contact Method",
    "type": "string"
  }'
```

## Step 5: Test the Integration

### 5.1 Test Form Submission
1. Start your Next.js development server: `bun run dev`
2. Navigate to your contact page
3. Fill out and submit the contact form
4. Check your server logs for success/error messages

### 5.2 Verify in Constant Contact
1. Log in to your Constant Contact account
2. Go to **Contacts**
3. Check if the new contact was added
4. Verify custom fields contain the form data

## Step 6: Production Deployment

### 6.1 Environment Variables
Ensure all environment variables are set in your production environment:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Build & Deploy > Environment Variables
- Other platforms: Follow platform-specific documentation

### 6.2 Update Redirect URI
Update your Constant Contact app's redirect URI to use your production domain.

### 6.3 Security Checklist
- [ ] Environment variables are set securely
- [ ] Refresh token is not exposed in client-side code
- [ ] Error handling prevents sensitive data leakage
- [ ] HTTPS is enabled on production domain

## Troubleshooting

### Common Issues

#### 1. "Authentication failed with Constant Contact API"
- **Cause**: Invalid or expired refresh token
- **Solution**: Re-run the OAuth flow (Step 2) to get a new refresh token

#### 2. "Missing Constant Contact API credentials"
- **Cause**: Environment variables not set correctly
- **Solution**: Verify all required environment variables are present

#### 3. "Constant Contact API error: 400"
- **Cause**: Invalid request format or missing required fields
- **Solution**: Check the contact data format in the server action

#### 4. "Contact already exists" errors
- **Cause**: Constant Contact prevents duplicate email addresses
- **Solution**: The API will update existing contacts instead of creating duplicates

### Debug Mode
Enable debug logging by adding to your server action:

```typescript
console.log('Constant Contact payload:', JSON.stringify(constantContactPayload, null, 2));
```

### API Rate Limits
Constant Contact has rate limits:
- **10,000 requests per day**
- **4 requests per second**

The server action handles these automatically with proper error handling.

## Advanced Configuration

### Multiple Lists
To add contacts to different lists based on inquiry type:

```typescript
// In your server action, modify the list_memberships based on inquiry type
const listMappings = {
  'piano-consultation': process.env.CONSTANT_CONTACT_CONSULTATION_LIST_ID,
  'service': process.env.CONSTANT_CONTACT_SERVICE_LIST_ID,
  'general': process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID,
};

constantContactPayload.list_memberships = [
  listMappings[contactData.inquiryType] || process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID
];
```

### Email Notifications
To send immediate notifications to your team when forms are submitted, integrate with services like:
- **Resend**: Professional email service
- **SendGrid**: Enterprise email platform  
- **AWS SES**: Amazon's email service

## Support

### Constant Contact Support
- **API Documentation**: https://developer.constantcontact.com/
- **Support Email**: webservices@constantcontact.com
- **Developer Community**: Constant Contact Developer Community

### Integration Support
- Check server logs for detailed error messages
- Verify OAuth tokens haven't expired
- Test API endpoints manually using curl or Postman

---

**✅ Setup Complete**: Your contact form now integrates with Constant Contact API v3, automatically adding leads to your email marketing platform while maintaining compliance and user preferences.