'use strict';
// ===== v10 fun pack: random dances, treasure chest, perfect-streak bonus, peeking Reb Shunkle, daily mystery box, SFX =====
S.fun=S.fun||{perf:0,box:'',chests:0};
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
// ---------- sound effects (WebAudio only) ----------
const SFX={
 tone(f,d,type='triangle',g=.14,at=0,slide){try{const a=ac(),t=a.currentTime+at,o=a.createOscillator(),v=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);v.gain.setValueAtTime(0.0001,t);v.gain.exponentialRampToValueAtTime(g,t+.01);v.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(v).connect(a.destination);o.start(t);o.stop(t+d+.02)}catch(e){}},
 noise(d,g=.12,at=0,hp=800){try{const a=ac(),t=a.currentTime+at,b=a.createBuffer(1,a.sampleRate*d,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=a.createBufferSource(),f=a.createBiquadFilter(),v=a.createGain();f.type='highpass';f.frequency.value=hp;s.buffer=b;v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(v).connect(a.destination);s.start(t)}catch(e){}},
 pop(){this.tone(500,.12,'sine',.2,0,1200)},
 boing(){this.tone(180,.35,'sine',.22,0,520);this.tone(520,.25,'sine',.1,.18,260)},
 sparkle(){[1568,2093,2637,3136,2637].forEach((f,i)=>this.tone(f,.12,'sine',.07,i*.05))},
 drumroll(n=14){for(let i=0;i<n;i++)this.noise(.05,.05+i*.006,i*.055,1500)},
 creak(){this.tone(140,.5,'sawtooth',.05,0,90)},
 coin(at=0){this.tone(988,.08,'square',.06,at);this.tone(1319,.25,'square',.06,at+.08)},
 slide(){this.tone(300,.4,'sine',.15,0,900)},
 // a little freylach / kazatske tune (freygish on D)
 freylach(){const N={D:294,Eb:311,Fs:370,G:392,A:440,Bb:466,C:523,D2:587};
  const m=[['A',1],['Bb',1],['A',1],['G',1],['Fs',2],['Eb',1],['Fs',1],['G',2],['A',2],['D2',2],['C',1],['Bb',1],['A',4]];
  let t=0;const q=.13;m.forEach(([n,l])=>{this.tone(N[n],q*l*.95,'square',.06,t);t+=q*l});
  for(let b=0;b<8;b++){this.tone(98,.08,'sine',.18,b*q*2);this.noise(.04,.04,b*q*2+q,3000)}}
};
window.SFX=SFX;
// ---------- random dances ----------
const DMOVES=['hop','spin','kick','shimmy','twist','twirl','hatflip','kazatske','silly','wobble'];
const CHEERS=['Freylach!','Mazel tov!','Wow wee!','Oy, so good!','Super-duper!','Gevaldig!','Yasher koach!','Keep it up!'];
dance=function(o={}){o=Object.assign({title:'Amazing!',sub:'',who:'yanky'},o);
  document.querySelectorAll('.dancer').forEach(d=>d.remove());
  const d=document.createElement('div');d.className='dancer';
  const m=MASCOT[o.who]&&o.who!=='car'?o.who:'yanky';
  const bits=[...Array(18)].map((_,i)=>{const g=['gold','silver','pearl','diamond'][i%4],a=i/18*Math.PI*2,r=120+Math.random()*90;
    return `<span class="bit" style="--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r-40}px;--d:${(i%6)*.05}s">${GEM[g]}</span>`}).join('');
  d.innerHTML=`<div class="stage"><div class="glow"></div>${bits}${o.art?`<div class="prize">${o.art}</div>`:''}<div class="dz">${MASCOT[m].svg()}</div><div class="shadow"></div><div class="say"></div></div><div class="bubble"><b>${o.title}</b>${o.sub?`<span>${o.sub}</span>`:''}</div>`;
  document.body.appendChild(d);
  const dz=d.querySelector('.dz'),say=d.querySelector('.say');
  const pool=DMOVES.slice().sort(()=>Math.random()-.5),seq=pool.slice(0,o.big?6:4);let i=0;
  (function next(){if(!d.isConnected)return;const mv=seq[i%seq.length];dz.className='dz '+mv;d.classList.toggle('silly',mv==='silly');
    if(mv==='hatflip'||mv==='hop')SFX.boing();else if(mv==='twirl'||mv==='spin')SFX.slide();else if(mv==='silly')SFX.tone(700,.3,'sine',.12,0,200);else SFX.pop();
    if(i%2===0){say.textContent=pick(CHEERS);say.classList.remove('on');void say.offsetWidth;say.classList.add('on')}
    i++;if(i<seq.length)setTimeout(next,700)})();
  SFX.freylach();
  const life=o.big?4800:3600;
  setTimeout(()=>d.classList.add('out'),life);setTimeout(()=>{d.remove();o.then&&o.then()},life+450);
  d.onclick=()=>{d.remove();o.then&&o.then()}};
window.dance=dance;
// ---------- treasure chest after every finished page ----------
const CHEST=(open)=>`<svg viewBox="0 0 120 110" class="chestsvg"><defs><linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7791F"/><stop offset="1" stop-color="#7B4A12"/></linearGradient></defs>
 <g class="cbody"><rect x="14" y="52" width="92" height="50" rx="8" fill="url(#cw)" stroke="#5B3409" stroke-width="3"/><path d="M14 66 H106 M14 88 H106" stroke="#F6C343" stroke-width="5"/><rect x="52" y="60" width="16" height="20" rx="3" fill="#F6C343" stroke="#B7791F" stroke-width="2"/><circle cx="60" cy="69" r="3" fill="#5B3409"/></g>
 <g class="clid" ${open?'transform="rotate(-28 14 54)"':''}><path d="M14 54 Q14 22 60 22 Q106 22 106 54Z" fill="url(#cw)" stroke="#5B3409" stroke-width="3"/><path d="M34 26 V54 M86 26 V54" stroke="#F6C343" stroke-width="5"/></g></svg>`;
function chestBonus(perfect){
  if(perfect)S.fun.perf=(S.fun.perf||0)+1;else S.fun.perf=0;
  const lines=[],base=rnd(5,15);let tot=base;lines.push(['Lucky find',base]);
  if(S.fun.perf>=2){const b=Math.min(50,S.fun.perf*5);tot+=b;lines.push([`Perfect streak ×${S.fun.perf}`,b])}
  const ds=dayStreak();if(ds>=2){const b=Math.min(30,ds*3);tot+=b;lines.push([`${ds}-day reading streak`,b])}
  if(Math.random()<.15){tot+=50;lines.push(['RARE PEARL!',50])}
  if(Math.random()<.03){tot+=250;lines.push(['SUPER RARE DIAMOND!!',250])}
  return {tot,lines}}
function showChest(perfect,title){
  document.querySelectorAll('.chestov').forEach(x=>x.remove());
  const B=chestBonus(perfect);S.coins+=B.tot;S.fun.chests=(S.fun.chests||0)+1;save();
  const c=document.createElement('div');c.className='chestov';
  c.innerHTML=`<div class="chbox"><div class="chttl">${title||'You found a treasure chest!'}</div><div class="chwrap">${CHEST(false)}<div class="chpeek">${MASCOT.yanky.svg()}</div></div><div class="chtap">Tap to open!</div></div>`;
  document.body.appendChild(c);SFX.sparkle();
  let opened=false;c.onclick=()=>{if(opened){c.classList.add('out');setTimeout(()=>{c.remove();renderMap()},350);return}opened=true;
    const w=c.querySelector('.chwrap');w.classList.add('shakec');SFX.drumroll();
    setTimeout(()=>{w.classList.remove('shakec');w.querySelector('.chestsvg').outerHTML=CHEST(true);SFX.creak();
      const o=splitW(B.tot),gems=[];TIER.forEach(([k])=>{for(let i=0;i<Math.min(o[k],6);i++)gems.push(k)});
      w.insertAdjacentHTML('beforeend',gems.map((g,i)=>`<span class="cgem" style="--x:${(i-(gems.length-1)/2)*34}px;--d:${i*.08}s">${GEM[g]}</span>`).join(''));
      gems.forEach((_,i)=>SFX.coin(i*.08+.1));
      c.querySelector('.chtap').innerHTML=`<div class="chlist">${B.lines.map(([n,v])=>`<div><span>${n}</span>${walletHTML(v,true)}</div>`).join('')}</div><div class="chtot">Total ${walletHTML(B.tot,true)}</div><div class="chsm">Tap to keep it</div>`;
      document.querySelectorAll('#coinsP').forEach(e=>e.innerHTML=walletHTML(S.coins))},900)}}
window.showChest=showChest;
// finished page → dance, then chest
confetti=function(big){
  const onSp=document.getElementById('sSpeed').classList.contains('on');const perfect=onSp?(R&&R.mist===0):(typeof G!=='undefined'&&G&&G.miss===0);
  if(document.querySelector('.dancer'))return; // second call for records
  dance(Object.assign(big?{title:'NEW RECORD!',sub:pick(['Reb Shunkle is doing the kazatske!','Look at those peyos fly!']),big:true}:{title:pick(['Great reading!','Beautiful leining!','So smooth!']),sub:pick(['Look at Reb Shunkle dance!','Reb Shunkle is so proud!'])},{who:S.char,then:()=>showChest(perfect)}))};
// ---------- Reb Shunkle peeks in during the race ----------
const PEEK=['You got this!','Faster, faster!','Wow, so good!','Keep going!','Oy, you\'re zooming!','Almost there!'];
let peekT=null;
function peek(){if(!(typeof R!=='undefined'&&R&&R.running))return;const p=document.createElement('div');p.className='peek';
  const who=MASCOT[S.char]&&S.char!=='car'?S.char:'yanky';
  p.innerHTML=`<div class="pk">${MASCOT[who].svg()}</div><div class="pb">${pick(PEEK)}</div>`;document.body.appendChild(p);SFX.pop();
  setTimeout(()=>p.classList.add('out'),2200);setTimeout(()=>p.remove(),2700)}
setInterval(()=>{if(typeof R!=='undefined'&&R&&R.running){const t=(performance.now()-R.t0)/1000;if(!peekT||t-peekT>9){if(t>4){peekT=t;peek()}}}else peekT=null},500);
// ---------- daily mystery box on the map ----------
function boxBtn(){let b=document.getElementById('mbox');const due=S.fun.box!==today();
  if(!due){b&&b.remove();return}
  if(!b){b=document.createElement('button');b.id='mbox';b.innerHTML=`<svg viewBox="0 0 64 64"><rect x="8" y="26" width="48" height="32" rx="5" fill="#EC4899"/><rect x="4" y="18" width="56" height="12" rx="4" fill="#F472B6"/><rect x="28" y="18" width="8" height="40" fill="#FDE68A"/><path d="M32 18 Q20 2 14 12 Q14 18 32 18 Q44 18 50 12 Q44 2 32 18Z" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/><text x="32" y="50" font-size="20" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif">?</text></svg><span>Daily surprise!</span>`;
    document.getElementById('sMap').appendChild(b);
    b.onclick=()=>{S.fun.box=today();const prize=pick([['silver',rnd(8,20)],['gold',rnd(20,40)],['pearl',50],['gold',30]]);S.coins+=prize[1];save();b.remove();SFX.drumroll(10);
      setTimeout(()=>dance({title:'Mystery box!',sub:'You got '+(prize[0]==='pearl'?'a pearl':prize[1]+' silver worth of coins')+' — come back tomorrow!',who:pick(['yanky','yokel','kerel']),art:GEM[prize[0]].replace('class="ic gem"','class="ic gem" width="110" height="110"')}),600)}}}
const _rm2=renderMap;renderMap=function(){_rm2.apply(this,arguments);boxBtn()};
// ---------- shop: fix clipped subtitles (English line + Hebrew line) ----------
const _oc=openChars;openChars=function(){_oc.apply(this,arguments);
  document.querySelectorAll('.shop .sb').forEach(e=>{if(e.classList.contains('he'))return;const [en,he]=e.textContent.split(' · ');e.innerHTML=`<span>${en}</span>${he?`<span class="he2" dir="rtl">${he}</span>`:''}`})};
document.head.insertAdjacentHTML('beforeend',`<style>
.shop .it{height:auto;min-height:190px;justify-content:flex-start}
.shop .sb{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.3;display:flex;flex-direction:column;align-items:center;max-width:100%}
.shop .sb .he2{font-family:serif;font-size:15px;color:#4B5563}
.dancer .say{position:absolute;top:6px;left:-70px;z-index:4;background:#FDE68A;color:#78350F;font-weight:900;font-size:22px;padding:8px 14px;border-radius:18px 18px 18px 4px;box-shadow:0 6px 16px rgba(0,0,0,.15);opacity:0}
.dancer .say.on{animation:sayp 1.3s ease-out both}@keyframes sayp{0%{opacity:0;transform:scale(.4) rotate(-10deg)}15%{opacity:1;transform:scale(1.1) rotate(3deg)}25%{transform:scale(1)}85%{opacity:1}100%{opacity:0;transform:translateY(-14px)}}
.dz.twirl{animation:spin .7s ease-in-out}.dz.twirl .pL,.dz.twirl .pR{animation:twl .35s linear infinite!important}@keyframes twl{to{transform:rotate(360deg)}}
.dancer .hat{transform-box:fill-box;transform-origin:50% 100%}
.dz.hatflip .hat{animation:hflip .7s cubic-bezier(.3,.7,.4,1)}@keyframes hflip{40%{transform:translateY(-55px) rotate(200deg)}80%{transform:translateY(0) rotate(360deg)}100%{transform:rotate(360deg)}}
.dz.hatflip{animation:hop .7s}
.dz.kazatske{animation:kz .7s ease-in-out}@keyframes kz{0%,100%{transform:none}25%,75%{transform:translateY(30px) scale(1.05,.85)}50%{transform:translateY(-8px)}}
.dz.kazatske .lL{animation:kzL .35s infinite alternate!important}.dz.kazatske .lR{animation:kzR .35s infinite alternate!important}
@keyframes kzL{from{transform:rotate(0)}to{transform:rotate(70deg)}}@keyframes kzR{from{transform:rotate(-70deg)}to{transform:rotate(0)}}
.dz.kazatske .aL,.dz.kazatske .aR{animation:none!important;transform:rotate(-80deg)}.dz.kazatske .aR{transform:rotate(80deg)}
.dz.wobble{animation:wob .7s ease-in-out}@keyframes wob{20%{transform:rotate(-18deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(6deg)}}
.dancer.silly .mouth{transform-box:fill-box;transform-origin:center;transform:scale(1.5,2.2);fill:#7F1D1D}
.dancer.silly .eyes{animation:none!important;transform:scale(1.5,.35)}
.dz.silly{animation:shim .7s linear}
.dancer .aL,.dancer .aR,.dancer .lL,.dancer .lR,.dancer .pL,.dancer .pR,.dancer .beard{transform-box:fill-box}
.dancer .beard{transform-origin:50% 0;animation:brd .31s infinite alternate}@keyframes brd{to{transform:rotate(6deg)}}
.chestov{position:fixed;inset:0;z-index:10000;background:rgba(30,27,75,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:fin .3s;direction:ltr}
.chestov.out{animation:fout .35s forwards}
.chbox{background:#fff;border-radius:32px;padding:26px 40px 30px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35);min-width:380px;animation:pop .5s cubic-bezier(.3,1.6,.5,1)}
.chttl{font-size:28px;font-weight:900;color:#1E1B4B}
.chwrap{position:relative;width:240px;height:220px;margin:6px auto}
.chestsvg{width:240px;height:220px;overflow:visible;filter:drop-shadow(0 10px 14px rgba(0,0,0,.25))}

.chpeek{position:absolute;right:-56px;bottom:4px;animation:pkin 1.2s .3s both}.chpeek svg{height:110px!important;width:auto!important}
@keyframes pkin{from{transform:translateX(40px) rotate(20deg);opacity:0}}
.shakec{animation:shk .12s 7}
.cgem{position:absolute;left:50%;top:48%;width:34px;height:34px;margin-left:-17px;animation:cg .9s cubic-bezier(.2,.9,.3,1.2) var(--d) both}.cgem .ic{width:34px;height:34px}
@keyframes cg{from{transform:translate(0,30px) scale(.2);opacity:0}to{transform:translate(var(--x),-90px) scale(1)}}
.chtap{font-size:20px;font-weight:800;color:#6366F1;animation:bob 1.2s ease-in-out infinite}
.chlist{font-size:17px;color:#374151;text-align:left;margin:0 auto;max-width:330px}.chlist div{display:flex;justify-content:space-between;gap:16px;padding:3px 0}
.chtot{font-size:24px;font-weight:900;color:#1E1B4B;margin-top:8px;display:flex;justify-content:center;gap:10px}.chsm{font-size:14px;color:#9CA3AF;margin-top:6px}
.peek{position:fixed;left:0;bottom:96px;z-index:50;display:flex;align-items:flex-end;pointer-events:none;animation:pkl .45s cubic-bezier(.3,1.5,.5,1) both;direction:ltr}
.peek.out{animation:pko .45s forwards}@keyframes pkl{from{transform:translateX(-120%) rotate(-25deg)}}@keyframes pko{to{transform:translateX(-120%) rotate(-25deg)}}
.peek .pk svg{height:120px!important;width:auto!important;transform:rotate(12deg);filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))}
.peek .pb{background:#fff;font-weight:900;font-size:20px;color:#1E1B4B;padding:10px 16px;border-radius:18px 18px 18px 4px;box-shadow:0 8px 20px rgba(0,0,0,.18);margin-bottom:80px}
#mbox{position:fixed;left:22px;bottom:22px;z-index:20;background:#fff;border-radius:26px;padding:10px 16px 10px 10px;display:flex;align-items:center;gap:8px;box-shadow:0 12px 30px rgba(236,72,153,.35);animation:mbx 1.6s ease-in-out infinite;font-weight:900;font-size:18px;color:#BE185D;direction:ltr}
#mbox svg{width:58px;height:58px}@keyframes mbx{0%,100%{transform:rotate(0)}10%{transform:rotate(-8deg) scale(1.05)}20%{transform:rotate(8deg) scale(1.05)}30%{transform:rotate(0)}}
</style>`);
renderMap();
// screenshot hooks
if(location.hash==='#chest'){S.fun.perf=2;S.days=[today()];setTimeout(()=>showChest(true),100)}
if(location.hash==='#chestopen'){S.fun.perf=3;setTimeout(()=>{showChest(true);document.querySelector('.chestov').click()},100)}
if(/^#dance=/.test(location.hash)){const [who,mv]=location.hash.slice(7).split(',');dance({title:'Mazel tov!',sub:MASCOT[who].name+' is dancing!',who,big:true});setTimeout(()=>{const d=document.querySelector('.dz');d.className='dz '+mv;document.querySelector('.dancer').classList.toggle('silly',mv==='silly');document.querySelector('.say').textContent='Freylach!'},50)}
if(location.hash==='#peek'){S.unlockAll=true;S.speed[SP[2].key]={time:40,stars:2,spm:60};speedStart(2);$('spGo').style.display='none';R.running=true;R.t0=performance.now()-23400;spTick()}
if(location.hash==='#mbox'){S.fun.box='';renderMap()}
if(/^#shop=/.test(location.hash)){S.owned=['yanky','car','owl','dreidel','yokel'];openChars()}
