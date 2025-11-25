/**
 * Calendly Booking Simulator for University Page
 *
 * Usage:
 * 1. Open browser console on the University page
 * 2. Copy and paste this entire function
 * 3. Run: testCalendlyBooking('test@example.com', 'John', 'Doe')
 *
 * This simulates what happens when a Calendly booking is completed
 */

function testCalendlyBooking(email = 'test@example.com', firstName = 'John', lastName = 'Doe') {
  console.log('🧪 TEST: Simulating Calendly booking event...');

  // Create a mock Calendly event that matches the real structure
  const mockCalendlyEvent = {
    event: 'calendly.event_scheduled',
    data: {
      event: 'calendly.event_scheduled',
      payload: {
        event: {
          uuid: `test-${Date.now()}`,
          name: 'TSU Piano Sale Consultation',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          created_at: new Date().toISOString(),
          location: {
            type: 'physical',
            location: 'Piano Gallery Showroom'
          },
          invitees: [
            {
              uuid: `invitee-${Date.now()}`,
              name: `${firstName} ${lastName}`,
              email: email,
              status: 'active',
              created_at: new Date().toISOString()
            }
          ],
          uri: `https://api.calendly.com/scheduled_events/test-${Date.now()}`
        },
        invitee: {
          uuid: `invitee-${Date.now()}`,
          name: `${firstName} ${lastName}`,
          email: email,
          status: 'active',
          created_at: new Date().toISOString(),
          uri: `https://api.calendly.com/scheduled_events/test-${Date.now()}/invitees/test`
        }
      }
    }
  };

  console.log('📋 Mock Calendly Event:', mockCalendlyEvent);

  // Dispatch the event that react-calendly listens for
  const calendlyEvent = new MessageEvent('message', {
    data: mockCalendlyEvent,
    origin: 'https://calendly.com'
  });

  console.log('📤 Dispatching Calendly event to window...');
  window.dispatchEvent(calendlyEvent);

  console.log('✅ Test event dispatched! Check console for tracking logs.');
  console.log('Expected logs:');
  console.log('  - 🎯 [TSU Piano Sale] Booking completed');
  console.log('  - 📧 Extracted email from Calendly');
  console.log('  - 🎉 Booking COMPLETED! Adding to TSU2025 list');

  return mockCalendlyEvent;
}

/**
 * Alternative: Test with prefillData only (no Calendly event)
 * This tests if the prefillData fallback works
 */
function testWithPrefillOnly() {
  console.log('🧪 TEST: Simulating booking with prefillData only (no Calendly payload)');

  const mockEvent = {
    event: 'calendly.event_scheduled',
    data: {
      event: 'calendly.event_scheduled',
      payload: {
        // Intentionally empty payload to test prefillData fallback
        event: {
          uuid: `test-prefill-${Date.now()}`
        }
      }
    }
  };

  const calendlyEvent = new MessageEvent('message', {
    data: mockEvent,
    origin: 'https://calendly.com'
  });

  console.log('📤 Dispatching Calendly event with empty payload...');
  window.dispatchEvent(calendlyEvent);

  console.log('✅ Test event dispatched! This should use prefillData from the form.');

  return mockEvent;
}

/**
 * Check if prefillData is available
 */
function checkPrefillData() {
  console.log('🔍 Checking React state for prefillData...');
  console.log('Note: This may not be accessible directly. Check the logs from BookingSection instead.');
  console.log('Look for: "BookingSection: prefillData state updated"');
}

// Export for easy access
window.testCalendlyBooking = testCalendlyBooking;
window.testWithPrefillOnly = testWithPrefillOnly;
window.checkPrefillData = checkPrefillData;

console.log('✅ Calendly test utilities loaded!');
console.log('Usage:');
console.log('  testCalendlyBooking("test@example.com", "John", "Doe") - Full test');
console.log('  testWithPrefillOnly() - Test prefillData fallback');
console.log('  checkPrefillData() - Check if form data was captured');
