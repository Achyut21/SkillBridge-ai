// Enhanced voice diagnostic utility
export async function testVoiceGeneration(text: string = "Hello, this is a test of the voice system.") {
    // console.log("🎙️ Starting voice generation test...");
  
  try {
    // Test 1: Direct API call
    // console.log("1. Testing direct voice API...");
    const response = await fetch("/api/ai/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voiceId: "rachel" // Using a known good voice ID
      })
    });

    const data = await response.json();
    // console.log("API Response:", data);

    if (!response.ok || !data.success) {
      console.error("❌ Voice API failed:", data.error);
      return null;
    }

    // Test 2: Create audio element
    // console.log("2. Creating audio element...");
    const audioUrl = `data:${data.mimeType};base64,${data.audio}`;
    const audio = new Audio(audioUrl);
    
    // Test 3: Check if audio can load
    // console.log("3. Loading audio...");
    await new Promise((resolve, reject) => {
      audio.onloadeddata = () => {
    // console.log("✅ Audio loaded successfully");
    // console.log("Duration:", audio.duration, "seconds");
        resolve(true);
      };
      audio.onerror = (e) => {
        console.error("❌ Audio load error:", e);
        reject(e);
      };
    });

    // Test 4: Try to play
    // console.log("4. Attempting to play audio...");
    try {
      await audio.play();
    // console.log("✅ Audio playing successfully");
    } catch (playError) {
      console.error("❌ Play error:", playError);
    // console.log("💡 This might be due to browser autoplay restrictions.");
    // console.log("   Click anywhere on the page and try again.");
    }

    return { audio, audioUrl };
  } catch (error) {
    console.error("❌ Voice test failed:", error);
    return null;
  }
}

// Browser compatibility check
export function checkAudioSupport() {
    // console.log("🔍 Checking browser audio support...");
  
  const audio = new Audio();
  const formats = {
    mp3: audio.canPlayType('audio/mpeg'),
    ogg: audio.canPlayType('audio/ogg'),
    wav: audio.canPlayType('audio/wav'),
    webm: audio.canPlayType('audio/webm')
  };
  
    // console.log("Audio format support:", formats);
  
  // Check autoplay policy
  if ('getAutoplayPolicy' in navigator) {
    // @ts-ignore
    navigator.getAutoplayPolicy('mediaelement').then((policy: string) => {
    // console.log("Autoplay policy:", policy);
    });
  }
  
  return formats;
}

// Fix for data URL audio playback
export function createAudioFromBase64(base64Audio: string, mimeType: string = "audio/mpeg"): HTMLAudioElement {
  // Method 1: Data URL
  const dataUrl = `data:${mimeType};base64,${base64Audio}`;
  
  // Method 2: Blob URL (more reliable)
  try {
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    // console.log("Created blob URL for audio");
    return new Audio(blobUrl);
  } catch (error) {
    console.error("Failed to create blob URL, falling back to data URL:", error);
    return new Audio(dataUrl);
  }
}
