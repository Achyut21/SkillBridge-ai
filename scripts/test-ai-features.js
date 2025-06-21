// Test script to verify AI features
const axios = require('axios');

const BASE_URL = 'http://localhost:3004';

async function testAIFeatures() {
  console.log('🧪 Testing AI Features...\n');

  // Test 1: Chat API
  console.log('1️⃣ Testing Chat API...');
  try {
    const chatResponse = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: "Hello! Tell me about yourself in one sentence."
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test' // This will fail auth but show if API is working
      }
    });
    console.log('✅ Chat API Response:', chatResponse.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️ Chat API returned 401 (expected without auth)');
    } else {
      console.log('❌ Chat API Error:', error.response?.data || error.message);
    }
  }

  // Test 2: Voice API
  console.log('\n2️⃣ Testing Voice API...');
  try {
    const voiceResponse = await axios.post(`${BASE_URL}/api/ai/voice`, {
      text: "This is a test of the voice synthesis."
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test'
      }
    });
    console.log('✅ Voice API Response:', {
      success: voiceResponse.data.success,
      hasAudio: !!voiceResponse.data.audio,
      mimeType: voiceResponse.data.mimeType
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️ Voice API returned 401 (expected without auth)');
    } else {
      console.log('❌ Voice API Error:', error.response?.data || error.message);
    }
  }

  // Test 3: Recommendations API
  console.log('\n3️⃣ Testing Recommendations API...');
  try {
    const recResponse = await axios.get(`${BASE_URL}/api/ai/recommendations?count=2`, {
      headers: {
        'Cookie': 'next-auth.session-token=test'
      }
    });
    console.log('✅ Recommendations API Response:', recResponse.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️ Recommendations API returned 401 (expected without auth)');
    } else {
      console.log('❌ Recommendations API Error:', error.response?.data || error.message);
    }
  }

  console.log('\n✅ Test complete!');
  console.log('\nNote: 401 errors are expected without proper authentication.');
  console.log('The important thing is that the APIs are responding and not throwing server errors.');
}

testAIFeatures();
