/**
 * ES60 Cinematic Asset Management System
 * Handles intelligent preloading, caching, and optimization of media assets
 */

import PerformanceManager, { OptimizationConfig } from './PerformanceManager';

export interface AssetDefinition {
  id: string;
  type: 'image' | 'video' | 'audio' | 'font';
  url: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  scene?: string;
  fallbackUrl?: string;
  variants?: {
    webp?: string;
    avif?: string;
    compressed?: string;
    thumbnail?: string;
  };
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: number;
  };
}

export interface PreloadingStrategy {
  critical: AssetDefinition[];
  progressive: AssetDefinition[];
  onDemand: AssetDefinition[];
}

export interface CacheEntry {
  asset: AssetDefinition;
  blob?: Blob;
  objectUrl?: string;
  loadTime: number;
  lastAccessed: number;
  accessCount: number;
  isPreloaded: boolean;
}

class AssetManager {
  private static instance: AssetManager;
  private cache = new Map<string, CacheEntry>();
  private loadingPromises = new Map<string, Promise<void>>();
  private preloadQueue: AssetDefinition[] = [];
  private isPreloading = false;
  private performanceManager: PerformanceManager;
  private maxCacheSize = 100 * 1024 * 1024; // 100MB
  private currentCacheSize = 0;

  // ES60 Cinematic Assets Definition
  private readonly CINEMATIC_ASSETS: AssetDefinition[] = [
    // Critical assets for immediate loading
    {
      id: 'kawai-logo',
      type: 'image',
      url: '/images/kawai-logo.svg',
      priority: 'critical',
      scene: 'opening'
    },
    {
      id: 'es60-hero',
      type: 'image',
      url: '/images/es60-hero.jpg',
      priority: 'critical',
      variants: {
        webp: '/images/es60-hero.webp',
        avif: '/images/es60-hero.avif',
        compressed: '/images/es60-hero-compressed.jpg'
      },
      metadata: { width: 1920, height: 1080 }
    },
    {
      id: 'ambient-audio',
      type: 'audio',
      url: '/audio/es60-ambient.mp3',
      priority: 'high',
      variants: {
        compressed: '/audio/es60-ambient-compressed.mp3'
      },
      metadata: { duration: 300 }
    },

    // Scene-specific assets
    {
      id: 'concert-hall',
      type: 'image',
      url: '/images/concert-hall-bg.jpg',
      priority: 'high',
      scene: 'heritage',
      variants: {
        webp: '/images/concert-hall-bg.webp',
        compressed: '/images/concert-hall-bg-compressed.jpg'
      }
    },
    {
      id: 'sk-ex-piano',
      type: 'image',
      url: '/images/sk-ex-piano.jpg',
      priority: 'high',
      scene: 'heritage',
      variants: {
        webp: '/images/sk-ex-piano.webp'
      }
    },
    {
      id: 'transformation-particles',
      type: 'video',
      url: '/videos/transformation-particles.mp4',
      priority: 'medium',
      scene: 'transformation',
      variants: {
        compressed: '/videos/transformation-particles-compressed.mp4'
      }
    },
    {
      id: 'es60-product',
      type: 'image',
      url: '/images/es60-product.jpg',
      priority: 'medium',
      scene: 'transformation',
      variants: {
        webp: '/images/es60-product.webp'
      }
    },

    // Audio samples for experience scene
    {
      id: 'piano-sample-classical',
      type: 'audio',
      url: '/audio/samples/classical-excerpt.mp3',
      priority: 'medium',
      scene: 'experience'
    },
    {
      id: 'piano-sample-jazz',
      type: 'audio',
      url: '/audio/samples/jazz-excerpt.mp3',
      priority: 'medium',
      scene: 'experience'
    },

    // Finale assets
    {
      id: 'kawai-heritage',
      type: 'image',
      url: '/images/kawai-heritage.jpg',
      priority: 'low',
      scene: 'finale',
      variants: {
        webp: '/images/kawai-heritage.webp'
      }
    }
  ];

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  constructor() {
    this.performanceManager = PerformanceManager.getInstance();
  }

  async initialize(): Promise<void> {
    await this.performanceManager.initialize();
    this.setupCacheManagement();
    this.startPreloading();
  }

  private setupCacheManagement(): void {
    // Cleanup cache when memory pressure is detected
    setInterval(() => {
      this.cleanupCache();
    }, 30000); // Every 30 seconds

    // Listen for visibility change to pause/resume preloading
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pausePreloading();
      } else {
        this.resumePreloading();
      }
    });
  }

  private getPreloadingStrategy(): PreloadingStrategy {
    const config = this.performanceManager.getConfig();
    const capabilities = this.performanceManager.getCapabilities();
    
    if (!config || !capabilities) {
      return this.getMinimalStrategy();
    }

    switch (config.preloadStrategy) {
      case 'aggressive':
        return this.getAggressiveStrategy();
      case 'progressive':
        return this.getProgressiveStrategy();
      case 'minimal':
      default:
        return this.getMinimalStrategy();
    }
  }

  private getMinimalStrategy(): PreloadingStrategy {
    return {
      critical: this.CINEMATIC_ASSETS.filter(asset => asset.priority === 'critical'),
      progressive: [],
      onDemand: this.CINEMATIC_ASSETS.filter(asset => asset.priority !== 'critical')
    };
  }

  private getProgressiveStrategy(): PreloadingStrategy {
    return {
      critical: this.CINEMATIC_ASSETS.filter(asset => asset.priority === 'critical'),
      progressive: this.CINEMATIC_ASSETS.filter(asset => 
        asset.priority === 'high' || (asset.priority === 'medium' && asset.scene === 'heritage')
      ),
      onDemand: this.CINEMATIC_ASSETS.filter(asset => 
        asset.priority === 'low' || (asset.priority === 'medium' && asset.scene !== 'heritage')
      )
    };
  }

  private getAggressiveStrategy(): PreloadingStrategy {
    return {
      critical: this.CINEMATIC_ASSETS.filter(asset => asset.priority === 'critical'),
      progressive: this.CINEMATIC_ASSETS.filter(asset => 
        asset.priority === 'high' || asset.priority === 'medium'
      ),
      onDemand: this.CINEMATIC_ASSETS.filter(asset => asset.priority === 'low')
    };
  }

  private async startPreloading(): Promise<void> {
    const strategy = this.getPreloadingStrategy();
    
    // Load critical assets immediately
    await this.preloadAssets(strategy.critical);
    
    // Progressive loading based on strategy
    if (strategy.progressive.length > 0) {
      this.scheduleProgressiveLoading(strategy.progressive);
    }
  }

  private async preloadAssets(assets: AssetDefinition[]): Promise<void> {
    const config = this.performanceManager.getConfig();
    const capabilities = this.performanceManager.getCapabilities();
    
    const promises = assets.map(asset => {
      const optimizedAsset = this.optimizeAssetForDevice(asset, config, capabilities);
      return this.preloadAsset(optimizedAsset);
    });

    await Promise.allSettled(promises);
  }

  private optimizeAssetForDevice(
    asset: AssetDefinition, 
    config: OptimizationConfig | null, 
    capabilities: any
  ): AssetDefinition {
    const optimized = { ...asset };

    if (!config || !capabilities) return optimized;

    // Choose optimal format based on browser support
    if (asset.variants) {
      if (capabilities.supportsAVIF && asset.variants.avif) {
        optimized.url = asset.variants.avif;
      } else if (capabilities.supportsWebP && asset.variants.webp) {
        optimized.url = asset.variants.webp;
      } else if (config.imageQuality === 'low' && asset.variants.compressed) {
        optimized.url = asset.variants.compressed;
      }
    }

    // Audio quality optimization
    if (asset.type === 'audio' && config.audioQuality === 'compressed' && asset.variants?.compressed) {
      optimized.url = asset.variants.compressed;
    }

    return optimized;
  }

  private async preloadAsset(asset: AssetDefinition): Promise<void> {
    if (this.cache.has(asset.id)) {
      return; // Already cached
    }

    if (this.loadingPromises.has(asset.id)) {
      return this.loadingPromises.get(asset.id);
    }

    const loadPromise = this.loadAsset(asset);
    this.loadingPromises.set(asset.id, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(asset.id);
    }
  }

  private async loadAsset(asset: AssetDefinition): Promise<void> {
    const startTime = performance.now();

    try {
      const response = await fetch(asset.url, {
        mode: 'cors',
        cache: 'default'
      });

      if (!response.ok) {
        throw new Error(`Failed to load asset: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      // Pre-decode images for better performance
      if (asset.type === 'image') {
        await this.preDecodeImage(objectUrl);
      }

      const cacheEntry: CacheEntry = {
        asset,
        blob,
        objectUrl,
        loadTime: performance.now() - startTime,
        lastAccessed: Date.now(),
        accessCount: 0,
        isPreloaded: true
      };

      this.cache.set(asset.id, cacheEntry);
      this.currentCacheSize += blob.size;

      console.log(`Asset loaded: ${asset.id} (${Math.round(cacheEntry.loadTime)}ms)`);
      
    } catch (error) {
      console.warn(`Failed to preload asset ${asset.id}:`, error);
      
      // Try fallback if available
      if (asset.fallbackUrl) {
        try {
          const fallbackAsset = { ...asset, url: asset.fallbackUrl };
          await this.loadAsset(fallbackAsset);
        } catch (fallbackError) {
          console.error(`Fallback also failed for ${asset.id}:`, fallbackError);
        }
      }
    }
  }

  private async preDecodeImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to force decode
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  private scheduleProgressiveLoading(assets: AssetDefinition[]): void {
    // Use requestIdleCallback for progressive loading
    const loadNextBatch = (remainingAssets: AssetDefinition[]) => {
      if (remainingAssets.length === 0) return;

      const batchSize = this.getBatchSize();
      const currentBatch = remainingAssets.slice(0, batchSize);
      const nextBatch = remainingAssets.slice(batchSize);

      // Load current batch
      this.preloadAssets(currentBatch).then(() => {
        // Schedule next batch
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => loadNextBatch(nextBatch), { timeout: 5000 });
        } else {
          setTimeout(() => loadNextBatch(nextBatch), 1000);
        }
      });
    };

    loadNextBatch(assets);
  }

  private getBatchSize(): number {
    const capabilities = this.performanceManager.getCapabilities();
    const config = this.performanceManager.getConfig();
    
    if (!capabilities || !config) return 1;
    
    if (capabilities.connectionSpeed === 'fast' && !capabilities.isLowEndDevice) {
      return 3;
    } else if (capabilities.connectionSpeed === 'medium') {
      return 2;
    }
    
    return 1;
  }

  async getAsset(assetId: string): Promise<string | null> {
    const cacheEntry = this.cache.get(assetId);
    
    if (cacheEntry) {
      cacheEntry.lastAccessed = Date.now();
      cacheEntry.accessCount++;
      return cacheEntry.objectUrl || cacheEntry.asset.url;
    }

    // Try to load on demand
    const asset = this.CINEMATIC_ASSETS.find(a => a.id === assetId);
    if (asset) {
      await this.preloadAsset(asset);
      const updatedEntry = this.cache.get(assetId);
      return updatedEntry?.objectUrl || asset.url;
    }

    return null;
  }

  async preloadSceneAssets(sceneId: string): Promise<void> {
    const sceneAssets = this.CINEMATIC_ASSETS.filter(asset => asset.scene === sceneId);
    await this.preloadAssets(sceneAssets);
  }

  private cleanupCache(): void {
    if (this.currentCacheSize <= this.maxCacheSize) return;

    // Sort by access patterns (LRU + frequency)
    const entries = Array.from(this.cache.entries()).sort(([, a], [, b]) => {
      const aScore = a.accessCount * (1 / (Date.now() - a.lastAccessed));
      const bScore = b.accessCount * (1 / (Date.now() - b.lastAccessed));
      return aScore - bScore; // Ascending order (least valuable first)
    });

    // Remove least valuable entries
    const targetSize = this.maxCacheSize * 0.8; // Target 80% of max size
    
    for (const [id, entry] of entries) {
      if (this.currentCacheSize <= targetSize) break;
      
      // Don't remove critical assets
      if (entry.asset.priority === 'critical') continue;
      
      if (entry.objectUrl) {
        URL.revokeObjectURL(entry.objectUrl);
      }
      
      this.cache.delete(id);
      this.currentCacheSize -= entry.blob?.size || 0;
      
      console.log(`Evicted asset from cache: ${id}`);
    }
  }

  pausePreloading(): void {
    this.isPreloading = false;
  }

  resumePreloading(): void {
    this.isPreloading = true;
  }

  getCacheStatus() {
    return {
      size: this.currentCacheSize,
      maxSize: this.maxCacheSize,
      utilization: (this.currentCacheSize / this.maxCacheSize) * 100,
      entryCount: this.cache.size,
      assets: Array.from(this.cache.values()).map(entry => ({
        id: entry.asset.id,
        loadTime: entry.loadTime,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        size: entry.blob?.size || 0
      }))
    };
  }

  cleanup(): void {
    // Revoke all object URLs
    for (const entry of this.cache.values()) {
      if (entry.objectUrl) {
        URL.revokeObjectURL(entry.objectUrl);
      }
    }
    
    this.cache.clear();
    this.loadingPromises.clear();
    this.currentCacheSize = 0;
  }
}

export default AssetManager;