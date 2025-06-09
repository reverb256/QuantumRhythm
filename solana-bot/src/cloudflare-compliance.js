import { logger } from './logger.js';

export class CloudflareComplianceManager {
  constructor() {
    this.requestQueue = [];
    this.rateLimits = {
      maxRequestsPerMinute: 50,
      maxConcurrentConnections: 10,
      maxPayloadSize: 100 * 1024, // 100KB
      timeoutMs: 30000 // 30 seconds
    };
    this.activeConnections = 0;
    this.requestHistory = [];
  }

  // Cloudflare Workers limits compliance
  validateWorkerLimits(operation) {
    const limits = {
      // CPU time limit (10ms for free tier)
      maxCpuTime: 10,
      // Memory limit (128MB)
      maxMemory: 128 * 1024 * 1024,
      // Request size limit (100MB)
      maxRequestSize: 100 * 1024 * 1024,
      // Response size limit (100MB) 
      maxResponseSize: 100 * 1024 * 1024
    };

    if (operation.estimatedCpuTime > limits.maxCpuTime) {
      logger.warn('Operation may exceed Cloudflare CPU limits', {
        estimated: operation.estimatedCpuTime,
        limit: limits.maxCpuTime
      });
      return false;
    }

    return true;
  }

  // GitHub Pages static hosting compliance
  ensureStaticHostingCompliance() {
    const compliance = {
      // GitHub Pages limits
      maxSiteSize: 1024 * 1024 * 1024, // 1GB
      maxFileSize: 100 * 1024 * 1024,  // 100MB
      maxBandwidth: 100 * 1024 * 1024 * 1024, // 100GB/month
      
      // Supported file types for GitHub Pages
      allowedExtensions: ['.html', '.css', '.js', '.json', '.md', '.txt', '.xml'],
      
      // Security requirements
      httpsOnly: true,
      noDynamicServer: true
    };

    logger.info('Ensuring GitHub Pages compliance', {
      httpsRequired: compliance.httpsOnly,
      staticOnly: compliance.noDynamicServer
    });

    return compliance;
  }

  // Request batching for rate limit compliance
  async batchRequests(requests, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      // Check rate limits before processing batch
      if (!this.checkRateLimit()) {
        await this.waitForRateLimit();
      }

      try {
        const batchPromises = batch.map(request => this.executeRequest(request));
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < requests.length) {
          await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 second delay
        }
      } catch (error) {
        logger.error('Batch request failed', error);
        // Continue with next batch instead of failing entirely
      }
    }

    return results;
  }

  checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean old requests
    this.requestHistory = this.requestHistory.filter(time => time > oneMinuteAgo);
    
    return this.requestHistory.length < this.rateLimits.maxRequestsPerMinute;
  }

  async waitForRateLimit() {
    const oldestRequest = Math.min(...this.requestHistory);
    const waitTime = 60000 - (Date.now() - oldestRequest);
    
    if (waitTime > 0) {
      logger.info(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  async executeRequest(request) {
    // Increment active connections
    this.activeConnections++;
    this.requestHistory.push(Date.now());

    try {
      // Check connection limits
      if (this.activeConnections > this.rateLimits.maxConcurrentConnections) {
        throw new Error('Too many concurrent connections');
      }

      // Validate payload size
      if (request.payload && JSON.stringify(request.payload).length > this.rateLimits.maxPayloadSize) {
        throw new Error('Payload too large for Cloudflare limits');
      }

      // Execute with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), this.rateLimits.timeoutMs)
      );

      const result = await Promise.race([
        request.execute(),
        timeoutPromise
      ]);

      return result;
    } finally {
      this.activeConnections--;
    }
  }

  // Edge function deployment compliance
  generateEdgeFunction(functionCode) {
    // Ensure function is compatible with Cloudflare Workers
    const edgeFunction = `
// Cloudflare Workers compatible function
export default {
  async fetch(request, env, ctx) {
    try {
      // Rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (!await this.checkRateLimit(clientIP)) {
        return new Response('Rate limit exceeded', { status: 429 });
      }

      // CORS headers for GitHub Pages compatibility
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      };

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // Execute main function
      ${functionCode}

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async checkRateLimit(clientIP) {
    // Implement simple rate limiting using Cloudflare KV
    // This would be expanded with actual KV storage
    return true;
  }
}`;

    return edgeFunction;
  }

  // Static asset optimization for GitHub Pages
  optimizeForStaticHosting(assets) {
    const optimized = {
      html: [],
      css: [],
      js: [],
      other: []
    };

    assets.forEach(asset => {
      // Minify and compress assets
      if (asset.type === 'html') {
        optimized.html.push(this.minifyHtml(asset.content));
      } else if (asset.type === 'css') {
        optimized.css.push(this.minifyCss(asset.content));
      } else if (asset.type === 'js') {
        optimized.js.push(this.minifyJs(asset.content));
      } else {
        optimized.other.push(asset);
      }
    });

    return optimized;
  }

  minifyHtml(html) {
    // Basic HTML minification
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  minifyCss(css) {
    // Basic CSS minification
    return css
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/:\s+/g, ':')
      .trim();
  }

  minifyJs(js) {
    // Basic JS minification (in production, use proper minifier)
    return js
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/{\s+/g, '{')
      .trim();
  }

  // Generate deployment manifest for GitHub Actions
  generateDeploymentManifest() {
    return {
      name: 'Solana Bot - VibeCoding',
      version: '1.0.0',
      deployment: {
        platform: 'github-pages',
        cdn: 'cloudflare',
        compliance: {
          staticOnly: true,
          httpsRequired: true,
          maxFileSize: '100MB',
          rateLimited: true
        }
      },
      build: {
        outputDir: 'dist',
        assetsDir: 'assets',
        optimizations: {
          minify: true,
          compress: true,
          treeshake: true
        }
      },
      security: {
        csp: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    };
  }

  // Validate deployment readiness
  validateDeploymentReadiness(buildOutput) {
    const validation = {
      passed: true,
      issues: [],
      recommendations: []
    };

    // Check file sizes
    buildOutput.files.forEach(file => {
      if (file.size > 100 * 1024 * 1024) { // 100MB
        validation.passed = false;
        validation.issues.push(`File ${file.name} exceeds GitHub Pages size limit`);
      }
    });

    // Check for dynamic server requirements
    const dynamicPatterns = [
      /require\(['"]express['"]\)/,
      /\.listen\(\d+\)/,
      /process\.env\.PORT/
    ];

    buildOutput.files.forEach(file => {
      if (file.type === 'js') {
        dynamicPatterns.forEach(pattern => {
          if (pattern.test(file.content)) {
            validation.issues.push(`Dynamic server code detected in ${file.name}`);
            validation.recommendations.push('Convert to static generation or edge functions');
          }
        });
      }
    });

    // Check HTTPS compliance
    if (!buildOutput.httpsOnly) {
      validation.issues.push('HTTPS not enforced - required for GitHub Pages');
    }

    logger.info('Deployment validation completed', {
      passed: validation.passed,
      issueCount: validation.issues.length
    });

    return validation;
  }
}

export default CloudflareComplianceManager;