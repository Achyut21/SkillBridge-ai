#!/bin/bash

# SkillBridge AI Development Server Runner
# This script ensures you're using the correct Node.js version

echo "🚀 Starting SkillBridge AI Development Server..."
echo ""

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    echo "⚠️  NVM not found in this shell."
    echo "Please run these commands in your terminal:"
    echo ""
    echo "  nvm use 24.2.0"
    echo "  npm run dev"
    echo ""
    exit 1
fi

# Switch to Node 24.2.0
echo "📦 Switching to Node.js 24.2.0..."
nvm use 24.2.0

# Check Node version
NODE_VERSION=$(node --version)
echo "✅ Using Node.js $NODE_VERSION"
echo ""

# Run the development server
echo "🔧 Starting Next.js development server on port 3004..."
npm run dev