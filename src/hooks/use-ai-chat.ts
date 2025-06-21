import { useState, useCallback, useEffect } from "react"
import { ChatMessage } from "@/lib/types"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface UseAIChatOptions {
  sessionId?: string
  enableVoice?: boolean
  onNewMessage?: (message: ChatMessage) => void
  onError?: (error: Error) => void
}

interface UseAIChatReturn {
  messages: ChatMessage[]
  sessionId: string | null
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  playAudio: (audioUrl: string) => void
  stopAudio: () => void
  isPlaying: boolean
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(options.sessionId || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Load chat history if sessionId is provided
  useEffect(() => {
    if (options.sessionId) {
      loadChatHistory(options.sessionId)
    }
  }, [options.sessionId])

  const loadChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/ai/chat?sessionId=${sid}`)
      if (!response.ok) throw new Error("Failed to load chat history")
      
      const data = await response.json()
      setMessages(data.messages)
      setSessionId(data.sessionId)
    } catch (err) {
      console.error("Failed to load chat history:", err)
      setError(err as Error)
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!session?.user) {
      toast.error("Please sign in to use the AI coach")
      return
    }

    setIsLoading(true)
    setError(null)

    // Add user message immediately for better UX
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: content,
          sessionId,
          includeVoice: options.enableVoice
        })
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      
      // Update sessionId if this is a new session
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId)
      }

      // Replace temp message with real one and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempUserMessage.id)
        return [...filtered, 
          { ...tempUserMessage, id: `user-${Date.now()}` },
          data.message
        ]
      })

      // Call callback if provided
      options.onNewMessage?.(data.message)

      // Don't auto-play audio here - let the component handle it
      // The onNewMessage callback will handle voice playback

      // Show next action if available
      if (data.nextAction) {
        toast.info(data.nextAction.action, {
          description: data.nextAction.reason,
          duration: 5000
        })
      }
    } catch (err) {
      console.error("Chat error:", err)
      const error = err as Error
      setError(error)
      options.onError?.(error)
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id))
      
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [session, sessionId, options])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
    stopAudio()
  }, [])

  const playAudio = useCallback((audioUrl: string) => {
    // Stop current audio if playing
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    const newAudio = new Audio(audioUrl)
    
    newAudio.addEventListener("play", () => setIsPlaying(true))
    newAudio.addEventListener("pause", () => setIsPlaying(false))
    newAudio.addEventListener("ended", () => setIsPlaying(false))
    
    setAudio(newAudio)
    newAudio.play().catch(err => {
      console.error("Failed to play audio:", err)
      toast.error("Failed to play audio")
    })
  }, [audio])

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }, [audio])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause()
        audio.remove()
      }
    }
  }, [audio])

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    playAudio,
    stopAudio,
    isPlaying
  }
}
