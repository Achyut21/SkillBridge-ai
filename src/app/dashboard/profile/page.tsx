"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { GlassmorphismCard, GradientButton } from "@/components/custom"
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Edit, 
  Shield, 
  Bell, 
  Palette,
  Globe,
  LogOut,
  Settings,
  Star,
  Trophy
} from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  const achievements = [
    { icon: '🔥', name: 'Fast Learner', description: '5 courses in 30 days' },
    { icon: '🎯', name: 'Goal Getter', description: '10 goals achieved' },
    { icon: '💡', name: 'Knowledge Seeker', description: '100+ hours learned' },
    { icon: '⭐', name: 'Top Performer', description: '95% completion rate' },
  ]

  const stats = [
    { label: 'Courses Completed', value: '23' },
    { label: 'Skills Mastered', value: '15' },
    { label: 'Learning Streak', value: '45 days' },
    { label: 'Certificates', value: '8' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            My <span className="gradient-text-animated">Profile</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            Manage your account and preferences
          </p>
        </div>
        
        <GradientButton 
          variant="outline" 
          size="md" 
          className="flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </GradientButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <GlassmorphismCard variant="heavy" depth="triple" className="p-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 p-[2px]">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 dark:bg-brand-900/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-brand-500" />
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-neutral-900 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{session?.user?.name || "User"}</h2>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">{session?.user?.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium">
                <Star className="w-4 h-4" />
                Pro Member
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-brand-800/30">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-2xl font-bold stat-number">{stat.value}</p>
                    <p className="text-xs text-gray-600 dark:text-neutral-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphismCard>
          
          {/* Achievements */}
          <GlassmorphismCard variant="medium" depth="double" className="mt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-500" />
              Achievements
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement, index) => (
                <div 
                  key={index}
                  className="text-center p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors cursor-pointer group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {achievement.icon}
                  </div>
                  <p className="text-xs font-medium">{achievement.name}</p>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <GlassmorphismCard variant="medium" depth="double">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" />
                Account Information
              </h3>
              {isEditing && (
                <GradientButton variant="primary" size="sm">
                  Save Changes
                </GradientButton>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={session?.user?.name || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Time Zone
                </label>
                <select
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-50"
                >
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Language
                </label>
                <select
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none transition-colors disabled:opacity-50"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </GlassmorphismCard>          
          {/* Preferences */}
          <GlassmorphismCard variant="medium" depth="double">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-500" />
              Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-900/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Receive updates about your learning progress
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-900/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-900/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="font-medium">Privacy Settings</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Control your data and privacy
                    </p>
                  </div>
                </div>
                <GradientButton variant="ghost" size="sm">
                  Manage
                </GradientButton>
              </div>
            </div>
          </GlassmorphismCard>
          
          {/* Danger Zone */}
          <GlassmorphismCard variant="light" className="border-red-200 dark:border-red-900/30">
            <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <GradientButton variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                Delete Account
              </GradientButton>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}