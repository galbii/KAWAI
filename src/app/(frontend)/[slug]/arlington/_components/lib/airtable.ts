// Airtable integration for storing booking data

interface BookingData {
  name: string;
  email: string;
  phone?: string;
  startTime: string;
  endTime: string;
  eventType: string;
  location?: string;
  additionalNotes?: string;
  bookingId: string;
  uid: string;
}

export async function saveToAirtable(bookingData: BookingData) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = 'Piano Consultations';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{
        fields: {
          'Name': bookingData.name,
          'Email': bookingData.email,
          'Phone': bookingData.phone || '',
          'Start Time': bookingData.startTime,
          'End Time': bookingData.endTime,
          'Event Type': bookingData.eventType,
          'Location': bookingData.location || '',
          'Notes': bookingData.additionalNotes || '',
          'Booking ID': bookingData.bookingId,
          'Cal.com UID': bookingData.uid,
          'Created': new Date().toISOString()
        }
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.statusText}`);
  }

  return response.json();
}

// Add these to your .env.local file:
// AIRTABLE_API_KEY=your_airtable_api_key
// AIRTABLE_BASE_ID=your_airtable_base_id