'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { Sparkles, Chrome, Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google login error:', error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative z-content w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-purple mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back to <span className="gradient-text">SkillBridge</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue your learning journey
          </p>
        </div>

        <GlassmorphismCard className="p-8">
          <div className="space-y-6">
            {/* Google Sign In */}
            <GradientButton
              type="button"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </GradientButton>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </GlassmorphismCard>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}