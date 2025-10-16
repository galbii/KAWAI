/**
 * Constant Contact Custom Fields Management
 *
 * Handles creation, caching, and retrieval of custom field IDs
 * Implements smart hybrid approach: auto-creates missing fields and caches them in database
 */

import type { Payload } from 'payload';
import { ConstantContactClient } from './client';

export interface CustomFieldDefinition {
  fieldName: string;
  fieldLabel: string;
  fieldType: 'string' | 'date' | 'single_select' | 'multi_select';
}

export interface CustomFieldResponse {
  custom_field_id: string;
  label: string;
  type: string;
}

/**
 * Define all custom fields needed for music school enrollment form
 */
export const MUSIC_SCHOOL_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  { fieldName: 'student_first_name', fieldLabel: 'Student First Name', fieldType: 'string' },
  { fieldName: 'student_last_name', fieldLabel: 'Student Last Name', fieldType: 'string' },
  { fieldName: 'student_birth_year', fieldLabel: 'Student Birth Year', fieldType: 'string' },
  { fieldName: 'student_gender', fieldLabel: 'Student Gender', fieldType: 'string' },
  { fieldName: 'school_grade', fieldLabel: 'School Grade', fieldType: 'string' },
  { fieldName: 'current_school', fieldLabel: 'Current School', fieldType: 'string' },
  { fieldName: 'instrument', fieldLabel: 'Instrument of Interest', fieldType: 'string' },
  { fieldName: 'length_of_previous_study', fieldLabel: 'Previous Study Length', fieldType: 'string' },
  { fieldName: 'private_lesson_type', fieldLabel: 'Lesson Type Preference', fieldType: 'string' },
  { fieldName: 'lesson_price', fieldLabel: 'Price Range Preference', fieldType: 'string' },
  { fieldName: 'preferred_time', fieldLabel: 'Preferred Lesson Time', fieldType: 'string' },
  { fieldName: 'enrollment_notes', fieldLabel: 'Additional Notes', fieldType: 'string' },
];

export class CustomFieldManager {
  constructor(
    private client: ConstantContactClient,
    private payload: Payload
  ) {}

  /**
   * Get custom field ID from cache (database), create if doesn't exist
   * This is the core method that implements the self-healing approach
   */
  async ensureCustomField(
    fieldName: string,
    fieldLabel: string,
    fieldType: string = 'string'
  ): Promise<string> {
    try {
      // Step 1: Check if field exists in database cache
      const cached = await this.payload.find({
        collection: 'constant-contact-custom-fields' as any,
        where: { fieldName: { equals: fieldName } },
        limit: 1
      });

      if (cached.docs.length > 0) {
        const cachedField = cached.docs[0];
        console.log(`✓ Custom field "${fieldName}" found in cache:`, cachedField.customFieldId);
        return cachedField.customFieldId as string;
      }

      // Step 2: Field not cached, check if it exists in Constant Contact
      console.log(`⚠ Custom field "${fieldName}" not cached, checking Constant Contact...`);
      const existingFields = await this.client.get<{ custom_fields: CustomFieldResponse[] }>(
        '/contact_custom_fields'
      );

      if (existingFields.success && existingFields.data?.custom_fields) {
        // Look for existing field by label
        const existing = existingFields.data.custom_fields.find(f => f.label === fieldLabel);

        if (existing) {
          // Field exists in CC, cache it for future use
          console.log(`✓ Custom field "${fieldName}" exists in Constant Contact, caching...`);
          await this.payload.create({
            collection: 'constant-contact-custom-fields' as any,
            data: {
              fieldName,
              fieldLabel,
              customFieldId: existing.custom_field_id,
              fieldType: existing.type,
              createdInConstantContact: true,
              lastSyncedAt: new Date().toISOString()
            }
          });
          return existing.custom_field_id;
        }
      }

      // Step 3: Field doesn't exist anywhere, create it in Constant Contact
      console.log(`⚙ Creating custom field "${fieldName}" in Constant Contact...`);
      const createResponse = await this.client.post<CustomFieldResponse>('/contact_custom_fields', {
        label: fieldLabel,
        type: fieldType
      });

      if (!createResponse.success || !createResponse.data?.custom_field_id) {
        throw new Error(`Failed to create custom field "${fieldName}": ${JSON.stringify(createResponse.error)}`);
      }

      // Step 4: Cache the newly created field ID
      await this.payload.create({
        collection: 'constant-contact-custom-fields' as any,
        data: {
          fieldName,
          fieldLabel,
          customFieldId: createResponse.data.custom_field_id,
          fieldType,
          createdInConstantContact: true,
          lastSyncedAt: new Date().toISOString()
        }
      });

      console.log(`✓ Custom field "${fieldName}" created and cached:`, createResponse.data.custom_field_id);
      return createResponse.data.custom_field_id;

    } catch (error) {
      console.error(`❌ Error ensuring custom field "${fieldName}":`, error);
      throw error;
    }
  }

  /**
   * Ensure all music school custom fields exist
   * Returns a Map of fieldName → customFieldId for easy lookup
   */
  async ensureAllMusicSchoolFields(): Promise<Map<string, string>> {
    console.log(`🔍 Ensuring all ${MUSIC_SCHOOL_CUSTOM_FIELDS.length} music school custom fields exist...`);
    const fieldMap = new Map<string, string>();
    const errors: string[] = [];

    for (const field of MUSIC_SCHOOL_CUSTOM_FIELDS) {
      try {
        const fieldId = await this.ensureCustomField(field.fieldName, field.fieldLabel, field.fieldType);
        fieldMap.set(field.fieldName, fieldId);
      } catch (error) {
        const errorMsg = `Failed to ensure field "${field.fieldName}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Failed to ensure custom fields:\n${errors.join('\n')}`);
    }

    console.log(`✓ All ${fieldMap.size} custom fields ready!`);
    return fieldMap;
  }

  /**
   * Get custom field IDs for specific fields by name
   * Useful when you only need a subset of fields
   */
  async getFieldIds(fieldNames: string[]): Promise<Map<string, string>> {
    const fieldMap = new Map<string, string>();

    for (const fieldName of fieldNames) {
      const fieldDef = MUSIC_SCHOOL_CUSTOM_FIELDS.find(f => f.fieldName === fieldName);
      if (!fieldDef) {
        console.warn(`Field definition not found for "${fieldName}", skipping...`);
        continue;
      }

      const fieldId = await this.ensureCustomField(fieldDef.fieldName, fieldDef.fieldLabel, fieldDef.fieldType);
      fieldMap.set(fieldName, fieldId);
    }

    return fieldMap;
  }

  /**
   * Sync all cached fields with Constant Contact
   * Useful for refreshing the cache or recovering from inconsistencies
   */
  async syncAllFields(): Promise<void> {
    console.log('🔄 Syncing all custom fields with Constant Contact...');

    // Get all fields from Constant Contact
    const response = await this.client.get<{ custom_fields: CustomFieldResponse[] }>(
      '/contact_custom_fields'
    );

    if (!response.success || !response.data?.custom_fields) {
      throw new Error('Failed to fetch custom fields from Constant Contact');
    }

    // Update cache for each known field
    for (const field of MUSIC_SCHOOL_CUSTOM_FIELDS) {
      const ccField = response.data.custom_fields.find(f => f.label === field.fieldLabel);

      if (ccField) {
        // Check if already cached
        const cached = await this.payload.find({
          collection: 'constant-contact-custom-fields' as any,
          where: { fieldName: { equals: field.fieldName } },
          limit: 1
        });

        if (cached.docs.length > 0) {
          // Update existing cache
          await this.payload.update({
            collection: 'constant-contact-custom-fields' as any,
            id: cached.docs[0].id,
            data: {
              customFieldId: ccField.custom_field_id,
              fieldType: ccField.type,
              lastSyncedAt: new Date().toISOString()
            }
          });
        } else {
          // Create new cache entry
          await this.payload.create({
            collection: 'constant-contact-custom-fields' as any,
            data: {
              fieldName: field.fieldName,
              fieldLabel: field.fieldLabel,
              customFieldId: ccField.custom_field_id,
              fieldType: ccField.type,
              createdInConstantContact: true,
              lastSyncedAt: new Date().toISOString()
            }
          });
        }
      }
    }

    console.log('✓ Sync complete!');
  }

  /**
   * Clear cache for a specific field
   * Useful for forcing a refresh on next access
   */
  async clearFieldCache(fieldName: string): Promise<void> {
    const cached = await this.payload.find({
      collection: 'constant-contact-custom-fields' as any,
      where: { fieldName: { equals: fieldName } },
      limit: 1
    });

    if (cached.docs.length > 0) {
      await this.payload.delete({
        collection: 'constant-contact-custom-fields' as any,
        id: cached.docs[0].id
      });
      console.log(`✓ Cache cleared for field "${fieldName}"`);
    }
  }
}

/**
 * Helper function to create CustomFieldManager instance
 */
export function createCustomFieldManager(client: ConstantContactClient, payload: Payload): CustomFieldManager {
  return new CustomFieldManager(client, payload);
}
