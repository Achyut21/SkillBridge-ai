'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Menu, 
  X,
  Home,
  BookOpen,
  Mic,
  BarChart3,
  TrendingUp,
  User,
  LogOut
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Learning', href: '/dashboard/learning-paths', icon: BookOpen },
  { title: 'AI Coach', href: '/dashboard/voice-coach', icon: Mic },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Market', href: '/dashboard/market-trends', icon: TrendingUp },
];
export function DashboardNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navbar glass-heavy">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/dashboard"
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center interactive-scale">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block gradient-text">
              SkillBridge AI
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-smooth',
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard/profile">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-smooth cursor-pointer">
                  {session?.user?.image ? (
                    <img                       src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session?.user?.name?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden lg:block">
                    {session?.user?.name || 'User'}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-smooth"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-smooth"
            >
              {isMobileMenuOpen ? (                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 pt-4 pb-4"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth',
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                      )}
                    >                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  );
                })}
                
                {/* Mobile User Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/dashboard/profile">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-smooth">
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">Profile</span>
                    </div>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-smooth text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}