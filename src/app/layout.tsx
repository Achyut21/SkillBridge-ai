"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { UnifiedNavbar } from "@/components/layout/unified-navbar"
import { ModernFooter } from "@/components/layout/modern-footer"
import { AnimatedBackground } from "@/components/custom/animated-background"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme"
import { PWAManager } from "@/components/pwa"
import { ErrorBoundary, setupGlobalErrorHandling } from "@/components/error-boundary"
import { CommandPalette } from "@/components/accessibility"
import { SkipLinks } from "@/components/accessibility"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      <AnimatedBackground />
      <SkipLinks />
      <div className="min-h-screen relative flex flex-col">
        <UnifiedNavbar />
        <main id="main-content" className="relative z-content pt-24 flex-1 flex flex-col">
          {children}
        </main>
        <ModernFooter />
      </div>
      <PWAManager enableNotifications showInstallPrompt />
      <CommandPalette />
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <SessionProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}