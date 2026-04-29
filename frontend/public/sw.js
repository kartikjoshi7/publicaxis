const CACHE_NAME = 'publicaxis-v1';
const OFFLINE_URL = '/';

const OFFLINE_FAQ_DATA = {
  "response": "## 📴 Offline Mode - Basic Voting FAQ\n\nYou are currently offline, but here are some quick answers to common polling station emergencies:\n\n1. **Can I vote without an Epic card?**\nYes. You can use 12 other IDs like Aadhaar, PAN Card, or Driving License if your name is on the electoral roll.\n\n2. **My name is not on the voter list at the booth?**\nYou cannot vote if your name is not on the roll, even if you have an ID.\n\n3. **Is my polling booth wheelchair accessible?**\nYes, by law all booths must have ramps and wheelchairs available."
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/chat')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify(OFFLINE_FAQ_DATA), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
