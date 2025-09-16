# Constant Contact v3 API Integration Guide

> Comprehensive guide for integrating Constant Contact v3 API for contact management, list management, and email marketing automation

## 🚀 Overview

The Constant Contact v3 API is a RESTful API that provides contact management, email campaign functionality, and marketing automation. This guide covers integration with Next.js 15 applications.

### Key Features
- ✅ **OAuth2 Authentication** - Secure API access
- ✅ **Contact Management** - Create, update, and manage contacts
- ✅ **List Management** - Organize contacts into targeted lists
- ✅ **Email Campaigns** - Send and manage email marketing campaigns
- ✅ **Custom Fields** - Up to 100 custom fields per account
- ✅ **Real-time Statistics** - Campaign performance metrics
- ✅ **99.99% Uptime** - Reliable service

## 📋 Prerequisites

### 1. Constant Contact Account Setup
1. Create a Constant Contact account at [constantcontact.com](https://constantcontact.com)
2. Navigate to [Constant Contact Developer Portal](https://developer.constantcontact.com/)
3. Create a new application to get your API credentials

### 2. Environment Variables Setup
Add these to your `.env.local` file:

```bash
# Constant Contact API Configuration
CONSTANT_CONTACT_API_KEY=your_api_key_here
CONSTANT_CONTACT_CLIENT_SECRET=your_client_secret_here
CONSTANT_CONTACT_REDIRECT_URI=http://localhost:3000/api/auth/constantcontact/callback
CONSTANT_CONTACT_ACCESS_TOKEN=your_access_token_here
CONSTANT_CONTACT_REFRESH_TOKEN=your_refresh_token_here

# Optional: Base URL (defaults to https://api.cc.email/v3)
CONSTANT_CONTACT_BASE_URL=https://api.cc.email/v3
```

## 🔐 Authentication Setup

### OAuth2 Flow Implementation

Create an authentication utility at `src/lib/constantcontact/auth.ts`:

```typescript
interface ConstantContactConfig {
  apiKey: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export class ConstantContactAuth {
  private config: ConstantContactConfig;

  constructor() {
    this.config = {
      apiKey: process.env.CONSTANT_CONTACT_API_KEY!,
      clientSecret: process.env.CONSTANT_CONTACT_CLIENT_SECRET!,
      redirectUri: process.env.CONSTANT_CONTACT_REDIRECT_URI!,
      baseUrl: process.env.CONSTANT_CONTACT_BASE_URL || 'https://api.cc.email/v3'
    };
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.apiKey,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'campaign_data contact_data offline_access',
      state: state || Math.random().toString(36).substring(7)
    });

    return `https://authz.constantcontact.com/oauth2/default/v1/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const response = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
```

### API Route for OAuth Callback

Create `src/app/api/auth/constantcontact/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ConstantContactAuth } from '@/lib/constantcontact/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: 'Authorization failed' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  try {
    const auth = new ConstantContactAuth();
    const tokens = await auth.exchangeCodeForToken(code);

    // Store tokens securely (in database, encrypted storage, etc.)
    // For development, you can log them and manually add to .env.local
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    return NextResponse.json({
      message: 'Authorization successful',
      // Don't return tokens in production - store them securely
      tokens: process.env.NODE_ENV === 'development' ? tokens : undefined
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}
```

## 📧 Core API Client

Create `src/lib/constantcontact/client.ts`:

```typescript
interface Contact {
  contact_id?: string;
  email_address: {
    address: string;
    permission_to_send: 'implicit' | 'explicit' | 'not_set';
  };
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company_name?: string;
  phone_numbers?: Array<{
    phone_number: string;
    kind: 'home' | 'work' | 'mobile' | 'other';
  }>;
  street_addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: 'US' | 'CA';
  }>;
  list_memberships?: string[];
  birthday_month?: number;
  birthday_day?: number;
  anniversary?: string;
  custom_fields?: Array<{
    custom_field_id: string;
    value: string;
  }>;
}

interface ContactList {
  list_id?: string;
  name: string;
  description?: string;
  favorite?: boolean;
  membership_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface EmailCampaign {
  campaign_id?: string;
  name: string;
  email_campaign_activities?: Array<{
    format_type: 'HTML' | 'XHTML';
    from_name: string;
    from_email: string;
    reply_to_email: string;
    subject: string;
    html_content?: string;
    text_content?: string;
  }>;
  type_code: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Various campaign types
  current_status?: 'Draft' | 'Scheduled' | 'Executing' | 'Done' | 'Error';
}

export class ConstantContactClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken?: string) {
    this.baseUrl = process.env.CONSTANT_CONTACT_BASE_URL || 'https://api.cc.email/v3';
    this.accessToken = accessToken || process.env.CONSTANT_CONTACT_ACCESS_TOKEN!;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  // ==========================================
  // CONTACT MANAGEMENT
  // ==========================================

  /**
   * Get all contacts with optional filtering
   */
  async getContacts(params?: {
    limit?: number;
    email?: string;
    status?: 'all' | 'active' | 'unsubscribed' | 'removed';
    lists?: string;
    updated_after?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/contacts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<{ contacts: Contact[] }>(endpoint);
  }

  /**
   * Get a specific contact by ID
   */
  async getContact(contactId: string, include?: string[]) {
    const searchParams = new URLSearchParams();
    if (include?.length) {
      searchParams.append('include', include.join(','));
    }

    const endpoint = `/contacts/${contactId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<Contact>(endpoint);
  }

  /**
   * Create a new contact
   */
  async createContact(contact: Contact) {
    return this.makeRequest<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  /**
   * Update an existing contact
   */
  async updateContact(contactId: string, contact: Partial<Contact>) {
    return this.makeRequest<Contact>(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactId: string) {
    return this.makeRequest(`/contacts/${contactId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // CONTACT LIST MANAGEMENT
  // ==========================================

  /**
   * Get all contact lists
   */
  async getContactLists(params?: {
    limit?: number;
    name?: string;
    status?: 'all' | 'active' | 'hidden';
    favorite?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/contact_lists${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<{ lists: ContactList[] }>(endpoint);
  }

  /**
   * Get a specific contact list
   */
  async getContactList(listId: string) {
    return this.makeRequest<ContactList>(`/contact_lists/${listId}`);
  }

  /**
   * Create a new contact list
   */
  async createContactList(list: Pick<ContactList, 'name' | 'description' | 'favorite'>) {
    return this.makeRequest<ContactList>('/contact_lists', {
      method: 'POST',
      body: JSON.stringify(list),
    });
  }

  /**
   * Update an existing contact list
   */
  async updateContactList(listId: string, list: Partial<ContactList>) {
    return this.makeRequest<ContactList>(`/contact_lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(list),
    });
  }

  /**
   * Delete a contact list
   */
  async deleteContactList(listId: string) {
    return this.makeRequest(`/contact_lists/${listId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get contacts in a specific list
   */
  async getContactsInList(listId: string, params?: {
    limit?: number;
    status?: 'all' | 'active' | 'unsubscribed' | 'removed';
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/contact_lists/${listId}/contacts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<{ contacts: Contact[] }>(endpoint);
  }

  /**
   * Add contacts to a list
   */
  async addContactsToList(listId: string, contactIds: string[]) {
    return this.makeRequest(`/contact_lists/${listId}/contacts`, {
      method: 'POST',
      body: JSON.stringify({ contact_ids: contactIds }),
    });
  }

  /**
   * Remove contacts from a list
   */
  async removeContactsFromList(listId: string, contactIds: string[]) {
    return this.makeRequest(`/contact_lists/${listId}/contacts`, {
      method: 'DELETE',
      body: JSON.stringify({ contact_ids: contactIds }),
    });
  }

  // ==========================================
  // EMAIL CAMPAIGN MANAGEMENT
  // ==========================================

  /**
   * Get all email campaigns
   */
  async getEmailCampaigns(params?: {
    limit?: number;
    status?: 'All' | 'Draft' | 'Scheduled' | 'Executing' | 'Done' | 'Error';
    type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/emails${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<{ campaigns: EmailCampaign[] }>(endpoint);
  }

  /**
   * Get a specific email campaign
   */
  async getEmailCampaign(campaignId: string) {
    return this.makeRequest<EmailCampaign>(`/emails/${campaignId}`);
  }

  /**
   * Create a new email campaign
   */
  async createEmailCampaign(campaign: EmailCampaign) {
    return this.makeRequest<EmailCampaign>('/emails', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  /**
   * Update an existing email campaign
   */
  async updateEmailCampaign(campaignId: string, campaign: Partial<EmailCampaign>) {
    return this.makeRequest<EmailCampaign>(`/emails/${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify(campaign),
    });
  }

  /**
   * Delete an email campaign
   */
  async deleteEmailCampaign(campaignId: string) {
    return this.makeRequest(`/emails/${campaignId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Send/Schedule an email campaign
   */
  async scheduleEmailCampaign(campaignId: string, scheduleDate?: string) {
    const body = scheduleDate ? { scheduled_date: scheduleDate } : {};

    return this.makeRequest(`/emails/${campaignId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId: string) {
    return this.makeRequest(`/reports/email_reports/${campaignId}`);
  }
}
```

## 🛠️ Usage Examples

### Basic Contact Management

Create `src/lib/constantcontact/examples.ts`:

```typescript
import { ConstantContactClient } from './client';

export class ConstantContactExamples {
  private client: ConstantContactClient;

  constructor(accessToken?: string) {
    this.client = new ConstantContactClient(accessToken);
  }

  /**
   * Example: Business Interest List Management
   */
  async setupBusinessInterestLists() {
    try {
      // Create business-specific contact lists
      const businessLists = [
        { name: 'Product Interested', description: 'Customers interested in products' },
        { name: 'Service Interested', description: 'Customers interested in services' },
        { name: 'Newsletter Subscribers', description: 'General newsletter subscribers' },
        { name: 'VIP Customers', description: 'High-value customer prospects' },
        { name: 'Event Attendees', description: 'Event and webinar attendees' }
      ];

      const createdLists = [];
      for (const list of businessLists) {
        const created = await this.client.createContactList(list);
        createdLists.push(created);
        console.log(`Created list: ${created.name} (ID: ${created.list_id})`);
      }

      return createdLists;
    } catch (error) {
      console.error('Error setting up business interest lists:', error);
      throw error;
    }
  }

  /**
   * Example: Add customer from business inquiry form
   */
  async addBusinessInquiryContact(inquiryData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    inquiryType: 'product' | 'service' | 'support' | 'general';
    company?: string;
    message?: string;
  }) {
    try {
      // Determine appropriate lists based on inquiry type
      const lists = await this.client.getContactLists();
      const appropriateList = lists.lists.find(list =>
        list.name.toLowerCase().includes(inquiryData.inquiryType.toLowerCase())
      );

      const contact = {
        email_address: {
          address: inquiryData.email,
          permission_to_send: 'implicit' as const
        },
        first_name: inquiryData.firstName,
        last_name: inquiryData.lastName,
        company_name: inquiryData.company,
        phone_numbers: inquiryData.phone ? [{
          phone_number: inquiryData.phone,
          kind: 'mobile' as const
        }] : undefined,
        list_memberships: appropriateList ? [appropriateList.list_id!] : undefined,
        custom_fields: [
          { custom_field_id: 'inquiry_type', value: inquiryData.inquiryType },
          { custom_field_id: 'inquiry_message', value: inquiryData.message || '' }
        ].filter(field => field.value)
      };

      const createdContact = await this.client.createContact(contact);
      console.log(`Added contact: ${createdContact.email_address.address}`);

      return createdContact;
    } catch (error) {
      console.error('Error adding business inquiry contact:', error);
      throw error;
    }
  }

  /**
   * Example: Create product showcase email campaign
   */
  async createProductShowcaseCampaign(campaignData: {
    subject: string;
    productName: string;
    targetListId: string;
    htmlContent: string;
  }) {
    try {
      const campaign = {
        name: `Product Showcase - ${campaignData.productName}`,
        type_code: 1 as const, // Regular email campaign
        email_campaign_activities: [{
          format_type: 'HTML' as const,
          from_name: 'Your Company',
          from_email: 'info@yourcompany.com', // Replace with your email
          reply_to_email: 'info@yourcompany.com',
          subject: campaignData.subject,
          html_content: campaignData.htmlContent
        }]
      };

      const createdCampaign = await this.client.createEmailCampaign(campaign);
      console.log(`Created campaign: ${createdCampaign.name} (ID: ${createdCampaign.campaign_id})`);

      return createdCampaign;
    } catch (error) {
      console.error('Error creating product showcase campaign:', error);
      throw error;
    }
  }

  /**
   * Example: Automated birthday/anniversary campaigns
   */
  async createBirthdayAnniversaryCampaigns() {
    try {
      // Get contacts with birthdays this month
      const now = new Date();
      const contacts = await this.client.getContacts({
        status: 'active',
        limit: 1000
      });

      const birthdayContacts = contacts.contacts.filter(contact =>
        contact.birthday_month === now.getMonth() + 1
      );

      if (birthdayContacts.length > 0) {
        // Create birthday campaign
        const birthdayCampaign = {
          name: `Birthday Special - ${now.getFullYear()}-${now.getMonth() + 1}`,
          type_code: 1 as const,
          email_campaign_activities: [{
            format_type: 'HTML' as const,
            from_name: 'Your Company',
            from_email: 'info@yourcompany.com',
            reply_to_email: 'info@yourcompany.com',
            subject: '🎉 Happy Birthday! Special Offers Just for You',
            html_content: `
              <h1>Happy Birthday from Our Team!</h1>
              <p>Celebrate your special day with a special offer on our products and services.</p>
              <p>Visit our website for an exclusive 10% discount this month.</p>
              <a href="https://your-website.com" style="background: #1a365d; color: white; padding: 10px 20px; text-decoration: none;">View Our Offers</a>
            `
          }]
        };

        return await this.client.createEmailCampaign(birthdayCampaign);
      }

      return null;
    } catch (error) {
      console.error('Error creating birthday campaign:', error);
      throw error;
    }
  }
}
```

## 🏗️ Integration with Next.js API Routes

### Business Inquiry Form Handler

Create `src/app/api/contact/business-inquiry/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ConstantContactExamples } from '@/lib/constantcontact/examples';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.inquiryType) {
      return NextResponse.json(
        { error: 'Email and inquiry type are required' },
        { status: 400 }
      );
    }

    const constantContact = new ConstantContactExamples();

    // Add contact to Constant Contact
    const contact = await constantContact.addBusinessInquiryContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      inquiryType: data.inquiryType,
      company: data.company,
      message: data.message
    });

    return NextResponse.json({
      success: true,
      message: 'Contact added successfully',
      contactId: contact.contact_id
    });

  } catch (error) {
    console.error('Business inquiry API error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
```

### Newsletter Subscription Handler

Create `src/app/api/contact/newsletter/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ConstantContactClient } from '@/lib/constantcontact/client';

export async function POST(request: NextRequest) {
  try {
    const { email, interests = [] } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = new ConstantContactClient();

    // Get newsletter list
    const lists = await client.getContactLists({ name: 'Newsletter' });
    let newsletterList = lists.lists.find(list => list.name === 'Newsletter');

    if (!newsletterList) {
      // Create newsletter list if it doesn't exist
      newsletterList = await client.createContactList({
        name: 'Newsletter',
        description: 'General newsletter subscribers'
      });
    }

    // Create or update contact
    const contact = {
      email_address: {
        address: email,
        permission_to_send: 'explicit' as const
      },
      list_memberships: [newsletterList.list_id!],
      custom_fields: interests.length > 0 ? [{
        custom_field_id: 'interests',
        value: interests.join(', ')
      }] : undefined
    };

    const result = await client.createContact(contact);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
```

## 📊 Analytics and Automation

### Campaign Analytics

Create `src/lib/constantcontact/analytics.ts`:

```typescript
import { ConstantContactClient } from './client';

export class ConstantContactAnalytics {
  private client: ConstantContactClient;

  constructor(accessToken?: string) {
    this.client = new ConstantContactClient(accessToken);
  }

  /**
   * Get comprehensive campaign performance metrics
   */
  async getCampaignPerformance(campaignId: string) {
    try {
      const stats = await this.client.getCampaignStats(campaignId);

      return {
        campaign_id: campaignId,
        sent_count: stats.sent,
        open_count: stats.opens,
        click_count: stats.clicks,
        bounce_count: stats.bounces,
        unsubscribe_count: stats.unsubscribes,
        open_rate: (stats.opens / stats.sent * 100).toFixed(2),
        click_rate: (stats.clicks / stats.sent * 100).toFixed(2),
        bounce_rate: (stats.bounces / stats.sent * 100).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting campaign performance:', error);
      throw error;
    }
  }

  /**
   * Generate monthly performance report
   */
  async getMonthlyReport(year: number, month: number) {
    try {
      const campaigns = await this.client.getEmailCampaigns({
        status: 'Done',
        limit: 100
      });

      const monthlyData = [];

      for (const campaign of campaigns.campaigns) {
        if (campaign.campaign_id) {
          const performance = await this.getCampaignPerformance(campaign.campaign_id);
          monthlyData.push({
            campaign_name: campaign.name,
            ...performance
          });
        }
      }

      return {
        period: `${year}-${month.toString().padStart(2, '0')}`,
        total_campaigns: monthlyData.length,
        total_sent: monthlyData.reduce((sum, camp) => sum + parseInt(camp.sent_count || '0'), 0),
        total_opens: monthlyData.reduce((sum, camp) => sum + parseInt(camp.open_count || '0'), 0),
        total_clicks: monthlyData.reduce((sum, camp) => sum + parseInt(camp.click_count || '0'), 0),
        average_open_rate: (monthlyData.reduce((sum, camp) => sum + parseFloat(camp.open_rate || '0'), 0) / monthlyData.length).toFixed(2),
        average_click_rate: (monthlyData.reduce((sum, camp) => sum + parseFloat(camp.click_rate || '0'), 0) / monthlyData.length).toFixed(2),
        campaigns: monthlyData
      };
    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  }
}
```

## ⚡ Frontend Integration Examples

### React Hook for Contact Subscription

Create `src/hooks/useConstantContact.ts`:

```typescript
import { useState } from 'react';

interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  inquiryType?: string;
  company?: string;
  message?: string;
  interests?: string[];
}

export const useConstantContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBusinessInquiry = async (data: ContactData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact/business-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewsletter = async (email: string, interests?: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interests })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitBusinessInquiry,
    subscribeToNewsletter
  };
};
```

### Contact Form Component

Create `src/components/forms/BusinessInquiryForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useConstantContact } from '@/hooks/useConstantContact';

export function BusinessInquiryForm() {
  const { loading, error, submitBusinessInquiry } = useConstantContact();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    inquiryType: '',
    company: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitBusinessInquiry(formData);
      setSuccess(true);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        inquiryType: '',
        company: '',
        message: ''
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-green-800 font-semibold">Thank You!</h3>
        <p className="text-green-600">We've received your inquiry and will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          className="p-3 border rounded-lg"
        />
      </div>

      <input
        type="email"
        placeholder="Email Address *"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="text"
        placeholder="Company Name"
        value={formData.company}
        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
        className="w-full p-3 border rounded-lg"
      />

      <select
        value={formData.inquiryType}
        onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
        required
        className="w-full p-3 border rounded-lg"
      >
        <option value="">Select Inquiry Type *</option>
        <option value="product">Product Information</option>
        <option value="service">Service Inquiry</option>
        <option value="support">Technical Support</option>
        <option value="general">General Question</option>
      </select>

      <textarea
        placeholder="Tell us about your inquiry..."
        value={formData.message}
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        rows={4}
        className="w-full p-3 border rounded-lg"
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
```

## 🔧 Advanced Features

### Automated Segmentation

Create `src/lib/constantcontact/automation.ts`:

```typescript
import { ConstantContactClient } from './client';

export class ConstantContactAutomation {
  private client: ConstantContactClient;

  constructor(accessToken?: string) {
    this.client = new ConstantContactClient(accessToken);
  }

  /**
   * Automatically segment contacts based on behavior
   */
  async segmentContactsByInterest() {
    try {
      const contacts = await this.client.getContacts({ status: 'active', limit: 1000 });
      const lists = await this.client.getContactLists();

      // Find or create segment lists
      const segments = {
        product: lists.lists.find(l => l.name === 'Product Interested')?.list_id,
        service: lists.lists.find(l => l.name === 'Service Interested')?.list_id,
        newsletter: lists.lists.find(l => l.name === 'Newsletter Subscribers')?.list_id,
        vip: lists.lists.find(l => l.name === 'VIP Customers')?.list_id
      };

      for (const contact of contacts.contacts) {
        const interests = contact.custom_fields?.find(f => f.custom_field_id === 'inquiry_type')?.value;
        const customerType = contact.custom_fields?.find(f => f.custom_field_id === 'customer_type')?.value;

        // Segment by inquiry type
        if (interests?.includes('product') && segments.product && contact.contact_id) {
          await this.client.addContactsToList(segments.product, [contact.contact_id]);
        }
        if (interests?.includes('service') && segments.service && contact.contact_id) {
          await this.client.addContactsToList(segments.service, [contact.contact_id]);
        }

        // Segment by customer type
        if (customerType === 'vip' && segments.vip && contact.contact_id) {
          await this.client.addContactsToList(segments.vip, [contact.contact_id]);
        }
      }

      return { segmented: contacts.contacts.length };
    } catch (error) {
      console.error('Error segmenting contacts:', error);
      throw error;
    }
  }

  /**
   * Create drip campaign for new business inquiries
   */
  async setupBusinessDripCampaign() {
    try {
      const campaigns = [
        {
          name: 'Welcome Series - Day 1',
          subject: 'Welcome to Our Company',
          delay: 0, // Send immediately
          content: 'Thank you for your interest in our products and services...'
        },
        {
          name: 'Welcome Series - Day 3',
          subject: 'Discover Our Solutions',
          delay: 3,
          content: 'Explore our comprehensive range of products and services...'
        },
        {
          name: 'Welcome Series - Day 7',
          subject: 'Schedule Your Consultation',
          delay: 7,
          content: 'Ready to discuss how we can help your business?...'
        }
      ];

      const createdCampaigns = [];
      for (const camp of campaigns) {
        const campaign = await this.client.createEmailCampaign({
          name: camp.name,
          type_code: 1,
          email_campaign_activities: [{
            format_type: 'HTML',
            from_name: 'Your Company',
            from_email: 'info@yourcompany.com',
            reply_to_email: 'info@yourcompany.com',
            subject: camp.subject,
            html_content: camp.content
          }]
        });
        createdCampaigns.push(campaign);
      }

      return createdCampaigns;
    } catch (error) {
      console.error('Error setting up drip campaign:', error);
      throw error;
    }
  }
}
```

## 📚 Rate Limits & Best Practices

### Rate Limiting
- **Default Limit**: 10,000 API requests per hour
- **Burst Limit**: 40 requests per 10 seconds
- **Recommendation**: Implement exponential backoff for failed requests

### Best Practices

1. **Authentication**
   - Store tokens securely (encrypted database, not .env files in production)
   - Implement automatic token refresh
   - Use appropriate OAuth scopes

2. **Error Handling**
   - Always handle 429 (rate limit) responses
   - Implement retry logic with exponential backoff
   - Log errors for debugging

3. **Data Management**
   - Validate email addresses before API calls
   - Use batch operations when possible
   - Implement duplicate contact detection

4. **Performance**
   - Cache frequently accessed data (lists, custom fields)
   - Use pagination for large datasets
   - Implement async operations for bulk updates

## 🚀 Deployment Checklist

### Environment Variables (Production)
```bash
# Constant Contact API Configuration
CONSTANT_CONTACT_API_KEY=your_production_api_key
CONSTANT_CONTACT_CLIENT_SECRET=your_production_client_secret
CONSTANT_CONTACT_REDIRECT_URI=https://yourdomain.com/api/auth/constantcontact/callback
CONSTANT_CONTACT_ACCESS_TOKEN=your_production_access_token
CONSTANT_CONTACT_REFRESH_TOKEN=your_production_refresh_token
CONSTANT_CONTACT_BASE_URL=https://api.cc.email/v3
```

### Security Considerations
- [ ] API keys stored securely (not in version control)
- [ ] HTTPS enabled for all API callbacks
- [ ] Input validation on all form submissions
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive information

### Testing
- [ ] Test OAuth flow in production environment
- [ ] Verify webhook endpoints (if used)
- [ ] Test contact creation and list management
- [ ] Validate email campaign creation and sending
- [ ] Confirm analytics and reporting functions

## 📖 Additional Resources

- [Constant Contact Developer Portal](https://developer.constantcontact.com/)
- [V3 API Technical Overview](https://v3.developer.constantcontact.com/api_guide/v3_technical_overview.html)
- [OAuth2 Authentication Guide](https://v3.developer.constantcontact.com/api_guide/auth_overview.html)
- [API Rate Limits](https://v3.developer.constantcontact.com/api_guide/rate_limits.html)
- [Webhooks Documentation](https://v3.developer.constantcontact.com/api_guide/webhooks.html)

---

## 🔧 Quick Setup Commands

```bash
# 1. Add environment variables to .env.local
# 2. No additional package installation needed (uses built-in fetch)
# 3. Start development server
bun run dev

# 4. Test OAuth flow
# Visit: http://localhost:3000/api/auth/constantcontact/callback

# 5. Test API integration
# Use the provided examples in src/lib/constantcontact/examples.ts
```

This comprehensive guide provides everything needed to integrate Constant Contact v3 API with your Next.js application, enabling powerful email marketing automation and customer relationship management.