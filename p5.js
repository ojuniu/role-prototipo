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
.ttcs>div{background:#000!important}.ttcs img,.ttcs video{width:100%;height:100%;object-fit:contain;background:#000}
.ttcs img[data-cp]{opacity:0;transition:opacity .4s}.ttcs img.ok{opacity:1}
.ttdots{display:flex;justify-content:center;gap:5px;margin:0 -64px 12px 0;pointer-events:none}
.ttdots i{width:6px;height:6px;border-radius:9px;background:rgba(255,255,255,.4);transition:width .25s,background .25s}.ttdots i.on{background:#fff;width:16px}
.vplay{position:absolute;left:50%;top:50%;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:99px;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;color:#fff;opacity:0;transform:scale(.7);transition:opacity .2s,transform .25s;pointer-events:none;z-index:3;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.vplay svg{margin-left:5px}.vs.paused .vplay{opacity:1;transform:none}
.vbar{position:absolute;left:10px;right:10px;bottom:calc(80px + var(--safeB));height:22px;z-index:5;touch-action:none;cursor:pointer;display:flex;align-items:center}
.vbar .tr{position:relative;flex:1;height:3px;border-radius:9px;background:rgba(255,255,255,.25);transition:height .15s}
.vbar .fl{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:#fff}
.vbar .kn{position:absolute;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:99px;background:#fff;opacity:0;transition:opacity .15s;box-shadow:0 1px 6px rgba(0,0,0,.5)}
.vs.paused .vbar .tr,.vbar.act .tr{height:5px}.vs.paused .vbar .kn,.vbar.act .kn{opacity:1}
.vtime{position:absolute;left:0;right:0;bottom:calc(110px + var(--safeB));text-align:center;font-size:22px;font-weight:800;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.8);opacity:0;transition:opacity .15s;pointer-events:none;z-index:5;font-variant-numeric:tabular-nums}
.vtime small{font-size:15px;opacity:.6;font-weight:700}.vs.seeking .vtime{opacity:1}.vs.seeking~*,.tti.seeking .ttinfo,.tti.seeking .ttside{opacity:.15}
.vspd{position:absolute;right:12px;top:calc(108px + var(--safeT));z-index:4;height:30px;padding:0 10px;border-radius:99px;background:rgba(0,0,0,.45);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center}
.ttinfo,.ttside{transition:opacity .2s}
.cqs{margin-top:6px;border-radius:14px;background:#151614;border:1px solid var(--line2);overflow:hidden}
.cqs button{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);font-size:14px}.cqs button:last-child{border-bottom:none}
.screen.fsl #tt{animation:swl .28s ease}.screen.fsr #tt{animation:swr .28s ease}
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
const OMT={fuel:['fuel'],restaurant:['restaurant','fast_food','food_court'],pharmacy:['pharmacy','chemist'],hospital:['hospital','clinic','doctors'],car_repair:['car_repair','tyres','car_parts','motorcycle_repair','car'],car_wash:['car_wash'],parking:['parking'],atm:['atm','bank']};
const PTAG={fuel:['amenity:fuel'],restaurant:['amenity:restaurant','amenity:fast_food'],pharmacy:['amenity:pharmacy','shop:chemist'],hospital:['amenity:hospital','amenity:clinic'],car_repair:['shop:car_repair','shop:tyres','shop:car_parts'],car_wash:['amenity:car_wash'],parking:['amenity:parking'],atm:['amenity:atm','amenity:bank']};
const PWORD={fuel:'posto',restaurant:'restaurante',pharmacy:'farmácia',hospital:'hospital',car_repair:'oficina',car_wash:'lava jato',parking:'estacionamento',atm:'banco'};
const tmo=(ms,ctl)=>{const ac=ctl||new AbortController();setTimeout(()=>ac.abort(),ms);return ac.signal;};
async function photon(q,c,sig,extra=''){const r=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${c[1]}&lon=${c[0]}&limit=15&location_bias_scale=0.3&zoom=12${extra}`,{signal:sig});const j=await r.json();
  return(j.features||[]).filter(f=>!f.properties.countrycode||f.properties.countrycode==='BR').map(f=>{const p=f.properties;const name=p.name||[p.street,p.housenumber].filter(Boolean).join(', ');return{name,addr:[p.name?p.street:'',p.district||p.locality,p.city||p.county,p.state].filter(Boolean).join(', '),p:f.geometry.coordinates,kind:p.osm_value};}).filter(x=>x.name);}
async function nomi(q,c,sig){const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=8&countrycodes=br&accept-language=pt-BR&viewbox=${c[0]-.3},${c[1]+.3},${c[0]+.3},${c[1]-.3}&q=${encodeURIComponent(q)}`,{signal:sig});const j=await r.json();
  return j.map(x=>{const parts=x.display_name.split(',');return{name:x.name||parts[0],addr:parts.slice(1,4).join(',').trim(),p:[+x.lon,+x.lat],kind:x.type};});}
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function localPOI(match,c,R=6000){const m=RL.getMap&&RL.getMap();const out=[];const seen=new Set();
  try{for(const f of m.querySourceFeatures('openmaptiles',{sourceLayer:'poi'})){const p=f.properties;if(!match(p))continue;const g=f.geometry.type==='Point'?f.geometry.coordinates:null;if(!g)continue;const key=(p.name||'')+g[0].toFixed(4)+g[1].toFixed(4);if(seen.has(key))continue;seen.add(key);if(dist(c,g)>R)continue;
   out.push({name:p.name||p.subclass||p.class,addr:[p['addr:street']||'',p.subclass&&p.subclass!==p.class?p.subclass.replace(/_/g,' '):''].filter(Boolean).join(' · ')||'Perto do mapa',p:g,kind:p.class});}}catch(e){}return out;}
function localFuel(c,R=6000,q){const st=RL.osmStations?[...RL.osmStations().values()]:[];return st.filter(s=>dist(c,s.p)<R&&(!q||norm(s.name+' '+s.brand).includes(q))).map(s=>({name:s.name,addr:s.brand&&s.brand!==s.name?s.brand:'Posto de combustível',p:s.p,kind:'fuel'}));}
async function nearCat(cat,c,onPart){const k=cat[0];const loc=[...(k==='fuel'?localFuel(c):[]),...localPOI(p=>OMT[k].includes(p.class)||OMT[k].includes(p.subclass),c)];if(loc.length&&onPart)onPart(loc);
  let ph=[];try{const d=.06;ph=await photon(PWORD[k],c,tmo(5000),PTAG[k].map(t=>'&osm_tag='+t).join('')+`&bbox=${c[0]-d},${c[1]-d},${c[0]+d},${c[1]+d}`);}catch(e){}
  let ov=[];if(loc.length+ph.length<4){const q=`[out:json][timeout:12];(node[${cat[2]}](around:4000,${c[1]},${c[0]});way[${cat[2]}](around:4000,${c[1]},${c[0]}););out center 60;`;
   for(const u of['https://overpass-api.de/api/interpreter','https://overpass.private.coffee/api/interpreter']){try{const r=await fetch(u,{method:'POST',body:'data='+encodeURIComponent(q),signal:tmo(9000)});if(r.ok){const j=await r.json();ov=j.elements.map(e=>{const t=e.tags||{};const p=e.type==='node'?[e.lon,e.lat]:e.center?[e.center.lon,e.center.lat]:null;return p&&{name:t.name||t.brand||cat[1].replace(/s$/,''),addr:[t['addr:street'],t['addr:housenumber']].filter(Boolean).join(', ')||cat[1],p,kind:k};}).filter(Boolean);break;}}catch(e){}}}
  return dedupe([...loc,...ph,...ov]).sort((a,b)=>dist(c,a.p)-dist(c,b.p)).slice(0,60);}
function dedupe(l){const seen=[];return l.filter(x=>{if(seen.some(s=>norm(s.name)===norm(x.name)&&dist(s.p,x.p)<150))return false;seen.push(x);return true;});}
SCREENS.search={tabbar:false,
 html(){return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><input id="q" class="inp" placeholder="Rua, lugar, posto, bairro, cidade…" autocomplete="off" enterkeyhint="search" style="flex:1"></div>
  <div class="scroll"><div class="chips" id="sc" style="margin-bottom:6px">${CATS.map(c=>`<button class="chip" data-c="${c[0]}">${ic(c[3],14)}${c[1]}</button>`).join('')}</div><div id="res"></div></div>`;},
 mount(el){const q=$('#q',el),res=$('#res',el),near=(()=>{const m=RL.getMap&&RL.getMap();const p=myPos();try{const c=m.getCenter().toArray();if(dist(c,p)>15000)return c;}catch(e){}return p;})();setTimeout(()=>q.focus(),200);
  let items=[];const draw=(list,title,busy)=>{items=list;res.innerHTML=(title?`<div class="sec-t">${title}</div>`:'')+(list.length?`<div class="card list" style="padding:2px 10px">${list.map((x,i)=>`<button class="srow press" data-i="${i}"><span class="ib">${ic(x.kind==='fuel'?I.pump:x.kind==='recent'?RL.I.clock||I.flag:PIN,17)}</span><div style="flex:1;min-width:0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.name)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.addr||'')}</div></div><span class="small muted">${x.kind==='recent'?'':fmtD(dist(near,x.p))}</span></button>`).join('')}</div>`:(busy?'':'<div class="empty">Nada encontrado</div>'))+(busy?'<div class="small muted" style="text-align:center;padding:12px">Buscando mais…</div>':'');
   $$('[data-i]',res).forEach(b=>b.onclick=()=>{const x=items[+b.dataset.i];S.recent=[{...x,kind:'recent'},...(S.recent||[]).filter(r=>r.name!==x.name)].slice(0,8);save();router.go('preview',{dest:{name:x.name,addr:x.addr,p:x.p}});});};
  const home=()=>draw((S.recent||[]).slice(0,8),(S.recent||[]).length?'Recentes':'',false);home();
  let seq=0,ctl=null;
  $$('#sc [data-c]',el).forEach(b=>b.onclick=async()=>{const my=++seq;const cat=CATS.find(c=>c[0]===b.dataset.c);$$('#sc [data-c]',el).forEach(x=>x.classList.toggle('lime',x===b));draw([],'',true);
   const l=await nearCat(cat,near,part=>{if(my===seq)draw(part.sort((a,b)=>dist(near,a.p)-dist(near,b.p)),cat[1]+' perto',true);});if(my===seq)draw(l,cat[1]+' perto',false);});
  const rank=(v,l)=>{const nv=norm(v);return l.sort((x,y)=>{const tx=norm(x.name).startsWith(nv)?0:norm(x.name).includes(nv)?1:2,ty=norm(y.name).startsWith(nv)?0:norm(y.name).includes(nv)?1:2;return(tx-ty)||(Math.log10(dist(near,x.p)+50)-Math.log10(dist(near,y.p)+50));});};
  let tm,tn;q.addEventListener('input',()=>{clearTimeout(tm);clearTimeout(tn);const v=q.value.trim();$$('#sc [data-c]',el).forEach(x=>x.classList.remove('lime'));if(v.length<2){seq++;home();return;}
   const nv=norm(v);const my=++seq;const loc=dedupe([...localFuel(near,15000,nv),...localPOI(p=>norm(p.name).includes(nv),near,15000)]);let acc=loc;if(loc.length)draw(rank(v,loc).slice(0,20),'',true);
   if(ctl)ctl.abort();ctl=new AbortController();const sig=ctl.signal;
   let left=2;const got=l=>{left--;if(my!==seq)return;acc=dedupe([...acc,...l]);draw(rank(v,acc).slice(0,20),'',left>0);};
   tm=setTimeout(()=>{photon(v,near,tmo(9000,ctl)).then(got,()=>got([]));nomi(v,near,tmo(8000,ctl)).then(got,()=>got([]));},350);});
  q.addEventListener('keydown',e=>{if(e.key==='Enter'&&items[0]&&q.value.trim().length>=2){$('[data-i="0"]',res).click();}});}};
/* ================= deslizar entre as abas ================= */
const TABS=[];const FT=['all','fol','crew'];
(function(){let sx,sy,st0,ok=false;const host=()=>document.getElementById('screens');
 document.addEventListener('touchstart',e=>{const t=e.touches[0];ok=false;const cur=router.cur;if(!cur||cur.tabbar===false||e.touches.length>1)return;if(cur.clear)return;
  const cs=e.target.closest('.ttcs');if(cs&&cs.scrollWidth>cs.clientWidth+4)return;if(e.target.closest('.chips,.stories,.vbar,.gcar,input,textarea,.smapw,.brands,.swrow,.covergrid,.noswipe'))return;if(!host().contains(e.target))return;sx=t.clientX;sy=t.clientY;st0=Date.now();ok=true;},{passive:true});
 document.addEventListener('touchend',e=>{if(!ok)return;ok=false;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.6||Date.now()-st0>700)return;
  const cur=router.cur;if(cur.name==='feed'){const fi=FT.indexOf(cur.f||'all'),nf=fi+(dx<0?1:-1);if(nf>=0&&nf<FT.length){cur.f=FT[nf];router.render(cur,true,true);const s=host().querySelector('.screen');if(s)s.classList.add(dx<0?'fsl':'fsr');return;}}
  const i=TABS.indexOf(cur.tab||cur.name);if(i<0)return;const ni=i+(dx<0?1:-1);if(ni<0||ni>=TABS.length)return;if(ride.on&&TABS[ni]!=='map')return;
  router.tabTo(TABS[ni]);const s=host().querySelector('.screen');if(s)s.classList.add(dx<0?'swl':'swr');},{passive:true});})();
/* ================= mídia (IndexedDB) ================= */
let dbp=null;const db=()=>dbp||(dbp=new Promise((ok,no)=>{const r=indexedDB.open('role-media',1);r.onupgradeneeded=()=>r.result.createObjectStore('m');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}));
const putM=async(k,b)=>{const d=await db();return new Promise((ok,no)=>{const tx=d.transaction('m','readwrite');tx.objectStore('m').put(b,k);tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});};
const urlCache=new Map();const getURL=async k=>{if(urlCache.has(k))return urlCache.get(k);const d=await db();const b=await new Promise(ok=>{const r=d.transaction('m').objectStore('m').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null);});if(!b)return null;const u=URL.createObjectURL(b);urlCache.set(k,u);return u;};
const playV=x=>{if(!x||x.dataset.up)return;x.muted=!S.sound;const p=x.play();if(p&&p.catch)p.catch(()=>{if(!x.muted){x.muted=true;x.play().catch(()=>{});}});};RL.playV=playV;
const inView=el=>{const r=el.getBoundingClientRect();return r.bottom>innerHeight*.3&&r.top<innerHeight*.7&&r.right>0&&r.left<innerWidth;};
async function fillMedia(root){for(const el of $$('[data-mk]',root)){if(el.dataset.done)continue;el.dataset.done=1;const u=await getURL(el.dataset.mk);if(u){el.src=u;el.classList.add('ok');if(el.tagName==='VIDEO'){el.load();if(inView(el))playV(el);}}}}
RL.fillMedia=fillMedia;
async function shrink(f){if(!f.type.startsWith('image/'))return f;const u=URL.createObjectURL(f);const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u;});const k=Math.min(1,1920/Math.max(img.width,img.height),1080/Math.min(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);return await new Promise(ok=>c.toBlob(b=>ok(b||f),'image/jpeg',.85));}
/* vídeos de carros (Wikimedia Commons) */
const canV=v=>{try{const t=String(v&&v.type||'').split(';')[0]||(/\.webm/i.test(v&&v.src||'')?'video/webm':'video/mp4');return!!document.createElement('video').canPlayType(t);}catch(e){return true;}};
/* lista curada e testada (todos tocam no navegador); 720p com volta pra 480p */
const VL=[['8/80','Drifting.webm',1,'High Resolution Database','CC BY 3.0'],['5/5b','Drift_Zone_2_Teaser.webm',1,'PLOT TWIST','CC BY 3.0'],['a/a6','2011_MCR_-_Fisichella_drift.ogv',1,'Sasha Krotov','CC BY 3.0'],['3/3f','Tuning-Motor-Party-2023-Vyškov-46.webm',1,'Hugo','CC BY-SA 4.0'],['1/17','Tuning-Motor-Party-2023-Vyškov-45.webm',1,'Hugo','CC BY-SA 4.0'],['7/72','4th_International_Auto_Show,_Palace_Grounds,_Bangalore_(2025)_04.webm',1,'Gpkp','CC BY-SA 4.0'],['9/9d','Cars_drifting_around_a_race_track_at_twilight_and_night_as_viewed_from_FPV_drone.webm',1,'anotherview','CC BY 3.0'],['8/82','Cars_driving_at_night.webm',1,'Editor (YouTube)','CC BY 3.0'],['0/08','Harley-Davidson.webmhd.webm',0,'Christilpetersen','CC BY-SA 3.0'],['9/90','Bandoleros_race_final_lap_at_Golden_Sands_Speedway_won_by_Derek_Kraus.webm',1,'Royalbroil','CC BY-SA 4.0'],['c/c9','2023_Toyota-Save_Mart_350_-_Sarah_Stierch_-_Video_02.webm',1,'Missvain','CC BY 4.0'],['3/30','1969_AMC_AMX_SS_Hurst_factory_dragcar_as_McCorkle_Bros_at_AMO_2024_meet_15of16.ogv',1,'CZmarlin','CC BY-SA 4.0'],['1/10','Rib’Car_2_(video).webm',1,'Cjp24','CC BY-SA 4.0'],['d/d1','Riding_on_the_road_shoulder_on_a_motorcycle_in_Queensland.webm',1,'TMRQld','CC BY 3.0'],['3/36','4th_International_Auto_Show,_Palace_Grounds,_Bangalore_(2025)_03.webm',1,'Gpkp','CC BY-SA 4.0'],['f/f5','Japan-Mobility-Show-2023-Nippatsu-Car-Spring.webm',1,'RuinDig','CC BY 4.0'],['9/92','Driving_past_the_Mai_Mahiu_Viewpoint_of_the_Great_Rift_Valley,_Kenya.webm',1,'Lebu Ayiga','CC BY 4.0'],['4/48','The_last_day_of_our_road_trip_to_Iran_in_2_minutes.webm',0,'AsuhsWorld','CC BY 3.0'],['4/43','1973_AMC_Gremlin_X_highly_modified_dragstrip_AMC_powered_race_car_at_AMO_2024_show_12of12.webm',0,'CZmarlin','CC BY 4.0']];
const UP='https://upload.wikimedia.org/wikipedia/commons/';
const VIDS=VL.map(([h,n,tr,a,l])=>{const e=encodeURIComponent(n);const base=tr?UP+'transcoded/'+h+'/'+e+'/'+e:'';return{src:tr?base+'.480p.vp9.webm':UP+h+'/'+e,hd:tr?base+'.720p.vp9.webm':'',type:'video/webm',poster:'https://upload.wikimedia.org/wikipedia/commons/thumb/'+h+'/'+e+'/960px--'+e+'.jpg',t:n.replace(/_/g,' ').replace(/\.(webm|ogv)$/,'').replace(/\.webmhd$/,''),a,l,fn:n};}).filter(canV);
RL.VIDS=VIDS;async function videos(){return VIDS;}
const vtag=(v,extra='')=>`<video muted loop playsinline preload="none" poster="${esc(v.poster||'')}" ${extra}>${v.hd?`<source src="${esc(v.hd)}" type="video/webm">`:''}<source src="${esc(v.src)}" type="video/webm"></video>`;RL.vtag=vtag;
const vsrc=v=>typeof v==='string'?v:v.src;
/* ================= FEED em tela cheia nas 3 abas ================= */
const MAXM=10;
const vslide=v=>`<div class="vs">${v}<div class="vplay">${ic(I.play,34,2)}</div><div class="vtime"></div><div class="vbar"><div class="tr"><div class="fl"></div><i class="kn"></i></div></div></div>`;
const mmss=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
function wireVideo(vs){const v=$('video',vs),bar=$('.vbar',vs),fl=$('.fl',vs),kn=$('.kn',vs),tm=$('.vtime',vs);if(!v||vs.dataset.w)return;vs.dataset.w=1;
  const upd=()=>{const d=v.duration||0,p=d?v.currentTime/d:0;fl.style.width=(p*100)+'%';kn.style.left=(p*100)+'%';};v.addEventListener('timeupdate',upd);v.addEventListener('loadedmetadata',upd);
  let raf=0;const loop=()=>{upd();raf=v.paused?0:requestAnimationFrame(loop);};v.addEventListener('play',()=>{vs.classList.remove('paused');if(!raf)raf=requestAnimationFrame(loop);});v.addEventListener('pause',()=>{if(v.dataset.up)vs.classList.add('paused');});
  const seekTo=e=>{const r=bar.getBoundingClientRect();const k=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));if(v.duration){v.currentTime=k*v.duration;upd();tm.innerHTML=`${mmss(v.currentTime)} <small>/ ${mmss(v.duration)}</small>`;}};
  let wasP=false;bar.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();try{bar.setPointerCapture(e.pointerId);}catch(x){}bar.classList.add('act');vs.classList.add('seeking');vs.closest('.tti').classList.add('seeking');wasP=v.paused;v.pause();seekTo(e);});
  bar.addEventListener('pointermove',e=>{if(bar.classList.contains('act'))seekTo(e);});
  const up=()=>{if(!bar.classList.contains('act'))return;bar.classList.remove('act');vs.classList.remove('seeking');vs.closest('.tti').classList.remove('seeking');if(!wasP&&!v.dataset.up)v.play().catch(()=>{});};
  bar.addEventListener('pointerup',up);bar.addEventListener('pointercancel',up);bar.addEventListener('click',e=>e.stopPropagation());}
function togglePlay(vs){const v=$('video',vs);if(!v)return;if(v.paused){delete v.dataset.up;vs.classList.remove('paused');playV(v);}else{v.dataset.up=1;v.pause();vs.classList.add('paused');}}
function mediaPost(p){const w=C.who(p.h)||{n:p.h,h:p.h};const cr=w.crew&&C.CREWS?C.CREWS[w.crew]:null;const key=p.model||(p.car?RL.modelKey(p.car):(w.car?RL.modelKey(w.car):''));
  const on=p.mine?!!(S.posts.find(x=>x.id===p.id)||{}).hornOn:!!S.horn[p.id];const n=p.mine?(S.posts.find(x=>x.id===p.id)||{}).horn||0:p.horn+(S.horn[p.id]?1:0);const cm=(p.cm||[]).length+((S.cm||{})[p.id]||[]).length;
  let slides=[];if(p.media)slides=p.media.map(m=>m.type==='video'?vslide(`<video data-mk="${m.k}" muted loop playsinline preload="metadata"></video>`):`<div><img data-mk="${m.k}" alt=""></div>`);
  else if(p.kind==='video')slides=[vslide(vtag(typeof p.vid==='string'?{src:p.vid}:p.vid))];
  else for(let k=0;k<(p.nph||1);k++)slides.push(`<div>${RL.picTag(key,p.id+':'+k)}</div>`);
  const hasVid=slides.some(s=>s.includes('<video'));
  const loc=p.loc==='hidden'?'':(p.where||p.city||(p.mine?'':''));
  return`<section class="tti" data-id="${p.id}"><div class="ttbg"><div class="ttcs">${slides.join('')}</div></div><div class="ttshade"></div><div class="ttpop">${ic(I.horn,90,2)}</div>
  ${hasVid?`<button class="ttmute" data-on="mute">${ic(I.mute,18)}</button>`:''}
  <div class="ttside"><button data-on="prof" data-h="${esc(p.h)}">${RL.avatar2(w.me?{me:true}:w,50)}</button>
   <button class="ttbtn ${on?'on':''}" data-on="horn" data-id="${p.id}">${ic(I.horn,30,2)}<span>${n}</span></button>
   <button class="ttbtn" data-on="cmts" data-id="${p.id}">${ic(I.cmt,28,2)}<span>${cm}</span></button>
   <button class="ttbtn" data-on="sharep" data-id="${p.id}">${ic(I.share,28,2)}<span>Enviar</span></button>
   ${key?`<button class="ttcar" data-on="model" data-m="${esc(key)}">${w.me&&RL.featCar()&&RL.featCar().front?`<img class="ok" src="${RL.featCar().front}" style="object-fit:contain">`:RL.picTag(key,p.h)}</button>`:''}</div>
  <div class="ttinfo">${slides.length>1?`<div class="ttdots">${slides.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}<button class="b" data-on="prof" data-h="${esc(p.h)}" style="font-size:16px;color:#fff;text-align:left">${esc(w.n)} ${cr?`<span style="color:${cr.c};font-weight:700">· ${esc(w.crew)}</span>`:''}</button>
   <div class="small" style="opacity:.85;margin-top:2px">@${esc(p.h)} · ${ago(p.t)}${RL.distTxt?RL.distTxt(p.h):''}${key?` · <button data-on="model" data-m="${esc(key)}" class="carlink" style="color:#fff">${esc(key)}</button>`:''}</div>
   <div class="tttxt">${esc(p.txt||'')}</div>${loc?`<span class="pmloc">${ic(PIN,13)}<span>${esc(loc)}</span></span>`:''}
   ${!p.mine?`<div class="small" style="opacity:.5;margin-top:8px">${p.kind==='video'?'Vídeo: '+esc(((p.vid&&p.vid.a)||'')+' · '+((p.vid&&p.vid.l)||'CC')):'Foto: Commons (CC)'}, via Wikimedia Commons</div>`:''}</div></section>`;}
function item(p){return(p.media||p.kind==='photo'||p.kind==='video')?mediaPost(p):T.ttItem(p);}
const made=new Map();const getP=i=>{if(!made.has(i))made.set(i,T.genPost(i));return made.get(i);};
function genMore(i,f){let p=getP(i);if(f&&f!=='all'){const allow=f==='fol'?Object.keys(S.follow):T.people().filter(w=>w.crew&&w.crew===S.me.crew).map(w=>w.h);if(allow.length&&!allow.includes(p.h)){const id=p.id+f;let q=made.get(id);if(!q){q={...p,id,h:allow[Math.floor(hsh(id)*allow.length)],cm:[]};const w=C.who(q.h);if(w&&w.car)q.model=RL.modelKey(w.car);made.set(id,q);RL.extraPosts.push(q);}p=q;}}
  if(p.kind==='photo'&&!p.nph){const r=hsh('n'+p.id);p.nph=r<.45?1:r<.7?2:r<.88?3:4;}
  if(p.kind!=='ride'&&!p.vid&&hsh('v'+p.id)<.38&&VIDS&&VIDS.length){p.kind='video';p.vid=VIDS[Math.floor(hsh('vv'+p.id)*VIDS.length)];if(p.vid.t)p.vtitle=p.vid.t;}return p;}
function feedWire(tt){const obs=new IntersectionObserver(es=>es.forEach(e=>{$$('video',e.target).forEach(x=>{if(e.isIntersecting&&e.intersectionRatio>.6){if(!x.src&&x.dataset.mk)return;if(x.dataset.up)return;playV(x);}else x.pause();});}),{threshold:[0,.6,1]});
  [...tt.children].forEach(s=>{obs.observe(s);$$('.vs',s).forEach(wireVideo);const cs=$('.ttcs',s);if(cs)cs.addEventListener('scroll',()=>{const i=Math.round(cs.scrollLeft/cs.clientWidth);$$('.ttdots i',s).forEach((d,k)=>d.classList.toggle('on',k===i));},{passive:true});});fillMedia(tt);
  let st1=0,lt=0;tt.addEventListener('click',e=>{if(e.target.closest('button,.vbar,.pmloc'))return;const now=Date.now();if(now-lt<300){clearTimeout(st1);lt=0;const s=e.target.closest('.tti');if(s){const b=$('[data-on="horn"]',s);if(b&&!b.classList.contains('on'))b.click();const pop=$('.ttpop',s);pop.classList.add('on');setTimeout(()=>pop.classList.remove('on'),650);}return;}lt=now;
   const s=e.target.closest('.tti');const cs=s&&$('.ttcs',s);if(!cs)return;const sl=cs.children[Math.round(cs.scrollLeft/(cs.clientWidth||1))];if(sl&&sl.classList.contains('vs'))st1=setTimeout(()=>togglePlay(sl),280);});}
RL.feedItem=p=>{if(!p.media&&p.kind==='ride'&&!p.mine)T.needRoute(p);return item(p);};RL.feedWire=feedWire;
const FILT={all:null,fol:p=>p.mine||!!S.follow[p.h],crew:p=>{if(p.mine)return true;const w=C.who(p.h);return!!(w&&w.crew&&w.crew===S.me.crew);}};
function tabsHTML(f){return`<div class="seg" id="ff">${[['all','Para você'],['fol','Seguindo'],['crew','Minha crew']].map(([k,t])=>`<button data-k="${k}" class="${f===k?'on':''}">${t}</button>`).join('')}</div>`;}
SCREENS.feed={tab:'feed',
 html(){const f=this.f||'all';const unread=S.notifs.filter(n=>!n.read).length;
  return`<div class="ttwrap"><div class="tt" id="tt"></div><div class="tthdr">${tabsHTML(f)}<button class="ib" data-go="explore" aria-label="Buscar">${ic(I.search,18)}</button><button class="ib" data-go="notifs" style="position:relative" aria-label="Notificações">${ic(I.bell,18)}${unread?'<span class="dotn"></span>':''}</button></div></div>`;},
 mount(el){const f=this.f||'all',flt=FILT[f];$$('#ff button',el).forEach(b=>b.onclick=()=>{if(b.dataset.k===(this.f||'all'))return;this.f=b.dataset.k;router.render(this,true,true);});
  const tt=$('#tt',el);if(f==='crew'&&!S.me.crew){tt.innerHTML=`<div class="ttempty">${ic(I.people,40)}<div class="b" style="color:var(--tx)">Você ainda não tem crew</div><button class="btn sm" data-go="explore">Achar uma crew</button></div>`;return;}
  if(f==='fol'&&!Object.keys(S.follow).length){tt.innerHTML=`<div class="ttempty">${ic(I.people,40)}<div class="b" style="color:var(--tx)">Siga pilotos pra ver os rolês deles aqui</div><button class="btn sm" data-go="explore">Encontrar pilotos</button></div>`;return;}
  const mine=C.allPosts().filter(p=>p.mine).slice(0,5),base=C.FPOSTS.filter(p=>!flt||flt(p)).slice(0,4);
  const obs=new IntersectionObserver(es=>es.forEach(e=>{const v=$$('video',e.target);v.forEach(x=>{if(e.isIntersecting&&e.intersectionRatio>.6){if(!x.src&&x.dataset.mk)return;if(x.dataset.up)return;playV(x);}else{x.pause();if(x.dataset.up){delete x.dataset.up;const w=x.closest('.vs');if(w)w.classList.remove('paused');}}});}),{threshold:[0,.6,1]});
  const add=list=>{const before=tt.children.length;tt.insertAdjacentHTML('beforeend',list.map(item).join(''));[...tt.children].slice(before).forEach(s=>{obs.observe(s);$$('.vs',s).forEach(wireVideo);const cs=$('.ttcs',s);if(cs){cs.addEventListener('scroll',()=>{const i=Math.round(cs.scrollLeft/cs.clientWidth);$$('.ttdots i',s).forEach((d,k)=>d.classList.toggle('on',k===i));},{passive:true});}});
   list.forEach(p=>{if(!p.media&&p.kind==='ride'&&!p.mine)T.needRoute(p);});fillMedia(tt);};
  add([...mine,...base]);this.gi=this.gi||{};this.gi[f]=this.gi[f]||0;
  const more=()=>{const l=[];for(let k=0;k<5;k++){l.push(genMore(this.gi[f],f));this.gi[f]++;}add(l);};more();
  tt.addEventListener('scroll',()=>{if(tt.scrollTop+tt.clientHeight*3>tt.scrollHeight)more();},{passive:true});
  let lt=0,st1=0;tt.addEventListener('click',e=>{if(e.target.closest('button,.vbar'))return;const now=Date.now();if(now-lt<300){clearTimeout(st1);lt=0;const s=e.target.closest('.tti');if(s){const b=$('[data-on="horn"]',s);if(b&&!b.classList.contains('on'))b.click();const pop=$('.ttpop',s);pop.classList.add('on');setTimeout(()=>pop.classList.remove('on'),650);}return;}lt=now;
   const vs=e.target.closest('.tti')&&(()=>{const s=e.target.closest('.tti');const cs=$('.ttcs',s);if(!cs)return null;const i=Math.round(cs.scrollLeft/(cs.clientWidth||1));const sl=cs.children[i];return sl&&sl.classList.contains('vs')?sl:null;})();if(vs){st1=setTimeout(()=>togglePlay(vs),280);}});},
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
   <div style="padding:0 16px"><div class="row" style="gap:8px"><input class="inp" id="cq" placeholder="Trocar cidade ou bairro…" autocomplete="off" enterkeyhint="search" style="height:40px;flex:1" value=""><button class="ib" data-on="here" style="width:40px;height:40px" aria-label="Minha localização">${ic(I.loc,16)}</button></div><div id="cqs"></div>
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
  const cq=$('#cq',el),box=$('#cqs',el);let tm,sq=0,sug=[];
  const pick=x=>{sq++;clearTimeout(tm);this.ctr=x.p;this.cname=x.name;box.innerHTML='';cq.value='';cq.blur();const t=$('[data-city]',el);if(t)t.textContent=x.name;this.mapReady();draw();toast('Chat de '+x.name,'dark');};
  const show=l=>{sug=l;box.innerHTML=l.length?`<div class="cqs">${l.map((x,i)=>`<button data-s="${i}">${ic(PIN,16)}<div style="flex:1;min-width:0"><div class="b">${esc(x.name)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.addr)}</div></div></button>`).join('')}</div>`:'';$$('[data-s]',box).forEach(b=>b.onclick=()=>pick(sug[+b.dataset.s]));};
  cq.addEventListener('input',()=>{clearTimeout(tm);const v=cq.value.trim();const my=++sq;if(v.length<2){show([]);return;}
   tm=setTimeout(()=>{let acc=[];const got=l=>{if(my!==sq)return;acc=dedupe([...acc,...l]);show(acc.slice(0,6));};
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=br&accept-language=pt-BR&featureType=settlement&q=${encodeURIComponent(v)}`,{signal:tmo(8000)}).then(r=>r.json()).then(j=>got(j.map(x=>{const pr=x.display_name.split(',');return{name:x.name||pr[0],addr:pr.slice(1,4).join(',').trim(),p:[+x.lon,+x.lat]};}))).catch(()=>{});
    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(v)}&limit=8&lat=${myPos()[1]}&lon=${myPos()[0]}&location_bias_scale=0.2&layer=city&layer=district&layer=locality`,{signal:tmo(9000)}).then(r=>r.json()).then(j=>got((j.features||[]).filter(f=>(f.properties.countrycode||'BR')==='BR').map(f=>{const p=f.properties;return{name:p.name,addr:[p.city&&p.city!==p.name?p.city:'',p.county,p.state].filter(Boolean).join(', '),p:f.geometry.coordinates};}))).catch(()=>{});},450);});
  cq.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(sug[0])pick(sug[0]);}});},
 leave(){const m=RL.getMap&&RL.getMap();if(m&&m.getLayer('chatR-f'))['chatR-f','chatR-l'].forEach(l=>m.setLayoutProperty(l,'visibility','none'));},
 on:{prof(a){a.dataset.h===S.me.handle?router.go('profile'):router.go('person',{h:a.dataset.h});},
  here(){this.ctr=null;this.cname='';$('#cq',this.el).value='';$('#cqs',this.el).innerHTML='';const t=$('[data-city]',this.el);if(t)t.textContent=(RL.myCity&&RL.myCity())||'sua região';this.mapReady();this.draw();},
  send(){const i=$('#ci',this.el),v=i.value.trim();if(!v)return;const key=chatKey(this.ctr||myPos());S.chat=S.chat||{};(S.chat[key]=S.chat[key]||[]).push({h:S.me.handle,txt:v,t:Date.now(),d:0});save();i.value='';this.draw();
   if(Math.random()<.7){const pool=T.people().filter(w=>RL.distKm(w.h)<=(this.R||10));const w=pool[Math.floor(Math.random()*pool.length)];if(w)setTimeout(()=>{(S.chat[key]=S.chat[key]||[]).push({h:w.h,txt:'@'+S.me.handle+' '+RP[Math.floor(Math.random()*RP.length)],t:Date.now(),d:RL.distKm(w.h)});save();if(router.cur&&router.cur.name==='chat')this.draw();else toast(`${w.n} respondeu no chat da região`,'dark');},3500+Math.random()*5000);}}}};
/* botão e prévia do chat no mapa */
const MS=SCREENS.map;const mh=MS.html;
MS.html=function(p){const h=mh.call(this,p).replace('<div class="mapfabs">',`<div class="mapfabs"><button class="fab" data-on="chat" aria-label="Chat da região">${ic(CHAT,19)}</button>`);
  const last=chatMsgs(myPos(),10000,[])[0];const w=last&&(C.who(last.h)||{});return h+(last&&!S.settings.ghost?`<button class="chatpill" data-on="chat"><span class="dot">${ic(CHAT,13,2.4)}</span><span><b>${esc((w.n||last.h).split(' ')[0])}:</b> ${esc(last.txt.replace('{r}',''))}</span></button>`:'');};
MS.on.chat=()=>router.go('chat');
})();
