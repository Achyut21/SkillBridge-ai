#!/bin/bash

echo "🔍 SkillBridge AI - Vercel Deployment Checker"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check and report
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ((ERRORS++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "1. Checking Environment Setup..."
echo "================================"

# Check if .env.example exists and has proper placeholders
if [ -f ".env.example" ]; then
    if grep -q "your-" ".env.example" && ! grep -q "sk-" ".env.example"; then
        check 0 ".env.example has placeholder values (no real secrets)"
    else
        check 1 ".env.example contains real secrets!"
    fi
else
    check 1 ".env.example is missing"
fi

# Check for .env.local
if [ -f ".env.local" ]; then
    info ".env.local exists (will not be deployed)"
else
    warn ".env.local missing - ensure Vercel has all environment variables"
fi

echo ""
echo "2. Checking Dependencies..."
echo "==========================="

# Check for missing dependencies
MISSING_DEPS=""
if ! grep -q "\"@prisma/client\"" package.json; then
    MISSING_DEPS="$MISSING_DEPS @prisma/client"
fi

if [ -z "$MISSING_DEPS" ]; then
    check 0 "All required dependencies are in package.json"
else
    check 1 "Missing dependencies: $MISSING_DEPS"
fi

# Check for postinstall script
if grep -q "\"postinstall\".*prisma generate" package.json; then
    check 0 "Postinstall script for Prisma is configured"
else
    check 1 "Missing postinstall script for Prisma generation"
fi

echo ""
echo "3. Checking Build Configuration..."
echo "=================================="

# Check next.config.mjs
if [ -f "next.config.mjs" ]; then
    # Check for problematic configurations
    if grep -q "output.*standalone" next.config.mjs; then
        warn "Standalone output mode detected - ensure Vercel compatibility"
    fi
    check 0 "next.config.mjs exists"
else
    check 1 "next.config.mjs is missing"
fi

# Check for TypeScript errors
echo ""
echo "4. Running TypeScript Check..."
echo "=============================="
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
TSC_EXIT_CODE=${PIPESTATUS[0]}
if [ $TSC_EXIT_CODE -eq 0 ]; then
    check 0 "No TypeScript errors found"
else
    check 1 "TypeScript errors detected (see above)"
fi

echo ""
echo "5. Checking for Common Issues..."
echo "================================"

# Check for localhost references in code
LOCALHOST_COUNT=$(grep -r "localhost:" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".env" | wc -l)
if [ $LOCALHOST_COUNT -gt 0 ]; then
    warn "Found $LOCALHOST_COUNT localhost references in code"
    echo "   Files with localhost:"
    grep -r "localhost:" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".env" | head -5
else
    check 0 "No hardcoded localhost references found"
fi

# Check for console.log statements
CONSOLE_COUNT=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
if [ $CONSOLE_COUNT -gt 20 ]; then
    warn "Found $CONSOLE_COUNT console statements (consider removing for production)"
fi

# Check imports
echo ""
echo "6. Checking Import Paths..."
echo "==========================="

# Check for incorrect import paths
BAD_IMPORTS=$(grep -r "from ['\"]\.\./" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | wc -l)
if [ $BAD_IMPORTS -eq 0 ]; then
    check 0 "No problematic relative imports found"
else
    warn "Found $BAD_IMPORTS relative imports (../) - consider using @ alias"
fi

# Check API routes
echo ""
echo "7. Checking API Routes..."
echo "========================="

# Count API routes
API_ROUTES=$(find src/app/api -name "route.ts" -o -name "route.js" 2>/dev/null | wc -l)
info "Found $API_ROUTES API routes"

# Check for proper exports in API routes
INVALID_ROUTES=0
for route in $(find src/app/api -name "route.ts" 2>/dev/null); do
    if ! grep -q "export.*\(GET\|POST\|PUT\|DELETE\|PATCH\)" "$route"; then
        warn "API route missing HTTP method export: $route"
        ((INVALID_ROUTES++))
    fi
done

if [ $INVALID_ROUTES -eq 0 ]; then
    check 0 "All API routes have proper exports"
fi

# Check for large files
echo ""
echo "8. Checking File Sizes..."
echo "========================="

LARGE_FILES=$(find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.next/*" 2>/dev/null)
if [ -z "$LARGE_FILES" ]; then
    check 0 "No large files found (>1MB)"
else
    warn "Large files found:"
    echo "$LARGE_FILES" | while read file; do
        SIZE=$(ls -lh "$file" | awk '{print $5}')
        echo "   - $file ($SIZE)"
    done
fi

# Check Prisma setup
echo ""
echo "9. Checking Database Setup..."
echo "============================="

if [ -f "prisma/schema.prisma" ]; then
    check 0 "Prisma schema exists"
    
    # Check for provider
    if grep -q "provider.*=.*\"prisma-client-js\"" prisma/schema.prisma; then
        check 0 "Prisma client provider is configured"
    else
        check 1 "Prisma client provider not configured"
    fi
    
    # Check for datasource
    if grep -q "provider.*=.*\"postgresql\"" prisma/schema.prisma; then
        check 0 "PostgreSQL datasource configured"
    else
        check 1 "PostgreSQL datasource not configured"
    fi
else
    check 1 "prisma/schema.prisma is missing"
fi

# Create deployment checklist
echo ""
echo "10. Creating Vercel Deployment Checklist..."
echo "==========================================="

cat > VERCEL_DEPLOYMENT_CHECKLIST.md << 'EOF'
# Vercel Deployment Checklist for SkillBridge AI

## Environment Variables Required in Vercel:

```
DATABASE_URL=<your-postgres-connection-string>
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-new-secret>
GOOGLE_CLIENT_ID=<your-google-oauth-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
OPENAI_API_KEY=<your-openai-key>
ELEVENLABS_API_KEY=<your-elevenlabs-key>
```

## Pre-Deployment Steps:

1. [ ] Ensure all environment variables are set in Vercel dashboard
2. [ ] Update Google OAuth redirect URIs to include Vercel URLs
3. [ ] Ensure database is accessible from Vercel (use Vercel Postgres or external)
4. [ ] Run `npm run build` locally to catch any build errors
5. [ ] Remove or configure any localhost references
6. [ ] Update NEXTAUTH_URL in production

## Vercel Configuration:

- **Build Command**: `npm run build` (or `prisma generate && next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x or higher

## Post-Deployment:

1. [ ] Test authentication flow
2. [ ] Verify API routes are working
3. [ ] Check database connectivity
4. [ ] Test voice features
5. [ ] Monitor error logs

## Common Issues:

- **Prisma Client Error**: Ensure `postinstall` script runs `prisma generate`
- **Auth Redirect Error**: Update OAuth redirect URIs
- **Database Connection**: Check DATABASE_URL and network access
- **API Key Errors**: Verify all API keys are set in Vercel
EOF

check 0 "Created VERCEL_DEPLOYMENT_CHECKLIST.md"

echo ""
echo "========================================"
echo "SUMMARY:"
echo "========================================"
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Your app is ready for Vercel deployment!${NC}"
    echo "   Don't forget to set environment variables in Vercel dashboard."
else
    echo -e "${RED}❌ Please fix the errors above before deploying.${NC}"
fi

echo ""
echo "📋 Check VERCEL_DEPLOYMENT_CHECKLIST.md for deployment steps."
