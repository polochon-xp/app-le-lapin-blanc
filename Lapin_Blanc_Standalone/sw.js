// Service Worker Avancé pour Le Lapin Blanc - Application Mobile
const CACHE_NAME = 'lapin-blanc-mobile-v2.0.0';
const STATIC_CACHE = 'lapin-blanc-static-v2.0.0';
const DYNAMIC_CACHE = 'lapin-blanc-dynamic-v2.0.0';

// Assets essentiels à mettre en cache immédiatement
const ESSENTIAL_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png'
];

// Assets optionnels à mettre en cache progressivement
const OPTIONAL_ASSETS = [
  '/favicon.ico'
];

// Install Event - Cache des ressources essentielles
self.addEventListener('install', (event) => {
  console.log('[SW] 🚀 Installation du Service Worker Le Lapin Blanc');
  
  event.waitUntil(
    Promise.all([
      // Cache des assets essentiels
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] 📦 Mise en cache des ressources essentielles');
        return cache.addAll(ESSENTIAL_ASSETS);
      }),
      // Cache des assets optionnels (sans bloquer l'installation)
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.allSettled(
          OPTIONAL_ASSETS.map(asset => 
            cache.add(asset).catch(err => 
              console.log(`[SW] ⚠️ Asset optionnel non disponible: ${asset}`)
            )
          )
        );
      })
    ]).then(() => {
      console.log('[SW] ✅ Installation terminée avec succès');
      // Forcer l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activate Event - Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] ⚡ Activation du Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log(`[SW] 🗑️ Suppression de l'ancien cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prendre le contrôle de toutes les pages
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] ✅ Activation terminée - Application ready!');
    })
  );
});

// Fetch Event - Stratégie de cache intelligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request, url)
  );
});

async function handleFetchRequest(request, url) {
  try {
    // 1. Ressources statiques (Cache First)
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // 2. API calls (Network First avec fallback cache)
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // 3. Pages HTML (Network First avec fallback vers page principale)
    if (url.pathname === '/' || url.pathname.includes('.html') || !url.pathname.includes('.')) {
      return await htmlNetworkFirst(request);
    }
    
    // 4. Autres ressources (Cache avec mise à jour en arrière-plan)
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] ❌ Erreur lors du fetch:', error);
    return await handleFetchError(request);
  }
}

// Stratégie Cache First pour les assets statiques
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log(`[SW] 📋 Cache hit: ${request.url}`);
    return cached;
  }
  
  console.log(`[SW] 🌐 Fetch depuis réseau: ${request.url}`);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Stratégie Network First pour les API
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      console.log(`[SW] 🔄 API mis en cache: ${request.url}`);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log(`[SW] ⚠️ Network failed, trying cache: ${request.url}`);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Fallback pour les erreurs API
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'Application en mode hors ligne'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stratégie spécialisée pour les pages HTML
async function htmlNetworkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Fallback vers la page principale en cache
    const cache = await caches.open(STATIC_CACHE);
    const fallback = await cache.match('/');
    
    if (fallback) {
      console.log('[SW] 📱 Fallback vers page principale');
      return fallback;
    }
    
    return new Response('Application non disponible hors ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Mise à jour en arrière-plan
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(err => {
    console.log(`[SW] Background update failed: ${request.url}`);
  });
  
  // Retourner immédiatement le cache si disponible
  if (cached) {
    fetchPromise; // Update en arrière-plan
    return cached;
  }
  
  // Sinon attendre le réseau
  return await fetchPromise;
}

// Gestion des erreurs de fetch
async function handleFetchError(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Essayer de servir une page d'erreur en cache
  if (request.destination === 'document') {
    const fallback = await cache.match('/');
    return fallback || new Response('Application indisponible', { status: 503 });
  }
  
  return new Response('Ressource indisponible', { status: 503 });
}

// Utilitaires
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname.includes('/static/');
}

// Background Sync pour les données hors ligne
self.addEventListener('sync', (event) => {
  console.log('[SW] 🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'mission-sync') {
    event.waitUntil(syncMissions());
  } else if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress());
  }
});

async function syncMissions() {
  console.log('[SW] 📋 Synchronisation des missions...');
  // Logique de synchronisation des missions
}

async function syncProgress() {
  console.log('[SW] 📊 Synchronisation du progrès...');
  // Logique de synchronisation du progrès
}

// Push Notifications (pour futures features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle mission disponible!',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir Le Lapin Blanc',
        icon: '/pwa-icon-192.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/pwa-icon-192.png'
      }
    ],
    requireInteraction: true,
    tag: 'lapin-blanc-notification'
  };

  event.waitUntil(
    self.registration.showNotification('Le Lapin Blanc', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('[SW] 🎮 Service Worker Le Lapin Blanc chargé et prêt!');