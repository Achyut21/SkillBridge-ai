"use client"

import { useSession } from "next-auth/react"
import { Bell, Search, MessageSquare, Settings } from "lucide-react"
import { GlassmorphismCard, GradientButton, NeonBorder } from "@/components/custom"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <GlassmorphismCard
      variant="medium"
      className="sticky top-0 z-40 h-20 rounded-none rounded-b-2xl px-8 flex items-center justify-between"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <NeonBorder color="gradient" rounded="lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills, courses, or topics..."
              className="w-full pl-12 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
            />
          </div>
        </NeonBorder>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* AI Assistant Button */}
        <GradientButton
          variant="accent"
          size="sm"
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Ask AI
        </GradientButton>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80">
              <GlassmorphismCard variant="heavy" glow="purple" className="p-4">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-sm font-medium">New AI Course Available</p>
                    <p className="text-xs text-gray-400 mt-1">
                      "Advanced Machine Learning" just added to your path
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-sm font-medium">Daily Goal Achieved! 🎉</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You've completed 30 minutes of learning today
                    </p>
                  </div>
                </div>
              </GlassmorphismCard>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
          <Settings className="w-5 h-5 text-gray-300" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
            <p className="text-xs text-gray-400">Pro Member</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple p-[1px]">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="w-full h-full rounded-xl"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center text-sm font-semibold">
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassmorphismCard>
  )
}
