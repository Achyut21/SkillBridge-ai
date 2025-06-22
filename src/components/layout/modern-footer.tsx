'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Github, 
  Twitter, 
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  Globe
} from 'lucide-react';
import { GradientButton } from '@/components/custom/gradient-button';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'API', href: '#api' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Careers', href: '#careers' },
    { label: 'Press', href: '#press' },
  ],
  resources: [
    { label: 'Documentation', href: '#docs' },
    { label: 'Help Center', href: '#help' },
    { label: 'Community', href: '#community' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'License', href: '#license' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/achyut21', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/achyutkatiyar2103', label: 'LinkedIn' },
  { icon: Globe, href: 'https://achyutkatiyar.com', label: 'Website' },
];

export function ModernFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-content mt-20 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="glass-light">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Stay ahead of the curve
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get weekly insights on AI-powered learning and career development
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <GradientButton type="submit" variant="primary" className="whitespace-nowrap">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">
                  SkillBridge AI
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Empowering professionals with AI-driven learning paths and real-time market insights.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:achyutkatiyar21@gmail.com" className="hover:text-purple-600 transition-colors">
                  achyutkatiyar21@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+18575766733" className="hover:text-purple-600 transition-colors">
                  +1 (857) 576-6733
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Boston, Massachusetts, USA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} SkillBridge AI by Achyut Katiyar. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-purple-600 fill-purple-600" /> for the 2025 Dream AI Hackathon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}