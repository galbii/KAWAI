#!/usr/bin/env node

/**
 * Code Validation Script for Calendly Tracking Implementation
 *
 * This script analyzes the actual component files to verify
 * the tracking implementation is correctly structured.
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(`🔍 ${title}`, 'bright');
    console.log('='.repeat(60));
}

// File paths to analyze
const COMPONENT_FILES = {
    calendlyWidget: '/Users/chancenoonan/dev/code/KAWAI/src/app/(frontend)/[slug]/signature/components/CalendlyBookingWidget.tsx',
    signatureExperience: '/Users/chancenoonan/dev/code/KAWAI/src/app/(frontend)/[slug]/signature/components/SignatureExperience.tsx',
    dualConversion: '/Users/chancenoonan/dev/code/KAWAI/src/app/(frontend)/[slug]/signature/components/DualConversion.tsx',
    metaPixel: '/Users/chancenoonan/dev/code/KAWAI/src/components/MetaPixel.tsx'
};

// Validation patterns
const VALIDATION_PATTERNS = {
    calendlyWidget: {
        requiredImports: [
            'useCalendlyEventListener',
            'InlineWidget'
        ],
        requiredFunctions: [
            'onEventScheduled',
            'handleCalendlyEventScheduled',
            'mockHandleConversionComplete'
        ],
        requiredEventHandlers: [
            'onEventScheduled:',
            'onDateAndTimeSelected:',
            'onProfilePageViewed:'
        ],
        criticalPatterns: [
            'event.data?.payload',
            'calendly.event_scheduled',
            'window.fbq'
        ]
    },
    signatureExperience: {
        requiredImports: [
            'trackSubmitApplication',
            'trackCompleteRegistration'
        ],
        requiredFunctions: [
            'handleConversionComplete',
            'handleCalendlyEventScheduled'
        ],
        trackingCalls: [
            'trackSubmitApplication(',
            'trackCompleteRegistration('
        ],
        criticalPatterns: [
            'content_name:',
            'content_category:',
            'value:',
            'currency:'
        ]
    },
    dualConversion: {
        requiredProps: [
            'onComplete',
            'emailData',
            'assessmentResults'
        ],
        requiredFunctions: [
            'handleCalendlyEventScheduled',
            'handleCalendlyEventScheduled'
        ],
        eventFlow: [
            'onComplete(',
            'conversionType:',
            'calendlyEventData:'
        ]
    },
    metaPixel: {
        requiredFunctions: [
            'trackSubmitApplication',
            'trackEvent',
            'window.fbq'
        ],
        eventTypes: [
            'SubmitApplication',
            'CompleteRegistration'
        ]
    }
};

// Validation results
const validationResults = {
    calendlyWidget: { passed: 0, total: 0, issues: [] },
    signatureExperience: { passed: 0, total: 0, issues: [] },
    dualConversion: { passed: 0, total: 0, issues: [] },
    metaPixel: { passed: 0, total: 0, issues: [] }
};

function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        log(`Error reading ${filePath}: ${error.message}`, 'red');
        return null;
    }
}

function validatePatterns(content, patterns, componentName) {
    const results = validationResults[componentName];

    // Check required imports
    if (patterns.requiredImports) {
        patterns.requiredImports.forEach(importName => {
            results.total++;
            if (content.includes(importName)) {
                results.passed++;
                log(`  ✅ Import found: ${importName}`, 'green');
            } else {
                results.issues.push(`Missing import: ${importName}`);
                log(`  ❌ Missing import: ${importName}`, 'red');
            }
        });
    }

    // Check required functions
    if (patterns.requiredFunctions) {
        patterns.requiredFunctions.forEach(functionName => {
            results.total++;
            if (content.includes(functionName)) {
                results.passed++;
                log(`  ✅ Function found: ${functionName}`, 'green');
            } else {
                results.issues.push(`Missing function: ${functionName}`);
                log(`  ❌ Missing function: ${functionName}`, 'red');
            }
        });
    }

    // Check event handlers
    if (patterns.requiredEventHandlers) {
        patterns.requiredEventHandlers.forEach(handler => {
            results.total++;
            if (content.includes(handler)) {
                results.passed++;
                log(`  ✅ Event handler found: ${handler}`, 'green');
            } else {
                results.issues.push(`Missing event handler: ${handler}`);
                log(`  ❌ Missing event handler: ${handler}`, 'red');
            }
        });
    }

    // Check tracking calls
    if (patterns.trackingCalls) {
        patterns.trackingCalls.forEach(call => {
            results.total++;
            if (content.includes(call)) {
                results.passed++;
                log(`  ✅ Tracking call found: ${call}`, 'green');
            } else {
                results.issues.push(`Missing tracking call: ${call}`);
                log(`  ❌ Missing tracking call: ${call}`, 'red');
            }
        });
    }

    // Check critical patterns
    if (patterns.criticalPatterns) {
        patterns.criticalPatterns.forEach(pattern => {
            results.total++;
            if (content.includes(pattern)) {
                results.passed++;
                log(`  ✅ Critical pattern found: ${pattern}`, 'green');
            } else {
                results.issues.push(`Missing critical pattern: ${pattern}`);
                log(`  ⚠️  Critical pattern missing: ${pattern}`, 'yellow');
            }
        });
    }

    // Check props
    if (patterns.requiredProps) {
        patterns.requiredProps.forEach(prop => {
            results.total++;
            if (content.includes(prop)) {
                results.passed++;
                log(`  ✅ Required prop found: ${prop}`, 'green');
            } else {
                results.issues.push(`Missing required prop: ${prop}`);
                log(`  ❌ Missing required prop: ${prop}`, 'red');
            }
        });
    }

    // Check event flow
    if (patterns.eventFlow) {
        patterns.eventFlow.forEach(flow => {
            results.total++;
            if (content.includes(flow)) {
                results.passed++;
                log(`  ✅ Event flow found: ${flow}`, 'green');
            } else {
                results.issues.push(`Missing event flow: ${flow}`);
                log(`  ❌ Missing event flow: ${flow}`, 'red');
            }
        });
    }

    // Check event types
    if (patterns.eventTypes) {
        patterns.eventTypes.forEach(eventType => {
            results.total++;
            if (content.includes(eventType)) {
                results.passed++;
                log(`  ✅ Event type found: ${eventType}`, 'green');
            } else {
                results.issues.push(`Missing event type: ${eventType}`);
                log(`  ❌ Missing event type: ${eventType}`, 'red');
            }
        });
    }
}

function analyzeEventFlow(content, componentName) {
    log(`\n🔗 Event Flow Analysis for ${componentName}:`, 'cyan');

    switch (componentName) {
        case 'calendlyWidget':
            // Check for proper event listener setup
            const hasEventListener = content.includes('useCalendlyEventListener');
            const hasOnEventScheduled = content.includes('onEventScheduled');
            const hasEventData = content.includes('event.data') || content.includes('eventData');

            log(`  Event Listener Hook: ${hasEventListener ? '✅' : '❌'}`,
                hasEventListener ? 'green' : 'red');
            log(`  Event Scheduled Handler: ${hasOnEventScheduled ? '✅' : '❌'}`,
                hasOnEventScheduled ? 'green' : 'red');
            log(`  Event Data Processing: ${hasEventData ? '✅' : '❌'}`,
                hasEventData ? 'green' : 'red');
            break;

        case 'signatureExperience':
            // Check for conversion handling
            const hasConversionHandler = content.includes('handleConversionComplete');
            const hasTrackingCall = content.includes('trackSubmitApplication');
            const hasBookingType = content.includes("type === 'booking'");

            log(`  Conversion Handler: ${hasConversionHandler ? '✅' : '❌'}`,
                hasConversionHandler ? 'green' : 'red');
            log(`  Tracking Call: ${hasTrackingCall ? '✅' : '❌'}`,
                hasTrackingCall ? 'green' : 'red');
            log(`  Booking Type Check: ${hasBookingType ? '✅' : '❌'}`,
                hasBookingType ? 'green' : 'red');
            break;

        case 'dualConversion':
            // Check for callback flow
            const hasOnComplete = content.includes('onComplete');
            const hasCalendlyHandler = content.includes('handleCalendlyEventScheduled');
            const hasConversionType = content.includes('conversionType');

            log(`  onComplete Callback: ${hasOnComplete ? '✅' : '❌'}`,
                hasOnComplete ? 'green' : 'red');
            log(`  Calendly Handler: ${hasCalendlyHandler ? '✅' : '❌'}`,
                hasCalendlyHandler ? 'green' : 'red');
            log(`  Conversion Type: ${hasConversionType ? '✅' : '❌'}`,
                hasConversionType ? 'green' : 'red');
            break;

        case 'metaPixel':
            // Check for tracking functions
            const hasTrackEvent = content.includes('trackEvent');
            const hasFbq = content.includes('window.fbq');
            const hasSubmitApp = content.includes('SubmitApplication');

            log(`  Track Event Function: ${hasTrackEvent ? '✅' : '❌'}`,
                hasTrackEvent ? 'green' : 'red');
            log(`  Meta Pixel Call: ${hasFbq ? '✅' : '❌'}`,
                hasFbq ? 'green' : 'red');
            log(`  Submit Application: ${hasSubmitApp ? '✅' : '❌'}`,
                hasSubmitApp ? 'green' : 'red');
            break;
    }
}

function checkTypeScript(content, componentName) {
    log(`\n📝 TypeScript Analysis for ${componentName}:`, 'magenta');

    // Check for proper typing
    const hasProperTypes = content.includes('interface') || content.includes('type ');
    const hasEventTypes = content.includes('CalendlyEventData') || content.includes('any');
    const hasReturnTypes = content.includes(': void') || content.includes(': boolean');

    log(`  Type Definitions: ${hasProperTypes ? '✅' : '⚠️'}`,
        hasProperTypes ? 'green' : 'yellow');
    log(`  Event Type Safety: ${hasEventTypes ? '✅' : '⚠️'}`,
        hasEventTypes ? 'green' : 'yellow');
    log(`  Return Types: ${hasReturnTypes ? '✅' : '⚠️'}`,
        hasReturnTypes ? 'green' : 'yellow');
}

function validateComponent(componentName, filePath) {
    logSection(`ANALYZING ${componentName.toUpperCase()}`);

    const content = readFile(filePath);
    if (!content) {
        log(`❌ Could not read file: ${filePath}`, 'red');
        return;
    }

    log(`📁 File: ${path.basename(filePath)} (${content.length} characters)`, 'blue');

    // Validate patterns
    const patterns = VALIDATION_PATTERNS[componentName];
    if (patterns) {
        validatePatterns(content, patterns, componentName);
    }

    // Analyze event flow
    analyzeEventFlow(content, componentName);

    // Check TypeScript
    checkTypeScript(content, componentName);

    // Component-specific analysis
    if (componentName === 'calendlyWidget') {
        analyzeCalendlyWidget(content);
    } else if (componentName === 'signatureExperience') {
        analyzeSignatureExperience(content);
    }
}

function analyzeCalendlyWidget(content) {
    log(`\n🎯 Calendly Widget Specific Analysis:`, 'cyan');

    // Check for proper event structure handling
    const checksEventStructure = content.includes('event.data?.payload');
    const hasErrorHandling = content.includes('try') && content.includes('catch');
    const hasPrefillData = content.includes('prefillData');
    const hasConstantContact = content.includes('ConstantContact') || content.includes('submitToConstantContact');

    log(`  Event Structure Check: ${checksEventStructure ? '✅' : '❌'}`,
        checksEventStructure ? 'green' : 'red');
    log(`  Error Handling: ${hasErrorHandling ? '✅' : '⚠️'}`,
        hasErrorHandling ? 'green' : 'yellow');
    log(`  Prefill Data Support: ${hasPrefillData ? '✅' : '❌'}`,
        hasPrefillData ? 'green' : 'red');
    log(`  Constant Contact Integration: ${hasConstantContact ? '✅' : '❌'}`,
        hasConstantContact ? 'green' : 'red');
}

function analyzeSignatureExperience(content) {
    log(`\n🎯 Signature Experience Specific Analysis:`, 'cyan');

    // Check for proper tracking implementation
    const hasMetaPixelImport = content.includes('trackSubmitApplication');
    const hasPostHogTracking = content.includes('posthog');
    const hasProperParameters = content.includes('content_name') && content.includes('value');
    const handlesEmailData = content.includes('emailData');

    log(`  Meta Pixel Import: ${hasMetaPixelImport ? '✅' : '❌'}`,
        hasMetaPixelImport ? 'green' : 'red');
    log(`  PostHog Integration: ${hasPostHogTracking ? '✅' : '❌'}`,
        hasPostHogTracking ? 'green' : 'red');
    log(`  Proper Parameters: ${hasProperParameters ? '✅' : '❌'}`,
        hasProperParameters ? 'green' : 'red');
    log(`  Email Data Handling: ${handlesEmailData ? '✅' : '❌'}`,
        handlesEmailData ? 'green' : 'red');
}

function generateReport() {
    logSection('VALIDATION REPORT SUMMARY');

    let totalPassed = 0;
    let totalTests = 0;
    let allIssues = [];

    Object.entries(validationResults).forEach(([component, results]) => {
        totalPassed += results.passed;
        totalTests += results.total;

        const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
        const status = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';

        log(`${component}: ${results.passed}/${results.total} (${percentage}%)`, status);

        if (results.issues.length > 0) {
            allIssues.push(`${component}: ${results.issues.join(', ')}`);
        }
    });

    const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    log(`\nOverall: ${totalPassed}/${totalTests} (${overallPercentage}%)`,
        overallPercentage >= 80 ? 'green' : overallPercentage >= 60 ? 'yellow' : 'red');

    if (allIssues.length > 0) {
        logSection('ISSUES FOUND');
        allIssues.forEach(issue => log(`❌ ${issue}`, 'red'));
    }

    if (overallPercentage >= 90) {
        log('\n🎉 EXCELLENT! Tracking implementation is solid.', 'green');
    } else if (overallPercentage >= 70) {
        log('\n⚠️  GOOD! Minor issues found, but should work in production.', 'yellow');
    } else {
        log('\n🚨 ATTENTION NEEDED! Significant issues found.', 'red');
    }

    logSection('RECOMMENDATIONS');
    log('1. Run the simulation tests to verify runtime behavior', 'cyan');
    log('2. Test with real Calendly booking in staging environment', 'cyan');
    log('3. Monitor Meta Pixel events in Facebook Events Manager', 'cyan');
    log('4. Set up error monitoring for production', 'cyan');
    log('5. Add more TypeScript types for better type safety', 'cyan');
}

function main() {
    log('🎹 CALENDLY TRACKING IMPLEMENTATION VALIDATOR', 'bright');
    log('Analyzing component files for tracking implementation...', 'blue');

    // Validate each component
    Object.entries(COMPONENT_FILES).forEach(([componentName, filePath]) => {
        validateComponent(componentName, filePath);
    });

    // Generate final report
    generateReport();
}

if (require.main === module) {
    main();
}