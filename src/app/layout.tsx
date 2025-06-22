"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { UnifiedNavbar } from "@/components/layout/unified-navbar"
import { ModernFooter } from "@/components/layout/modern-footer"
import { AnimatedBackground } from "@/components/custom/animated-background"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <SessionProvider>
          <AnimatedBackground />
          <div className="min-h-screen relative flex flex-col">
            <UnifiedNavbar />
            <main className="relative z-content pt-24 flex-1 flex flex-col">
              {children}
            </main>
            <ModernFooter />
          </div>
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}