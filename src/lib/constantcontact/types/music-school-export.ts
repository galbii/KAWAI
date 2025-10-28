/**
 * Type definitions for Music School Contact Export
 *
 * Defines the structure for exporting KPM DALLAS contact data
 * from Constant Contact with decoded custom fields
 */

export interface MusicSchoolContactExport {
  // Constant Contact Contact Info
  contactId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;

  // Student Information (from custom fields)
  studentFirstName: string;
  studentLastName: string;
  studentBirthYear: string;
  studentGender: string;
  schoolGrade?: string;
  currentSchool?: string;

  // Musical Background
  instrument: string;
  lengthOfPreviousStudy: string;
  privateLessonType: string;

  // Lesson Preferences
  lessonPrice: string;
  preferredTime: string;
  enrollmentNotes?: string;
}

export interface CustomFieldValue {
  custom_field_id: string;
  value: string;
}

export interface ConstantContactContact {
  contact_id: string;
  email_address: {
    address: string;
    permission_to_send: string;
  };
  first_name?: string;
  last_name?: string;
  phone_numbers?: Array<{
    phone_number: string;
    kind: string;
  }>;
  list_memberships?: Array<{
    list_id: string;
    status: string;
  }>;
  custom_fields?: CustomFieldValue[];
  created_at: string;
  updated_at: string;
}

export interface ContactExportResult {
  success: boolean;
  totalContacts: number;
  contacts: MusicSchoolContactExport[];
  exportedAt: string;
  listId: string;
  listName: string;
  error?: string;
}
