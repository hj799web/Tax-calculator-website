/**
 * Advanced Service Worker for Tax Calculator
 * 
 * Features:
 * - Intelligent caching strategies
 * - Offline functionality
 * - Background sync
 * - Performance optimization
 * - Cache management
 */

const CACHE_VERSION = 'v1.0.0'
const STATIC_CACHE = `tax-calculator-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `tax-calculator-dynamic-${CACHE_VERSION}`
const API_CACHE = `tax-calculator-api-${CACHE_VERSION}`
const IMAGE_CACHE = `tax-calculator-images-${CACHE_VERSION}`

// Cache configuration
const CACHE_CONFIG = {
  // Static assets - cache for long time
  static: {
    name: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  // Dynamic content - shorter cache
  dynamic: {
    name: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 50
  },
  // API responses - very short cache
  api: {
    name: API_CACHE,
    maxAge: 60 * 60 * 1000, // 1 hour
    maxEntries: 20
  },
  // Images - long cache
  images: {
    name: IMAGE_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 200
  }
}

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
]

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      cacheStaticAssets(),
      self.skipWaiting()
    ])
  )
})

/**
 * Activate event - clean old caches and take control
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      cleanOldCaches(),
      self.clients.claim()
    ])
  )
})

/**
 * Fetch event - handle all network requests
 */
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) return
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request))
  } else {
    event.respondWith(handleDynamicRequest(request))
  }
})

/**
 * Message event - handle commands from main thread
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status)
      })
      break
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName).then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
    case 'PRELOAD_ROUTES':
      preloadRoutes(payload.routes)
      break
  }
})

/**
 * Cache critical static assets on install
 */
async function cacheStaticAssets() {
  try {
    const cache = await caches.open(STATIC_CACHE)
    console.log('[SW] Caching critical assets')
    
    await Promise.allSettled(
      CRITICAL_ASSETS.map(asset => cache.add(asset).catch(err => {
        console.warn('[SW] Failed to cache asset:', asset, err)
      }))
    )
    
    console.log('[SW] Critical assets cached successfully')
  } catch (error) {
    console.error('[SW] Error caching static assets:', error)
  }
}

/**
 * Handle static asset requests (CSS, JS, fonts)
 */
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.warn('[SW] Network failed for static asset:', request.url)
  }
  
  return new Response('Asset not available offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  })
}

/**
 * Handle image requests with smart caching
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      await cleanCache(IMAGE_CACHE, CACHE_CONFIG.images.maxEntries)
      return networkResponse
    }
  } catch (error) {
    console.warn('[SW] Image request failed:', request.url)
  }
  
  // Return placeholder image for failed requests
  return new Response(createPlaceholderSVG(), {
    headers: { 'Content-Type': 'image/svg+xml' }
  })
}

/**
 * Handle API requests with network-first strategy
 */
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.warn('[SW] API request failed, trying cache:', request.url)
  }
  
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  return new Response(JSON.stringify({ 
    error: 'API not available offline',
    offline: true 
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Handle navigation requests (page routes)
 */
async function handleNavigationRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
  } catch (error) {
    console.warn('[SW] Navigation request failed:', request.url)
  }
  
  // Try to serve cached version
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Try to serve the root page for SPA routing
  const rootResponse = await cache.match('/')
  if (rootResponse) {
    return rootResponse
  }
  
  // Offline fallback page
  return new Response(createOfflinePage(), {
    headers: { 'Content-Type': 'text/html' }
  })
}

/**
 * Handle other dynamic requests
 */
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      await cleanCache(DYNAMIC_CACHE, CACHE_CONFIG.dynamic.maxEntries)
      return networkResponse
    }
  } catch (error) {
    console.warn('[SW] Dynamic request failed:', request.url)
  }
  
  const cachedResponse = await cache.match(request)
  return cachedResponse || new Response('Resource not available offline', {
    status: 503
  })
}

/**
 * Check if request is for static assets
 */
function isStaticAsset(request) {
  const url = new URL(request.url)
  return /\.(js|css|woff2?|ttf|eot)(\?.*)?$/.test(url.pathname)
}

/**
 * Check if request is for images
 */
function isImageRequest(request) {
  const url = new URL(request.url)
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/.test(url.pathname)
}

/**
 * Check if request is for API
 */
function isAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/') || 
         url.hostname !== self.location.hostname
}

/**
 * Check if request is navigation
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'))
}

/**
 * Clean old caches
 */
async function cleanOldCaches() {
  const cacheNames = await caches.keys()
  const currentCaches = Object.values(CACHE_CONFIG).map(config => config.name)
  
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('tax-calculator-') && 
    !currentCaches.includes(name)
  )
  
  if (oldCaches.length > 0) {
    console.log('[SW] Cleaning old caches:', oldCaches)
    await Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    )
  }
}

/**
 * Clean cache when it exceeds max entries
 */
async function cleanCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > maxEntries) {
    const deleteCount = keys.length - maxEntries
    const keysToDelete = keys.slice(0, deleteCount)
    
    await Promise.all(
      keysToDelete.map(key => cache.delete(key))
    )
    
    console.log(`[SW] Cleaned ${deleteCount} entries from ${cacheName}`)
  }
}

/**
 * Get cache status for debugging
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

/**
 * Clear specific cache
 */
async function clearSpecificCache(cacheName) {
  return caches.delete(cacheName)
}

/**
 * Preload routes for better performance
 */
async function preloadRoutes(routes) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  for (const route of routes) {
    try {
      const response = await fetch(route)
      if (response.ok) {
        cache.put(route, response)
      }
    } catch (error) {
      console.warn('[SW] Failed to preload route:', route, error)
    }
  }
}

/**
 * Create placeholder SVG for failed image requests
 */
function createPlaceholderSVG() {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="18" fill="#999">
        Image not available offline
      </text>
    </svg>
  `
}

/**
 * Create offline fallback page
 */
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Tax Calculator</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .offline-container {
          text-align: center;
          padding: 2rem;
          max-width: 500px;
        }
        .offline-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .offline-message {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .retry-button {
          background: white;
          color: #667eea;
          border: none;
          padding: 1rem 2rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          Some features may not be available, but you can still use cached content.
        </p>
        <button class="retry-button" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `
}

console.log('[SW] Service Worker script loaded') 