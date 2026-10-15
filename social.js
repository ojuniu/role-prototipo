/* Rolê — fotos reais dos modelos, avatar escuro, capa, localização opcional, mapas reais nos posts, feed vertical estilo TikTok */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,fmtKm,fmtT,ago,trackSVG,gps,ride}=RL;
const C=RL.comm;const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const PX='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const PIN='<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
const st=document.createElement('style');st.textContent=`
.avc{background:#151614!important;border:1px solid rgba(255,255,255,.12);position:relative;overflow:hidden}
.avc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .3s}.avc img.ok{opacity:1}
.avc img.cut{object-fit:contain;inset:8%;width:84%;height:84%}
.avc svg{width:62%;filter:invert(1);opacity:.28}
.vhero .pic{position:relative}
.vhero .pic:has(img.hero){margin:-16px -16px 0;height:210px;position:relative;align-items:stretch}
.vhero .pic img.hero{max-width:none;max-height:none;width:100%;height:100%;object-fit:cover;filter:none;opacity:0;transition:opacity .3s}.vhero .pic img.hero.ok{opacity:1}
.vhero .pic:has(img.hero):after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 55%,#121311)}
.vhero .pic .sil{position:absolute;left:14%;right:14%;bottom:16px}.vhero .pic .sil svg{width:100%;filter:invert(1);opacity:.12}
.credit{font-size:9px;color:rgba(255,255,255,.35);position:absolute;right:8px;bottom:6px;z-index:2}
.postmap{height:190px!important}
.smapw{position:absolute;inset:0;overflow:hidden;background:#0D0E0C}
.smap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.smap img{position:absolute;width:256px;height:256px;max-width:none}
.smap.blur img{filter:blur(5px) brightness(.8)}
.smap svg{position:absolute;left:0;top:0}
.pmloc{position:absolute;left:10px;bottom:10px;z-index:3;max-width:calc(100% - 20px);height:26px;padding:0 10px;border-radius:99px;background:rgba(10,11,10,.82);border:1px solid rgba(255,255,255,.12);font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#E8E9E4}
.pmloc span{overflow:hidden;text-overflow:ellipsis}
.osmc{position:absolute;right:6px;top:5px;font-size:8.5px;color:rgba(255,255,255,.4);z-index:3}
.pmload{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--tx4);font-size:12px}
.ttwrap{position:absolute;inset:0;background:#000}
.tt{position:absolute;inset:0;overflow-y:scroll;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}.tt::-webkit-scrollbar{display:none}
.tti{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.ttbg{position:absolute;inset:0}.ttbg>img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s}.ttbg>img.ok{opacity:1}
.ttshade{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.55),transparent 22%,transparent 50%,rgba(0,0,0,.85) 88%);pointer-events:none}
.ttside{position:absolute;right:10px;bottom:calc(118px + var(--safeB));display:flex;flex-direction:column;align-items:center;gap:16px;z-index:3}
.ttbtn{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;font-weight:800;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6)}
.ttbtn svg{filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}.ttbtn.on{color:var(--lime)}
.ttcar{width:46px;height:46px;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,.85);background:#151614;position:relative}
.ttcar img{width:100%;height:100%;object-fit:cover;opacity:0}.ttcar img.ok{opacity:1}
.ttinfo{position:absolute;left:14px;right:78px;bottom:calc(112px + var(--safeB));z-index:3;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.tttxt{font-size:15px;line-height:1.35;margin-top:6px}
.ttstats{display:flex;gap:12px;font-size:13px;font-weight:700;margin-top:8px}
.ttinfo .pmloc{position:static;display:inline-flex;margin-top:10px}
.tthdr{position:absolute;left:0;right:0;top:0;z-index:5;padding:calc(10px + var(--safeT)) 12px 10px;display:flex;align-items:center;gap:8px;background:linear-gradient(rgba(0,0,0,.6),transparent)}
.tthdr .seg{flex:1;background:rgba(0,0,0,.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.tthdr .ib{background:rgba(0,0,0,.35);border-color:rgba(255,255,255,.14);width:38px;height:38px}
.ttpop{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%) scale(.4);opacity:0;color:var(--lime);z-index:6;pointer-events:none;transition:transform .35s cubic-bezier(.2,1.6,.4,1),opacity .35s}
.ttpop.on{transform:translate(-50%,-50%) scale(1);opacity:1}
.covergrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.covergrid button{height:64px;border-radius:14px;border:2px solid transparent;background-size:cover;background-position:center}
.covergrid button.on{border-color:var(--lime)}
.optrow{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);width:100%;text-align:left}
.optrow .rd{width:20px;height:20px;border-radius:99px;border:2px solid var(--line2);flex-shrink:0}.optrow.on .rd{border-color:var(--lime);background:radial-gradient(var(--lime) 45%,transparent 50%)}
`;document.head.appendChild(st);
/* ================= catálogo maior ================= */
const MORE={car:{Chevrolet:'Agile,Astra,Blazer,Captiva,Celta,Chevette,Classic,Kadett,Meriva,Monza,Omega,Opala,Sonic,Trailblazer,Vectra,Zafira,Bolt,Silverado,Camaro',Fiat:'147,Bravo,Elba,Freemont,Idea,Linea,Marea,Premio,Punto,Stilo,Tempra,Tipo,Titano,Scudo,Ducato,500',Volkswagen:'Fusca,Brasília,Passat,Santana,Parati,Kombi,Logus,Pointer,Bora,CrossFox,SpaceFox,Polo Sedan,Tiguan,Quantum,Apollo,ID.4',Ford:'Escort,Corcel,Del Rey,Belina,Verona,Pampa,Courier,Fusion,Edge,Maverick,Mustang,F-250,F-150,Transit',Toyota:'Bandeirante,Prius,Camry,Yaris Cross,Hilux SW4',Honda:'Accord,Civic Si,City Hatchback',Hyundai:'Azera,Elantra,i30,Veloster,Santa Fe,HR,HB20X',Renault:'Clio,Scénic,Mégane,Fluence,Master,Stepway,Symbol,Koleos',Nissan:'Livina,Tiida,Grand Livina,Leaf',Peugeot:'206,207 SW,307,308,408,Partner,Hoggar,Expert',Citroën:'Xsara Picasso,C4 Pallas,C4 Lounge,Aircross,Jumpy,C3 Picasso',Mitsubishi:'Lancer,Eclipse Cross,ASX,Pajero Sport,Pajero TR4',Kia:'Soul,Carnival,Bongo,Stonic,Niro',Jeep:'Wrangler,Grand Cherokee,Cherokee',Chery:'Tiggo 2,Tiggo 3X,Tiggo 5X,Tiggo 7,Tiggo 8,Arrizo 6,QQ,Celer,Cielo',GWM:'Haval H6,Ora 03,Poer,Haval H2',JAC:'J3,J5,T40,T60,E-JS1',Suzuki:'Jimny,Vitara,Grand Vitara,Swift,S-Cross',Subaru:'Impreza,Forester,XV,Outback','Mercedes-Benz':'Classe A,Classe C,Classe E,GLA,GLC,Sprinter','Audi':'A1,A3,A4,A5,Q3,Q5,TT','BMW':'118i,320i,X1,X3,X5,M3,Z4',Volvo:'XC40,XC60,XC90,C40','Land Rover':'Range Rover Evoque,Discovery Sport,Defender,Range Rover Velar',Porsche:'911,Cayenne,Macan,Boxster',RAM:'1500,2500,Rampage',Dodge:'Journey,Dart,Charger,Durango',Troller:'T4',Lifan:'X60,320',Tesla:'Model 3,Model Y'},
 moto:{Honda:'CG 125,CG 150 Titan,CG 150 Fan,CG 160 Start,CG 160 Fan,CG 160 Titan,NXR 150 Bros,CBX 250 Twister,XR 300L Tornado,CB 1000R,Hornet 600,Africa Twin,ADV 150,Shadow 750,Lead 110',Yamaha:'YBR 125,Fazer 150,XJ6,Ténéré 250,Ténéré 700,MT-09,Crypton,Fluo,Factor 125,XTZ 250 Lander',Suzuki:'Yes 125,Intruder 125,GSR 750,Hayabusa,V-Strom 1050',Kawasaki:'Ninja 300,Ninja ZX-6R,Z650,Z1000','Harley-Davidson':'Iron 883,Fat Boy,Street Glide,Sportster S,Fat Bob',Ducati:'Monster,Panigale V4,Scrambler,Multistrada',Dafra:'Apache 200,Citycom,Next 250',Triumph:'Bonneville,Speed Triple,Tiger 1200',BMW:'R 1250 RT,F 900 R,K 1600'}};
(function(){const CAT=RL.CAT,ALL=RL.CATALL;if(!CAT||!ALL)return;for(const t in MORE)for(const b in MORE[t]){const arr=CAT[t][b]||(CAT[t][b]=[]);for(const m of MORE[t][b].split(',')){if(!arr.includes(m)){arr.push(m);ALL.push({t,b,m,k:b+' '+m});}}arr.sort((x,y)=>x.localeCompare(y,'pt',{numeric:true}));}
 const sorted=Object.keys(CAT.car).sort((a,b)=>a.localeCompare(b));const nc={};sorted.forEach(k=>nc[k]=CAT.car[k]);Object.keys(CAT.car).forEach(k=>delete CAT.car[k]);Object.assign(CAT.car,nc);
 ALL.sort((x,y)=>y.m.length-x.m.length);})();
const modelKey=RL.modelKey||(s=>s),isMoto=RL.isMoto||(()=>false);
/* ================= fotos reais (Wikimedia Commons) ================= */
let PH={};try{PH=JSON.parse(localStorage.getItem('role.photos')||'{}');}catch(e){}
const savePH=()=>{try{localStorage.setItem('role.photos',JSON.stringify(PH));}catch(e){}};
const pend=new Map();
const BAD=/interior|innenraum|int[eé]rieur|engine|motor|logo|badge|emblem|dashboard|painel|cockpit|wheel|felge|trunk|kofferraum|seat|steering|lenkrad|detail|tail ?light|headlight|farol|lanterna|\.svg|\.pdf|\.tif|\.gif|\.webm|\.ogv|map|diagram|brochure|toy|model car|lego|crash|wreck|unfall|plate/i;
function photosOf(model){if(PH[model])return Promise.resolve(PH[model]);if(pend.has(model))return pend.get(model);
  const pr=(async()=>{let urls=[];
   try{const u=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent('"'+model+'"')}&gsrlimit=30&prop=imageinfo&iiprop=url|size&iiurlwidth=720&format=json&origin=*`;
    const j=await(await fetch(u)).json();const pages=Object.values((j.query||{}).pages||{}).sort((a,b)=>a.index-b.index);
    for(const p of pages){if(BAD.test(p.title))continue;const ii=p.imageinfo&&p.imageinfo[0];if(!ii||!ii.thumburl||ii.width<ii.height*1.15||ii.width<500)continue;urls.push(ii.thumburl);if(urls.length>=10)break;}}catch(e){}
   if(urls.length<2){try{const j=await(await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(model)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=720&format=json&origin=*`)).json();const p=Object.values((j.query||{}).pages||{})[0];if(p&&p.thumbnail&&!urls.includes(p.thumbnail.source))urls.push(p.thumbnail.source);}catch(e){}}
   PH[model]=urls;savePH();pend.delete(model);fillPics(model);return urls;})();pend.set(model,pr);return pr;}
function carPic(model,seed){const l=PH[model];if(l)return l.length?l[Math.floor(hsh(seed+'|'+model)*l.length)]:null;photosOf(model);return undefined;}
function fillPics(model){$$('[data-cp]').forEach(el=>{if(el.dataset.cp!==model)return;const u=carPic(model,el.dataset.seed);if(u){el.onload=()=>el.classList.add('ok');el.src=u;}else if(u===null){el.remove();}});}
const picTag=(model,seed,cls='')=>{const u=carPic(model,seed);if(u===null)return'';return`<img data-cp="${esc(model)}" data-seed="${esc(seed)}" class="${cls}" src="${u||PX}" ${u?'onload="this.classList.add(\'ok\')"':''} alt="" referrerpolicy="no-referrer">`;};
RL.photosOf=photosOf;RL.carPic=carPic;RL.picTag=picTag;
/* ================= avatar: carro + fundo escuro, pra todos ================= */
const silh=t=>RL.silh?RL.silh(t):'';
RL.avatar2=function(w,s){const box=inner=>`<span class="av avc" style="width:${s}px;height:${s}px">${inner}</span>`;
  if(w&&w.me){const c=RL.featCar&&RL.featCar();if(c&&c.front)return box(`<img class="ok cut" src="${c.front}" alt="">`);if(c)return box(silh(c.type)+picTag(modelKey(c.model),'me'));return box(silh('car'));}
  const key=modelKey(w&&w.car||'');const moto=w&&(w.moto||isMoto(key));return box(silh(moto?'moto':'car')+(key?picTag(key,w.h||''):''));};
RL.heroPic=function(key,seed,moto){return`<div class="sil">${silh(moto?'moto':'car')}</div>${picTag(key,seed||'hero','hero')}`;};
/* ================= localização: cidade, privacidade ================= */
const offset=(p,m,b)=>{const r=b*Math.PI/180;return[p[0]+m*Math.sin(r)/(111320*Math.cos(p[1]*Math.PI/180)),p[1]+m*Math.cos(r)/110540];};
const personPos=(h,salt='')=>offset(myPos(),(RL.distKm?RL.distKm(h):5)*1000,hsh('b'+h+salt)*360);
const locMode=h=>{if(h===S.me.handle)return S.me.postLoc||'exact';const x=hsh('loc'+h);return x<.7?'exact':x<.88?'city':'hidden';};
RL.personPos=personPos;RL.locMode=locMode;
let cityReq=null;
function myCity(){if(S.myCity&&S.myCityAt&&Date.now()-S.myCityAt<864e5&&S.myCityPos&&Math.abs(S.myCityPos[0]-myPos()[0])<.05)return S.myCity;
  if(!cityReq){const p=myPos();cityReq=fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&accept-language=pt-BR&lat=${p[1]}&lon=${p[0]}`).then(r=>r.json()).then(j=>{const a=j.address||{};S.myCity=a.city||a.town||a.village||a.municipality||a.county||'';S.myCityAt=Date.now();S.myCityPos=p;save();cityReq=null;$$('[data-city]').forEach(e=>e.textContent=S.myCity);}).catch(()=>{cityReq=null;});}
  return S.myCity||'';}
RL.myCity=myCity;
RL.cityTag=()=>S.me.showCity&&S.me.city?` · <span style="display:inline-flex;align-items:center;gap:3px">${ic(PIN,12)}${esc(S.me.city)}</span>`:'';
RL.personLocTxt=p=>{const m=locMode(p.h);if(m==='hidden')return' · localização oculta';const d=RL.distKm?RL.distKm(p.h):0;const city=myCity();return` · ${d<15?`<span data-city>${esc(city||'perto de você')}</span>`:'região'} · a ${String(d).replace('.',',')} km de você`;};
/* ================= mapa estático real (CARTO escuro + OpenStreetMap) ================= */
const TS=256,lon2x=(l,z)=>(l+180)/360*TS*2**z,lat2y=(a,z)=>{const s=Math.sin(a*Math.PI/180);return(.5-Math.log((1+s)/(1-s))/(4*Math.PI))*TS*2**z;};
function staticMap(coords,W,H,o={}){if(!coords||coords.length<2)return'';const pad=o.pad||36;let z=o.maxZ||17,x0,x1,y0,y1;
  for(;z>=3;z--){x0=1e18;x1=-1e18;y0=1e18;y1=-1e18;for(const p of coords){const x=lon2x(p[0],z),y=lat2y(p[1],z);if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}if(x1-x0<=W-2*pad&&y1-y0<=(o.fitH||H)-2*pad)break;}
  const ox=(x0+x1)/2-W/2,oy=(y0+y1)/2-H/2+(o.shiftY||0),n=2**z;let imgs='';
  if(!o.noTiles)for(let tx=Math.floor(ox/TS);tx<=Math.floor((ox+W)/TS);tx++)for(let ty=Math.floor(oy/TS);ty<=Math.floor((oy+H)/TS);ty++){if(ty<0||ty>=n)continue;const wx=((tx%n)+n)%n;imgs+=`<img src="https://${'abcd'[(wx+ty)%4]}.basemaps.cartocdn.com/dark_all/${z}/${wx}/${ty}@2x.png" style="left:${(tx*TS-ox).toFixed(0)}px;top:${(ty*TS-oy).toFixed(0)}px" alt="" loading="lazy">`;}
  const pts=coords.map(p=>(lon2x(p[0],z)-ox).toFixed(1)+','+(lat2y(p[1],z)-oy).toFixed(1));const a=pts[0].split(','),b=pts[pts.length-1].split(',');const sw=o.sw||4.5;
  const route=o.noRoute?'':`<polyline points="${pts.join(' ')}" fill="none" stroke="#C6F432" stroke-opacity=".28" stroke-width="${sw*3.2}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#DCFF4A" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>${o.ends===false?'':`<circle cx="${a[0]}" cy="${a[1]}" r="${sw*1.4}" fill="#0A0B0A" stroke="#C6F432" stroke-width="${sw*.7}"/><circle cx="${b[0]}" cy="${b[1]}" r="${sw*1.6}" fill="#C6F432"/>`}`;
  return`<div class="smap ${o.blur?'blur':''}" style="width:${W}px;height:${H}px">${imgs}<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${route}${o.extra?o.extra(c=>[(lon2x(c[0],z)-ox),(lat2y(c[1],z)-oy)]):''}</svg></div>`;}
RL.staticMap=staticMap;
const trim=(c,m)=>{if(!c||c.length<4)return c;const d=(a,b)=>Math.hypot((a[0]-b[0])*111320*Math.cos(a[1]*Math.PI/180),(a[1]-b[1])*110540);let s=0,i=0;while(i<c.length-2&&s<m){s+=d(c[i],c[i+1]);i++;}let e=0,j=c.length-1;while(j>i+1&&e<m){e+=d(c[j],c[j-1]);j--;}return c.slice(i,j+1);};
/* rotas reais pros posts simulados (OSRM, uma por vez) */
const RT=new Map(),RQ=[];let rbusy=false;
function needRoute(p){if(RT.has(p.id)||RQ.includes(p))return;RQ.push(p);pump();}
async function pump(){if(rbusy||!RQ.length)return;rbusy=true;const p=RQ.shift();
  try{const a=personPos(p.h,p.id),r=hsh('r'+p.id),b=offset(a,1800+r*5200,hsh('rb'+p.id)*360);
   const j=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${a[0].toFixed(5)},${a[1].toFixed(5)};${b[0].toFixed(5)},${b[1].toFixed(5)}?overview=full&geometries=geojson&steps=true`)).json();
   const r0=j.routes&&j.routes[0];if(!r0)throw 0;const names=[...new Set(r0.legs[0].steps.map(s=>s.name).filter(Boolean))];RT.set(p.id,{c:r0.geometry.coordinates,names,km:r0.distance/1000,sec:r0.duration*1.15});}
  catch(e){RT.set(p.id,{c:null,names:[]});}
  fillMaps(p.id);setTimeout(()=>{rbusy=false;pump();},650);}
function routeOf(p){if(p.mine)return{c:p.track,names:p.where?[p.where]:[],km:p.km,sec:p.sec};const r=RT.get(p.id);if(!r){needRoute(p);return null;}return r.c?r:{c:p.track,names:[],km:p.km,sec:p.sec,fake:1};}
function locLabel(p,r){const m=p.loc||locMode(p.h);if(m==='hidden')return'Localização oculta';const city=p.mine&&p.city?p.city:myCity();if(m==='city')return city||'Cidade';const n=(r&&r.names||[]).slice(0,2).join(' → ');return(n?n+(city?' · ':''):'')+(city||'');}
function mapInner(p,W,H,o={}){const r=routeOf(p);if(!r)return`<div class="pmload">Carregando mapa…</div>`;const m=p.loc||locMode(p.h);let c=r.c;if(p.hideEnds&&m==='exact')c=trim(c,200);
  const html=m==='hidden'?`<div style="position:absolute;inset:0">${trackSVG(c,W,H)}</div>`:staticMap(c,W,H,{blur:m==='city',maxZ:m==='city'?12:17,...o});
  return html+(m==='hidden'?'':'<span class="osmc">© OpenStreetMap © CARTO</span>')+`<span class="pmloc">${ic(PIN,13)}<span>${esc(locLabel(p,r))}</span></span>`;}
function fillMaps(id){const p=findPost(id);if(!p)return;$$(`[data-pm="${id}"]`).forEach(el=>{el.innerHTML=mapInner(p,+el.dataset.w,+el.dataset.h,el.dataset.tt?TTO:{});});const r=RT.get(id);if(r&&r.km)$$(`[data-pkm="${id}"]`).forEach(el=>el.textContent=String(Math.round(r.km*10)/10).replace('.',',')+' km');}
const TTO={pad:70,fitH:520,shiftY:120,sw:6};
RL.postMap=p=>{if(!p.track&&!p.mine&&!RT.has(p.id))needRoute(p);return`<div class="smapw" data-pm="${p.id}" data-w="440" data-h="210">${mapInner(p,440,210)}</div>`;};
/* ================= posts: lista unificada ================= */
const GEN=[];RL.extraPosts=RL.extraPosts||[];
const findPost=id=>C.allPosts().find(p=>p.id===id)||GEN.find(p=>p.id===id);
/* ================= FEED VERTICAL (Para você) ================= */
const TTX=['Rolê de fim de tarde, cidade vazia','+{h} hex hoje, devolve quem puder','Fui pegar a namorada e voltei com {h} hexágonos','Teste de consumo: {k} km sem parar','Bora rodar sexta? Comenta aí','Primeira vez no modo território. Viciei','Caminho novo descoberto','Domingo é dia de rolê com a crew'];
const TTP=['Lavado e pronto pro rolê','Meu {m} depois do polimento','O que acharam das rodas?','Encontro de ontem foi brabo','Fim de tarde com o {m}','Projeto saindo do papel','Quem tem um igual comenta aí','Primeiro carro a gente nunca esquece'];
const POP=['Volkswagen Gol','Fiat Uno','Chevrolet Onix','Fiat Argo','Hyundai HB20','Volkswagen Polo','Fiat Strada','Toyota Corolla','Honda Civic','Jeep Renegade','Renault Kwid','Fiat Toro','Honda CG 160','Yamaha Fazer 250','Volkswagen Fusca','Chevrolet Opala','Ford Ka','Volkswagen Saveiro','Chevrolet Celta','Toyota Hilux','Honda XRE 300','Fiat Palio','Volkswagen Golf','Chevrolet S10'];
let pool=null;
function people(){if(pool)return pool;pool=[...C.P];if(RL.ownersOf)for(const m of POP){try{RL.ownersOf(m).forEach(o=>{if(!o.me&&!pool.includes(o))pool.push(o);});}catch(e){}}return pool;}
function genPost(i){const r=C.rnd(9000+i*7),ps=people(),w=ps[Math.floor(r()*ps.length)],key=modelKey(w.car),photo=r()<.42;const hx=2+Math.floor(r()*16),km=Math.round(4+r()*45);
  const p={id:'tt'+i,h:w.h,kind:photo?'photo':'ride',model:key,txt:(photo?TTP:TTX)[Math.floor(r()*8)].replace('{h}',hx).replace('{k}',km).replace('{m}',key.split(' ').slice(1).join(' ')),hex:photo?0:hx,km:photo?0:km,sec:photo?0:Math.round(900+r()*4000),t:Date.now()-(i*1.3+r())*3600e3,horn:Math.round(8+r()*900),track:null,cm:[]};
  GEN.push(p);RL.extraPosts.push(p);return p;}
function ttItem(p){const w=C.who(p.h)||{n:p.h,h:p.h};const cr=w.crew&&C.CREWS?C.CREWS[w.crew]:null,key=p.model||modelKey(w.car||''),on=p.mine?!!(S.posts.find(x=>x.id===p.id)||{}).hornOn:!!S.horn[p.id];
  const n=p.mine?(S.posts.find(x=>x.id===p.id)||{}).horn||0:p.horn+(S.horn[p.id]?1:0);const cm=(p.cm||[]).length+((S.cm||{})[p.id]||[]).length;
  const bg=p.kind==='photo'?picTag(key,p.id):`<div class="smapw" data-pm="${p.id}" data-w="480" data-h="960" data-tt="1">${mapInner(p,480,960,TTO)}</div>`;
  const r=p.kind==='photo'?null:(RT.get(p.id)||null);
  return`<section class="tti" data-id="${p.id}"><div class="ttbg">${bg}</div><div class="ttshade"></div><div class="ttpop">${ic(I.horn,90,2)}</div>
  <div class="ttside"><button data-on="prof" data-h="${esc(p.h)}">${RL.avatar2?RL.avatar2(w.me?{me:true}:w,50):''}</button>
   <button class="ttbtn ${on?'on':''}" data-on="horn" data-id="${p.id}">${ic(I.horn,30,2)}<span>${n}</span></button>
   <button class="ttbtn" data-on="cmts" data-id="${p.id}">${ic(I.cmt,28,2)}<span>${cm}</span></button>
   <button class="ttbtn" data-on="sharep" data-id="${p.id}">${ic(I.share,28,2)}<span>Enviar</span></button>
   ${key?`<button class="ttcar" data-on="model" data-m="${esc(key)}">${w.me&&RL.featCar&&RL.featCar()&&RL.featCar().front?`<img class="ok" src="${RL.featCar().front}" style="object-fit:contain">`:picTag(key,p.h)}</button>`:''}</div>
  <div class="ttinfo"><div class="b" style="font-size:16px">${esc(w.n)} ${cr?`<span style="color:${cr.c};font-weight:700">· ${esc(w.crew)}</span>`:''}</div>
   <div class="small" style="opacity:.85;margin-top:2px">@${esc(p.h)} · ${ago(p.t)}${RL.distTxt?RL.distTxt(p.h):''}${key?` · <button data-on="model" data-m="${esc(key)}" class="carlink" style="color:#fff">${esc(key)}</button>`:''}</div>
   <div class="tttxt">${esc(p.txt)}</div>
   ${p.kind==='photo'?'':`<div class="ttstats"><span class="lime">+${p.hex} hex</span><span data-pkm="${p.id}">${String(Math.round((r&&r.km||p.km)*10)/10).replace('.',',')} km</span>${p.sec?`<span>${fmtT(p.sec)}</span>`:''}</div>`}
   ${p.kind==='photo'?`<div class="small" style="opacity:.5;margin-top:8px">Foto: Wikimedia Commons</div>`:''}</div></section>`;}
const OF=SCREENS.feed;
function tabsHTML(f){return`<div class="seg" id="ff">${[['all','Para você'],['fol','Seguindo'],['crew','Minha crew']].map(([k,t])=>`<button data-k="${k}" class="${f===k?'on':''}">${t}</button>`).join('')}</div>`;}
SCREENS.feed={tab:'feed',
 html(){const f=this.f||'all';if(f!=='all')return OF.html.call(this);const unread=S.notifs.filter(n=>!n.read).length;
  return`<div class="ttwrap"><div class="tt" id="tt"></div><div class="tthdr">${tabsHTML(f)}<button class="ib" data-go="events" aria-label="Eventos">${ic('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',18)}</button><button class="ib" data-go="explore" aria-label="Buscar">${ic(I.search,18)}</button><button class="ib" data-go="notifs" style="position:relative" aria-label="Notificações">${ic(I.bell,18)}${unread?'<span class="dotn"></span>':''}</button></div></div>`;},
 mount(el){const f=this.f||'all';const bindTabs=()=>$$('#ff button',el).forEach(b=>b.onclick=()=>{if(b.dataset.k===(this.f||'all'))return;this.f=b.dataset.k;router.render(this,true,true);});
  if(f!=='all'){OF.mount.call(this,el);bindTabs();return;}bindTabs();
  const tt=$('#tt',el);const mine=C.allPosts().filter(p=>p.mine).slice(0,3);const base=C.FPOSTS.slice(0,4);
  let items=[...mine,...base];this.gi=this.gi||0;
  const add=list=>{tt.insertAdjacentHTML('beforeend',list.map(ttItem).join(''));list.forEach(p=>{if(p.kind!=='photo'&&!p.mine)needRoute(p);});};
  add(items);const more=()=>{const l=[];for(let k=0;k<6;k++)l.push(GEN[this.gi]||genPost(this.gi)),this.gi++;add(l);};more();
  tt.addEventListener('scroll',()=>{if(tt.scrollTop+tt.clientHeight*3>tt.scrollHeight)more();},{passive:true});
  let lt=0;tt.addEventListener('click',e=>{if(e.target.closest('button'))return;const now=Date.now();if(now-lt<320){const s=e.target.closest('.tti');if(s){const b=$('[data-on="horn"]',s);if(b&&!b.classList.contains('on'))b.click();const pop=$('.ttpop',s);pop.classList.add('on');setTimeout(()=>pop.classList.remove('on'),650);}}lt=now;});},
 on:{...C.postHandlers}};
/* ================= postar com privacidade ================= */
const SUM=SCREENS.summary;
SUM.on.post=function(a){const r=S.rides.find(x=>x.id===this.params.id);if(!r)return;let mode=S.me.postLoc||'exact',ends=S.me.hideEnds!==false;const node=this;
  const opts=[['exact','Rua e trajeto','Mostra o mapa real com as ruas'],['city','Só a cidade','Mapa desfocado, só a cidade aparece'],['hidden','Ocultar','Só o desenho do trajeto, sem mapa']];
  sheet(`<div style="font-size:20px;font-weight:800">Postar rolê</div><label class="f">Legenda</label><input class="inp" id="pt" maxlength="140" value="${esc(r.dest?'Rolê até '+r.dest:'Rolê pela cidade')}">
   <label class="f">Localização no post</label><div id="lo">${opts.map(([k,t,d])=>`<button class="optrow ${mode===k?'on':''}" data-k="${k}"><span class="rd"></span><div style="flex:1"><div class="b">${t}</div><div class="small muted">${d}</div></div></button>`).join('')}</div>
   <button class="optrow" id="he" style="border:none"><div style="flex:1"><div class="b">Esconder início e fim</div><div class="small muted">Corta 200 m das pontas, pra não mostrar onde você mora</div></div><span class="switch ${ends?'on':''}"></span></button>
   <button class="btn" id="ps" style="margin-top:12px">Postar</button>`,(w,close)=>{
   $$('#lo [data-k]',w).forEach(b=>b.onclick=()=>{mode=b.dataset.k;$$('#lo [data-k]',w).forEach(x=>x.classList.toggle('on',x===b));});
   $('#he',w).onclick=()=>{ends=!ends;$('#he .switch',w).classList.toggle('on',ends);};
   $('#ps',w).onclick=()=>{const p={id:'p'+Date.now(),t:Date.now(),ride:r.id,txt:$('#pt',w).value.trim()||'Rolê',horn:0,me:true,cmts:[],loc:mode,hideEnds:ends};S.posts.unshift(p);S.me.postLoc=mode;S.me.hideEnds=ends;save();close();
    a.textContent='Postado!';a.disabled=true;a.style.opacity=.5;toast('Postado na comunidade');
    if(mode!=='hidden'&&r.track&&r.track.length){const s=r.track[Math.floor(r.track.length/2)];fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=17&accept-language=pt-BR&lat=${s[1]}&lon=${s[0]}`).then(x=>x.json()).then(j=>{const ad=j.address||{};p.where=ad.road||ad.neighbourhood||'';p.city=ad.city||ad.town||ad.village||'';save();}).catch(()=>{});}};});};
/* ================= perfil: capa e cidade ================= */
const COVERS={hex:['Hexágonos',''],lime:['Lima','background:radial-gradient(80% 120% at 80% 0%,rgba(198,244,50,.55),transparent 60%),#0E0F0D'],night:['Cidade à noite','background:radial-gradient(40% 60% at 20% 100%,rgba(255,170,60,.45),transparent),radial-gradient(40% 70% at 75% 100%,rgba(90,140,255,.4),transparent),linear-gradient(#05060A,#121522)'],sunset:['Pôr do sol','background:linear-gradient(160deg,#FF7A1A 0%,#B3245F 45%,#1A1030 100%)'],carbon:['Carbono','background:repeating-linear-gradient(45deg,#121311 0 6px,#1B1C1A 6px 12px),#121311'],crew:['Cor da crew','background:linear-gradient(135deg,var(--cc),#0E0F0D 80%)']};
RL.coverCss=()=>{const c=S.me.cover||'hex';if(c==='photo'&&S.me.coverImg)return`background:linear-gradient(transparent 35%,rgba(10,11,10,.85)),url("${S.me.coverImg}") center/cover`;if(c==='car'){const f=RL.featCar&&RL.featCar();if(f&&f.front)return`background:linear-gradient(transparent 30%,rgba(10,11,10,.9)),url("${f.front}") center 65%/62% no-repeat,radial-gradient(70% 90% at 50% 100%,rgba(198,244,50,.25),#0E0F0D)`;}return(COVERS[c]||COVERS.hex)[1];};
const PO=SCREENS.profile.on;
PO.coverEdit=function(){sheet(`<div style="font-size:20px;font-weight:800">Capa do perfil</div><div class="covergrid">${Object.entries(COVERS).map(([k,[n,css]])=>`<button data-c="${k}" class="${(S.me.cover||'hex')===k?'on':''}" style="${css||'background:repeating-linear-gradient(60deg,transparent 0 10px,rgba(255,255,255,.06) 10px 11px),#0E0F0D'}" title="${n}"></button>`).join('')}</div>
  <button class="btn sec" id="cc" style="margin-top:14px">${ic(I.car,18)}Usar meu carro destaque</button><button class="btn sec" id="cg" style="margin-top:10px">${ic(I.cam,18)}Escolher foto da galeria</button><input type="file" accept="image/*" id="cf" hidden>`,(w,close)=>{
  const done=()=>{save();close();router.tabTo('profile');toast('Capa atualizada');};
  $$('[data-c]',w).forEach(b=>b.onclick=()=>{S.me.cover=b.dataset.c;done();});$('#cc',w).onclick=()=>{S.me.cover='car';done();};
  $('#cg',w).onclick=()=>$('#cf',w).click();$('#cf',w).onchange=e=>{const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f),img=new Image();img.onload=()=>{const W=1080,H=440,c=document.createElement('canvas');c.width=W;c.height=H;const k=Math.max(W/img.width,H/img.height);c.getContext('2d').drawImage(img,(W-img.width*k)/2,(H-img.height*k)/2,img.width*k,img.height*k);let d=c.toDataURL('image/webp',.8);if(!d.startsWith('data:image/webp'))d=c.toDataURL('image/jpeg',.8);S.me.coverImg=d;S.me.cover='photo';URL.revokeObjectURL(u);done();};img.src=u;};});};
PO.edit=function(){sheet(`<div style="font-size:20px;font-weight:800">Editar perfil</div><label class="f">Nome</label><input class="inp" id="en" value="${esc(S.me.name)}" maxlength="30"><label class="f">Usuário</label><input class="inp" id="eh" value="${esc(S.me.handle)}" maxlength="20"><label class="f">Bio</label><input class="inp" id="eb" value="${esc(S.me.bio||'')}" maxlength="80" placeholder="Uma frase sobre seus rolês">
  <label class="f">Cidade</label><div class="row" style="gap:8px"><input class="inp" id="ec" value="${esc(S.me.city||'')}" placeholder="Sua cidade" style="flex:1"><button class="ib" id="eg" style="width:50px;height:50px;border-radius:15px" aria-label="Usar minha localização">${ic(I.loc,18)}</button></div>
  <button class="optrow" id="es2" style="border:none"><div style="flex:1"><div class="b">Mostrar cidade no perfil</div><div class="small muted">Opcional. Ninguém vê seu endereço</div></div><span class="switch ${S.me.showCity?'on':''}"></span></button>
  <button class="btn" id="es" style="margin-top:8px">Salvar</button>`,(w,close)=>{let show=!!S.me.showCity;
  $('#es2',w).onclick=()=>{show=!show;$('#es2 .switch',w).classList.toggle('on',show);};
  $('#eg',w).onclick=()=>{const c=myCity();if(c)$('#ec',w).value=c;else{toast('Buscando sua cidade…','dark');setTimeout(()=>{if(S.myCity)$('#ec',w).value=S.myCity;},1800);}};
  $('#es',w).onclick=()=>{const n=$('#en',w).value.trim(),h=$('#eh',w).value.trim().toLowerCase().replace(/[^a-z0-9._]/g,'');if(n.length<2||h.length<3){toast('Nome ou usuário muito curto','dark');return;}S.me.name=n;S.me.handle=h;S.me.bio=$('#eb',w).value.trim();S.me.city=$('#ec',w).value.trim();S.me.showCity=show&&!!S.me.city;save();close();router.tabTo('profile');toast('Perfil atualizado');};});};
/* pré-carrega fotos dos modelos mais vistos */
setTimeout(()=>{myCity();[...new Set(C.P.map(p=>modelKey(p.car)))].forEach((m,i)=>setTimeout(()=>photosOf(m),i*250));},1500);
})();
