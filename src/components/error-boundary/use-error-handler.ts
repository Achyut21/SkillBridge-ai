'use client';

import { useCallback, useState } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
}

interface UseErrorHandlerOptions {
  onError?: (error: ErrorInfo) => void;
  reportToService?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reportError = useCallback(async (errorInfo: ErrorInfo) => {
    if (options.reportToService && process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo)
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    }
  }, [options.reportToService]);

  const handleError = useCallback((error: Error | string, context?: Record<string, any>) => {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: Date.now(),
      context
    };

    // Add to local errors array
    setErrors(prev => [...prev.slice(-9), errorInfo]); // Keep last 10 errors

    // Call custom error handler
    if (options.onError) {
      options.onError(errorInfo);
    }

    // Report error
    reportError(errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorInfo);
    }
  }, [options.onError, reportError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const withErrorBoundary = useCallback(<T extends any[]>(
    fn: (...args: T) => void,
    context?: Record<string, any>
  ) => {
    return (...args: T) => {
      try {
        return fn(...args);
      } catch (error) {
        handleError(error as Error, context);
      }
    };
  }, [handleError]);

  return {
    errors,
    isLoading,
    handleError,
    handleAsyncError,
    clearErrors,
    withErrorBoundary
  };
}

// React Query error handler
export function useQueryErrorHandler() {
  const { handleError } = useErrorHandler({ reportToService: true });

  return useCallback((error: unknown) => {
    if (error instanceof Error) {
      handleError(error, { source: 'react-query' });
    } else {
      handleError('Unknown query error', { error, source: 'react-query' });
    }
  }, [handleError]);
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Report to error service
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Unhandled promise rejection',
          stack: event.reason?.stack,
          timestamp: Date.now(),
          context: { reason: event.reason }
        })
      }).catch(console.error);
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      
      // Report to error service
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          stack: event.error?.stack,
          timestamp: Date.now(),
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        })
      }).catch(console.error);
    });
  }
}
