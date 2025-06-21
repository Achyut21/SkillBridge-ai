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
import { GradientButton } from '@/components/custom/gradient-button';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navbarVariants = {
    hidden: { 
      y: -100,
      opacity: 0 
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.5,
        duration: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <>
      {/* Navbar Container - Fixed positioning wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <AnimatePresence>
          {isVisible && (
            <motion.header
              variants={navbarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn(
                'pointer-events-auto mx-auto mt-4 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300 rounded-2xl',
                isScrolled 
                  ? 'bg-white/80 dark:bg-brand-900/20 backdrop-blur-md border border-gray-200 dark:border-brand-500/20 shadow-lg dark:shadow-[0_8px_32px_rgba(168,85,247,0.08)]' 
                  : 'bg-white/60 dark:bg-brand-900/10 backdrop-blur-sm border border-gray-100 dark:border-brand-500/10'
              )}
            >
              <div className="px-4 md:px-6 py-3">
                <div className="flex items-center justify-between relative">
                  {/* Logo */}
                  <Link 
                    href="/dashboard"
                    className="flex items-center space-x-2 group flex-shrink-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-bold text-xl hidden sm:block gradient-text"
                    >
                      SkillBridge AI
                    </motion.span>
                  </Link>

                  {/* Desktop Navigation - Centered */}
                  <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navItems.map((item, i) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                              isActive
                                ? 'text-white dark:text-white bg-brand-600 dark:bg-brand-600/20 shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                                : 'text-gray-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Right Section */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* User Menu - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                      <Link href="/dashboard/profile">
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6, type: 'spring' }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors cursor-pointer"
                        >
                          {session?.user?.image ? (
                            <img 
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              className="w-8 h-8 rounded-lg border border-brand-500/30"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {session?.user?.name?.[0] || 'U'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium hidden lg:block">
                            {session?.user?.name || 'User'}
                          </span>
                        </motion.div>
                      </Link>

                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: 'spring' }}
                      >
                        <GradientButton
                          variant="ghost"
                          size="sm"
                          onClick={handleSignOut}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/10"
                        >
                          <LogOut className="h-4 w-4" />
                        </GradientButton>
                      </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-brand-900/20 border border-gray-200 dark:border-brand-500/20"
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5 text-gray-600 dark:text-brand-400" />
                      ) : (
                        <Menu className="h-5 w-5 text-gray-600 dark:text-brand-400" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="md:hidden mt-4 border-t border-brand-500/20 pt-4"
                    >
                      <nav className="flex flex-col gap-2">
                        {navItems.map((item, i) => {
                          const isActive = pathname === item.href;
                          return (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                            >
                              <Link
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                  isActive
                                    ? 'text-white bg-brand-600'
                                    : 'text-gray-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                              </Link>
                            </motion.div>
                          );
                        })}
                        
                        {/* Mobile User Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-brand-500/20">
                          <Link href="/dashboard/profile">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                              <User className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">Profile</span>
                            </div>
                          </Link>
                          
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600 dark:text-red-400"
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
            </motion.header>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
