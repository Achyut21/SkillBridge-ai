#!/bin/bash

# SkillBridge AI - Deployment Preparation Script

echo "🚀 SkillBridge AI - Preparing for Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in SkillBridge AI directory"
    echo "Please run this script from the project root"
    exit 1
fi

echo "✅ In correct directory"

# Check Node version
NODE_VERSION=$(node -v)
echo "📦 Current Node version: $NODE_VERSION"

# Check if .nvmrc exists
if [ -f ".nvmrc" ]; then
    REQUIRED_VERSION=$(cat .nvmrc)
    echo "📋 Required Node version: $REQUIRED_VERSION"
    
    # Check if nvm is available
    if command -v nvm &> /dev/null; then
        echo "🔄 Switching to Node $REQUIRED_VERSION with nvm..."
        nvm use
    else
        echo "⚠️  Warning: nvm not found. Please ensure Node.js 18+ is installed"
        echo "   Current version may work if it's 18 or higher"
    fi
else
    echo "⚠️  No .nvmrc file found"
fi

echo ""
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json

echo ""
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo ""
echo "🔨 Running build to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! Ready for deployment"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit any changes: git add -A && git commit -m 'chore: prepare for deployment'"
    echo "2. Push to GitHub: git push"
    echo "3. Check Vercel dashboard for deployment status"
    echo "4. Set environment variables in Vercel"
else
    echo ""
    echo "❌ Build failed. Please check the errors above"
    echo "Common issues:"
    echo "- Node version mismatch (requires 18+)"
    echo "- Missing environment variables"
    echo "- TypeScript errors"
fi
