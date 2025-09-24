# 🎹 Calendly Booking Tracking Test Guide

## Overview

This guide provides comprehensive testing tools to verify that the Calendly booking simulation on signature pages correctly fires "submit application" tracking events. The testing suite includes multiple approaches to validate the complete event flow from Calendly booking to Meta Pixel tracking.

## 📋 What We're Testing

### Expected Event Flow
```
Calendly Event → useCalendlyEventListener → handleCalendlyEventScheduled →
onComplete → handleConversionComplete → trackSubmitApplication → Meta Pixel
```

### Key Components
1. **CalendlyBookingWidget.tsx** - Calendly integration with event listening
2. **SignatureExperience.tsx** - Main flow controller with tracking implementation
3. **DualConversion.tsx** - Booking flow component
4. **MetaPixel.tsx** - Meta Pixel tracking utilities

## 🧪 Test Suite Components

### 1. HTML Visual Test (`test-calendly-tracking.html`)
**Purpose**: Interactive browser-based test with visual interface

**Features**:
- ✅ Visual test interface with real-time event monitoring
- ✅ Step-by-step flow simulation
- ✅ Meta Pixel mock with parameter validation
- ✅ Component integration verification
- ✅ Error handling testing

**How to Use**:
```bash
# Open in browser
open test-calendly-tracking.html
# or
python -m http.server 8000
# Then visit: http://localhost:8000/test-calendly-tracking.html
```

**Test Steps**:
1. Click "Simulate Calendly Event" - Tests event structure
2. Click "Test Full Tracking Chain" - Tests end-to-end flow
3. Click "Test Component Integration" - Tests error handling

### 2. Node.js Simulation (`test-calendly-simulation.cjs`)
**Purpose**: Command-line comprehensive testing with detailed analysis

**Features**:
- ✅ Complete event flow simulation
- ✅ Component file verification
- ✅ Mock Calendly event data
- ✅ Meta Pixel tracking validation
- ✅ Error handling testing
- ✅ Constant Contact integration testing
- ✅ Production recommendations

**How to Use**:
```bash
node test-calendly-simulation.cjs
```

**Expected Output**:
```
============================================================
🎹 CALENDLY BOOKING TRACKING SIMULATION TEST
============================================================

✅ PASS event structure validation
✅ PASS event listener registration
✅ PASS handler execution
✅ PASS conversion complete
✅ PASS meta pixel tracking
✅ PASS parameter validation

Tests Passed: 6/8 (75%)
```

### 3. Browser Integration Test (`test-calendly-integration.js`)
**Purpose**: Real-time testing on actual signature pages

**Features**:
- ✅ Live page environment testing
- ✅ Real component detection
- ✅ Meta Pixel interceptor
- ✅ Calendly event simulation
- ✅ Production environment validation

**How to Use**:
1. Navigate to a signature page: `/houston-baby-grand/signature`
2. Open browser console (F12)
3. Paste the script and run it
4. Click "Start Test" in the floating UI
5. Click "Simulate Booking" to test the flow

## 📊 Test Results Analysis

### Critical Success Indicators

#### ✅ PASS Criteria
- **Event Structure Validation**: Calendly event data matches expected format
- **Event Listener Registration**: useCalendlyEventListener hook is active
- **Handler Execution**: handleCalendlyEventScheduled processes events
- **Conversion Complete**: handleConversionComplete is called correctly
- **Meta Pixel Tracking**: trackSubmitApplication fires with correct parameters
- **Parameter Validation**: Meta Pixel receives required fields

#### ❌ Common Issues
- **Meta Pixel Not Loaded**: Check if Meta Pixel script is included
- **Event Listeners Not Active**: Verify useCalendlyEventListener implementation
- **Missing Parameters**: Ensure tracking calls include all required fields
- **Component Not Found**: Check if signature page components are loaded

### Expected Meta Pixel Events

#### SubmitApplication Event
```javascript
fbq('track', 'SubmitApplication', {
  content_name: 'Signature Experience - houston-baby-grand',
  content_category: 'piano_consultation',
  value: 1000,
  currency: 'USD',
  status: 'calendly_booking'
})
```

#### CompleteRegistration Event
```javascript
fbq('track', 'CompleteRegistration', {
  content_name: 'Piano Consultation - houston-baby-grand',
  content_category: 'signature_collection',
  value: 1000,
  currency: 'USD'
})
```

## 🔧 Component Implementation Verification

### CalendlyBookingWidget.tsx
**Key Elements to Verify**:
```typescript
// Event listener setup
useCalendlyEventListener({
  onEventScheduled: (event) => {
    console.log('🎉 Calendly Event Scheduled:', event)
    onEventScheduled?.(event)
  }
})

// Event data structure
const eventData = {
  event: "calendly.event_scheduled",
  data: {
    payload: {
      event: { uri: "..." },
      invitee: { uri: "...", email: "..." }
    }
  }
}
```

### SignatureExperience.tsx
**Key Elements to Verify**:
```typescript
// Conversion handler
const handleConversionComplete = (type: 'email' | 'booking', data: any) => {
  if (type === 'booking') {
    trackSubmitApplication({
      content_name: `Signature Experience - ${slug}`,
      content_category: 'piano_consultation',
      value: 1000,
      currency: 'USD',
      status: data.conversionType === 'calendly' ? 'calendly_booking' : 'manual_booking'
    })
  }
}
```

### DualConversion.tsx
**Key Elements to Verify**:
```typescript
// Calendly event handler
const handleCalendlyEventScheduled = (eventData: any) => {
  console.log('🎉 Calendly consultation booked successfully:', eventData)
  onComplete('booking', {
    conversionType: 'calendly',
    assessmentResults,
    location,
    calendlyEventData: eventData
  })
}
```

## 🚨 Troubleshooting Guide

### Issue: "Meta Pixel not found"
**Solutions**:
1. Check if Meta Pixel script is loaded in document head
2. Verify `window.fbq` function exists
3. Ensure Meta Pixel ID is configured correctly

### Issue: "Calendly events not firing"
**Solutions**:
1. Verify useCalendlyEventListener is imported from 'react-calendly'
2. Check browser console for Calendly script errors
3. Ensure Calendly widget is properly initialized

### Issue: "Handler not executing"
**Solutions**:
1. Check onEventScheduled callback is passed to CalendlyBookingWidget
2. Verify event data structure matches expected format
3. Add console.log statements to trace execution flow

### Issue: "Tracking parameters missing"
**Solutions**:
1. Verify emailData is passed correctly to DualConversion
2. Check slug parameter is available in SignatureExperience
3. Ensure assessmentResults are populated before conversion

## 📈 Production Monitoring

### Recommended Analytics Setup
1. **Meta Pixel Events Manager**: Monitor SubmitApplication events
2. **Google Analytics**: Track custom events for bookings
3. **PostHog**: Capture detailed user flow analytics
4. **Sentry**: Monitor JavaScript errors in booking flow

### Key Metrics to Track
- **Conversion Rate**: Signature page visits → bookings
- **Event Firing Rate**: Calendly bookings → Meta Pixel events
- **Error Rate**: Failed tracking events
- **Time to Book**: User journey duration

### Production Validation Steps
1. **Staging Test**: Run full test suite on staging environment
2. **Real Booking**: Complete actual Calendly booking and verify events
3. **Cross-browser**: Test on Chrome, Safari, Firefox, Mobile
4. **Network Conditions**: Test on slow/fast connections
5. **Error Scenarios**: Test with ad blockers, disabled JavaScript

## 🔍 Code Review Checklist

### Before Deployment
- [ ] All test cases pass in test suite
- [ ] Meta Pixel events visible in Facebook Events Manager
- [ ] Calendly booking completes successfully
- [ ] Email data flows correctly through components
- [ ] Assessment results are preserved through conversion
- [ ] Error handling prevents crashes on malformed data
- [ ] TypeScript types are correctly defined
- [ ] Console logging is appropriate for production

### Component Integration
- [ ] CalendlyBookingWidget properly handles event listeners
- [ ] SignatureExperience manages state transitions correctly
- [ ] DualConversion passes data to completion handlers
- [ ] MetaPixel functions are imported and called correctly
- [ ] PostHog events complement Meta Pixel tracking

## 📱 Mobile Testing

### Additional Considerations
- Touch events on Calendly widget
- Viewport scaling on mobile devices
- Network connectivity changes
- Background/foreground app states
- iOS Safari specific behaviors

### Mobile Test Script
```javascript
// Add to browser console on mobile device
navigator.userAgent.includes('Mobile') && console.log('Mobile device detected');
window.orientation !== undefined && console.log('Orientation supported');
```

## 🎯 Success Criteria

### Minimum Requirements
✅ **Event Flow**: Calendly booking → Meta Pixel SubmitApplication
✅ **Data Integrity**: All required parameters present and valid
✅ **Error Handling**: Graceful handling of edge cases
✅ **Cross-browser**: Works on major browsers
✅ **Performance**: No significant impact on page load

### Optimal Implementation
✅ **Real-time Monitoring**: Events tracked and monitored
✅ **Analytics Integration**: Multiple tracking systems active
✅ **User Experience**: Smooth booking flow
✅ **Data Quality**: Accurate conversion attribution
✅ **Error Recovery**: Automatic retry mechanisms

---

## 🚀 Quick Start

1. **Run Command Line Test**:
   ```bash
   node test-calendly-simulation.cjs
   ```

2. **Open Visual Test**:
   ```bash
   open test-calendly-tracking.html
   ```

3. **Test Live Page**:
   - Go to `/houston-baby-grand/signature`
   - Paste `test-calendly-integration.js` in console
   - Click "Start Test"

All tests should show ✅ PASS for tracking events to be considered functional.