
#!/bin/bash

echo "🔗 Starting Void IDE Integration Bridge"
echo "====================================="

# Start the void-proxy server
echo "Starting AI proxy server..."
node void-proxy-server.js &

# Start the main development server
echo "Starting main development server..."
npm run dev &

echo ""
echo "✅ Void IDE Bridge Active!"
echo ""
echo "SSH Connection: ssh $(whoami)@$(hostname)"
echo "AI Proxy: http://0.0.0.0:3001"
echo "Dev Server: http://0.0.0.0:5173"
echo ""
echo "Configure Void IDE with:"
echo "  AI Base URL: http://127.0.0.1:3001/v1 (SSH port forwarded)"
echo "  API Key: dummy-key-not-needed"
echo ""
echo "Note: Port 3001 will be automatically forwarded by Void's SSH connection"
