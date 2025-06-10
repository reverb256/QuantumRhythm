#!/bin/bash
echo "🚀 Deploying Quantum AI Trading Platform to Cloudflare..."

# Install dependencies
npm install -g wrangler

# Login to Cloudflare (if not already logged in)
echo "🔐 Ensuring Cloudflare authentication..."
wrangler auth list || wrangler login

# Deploy Worker
echo "⚡ Deploying Cloudflare Worker..."
cd dist-optimized
wrangler deploy

# Deploy Pages
echo "📄 Deploying to Cloudflare Pages..."
wrangler pages deploy static --project-name=quantum-ai-trading

echo "✅ Deployment complete!"
echo "🌐 Portfolio: https://reverb256.ca"
echo "🎯 Trading:  https://trader.reverb256.ca"
