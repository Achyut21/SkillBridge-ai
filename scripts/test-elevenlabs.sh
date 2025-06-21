#!/bin/bash

echo "🔍 Testing ElevenLabs API key..."

# Load API key from .env.local
if [ -f .env.local ]; then
    export $(grep ELEVENLABS_API_KEY .env.local | xargs)
else
    echo "❌ .env.local file not found"
    exit 1
fi

if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "❌ ELEVENLABS_API_KEY not found in .env.local"
    exit 1
fi

echo "API Key: ${ELEVENLABS_API_KEY:0:10}...${ELEVENLABS_API_KEY: -4}"
echo ""

# Test 1: Check user info
echo "📡 Testing API key validity..."
USER_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "https://api.elevenlabs.io/v1/user" \
  -H "xi-api-key: $ELEVENLABS_API_KEY")

HTTP_CODE=$(echo "$USER_RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$USER_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API key is valid!"
    echo "$RESPONSE_BODY" | python3 -m json.tool | head -20
else
    echo "❌ API key validation failed (HTTP $HTTP_CODE)"
    echo "$RESPONSE_BODY"
    exit 1
fi

echo ""

# Test 2: List available voices
echo "🎙️ Fetching available voices..."
VOICES_RESPONSE=$(curl -s -X GET \
  "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: $ELEVENLABS_API_KEY")

echo "$VOICES_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'Found {len(data[\"voices\"])} voices:')
for voice in data['voices'][:5]:
    print(f'  - {voice[\"name\"]} ({voice[\"voice_id\"]})')
"

echo ""

# Test 3: Try voice generation
echo "🎵 Testing voice generation..."
TTS_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }')

HTTP_CODE=$(echo "$TTS_RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Voice generation successful!"
else
    echo "❌ Voice generation failed (HTTP $HTTP_CODE)"
    
    # Try with first available voice
    echo ""
    echo "⚠️  Trying with first available voice..."
    FIRST_VOICE_ID=$(echo "$VOICES_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['voices']:
    print(data['voices'][0]['voice_id'])
")
    
    if [ -n "$FIRST_VOICE_ID" ]; then
        echo "Using voice ID: $FIRST_VOICE_ID"
        TTS_RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST \
          "https://api.elevenlabs.io/v1/text-to-speech/$FIRST_VOICE_ID" \
          -H "xi-api-key: $ELEVENLABS_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "text": "Test",
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
              "stability": 0.5,
              "similarity_boost": 0.75
            }
          }')
        
        HTTP_CODE2=$(echo "$TTS_RESPONSE2" | tail -n 1)
        if [ "$HTTP_CODE2" = "200" ]; then
            echo "✅ Voice generation successful with voice ID: $FIRST_VOICE_ID"
            echo ""
            echo "💡 Update your VOICE_IDS in the code to use this voice ID"
        else
            echo "❌ Voice generation still failed (HTTP $HTTP_CODE2)"
        fi
    fi
fi

echo ""
echo "🎯 Next steps:"
echo "1. Go to http://localhost:3004/dashboard/voice-diagnostic"
echo "2. Run the diagnostic test in your browser"
echo "3. Check browser console (F12) for any errors"
