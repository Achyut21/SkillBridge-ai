'use client';

import Link from 'next/link';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { 
  Sparkles, 
  Mic, 
  Brain, 
  TrendingUp, 
  ArrowRight,
  Check,
  Star
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Mic,
      title: 'Voice-Enabled Learning',
      description: 'Learn hands-free with our AI voice coach that adapts to your pace and style'
    },
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized learning paths based on your goals and market demand'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Market Insights',
      description: 'Stay ahead with live job market data and skill demand analytics'
    }
  ];

  const benefits = [
    'Personalized learning paths tailored to your goals',
    'Voice-enabled AI coach for hands-free learning',
    'Real-time job market insights and salary data',
    'Progress tracking with milestone celebrations',
    'Industry-recognized certifications',
    'Community support and networking'
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-8 pb-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text-animated">Transform Your Career</span><br />
            with AI-Powered Learning
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Voice-enabled professional development that adapts to you. Learn smarter, 
            grow faster, and stay ahead of the market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <GradientButton variant="primary" size="lg" className="flex items-center animate-glow-pulse">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <GradientButton variant="outline" size="lg" className="group">
              Watch Demo
              <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin" />
            </GradientButton>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-brand-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-brand-500 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-brand-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Learn Smarter, <span className="gradient-text">Not Harder</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI-powered platform revolutionizes how professionals learn and grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassmorphismCard 
              key={index} 
              variant="medium" 
              hover 
              depth="double"
              className="group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of professionals who are accelerating their careers 
              with SkillBridge AI.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-brand-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register">
              <GradientButton variant="primary" size="lg">
                Start Your Journey
              </GradientButton>
            </Link>
          </div>

          <div className="relative">
            <GlassmorphismCard variant="heavy" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Pro Plan</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-brand-500 fill-brand-500" />
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Everything you need to excel</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-brand-500 mr-3" />
                  <span className="text-sm">Unlimited learning paths</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-brand-500 mr-3" />
                  <span className="text-sm">AI voice coach sessions</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-brand-500 mr-3" />
                  <span className="text-sm">Real-time market insights</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-brand-500 mr-3" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>

              <GradientButton variant="primary" size="md" className="w-full">
                Get Started Free
              </GradientButton>
            </GlassmorphismCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <GlassmorphismCard variant="heavy" className="text-center py-16">
          <h2 className="text-4xl font-bold mb-4">
            Ready to <span className="gradient-text">Level Up</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the AI revolution in professional development. 
            Start learning smarter today.
          </p>
          <Link href="/auth/register">
            <GradientButton variant="primary" size="lg" className="flex items-center mx-auto">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
          </Link>
        </GlassmorphismCard>
      </section>
    </div>
  );
}
