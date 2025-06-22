'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // This would typically send to an error monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(err => {
      console.error('Failed to report error:', err);
    });
  };

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  private getErrorMessage = (): string => {
    const { error } = this.state;
    
    if (!error) return 'An unexpected error occurred';
    
    // Provide user-friendly messages for common errors
    if (error.message.includes('ChunkLoadError')) {
      return 'The application failed to load. Please refresh the page.';
    }
    
    if (error.message.includes('Network Error')) {
      return 'Network connection problem. Please check your internet connection.';
    }
    
    if (error.message.includes('Permission denied')) {
      return 'Access denied. Please check your permissions or try logging in again.';
    }
    
    return error.message || 'Something went wrong';
  };

  private getErrorSuggestions = (): string[] => {
    const { error, retryCount } = this.state;
    const suggestions = [];
    
    if (error?.message.includes('ChunkLoadError')) {
      suggestions.push('Refresh the page to reload the application');
      suggestions.push('Clear your browser cache and try again');
    } else if (error?.message.includes('Network')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Try again in a few moments');
    } else if (retryCount > 2) {
      suggestions.push('The error persists after multiple attempts');
      suggestions.push('Try restarting the application');
      suggestions.push('Contact support if the problem continues');
    } else {
      suggestions.push('Try the action again');
      suggestions.push('Refresh the page if the problem persists');
    }
    
    return suggestions;
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.getErrorMessage();
      const suggestions = this.getErrorSuggestions();

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
          {/* Neural network background effect */}
          <div className="fixed inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/images/neural-pattern.svg')] opacity-30" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-2xl w-full"
          >
            <GlassmorphismCard className="p-8 text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-10 h-10 text-white" />
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-white mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  {errorMessage}
                </p>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Try These Solutions:
                </h3>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
              >
                <GradientButton
                  onClick={this.handleRetry}
                  size="lg"
                  className="min-w-[140px]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </GradientButton>
                
                <GradientButton
                  onClick={this.handleGoHome}
                  variant="secondary"
                  size="lg"
                  className="min-w-[140px]"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </GradientButton>
              </motion.div>

              {/* Error Details Toggle */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && (
                <>
                  <button
                    onClick={this.toggleDetails}
                    className="flex items-center gap-2 mx-auto text-sm text-gray-400 hover:text-gray-300 transition-colors mb-4"
                  >
                    <Bug className="w-4 h-4" />
                    <span>Technical Details</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        this.state.showDetails ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Error Details */}
                  {this.state.showDetails && this.state.error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-left"
                    >
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-red-400 mb-1">
                          Error Message:
                        </h4>
                        <code className="text-xs text-gray-300 block whitespace-pre-wrap">
                          {this.state.error.message}
                        </code>
                      </div>
                      
                      {this.state.error.stack && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-red-400 mb-1">
                            Stack Trace:
                          </h4>
                          <code className="text-xs text-gray-400 block whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {this.state.error.stack}
                          </code>
                        </div>
                      )}
                      
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-400 mb-1">
                            Component Stack:
                          </h4>
                          <code className="text-xs text-gray-400 block whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}

              {/* Retry Count */}
              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-500 mt-4">
                  Retry attempts: {this.state.retryCount}
                </p>
              )}
            </GlassmorphismCard>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
