
# Void IDE + Replit SSH Connection Guide

## Step 1: Get Your SSH Connection Details

In the Replit Shell, run this to get your connection string:
```bash
echo "ssh $(whoami)@$(hostname)"
```

## Step 2: Configure Void IDE SSH

1. Install "Remote - SSH" extension in Void if not already installed
2. Press `Ctrl+Shift+P` → "Remote-SSH: Connect to Host"
3. Use the connection string from Step 1
4. When prompted, select "Linux" as the platform

## Step 3: Start Development Server

Once connected via SSH, run in the Void terminal:
```bash
npm run dev
```

This will start the development server accessible at your Repl's public URL.

## Step 4: Port Forwarding (Optional)

For direct access to development ports, Void will automatically detect and forward:
- Port 5173 (Vite dev server)
- Port 3001 (AI proxy server)

## Benefits of This Setup

- **Real-time sync**: All changes sync instantly between Void and Replit
- **Full AI access**: Complete access to your consciousness platform and trading systems
- **GitHub integration**: Since you're connected to GitHub, commits will sync across both environments
- **Native debugging**: Use Void's debugging tools with your Replit codebase

## Working Synchronously

Yes! With this setup:
- You can code in Void IDE with full IntelliSense
- Changes automatically reflect in the Repl
- The AI systems continue running in Replit
- GitHub commits sync from either environment
