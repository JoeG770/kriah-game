'use strict';
// ===== v12 Treasure Bank: always-visible wallet, fly-in coins, roll-up counter, next-prize goal =====
(function(){
if(location.hash==='#flytest'){S.coins=98;setTimeout(()=>{S.coins+=37},700)}
const BK=document.createElement('div');BK.id='tbank';
BK.innerHTML=`<div class="bkrow"><span class="bkt">My Bank</span><span class="bkw"></span><span class="bktot"></span></div><div class="bkgoal"><span class="bkgart"></span><span class="bkgn"></span><span class="bkbar"><i></i></span><span class="bkgv"></span></div>`;
document.body.appendChild(BK);BK.onclick=()=>{if(window.LEDGER&&!(typeof R!=='undefined'&&R&&R.running)&&!(typeof G!=='undefined'&&G&&G.running))LEDGER.history()};
let shown=S.coins,target=S.coins,anim=null,lastSrc=null;
document.addEventListener('pointerdown',e=>{lastSrc={x:e.clientX,y:e.clientY,t:Date.now()}},true);
function live(){let p=0;try{if(typeof G!=='undefined'&&G&&G.running&&!G.practice)p=0;if(typeof G!=='undefined'&&G&&G.running)p=G.coins||0}catch(e){}return S.coins+p}
function goal(){const items=[];Object.entries(MASCOT).forEach(([k,m])=>{if(m.price&&!S.owned.includes(k))items.push([m.name,m.price,m.svg()])});
  TREAS.forEach(t=>{if(t[3]&&!S.treas.includes(t[0]))items.push([t[1],t[3],t[4]])});
  items.sort((a,b)=>a[1]-b[1]);return items[0]}
function paint(n){const o=splitW(n);
  BK.querySelector('.bkw').innerHTML=TIER.map(([k])=>`<span class="bkc ${k}" title="${GEMNAME[k]}">${GEM[k]}<b>${o[k]}</b><i>${gname(k,o[k])}</i></span>`).join('');
  BK.querySelector('.bktot').textContent='My bank ›';
  const g=goal(),gb=BK.querySelector('.bkgoal');if(!g){gb.style.display='none';return}gb.style.display='';
  BK.querySelector('.bkgart').innerHTML=g[2];
  const can=n>=g[1];BK.querySelector('.bkgn').textContent=can?'You can buy '+g[0]+'!':'Next: '+g[0];
  BK.querySelector('.bkbar i').style.width=Math.min(100,n/g[1]*100)+'%';BK.querySelector('.bkgv').textContent=Math.min(Math.floor(n),g[1])+' / '+g[1];
  gb.classList.toggle('can',can)}
function srcPoint(){const c=document.querySelector('.chestov .chwrap')||document.querySelector('.dancer .dz')||(document.getElementById('modal').style.display==='flex'&&document.getElementById('card'))||document.querySelector('#sPlay.on .bx.cur, #sPlay.on .u.cur')||document.querySelector('#sSpeed.on #spTimer');
  if(c){const r=c.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
  if(lastSrc&&Date.now()-lastSrc.t<3000)return lastSrc;return{x:innerWidth/2,y:innerHeight*.55}}
function fly(delta){const s=srcPoint(),b=BK.querySelector('.bkw').getBoundingClientRect(),tx=b.left+b.width/2,ty=b.top+b.height/2;
  const o=splitW(delta),kinds=[];TIER.forEach(([k])=>{for(let i=0;i<Math.min(o[k],4);i++)kinds.push(k)});if(!kinds.length)kinds.push('silver');
  const n=Math.min(10,Math.max(kinds.length,Math.ceil(Math.sqrt(delta))));while(kinds.length<n)kinds.push(kinds[kinds.length%Math.max(1,kinds.length)]);
  kinds.forEach((k,i)=>{const e=document.createElement('span');e.className='bkfly';e.innerHTML=GEM[k];
    const ox=(Math.random()-.5)*120,oy=(Math.random()-.5)*80;e.style.left=(s.x+ox)+'px';e.style.top=(s.y+oy)+'px';document.body.appendChild(e);
    const dx=tx-(s.x+ox),dy=ty-(s.y+oy);
    e.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:0},{transform:'translate(-50%,-50%) scale(1.4)',opacity:1,offset:.2},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.7)`,opacity:1}],{duration:750,delay:i*70,easing:'cubic-bezier(.5,0,.75,.4)',fill:'both'}).onfinish=()=>{e.remove();ding(i)}});
  const f=document.createElement('div');f.className='bkplus';f.textContent='+'+delta;f.style.left=s.x+'px';f.style.top=s.y+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1400);
  return 300+kinds.length*70+450}
function ding(i){try{SFX.coin(0)}catch(e){beep(1200+i*40,.08,'square',.05)}BK.classList.remove('pulse');void BK.offsetWidth;BK.classList.add('pulse')}
function upgradeFx(from,to){TIER.slice(0,3).forEach(([k],idx)=>{const a=splitW(from)[k],b=splitW(to)[k];if(b>a){const lower=TIER[idx+1][0],per=TIER[idx][1]/TIER[idx+1][1];
  const c=BK.querySelector('.bkc.'+k);c.classList.remove('up');void c.offsetWidth;c.classList.add('up');
  const t=document.createElement('div');t.className='bkup';t.innerHTML=`${per} ${gname(lower,per)} ${GEM[lower]} turned into 1 ${gname(k,1)} ${GEM[k]}!`;BK.appendChild(t);setTimeout(()=>t.remove(),2600);
  [784,988,1319,1568].forEach((n,j)=>setTimeout(()=>beep(n,.12,'triangle',.12),j*80))}})}
function roll(to,delay){cancelAnimationFrame(anim);const from=shown,t0=performance.now()+delay,D=Math.min(1600,500+(to-from)*8);
  (function f(){const now=performance.now();if(now<t0){anim=requestAnimationFrame(f);return}const k=Math.min(1,(now-t0)/D);const v=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));
    const pv=shown;shown=v;paint(v);if(Math.floor(v/10)!==Math.floor(pv/10)||Math.floor(v/50)!==Math.floor(pv/50))upgradeFx(pv,v);if(k<1)anim=requestAnimationFrame(f)})()}
function check(){const v=live();if(v===target)return;const d=v-target;target=v;
  if(d>0){const dl=fly(d);BK.classList.add('glow');setTimeout(()=>BK.classList.remove('glow'),dl+1400);roll(v,Math.max(0,dl-500))}else{cancelAnimationFrame(anim);shown=v;paint(v)}}
setInterval(check,120);paint(shown);
window.BANK={check,paint:()=>paint(shown),fly};
// screen-specific placement
const obs=()=>{const sc=document.querySelector('.screen.on');BK.dataset.s=sc?sc.id:'';BK.classList.toggle('compact',sc&&sc.id!=='sMap')};
setInterval(obs,300);obs();
})();
document.head.insertAdjacentHTML('beforeend',`<style>
#coinsP,#coinsR{display:none!important}
#modal{padding-top:96px;box-sizing:border-box}#modal .card{max-height:calc(100vh - 110px);overflow:auto}
#sMap.screen{padding-top:calc(env(safe-area-inset-top) + 104px)}
#sPlay #hud,#sSpeed #hud{min-height:62px}
#tbank{position:fixed;top:8px;left:50%;--tx:-50%;transform:translateX(var(--tx));z-index:10002;direction:ltr;background:linear-gradient(180deg,#fffdf5,#fff6dc);border:2px solid #F5C451;border-radius:22px;padding:8px 16px 8px;box-shadow:0 10px 28px rgba(180,120,0,.22),inset 0 1px 0 #fff;font-family:Nunito,system-ui,sans-serif;color:#3B2A00;pointer-events:auto;cursor:pointer;min-width:360px;transition:box-shadow .3s}
#tbank .bkrow{display:flex;align-items:center;gap:14px;justify-content:center}
#tbank .bkt{font-weight:900;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#B7791F}
#tbank .bkw{display:flex;gap:14px}
#tbank .bkc{display:inline-flex;align-items:center;gap:4px}
#tbank .bkc .ic{width:34px;height:34px}
#tbank .bkc{flex-direction:column;gap:0;line-height:1}#tbank .bkc i{font-style:normal;font-size:12px;font-weight:800;color:#8a6a1f;text-transform:uppercase;letter-spacing:.04em}#tbank.compact .bkc i{font-size:10px}#tbank .bkc .ic+b{margin-top:-2px}
#tbank .bkc b{font-size:32px;font-weight:900;min-width:.7em;font-variant-numeric:tabular-nums}
#tbank .bkc.up{animation:bkup .9s cubic-bezier(.3,1.6,.5,1)}
#tbank .bktot{font-size:15px;font-weight:800;color:#8a6a1f;background:#fff;border-radius:12px;padding:3px 8px}
#tbank .bkgoal{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:15px;font-weight:800;color:#5b4a20}
#tbank .bkgart{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center}#tbank .bkgart svg{width:30px!important;height:30px!important}
#tbank .bkbar{flex:1;height:12px;background:#f1e6c6;border-radius:8px;overflow:hidden;min-width:90px}
#tbank .bkbar i{display:block;height:100%;background:linear-gradient(90deg,#34D399,#10B981);border-radius:8px;transition:width .3s}
#tbank .bkgoal.can{color:#047857}#tbank .bkgoal.can .bkbar i{background:linear-gradient(90deg,#FBBF24,#F59E0B)}
#tbank.compact{top:4px;padding:4px 12px;min-width:0;border-radius:16px}
#tbank.compact .bkt,#tbank.compact .bktot{display:none}#tbank .bkc{display:inline-grid;grid-template-columns:auto auto;column-gap:4px;align-items:center}#tbank .bkc i{grid-column:1/3;text-align:center}
#tbank.compact .bkc .ic{width:30px;height:30px}#tbank.compact .bkc b{font-size:28px}
#tbank.compact .bkgoal{margin-top:2px;font-size:12px}#tbank.compact .bkgart{width:20px;height:20px}#tbank.compact .bkgart svg{width:20px!important;height:20px!important}#tbank.compact .bkbar{height:8px}
@media (max-width:900px){#tbank.compact{left:130px;--tx:0px}}
#tbank.pulse{animation:bkp .35s ease-out}
#tbank.glow{box-shadow:0 0 0 4px rgba(251,191,36,.45),0 0 34px rgba(251,191,36,.9)}
@keyframes bkp{0%{transform:translateX(var(--tx)) scale(1)}40%{transform:translateX(var(--tx)) scale(1.09)}100%{transform:translateX(var(--tx)) scale(1)}}
@keyframes bkup{0%{transform:scale(1)}30%{transform:scale(1.6) rotate(-8deg)}100%{transform:scale(1)}}
.bkfly{position:fixed;z-index:10003;pointer-events:none;width:40px;height:40px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.25))}.bkfly .ic{width:40px;height:40px}
.bkplus{direction:ltr;position:fixed;z-index:10003;pointer-events:none;transform:translate(-50%,-50%);font:900 54px Nunito,system-ui,sans-serif;color:#F59E0B;-webkit-text-stroke:2px #fff;text-shadow:0 6px 16px rgba(180,100,0,.4);animation:bkpl 1.4s ease-out forwards}
@keyframes bkpl{0%{opacity:0;transform:translate(-50%,-30%) scale(.5)}20%{opacity:1;transform:translate(-50%,-60%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-160%) scale(1)}}
.bkup{position:absolute;left:50%;top:100%;margin-top:8px;transform:translateX(-50%);background:#7C3AED;color:#fff;border-radius:14px;padding:6px 12px;font-weight:900;font-size:18px;white-space:nowrap;display:flex;align-items:center;gap:6px;box-shadow:0 8px 20px rgba(124,58,237,.4);animation:bkpl2 2.6s ease-out forwards}
.bkup .ic{width:22px;height:22px}.bkup span{font-size:13px;opacity:.9;margin-left:4px}
@keyframes bkpl2{0%{opacity:0;transform:translateX(-50%) translateY(-6px) scale(.6)}15%{opacity:1;transform:translateX(-50%) scale(1.1)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(8px)}}
</style>`);
