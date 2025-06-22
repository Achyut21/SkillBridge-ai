interface VoiceSettings {
  voiceId: string
  modelId?: string
  voiceSettings?: {
    stability: number
    similarityBoost: number
    style?: number
    useSpeakerBoost?: boolean
  }
}

interface TextToSpeechOptions extends VoiceSettings {
  text: string
}

class ElevenLabsService {
  private apiKey: string
  private baseUrl = "https://api.elevenlabs.io/v1"
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async textToSpeech({ 
    text, 
    voiceId, 
    modelId = "eleven_monolingual_v1",
    voiceSettings = {
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.5,
      useSpeakerBoost: true
    }
  }: TextToSpeechOptions): Promise<ArrayBuffer> {
    // console.log(`ElevenLabs TTS request - Voice: ${voiceId}, Model: ${modelId}, Text length: ${text.length}`)
    
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarityBoost,
          style: voiceSettings.style,
          use_speaker_boost: voiceSettings.useSpeakerBoost,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`)
      
      if (response.status === 401) {
        throw new Error("Invalid ElevenLabs API key (401 Unauthorized)")
      } else if (response.status === 422) {
        throw new Error(`Invalid voice ID: ${voiceId}`)
      } else if (response.status === 429) {
        throw new Error("ElevenLabs API rate limit exceeded")
      } else {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    // console.log(`ElevenLabs TTS success - Audio size: ${arrayBuffer.byteLength} bytes`)
    return arrayBuffer
  }

  async getVoices() {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        "xi-api-key": this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`)
    }

    return response.json()
  }

  async getUserInfo() {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        "xi-api-key": this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`)
    }

    return response.json()
  }

  // Helper to convert text to speech and return as blob URL
  async generateSpeechUrl(options: TextToSpeechOptions): Promise<string> {
    const audioData = await this.textToSpeech(options)
    const blob = new Blob([audioData], { type: "audio/mpeg" })
    return URL.createObjectURL(blob)
  }
}

// Popular voice IDs for easy reference
// Updated based on available voices in the account
export const VOICE_IDS = {
  aria: "9BWtsMINqrJLrRacOk9x",       // Aria
  sarah: "EXAVITQu4vr4xnSDxMaL",      // Sarah (same as bella)
  laura: "FGY2WhTYpPnrIDTdsKH5",      // Laura
  charlie: "IKne3meq5aSn9XLyUdCD",    // Charlie
  george: "JBFqnCBsd6RMkjVDRZzb",     // George
  // Legacy mappings for compatibility
  rachel: "9BWtsMINqrJLrRacOk9x",     // Map to Aria
  bella: "EXAVITQu4vr4xnSDxMaL",      // Sarah
  josh: "IKne3meq5aSn9XLyUdCD",       // Charlie
  adam: "JBFqnCBsd6RMkjVDRZzb",       // George
}

// Singleton instance
let elevenLabsInstance: ElevenLabsService | null = null

export function getElevenLabsService(): ElevenLabsService {
  if (!elevenLabsInstance) {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      throw new Error("ElevenLabs API key not configured")
    }
    elevenLabsInstance = new ElevenLabsService(apiKey)
  }
  return elevenLabsInstance
}

export default ElevenLabsService
