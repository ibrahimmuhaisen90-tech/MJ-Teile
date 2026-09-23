const PREFIX='mj-atp-'+self.registration.scope, CACHE=PREFIX+'-4f768365dc38';
const FILES=["index.html","mobile.css","pwa.js","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;
 const relative=new URL(e.request.url).pathname.slice(new URL(self.registration.scope).pathname.length);
 const file=e.request.mode==='navigate'?'index.html':relative;
 if(!FILES.includes(file))return;
 e.respondWith(caches.open(CACHE).then(async c=>(await c.match(new URL(file,self.registration.scope).href))||fetch(e.request)));
});
