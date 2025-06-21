#!/bin/bash

echo "🧪 Testing SkillBridge AI Voice Features..."
echo "==========================================\n"

# Check if server is running
echo "1️⃣ Checking if server is running on port 3004..."
if curl -s http://localhost:3004 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start with: npm run dev"
    exit 1
fi

echo "\n2️⃣ API Authentication Check..."
echo "ℹ️  Note: The API endpoints require authentication."
echo "   Direct curl requests will fail with 'Unauthorized' - this is expected!"
echo "   To properly test voice features, use the browser interface."

# Check if ElevenLabs API key is set
echo "\n3️⃣ Checking environment variables..."
if grep -q "ELEVENLABS_API_KEY" .env.local 2>/dev/null; then
    echo "✅ ElevenLabs API key is configured"
else
    echo "❌ ElevenLabs API key not found in .env.local"
    echo "   Please add: ELEVENLABS_API_KEY=your-api-key"
fi

if grep -q "OPENAI_API_KEY" .env.local 2>/dev/null; then
    echo "✅ OpenAI API key is configured"
else
    echo "❌ OpenAI API key not found in .env.local"
    echo "   Please add: OPENAI_API_KEY=your-api-key"
fi

echo "\n📊 Voice Integration Test Instructions:"
echo "======================================="
echo ""
echo "🌐 BROWSER TEST (Recommended):"
echo "1. Open http://localhost:3004/dashboard/voice-diagnostic"
echo "2. Sign in with Google OAuth"
echo "3. Click 'Run Voice Diagnostic' button"
echo "4. Check all test results"
echo ""
echo "🎙️ VOICE COACH TEST:"
echo "1. Go to http://localhost:3004/dashboard/voice-coach"
echo "2. Make sure you're logged in"
echo "3. Toggle 'Voice On' button (top right)"
echo "4. Send a message like 'Hello, how are you?'"
echo "5. Audio should auto-play with waveform visualization"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "- If voice doesn't play, check browser console for errors"
echo "- Ensure browser allows audio autoplay"
echo "- Check that ElevenLabs API key is valid"
echo "- Try Chrome/Edge for best compatibility"
echo ""
echo "💡 Common Issues:"
echo "- 'Unauthorized' errors = Not logged in"
echo "- No audio = Check browser autoplay settings"
echo "- 'API key invalid' = Check ElevenLabs key"
echo "- Slow response = Normal for first request"

# Show diagnostic page URL
echo "\n🚀 Quick Test Link:"
echo "   http://localhost:3004/dashboard/voice-diagnostic"
echo ""
echo "   This page will run comprehensive voice tests!"
