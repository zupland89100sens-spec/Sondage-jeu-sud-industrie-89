const CACHE_NAME = 'sud-industrie-v2'; // J'ai mis v2 pour forcer la mise à jour
const ASSETS = [
  './',
  './index.html',
  './logo.jpg',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Installation : on met tout en cache
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force le nouveau SW à prendre le contrôle
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mise en cache des fichiers...');
      return cache.addAll(ASSETS);
    })
  );
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si le fichier est dans le cache, on le renvoie. Sinon on va sur internet.
      return response || fetch(e.request);
    }).catch(() => {
      // Si pas de réseau et pas en cache, on ne fait rien (évite le crash)
    })
  );
});
