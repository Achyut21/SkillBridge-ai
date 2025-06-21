"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  Brain, 
  Mic, 
  TrendingUp, 
  User, 
  Settings,
  BookOpen,
  BarChart3,
  Sparkles,
  LogOut
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    color: "text-neon-blue"
  },
  {
    title: "Learning Paths",
    href: "/dashboard/learning-paths",
    icon: BookOpen,
    color: "text-neon-purple"
  },
  {
    title: "AI Coach",
    href: "/dashboard/voice-coach",
    icon: Mic,
    color: "text-neon-pink"
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "text-neon-cyan"
  },
  {
    title: "Market Trends",
    href: "/dashboard/market-trends",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    color: "text-orange-500"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    color: "text-gray-400"
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <GlassmorphismCard
      variant="heavy"
      className="fixed left-0 top-0 h-full w-64 p-6 rounded-none rounded-r-2xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple p-[1px]">
          <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-neon-blue" />
          </div>
        </div>
        <h1 className="text-xl font-bold gradient-text">SkillBridge AI</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                "hover:bg-white/10",
                isActive && "bg-white/20 shadow-lg shadow-neon-blue/20"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
              <span className={cn(
                "font-medium",
                isActive ? "text-white" : "text-gray-300"
              )}>
                {item.title}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </GlassmorphismCard>
  )
}
