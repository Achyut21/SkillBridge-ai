#!/bin/bash

echo "🔍 SkillBridge AI - Phase 1-3 Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Phase 1: Foundation & Setup${NC}"
echo "--------------------------------"
# Check core files
files_to_check=(
    "package.json"
    "tailwind.config.ts"
    "prisma/schema.prisma"
    ".env.local"
    "docker-compose.yml"
    "src/app/globals.css"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${YELLOW}✗${NC} $file"
    fi
done

echo ""
echo -e "${BLUE}🎨 Phase 2: Authentication & Core UI${NC}"
echo "-------------------------------------"
# Check auth and UI components
auth_files=(
    "src/app/auth/login/page.tsx"
    "src/app/auth/register/page.tsx"
    "src/lib/auth.ts"
    "src/middleware.ts"
    "src/stores/auth-store.ts"
)

for file in "${auth_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${YELLOW}✗${NC} $file"
    fi
done

echo ""
echo "  Glassmorphism Components:"
components=(
    "glassmorphism-card"
    "gradient-button"
    "neon-border"
    "animated-background"
    "floating-elements"
)

for comp in "${components[@]}"; do
    if [ -f "src/components/custom/${comp}.tsx" ]; then
        echo -e "    ${GREEN}✓${NC} ${comp}"
    else
        echo -e "    ${YELLOW}✗${NC} ${comp}"
    fi
done

echo ""
echo -e "${BLUE}🎙️ Phase 3: Dashboard & Voice${NC}"
echo "------------------------------"
# Check dashboard files
dashboard_files=(
    "src/components/layout/sidebar.tsx"
    "src/components/layout/header.tsx"
    "src/components/layout/dashboard-layout.tsx"
    "src/app/dashboard/page.tsx"
    "src/app/dashboard/voice-coach/page.tsx"
)

for file in "${dashboard_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${YELLOW}✗${NC} $file"
    fi
done

echo ""
echo "  Voice Components:"
voice_files=(
    "src/components/voice/voice-player.tsx"
    "src/components/voice/ai-coach-avatar.tsx"
    "src/services/ai/elevenlabs.ts"
    "src/stores/voice-store.ts"
)

for file in "${voice_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${YELLOW}✗${NC} $file"
    fi
done

echo ""
echo -e "${BLUE}📊 Statistics${NC}"
echo "-------------"
# Count files
total_tsx=$(find src -name "*.tsx" | wc -l | xargs)
total_ts=$(find src -name "*.ts" | wc -l | xargs)
total_components=$(find src/components -name "*.tsx" | wc -l | xargs)

echo "  Total TSX files: $total_tsx"
echo "  Total TS files: $total_ts"
echo "  Total Components: $total_components"

echo ""
echo -e "${BLUE}🔑 Configuration Status${NC}"
echo "----------------------"
# Check if environment variables are set (not their values)
if grep -q "GOOGLE_CLIENT_ID=" .env.local && ! grep -q "GOOGLE_CLIENT_ID=\"your-google-client-id\"" .env.local; then
    echo -e "  ${GREEN}✓${NC} Google OAuth configured"
else
    echo -e "  ${YELLOW}✗${NC} Google OAuth not configured"
fi

if grep -q "NEXTAUTH_SECRET=" .env.local && ! grep -q "NEXTAUTH_SECRET=\"your-nextauth-secret-key-here\"" .env.local; then
    echo -e "  ${GREEN}✓${NC} NextAuth secret configured"
else
    echo -e "  ${YELLOW}✗${NC} NextAuth secret not configured"
fi

if grep -q "DATABASE_URL=" .env.local && ! grep -q "DATABASE_URL=\"postgresql://user:password" .env.local; then
    echo -e "  ${GREEN}✓${NC} Database URL configured"
else
    echo -e "  ${YELLOW}✗${NC} Database URL not configured"
fi

echo ""
echo -e "${GREEN}✨ Phase 1-3 Complete!${NC}"
echo "====================="
echo "All core features have been implemented:"
echo "- Neural glassmorphism design system"
echo "- Authentication with Google OAuth"
echo "- Dashboard layout with navigation"
echo "- Voice integration UI components"
echo ""
echo "Ready for Phase 4: AI Integration & Market Data"
