#!/bin/bash

# SkillBridge AI - Database Migration Script
# This script safely migrates the database schema

echo "🔄 Starting database migration for SkillBridge AI..."
echo ""

# Navigate to project directory
cd /Users/achyutkatiyar/skillbridge-ai

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please ensure your environment variables are set up."
    exit 1
fi

echo "📊 Current database status:"
npx prisma db pull
echo ""

echo "🔨 Generating Prisma Client..."
npx prisma generate
echo ""

echo "🚀 Pushing schema changes to database..."
npx prisma db push --accept-data-loss
echo ""

echo "✅ Database migration complete!"
echo ""

echo "📋 Database schema summary:"
npx prisma studio &
STUDIO_PID=$!
echo "Prisma Studio started (PID: $STUDIO_PID)"
echo ""

echo "🎯 Next steps:"
echo "1. Check Prisma Studio at http://localhost:5555"
echo "2. Verify all tables and fields are correct"
echo "3. Run 'npm run dev' to start the application"
echo ""

# Optional: Kill Prisma Studio after 30 seconds
sleep 30
kill $STUDIO_PID 2>/dev/null
echo "Prisma Studio closed."
