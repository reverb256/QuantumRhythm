/**
 * DDR2-Era Compatibility Layer
 * Ensures graceful degradation for systems with 4-8GB RAM and older browsers
 */

interface SystemCapabilities {
  memoryGB: number;
  webWorkerSupport: boolean;
  indexedDBSupport: boolean;
  webAssemblySupport: boolean;
  serviceWorkerSupport: boolean;
  webRTCSupport: boolean;
  isLowEnd: boolean;
}

interface CompatibilitySettings {
  enableWebWorkers: boolean;
  enableAdvancedFeatures: boolean;
  maxConcurrentOperations: number;
  cacheStrategy: 'aggressive' | 'conservative' | 'minimal';
  animationLevel: 'full' | 'reduced' | 'minimal';
  dataProcessingMode: 'full' | 'lite' | 'basic';
}

export class CompatibilityLayer {
  private capabilities: SystemCapabilities;
  private settings: CompatibilitySettings;
  private isInitialized = false;

  constructor() {
    this.capabilities = this.detectSystemCapabilities();
    this.settings = this.determineOptimalSettings();
    this.applyCompatibilityMeasures();
  }

  private detectSystemCapabilities(): SystemCapabilities {
    const capabilities: SystemCapabilities = {
      memoryGB: this.estimateAvailableMemory(),
      webWorkerSupport: typeof Worker !== 'undefined',
      indexedDBSupport: 'indexedDB' in window,
      webAssemblySupport: typeof WebAssembly !== 'undefined',
      serviceWorkerSupport: 'serviceWorker' in navigator,
      webRTCSupport: 'RTCPeerConnection' in window,
      isLowEnd: false
    };

    // Determine if this is a low-end system
    capabilities.isLowEnd = capabilities.memoryGB <= 8 || 
                           !capabilities.webWorkerSupport ||
                           this.isSlowDevice();

    return capabilities;
  }

  private estimateAvailableMemory(): number {
    // Try to get actual memory info if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory && memory.jsHeapSizeLimit) {
        // Convert bytes to GB, estimate total system memory
        const heapLimitGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
        return Math.max(4, heapLimitGB * 4); // Rough estimation
      }
    }

    // Fallback: Use feature detection to estimate
    const hasAdvancedFeatures = 
      typeof WebAssembly !== 'undefined' &&
      'serviceWorker' in navigator &&
      typeof Worker !== 'undefined';

    if (hasAdvancedFeatures) {
      return this.isSlowDevice() ? 8 : 16; // Assume 8GB+ for modern browsers
    }

    return 4; // Conservative estimate for older systems
  }

  private isSlowDevice(): boolean {
    // Performance-based detection
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    const duration = performance.now() - start;

    // If basic operations take too long, assume slow device
    return duration > 10;
  }

  private determineOptimalSettings(): CompatibilitySettings {
    const settings: CompatibilitySettings = {
      enableWebWorkers: this.capabilities.webWorkerSupport && this.capabilities.memoryGB >= 6,
      enableAdvancedFeatures: this.capabilities.memoryGB >= 8 && !this.capabilities.isLowEnd,
      maxConcurrentOperations: this.capabilities.memoryGB >= 8 ? 4 : this.capabilities.memoryGB >= 6 ? 2 : 1,
      cacheStrategy: this.capabilities.memoryGB >= 8 ? 'aggressive' : 
                     this.capabilities.memoryGB >= 6 ? 'conservative' : 'minimal',
      animationLevel: this.capabilities.memoryGB >= 8 ? 'full' : 
                      this.capabilities.memoryGB >= 6 ? 'reduced' : 'minimal',
      dataProcessingMode: this.capabilities.memoryGB >= 8 ? 'full' : 
                          this.capabilities.memoryGB >= 6 ? 'lite' : 'basic'
    };

    return settings;
  }

  private applyCompatibilityMeasures(): void {
    // Apply CSS classes for capability-based styling
    const htmlElement = document.documentElement;
    
    if (this.capabilities.isLowEnd) {
      htmlElement.classList.add('low-end-device');
    }
    
    if (this.capabilities.memoryGB <= 8) {
      htmlElement.classList.add('limited-memory');
    }
    
    if (!this.capabilities.webWorkerSupport) {
      htmlElement.classList.add('no-web-workers');
    }

    // Apply animation preferences
    if (this.settings.animationLevel !== 'full') {
      htmlElement.classList.add('reduced-animations');
    }

    // Set up CSS custom properties for dynamic scaling
    document.documentElement.style.setProperty('--max-concurrent-ops', this.settings.maxConcurrentOperations.toString());
    document.documentElement.style.setProperty('--memory-gb', this.capabilities.memoryGB.toString());

    this.isInitialized = true;
  }

  // Public API methods
  public getCapabilities(): SystemCapabilities {
    return { ...this.capabilities };
  }

  public getSettings(): CompatibilitySettings {
    return { ...this.settings };
  }

  public shouldUseWebWorker(): boolean {
    return this.settings.enableWebWorkers;
  }

  public shouldEnableAdvancedFeatures(): boolean {
    return this.settings.enableAdvancedFeatures;
  }

  public getMaxConcurrentOperations(): number {
    return this.settings.maxConcurrentOperations;
  }

  public getCacheStrategy(): 'aggressive' | 'conservative' | 'minimal' {
    return this.settings.cacheStrategy;
  }

  public getAnimationLevel(): 'full' | 'reduced' | 'minimal' {
    return this.settings.animationLevel;
  }

  public getDataProcessingMode(): 'full' | 'lite' | 'basic' {
    return this.settings.dataProcessingMode;
  }

  public isLowEndDevice(): boolean {
    return this.capabilities.isLowEnd;
  }

  // Memory management utilities
  public async withMemoryManagement<T>(operation: () => Promise<T>): Promise<T> {
    if (this.capabilities.memoryGB <= 6) {
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
      
      // Small delay to allow cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      return await operation();
    } finally {
      if (this.capabilities.memoryGB <= 6) {
        // Cleanup after operation
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }

  // Adaptive processing based on system capabilities
  public async processDataAdaptively<T>(
    data: T[], 
    processor: (item: T) => Promise<any>,
    options: { batchSize?: number; delay?: number } = {}
  ): Promise<any[]> {
    const batchSize = options.batchSize || this.getOptimalBatchSize();
    const delay = options.delay || this.getOptimalDelay();
    const results: any[] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);

      // Yield control to prevent blocking
      if (i + batchSize < data.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  private getOptimalBatchSize(): number {
    if (this.capabilities.memoryGB >= 8) return 50;
    if (this.capabilities.memoryGB >= 6) return 25;
    return 10;
  }

  private getOptimalDelay(): number {
    if (this.capabilities.memoryGB >= 8) return 10;
    if (this.capabilities.memoryGB >= 6) return 25;
    return 50;
  }

  // Feature detection utilities
  public supportsFeature(feature: keyof SystemCapabilities): boolean {
    return this.capabilities[feature] as boolean;
  }

  // Progressive enhancement utilities
  public async loadFeatureConditionally(
    featureName: string,
    loader: () => Promise<any>,
    fallback?: () => any
  ): Promise<any> {
    if (!this.settings.enableAdvancedFeatures) {
      console.log(`Skipping advanced feature ${featureName} due to system limitations`);
      return fallback ? fallback() : null;
    }

    try {
      return await this.withMemoryManagement(loader);
    } catch (error) {
      console.warn(`Failed to load feature ${featureName}, using fallback:`, error);
      return fallback ? fallback() : null;
    }
  }

  // Dynamic resource allocation
  public getAllocatedResources(): {
    maxWorkers: number;
    maxCacheSize: number;
    maxConcurrentRequests: number;
  } {
    const baseMultiplier = Math.max(1, this.capabilities.memoryGB / 8);
    
    return {
      maxWorkers: Math.min(4, Math.floor(baseMultiplier * 2)),
      maxCacheSize: Math.floor(this.capabilities.memoryGB * 0.1 * 1024 * 1024), // 10% of estimated memory in bytes
      maxConcurrentRequests: this.settings.maxConcurrentOperations
    };
  }

  // Monitoring and diagnostics
  public getPerformanceReport(): {
    capabilities: SystemCapabilities;
    settings: CompatibilitySettings;
    allocatedResources: ReturnType<typeof this.getAllocatedResources>;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    if (this.capabilities.memoryGB <= 4) {
      recommendations.push('Consider closing other applications to free up memory');
    }

    if (!this.capabilities.webWorkerSupport) {
      recommendations.push('Browser does not support Web Workers - using main thread processing');
    }

    if (this.capabilities.isLowEnd) {
      recommendations.push('System detected as low-end - reduced features enabled for optimal performance');
    }

    return {
      capabilities: this.capabilities,
      settings: this.settings,
      allocatedResources: this.getAllocatedResources(),
      recommendations
    };
  }
}

// Global instance
export const compatibilityLayer = new CompatibilityLayer();