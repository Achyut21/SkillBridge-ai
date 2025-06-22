'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Info, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface SmartTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  offset?: number;
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
  maxWidth?: number;
  interactive?: boolean;
  disabled?: boolean;
}

export function SmartTooltip({
  content,
  children,
  position = 'auto',
  trigger = 'hover',
  delay = 200,
  offset = 8,
  variant = 'default',
  maxWidth = 300,
  interactive = false,
  disabled = false
}: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [finalPosition, setFinalPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!interactive || !isMouseOverTooltip()) {
      setIsVisible(false);
    }
  };

  const isMouseOverTooltip = () => {
    return tooltipRef.current?.matches(':hover') || false;
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let pos = position;
    let x = 0;
    let y = 0;

    // Auto-position logic
    if (position === 'auto') {
      const spaceTop = triggerRect.top;
      const spaceBottom = viewportHeight - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = viewportWidth - triggerRect.right;
      
      const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
      
      if (maxSpace === spaceTop) pos = 'top';
      else if (maxSpace === spaceBottom) pos = 'bottom';
      else if (maxSpace === spaceLeft) pos = 'left';
      else pos = 'right';
    }

    // Calculate position
    switch (pos) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - offset;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
    if (pos !== 'auto') {
      setFinalPosition(pos as 'top' | 'bottom' | 'left' | 'right');
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  const handleTriggerEvents = () => {
    const events: any = {};
    
    if (trigger === 'hover') {
      events.onMouseEnter = showTooltip;
      events.onMouseLeave = hideTooltip;
    } else if (trigger === 'click') {
      events.onClick = () => setIsVisible(!isVisible);
    } else if (trigger === 'focus') {
      events.onFocus = showTooltip;
      events.onBlur = hideTooltip;
    }
    
    return events;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'info':
        return 'bg-blue-900/90 text-blue-100 border-blue-700';
      case 'warning':
        return 'bg-amber-900/90 text-amber-100 border-amber-700';
      case 'success':
        return 'bg-green-900/90 text-green-100 border-green-700';
      case 'error':
        return 'bg-red-900/90 text-red-100 border-red-700';
      default:
        return 'bg-gray-900/90 text-gray-100 border-gray-700';
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'info':
        return <Info className="w-3 h-3" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />;
      case 'success':
        return <CheckCircle className="w-3 h-3" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <HelpCircle className="w-3 h-3" />;
    }
  };

  const getArrowPosition = () => {
    switch (finalPosition) {
      case 'top':
        return 'left-1/2 -translate-x-1/2 top-full border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'left-1/2 -translate-x-1/2 bottom-full border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'top-1/2 -translate-y-1/2 left-full border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'top-1/2 -translate-y-1/2 right-full border-t-transparent border-b-transparent border-l-transparent';
    }
  };

  const getTransformOrigin = () => {
    switch (finalPosition) {
      case 'top': return 'bottom center';
      case 'bottom': return 'top center';
      case 'left': return 'right center';
      case 'right': return 'left center';
      default: return 'center';
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg border backdrop-blur-sm ${getVariantStyles()}`}
          style={{
            left: finalPosition === 'left' || finalPosition === 'right' 
              ? finalPosition === 'left' ? tooltipPosition.x - maxWidth : tooltipPosition.x
              : tooltipPosition.x - maxWidth / 2,
            top: finalPosition === 'top' ? tooltipPosition.y - 0 : 
                 finalPosition === 'bottom' ? tooltipPosition.y : 
                 tooltipPosition.y - 16,
            maxWidth,
            transformOrigin: getTransformOrigin()
          }}
          onMouseEnter={() => interactive && setIsVisible(true)}
          onMouseLeave={() => interactive && hideTooltip()}
        >
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowPosition()}`}
            style={{
              borderColor: variant === 'default' ? '#374151' :
                          variant === 'info' ? '#1e40af' :
                          variant === 'warning' ? '#d97706' :
                          variant === 'success' ? '#059669' :
                          variant === 'error' ? '#dc2626' : '#374151'
            }}
          />
          
          {/* Content */}
          <div className="flex items-start gap-2">
            {variant !== 'default' && (
              <div className="flex-shrink-0 mt-0.5">
                {getVariantIcon()}
              </div>
            )}
            <div className="min-w-0">
              {content}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        {...handleTriggerEvents()}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
}

// Micro-interaction components
export function MicroButton({ 
  children, 
  onClick,
  variant = 'default',
  className = '',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'success' | 'danger';
}) {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <motion.button
      className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
    >
      <motion.span
        initial={false}
        animate={{
          scale: isPressed ? 0.95 : 1
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

// Floating Action Button with tooltip
export function FloatingActionButton({
  icon,
  tooltip,
  onClick,
  className = '',
  position = 'bottom-right'
}: {
  icon: React.ReactNode;
  tooltip?: string;
  onClick: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const fab = (
    <motion.button
      className={`fixed ${positionClasses[position]} z-40 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5
      }}
    >
      <motion.div
        whileHover={{ rotate: 15 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );

  if (tooltip) {
    return (
      <SmartTooltip content={tooltip} position="left">
        {fab}
      </SmartTooltip>
    );
  }

  return fab;
}

// Animated Counter
export function AnimatedCounter({
  value,
  duration = 1000,
  className = ''
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(Math.round(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      key={value}
      initial={{ scale: 1.2, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

// Progress Ring
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = ''
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="text-purple-600"
          style={{
            strokeDasharray,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatedCounter 
          value={Math.round(progress)} 
          className="text-2xl font-bold text-gray-900 dark:text-white"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">%</span>
      </div>
    </div>
  );
}
