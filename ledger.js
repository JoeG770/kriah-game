'use strict';
// ===== v13 clear treasure accounting: receipts, purchase slips, "My Bank" history =====
const LEDGER=(()=>{
S.log=S.log||[];let last=S.coins;
function words(n){const o=splitW(n),p=TIER.filter(([k])=>o[k]).map(([k])=>o[k]+' '+gname(k,o[k]));return p.length?p.join(' + '):'0 Silver'}
function chips(n,sign){const o=splitW(Math.abs(n)),p=TIER.filter(([k])=>o[k]);if(!p.length)p.push(['silver']);
  return '<span class="lgch">'+(sign||'')+p.map(([k])=>`<span>${GEM[k]}<b>${o[k]||0}</b> ${gname(k,o[k]||0)}</span>`).join('')+'</span>'}
function table(before,after){return `<table class="lgba"><tr><th></th>${TIER.map(([k])=>`<th>${GEM[k]}<br>${gname(k,2)}</th>`).join('')}</tr>
  <tr><td>Before</td>${TIER.map(([k])=>`<td>${splitW(before)[k]}</td>`).join('')}</tr>
  <tr class="now"><td>Now</td>${TIER.map(([k])=>{const a=splitW(before)[k],b=splitW(after)[k];return `<td class="${b>a?'up':b<a&&after<before?'dn':''}">${b}</td>`}).join('')}</tr></table>`}
// record every change to S.coins
setInterval(()=>{const v=S.coins;if(v===last)return;const d=v-last;last=v;
  S.log.push({t:Date.now(),why:window._why||(d>0?'Reading reward':'Spent'),d,bal:v});window._why=null;if(S.log.length>60)S.log=S.log.slice(-60);save()},150);
function overlay(html){document.querySelectorAll('.lgov').forEach(x=>x.remove());const o=document.createElement('div');o.className='lgov';
  o.innerHTML=`<div class="lgcard">${html}<button class="big lgok">OK</button></div>`;document.body.appendChild(o);
  o.querySelector('.lgok').onclick=()=>{o.remove();try{renderMap()}catch(e){}};return o}
function receipt(lines,before){const tot=lines.reduce((a,x)=>a+x[1],0),after=before+tot;
  overlay(`<div class="lgttl">🧾 Your treasure receipt</div>
   <div class="lglines">${lines.map(([n,v])=>`<div><span>${n}</span>${chips(v,'+')}</div>`).join('')}</div>
   <div class="lgtot"><span>TOTAL EARNED</span>${chips(tot,'+')}</div>
   <div class="lgsay">You earned <b>${words(tot)}</b></div>${table(before,after)}
   <div class="lgnote">10 Silver = 1 Gold · 5 Gold = 1 Pearl · 5 Pearls = 1 Diamond</div>`)}
function chestDone(B){const L=window.LAST;window.LAST=null;if(!L)return;
  // log the page reward as one tagged entry (it was already added before the chest)
  const pg=L.lines.reduce((a,x)=>a+x[1],0);const e=S.log.slice().reverse().find(x=>x.d===pg&&x.why==='Reading reward');if(e)e.why='Read a page';
  const lines=L.lines.concat(B.lines.map(([n,v])=>['Chest: '+n,v]));setTimeout(()=>{document.querySelectorAll('.chestov').forEach(x=>x.remove());receipt(lines,L.before)},1600)}
function bought(name,p,before,art){SFX&&SFX.coin&&SFX.coin(0);
  overlay(`<div class="lgart">${art||''}</div><div class="lgttl">You bought ${name}!</div>
   <div class="lgtot sp"><span>SPENT</span>${chips(p,'−')}</div><div class="lgsay">Treasure left: <b>${words(before-p)}</b></div>${table(before,before-p)}`)}
function history(){const rows=S.log.slice(-30).reverse();
  overlay(`<div class="lgttl">🏦 My Bank</div><div class="lgnow">${walletHTML(S.coins)}</div>
   <div class="lgnote">10 Silver = 1 Gold · 5 Gold = 1 Pearl · 5 Pearls = 1 Diamond</div>
   <div class="lghist">${rows.length?`<table><tr><th>When</th><th>What for</th><th>Change</th><th>Bank after</th></tr>${rows.map(r=>{const dt=new Date(r.t);
     return `<tr><td>${dt.toLocaleDateString('en-US',{month:'short',day:'numeric'})} ${dt.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</td><td>${r.why}</td><td class="${r.d>0?'up':'dn'}">${r.d>0?'+':'−'} ${words(Math.abs(r.d))}</td><td>${words(r.bal)}</td></tr>`}).join('')}</table>`:'<p>No treasure yet — read a page to start earning!</p>'}</div>`)}
return {words,receipt,chestDone,bought,history}})();
window.LEDGER=LEDGER;
if(location.hash==='#receipt'){S.coins=137;setTimeout(()=>{S.coins=277},300);setTimeout(()=>LEDGER.receipt([['Pages read',22],['Stars ×3',45],['New record',40],['No mistakes',15],['Chest: Lucky find',18]],137),400)}
if(location.hash==='#purchase'){S.coins=1376;setTimeout(()=>LEDGER.bought('Reb Yokel',120,1376,MASCOT.yokel?MASCOT.yokel.svg():''),400)}
if(location.hash==='#history'){const n=Date.now();S.log=[{t:n-86400e3,why:'Read a page',d:85,bal:85},{t:n-86000e3,why:'Treasure chest',d:23,bal:108},{t:n-7200e3,why:'Read a page',d:132,bal:240},{t:n-7000e3,why:'Daily surprise box',d:50,bal:290},{t:n-3600e3,why:'Bought Reb Yokel',d:-120,bal:170},{t:n-600e3,why:'Read a page',d:150,bal:320}];S.coins=320;setTimeout(()=>LEDGER.history(),400)}
document.head.insertAdjacentHTML('beforeend',`<style>
.wt{flex-direction:row}.wt .wl{font-style:normal;font-size:.7em;font-weight:800;color:#8a6a1f;margin-left:2px}
.lgov{position:fixed;inset:0;z-index:10001;background:rgba(30,20,0,.45);display:flex;align-items:flex-start;justify-content:center;padding-top:150px;direction:ltr;font-family:Nunito,system-ui,sans-serif;overflow:auto}
.lgcard{background:#fffdf7;border-radius:26px;padding:22px 28px;width:min(640px,92vw);box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;color:#3B2A00;margin-bottom:30px}
.lgttl{font-size:34px;font-weight:900;margin-bottom:12px}.lgart svg{width:110px!important;height:110px!important}
.lglines>div,.lgtot{display:flex;justify-content:space-between;align-items:center;font-size:22px;font-weight:700;padding:7px 4px;border-bottom:1px dashed #e8d9a8}
.lgtot{border:0;border-top:3px solid #3B2A00;margin-top:4px;font-size:26px;font-weight:900}.lgtot.sp{border-top:0;color:#B91C1C}
.lgch{display:inline-flex;gap:12px;align-items:center;font-weight:900}.lgch span{display:inline-flex;align-items:center;gap:3px}.lgch .ic{width:26px;height:26px}
.lgsay{font-size:22px;margin:10px 0}
.lgba{margin:8px auto;border-collapse:collapse;font-size:22px}.lgba th{font-size:13px;padding:2px 12px}.lgba th .ic{width:30px;height:30px}.lgba td{padding:5px 12px;font-weight:800}.lgba td:first-child{text-align:left;color:#8a6a1f}
.lgba tr.now td{font-size:28px}.lgba .up{color:#059669}.lgba .up::after{content:' ▲';font-size:14px}.lgba .dn{color:#DC2626}.lgba .dn::after{content:' ▼';font-size:14px}
.lgnote{font-size:14px;color:#8a6a1f;margin:6px 0 12px}.lgnow{font-size:30px;font-weight:900}.lgnow .ic{width:34px;height:34px}
.lghist{max-height:46vh;overflow:auto;text-align:left}.lghist table{width:100%;border-collapse:collapse;font-size:16px}.lghist th{position:sticky;top:0;background:#fff3cf;padding:6px}.lghist td{padding:6px;border-bottom:1px solid #f0e4c0}
.lghist .up{color:#059669;font-weight:800}.lghist .dn{color:#DC2626;font-weight:800}
.lgok{margin-top:10px}
</style>`);
