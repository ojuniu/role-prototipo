/* Rolê — modos do mapa (desbloqueio x navegação), bairros bloqueados, amigos no mapa, busca inteligente, rankings,
   card de story, custo do rolê, replay 3D, modo pista e carro elétrico */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm||!RL.tt)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,ride,gps,ago,fmtT,fmtKm,activeCar}=RL;
const C=RL.comm,T=RL.tt;const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const rad=d=>d*Math.PI/180;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 12742000*Math.asin(Math.sqrt(x));};
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const getMap=()=>RL.getMap&&RL.getMap();
const brl=v=>'R$ '+v.toFixed(2).replace('.',',');
const LOCKP='<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
const TROPHY='<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>';
const PIN='<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
const st=document.createElement('style');st.textContent=`
.mpick{position:absolute;inset:0;z-index:60;background:rgba(5,6,5,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;flex-direction:column;justify-content:center;padding:24px 18px calc(24px + var(--safeB));gap:14px;animation:mpin .35s ease}
@keyframes mpin{from{opacity:0}to{opacity:1}}
.mpick h3{font-family:'Anton','Oswald',sans-serif;font-weight:400;font-size:30px;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px 4px;transform:skewX(-8deg)}
.mcard{position:relative;height:190px;border-radius:22px;overflow:hidden;text-align:left;border:1.5px solid rgba(255,255,255,.12);transform:skewX(-4deg);transition:transform .2s,border-color .2s;box-shadow:0 20px 40px rgba(0,0,0,.5)}
.mcard:active{transform:skewX(-4deg) scale(.97)}.mcard.last{border-color:var(--lime)}
.mcard .bg{position:absolute;inset:0}.mcard .in{position:absolute;inset:0;padding:18px 20px;display:flex;flex-direction:column;justify-content:flex-end;transform:skewX(4deg)}
.mcard .t{font-family:'Anton','Oswald',sans-serif;font-size:40px;line-height:.9;letter-spacing:1px;text-transform:uppercase;font-style:italic}
.mcard .d{font-size:13px;font-weight:700;opacity:.8;margin-top:6px;max-width:80%}
.mcard .tag{position:absolute;right:16px;top:14px;font-size:11px;font-weight:900;letter-spacing:1px;padding:4px 9px;border-radius:99px;background:rgba(0,0,0,.55);transform:skewX(4deg)}
.modechip{position:absolute;left:14px;top:calc(176px + var(--safeT));z-index:6;height:32px;padding:0 12px 0 8px;border-radius:99px;background:rgba(18,19,17,.86);border:1px solid var(--line2);display:flex;align-items:center;gap:7px;font-size:12px;font-weight:800;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.modechip i{width:18px;height:18px;border-radius:99px;display:flex;align-items:center;justify-content:center;font-style:normal;color:#0A0B0A}
.disc{position:absolute;right:66px;top:calc(176px + var(--safeT));z-index:6;max-width:46%;padding:6px 11px;border-radius:14px;background:rgba(18,19,17,.86);border:1px solid var(--line2);font-size:11.5px;font-weight:700;line-height:1.3;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.disc b{color:var(--lime2);font-size:15px}
.unlockfx{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);z-index:70;text-align:center;pointer-events:none;animation:ufx 2.6s ease forwards}
.unlockfx .k{font-family:'Anton','Oswald',sans-serif;font-size:15px;letter-spacing:3px;color:var(--lime2)}
.unlockfx .n{font-family:'Anton','Oswald',sans-serif;font-size:44px;line-height:1;text-transform:uppercase;text-shadow:0 0 30px rgba(198,244,50,.6)}
@keyframes ufx{0%{opacity:0;transform:translate(-50%,-40%) scale(.8)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}25%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-60%)}}
.sx-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 0 8px}.sx-tabs::-webkit-scrollbar{display:none}
.sx-tabs button{flex:0 0 auto;height:34px;padding:0 13px;border-radius:99px;background:#141512;border:1px solid var(--line);font-weight:800;font-size:12.5px}
.sx-tabs button.on{background:var(--lime);color:#0A0B0A;border-color:var(--lime)}
.sx-sec{display:flex;align-items:center;justify-content:space-between;margin:14px 4px 6px}.sx-sec b{font-size:13px;color:var(--tx3);text-transform:uppercase;letter-spacing:.6px}.sx-sec button{font-size:12.5px;font-weight:800;color:var(--lime2)}
.sx-row{display:flex;align-items:center;gap:12px;padding:10px 4px;width:100%;text-align:left}
.sx-ico{width:42px;height:42px;border-radius:13px;background:#141512;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.sx-ico img{width:100%;height:100%;object-fit:cover}
.sx-kind{font-size:11px;font-weight:800;color:var(--tx3);padding:3px 8px;border-radius:99px;background:rgba(255,255,255,.06)}
.sx-lock{color:#FFB547}
.rk2 .seg{margin-bottom:10px}
.stk-card{width:100%;border-radius:18px;display:block;margin-top:12px;box-shadow:0 20px 40px rgba(0,0,0,.5)}
.rp-hud{position:absolute;left:14px;right:14px;bottom:calc(20px + var(--safeB));z-index:21;padding:14px 16px;border-radius:22px;background:rgba(14,15,13,.9);border:1px solid var(--line2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.rp-bar{height:4px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin:10px 0}.rp-bar i{display:block;height:100%;background:var(--lime);width:0}
.tk-big{font-family:'Anton','Oswald',sans-serif;font-size:64px;line-height:1;font-variant-numeric:tabular-nums}
.tk-delta{font-family:'Anton','Oswald',sans-serif;font-size:26px}
.tk-delta.up{color:#FF6A6A}.tk-delta.dn{color:var(--lime2)}
.ghostdot{width:18px;height:18px;border-radius:99px;background:rgba(198,244,50,.35);border:2px solid var(--lime);box-shadow:0 0 14px var(--lime)}
`;document.head.appendChild(st);
/* =====================================================================
   1) PERSISTÊNCIA: fotos grandes do carro vão pro IndexedDB (o localStorage enchia e nada mais salvava,
      inclusive o modo fantasma)
   ===================================================================== */
let dbp=null;const db=()=>dbp||(dbp=new Promise((ok,no)=>{const r=indexedDB.open('role-img',1);r.onupgradeneeded=()=>r.result.createObjectStore('i');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}));
const idbPut=async(k,v)=>{const d=await db();return new Promise(ok=>{const tx=d.transaction('i','readwrite');tx.objectStore('i').put(v,k);tx.oncomplete=()=>ok(true);tx.onerror=()=>ok(false);});};
const idbGet=async k=>{const d=await db();return new Promise(ok=>{const r=d.transaction('i').objectStore('i').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null);});};
const SLOTS=['front','rear','frontOrig','rearOrig'];
async function offload(){let ch=false;for(const c of S.cars){c.img=c.img||{};for(const k of SLOTS){const v=c[k];if(typeof v==='string'&&v.startsWith('data:')&&v.length>20000){const key='car:'+c.id+':'+k;if(await idbPut(key,v)){c.img[k]=key;c[k]=v;ch=true;}}}}
  if(ch)saveLight();}
/* salva sem os dataURLs gigantes (eles ficam no IndexedDB) */
const KEY='role.v2';
function saveLight(){try{const o=JSON.parse(JSON.stringify(S));for(const c of o.cars||[]){for(const k of SLOTS){if(c.img&&c.img[k]&&typeof c[k]==='string'&&c[k].length>2000)c[k]='idb';}}localStorage.setItem(KEY,JSON.stringify(o));return true;}catch(e){return false;}}
async function restore(){let ch=false;for(const c of S.cars){if(!c.img)continue;for(const k of SLOTS){if((c[k]==='idb'||!c[k])&&c.img[k]){const v=await idbGet(c.img[k]);if(v){c[k]=v;ch=true;}}}}
  if(ch){try{RL.rebuildCar&&RL.rebuildCar();}catch(e){}try{const cur=router.cur;if(cur&&cur.name!=='map')router.render(cur,true,true);}catch(e){}}}
/* intercepta o save original: depois de cada save, regrava a versão leve */
const origSet=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){if(this===localStorage&&k===KEY&&typeof v==='string'&&v.length>800000){
  try{const o=JSON.parse(v);let big=false;for(const c of o.cars||[])for(const x of SLOTS)if(typeof c[x]==='string'&&c[x].length>20000){big=true;}if(big){offload();for(const c of o.cars||[])for(const x of SLOTS)if(c.img&&c.img[x]&&typeof c[x]==='string'&&c[x].length>2000)c[x]='idb';v=JSON.stringify(o);}}catch(e){}}
  return origSet.call(this,k,v);};
restore().then(offload);
/* modo fantasma salvo também numa chave própria, pequena */
try{const g=localStorage.getItem('role.ghost');if(g!==null){S.settings.ghost=g==='1';document.body.classList.toggle('ghost',S.settings.ghost);}}catch(e){}
document.addEventListener('click',e=>{if(e.target.closest('[data-on="ghost"]'))setTimeout(()=>{try{localStorage.setItem('role.ghost',S.settings.ghost?'1':'0');}catch(x){}},50);},true);
/* =====================================================================
   2) AMIGOS: só quem você segue e te segue de volta aparece no mapa
   ===================================================================== */
S.follow=S.follow||{};S.followsMe=S.followsMe||{};
const followsBack=h=>S.followsMe[h]!=null?!!S.followsMe[h]:hsh('fb'+h)<.62;
const mutual=h=>!!S.follow[h]&&followsBack(h);
RL.mutual=mutual;
RL.mapPeople=()=>{const all=[...(C.P||[]),...(T.people?T.people():[])];const seen=new Set();return all.filter(w=>w&&w.h&&!seen.has(w.h)&&seen.add(w.h)&&mutual(w.h));};
/* =====================================================================
   3) MODOS DO MAPA: Desbloqueio (território) x Navegação
   ===================================================================== */
S.mapMode=S.mapMode||null;S.unlocked=S.unlocked||{};S.cities=S.cities||{};S.hoods=S.hoods||{};
let picked=false;
const MS=SCREENS.map;
const HEXL=['hex-fill','hex-line','hex-glow'],LOCKL=['lk-fill','lk-line','lk-sym','lk-me'];
function applyMode(){const m=getMap();if(!m||!m.getLayer)return;const un=S.mapMode!=='nav';
  HEXL.forEach(l=>{if(m.getLayer(l))m.setLayoutProperty(l,'visibility',un?'visible':'none');});LOCKL.forEach(l=>{if(m.getLayer(l))m.setLayoutProperty(l,'visibility',un?'visible':'none');});
  const el=router.cur&&router.cur.name==='map'&&router.cur.el;if(el){const c=$('.modechip',el);if(c)c.outerHTML=chipHTML();const d=$('.disc',el);if(d)d.style.display=un?'':'none';bindChip(el);}
  if(un)lockRefresh();}
const chipHTML=()=>{const un=S.mapMode!=='nav';return`<button class="modechip" data-mode><i style="background:${un?'var(--lime)':'#22D3EE'}">${ic(un?'<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>':'<path d="M3 11l18-8-8 18-2-8z"/>',11,2.6)}</i>${un?'Desbloqueio':'Navegação'}</button>`;};
const bindChip=el=>{const c=$('.modechip',el);if(c)c.onclick=()=>pickMode(true);};
function pickMode(force){const host=document.getElementById('app');if(!host||$('.mpick',host))return;const last=S.mapMode;
  const bgU=`<div class="bg" style="background:radial-gradient(120% 90% at 85% 20%,rgba(198,244,50,.55),transparent 55%),repeating-linear-gradient(60deg,transparent 0 22px,rgba(198,244,50,.12) 22px 24px),linear-gradient(135deg,#1E2A0E,#0A0B0A 70%)"></div>`;
  const bgN=`<div class="bg" style="background:radial-gradient(120% 90% at 85% 20%,rgba(34,211,238,.5),transparent 55%),repeating-linear-gradient(-20deg,transparent 0 30px,rgba(34,211,238,.10) 30px 33px),linear-gradient(135deg,#0B2230,#0A0B0A 70%)"></div>`;
  const w=document.createElement('div');w.className='mpick';w.innerHTML=`<h3>Escolha o modo</h3>
   <button class="mcard ${last==='unlock'?'last':''}" data-m="unlock">${bgU}<span class="tag">TERRITÓRIO</span><div class="in"><div class="t" style="color:var(--lime2)">Desbloqueio</div><div class="d">Bairros fechados com cadeado. Dirija até eles pra abrir e pinte a cidade de hexágonos.</div></div></button>
   <button class="mcard ${last==='nav'?'last':''}" data-m="nav">${bgN}<span class="tag">LIVRE</span><div class="in"><div class="t" style="color:#7FE7F7">Navegação</div><div class="d">Mapa limpo: rotas, radares, semáforos, postos e alertas. Sem território.</div></div></button>`;
  host.appendChild(w);$$('[data-m]',w).forEach(b=>b.onclick=()=>{S.mapMode=b.dataset.m;save();w.remove();picked=true;applyMode();if(S.mapMode==='unlock')setTimeout(()=>{lockRefresh(true);},300);toast(S.mapMode==='unlock'?'Modo desbloqueio: dirija pra abrir bairros':'Modo navegação','dark');});}
const mh=MS.html;MS.html=function(p){return mh.call(this,p)+chipHTML()+`<div class="disc" style="${S.mapMode==='nav'?'display:none':''}"></div><button class="fab" data-on="rank2" aria-label="Ranking" style="position:absolute;right:14px;bottom:calc(330px + var(--safeB));z-index:6">${ic(TROPHY,19)}</button>`;};
MS.on.rank2=()=>router.go('rank2');
const mm=MS.mount;MS.mount=function(el,p){const r=mm&&mm.call(this,el,p);bindChip(el);if(!picked)setTimeout(()=>{if(router.cur&&router.cur.name==='map')pickMode();},450);setTimeout(applyMode,600);discUpdate();return r;};
/* ---------- bairros (Voronoi dos pontos de bairro do mapa) ---------- */
let D3=null;const d3load=()=>D3||(D3=new Promise((ok,no)=>{if(window.d3&&window.d3.Delaunay)return ok(window.d3);const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/d3-delaunay@6.0.4/dist/d3-delaunay.min.js';s.onload=()=>ok(window.d3);s.onerror=no;document.head.appendChild(s);}));
const cityKey=()=>norm((RL.myCity&&RL.myCity())||'');
function harvest(){const m=getMap();if(!m||!m.isStyleLoaded||!m.isStyleLoaded())return 0;let n=0;
  try{for(const f of m.querySourceFeatures('openmaptiles',{sourceLayer:'place'})){const p=f.properties||{};if(!/^(suburb|quarter|neighbourhood)$/.test(p.class)||!p.name)continue;const g=f.geometry&&f.geometry.coordinates;if(!g)continue;
    const id=norm(p.name)+'@'+g[0].toFixed(2)+','+g[1].toFixed(2);if(!S.hoods[id]){S.hoods[id]={n:p.name,p:[+g[0].toFixed(5),+g[1].toFixed(5)]};n++;}}}catch(e){}
  if(n)save();return n;}
function clipConvex(poly,clip){let out=poly;for(let i=0;i<clip.length-1;i++){const A=clip[i],B=clip[i+1];const inp=out;out=[];if(!inp.length)break;
   const side=P=>(B[0]-A[0])*(P[1]-A[1])-(B[1]-A[1])*(P[0]-A[0]);
   for(let j=0;j<inp.length;j++){const Pc=inp[j],Pp=inp[(j+inp.length-1)%inp.length];const sc=side(Pc),sp=side(Pp);
    const X=()=>{const t=sp/(sp-sc);return[Pp[0]+(Pc[0]-Pp[0])*t,Pp[1]+(Pc[1]-Pp[1])*t];};
    if(sc>=0){if(sp<0)out.push(X());out.push(Pc);}else if(sp>=0)out.push(X());}}
  return out;}
function circle(c,r,n=28){const kx=111320*Math.cos(rad(c[1])),ky=110540;const pts=[];for(let i=0;i<=n;i++){const a=i/n*2*Math.PI;pts.push([c[0]+r*Math.cos(a)/kx,c[1]+r*Math.sin(a)/ky]);}return pts;}
const pip=(pt,poly)=>{let ins=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];if(((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi))ins=!ins;}return ins;};
let CELLS=[];
async function buildCells(){const d3=await d3load().catch(()=>null);const me=myPos();
  let hs=Object.entries(S.hoods).filter(([k,h])=>dist(me,h.p)<25000||dist((getMap()||{getCenter:()=>({toArray:()=>me})}).getCenter().toArray(),h.p)<25000);
  if(!d3||hs.length<2){const cn=(RL.myCity&&RL.myCity())||'Sua cidade';CELLS=[{id:'city:'+norm(cn),n:cn,p:me,poly:circle(me,2500),city:true}];return CELLS;}
  const pts=hs.map(([k,h])=>h.p);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;pts.forEach(p=>{x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1]);});
  const pad=.03;const vor=d3.Delaunay.from(pts).voronoi([x0-pad,y0-pad,x1+pad,y1+pad]);
  CELLS=hs.map(([k,h],i)=>{let poly=vor.cellPolygon(i);if(!poly)return null;poly=poly.slice(0,-1);
    const ccw=(()=>{let a=0;for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length];a+=p[0]*q[1]-q[0]*p[1];}return a>0;})();if(!ccw)poly.reverse();
    let cl=circle(h.p,1800,24);let c2=clipConvex(poly,cl);if(c2.length<3)c2=poly;c2.push(c2[0]);return{id:k,n:h.n,p:h.p,poly:c2};}).filter(Boolean);
  return CELLS;}
function cellAt(p){return CELLS.find(c=>pip(p,c.poly));}
function lockIcon(m){if(m.hasImage('lock'))return;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(10,11,10,.9)';x.beginPath();x.arc(32,32,26,0,7);x.fill();x.strokeStyle='#FFB547';x.lineWidth=3;x.stroke();
  x.strokeStyle='#FFB547';x.lineWidth=4;x.beginPath();x.arc(32,27,8,Math.PI,0);x.stroke();x.fillStyle='#FFB547';x.fillRect(20,28,24,16);m.addImage('lock',{width:64,height:64,data:new Uint8Array(x.getImageData(0,0,64,64).data.buffer)},{pixelRatio:2});}
function ensureLayers(m){if(m.getSource('locks'))return;lockIcon(m);
  m.addSource('locks',{type:'geojson',data:{type:'FeatureCollection',features:[]}});m.addSource('lockpts',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
  const before=m.getLayer('hex-fill')?undefined:undefined;
  m.addLayer({id:'lk-fill',type:'fill',source:'locks',filter:['==',['get','L'],1],paint:{'fill-color':'#050605','fill-opacity':['interpolate',['linear'],['zoom'],10,.55,14,.62]}});
  m.addLayer({id:'lk-line',type:'line',source:'locks',paint:{'line-color':['case',['==',['get','L'],1],'rgba(255,181,71,.35)','#C6F432'],'line-width':['case',['==',['get','L'],1],1,2],'line-dasharray':[2,2]}});
  m.addLayer({id:'lk-me',type:'line',source:'locks',filter:['==',['get','me'],1],paint:{'line-color':'#C6F432','line-width':3,'line-opacity':.7,'line-blur':2}});
  m.addLayer({id:'lk-sym',type:'symbol',source:'lockpts',minzoom:11,layout:{'icon-image':['case',['==',['get','L'],1],'lock',''],'icon-size':.7,'text-field':['get','n'],'text-font':['Noto Sans Bold'],'text-size':['interpolate',['linear'],['zoom'],11,10,15,13],'text-offset':[0,1.5],'text-anchor':'top','text-allow-overlap':false,'icon-allow-overlap':true},paint:{'text-color':['case',['==',['get','L'],1],'#FFC877','#E8FF9A'],'text-halo-color':'#050605','text-halo-width':1.5}});}
let lrT=0;
async function lockRefresh(first){const m=getMap();if(!m||S.mapMode==='nav'||!m.isStyleLoaded())return;harvest();ensureLayers(m);await buildCells();const me=myPos();const here=cellAt(me);
  if(here&&!here.city&&!S.unlocked[here.id]&&!Object.keys(S.unlocked).some(k=>!k.startsWith('city:'))){S.unlocked[here.id]=Date.now();save();}
  const f=[],pts=[];for(const c of CELLS){const L=(c.city||S.unlocked[c.id])?0:1;f.push({type:'Feature',properties:{L,me:here&&here.id===c.id?1:0},geometry:{type:'Polygon',coordinates:[c.poly]}});pts.push({type:'Feature',properties:{L,n:c.n},geometry:{type:'Point',coordinates:c.p}});}
  m.getSource('locks').setData({type:'FeatureCollection',features:f});m.getSource('lockpts').setData({type:'FeatureCollection',features:pts});
  const un=S.mapMode!=='nav';LOCKL.forEach(l=>{if(m.getLayer(l))m.setLayoutProperty(l,'visibility',un?'visible':'none');});discUpdate();}
function discUpdate(){const el=router.cur&&router.cur.name==='map'&&router.cur.el;if(!el)return;const d=$('.disc',el);if(!d)return;const city=(RL.myCity&&RL.myCity())||'Sua cidade';
  if(!CELLS.length||CELLS[0].city){d.innerHTML=`<b>…</b> carregando bairros de ${esc(city)}<br><span class="muted">aproxime o mapa da sua região</span>`;return;}
  const tot=CELLS.length||1,un=CELLS.filter(c=>S.unlocked[c.id]).length;const pc=Math.round(un/tot*100);const here=cellAt(myPos());
  d.innerHTML=`<b>${pc}%</b> de ${esc(city)} descoberta<br><span class="muted">${un}/${tot} bairros${here?' · você está em '+esc(here.n):''}</span>`;}
function celebrate(name){const host=document.getElementById('app');const w=document.createElement('div');w.className='unlockfx';w.innerHTML=`<div class="k">BAIRRO DESBLOQUEADO</div><div class="n">${esc(name)}</div>`;host.appendChild(w);setTimeout(()=>w.remove(),2700);navigator.vibrate&&navigator.vibrate([30,40,60]);RL.horn&&0;}
setInterval(()=>{if(S.mapMode==='nav'||!CELLS.length)return;const p=myPos();const c=cellAt(p);if(c&&!c.city&&!S.unlocked[c.id]){S.unlocked[c.id]=Date.now();save();celebrate(c.n);toast(`${c.n} desbloqueado! Agora pinte com hexágonos`);lockRefresh();}
  const cn=RL.myCity&&RL.myCity();if(cn&&!S.cities[norm(cn)]){S.cities[norm(cn)]={n:cn,t:Date.now(),p};save();}},2000);
(function wait(){const m=getMap();if(!m||!m.on){setTimeout(wait,500);return;}m.on('idle',()=>{if(S.mapMode==='nav')return;clearTimeout(lrT);lrT=setTimeout(()=>{if(harvest()||!CELLS.length)lockRefresh();},400);});m.on('moveend',()=>{if(S.mapMode!=='nav'){clearTimeout(lrT);lrT=setTimeout(lockRefresh,700);}});})();
RL.isCityUnlocked=name=>!!S.cities[norm(name)]||norm(name)===cityKey();
/* =====================================================================
   4) BUSCA INTELIGENTE com categorias
   ===================================================================== */
S.sx=S.sx||{car:1,ppl:1,city:1,place:1,street:1};
const tmo=ms=>{const ac=new AbortController();setTimeout(()=>ac.abort(),ms);return ac.signal;};
const SXK=[['all','Tudo'],['car','Carros'],['ppl','Pessoas'],['city','Cidades'],['place','Lugares'],['street','Ruas']];
const KN={car:'Carros',ppl:'Pessoas',city:'Cidades',place:'Lugares',street:'Ruas'};
function carsFor(q){const n=norm(q);if(!n)return[];const tk=n.split(/\s+/);return(RL.CATALL||[]).map(e=>{const k=norm(e.k),m=norm(e.m);let s=0;if(m===n||k===n)s=100;else if(m.startsWith(n)||k.startsWith(n))s=60;else if(tk.every(t=>k.includes(t)))s=40;else if(m.replace(/[^a-z0-9]/g,'').includes(n.replace(/[^a-z0-9]/g,'')))s=30;return{e,s};}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,8).map(x=>x.e);}
function pplFor(q){const n=norm(q);if(!n)return[];const all=[...(C.P||[]),...(T.people?T.people():[])];const seen=new Set();return all.filter(w=>w&&w.h&&!seen.has(w.h)&&seen.add(w.h)&&(norm(w.n).includes(n)||norm(w.h).includes(n)||norm(w.car||'').includes(n))).slice(0,12);}
async function citiesFor(q,sig){const out=[];const add=l=>l.forEach(x=>{if(!out.some(o=>norm(o.name)===norm(x.name)&&dist(o.p,x.p)<20000))out.push(x);});
  await Promise.all([fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=br&accept-language=pt-BR&featureType=city&q=${encodeURIComponent(q)}`,{signal:sig}).then(r=>r.json()).then(j=>add(j.map(x=>{const pr=x.display_name.split(',').map(s=>s.trim());return{name:x.name||pr[0],addr:pr.filter(s=>!/^\d/.test(s)&&s!=='Brasil').slice(1,3).join(' · '),p:[+x.lon,+x.lat]};}))).catch(()=>{}),
   fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&layer=city&layer=district`,{signal:sig}).then(r=>r.json()).then(j=>add((j.features||[]).filter(f=>(f.properties.countrycode||'BR')==='BR').map(f=>({name:f.properties.name,addr:[f.properties.county,f.properties.state].filter(Boolean).join(' · '),p:f.geometry.coordinates})))).catch(()=>{})]);
  return out.slice(0,8);}
async function placesFor(q,near,sig){const r=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${near[1]}&lon=${near[0]}&limit=15&location_bias_scale=0.3`,{signal:sig}).then(r=>r.json()).catch(()=>({features:[]}));
  const pl=[],strt=[];for(const f of r.features||[]){const p=f.properties;if(p.countrycode&&p.countrycode!=='BR')continue;if(p.osm_key==='place')continue;const it={name:p.name||p.street,addr:[p.name?p.street:'',p.district,p.city,p.state].filter(Boolean).join(', '),p:f.geometry.coordinates};if(!it.name)continue;(p.osm_key==='highway'?strt:pl).push(it);}
  const st=RL.osmStations?[...RL.osmStations().values()].filter(s=>norm(s.name+' '+s.brand).includes(norm(q))&&dist(near,s.p)<30000).slice(0,5).map(s=>({name:s.name,addr:'Posto · '+(s.brand||'combustível'),p:s.p,fuel:1})):[];
  return{place:[...st,...pl],street:strt};}
const postsForCar=key=>{const own=new Set((RL.ownersOf?RL.ownersOf(key):[]).map(o=>o.h));const all=[...(C.FPOSTS||[]),...(RL.extraPosts||[])];return all.filter(p=>p.model===key||own.has(p.h));};
SCREENS.search={tabbar:false,
 html(){const t=this.t||'all';return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><input id="q" class="inp" placeholder="Carros, pessoas, cidades, ruas…" autocomplete="off" enterkeyhint="search" style="flex:1" value="${esc(this.q||'')}"></div>
  <div class="scroll" style="padding-top:4px"><div class="sx-tabs" id="sxt">${SXK.map(([k,n])=>`<button data-t="${k}" class="${t===k?'on':''}">${n}</button>`).join('')}</div><div id="res"></div></div>`;},
 mount(el){const q=$('#q',el),res=$('#res',el);const near=(()=>{const m=getMap();const p=myPos();try{const c=m.getCenter().toArray();if(dist(c,p)>15000)return c;}catch(e){}return p;})();setTimeout(()=>q.focus(),200);
  let R={car:[],ppl:[],city:[],place:[],street:[]},seq=0,busy=0,ctl=null,tm;
  const row=(k,x,i)=>{if(k==='car'){const moto=x.t==='moto';return`<button class="sx-row press" data-k="car" data-i="${i}"><span class="sx-ico">${RL.picTag?RL.picTag(x.k,'sx'+i):ic(I.car,18)}</span><div style="flex:1;min-width:0"><div class="b">${esc(x.m)}</div><div class="small muted">${esc(x.b)} · ${moto?'moto':'carro'} · fotos, vídeos e rolês</div></div><span class="sx-kind">em Carros</span></button>`;}
   if(k==='ppl')return`<button class="sx-row press" data-k="ppl" data-i="${i}">${RL.avatar2(x,42)}<div style="flex:1;min-width:0"><div class="b">${esc(x.n)}</div><div class="small muted">@${esc(x.h)}${x.car?' · '+esc(x.car):''}</div></div><span class="sx-kind">${mutual(x.h)?'amigo':'Pessoas'}</span></button>`;
   if(k==='city'){const lk=S.mapMode!=='nav'&&!RL.isCityUnlocked(x.name);return`<button class="sx-row press" data-k="city" data-i="${i}"><span class="sx-ico ${lk?'sx-lock':''}">${ic(lk?LOCKP:PIN,18)}</span><div style="flex:1;min-width:0"><div class="b">${esc(x.name)}</div><div class="small muted">${esc(x.addr||'')}</div></div><span class="sx-kind">${lk?'bloqueada':'em Cidades'}</span></button>`;}
   return`<button class="sx-row press" data-k="${k}" data-i="${i}"><span class="sx-ico">${ic(x.fuel?I.pump:k==='street'?'<path d="M5 21L9 3M19 21L15 3M12 6v2M12 11v2M12 16v2"/>':PIN,18)}</span><div style="flex:1;min-width:0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.name)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.addr||'')}</div></div><span class="small muted">${fmtD(dist(near,x.p))}</span></button>`;};
  const draw=()=>{const t=this.t||'all';const v=q.value.trim();
   if(v.length<2){const rec=(S.recent||[]).slice(0,8);res.innerHTML=(rec.length?`<div class="sx-sec"><b>Recentes</b></div><div class="card list" style="padding:2px 10px">${rec.map((x,i)=>`<button class="sx-row press" data-rec="${i}"><span class="sx-ico">${ic(RL.I.clock||PIN,17)}</span><div style="flex:1;min-width:0"><div class="b">${esc(x.name)}</div><div class="small muted">${esc(x.addr||'')}</div></div></button>`).join('')}</div>`:'')+`<div class="sx-sec"><b>Experimente</b></div><div class="chips">${['ix35','Opala','Fazer 250','Belo Horizonte','posto'].map(s=>`<button class="chip" data-try="${esc(s)}">${esc(s)}</button>`).join('')}</div>`;
    $$('[data-try]',res).forEach(b=>b.onclick=()=>{q.value=b.dataset.try;q.dispatchEvent(new Event('input'));});$$('[data-rec]',res).forEach(b=>b.onclick=()=>{const x=S.recent[+b.dataset.rec];router.go('preview',{dest:{name:x.name,addr:x.addr,p:x.p}});});return;}
   const order=Object.keys(KN).sort((a,b)=>(S.sx[b]||0)-(S.sx[a]||0));
   const sec=k=>R[k].length?`<div class="sx-sec"><b>${KN[k]}</b>${t==='all'&&R[k].length>3?`<button data-more="${k}">ver todos</button>`:''}</div><div class="card list" style="padding:2px 10px">${R[k].slice(0,t==='all'?3:30).map((x,i)=>row(k,x,i)).join('')}</div>`:'';
   const html=t==='all'?order.map(sec).join(''):sec(t);
   res.innerHTML=html||(busy?'<div class="empty">Buscando…</div>':'<div class="empty">Nada encontrado'+(t!=='all'?' em '+KN[t]:'')+'</div>')+(busy&&html?'<div class="small muted" style="text-align:center;padding:10px">Buscando mais…</div>':'');
   $$('[data-more]',res).forEach(b=>b.onclick=()=>{this.t=b.dataset.more;$$('#sxt button',el).forEach(x=>x.classList.toggle('on',x.dataset.t===this.t));draw();});
   $$('[data-k]',res).forEach(b=>b.onclick=()=>open(b.dataset.k,R[b.dataset.k][+b.dataset.i]));};
  const open=(k,x)=>{S.sx[k]=(S.sx[k]||0)+1;save();
   if(k==='car'){router.go('model',{m:x.k});return;}
   if(k==='ppl'){x.h===S.me.handle?router.go('profile'):router.go('person',{h:x.h});return;}
   if(k==='city'){goCity(x);return;}
   S.recent=[{...x,kind:'recent'},...(S.recent||[]).filter(r=>r.name!==x.name)].slice(0,8);save();router.go('preview',{dest:{name:x.name,addr:x.addr,p:x.p}});};
  const run=()=>{const v=q.value.trim();this.q=v;const my=++seq;if(ctl)ctl.abort();ctl=new AbortController();const sig=ctl.signal;
   R={car:carsFor(v),ppl:pplFor(v),city:[],place:[],street:[]};busy=2;draw();if(v.length<2)return;
   citiesFor(v,sig).then(c=>{if(my!==seq)return;R.city=c;busy--;draw();});
   placesFor(v,near,sig).then(o=>{if(my!==seq)return;R.place=o.place;R.street=o.street;busy--;draw();});};
  q.addEventListener('input',()=>{clearTimeout(tm);R.car=carsFor(q.value);R.ppl=pplFor(q.value);draw();tm=setTimeout(run,320);});
  q.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=$('[data-k]',res);if(f)f.click();}});
  $$('#sxt button',el).forEach(b=>b.onclick=()=>{this.t=b.dataset.t;$$('#sxt button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});
  if(q.value)run();else draw();}};
function goCity(x){if(S.mapMode!=='nav'&&!RL.isCityUnlocked(x.name)){sheet(`<div class="row" style="gap:12px"><span class="sx-ico sx-lock" style="width:52px;height:52px">${ic(LOCKP,24)}</span><div><div style="font-family:Anton,Oswald,sans-serif;font-size:26px;text-transform:uppercase;line-height:1">${esc(x.name)}</div><div class="small muted">Cidade bloqueada</div></div></div>
   <div class="muted" style="margin-top:12px;line-height:1.45;font-size:14px">Dirija até ${esc(x.name)} pra desbloquear a cidade e começar a conquistar os bairros. Enquanto isso, dá pra olhar no modo navegação.</div>
   <div class="row" style="gap:10px;margin-top:16px"><button class="btn sec" id="gv" style="flex:1">Ver no modo navegação</button><button class="btn" id="gr" style="flex:1">${ic(I.route,18)}Ir até lá</button></div>`,(w,close)=>{
   $('#gv',w).onclick=()=>{close();S.mapMode='nav';save();fly(x);};$('#gr',w).onclick=()=>{close();router.go('preview',{dest:{name:x.name,addr:x.addr||'Cidade',p:x.p}});};});return;}
  fly(x);}
function fly(x){router.tabTo('map');setTimeout(()=>{const m=getMap();if(m)m.flyTo({center:x.p,zoom:12.5,pitch:20,duration:1400});applyMode();},350);}
const fmtD=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1).replace('.',',')+' km':Math.max(10,Math.round(m/10)*10)+' m';
/* página do modelo: grade com fotos, vídeos e rolês desse carro */
const MD=SCREENS.model;if(MD){const mo=MD.mount;MD.mount=function(el,p){const r=mo&&mo.call(this,el,p);const key=RL.modelKey?RL.modelKey(p.m):p.m;
  const sc=$('.scroll',el);if(sc&&!$('#mgal',el)){const box=document.createElement('div');box.id='mgal';const ps=postsForCar(key).slice(0,12);
   box.innerHTML=`<div class="sx-sec" style="margin-top:6px"><b>Fotos, vídeos e rolês</b></div><div class="cygrid" style="margin:0 -16px">${ps.map((x,i)=>`<button data-gi="${i}">${x.kind==='ride'?`<div class="cyride"><b>+${x.hex||0}</b><span class="small muted b">hex · ${x.km||0} km</span></div>`:RL.picTag(key,x.id+':0')}${x.kind==='video'?`<span class="cyk">${ic(I.play,15)}</span>`:''}</button>`).join('')}</div>`;
   const vh=$('.vhero',el);if(vh&&vh.parentNode)vh.parentNode.insertBefore(box,vh.nextSibling);else sc.prepend(box);RL._tagList=ps;$$('[data-gi]',box).forEach(b=>b.onclick=()=>router.go('tagFeed',{title:key,i:+b.dataset.gi}));}
  return r;};}
SCREENS.tagFeed={tabbar:false,
 html(p){return`<div class="ttwrap"><div class="tt" id="tt"></div><div class="tthdr"><button class="ib glass" data-back>${ic(I.back)}</button><div class="b" style="font-family:Anton,Oswald,sans-serif;font-size:20px;letter-spacing:.5px;text-transform:uppercase;flex:1">${esc(p.title||'')}</div></div></div>`;},
 mount(el,p){const list=RL._tagList||[];const tt=$('#tt',el);const it=RL.feedItem||(x=>T.ttItem(x));tt.innerHTML=list.map(it).join('');RL.feedWire&&RL.feedWire(tt);requestAnimationFrame(()=>{const s=tt.children[p.i||0];if(s)tt.scrollTop=s.offsetTop;});},
 on:{...C.postHandlers}};
/* =====================================================================
   5) RANKINGS (exploração e distância — nada de velocidade na rua)
   ===================================================================== */
const stat=(w,k)=>{const r=hsh(k+w.h);if(k==='km')return Math.round(w.km||(40+r*2400));if(k==='hex')return Math.round(w.hex||(10+r*900));if(k==='hood')return Math.round(2+r*60);if(k==='city')return Math.round(1+r*24);return 0;};
const myStat=k=>k==='km'?Math.round(S.rides.reduce((a,r)=>a+r.dist,0)/1000):k==='hex'?Object.keys(S.hexes).length:k==='hood'?Object.keys(S.unlocked).length:Object.keys(S.cities).length;
SCREENS.rank2={tabbar:false,
 html(){const sc=this.sc||'br',k=this.k||'km';return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Rankings</h2></div><div class="scroll rk2">
  <div class="seg" id="r2s">${[['world','Mundo'],['br','Brasil'],['city','Sua cidade'],['fr','Amigos']].map(([x,t])=>`<button data-s="${x}" class="${sc===x?'on':''}">${t}</button>`).join('')}</div>
  <div class="chips" id="r2k">${[['km','Km rodados'],['hex','Hexágonos'],['hood','Bairros'],['city','Cidades']].map(([x,t])=>`<button class="chip ${k===x?'lime':''}" data-k="${x}">${t}</button>`).join('')}</div>
  <div id="r2b" style="margin-top:12px"></div><div class="small muted" style="text-align:center;margin:14px 10px 30px;line-height:1.45">No Rolê o ranking é de exploração: quem roda mais e descobre mais. Tempo e velocidade só contam no Modo pista, em autódromo.</div></div>`;},
 mount(el){const draw=()=>{const sc=this.sc||'br',k=this.k||'km';const seen=new Set();let ps=[...(C.P||[]),...(T.people?T.people():[])].filter(w=>w&&w.h&&!seen.has(w.h)&&seen.add(w.h));
   if(sc==='fr')ps=ps.filter(w=>mutual(w.h));if(sc==='city')ps=ps.filter(w=>(RL.distKm?RL.distKm(w.h):99)<25);if(sc==='br')ps=ps.slice(0,80);
   let rows=ps.map(w=>({w,v:stat(w,k)*(sc==='world'?1.4:1)}));
   if(sc==='world'){const W=[['Lukas M.','Berlim'],['Sofia R.','Lisboa'],['Kenji T.','Osaka'],['Ana P.','Buenos Aires'],['Jake W.','Austin'],['Marta G.','Madri']];W.forEach(([n,c],i)=>rows.push({w:{h:'w'+i,n,car:c},v:Math.round(stat({h:'w'+i},k)*2.2),ext:c}));}
   rows.push({w:{me:true,h:S.me.handle,n:S.me.name},v:myStat(k),me:true});rows.sort((a,b)=>b.v-a.v);const my=rows.findIndex(r=>r.me);const unit={km:'km',hex:'hex',hood:'bairros',city:'cidades'}[k];
   $('#r2b',el).innerHTML=`${my>=0?`<div class="card row" style="border-color:rgba(198,244,50,.4)"><div class="b" style="flex:1">Você está em <span class="lime">#${my+1}</span></div><div class="small muted">${rows[my].v} ${unit}</div></div>`:''}
    <div class="card list" style="margin-top:10px;padding:4px 8px">${rows.slice(0,60).map((r,i)=>`<button class="rk press ${r.me?'me':''}" data-h="${esc(r.w.h)}" style="width:100%;text-align:left"><span class="n">${i+1}</span>${RL.avatar2(r.me?{me:true}:r.w,36)}<div style="flex:1;min-width:0"><div class="b" style="font-size:14px">${esc(r.me?'Você':r.w.n)}</div><div class="small muted">${esc(r.ext||r.w.car||'')}</div></div><b>${r.v.toLocaleString('pt-BR')}</b><span class="small muted" style="margin-left:4px">${unit}</span></button>`).join('')}</div>`;
   $$('[data-h]',$('#r2b',el)).forEach(b=>b.onclick=()=>{const h=b.dataset.h;if(h===S.me.handle)router.go('profile');else if(!/^w\d/.test(h))router.go('person',{h});});};
  $$('#r2s button',el).forEach(b=>b.onclick=()=>{this.sc=b.dataset.s;$$('#r2s button',el).forEach(x=>x.classList.toggle('on',x===b));draw();});
  $$('#r2k button',el).forEach(b=>b.onclick=()=>{this.k=b.dataset.k;$$('#r2k button',el).forEach(x=>x.classList.toggle('lime',x===b));draw();});draw();}};
/* =====================================================================
   6) CUSTO DO ROLÊ, CARRO ELÉTRICO
   ===================================================================== */
const KWH=0.95;
function rideCost(r){const c=S.cars.find(x=>x.model===r.car)||activeCar();if(!c||!c.kml||!r.dist)return null;const km=r.dist/1000;
  if(c.ev)return{v:km/c.kml*(S.kwhPrice||KWH),u:(km/c.kml).toFixed(1).replace('.',',')+' kWh',ev:1};const pr=RL.fuelAvg?RL.fuelAvg(c.fuel||S.fuelType||'gas'):5.79;return{v:km/c.kml*pr,u:(km/c.kml).toFixed(2).replace('.',',')+' L',pr};}
RL.rideCost=rideCost;
const CF=SCREENS.carForm;if(CF){const ch=CF.html;CF.html=function(p){let h=ch.call(this,p);const c=p&&p.id?S.cars.find(x=>x.id===p.id):null;this.ev=!!(c&&c.ev);
  const seg=`<label class="f">Energia</label><div class="seg" id="fev"><button data-e="0" class="${this.ev?'':'on'}">Combustão / flex</button><button data-e="1" class="${this.ev?'on':''}">Elétrico</button></div>`;
  return h.replace('<div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Consumo médio (km/l)</label>',seg+'<div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f" id="fkl">'+(this.ev?'Consumo (km/kWh)':'Consumo médio (km/l)')+'</label>');};
 const cm=CF.mount;CF.mount=function(el,p){const r=cm&&cm.call(this,el,p);$$('#fev button',el).forEach(b=>b.onclick=()=>{this.ev=b.dataset.e==='1';$$('#fev button',el).forEach(x=>x.classList.toggle('on',x===b));const l=$('#fkl',el);if(l)l.textContent=this.ev?'Consumo (km/kWh)':'Consumo médio (km/l)';const k=$('#fk',el);if(k)k.placeholder=this.ev?'6,5':'12,5';});return r;};
 const cs=CF.on.save;CF.on.save=function(a){const before=S.cars.map(c=>c.id);const ev=!!this.ev;const r=cs.call(this,a);const c=this.params.id?S.cars.find(x=>x.id===this.params.id):S.cars.find(x=>!before.includes(x.id));if(c){c.ev=ev;save();}return r;};}
/* =====================================================================
   7) RESUMO DO ROLÊ: custo, card de story e replay 3D
   ===================================================================== */
const SM=SCREENS.summary;if(SM){const sh=SM.html;SM.html=function(p){let h=sh.call(this,p);const r=S.rides.find(x=>x.id===p.id);if(!r)return h;const c=rideCost(r);
  const costRow=c?`<div class="card row" style="margin-top:12px;border-color:rgba(198,244,50,.35)">${ic(c.ev?'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>':I.pump,20)}<div style="flex:1"><div class="small muted">Esse rolê custou</div><div style="font-size:24px;font-weight:800">${brl(c.v)}</div></div><div class="small muted" style="text-align:right">${c.u}${c.pr?`<br>a ${brl(c.pr)}/L perto de você`:'<br>'+brl(S.kwhPrice||KWH)+'/kWh'}</div></div>`:'';
  return h.replace('<button class="btn" data-on="post"',costRow+`<div class="row" style="gap:10px;margin-top:12px"><button class="btn sec" data-on="story" style="flex:1">${ic('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',18)}Card pro story</button><button class="btn sec" data-on="replay" style="flex:1">${ic(I.play,18)}Replay 3D</button></div><button class="btn" data-on="post"`);};
 SM.on.story=function(){const r=S.rides.find(x=>x.id===this.params.id);storyCard(r);};SM.on.replay=function(){router.go('replay',{id:this.params.id});};}
function storyCard(r){const W=1080,H=1920,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#141B0C');g.addColorStop(.55,'#0A0B0A');g.addColorStop(1,'#0A0B0A');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle='rgba(198,244,50,.06)';x.lineWidth=2;for(let i=-H;i<W+H;i+=60){x.beginPath();x.moveTo(i,0);x.lineTo(i+H*.58,H);x.stroke();}
  const tr=(r.track&&r.track.length>1)?r.track:[[0,0],[1,1]];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const P=tr.map(p=>{const X=p[0]*Math.cos(rad(p[1])),Y=-p[1];x0=Math.min(x0,X);x1=Math.max(x1,X);y0=Math.min(y0,Y);y1=Math.max(y1,Y);return[X,Y];});
  const bw=W-200,bh=900,sc=Math.min(bw/((x1-x0)||1),bh/((y1-y0)||1));const ox=100+(bw-(x1-x0)*sc)/2,oy=330+(bh-(y1-y0)*sc)/2;const pts=P.map(([X,Y])=>[ox+(X-x0)*sc,oy+(Y-y0)*sc]);
  const path=()=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));};
  x.lineCap='round';x.lineJoin='round';x.shadowColor='#C6F432';x.shadowBlur=60;x.strokeStyle='rgba(198,244,50,.35)';x.lineWidth=46;path();x.stroke();x.shadowBlur=24;x.strokeStyle='#DCFF4A';x.lineWidth=16;path();x.stroke();x.shadowBlur=0;
  x.fillStyle='#0A0B0A';x.strokeStyle='#C6F432';x.lineWidth=10;x.beginPath();x.arc(pts[0][0],pts[0][1],22,0,7);x.fill();x.stroke();x.fillStyle='#C6F432';x.beginPath();x.arc(pts[pts.length-1][0],pts[pts.length-1][1],26,0,7);x.fill();
  x.fillStyle='#C6F432';x.font='italic 900 64px Anton, Oswald, Impact, sans-serif';x.fillText('ROLÊ',80,150);x.fillStyle='rgba(255,255,255,.6)';x.font='700 38px Manrope, Arial';
  const city=(RL.myCity&&RL.myCity())||'';x.fillText([new Date(r.t).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}),city].filter(Boolean).join(' · '),80,215);
  const c=rideCost(r);const stats=[[fmtKm(r.dist),'km'],[fmtT(r.sec),'tempo'],['+'+r.hex,'hexágonos'],[c?brl(c.v):'—','custo']];
  stats.forEach(([v,l],i)=>{const cx=80+(i%2)*470,cy=1330+Math.floor(i/2)*230;x.fillStyle='#fff';x.font='400 120px Anton, Oswald, Impact, sans-serif';x.fillText(v,cx,cy);x.fillStyle='rgba(255,255,255,.55)';x.font='700 38px Manrope, Arial';x.fillText(l,cx,cy+56);});
  x.fillStyle='rgba(198,244,50,.14)';x.beginPath();x.roundRect(80,1760,W-160,100,50);x.fill();x.fillStyle='#E8FF9A';x.font='800 40px Manrope, Arial';x.fillText((r.car||'')+'  ·  @'+S.me.handle,120,1824);
  cv.toBlob(async b=>{const f=new File([b],'role-story.png',{type:'image/png'});const url=URL.createObjectURL(b);
   sheet(`<div style="font-size:20px;font-weight:800">Card pro story</div><img class="stk-card" src="${url}" alt=""><div class="row" style="gap:10px;margin-top:12px"><a class="btn sec" href="${url}" download="role-story.png" style="flex:1;display:flex;align-items:center;justify-content:center">Baixar</a><button class="btn" id="shs" style="flex:1">Compartilhar</button></div>`,(w,close)=>{
    $('#shs',w).onclick=async()=>{try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Meu rolê'});else toast('Use "Baixar" e poste no story','dark');}catch(e){}};});},'image/png');}
RL.storyCard=storyCard;
SCREENS.replay={clear:true,tabbar:false,
 html(p){const r=S.rides.find(x=>x.id===p.id);return`<div style="position:absolute;left:14px;top:calc(14px + var(--safeT));z-index:21"><button class="ib glass" data-on="close">${ic(I.x)}</button></div>
  <div class="rp-hud"><div class="row"><div style="flex:1"><div class="b">Replay do rolê</div><div class="small muted">${r?fmtKm(r.dist)+' km · '+fmtT(r.sec):''} · use dois dedos pra girar e inclinar</div></div><button class="ib" data-on="pp" id="rpp">${ic('<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>',18)}</button><button class="chip" data-on="spd" id="rps" style="margin-left:6px">4x</button></div><div class="rp-bar"><i id="rpb"></i></div><label class="row small muted" style="gap:8px"><input type="checkbox" id="rpf" checked> câmera seguindo</label></div>`;},
 mapReady(){const r=S.rides.find(x=>x.id===this.params.id);const m=getMap();if(!r||!m||!r.track||r.track.length<2){toast('Esse rolê não tem trajeto gravado','dark');return;}
  this.tr=r.track;this.cum=[0];for(let i=1;i<this.tr.length;i++)this.cum.push(this.cum[i-1]+dist(this.tr[i-1],this.tr[i]));this.L=this.cum[this.cum.length-1];this.s=0;this.spd=this.spd||4;this.play=true;
  try{m.getSource('track').setData({type:'FeatureCollection',features:[]});}catch(e){}m.setPadding({top:40,bottom:200,left:0,right:0});
  m.jumpTo({center:this.tr[0],zoom:16.2,pitch:62,bearing:0});let lt=0;const step=t=>{if(router.cur!==this)return;this.raf=requestAnimationFrame(step);const dt=Math.min(.1,(t-(lt||t))/1000);lt=t;if(!this.play)return;
   this.s=Math.min(this.L,this.s+dt*14*this.spd*8);let i=1;while(i<this.cum.length-1&&this.cum[i]<this.s)i++;const a=this.tr[i-1],b=this.tr[i],k=(this.s-this.cum[i-1])/((this.cum[i]-this.cum[i-1])||1);const p=[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];
   const done=this.tr.slice(0,i).concat([p]);try{m.getSource('track').setData({type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'LineString',coordinates:done}}]});}catch(e){}
   const bb=Math.atan2((b[0]-a[0])*Math.cos(rad(a[1])),b[1]-a[1])*180/Math.PI;const f=$('#rpf',this.el);if(f&&f.checked)m.jumpTo({center:p,bearing:m.getBearing()+(((bb-m.getBearing()+540)%360)-180)*.06});
   const pb=$('#rpb',this.el);if(pb)pb.style.width=(this.s/this.L*100)+'%';if(this.s>=this.L){this.play=false;}};this.raf=requestAnimationFrame(step);},
 leave(){cancelAnimationFrame(this.raf);},
 on:{close(){router.back();},pp(){this.play=!this.play;if(this.s>=this.L){this.s=0;this.play=true;}$('#rpp',this.el).innerHTML=ic(this.play?'<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>':I.play,18);},spd(){this.spd=this.spd>=16?1:this.spd*2;$('#rps',this.el).textContent=this.spd+'x';}}};
/* =====================================================================
   8) MODO PISTA: tempo de volta + fantasma, só em autódromo/kartódromo
   ===================================================================== */
function nearTrack(p){const m=getMap();if(!m)return null;try{for(const f of m.querySourceFeatures('openmaptiles',{sourceLayer:'transportation'})){const pr=f.properties||{};if(pr.class!=='raceway'&&pr.subclass!=='raceway')continue;const cs=f.geometry.type==='LineString'?f.geometry.coordinates:(f.geometry.coordinates||[]).flat();for(const c of cs)if(dist(p,c)<1500)return c;}}catch(e){}
  try{for(const f of m.querySourceFeatures('openmaptiles',{sourceLayer:'landuse'})){const pr=f.properties||{};if(!/raceway|track/.test(pr.class||''))continue;return p;}}catch(e){}return null;}
S.laps=S.laps||{};
SCREENS.track={clear:true,tabbar:false,
 html(){return`<div style="position:absolute;left:14px;top:calc(14px + var(--safeT));z-index:21"><button class="ib glass" data-back>${ic(I.back)}</button></div>
  <div class="rp-hud" id="tkh"></div>`;},
 mapReady(){const m=getMap();const p=myPos();m.setPadding({top:40,bottom:260,left:0,right:0});m.jumpTo({center:p,zoom:16.5,pitch:45});setTimeout(()=>{this.okTrack=!!nearTrack(p);this.draw();},900);},
 draw(){const el=$('#tkh',this.el);if(!el)return;const best=S.laps.best;
  if(!this.running){el.innerHTML=`<div class="b" style="font-size:18px">Modo pista</div><div class="small muted" style="margin-top:4px;line-height:1.45">${this.okTrack?'Autódromo detectado. Pare na linha de largada e toque em começar.':'Só funciona dentro de autódromo ou kartódromo. Na rua, tempo e velocidade não contam: segurança em primeiro lugar.'}</div>
    ${best?`<div class="small muted" style="margin-top:8px">Sua melhor volta: <b class="lime">${(best.t/1000).toFixed(2).replace('.',',')} s</b></div>`:''}
    <div class="row" style="gap:10px;margin-top:12px">${this.okTrack?`<button class="btn" id="tkgo" style="flex:1">Começar (linha aqui)</button>`:''}<button class="btn sec" id="tkdemo" style="flex:1">Ver demonstração</button></div>`;
   const g=$('#tkgo',el);if(g)g.onclick=()=>this.start(false);$('#tkdemo',el).onclick=()=>this.start(true);return;}
  const now=Date.now()-this.t0;el.innerHTML=`<div class="row"><div style="flex:1"><div class="small muted b">VOLTA ${this.lap}</div><div class="tk-big">${(now/1000).toFixed(1).replace('.',',')}</div></div><div style="text-align:right"><div class="small muted b">vs. fantasma</div><div class="tk-delta ${this.delta>0?'up':'dn'}">${this.delta==null?'—':(this.delta>0?'+':'')+(this.delta/1000).toFixed(2).replace('.',',')}</div></div></div>
   <div class="small muted" style="margin-top:6px">${this.laps.map((l,i)=>`V${i+1}: ${(l/1000).toFixed(2).replace('.',',')}s`).join(' · ')||'Complete uma volta pra gravar o fantasma'}</div><button class="btn sec" id="tkst" style="margin-top:10px">Encerrar</button>`;
  $('#tkst',el).onclick=()=>this.stop();},
 start(demo){const m=getMap();this.demo=demo;this.running=true;this.lap=1;this.laps=[];this.cur=[];this.t0=Date.now();this.away=false;
  const c=myPos();this.line=c;
  if(demo){const R=260;this.circuit=[];for(let i=0;i<=120;i++){const a=i/120*2*Math.PI;this.circuit.push([c[0]+R*1.6*Math.sin(a)/(111320*Math.cos(rad(c[1]))),c[1]+R*(Math.cos(a)-1)/110540]);}this.line=this.circuit[0];this.ds=0;}
  const el=document.createElement('div');el.className='carmk';el.style.cssText='width:22px;height:22px;border-radius:99px;background:#fff;border:3px solid #C6F432';this.me=new maplibregl.Marker({element:el}).setLngLat(this.line).addTo(m);
  const g=document.createElement('div');g.className='ghostdot';this.gm=new maplibregl.Marker({element:g}).setLngLat(this.line).addTo(m);
  if(demo)m.easeTo({center:[c[0],c[1]-260/110540],zoom:15.6,duration:700});
  let last=Date.now();this.iv=setInterval(()=>{const now=Date.now();let p;
   if(this.demo){const v=34+Math.sin(now/900)*6+Math.random()*2;this.ds+=v*(now-last)/1000;const L=this.circuit.length-1;const per=2*Math.PI*260*1.3;let f=(this.ds%per)/per*L;const i=Math.floor(f),k=f-i;const a=this.circuit[i],b=this.circuit[Math.min(L,i+1)];p=[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];}
   else p=gps.pos||myPos();last=now;this.me.setLngLat(p);const t=now-this.t0;this.cur.push([t,p]);
   const d=dist(p,this.line);if(d>120)this.away=true;
   if(this.away&&d<25&&t>8000){this.laps.push(t);if(!S.laps.best||t<S.laps.best.t){S.laps.best={t,s:this.cur.map(x=>[x[0],x[1][0],x[1][1]])};save();toast('Nova melhor volta!');}this.lap++;this.t0=now;this.cur=[];this.away=false;}
   const b=S.laps.best;if(b){let j=b.s.findIndex(x=>x[0]>=t);if(j<0)j=b.s.length-1;this.gm.setLngLat([b.s[j][1],b.s[j][2]]);
    let bi=0,bd=1e9;for(let q=0;q<b.s.length;q+=2){const dd=dist(p,[b.s[q][1],b.s[q][2]]);if(dd<bd){bd=dd;bi=q;}}this.delta=bd<60?t-b.s[bi][0]:null;}
   this.draw();},200);this.draw();},
 stop(){clearInterval(this.iv);this.running=false;this.me&&this.me.remove();this.gm&&this.gm.remove();this.draw();},
 leave(){this.stop();}};
/* entradas: modo pista na tela de novo rolê */
const SR=SCREENS.startRide;if(SR){const h0=SR.html;SR.html=function(p){const h=h0.call(this,p);const card=`<button class="card press" data-go="track" style="text-align:left;display:flex;gap:14px;align-items:center"><span class="ib" style="width:46px;height:46px;border-radius:14px;color:var(--lime2)">${ic('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',22)}</span><div style="flex:1"><div class="b" style="font-size:16px">Modo pista</div><div class="small muted">Tempo de volta e fantasma · só em autódromo</div></div></button>`;return h.replace(/<\/div>(\s*)<div class="card row" style="margin-top:14px" data-go="garage">/,m=>card+m);};}
/* perfil: atalho pros rankings */
document.addEventListener('click',e=>{const b=e.target.closest('[data-go="ranking"]');if(b){e.stopPropagation();e.preventDefault();router.go('rank2');}},true);
})();
