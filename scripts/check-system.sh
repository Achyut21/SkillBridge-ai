#!/bin/bash

echo "🔍 SkillBridge AI - System Check Script"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check Node version
echo -e "\n📦 Node.js Environment:"
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
fi

# Check npm version
NPM_VERSION=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
fi

# Check environment variables
echo -e "\n🔐 Environment Variables:"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local file exists${NC}"
    
    # Check required env vars
    if grep -q "DATABASE_URL=" .env.local; then
        echo -e "${GREEN}✅ DATABASE_URL configured${NC}"
    else
        echo -e "${RED}❌ DATABASE_URL missing${NC}"
    fi
    
    if grep -q "NEXTAUTH_URL=" .env.local; then
        NEXTAUTH_URL=$(grep "NEXTAUTH_URL=" .env.local | cut -d'=' -f2)
        echo -e "${GREEN}✅ NEXTAUTH_URL: $NEXTAUTH_URL${NC}"
    else
        echo -e "${RED}❌ NEXTAUTH_URL missing${NC}"
    fi
    
    if grep -q "NEXTAUTH_SECRET=" .env.local && grep -q "GOOGLE_CLIENT_ID=" .env.local && grep -q "GOOGLE_CLIENT_SECRET=" .env.local; then
        echo -e "${GREEN}✅ Auth credentials configured${NC}"
    else
        echo -e "${RED}❌ Auth credentials incomplete${NC}"
    fi
else
    echo -e "${RED}❌ .env.local file not found${NC}"
fi

# Check Prisma
echo -e "\n🗄️  Database Status:"
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Prisma schema exists${NC}"
    
    # Check if Prisma client is generated
    if [ -d "node_modules/@prisma/client" ]; then
        echo -e "${GREEN}✅ Prisma client generated${NC}"
    else
        echo -e "${RED}❌ Prisma client not generated${NC}"
    fi
else
    echo -e "${RED}❌ Prisma schema not found${NC}"
fi

# Check dependencies
echo -e "\n📚 Dependencies:"
if [ -f "package.json" ]; then
    # Check for key dependencies
    DEPS_TO_CHECK=("next" "react" "react-dom" "@prisma/client" "next-auth" "tailwindcss")
    for dep in "${DEPS_TO_CHECK[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            VERSION=$(grep "\"$dep\"" package.json | head -1 | sed -E 's/.*"([^"]+)"[[:space:]]*$/\1/')
            echo -e "${GREEN}✅ $dep: $VERSION${NC}"
        else
            echo -e "${RED}❌ $dep not found${NC}"
        fi
    done
else
    echo -e "${RED}❌ package.json not found${NC}"
fi

# Check for port conflicts
echo -e "\n🌐 Port Availability:"
PORTS_TO_CHECK=(3000 3001 3002 3003 3004)
for port in "${PORTS_TO_CHECK[@]}"; do
    if lsof -i :$port >/dev/null 2>&1; then
        PID=$(lsof -ti:$port)
        echo -e "${YELLOW}⚠️  Port $port is in use (PID: $PID)${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
    fi
done

# Check file structure
echo -e "\n📁 Project Structure:"
REQUIRED_DIRS=("src" "src/app" "src/components" "src/lib" "prisma" "public")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir exists${NC}"
    else
        echo -e "${RED}❌ $dir missing${NC}"
    fi
done

# API endpoints check
echo -e "\n🔌 API Endpoints:"
API_ROUTES=("src/app/api/auth/[...nextauth]/route.ts" "src/app/api/config-check/route.ts")
for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo -e "${GREEN}✅ $route exists${NC}"
    else
        echo -e "${RED}❌ $route missing${NC}"
    fi
done

echo -e "\n======================================"
echo "Check complete. Review any ❌ items above."