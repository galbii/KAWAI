/**
 * Music School Enrollment API Route
 *
 * Handles form submissions from the music school enrollment form
 * Integrates with Constant Contact API to create/update contacts with custom fields
 * Sends email notifications via Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager } from '@/lib/constantcontact/lists';
import { createCustomFieldManager } from '@/lib/constantcontact/custom-fields';
import { Resend } from 'resend';

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

    // Step 5: Send email notification via Resend
    console.log('📧 Starting email notification process...');
    console.log('📧 Resend API Key present:', !!process.env.RESEND_API_KEY);
    console.log('📧 API Key first 10 chars:', process.env.RESEND_API_KEY?.substring(0, 10));

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      console.log('📧 Resend client initialized successfully');

      const emailHtml = `
        <h1 style="color: #C41E3A; font-family: Arial, sans-serif;">New Music School Enrollment</h1>

        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2C2C2C; border-bottom: 2px solid #C41E3A; padding-bottom: 8px;">Student Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Name:</strong></td>
              <td style="padding: 8px;">${formData.studentFirstName} ${formData.studentLastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Birth Year:</strong></td>
              <td style="padding: 8px;">${formData.studentBirthYear}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Gender:</strong></td>
              <td style="padding: 8px;">${formData.studentGender}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>School Grade:</strong></td>
              <td style="padding: 8px;">${formData.schoolGrade || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Current School:</strong></td>
              <td style="padding: 8px;">${formData.currentSchool || 'Not provided'}</td>
            </tr>
          </table>

          <h2 style="color: #2C2C2C; border-bottom: 2px solid #C41E3A; padding-bottom: 8px;">Musical Background</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Instrument:</strong></td>
              <td style="padding: 8px;">${formData.instrument}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Previous Study Length:</strong></td>
              <td style="padding: 8px;">${formData.lengthOfPreviousStudy}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Lesson Type:</strong></td>
              <td style="padding: 8px;">${formData.privateLessonType}</td>
            </tr>
          </table>

          <h2 style="color: #2C2C2C; border-bottom: 2px solid #C41E3A; padding-bottom: 8px;">Lesson Preferences</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Price Range:</strong></td>
              <td style="padding: 8px;">${formData.lessonPrice}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Preferred Time:</strong></td>
              <td style="padding: 8px;">${formData.preferredTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Additional Notes:</strong></td>
              <td style="padding: 8px;">${formData.notes || 'None'}</td>
            </tr>
          </table>

          <h2 style="color: #2C2C2C; border-bottom: 2px solid #C41E3A; padding-bottom: 8px;">Emergency Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Name:</strong></td>
              <td style="padding: 8px;">${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Phone:</strong></td>
              <td style="padding: 8px;">${formData.emergencyContactPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f8f8f8;"><strong>Email:</strong></td>
              <td style="padding: 8px;">${formData.emergencyContactEmail}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-left: 4px solid #C41E3A;">
            <p style="margin: 0;"><strong>Contact ID:</strong> ${result.data?.contact_id || 'N/A'}</p>
            <p style="margin: 5px 0 0 0;"><strong>List:</strong> KPM DALLAS (${kpmDallasList.data.list_id})</p>
          </div>
        </div>
      `;

      console.log('📧 Preparing to send email...');
      console.log('📧 From: KPM Music School <onboarding@resend.dev>');
      console.log('📧 To: cnoonan@kawaius.com');
      console.log('📧 Subject: New Music School Enrollment:', formData.studentFirstName, formData.studentLastName);

      const emailResult = await resend.emails.send({
        from: 'KPM Music School <onboarding@resend.dev>',
        to: 'cnoonan@kawaius.com',
        subject: `New Music School Enrollment: ${formData.studentFirstName} ${formData.studentLastName}`,
        html: emailHtml,
      });

      console.log('✉️ Email send result:', JSON.stringify(emailResult, null, 2));

      if (emailResult.error) {
        console.error('❌ Resend API returned an error:', emailResult.error);
      } else {
        console.log('✅ Email notification sent successfully!');
        console.log('✅ Email ID:', emailResult.data?.id);
      }
    } catch (emailError) {
      // Log detailed email error but don't fail the request
      console.error('⚠️ Failed to send email notification - DETAILED ERROR:');
      console.error('⚠️ Error type:', emailError instanceof Error ? emailError.constructor.name : typeof emailError);
      console.error('⚠️ Error message:', emailError instanceof Error ? emailError.message : emailError);
      console.error('⚠️ Full error:', JSON.stringify(emailError, null, 2));
      if (emailError instanceof Error && emailError.stack) {
        console.error('⚠️ Stack trace:', emailError.stack);
      }
      console.error('⚠️ (Note: Enrollment was still successful in Constant Contact)');
    }

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
