'use strict';
// Player profiles + family-code sync. Loaded BEFORE app.js; sets window.PROFILE_KEY.
(function(){
const PK='kriah-profiles',OLD='kriah-save-v1';
const SYNC_URL='https://kriah-proxy.vercel.app/api/sync';
let P=JSON.parse(localStorage.getItem(PK)||'null');
if(!P){P={list:[],active:null,code:null,ts:0};
  const old=localStorage.getItem(OLD);
  if(old){const o=JSON.parse(old);P.list.push({id:'p1',name:'Player 1',color:0});localStorage.setItem(OLD+':p1',old);P.active='p1'}
  localStorage.setItem(PK,JSON.stringify(P));}
const saveP=()=>localStorage.setItem(PK,JSON.stringify(P));
const kOf=id=>OLD+':'+id;
const COLORS=['#6366F1','#FF5C7A','#22C55E','#FFB020','#06B6D4','#A855F7','#F97316','#0EA5E9'];
const chosen=sessionStorage.getItem('kriah-who');
const act=P.list.find(p=>p.id===(chosen||P.active))||P.list[0];
window.PROFILE_KEY=act?kOf(act.id):kOf('tmp');
window.PROFILES={P,saveP,kOf};
function data(id){return JSON.parse(localStorage.getItem(kOf(id))||'{}')}
function esc(s){return String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';')}
function ic(c){return window.icon?window.icon(c||'🚗'):'🚗'}
function wallet(s){const v=s.coins||0;try{const o=splitW(v);return TIER.map(([k])=>`${GEM[k]} ${o[k]}`).join('&nbsp; ')}catch(e){return '🪙 '+v}}
function css(){if(document.getElementById('whoCss'))return;const st=document.createElement('style');st.id='whoCss';st.textContent=`
body:has(#who) #tbank,body:has(#who) .dsurp{display:none!important}
#who{position:fixed;inset:0;z-index:2147483000;direction:ltr;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:30px;
background:radial-gradient(1000px 600px at 80% -10%,#DCD9FF 0,transparent 60%),radial-gradient(800px 500px at 0 110%,#D6ECFF 0,transparent 60%),linear-gradient(180deg,#F4F6FF,#E9EDFF);font-family:Nunito,system-ui,sans-serif;color:#1E2245;overflow:auto}
#who h1{font-size:54px;font-weight:900;margin:0;letter-spacing:-1px}#who .sub{font-size:22px;color:#6B7194;margin-top:-18px;font-weight:700}
#who .grid{display:flex;flex-wrap:wrap;gap:24px;justify-content:center;max-width:1000px}
#who .card{width:200px;border:0;border-radius:32px;background:#fff;box-shadow:0 2px 4px rgba(30,34,69,.08),0 16px 40px rgba(30,34,69,.14);padding:22px 14px 18px;display:flex;flex-direction:column;align-items:center;gap:8px;font:inherit;color:inherit;cursor:pointer;transition:transform .15s;position:relative}
#who .card:active{transform:scale(.96)}
#who .av{width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:64px;overflow:hidden}
#who .av svg{width:100px;height:100px}#who .av .carsvg{width:96px;height:60px}
#who .nm{font-size:28px;font-weight:900}#who .wl{font-size:16px;color:#6B7194;font-weight:800}
#who .add .av{background:#EEF0FB;color:#6366F1;font-size:72px;font-weight:900}
#who .ed{position:absolute;top:10px;right:12px;font-size:20px;opacity:.5}
#who .row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
#who .btn{border:0;border-radius:999px;padding:16px 30px;font:inherit;font-size:22px;font-weight:900;background:#fff;color:#1E2245;box-shadow:0 8px 24px rgba(30,34,69,.1);cursor:pointer}
#who .btn.pri{background:linear-gradient(180deg,#6366F1,#4F46E5);color:#fff}
#who input{font:inherit;font-size:34px;font-weight:900;text-align:center;border:3px solid #E3E6F3;border-radius:24px;padding:16px 22px;width:min(460px,80vw);outline:none;background:#fff;color:#1E2245}
#who input:focus{border-color:#6366F1}
#who .sw{display:flex;gap:12px}#who .sw b{width:46px;height:46px;border-radius:50%;cursor:pointer;border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.15)}#who .sw b.on{outline:4px solid #1E2245}
#who .code{font-size:60px;font-weight:900;letter-spacing:8px;background:#fff;border-radius:28px;padding:18px 36px;box-shadow:0 16px 40px rgba(30,34,69,.14);color:#4F46E5}
#who .note{font-size:18px;color:#6B7194;max-width:560px;text-align:center;line-height:1.4}
#who .st{font-size:18px;font-weight:900}`;document.head.appendChild(st)}
function shell(h){css();let d=document.getElementById('who');if(!d){d=document.createElement('div');d.id='who';document.body.appendChild(d)}d.innerHTML=h;return d}
function close(){const d=document.getElementById('who');if(d)d.remove()}
function pick(id){P.active=id;saveP();sessionStorage.setItem('kriah-who',id);location.reload()}
function picker(){
  const cards=P.list.map(p=>{const s=data(p.id);return `<button class="card" data-id="${p.id}"><span class="ed" data-e="${p.id}">✏️</span><div class="av" style="background:${COLORS[p.color||0]}22">${ic(s.char)}</div><div class="nm">${esc(p.name)}</div><div class="wl">${wallet(s)}</div></button>`}).join('');
  const d=shell(`<h1>Who's playing?</h1><div class="sub">Tap your name to start</div><div class="grid">${cards}<button class="card add" id="wAdd"><div class="av">+</div><div class="nm">Add player</div><div class="wl">&nbsp;</div></button></div>
  <div class="row"><button class="btn" id="wFam">Family code${P.code?': '+esc(P.code):''}</button></div>`);
  d.querySelectorAll('.card[data-id]').forEach(b=>b.onclick=e=>{const ed=e.target.closest('[data-e]');if(ed)return edit(ed.dataset.e);const id=b.dataset.id;if(id===(act&&act.id)&&sessionStorage.getItem('kriah-who')){close();return}pick(id)});
  d.querySelector('#wAdd').onclick=()=>edit(null);d.querySelector('#wFam').onclick=family;
}
function edit(id){
  const p=id?P.list.find(x=>x.id===id):{name:'',color:P.list.length%COLORS.length};let col=p.color||0;
  const d=shell(`<h1>${id?'Edit player':'New player'}</h1><div class="sub">What's your name?</div><input id="wName" maxlength="14" placeholder="Name" value="${esc(p.name)}" autocomplete="off">
  <div class="sw">${COLORS.map((c,i)=>`<b data-i="${i}" class="${i===col?'on':''}" style="background:${c}"></b>`).join('')}</div>
  <div class="note">Each player gets their own racer, treasures and levels. New players start with Reb Shunkle and the race car.</div>
  <div class="row"><button class="btn" id="wBack">Back</button>${id&&P.list.length>1?'<button class="btn" id="wDel">Remove</button>':''}<button class="btn pri" id="wOk">${id?'Save':'Add player'}</button></div>`);
  d.querySelectorAll('.sw b').forEach(b=>b.onclick=()=>{col=+b.dataset.i;d.querySelectorAll('.sw b').forEach(x=>x.classList.toggle('on',x===b))});
  d.querySelector('#wBack').onclick=picker;
  const del=d.querySelector('#wDel');if(del)del.onclick=()=>{if(!confirm('Remove '+p.name+' and all their treasures?'))return;P.list=P.list.filter(x=>x.id!==id);localStorage.removeItem(kOf(id));P.ts=Date.now();saveP();if(P.active===id){P.active=P.list[0].id;sessionStorage.removeItem('kriah-who');saveP()}push();picker()};
  d.querySelector('#wOk').onclick=()=>{const n=d.querySelector('#wName').value.trim();if(!n){d.querySelector('#wName').focus();return}
    if(id){p.name=n;p.color=col}else{const nid='p'+Date.now().toString(36);P.list.push({id:nid,name:n,color:col});localStorage.setItem(kOf(nid),JSON.stringify({char:'yanky',owned:['🚗','yanky']}))}
    P.ts=Date.now();saveP();push();picker()};
  setTimeout(()=>d.querySelector('#wName').focus(),50);
}
function mkCode(){const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';const r=crypto.getRandomValues(new Uint8Array(8));for(const x of r)s+=A[x%A.length];return s.slice(0,4)+'-'+s.slice(4)}
function family(){
  const d=shell(`<h1>Family code</h1><div class="sub">Same players and progress on every iPad and browser</div>
  ${P.code?`<div class="code">${esc(P.code)}</div><div class="note">On another iPad, open the game, tap <b>Family code</b>, and type this code. Keep it private, like a password.</div><div class="st" id="wSt">Checking…</div>`
  :`<button class="btn pri" id="wNew">Create a family code</button><div class="note">Or type a code you already made on another device:</div><input id="wCode" maxlength="9" placeholder="ABCD-1234" autocapitalize="characters" autocomplete="off"><button class="btn" id="wJoin">Use this code</button><div class="st" id="wSt"></div>`}
  <div class="row"><button class="btn" id="wBack">Back</button>${P.code?'<button class="btn" id="wSync">Sync now</button><button class="btn" id="wOff">Turn off on this iPad</button>':''}</div>`);
  const st=d.querySelector('#wSt');d.querySelector('#wBack').onclick=picker;
  const say=(t,ok)=>{if(st){st.textContent=t;st.style.color=ok?'#16A34A':'#E23E5E'}};
  if(P.code){d.querySelector('#wSync').onclick=()=>sync(true).then(r=>say(r.msg,r.ok));d.querySelector('#wOff').onclick=()=>{P.code=null;saveP();family()};sync(false).then(r=>say(r.msg,r.ok))}
  else{d.querySelector('#wNew').onclick=async()=>{const c=mkCode();P.code=c;P.ts=Date.now();saveP();const r=await push();family();};
    d.querySelector('#wJoin').onclick=async()=>{const c=d.querySelector('#wCode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.length!==8)return say('Codes have 8 letters and numbers');const code=c.slice(0,4)+'-'+c.slice(4);
      say('Looking…',true);const r=await get(code);if(!r.ok)return say(r.msg);if(!r.data)return say('No family found with that code');
      if(!confirm('Load the players from this family code? Players on this iPad will be replaced.'))return;P.code=code;apply(r.data);sessionStorage.removeItem('kriah-who');location.reload()}}
}
function bundle(){const saves={};P.list.forEach(p=>saves[p.id]=data(p.id));return {v:1,ts:P.ts||Date.now(),list:P.list,saves}}
function apply(b){P.list=b.list;P.ts=b.ts;Object.entries(b.saves).forEach(([id,s])=>localStorage.setItem(kOf(id),JSON.stringify(s)));if(!P.list.find(p=>p.id===P.active))P.active=P.list[0]&&P.list[0].id;saveP()}
async function get(code){try{const r=await fetch(SYNC_URL+'?code='+encodeURIComponent(code));if(r.status===404){let e={};try{e=await r.json()}catch(x){}return e.error==='not found'?{ok:true,data:null}:{ok:false,msg:'Sync is not turned on yet'}}if(!r.ok)return{ok:false,msg:'Sync is not turned on yet'};const j=await r.json();return{ok:true,data:j.data}}catch(e){return{ok:false,msg:'Sync is not turned on yet (offline or server missing)'}}}
async function push(){if(!P.code)return{ok:true};try{const r=await fetch(SYNC_URL+'?code='+encodeURIComponent(P.code),{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(bundle())});return r.ok?{ok:true,msg:'Saved ✓'}:{ok:false,msg:'Sync is not turned on yet'}}catch(e){return{ok:false,msg:'Saved on this iPad only (offline)'}}}
async function sync(){if(!P.code)return{ok:true,msg:''};const r=await get(P.code);if(!r.ok)return r;
  if(r.data&&r.data.ts>(P.ts||0)){apply(r.data);return{ok:true,msg:'Updated from family ✓'}}const q=await push();return q.ok?{ok:true,msg:'All synced ✓'}:q}
window.PROFILES.push=()=>{P.ts=Date.now();saveP();clearTimeout(window.__pt);window.__pt=setTimeout(push,1500)};
window.PROFILES.picker=picker;window.PROFILES.current=act;
window.addEventListener('load',()=>{
  const b=document.createElement('button');b.className='pill';b.id='whoB';b.style.cssText='font-size:18px';b.textContent='👤 '+(act?act.name:'Players');b.onclick=picker;
  const t=document.querySelector('.top .sp');if(t)t.after(b);
  if(!sessionStorage.getItem('kriah-who')||!act)picker();
  if(location.hash==='#add')edit(null);if(location.hash==='#fam')family();
  if(P.code&&sessionStorage.getItem('kriah-who'))sync().then(r=>{if(r.msg==='Updated from family ✓')location.reload()});
});
})();
