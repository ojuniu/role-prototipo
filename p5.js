/* Rolê — busca melhor, deslizar entre telas, feed em tela cheia (3 abas), postar fotos/vídeos, chat por cidade */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm||!RL.tt)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,ride,gps,fmtT,ago}=RL;
const C=RL.comm,T=RL.tt;const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const rad=d=>d*Math.PI/180;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 12742000*Math.asin(Math.sqrt(x));};
const fmtD=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1).replace('.',',')+' km':Math.max(10,Math.round(m/10)*10)+' m';
const PIN='<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
const CHAT='<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>';
const st=document.createElement('style');st.textContent=`
.toast{white-space:normal!important;max-width:calc(100% - 32px)!important;text-align:center;line-height:1.35}
.screen.swl{animation:swl .26s ease}.screen.swr{animation:swr .26s ease}
@keyframes swl{from{transform:translateX(26%);opacity:.3}to{transform:none;opacity:1}}@keyframes swr{from{transform:translateX(-26%);opacity:.3}to{transform:none;opacity:1}}
.ttcs{position:absolute;inset:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.ttcs::-webkit-scrollbar{display:none}
.ttcs>div{flex:0 0 100%;height:100%;scroll-snap-align:center;position:relative;background:#0D0E0C}
.ttcs img,.ttcs video{width:100%;height:100%;object-fit:cover}
.ttcs img[data-cp]{opacity:0;transition:opacity .4s}.ttcs img.ok{opacity:1}
.ttdots{position:absolute;left:0;right:0;top:calc(62px + var(--safeT));display:flex;justify-content:center;gap:5px;z-index:4}
.ttdots i{width:6px;height:6px;border-radius:9px;background:rgba(255,255,255,.4)}.ttdots i.on{background:#fff;width:16px}
.ttmute{position:absolute;right:12px;top:calc(62px + var(--safeT));z-index:4;width:36px;height:36px;border-radius:99px;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff}
.ttnew{width:38px;height:38px;border-radius:99px;background:var(--lime);color:#0A0B0A;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tthdr .seg button{font-size:12.5px}
.ttempty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--tx3);text-align:center;padding:30px}
.cmpgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.cmpgrid>div{position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;background:#151614}
.cmpgrid img,.cmpgrid video{width:100%;height:100%;object-fit:cover}
.cmpgrid>div>button{position:absolute;right:6px;top:6px;width:24px;height:24px;border-radius:99px;background:rgba(0,0,0,.6);color:#fff;display:flex;align-items:center;justify-content:center}
.cmpadd{aspect-ratio:1;border-radius:14px;border:1.5px dashed rgba(198,244,50,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:var(--lime2);font-size:12px;font-weight:700}
.srow{display:flex;align-items:center;gap:12px;padding:12px 4px;width:100%;text-align:left}
.srow .ib{width:40px;height:40px}
.chatp{position:absolute;left:0;right:0;bottom:0;height:68%;background:#0E0F0D;border-radius:26px 26px 0 0;border-top:1px solid var(--line2);display:flex;flex-direction:column;z-index:20;box-shadow:0 -20px 50px rgba(0,0,0,.5)}
.chatl{flex:1;overflow-y:auto;padding:4px 16px 12px}
.cmsg{display:flex;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)}
.cmsg .b{font-size:13.5px}.cmsg .tx{font-size:14.5px;line-height:1.4;margin-top:2px}
.cmsg.me .tx{color:var(--lime2)}
.chati{display:flex;gap:8px;padding:10px 14px calc(12px + var(--safeB));border-top:1px solid var(--line)}
.chatpill{position:absolute;left:14px;top:calc(130px + var(--safeT));z-index:6;max-width:calc(100% - 90px);height:34px;padding:0 12px 0 6px;border-radius:99px;background:rgba(18,19,17,.86);border:1px solid var(--line2);display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.chatpill .dot{width:22px;height:22px;border-radius:99px;background:var(--lime);color:#0A0B0A;display:flex;align-items:center;justify-content:center}
.chatpill span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.simcar{width:34px!important;height:34px!important;padding:0!important;background:none!important;border:2px solid #fff!important;overflow:hidden}
.simcar .av{width:100%!important;height:100%!important;border:none}
`;document.head.appendChild(st);
/* ================= BUSCA no mapa: Photon + Nominatim + categorias perto ================= */
const CATS=[['fuel','Postos','amenity=fuel',RL.I.pump],['restaurant','Restaurantes','amenity~"^(restaurant|fast_food)$"','<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"/>'],['pharmacy','Farmácias','amenity=pharmacy','<path d="M12 5v14M5 12h14"/>'],['hospital','Hospitais','amenity~"^(hospital|clinic)$"','<path d="M4 21V5h16v16M9 9h6M12 6v6"/>'],['car_repair','Oficinas','shop~"^(car_repair|tyres|car_parts|motorcycle_repair)$"','<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'],['car_wash','Lava-jato','amenity=car_wash','<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/>'],['parking','Estacionar','amenity=parking','<path d="M7 21V3h6a5 5 0 0 1 0 10H7"/>'],['atm','Caixa 24h','amenity~"^(atm|bank)$"','<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>']];
async function photon(q,c){const r=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${c[1]}&lon=${c[0]}&limit=12&location_bias_scale=0.5`);const j=await r.json();
  return(j.features||[]).filter(f=>!f.properties.countrycode||f.properties.countrycode==='BR').map(f=>{const p=f.properties;const name=p.name||[p.street,p.housenumber].filter(Boolean).join(', ');return{name,addr:[p.name?p.street:'',p.district||p.locality,p.city||p.county,p.state].filter(Boolean).join(', '),p:f.geometry.coordinates,kind:p.osm_value};}).filter(x=>x.name);}
async function nomi(q,c){const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=8&countrycodes=br&accept-language=pt-BR&viewbox=${c[0]-.3},${c[1]+.3},${c[0]+.3},${c[1]-.3}&q=${encodeURIComponent(q)}`);const j=await r.json();
  return j.map(x=>{const parts=x.display_name.split(',');return{name:x.name||parts[0],addr:parts.slice(1,4).join(',').trim(),p:[+x.lon,+x.lat],kind:x.type};});}
async function nearCat(cat,c){const q=`[out:json][timeout:20];(node[${cat[2]}](around:4000,${c[1]},${c[0]});way[${cat[2]}](around:4000,${c[1]},${c[0]}););out center 60;`;
  const urls=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];let j=null;for(const u of urls){try{const r=await fetch(u,{method:'POST',body:'data='+encodeURIComponent(q)});if(r.ok){j=await r.json();break;}}catch(e){}}if(!j)throw 0;
  return j.elements.map(e=>{const t=e.tags||{};const p=e.type==='node'?[e.lon,e.lat]:e.center?[e.center.lon,e.center.lat]:null;return p&&{name:t.name||t.brand||cat[1].replace(/s$/,''),addr:[t['addr:street'],t['addr:housenumber']].filter(Boolean).join(', ')||cat[1],p,kind:cat[0]};}).filter(Boolean).sort((a,b)=>dist(c,a.p)-dist(c,b.p));}
SCREENS.search={tabbar:false,
 html(){return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><input id="q" class="inp" placeholder="Rua, lugar, posto, bairro, cidade…" autocomplete="off" style="flex:1"></div>
  <div class="scroll"><div class="chips" id="sc" style="margin-bottom:6px">${CATS.map(c=>`<button class="chip" data-c="${c[0]}">${ic(c[3],14)}${c[1]}</button>`).join('')}</div><div id="res"></div></div>`;},
 mount(el){const q=$('#q',el),res=$('#res',el),near=myPos();setTimeout(()=>q.focus(),200);
  const draw=(items,title)=>{res.innerHTML=(title?`<div class="sec-t">${title}</div>`:'')+(items.length?`<div class="card list" style="padding:2px 10px">${items.map((x,i)=>`<button class="srow press" data-i="${i}"><span class="ib">${ic(x.kind==='fuel'?I.pump:x.kind==='recent'?RL.I.clock||I.flag:PIN,17)}</span><div style="flex:1;min-width:0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.name)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.addr||'')}</div></div><span class="small muted">${x.p?fmtD(dist(near,x.p)):''}</span></button>`).join('')}</div>`:'<div class="empty">Nada encontrado</div>');
   $$('[data-i]',res).forEach(b=>b.onclick=()=>{const x=items[+b.dataset.i];S.recent=[{...x,kind:'recent'},...(S.recent||[]).filter(r=>r.name!==x.name)].slice(0,8);save();router.go('preview',{dest:{name:x.name,addr:x.addr,p:x.p}});});};
  const home=()=>draw((S.recent||[]).slice(0,8),(S.recent||[]).length?'Recentes':'');home();
  $$('#sc [data-c]',el).forEach(b=>b.onclick=async()=>{const cat=CATS.find(c=>c[0]===b.dataset.c);$$('#sc [data-c]',el).forEach(x=>x.classList.toggle('lime',x===b));res.innerHTML='<div class="empty">Buscando perto de você…</div>';try{draw(await nearCat(cat,near),cat[1]+' perto de você');}catch(e){res.innerHTML='<div class="empty">Sem conexão agora</div>';}});
  let tm,seq=0;q.addEventListener('input',()=>{clearTimeout(tm);const v=q.value.trim();if(v.length<2){home();return;}
   tm=setTimeout(async()=>{const my=++seq;res.innerHTML='<div class="empty">Buscando…</div>';const [a,b]=await Promise.all([photon(v,near).catch(()=>[]),nomi(v,near).catch(()=>[])]);if(my!==seq)return;
    const seen=[],all=[...a,...b].filter(x=>{if(seen.some(s=>s.name===x.name&&dist(s.p,x.p)<150))return false;seen.push(x);return true;});
    all.sort((x,y)=>{const dx=dist(near,x.p),dy=dist(near,y.p);const tx=x.name.toLowerCase().startsWith(v.toLowerCase())?0:1,ty=y.name.toLowerCase().startsWith(v.toLowerCase())?0:1;return(tx-ty)||(Math.log10(dx+50)-Math.log10(dy+50));});
    draw(all.slice(0,20));},350);});}};
/* ================= deslizar entre as abas ================= */
const TABS=['map','feed','events','garage','profile'];
(function(){let sx,sy,st0,ok=false;const host=()=>document.getElementById('screens');
 document.addEventListener('touchstart',e=>{const t=e.touches[0];ok=false;const cur=router.cur;if(!cur||cur.tabbar===false||e.touches.length>1)return;if(cur.clear)return;
  if(e.target.closest('.chips,.stories,.ttcs,.gcar,input,textarea,.smapw,.brands,.swrow,.covergrid,.noswipe'))return;if(!host().contains(e.target))return;sx=t.clientX;sy=t.clientY;st0=Date.now();ok=true;},{passive:true});
 document.addEventListener('touchend',e=>{if(!ok)return;ok=false;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.6||Date.now()-st0>700)return;
  const cur=router.cur,i=TABS.indexOf(cur.tab||cur.name);if(i<0)return;const ni=i+(dx<0?1:-1);if(ni<0||ni>=TABS.length)return;if(ride.on&&TABS[ni]!=='map')return;
  router.tabTo(TABS[ni]);const s=host().querySelector('.screen');if(s)s.classList.add(dx<0?'swl':'swr');},{passive:true});})();
/* ================= mídia (IndexedDB) ================= */
let dbp=null;const db=()=>dbp||(dbp=new Promise((ok,no)=>{const r=indexedDB.open('role-media',1);r.onupgradeneeded=()=>r.result.createObjectStore('m');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}));
const putM=async(k,b)=>{const d=await db();return new Promise((ok,no)=>{const tx=d.transaction('m','readwrite');tx.objectStore('m').put(b,k);tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});};
const urlCache=new Map();const getURL=async k=>{if(urlCache.has(k))return urlCache.get(k);const d=await db();const b=await new Promise(ok=>{const r=d.transaction('m').objectStore('m').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null);});if(!b)return null;const u=URL.createObjectURL(b);urlCache.set(k,u);return u;};
async function fillMedia(root){for(const el of $$('[data-mk]',root)){if(el.dataset.done)continue;el.dataset.done=1;const u=await getURL(el.dataset.mk);if(u){el.src=u;el.classList.add('ok');}}}
async function shrink(f){if(!f.type.startsWith('image/'))return f;const u=URL.createObjectURL(f);const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u;});const k=Math.min(1,1440/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);return await new Promise(ok=>c.toBlob(b=>ok(b||f),'image/jpeg',.85));}
/* vídeos de carros (Wikimedia Commons) */
let VIDS=null;try{VIDS=JSON.parse(localStorage.getItem('role.vids')||'null');}catch(e){}
async function videos(){if(VIDS)return VIDS;try{const j=await(await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch='+encodeURIComponent('filetype:video car driving road')+'&gsrlimit=30&prop=videoinfo&viprop=url|derivatives|size&format=json&origin=*')).json();
  VIDS=Object.values((j.query||{}).pages||{}).map(p=>{const v=p.videoinfo&&p.videoinfo[0];if(!v||v.width<v.height||/\.(ogg|oga|mp3)$/i.test(v.url))return null;const ds=(v.derivatives||[]).filter(d=>/video/.test(d.type));const mp4=ds.find(d=>/mp4/.test(d.type));const wm=ds.filter(d=>/webm/.test(d.type)).sort((a,b)=>(b.height||0)-(a.height||0)).find(d=>(d.height||0)<=720);return(mp4||wm||{src:v.url}).src;}).filter(Boolean).slice(0,16);
  localStorage.setItem('role.vids',JSON.stringify(VIDS));}catch(e){VIDS=[];}return VIDS;}
videos();
/* ================= FEED em tela cheia nas 3 abas ================= */
const MAXM=10;
function mediaPost(p){const w=C.who(p.h)||{n:p.h,h:p.h};const cr=w.crew&&C.CREWS?C.CREWS[w.crew]:null;const key=p.model||(p.car?RL.modelKey(p.car):(w.car?RL.modelKey(w.car):''));
  const on=p.mine?!!(S.posts.find(x=>x.id===p.id)||{}).hornOn:!!S.horn[p.id];const n=p.mine?(S.posts.find(x=>x.id===p.id)||{}).horn||0:p.horn+(S.horn[p.id]?1:0);const cm=(p.cm||[]).length+((S.cm||{})[p.id]||[]).length;
  let slides=[];if(p.media)slides=p.media.map(m=>m.type==='video'?`<div><video data-mk="${m.k}" muted loop playsinline preload="metadata"></video></div>`:`<div><img data-mk="${m.k}" alt=""></div>`);
  else if(p.kind==='video')slides=[`<div><video src="${esc(p.vid)}" muted loop playsinline preload="none" onerror="this.closest('.tti').querySelector('.ttcs').innerHTML='<div>'+(this.dataset.fb||'')+'</div>'" data-fb="${esc(RL.picTag(key,p.id))}"></video></div>`];
  else for(let k=0;k<(p.nph||1);k++)slides.push(`<div>${RL.picTag(key,p.id+':'+k)}</div>`);
  const hasVid=slides.some(s=>s.includes('<video'));
  const loc=p.loc==='hidden'?'':(p.where||p.city||(p.mine?'':''));
  return`<section class="tti" data-id="${p.id}"><div class="ttbg"><div class="ttcs">${slides.join('')}</div></div><div class="ttshade"></div><div class="ttpop">${ic(I.horn,90,2)}</div>
  ${slides.length>1?`<div class="ttdots">${slides.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}${hasVid?`<button class="ttmute" data-on="mute">${ic(I.mute,18)}</button>`:''}
  <div class="ttside"><button data-on="prof" data-h="${esc(p.h)}">${RL.avatar2(w.me?{me:true}:w,50)}</button>
   <button class="ttbtn ${on?'on':''}" data-on="horn" data-id="${p.id}">${ic(I.horn,30,2)}<span>${n}</span></button>
   <button class="ttbtn" data-on="cmts" data-id="${p.id}">${ic(I.cmt,28,2)}<span>${cm}</span></button>
   <button class="ttbtn" data-on="sharep" data-id="${p.id}">${ic(I.share,28,2)}<span>Enviar</span></button>
   ${key?`<button class="ttcar" data-on="model" data-m="${esc(key)}">${w.me&&RL.featCar()&&RL.featCar().front?`<img class="ok" src="${RL.featCar().front}" style="object-fit:contain">`:RL.picTag(key,p.h)}</button>`:''}</div>
  <div class="ttinfo"><button class="b" data-on="prof" data-h="${esc(p.h)}" style="font-size:16px;color:#fff;text-align:left">${esc(w.n)} ${cr?`<span style="color:${cr.c};font-weight:700">· ${esc(w.crew)}</span>`:''}</button>
   <div class="small" style="opacity:.85;margin-top:2px">@${esc(p.h)} · ${ago(p.t)}${RL.distTxt?RL.distTxt(p.h):''}${key?` · <button data-on="model" data-m="${esc(key)}" class="carlink" style="color:#fff">${esc(key)}</button>`:''}</div>
   <div class="tttxt">${esc(p.txt||'')}</div>${loc?`<span class="pmloc">${ic(PIN,13)}<span>${esc(loc)}</span></span>`:''}
   ${!p.mine?`<div class="small" style="opacity:.5;margin-top:8px">${p.kind==='video'?'Vídeo':'Foto'}: Wikimedia Commons</div>`:''}</div></section>`;}
function item(p){return(p.media||p.kind==='photo'||p.kind==='video')?mediaPost(p):T.ttItem(p);}
const made=new Map();const getP=i=>{if(!made.has(i))made.set(i,T.genPost(i));return made.get(i);};
function genMore(i,f){let p=getP(i);if(f&&f!=='all'){const allow=f==='fol'?Object.keys(S.follow):T.people().filter(w=>w.crew&&w.crew===S.me.crew).map(w=>w.h);if(allow.length&&!allow.includes(p.h)){const id=p.id+f;let q=made.get(id);if(!q){q={...p,id,h:allow[Math.floor(hsh(id)*allow.length)],cm:[]};const w=C.who(q.h);if(w&&w.car)q.model=RL.modelKey(w.car);made.set(id,q);RL.extraPosts.push(q);}p=q;}}
  if(p.kind==='photo'&&!p.nph){const r=hsh('n'+p.id);p.nph=r<.45?1:r<.7?2:r<.88?3:4;}
  if(p.kind!=='ride'&&!p.vid&&hsh('v'+p.id)<.22&&VIDS&&VIDS.length){p.kind='video';p.vid=VIDS[Math.floor(hsh('vv'+p.id)*VIDS.length)];}return p;}
const FILT={all:null,fol:p=>p.mine||!!S.follow[p.h],crew:p=>{if(p.mine)return true;const w=C.who(p.h);return!!(w&&w.crew&&w.crew===S.me.crew);}};
function tabsHTML(f){return`<div class="seg" id="ff">${[['all','Para você'],['fol','Seguindo'],['crew','Minha crew']].map(([k,t])=>`<button data-k="${k}" class="${f===k?'on':''}">${t}</button>`).join('')}</div>`;}
SCREENS.feed={tab:'feed',
 html(){const f=this.f||'all';const unread=S.notifs.filter(n=>!n.read).length;
  return`<div class="ttwrap"><div class="tt" id="tt"></div><div class="tthdr">${tabsHTML(f)}<button class="ttnew" data-go="compose" aria-label="Postar">${ic(I.plus,20,2.6)}</button><button class="ib" data-go="explore" aria-label="Buscar">${ic(I.search,18)}</button><button class="ib" data-go="notifs" style="position:relative" aria-label="Notificações">${ic(I.bell,18)}${unread?'<span class="dotn"></span>':''}</button></div></div>`;},
 mount(el){const f=this.f||'all',flt=FILT[f];$$('#ff button',el).forEach(b=>b.onclick=()=>{if(b.dataset.k===(this.f||'all'))return;this.f=b.dataset.k;router.render(this,true,true);});
  const tt=$('#tt',el);if(f==='crew'&&!S.me.crew){tt.innerHTML=`<div class="ttempty">${ic(I.people,40)}<div class="b" style="color:var(--tx)">Você ainda não tem crew</div><button class="btn sm" data-go="explore">Achar uma crew</button></div>`;return;}
  if(f==='fol'&&!Object.keys(S.follow).length){tt.innerHTML=`<div class="ttempty">${ic(I.people,40)}<div class="b" style="color:var(--tx)">Siga pilotos pra ver os rolês deles aqui</div><button class="btn sm" data-go="explore">Encontrar pilotos</button></div>`;return;}
  const mine=C.allPosts().filter(p=>p.mine).slice(0,5),base=C.FPOSTS.filter(p=>!flt||flt(p)).slice(0,4);
  const obs=new IntersectionObserver(es=>es.forEach(e=>{const v=$$('video',e.target);v.forEach(x=>{if(e.isIntersecting&&e.intersectionRatio>.6){if(!x.src&&x.dataset.mk)return;x.muted=!S.sound;x.play().catch(()=>{});}else x.pause();});}),{threshold:[0,.6,1]});
  const add=list=>{const before=tt.children.length;tt.insertAdjacentHTML('beforeend',list.map(item).join(''));[...tt.children].slice(before).forEach(s=>{obs.observe(s);const cs=$('.ttcs',s);if(cs){cs.addEventListener('scroll',()=>{const i=Math.round(cs.scrollLeft/cs.clientWidth);$$('.ttdots i',s).forEach((d,k)=>d.classList.toggle('on',k===i));},{passive:true});}});
   list.forEach(p=>{if(!p.media&&p.kind==='ride'&&!p.mine)T.needRoute(p);});fillMedia(tt);};
  add([...mine,...base]);this.gi=this.gi||{};this.gi[f]=this.gi[f]||0;
  const more=()=>{const l=[];for(let k=0;k<5;k++){l.push(genMore(this.gi[f],f));this.gi[f]++;}add(l);};more();
  tt.addEventListener('scroll',()=>{if(tt.scrollTop+tt.clientHeight*3>tt.scrollHeight)more();},{passive:true});
  let lt=0;tt.addEventListener('click',e=>{if(e.target.closest('button'))return;const now=Date.now();if(now-lt<320){const s=e.target.closest('.tti');if(s){const b=$('[data-on="horn"]',s);if(b&&!b.classList.contains('on'))b.click();const pop=$('.ttpop',s);pop.classList.add('on');setTimeout(()=>pop.classList.remove('on'),650);}}lt=now;});},
 on:{...C.postHandlers,mute(a){S.sound=!S.sound;save();$$('#tt video').forEach(v=>v.muted=!S.sound);$$('#tt .ttmute').forEach(b=>b.innerHTML=ic(S.sound?I.vol:I.mute,18));}}};
/* ================= POSTAR fotos / vídeos ================= */
SCREENS.compose={tabbar:false,
 html(){const cars=S.cars;return`<div class="hdr"><button class="ib" data-back>${ic(I.x)}</button><h2>Novo post</h2><button class="btn sm" data-on="pub">Publicar</button></div><div class="scroll">
  <div class="cmpgrid" id="cg"></div><input type="file" id="cf" accept="image/*,video/*" multiple hidden>
  <div class="small muted" style="margin:8px 4px 0">Até ${MAXM} fotos ou vídeos. Arraste pro lado no feed pra ver todos.</div>
  <label class="f">Legenda</label><textarea class="inp" id="ct" rows="3" maxlength="300" style="height:auto;padding:12px 14px;resize:none" placeholder="Conta aí o rolê…"></textarea>
  ${cars.length?`<label class="f">Marcar veículo</label><div class="chips" id="cc">${cars.map((c,i)=>`<button class="chip ${i===0?'lime':''}" data-c="${c.id}">${esc(c.model)}</button>`).join('')}<button class="chip" data-c="">Nenhum</button></div>`:''}
  <label class="f">Localização</label><div class="chips" id="cl">${[['city','Só a cidade'],['street','Rua aproximada'],['hidden','Não mostrar']].map(([k,n],i)=>`<button class="chip ${k===(S.me.mediaLoc||'city')?'lime':''}" data-l="${k}">${n}</button>`).join('')}</div>
  <div class="small muted" id="clt" style="margin:8px 4px 0"></div></div>`;},
 mount(el){this.files=[];this.car=S.cars[0]?S.cars[0].id:'';this.loc=S.me.mediaLoc||'city';const grid=$('#cg',el),inp=$('#cf',el);
  const draw=()=>{grid.innerHTML=this.files.map((f,i)=>`<div>${f.type.startsWith('video')?`<video src="${f.u}" muted playsinline></video>`:`<img src="${f.u}">`}<button data-x="${i}">${ic(I.x,12,3)}</button></div>`).join('')+(this.files.length<MAXM?`<button class="cmpadd" id="ca">${ic(I.plus,24)}Adicionar</button>`:'');
   $$('[data-x]',grid).forEach(b=>b.onclick=()=>{this.files.splice(+b.dataset.x,1);draw();});const a=$('#ca',grid);if(a)a.onclick=()=>inp.click();};
  inp.onchange=e=>{for(const f of e.target.files){if(this.files.length>=MAXM)break;if(f.type.startsWith('video')&&f.size>80e6){toast('Vídeo muito grande (máx. 80 MB)','dark');continue;}this.files.push({f,type:f.type,u:URL.createObjectURL(f)});}inp.value='';draw();};
  draw();setTimeout(()=>inp.click(),250);
  $$('#cc [data-c]',el).forEach(b=>b.onclick=()=>{this.car=b.dataset.c;$$('#cc [data-c]',el).forEach(x=>x.classList.toggle('lime',x===b));});
  const lt=()=>{const c=RL.myCity?RL.myCity():'';$('#clt',el).textContent=this.loc==='hidden'?'O post não mostra onde você está':this.loc==='city'?`Aparece: ${c||'sua cidade'}`:'Aparece o nome da rua mais próxima (nunca o número)';};lt();
  $$('#cl [data-l]',el).forEach(b=>b.onclick=()=>{this.loc=b.dataset.l;$$('#cl [data-l]',el).forEach(x=>x.classList.toggle('lime',x===b));lt();});},
 on:{async pub(a){if(!this.files.length){toast('Escolha pelo menos uma foto ou vídeo','dark');return;}a.disabled=true;a.textContent='Enviando…';
  try{const media=[];for(const x of this.files){const k='m'+Date.now()+Math.random().toString(36).slice(2,7);const b=await shrink(x.f);await putM(k,b);media.push({k,type:x.type.startsWith('video')?'video':'image'});}
   const car=S.cars.find(c=>c.id===this.car);const p={id:'p'+Date.now(),t:Date.now(),me:true,kind:'media',media,txt:$('#ct',this.el).value.trim(),car:car?car.model:'',loc:this.loc,horn:0,cmts:[]};
   if(this.loc==='city')p.city=RL.myCity?RL.myCity():'';S.me.mediaLoc=this.loc;S.posts.unshift(p);save();
   if(this.loc==='street'){const c=myPos();fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=16&accept-language=pt-BR&lat=${c[1]}&lon=${c[0]}`).then(r=>r.json()).then(j=>{const ad=j.address||{};p.where=[ad.road,ad.city||ad.town||ad.village].filter(Boolean).join(' · ');save();}).catch(()=>{});}
   toast('Postado!');router.tabTo('feed');}catch(e){console.error(e);toast('Não deu pra salvar a mídia neste aparelho','dark');a.disabled=false;a.textContent='Publicar';}}}};
/* ================= CHAT DA CIDADE (no mapa) ================= */
const CM=['Alguém rodando agora perto da {r}?','Trânsito parado na {r}, evitem','Bora rolê hoje 21h saindo da {r}?','Radar novo na {r}, cuidado','Alguém indica lava-jato bom perto da {r}?','Gasolina a R$ 5,79 num posto da {r}','Blitz na {r} agora há pouco','Encontro sábado à noite, quem vai?','Vi um Opala lindo na {r} hoje','Quem tem crew aqui na região? Tô procurando','Buraco enorme na {r}, cuidado com a roda','Rolê de domingo cedo, alguém?','Oficina de confiança por aqui? Barulho na suspensão','Chegando agora na {r}, quem tá por perto?','Primeira semana no app, já peguei 40 hex','Alguém sabe se o posto da {r} tem calibrador funcionando?'];
const RP=['Tô perto, bora!','Valeu pelo aviso','Vou colar','Onde exatamente?','Kkkk boa','Passei aí agora, tá tranquilo','Chama no privado','Eu vou!','Top demais'];
function roadsNear(){const m=RL.getMap&&RL.getMap();const names=new Set();try{m.queryRenderedFeatures().forEach(f=>{if(f.sourceLayer==='transportation_name'&&f.properties.name&&/primary|secondary|tertiary|trunk|minor/.test(f.properties.class||''))names.add(f.properties.name);});}catch(e){}return[...names].slice(0,40);}
function circle(c,r){const pts=[];for(let i=0;i<=64;i++){const a=i/64*2*Math.PI;pts.push([c[0]+r*Math.sin(a)/(111320*Math.cos(rad(c[1]))),c[1]+r*Math.cos(a)/110540]);}return{type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'Polygon',coordinates:[pts]}}]};}
const chatKey=c=>c[0].toFixed(2)+':'+c[1].toFixed(2);
function chatMsgs(c,R,names){const key=chatKey(c);S.chat=S.chat||{};const mine=(S.chat[key]||[]).map(m=>({...m}));const r=C.rnd(Math.floor(hsh(key)*1e6));const pool=T.people();const out=[];
  for(let i=0;i<26;i++){const w=pool[Math.floor(r()*pool.length)];const d=(RL.distKm?RL.distKm(w.h):5);const rd=names.length?names[Math.floor(r()*names.length)]:'avenida principal';out.push({h:w.h,txt:CM[Math.floor(r()*CM.length)].replace('{r}',rd),t:Date.now()-(i*9+r()*8)*60e3,d});}
  return[...mine,...out.filter(m=>m.d*1000<=R)].sort((a,b)=>b.t-a.t);}
SCREENS.chat={clear:true,tabbar:false,
 html(){const R=(this.R||10);const city=this.cname||(RL.myCity?RL.myCity():'')||'sua região';
  return`<div style="position:absolute;left:14px;right:14px;top:calc(14px + var(--safeT));display:flex;gap:10px;z-index:21"><button class="ib glass" data-back>${ic(I.back)}</button><div class="glasscard" style="flex:1;height:44px;border-radius:15px;display:flex;align-items:center;gap:8px;padding:0 14px;font-weight:800">${ic(CHAT,18)}<span data-city>${esc(city)}</span><span class="small muted" style="font-weight:600">· ${R} km</span></div></div>
  <div class="chatp"><div class="grab" style="margin:8px auto 4px"></div>
   <div style="padding:0 16px"><div class="row" style="gap:8px"><input class="inp" id="cq" placeholder="Trocar cidade…" style="height:40px;flex:1" value=""><button class="ib" data-on="here" style="width:40px;height:40px" aria-label="Minha localização">${ic(I.loc,16)}</button></div>
   <div class="chips" id="cr" style="margin-top:8px">${[5,10,25,50].map(k=>`<button class="chip ${R===k?'lime':''}" data-r="${k}">${k} km</button>`).join('')}</div>
   <div class="small muted b" style="margin:10px 2px 6px">Pessoas perto · toque pra ver o perfil</div><div class="stories" id="cpl" style="padding-bottom:6px"></div></div>
   <div class="chatl" id="cl"></div>
   <div class="chati"><input class="inp" id="ci" placeholder="Mandar mensagem pra região…" maxlength="280" style="height:46px;flex:1"><button class="ib" data-on="send" style="width:46px;height:46px;background:var(--lime);color:#0A0B0A">${ic(I.check,20,2.6)}</button></div></div>`;},
 mapReady(){const m=RL.getMap();const c=this.ctr||myPos(),R=(this.R||10)*1000;if(!m.getSource('chatR')){m.addSource('chatR',{type:'geojson',data:circle(c,R)});m.addLayer({id:'chatR-f',type:'fill',source:'chatR',paint:{'fill-color':'#C6F432','fill-opacity':.06}});m.addLayer({id:'chatR-l',type:'line',source:'chatR',paint:{'line-color':'#C6F432','line-width':1.5,'line-dasharray':[2,2],'line-opacity':.7}});}else m.getSource('chatR').setData(circle(c,R));
  ['chatR-f','chatR-l'].forEach(l=>m.setLayoutProperty(l,'visibility','visible'));m.setPadding({top:60,bottom:Math.round(window.innerHeight*.66),left:0,right:0});
  const kx=R/(111320*Math.cos(rad(c[1]))),ky=R/110540;m.fitBounds([[c[0]-kx,c[1]-ky],[c[0]+kx,c[1]+ky]],{padding:20,duration:700,pitch:0,bearing:0});
  setTimeout(()=>{this.names=roadsNear();this.draw&&this.draw();},900);},
 mount(el){const draw=this.draw=()=>{const c=this.ctr||myPos(),R=(this.R||10)*1000;const msgs=chatMsgs(c,R,this.names||[]);
   const ppl=T.people().filter(w=>(RL.distKm?RL.distKm(w.h):99)*1000<=R).sort((a,b)=>RL.distKm(a.h)-RL.distKm(b.h)).slice(0,14);
   $('#cpl',el).innerHTML=ppl.map(w=>`<button class="story" data-on="prof" data-h="${esc(w.h)}">${RL.avatar2(w,46)}<span>${String(RL.distKm(w.h)).replace('.',',')} km</span></button>`).join('')||'<div class="small muted">Ninguém nesse raio ainda</div>';
   $('#cl',el).innerHTML=msgs.map(m=>{const w=m.h===S.me.handle?{me:true,n:S.me.name,h:m.h}:(C.who(m.h)||{n:m.h,h:m.h});return`<div class="cmsg ${w.me?'me':''}"><button data-on="prof" data-h="${esc(m.h)}">${RL.avatar2(w,36)}</button><div style="flex:1;min-width:0"><div class="small"><button data-on="prof" data-h="${esc(m.h)}" class="b" style="color:var(--tx)">${esc(w.n)}</button> <span class="muted">${w.me?'você':'a '+String(m.d||RL.distKm(m.h)).replace('.',',')+' km'} · ${ago(m.t)}</span></div><div class="tx">${esc(m.txt)}</div></div></div>`;}).join('');};
  draw();$('#ci',el).addEventListener('keydown',e=>{if(e.key==='Enter')this.on.send.call(this);});
  $$('#cr [data-r]',el).forEach(b=>b.onclick=()=>{this.R=+b.dataset.r;$$('#cr [data-r]',el).forEach(x=>x.classList.toggle('lime',x===b));const s=$('.glasscard .muted',el);if(s)s.textContent='· '+this.R+' km';this.mapReady();draw();});
  let tm;$('#cq',el).addEventListener('input',e=>{clearTimeout(tm);const v=e.target.value.trim();if(v.length<3)return;tm=setTimeout(async()=>{try{const j=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(v)}`)).json();if(j[0]){this.ctr=[+j[0].lon,+j[0].lat];this.cname=j[0].display_name.split(',')[0];const t=$('[data-city]',el);if(t)t.textContent=this.cname;this.mapReady();draw();}}catch(x){}},700);});},
 leave(){const m=RL.getMap&&RL.getMap();if(m&&m.getLayer('chatR-f'))['chatR-f','chatR-l'].forEach(l=>m.setLayoutProperty(l,'visibility','none'));},
 on:{prof(a){a.dataset.h===S.me.handle?router.go('profile'):router.go('person',{h:a.dataset.h});},
  here(){this.ctr=null;this.cname='';$('#cq',this.el).value='';const t=$('[data-city]',this.el);if(t)t.textContent=(RL.myCity&&RL.myCity())||'sua região';this.mapReady();this.draw();},
  send(){const i=$('#ci',this.el),v=i.value.trim();if(!v)return;const key=chatKey(this.ctr||myPos());S.chat=S.chat||{};(S.chat[key]=S.chat[key]||[]).push({h:S.me.handle,txt:v,t:Date.now(),d:0});save();i.value='';this.draw();
   if(Math.random()<.7){const pool=T.people().filter(w=>RL.distKm(w.h)<=(this.R||10));const w=pool[Math.floor(Math.random()*pool.length)];if(w)setTimeout(()=>{(S.chat[key]=S.chat[key]||[]).push({h:w.h,txt:'@'+S.me.handle+' '+RP[Math.floor(Math.random()*RP.length)],t:Date.now(),d:RL.distKm(w.h)});save();if(router.cur&&router.cur.name==='chat')this.draw();else toast(`${w.n} respondeu no chat da região`,'dark');},3500+Math.random()*5000);}}}};
/* botão e prévia do chat no mapa */
const MS=SCREENS.map;const mh=MS.html;
MS.html=function(p){const h=mh.call(this,p).replace('<div class="mapfabs">',`<div class="mapfabs"><button class="fab" data-on="chat" aria-label="Chat da região">${ic(CHAT,19)}</button>`);
  const last=chatMsgs(myPos(),10000,[])[0];const w=last&&(C.who(last.h)||{});return h+(last&&!S.settings.ghost?`<button class="chatpill" data-on="chat"><span class="dot">${ic(CHAT,13,2.4)}</span><span><b>${esc((w.n||last.h).split(' ')[0])}:</b> ${esc(last.txt.replace('{r}',''))}</span></button>`:'');};
MS.on.chat=()=>router.go('chat');
})();
