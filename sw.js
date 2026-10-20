const C="kriah-v7";
const F=["p1.svg","p2.svg","p3.svg","p4.svg","p5.svg","p6.svg","p7.svg","p8.svg","p9.svg","p10.svg","p11.svg","p12.svg","p13.svg","p14.svg",'./','index.html','app.js','levels.js','hebrew.ttf','manifest.json','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(h=>h||fetch(e.request)))});
