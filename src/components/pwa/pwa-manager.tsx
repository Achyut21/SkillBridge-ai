'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Download, X, Wifi, WifiOff } from 'lucide-react';
import { GradientButton } from '@/components/custom/gradient-button';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';

interface PWAManagerProps {
  enableNotifications?: boolean;
  showInstallPrompt?: boolean;
}

export function PWAManager({ 
  enableNotifications = true, 
  showInstallPrompt = true 
}: PWAManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    initializePWA();
    setupEventListeners();

    return () => {
      cleanupEventListeners();
    };
  }, []);

  const initializePWA = async () => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setSwRegistration(registration);
        
        console.log('[PWA] Service Worker registered successfully');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('[PWA] Service Worker update found');
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update available notification
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  };

  const setupEventListeners = () => {
    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (showInstallPrompt && !isInstalled) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('[PWA] App was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
  };

  const cleanupEventListeners = () => {
    window.removeEventListener('online', () => setIsOnline(true));
    window.removeEventListener('offline', () => setIsOnline(false));
    window.removeEventListener('beforeinstallprompt', () => {});
    window.removeEventListener('appinstalled', () => {});
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setShowInstallBanner(false);
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('[PWA] This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      
      if (permission === 'granted' && swRegistration) {
        // Subscribe to push notifications
        const subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });
        
        console.log('[PWA] Push notification subscription successful');
      }
    } catch (error) {
      console.error('[PWA] Notification permission request failed:', error);
    }
  };

  const showUpdateNotification = () => {
    if (notificationStatus === 'granted') {
      new Notification('SkillBridge AI Update Available', {
        body: 'A new version of the app is available. Refresh to update.',
        icon: '/icons/icon-192x192.png',
        tag: 'update-available'
      });
    }
  };

  const scheduleNotification = (title: string, body: string, delay: number) => {
    if (swRegistration && notificationStatus === 'granted') {
      setTimeout(() => {
        swRegistration.showNotification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          vibrate: [200, 100, 200],
          tag: 'learning-reminder'
        });
      }, delay);
    }
  };

  return (
    <>
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <GlassmorphismCard className="px-4 py-2 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline Mode</span>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <GlassmorphismCard className="p-4 bg-purple-500/10 border-purple-500/20">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-100 mb-1">
                    Install SkillBridge AI
                  </h4>
                  <p className="text-sm text-purple-200 mb-3">
                    Install the app for a better experience and offline access.
                  </p>
                  <div className="flex gap-2">
                    <GradientButton
                      onClick={handleInstallApp}
                      size="sm"
                      className="flex-1"
                    >
                      Install
                    </GradientButton>
                    <button
                      onClick={() => setShowInstallBanner(false)}
                      className="px-3 py-1 text-purple-300 hover:text-purple-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Permission Banner */}
      <AnimatePresence>
        {enableNotifications && notificationStatus === 'default' && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-24 right-4 z-50 max-w-sm"
          >
            <GlassmorphismCard className="p-4 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-100 mb-1">
                    Enable Notifications
                  </h4>
                  <p className="text-sm text-blue-200 mb-3">
                    Get reminded about your learning goals and achievements.
                  </p>
                  <div className="flex gap-2">
                    <GradientButton
                      onClick={requestNotificationPermission}
                      size="sm"
                      variant="secondary"
                    >
                      Enable
                    </GradientButton>
                    <button
                      onClick={() => setNotificationStatus('denied')}
                      className="px-3 py-1 text-blue-300 hover:text-blue-100 transition-colors text-sm"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for using PWA functionality
export function usePWA() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Check if installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scheduleNotification = (title: string, body: string, delay: number = 0) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        setTimeout(() => {
          registration.showNotification(title, {
            body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [200, 100, 200],
            tag: 'learning-reminder'
          });
        }, delay);
      });
    }
  };

  const syncInBackground = async (data: any) => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      
      // Store data for background sync
      // This would typically use IndexedDB
      console.log('[PWA] Scheduling background sync:', data);
      
      return registration.sync.register('progress-sync');
    }
  };

  return {
    isOnline,
    isInstalled,
    scheduleNotification,
    syncInBackground
  };
}
