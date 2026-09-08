self.addEventListener('install', event => event.waitUntil(caches.open('mj-teile-v1').then(c => c.addAll(['./','./index.html','./manifest.json','./icon.svg']))));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(r => r || fetch(event.request))));
