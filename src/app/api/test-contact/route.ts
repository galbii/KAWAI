import { NextRequest, NextResponse } from 'next/server'
import { submitContactForm } from '@/lib/actions/contact-form'

export async function POST(request: NextRequest) {
  console.log('🧪 Testing Constant Contact integration...')
  console.log('📧 Submitting test form for: cklnoonan@gmail.com')

  // Create test form data
  const testFormData = new FormData()
  
  testFormData.append('firstName', 'Chance')
  testFormData.append('lastName', 'Noonan')
  testFormData.append('email', 'cklnoonan@gmail.com')
  testFormData.append('phone', '555-123-4567')
  testFormData.append('preferredContact', 'email')
  testFormData.append('inquiryType', 'general')
  testFormData.append('message', 'Test submission to verify Constant Contact integration')
  testFormData.append('subscribeToUpdates', 'true')

  try {
    const result = await submitContactForm(null, testFormData)
    
    console.log('✅ Form submission result:', result)
    
    if (result.success) {
      console.log('🎉 SUCCESS: Contact form submitted successfully!')
      console.log('📝 Message:', result.message)
      
      return NextResponse.json({
        success: true,
        message: 'Test contact submission successful',
        details: result
      })
    } else {
      console.log('❌ FAILED: Form submission failed')
      console.log('📝 Message:', result.message)
      if (result.errors) {
        console.log('🐛 Errors:', result.errors)
      }
      
      return NextResponse.json({
        success: false,
        message: 'Test contact submission failed',
        details: result
      }, { status: 400 })
    }
  } catch (error) {
    console.error('💥 ERROR: Exception during form submission:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Exception during test submission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test contact form submission',
    testData: {
      firstName: 'Chance',
      lastName: 'Noonan', 
      email: 'cklnoonan@gmail.com',
      phone: '555-123-4567',
      preferredContact: 'email',
      inquiryType: 'general',
      message: 'Test submission to verify Constant Contact integration',
      subscribeToUpdates: true
    }
  })
}