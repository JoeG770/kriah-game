const C="kriah-v16";
const F=["p1.svg","p2.svg","p3.svg","p4.svg","p5.svg","p6.svg","p7.svg","p8.svg","p9.svg","p10.svg","p11.svg","p12.svg","p13.svg","p14.svg",'./','index.html','app.js','profiles.js','rewards.js','fun.js','bank.js','ledger.js','levels.js','translit.js','hebrew.ttf','nunito.woff2','manifest.json','apple-touch-icon.png','favicon.ico','favicon-32.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(h=>h||fetch(e.request).then(r=>{if(r.ok&&/voice-p\d+\.json/.test(e.request.url)){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r})))});
