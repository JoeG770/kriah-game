'use strict';
// ===== Jewish-themed rewards, treasure wallet, mascots & dancing celebration =====
// Wallet: S.coins is stored in silver units. 10 silver = 1 gold, 5 gold = 1 pearl, 5 pearls = 1 diamond.
const TIER=[['diamond',250],['pearl',50],['gold',10],['silver',1]];
const GEM={
silver:'<svg class="ic gem" viewBox="0 0 24 24"><defs><radialGradient id="gs" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#D7DCE6"/><stop offset="1" stop-color="#9AA3B5"/></radialGradient></defs><circle cx="12" cy="12" r="9.5" fill="url(#gs)" stroke="#8790A3" stroke-width="1.3"/><circle cx="12" cy="12" r="6" fill="none" stroke="#8790A3" stroke-width="1.1"/><path d="M12 8l1.2 2.5 2.6.1-2 1.7.7 2.6L12 13.4l-2.5 1.5.7-2.6-2-1.7 2.6-.1z" fill="#8790A3"/></svg>',
gold:'<svg class="ic gem" viewBox="0 0 24 24"><defs><radialGradient id="gg" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".5" stop-color="#FFC53D"/><stop offset="1" stop-color="#D98A00"/></radialGradient></defs><circle cx="12" cy="12" r="9.5" fill="url(#gg)" stroke="#C27C00" stroke-width="1.3"/><circle cx="12" cy="12" r="6" fill="none" stroke="#C27C00" stroke-width="1.1"/><path d="M12 7.6l1.3 2.6 2.9.2-2.2 1.9.7 2.9L12 13.6l-2.7 1.6.7-2.9-2.2-1.9 2.9-.2z" fill="#C27C00"/></svg>',
pearl:'<svg class="ic gem" viewBox="0 0 24 24"><defs><radialGradient id="gp" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#F6EEF7"/><stop offset="1" stop-color="#C9B8D6"/></radialGradient></defs><circle cx="12" cy="12" r="9" fill="url(#gp)" stroke="#B9A6C9" stroke-width="1"/><ellipse cx="9" cy="8.5" rx="2.6" ry="1.6" fill="#fff" opacity=".9"/></svg>',
diamond:'<svg class="ic gem" viewBox="0 0 24 24"><path d="M6 4h12l4 5.5L12 21 2 9.5z" fill="#7DD3FC" stroke="#0284C7" stroke-width="1.2" stroke-linejoin="round"/><path d="M2 9.5h20M8 4l-2 5.5L12 21l6-11.5L16 4M6 9.5L12 4l6 5.5" fill="none" stroke="#0284C7" stroke-width=".9" stroke-linejoin="round"/><path d="M8 5.5l-1.3 3" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>'};
const GEMNAME={silver:'Silver coins',gold:'Gold coins',pearl:'Pearls',diamond:'Diamonds'};
function splitW(n){n=Math.max(0,Math.floor(n));const o={};TIER.forEach(([k,v])=>{o[k]=Math.floor(n/v);n%=v});return o}
function walletHTML(n,compact){const o=splitW(n);const parts=TIER.filter(([k])=>!compact||o[k]||k==='silver'&&!TIER.some(([q])=>o[q]));
  return '<span class="wal">'+parts.map(([k])=>`<span class="wt" title="${GEMNAME[k]}">${GEM[k]}<b>${o[k]}</b></span>`).join('')+'</span>'}
const priceHTML=n=>n?walletHTML(n,true):'<span class="free">Free</span>';

// ---------- Mascot cast (SVG, viewBox 0 0 100 110; limbs in groups for dancing) ----------
const LEGS=(c='#1F2937')=>`<g class="lL"><rect x="38" y="84" width="8" height="16" rx="4" fill="${c}"/><ellipse cx="40" cy="101" rx="8" ry="4" fill="#111"/></g><g class="lR"><rect x="54" y="84" width="8" height="16" rx="4" fill="${c}"/><ellipse cx="60" cy="101" rx="8" ry="4" fill="#111"/></g>`;
const ARMS=(c,h='#F8C9A0')=>`<g class="aL"><path d="M30 64 Q18 70 16 80" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="16" cy="81" r="5" fill="${h}"/></g><g class="aR"><path d="M70 64 Q82 70 84 80" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="84" cy="81" r="5" fill="${h}"/></g>`;
const EYES=(y=40,dx=9)=>`<g class="eyes"><ellipse cx="${50-dx}" cy="${y}" rx="3.6" ry="4.4" fill="#1F2937"/><ellipse cx="${50+dx}" cy="${y}" rx="3.6" ry="4.4" fill="#1F2937"/><circle cx="${51-dx}" cy="${y-1.6}" r="1.3" fill="#fff"/><circle cx="${51+dx}" cy="${y-1.6}" r="1.3" fill="#fff"/></g>`;
const W=(inner,cls)=>`<svg class="carsvg mascot ${cls}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const MASCOT={
 yanky:{name:'Reb Shunkle',sub:'the Chassidishe boy · ר׳ שונקל',price:0,svg:()=>W(`${LEGS()}
  <path d="M30 58 Q50 52 70 58 L72 88 Q50 92 28 88Z" fill="#fff" stroke="#E5E7EB"/><path d="M30 60 L30 88 Q38 90 44 90 L44 56Z M70 60 L70 88 Q62 90 56 90 L56 56Z" fill="#1F2937"/>
  <path d="M36 86 v12 M40 86 v11 M60 86 v12 M64 86 v11" stroke="#fff" stroke-width="1.6" stroke-linecap="round" class="tz"/>
  ${ARMS('#1F2937')}
  <circle cx="50" cy="38" r="22" fill="#FAD3B0"/>
  <g class="pL"><path d="M29 38 q-6 4 0 8 q6 4 0 8 q-6 4 0 8 q5 3 1 7" stroke="#8B5A2B" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>
  <g class="pR"><path d="M71 38 q6 4 0 8 q-6 4 0 8 q6 4 0 8 q-5 3 -1 7" stroke="#8B5A2B" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>
  <path d="M30 32 Q34 16 50 16 Q66 16 70 32 Q60 24 50 25 Q40 24 30 32Z" fill="#8B5A2B"/>
  <g class="hat"><path d="M34 22 Q50 6 66 22 Q50 17 34 22Z" fill="#111827"/><circle cx="50" cy="14" r="2" fill="#374151"/></g>
  ${EYES(39,8)}<circle cx="37" cy="47" r="3.6" fill="#FCA5A5" opacity=".7"/><circle cx="63" cy="47" r="3.6" fill="#FCA5A5" opacity=".7"/>
  <path class="mouth" d="M42 48 Q50 56 58 48" stroke="#9A3412" stroke-width="2.6" fill="#fff" stroke-linecap="round"/>`,'m-yanky')},
 yokel:{name:'Reb Yokel',sub:'the jolly baker · ר׳ יאקל',price:120,svg:()=>W(`${LEGS()}
  <path d="M28 58 Q50 50 72 58 L74 88 Q50 94 26 88Z" fill="#7C3AED"/><path d="M48 56 h4 v34 h-4z" fill="#5B21B6"/><circle cx="50" cy="66" r="1.8" fill="#FDE68A"/><circle cx="50" cy="76" r="1.8" fill="#FDE68A"/>
  ${ARMS('#7C3AED')}
  <circle cx="50" cy="38" r="22" fill="#F8C9A0"/>
  <path class="beard" d="M29 42 Q30 72 50 76 Q70 72 71 42 Q64 56 50 56 Q36 56 29 42Z" fill="#E5631F"/>
  <g class="pL"><path d="M28 34 q-5 5 0 10 q5 5 0 10" stroke="#E5631F" stroke-width="4" fill="none" stroke-linecap="round"/></g><g class="pR"><path d="M72 34 q5 5 0 10 q-5 5 0 10" stroke="#E5631F" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  <g class="hat"><ellipse cx="50" cy="20" rx="26" ry="5" fill="#111827"/><path d="M34 20 Q34 2 50 2 Q66 2 66 20Z" fill="#111827"/><path d="M34 16 H66" stroke="#4B5563" stroke-width="3"/></g>
  ${EYES(36,8)}<ellipse cx="50" cy="44" rx="4.5" ry="3.5" fill="#F87171"/>
  <path class="mouth" d="M42 50 Q50 58 58 50Z" fill="#7F1D1D"/>`,'m-yokel')},
 kerel:{name:'Reb Kerel',sub:'the wise professor · ר׳ קערעל',price:220,svg:()=>W(`${LEGS('#374151')}
  <path d="M28 58 Q50 50 72 58 L74 88 Q50 94 26 88Z" fill="#0F766E"/><path d="M40 56 L50 72 L60 56" fill="#fff"/><path d="M48 60 L50 80 L52 60Z" fill="#DC2626"/>
  ${ARMS('#0F766E')}
  <circle cx="50" cy="40" r="21" fill="#FAD3B0"/>
  <path class="beard" d="M30 46 Q32 84 50 90 Q68 84 70 46 Q62 60 50 60 Q38 60 30 46Z" fill="#E5E7EB" stroke="#CBD5E1"/>
  <g class="pL"><path d="M30 36 q-4 6 0 12 q4 6 0 12" stroke="#D1D5DB" stroke-width="3.5" fill="none" stroke-linecap="round"/></g><g class="pR"><path d="M70 36 q4 6 0 12 q-4 6 0 12" stroke="#D1D5DB" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
  <g class="hat"><ellipse cx="50" cy="24" rx="30" ry="6" fill="#1F2937"/><path d="M32 24 Q32 8 50 8 Q68 8 68 24Z" fill="#1F2937"/><path d="M42 9 Q50 14 58 9" stroke="#4B5563" stroke-width="2" fill="none"/></g>
  <g class="eyes"><circle cx="42" cy="40" r="2.6" fill="#1F2937"/><circle cx="58" cy="40" r="2.6" fill="#1F2937"/></g>
  <circle cx="42" cy="40" r="7" fill="#fff" fill-opacity=".25" stroke="#B45309" stroke-width="2.2"/><circle cx="58" cy="40" r="7" fill="#fff" fill-opacity=".25" stroke="#B45309" stroke-width="2.2"/><path d="M49 40 h2" stroke="#B45309" stroke-width="2.2"/>
  <path d="M38 33 q4 -3 8 0 M54 33 q4 -3 8 0" stroke="#9CA3AF" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path class="mouth" d="M44 52 Q50 56 56 52" stroke="#9A3412" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,'m-kerel')},
 car:{name:'Race Car',sub:'the classic',price:0,svg:()=>CARSVG},
 owl:{name:'Rebbe Owl',sub:'wise & sharp · דער אויל',price:80,svg:()=>W(`<g class="lL"><path d="M40 92 l-4 8 M42 92 v9 M44 92 l4 8" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/></g><g class="lR"><path d="M56 92 l-4 8 M58 92 v9 M60 92 l4 8" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/></g>
  <g class="aL"><path d="M24 50 Q10 66 20 84 Q28 74 30 60Z" fill="#7C5A3A"/></g><g class="aR"><path d="M76 50 Q90 66 80 84 Q72 74 70 60Z" fill="#7C5A3A"/></g>
  <ellipse cx="50" cy="60" rx="28" ry="34" fill="#A0764B"/><ellipse cx="50" cy="70" rx="17" ry="20" fill="#E9D5B5"/><path d="M40 64 q5 4 10 0 q5 4 10 0 M40 74 q5 4 10 0 q5 4 10 0" stroke="#C4A57E" stroke-width="1.6" fill="none"/>
  <path d="M26 32 L32 18 L40 30Z M74 32 L68 18 L60 30Z" fill="#7C5A3A"/>
  <circle cx="39" cy="42" r="11" fill="#fff" stroke="#1F2937" stroke-width="2.4"/><circle cx="61" cy="42" r="11" fill="#fff" stroke="#1F2937" stroke-width="2.4"/><path d="M50 42h0" stroke="#1F2937" stroke-width="2.4"/><path d="M48 41 h4" stroke="#1F2937" stroke-width="2.4"/>
  <g class="eyes"><circle cx="40" cy="43" r="5" fill="#1F2937"/><circle cx="60" cy="43" r="5" fill="#1F2937"/><circle cx="41.5" cy="41.5" r="1.6" fill="#fff"/><circle cx="61.5" cy="41.5" r="1.6" fill="#fff"/></g>
  <path d="M46 52 L50 58 L54 52Z" fill="#F59E0B"/><path d="M38 28 Q50 16 62 28 Q50 24 38 28Z" fill="#1E3A8A"/>`,'m-owl')},
 dreidel:{name:'Spinny',sub:'the Dreidel · דריידל',price:150,svg:()=>W(`${LEGS('#2563EB')}${ARMS('#3B82F6','#fff')}
  <rect x="46" y="4" width="8" height="16" rx="3" fill="#1D4ED8"/><path d="M24 20 H76 V64 L50 92 L24 64Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" stroke-linejoin="round"/><path d="M24 20 H40 V70 L24 64Z" fill="#60A5FA" opacity=".7"/>
  ${EYES(36,10)}<path class="mouth" d="M42 46 Q50 53 58 46" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <text x="50" y="72" font-size="16" text-anchor="middle" fill="#FDE68A" font-family="serif" font-weight="bold">ש</text>`,'m-dreidel')},
 challah:{name:'Challah Chaim',sub:'freshly braided · חלה',price:300,svg:()=>W(`${LEGS('#92400E')}${ARMS('#D97706','#FBBF24')}
  <ellipse cx="50" cy="62" rx="36" ry="24" fill="#D97706"/><path d="M18 62 Q30 44 44 52 Q56 40 70 52 Q84 50 82 64" fill="none" stroke="#B45309" stroke-width="3"/><path d="M20 70 Q34 60 48 70 Q62 60 80 70" fill="none" stroke="#B45309" stroke-width="3"/>
  <g fill="#FEF3C7"><ellipse cx="34" cy="50" rx="1.5" ry="1"/><ellipse cx="58" cy="46" rx="1.5" ry="1"/><ellipse cx="68" cy="58" rx="1.5" ry="1"/><ellipse cx="42" cy="76" rx="1.5" ry="1"/></g>
  ${EYES(58,9)}<path class="mouth" d="M43 67 Q50 73 57 67" stroke="#7C2D12" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,'m-challah')},
 lion:{name:'Aryeh',sub:'the Lion of Yehuda · אַריה',price:500,svg:()=>W(`${LEGS('#D97706')}${ARMS('#F59E0B','#FBBF24')}
  <path d="M34 60 Q50 56 66 60 L68 88 Q50 92 32 88Z" fill="#F59E0B"/>
  <circle cx="50" cy="40" r="28" fill="#B45309"/><g fill="#C2410C"><circle cx="26" cy="30" r="8"/><circle cx="74" cy="30" r="8"/><circle cx="24" cy="50" r="8"/><circle cx="76" cy="50" r="8"/><circle cx="50" cy="66" r="8"/></g>
  <circle cx="50" cy="42" r="19" fill="#FBBF24"/>${EYES(38,7)}<ellipse cx="50" cy="47" rx="4" ry="3" fill="#7C2D12"/><path class="mouth" d="M44 51 Q50 56 56 51" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M34 16 L38 4 L44 13 L50 2 L56 13 L62 4 L66 16Z" fill="#FFC53D" stroke="#C27C00" stroke-width="1.5" stroke-linejoin="round"/><circle cx="50" cy="12" r="2" fill="#EF4444"/>`,'m-lion')},
 zaidy:{name:'Zaidy Bear',sub:'with his shtreimel · זיידע',price:800,svg:()=>W(`${LEGS()}${ARMS('#1F2937','#8B5E3C')}
  <path d="M30 58 Q50 52 70 58 L72 88 Q50 92 28 88Z" fill="#1F2937"/>
  <circle cx="30" cy="22" r="8" fill="#8B5E3C"/><circle cx="70" cy="22" r="8" fill="#8B5E3C"/><circle cx="50" cy="38" r="22" fill="#A0703F"/>
  <path d="M34 48 Q50 74 66 48 Q50 56 34 48Z" fill="#F3F4F6"/>
  <ellipse cx="50" cy="44" rx="9" ry="6" fill="#D6B48C"/><ellipse cx="50" cy="42" rx="3.6" ry="2.6" fill="#1F2937"/>${EYES(33,9)}
  <ellipse cx="50" cy="18" rx="27" ry="8" fill="#5B3A1E"/><path d="M30 18 Q30 4 50 4 Q70 4 70 18Z" fill="#111827"/><path d="M24 18 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0" stroke="#7A4E28" stroke-width="2" fill="none"/>`,'m-zaidy')},
 esrog:{name:'Esrog Eli',sub:'with his lulav · אתרוג',price:1200,svg:()=>W(`${LEGS('#65A30D')}${ARMS('#A3E635','#FDE047')}
  <g class="lulav"><path d="M84 80 L80 6" stroke="#15803D" stroke-width="5" stroke-linecap="round"/><path d="M80 20 l-8 -8 M81 32 l9 -8 M82 44 l-8 -6" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/></g>
  <path d="M50 18 Q78 26 76 58 Q74 88 50 92 Q26 88 24 58 Q22 26 50 18Z" fill="#FDE047" stroke="#EAB308" stroke-width="2"/><path d="M50 18 v-8" stroke="#65A30D" stroke-width="4" stroke-linecap="round"/>
  <g fill="#EAB308" opacity=".6"><circle cx="36" cy="40" r="1.2"/><circle cx="62" cy="36" r="1.2"/><circle cx="66" cy="68" r="1.2"/><circle cx="34" cy="72" r="1.2"/></g>
  ${EYES(50,9)}<path class="mouth" d="M42 60 Q50 67 58 60" stroke="#854D0E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,'m-esrog')},
 star:{name:'Diamond Dovid',sub:'shining Magen Dovid · מגן דוד',price:2000,svg:()=>W(`${LEGS('#0369A1')}${ARMS('#38BDF8','#BAE6FD')}
  <path d="M50 8 L80 60 H20Z" fill="#38BDF8" stroke="#0284C7" stroke-width="3" stroke-linejoin="round"/><path d="M50 84 L20 32 H80Z" fill="#7DD3FC" stroke="#0284C7" stroke-width="3" stroke-linejoin="round" opacity=".92"/>
  ${EYES(46,8)}<path class="mouth" d="M43 55 Q50 61 57 55" stroke="#0C4A6E" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M30 26 l4 -6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,'m-star')},
};
window.MASCOT=MASCOT;

// ---------- Treasure collection (objects, no faces) ----------
const T=(p)=>`<svg class="treas" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${p}</svg>`;
const TREAS=[
 ['candles','Shabbos Candles','לעכט',40,T('<rect x="14" y="44" width="36" height="8" rx="3" fill="#CBD5E1"/><rect x="18" y="20" width="9" height="24" rx="2" fill="#F8FAFC" stroke="#CBD5E1"/><rect x="37" y="20" width="9" height="24" rx="2" fill="#F8FAFC" stroke="#CBD5E1"/><path d="M22.5 6 q5 7 0 12 q-5 -5 0 -12zM41.5 6 q5 7 0 12 q-5 -5 0 -12z" fill="#FBBF24"/><path d="M22.5 11 q2 3 0 5 q-2 -2 0 -5zM41.5 11 q2 3 0 5 q-2 -2 0 -5z" fill="#FEF3C7"/>')],
 ['challah','Challah','חלה',60,T('<ellipse cx="32" cy="40" rx="26" ry="14" fill="#D97706"/><path d="M8 40 Q18 28 28 34 Q36 26 44 34 Q54 30 56 42" fill="none" stroke="#B45309" stroke-width="3"/><path d="M10 46 Q22 40 32 46 Q42 40 54 46" fill="none" stroke="#B45309" stroke-width="3"/>')],
 ['cup','Kiddush Cup','בכר',90,T('<path d="M16 8 H48 Q48 34 32 36 Q16 34 16 8Z" fill="#E5E7EB" stroke="#94A3B8" stroke-width="2"/><path d="M18 14 H46 Q45 32 32 33 Q19 32 18 14Z" fill="#9F1239"/><rect x="29" y="36" width="6" height="14" fill="#CBD5E1"/><path d="M18 56 Q32 46 46 56Z" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2"/>')],
 ['dreidel','Dreidel','דריידל',120,T('<rect x="29" y="4" width="6" height="12" rx="2" fill="#1D4ED8"/><path d="M14 16 H50 V40 L32 60 L14 40Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" stroke-linejoin="round"/><text x="32" y="38" font-size="18" text-anchor="middle" fill="#FDE68A" font-family="serif" font-weight="bold">נ</text>')],
 ['mezuzah','Mezuzah','מזוזה',160,T('<rect x="24" y="6" width="16" height="52" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2"/><text x="32" y="26" font-size="14" text-anchor="middle" fill="#fff" font-family="serif" font-weight="bold">ש</text><circle cx="32" cy="44" r="3" fill="#BAE6FD"/>')],
 ['shofar','Shofar','שופר',220,T('<path d="M6 46 Q20 50 36 36 Q48 24 50 10 L60 14 Q58 34 42 46 Q24 60 6 54Z" fill="#E7C9A0" stroke="#A16207" stroke-width="2" stroke-linejoin="round"/><path d="M20 50 Q30 46 38 40" stroke="#A16207" stroke-width="1.5" fill="none"/>')],
 ['lulav','Lulav & Esrog','לולב',300,T('<path d="M20 60 L26 4" stroke="#15803D" stroke-width="5" stroke-linecap="round"/><path d="M25 16 l-9 -6 M24 28 l10 -8 M23 40 l-9 -6" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/><ellipse cx="44" cy="44" rx="13" ry="15" fill="#FDE047" stroke="#EAB308" stroke-width="2"/><path d="M44 29 v-5" stroke="#65A30D" stroke-width="3" stroke-linecap="round"/>')],
 ['menorah','Menorah','מנורה',400,T('<path d="M32 14 V50 M8 14 Q8 36 32 36 Q56 36 56 14 M16 14 Q16 30 32 30 Q48 30 48 14 M24 14 Q24 24 32 24 Q40 24 40 14" stroke="#F59E0B" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M20 58 H44 L40 50 H24Z" fill="#F59E0B"/><g fill="#FB923C"><path d="M8 6 q3 4 0 7 q-3 -3 0 -7zM16 6 q3 4 0 7 q-3 -3 0 -7zM24 6 q3 4 0 7 q-3 -3 0 -7zM32 4 q3 4 0 7 q-3 -3 0 -7zM40 6 q3 4 0 7 q-3 -3 0 -7zM48 6 q3 4 0 7 q-3 -3 0 -7zM56 6 q3 4 0 7 q-3 -3 0 -7z"/></g>')],
 ['tallis','Tallis','טלית',500,T('<rect x="6" y="14" width="52" height="34" rx="3" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/><path d="M6 20 H58 M6 24 H58 M6 38 H58 M6 42 H58" stroke="#1E3A8A" stroke-width="2.4"/><rect x="24" y="10" width="16" height="8" rx="2" fill="#E5C07B"/><path d="M8 48 v10 M12 48 v8 M52 48 v10 M56 48 v8" stroke="#CBD5E1" stroke-width="1.6"/>')],
 ['chumash','Chumash','חומש',650,T('<rect x="10" y="8" width="44" height="50" rx="4" fill="#7F1D1D"/><rect x="14" y="8" width="40" height="46" rx="3" fill="#991B1B"/><rect x="20" y="16" width="28" height="18" rx="2" fill="none" stroke="#FBBF24" stroke-width="1.6"/><text x="34" y="30" font-size="11" text-anchor="middle" fill="#FBBF24" font-family="serif" font-weight="bold">חומש</text>')],
 ['tefillin','Tefillin','תפילין',800,T('<path d="M32 22 V60 M24 22 Q10 40 18 60" stroke="#111827" stroke-width="3" fill="none"/><rect x="20" y="6" width="24" height="20" rx="2" fill="#111827"/><text x="32" y="21" font-size="12" text-anchor="middle" fill="#9CA3AF" font-family="serif" font-weight="bold">ש</text>')],
 ['crown','Crown of Torah','כתר תורה',1000,T('<path d="M8 50 L12 18 L24 32 L32 10 L40 32 L52 18 L56 50Z" fill="#FFC53D" stroke="#C27C00" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="48" width="48" height="8" rx="2" fill="#E59A0B"/><circle cx="32" cy="38" r="4" fill="#EF4444"/><circle cx="20" cy="42" r="3" fill="#38BDF8"/><circle cx="44" cy="42" r="3" fill="#22C55E"/>')],
 ['torah','Sefer Torah','ספר תורה',1300,T('<rect x="8" y="4" width="10" height="56" rx="4" fill="#92400E"/><rect x="46" y="4" width="10" height="56" rx="4" fill="#92400E"/><rect x="14" y="10" width="36" height="44" fill="#FEF3C7" stroke="#D6B48C"/><path d="M19 18h26M19 24h26M19 30h26M19 36h26M19 42h26M19 48h20" stroke="#57534E" stroke-width="1.6"/>')],
 ['aron','Aron Kodesh','ארון קודש',1700,T('<path d="M8 22 Q32 2 56 22 V60 H8Z" fill="#7C2D12" stroke="#451A03" stroke-width="2"/><rect x="14" y="26" width="36" height="30" rx="2" fill="#1E3A8A"/><path d="M32 26 V56" stroke="#FBBF24" stroke-width="1.6"/><path d="M26 34 h12 M23 34 l3 5 l3 -5 M35 34 l3 5 l3 -5" stroke="#FBBF24" stroke-width="1.4" fill="none"/><path d="M24 16 h16" stroke="#FBBF24" stroke-width="2"/>')],
 ['kosel','The Kosel','כותל',2500,T('<rect x="4" y="12" width="56" height="48" fill="#E7D3A8"/><g stroke="#C2A878" stroke-width="1.6"><path d="M4 22H60M4 32H60M4 42H60M4 52H60M16 12V22M36 12V22M26 22V32M48 22V32M14 32V42M38 32V42M24 42V52M50 42V52M18 52V60M40 52V60"/></g><path d="M10 26 q3 -4 6 0 M44 46 q3 -4 6 0" stroke="#65A30D" stroke-width="2" fill="none"/>')],
];
S.treas=S.treas||[];

// ---------- migrate old saves ----------
(function(){const OLD={'🚀':'owl','🦄':'dreidel','🐉':'challah','🏎️':'lion','🦖':'zaidy','🛸':'esrog','🐎':'star','🚗':'car'};
  S.owned=[...new Set(['yanky','car',...(S.owned||[]).map(c=>OLD[c]||c)].filter(c=>MASCOT[c]))];
  if(!MASCOT[S.char])S.char=OLD[S.char]||'yanky';save()})();

const _md=modal;modal=function(h){$('card').classList.remove('shopcard');_md(h)};
// ---------- shop ----------
let shopTab='racers';
openChars=function(){const n=S.coins;
  const tabs=`<div class="tabs"><button class="${shopTab==='racers'?'on':''}" data-t="racers">Characters</button><button class="${shopTab==='treas'?'on':''}" data-t="treas">Treasures <small>${S.treas.length}/${TREAS.length}</small></button></div>`;
  const grid=shopTab==='racers'
   ?`<div class="shop">${Object.entries(MASCOT).map(([k,m])=>{const own=S.owned.includes(k);return `<button class="it ${S.char===k?'sel':''} ${own?'own':n<m.price?'lock':''}" data-k="${k}" data-p="${m.price}"><div class="art">${m.svg()}</div><div class="nm">${m.name}</div><div class="sb">${m.sub}</div><div class="pr">${own?(S.char===k?'✓ Racing':'Owned · tap to pick'):priceHTML(m.price)}</div></button>`}).join('')}</div>`
   :`<div class="shop">${TREAS.map(([k,nm,he,p,art])=>{const own=S.treas.includes(k);return `<button class="it ${own?'own':n<p?'lock':''}" data-k="${k}" data-p="${p}"><div class="art">${art}</div><div class="nm">${nm}</div><div class="sb he">${he}</div><div class="pr">${own?'✓ In your collection':priceHTML(p)}</div></button>`}).join('')}</div>`;
  modal(`<div class="shophd"><div><div class="ttl">Treasure Shop</div><div class="hint">Read to earn coins · 10 silver = 1 gold · 5 gold = 1 pearl · 5 pearls = 1 diamond</div></div>${walletHTML(n)}</div>${tabs}${grid}<button class="big" onclick="closeModal();renderMap()">Close</button>`);
  $('card').classList.add('shopcard');
  document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{shopTab=b.dataset.t;openChars()});
  document.querySelectorAll('.shop .it').forEach(b=>b.onclick=()=>{const k=b.dataset.k,p=+b.dataset.p;
    if(shopTab==='racers'){if(!S.owned.includes(k)){if(S.coins<p){boop();b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500);return}S.coins-=p;S.owned.push(k);S.char=k;save();openChars();dance({title:'New character!',sub:MASCOT[k].name+' joined your team',who:k,gems:p});return}S.char=k;save();openChars();return}
    if(S.treas.includes(k))return;if(S.coins<p){boop();b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500);return}
    const t=TREAS.find(x=>x[0]===k);S.coins-=p;S.treas.push(k);save();openChars();dance({title:'You got it!',sub:t[1]+' is in your collection',art:t[4],gems:p})})};

// ---------- dancing celebration (replaces falling confetti) ----------
const MOVES=['hop','spin','kick','shimmy','twist'];
function dance(o={}){o=Object.assign({title:'Amazing!',sub:'',who:'yanky'},o);
  document.querySelectorAll('.dancer').forEach(d=>d.remove());
  const d=document.createElement('div');d.className='dancer';
  const m=MASCOT[o.who]&&o.who!=='car'?o.who:'yanky';
  const bits=[...Array(18)].map((_,i)=>{const g=['gold','silver','pearl','diamond'][i%4],a=i/18*Math.PI*2,r=120+Math.random()*90;
    return `<span class="bit" style="--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r-40}px;--d:${(i%6)*.05}s">${GEM[g]}</span>`}).join('');
  d.innerHTML=`<div class="stage"><div class="glow"></div>${bits}${o.art?`<div class="prize">${o.art}</div>`:''}<div class="dz">${MASCOT[m].svg()}</div><div class="shadow"></div></div><div class="bubble"><b>${o.title}</b>${o.sub?`<span>${o.sub}</span>`:''}</div>`;
  document.body.appendChild(d);
  const dz=d.querySelector('.dz');let i=0;
  const seq=o.big?['hop','spin','kick','shimmy','twist','spin']:['hop','kick','spin','shimmy'];
  (function next(){if(!d.isConnected)return;dz.className='dz '+seq[i%seq.length];i++;if(i<=seq.length)setTimeout(next,620)})();
  [523,659,784,1046,880,1046,1318].forEach((n,k)=>setTimeout(()=>beep(n,.16,'triangle',.14),k*95));
  setTimeout(()=>d.classList.add('out'),o.big?4400:3400);setTimeout(()=>d.remove(),o.big?4900:3900);
  d.onclick=()=>d.remove()}
window.dance=dance;
confetti=function(big){dance(big?{title:'NEW RECORD!',sub:'Reb Shunkle is dancing for you!',big:true}:{title:'Great reading!',sub:'Look at Reb Shunkle dance!'})};

// ---------- wallet in the top bar ----------
const _rm=renderMap;renderMap=function(){_rm.apply(this,arguments);const c=$('coinsP');if(c){c.innerHTML=walletHTML(S.coins);c.onclick=()=>{shopTab='treas';openChars()}}};
// coin icon used in results ("+N") is now a silver coin
ICONS['🪙']=GEM.silver;

document.head.insertAdjacentHTML('beforeend',`<style>
.wal{display:inline-flex;gap:10px;align-items:center}.wt{display:inline-flex;align-items:center;gap:3px}.wt .ic{width:1.15em;height:1.15em}.wt b{font-weight:800}
.free{color:#16A34A;font-weight:800}
.mascot{width:auto!important;height:44px!important;overflow:visible}
#charB .mascot{height:40px!important}.car .mascot{height:64px!important}
.shopcard{max-width:880px!important;width:94vw}
.shophd{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;text-align:left}
.shophd .ttl{font-size:30px;font-weight:900}.shophd .hint{font-size:14px;color:var(--sub)}.shophd>.wal{font-size:20px;background:#F4F5FB;padding:8px 14px;border-radius:999px}
.tabs{display:flex;gap:8px;margin:14px 0 6px;background:#F1F2F8;padding:5px;border-radius:999px;width:max-content}
.tabs button{font-size:17px;padding:8px 20px;border-radius:999px;background:transparent;color:var(--sub);font-weight:800}.tabs button.on{background:#fff;color:var(--ink);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:12px 0 18px;max-height:56vh;overflow:auto;padding:4px}
.shop .it{background:#fff;border:2px solid #EEF0F6;border-radius:20px;padding:12px 8px;color:var(--ink);font-size:16px;display:flex;flex-direction:column;align-items:center;gap:2px;transition:transform .15s}
.shop .it:active{transform:scale(.96)}.shop .it.sel{border-color:var(--pri);background:#EEF0FF;box-shadow:0 8px 20px rgba(99,102,241,.25)}
.shop .it.own .pr{color:#16A34A}.shop .it.lock .art{filter:grayscale(.85) opacity(.55)}
.shop .art{height:84px;display:flex;align-items:center;justify-content:center}.shop .art svg{height:80px!important;width:auto!important}.shop .art .carsvg:not(.mascot){width:100px!important;height:62px!important}
.shop .nm{font-weight:900;font-size:16px}.shop .sb{font-size:12px;color:var(--sub)}.shop .sb.he{font-family:serif;font-size:15px}.shop .pr{font-size:14px;margin-top:4px;font-weight:700}
.shake{animation:shk .4s}@keyframes shk{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.dancer,.shop,.shophd,.tabs,.wal{direction:ltr}
.dancer{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;background:radial-gradient(circle,rgba(30,27,75,.35),rgba(30,27,75,.0) 70%);animation:fin .3s ease-out}
.dancer.out{animation:fout .5s forwards}@keyframes fin{from{opacity:0}}@keyframes fout{to{opacity:0;transform:scale(.9)}}
.dancer .stage{position:relative;width:300px;height:300px;display:flex;align-items:flex-end;justify-content:center}
.dancer .glow{position:absolute;inset:20px;border-radius:50%;background:conic-gradient(from 0deg,#FDE68A,#FBCFE8,#BAE6FD,#BBF7D0,#FDE68A);filter:blur(28px);opacity:.75;animation:rot 4s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}
.dancer .dz{position:relative;z-index:2;transform-origin:50% 100%;animation:pop .5s cubic-bezier(.3,1.6,.5,1)}
.dancer .dz svg{height:250px!important;width:auto!important;overflow:visible;filter:drop-shadow(0 12px 18px rgba(0,0,0,.25))}
.dancer .shadow{position:absolute;bottom:-6px;width:130px;height:18px;border-radius:50%;background:rgba(0,0,0,.18);animation:shd .62s ease-in-out infinite}
@keyframes shd{50%{transform:scaleX(.7)}}
@keyframes pop{from{transform:scale(0) translateY(80px)}}
.dz.hop{animation:hop .62s ease-in-out}@keyframes hop{30%{transform:translateY(-60px) scaleY(1.05)}60%{transform:translateY(0) scale(1.1,.88)}80%{transform:translateY(-14px)}}
.dz.spin{animation:spin .62s ease-in-out}@keyframes spin{0%{transform:rotateY(0)}50%{transform:translateY(-30px) rotateY(180deg)}100%{transform:rotateY(360deg)}}
.dz.kick{animation:sway .62s ease-in-out}@keyframes sway{30%{transform:rotate(-12deg) translateX(-12px)}70%{transform:rotate(12deg) translateX(12px)}}
.dz.shimmy{animation:shim .62s linear}@keyframes shim{10%,50%,90%{transform:translateX(-10px) skewX(6deg)}30%,70%{transform:translateX(10px) skewX(-6deg)}}
.dz.twist{animation:tw .62s ease-in-out}@keyframes tw{50%{transform:scale(1.15,.85) rotate(8deg)}}
.dancer .aL,.dancer .aR,.dancer .lL,.dancer .lR,.dancer .pL,.dancer .pR,.dancer .lulav{transform-box:fill-box}
.dancer .aL{transform-origin:100% 0;animation:waveL .31s ease-in-out infinite alternate}.dancer .aR{transform-origin:0 0;animation:waveR .31s ease-in-out infinite alternate .15s}
@keyframes waveL{from{transform:rotate(20deg)}to{transform:rotate(-70deg)}}@keyframes waveR{from{transform:rotate(-20deg)}to{transform:rotate(70deg)}}
.dancer .lL{transform-origin:50% 0;animation:legL .62s ease-in-out infinite}.dancer .lR{transform-origin:50% 0;animation:legR .62s ease-in-out infinite}
@keyframes legL{25%{transform:rotate(28deg) translateY(-3px)}50%{transform:rotate(0)}}@keyframes legR{75%{transform:rotate(-34deg) translateY(-3px)}}
.dancer .pL{transform-origin:50% 0;animation:peyL .31s ease-in-out infinite alternate}.dancer .pR{transform-origin:50% 0;animation:peyR .31s ease-in-out infinite alternate}
@keyframes peyL{from{transform:rotate(18deg) scaleY(1.1)}to{transform:rotate(-14deg) scaleY(.85)}}@keyframes peyR{from{transform:rotate(-18deg) scaleY(.85)}to{transform:rotate(14deg) scaleY(1.1)}}
.dancer .eyes{transform-box:fill-box;transform-origin:center;animation:blink 1.6s infinite}@keyframes blink{92%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.dancer .lulav{transform-origin:50% 100%;animation:waveR .31s infinite alternate}
.dancer .bit{position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px;z-index:1;animation:burst 1.4s cubic-bezier(.2,.8,.3,1) var(--d) both}.dancer .bit .ic{width:30px;height:30px}
@keyframes burst{0%{transform:translate(0,0) scale(.2);opacity:0}20%{opacity:1}70%{transform:translate(var(--x),var(--y)) scale(1) rotate(200deg);opacity:1}100%{transform:translate(var(--x),calc(var(--y) + 60px)) scale(.6) rotate(320deg);opacity:0}}
.dancer .prize{position:absolute;top:-30px;right:-30px;z-index:3;animation:pop .6s .2s both}.dancer .prize svg{width:110px;height:110px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))}
.dancer .bubble{margin-top:22px;background:#fff;border-radius:24px;padding:14px 28px;text-align:center;box-shadow:0 14px 40px rgba(30,27,75,.25);animation:pop .5s .15s both}
.dancer .bubble b{display:block;font-size:34px;font-weight:900;background:linear-gradient(90deg,#6366F1,#EC4899,#F59E0B);-webkit-background-clip:text;background-clip:text;color:transparent}
.dancer .bubble span{font-size:18px;color:#6B7280}
</style>`);
renderMap();
// screenshot hooks
if(/^#shop=/.test(location.hash)){S.coins=1376;S.owned=['yanky','car','owl','dreidel'];S.treas=['candles','challah','cup'];S.char='yanky';shopTab=location.hash.slice(6);openChars()}
if(/^#spdemo/.test(location.hash)){S.char='yanky';renderMap()}
if(location.hash==='#dance')dance({title:'NEW RECORD!',sub:'Reb Shunkle is dancing for you!',big:true});
if(location.hash==='#buy'){S.coins=900;openChars();shopTab='treas';dance({title:'You got it!',sub:'Menorah is in your collection',art:TREAS[7][4]})}
