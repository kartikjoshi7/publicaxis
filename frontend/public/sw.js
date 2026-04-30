const CACHE_NAME = 'publicaxis-v1';
const OFFLINE_URL = '/';

const OFFLINE_FAQ_DATA = {
  "response": "## 📴 Offline Mode - Election Process Guide\n\nYou are currently offline, but here is a step-by-step guide to the election process:\n\n### 🗳️ Step-by-Step: How to Register as a Voter\n1. **Check Eligibility** — You must be 18+ and an Indian citizen.\n2. **Gather Documents** — Aadhaar, proof of address, passport photo.\n3. **Fill Form 6** — Online at voters.eci.gov.in or at your nearest ERO office.\n4. **Submit Application** — Upload documents online or submit offline. Processing takes 21-45 days.\n5. **Verification** — A Booth Level Officer (BLO) will visit your address.\n6. **Receive EPIC Card** — Your Voter ID is dispatched or download e-EPIC digitally.\n\n### 📅 Election Day Timeline\n- **7:00 AM** — Polling stations open\n- Carry your EPIC card or any of 12 approved alternative IDs (Aadhaar, PAN, Driving License, etc.)\n- Cast your vote on the EVM and verify on VVPAT\n- **6:00 PM** — Polling closes (voters in queue are allowed to vote)\n\n### ❓ Quick FAQs\n- **Can I vote without an EPIC card?** Yes — use Aadhaar, PAN, Passport, or any of 12 approved IDs.\n- **My name is not on the voter list?** You cannot vote. Apply via Form 6 before the next election.\n- **Is my booth wheelchair accessible?** By law, all booths must have ramps and wheelchairs available."
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
