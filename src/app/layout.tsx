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
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling();
    
    // Set document title
    document.title = "SkillBridge AI - Professional Development Platform";
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
        {/* Primary Meta Tags */}
        <title>SkillBridge AI - Professional Development Platform</title>
        <meta name="title" content="SkillBridge AI - Professional Development Platform" />
        <meta name="description" content="Voice-enabled AI-powered platform for professional development with real-time market insights, personalized learning paths, and intelligent career guidance." />
        <meta name="keywords" content="professional development, AI coaching, voice AI, career guidance, skill assessment, learning paths, market insights" />
        <meta name="author" content="SkillBridge AI Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SkillBridge AI" />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skillbridge-ai.vercel.app/" />
        <meta property="og:title" content="SkillBridge AI - Professional Development Platform" />
        <meta property="og:description" content="Voice-enabled AI-powered platform for professional development with real-time market insights and personalized learning paths." />
        <meta property="og:image" content="/icons/icon-512x512.svg" />
        <meta property="og:site_name" content="SkillBridge AI" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://skillbridge-ai.vercel.app/" />
        <meta property="twitter:title" content="SkillBridge AI - Professional Development Platform" />
        <meta property="twitter:description" content="Voice-enabled AI-powered platform for professional development with real-time market insights." />
        <meta property="twitter:image" content="/icons/icon-512x512.svg" />
        <meta property="twitter:creator" content="@skillbridge_ai" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <link rel="canonical" href="https://skillbridge-ai.vercel.app/" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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