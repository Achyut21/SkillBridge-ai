'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Default to dark mode as per requirements
  storageKey = 'skillbridge-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
    } else if (defaultTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
    }
  }, [storageKey, defaultTheme]);

  // Update resolved theme when theme or system preference changes
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme Toggle Button Component
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'dropdown';
  className?: string;
}

export function ThemeToggle({ 
  size = 'md',
  variant = 'button',
  className = ''
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const themes = [
    { key: 'light' as const, label: 'Light', icon: Sun },
    { key: 'dark' as const, label: 'Dark', icon: Moon },
    { key: 'system' as const, label: 'System', icon: Monitor }
  ];

  const currentTheme = themes.find(t => t.key === theme) || themes[1]; // Default to dark

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${sizeClasses[size]} rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center`}
          aria-label="Toggle theme"
        >
          <currentTheme.icon className={iconSizes[size]} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.key;
                
                return (
                  <button
                    key={themeOption.key}
                    onClick={() => {
                      setTheme(themeOption.key);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      isSelected ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{themeOption.label}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    );
  }

  // Simple toggle button (cycles through themes)
  const handleToggle = () => {
    const currentIndex = themes.findIndex(t => t.key === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].key);
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${themes[(themes.findIndex(t => t.key === theme) + 1) % themes.length].label.toLowerCase()} theme`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <currentTheme.icon className={iconSizes[size]} />
      </motion.div>
    </motion.button>
  );
}

// Theme-aware component wrapper
interface ThemeAwareProps {
  children: React.ReactNode;
  lightClass?: string;
  darkClass?: string;
  className?: string;
}

export function ThemeAware({ 
  children, 
  lightClass = '', 
  darkClass = '', 
  className = '' 
}: ThemeAwareProps) {
  const { resolvedTheme } = useTheme();
  
  const themeClass = resolvedTheme === 'dark' ? darkClass : lightClass;
  
  return (
    <div className={`${className} ${themeClass}`}>
      {children}
    </div>
  );
}

// Hook for theme-aware styles
export function useThemeAwareStyle<T>(lightStyle: T, darkStyle: T): T {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkStyle : lightStyle;
}

// CSS-in-JS helper for theme-aware styles
export function createThemeStyles(styles: {
  light: Record<string, any>;
  dark: Record<string, any>;
}) {
  return {
    light: styles.light,
    dark: styles.dark
  };
}
