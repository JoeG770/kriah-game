'use strict';
const $=id=>document.getElementById(id);
const L=window.LEVELS;
const KEY='kriah-save-v1';
const S=Object.assign({points:0,coins:0,best:{},runs:[],vowelMiss:{},days:[],char:'🚗',owned:['🚗'],unlockAll:false,speed:{},mode:'speed'},JSON.parse(localStorage.getItem(KEY)||'{}'));
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const CARSVG=`<svg class="carsvg" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 26 Q4 18 12 17 L20 8 Q23 5 28 5 L44 5 Q50 5 53 10 L58 17 Q62 18 62 24 L62 29 Q62 31 60 31 L6 31 Q4 31 4 29Z" fill="#e63946" stroke="#a4161a" stroke-width="1.5"/><path d="M22 10 Q24 8 28 8 L34 8 L34 17 L15 17Z M37 8 L44 8 Q48 8 50 11 L54 17 L37 17Z" fill="#bfe9ff"/><rect x="4" y="21" width="5" height="4" rx="2" fill="#ffe066"/><circle cx="17" cy="31" r="7" fill="#222"/><circle cx="17" cy="31" r="3" fill="#ccc"/><circle cx="49" cy="31" r="7" fill="#222"/><circle cx="49" cy="31" r="3" fill="#ccc"/></svg>`;
function icon(c){return (window.MASCOT&&MASCOT[c])?MASCOT[c].svg():c==='🚗'?CARSVG:c}
const CHARS=[['🚗',0],['🚀',50],['🦄',120],['🐉',250],['🏎️',400],['🦖',600],['🛸',800],['🐎',1000]];
// ---------- phonetics ----------
const NIK=/[\u0591-\u05C7]/g;
const FIN={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
const FOLD={'ע':'א','ח':'כ','ק':'כ','ט':'ס','ת':'ס','ש':'ס','ו':'ב','ה':'א'}; // Ashkenazi: sav=s, ches/chof=k
function plain(s){return s.replace(NIK,'').replace(/[^\u05D0-\u05EA]/g,'').replace(/[ךםןףץ]/g,c=>FIN[c])}
function fold(s){return plain(s).split('').map(c=>FOLD[c]||c).join('')}
function vclass(unit){ // vowel class of a pointed syllable
  if(/\u05D5\u05BC|\u05BB/.test(unit))return 'u';
  if(/\u05B9|\u05B3/.test(unit))return 'o';
  if(/\u05B4/.test(unit))return 'i';
  if(/[\u05B5\u05B6\u05B1]/.test(unit))return 'e';
  if(/[\u05B8\u05B7\u05B2]/.test(unit))return 'a';
  if(/\u05B0/.test(unit))return 'e';
  return '';
}
const VNAME={a:'kamatz / patach (a)',e:'tzere / segol / sheva (e)',i:'chirik (i)',o:'cholam (o)',u:'shuruk / kubutz (u)'};
function heardV(tok){ // guess vowel classes from an unpointed transcript token (lenient sets)
  const r=plain(tok).slice(1);
  if(!r||/^[אה]+$/.test(r))return ['a','e'];
  if(r[0]==='י')return ['i','e'];
  if(r[0]==='ו')return ['o','u'];
  return ['a','e','i','o','u'];
}
const LAT={b:'ב',v:'ב',g:'ג',d:'ד',h:'א',z:'ז',t:'ת',y:'י',k:'כ',c:'כ',l:'ל',m:'מ',n:'נ',s:'ס',p:'פ',f:'פ',r:'ר',a:'א',e:'א',i:'א',o:'א',u:'א'};
function latin(tok){ // recognizer sometimes answers in latin: "da", "dee"
  const m=tok.toLowerCase().match(/^(sh|ch|ts|[a-z])([aeiouy]*)/);if(!m)return null;
  const c=m[1]==='sh'?'ס':m[1]==='ch'?'כ':m[1]==='ts'?'צ':(LAT[m[1]]||'');
  const v=m[2][0]; return {c:fold(c),v:!v?['a','e','i','o','u']:v==='a'?['a']:v==='e'?['e','i']:v==='i'||v==='y'?['i']:v==='o'?['o','u']:['u','o']};
}
// Chasidish/Ashkenazi vowel tolerance: kamatz~u/o/a, cholam~oy/ey, shuruk/kubutz~i, tzeirei~ay
function ashV(u){if(/\u05B8|\u05B3/.test(u))return['a','o','u'];if(/\u05B9|\u05D5\u05B9/.test(u))return['o','e','i','u'];if(/\u05D5\u05BC|\u05BB/.test(u))return['u','i'];if(/\u05B5/.test(u))return['e','i','a'];if(/\u05B6/.test(u))return['e','a'];if(/\u05B4/.test(u))return['i','e'];if(/\u05B7|\u05B2/.test(u))return['a'];return['a','e','i','o','u']}
function lev(a,b){const d=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){let p=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return d[b.length]}
function matchUnit(lvl,i,tok){
  if(lvl.kind==='letters'){ // final letters: Yiddish 'ende X' (also plain X, 'lange(r) X', 'X sofis')
    const FP=/^(ender|ende|langer|lange|ענדער|ענדע|אנדע|לאנגער|לאַנגער|לאנגע|לאַנגע)\s*|\s*(סופית|סוֹפִית|sofis|sofit)$/gi;
    const base=lvl.say[i].replace(/\s*סוֹפִית$/,''),tk=tok.replace(/[\u0591-\u05C7]/g,'').replace(FP,'').replace(FP,'');const a=fold(base),b=fold(tk);return b.length&&lev(a,b)<=Math.max(1,Math.floor(a.length/2))||fold(lvl.units[i])===b[0]&&b.length>=2&&lev(a,b)<=2}
  if(lvl.kind==='syllables'){
    const u=lvl.units[i],c=fold(u[0]),v=vclass(u);const la=/[a-z]/i.test(tok)?latin(tok):null;
    if(la)return la.c===c&&(!v||la.v.some(h=>ashV(u).includes(h)));
    const f=fold(tok);if(!f)return false;
    if(f[0]!==c&&!(c==='א'&&'אי'.includes(f[0])))return false; // first consonant must match (folded)
    return !v||heardV(tok).some(h=>ashV(u).includes(h))||plain(tok).length===1;
  }
  const a=fold(lvl.words[i].w),b=fold(tok);if(!b)return false;
  const sk=x=>x.replace(/[איב]/g,''); // consonant skeleton: drop vowel letters (Ashkenazi oy/ay/ee add י/ו)
  return lev(a,b)<=Math.max(1,Math.round(a.length*0.4))||lev(sk(a),sk(b))<=Math.max(1,Math.round(sk(a).length*0.34));
}
// ---------- game state ----------
let G=null;
function units(l){return l.kind==='words'?l.words:l.units}
function syllCount(l,n){return l.kind==='words'?l.words.slice(0,n).reduce((s,w)=>s+w.syl.length,0):n}
function stars(l,spm,acc){const t=l.kind==='letters'?[15,25,35]:l.kind==='syllables'?[20,35,50]:[30,50,70];let s=spm>=t[2]&&acc>=.9?3:spm>=t[1]&&acc>=.75?2:1;return s}
function unlocked(i){return S.unlockAll||i===0||(S.best[L[i-1].id]||{}).stars>=1}
function today(){return new Date().toLocaleDateString('en-CA')}
function dayStreak(){let n=0,d=new Date();const set=new Set(S.days);while(set.has(d.toLocaleDateString('en-CA'))){n++;d.setDate(d.getDate()-1)}return n}
function renderMap(){
  $('modeB').innerHTML=S.mode==='speed'?'🏁 Speed Run':'🎯 Practice';
  if(S.mode==='speed'){$('coinsP').textContent='🪙 '+S.coins;$('ptsP').textContent='⭐ '+S.points+' pts';$('streakP').textContent='🔥 '+dayStreak()+' days';$('charB').innerHTML=icon(S.char);return renderSpeedMap()}
  $('coinsP').textContent='🪙 '+S.coins;$('ptsP').textContent='⭐ '+S.points+' pts';$('streakP').textContent='🔥 '+dayStreak()+' days';$('charB').innerHTML=icon(S.char);
  $('map').innerHTML=L.map((l,i)=>{const b=S.best[l.id];const lk=!unlocked(i);
    return `<button class="lv ${l.boss?'boss':''} ${lk?'lock':''}" data-i="${i}"><b>${lk?'🔒':l.boss?'👹':i+1}</b>${l.title}<span class="st">${b?'⭐'.repeat(b.stars)+'☆'.repeat(3-b.stars):''}</span></button>`}).join('');
  $('map').querySelectorAll('.lv').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(unlocked(i))start(i)});
}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id))}
function start(i,practice){
  const l=practice||L[i];loadVoice(l.page||(G&&G.l&&G.l.page));
  G={l,i,pos:0,miss:0,missHere:0,streak:0,maxStreak:0,coins:0,helped:[],times:[],t0:0,last:0,running:false,practice:!!practice,heardIdx:0};
  show('sPlay');$('title').textContent=l.title;
  const b=$('board');
  if(l.svg){b.className='pg';
    const c=l.crop,cw=c[2]-c[0],chh=c[3]-c[1];
    b.innerHTML=`<div class="page" id="page" style="aspect-ratio:${l.aspect}"><img src="${l.svg}" style="width:${100/cw}%;height:${100/chh}%;left:${-c[0]/cw*100}%;top:${-c[1]/chh*100}%">${l.boxes.map((x,k)=>`<span class="bx" id="u${k}" style="left:${x[0]*100}%;top:${x[1]*100}%;width:${(x[2]-x[0])*100}%;height:${(x[3]-x[1])*100}%"></span>`).join('')}</div>`;
    fitPage(l);
  } else {
  b.className=l.kind==='words'?'words':'';
  b.innerHTML=units(l).map((u,k)=>l.kind==='words'?`<span class="u" id="u${k}">${u.syl.map(s=>`<span class="s">${s}</span>`).join('')}</span>`:`<span class="u" id="u${k}">${u}</span>`).join('');
  }
  const tr=$('track');tr.querySelectorAll('.car').forEach(c=>c.remove());
  G.car=document.createElement('span');G.car.className='car';G.car.innerHTML=icon(S.char);tr.appendChild(G.car);
  const best=!practice&&S.best[l.id];if(best&&best.times){G.ghostT=best.times;G.ghost=document.createElement('span');G.ghost.className='car ghost';G.ghost.innerHTML=icon(S.char);tr.appendChild(G.ghost)}
  moveCar(G.car,0);if(G.ghost)moveCar(G.ghost,0);hud();
  const go=()=>countdown(()=>{G.t0=performance.now();G.last=G.t0;G.running=true;V.acc=0;highlight();listen();tick()});
  if(CFG.mode==='webspeech'||/#demo/.test(location.hash))go();else ensureMic().then(go);
}
function fitPage(l){const b=$('board'),p=$('page');const H=b.clientHeight-8,W=b.clientWidth-8;
  if(l.kind!=='words'||H*l.aspect>=W*0.6)p.style.width=Math.min(W,H*l.aspect)+'px';else p.style.width=W+'px'}
function moveCar(el,k){const n=units(G.l).length;const w=$('track').clientWidth-44;el.style.right=(k/n*w)+'px'}
function countdown(cb){const c=$('count');c.style.display='flex';let n=3;const step=()=>{if(n===0){c.textContent='GO!';beep(880,.2);setTimeout(()=>{c.style.display='none';cb()},500);return}c.textContent=n;beep(440,.15);n--;setTimeout(step,800)};step()}
function hud(){$('streak').textContent='⚡ '+G.streak;$('coinsR').textContent='🪙 '+G.coins;$('ptsR').textContent='⭐ '+(G.pts||0);G.car.classList.toggle('turbo',G.streak>=5)}
function highlight(){document.querySelectorAll('.u,.bx').forEach((e,k)=>{e.classList.toggle('cur',k===G.pos);e.classList.toggle('done',k<G.pos)});
  const e=$('u'+G.pos);if(e){e.scrollIntoView({block:'center',behavior:'smooth'});}}
function tick(){if(!G||!G.running)return;const now=performance.now(),t=(now-G.t0)/1000;$('timer').textContent='⏱ '+t.toFixed(1);
  if(G.ghost){let k=G.ghostT.findIndex(x=>x>t);if(k<0)k=G.ghostT.length;moveCar(G.ghost,k)}
  if(!G.helping&&now-G.last>3000&&!G.practice)help();else if(!G.helping&&G.practice&&now-G.last>4500)help();
  requestAnimationFrame(tick)}
function advance(byParent){
  if(!G.running)return;const e=$('u'+G.pos);if(e)e.classList.remove('help');
  G.times.push((performance.now()-G.t0)/1000);G.pos++;G.last=performance.now();G.missHere=0;G.helping=false;
  G.streak++;G.maxStreak=Math.max(G.maxStreak,G.streak);G.coins+=G.streak>=5?3:2;{const gain=10+Math.min(G.streak,20)*2+((performance.now()-G.last)<1500?5:0);G.pts=(G.pts||0)+gain;flyAt($('u'+G.pos),'+'+gain);if(G.streak&&G.streak%5===0){comboFx('COMBO x'+G.streak+'!');G.pts+=25}}
  moveCar(G.car,G.pos);whoosh(G.streak>=5);hud();
  if(G.pos>=units(G.l).length)return finish();highlight();
}
function wrong(){
  if(!G.running||G.helping)return;G.miss++;G.missHere++;G.streak=0;hud();const e=$('u'+G.pos);if(e){e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake')}
  boop();noteVowelMiss();if(G.missHere>=2)help();
}
function noteVowelMiss(){const u=units(G.l)[G.pos];const s=G.l.kind==='words'?u.syl[0]:u;const v=vclass(s);if(v){S.vowelMiss[v]=(S.vowelMiss[v]||0)+1}}
function help(){
  const u=units(G.l)[G.pos];if(!u)return;G.helping=true;G.streak=0;hud();const e=$('u'+G.pos);e.classList.add('help');
  const txt=G.l.kind==='words'?u.w:G.l.kind==='letters'?G.l.say[G.pos]:u;
  if(!G.helped.some(h=>h.t===txt))G.helped.push({t:txt,u});noteVowelMiss();
  say(txt,()=>{G.last=performance.now();G.helping=false;G.missHere=0});
}
// ---------- audio engine ----------
// One getUserMedia for the whole session (Safari only prompts once per page load / origin grant).
// Default recognizer = on-device voice-activity + syllable-nucleus counting (no network, no re-prompts).
// Optional: cloud verifier (proxy URL set in parent screen) checks each utterance's text and rolls back mismatches.
// Optional: Web Speech (experimental; may re-prompt on iOS).
// Fill in after deploying kriah-proxy, e.g. 'https://kriah-proxy.vercel.app/api/transcribe'
const PROXY_URL='https://kriah-proxy.vercel.app/api/transcribe';
const CFG=Object.assign({mode:PROXY_URL?'cloud':'vad',proxy:PROXY_URL,sens:1,maxMist:3},JSON.parse(localStorage.getItem('kriah-cfg')||'{}'));
if(PROXY_URL&&!CFG.proxy){CFG.proxy=PROXY_URL;if(CFG.mode==='vad')CFG.mode='cloud'}
const saveCfg=()=>localStorage.setItem('kriah-cfg',JSON.stringify(CFG));
const RING={sr:48000,buf:null,w:0};let MIC=null,AN=null,BUF=null,speaking=false,wantListen=false,vadT=null;
async function ensureMic(){
  if(MIC&&MIC.getAudioTracks().some(t=>t.readyState==='live'))return true;
  try{MIC=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});}
  catch(e){$('mic').textContent='🚫 no mic';return false}
  const a=ac();if(a.state==='suspended')await a.resume();
  const src=a.createMediaStreamSource(MIC);AN=a.createAnalyser();AN.fftSize=1024;BUF=new Float32Array(AN.fftSize);src.connect(AN);
  // rolling PCM buffer (last 12 s) so each utterance can be cut out with pre-roll and sent as WAV
  RING.sr=a.sampleRate;RING.buf=new Float32Array(Math.round(a.sampleRate*12));RING.w=0;
  const sp=a.createScriptProcessor(4096,1,1);sp.onaudioprocess=e=>{const d=e.inputBuffer.getChannelData(0);for(let i=0;i<d.length;i++){RING.buf[RING.w%RING.buf.length]=d[i];RING.w++}};
  const mute=a.createGain();mute.gain.value=0;src.connect(sp);sp.connect(mute);mute.connect(a.destination);
  MIC.getAudioTracks()[0].onended=()=>{MIC=null};
  return true;
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state==='suspended')AC.resume()});
// VAD state
const V={floor:0.004,on:false,since:0,lastLoud:0,peak:0,dip:true,nuclei:0,uttStart:0,acc:0,rec:null,chunks:[]};
function rms(){AN.getFloatTimeDomainData(BUF);let s=0;for(const x of BUF)s+=x*x;return Math.sqrt(s/BUF.length)}
function listen(){
  wantListen=true;$('mic').textContent='🎤';$('mic').classList.add('mic-on');
  if(CFG.mode==='webspeech')return webSpeech();
  if(!AN||vadT)return;
  vadT=setInterval(vadTick,20);
}
function stopListen(){wantListen=false;$('mic').classList.remove('mic-on');if(vadT){clearInterval(vadT);vadT=null}if(rec){try{rec.abort()}catch(e){}rec=null}}
function vadTick(){
  if(!G||!G.running||speaking)return;
  const now=performance.now(),e=rms();
  if(!V.on)V.floor=V.floor*0.995+Math.min(e,0.05)*0.005; // adapt to room noise while quiet
  const thOn=Math.max(0.012,V.floor*3.2)/CFG.sens,thOff=thOn*0.6;
  if(!V.on&&e>thOn){V.on=true;V.uttStart=now;V.lastLoud=now;V.nuclei=0;V.peak=e;V.dip=false;startClip()}
  if(V.on){
    if(e>thOff)V.lastLoud=now;
    // syllable nucleus = energy peak followed by a dip below 55% of that peak
    if(!V.dip&&e>V.peak)V.peak=e;
    if(!V.dip&&e<V.peak*0.55){V.nuclei++;V.dip=true;V.peak=e}
    else if(V.dip&&e>thOn&&e>V.peak*1.6){V.dip=false;V.peak=e}
    else if(V.dip&&e<V.peak)V.peak=e;
    if(now-V.lastLoud>220){ // utterance ended
      V.on=false;const dur=V.lastLoud-V.uttStart;if(!V.dip)V.nuclei++;
      if(dur>90)onUtterance(Math.max(1,V.nuclei),dur);else stopClip(null);
    }
  }
}
function onUtterance(nuc,dur){
  if(!G||!G.running)return;
  G.last=performance.now();
  const startPos=G.pos;
  if(G.l.kind==='words'){ // advance words as their syllables are heard
    V.acc+=nuc;let moved=0;
    while(G.pos<units(G.l).length){const need=Math.max(1,Math.round(units(G.l)[G.pos].syl.length*0.7));if(V.acc>=need){V.acc-=need;advance();moved++}else break}
    if(!moved&&dur>1500){V.acc=0;advance()}
  } else { V.acc=0; advance() } // one utterance = one syllable / letter
  stopClip({from:startPos,to:G.pos});
}
// ---- cloud verifier (optional) ----
function ringPos(){return RING.w}
function startClip(){V.clipStart=RING.buf?Math.max(0,RING.w-Math.round(RING.sr*0.35)):0}
function stopClip(span){
  if(CFG.mode!=='cloud'||!CFG.proxy||!RING.buf||!span||span.to<=span.from)return;
  const end=RING.w,st=Math.max(V.clipStart,end-RING.buf.length+1),n=end-st;if(n<RING.sr*0.15)return;
  const sr=16000,ratio=RING.sr/sr,m=Math.floor(n/ratio),pcm=new Int16Array(m);
  for(let i=0;i<m;i++){const v=RING.buf[(st+Math.floor(i*ratio))%RING.buf.length];pcm[i]=Math.max(-1,Math.min(1,v))*32767}
  const wav=new DataView(new ArrayBuffer(44+m*2));const W=(o,t)=>{for(let i=0;i<t.length;i++)wav.setUint8(o+i,t.charCodeAt(i))};
  W(0,'RIFF');wav.setUint32(4,36+m*2,true);W(8,'WAVEfmt ');wav.setUint32(16,16,true);wav.setUint16(20,1,true);wav.setUint16(22,1,true);wav.setUint32(24,sr,true);wav.setUint32(28,sr*2,true);wav.setUint16(32,2,true);wav.setUint16(34,16,true);W(36,'data');wav.setUint32(40,m*2,true);
  for(let i=0;i<m;i++)wav.setInt16(44+i*2,pcm[i],true);
  const exp=[];for(let k=span.from;k<span.to;k++){const u=units(G.l)[k];exp.push(G.l.kind==='words'?u.w:G.l.kind==='letters'?G.l.say[k]:u)}
  verify(new Blob([wav.buffer],{type:'audio/wav'}),exp,span);
}
async function verify(blob,exp,span){
  try{
    const fd=new FormData();fd.append('audio',blob,'a.wav');fd.append('expected',exp.join(' '));if(window.translit)fd.append('translit',translit(exp.join(' ')));
    const res=await fetch(CFG.proxy,{method:'POST',body:fd});if(!res.ok)return;const j=await res.json();
    const toks=(j.text||'').replace(/[.,:!?]/g,'').trim().split(/\s+/).filter(Boolean);if(!toks.length)return;
    let ok=0;for(let k=span.from;k<span.to;k++){if(toks.some(t=>matchUnit(G.l,k,t))||toks.join('')&&matchUnit(G.l,k,toks.join('')))ok++}
    if(ok<Math.ceil((span.to-span.from)*0.6)&&G&&G.running&&G.pos===span.to){rollback(span.from)}
  }catch(e){}
}
function rollback(to){while(G.pos>to){G.pos--;G.times.pop()}G.missHere++;G.miss++;G.streak=0;moveCar(G.car,G.pos);highlight();hud();boop();noteVowelMiss();
  const e=$('u'+G.pos);if(e){e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake')}if(G.missHere>=2)help()}
// ---- Web Speech (experimental) ----
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
function webSpeech(){
  if(!SR||rec)return;rec=new SR();rec.lang='he-IL';rec.continuous=true;rec.interimResults=true;
  rec.onresult=ev=>{if(!G||!G.running||speaking)return;for(let r=ev.resultIndex;r<ev.results.length;r++){const res=ev.results[r];if(!res.isFinal)continue;
    const toks=res[0].transcript.trim().split(/\s+/);for(const t of toks){if(G.pos<units(G.l).length&&matchUnit(G.l,G.pos,t))advance()}}};
  rec.onend=()=>{rec=null}; // no auto-restart: restarting is what re-triggers Safari's prompt
  try{rec.start()}catch(e){}
}
// heimish Chasidish voice: pre-generated clips per page (voice-pN.json), Hebrew TTS only as fallback
const VOICE={};function vkey(s){return s.replace(/[^\u05D0-\u05EA\u05B0-\u05C7]/g,'')}
function loadVoice(p){if(!p||VOICE[p])return;VOICE[p]=fetch('voice-p'+p+'.json').then(r=>r.ok?r.json():{}).catch(()=>({}))}
async function playClip(t){const p=G&&G.l&&G.l.page;if(!p||!VOICE[p])return false;const m=await VOICE[p];const b=m[vkey(t)];if(!b)return false;
  const a=ac();if(a.state==='suspended')await a.resume();const bin=Uint8Array.from(atob(b),c=>c.charCodeAt(0));const buf=await a.decodeAudioData(bin.buffer);
  return new Promise(res=>{const s=a.createBufferSource();s.buffer=buf;s.connect(a.destination);s.onended=()=>res(true);s.start()})}
function say(t,cb){
  speaking=true;V.on=false;let done=false;const fin=()=>{if(done)return;done=true;setTimeout(()=>{speaking=false;V.acc=0},350);cb&&cb()};
  playClip(t).then(ok=>{if(ok)fin();else sayTTS(t,cb,fin)}).catch(()=>sayTTS(t,cb,fin));setTimeout(fin,6000)}
function sayTTS(t,cb,fin){
  const ss=window.speechSynthesis;if(!ss){fin();return}
  speaking=true;V.on=false;
  const u=new SpeechSynthesisUtterance(t);u.lang='he-IL';u.rate=.7;const v=ss.getVoices().find(v=>/he/i.test(v.lang));if(v)u.voice=v;
  u.onend=u.onerror=fin;ss.cancel();ss.speak(u);setTimeout(fin,4000);
}
// ---------- sounds ----------
let AC;function ac(){return AC||(AC=new(window.AudioContext||window.webkitAudioContext)())}
function beep(f,d,type='sine',g=.2){try{const a=ac(),o=a.createOscillator(),v=a.createGain();o.type=type;o.frequency.value=f;v.gain.setValueAtTime(g,a.currentTime);v.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);o.connect(v).connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function whoosh(t){beep(t?900:600,.12,'triangle');setTimeout(()=>beep(t?1300:900,.1,'triangle'),60)}
function boop(){beep(180,.25,'square',.08)}
// ---------- end ----------
function finish(){
  G.running=false;stopListen();const l=G.l,n=units(l).length,t=G.times[n-1]||1;
  const spm=Math.round(syllCount(l,n)/(t/60)),acc=Math.max(0,1-(G.miss+G.helped.length)/n);
  if(G.practice){S.coins+=G.coins;S.points+=G.pts||0;save();confetti();modal(`<div style="font-size:70px">💪</div>Great job! Practice complete<br>🪙 +${G.coins} · <span class="ptsbig" data-cnt="${G.pts||0}">0</span> pts<br><br><button class="big" onclick="closeModal();toMap()">לַמַּפָּה</button>`);return}
  const st=stars(l,spm,acc);const prev=S.best[l.id];const rec_=!prev||t<prev.time;
  G.pts=(G.pts||0)+st*100+(rec_&&prev?500:0);S.points+=G.pts;S.coins+=G.coins+st*15+(rec_&&prev?40:0)+(!prev?30:0)+(G.miss===0?15:0);if(!S.days.includes(today()))S.days.push(today());
  S.runs.push({id:l.id,d:Date.now(),spm,acc:+acc.toFixed(2),t:+t.toFixed(1)});
  if(!prev||st>prev.stars||rec_)S.best[l.id]={stars:Math.max(st,prev?prev.stars:0),time:rec_?t:prev.time,times:rec_?G.times:prev.times,spm:Math.max(spm,prev?prev.spm:0)};
  save();confetti(st===3||rec_);
  const helped=G.helped.slice();
  modal(`<div style="font-size:80px">${'⭐'.repeat(st)}${'☆'.repeat(3-st)}</div>${rec_?'<div style="font-size:50px">🏆 NEW RECORD!</div>':''}
   <div class="ptsbig" data-cnt="${G.pts}">0</div>points!<br>⏱ ${t.toFixed(1)} sec &nbsp; 🚀 ${spm} syllables/min<br>⚡ Best combo: ${G.maxStreak} &nbsp; 🪙 +${G.coins+st*10}<br><br>
   ${helped.length?`<button class="big" style="background:#ff9f1c;box-shadow:0 8px 0 #b86b00" id="prB">🎯 Quick practice (${helped.length})</button><br><br>`:''}
   <button class="big" id="agB">🔁 Again</button> <button class="big" style="background:#5b2bd6;box-shadow:0 8px 0 #3b1d8f" onclick="closeModal();toMap()">🗺️ Map</button>`);countUp();
  const i=G.i;$('agB').onclick=()=>{closeModal();start(i)};
  if(helped.length)$('prB').onclick=()=>{closeModal();const k=l.kind;start(i,k==='words'?{id:'pr',page:l.page,title:'🎯 Practice',kind:'words',words:helped.map(h=>h.u)}:{id:'pr',page:l.page,title:'🎯 Practice',kind:k,units:helped.map(h=>k==='letters'?l.units[l.say.indexOf(h.t)]:h.u),say:helped.map(h=>h.t)})};
}
function quit(){if(G&&G.running){G.running=false;S.coins+=G.coins||0;save()}stopListen();speechSynthesis&&speechSynthesis.cancel();toMap()}
function toMap(){show('sMap');renderMap()}
function modal(h){$('card').innerHTML=h;$('modal').style.display='flex';countUp()}
function closeModal(){$('modal').style.display='none'}
// parent override: tap = accept current, long press = mark wrong
$('ovr').onclick=()=>advance(true);
$('ovx').onclick=()=>{if(!G||!G.running)return;if(G.pos>0&&performance.now()-G.last<4000)rollback(G.pos-1);else wrong()};
// characters
function openChars(){modal(`<div>Pick a racer 🪙 ${S.coins}</div><div class="chars">${CHARS.map(([c,p])=>`<button class="${S.char===c?'sel':''}" data-c="${c}" data-p="${p}">${icon(c)}<div style="font-size:22px">${S.owned.includes(c)?'✓':'🪙'+p}</div></button>`).join('')}</div><br><button class="big" onclick="closeModal();renderMap()">Close</button>`);
  document.querySelectorAll('.chars button').forEach(b=>b.onclick=()=>{const c=b.dataset.c,p=+b.dataset.p;if(!S.owned.includes(c)){if(S.coins<p){boop();return}S.coins-=p;S.owned.push(c);confetti()}S.char=c;save();openChars()})}
// parent screen (hold the button 1s so the kid doesn't wander in)
(()=>{let t;const b=$('parentB');b.addEventListener('pointerdown',()=>t=setTimeout(parent,900));b.addEventListener('pointerup',()=>clearTimeout(t))})();
function parent(){
  const vm=Object.entries(S.vowelMiss).sort((a,b)=>b[1]-a[1]);
  modal(`<div style="font-size:36px">📊 Parent screen</div><canvas id="ch" width="700" height="260"></canvas>
   <div style="font-size:24px;text-align:right">Runs: ${S.runs.length} · Day streak: ${dayStreak()} · Total points: ${S.points}<br><b>Vowels he struggles with:</b> ${vm.length?vm.map(([v,n])=>VNAME[v]+' ('+n+')').join(' · '):'—'}<br>
   <b>Records:</b> ${L.filter(l=>S.best[l.id]).map(l=>l.title+': '+S.best[l.id].spm+' syl/min').join(' · ')||'—'}</div>
   <label style="font-size:24px"><input type="checkbox" id="ua" ${S.unlockAll?'checked':''}> Unlock all levels</label><br>
   <div style="font-size:18px;color:#666">✓ / ✗ bottom-left corner (Practice): ✓ = correct (move ahead), ✗ = mistake (step back). In Speed Run, tap ✗ for each mistake.</div>
   <div style="font-size:22px;text-align:right">Speed Run: max mistakes allowed: <b id="mmv">${CFG.maxMist}</b> <input id="mm" type="range" min="0" max="10" step="1" value="${CFG.maxMist}"></div>
   <div style="font-size:20px;text-align:right;margin:8px 0">Recognition (Practice): <select id="md"><option value="vad">Voice (on-device, offline)</option><option value="cloud">Voice + cloud check</option><option value="webspeech">Web Speech (experimental)</option></select>
   Sensitivity <input id="sens" type="range" min="0.5" max="2" step="0.1" value="${CFG.sens}"><br>Server URL (cloud check): <input id="px" style="width:60%" value="${CFG.proxy}" placeholder="https://...workers.dev"></div>
   <button class="big" onclick="closeModal();renderMap()">Close</button>`);
  $('mm').oninput=e=>{CFG.maxMist=+e.target.value;$('mmv').textContent=CFG.maxMist;saveCfg()};
  $('md').value=CFG.mode;$('md').onchange=e=>{CFG.mode=e.target.value;saveCfg()};$('sens').oninput=e=>{CFG.sens=+e.target.value;saveCfg()};$('px').onchange=e=>{CFG.proxy=e.target.value.trim();if(CFG.proxy&&CFG.mode==='vad')CFG.mode='cloud';saveCfg()};
  $('ua').onchange=e=>{S.unlockAll=e.target.checked;save()};
  const c=$('ch').getContext('2d'),R=S.runs.slice(-30);c.fillStyle='#3b1d8f';c.font='18px sans-serif';c.fillText('Syllables per minute (last 30 runs)',380,22);
  const mx=Math.max(60,...R.map(r=>r.spm));c.strokeStyle='#5b2bd6';c.lineWidth=4;c.beginPath();
  R.forEach((r,k)=>{const x=30+k*(640/Math.max(1,R.length-1)),y=240-r.spm/mx*200;k?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();
  R.forEach((r,k)=>{const x=30+k*(640/Math.max(1,R.length-1)),y=240-r.spm/mx*200;c.fillStyle='#ff5d73';c.beginPath();c.arc(x,y,6,0,7);c.fill()});
}
// confetti
function confetti(big){const cv=$('confetti'),x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
  const P=[...Array(big?260:120)].map(()=>({x:Math.random()*cv.width,y:-20-Math.random()*cv.height/2,v:2+Math.random()*5,r:Math.random()*6,c:`hsl(${Math.random()*360},90%,60%)`,s:6+Math.random()*8}));let f=0;
  (function d(){x.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.y+=p.v;p.x+=Math.sin(f/10+p.r)*2;x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s*.6)});if(++f<200)requestAnimationFrame(d);else x.clearRect(0,0,cv.width,cv.height)})();
  [523,659,784,1046].forEach((n,k)=>setTimeout(()=>beep(n,.2,'triangle'),k*110))}
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js');
window.speechSynthesis&&speechSynthesis.getVoices();
window.__T={start,advance,wrong,help,get G(){return G},S,matchUnit,L};
// screenshot/demo hook: #demo=<levelIndex>,<steps>
if(/^#demo=/.test(location.hash)){document.head.insertAdjacentHTML("beforeend","<style>*{transition:none!important;animation:none!important}</style>");let [i,k]=location.hash.slice(6).split(',');k=+k;i=L.findIndex(l=>l.id===i);S.unlockAll=true;
  start(i);if(L[i].kind==='words'){const l=L[i];S.best[l.id]={stars:2,time:60,times:l.words.map((_,j)=>j*0.8),spm:40}}setTimeout(()=>{G.running=true;for(let n=0;n<k;n++)advance();G.t0=performance.now()-k*900;if(G.ghost)moveCar(G.ghost,k+2);G.last=1e12},4200)}
if(location.hash==='#seed'){S.coins=180;S.best={};L.slice(0,6).forEach((l,i)=>S.best[l.id]={stars:[3,3,2,3,2,1][i],time:30,times:[],spm:30+i*4});S.days=[today()];S.runs=[30,34,33,40,44,47].map((s,i)=>({id:'x',d:i,spm:s,acc:.9}));S.vowelMiss={e:7,u:4,o:2};renderMap()}

// =================== SPEED RUN (default mode) ===================
const SP=(()=>{const pages=[];const seen={};
  L.forEach(l=>{const k='pg'+l.page;if(seen[k]){seen[k].n+=units(l).length;return}
    const n=l.kind==='words'?l.words.reduce((a,w)=>a+w.syl.length,0):units(l).length;
    const t=l.row!==undefined?(l.page===14?'אָלֶף־בֵּית עִם נְקוּדוֹת':'עִרְבּוּבְיָא'):l.title.replace(/^בּוֹס /,'');
    seen[k]={key:k,page:l.page,title:t,kind:l.kind,svg:l.svg,crop:l.crop,aspect:l.aspect,boss:l.boss,n,pdf:l.syllable_count_in_pdf};pages.push(seen[k])});
  pages.forEach(p=>p.syl=p.pdf||p.n);return pages})();
function spUnlocked(i){return S.unlockAll||i===0||!!S.speed[SP[i-1].key]}
function renderSpeedMap(){
  $('map').innerHTML=SP.map((p,i)=>{const b=S.speed[p.key];const lk=!spUnlocked(i);
    return `<button class="lv ${p.boss?'boss':''} ${lk?'lock':''}" data-i="${i}"><b>${lk?'🔒':p.boss?'👹':i+1}</b>${p.title}<span class="st">${b?'⭐'.repeat(b.stars)+'☆'.repeat(3-b.stars):''}</span>${b?`<span class="rec">⏱ ${b.time.toFixed(1)}</span>`:''}</button>`}).join('');
  $('map').querySelectorAll('.lv').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(spUnlocked(i))speedStart(i);else boop()});
}
$('modeB').onclick=()=>{S.mode=S.mode==='speed'?'practice':'speed';save();beep(660,.1,'triangle');renderMap()};
let R=null;
function speedStart(i){
  const p=SP[i];R={i,p,mist:0,running:false,t0:0};show('sSpeed');
  const c=p.crop,cw=c[2]-c[0],ch=c[3]-c[1];
  $('spTitle').textContent=p.title;
  $('spBoard').innerHTML=`<div class="page" id="spPage" style="aspect-ratio:${p.aspect}"><img src="${p.svg}" style="width:${100/cw}%;height:${100/ch}%;left:${-c[0]/cw*100}%;top:${-c[1]/ch*100}%"></div>`;
  const b=$('spBoard'),pg=$('spPage');const H=b.clientHeight-8,W=b.clientWidth-8;pg.style.width=(p.kind!=='words'||H*p.aspect>=W*0.6?Math.min(W,H*p.aspect):W)+'px';
  const best=S.speed[p.key];$('spBest').textContent=best?'🏆 '+best.time.toFixed(1):'🏆 —';
  $('spGhost').style.display=best?'':'none';$('spGhost').innerHTML=icon(S.char);$('spPts').textContent='⭐ '+S.points;$('spGhost').style.right='0px';
  $('spTimer').textContent='0.0';$('spMist').textContent='✗ 0';$('spStop').style.visibility='hidden';$('spGo').style.display='flex';
}
$('spGo').onclick=()=>{$('spGo').style.display='none';ac();
  const c=$('count');c.style.display='flex';let n=3;
  const step=()=>{if(n===0){c.textContent='GO!';beep(880,.25);setTimeout(()=>{c.style.display='none';R.t0=performance.now();R.running=true;$('spStop').style.visibility='visible';spTick()},450);return}
    c.textContent=n;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');beep(440+ (3-n)*80,.15);n--;setTimeout(step,800)};step()};
function spTick(){if(!R||!R.running)return;const t=(performance.now()-R.t0)/1000;$('spTimer').textContent=t.toFixed(1);
  const best=S.speed[R.p.key];if(best){const f=Math.min(1,t/best.time);$('spGhost').style.right=(f*($('spTrack').clientWidth-50))+'px';$('spTimer').classList.toggle('behind',t>best.time)}
  if(Math.floor(t)!==R.sec){R.sec=Math.floor(t);if(R.sec>0&&R.sec%10===0){beep(990,.06,'triangle');if((R.cp||0)<18){R.cp=(R.cp||0)+3;S.coins+=3;save()}}}
  requestAnimationFrame(spTick)}
$('spX').onclick=()=>{if(!R||!R.running)return;R.mist++;$('spMist').textContent='✗ '+R.mist;boop();const x=$('spX');x.classList.remove('pop');void x.offsetWidth;x.classList.add('pop');$('spMist').classList.toggle('over',R.mist>CFG.maxMist)};
$('spQuit').onclick=()=>{if(R)R.running=false;toMap()};
$('spStop').onclick=()=>{if(!R||!R.running)return;R.running=false;$('spStop').style.visibility='hidden';
  const t=(performance.now()-R.t0)/1000,p=R.p;if(t<2){toMap();return}
  if(R.mist>CFG.maxMist){beep(300,.2,'triangle');setTimeout(()=>beep(250,.3,'triangle'),180);
    return modal(`<div style="font-size:90px">🐢💨</div><div style="font-size:44px">Whoa, too fast!</div><div style="font-size:34px">Let's read it again, slowly and carefully</div><div style="font-size:26px;color:#888">⏱ ${t.toFixed(1)} · ✗ ${R.mist}</div><br><button class="big" id="rtB">🔁 Try again</button> <button class="big" style="background:#5b2bd6;box-shadow:0 8px 0 #3b1d8f" onclick="closeModal();toMap()">🗺️</button>`),$('rtB').onclick=()=>{closeModal();speedStart(R.i)}}
  const spm=Math.round(p.syl/(t/60)),acc=Math.max(0,1-R.mist/Math.max(10,p.syl/10));
  const st=stars({kind:p.kind},spm,R.mist===0?1:acc);const prev=S.speed[p.key];const rec=!prev||t<prev.time;
  const coins=Math.round(p.syl/5)+st*15+(rec&&prev?40:0)+(!prev?30:0)+(R.mist===0?15:0);const pts=p.syl*2+Math.max(0,spm-30)*3+st*100+(rec&&prev?500:0)+(R.mist===0?200:0);S.points+=pts;S.coins+=coins;if(!S.days.includes(today()))S.days.push(today());
  S.runs.push({id:p.key,d:Date.now(),spm,acc:+acc.toFixed(2),t:+t.toFixed(1),speed:1});
  S.speed[p.key]={time:rec?t:prev.time,stars:Math.max(st,prev?prev.stars:0),spm:Math.max(spm,prev?prev.spm:0),runs:(prev?prev.runs:0)+1};save();
  confetti(rec);if(rec&&prev)setTimeout(()=>confetti(true),700);
  const bt=prev?prev.time:t,mx=Math.max(t,bt);
  modal(`${rec&&prev?'<div class="banner">🏆 NEW RECORD! +500</div>':''}<div style="font-size:80px">${'⭐'.repeat(st)}${'☆'.repeat(3-st)}</div>
   <div style="font-size:64px;font-weight:bold">⏱ ${t.toFixed(1)} sec</div><div><span class="ptsbig" data-cnt="${pts}">0</span> points!${R.mist===0?' 🎯 Perfect +200':''}</div>
   <div class="cmp"><div>You ${icon(S.char)}</div><div class="bar"><span style="width:${t/mx*100}%;background:#2bd66b"></span></div><div>${t.toFixed(1)}</div>
   <div>Record 👻</div><div class="bar"><span style="width:${bt/mx*100}%;background:#bbb"></span></div><div>${bt.toFixed(1)}</div></div>
   <div style="font-size:30px">🚀 ${spm} syllables/min · ✗ ${R.mist} · 🪙 +${coins+(R.cp||0)}</div>
   ${prev&&!rec?`<div style="font-size:26px">Only ${(t-prev.time).toFixed(1)} sec from your record — you can do it!</div>`:''}<br>
   <button class="big" id="agB">🔁 Again</button> <button class="big" style="background:#5b2bd6;box-shadow:0 8px 0 #3b1d8f" onclick="closeModal();toMap()">🗺️ Map</button>`);if(rec&&prev){$('card').classList.add('shk');fanfare()}
  $('agB').onclick=()=>{closeModal();speedStart(R.i)};
};
if(location.hash==='#seed2'){S.speed={pg3:{time:24.3,stars:3,spm:80},pg4:{time:28.1,stars:2,spm:70}};S.coins=210;renderMap()}
if(/^#spdemo=/.test(location.hash)){const [i,ph]=location.hash.slice(8).split(',');S.unlockAll=true;S.speed[SP[+i].key]={time:40,stars:2,spm:60};speedStart(+i);
  if(ph!=='start'){R.running=true;R.t0=performance.now()-23400;R.mist=1;$('spMist').textContent='✗ 1';$('spGo').style.display='none';$('spStop').style.visibility='visible';document.head.insertAdjacentHTML('beforeend','<style>*{transition:none!important;animation:none!important}</style>');spTick();
    if(ph==='end')setTimeout(()=>$('spStop').onclick(),300)}}

renderMap();

// ---------- points FX ----------
function flyAt(el,txt){const d=document.createElement('div');d.className='fly';d.textContent=txt;const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0};d.style.left=(r.left+r.width/2-30)+'px';d.style.top=(r.top-10)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000);const p=$('ptsR');if(p){p.classList.remove('pop');void p.offsetWidth;p.classList.add('pop')}}
function comboFx(t){const d=document.createElement('div');d.className='combo';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),900);[660,880,1100].forEach((n,k)=>setTimeout(()=>beep(n,.12,'square',.07),k*70))}
function fanfare(){[523,659,784,1046,784,1046,1318].forEach((n,k)=>setTimeout(()=>beep(n,.18,'triangle',.18),k*120))}
function countUp(){document.querySelectorAll('[data-cnt]').forEach(e=>{const to=+e.dataset.cnt;delete e.dataset.cnt;let t0=performance.now();const D=1200;(function f(){const k=Math.min(1,(performance.now()-t0)/D);e.textContent='+'+Math.round(to*(1-Math.pow(1-k,3)));if(Math.floor(k*20)%3===0&&k<1)beep(1200+k*600,.03,'square',.03);if(k<1)requestAnimationFrame(f)})()})}
// ---------- crisp SVG icon layer (replaces emoji in UI chrome) ----------
const SV=(b,p)=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const ICONS={
'⭐':SV(0,'<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="#FFC53D" stroke="#F59E0B" stroke-width="1.2" stroke-linejoin="round"/>'),
'☆':SV(0,'<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="#E5E7F0" stroke="#CDD1E0" stroke-width="1.2" stroke-linejoin="round"/>'),
'🪙':SV(0,'<circle cx="12" cy="12" r="9.5" fill="#FFC53D" stroke="#E59A0B" stroke-width="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke="#E59A0B" stroke-width="1.4"/><path d="M12 8.5v7" stroke="#E59A0B" stroke-width="1.8" stroke-linecap="round"/>'),
'🔥':SV(0,'<path d="M12 2.5c1 3.5 5.5 5.5 5.5 11a5.5 5.5 0 01-11 0c0-2.6 1.4-4 2.4-5 .2 1.8 1 2.8 2 3.2-.4-3.4.3-6.6 1.1-9.2z" fill="#FF7A45"/><path d="M12 12c.9 1.6 2.6 2.4 2.6 4.6a2.6 2.6 0 01-5.2 0c0-1.5 1.3-2.6 2.6-4.6z" fill="#FFC53D"/>'),
'🏆':SV(0,'<path d="M7 3.5h10v5a5 5 0 01-10 0z" fill="#FFC53D" stroke="#E59A0B" stroke-width="1.3"/><path d="M7 5H4v1.5a3.5 3.5 0 003.4 3.5M17 5h3v1.5a3.5 3.5 0 01-3.4 3.5" fill="none" stroke="#E59A0B" stroke-width="1.5"/><path d="M10.5 13.5h3v3h-3zM8 17h8l.6 3.5H7.4z" fill="#E59A0B"/>'),
'🏁':SV(0,'<path d="M5 21V3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 4h14l-2.5 4.5L19 13H5z" fill="currentColor" opacity=".9"/>'),
'🔒':SV(0,'<rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 10.5V8a4 4 0 018 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/>'),
'✖':SV(0,'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'),
'⏱':SV(0,'<circle cx="12" cy="13.5" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 13.5V10M10 2.8h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
'🗺':SV(0,'<path d="M3.5 6l5.5-2 6 2 5.5-2v14l-5.5 2-6-2-5.5 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/>'),
'🔁':SV(0,'<path d="M4.5 12a7.5 7.5 0 0113-5.1M19.5 12a7.5 7.5 0 01-13 5.1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M18 3v4.5h-4.5M6 21v-4.5h4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
'▶':SV(0,'<path d="M8 5.5v13a1 1 0 001.5.9l10.2-6.5a1 1 0 000-1.8L9.5 4.6A1 1 0 008 5.5z" fill="currentColor"/>'),
'⏹':SV(0,'<rect x="5.5" y="5.5" width="13" height="13" rx="3" fill="currentColor"/>'),
'👨':SV(0,'<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20.5a8 8 0 0116 0z" fill="currentColor"/>'),
'⚡':SV(0,'<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z" fill="#FFC53D" stroke="#E59A0B" stroke-width="1.2" stroke-linejoin="round"/>'),
'🎤':SV(0,'<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0012 0M12 17v3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
'🎯':SV(0,'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>'),
'🚀':SV(0,'<path d="M3 12h5M4 7.5h4M4 16.5h4" stroke="#A5B4FC" stroke-width="2" stroke-linecap="round"/><path d="M14.5 3L8 13h5l-1.5 8L18 11h-5z" fill="#6366F1" stroke="#4F46E5" stroke-width="1.2" stroke-linejoin="round"/>'),
'👻':SV(0,'<path d="M5 20V11a7 7 0 0114 0v9l-2.3-1.6L14.3 20 12 18.4 9.7 20l-2.4-1.6z" fill="#9AA1BD"/><circle cx="9.5" cy="11" r="1.3" fill="#fff"/><circle cx="14.5" cy="11" r="1.3" fill="#fff"/>'),
'👹':SV(0,'<path d="M3.5 8l4.5 4 4-7 4 7 4.5-4-2 11h-13z" fill="#FFC53D" stroke="#E59A0B" stroke-width="1.3" stroke-linejoin="round"/>'),
'💪':SV(0,'<circle cx="12" cy="12" r="10" fill="#22C55E"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
'🐢':SV(0,'<circle cx="12" cy="12" r="10" fill="#FFB020"/><path d="M12 7v6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="16.8" r="1.5" fill="#fff"/>'),
'📊':SV(0,'<path d="M5 20V12M10 20V6M15 20v-9M20 20V4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'),
};
const ICRE=/⏱️|🗺️|⭐|☆|🪙|🔥|🏆|🏁|🔒|✖|⏱|🗺|🔁|▶|⏹|👨|⚡|🎤|🎯|🚀|👻|👹|💪|🐢|📊|💨/g;
function iconify(root){if(!root||!root.nodeType)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),hits=[];let n;
  while(n=w.nextNode()){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('svg,#board,#spBoard,script,style'))continue;ICRE.lastIndex=0;if(ICRE.test(n.nodeValue))hits.push(n)}
  hits.forEach(t=>{const s=document.createElement('span');s.className='icw';s.innerHTML=t.nodeValue.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(ICRE,m=>m==='💨'?'':(ICONS[m.replace('\uFE0F','')]||m));t.replaceWith(s)})}
new MutationObserver(ms=>{ms.forEach(m=>{if(m.type==='characterData')iconify(m.target.parentNode||document.body);else m.addedNodes.forEach(a=>{if(a.nodeType===3)iconify(a.parentNode);else if(a.nodeType===1&&a.tagName!=='svg')iconify(a)})})}).observe(document.body,{subtree:true,childList:true,characterData:true});
iconify(document.body);
