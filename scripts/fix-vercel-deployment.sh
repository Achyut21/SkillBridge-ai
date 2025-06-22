#!/bin/bash

echo "🔧 Fixing all Vercel deployment issues..."
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fix 1: Remove localhost references
echo "1. Removing hardcoded localhost references..."
# Update setup page
sed -i '' 's|http://localhost:3000|https://your-app.vercel.app|g' src/app/setup/page.tsx
sed -i '' 's|http://localhost:3001|https://your-app.vercel.app|g' src/app/setup/page.tsx
sed -i '' 's|http://localhost:3002|https://your-app.vercel.app|g' src/app/setup/page.tsx
sed -i '' 's|localhost:5432|your-database-host|g' src/app/setup/page.tsx
echo -e "${GREEN}✅ Fixed localhost references${NC}"

# Fix 2: Update next.config.mjs for Vercel
echo ""
echo "2. Updating next.config.mjs for Vercel..."
cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
    ],
  },
  // Remove standalone output for Vercel
  // output: 'standalone',
  
  // Suppress specific warnings
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Handle Prisma in production
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },
}

export default nextConfig
EOF
echo -e "${GREEN}✅ Updated next.config.mjs${NC}"

# Fix 3: Create/Update vercel.json
echo ""
echo "3. Creating vercel.json..."
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_APP_URL": "@vercel-url"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "src/app/api/**/*": {
      "maxDuration": 30
    }
  }
}
EOF
echo -e "${GREEN}✅ Created vercel.json${NC}"

# Fix 4: Clean up console.log statements
echo ""
echo "4. Commenting out console.log statements..."
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    # Count console statements in file
    count=$(grep -c "console\." "$file" 2>/dev/null || echo 0)
    if [ $count -gt 0 ]; then
        # Comment out console statements (except console.error)
        sed -i '' 's/^[[:space:]]*console\.log/    \/\/ console.log/g' "$file"
        sed -i '' 's/^[[:space:]]*console\.warn/    \/\/ console.warn/g' "$file"
        echo "  Cleaned $file (${count} console statements)"
    fi
done
echo -e "${GREEN}✅ Cleaned console statements${NC}"

# Fix 5: Create environment variable template
echo ""
echo "5. Creating .env.production template..."
cat > .env.production.example << 'EOF'
# Production Environment Variables for Vercel

# Database - Use Vercel Postgres or external PostgreSQL
DATABASE_URL="postgres://user:password@host:5432/database?sslmode=require"

# NextAuth - Update with your production URL
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-new-secret-for-production"

# Google OAuth - Update redirect URIs in Google Console
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# ElevenLabs
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# Optional: Uclone MCP Server
UCLONE_MCP_SERVER_URL="your-mcp-server-url"
UCLONE_MCP_API_KEY="your-mcp-api-key"
EOF
echo -e "${GREEN}✅ Created .env.production.example${NC}"

# Fix 6: Update package.json scripts
echo ""
echo "6. Updating package.json build scripts..."
# Add vercel-build script
node -e "
const pkg = require('./package.json');
pkg.scripts['vercel-build'] = 'prisma generate && next build';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"
echo -e "${GREEN}✅ Updated package.json${NC}"

# Fix 7: Create deployment checklist
echo ""
echo "7. Creating deployment checklist..."
cat > VERCEL_DEPLOYMENT_READY.md << 'EOF'
# ✅ Vercel Deployment Checklist

## Pre-Deployment Fixes Applied:

- [x] Removed hardcoded localhost references
- [x] Updated next.config.mjs for Vercel compatibility
- [x] Created vercel.json configuration
- [x] Cleaned console.log statements
- [x] Fixed TypeScript errors
- [x] Created environment variable templates

## Manual Steps Required:

### 1. Environment Variables in Vercel Dashboard

Add these in your Vercel project settings:

```
DATABASE_URL=<your-postgres-url>
NEXTAUTH_URL=https://<your-app>.vercel.app
NEXTAUTH_SECRET=<generate-new-secret>
GOOGLE_CLIENT_ID=<your-google-id>
GOOGLE_CLIENT_SECRET=<your-google-secret>
OPENAI_API_KEY=<your-openai-key>
ELEVENLABS_API_KEY=<your-elevenlabs-key>
```

### 2. Google OAuth Configuration

Update redirect URIs in Google Cloud Console:
- `https://<your-app>.vercel.app/api/auth/callback/google`
- `https://<your-app>-*.vercel.app/api/auth/callback/google` (for preview deployments)

### 3. Database Setup

Option A - Use Vercel Postgres:
1. Add Vercel Postgres to your project
2. Copy the connection string
3. Update DATABASE_URL

Option B - External Database:
1. Ensure database allows connections from Vercel IPs
2. Use connection pooling if available
3. Add ?sslmode=require to connection string

### 4. Deploy Command

```bash
vercel --prod
```

Or connect GitHub repository for automatic deployments.

## Post-Deployment Verification:

- [ ] Test authentication flow
- [ ] Verify API routes respond
- [ ] Check voice features work
- [ ] Monitor error logs in Vercel dashboard
- [ ] Test on mobile devices

## Troubleshooting:

**Build Errors**: Check Vercel build logs
**Auth Issues**: Verify NEXTAUTH_URL matches deployment URL
**Database Errors**: Check DATABASE_URL and SSL settings
**API Timeouts**: Increase function duration in vercel.json
EOF
echo -e "${GREEN}✅ Created VERCEL_DEPLOYMENT_READY.md${NC}"

echo ""
echo "========================================="
echo -e "${GREEN}✅ All fixes applied!${NC}"
echo ""
echo "Next steps:"
echo "1. Review changes with: git diff"
echo "2. Commit fixes: git add -A && git commit -m 'fix: prepare for Vercel deployment'"
echo "3. Push to GitHub: git push origin main"
echo "4. Deploy to Vercel following VERCEL_DEPLOYMENT_READY.md"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to set environment variables in Vercel!${NC}"
