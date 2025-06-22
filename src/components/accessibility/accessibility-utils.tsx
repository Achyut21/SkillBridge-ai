'use client';

import React, { useEffect, useRef, useState } from 'react';

// Focus management utilities
export function useFocusManagement() {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const getFocusableElements = (container: Element): HTMLElement[] => {
    return Array.from(container.querySelectorAll(focusableSelectors));
  };

  const trapFocus = (container: Element, firstElement?: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    const firstFocusable = firstElement || focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  };

  const restoreFocus = (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  };

  return {
    getFocusableElements,
    trapFocus,
    restoreFocus
  };
}

// Screen reader announcements
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Create temporary element for screen reader
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const announceNavigation = (pageName: string) => {
    announce(`Navigated to ${pageName}`, 'polite');
  };

  const announceAction = (action: string) => {
    announce(action, 'assertive');
  };

  return {
    announce,
    announceNavigation,
    announceAction,
    announcements
  };
}

// Skip links component
export function SkipLinks() {
  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#search', text: 'Skip to search' }
  ];

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded focus:shadow-lg"
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}

// Live region for dynamic content updates
export function LiveRegion({ 
  children, 
  level = 'polite' 
}: { 
  children: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
}) {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function AccessibleButton({
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  className = '',
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-describedby={loading ? 'loading-description' : undefined}
      className={`${className} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
    >
      {loading ? loadingText : children}
      {loading && (
        <span id="loading-description" className="sr-only">
          Please wait, {loadingText.toLowerCase()}
        </span>
      )}
    </button>
  );
}

// High contrast mode detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Focus visible utility
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocusVisible(true);
    const handleBlur = () => setIsFocusVisible(false);
    const handleMouseDown = () => setIsFocusVisible(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { ref, isFocusVisible };
}

// ARIA utilities
export function generateId(prefix: string = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useAriaDescribedBy(description: string) {
  const [id] = useState(() => generateId('description'));
  
  return {
    'aria-describedby': id,
    descriptionId: id,
    descriptionText: description
  };
}

// Accessible form field
interface AccessibleFieldProps {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactElement;
}

export function AccessibleField({
  label,
  error,
  help,
  required = false,
  children
}: AccessibleFieldProps) {
  const fieldId = generateId('field');
  const errorId = generateId('error');
  const helpId = generateId('help');

  const describedBy = [
    help && helpId,
    error && errorId
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span aria-label="required" className="text-red-500 ml-1">*</span>
        )}
      </label>
      
      {React.cloneElement(children, {
        id: fieldId,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : 'false',
        required
      })}
      
      {help && (
        <p id={helpId} className="text-sm text-gray-600 dark:text-gray-400">
          {help}
        </p>
      )}
      
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Color contrast utilities
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    // In a real implementation, you'd parse the color properly
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;
    
    const [r, g, b] = rgb.map(n => {
      const sRGB = parseInt(n) / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function meetsWCAGStandard(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
}
