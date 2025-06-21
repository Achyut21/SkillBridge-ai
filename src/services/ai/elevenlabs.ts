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
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return response.arrayBuffer()
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
export const VOICE_IDS = {
  rachel: "21m00Tcm4TlvDq8ikWAM",     // Calm female
  domi: "AZnzlk1XvdvUeBnXmlld",       // Energetic female
  bella: "EXAVITQu4vr4xnSDxMaL",      // Soft female
  josh: "TxGEqnHWrfWFTfGW9XjX",       // Conversational male
  arnold: "VR6AewLTigWG4xSOukaG",     // Strong male
  adam: "pNInz6obpgDQGcFmaJgB",       // Deep male
  antoni: "ErXwobaYiN019PkySvjV",     // Well-rounded male
  elli: "MF3mGyEYCl7XYWbV9V6O",       // Young female
  sam: "yoZ06aMxZJJ28mfd3POQ",        // Raspy male
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
