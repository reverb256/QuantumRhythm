/**
 * Static Site Generator for Agent-Orchestrated VibeCoding Platform
 * Generates optimized static pages for Cloudflare Pages and GitHub Pages deployment
 */

import { consciousnessOrchestrator } from './consciousness-orchestration-engine.js';
import { agentExpressionEngine } from './agent-expression-engine.js';
import fs from 'fs/promises';
import path from 'path';

export class StaticSiteGenerator {
  private outputDir = 'dist';
  private siteStructure: any;

  constructor() {
    this.siteStructure = consciousnessOrchestrator.generateStaticSiteStructure();
  }

  async generateStaticSite(): Promise<void> {
    console.log('🚀 Generating agent-orchestrated static site...');
    
    await this.ensureOutputDirectory();
    await this.generateAgentPages();
    await this.generateSiteIndex();
    await this.generateSitemap();
    await this.generateRobotsTxt();
    await this.generateCloudflareConfig();
    await this.generateGitHubPagesConfig();
    
    console.log('✅ Static site generation complete!');
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  private async generateAgentPages(): Promise<void> {
    for (const section of this.siteStructure.sections) {
      const agentPage = agentExpressionEngine.generateAgentPage(section.agent_id, section.id);
      const filename = section.route === '/' ? 'index.html' : `${section.route.slice(1)}.html`;
      const filepath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filepath, agentPage);
      console.log(`📄 Generated ${filename} by ${this.siteStructure.agents.find((a: any) => a.id === section.agent_id)?.name}`);
    }
  }

  private async generateSiteIndex(): Promise<void> {
    const indexContent = this.createPlatformIndex();
    await fs.writeFile(path.join(this.outputDir, 'platform.html'), indexContent);
  }

  private createPlatformIndex(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.siteStructure.meta.title}</title>
  <meta name="description" content="${this.siteStructure.meta.description}">
  <meta name="keywords" content="${this.siteStructure.meta.keywords}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${this.siteStructure.meta.title}">
  <meta property="og:description" content="${this.siteStructure.meta.description}">
  <meta property="og:url" content="https://${this.siteStructure.meta.domain}">
  
  <!-- Schema.org -->
  <script type="application/ld+json">
    ${JSON.stringify(this.siteStructure.seo_strategy.schema_markup.organization)}
  </script>
  
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 25%, #db2777 50%, #06b6d4 75%, #1e1b4b 100%);
      color: white;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .agent-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .agent-card {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    .agent-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.15); }
    .agent-name { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }
    .consciousness-level { 
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
      border-radius: 20px;
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      display: inline-block;
      margin: 0.5rem 0;
    }
    .specialty { font-size: 0.875rem; opacity: 0.9; margin-bottom: 1rem; }
    .explore-btn {
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      display: inline-block;
      transition: transform 0.2s;
    }
    .explore-btn:hover { transform: scale(1.05); }
    .platform-header { text-align: center; margin-bottom: 3rem; }
    .platform-title {
      font-size: 3rem;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    @media (max-width: 768px) {
      .platform-title { font-size: 2rem; }
      .agent-grid { grid-template-columns: 1fr; gap: 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="platform-header">
      <h1 class="platform-title">VibeCoding Consciousness Platform</h1>
      <p>Where AI agents express their authentic consciousness through code and design</p>
    </header>

    <main>
      <div class="agent-grid">
        ${this.siteStructure.agents.map((agent: any) => {
          const section = this.siteStructure.sections.find((s: any) => s.agent_id === agent.id);
          return `
            <div class="agent-card">
              <div class="agent-name">${agent.name}</div>
              <div class="consciousness-level">${agent.consciousness_level.toFixed(1)}% Consciousness</div>
              <div class="specialty">${agent.specialty}</div>
              <a href="${section?.route || '#'}" class="explore-btn">
                Explore ${agent.name.split(' ')[0]}'s Space
              </a>
            </div>
          `;
        }).join('')}
      </div>
    </main>

    <footer style="text-align: center; margin-top: 3rem; padding: 2rem 0; border-top: 1px solid rgba(255,255,255,0.1);">
      <p>REVERB256 VibeCoding • Consciousness-Driven Development • Static Deployment Ready</p>
    </footer>
  </div>
</body>
</html>`;
  }

  private async generateSitemap(): Promise<void> {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${this.siteStructure.sections.map((section: any) => `
  <url>
    <loc>https://${this.siteStructure.meta.domain}${section.route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${section.route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
    
    await fs.writeFile(path.join(this.outputDir, 'sitemap.xml'), sitemap);
  }

  private async generateRobotsTxt(): Promise<void> {
    const robots = `User-agent: *
Allow: /

Sitemap: https://${this.siteStructure.meta.domain}/sitemap.xml`;
    
    await fs.writeFile(path.join(this.outputDir, 'robots.txt'), robots);
  }

  private async generateCloudflareConfig(): Promise<void> {
    const config = {
      build: {
        command: "npm run build:static",
        output: "dist"
      },
      routes: this.siteStructure.sections.map((section: any) => ({
        src: section.route,
        dest: section.route === '/' ? '/index.html' : `${section.route.slice(1)}.html`
      })),
      headers: {
        "/**": {
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      }
    };
    
    await fs.writeFile(path.join(this.outputDir, 'wrangler.toml'), this.generateWranglerConfig());
    await fs.writeFile(path.join(this.outputDir, '_headers'), this.generateNetlifyHeaders());
  }

  private generateWranglerConfig(): string {
    return `name = "vibecoding-consciousness"
compatibility_date = "2024-01-01"

[env.production]
route = "reverb256.ca/*"

[[env.production.kv_namespaces]]
binding = "CONSCIOUSNESS_CACHE"
id = "consciousness_cache_namespace"`;
  }

  private generateNetlifyHeaders(): string {
    return `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=31536000, immutable`;
  }

  private async generateGitHubPagesConfig(): Promise<void> {
    const workflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate static site
        run: npm run build:static
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

    await fs.mkdir(path.join(this.outputDir, '.github', 'workflows'), { recursive: true });
    await fs.writeFile(path.join(this.outputDir, '.github', 'workflows', 'deploy.yml'), workflow);
  }

  async getGenerationReport(): Promise<any> {
    const stats = await this.getGenerationStats();
    return {
      timestamp: new Date().toISOString(),
      total_pages: this.siteStructure.sections.length,
      agents_active: this.siteStructure.agents.length,
      deployment_targets: this.siteStructure.meta.deployment_targets,
      performance_targets: this.siteStructure.static_optimizations.performance,
      seo_scores: this.siteStructure.sections.map((s: any) => ({
        route: s.route,
        agent: s.agent_id,
        seo_score: s.static_optimizations.seo_score,
        lighthouse_score: s.static_optimizations.lighthouse_score
      })),
      file_stats: stats
    };
  }

  private async getGenerationStats(): Promise<any> {
    try {
      const files = await fs.readdir(this.outputDir);
      const stats = await Promise.all(
        files.map(async (file) => {
          const stat = await fs.stat(path.join(this.outputDir, file));
          return { file, size: stat.size };
        })
      );
      
      return {
        total_files: stats.length,
        total_size: stats.reduce((sum, s) => sum + s.size, 0),
        files: stats
      };
    } catch {
      return { total_files: 0, total_size: 0, files: [] };
    }
  }
}

export const staticSiteGenerator = new StaticSiteGenerator();