/**
 * Constant Contact List Management
 *
 * Utilities for managing contact lists and memberships
 */

import { ConstantContactClient, ApiResponse } from './client';

export interface ContactList {
  list_id: string;
  name: string;
  description?: string;
  favorite?: boolean;
  created_at: string;
  updated_at: string;
  membership_count: number;
}

export interface ListsResponse {
  lists: ContactList[];
  lists_count: number;
}

export interface ListMembership {
  list_id: string;
  membership_status: 'active' | 'unsubscribed' | 'removed';
}

export interface Contact {
  contact_id?: string;
  email_address: {
    address: string;
    permission_to_send: 'implicit' | 'explicit' | 'pending_confirmation' | 'temporary_hold' | 'unsubscribed' | 'not_set';
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
    kind: 'home' | 'work' | 'other';
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }>;
  list_memberships: ListMembership[] | string[]; // Can be objects (from API) or strings (for creation)
  create_source?: string; // Required for creation
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactRequest {
  email_address: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company_name?: string;
  phone_number?: string;
  list_ids: string[];
}

export class ConstantContactListManager {
  constructor(private client: ConstantContactClient) {}

  /**
   * Get all contact lists
   */
  async getAllLists(): Promise<ApiResponse<ListsResponse>> {
    return this.client.get<ListsResponse>('/contact_lists');
  }

  /**
   * Get a specific list by ID
   */
  async getList(listId: string): Promise<ApiResponse<ContactList>> {
    return this.client.get<ContactList>(`/contact_lists/${listId}`);
  }

  /**
   * Create a new contact list
   */
  async createList(name: string, description?: string): Promise<ApiResponse<ContactList>> {
    const data = {
      name,
      description: description || ''
    };

    return this.client.post<ContactList>('/contact_lists', data);
  }

  /**
   * Update an existing list
   */
  async updateList(listId: string, name: string, description?: string): Promise<ApiResponse<ContactList>> {
    const data = {
      name,
      description: description || ''
    };

    return this.client.put<ContactList>(`/contact_lists/${listId}`, data);
  }

  /**
   * Delete a list
   */
  async deleteList(listId: string): Promise<ApiResponse<any>> {
    return this.client.delete(`/contact_lists/${listId}`);
  }

  /**
   * Create a new contact with list memberships
   */
  async createContact(contactData: CreateContactRequest): Promise<ApiResponse<Contact>> {
    // Build the contact object according to Constant Contact v3 API requirements
    const contact: any = {
      email_address: {
        address: contactData.email_address,
        permission_to_send: 'implicit'
      },
      create_source: 'Contact', // Required field
      list_memberships: contactData.list_ids // Array of list ID strings (not objects)
    };

    // Add first_name and last_name - both are required by the API
    // If not provided, use placeholder values to avoid 500 error
    contact.first_name = contactData.first_name?.trim() || 'Contact';
    contact.last_name = contactData.last_name?.trim() || 'Subscriber';

    // Only add optional fields that have values
    if (contactData.job_title?.trim()) {
      contact.job_title = contactData.job_title.trim();
    }
    if (contactData.company_name?.trim()) {
      contact.company_name = contactData.company_name.trim();
    }

    // Add phone number if provided
    if (contactData.phone_number?.trim()) {
      contact.phone_numbers = [{
        phone_number: contactData.phone_number.trim(),
        kind: 'mobile'
      }];
    }

    console.log('Constant Contact: Sending contact data to API:', JSON.stringify(contact, null, 2));

    return this.client.post<Contact>('/contacts', contact);
  }

  /**
   * Get contact by email address
   */
  async getContactByEmail(email: string): Promise<ApiResponse<{ contacts: Contact[] }>> {
    const encodedEmail = encodeURIComponent(email);
    return this.client.get<{ contacts: Contact[] }>(`/contacts?email=${encodedEmail}`);
  }

  /**
   * Update contact's list memberships
   */
  async updateContactLists(contactId: string, listIds: string[]): Promise<ApiResponse<Contact>> {
    // For updates, try the simple array format first (consistent with creation)
    // If this fails, the API might require the object format for updates
    const data = {
      list_memberships: listIds
    };

    console.log('Constant Contact: Updating contact list memberships:', JSON.stringify(data, null, 2));

    return this.client.put<Contact>(`/contacts/${contactId}`, data);
  }

  /**
   * Remove contact from specific lists
   */
  async removeContactFromLists(contactId: string, listIds: string[]): Promise<ApiResponse<Contact>> {
    const listMemberships = listIds.map(list_id => ({
      list_id,
      membership_status: 'removed' as const
    }));

    const data = {
      list_memberships: listMemberships
    };

    return this.client.put<Contact>(`/contacts/${contactId}`, data);
  }

  /**
   * Get contacts in a specific list
   */
  async getContactsInList(listId: string, limit: number = 50): Promise<ApiResponse<{ contacts: Contact[] }>> {
    return this.client.get<{ contacts: Contact[] }>(`/contact_lists/${listId}/contacts?limit=${limit}`);
  }

  /**
   * Helper: Format lists for dropdown/selection UI
   */
  formatListsForUI(lists: ContactList[]): Array<{ value: string; label: string; description?: string }> {
    return lists
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(list => ({
        value: list.list_id,
        label: list.name,
        description: list.description
      }));
  }

  /**
   * Helper: Validate email address format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Helper: Check if contact exists and get their list memberships
   */
  async getContactListMemberships(email: string): Promise<{
    exists: boolean;
    contact?: Contact;
    listIds: string[];
  }> {
    try {
      const response = await this.getContactByEmail(email);

      if (response.success && response.data?.contacts && response.data.contacts.length > 0) {
        const contact = response.data.contacts[0];
        const listIds = contact.list_memberships
          .filter((membership): membership is ListMembership =>
            typeof membership === 'object' && membership.membership_status === 'active'
          )
          .map(membership => membership.list_id);

        return {
          exists: true,
          contact,
          listIds
        };
      }

      return {
        exists: false,
        listIds: []
      };
    } catch (error) {
      return {
        exists: false,
        listIds: []
      };
    }
  }

  /**
   * Helper: Create or update contact with list memberships
   */
  async createOrUpdateContact(contactData: CreateContactRequest): Promise<ApiResponse<Contact>> {
    try {
      // Check if contact exists
      const existingContact = await this.getContactListMemberships(contactData.email_address);

      if (existingContact.exists && existingContact.contact) {
        // Update existing contact
        const allListIds = [...new Set([...existingContact.listIds, ...contactData.list_ids])];
        return this.updateContactLists(existingContact.contact.contact_id!, allListIds);
      } else {
        // Create new contact
        return this.createContact(contactData);
      }
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: [{
          error_key: 'operation_failed',
          error_message: error instanceof Error ? error.message : 'Failed to create or update contact'
        }]
      };
    }
  }
}