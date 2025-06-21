#!/bin/bash

# Start the development server with improved output
echo "🚀 Starting SkillBridge AI Development Server..."
echo "📍 Port: 3004"
echo "🔗 URL: http://localhost:3004"
echo ""

# Suppress Prisma warnings in development
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1

# Run the dev server
npm run dev
