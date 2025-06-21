// Browser console voice test helper
// Copy and paste this into your browser console on the SkillBridge AI site

window.testVoice = async function(text = "Hello! This is a test of the voice system.") {
  console.log("🎙️ Testing voice generation...");
  
  try {
    // Test voice API
    const response = await fetch("/api/ai/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voiceId: "aria" // Using the first available voice
      })
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok || !data.success) {
      console.error("❌ Voice API failed:", data.error);
      return;
    }

    // Create audio element
    console.log("✅ Voice generated, creating audio...");
    const audio = new Audio();
    
    // Convert base64 to blob for better browser compatibility
    const base64Data = data.audio;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: data.mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    audio.src = blobUrl;
    
    // Log audio details
    audio.addEventListener('loadedmetadata', () => {
      console.log("✅ Audio loaded:");
      console.log("  Duration:", audio.duration, "seconds");
      console.log("  Ready state:", audio.readyState);
    });
    
    audio.addEventListener('error', (e) => {
      console.error("❌ Audio error:", e);
    });

    // Try to play
    console.log("🔊 Attempting to play audio...");
    
    // Create a play button for user interaction
    const playButton = document.createElement('button');
    playButton.textContent = '🔊 Play Test Audio';
    playButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 10px 20px;
      background: #7C3AED;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    `;
    
    playButton.onclick = async () => {
      try {
        await audio.play();
        console.log("✅ Audio playing!");
        playButton.remove();
      } catch (error) {
        console.error("❌ Play error:", error);
      }
    };
    
    document.body.appendChild(playButton);
    
    // Also try auto-play
    try {
      await audio.play();
      console.log("✅ Audio auto-playing!");
      playButton.remove();
    } catch (error) {
      console.warn("⚠️ Auto-play blocked. Click the play button.");
    }
    
    // Store audio globally for debugging
    window.lastTestAudio = audio;
    console.log("💡 Audio stored in window.lastTestAudio for debugging");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Auto-run test
console.log(`
🎯 Voice Test Helper Loaded!
==========================
Run: testVoice() to test voice generation
Run: testVoice("Your custom text") to test with custom text

The test will:
1. Call the voice API
2. Convert the response to audio
3. Attempt to play it
4. Show a play button if auto-play is blocked
`);
