/**
 * ES60 Cinematic Performance Management System
 * Handles device detection, asset optimization, and performance monitoring
 */

export interface DeviceCapabilities {
  canHandleHeavyAnimations: boolean;
  preferReducedMotion: boolean;
  supportsCSSGrid: boolean;
  supportsWebP: boolean;
  supportsAVIF: boolean;
  connectionSpeed: 'slow' | 'medium' | 'fast';
  deviceMemory: number;
  hardwareConcurrency: number;
  isLowEndDevice: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
}

export interface PerformanceMetrics {
  frameRate: number;
  averageFrameTime: number;
  memoryUsage: number;
  loadTime: number;
  interactionToNextPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export interface OptimizationConfig {
  enableAnimations: boolean;
  animationComplexity: 'minimal' | 'reduced' | 'full';
  imageQuality: 'low' | 'medium' | 'high';
  audioQuality: 'compressed' | 'standard' | 'high';
  particleCount: number;
  enableParallax: boolean;
  enableBlur: boolean;
  maxConcurrentAnimations: number;
  preloadStrategy: 'minimal' | 'progressive' | 'aggressive';
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private capabilities: DeviceCapabilities | null = null;
  private metrics: Partial<PerformanceMetrics> = {};
  private config: OptimizationConfig | null = null;
  private frameRateMonitor: FrameRateMonitor | null = null;
  private memoryMonitor: MemoryMonitor | null = null;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  async initialize(): Promise<void> {
    this.capabilities = await this.detectDeviceCapabilities();
    this.config = this.generateOptimizationConfig(this.capabilities);
    this.setupPerformanceMonitoring();
    this.startFrameRateMonitoring();
    this.startMemoryMonitoring();
  }

  private async detectDeviceCapabilities(): Promise<DeviceCapabilities> {
    const capabilities: DeviceCapabilities = {
      canHandleHeavyAnimations: true,
      preferReducedMotion: false,
      supportsCSSGrid: false,
      supportsWebP: false,
      supportsAVIF: false,
      connectionSpeed: 'medium',
      deviceMemory: 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      isLowEndDevice: false
    };

    // Check for reduced motion preference
    capabilities.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check CSS Grid support
    capabilities.supportsCSSGrid = CSS.supports('display', 'grid');

    // Check image format support
    capabilities.supportsWebP = await this.checkImageFormatSupport('webp');
    capabilities.supportsAVIF = await this.checkImageFormatSupport('avif');

    // Detect connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        capabilities.connectionSpeed = 'slow';
      } else if (effectiveType === '3g') {
        capabilities.connectionSpeed = 'medium';
      } else {
        capabilities.connectionSpeed = 'fast';
      }
    }

    // Get device memory (Chrome only)
    capabilities.deviceMemory = (navigator as any).deviceMemory || 4;

    // Determine if this is a low-end device
    capabilities.isLowEndDevice = (
      capabilities.deviceMemory < 4 ||
      capabilities.hardwareConcurrency < 4 ||
      capabilities.connectionSpeed === 'slow' ||
      capabilities.preferReducedMotion
    );

    // Heavy animation capability
    capabilities.canHandleHeavyAnimations = !capabilities.isLowEndDevice && 
      capabilities.deviceMemory >= 4 && 
      capabilities.hardwareConcurrency >= 4;

    // Battery API (experimental)
    try {
      const battery = await (navigator as any).getBattery?.();
      if (battery) {
        capabilities.batteryLevel = battery.level;
        capabilities.isCharging = battery.charging;
      }
    } catch (e) {
      // Battery API not supported or blocked
    }

    return capabilities;
  }

  private async checkImageFormatSupport(format: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      const testImages = {
        webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
      };
      
      img.src = testImages[format as keyof typeof testImages];
    });
  }

  private generateOptimizationConfig(capabilities: DeviceCapabilities): OptimizationConfig {
    if (capabilities.isLowEndDevice) {
      return {
        enableAnimations: !capabilities.preferReducedMotion,
        animationComplexity: 'minimal',
        imageQuality: 'low',
        audioQuality: 'compressed',
        particleCount: 10,
        enableParallax: false,
        enableBlur: false,
        maxConcurrentAnimations: 1,
        preloadStrategy: 'minimal'
      };
    }

    if (capabilities.deviceMemory < 8 || capabilities.connectionSpeed === 'medium') {
      return {
        enableAnimations: true,
        animationComplexity: 'reduced',
        imageQuality: 'medium',
        audioQuality: 'standard',
        particleCount: 30,
        enableParallax: true,
        enableBlur: true,
        maxConcurrentAnimations: 3,
        preloadStrategy: 'progressive'
      };
    }

    return {
      enableAnimations: true,
      animationComplexity: 'full',
      imageQuality: 'high',
      audioQuality: 'high',
      particleCount: 100,
      enableParallax: true,
      enableBlur: true,
      maxConcurrentAnimations: 5,
      preloadStrategy: 'aggressive'
    };
  }

  private setupPerformanceMonitoring(): void {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.metrics.interactionToNextPaint = entry.processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  private startFrameRateMonitoring(): void {
    this.frameRateMonitor = new FrameRateMonitor((frameRate, averageFrameTime) => {
      this.metrics.frameRate = frameRate;
      this.metrics.averageFrameTime = averageFrameTime;
      
      // Auto-adjust quality based on frame rate
      if (frameRate < 30 && this.config) {
        this.degradePerformance();
      } else if (frameRate > 55 && this.config) {
        this.enhancePerformance();
      }
    });
    this.frameRateMonitor.start();
  }

  private startMemoryMonitoring(): void {
    this.memoryMonitor = new MemoryMonitor((usage) => {
      this.metrics.memoryUsage = usage;
      
      // Auto-adjust based on memory pressure
      if (usage > 100 * 1024 * 1024 && this.config) { // 100MB threshold
        this.degradePerformance();
      }
    });
    this.memoryMonitor.start();
  }

  private degradePerformance(): void {
    if (!this.config) return;

    // Reduce animation complexity
    if (this.config.animationComplexity === 'full') {
      this.config.animationComplexity = 'reduced';
    } else if (this.config.animationComplexity === 'reduced') {
      this.config.animationComplexity = 'minimal';
    }

    // Reduce particle count
    this.config.particleCount = Math.max(10, Math.floor(this.config.particleCount * 0.7));

    // Disable expensive effects
    if (this.config.particleCount < 20) {
      this.config.enableBlur = false;
      this.config.enableParallax = false;
    }

    console.log('Performance degraded:', this.config);
  }

  private enhancePerformance(): void {
    if (!this.config || !this.capabilities?.canHandleHeavyAnimations) return;

    // Only enhance if we're not already at max and device can handle it
    if (this.config.animationComplexity === 'minimal') {
      this.config.animationComplexity = 'reduced';
    } else if (this.config.animationComplexity === 'reduced' && this.capabilities.deviceMemory >= 8) {
      this.config.animationComplexity = 'full';
    }

    // Gradually increase particle count
    if (this.config.particleCount < 50) {
      this.config.particleCount = Math.min(100, Math.floor(this.config.particleCount * 1.2));
    }
  }

  getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  getConfig(): OptimizationConfig | null {
    return this.config;
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  updateConfig(updates: Partial<OptimizationConfig>): void {
    if (this.config) {
      this.config = { ...this.config, ...updates };
    }
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.frameRateMonitor?.stop();
    this.memoryMonitor?.stop();
  }
}

class FrameRateMonitor {
  private callback: (frameRate: number, averageFrameTime: number) => void;
  private isRunning = false;
  private frameCount = 0;
  private lastTime = performance.now();
  private frameTimes: number[] = [];
  private animationFrameId: number | null = null;

  constructor(callback: (frameRate: number, averageFrameTime: number) => void) {
    this.callback = callback;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frameTimes = [];
    this.measure();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private measure = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameTimes.push(deltaTime);
    this.frameCount++;

    // Calculate FPS every second
    if (this.frameCount >= 60) {
      const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const frameRate = 1000 / averageFrameTime;
      
      this.callback(frameRate, averageFrameTime);
      
      this.frameCount = 0;
      this.frameTimes = [];
    }

    this.lastTime = currentTime;
    this.animationFrameId = requestAnimationFrame(this.measure);
  };
}

class MemoryMonitor {
  private callback: (usage: number) => void;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(callback: (usage: number) => void) {
    this.callback = callback;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.intervalId = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.callback(memory.usedJSHeapSize);
      }
    }, 5000); // Check every 5 seconds
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default PerformanceManager;