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

    // Initialize Payload
    console.log('🎵 Music School Enrollment: Initializing services...');
    const payload = await getPayload({ config });

    // ====================================================================
    // STEP 1: SAVE TO PAYLOAD COLLECTION FIRST (SAFETY NET)
    // ====================================================================
    console.log('💾 Music School Enrollment: Saving to database first...');
    let leadRecord;
    try {
      leadRecord = await payload.create({
        collection: 'kpm-christmas-2k25',
        data: {
          // Student Information
          studentFirstName: formData.studentFirstName,
          studentLastName: formData.studentLastName,
          studentBirthYear: formData.studentBirthYear,
          studentGender: formData.studentGender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say',
          schoolGrade: formData.schoolGrade || '',
          currentSchool: formData.currentSchool || '',

          // Musical Background
          instrument: formData.instrument as 'piano' | 'keyboard' | 'voice' | 'guitar' | 'violin' | 'other',
          lengthOfPreviousStudy: formData.lengthOfPreviousStudy as 'none' | 'less-than-1-year' | '1-2-years' | '3-5-years' | '5-plus-years',
          privateLessonType: formData.privateLessonType as 'in-person' | 'online' | 'hybrid' | 'undecided',

          // Lesson Preferences
          lessonPrice: formData.lessonPrice as '$25-$40' | '$40-$60' | '$60-$80' | '$80+' | 'flexible',
          preferredTime: formData.preferredTime as 'weekday-morning' | 'weekday-afternoon' | 'weekday-evening' | 'weekend-morning' | 'weekend-afternoon' | 'flexible',
          notes: formData.notes || '',

          // Emergency Contact
          emergencyContactFirstName: formData.emergencyContactFirstName,
          emergencyContactLastName: formData.emergencyContactLastName,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactEmail: formData.emergencyContactEmail,

          // Submission Status (initial state)
          constantContactStatus: 'pending' as const,
          resendStatus: 'pending' as const,

          // System Metadata
          sourceUrl: request.headers.get('referer') || '',
          userAgent: request.headers.get('user-agent') || '',
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') || '',
        }
      });

      console.log('✅ Music School Enrollment: Data saved to database (ID:', leadRecord.id, ')');
    } catch (dbError) {
      console.error('❌ Failed to save to database:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save enrollment data',
          details: dbError instanceof Error ? dbError.message : 'Database error'
        },
        { status: 500 }
      );
    }

    // ====================================================================
    // STEP 2: ATTEMPT CONSTANT CONTACT INTEGRATION
    // ====================================================================
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

        // Update collection: Constant Contact failed at list creation
        await payload.update({
          collection: 'kpm-christmas-2k25',
          id: leadRecord.id,
          data: {
            constantContactStatus: 'failed',
            constantContactError: `Failed to create list: ${createListResponse.error}`
          }
        });

        // Continue to email notification step
        console.log('⚠️ Constant Contact list creation failed, but lead is saved. Skipping to email...');
        kpmDallasList.data = null; // Mark as failed
      } else {
        kpmDallasList.data = createListResponse.data;
        console.log('✓ Created "KPM DALLAS" list:', kpmDallasList.data.list_id);
      }
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

    // Step 4: Create or update contact in Constant Contact (only if list exists)
    let result: any = null;

    if (kpmDallasList.data) {
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
      result = await listManager.createOrUpdateContact(contactData);
    } else {
      console.log('⏭️ Skipping Constant Contact submission (list creation failed)');
      result = { success: false, error: 'List creation failed earlier' };
    }

    // Update collection with Constant Contact status
    if (!result.success) {
      console.error('❌ Failed to create/update contact:', result.error);

      // Update collection: Constant Contact failed
      await payload.update({
        collection: 'kpm-christmas-2k25',
        id: leadRecord.id,
        data: {
          constantContactStatus: 'failed',
          constantContactError: result.error || 'Unknown error from Constant Contact'
        }
      });

      // Continue processing - don't fail the entire request
      console.log('⚠️ Constant Contact failed, but lead is saved. Continuing...');
    } else {
      // Success!
      console.log('✓ Music School Enrollment: Constant Contact successful!');
      console.log(`  - Contact ID: ${result.data?.contact_id}`);
      console.log(`  - Student: ${formData.studentFirstName} ${formData.studentLastName}`);
      console.log(`  - Guardian: ${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}`);
      console.log(`  - Email: ${formData.emergencyContactEmail}`);
      console.log(`  - List: KPM DALLAS (${kpmDallasList.data?.list_id || 'N/A'})`);

      // Update collection: Constant Contact succeeded
      await payload.update({
        collection: 'kpm-christmas-2k25',
        id: leadRecord.id,
        data: {
          constantContactStatus: 'success',
          constantContactId: result.data?.contact_id || ''
        }
      });
    }

    // ====================================================================
    // STEP 3: ATTEMPT RESEND EMAIL NOTIFICATION
    // ====================================================================
    console.log('\n📧 ========================================');
    console.log('📧 STEP 3: RESEND EMAIL NOTIFICATION');
    console.log('📧 ========================================');
    console.log('📧 Timestamp:', new Date().toISOString());
    console.log('📧 Lead Database ID:', leadRecord.id);
    console.log('📧 Environment Check:');
    console.log('  - RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    console.log('  - API Key first 10 chars:', process.env.RESEND_API_KEY?.substring(0, 10));
    console.log('  - API Key length:', process.env.RESEND_API_KEY?.length || 0);

    try {
      console.log('\n📧 [1/4] Initializing Resend client...');
      const resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend client initialized successfully');

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
            <p style="margin: 0;"><strong>Database Lead ID:</strong> ${leadRecord.id}</p>
            <p style="margin: 5px 0 0 0;"><strong>Constant Contact ID:</strong> ${result?.data?.contact_id || 'Failed/Skipped'}</p>
            <p style="margin: 5px 0 0 0;"><strong>List:</strong> KPM DALLAS (${kpmDallasList?.data?.list_id || 'N/A'})</p>
          </div>

          <div style="margin-top: 15px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #D4AF37;">
            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> This lead is saved in the database with ID ${leadRecord.id}. Check the Payload CMS admin panel for full details and integration status.</p>
          </div>
        </div>
      `;

      console.log('\n📧 [2/4] Preparing email payload...');
      const emailPayload = {
        from: 'KPM Music School <onboarding@resend.dev>',
        to: 'ahakimi@kawaius.com',
        subject: `New Music School Enrollment: ${formData.studentFirstName} ${formData.studentLastName}`,
        html: emailHtml,
      };

      console.log('📧 Email Configuration:');
      console.log('  - From:', emailPayload.from);
      console.log('  - To:', emailPayload.to);
      console.log('  - Subject:', emailPayload.subject);
      console.log('  - HTML Length:', emailHtml.length, 'characters');
      console.log('  - Student:', formData.studentFirstName, formData.studentLastName);
      console.log('  - Lead ID:', leadRecord.id);

      console.log('\n📧 [3/4] Sending email via Resend API...');
      const sendStartTime = Date.now();
      const emailResult = await resend.emails.send(emailPayload);
      const sendDuration = Date.now() - sendStartTime;

      console.log('📧 API Response received in', sendDuration, 'ms');
      console.log('📧 Full Response Object:', JSON.stringify(emailResult, null, 2));

      console.log('\n📧 [4/4] Processing email response...');

      if (emailResult.error) {
        console.error('\n❌ ========================================');
        console.error('❌ RESEND ERROR DETECTED');
        console.error('❌ ========================================');
        console.error('❌ Error Type:', typeof emailResult.error);
        console.error('❌ Error Object:', emailResult.error);
        console.error('❌ Error JSON:', JSON.stringify(emailResult.error, null, 2));
        console.error('❌ Lead Database ID:', leadRecord.id);
        console.error('❌ Student:', formData.studentFirstName, formData.studentLastName);
        console.error('❌ Timestamp:', new Date().toISOString());

        // Update collection: Resend failed
        console.log('\n📧 Updating database: Resend status = failed');
        const dbUpdateStartTime = Date.now();
        await payload.update({
          collection: 'kpm-christmas-2k25',
          id: leadRecord.id,
          data: {
            resendStatus: 'failed',
            resendError: JSON.stringify(emailResult.error)
          }
        });
        console.log('✅ Database updated in', Date.now() - dbUpdateStartTime, 'ms');
        console.error('❌ Email send FAILED but lead is saved in database');
      } else {
        console.log('\n✅ ========================================');
        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('✅ ========================================');
        console.log('✅ Resend Email ID:', emailResult.data?.id);
        console.log('✅ Lead Database ID:', leadRecord.id);
        console.log('✅ Student:', formData.studentFirstName, formData.studentLastName);
        console.log('✅ Recipient:', formData.emergencyContactEmail);
        console.log('✅ Subject:', emailPayload.subject);
        console.log('✅ Timestamp:', new Date().toISOString());
        console.log('✅ Total Time:', sendDuration, 'ms');

        // Update collection: Resend succeeded
        console.log('\n📧 Updating database: Resend status = success');
        const dbUpdateStartTime = Date.now();
        await payload.update({
          collection: 'kpm-christmas-2k25',
          id: leadRecord.id,
          data: {
            resendStatus: 'success',
            resendEmailId: emailResult.data?.id || ''
          }
        });
        console.log('✅ Database updated in', Date.now() - dbUpdateStartTime, 'ms');
        console.log('✅ Resend integration COMPLETE');
      }
    } catch (emailError) {
      // Log detailed email error but don't fail the request
      console.error('\n🚨 ========================================');
      console.error('🚨 RESEND EXCEPTION CAUGHT');
      console.error('🚨 ========================================');
      console.error('🚨 Exception Type:', emailError instanceof Error ? emailError.constructor.name : typeof emailError);
      console.error('🚨 Exception Message:', emailError instanceof Error ? emailError.message : String(emailError));
      console.error('🚨 Is Error Object:', emailError instanceof Error);
      console.error('🚨 Lead Database ID:', leadRecord.id);
      console.error('🚨 Student:', formData.studentFirstName, formData.studentLastName);
      console.error('🚨 Timestamp:', new Date().toISOString());

      // Try to extract more details
      if (emailError instanceof Error) {
        console.error('🚨 Error Name:', emailError.name);
        console.error('🚨 Error Stack:', emailError.stack);

        // Check for specific error properties
        const errorObj = emailError as any;
        if (errorObj.code) console.error('🚨 Error Code:', errorObj.code);
        if (errorObj.statusCode) console.error('🚨 Status Code:', errorObj.statusCode);
        if (errorObj.response) console.error('🚨 Response:', errorObj.response);
      }

      console.error('🚨 Full Error Object:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError), 2));
      console.error('🚨 (Note: Enrollment was still successful - data saved to database)');

      // Update collection: Resend failed with exception
      console.log('\n📧 Updating database: Resend status = failed (exception)');
      const dbUpdateStartTime = Date.now();
      await payload.update({
        collection: 'kpm-christmas-2k25',
        id: leadRecord.id,
        data: {
          resendStatus: 'failed',
          resendError: emailError instanceof Error ? emailError.message : 'Unknown email error'
        }
      });
      console.log('✅ Database updated in', Date.now() - dbUpdateStartTime, 'ms');
      console.error('🚨 Email send FAILED with exception but lead is saved in database');
    }

    console.log('\n📧 ========================================');
    console.log('📧 RESEND STEP COMPLETE');
    console.log('📧 ========================================\n');

    // ====================================================================
    // STEP 4: RETURN SUCCESS RESPONSE
    // ====================================================================
    // Note: We always return success if the data was saved to our database,
    // even if external integrations (Constant Contact, Resend) failed.
    // This ensures the user gets a confirmation and we don't lose leads.
    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in KPM Music School',
      data: {
        leadId: leadRecord.id, // Internal database ID (NEW)
        contactId: result?.data?.contact_id || null, // Constant Contact ID (may be null if failed)
        listId: kpmDallasList?.data?.list_id || null,
        listName: 'KPM DALLAS',
        studentName: `${formData.studentFirstName} ${formData.studentLastName}`,
        guardianName: `${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}`,
        guardianEmail: formData.emergencyContactEmail,
        // Status tracking
        constantContactStatus: leadRecord.constantContactStatus || 'pending',
        resendStatus: leadRecord.resendStatus || 'pending'
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
