#!/usr/bin/env node

/**
 * Static Build Script for Client-Only Deployment
 * Creates a static version of the frontend without server dependencies
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Building static client-only version...');

try {
  // Clean existing dist
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning existing dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend only
  console.log('📦 Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Move files from dist/public to dist root
  const publicPath = path.join(__dirname, 'dist', 'public');
  const distPath = path.join(__dirname, 'dist');

  if (fs.existsSync(publicPath)) {
    console.log('📁 Moving files from dist/public to dist/...');
    
    const files = fs.readdirSync(publicPath);
    for (const file of files) {
      const sourcePath = path.join(publicPath, file);
      const destPath = path.join(distPath, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
    
    // Remove the now-empty public directory
    fs.rmSync(publicPath, { recursive: true, force: true });
    console.log('✅ Files moved successfully');
  }

  // Create _redirects file for SPA routing (Netlify/Vercel style)
  const redirectsContent = '/*    /index.html   200\n';
  fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent);
  console.log('📄 Created _redirects file for SPA routing');

  // Create .htaccess for Apache servers
  const htaccessContent = `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;
  fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent);
  console.log('📄 Created .htaccess file for Apache servers');

  // Verify index.html exists
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist directory');
  }

  console.log('🎉 Static build completed successfully!');
  console.log('📂 Files are ready in the dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}