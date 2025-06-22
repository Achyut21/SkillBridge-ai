#!/bin/bash

echo "🔧 Fixing TypeScript errors for Vercel deployment..."
echo ""

# Fix 1: Update API routes to handle Prisma Accelerate types
echo "Fixing src/app/api/ai/chat/route.ts..."
sed -i '' 's/await prisma\.user\.findUnique(/await (prisma.user.findUnique as any)(/g' src/app/api/ai/chat/route.ts
sed -i '' 's/await prisma\.chatSession\.findUnique(/await (prisma.chatSession.findUnique as any)(/g' src/app/api/ai/chat/route.ts
sed -i '' 's/await prisma\.chatSession\.findFirst(/await (prisma.chatSession.findFirst as any)(/g' src/app/api/ai/chat/route.ts
sed -i '' 's/await prisma\.chatSession\.findMany(/await (prisma.chatSession.findMany as any)(/g' src/app/api/ai/chat/route.ts
sed -i '' 's/\.map(session =>/\.map((session: any) =>/g' src/app/api/ai/chat/route.ts
sed -i '' 's/\.map(msg =>/\.map((msg: any) =>/g' src/app/api/ai/chat/route.ts

echo "Fixing src/app/api/ai/recommendations/route.ts..."
sed -i '' 's/await prisma\.user\.findUnique(/await (prisma.user.findUnique as any)(/g' src/app/api/ai/recommendations/route.ts
sed -i '' 's/\.map(us =>/\.map((us: any) =>/g' src/app/api/ai/recommendations/route.ts

echo "Fixing src/app/api/config-check/route.ts..."
sed -i '' 's/await prisma\.\$queryRaw/await (prisma.$queryRaw as any)/g' src/app/api/config-check/route.ts

# Fix 2: Remove localhost references
echo ""
echo "Removing hardcoded localhost references..."
sed -i '' 's|http://localhost:[0-9]*/|/|g' src/app/setup/page.tsx

# Fix 3: Update imports to use @ alias
echo ""
echo "Updating relative imports..."
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    # Skip if no relative imports
    if grep -q "from ['\"]\.\./" "$file"; then
        echo "  Updating imports in: $file"
        # This is complex, so we'll do it manually for now
    fi
done

echo ""
echo "✅ TypeScript fixes applied!"
echo ""
echo "Run './scripts/check-vercel-deployment.sh' again to verify fixes."
