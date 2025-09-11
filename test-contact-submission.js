// Test script to submit a contact form to Constant Contact
const { submitContactForm } = require('./src/lib/actions/contact-form.ts');

async function testFormSubmission() {
  // Create test form data
  const testFormData = new FormData();
  
  testFormData.append('firstName', 'Chance');
  testFormData.append('lastName', 'Noonan');
  testFormData.append('email', 'cklnoonan@gmail.com');
  testFormData.append('phone', '555-123-4567');
  testFormData.append('preferredContact', 'email');
  testFormData.append('inquiryType', 'general');
  testFormData.append('message', 'Test submission to verify Constant Contact integration');
  testFormData.append('subscribeToUpdates', 'true');

  console.log('🧪 Testing Constant Contact integration...');
  console.log('📧 Submitting test form for: cklnoonan@gmail.com');

  try {
    const result = await submitContactForm(null, testFormData);
    
    console.log('✅ Form submission result:', result);
    
    if (result.success) {
      console.log('🎉 SUCCESS: Contact form submitted successfully!');
      console.log('📝 Message:', result.message);
    } else {
      console.log('❌ FAILED: Form submission failed');
      console.log('📝 Message:', result.message);
      if (result.errors) {
        console.log('🐛 Errors:', result.errors);
      }
    }
  } catch (error) {
    console.error('💥 ERROR: Exception during form submission:', error);
  }
}

// Run the test
testFormSubmission();