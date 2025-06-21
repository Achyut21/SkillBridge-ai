// Test script to verify API keys and services
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Testing API Keys Configuration...\n');

// Check OpenAI API Key
const openAIKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
console.log('OpenAI API Key:', openAIKey ? `✅ Found (${openAIKey.slice(0, 7)}...)` : '❌ Not found');

// Check ElevenLabs API Key
const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
console.log('ElevenLabs API Key:', elevenLabsKey ? `✅ Found (${elevenLabsKey.slice(0, 7)}...)` : '❌ Not found');

// Check other important env vars
console.log('\nOther Configuration:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ Not found');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Found' : '❌ Not found');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Not found');

async function testAPIs() {
  // Test OpenAI service
  if (openAIKey) {
    console.log('\nTesting OpenAI Service...');
    try {
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openAIKey}`
        }
      });
      
      console.log('✅ OpenAI API connection successful');
      console.log(`   Found ${response.data.data?.length || 0} models`);
    } catch (error) {
      console.log(`❌ OpenAI API error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log('   Error details:', error.response.data);
      }
    }
  }

  // Test ElevenLabs service
  if (elevenLabsKey) {
    console.log('\nTesting ElevenLabs Service...');
    try {
      const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': elevenLabsKey
        }
      });
      
      console.log('✅ ElevenLabs API connection successful');
      console.log(`   Found ${response.data.voices?.length || 0} voices`);
    } catch (error) {
      console.log(`❌ ElevenLabs API error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log('   Error details:', error.response.data);
      }
    }
  }

  // Test local API endpoints
  console.log('\nTesting Local API Endpoints...');
  
  // Test voice endpoint
  try {
    const response = await axios.get('http://localhost:3004/api/ai/voice');
    console.log('✅ Voice API endpoint accessible');
  } catch (error) {
    console.log(`❌ Voice API endpoint error: ${error.response?.status || error.message}`);
  }

  console.log('\n✅ Test complete!');
}

testAPIs();
