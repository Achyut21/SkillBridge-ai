// SkillBridge AI Service Worker - PWA Support
const CACHE_NAME = 'skillbridge-ai-v1.0.0';
const STATIC_CACHE = 'skillbridge-static-v1';
const DYNAMIC_CACHE = 'skillbridge-dynamic-v1';

// Cache essential files for offline functionality
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/learning-paths',
  '/dashboard/voice-coach',
  '/auth/login',
  '/_next/static/css/app/globals.css',
  '/manifest.json'
];

// Cache API responses temporarily
const API_CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install event');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate event');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for our APIs)
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Strategy 1: Static assets - Cache First
        if (isStaticAsset(request)) {
          return await cacheFirst(request, STATIC_CACHE);
        }
        
        // Strategy 2: API requests - Network First with cache fallback
        if (isAPIRequest(request)) {
          return await networkFirstWithCache(request, DYNAMIC_CACHE);
        }
        
        // Strategy 3: Navigation requests - Network First with offline fallback
        if (isNavigationRequest(request)) {
          return await navigationHandler(request);
        }
        
        // Strategy 4: Other resources - Stale While Revalidate
        return await staleWhileRevalidate(request, DYNAMIC_CACHE);
        
      } catch (error) {
        console.error('[ServiceWorker] Fetch error:', error);
        return await getOfflineFallback(request);
      }
    })()
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push event received');
  
  const options = {
    body: event.data?.text() || 'Time for your daily learning session!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Start Learning',
        icon: '/icons/play-24x24.png'
      },
      {
        action: 'dismiss',
        title: 'Later',
        icon: '/icons/close-24x24.png'
      }
    ],
    requireInteraction: true,
    tag: 'skillbridge-reminder'
  };
  
  event.waitUntil(
    self.registration.showNotification('SkillBridge AI', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgressData());
  }
});

// Helper functions for caching strategies
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', error);
    
    const cached = await cache.match(request);
    if (cached) {
      // Add a header to indicate this is cached data
      const response = cached.clone();
      response.headers.set('x-served-by', 'sw-cache');
      return response;
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const networkResponse = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || networkResponse;
}

async function navigationHandler(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match('/');
    return offline || new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function getOfflineFallback(request) {
  if (isNavigationRequest(request)) {
    const cache = await caches.open(STATIC_CACHE);
    return await cache.match('/') || new Response('Offline');
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

async function syncProgressData() {
  try {
    // Get any pending progress data from IndexedDB
    const pendingData = await getStoredProgressData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        await fetch('/api/learning/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      
      // Clear synced data
      await clearStoredProgressData();
      console.log('[ServiceWorker] Progress data synced successfully');
    }
  } catch (error) {
    console.error('[ServiceWorker] Progress sync failed:', error);
  }
}

// Helper functions for request classification
function isStaticAsset(request) {
  return request.url.includes('/_next/static/') || 
         request.url.includes('/icons/') ||
         request.url.includes('/images/') ||
         request.url.includes('.css') ||
         request.url.includes('.js');
}

function isAPIRequest(request) {
  return request.url.includes('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// IndexedDB helpers for offline storage
async function getStoredProgressData() {
  // Implementation would use IndexedDB to retrieve pending data
  return [];
}

async function clearStoredProgressData() {
  // Implementation would clear synced data from IndexedDB
  return true;
}

console.log('[ServiceWorker] Service worker script loaded');
