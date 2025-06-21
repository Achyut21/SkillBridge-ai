"use client"

import { useSession } from "next-auth/react"
import { GlassmorphismCard, GradientButton, NeonBorder } from "@/components/custom"
import { User, Mail, Calendar, Award, Edit } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Profile
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <GlassmorphismCard variant="heavy" glow="purple" className="p-8">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[2px]">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={128}
                  height={128}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                  {session?.user?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{session?.user?.name || "User"}</h2>
            <p className="text-gray-400">{session?.user?.email}</p>
            <div className="mt-4">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-sm font-medium">
                Pro Member
              </span>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <GlassmorphismCard variant="medium" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Account Information</h3>
              <GradientButton size="sm" variant="accent">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </GradientButton>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <NeonBorder color="gradient" rounded="lg">
                  <div className="p-3 flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{session?.user?.name || "Not set"}</span>
                  </div>
                </NeonBorder>
              </div>

              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <NeonBorder color="gradient" rounded="lg">
                  <div className="p-3 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{session?.user?.email || "Not set"}</span>
                  </div>
                </NeonBorder>
              </div>

              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <NeonBorder color="gradient" rounded="lg">
                  <div className="p-3 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>June 2025</span>
                  </div>
                </NeonBorder>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Achievements */}
          <GlassmorphismCard variant="medium" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm font-medium">Achievement {i}</p>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}
