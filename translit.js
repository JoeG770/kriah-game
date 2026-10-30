// Heimish Chasidish (Hungarian/Polish-style Ashkenazi) transliteration from nikud.
(function(root){
const LN={'אָלֶף':'AH-lef','בֵית':'VAISS','בֵּית':'BAISS','גִימֶל':'GI-mel','דָלֶת':'DAH-led','הֵא':'HAI','וָו':'VUV','זַיִן':'ZAI-en','חֵית':'KHESS','טֵית':'TESS','יוּד':'YID','כָף':'KHUF','כָּף':'KUF','לָמֶד':'LAH-med','מֵם':'MEM','נוּן':'NIN','סָמֶךְ':'SAH-mech','עַיִן':'AI-en','פֵא':'FAI','פֵּא':'PAI','צָדִי':'TSAH-dik','צַדִי':'TSAH-dik','קוּף':'KIF','רֵישׁ':'Raish.','שִׁין':'SHIN','שִׂין':'SIN','תָו':'SUF','תָּו':'TUF','כַּף':'KUF',
 'כָף סוֹפִית':'EN-de KHUF','כָּף סוֹפִית':'EN-de KUF','מֵם סוֹפִית':'EN-de MEM','נוּן סוֹפִית':'EN-de NIN','פֵא סוֹפִית':'EN-de FAI','צָדִי סוֹפִית':'EN-de TSAH-dik',
 'יִשְׂרָאֵל':'yis-RU-el','שַׁבָּת':'SHU-bess','בָּרוּךְ':'BU-rikh','תּוֹרָה':'TOY-reh','בֵּית':'BAISS',
 'ך':'EN-de KHUF','ךּ':'EN-de KUF','ם':'EN-de MEM','ן':'EN-de NIN','ף':'EN-de FAI','ץ':'EN-de TSAH-dik'};
const V={'\u05B8':'u','\u05C7':'u','\u05B7':'a','\u05B2':'a','\u05B5':'ai','\u05B6':'e','\u05B1':'e','\u05B4':'i','\u05B9':'oy','\u05BA':'oy','\u05B3':'u','\u05BB':'i'};
function sylls(w){ // -> [{c, v}] per consonant
  const s=w.replace(/[^\u05D0-\u05EA\u05B0-\u05C7]/g,'');const out=[];
  for(let i=0;i<s.length;i++){const ch=s[i];if(!/[\u05D0-\u05EA]/.test(ch))continue;let m='';let j=i+1;while(j<s.length&&/[\u05B0-\u05C7]/.test(s[j]))m+=s[j++];out.push({ch,m});}
  return out}
function cons(ch,m,first,last,prev){const dg=m.includes('\u05BC');
  switch(ch){case'א':case'ע':return'';case'ב':return dg?'b':'v';case'ג':return'g';case'ד':return'd';case'ה':return last&&!/[\u05B0-\u05BB]/.test(m.replace('\u05BC',''))?'':'h';
  case'ו':return'v';case'ז':return'z';case'ח':return'kh';case'ט':return't';case'י':return'y';case'כ':case'ך':return dg?'k':'kh';case'ל':return'l';case'מ':case'ם':return'm';case'נ':case'ן':return'n';case'ס':return's';
  case'פ':case'ף':return dg?'p':'f';case'צ':case'ץ':return'ts';case'ק':return'k';case'ר':return'r';case'ש':return m.includes('\u05C2')?'s':'sh';case'ת':return dg?'t':'s'}return''}
function word(w){
  const raw=w.replace(/[^\u05D0-\u05EA\u05B0-\u05C7]/g,'');if(LN[raw])return LN[raw];
  const a=sylls(raw);if(a.length===1&&a[0].m.includes('\u05B0')){const c=cons(a[0].ch,a[0].m,true,false);return c+'e'} // lone shva syllable in drill = short 'e'
  const parts=[];let cur='';let prevSheva=false;
  for(let k=0;k<a.length;k++){let {ch,m}=a[k];const first=k===0,last=k===a.length-1;
    // vav as vowel letter
    if(ch==='ו'&&m==='\u05BC'&&!first){cur+='i';parts.push(cur);cur='';continue}
    if(ch==='ו'&&m==='\u05BC'&&first){parts.push('i');continue}
    if(ch==='ו'&&m.includes('\u05B9')&&!first&&!/[\u05B0-\u05BB]/.test(m.replace('\u05B9',''))){cur+='oy';parts.push(cur);cur='';continue}
    // yud as mater after chirik/tzeirei/segol
    if(ch==='י'&&!m.replace('\u05BC','')&&k>0&&/[\u05B4\u05B5\u05B6]/.test(a[k-1].m)){if(parts.length){parts[parts.length-1]+=(a[k-1].m.includes('\u05B4')?'':'')}continue}
    if(ch==='א'&&!m&&k>0)continue;
    const c=cons(ch,m,first,last);
    const nx=a[k+1];const bareM=!m.replace(/[\u05BC\u05C1\u05C2]/g,'');
    if(bareM&&nx&&nx.ch==='ו'&&(nx.m==='\u05BC'||nx.m==='\u05B9')){parts.push(cur+c+(nx.m==='\u05BC'?'i':'oy'));cur='';k++;prevSheva=false;continue}
    if(last&&m.includes('\u05B0')){if(parts.length)parts[parts.length-1]+=c;else parts.push(cur+c);cur='';continue}
    let v='';for(const x of m)if(V[x]){v=V[x];break}
    if(ch==='ח'&&last&&m.includes('\u05B7')&&k>0){parts.push(cur+'akh');cur='';continue} // patach ganuv
    if(!v&&m.includes('\u05B0')){ // sheva
      if(first||prevSheva){cur+=c+'e';parts.push(cur);cur='';prevSheva=false;continue}
      if(parts.length)parts[parts.length-1]+=c;else cur+=c;prevSheva=true;continue}
    if(!v&&!m.replace(/[\u05BC\u05C1\u05C2]/g,'')){ // bare consonant (final/quiescent)
      if(parts.length)parts[parts.length-1]+=c;else cur+=c;prevSheva=true;continue}
    prevSheva=false;parts.push(cur+c+v);cur='';
  }
  if(cur){if(parts.length)parts[parts.length-1]+=cur;else parts.push(cur)}
  const p=parts.filter(Boolean);if(!p.length)return'';
  const st=p.length>=2?p.length-2:0; // penultimate stress (heimish)
  let r=p.map((x,i)=>i===st&&p.length>1?x.toUpperCase():x).join('-');
  const L1=a[a.length-1]; // crisp final s: final samech / soft tav -> 'ss' (never 'z')
  if(L1&&(L1.ch==='ס'||(L1.ch==='ת'&&!L1.m.includes('\u05BC')))&&/s$/i.test(r)&&!/ts$/i.test(r))r+=(/S$/.test(r)?'S':'s');
  return r;
}
function translit(text){const t=text.trim().replace(/[.,:;!?]/g,'');if(LN[t])return LN[t];return text.split(/\s+/).filter(Boolean).map(word).filter(Boolean).join(' ')}
root.translit=translit;if(typeof module!=='undefined')module.exports={translit,word};
})(typeof window!=='undefined'?window:globalThis);
