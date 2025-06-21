'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GradientButton } from '@/components/custom/gradient-button';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={cn(
          'pointer-events-auto mx-auto mt-4 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300 rounded-2xl',
          isScrolled 
            ? 'bg-white/80 dark:bg-brand-900/20 backdrop-blur-md border border-gray-200 dark:border-brand-500/20 shadow-lg dark:shadow-[0_8px_32px_rgba(168,85,247,0.08)]' 
            : 'bg-white/60 dark:bg-brand-900/10 backdrop-blur-sm border border-gray-100 dark:border-brand-500/10'
        )}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">
                SkillBridge AI
              </span>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <GradientButton variant="ghost" size="sm">
                  Sign In
                </GradientButton>
              </Link>
              <Link href="/auth/register">
                <GradientButton variant="primary" size="sm">
                  Get Started
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
