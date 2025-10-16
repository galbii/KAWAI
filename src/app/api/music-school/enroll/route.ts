/**
 * Music School Enrollment API Route
 *
 * Handles form submissions from the music school enrollment form
 * Integrates with Constant Contact API to create/update contacts with custom fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager } from '@/lib/constantcontact/lists';
import { createCustomFieldManager } from '@/lib/constantcontact/custom-fields';

interface MusicSchoolEnrollmentData {
  // Student Information
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
  notes?: string;

  // Emergency Contact (Primary Contact in Constant Contact)
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate form data
    const formData: MusicSchoolEnrollmentData = await request.json();

    // Validate required fields
    const requiredFields = [
      'studentFirstName',
      'studentLastName',
      'studentBirthYear',
      'studentGender',
      'instrument',
      'lengthOfPreviousStudy',
      'privateLessonType',
      'lessonPrice',
      'preferredTime',
      'emergencyContactFirstName',
      'emergencyContactLastName',
      'emergencyContactPhone',
      'emergencyContactEmail'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof MusicSchoolEnrollmentData]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emergencyContactEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address format'
        },
        { status: 400 }
      );
    }

    // Initialize Payload and Constant Contact services
    console.log('🎵 Music School Enrollment: Initializing services...');
    const payload = await getPayload({ config });
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);
    const customFieldManager = createCustomFieldManager(client, payload);

    // Step 1: Ensure all custom fields exist (auto-creates and caches)
    console.log('📝 Music School Enrollment: Ensuring custom fields exist...');
    const fieldMap = await customFieldManager.ensureAllMusicSchoolFields();

    // Step 2: Find or create "KPM DALLAS" list
    console.log('📋 Music School Enrollment: Finding or creating "KPM DALLAS" list...');
    let kpmDallasList = await listManager.findListByName('KPM DALLAS');

    if (!kpmDallasList.success || !kpmDallasList.data) {
      console.log('⚙ List not found, creating "KPM DALLAS" list...');
      const createListResponse = await listManager.createList(
        'KPM DALLAS',
        'KPM Music School Dallas enrollment list - students and parents/guardians'
      );

      if (!createListResponse.success || !createListResponse.data) {
        console.error('❌ Failed to create KPM DALLAS list:', createListResponse.error);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to create enrollment list',
            details: createListResponse.error
          },
          { status: 500 }
        );
      }

      kpmDallasList.data = createListResponse.data;
      console.log('✓ Created "KPM DALLAS" list:', kpmDallasList.data.list_id);
    } else {
      console.log('✓ Found "KPM DALLAS" list:', kpmDallasList.data.list_id);
    }

    // Step 3: Build custom fields array from form data
    const customFields = [];

    // Add all required student fields
    customFields.push(
      { custom_field_id: fieldMap.get('student_first_name')!, value: formData.studentFirstName },
      { custom_field_id: fieldMap.get('student_last_name')!, value: formData.studentLastName },
      { custom_field_id: fieldMap.get('student_birth_year')!, value: formData.studentBirthYear },
      { custom_field_id: fieldMap.get('student_gender')!, value: formData.studentGender },
      { custom_field_id: fieldMap.get('instrument')!, value: formData.instrument },
      { custom_field_id: fieldMap.get('length_of_previous_study')!, value: formData.lengthOfPreviousStudy },
      { custom_field_id: fieldMap.get('private_lesson_type')!, value: formData.privateLessonType },
      { custom_field_id: fieldMap.get('lesson_price')!, value: formData.lessonPrice },
      { custom_field_id: fieldMap.get('preferred_time')!, value: formData.preferredTime }
    );

    // Add optional fields if provided
    if (formData.schoolGrade?.trim()) {
      customFields.push({
        custom_field_id: fieldMap.get('school_grade')!,
        value: formData.schoolGrade.trim()
      });
    }
    if (formData.currentSchool?.trim()) {
      customFields.push({
        custom_field_id: fieldMap.get('current_school')!,
        value: formData.currentSchool.trim()
      });
    }
    if (formData.notes?.trim()) {
      customFields.push({
        custom_field_id: fieldMap.get('enrollment_notes')!,
        value: formData.notes.trim()
      });
    }

    // Step 4: Create or update contact in Constant Contact
    // Emergency contact becomes the PRIMARY contact in Constant Contact
    console.log('👤 Music School Enrollment: Creating/updating contact...');
    const contactData = {
      email_address: formData.emergencyContactEmail,
      first_name: formData.emergencyContactFirstName,
      last_name: formData.emergencyContactLastName,
      phone_number: formData.emergencyContactPhone,
      list_ids: [kpmDallasList.data.list_id],
      custom_fields: customFields
    };

    console.log(`📤 Submitting contact with ${customFields.length} custom fields...`);
    const result = await listManager.createOrUpdateContact(contactData);

    if (!result.success) {
      console.error('❌ Failed to create/update contact:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to enroll in music school',
          details: result.error
        },
        { status: result.status }
      );
    }

    // Success!
    console.log('✓ Music School Enrollment: Successfully enrolled!');
    console.log(`  - Contact ID: ${result.data?.contact_id}`);
    console.log(`  - Student: ${formData.studentFirstName} ${formData.studentLastName}`);
    console.log(`  - Guardian: ${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}`);
    console.log(`  - Email: ${formData.emergencyContactEmail}`);
    console.log(`  - List: KPM DALLAS (${kpmDallasList.data.list_id})`);

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in KPM Music School',
      data: {
        contactId: result.data?.contact_id,
        listId: kpmDallasList.data.list_id,
        listName: 'KPM DALLAS',
        studentName: `${formData.studentFirstName} ${formData.studentLastName}`,
        guardianName: `${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}`,
        guardianEmail: formData.emergencyContactEmail
      }
    });

  } catch (error) {
    console.error('❌ Music school enrollment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoint: 'Music School Enrollment API',
    methods: ['POST'],
    version: '1.0.0'
  });
}
