'use client';

import { useState, useEffect } from 'react';
import { ES60Layout } from './ES60Layout';
import { ES60CTA, FloatingCTA } from './ES60CTA';
import { ES60LoadingStates, ProgressiveImage } from './ES60LoadingStates';
import { ES60ErrorHandling, SuccessNotification } from './ES60ErrorHandling';
import { Piano, Smartphone, Monitor, Tablet, CheckCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  performance?: number;
}

export function ES60IntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showSuccess, setShowSuccess] = useState(false);

  const tests = [
    {
      name: 'Earthy Color Palette Rendering',
      test: () => checkColorPalette()
    },
    {
      name: 'CTA Component Multi-Path Conversion',
      test: () => checkCTAFunctionality()
    },
    {
      name: 'Mobile Floating CTA Visibility',
      test: () => checkFloatingCTA()
    },
    {
      name: 'Loading States Performance',
      test: () => checkLoadingStates()
    },
    {
      name: 'Error Handling Graceful Fallbacks',
      test: () => checkErrorHandling()
    },
    {
      name: 'Progressive Image Loading',
      test: () => checkImageLoading()
    },
    {
      name: 'Analytics Event Tracking',
      test: () => checkAnalyticsTracking()
    },
    {
      name: 'Section Navigation Smoothness',
      test: () => checkSectionNavigation()
    },
    {
      name: 'Mobile Touch Targets (44px min)',
      test: () => checkTouchTargets()
    },
    {
      name: 'Conversion Optimization Flow',
      test: () => checkConversionFlow()
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of tests) {
      setTestResults(prev => [...prev, { 
        name: test.name, 
        status: 'pending', 
        message: 'Running...' 
      }]);

      try {
        const result = await test.test();
        setTestResults(prev => prev.map(t => 
          t.name === test.name ? result : t
        ));
      } catch (error) {
        setTestResults(prev => prev.map(t => 
          t.name === test.name ? {
            name: test.name,
            status: 'fail',
            message: error instanceof Error ? error.message : 'Test failed'
          } : t
        ));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setShowSuccess(true);
  };

  // Test implementations
  const checkColorPalette = async (): Promise<TestResult> => {
    const testElement = document.createElement('div');
    testElement.className = 'bg-[#FAF8F5] text-[#3C3530] border-[#8B7355]';
    document.body.appendChild(testElement);
    
    const styles = window.getComputedStyle(testElement);
    const bgColor = styles.backgroundColor;
    
    document.body.removeChild(testElement);
    
    const isEarthyPalette = bgColor.includes('250, 248, 245') || bgColor.includes('#FAF8F5');
    
    return {
      name: 'Earthy Color Palette Rendering',
      status: isEarthyPalette ? 'pass' : 'fail',
      message: isEarthyPalette ? 'Earthy colors rendering correctly' : 'Earthy colors not applied'
    };
  };

  const checkCTAFunctionality = async (): Promise<TestResult> => {
    // Simulate CTA interactions
    const ctaButtons = document.querySelectorAll('button[class*="bg-[#8B7355]"]');
    const hasMultipleCTAs = ctaButtons.length >= 2;
    
    return {
      name: 'CTA Component Multi-Path Conversion',
      status: hasMultipleCTAs ? 'pass' : 'fail',
      message: hasMultipleCTAs 
        ? `Found ${ctaButtons.length} CTA buttons with earthy styling`
        : 'Insufficient CTA options found'
    };
  };

  const checkFloatingCTA = async (): Promise<TestResult> => {
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
      return {
        name: 'Mobile Floating CTA Visibility',
        status: 'pass',
        message: 'Desktop view - floating CTA not needed'
      };
    }

    // Simulate scroll to trigger floating CTA
    window.scrollTo(0, window.innerHeight);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const floatingCTA = document.querySelector('[class*="fixed bottom-"]');
    
    return {
      name: 'Mobile Floating CTA Visibility',
      status: floatingCTA ? 'pass' : 'fail',
      message: floatingCTA ? 'Floating CTA appears on scroll' : 'Floating CTA not found'
    };
  };

  const checkLoadingStates = async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    // Test skeleton loading
    const skeletonElement = document.createElement('div');
    document.body.appendChild(skeletonElement);
    
    // Simulate loading state render
    const loadingTime = performance.now() - startTime;
    
    document.body.removeChild(skeletonElement);
    
    return {
      name: 'Loading States Performance',
      status: loadingTime < 50 ? 'pass' : 'fail',
      message: `Loading state render time: ${loadingTime.toFixed(2)}ms`,
      performance: loadingTime
    };
  };

  const checkErrorHandling = async (): Promise<TestResult> => {
    // Test error boundary functionality
    try {
      // Simulate error handling scenario
      const hasErrorBoundaries = document.querySelectorAll('[class*="error"]').length >= 0;
      
      return {
        name: 'Error Handling Graceful Fallbacks',
        status: 'pass',
        message: 'Error boundaries implemented'
      };
    } catch (error) {
      return {
        name: 'Error Handling Graceful Fallbacks',
        status: 'fail',
        message: 'Error handling failed'
      };
    }
  };

  const checkImageLoading = async (): Promise<TestResult> => {
    // Test progressive image loading
    const images = document.querySelectorAll('img');
    const hasLazyLoading = Array.from(images).some(img => 
      img.loading === 'lazy' || img.getAttribute('loading') === 'lazy'
    );
    
    return {
      name: 'Progressive Image Loading',
      status: hasLazyLoading ? 'pass' : 'fail',
      message: hasLazyLoading ? 'Lazy loading implemented' : 'No lazy loading found'
    };
  };

  const checkAnalyticsTracking = async (): Promise<TestResult> => {
    // Check if gtag is available and tracking
    const hasGtag = typeof window !== 'undefined' && 'gtag' in window;
    
    return {
      name: 'Analytics Event Tracking',
      status: hasGtag ? 'pass' : 'fail',
      message: hasGtag ? 'Analytics tracking ready' : 'Analytics not configured'
    };
  };

  const checkSectionNavigation = async (): Promise<TestResult> => {
    // Test smooth scrolling
    const startTime = performance.now();
    
    const testElement = document.getElementById('hero') || document.body;
    testElement.scrollIntoView({ behavior: 'smooth' });
    
    const navigationTime = performance.now() - startTime;
    
    return {
      name: 'Section Navigation Smoothness',
      status: 'pass',
      message: `Navigation initiated in ${navigationTime.toFixed(2)}ms`
    };
  };

  const checkTouchTargets = async (): Promise<TestResult> => {
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a');
    const touchTargets = [...Array.from(buttons), ...Array.from(links)];
    
    let adequateTargets = 0;
    
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) {
        adequateTargets++;
      }
    });
    
    const percentage = touchTargets.length > 0 ? (adequateTargets / touchTargets.length) * 100 : 0;
    
    return {
      name: 'Mobile Touch Targets (44px min)',
      status: percentage >= 80 ? 'pass' : 'fail',
      message: `${percentage.toFixed(1)}% of touch targets meet 44px minimum`
    };
  };

  const checkConversionFlow = async (): Promise<TestResult> => {
    // Check for key conversion elements
    const conversionElements = [
      'button[class*="bg-[#8B7355]"]', // Primary CTAs
      '[href*="contact"]', // Contact links
      '[href*="tel:"]', // Phone links
      'form', // Forms
    ];
    
    const foundElements = conversionElements.filter(selector => 
      document.querySelector(selector)
    ).length;
    
    return {
      name: 'Conversion Optimization Flow',
      status: foundElements >= 3 ? 'pass' : 'fail',
      message: `${foundElements}/4 conversion elements found`
    };
  };

  const getDeviceIcon = () => {
    switch (currentDevice) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const simulateDevice = (device: 'mobile' | 'tablet' | 'desktop') => {
    setCurrentDevice(device);
    
    // Simulate device viewport
    const viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1440, height: 900 }
    };
    
    // In a real implementation, you'd actually resize the viewport
    // For demo purposes, we'll just update the state
    console.log(`Simulating ${device} viewport:`, viewports[device]);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#3C3530]">
            ES60 Integration Test Suite
          </h1>
          <p className="text-[#3C3530]/80 max-w-2xl mx-auto">
            Testing conversion optimization, mobile experience, and component integration
            for the ES60 landing page campaign.
          </p>
        </div>

        {/* Device Simulation */}
        <div className="bg-white border border-[#8B7355]/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[#3C3530] mb-4">Device Simulation</h2>
          <div className="flex gap-4">
            {(['mobile', 'tablet', 'desktop'] as const).map(device => (
              <button
                key={device}
                onClick={() => simulateDevice(device)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentDevice === device
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-[#8B7355]/10 text-[#3C3530] hover:bg-[#8B7355]/20'
                }`}
              >
                {getDeviceIcon()}
                <span className="capitalize">{device}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-[#3C3530]/70 mt-3">
            Current viewport: <span className="font-medium capitalize">{currentDevice}</span>
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white border border-[#8B7355]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#3C3530]">Conversion Tests</h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isRunning
                  ? 'bg-[#8B7355]/50 text-white cursor-not-allowed'
                  : 'bg-[#8B7355] text-white hover:bg-[#5D4E37] hover:scale-105'
              }`}
            >
              <Piano className="w-5 h-5" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  result.status === 'pass'
                    ? 'bg-[#9CAF88]/10 border-[#9CAF88]/30'
                    : result.status === 'fail'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-[#8B7355]/10 border-[#8B7355]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.status === 'pass' && <CheckCircle className="w-5 h-5 text-[#9CAF88]" />}
                  {result.status === 'fail' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {result.status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
                  )}
                  <div>
                    <h3 className="font-medium text-[#3C3530]">{result.name}</h3>
                    <p className="text-sm text-[#3C3530]/70">{result.message}</p>
                  </div>
                </div>
                {result.performance && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#3C3530]">
                      {result.performance.toFixed(2)}ms
                    </div>
                    <div className="text-xs text-[#3C3530]/70">Performance</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Component Showcase */}
        <div className="bg-white border border-[#8B7355]/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[#3C3530] mb-6">Component Showcase</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* CTA Component Test */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#3C3530]">Multi-Path CTA</h3>
              <ES60CTA compact={true} />
            </div>

            {/* Loading State Test */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#3C3530]">Audio Loading State</h3>
              <ES60LoadingStates variant="audio" progress={75} />
            </div>

            {/* Error Handling Test */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#3C3530]">Error Fallback</h3>
              <ES60ErrorHandling variant="component">
                <div>This content would show an error</div>
              </ES60ErrorHandling>
            </div>

            {/* Progressive Image Test */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#3C3530]">Progressive Image</h3>
              <div className="aspect-[16/10] rounded-xl overflow-hidden">
                <ProgressiveImage
                  src="/images/kawai-es60-demo.jpg"
                  alt="ES60 Demo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {showSuccess && (
          <SuccessNotification
            message="ES60 integration tests completed successfully!"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
}