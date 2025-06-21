#!/bin/bash

echo "🔧 SkillBridge AI - Quick Setup Script"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Generate NextAuth secret if not set
if ! grep -q "NEXTAUTH_SECRET=" .env.local || grep -q "NEXTAUTH_SECRET=\"your-nextauth-secret-key-here\"" .env.local; then
    echo ""
    echo "🔐 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    
    # Create a temporary file
    cp .env.local .env.local.tmp
    
    # Update the NEXTAUTH_SECRET
    if grep -q "NEXTAUTH_SECRET=" .env.local; then
        # Replace existing NEXTAUTH_SECRET
        grep -v "NEXTAUTH_SECRET=" .env.local.tmp > .env.local
        echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
    else
        # Add new NEXTAUTH_SECRET
        echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
    fi
    
    # Clean up
    rm -f .env.local.tmp
    
    echo "✅ NextAuth secret generated and saved"
else
    echo "✅ NextAuth secret already configured"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Set up Google OAuth credentials:"
echo "   - Visit: https://console.cloud.google.com/"
echo "   - Add these redirect URIs:"
echo "     • http://localhost:3000/api/auth/callback/google"
echo "     • http://localhost:3001/api/auth/callback/google"
echo "     • http://localhost:3002/api/auth/callback/google"
echo ""
echo "2. Get your API keys:"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - ElevenLabs: https://elevenlabs.io/ (Profile → API Key)"
echo ""
echo "3. Set up database:"
echo "   - Local: docker-compose up -d postgres"
echo "   - Cloud: Vercel Postgres, Supabase, or Neon"
echo ""
echo "4. Add your keys to .env.local"
echo ""
echo "5. Run database setup:"
echo "   npm run db:push"
echo ""
echo "6. Start development:"
echo "   npm run dev"
echo ""
echo "📖 Full guide: API_KEYS_SETUP.md"
echo ""
echo "🧪 Test your setup at: http://localhost:3000/api/config-check"
