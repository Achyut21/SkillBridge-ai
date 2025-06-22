import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'SkillBridge AI - Professional Development Platform',
    template: '%s | SkillBridge AI'
  },
  description: 'Voice-enabled AI-powered platform for professional development with real-time market insights, personalized learning paths, and intelligent career guidance.',
  keywords: [
    'professional development',
    'AI coaching',
    'voice AI',
    'career guidance',
    'skill assessment',
    'learning paths',
    'market insights',
    'personal development',
    'AI mentor',
    'career advancement'
  ],
  authors: [{ name: 'SkillBridge AI Team' }],
  creator: 'SkillBridge AI',
  publisher: 'SkillBridge AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skillbridge-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skillbridge-ai.vercel.app',
    siteName: 'SkillBridge AI',
    title: 'SkillBridge AI - Professional Development Platform',
    description: 'Voice-enabled AI-powered platform for professional development with real-time market insights and personalized learning paths.',
    images: [
      {
        url: '/icons/icon-512x512.svg',
        width: 512,
        height: 512,
        alt: 'SkillBridge AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillBridge AI - Professional Development Platform',
    description: 'Voice-enabled AI-powered platform for professional development with real-time market insights.',
    images: ['/icons/icon-512x512.svg'],
    creator: '@skillbridge_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  category: 'technology',
}
