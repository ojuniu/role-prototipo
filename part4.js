/* Rolê — parte 4: postos e preços, placas/radares reais (OpenStreetMap), alertas da comunidade, modo fantasma, trânsito simulado, buzina */
(()=>{'use strict';
const RL=window.__role;if(!RL)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,ride,gps,speak,activeCar}=RL;
const C=RL.comm||{P:[]};
const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const st=document.createElement('style');st.textContent=`
.mapfabs{position:absolute;right:14px;top:calc(200px + var(--safeT));display:flex;flex-direction:column;gap:10px;z-index:6}
.fab{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:rgba(18,19,17,.78);border:1px solid var(--line2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:var(--tx)}
.fab.on{background:rgba(198,244,50,.2);border-color:rgba(198,244,50,.6);color:var(--lime2)}
.fab.warn{background:#FF9F1C;color:#0A0B0A;border-color:#FF9F1C}
body.ghost .carmk{opacity:.4;filter:grayscale(1)}
.ghostpill{position:absolute;left:14px;top:calc(130px + var(--safeT));white-space:nowrap;z-index:6;height:30px;padding:0 12px;border-radius:99px;background:rgba(18,19,17,.85);border:1px solid var(--line2);font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;color:var(--tx2)}
.alpin{width:34px;height:34px;border-radius:99px 99px 99px 4px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.5);border:2px solid rgba(0,0,0,.35);cursor:pointer}
.alpin svg{transform:rotate(45deg)}
.simcar{width:26px;height:26px;border-radius:99px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(0,0,0,.5);box-shadow:0 2px 8px rgba(0,0,0,.6);cursor:pointer}
.simcar svg{width:76%}
.pin.sm .p{height:24px;font-size:11px;padding:0 8px}
.limsign{position:absolute;z-index:21;width:52px;height:52px;border-radius:99px;background:#fff;border:5px solid #E2231A;display:none;align-items:center;justify-content:center;font-weight:900;font-size:19px;color:#111;box-shadow:0 4px 14px rgba(0,0,0,.5)}
.limsign.over{animation:limp .8s infinite}@keyframes limp{50%{transform:scale(1.12);box-shadow:0 0 0 8px rgba(226,35,26,.35)}}
.agrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.agrid button{border-radius:18px;background:rgba(255,255,255,.05);border:1px solid var(--line);padding:14px 6px;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px;font-weight:700}
.agrid .ai{width:44px;height:44px;border-radius:99px;display:flex;align-items:center;justify-content:center;color:#0A0B0A}
.fuelrow{display:flex;align-items:center;gap:12px;padding:12px 4px}
.price{font-size:20px;font-weight:800;letter-spacing:-.3px}
.ptab td{padding:10px 4px;border-bottom:1px solid var(--line)}.ptab tr:last-child td{border-bottom:none}
`;document.head.appendChild(st);
/* ---------- util ---------- */
const rad=d=>d*Math.PI/180;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 12742000*Math.asin(Math.sqrt(x));};
const fmtD=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1).replace('.',',')+' km':Math.max(10,Math.round(m/10)*10)+' m';
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const ago=t=>{const s=(Date.now()-t)/1000;return s<60?'agora':s<3600?`há ${Math.round(s/60)} min`:s<86400?`há ${Math.round(s/3600)} h`:`há ${Math.round(s/86400)} d`;};
const getMap=()=>RL.getMap&&RL.getMap();
const mapVisible=()=>{const h=document.getElementById('mapHost');return h&&h.style.visibility!=='hidden';};
const brl=v=>'R$ '+v.toFixed(2).replace('.',',');
/* ---------- buzina (som sintetizado) ---------- */
let AC=null;
function horn(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,g=AC.createGain(),f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=1800;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.22,t+.02);g.gain.setValueAtTime(.22,t+.16);g.gain.linearRampToValueAtTime(0,t+.2);g.gain.setValueAtTime(0,t+.26);g.gain.linearRampToValueAtTime(.22,t+.28);g.gain.setValueAtTime(.22,t+.6);g.gain.linearRampToValueAtTime(0,t+.68);
  [415,494].forEach(fr=>{const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=fr;o.connect(f);o.start(t);o.stop(t+.7);});f.connect(g);g.connect(AC.destination);}catch(e){}}
RL.horn=horn;
document.addEventListener('click',e=>{const b=e.target.closest('[data-on="horn"]');if(b&&!b.classList.contains('on'))horn();},true);
/* ---------- OpenStreetMap (Overpass): radares, semáforos, PARE, placas de velocidade, limites das vias, postos ---------- */
const OV='https://overpass-api.de/api/interpreter';
const OSM={nodes:new Map(),ways:new Map(),stations:new Map()};RL.osmStations=()=>OSM.stations;let stNew=0,stOn=false;const tiles=new Map();
const OVS=[OV,'https://overpass.kumi.systems/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter'];let ovChain=Promise.resolve();
function ovq(q,tries=3){const run=async()=>{let err;for(let t=0;t<tries;t++){const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),20000);try{const r=await fetch(OVS[t%OVS.length],{method:'POST',body:'data='+encodeURIComponent(q),signal:ac.signal});clearTimeout(tm);if(r.ok)return await r.json();err=new Error('overpass '+r.status);}catch(e){clearTimeout(tm);err=e;}await new Promise(r=>setTimeout(r,500*(t+1)));}throw err;};const p=ovChain.then(run,run);ovChain=p.catch(()=>{});return p;}
const kindOf=t=>{const h=t.highway,ts=String(t.traffic_sign||'');if(h==='speed_camera'||t.enforcement==='maxspeed')return'radar';if(h==='traffic_signals')return'signal';if(h==='stop'||/stop|R-1(?!\d)/i.test(ts))return'stop';if(h==='give_way'||/give_way|R-2(?!\d)/i.test(ts))return'giveway';if(/maxspeed|R-19/i.test(ts)&&parseInt(t.maxspeed))return'limit';return null;};
function addStation(e){const t=e.tags||{};const p=e.type==='node'?[e.lon,e.lat]:e.center?[e.center.lon,e.center.lat]:null;if(!p)return;OSM.stations.set(e.id,{id:e.id,name:t.name||t.brand||'Posto',brand:t.brand||t.operator||'',p});}
function loadTile(p){const x0=Math.floor(p[0]/.04)*.04,y0=Math.floor(p[1]/.04)*.04,k=x0.toFixed(2)+':'+y0.toFixed(2);if(tiles.has(k))return tiles.get(k);
  const bb=`${y0.toFixed(4)},${x0.toFixed(4)},${(y0+.04).toFixed(4)},${(x0+.04).toFixed(4)}`;
  const q=`[out:json][timeout:25];(node["highway"~"^(speed_camera|traffic_signals|stop|give_way)$"](${bb});node["crossing"="traffic_signals"](${bb});node["traffic_sign"~"maxspeed|R-19",i](${bb});node["amenity"="fuel"](${bb});way["amenity"="fuel"](${bb}););out center;rel["type"="enforcement"](${bb});out geom;`;
  const pr=ovq(q).then(j=>{for(const e of j.elements){const t=e.tags||{};if(t.amenity==='fuel'){addStation(e);continue;}if(e.type==='relation'){parseRel(e);continue;}
    if(e.type==='node'){const k=t.crossing==='traffic_signals'?'signal':kindOf(t);if(k)OSM.nodes.set(e.id,{id:e.id,p:[e.lon,e.lat],k,ms:parseInt(t.maxspeed)||null});}}
   drawSigns();drawFuel();return true;}).catch(e=>{setTimeout(()=>tiles.delete(k),30000);console.warn(e);});tiles.set(k,pr);return pr;}
/* limites de velocidade das vias (só durante o rolê) */
const wtiles=new Map();
function loadWays(p){const x0=Math.floor(p[0]/.02)*.02,y0=Math.floor(p[1]/.02)*.02,k=x0.toFixed(2)+':'+y0.toFixed(2);if(wtiles.has(k))return;const bb=`${y0.toFixed(4)},${x0.toFixed(4)},${(y0+.02).toFixed(4)},${(x0+.02).toFixed(4)}`;
  wtiles.set(k,ovq(`[out:json][timeout:20];way["highway"]["maxspeed"](${bb});out geom;`,2).then(j=>{for(const e of j.elements){const ms=parseInt((e.tags||{}).maxspeed);if(e.geometry&&ms)OSM.ways.set(e.id,{id:e.id,ms,g:e.geometry.map(n=>[n.lon,n.lat])});}}).catch(()=>setTimeout(()=>wtiles.delete(k),60000)));}
/* base própria (gerada do OpenStreetMap toda semana pelo GitHub Actions): data/osm/<x>_<y>.json, blocos de 0,25° */
const DT=.25;let DIDX=null;
const didx=fetch('data/osm/index.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.tiles){DIDX=new Set(j.tiles);RL.osmData=j;}return DIDX;}).catch(()=>null);
const dtiles=new Map();
function ingest(j){const pts=(arr,k)=>{if(!arr)return;for(let i=0;i<arr.length;i+=2){const id=k[0]+arr[i]+','+arr[i+1];OSM.nodes.set(id,{id,p:[arr[i],arr[i+1]],k});}};
  pts(j.sig,'signal');pts(j.stop,'stop');pts(j.give,'giveway');
  (j.lim||[]).forEach(a=>{const id='l'+a[0]+','+a[1];OSM.nodes.set(id,{id,p:[a[0],a[1]],k:'limit',ms:a[2]});});
  (j.rad||[]).forEach(a=>{const id='r'+a[0]+','+a[1];OSM.nodes.set(id,{id,p:[a[0],a[1]],k:'radar',ms:a[2]||null});});
  (j.fuel||[]).forEach(a=>{OSM.stations.set(a[0],{id:a[0],name:a[3]||a[4]||'Posto',brand:a[4]||'',p:[a[1],a[2]]});});}
let drawT=0;const redraw=()=>{clearTimeout(drawT);drawT=setTimeout(()=>{drawSigns();drawFuel();},60);};
function loadDTile(x,y){const k=x+'_'+y;if(dtiles.has(k))return dtiles.get(k);
  const pr=didx.then(ix=>{if(!ix)return'none';if(!ix.has(k))return true;return fetch('data/osm/'+k+'.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(j=>{ingest(j);redraw();return true;});}).catch(e=>{setTimeout(()=>dtiles.delete(k),20000);return false;});
  dtiles.set(k,pr);return pr;}
function loadArea(w,s,e,n,max=16){const ks=[];for(let x=Math.floor(w/DT);x*DT<e;x++)for(let y=Math.floor(s/DT);y*DT<n;y++)ks.push([x,y]);const cx=(w+e)/2/DT,cy=(s+n)/2/DT;ks.sort((a,b)=>Math.hypot(a[0]+.5-cx,a[1]+.5-cy)-Math.hypot(b[0]+.5-cx,b[1]+.5-cy));
  return Promise.all(ks.slice(0,max).map(([x,y])=>loadDTile(x,y)));}
function segDist(p,a,b){const kx=111320*Math.cos(rad(p[1])),ky=110540;const ax=(a[0]-p[0])*kx,ay=(a[1]-p[1])*ky,bx=(b[0]-p[0])*kx,by=(b[1]-p[1])*ky;const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?-(ax*dx+ay*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(ax+t*dx,ay+t*dy);}
function nearestWay(p,max=30){let best=null,bd=max;for(const w of OSM.ways.values()){const g=w.g;if(Math.abs(g[0][1]-p[1])>.03)continue;for(let i=1;i<g.length;i++){const d=segDist(p,g[i-1],g[i]);if(d<bd){bd=d;best=w;}}}return best;}
/* ícones das placas desenhados no próprio app (padrão brasileiro) */
function drawIcon(id){const S2=2,c=document.createElement('canvas');let w=48,h=48;const lim=id.match(/^limit-(\d+)$/),rd=id.match(/^radar(?:-(\d+))?$/);if(rd&&rd[1])h=70;c.width=w*S2;c.height=h*S2;const x=c.getContext('2d');x.scale(S2,S2);
  const circleLimit=(cx,cy,r,n)=>{x.fillStyle='#fff';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.lineWidth=r*.2;x.strokeStyle='#E2231A';x.beginPath();x.arc(cx,cy,r-r*.1,0,7);x.stroke();x.fillStyle='#111';x.font=`900 ${r*(n>99?.72:.9)}px Arial`;x.textAlign='center';x.textBaseline='middle';x.fillText(n,cx,cy+1);};
  if(lim)circleLimit(24,24,21,lim[1]);
  else if(rd){x.fillStyle='#111';x.beginPath();x.roundRect(4,4,40,40,10);x.fill();x.strokeStyle='#FF4F4F';x.lineWidth=3;x.beginPath();x.roundRect(4,4,40,40,10);x.stroke();x.fillStyle='#fff';x.beginPath();x.roundRect(11,17,22,15,3);x.fill();x.beginPath();x.moveTo(33,21);x.lineTo(39,18);x.lineTo(39,31);x.lineTo(33,28);x.fill();x.fillStyle='#111';x.beginPath();x.arc(22,24.5,4.5,0,7);x.fill();if(rd[1])circleLimit(24,56,13,rd[1]);}
  else if(id==='signal'){x.fillStyle='#151515';x.beginPath();x.roundRect(15,3,18,42,6);x.fill();[['#FF3B30',11],['#FFCC00',24],['#34C759',37]].forEach(([col,y])=>{x.fillStyle=col;x.beginPath();x.arc(24,y,5,0,7);x.fill();});}
  else if(id==='stop'){x.fillStyle='#E2231A';x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;x.lineTo(24+21*Math.cos(a),24+21*Math.sin(a));}x.closePath();x.fill();x.stroke();x.fillStyle='#fff';x.font='900 12px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('PARE',24,25);}
  else if(id==='giveway'){x.fillStyle='#fff';x.strokeStyle='#E2231A';x.lineWidth=6;x.lineJoin='round';x.beginPath();x.moveTo(5,8);x.lineTo(43,8);x.lineTo(24,42);x.closePath();x.fill();x.stroke();}
  else if(id==='fuel'||id==='fuelbest'){const best=id==='fuelbest';x.fillStyle=best?'#C6F432':'#1B1D18';x.strokeStyle=best?'#0A0B0A':'#C6F432';x.lineWidth=2.5;x.beginPath();x.roundRect(6,4,36,36,11);x.fill();x.stroke();x.beginPath();x.moveTo(19,40);x.lineTo(24,46);x.lineTo(29,40);x.closePath();x.fillStyle=best?'#C6F432':'#C6F432';x.fill();
   x.save();x.translate(12,10);x.strokeStyle=best?'#0A0B0A':'#C6F432';x.lineWidth=2.1;x.lineCap='round';x.lineJoin='round';x.stroke(new Path2D('M3 22V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v17M3 22h11M14 10h2a2 2 0 0 1 2 2v4a2 2 0 0 0 4 0V8l-3-3M6 8h5'));x.restore();}
  else return null;return{width:c.width,height:c.height,data:new Uint8Array(x.getImageData(0,0,c.width,c.height).data.buffer)};}
let signsReady=false;
function setupSigns(m){if(m.getSource('osm-signs')||!m.getStyle().sources.openmaptiles)return;
  m.on('styleimagemissing',e=>{const im=drawIcon(e.id);if(im&&!m.hasImage(e.id))m.addImage(e.id,im,{pixelRatio:2});});
  m.addSource('osm-signs',{type:'geojson',data:{type:'FeatureCollection',features:[]}});m.addSource('osm-fuel',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
  m.addLayer({id:'osm-signal',type:'symbol',source:'osm-signs',minzoom:13,filter:['==',['get','k'],'signal'],layout:{'icon-image':'signal','icon-size':['interpolate',['linear'],['zoom'],13,.2,15,.32,17,.55],'icon-allow-overlap':true,'icon-ignore-placement':true}});
  m.addLayer({id:'osm-signs',type:'symbol',source:'osm-signs',minzoom:14.5,filter:['in',['get','k'],['literal',['stop','giveway','limit']]],layout:{'icon-image':['get','icon'],'icon-size':['interpolate',['linear'],['zoom'],14.5,.32,16,.5,18,.8],'icon-allow-overlap':true,'icon-ignore-placement':true}});
  m.addLayer({id:'osm-fuel',type:'symbol',source:'osm-fuel',minzoom:11.5,layout:{'icon-image':['get','icon'],'icon-size':['interpolate',['linear'],['zoom'],11.5,.42,14,.6,17,.8],'icon-allow-overlap':true,'icon-anchor':'bottom','text-field':['get','pr'],'text-font':['Noto Sans Bold'],'text-size':12,'text-offset':[0,.3],'text-anchor':'top','text-allow-overlap':true,'symbol-sort-key':['get','o']},paint:{'text-color':['case',['get','best'],'#C6F432','#F2F3EE'],'text-halo-color':'#0A0B0A','text-halo-width':1.6}});
  m.addLayer({id:'osm-radar',type:'symbol',source:'osm-signs',minzoom:11,filter:['==',['get','k'],'radar'],layout:{'icon-image':['get','icon'],'icon-size':['interpolate',['linear'],['zoom'],11,.42,17,.85],'icon-allow-overlap':true,'icon-ignore-placement':true,'icon-anchor':'bottom'}});
  m.on('click','osm-fuel',e=>{const f=e.features&&e.features[0];if(f&&router.cur&&router.cur.name==='map')router.go('station',{id:f.properties.id});});
  m.on('mouseenter','osm-fuel',()=>m.getCanvas().style.cursor='pointer');m.on('mouseleave','osm-fuel',()=>m.getCanvas().style.cursor='');
  signsReady=true;drawSigns();drawFuel();}
function drawSigns(){const m=getMap();if(!m||!signsReady)return;const f=[];for(const n of OSM.nodes.values()){let icon=n.k;if(n.k==='radar')icon=n.ms?'radar-'+n.ms:'radar';else if(n.k==='limit')icon='limit-'+n.ms;f.push({type:'Feature',properties:{k:n.k,icon},geometry:{type:'Point',coordinates:n.p}});}
  m.getSource('osm-signs').setData({type:'FeatureCollection',features:f});}
function drawFuel(){const m=getMap();if(!m||!signsReady)return;const ft=S.fuelType;let best=null;
  if(stOn){const b=m.getBounds();for(const s of OSM.stations.values()){if(!b.contains(s.p))continue;const pr=price(s,ft);if(pr&&(!best||pr.v<best.v))best={id:s.id,v:pr.v};}}
  const f=[];for(const s of OSM.stations.values()){const pr=stOn?price(s,ft):null;const isB=!!(best&&best.id===s.id);f.push({type:'Feature',properties:{id:s.id,icon:isB?'fuelbest':'fuel',pr:pr?pr.v.toFixed(2).replace('.',','):'',best:isB,o:isB?0:1},geometry:{type:'Point',coordinates:s.p}});}
  m.getSource('osm-fuel').setData({type:'FeatureCollection',features:f});return best;}
/* ---------- alertas da comunidade (estilo Waze) ---------- */
const AT={traf:['Trânsito','#FF9F1C','<path d="M5 17h14M7 17l1.5-5h7L17 17"/><circle cx="8" cy="19" r="1"/><circle cx="16" cy="19" r="1"/><path d="M4 8h16"/>'],pol:['Polícia','#5B8CFF','<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/>'],acc:['Acidente','#FF4F4F','<path d="M12 3l2 5 5-2-2 5 4 3-5 1 1 5-5-3-5 3 1-5-5-1 4-3-2-5 5 2z"/>'],haz:['Perigo na via','#FACC15','<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>'],hole:['Buraco','#FACC15','<ellipse cx="12" cy="14" rx="8" ry="4"/><path d="M8 13c1 1 7 1 8 0"/>'],cam:['Radar móvel','#FF4F4F','<rect x="3" y="8" width="13" height="9" rx="2"/><path d="M16 11l5-3v9l-5-3"/>'],flood:['Alagamento','#22D3EE','<path d="M3 15c2 2 4 2 6 0s4-2 6 0 4 2 6 0M3 19c2 2 4 2 6 0s4-2 6 0 4 2 6 0M12 3l4 6a4 4 0 1 1-8 0z"/>'],stop:['Veículo parado','#FACC15','<path d="M5 16v-3l2-5h10l2 5v3H5z"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>'],work:['Obra','#FF9F1C','<path d="M12 3l5 17H7z"/><path d="M5 20h14M9.5 11h5M8.5 15h7"/>']};
const aIcon=(t,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#0A0B0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${AT[t][2]}</svg>`;
S.alerts=(S.alerts||[]).filter(a=>Date.now()-a.t<3*3600e3);
function seedAlerts(){if(S.alertSeed&&Date.now()-S.alertSeed<3600e3&&S.alerts.some(a=>a.fake))return;const m=getMap();if(!m||!m.isStyleLoaded())return;
  let roads=[];try{roads=m.queryRenderedFeatures().filter(f=>f.sourceLayer==='transportation'&&/primary|secondary|tertiary|trunk/.test(f.properties.class)&&f.geometry.type==='LineString');}catch(e){}
  if(!roads.length)return;S.alerts=S.alerts.filter(a=>!a.fake);const ks=['traf','pol','haz','hole','stop','work','traf','cam'];const P=C.P||[];
  for(let i=0;i<6;i++){const r=roads[Math.floor(Math.random()*roads.length)].geometry.coordinates;const p=r[Math.floor(Math.random()*r.length)];
   S.alerts.push({id:'fa'+Date.now()+i,ty:ks[Math.floor(Math.random()*ks.length)],p,t:Date.now()-Math.random()*90*60e3,by:(P[Math.floor(Math.random()*P.length)]||{h:'rolê'}).h,ok:1+Math.floor(Math.random()*9),fake:true});}
  S.alertSeed=Date.now();save();drawAlerts();}
let aMarks=[];
function drawAlerts(){const m=getMap();if(!m||!window.maplibregl)return;aMarks.forEach(x=>x.remove());aMarks=[];
  for(const a of S.alerts){const el=document.createElement('div');el.className='alpin';el.style.background=AT[a.ty][1];el.innerHTML=aIcon(a.ty,17);el.onclick=e=>{e.stopPropagation();alertSheet(a);};aMarks.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(a.p).addTo(m));}}
function alertSheet(a){const mine=a.by===S.me.handle;sheet(`<div class="row"><span class="ai" style="width:48px;height:48px;border-radius:99px;background:${AT[a.ty][1]};display:flex;align-items:center;justify-content:center">${aIcon(a.ty,24)}</span><div style="flex:1"><div style="font-size:20px;font-weight:800">${AT[a.ty][0]}</div><div class="small muted">${mine?'Você reportou':'@'+esc(a.by)} · ${ago(a.t)} · a ${fmtD(dist(myPos(),a.p))}</div></div></div>
  <div class="small muted" style="margin-top:12px">${a.ok} ${a.ok===1?'pessoa confirmou':'pessoas confirmaram'}</div>
  <div class="row" style="gap:10px;margin-top:14px">${mine?`<button class="btn danger" id="ad" style="flex:1">Remover alerta</button>`:`<button class="btn sec" id="an" style="flex:1">Não está mais</button><button class="btn" id="ay" style="flex:1">Ainda está lá</button>`}</div>`,(w,close)=>{
  const rm=()=>{S.alerts=S.alerts.filter(x=>x!==a);save();drawAlerts();close();};
  if(mine)$('#ad',w).onclick=()=>{rm();toast('Alerta removido','dark');};
  else{$('#ay',w).onclick=()=>{a.ok++;a.t=Date.now();save();close();toast('Valeu por confirmar');};$('#an',w).onclick=()=>{a.no=(a.no||0)+1;if(a.no>=2||a.ok<=1)rm();else{save();close();}toast('Valeu! Atualizado','dark');};}});}
function newAlert(){sheet(`<div style="font-size:20px;font-weight:800">O que está acontecendo?</div><div class="small muted" style="margin-top:2px">O alerta fica no lugar onde você está agora</div>
  <div class="agrid">${Object.entries(AT).map(([k,v])=>`<button data-k="${k}"><span class="ai" style="background:${v[1]}">${aIcon(k,22)}</span>${v[0]}</button>`).join('')}</div>`,(w,close)=>{
  $$('[data-k]',w).forEach(b=>b.onclick=()=>{const p=myPos();S.alerts.push({id:'a'+Date.now(),ty:b.dataset.k,p:[p[0],p[1]],t:Date.now(),by:S.me.handle,ok:1});save();drawAlerts();close();toast(`Alerta de ${AT[b.dataset.k][0].toLowerCase()} enviado. Valeu!`);navigator.vibrate&&navigator.vibrate(20);});});}
/* ---------- trânsito simulado: outros pilotos rodando nas ruas ---------- */
const sim={cars:[],roads:[],raf:0,lt:0,on:true};
function simRoads(){const m=getMap();if(!m)return;try{sim.roads=m.queryRenderedFeatures().filter(f=>f.sourceLayer==='transportation'&&/minor|tertiary|secondary|primary|trunk/.test(f.properties.class)&&f.geometry.type==='LineString'&&f.geometry.coordinates.length>1).map(f=>f.geometry.coordinates);}catch(e){}}
function pathLen(c){let L=0;const cum=[0];for(let i=1;i<c.length;i++){L+=dist(c[i-1],c[i]);cum.push(L);}return cum;}
function setPath(car,c){car.c=c;car.cum=pathLen(c);car.s=0;}
function spawn(){const m=getMap();if(!sim.roads.length)return;const c=sim.roads[Math.floor(Math.random()*sim.roads.length)];const path=Math.random()<.5?c:c.slice().reverse();const P=C.P||[];const who=P[Math.floor(Math.random()*P.length)]||{};
  const el=document.createElement('div');el.className='simcar';el.style.background=who.g||'#888';el.innerHTML=RL.avatar2?RL.avatar2(who,30):(RL.silh?RL.silh(who.moto?'moto':'car'):'');el.title=who.n||'';el.onclick=e=>{e.stopPropagation();if(who.h)router.go('person',{h:who.h});};
  const car={el,v:7+Math.random()*7,who};setPath(car,path);car.s=Math.random()*car.cum[car.cum.length-1]*.6;car.mk=new maplibregl.Marker({element:el}).setLngLat(path[0]).addTo(m);sim.cars.push(car);}
function nextRoad(car){const end=car.c[car.c.length-1];const opts=[];for(const r of sim.roads){if(r===car.c)continue;if(dist(r[0],end)<12)opts.push(r);else if(dist(r[r.length-1],end)<12)opts.push(r.slice().reverse());}
  if(opts.length){setPath(car,opts[Math.floor(Math.random()*opts.length)]);return true;}return false;}
function simTick(ts){sim.raf=requestAnimationFrame(simTick);const m=getMap();const dt=Math.min(.2,(ts-(sim.lt||ts))/1000);sim.lt=ts;
  const active=m&&mapVisible()&&sim.on&&S.settings.simTraffic!==false&&m.getZoom()>=13.5&&document.visibilityState==='visible';
  if(!active){if(sim.cars.length){sim.cars.forEach(c=>c.mk.remove());sim.cars=[];}return;}
  if(!sim.roads.length)simRoads();const want=Math.min(14,Math.floor(sim.roads.length/4));if(sim.cars.length<want&&Math.random()<.05)spawn();
  const b=m.getBounds();
  for(const car of sim.cars.slice()){car.s+=car.v*dt;const L=car.cum[car.cum.length-1];if(car.s>=L){if(!nextRoad(car)){setPath(car,car.c.slice().reverse());}}
   let i=1;while(i<car.cum.length-1&&car.cum[i]<car.s)i++;const a=car.c[i-1],bb=car.c[i],seg=car.cum[i]-car.cum[i-1]||1,t=Math.min(1,(car.s-car.cum[i-1])/seg);const p=[a[0]+(bb[0]-a[0])*t,a[1]+(bb[1]-a[1])*t];car.mk.setLngLat(p);
   if(p[0]<b.getWest()-.01||p[0]>b.getEast()+.01||p[1]<b.getSouth()-.01||p[1]>b.getNorth()+.01){car.mk.remove();sim.cars.splice(sim.cars.indexOf(car),1);}}}
/* ---------- POSTOS E PREÇOS ---------- */
const FUELS=[['gas','Gasolina'],['adt','Aditivada'],['eta','Etanol'],['die','Diesel S10'],['gnv','GNV']];const FN=Object.fromEntries(FUELS);
const BASE={gas:5.79,adt:5.99,eta:3.99,die:6.09,gnv:4.79};
S.fuelRep=S.fuelRep||{};S.fills=S.fills||[];S.fuelType=S.fuelType||'gas';
const has=(st,f)=>f==='gnv'?hsh(st.id+'gnv')<.22:f==='die'?hsh(st.id+'die')<.7:true;
function price(st,f){const r=S.fuelRep[st.id+':'+f];if(r)return{v:r.v,t:r.t,by:S.me.handle};if(!has(st,f))return null;
  let v=BASE[f]+(hsh(st.id+f)-.5)*.5+(f==='adt'?(hsh(st.id+'gas')-.5)*.5:0);v=Math.floor(v*10)/10+.09;const P=C.P||[];return{v,t:Date.now()-(1+hsh(st.id+f+'t')*40)*3600e3,by:(P[Math.floor(hsh(st.id+f+'b')*P.length)]||{h:'rolê'}).h};}
let stLoading=null;
async function loadStations(p,force){const ix=await didx;if(ix){const k=.085;await loadArea(p[0]-k,p[1]-k,p[0]+k,p[1]+k,9);return true;}if(stLoading&&!force)return stLoading;const q=`[out:json][timeout:20];(node(around:8000,${p[1]},${p[0]})[amenity=fuel];way(around:8000,${p[1]},${p[0]})[amenity=fuel];);out center;`;
  stLoading=ovq(q).then(j=>{j.elements.forEach(addStation);return true;}).catch(e=>{stLoading=null;throw e;});return stLoading;}
const nearSt=()=>{const p=myPos();return[...OSM.stations.values()].map(s=>({...s,d:dist(p,s.p)})).filter(s=>s.d<8000);};
let stMarks=[];
function drawStationPins(on){stOn=!!on;drawFuel();if(!on)return;const f=S.fuelType;const m=getMap();const b=m&&m.getBounds();return[...OSM.stations.values()].filter(s=>!b||b.contains(s.p)).map(s=>({s,pr:price(s,f)})).filter(x=>x.pr).sort((a,b)=>a.pr.v-b.pr.v);}
function spark(st,f){const pr=price(st,f);if(!pr)return'';const r=[];let v=pr.v+(hsh(st.id+f+'s')-.3)*.4;for(let i=0;i<30;i++){v+=(hsh(st.id+f+i)-.5)*.06;r.push(v);}r[29]=pr.v;const mn=Math.min(...r),mx=Math.max(...r),W=300,H=70;
  const pts=r.map((y,i)=>`${(i/29*W).toFixed(1)},${(H-6-(y-mn)/(mx-mn||1)*(H-14)).toFixed(1)}`).join(' ');const d=r[29]-r[0];
  return`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:70px;display:block"><polyline points="${pts}" fill="none" stroke="#C6F432" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${W}" cy="${pts.split(' ').pop().split(',')[1]}" r="4" fill="#C6F432"/></svg><div class="small muted">30 dias: ${d>=0?'subiu':'caiu'} ${brl(Math.abs(d))}</div>`;}
SCREENS.fuel={tabbar:false,
 html(){const f=S.fuelType;return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Postos perto de você</h2></div><div class="scroll">
  <div class="chips" id="ft">${FUELS.map(([k,n])=>`<button class="chip ${f===k?'lime':''}" data-f="${k}">${n}</button>`).join('')}</div>
  <div class="seg" id="fo" style="margin-top:12px">${[['p','Mais barato'],['d','Mais perto']].map(([k,n])=>`<button data-o="${k}" class="${(this.o||'p')===k?'on':''}">${n}</button>`).join('')}</div>
  <div id="fx" style="margin-top:12px"></div><div id="fl"><div class="empty">Buscando postos…</div></div>
  <div class="small" style="text-align:center;color:var(--tx4);margin-top:14px;line-height:1.5">Postos reais do OpenStreetMap. Os preços são enviados pela comunidade (no protótipo, valores de exemplo).</div></div>`;},
 async mount(el){const draw=()=>{const f=S.fuelType,o=this.o||'p';const list=nearSt().map(s=>({s,pr:price(s,f)})).filter(x=>x.pr);
   list.sort((a,b)=>o==='p'?a.pr.v-b.pr.v||a.s.d-b.s.d:a.s.d-b.s.d);
   const avg=k=>{const v=nearSt().map(s=>price(s,k)).filter(Boolean).map(x=>x.v);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;};const g=avg('gas'),e=avg('eta'),car=activeCar();
   if(g&&e&&(f==='gas'||f==='eta')){const rt=e/g,kml=car&&car.kml;const best=rt<.7?'eta':'gas';$('#fx',el).innerHTML=`<div class="card"><div class="row"><div style="flex:1"><div class="small muted">Etanol ou gasolina?</div><div class="b" style="font-size:18px;margin-top:2px">${best==='eta'?'Etanol compensa':'Gasolina compensa'} <span class="small muted">(${Math.round(rt*100)}%)</span></div></div><span class="badge" style="background:rgba(198,244,50,.16);color:var(--lime2)">${best==='eta'?'Etanol':'Gasolina'}</span></div>
     <div class="small muted" style="margin-top:6px;line-height:1.45">Etanol compensa quando custa menos de 70% da gasolina.${kml?` Com seu ${esc(car.model)} (${String(kml).replace('.',',')} km/l): 100 km saem ${brl(100/kml*g)} na gasolina e ~${brl(100/(kml*.7)*e)} no etanol.`:''}</div></div>`;}else $('#fx',el).innerHTML='';
   $('#fl',el).innerHTML=list.length?`<div class="card list" style="padding:2px 12px">${list.slice(0,40).map((x,i)=>`<button class="fuelrow press" data-id="${x.s.id}" style="width:100%;text-align:left"><span class="ib" style="width:42px;height:42px;${i===0&&o==='p'?'background:rgba(198,244,50,.16);color:var(--lime2)':''}">${ic(I.pump,19)}</span><div style="flex:1;min-width:0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.s.name)}</div><div class="small muted">${fmtD(x.s.d)} · ${ago(x.pr.t)}</div></div><div style="text-align:right"><div class="price ${i===0&&o==='p'?'lime':''}">${x.pr.v.toFixed(2).replace('.',',')}</div><div class="small muted">${FN[f]}</div></div></button>`).join('')}</div>`:'<div class="card empty">Nenhum posto com esse combustível por perto.</div>';
   $$('[data-id]',$('#fl',el)).forEach(b=>b.onclick=()=>router.go('station',{id:+b.dataset.id}));};
  $$('#ft [data-f]',el).forEach(b=>b.onclick=()=>{S.fuelType=b.dataset.f;save();$$('#ft [data-f]',el).forEach(x=>x.classList.toggle('lime',x===b));draw();});
  $$('#fo [data-o]',el).forEach(b=>b.onclick=()=>{this.o=b.dataset.o;$$('#fo [data-o]',el).forEach(x=>x.classList.toggle('on',x===b));draw();});
  if(nearSt().length)draw();try{await loadStations(myPos());draw();}catch(e){if(!nearSt().length)$('#fl',el).innerHTML='<div class="card empty">Não deu pra buscar os postos agora. Tente de novo.</div>';}}};
SCREENS.station={tabbar:false,
 html(p){const s=OSM.stations.get(+p.id);if(!s)return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button></div><div class="empty">Posto não encontrado</div>`;const d=dist(myPos(),s.p),f=S.fuelType;
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>${esc(s.name)}</h2></div><div class="scroll">
  <div class="small muted" style="margin:0 4px">${s.brand&&s.brand!==s.name?esc(s.brand)+' · ':''}a ${fmtD(d)}</div>
  <div class="card" style="margin-top:12px;padding:6px 14px"><table class="ptab" style="width:100%;border-collapse:collapse">${FUELS.map(([k,n])=>{const pr=price(s,k);return`<tr><td class="b">${n}</td><td class="small muted">${pr?ago(pr.t)+' · @'+esc(pr.by):'não vende'}</td><td style="text-align:right" class="price ${k===f?'lime':''}">${pr?pr.v.toFixed(2).replace('.',','):'—'}</td></tr>`;}).join('')}</table></div>
  <div class="card" style="margin-top:12px"><div class="small muted b" style="margin-bottom:6px">${FN[f]} neste posto</div>${spark(s,f)||'<div class="small muted">Sem histórico</div>'}</div>
  <div class="row" style="gap:10px;margin-top:14px"><button class="btn sec" data-on="rep" style="flex:1">Atualizar preço</button><button class="btn" data-on="go" style="flex:1">${ic(I.route,18)}Ir até lá</button></div>
  <button class="btn sec" data-on="fill" style="margin-top:10px">${ic(I.pump,18)}Abasteci aqui</button>
  ${S.fills.length?`<div class="sec-t">Seus abastecimentos</div><div class="card list" style="padding:2px 12px">${S.fills.slice(0,5).map(x=>`<div class="row" style="padding:10px 0"><div style="flex:1"><div class="b" style="font-size:14px">${esc(x.st)}</div><div class="small muted">${new Date(x.t).toLocaleDateString('pt-BR')} · ${FN[x.f]} · ${String(x.l).replace('.',',')} L</div></div><b>${brl(x.v)}</b></div>`).join('')}</div>`:''}</div>`;},
 on:{go(){const s=OSM.stations.get(+this.params.id);router.go('preview',{dest:{name:s.name,addr:'Posto',p:s.p}});},
  rep(){const s=OSM.stations.get(+this.params.id);sheet(`<div style="font-size:20px;font-weight:800">Atualizar preço</div><div class="small muted">${esc(s.name)}</div><div class="chips" id="rf" style="margin-top:12px">${FUELS.map(([k,n])=>`<button class="chip ${S.fuelType===k?'lime':''}" data-f="${k}">${n}</button>`).join('')}</div><label class="f">Preço por litro</label><input class="inp" id="rv" inputmode="decimal" placeholder="Ex.: 5,79"><button class="btn" id="rs" style="margin-top:14px">Enviar</button>`,(w,close)=>{let f=S.fuelType;
   $$('#rf [data-f]',w).forEach(b=>b.onclick=()=>{f=b.dataset.f;$$('#rf [data-f]',w).forEach(x=>x.classList.toggle('lime',x===b));});
   $('#rs',w).onclick=()=>{const v=parseFloat(($('#rv',w).value||'').replace(',','.'));if(!(v>1.5&&v<15)){toast('Preço inválido','dark');return;}S.fuelRep[s.id+':'+f]={v,t:Date.now()};S.priceCount=(S.priceCount||0)+1;save();close();toast('Valeu! Preço atualizado pra todo mundo');router.render(this,true,true);};});},
  fill(){const s=OSM.stations.get(+this.params.id);sheet(`<div style="font-size:20px;font-weight:800">Abasteci aqui</div><div class="chips" id="ff" style="margin-top:12px">${FUELS.map(([k,n])=>`<button class="chip ${S.fuelType===k?'lime':''}" data-f="${k}">${n}</button>`).join('')}</div><div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Litros</label><input class="inp" id="fl2" inputmode="decimal" placeholder="40"></div><div style="flex:1"><label class="f">Valor pago (R$)</label><input class="inp" id="fv" inputmode="decimal" placeholder="230,00"></div></div><button class="btn" id="fs" style="margin-top:14px">Salvar</button>`,(w,close)=>{let f=S.fuelType;
   $$('#ff [data-f]',w).forEach(b=>b.onclick=()=>{f=b.dataset.f;$$('#ff [data-f]',w).forEach(x=>x.classList.toggle('lime',x===b));});
   $('#fs',w).onclick=()=>{const l=parseFloat(($('#fl2',w).value||'').replace(',','.')),v=parseFloat(($('#fv',w).value||'').replace(',','.'));if(!(l>0&&v>0)){toast('Preencha litros e valor','dark');return;}S.fills.unshift({t:Date.now(),st:s.name,f,l,v});if(!S.fuelRep[s.id+':'+f])S.fuelRep[s.id+':'+f]={v:Math.round(v/l*100)/100,t:Date.now()};save();close();toast(`Anotado: ${brl(v/l)} por litro`);router.render(this,true,true);};});}}};
/* ---------- integração com o mapa ---------- */
const MS=SCREENS.map;
const GHOST='<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.5 2-2-2-2 2-2.5-2z"/><circle cx="9.5" cy="10.5" r="1"/><circle cx="14.5" cy="10.5" r="1"/>';
const mh=MS.html;MS.html=function(p){return mh.call(this,p)+`${S.settings.ghost?`<div class="ghostpill">${ic(GHOST,14)}Modo fantasma: ninguém te vê</div>`:''}<div class="mapfabs"><button class="fab ${S.settings.ghost?'on':''}" data-on="ghost" aria-label="Modo fantasma">${ic(GHOST,20)}</button><button class="fab" data-on="fuelList" aria-label="Postos">${ic(I.pump,19)}</button><button class="fab warn" data-on="alertNew" aria-label="Criar alerta">${ic('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',20,2.4)}</button></div>`;};
MS.on.ghost=function(){S.settings.ghost=!S.settings.ghost;save();document.body.classList.toggle('ghost',!!S.settings.ghost);toast(S.settings.ghost?'Modo fantasma ligado: você some do mapa dos outros':'Modo fantasma desligado','dark');router.render(this,true,true);};
MS.on.fuelList=()=>router.go('fuel');MS.on.alertNew=()=>newAlert();
MS.on.postos=async function(a){if(a.classList.contains('lime')){a.classList.remove('lime');drawStationPins(false);return;}a.classList.add('lime');toast('Buscando postos perto…','dark');
  try{await loadStations(myPos());const l=drawStationPins(true);if(l&&l.length)toast(`${FN[S.fuelType]} mais barata: ${brl(l[0].pr.v)} · ${l[0].s.name}`);else toast('Nenhum posto encontrado aqui','dark');}catch(e){toast('Não deu pra carregar os postos agora','dark');a.classList.remove('lime');}};
const ml=MS.leave;MS.leave=function(){ml&&ml.call(this);};
document.body.classList.toggle('ghost',!!S.settings.ghost);
/* ---------- durante o rolê: limite da via, radar, alertas por perto ---------- */
function rideUI(node){const el=node.el;if(!el||$('#limS',el))return;const s=document.createElement('div');s.id='limS';s.className='limsign';
  s.style.cssText=node.name==='nav'?'left:14px;bottom:calc(200px + var(--safeB))':'left:16px;top:calc(160px + var(--safeT))';el.appendChild(s);
  const b=document.createElement('button');b.className='fab warn';b.style.cssText='position:absolute;right:12px;z-index:21;'+(node.name==='nav'?'top:calc(330px + var(--safeT))':'top:calc(160px + var(--safeT))');b.innerHTML=ic('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',20,2.4);b.onclick=newAlert;el.appendChild(b);}
const said=new Map();const once=(k,ms)=>{const t=said.get(k);if(t&&Date.now()-t<ms)return false;said.set(k,Date.now());return true;};
function hud(node,p){didx.then(ix=>{if(ix)loadArea(p[0]-.01,p[1]-.01,p[0]+.01,p[1]+.01,4);else loadTile(p);});loadWays(p);const s=node.el&&$('#limS',node.el);const w=nearestWay(p,25);const kmh=Math.round((ride.speed||0)*3.6);
  if(s){if(w){s.style.display='flex';s.textContent=w.ms;const over=kmh>w.ms+5;s.classList.toggle('over',over);if(over&&once('lim',25000))speak(`Atenção, limite de ${w.ms}`);}else s.style.display='none';}
  for(const n of OSM.nodes.values()){if(n.k!=='radar')continue;const d=dist(p,n.p);if(d<450&&d>40){const prev=n.ld;n.ld=d;if(prev&&d<prev&&once('r'+n.id,180000)){const msg=`Radar a ${Math.round(d/50)*50} metros${n.ms?', limite '+n.ms:''}`;toast(msg,'dark');speak(msg);}}}
  for(const a of S.alerts){if(a.by===S.me.handle)continue;const d=dist(p,a.p);if(d<500&&once('a'+a.id,600000)){const msg=`${AT[a.ty][0]} reportado a ${Math.round(d/50)*50} metros`;toast(msg,'dark');speak(msg);}}}
for(const nm of['nav','rec']){const sc=SCREENS[nm];if(!sc)continue;const o=sc.onPos,mr=sc.mapReady;
  sc.onPos=function(p){o&&o.call(this,p);try{hud(this,p);}catch(e){console.warn(e);}};
  sc.mapReady=function(){mr&&mr.call(this);rideUI(this);};}
function parseRel(e){const t=e.tags||{};if(t.type!=='enforcement'||!e.members||!/maxspeed|mixed|average_speed/.test(t.enforcement||''))return;const dv=e.members.find(x=>x.role==='device'&&x.type==='node'&&x.lat!=null)||e.members.find(x=>x.type==='node'&&x.lat!=null);if(!dv||OSM.nodes.has(dv.ref))return;OSM.nodes.set('r'+e.id,{id:'r'+e.id,p:[dv.lon,dv.lat],k:'radar',ms:parseInt(t.maxspeed)||null});}
let ovWarned=false;
function loadView(m){const z=m.getZoom(),b=m.getBounds();if(z<11)return;
  didx.then(ix=>{if(ix){const mx=(b.getEast()-b.getWest())*.15,my=(b.getNorth()-b.getSouth())*.15;loadArea(b.getWest()-mx,b.getSouth()-my,b.getEast()+mx,b.getNorth()+my,16);return;}
   if(z<12.5)return;const c=m.getCenter();const ks=[];for(let i=Math.floor(b.getWest()/.04);i*.04<b.getEast();i++)for(let j=Math.floor(b.getSouth()/.04);j*.04<b.getNorth();j++)ks.push([i*.04+.001,j*.04+.001]);
   ks.sort((a,bb)=>Math.hypot(a[0]-c.lng,a[1]-c.lat)-Math.hypot(bb[0]-c.lng,bb[1]-c.lat));ks.slice(0,6).forEach(p=>loadTile(p));});}
/* ---------- boot ---------- */
const wait=setInterval(()=>{const m=getMap();if(!m||!window.maplibregl)return;clearInterval(wait);
  let mt;m.on('idle',()=>{try{setupSigns(m);}catch(e){}if(!aMarks.length&&S.alerts.length)drawAlerts();seedAlerts();});
  m.on('moveend',()=>{clearTimeout(mt);mt=setTimeout(()=>{simRoads();loadView(m);if(stOn)drawFuel();},300);});m.once('idle',()=>loadView(m));loadView(m);
  sim.raf=requestAnimationFrame(simTick);},250);
})();
