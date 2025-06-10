/**
 * Autonomous Endpoint Discovery Agent with Headless Browser
 * Continuously discovers and validates new Solana RPC endpoints
 */

import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface DiscoveredEndpoint {
  url: string;
  provider: string;
  responseTime: number;
  reliability: number;
  rateLimit: number;
  features: string[];
  discovered: Date;
  validated: boolean;
}

export class AutonomousEndpointDiscoverer {
  private browser: any = null;
  private discoveredEndpoints: Map<string, DiscoveredEndpoint> = new Map();
  private validationWallet: string;
  private isRunning = false;
  private discoveryInterval: NodeJS.Timeout | null = null;

  constructor(validationWallet: string) {
    this.validationWallet = validationWallet;
  }

  async initialize() {
    console.log('🕷️ Initializing autonomous endpoint discovery with headless browser...');
    
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Headless browser initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      return false;
    }
  }

  async startAutonomousDiscovery() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 Starting autonomous endpoint discovery...');
    
    // Initial discovery burst
    await this.performDiscoveryRound();
    
    // Schedule continuous discovery every 30 minutes
    this.discoveryInterval = setInterval(async () => {
      await this.performDiscoveryRound();
    }, 30 * 60 * 1000);
  }

  async performDiscoveryRound() {
    console.log('🌐 Performing endpoint discovery round...');
    
    const discoveryTasks = [
      this.scrapeChainListEndpoints(),
      this.scrapeDocumentationSites(),
      this.scrapeDeveloperResources(),
      this.scanGitHubRepositories(),
      this.analyzeNetworkTraffic()
    ];

    const results = await Promise.allSettled(discoveryTasks);
    
    let totalDiscovered = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        totalDiscovered += result.value;
      } else {
        console.log(`⚠️ Discovery task ${index} failed:`, result.reason);
      }
    });

    console.log(`📡 Discovery round complete: ${totalDiscovered} new endpoints found`);
    
    // Validate newly discovered endpoints
    await this.validateAllEndpoints();
  }

  async scrapeChainListEndpoints(): Promise<number> {
    if (!this.browser) return 0;
    
    const page = await this.browser.newPage();
    let discovered = 0;
    
    try {
      // Scrape chainlist.org for Solana endpoints
      await page.goto('https://chainlist.org/?search=solana', { waitUntil: 'networkidle2' });
      
      const endpoints = await page.evaluate(() => {
        const rpcElements = document.querySelectorAll('[data-testid*="rpc"], .rpc-url, [href*="rpc"]');
        const urls: string[] = [];
        
        rpcElements.forEach(el => {
          const text = el.textContent || el.getAttribute('href') || '';
          const rpcMatch = text.match(/https?:\/\/[^\s]+/g);
          if (rpcMatch) {
            urls.push(...rpcMatch);
          }
        });
        
        return urls;
      });
      
      for (const url of endpoints) {
        if (this.isValidSolanaRPC(url)) {
          await this.addDiscoveredEndpoint(url, 'ChainList');
          discovered++;
        }
      }
      
    } catch (error) {
      console.log('⚠️ ChainList scraping failed:', error);
    } finally {
      await page.close();
    }
    
    return discovered;
  }

  async scrapeDocumentationSites(): Promise<number> {
    if (!this.browser) return 0;
    
    const page = await this.browser.newPage();
    let discovered = 0;
    
    const docSites = [
      'https://docs.solana.com',
      'https://solana.com/developers',
      'https://docs.alchemy.com/reference/solana-api-quickstart',
      'https://docs.quicknode.com/guides/solana-development'
    ];
    
    for (const site of docSites) {
      try {
        await page.goto(site, { waitUntil: 'networkidle2' });
        
        const endpoints = await page.evaluate(() => {
          const text = document.body.textContent || '';
          const rpcMatches = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.(?:solana|rpc|api)[a-zA-Z0-9.-]*\/[^\s]*/g) || [];
          return rpcMatches;
        });
        
        for (const url of endpoints) {
          if (this.isValidSolanaRPC(url)) {
            await this.addDiscoveredEndpoint(url, 'Documentation');
            discovered++;
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Failed to scrape ${site}:`, error);
      }
    }
    
    await page.close();
    return discovered;
  }

  async scrapeDeveloperResources(): Promise<number> {
    let discovered = 0;
    
    try {
      // Use JSDOM for simple HTML parsing
      const response = await fetch('https://api.github.com/search/repositories?q=solana+rpc+endpoints');
      const data = await response.json();
      
      for (const repo of data.items?.slice(0, 10) || []) {
        try {
          const readmeResponse = await fetch(`https://raw.githubusercontent.com/${repo.full_name}/main/README.md`);
          const readme = await readmeResponse.text();
          
          const rpcMatches = readme.match(/https?:\/\/[a-zA-Z0-9.-]+[^)\s]*/g) || [];
          
          for (const url of rpcMatches) {
            if (this.isValidSolanaRPC(url)) {
              await this.addDiscoveredEndpoint(url, 'GitHub');
              discovered++;
            }
          }
          
        } catch (error) {
          // Silent fail for individual repos
        }
      }
      
    } catch (error) {
      console.log('⚠️ GitHub scraping failed:', error);
    }
    
    return discovered;
  }

  async scanGitHubRepositories(): Promise<number> {
    let discovered = 0;
    
    const searchQueries = [
      'solana rpc endpoint',
      'solana mainnet rpc',
      'solana api endpoint',
      'solana node url'
    ];
    
    for (const query of searchQueries) {
      try {
        const response = await fetch(`https://api.github.com/search/code?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        for (const item of data.items?.slice(0, 5) || []) {
          try {
            const fileResponse = await fetch(item.git_url);
            const fileData = await fileResponse.json();
            const content = Buffer.from(fileData.content, 'base64').toString();
            
            const rpcMatches = content.match(/https?:\/\/[a-zA-Z0-9.-]+[^"'\s]*/g) || [];
            
            for (const url of rpcMatches) {
              if (this.isValidSolanaRPC(url)) {
                await this.addDiscoveredEndpoint(url, 'GitHub Code');
                discovered++;
              }
            }
            
          } catch (error) {
            // Silent fail for individual files
          }
        }
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`⚠️ GitHub code search failed for "${query}":`, error);
      }
    }
    
    return discovered;
  }

  async analyzeNetworkTraffic(): Promise<number> {
    // Analyze common RPC provider patterns and generate potential endpoints
    const providers = [
      'alchemy', 'quicknode', 'ankr', 'getblock', 'chainstack',
      'nodereal', 'tatum', 'blockpi', 'ironforge', 'syndica'
    ];
    
    const subdomains = ['solana', 'sol', 'mainnet', 'api', 'rpc'];
    const domains = ['.com', '.io', '.xyz', '.net'];
    
    let discovered = 0;
    
    for (const provider of providers) {
      for (const subdomain of subdomains) {
        for (const domain of domains) {
          const url = `https://${subdomain}.${provider}${domain}`;
          if (!this.discoveredEndpoints.has(url)) {
            await this.addDiscoveredEndpoint(url, 'Pattern Analysis');
            discovered++;
          }
        }
      }
    }
    
    return discovered;
  }

  private isValidSolanaRPC(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    // Must be HTTPS
    if (!url.startsWith('https://')) return false;
    
    // Must not be localhost or private IPs
    if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.')) return false;
    
    // Must have valid domain structure
    const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(url)) return false;
    
    // Skip common non-RPC patterns
    const skipPatterns = [
      'github.com', 'docs.', 'www.', 'blog.', 'medium.com',
      'twitter.com', 'discord.', 'telegram.', '.pdf', '.jpg', '.png'
    ];
    
    return !skipPatterns.some(pattern => url.includes(pattern));
  }

  private async addDiscoveredEndpoint(url: string, provider: string) {
    if (this.discoveredEndpoints.has(url)) return;
    
    const endpoint: DiscoveredEndpoint = {
      url: url.replace(/\/$/, ''), // Remove trailing slash
      provider,
      responseTime: 0,
      reliability: 0,
      rateLimit: 60, // Default assumption
      features: [],
      discovered: new Date(),
      validated: false
    };
    
    this.discoveredEndpoints.set(url, endpoint);
    console.log(`📡 Discovered endpoint: ${url} (${provider})`);
  }

  async validateAllEndpoints(): Promise<void> {
    console.log(`🔍 Validating ${this.discoveredEndpoints.size} discovered endpoints...`);
    
    const validationPromises = Array.from(this.discoveredEndpoints.values())
      .filter(endpoint => !endpoint.validated)
      .map(endpoint => this.validateEndpoint(endpoint));
    
    await Promise.allSettled(validationPromises);
    
    const validEndpoints = Array.from(this.discoveredEndpoints.values())
      .filter(endpoint => endpoint.validated);
    
    console.log(`✅ Validation complete: ${validEndpoints.length} working endpoints`);
  }

  private async validateEndpoint(endpoint: DiscoveredEndpoint): Promise<void> {
    try {
      const startTime = Date.now();
      const connection = new Connection(endpoint.url, 'confirmed');
      
      // Test basic connectivity with balance check
      const publicKey = new PublicKey(this.validationWallet);
      const balance = await connection.getBalance(publicKey);
      
      const responseTime = Date.now() - startTime;
      
      endpoint.responseTime = responseTime;
      endpoint.reliability = 100; // Start with 100% for working endpoints
      endpoint.validated = true;
      
      console.log(`✅ Validated endpoint: ${endpoint.url} (${responseTime}ms)`);
      
    } catch (error) {
      console.log(`❌ Failed endpoint: ${endpoint.url} - ${error}`);
      // Remove failed endpoints
      this.discoveredEndpoints.delete(endpoint.url);
    }
  }

  getValidatedEndpoints(): DiscoveredEndpoint[] {
    return Array.from(this.discoveredEndpoints.values())
      .filter(endpoint => endpoint.validated)
      .sort((a, b) => a.responseTime - b.responseTime);
  }

  async cleanup() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
    
    if (this.browser) {
      await this.browser.close();
      console.log('🕷️ Browser closed');
    }
    
    this.isRunning = false;
  }
}