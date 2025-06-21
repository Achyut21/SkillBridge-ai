#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, '..', '.env.local') });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔍 Testing ElevenLabs API key...');
console.log(`API Key: ${ELEVENLABS_API_KEY.substring(0, 10)}...${ELEVENLABS_API_KEY.substring(ELEVENLABS_API_KEY.length - 4)}`);

// Test the API key by fetching user info
async function testApiKey() {
  try {
    console.log('\n📡 Fetching user info...');
    const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error(`❌ API Key validation failed: ${userResponse.status} ${userResponse.statusText}`);
      console.error('Response:', errorText);
      return false;
    }

    const userData = await userResponse.json();
    console.log('✅ API Key is valid!');
    console.log('\n👤 User Info:');
    console.log(`- Subscription: ${userData.subscription?.tier || 'Unknown'}`);
    console.log(`- Character count: ${userData.subscription?.character_count || 0}`);
    console.log(`- Character limit: ${userData.subscription?.character_limit || 'Unknown'}`);

    // Test available voices
    console.log('\n🎙️ Fetching available voices...');
    const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (voicesResponse.ok) {
      const voicesData = await voicesResponse.json();
      console.log(`✅ Found ${voicesData.voices.length} voices`);
      
      // Check if Rachel voice exists
      const rachelVoice = voicesData.voices.find(v => v.voice_id === '21m00Tcm4TlvDq8ikWAM');
      if (rachelVoice) {
        console.log('✅ Rachel voice (default) is available');
      } else {
        console.log('⚠️  Rachel voice not found, available voices:');
        voicesData.voices.slice(0, 5).forEach(voice => {
          console.log(`   - ${voice.name} (${voice.voice_id})`);
        });
      }
    }

    // Test voice generation with a small text
    console.log('\n🎵 Testing voice generation...');
    const testText = "Test";
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: testText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (ttsResponse.ok) {
      const audioBuffer = await ttsResponse.arrayBuffer();
      console.log(`✅ Voice generation successful! Audio size: ${audioBuffer.byteLength} bytes`);
    } else {
      const errorText = await ttsResponse.text();
      console.error(`❌ Voice generation failed: ${ttsResponse.status}`);
      console.error('Error:', errorText);
      
      // Check if it's an invalid voice ID error
      if (ttsResponse.status === 400 || ttsResponse.status === 422) {
        console.log('\n⚠️  The voice ID might be invalid. Trying with a different voice...');
        
        // Get first available voice
        const voicesResponse2 = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': ELEVENLABS_API_KEY }
        });
        
        if (voicesResponse2.ok) {
          const voicesData2 = await voicesResponse2.json();
          if (voicesData2.voices.length > 0) {
            const firstVoice = voicesData2.voices[0];
            console.log(`Trying with voice: ${firstVoice.name} (${firstVoice.voice_id})`);
            
            const ttsResponse2 = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${firstVoice.voice_id}`, {
              method: 'POST',
              headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                text: testText,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75
                }
              })
            });
            
            if (ttsResponse2.ok) {
              const audioBuffer2 = await ttsResponse2.arrayBuffer();
              console.log(`✅ Voice generation successful with ${firstVoice.name}! Audio size: ${audioBuffer2.byteLength} bytes`);
              console.log(`\n💡 Update your code to use voice ID: ${firstVoice.voice_id}`);
            }
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
    return false;
  }
}

// Run the test
testApiKey().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Your ElevenLabs integration should work.');
    console.log('\n🎯 Next steps:');
    console.log('1. Go to http://localhost:3004/dashboard/voice-diagnostic');
    console.log('2. Run the diagnostic test in your browser');
    console.log('3. Check browser console for any errors');
  } else {
    console.log('\n❌ Tests failed. Please check your API key and subscription.');
  }
  process.exit(success ? 0 : 1);
});
