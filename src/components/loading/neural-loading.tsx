'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NeuralLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speed?: 'slow' | 'normal' | 'fast';
  showText?: boolean;
  text?: string;
  className?: string;
}

export function NeuralLoadingSpinner({ 
  size = 'md',
  speed = 'normal',
  showText = false,
  text = 'Loading...',
  className = ''
}: NeuralLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const speeds = {
    slow: 2,
    normal: 1.5,
    fast: 1
  };

  const duration = speeds[speed];

  // Neural network node positions
  const nodes = [
    { x: 50, y: 20, delay: 0 },
    { x: 20, y: 50, delay: 0.2 },
    { x: 80, y: 50, delay: 0.4 },
    { x: 35, y: 80, delay: 0.6 },
    { x: 65, y: 80, delay: 0.8 },
    { x: 50, y: 50, delay: 1 }
  ];

  // Connection lines between nodes
  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 1, to: 5 },
    { from: 2, to: 5 },
    { from: 3, to: 4 },
    { from: 5, to: 3 },
    { from: 5, to: 4 }
  ];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Neural Network Animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="overflow-visible"
        >
          {/* Connection Lines */}
          {connections.map((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            
            return (
              <motion.line
                key={`connection-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                opacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: duration * 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Neural Nodes */}
          {nodes.map((node, index) => (
            <motion.circle
              key={`node-${index}`}
              cx={node.x}
              cy={node.y}
              r="3"
              fill="url(#nodeGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Rotating Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #8b5cf6, transparent)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: duration * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Loading Text */}
      {showText && (
        <motion.p
          className={`text-purple-400 font-medium ${textSizes[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Pulse Loading Animation
export function PulseLoader({ 
  size = 'md',
  className = ''
}: Pick<NeuralLoadingSpinnerProps, 'size' | 'className'>) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`bg-purple-500 rounded-full ${sizeClasses[size]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Skeleton Loading Components
export function SkeletonLoader({ 
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = ''
}: {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse";
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Card Skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4 p-6">
        <div className="flex items-center space-x-4">
          <SkeletonLoader variant="circular" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <SkeletonLoader width="60%" height="1rem" />
            <SkeletonLoader width="40%" height="0.875rem" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonLoader width="100%" height="0.75rem" />
          <SkeletonLoader width="80%" height="0.75rem" />
          <SkeletonLoader width="60%" height="0.75rem" />
        </div>
        <div className="flex space-x-2">
          <SkeletonLoader width={80} height="2rem" className="rounded-full" />
          <SkeletonLoader width={80} height="2rem" className="rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Loading Overlay
export function LoadingOverlay({ 
  show,
  message = 'Loading...',
  size = 'lg'
}: {
  show: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col items-center"
      >
        <NeuralLoadingSpinner size={size} showText text={message} />
      </motion.div>
    </motion.div>
  );
}
