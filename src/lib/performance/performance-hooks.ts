'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, throttle } from 'lodash';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`[Performance] ${componentName} render took ${renderTime}ms (render #${renderCount.current})`);
      }
    }
    
    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (label: string, fn: () => void) => {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`[Performance] ${componentName}:${label} took ${end - start}ms`);
    }
  };
}

// Debounced callback hook
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const debouncedFn = useCallback(
    debounce(callback, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn as T;
}

// Throttled callback hook
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const throttledFn = useCallback(
    throttle(callback, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);

  return throttledFn as T;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    ref: elementRef,
    entry,
    isIntersecting
  };
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
  
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index
  }));

  const handleScroll = useThrottledCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, 16); // 60fps

  return {
    visibleItems,
    totalHeight,
    startIndex,
    handleScroll,
    offsetY: startIndex * itemHeight
  };
}

// Image lazy loading hook
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isIntersecting && src && !isLoaded && !isError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setIsError(true);
      };
      
      img.src = src;
      setImageRef(img);
    }
  }, [isIntersecting, src, isLoaded, isError]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    isIntersecting
  };
}

// Memory usage monitor
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  }>({});

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return {
    ...memoryInfo,
    usedFormatted: formatBytes(memoryInfo.usedJSHeapSize),
    totalFormatted: formatBytes(memoryInfo.totalJSHeapSize),
    limitFormatted: formatBytes(memoryInfo.jsHeapSizeLimit),
    usage: memoryInfo.usedJSHeapSize && memoryInfo.jsHeapSizeLimit 
      ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100)
      : 0
  };
}

// Network status monitoring
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [downlink, setDownlink] = useState<number>(0);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnection = () => {
      const connection = (navigator as any).connection 
        || (navigator as any).mozConnection 
        || (navigator as any).webkitConnection;
        
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
        setDownlink(connection.downlink || 0);
      }
    };

    updateOnlineStatus();
    updateConnection();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
    downlink,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g',
    isFastConnection: connectionType === '4g' || downlink > 1.5
  };
}

// Component lazy loading utility
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
}

// Performance budget monitor
export function usePerformanceBudget() {
  const [metrics, setMetrics] = useState<{
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
  }>({});

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  const getBudgetStatus = () => {
    const budgets = {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1   // 0.1
    };

    const status = {
      fcp: metrics.fcp ? (metrics.fcp <= budgets.fcp ? 'good' : 'poor') : 'unknown',
      lcp: metrics.lcp ? (metrics.lcp <= budgets.lcp ? 'good' : 'poor') : 'unknown',
      fid: metrics.fid ? (metrics.fid <= budgets.fid ? 'good' : 'poor') : 'unknown',
      cls: metrics.cls ? (metrics.cls <= budgets.cls ? 'good' : 'poor') : 'unknown'
    };

    return { budgets, status };
  };

  return {
    metrics,
    ...getBudgetStatus()
  };
}
