'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';

interface PageErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export function PageErrorBoundary({ error, reset }: PageErrorBoundaryProps) {
  const getErrorMessage = () => {
    if (error.message.includes('NEXT_NOT_FOUND')) {
      return 'Page not found';
    }
    
    if (error.message.includes('Network')) {
      return 'Network connection error';
    }
    
    return 'Something went wrong on this page';
  };

  const getErrorDescription = () => {
    if (error.message.includes('NEXT_NOT_FOUND')) {
      return 'The page you\'re looking for doesn\'t exist or has been moved.';
    }
    
    if (error.message.includes('Network')) {
      return 'Please check your internet connection and try again.';
    }
    
    return 'An unexpected error occurred while loading this page.';
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full"
      >
        <GlassmorphismCard className="p-8 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
          >
            <AlertCircle className="w-8 h-8 text-white" />
          </motion.div>

          {/* Error Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {getErrorMessage()}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getErrorDescription()}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <GradientButton
              onClick={reset}
              size="md"
              className="min-w-[120px]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </GradientButton>
            
            <GradientButton
              onClick={() => window.location.href = '/dashboard'}
              variant="secondary"
              size="md"
              className="min-w-[120px]"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </GradientButton>
          </motion.div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left"
            >
              <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                Development Error:
              </h4>
              <code className="text-xs text-gray-700 dark:text-gray-300 block whitespace-pre-wrap">
                {error.message}
              </code>
            </motion.div>
          )}
        </GlassmorphismCard>
      </motion.div>
    </div>
  );
}
