const C='role-v8';const F=['./','index.html','app.js?v=7','garage.js?v=7','community.js?v=7','buildings.js?v=7','cars.js?v=7','part4.js?v=8','app.css?v=3','maplibre-gl.js','maplibre-gl.css','p-front.webp','p-rear.webp','p-front-ai.webp','icon-192.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F).catch(()=>{})));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));});
