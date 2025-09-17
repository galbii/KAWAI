# Constant Contact v3 API Integration

Complete TypeScript integration for Constant Contact v3 API with OAuth 2.0 authentication, automatic token management, and React components.

## Features

- ✅ **OAuth 2.0 Flow** - Secure authentication with automatic token refresh
- ✅ **Rate Limiting** - Built-in rate limiting (40 requests per 10 seconds)
- ✅ **Type Safety** - Full TypeScript support with proper interfaces
- ✅ **Error Handling** - Comprehensive error handling and validation
- ✅ **React Components** - Ready-to-use form components and hooks
- ✅ **List Management** - Complete contact list CRUD operations
- ✅ **Contact Management** - Create, update, and retrieve contacts

## Setup

### 1. Environment Variables

Add these variables to your `.env.local`:

```bash
CONSTANT_CONTACT_CLIENT_ID=your-client-id
CONSTANT_CONTACT_CLIENT_SECRET=your-client-secret
CONSTANT_CONTACT_REDIRECT_URI=http://localhost:3000/api/auth/constantcontact/callback
NEXT_PUBLIC_CONSTANT_CONTACT_REDIRECT_URI=http://localhost:3000/api/auth/constantcontact/callback
```

### 2. Test the Integration

Visit `/constantcontact-demo` to test the complete integration:
1. OAuth authentication flow
2. List retrieval and display
3. Contact form submission

## Usage

### Basic Contact Form

```tsx
import { ConstantContactForm } from '@/components/forms/ConstantContactForm';

export default function MyPage() {
  return (
    <ConstantContactForm
      onSuccess={(data) => console.log('Success:', data)}
      onError={(error) => console.error('Error:', error)}
      preSelectedLists={['list-id-1', 'list-id-2']}
      title="Subscribe to Our Newsletter"
    />
  );
}
```

### Using the Hook

```tsx
import { useConstantContact } from '@/hooks/useConstantContact';

export default function MyComponent() {
  const {
    isAuthenticated,
    lists,
    createContact,
    startOAuthFlow
  } = useConstantContact();

  const handleSubmit = async (formData) => {
    const success = await createContact({
      email_address: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      list_ids: formData.selectedLists
    });

    if (success) {
      console.log('Contact created successfully!');
    }
  };

  if (!isAuthenticated) {
    return <button onClick={startOAuthFlow}>Connect to Constant Contact</button>;
  }

  return (
    <div>
      <h3>Available Lists ({lists.length})</h3>
      {lists.map(list => (
        <div key={list.value}>{list.label}</div>
      ))}
    </div>
  );
}
```

### Direct API Usage

```tsx
import {
  createConstantContactClient,
  ConstantContactListManager,
  MemoryTokenStorage
} from '@/lib/constantcontact';

// Create client
const tokenStorage = new MemoryTokenStorage();
const client = createConstantContactClient(tokenStorage);
const listManager = new ConstantContactListManager(client);

// Get all lists
const listsResponse = await listManager.getAllLists();
if (listsResponse.success) {
  console.log('Lists:', listsResponse.data.lists);
}

// Create contact
const contactResponse = await listManager.createContact({
  email_address: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  list_ids: ['list-id-1']
});
```

## API Routes

The integration provides these API endpoints:

### Authentication
- `GET /api/auth/constantcontact/authorize` - Start OAuth flow
- `GET /api/auth/constantcontact/callback` - Handle OAuth callback

### Lists
- `GET /api/constantcontact/lists` - Get all contact lists
- `POST /api/constantcontact/lists` - Create a new list

### Contacts
- `POST /api/constantcontact/contacts` - Create/update contact
- `GET /api/constantcontact/contacts?email=...` - Get contact by email
- `GET /api/constantcontact/contacts?list_id=...` - Get contacts in list

## Architecture

### Core Classes

- **`ConstantContactAuth`** - Handles OAuth 2.0 flow and token management
- **`ConstantContactClient`** - HTTP client with rate limiting and error handling
- **`ConstantContactListManager`** - High-level operations for lists and contacts

### Token Storage

The integration uses a `TokenStorage` interface for flexibility:

```tsx
interface TokenStorage {
  store(tokens: ConstantContactTokens): Promise<void>;
  retrieve(): Promise<ConstantContactTokens | null>;
  clear(): Promise<void>;
}
```

**Current Implementation**: `MemoryTokenStorage` (for demo/development)
**Production**: Implement database or encrypted session storage

### Rate Limiting

Built-in rate limiter respects Constant Contact's limits:
- **40 requests per 10 seconds**
- Automatic waiting when limit reached
- Retry logic for 429 responses

## Production Considerations

### 1. Token Storage

Replace `MemoryTokenStorage` with persistent storage:

```tsx
// Example: Database token storage
class DatabaseTokenStorage implements TokenStorage {
  async store(tokens: ConstantContactTokens): Promise<void> {
    await db.constantContactTokens.upsert({
      where: { userId: this.userId },
      update: tokens,
      create: { userId: this.userId, ...tokens }
    });
  }

  async retrieve(): Promise<ConstantContactTokens | null> {
    const record = await db.constantContactTokens.findUnique({
      where: { userId: this.userId }
    });
    return record || null;
  }

  async clear(): Promise<void> {
    await db.constantContactTokens.delete({
      where: { userId: this.userId }
    });
  }
}
```

### 2. Error Monitoring

Add error tracking for production:

```tsx
import { logger } from '@/lib/logger';

// In API routes
catch (error) {
  logger.error('Constant Contact API error', {
    error: error.message,
    endpoint: request.url,
    userId: session?.user?.id
  });
}
```

### 3. Security

- Use HTTPS in production
- Validate redirect URIs
- Implement CSRF protection
- Store tokens encrypted
- Audit API usage

## Troubleshooting

### Common Issues

1. **"Not authenticated" errors**
   - Check OAuth flow completion
   - Verify environment variables
   - Check token expiration

2. **Rate limit errors**
   - Built-in handling should manage this
   - Check for rapid successive calls

3. **Invalid redirect URI**
   - Ensure redirect URI matches exactly in Constant Contact app settings
   - Check URL encoding

### Debug Mode

Enable debug logging:

```tsx
// In API routes
if (process.env.NODE_ENV === 'development') {
  console.log('Constant Contact Debug:', {
    isAuthenticated,
    listsCount: lists.length,
    rateLimitStatus: client.getRateLimitStatus()
  });
}
```

## Files Structure

```
src/lib/constantcontact/
├── auth.ts              # OAuth and token management
├── client.ts            # HTTP client with rate limiting
├── lists.ts             # List and contact management
├── index.ts             # Centralized exports
└── README.md            # This file

src/app/api/
├── auth/constantcontact/
│   ├── authorize/route.ts    # OAuth start
│   └── callback/route.ts     # OAuth callback
└── constantcontact/
    ├── lists/route.ts        # Lists API
    └── contacts/route.ts     # Contacts API

src/components/forms/
└── ConstantContactForm.tsx   # React form component

src/hooks/
└── useConstantContact.ts     # React hook

src/app/constantcontact-demo/
└── page.tsx                  # Demo/testing page
```

## Contributing

When modifying this integration:

1. **Maintain type safety** - All functions should have proper TypeScript interfaces
2. **Handle errors gracefully** - Always provide meaningful error messages
3. **Test OAuth flow** - Verify authentication works end-to-end
4. **Update documentation** - Keep this README current
5. **Consider rate limits** - Don't make unnecessary API calls

## API Documentation

- [Constant Contact v3 API Docs](https://developer.constantcontact.com/api_guide/index.html)
- [OAuth 2.0 Flow](https://developer.constantcontact.com/api_guide/auth_overview.html)
- [Rate Limits](https://developer.constantcontact.com/api_guide/api_limits.html)