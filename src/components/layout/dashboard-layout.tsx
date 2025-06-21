"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AnimatedBackground } from "@/components/custom"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <AnimatedBackground particleCount={20} />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
