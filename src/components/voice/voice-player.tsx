"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react"
import { GlassmorphismCard, NeonBorder } from "@/components/custom"
import { cn } from "@/lib/utils"

interface VoicePlayerProps {
  audioUrl?: string
  onEnded?: () => void
  className?: string
}

export function VoicePlayer({ audioUrl, onEnded, className }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      onEnded?.()
    })

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
    }
  }, [audioUrl, onEnded])

  // Auto-play when audioUrl changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      // Handle base64 data URLs by converting to blob
      if (audioUrl.startsWith('data:')) {
        try {
          // Extract base64 data
          const base64Data = audioUrl.split(',')[1]
          const mimeType = audioUrl.match(/data:([^;]+)/)?.[1] || 'audio/mpeg'
          
          // Convert to blob
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: mimeType })
          const blobUrl = URL.createObjectURL(blob)
          
          // Update audio source
          audioRef.current.src = blobUrl
          
          // Clean up blob URL when component unmounts
          return () => URL.revokeObjectURL(blobUrl)
        } catch (error) {
          console.error("Failed to process audio data:", error)
        }
      }
      
      // Attempt to play
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
    // console.log("Audio playback started")
            setIsPlaying(true)
          })
          .catch(err => {
            console.error("Failed to auto-play:", err)
            // Show user-friendly message
            if (err.name === 'NotAllowedError') {
    // console.log("Browser prevented autoplay. User interaction required.")
            }
          })
      }
    }
  }, [audioUrl])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const vol = Number(e.target.value)
    audio.volume = vol
    setVolume(vol)
  }

  const skipBack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + 10)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <GlassmorphismCard variant="heavy" className={cn("p-6", className)}>
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Waveform Visualization */}
      <div className="mb-6 h-16 flex items-center justify-center gap-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 bg-gradient-to-t from-brand-400 to-brand-600 rounded-full transition-all duration-300",
              isPlaying ? "animate-pulse" : "opacity-50"
            )}
            style={{
              height: `${30 + (i % 3) * 20 + (i % 7) * 10}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={skipBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
            disabled={!audioUrl}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <NeonBorder color="gradient" rounded="full">
            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-background hover:bg-white/5 transition-all"
              disabled={!audioUrl}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>
          </NeonBorder>
          
          <button
            onClick={skipForward}
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
            disabled={!audioUrl}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            disabled={!audioUrl}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(to right, #00D9FF, #7C3AED);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(to right, #00D9FF, #7C3AED);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </GlassmorphismCard>
  )
}
