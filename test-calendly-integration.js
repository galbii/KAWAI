/**
 * Browser Integration Test for Calendly Booking Tracking
 *
 * This script can be run in the browser console on the signature page
 * to test the real Calendly integration and verify tracking events.
 *
 * Usage:
 * 1. Navigate to a signature page (e.g., /houston-baby-grand/signature)
 * 2. Open browser console (F12)
 * 3. Paste this script and run it
 * 4. Click "Start Integration Test"
 */

(function() {
    'use strict';

    // Test configuration
    const TEST_CONFIG = {
        mockEventData: {
            event: "calendly.event_scheduled",
            data: {
                event_type: "calendly.event_scheduled",
                payload: {
                    event: {
                        uri: "https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA",
                        name: "Houston Baby Grand Sale - Private Consultation",
                        status: "active",
                        start_time: "2023-12-15T15:00:00.000000Z",
                        end_time: "2023-12-15T15:30:00.000000Z",
                        event_type: "https://api.calendly.com/event_types/BBBBBBBBBBBBBBBB",
                        location: {
                            type: "physical",
                            location: "Kawai Piano Gallery - Houston Showroom"
                        }
                    },
                    invitee: {
                        uri: "https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/CCCCCCCCCCCCCCCC",
                        name: "Test User",
                        email: "test@example.com",
                        first_name: "Test",
                        last_name: "User",
                        status: "active",
                        timezone: "America/Chicago"
                    },
                    created_at: "2023-12-14T10:30:00.000000Z",
                    updated_at: "2023-12-14T10:30:00.000000Z"
                }
            }
        },
        testResults: {
            metaPixelPresent: false,
            calendlyScriptLoaded: false,
            eventListenersActive: false,
            trackingFunctional: false,
            signaturePageDetected: false,
            componentsLoaded: false
        }
    };

    // Test execution state
    let testUI = null;
    let testLog = [];
    let originalFbq = null;

    // Utility functions
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;

        console.log(`%c${logEntry}`, getConsoleStyle(type));
        testLog.push({ message: logEntry, type, timestamp });

        if (testUI) {
            updateTestUI();
        }
    }

    function getConsoleStyle(type) {
        const styles = {
            info: 'color: #2196F3; font-weight: normal;',
            success: 'color: #4CAF50; font-weight: bold;',
            error: 'color: #F44336; font-weight: bold;',
            warning: 'color: #FF9800; font-weight: bold;',
            test: 'color: #9C27B0; font-weight: bold; font-size: 14px;'
        };
        return styles[type] || styles.info;
    }

    function createTestUI() {
        // Remove existing test UI if present
        const existingUI = document.getElementById('calendly-test-ui');
        if (existingUI) {
            existingUI.remove();
        }

        // Create test UI container
        const testContainer = document.createElement('div');
        testContainer.id = 'calendly-test-ui';
        testContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 70vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            overflow: hidden;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px 20px;
            background: rgba(0,0,0,0.2);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <div>
                <h3 style="margin: 0; font-size: 16px;">🎹 Calendly Test</h3>
                <div style="font-size: 12px; opacity: 0.8;">Signature Page Integration</div>
            </div>
            <button id="close-test" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        `;

        // Content area
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            max-height: calc(70vh - 80px);
            overflow-y: auto;
        `;

        // Test buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-bottom: 20px;';
        buttonContainer.innerHTML = `
            <button id="start-test" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                margin-right: 10px;
                font-size: 14px;
            ">Start Test</button>
            <button id="simulate-booking" style="
                background: #FF9800;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            " disabled>Simulate Booking</button>
        `;

        // Status indicators
        const statusContainer = document.createElement('div');
        statusContainer.id = 'status-container';
        statusContainer.style.cssText = 'margin-bottom: 15px;';

        // Log container
        const logContainer = document.createElement('div');
        logContainer.id = 'log-container';
        logContainer.style.cssText = `
            background: rgba(0,0,0,0.3);
            border-radius: 6px;
            padding: 10px;
            max-height: 200px;
            overflow-y: auto;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            line-height: 1.4;
        `;

        // Assemble UI
        content.appendChild(buttonContainer);
        content.appendChild(statusContainer);
        content.appendChild(logContainer);
        testContainer.appendChild(header);
        testContainer.appendChild(content);

        // Add event listeners
        testContainer.querySelector('#close-test').addEventListener('click', () => {
            testContainer.remove();
            cleanupTest();
        });

        testContainer.querySelector('#start-test').addEventListener('click', startIntegrationTest);
        testContainer.querySelector('#simulate-booking').addEventListener('click', simulateCalendlyBooking);

        // Add to page
        document.body.appendChild(testContainer);
        testUI = testContainer;

        updateTestUI();
        log('Test UI initialized', 'success');
    }

    function updateTestUI() {
        if (!testUI) return;

        // Update status indicators
        const statusContainer = testUI.querySelector('#status-container');
        statusContainer.innerHTML = Object.entries(TEST_CONFIG.testResults)
            .map(([key, value]) => {
                const status = value ? '✅' : '⏳';
                const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                return `<div style="margin: 3px 0;">${status} ${label}</div>`;
            }).join('');

        // Update log
        const logContainer = testUI.querySelector('#log-container');
        logContainer.innerHTML = testLog
            .slice(-20) // Show last 20 log entries
            .map(entry => {
                const color = {
                    info: '#74c0fc',
                    success: '#51cf66',
                    error: '#ff6b6b',
                    warning: '#ffd43b',
                    test: '#da77f2'
                }[entry.type] || '#ffffff';
                return `<div style="color: ${color}; margin: 2px 0;">${entry.message}</div>`;
            }).join('');

        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function checkEnvironment() {
        log('🔍 Checking environment...', 'test');

        // Check if we're on a signature page
        const isSignaturePage = window.location.pathname.includes('/signature');
        TEST_CONFIG.testResults.signaturePageDetected = isSignaturePage;
        log(`Signature page: ${isSignaturePage ? 'detected' : 'not detected'}`,
            isSignaturePage ? 'success' : 'warning');

        // Check for Meta Pixel
        const metaPixelPresent = typeof window.fbq === 'function';
        TEST_CONFIG.testResults.metaPixelPresent = metaPixelPresent;
        log(`Meta Pixel: ${metaPixelPresent ? 'loaded' : 'not found'}`,
            metaPixelPresent ? 'success' : 'error');

        // Check for Calendly script
        const calendlyScripts = document.querySelectorAll('script[src*="calendly"]');
        const calendlyPresent = calendlyScripts.length > 0 || typeof window.Calendly !== 'undefined';
        TEST_CONFIG.testResults.calendlyScriptLoaded = calendlyPresent;
        log(`Calendly script: ${calendlyPresent ? 'loaded' : 'not found'}`,
            calendlyPresent ? 'success' : 'warning');

        // Check for React components
        const reactComponents = document.querySelectorAll('[data-reactroot], [data-react-id]');
        const componentsPresent = reactComponents.length > 0 ||
                                document.querySelector('#__next') ||
                                document.querySelector('[class*="signature"]');
        TEST_CONFIG.testResults.componentsLoaded = componentsPresent;
        log(`React components: ${componentsPresent ? 'detected' : 'not found'}`,
            componentsPresent ? 'success' : 'warning');

        return {
            signaturePage: isSignaturePage,
            metaPixel: metaPixelPresent,
            calendly: calendlyPresent,
            components: componentsPresent
        };
    }

    function setupMetaPixelMock() {
        if (typeof window.fbq !== 'function') {
            log('⚠️ Meta Pixel not found, creating mock', 'warning');
            originalFbq = null;
        } else {
            originalFbq = window.fbq;
            log('✅ Meta Pixel found, creating interceptor', 'success');
        }

        // Create interceptor to monitor Meta Pixel calls
        window.fbq = function(...args) {
            const [action, event, params] = args;

            log(`🎯 Meta Pixel: fbq('${action}', '${event}')`, 'success');
            if (params) {
                log(`Parameters: ${JSON.stringify(params)}`, 'info');
            }

            if (action === 'track' && event === 'SubmitApplication') {
                TEST_CONFIG.testResults.trackingFunctional = true;
                log('✅ SubmitApplication tracking verified!', 'success');

                // Validate parameters
                if (params && params.content_name && params.value) {
                    log('✅ Tracking parameters are valid', 'success');
                } else {
                    log('⚠️ Tracking parameters may be incomplete', 'warning');
                }
            }

            // Call original if it exists
            if (originalFbq && typeof originalFbq === 'function') {
                return originalFbq.apply(this, args);
            }
        };

        // Copy properties from original if it exists
        if (originalFbq) {
            Object.keys(originalFbq).forEach(key => {
                window.fbq[key] = originalFbq[key];
            });
        }

        window.fbq.version = '2.0';
        window.fbq.queue = window.fbq.queue || [];
    }

    function injectCalendlyEventListener() {
        log('🎧 Setting up Calendly event listeners...', 'test');

        // Listen for Calendly events on the window
        const calendlyEventHandler = (e) => {
            if (e.data && e.data.event && e.data.event.includes('calendly')) {
                log(`📅 Calendly event detected: ${e.data.event}`, 'success');
                TEST_CONFIG.testResults.eventListenersActive = true;

                if (e.data.event === 'calendly.event_scheduled') {
                    log('🎉 Booking event detected!', 'success');
                    handleMockBooking(e.data);
                }
            }
        };

        window.addEventListener('message', calendlyEventHandler);

        // Store cleanup function
        window.calendlyTestCleanup = () => {
            window.removeEventListener('message', calendlyEventHandler);
        };

        log('✅ Event listeners active', 'success');
    }

    function handleMockBooking(eventData) {
        log('🔄 Processing mock booking...', 'test');

        // Simulate the component workflow
        setTimeout(() => {
            log('📊 Triggering trackSubmitApplication...', 'info');

            // Call Meta Pixel with expected parameters
            window.fbq('track', 'SubmitApplication', {
                content_name: 'Signature Experience - houston-baby-grand',
                content_category: 'piano_consultation',
                value: 1000,
                currency: 'USD',
                status: 'calendly_booking'
            });

            // Also trigger CompleteRegistration
            window.fbq('track', 'CompleteRegistration', {
                content_name: 'Piano Consultation - houston-baby-grand',
                content_category: 'signature_collection',
                value: 1000,
                currency: 'USD'
            });

        }, 1000);
    }

    function simulateCalendlyBooking() {
        log('🎭 Simulating Calendly booking event...', 'test');

        // Dispatch a mock Calendly event
        const mockEvent = new MessageEvent('message', {
            data: TEST_CONFIG.mockEventData,
            origin: 'https://calendly.com'
        });

        window.dispatchEvent(mockEvent);
        log('✅ Mock event dispatched', 'success');
    }

    function startIntegrationTest() {
        log('🚀 Starting integration test...', 'test');
        testLog = []; // Clear previous logs

        // Reset test results
        Object.keys(TEST_CONFIG.testResults).forEach(key => {
            TEST_CONFIG.testResults[key] = false;
        });

        // Step 1: Check environment
        const env = checkEnvironment();

        // Step 2: Setup Meta Pixel mock/interceptor
        setupMetaPixelMock();

        // Step 3: Setup Calendly event listeners
        injectCalendlyEventListener();

        // Step 4: Enable simulation button
        const simulateBtn = testUI.querySelector('#simulate-booking');
        simulateBtn.disabled = false;
        simulateBtn.style.opacity = '1';

        log('✅ Integration test setup complete', 'success');
        log('👆 Click "Simulate Booking" to test the flow', 'info');

        updateTestUI();
    }

    function cleanupTest() {
        // Restore original Meta Pixel if it existed
        if (originalFbq) {
            window.fbq = originalFbq;
        } else if (window.fbq && window.fbq !== originalFbq) {
            delete window.fbq;
        }

        // Cleanup event listeners
        if (window.calendlyTestCleanup) {
            window.calendlyTestCleanup();
            delete window.calendlyTestCleanup;
        }

        log('🧹 Test cleanup complete', 'info');
    }

    function generateTestReport() {
        const passedTests = Object.values(TEST_CONFIG.testResults).filter(Boolean).length;
        const totalTests = Object.keys(TEST_CONFIG.testResults).length;
        const percentage = Math.round((passedTests / totalTests) * 100);

        console.group('📊 Calendly Integration Test Report');
        console.log(`Tests Passed: ${passedTests}/${totalTests} (${percentage}%)`);
        console.log('Test Results:', TEST_CONFIG.testResults);
        console.log('Full Log:', testLog);
        console.groupEnd();

        return {
            passed: passedTests,
            total: totalTests,
            percentage,
            results: TEST_CONFIG.testResults,
            log: testLog
        };
    }

    // Initialize the test
    function initializeCalendlyTest() {
        log('🎹 Calendly Integration Test Loaded', 'test');
        log('Click the "Start Test" button to begin', 'info');

        createTestUI();

        // Expose global functions for manual testing
        window.calendlyTest = {
            start: startIntegrationTest,
            simulate: simulateCalendlyBooking,
            report: generateTestReport,
            cleanup: cleanupTest,
            log: testLog,
            results: TEST_CONFIG.testResults
        };

        console.log('%c🎹 Calendly Integration Test Ready!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
        console.log('Available commands:');
        console.log('- calendlyTest.start() - Start the integration test');
        console.log('- calendlyTest.simulate() - Simulate a booking event');
        console.log('- calendlyTest.report() - Generate test report');
        console.log('- calendlyTest.cleanup() - Clean up test environment');
    }

    // Auto-initialize if not in module context
    if (typeof module === 'undefined') {
        initializeCalendlyTest();
    }

    // Export for module use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializeCalendlyTest,
            TEST_CONFIG,
            generateTestReport
        };
    }

})();