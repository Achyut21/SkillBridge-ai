'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { AnimatedBackground } from '@/components/custom/animated-background';
import { Sparkles, Mail, User, Chrome, Loader2, ArrowRight, CheckCircle, Zap } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const benefits = [
    'Personalized AI learning paths',
    'Voice-enabled coaching',
    'Real-time market insights',
    'Progress tracking & certificates',
  ];

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically create the user account first
      // For now, we'll just sign them in with email
      const result = await signIn('email', {
        email,
        redirect: false,
      });
      
      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google signup error:', error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />      
      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 animate-fade-in">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Start Your <span className="gradient-text-animated">AI-Powered</span> Journey
            </h2>
            <p className="text-gray-600 dark:text-neutral-400 text-lg">
              Join thousands of professionals advancing their careers with personalized learning.
            </p>
          </div>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-brand-900/20 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-neutral-300">{benefit}</span>
              </div>
            ))}
          </div>
          
          <GlassmorphismCard variant="medium" depth="double" className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-brand-500" />
              <span className="font-semibold">Limited Time Offer</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
              Sign up today and get 30% off Pro membership
            </p>
            <div className="text-2xl font-bold">
              <span className="line-through text-gray-400">$39</span>{' '}
              <span className="text-brand-500">$27</span>
              <span className="text-sm font-normal text-gray-600 dark:text-neutral-400">/month</span>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Right Side - Form */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 animate-float">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-neutral-400">
              Free forever. No credit card required.
            </p>
          </div>
          <GlassmorphismCard variant="heavy" depth="triple" className="p-8">
            <form onSubmit={handleEmailSignup} className="space-y-6">
              {/* Google Sign Up */}
              <GradientButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3 group"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="h-5 w-5" />
                    <span>Sign up with Google</span>
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
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-800/30 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    placeholder="John Doe"
                    required
                  />
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
              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-neutral-400">
                  I agree to the{' '}
                  <Link href="#" className="text-brand-500 hover:text-brand-600 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-brand-500 hover:text-brand-600 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
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
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </GradientButton>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}