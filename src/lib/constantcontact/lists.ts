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
  custom_fields?: Array<{
    custom_field_id: string;
    value: string;
  }>;
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
  custom_fields?: Array<{
    custom_field_id: string;
    value: string;
  }>;
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
   * Find a specific list by exact name using API search
   */
  async findListByName(listName: string): Promise<ApiResponse<ContactList | null>> {
    try {
      const encodedName = encodeURIComponent(listName);
      const response = await this.client.get<ListsResponse>(`/contact_lists?name=${encodedName}`);

      if (response.success && response.data?.lists && response.data.lists.length > 0) {
        // Return the first exact match
        const exactMatch = response.data.lists.find(list =>
          list.name.toLowerCase().trim() === listName.toLowerCase().trim()
        );

        return {
          success: true,
          status: response.status,
          data: exactMatch || response.data.lists[0] || null // Fallback to first result or null
        };
      }

      return {
        success: true,
        status: response.status,
        data: null // No list found
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: [{
          error_key: 'search_failed',
          error_message: error instanceof Error ? error.message : 'Failed to search for list'
        }]
      };
    }
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

    // Add custom fields if provided
    if (contactData.custom_fields && contactData.custom_fields.length > 0) {
      contact.custom_fields = contactData.custom_fields.filter(field =>
        field.custom_field_id && field.value // Only include fields with both ID and value
      );
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
   * Update contact's list memberships and optionally custom fields
   */
  async updateContactLists(
    contactId: string,
    listIds: string[],
    customFields?: Array<{ custom_field_id: string; value: string }>
  ): Promise<ApiResponse<Contact>> {
    // Build update payload with required fields
    const data: any = {
      update_source: 'Contact', // Required field for updates (similar to create_source for creation)
      list_memberships: listIds
    };

    // Add custom fields if provided
    if (customFields && customFields.length > 0) {
      data.custom_fields = customFields.filter(field =>
        field.custom_field_id && field.value // Only include fields with both ID and value
      );
    }

    console.log('Constant Contact: Updating contact:', JSON.stringify(data, null, 2));

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
      update_source: 'Contact', // Required field for updates
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
        ...(list.description !== undefined && { description: list.description })
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
        if (!contact) {
          return { exists: false, listIds: [] };
        }
        const listIds = (contact.list_memberships || [])
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
   * Add existing contact to list by contact ID
   */
  async addContactToList(contactId: string, listIds: string[]): Promise<ApiResponse<Contact>> {
    try {
      // First, get the contact's current list memberships
      const response = await this.client.get<Contact>(`/contacts/${contactId}`);

      if (!response.success) {
        return response;
      }

      const contact = response.data;
      if (!contact) {
        return {
          success: false,
          status: 404,
          error: [{ error_key: 'contact_not_found', error_message: 'Contact not found' }]
        };
      }

      // Get current list IDs (handle undefined list_memberships)
      const currentListIds = (contact.list_memberships || [])
        .filter((membership): membership is ListMembership =>
          typeof membership === 'object' && membership.membership_status === 'active'
        )
        .map(membership => membership.list_id);

      // Merge with new list IDs
      const allListIds = [...new Set([...currentListIds, ...listIds])];

      // Update contact with all list memberships
      return this.updateContactLists(contactId, allListIds);
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: [{
          error_key: 'add_to_list_failed',
          error_message: error instanceof Error ? error.message : 'Failed to add contact to list'
        }]
      };
    }
  }

  /**
   * Extract contact ID from Constant Contact conflict error message
   */
  private extractContactIdFromConflictError(errorMessage: string): string | null {
    // Look for UUID patterns in the error message
    // Constant Contact contact IDs are typically UUIDs like: a29fa5aa-9b2b-11f0-a049-fa163ea70839
    const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
    const match = errorMessage.match(uuidRegex);
    return match ? match[0] : null;
  }

  /**
   * Helper: Create or update contact with list memberships
   */
  async createOrUpdateContact(contactData: CreateContactRequest): Promise<ApiResponse<Contact>> {
    try {
      // Check if contact exists first
      const existingContact = await this.getContactListMemberships(contactData.email_address);

      if (existingContact.exists && existingContact.contact) {
        console.log('Constant Contact: Contact exists, updating list memberships and custom fields');
        // Update existing contact
        const allListIds = [...new Set([...existingContact.listIds, ...contactData.list_ids])];
        return this.updateContactLists(existingContact.contact.contact_id!, allListIds, contactData.custom_fields);
      } else {
        console.log('Constant Contact: Contact does not exist, creating new contact');
        // Try to create new contact
        const createResponse = await this.createContact(contactData);

        // Handle conflict error specifically
        if (!createResponse.success && createResponse.status === 409) {
          console.log('Constant Contact: Got conflict error, attempting to handle existing contact');

          // Check if this is a contacts.api.conflict error
          const conflictError = createResponse.error?.find(err =>
            err.error_key?.includes('conflict') || err.error_message?.includes('conflict')
          );

          if (conflictError) {
            console.log('Constant Contact: Found conflict error:', conflictError.error_message);

            // Try to extract contact ID from error message
            const contactId = this.extractContactIdFromConflictError(conflictError.error_message || '');

            if (contactId) {
              console.log('Constant Contact: Extracted contact ID from error:', contactId);
              // Add the existing contact to the target lists
              return this.addContactToList(contactId, contactData.list_ids);
            } else {
              // Fallback: Try to fetch the contact by email again (they might exist now)
              console.log('Constant Contact: Could not extract contact ID, trying email lookup again');
              const retryContact = await this.getContactListMemberships(contactData.email_address);

              if (retryContact.exists && retryContact.contact) {
                const allListIds = [...new Set([...retryContact.listIds, ...contactData.list_ids])];
                return this.updateContactLists(retryContact.contact.contact_id!, allListIds, contactData.custom_fields);
              }
            }
          }
        }

        return createResponse;
      }
    } catch (error) {
      console.error('Constant Contact: createOrUpdateContact error:', error);
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