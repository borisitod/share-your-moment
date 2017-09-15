self.addEventListener('install', function(event) {
    console.log('[Service Worker] Innstalling the Service Worker', event);
})

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating the Service Worker', event);
    return self.clients.claim();
})

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetching ...', event);
    event.respondWith(fetch(event.request));
})