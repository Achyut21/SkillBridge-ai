'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { AnimatedBackground } from '@/components/custom/animated-background';
import { NeuralLoader } from '@/components/custom/neural-loader';
import { Sparkles, Mail, Chrome, Loader2, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      });
      
      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 animate-float">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back to <span className="gradient-text-animated">SkillBridge</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Sign in to continue your learning journey
          </p>
        </div>

        <GlassmorphismCard variant="heavy" depth="triple" className="p-8">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Google Sign In */}
            <GradientButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 group"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  <span>Continue with Google</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                </>
              )}
            </GradientButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-brand-800/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <GradientButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full animate-glow-pulse"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </GradientButton>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
                Sign up
              </Link>
            </p>
            <Link href="#" className="text-sm text-gray-500 dark:text-neutral-500 hover:text-brand-500 transition-colors">
              Forgot password?
            </Link>
          </div>
        </GlassmorphismCard>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-neutral-500 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}