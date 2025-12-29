// sw.js - Simple Service Worker for offline capability & fast loading

const CACHE_NAME = 'alchemist-v1.2';
const ASSETS_TO_CACHE = [
  './',                     // Main HTML file (assuming index.html or whatever your file name is)
  './manifest.json',
  // Add your main HTML file name if it's not index.html
  // e.g., './workout.html',
  'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb20AAABtb292AAAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Always try network first for navigation requests
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
