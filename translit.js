// Heimish Chasidish (Hungarian/Polish-style Ashkenazi) transliteration from nikud.
(function(root){
const LN={'אָלֶף':'AH-lef','בֵית':'VAYS','בֵּית':'BAYS','גִימֶל':'GIM-mel','דָלֶת':'DAH-led','הֵא':'HAY','וָו':'VUV','זַיִן':'ZAH-yin','חֵית':'KHES','טֵית':'TES','יוּד':'YIDD','כָף':'KHUF','כָּף':'KUF','לָמֶד':'LAH-med','מֵם':'MEM','נוּן':'NIN','סָמֶךְ':'SAH-mekh','עַיִן':'AH-yin','פֵא':'FAY','פֵּא':'PAY','צָדִי':'TSAH-dik','צַדִי':'TSAH-dik','קוּף':'KIF','רֵישׁ':'RAYSH','שִׁין':'SHIN','שִׂין':'SIN','תָו':'SUF','תָּו':'TUF'};
const V={'\u05B8':'u','\u05C7':'u','\u05B7':'a','\u05B2':'a','\u05B5':'ay','\u05B6':'e','\u05B1':'e','\u05B4':'i','\u05B9':'oy','\u05BA':'oy','\u05B3':'u','\u05BB':'ee'};
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
  const a=sylls(raw);const parts=[];let cur='';let prevSheva=false;
  for(let k=0;k<a.length;k++){let {ch,m}=a[k];const first=k===0,last=k===a.length-1;
    // vav as vowel letter
    if(ch==='ו'&&m==='\u05BC'&&!first){cur+='ee';parts.push(cur);cur='';continue}
    if(ch==='ו'&&m==='\u05BC'&&first){parts.push('ee');continue}
    if(ch==='ו'&&m.includes('\u05B9')&&!first&&!/[\u05B0-\u05BB]/.test(m.replace('\u05B9',''))){cur+='oy';parts.push(cur);cur='';continue}
    // yud as mater after chirik/tzeirei/segol
    if(ch==='י'&&!m.replace('\u05BC','')&&k>0&&/[\u05B4\u05B5\u05B6]/.test(a[k-1].m)){if(parts.length){parts[parts.length-1]+=(a[k-1].m.includes('\u05B4')?'':'')}continue}
    if(ch==='א'&&!m&&k>0)continue;
    const c=cons(ch,m,first,last);
    const nx=a[k+1];const bareM=!m.replace(/[\u05BC\u05C1\u05C2]/g,'');
    if(bareM&&nx&&nx.ch==='ו'&&(nx.m==='\u05BC'||nx.m==='\u05B9')){parts.push(cur+c+(nx.m==='\u05BC'?'ee':'oy'));cur='';k++;prevSheva=false;continue}
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
  return p.map((x,i)=>i===st&&p.length>1?x.toUpperCase():x).join('-');
}
function translit(text){return text.split(/\s+/).filter(Boolean).map(word).filter(Boolean).join(' ')}
root.translit=translit;if(typeof module!=='undefined')module.exports={translit,word};
})(typeof window!=='undefined'?window:globalThis);
