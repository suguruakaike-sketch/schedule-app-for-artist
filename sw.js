const CACHE = 'schedule-app-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/schedule-app-for-artist/', '/schedule-app-for-artist/index.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Gmail API・Anthropic API・OpenAI APIはキャッシュしない
  if (e.request.url.includes('googleapis.com') ||
      e.request.url.includes('anthropic.com') ||
      e.request.url.includes('openai.com') ||
      e.request.url.includes('accounts.google.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
