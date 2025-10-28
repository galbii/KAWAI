/**
 * Music School Contact Export Utility
 *
 * Fetches all contacts from the KPM DALLAS list and decodes their custom fields
 * into a readable format for export
 */

import type { Payload } from 'payload';
import { ConstantContactClient } from './client';
import { ConstantContactListManager } from './lists';
import { CustomFieldManager, MUSIC_SCHOOL_CUSTOM_FIELDS } from './custom-fields';
import type {
  MusicSchoolContactExport,
  ConstantContactContact,
  ContactExportResult,
  CustomFieldValue
} from './types/music-school-export';

export class MusicSchoolContactExporter {
  private client: ConstantContactClient;
  private listManager: ConstantContactListManager;
  private customFieldManager: CustomFieldManager;
  private fieldIdToName: Map<string, string> = new Map();

  constructor(
    client: ConstantContactClient,
    payload: Payload
  ) {
    this.client = client;
    this.listManager = new ConstantContactListManager(client);
    this.customFieldManager = new CustomFieldManager(client, payload);
  }

  /**
   * Build a reverse map of custom field ID → field name
   * This allows us to decode the custom field values from Constant Contact
   */
  private async buildFieldIdMap(): Promise<void> {
    console.log('🔍 Building custom field ID → name mapping...');

    // Get all field IDs
    const fieldMap = await this.customFieldManager.ensureAllMusicSchoolFields();

    // Reverse the map: ID → name
    this.fieldIdToName.clear();
    for (const [fieldName, fieldId] of fieldMap.entries()) {
      this.fieldIdToName.set(fieldId, fieldName);
    }

    console.log(`✓ Field mapping ready: ${this.fieldIdToName.size} fields mapped`);
  }

  /**
   * Get value of a custom field by field name
   */
  private getCustomFieldValue(
    customFields: CustomFieldValue[] | undefined,
    fieldName: string
  ): string | undefined {
    if (!customFields) return undefined;

    // Find the field ID for this field name
    const fieldId = Array.from(this.fieldIdToName.entries())
      .find(([id, name]) => name === fieldName)?.[0];

    if (!fieldId) return undefined;

    // Find the value
    const field = customFields.find(f => f.custom_field_id === fieldId);
    return field?.value;
  }

  /**
   * Transform a Constant Contact contact into readable format
   */
  private transformContact(contact: ConstantContactContact): MusicSchoolContactExport {
    // Extract phone number with proper type handling
    const phoneNumber = contact.phone_numbers?.[0]?.phone_number;

    // Extract optional custom fields
    const schoolGrade = this.getCustomFieldValue(contact.custom_fields, 'school_grade');
    const currentSchool = this.getCustomFieldValue(contact.custom_fields, 'current_school');
    const enrollmentNotes = this.getCustomFieldValue(contact.custom_fields, 'enrollment_notes');

    return {
      // Contact Info
      contactId: contact.contact_id,
      email: contact.email_address.address,
      firstName: contact.first_name || '',
      lastName: contact.last_name || '',
      ...(phoneNumber && { phone: phoneNumber }), // Only include if defined
      createdAt: contact.created_at,
      updatedAt: contact.updated_at,

      // Student Information
      studentFirstName: this.getCustomFieldValue(contact.custom_fields, 'student_first_name') || '',
      studentLastName: this.getCustomFieldValue(contact.custom_fields, 'student_last_name') || '',
      studentBirthYear: this.getCustomFieldValue(contact.custom_fields, 'student_birth_year') || '',
      studentGender: this.getCustomFieldValue(contact.custom_fields, 'student_gender') || '',
      ...(schoolGrade && { schoolGrade }),
      ...(currentSchool && { currentSchool }),

      // Musical Background
      instrument: this.getCustomFieldValue(contact.custom_fields, 'instrument') || '',
      lengthOfPreviousStudy: this.getCustomFieldValue(contact.custom_fields, 'length_of_previous_study') || '',
      privateLessonType: this.getCustomFieldValue(contact.custom_fields, 'private_lesson_type') || '',

      // Lesson Preferences
      lessonPrice: this.getCustomFieldValue(contact.custom_fields, 'lesson_price') || '',
      preferredTime: this.getCustomFieldValue(contact.custom_fields, 'preferred_time') || '',
      ...(enrollmentNotes && { enrollmentNotes })
    };
  }

  /**
   * Fetch all contacts from the KPM DALLAS list
   */
  async exportKPMDallasContacts(): Promise<ContactExportResult> {
    try {
      console.log('📋 Starting KPM DALLAS contact export...');

      // Step 1: Build field ID mapping
      await this.buildFieldIdMap();

      // Step 2: Find the KPM DALLAS list
      console.log('🔍 Finding KPM DALLAS list...');
      const listResult = await this.listManager.findListByName('KPM DALLAS');

      if (!listResult.success || !listResult.data) {
        return {
          success: false,
          totalContacts: 0,
          contacts: [],
          exportedAt: new Date().toISOString(),
          listId: '',
          listName: 'KPM DALLAS',
          error: 'KPM DALLAS list not found'
        };
      }

      const listId = listResult.data.list_id;
      console.log(`✓ Found KPM DALLAS list: ${listId}`);

      // Step 3: Fetch all contacts from this list using the correct v3 API endpoint
      console.log('📥 Fetching all contacts from KPM DALLAS list...');
      console.log(`   Using list filter: lists=${listId}`);

      const allContacts: ConstantContactContact[] = [];
      let hasMore = true;
      let cursor: string | undefined = undefined;
      const limit = 500; // Constant Contact max per request

      while (hasMore) {
        // Build query parameters for v3 API
        const params: Record<string, string> = {
          lists: listId,              // Filter by list membership
          limit: limit.toString(),    // Max 500 per page
          include: 'custom_fields',   // Include custom fields in response
          status: 'all'               // Get all contact statuses
        };

        // Add cursor if available for pagination
        if (cursor) {
          params.cursor = cursor;
        }

        const queryParams = new URLSearchParams(params);

        // Use the correct v3 API endpoint: /contacts with list filter
        const endpoint = `/contacts?${queryParams.toString()}`;
        console.log(`  Fetching from: ${endpoint}`);

        const response = await this.client.get<{
          contacts: ConstantContactContact[];
          _links?: {
            next?: { href: string };
          };
        }>(endpoint);

        if (!response.success || !response.data) {
          console.error('Failed to fetch contacts:', response.error);
          break;
        }

        // Add all contacts from this batch
        const contacts = response.data.contacts || [];
        allContacts.push(...contacts);
        console.log(`  ✓ Fetched ${contacts.length} contacts from this batch (${allContacts.length} total so far)...`);

        // Check if there are more pages
        if (response.data._links?.next) {
          // Extract cursor from next URL
          const nextUrl = response.data._links.next.href;
          const urlParams = new URLSearchParams(nextUrl.split('?')[1]);
          cursor = urlParams.get('cursor') || undefined;
          console.log(`  → More contacts available, fetching next page...`);
        } else {
          hasMore = false;
          console.log(`  ✓ No more pages, finished fetching.`);
        }
      }

      console.log(`✓ Total contacts fetched from KPM DALLAS: ${allContacts.length}`);

      // Step 4: Transform all contacts
      console.log('🔄 Transforming contacts to readable format...');
      const transformedContacts = allContacts.map(contact => this.transformContact(contact));

      console.log('✅ Export complete!');

      return {
        success: true,
        totalContacts: transformedContacts.length,
        contacts: transformedContacts,
        exportedAt: new Date().toISOString(),
        listId,
        listName: 'KPM DALLAS'
      };

    } catch (error) {
      console.error('❌ Export failed:', error);
      return {
        success: false,
        totalContacts: 0,
        contacts: [],
        exportedAt: new Date().toISOString(),
        listId: '',
        listName: 'KPM DALLAS',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export contacts as CSV string
   */
  static exportToCSV(contacts: MusicSchoolContactExport[]): string {
    if (contacts.length === 0) return '';

    // Define CSV headers
    const headers = [
      'Contact ID',
      'Email',
      'Guardian First Name',
      'Guardian Last Name',
      'Guardian Phone',
      'Student First Name',
      'Student Last Name',
      'Student Birth Year',
      'Student Gender',
      'School Grade',
      'Current School',
      'Instrument',
      'Previous Study Length',
      'Lesson Type',
      'Price Range',
      'Preferred Time',
      'Notes',
      'Created At',
      'Updated At'
    ];

    // Build CSV rows
    const rows = contacts.map(contact => [
      contact.contactId,
      contact.email,
      contact.firstName,
      contact.lastName,
      contact.phone || '',
      contact.studentFirstName,
      contact.studentLastName,
      contact.studentBirthYear,
      contact.studentGender,
      contact.schoolGrade || '',
      contact.currentSchool || '',
      contact.instrument,
      contact.lengthOfPreviousStudy,
      contact.privateLessonType,
      contact.lessonPrice,
      contact.preferredTime,
      contact.enrollmentNotes || '',
      contact.createdAt,
      contact.updatedAt
    ]);

    // Escape CSV values
    const escapeCSV = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Join everything
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    return csvContent;
  }
}

/**
 * Helper function to create exporter instance
 */
export function createMusicSchoolExporter(
  client: ConstantContactClient,
  payload: Payload
): MusicSchoolContactExporter {
  return new MusicSchoolContactExporter(client, payload);
}
