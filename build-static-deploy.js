#!/usr/bin/env node

/**
 * Complete Static Deployment Builder
 * Handles Vite build output restructuring and adds deployment configurations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Building for static deployment...');

try {
  // Step 1: Clean existing dist
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning existing dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Run Vite build (outputs to dist/public due to vite.config.ts)
  console.log('📦 Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Step 3: Move files from dist/public to dist root
  const publicPath = path.join(__dirname, 'dist', 'public');
  const distPath = path.join(__dirname, 'dist');

  if (fs.existsSync(publicPath)) {
    console.log('📁 Restructuring build output for static deployment...');
    
    // Get all files and directories in dist/public
    const items = fs.readdirSync(publicPath);
    
    for (const item of items) {
      const sourcePath = path.join(publicPath, item);
      const destPath = path.join(distPath, item);
      
      // Move file or directory
      if (fs.statSync(sourcePath).isDirectory()) {
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
    
    // Remove the now-empty public directory
    fs.rmSync(publicPath, { recursive: true, force: true });
    console.log('✅ Build output restructured successfully');
  }

  // Step 4: Create deployment configurations
  console.log('⚙️ Creating deployment configurations...');

  // Netlify _redirects
  const redirectsContent = `# SPA routing for Netlify
/*    /index.html   200

# API routing (if needed)
/api/*  https://api.yourdomain.com/:splat  200
`;
  fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent);

  // Vercel configuration
  const vercelConfig = {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ]
  };
  fs.writeFileSync(path.join(distPath, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

  // GitHub Pages 404.html for SPA routing
  const githubPages404 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quantum AI Trading Platform</title>
  <meta name="description" content="Advanced AI-powered trading platform for cryptocurrency markets">
  <script type="text/javascript">
    // GitHub Pages SPA redirect
    var pathSegmentsToKeep = 0;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h1>Redirecting...</h1>
    <p>Loading Quantum AI Trading Platform</p>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(distPath, '404.html'), githubPages404);

  // Cloudflare Pages _redirects (same as Netlify)
  // Already created above

  // Step 5: Update index.html for better SPA routing
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add SPA routing script for GitHub Pages
    const spaScript = `
  <script type="text/javascript">
    // Handle GitHub Pages SPA routing
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>`;
    
    // Insert before closing head tag
    if (indexContent.includes('</head>')) {
      indexContent = indexContent.replace('</head>', spaScript + '\n</head>');
      
      // Add proper meta tags for SEO
      const metaTags = `
  <meta name="description" content="Advanced AI-powered quantum trading platform for cryptocurrency markets with real-time analytics and automated strategies">
  <meta name="keywords" content="crypto trading, AI trading, quantum computing, blockchain, DeFi, automated trading">
  <meta name="author" content="Quantum AI Trading Platform">
  <meta property="og:title" content="Quantum AI Trading Platform">
  <meta property="og:description" content="Advanced AI-powered trading platform for cryptocurrency markets">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Quantum AI Trading Platform">
  <meta name="twitter:description" content="Advanced AI-powered trading platform for cryptocurrency markets">`;
      
      indexContent = indexContent.replace('<head>', '<head>' + metaTags);
      fs.writeFileSync(indexPath, indexContent);
      console.log('📄 Enhanced index.html with SPA routing and SEO meta tags');
    }
  }

  // Step 6: Create deployment status and instructions
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    build_type: 'static',
    spa_routing: true,
    seo_optimized: true,
    supported_platforms: [
      'Netlify',
      'Vercel', 
      'GitHub Pages',
      'Cloudflare Pages',
      'Firebase Hosting',
      'AWS S3 + CloudFront'
    ],
    files_structure: {
      'index.html': 'Main SPA entry point',
      'assets/': 'Static assets (JS, CSS, images)',
      '_redirects': 'Netlify/Cloudflare Pages routing',
      'vercel.json': 'Vercel configuration',
      '404.html': 'GitHub Pages SPA routing',
      'deployment-info.json': 'This file'
    }
  };
  fs.writeFileSync(path.join(distPath, 'deployment-info.json'), JSON.stringify(deploymentInfo, null, 2));

  // Step 7: Create deployment instructions
  const deploymentInstructions = `# Deployment Instructions

## Your static build is ready in the \`dist/\` directory!

### Supported Platforms:

#### Netlify
1. Drag and drop the \`dist/\` folder to Netlify
2. Or connect your GitHub repo and set build command to: \`node build-static-deploy.js\`
3. Publish directory: \`dist\`

#### Vercel
1. Install Vercel CLI: \`npm i -g vercel\`
2. Run: \`vercel --prod\`
3. Or connect GitHub repo with build command: \`node build-static-deploy.js\`

#### GitHub Pages
1. Push \`dist/\` contents to \`gh-pages\` branch
2. Enable GitHub Pages in repository settings
3. SPA routing handled by 404.html

#### Cloudflare Pages
1. Connect your GitHub repository
2. Build command: \`node build-static-deploy.js\`
3. Build output directory: \`dist\`

#### Firebase Hosting
1. Install Firebase CLI: \`npm install -g firebase-tools\`
2. Run: \`firebase init hosting\`
3. Set public directory to \`dist\`
4. Configure as SPA: Yes
5. Deploy: \`firebase deploy\`

### Files Created:
- ✅ index.html (with SPA routing support)
- ✅ _redirects (Netlify/Cloudflare)
- ✅ vercel.json (Vercel)
- ✅ 404.html (GitHub Pages)
- ✅ SEO meta tags added
- ✅ All assets in proper structure

### Next Steps:
1. Test locally by serving the dist/ directory
2. Choose your preferred deployment platform
3. Follow the platform-specific instructions above
`;

  fs.writeFileSync(path.join(distPath, 'DEPLOYMENT.md'), deploymentInstructions);

  console.log('🎉 Static deployment build completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log('   ✅ Vite build completed');
  console.log('   ✅ Files moved to dist/ root');
  console.log('   ✅ SPA routing configured');
  console.log('   ✅ Platform configurations created');
  console.log('   ✅ SEO meta tags added');
  console.log('');
  console.log('🚀 Ready to deploy to:');
  console.log('   - Netlify');
  console.log('   - Vercel');
  console.log('   - GitHub Pages');
  console.log('   - Cloudflare Pages');
  console.log('   - Firebase Hosting');
  console.log('');
  console.log('📖 See DEPLOYMENT.md for detailed instructions');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}