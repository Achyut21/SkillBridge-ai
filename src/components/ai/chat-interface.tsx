"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Sparkles, Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>
  messages: ChatMessage[]
  isLoading?: boolean
  suggestedPrompts?: string[]
  enableVoice?: boolean
  className?: string
}

export function ChatInterface({
  onSendMessage,
  messages,
  isLoading = false,
  suggestedPrompts = [],
  enableVoice = false,
  className
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await onSendMessage(message)
    
    // Refocus input after sending
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return
    setInput(suggestion)
    inputRef.current?.focus()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement actual recording functionality
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message when no messages */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center min-h-[200px]"
          >
            <GlassmorphismCard variant="single" className="p-6 max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to AI Voice Coach!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                I'm here to help you with career guidance, skill recommendations, and personalized learning paths. 
                {enableVoice ? " I'll speak my responses out loud for you!" : " Enable voice mode to hear my responses!"}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>Ask me anything or choose from the suggestions below</span>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
        
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] lg:max-w-[70%]",
                  message.role === "user" ? "order-2" : "order-1"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      AI Coach
                    </span>
                  </div>
                )}

                <GlassmorphismCard
                  variant={message.role === "user" ? "double" : "single"}
                  className={cn(
                    "p-4",
                    message.role === "user"
                      ? "bg-brand-50/50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800"
                      : "bg-white/50 dark:bg-gray-900/20"
                  )}
                >
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {message.metadata?.suggestions && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Suggested follow-ups:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.metadata.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassmorphismCard>

                {message.role === "user" && (
                  <div className="flex items-center gap-2 mt-2 justify-end">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      You
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <GlassmorphismCard className="p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  AI Coach is thinking...
                </span>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {suggestedPrompts.length > 0 && messages.length === 0 && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Try asking:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                className="text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career development..."
              rows={1}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg resize-none",
                "bg-white dark:bg-gray-900",
                "border border-gray-300 dark:border-gray-700",
                "focus:border-brand-500 dark:focus:border-brand-400",
                "focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                "text-gray-900 dark:text-gray-100",
                "transition-all duration-200"
              )}
              style={{
                minHeight: "48px",
                maxHeight: "120px"
              }}
            />
            
            {enableVoice && (
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "absolute right-2 bottom-3 p-2 rounded-full transition-all",
                  isRecording
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                )}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <GradientButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={!input.trim() || isLoading}
            className="h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </GradientButton>
        </div>

        {/* Character count for long messages */}
        {input.length > 200 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
            {input.length} / 1000 characters
          </p>
        )}
      </form>
    </div>
  )
}
