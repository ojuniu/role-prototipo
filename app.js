/* Rolê — app web (parte 1: mapa, GPS, rolê, território, navegação) */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STYLE='https://tiles.openfreemap.org/styles/liberty';
const DEFAULT_CENTER=[-43.9386,-19.9255]; // BH
/* ================= ícones ================= */
const ic=(p,s=20,w=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I={map:'<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13M15 6.5v13"/>',people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20"/>',plus:'<path d="M12 5v14M5 12h14"/>',car:'<path d="M4 16v-3.5l2-5A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.5l2 5V16"/><path d="M3 16h18"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',back:'<path d="M15 5l-7 7 7 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',loc:'<path d="M3 11l18-8-8 18-2-8z"/>',pump:'<path d="M3 22V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v17M3 22h11M14 10h2a2 2 0 0 1 2 2v4a2 2 0 0 0 4 0V8l-3-3"/>',hex:'<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>',vol:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',mute:'<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/>',share:'<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',horn:'<path d="M3 10v4h3l6 4V6L6 10H3z"/><path d="M16 8.5a5 5 0 0 1 0 7"/>',cmt:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',flag:'<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',cam:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',play:'<path d="M7 4l13 8-13 8z"/>',check:'<path d="M5 12l5 5L20 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
const ARROW={left:'<path d="M17 21V11a3 3 0 0 0-3-3H5"/><path d="M9 4L5 8l4 4"/>',right:'<path d="M7 21V11a3 3 0 0 1 3-3h9"/><path d="M15 4l4 4-4 4"/>',straight:'<path d="M12 20V5"/><path d="M6 11l6-6 6 6"/>',uturn:'<path d="M9 20V9a4 4 0 0 1 8 0v3"/><path d="M14 9l3 3 3-3"/>',arrive:'<path d="M5 22V4h12l-2 4 2 4H5"/>'};
/* ================= store ================= */
const KEY='role.v2';
const SEED={me:{name:'Juniu',handle:'juniu',crew:'Turbo Clan',level:14,xp:2340},settings:{marker:'photo',voice:true,simulate:false},
 cars:[{id:'c1',model:'Volkswagen Gol 1.4',year:2013,color:'Cinza',front:'p-front.webp',rear:'p-rear.webp',kml:13.2,km:62300,active:true}],
 hexes:{},rides:[],notifs:[{id:'n0',t:Date.now()-3600e3,txt:'Bem-vindo ao Rolê. Saia de carro com o app aberto e pinte sua cidade de lima.',read:false}],posts:[]};
let S;try{S=JSON.parse(localStorage.getItem(KEY))||null}catch(e){S=null}
if(!S)S=JSON.parse(JSON.stringify(SEED));
if(S.hs!==70){S.hexes={};S.hs=70;}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Memória cheia: algumas fotos não foram salvas','dark')}};
const activeCar=()=>S.cars.find(c=>c.active)||S.cars[0];
/* ================= geo ================= */
const R=6371000,rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x));};
const brg=(a,b)=>{const y=Math.sin(rad(b[0]-a[0]))*Math.cos(rad(b[1]));const x=Math.cos(rad(a[1]))*Math.sin(rad(b[1]))-Math.sin(rad(a[1]))*Math.cos(rad(b[1]))*Math.cos(rad(b[0]-a[0]));return(deg(Math.atan2(y,x))+360)%360;};
const fmtD=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1).replace('.',',')+' km':Math.max(10,Math.round(m/10)*10)+' m';
const fmtKm=m=>(m/1000).toFixed(1).replace('.',',');
const fmtT=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;return h?`${h}h${String(m).padStart(2,'0')}`:`${m}:${String(ss).padStart(2,'0')}`;};
const hhmm=d=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
/* hexágonos globais (Web Mercator, 110 m) */
const HS=70,MX=lng=>R*rad(lng),MY=lat=>R*Math.log(Math.tan(Math.PI/4+rad(lat)/2)),ILNG=x=>deg(x/R),ILAT=y=>deg(2*Math.atan(Math.exp(y/R))-Math.PI/2);
const hexKey=p=>{const x=MX(p[0]),y=MY(p[1]);const q=(Math.sqrt(3)/3*x-y/3)/HS,r=(2/3*y)/HS,s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;return rq+','+rr;};
const hexPoly=k=>{const[q,r]=k.split(',').map(Number);const cx=HS*Math.sqrt(3)*(q+r/2),cy=HS*1.5*r;const pts=[];for(let i=0;i<=6;i++){const a=rad(60*i-30);pts.push([ILNG(cx+HS*.94*Math.cos(a)),ILAT(cy+HS*.94*Math.sin(a))]);}return pts;};
const hexCenter=k=>{const[q,r]=k.split(',').map(Number);return[ILNG(HS*Math.sqrt(3)*(q+r/2)),ILAT(HS*1.5*r)];};
const hsh=k=>{let h=2166136261;for(const c of k){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0)/4294967295;};
const owner=k=>S.hexes[k]?'mine':(hsh(k)<.13?'rival':(hsh(k)>.95?'other':'none'));
const CREWS={rival:{name:'Rosa Choque',color:'#FF6A3D'},other:{name:'Moto Norte',color:'#E2E3DE'}};
function hexesAround(c,ring=9){const k0=hexKey(c).split(',').map(Number);const out=[];for(let dq=-ring;dq<=ring;dq++)for(let dr=Math.max(-ring,-dq-ring);dr<=Math.min(ring,-dq+ring);dr++)out.push((k0[0]+dq)+','+(k0[1]+dr));for(const k of Object.keys(S.hexes))if(!out.includes(k))out.push(k);return out;}
/* ================= map ================= */
let map,mapReady=false,fallback=false,lastCenter=null,meMarker=null,carMarker=null,destMarker=null,stationMarkers=[],hexMode='normal',hexCenterKey=null;
function initMap(){
  map=new maplibregl.Map({container:'map',style:STYLE,center:S.lastPos||DEFAULT_CENTER,zoom:15.2,pitch:40,attributionControl:{compact:true},fadeDuration:0,maxPitch:70});
  let loaded=false;const fb=()=>{if(loaded||fallback)return;fallback=true;map.setStyle({version:8,sources:{},layers:[{id:'bg',type:'background',paint:{'background-color':'#151614'}}]});};
  const t=setTimeout(fb,8000);
  map.on('error',e=>{const m=String(e&&e.error&&(e.error.message||e.error));if(!loaded&&/style|fetch|Network|Failed/i.test(m)){clearTimeout(t);fb();}});
  map.on('style.load',()=>{loaded=true;clearTimeout(t);if(!fallback)restyle();addLayers();mapReady=true;refreshHexes(true);updateMe();router.mapViewChanged&&router.mapViewChanged();});
  map.on('moveend',()=>{if(!mapReady)return;const k=hexKey(map.getCenter().toArray());if(k!==hexCenterKey)refreshHexes();});
}
function restyle(){for(const l of map.getStyle().layers||[]){const id=l.id.toLowerCase();try{
  if(l.type==='background')map.setPaintProperty(l.id,'background-color','#0D0E0C');
  else if(l.type==='fill'){let c='#121310';if(/water/.test(id))c='#0B1214';else if(/park|wood|grass|forest|green|cemetery|pitch|landcover|scrub/.test(id))c='#111A0F';else if(/building/.test(id))c='#1A1B18';map.setPaintProperty(l.id,'fill-color',c);map.setPaintProperty(l.id,'fill-opacity',1);try{map.setPaintProperty(l.id,'fill-outline-color',c)}catch(e){}}
  else if(l.type==='fill-extrusion'){map.setPaintProperty(l.id,'fill-extrusion-color','#1F201C');map.setPaintProperty(l.id,'fill-extrusion-opacity',.9);}
  else if(l.type==='line'){if(/water|river|stream|canal/.test(id))map.setPaintProperty(l.id,'line-color','#0B1214');else if(/boundary|admin/.test(id))map.setLayoutProperty(l.id,'visibility','none');else{const major=/motorway|trunk|primary|secondary|major/.test(id);map.setPaintProperty(l.id,'line-color',/casing/.test(id)?'#0D0E0C':(major?'#3B3D37':'#2A2C27'));}}
  else if(l.type==='symbol'){if(/poi|shield|transit|aerialway|ferry|housenum/.test(id))map.setLayoutProperty(l.id,'visibility','none');else{map.setPaintProperty(l.id,'text-color','#8C8E86');map.setPaintProperty(l.id,'text-halo-color','#0D0E0C');}}
  else if(l.type==='hillshade'||l.type==='raster')map.setLayoutProperty(l.id,'visibility','none');}catch(e){}}}
const FC=f=>({type:'FeatureCollection',features:f});
function addLayers(){
  map.addSource('hex',{type:'geojson',data:FC([])});map.addSource('route',{type:'geojson',data:FC([])});map.addSource('track',{type:'geojson',data:FC([])});
  const hb=((map.getStyle().layers||[]).find(l=>l.type==='fill-extrusion'||l.type==='symbol')||{}).id;
  map.addLayer({id:'hex-fill',type:'fill',source:'hex',paint:{'fill-color':hexFill('normal'),'fill-opacity':['interpolate',['linear'],['zoom'],13,1,15.5,.75,17.5,.6]}},hb);
  map.addLayer({id:'hex-line',type:'line',source:'hex',paint:{'line-color':['match',['get','o'],'mine','#C6F432','new','#EFFF7A','rival','#FF6A3D','other','#BFC1BA','#FFFFFF'],'line-width':['match',['get','o'],'new',2.4,'none',.7,1.4],'line-opacity':['match',['get','o'],'none',.1,'other',.3,['interpolate',['linear'],['zoom'],13,.9,17,.65]]}},hb);
  map.addLayer({id:'route-glow',type:'line',source:'route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#C6F432','line-width':20,'line-blur':12,'line-opacity':.5}});
  map.addLayer({id:'route-core',type:'line',source:'route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#D9FF4A','line-width':7}});
  map.addLayer({id:'track',type:'line',source:'track',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#EFFF7A','line-width':5,'line-opacity':.9}});
}
function hexFill(mode){const none=mode==='fog'?'rgba(9,10,8,0.62)':'rgba(0,0,0,0)';return['match',['get','o'],'mine','rgba(198,244,50,0.15)','new','rgba(214,255,80,0.36)','rival','rgba(255,106,61,0.15)','other','rgba(230,230,225,0.03)',none];}
let newHexes=new Set();
function refreshHexes(force){if(!mapReady)return;const c=map.getCenter().toArray();hexCenterKey=hexKey(c);const keys=hexesAround(c,map.getZoom()>15.5?14:20);
  map.getSource('hex').setData(FC(keys.map(k=>({type:'Feature',properties:{o:newHexes.has(k)?'new':owner(k)},geometry:{type:'Polygon',coordinates:[hexPoly(k)]}}))));}
function setHexMode(m){hexMode=m;if(mapReady)map.setPaintProperty('hex-fill','fill-color',hexFill(m));}
function setRoute(coords){if(mapReady)map.getSource('route').setData(FC(coords&&coords.length>1?[{type:'Feature',geometry:{type:'LineString',coordinates:coords}}]:[]));}
function setTrack(coords){if(mapReady)map.getSource('track').setData(FC(coords&&coords.length>1?[{type:'Feature',geometry:{type:'LineString',coordinates:coords}}]:[]));}
function carEl(){const c=activeCar(),d=document.createElement('div');d.className='carmk';const m=S.settings.marker;
  if(m==='arrow'||!c||!c.rear)d.innerHTML='<div class="g"></div><svg width="40" height="46" viewBox="0 0 40 46"><path d="M20 3 L36 41 L20 32 L4 41 Z" fill="#fff" stroke="#C6F432" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  else if(c.rearCut===false)d.innerHTML=`<div class="g"></div><div class="ph"><img src="${c.rear}"></div>`;
  else d.innerHTML=`<div class="g"></div><img src="${c.rear}">`;return d;}
function placeCar(p,show=true){if(!map)return;if(!carMarker){carMarker=new maplibregl.Marker({element:carEl(),anchor:'bottom',pitchAlignment:'viewport',rotationAlignment:'viewport'}).setLngLat(p).addTo(map);}else carMarker.setLngLat(p);carMarker.getElement().style.display=show?'':'none';}
function rebuildCar(){if(carMarker){const p=carMarker.getLngLat();carMarker.remove();carMarker=null;placeCar(p);}}
function setArrowRot(b){if(S.settings.marker!=='arrow'||!carMarker)return;const s=carMarker.getElement().querySelector('svg');if(s)s.style.transform=`rotate(${(b-map.getBearing()+360)%360}deg)`;}
/* ================= GPS ================= */
const gps={pos:null,acc:null,speed:null,head:null,watch:null,listeners:new Set(),denied:false};
function startGPS(){if(gps.watch!=null||!navigator.geolocation)return;
  gps.watch=navigator.geolocation.watchPosition(p=>{gps.denied=false;gps.pos=[p.coords.longitude,p.coords.latitude];gps.acc=p.coords.accuracy;gps.speed=p.coords.speed;gps.head=p.coords.heading;S.lastPos=gps.pos;gps.listeners.forEach(f=>f(gps.pos,'gps'));updateMe();},
   e=>{gps.denied=e.code===1;if(router.cur&&router.cur.name==='map')$('#gpsWarn')&&($('#gpsWarn').style.display='flex');},{enableHighAccuracy:true,maximumAge:2000,timeout:20000});}
function updateMe(){if(!mapReady)return;const p=gps.pos||S.lastPos;if(!p)return;if(!meMarker){const e=document.createElement('div');e.className='mepin';meMarker=new maplibregl.Marker({element:e}).setLngLat(p).addTo(map);}else meMarker.setLngLat(p);
  meMarker.getElement().style.display='none';}
/* ================= rotas / busca ================= */
async function osrm(a,b){const u=`https://router.project-osrm.org/route/v1/driving/${a.join(',')};${b.join(',')}?overview=full&geometries=geojson&steps=true`;
  const r=await fetch(u);const j=await r.json();if(!j.routes||!j.routes[0])throw new Error('sem rota');const rt=j.routes[0];
  return{coords:rt.geometry.coordinates,dist:rt.distance,dur:rt.duration,steps:rt.legs[0].steps.map(s=>({loc:s.maneuver.location,type:s.maneuver.type,mod:s.maneuver.modifier||'',name:s.name||'',exit:s.maneuver.exit,dist:s.distance}))};}
function straightRoute(a,b){const n=30,coords=[];for(let i=0;i<=n;i++)coords.push([a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);const d=dist(a,b);return{coords,dist:d,dur:d/8.3,steps:[{loc:a,type:'depart',mod:'',name:''},{loc:b,type:'arrive',mod:'',name:''}],approx:true};}
async function geocode(q,near){const v=near?`&viewbox=${near[0]-.35},${near[1]+.35},${near[0]+.35},${near[1]-.35}`:'';const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=br&accept-language=pt-BR${v}&q=${encodeURIComponent(q)}`);const j=await r.json();
  return j.map(x=>({name:x.name||x.display_name.split(',')[0],addr:x.display_name.split(',').slice(1,4).join(',').trim(),p:[+x.lon,+x.lat]}));}
const TURN={left:'à esquerda','slight left':'levemente à esquerda','sharp left':'acentuadamente à esquerda',right:'à direita','slight right':'levemente à direita','sharp right':'acentuadamente à direita',straight:'em frente',uturn:'o retorno'};
function instr(s){if(!s)return'Siga em frente';const n=s.name?` na ${s.name}`:'';if(s.type==='arrive')return'Você chegou ao destino';if(s.type==='depart')return`Siga${n||' em frente'}`;if(s.type==='roundabout'||s.type==='rotary')return`Na rotatória, pegue a ${s.exit||1}ª saída${n}`;if(!s.mod||s.mod==='straight')return`Continue em frente${n}`;if(s.mod==='uturn')return'Faça o retorno';return`Vire ${TURN[s.mod]||''}${n}`;}
const arrowOf=s=>!s?ARROW.straight:s.type==='arrive'?ARROW.arrive:s.mod.includes('left')?ARROW.left:s.mod.includes('right')?ARROW.right:s.mod==='uturn'?ARROW.uturn:ARROW.straight;
function speak(t){if(!S.settings.voice||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=1.05;speechSynthesis.speak(u);}catch(e){}}
/* ================= motor do rolê (GPS real ou simulação) ================= */
const ride={on:false,mode:null,track:[],dist:0,t0:0,sec:0,hexNew:[],hexTaken:0,route:null,stepIdx:0,simTimer:null,simD:0,lastHex:null,last:null,speed:0,announced:{},dest:null};
function rideStart(mode,route,dest){Object.assign(ride,{on:true,mode,track:[],dist:0,t0:Date.now(),sec:0,hexNew:[],hexTaken:0,route,stepIdx:0,simD:0,lastHex:null,last:null,speed:0,announced:{},dest});newHexes=new Set();setTrack([]);
  if(route){setRoute(route.coords);prepRoute(route);}else setRoute([]);
  const sim=S.settings.simulate||!gps.pos;ride.sim=sim;
  if(sim)simStart();else{gps.listeners.add(onPos);if(gps.pos)onPos(gps.pos,'gps');}
  ride.tick=setInterval(()=>{ride.sec=(Date.now()-ride.t0)/1000*(ride.sim?ride.simFactor||1:1);router.cur&&router.cur.onTick&&router.cur.onTick();},500);
  speak(mode==='nav'&&route?instr(route.steps[1]||route.steps[0]):'Rolê iniciado. Bora pintar a cidade.');}
function prepRoute(rt){let c=[0];for(let i=1;i<rt.coords.length;i++)c.push(c[i-1]+dist(rt.coords[i-1],rt.coords[i]));rt.cum=c;rt.total=c[c.length-1];
  for(const s of rt.steps){let bi=0,bd=1e12;for(let i=0;i<rt.coords.length;i++){const d=dist(rt.coords[i],s.loc);if(d<bd){bd=d;bi=i;}}s.at=c[bi];}}
function alongRoute(rt,d){d=Math.max(0,Math.min(rt.total,d));let i=1;while(i<rt.cum.length-1&&rt.cum[i]<d)i++;const t=(d-rt.cum[i-1])/((rt.cum[i]-rt.cum[i-1])||1),a=rt.coords[i-1],b=rt.coords[i];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
async function simStart(){
  if(!ride.route){const start=gps.pos||S.lastPos||DEFAULT_CENTER;const ang=Math.random()*Math.PI*2;const end=[start[0]+Math.cos(ang)*.018,start[1]+Math.sin(ang)*.014];
    try{ride.simPath=await osrm(start,end);}catch(e){ride.simPath=straightRoute(start,end);}prepRoute(ride.simPath);}
  else ride.simPath=ride.route;
  ride.simFactor=3;let last=performance.now();
  const step=now=>{if(!ride.on)return;const dt=Math.min(100,now-last)/1000;last=now;const v=12.5*ride.simFactor;ride.simD+=v*dt;const rt=ride.simPath;
    if(ride.simD>=rt.total){onPos(alongRoute(rt,rt.total),'sim',v);if(ride.mode==='nav'){rideArrive();return;}ride.simD=rt.total;if(!ride.waiting){ride.waiting=true;toast('Fim do trajeto simulado. Segure pra encerrar','dark');}}
    else onPos(alongRoute(rt,ride.simD),'sim',v);
    ride.simTimer=requestAnimationFrame(step);};
  ride.simTimer=requestAnimationFrame(step);}
function onPos(p,src,v){if(!ride.on)return;const prev=ride.last;ride.last=p;
  if(prev){const d=dist(prev,p);if(src==='gps'&&d>200){ride.track.push(p);return;}if(d<1.5&&src==='gps')return;ride.dist+=d;ride.speed=src==='sim'?v/ (ride.simFactor||1):(gps.speed??d/1);ride.heading=d>2?brg(prev,p):ride.heading;}
  ride.track.push(p);if(ride.track.length%3===0)setTrack(ride.track);
  const k=hexKey(p);if(k!==ride.lastHex){ride.lastHex=k;const o=owner(k);if(o!=='mine'&&!newHexes.has(k)){newHexes.add(k);ride.hexNew.push(k);if(o==='rival'||o==='other')ride.hexTaken++;toast(o==='rival'?'+1 hex · tomado da Rosa Choque':'+1 hex desbloqueado');refreshHexes();navigator.vibrate&&navigator.vibrate(30);}}
  router.cur&&router.cur.onPos&&router.cur.onPos(p);}
function goSim(){if(!ride.on||ride.sim)return;gps.listeners.delete(onPos);ride.sim=true;ride.t0=Date.now();ride.sec=0;simStart();toast('Simulando o trajeto','dark');}
function rideArrive(){speak('Você chegou ao destino.');rideStop(true);}
function rideStop(save_=true){if(!ride.on)return null;ride.on=false;cancelAnimationFrame(ride.simTimer);clearInterval(ride.tick);gps.listeners.delete(onPos);setTrack(ride.track);
  for(const k of ride.hexNew)S.hexes[k]=Date.now();
  if(!save_||ride.track.length<2){save();return null;}
  const car=activeCar();const r={id:'r'+Date.now(),t:ride.t0,mode:ride.mode,sec:Math.round(ride.sec),dist:Math.round(ride.dist),hex:ride.hexNew.length,taken:ride.hexTaken,track:simplify(ride.track),car:car&&car.model,dest:ride.dest&&ride.dest.name,sim:ride.sim};
  S.rides.unshift(r);if(r.taken)S.notifs.unshift({id:'n'+Date.now(),t:Date.now(),txt:`Você tomou ${r.taken} hex da Rosa Choque. Eles vão querer de volta.`,read:false});save();return r;}
function simplify(tr){if(tr.length<=300)return tr.map(p=>[+p[0].toFixed(5),+p[1].toFixed(5)]);const st=Math.ceil(tr.length/300);return tr.filter((_,i)=>i%st===0||i===tr.length-1).map(p=>[+p[0].toFixed(5),+p[1].toFixed(5)]);}
/* ================= UI util ================= */
let tt;function toast(t,cls=''){const e=$('#toast');e.className='toast '+cls;e.textContent=t;void e.offsetWidth;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2000);}
function sheet(html,onMount){const w=document.createElement('div');w.className='sheetwrap';w.innerHTML=`<div class="modal"><div class="grab"></div>${html}</div>`;w.addEventListener('click',e=>{if(e.target===w)w.remove();});$('#app').appendChild(w);onMount&&onMount(w,()=>w.remove());return w;}
const av=(t,s=40,bg='linear-gradient(135deg,#EFFF7A,#86C92A)')=>`<span class="av" style="width:${s}px;height:${s}px;background:${bg};font-size:${Math.round(s*.36)}px">${esc(t)}</span>`;
function trackSVG(tr,w=360,h=170,hexes){if(!tr||tr.length<2)return'';let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const P=tr.map(p=>[MX(p[0]),MY(p[1])]);P.forEach(([x,y])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);});
  const pad=40,sx=(w-2*pad)/Math.max(1,x1-x0),sy=(h-2*pad)/Math.max(1,y1-y0),s=Math.min(sx,sy),ox=(w-(x1-x0)*s)/2,oy=(h-(y1-y0)*s)/2;const T=([x,y])=>[(ox+(x-x0)*s).toFixed(1),(h-(oy+(y-y0)*s)).toFixed(1)];
  let hx='';if(hexes)for(const k of hexes){const poly=hexPoly(k).map(p=>T([MX(p[0]),MY(p[1])]).join(',')).join(' ');hx+=`<polygon points="${poly}" fill="rgba(214,255,80,0.22)" stroke="#C6F432" stroke-opacity=".8" stroke-width="1.2"/>`;}
  const d='M'+P.map(T).map(p=>p.join(' ')).join(' L');const a=T(P[0]),b=T(P[P.length-1]);
  let grid='';for(let i=0;i<12;i++){grid+=`<path d="M${i*36} 0 L${i*36-60} ${h}" stroke="#1d1e1b" stroke-width="6"/>`;}for(let i=0;i<6;i++){grid+=`<path d="M0 ${i*34} L${w} ${i*34+18}" stroke="#1d1e1b" stroke-width="5"/>`;}
  return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;background:#121311">${grid}${hx}<path d="${d}" fill="none" stroke="#C6F432" stroke-width="14" stroke-opacity=".25" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#DCFF4A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${a[0]}" cy="${a[1]}" r="6" fill="#0A0B0A" stroke="#C6F432" stroke-width="3"/><circle cx="${b[0]}" cy="${b[1]}" r="7" fill="#C6F432"/></svg>`;}
/* ================= router ================= */
const router={stack:[],cur:null,tab:'map',
  go(name,params={},opts={}){const sc=SCREENS[name];if(!sc)return;if(opts.root)this.stack=[];if(this.cur&&this.cur.leave)this.cur.leave();
    const node={name,params,...sc};this.stack.push(node);this.render(node,opts.root);},
  back(){if(this.stack.length<=1)return;const old=this.stack.pop();old.leave&&old.leave();this.render(this.stack[this.stack.length-1],true,true);},
  tabTo(t){this.tab=t;this.go(t,{}, {root:true});},
  render(node,isRoot,isBack){this.cur=node;const host=$('#screens');host.innerHTML='';const el=document.createElement('div');el.className='screen'+(node.clear?' clear':'')+(isRoot||isBack?' root':'');el.innerHTML=node.html(node.params);host.appendChild(el);node.el=el;
    $('#mapHost').style.visibility=node.clear?'visible':'hidden';
    const tb=$('#tabbar');tb.style.display=node.tabbar===false?'none':'flex';$$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.t===(node.tab||node.name)));
    el.addEventListener('click',e=>{const a=e.target.closest('[data-go],[data-back],[data-on]');if(!a)return;if(a.dataset.back!==undefined){this.back();return;}if(a.dataset.go){const p=a.dataset.p?JSON.parse(a.dataset.p):{};this.go(a.dataset.go,p);return;}if(a.dataset.on&&node.on&&node.on[a.dataset.on])node.on[a.dataset.on].call(node,a,e);});
    if(node.clear&&map)setTimeout(()=>map.resize(),0);
    node.mount&&node.mount(el,node.params);this.mapViewChanged=()=>node.mapReady&&node.mapReady();if(mapReady&&node.mapReady)node.mapReady();updateMe();}
};
/* ================= telas ================= */
const SCREENS={};
/* ---------- MAPA (home) ---------- */
SCREENS.map={clear:true,tab:'map',
 html(){const unread=S.notifs.filter(n=>!n.read).length;return`
  <div style="position:absolute;left:0;right:0;top:0;height:200px;background:linear-gradient(#0A0B0A 25%,rgba(10,11,10,0));pointer-events:none"></div>
  <div style="position:absolute;left:14px;right:14px;top:calc(14px + var(--safeT));display:flex;gap:10px">
    <button data-go="search" class="glasscard press" style="flex:1;height:52px;border-radius:18px;display:flex;align-items:center;gap:10px;padding:0 16px;color:var(--tx3);font-size:15px">${ic(I.search,18)}Para onde vamos?</button>
    <button data-go="notifs" class="ib glass" style="width:52px;height:52px" aria-label="Notificações">${ic(I.bell)}${unread?'<span class="dotn"></span>':''}</button>
  </div>
  <div class="chips" style="position:absolute;left:14px;right:0;top:calc(78px + var(--safeT))">
    <button class="chip lime" data-on="terr">${ic(I.hex,14)}Território</button><button class="chip" data-on="postos">${ic(I.pump,14)}Postos</button><button class="chip" data-on="me">${ic(I.loc,14)}Onde estou</button>
  </div>
  <div id="gpsWarn" class="glasscard" style="display:none;position:absolute;left:14px;right:14px;top:calc(128px + var(--safeT));padding:12px 14px;gap:10px;align-items:center;font-size:13px"><span style="flex:1">Ative a localização pra ver seu território. Sem ela, o app usa BH e o modo simulação.</span><button class="btn sm" data-on="askgps">Ativar</button></div>
  <div class="sheet glasscard" id="homeSheet">
    <div class="row"><div style="flex:1"><div class="small muted">Seu território por aqui</div><div style="font-size:22px;font-weight:800;margin-top:2px"><span id="hMine">0</span> <span class="small muted" style="font-weight:600">hex seus</span> · <span class="or" id="hRival">0</span> <span class="small muted" style="font-weight:600">da Rosa Choque</span></div></div></div>
    <div class="muted" style="font-size:14px;margin-top:8px;line-height:1.4">Rode por hexágonos vazios ou rivais pra pintar de lima. Velocidade não conta: só caminho.</div>
    <div class="row" style="margin-top:14px;gap:10px"><button class="btn sec" data-go="search" style="flex:1">${ic(I.route,18)}Ir pra um lugar</button><button class="btn" data-go="startRide" style="flex:1">Começar rolê</button></div>
  </div>`;},
 mount(){startGPS();if(!gps.pos&&gps.denied)$('#gpsWarn').style.display='flex';if(ride.on){router.go(ride.mode==='nav'?'nav':'rec',{}, {root:true});}},
 mapReady(){setHexMode('normal');setRoute([]);setTrack([]);placeCar(gps.pos||S.lastPos||DEFAULT_CENTER,true);map.setPadding({top:120,bottom:240,left:0,right:0});
   const p=gps.pos||S.lastPos||DEFAULT_CENTER;map.easeTo({center:p,zoom:15.4,pitch:45,bearing:0,duration:700});refreshHexes();this.count();
   this.posL=pp=>{if(carMarker)carMarker.setLngLat(pp);};gps.listeners.add(this.posL);
   this.mv=()=>this.count();map.on('moveend',this.mv);},
 count(){if(!mapReady)return;const keys=hexesAround(map.getCenter().toArray(),14);let m=0,r=0;keys.forEach(k=>{const o=owner(k);if(o==='mine')m++;else if(o==='rival')r++;});const a=$('#hMine'),b=$('#hRival');if(a){a.textContent=m;b.textContent=r;}},
 leave(){gps.listeners.delete(this.posL);map&&this.mv&&map.off('moveend',this.mv);stationMarkers.forEach(m=>m.remove());stationMarkers=[];},
 on:{terr(a){a.classList.toggle('lime');const on=a.classList.contains('lime');map.setLayoutProperty('hex-fill','visibility',on?'visible':'none');map.setLayoutProperty('hex-line','visibility',on?'visible':'none');},
  me(){const p=gps.pos||S.lastPos;if(!p){toast('Sem localização ainda','dark');startGPS();return;}map.easeTo({center:p,zoom:16,duration:600});},
  askgps(){startGPS();toast('Aceite o pedido de localização do navegador','dark');},
  async postos(a){if(a.classList.contains('lime')){a.classList.remove('lime');stationMarkers.forEach(m=>m.remove());stationMarkers=[];return;}a.classList.add('lime');toast('Buscando postos perto…','dark');
   const c=map.getCenter();try{const q=`[out:json][timeout:15];(node(around:2500,${c.lat},${c.lng})[amenity=fuel];way(around:2500,${c.lat},${c.lng})[amenity=fuel];);out center 25;`;const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q)});const j=await r.json();
    const st=j.elements.map(e=>({id:e.id,name:(e.tags&&(e.tags.name||e.tags.brand))||'Posto',p:[e.lon||e.center.lon,e.lat||e.center.lat]})).map(s=>({...s,price:(S.prices&&S.prices[s.id])||+(5.69+hsh(String(s.id))*.6).toFixed(2)})).sort((x,y)=>x.price-y.price);
    if(!st.length){toast('Nenhum posto encontrado aqui','dark');return;}
    st.slice(0,12).forEach((s,i)=>{const el=document.createElement('div');el.className='pin'+(i===0?' best':'');el.innerHTML=`<div class="p">${i===0?'<small>mais barato</small>':''}${s.price.toFixed(2).replace('.',',')}</div>`;el.style.cursor='pointer';el.onclick=()=>stationSheet(s);stationMarkers.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(s.p).addTo(map));});
    toast(`Gasolina mais barata: R$ ${st[0].price.toFixed(2).replace('.',',')} · ${st[0].name}`);}catch(e){toast('Não deu pra carregar os postos agora','dark');a.classList.remove('lime');}}}};
function stationSheet(s){sheet(`<div style="font-size:20px;font-weight:800">${esc(s.name)}</div><div class="muted small" style="margin-top:2px">Preço da gasolina enviado pela comunidade</div>
  <div class="row" style="margin-top:14px"><div style="font-size:34px;font-weight:800" class="lime">R$ ${s.price.toFixed(2).replace('.',',')}</div></div>
  <label class="f">Viu outro preço? Atualize (ganha +1 hex)</label><input class="inp" id="pr" inputmode="decimal" placeholder="Ex.: 5,79">
  <div class="row" style="margin-top:14px;gap:10px"><button class="btn sec" id="go" style="flex:1">${ic(I.route,18)}Ir até lá</button><button class="btn" id="ok" style="flex:1">Enviar preço</button></div>`,(w,close)=>{
  $('#ok',w).onclick=()=>{const v=parseFloat(($('#pr',w).value||'').replace(',','.'));if(!(v>3&&v<12)){toast('Preço inválido','dark');return;}S.prices=S.prices||{};S.prices[s.id]=v;S.priceCount=(S.priceCount||0)+1;save();close();toast('Valeu! Preço atualizado · +1 hex');};
  $('#go',w).onclick=()=>{close();router.go('preview',{dest:{name:s.name,addr:'Posto',p:s.p}});};});}
/* ---------- BUSCA ---------- */
SCREENS.search={tabbar:false,
 html(){return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><input id="q" class="inp" placeholder="Rua, bairro, lugar…" autocomplete="off" style="flex:1"></div>
  <div class="scroll" id="res"><div class="sec-t">Sugestões</div><div class="list" id="sug"></div></div>`;},
 mount(el){const q=$('#q',el);setTimeout(()=>q.focus(),200);const near=gps.pos||S.lastPos||DEFAULT_CENTER;
  const sug=[{name:'Posto mais barato perto',addr:'Abastecer no caminho',special:'fuel'},...(S.recent||[]).slice(0,5)];
  const draw=(items,host)=>{host.innerHTML=items.map((x,i)=>`<button class="row press" data-i="${i}" style="width:100%;text-align:left;padding:13px 4px"><span class="ib" style="width:40px;height:40px">${ic(x.special?I.pump:I.flag,18)}</span><div style="flex:1;min-width:0"><div class="b" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.name)}</div><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.addr||'')}${x.p?' · '+fmtD(dist(near,x.p)):''}</div></div></button>`).join('')||'<div class="empty">Nada encontrado</div>';
    $$('[data-i]',host).forEach(b=>b.onclick=()=>{const x=items[+b.dataset.i];if(x.special){router.back();setTimeout(()=>$('[data-on="postos"]')&&$('[data-on="postos"]').click(),300);return;}S.recent=[x,...(S.recent||[]).filter(r=>r.name!==x.name)].slice(0,8);save();router.go('preview',{dest:x});});};
  draw(sug,$('#sug',el));let tm;q.addEventListener('input',()=>{clearTimeout(tm);const v=q.value.trim();if(v.length<3){$('#res',el).innerHTML='<div class="sec-t">Sugestões</div><div class="list" id="sug"></div>';draw(sug,$('#sug',el));return;}
   tm=setTimeout(async()=>{$('#res',el).innerHTML='<div class="empty">Buscando…</div>';try{const r=await geocode(v,near);$('#res',el).innerHTML='<div class="list" id="rl"></div>';draw(r,$('#rl',el));}catch(e){$('#res',el).innerHTML='<div class="empty">Sem conexão com a busca agora</div>';}},450);});}};
/* ---------- PRÉVIA DA ROTA ---------- */
SCREENS.preview={clear:true,tabbar:false,
 html(p){return`<div style="position:absolute;left:14px;right:14px;top:calc(14px + var(--safeT));display:flex;gap:10px"><button class="ib glass" data-back>${ic(I.back)}</button><div class="glasscard" style="flex:1;height:44px;border-radius:15px;display:flex;align-items:center;padding:0 14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.dest.name)}</div></div>
  <div class="sheet glasscard" style="bottom:calc(14px + var(--safeB))"><div class="small muted">Rota até ${esc(p.dest.name)}</div><div class="row" style="margin-top:4px"><div style="font-size:30px;font-weight:800" class="lime" id="pvT">…</div><div class="muted" id="pvD" style="font-size:15px"></div></div>
   <div class="row small" style="margin-top:10px;gap:14px"><span id="pvH" class="b"></span><span id="pvR" class="or b"></span></div>
   <div class="row" style="margin-top:14px;gap:10px"><button class="btn sec" data-back style="flex:1">Cancelar</button><button class="btn" id="goBtn" data-on="go" style="flex:2" disabled>Iniciar navegação</button></div></div>`;},
 async mapReady(){setHexMode('normal');setTrack([]);const a=gps.pos||S.lastPos||DEFAULT_CENTER,b=this.params.dest.p;placeCar(a);
   if(destMarker)destMarker.remove();const el=document.createElement('div');el.className='pin';el.innerHTML=`<div class="p">${ic(I.flag,14)}${esc(this.params.dest.name).slice(0,24)}</div>`;destMarker=new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(b).addTo(map);
   let rt;try{rt=await osrm(a,b);}catch(e){rt=straightRoute(a,b);}if(router.cur!==this)return;this.rt=rt;setRoute(rt.coords);
   const bb=new maplibregl.LngLatBounds();rt.coords.forEach(c=>bb.extend(c));map.setPadding({top:0,bottom:0,left:0,right:0});map.fitBounds(bb,{padding:{top:110,bottom:260,left:50,right:50},pitch:30,bearing:0,duration:900,maxZoom:16.5});
   const ks=new Set();for(let i=0;i<rt.coords.length;i++)ks.add(hexKey(rt.coords[i]));let nw=0,rv=0;ks.forEach(k=>{const o=owner(k);if(o!=='mine')nw++;if(o==='rival')rv++;});
   const eta=new Date(Date.now()+rt.dur*1000);$('#pvT').textContent=Math.max(1,Math.round(rt.dur/60))+' min';$('#pvD').textContent=`${fmtD(rt.dist)} · chega ${hhmm(eta)}`;$('#pvH').innerHTML=`<span class="lime">+${nw} hex</span> no caminho`;$('#pvR').textContent=rv?`${rv} da Rosa Choque`:'';$('#goBtn').disabled=false;if(rt.approx)toast('Rota aproximada (sem conexão com o roteador)','dark');},
 leave(){if(destMarker){destMarker.remove();destMarker=null;}},
 on:{go(){if(!this.rt)return;rideStart('nav',this.rt,this.params.dest);router.go('nav',{}, {root:true});}}};
/* ---------- NAVEGAÇÃO ---------- */
SCREENS.nav={clear:true,tabbar:false,
 html(){return`<div style="position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(#0A0B0A 30%,rgba(10,11,10,0));pointer-events:none"></div>
  <div class="navcard glasscard"><div class="row" style="gap:14px"><div class="navarrow" id="nArrow">${ic(ARROW.straight,30,2.6)}</div><div style="flex:1;min-width:0"><div class="navbig" id="nDist">—</div><div id="nInstr" style="font-size:15px;color:#D6D6D3;margin-top:4px">Calculando…</div></div></div>
   <div style="height:1px;background:var(--line);margin:12px 0 8px"></div><div class="row small muted"><span id="nNext" style="flex:1">&nbsp;</span><span id="nSrc" class="badge" style="background:rgba(255,255,255,.08)"></span></div></div>
  <div style="position:absolute;left:14px;top:calc(176px + var(--safeT))"><button class="chip" data-on="simnow" id="simChip" style="${ride.sim?'display:none':''}">${ic(I.play,13)}Simular trajeto</button></div>
  <div id="rivalChip" style="position:absolute;left:0;right:0;top:calc(170px + var(--safeT));display:flex;justify-content:center;opacity:0;transition:.4s;pointer-events:none"><div class="chip" style="border-color:rgba(255,106,61,.5);background:rgba(255,106,61,.16);color:#FFD6C8"><span style="width:7px;height:7px;border-radius:9px;background:#FF6A3D"></span>Território da Rosa Choque</div></div>
  <div style="position:absolute;right:12px;top:calc(220px + var(--safeT));display:flex;flex-direction:column;gap:10px"><button class="ib glass" data-on="voice" id="vBtn" style="width:46px;height:46px">${ic(S.settings.voice?I.vol:I.mute,19)}</button><button class="ib glass" data-on="recenter" style="width:46px;height:46px">${ic(I.loc,18)}</button></div>
  <div style="position:absolute;left:14px;bottom:calc(130px + var(--safeB))" class="speed"><b id="nSpd">0</b><span>km/h</span></div>
  <div class="hud glasscard"><div class="row"><div style="flex:1"><div class="row" style="gap:10px;align-items:baseline"><span style="font-size:28px;font-weight:800" class="lime" id="nEta">—</span><span id="nRest" class="muted" style="font-size:15px"></span></div>
   <div class="row" style="margin-top:10px;gap:8px"><div style="flex:1;height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden"><div id="nProg" style="height:4px;width:0;background:linear-gradient(90deg,#EFFF7A,#C6F432)"></div></div><span class="small b" id="nHex">+0 hex</span></div></div>
   <button data-on="end" style="width:54px;height:54px;border-radius:99px;background:rgba(255,79,120,.16);border:1px solid rgba(255,79,120,.45);color:#FF8A9B;display:flex;align-items:center;justify-content:center" aria-label="Encerrar">${ic(I.x,20,2.6)}</button></div></div>`;},
 mapReady(){setHexMode('normal');if(ride.route)setRoute(ride.route.coords);placeCar(ride.last||(ride.route&&ride.route.coords[0])||S.lastPos||DEFAULT_CENTER);map.setPadding({top:330,bottom:40,left:0,right:0});this.follow=true;this.bear=0;$('#nSrc').textContent=ride.sim?'simulação':'GPS';
   map.on('dragstart',this.ds=()=>{this.follow=false;});if(ride.last)this.onPos(ride.last);},
 leave(){map&&this.ds&&map.off('dragstart',this.ds);},
 onPos(p){if(!ride.route)return;const rt=ride.route;
   // progresso: ponto mais próximo da rota (janela)
   let best=ride.navIdx||0,bd=1e12;for(let i=Math.max(0,(ride.navIdx||0)-5);i<Math.min(rt.coords.length,(ride.navIdx||0)+60);i++){const d=dist(rt.coords[i],p);if(d<bd){bd=d;best=i;}}ride.navIdx=best;const done=rt.cum[best]+0;
   const nx=rt.steps.find(s=>s.at>done+8&&s.type!=='depart');const nn=nx?rt.steps[rt.steps.indexOf(nx)+1]:null;const toN=nx?nx.at-done:rt.total-done;
   $('#nDist').textContent=fmtD(toN);$('#nInstr').textContent=instr(nx);$('#nNext').textContent=nn?'Depois: '+instr(nn).toLowerCase():'';$('#nArrow').innerHTML=ic(arrowOf(nx),30,2.6);
   if(nx){const key=rt.steps.indexOf(nx);if(toN<160&&!ride.announced[key]){ride.announced[key]=1;speak(`Em ${fmtD(toN).replace(' m',' metros')}, ${instr(nx).toLowerCase()}`);}}
   const rem=rt.total-done,v=Math.max(ride.speed||0,3);$('#nEta').textContent=Math.max(1,Math.round(rem/8.3/60))+' min';$('#nRest').textContent=`${fmtD(rem)} · ${hhmm(new Date(Date.now()+rem/8.3*1000))}`;$('#nProg').style.width=(done/rt.total*100).toFixed(1)+'%';$('#nHex').textContent=`+${ride.hexNew.length} hex`;$('#nSpd').textContent=Math.round((ride.speed||0)*3.6);
   const o=owner(hexKey(p));$('#rivalChip').style.opacity=o==='rival'?1:0;
   placeCar(p);const b=ride.heading??brg(p,alongRoute(rt,done+30));let diff=((b-this.bear+540)%360)-180;this.bear=(this.bear+diff*.15+360)%360;setArrowRot(b);
   if(this.follow)map.jumpTo({center:p,bearing:this.bear,zoom:17.3,pitch:62});},
 on:{simnow(a){goSim();a.style.display='none';$('#nSrc').textContent='simulação';},end(){const r=rideStop(true);r?router.go('summary',{id:r.id},{root:true}):router.tabTo('map');},
  voice(a){S.settings.voice=!S.settings.voice;save();a.innerHTML=ic(S.settings.voice?I.vol:I.mute,19);toast(S.settings.voice?'Voz ligada':'Voz desligada','dark');},
  recenter(){this.follow=true;toast('Seguindo o carro','dark');}}};
/* ---------- NOVO ROLÊ ---------- */
SCREENS.startRide={tab:'startRide',
 html(){const c=activeCar();const m=[['terr','Território','Desbloqueie a cidade, um hexágono por vez',I.hex],['nav','Ir pra um lugar','GPS com rota, voz e hex no caminho',I.route],['free','Rolê livre','Só gravar o trajeto e o consumo',I.flag]];
  return`<div class="hdr hexbg"><h1>Novo rolê</h1></div><div class="scroll hexbg" style="padding-top:0">
   <div class="muted" style="margin:-4px 4px 14px;font-size:15px">Escolha como você vai rodar</div>
   <div style="display:grid;gap:10px">${m.map((x,i)=>`<button class="card press" data-on="mode" data-m="${x[0]}" style="text-align:left;display:flex;gap:14px;align-items:center;${i===0?'border:1.5px solid var(--lime);background:rgba(198,244,50,.08)':''}"><span class="ib" style="width:46px;height:46px;border-radius:14px;color:var(--lime2)">${ic(x[3],22)}</span><div style="flex:1"><div class="b" style="font-size:16px">${x[1]}</div><div class="small muted">${x[2]}</div></div></button>`).join('')}</div>
   <div class="card row" style="margin-top:14px" data-go="garage"><div style="width:76px;height:50px;border-radius:12px;background:#161714;display:flex;align-items:center;justify-content:center;overflow:hidden">${c&&c.front?`<img src="${c.front}" style="max-width:72px;max-height:48px">`:ic(I.car,22)}</div><div style="flex:1"><div class="small muted">Veículo</div><div class="b">${esc(c?c.model+' · '+c.year:'Cadastre seu carro')}</div></div><span class="small lime b">Trocar</span></div>
   <div class="card" style="margin-top:12px"><div class="row" data-on="sim"><div style="flex:1"><div class="b">Modo simulação</div><div class="small muted">Testar parado: o carro anda sozinho numa rota perto de você</div></div><span class="switch ${S.settings.simulate?'on':''}" id="simSw"></span></div>
    <div style="height:1px;background:var(--line);margin:12px 0"></div><div class="row" data-on="voice"><div style="flex:1"><div class="b">Avisos por voz</div><div class="small muted">Hexágonos e curvas</div></div><span class="switch ${S.settings.voice?'on':''}" id="vSw"></span></div></div>
   <button class="btn" data-on="start" style="margin-top:18px;height:58px">Começar rolê</button>
   <div class="small" style="text-align:center;color:var(--tx4);margin-top:10px">Celular no suporte. Não mexa no app dirigindo.</div></div>`;},
 mount(){this.mode='terr';startGPS();},
 on:{mode(a){$$('[data-on="mode"]').forEach(b=>{const on=b===a;b.style.border=on?'1.5px solid var(--lime)':'';b.style.background=on?'rgba(198,244,50,.08)':'';});this.mode=a.dataset.m;},
  sim(){S.settings.simulate=!S.settings.simulate;save();$('#simSw').classList.toggle('on',S.settings.simulate);},
  voice(){S.settings.voice=!S.settings.voice;save();$('#vSw').classList.toggle('on',S.settings.voice);},
  start(){if(this.mode==='nav'){router.go('search');return;}if(!gps.pos&&!S.settings.simulate)toast('Sem GPS ainda: vou simular o rolê','dark');rideStart(this.mode,null,null);router.go('rec',{}, {root:true});}}};
/* ---------- GRAVANDO (território / livre) ---------- */
SCREENS.rec={clear:true,tabbar:false,
 html(){const fog=ride.mode==='terr';return`<div style="position:absolute;left:0;right:0;top:0;height:240px;background:linear-gradient(#0A0B0A 35%,rgba(10,11,10,0));pointer-events:none"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:280px;background:linear-gradient(rgba(10,11,10,0),#0A0B0A 70%);pointer-events:none"></div>
  <div style="position:absolute;left:16px;right:16px;top:calc(14px + var(--safeT));display:flex;justify-content:space-between"><span class="chip lime"><span style="width:8px;height:8px;border-radius:9px;background:var(--lime);box-shadow:0 0 10px var(--lime)"></span>${fog?'Território':'Rolê livre'}</span><span style="display:flex;gap:8px"><button class="chip" data-on="simnow" id="simChip" style="${ride.sim?'display:none':''}">${ic(I.play,13)}Simular trajeto</button><span class="chip" id="rSrc">${ride.sim?'simulação':'GPS'}</span></span></div>
  <div style="position:absolute;left:20px;right:20px;top:calc(62px + var(--safeT));display:flex;align-items:flex-end;justify-content:space-between"><div><div class="big" id="rHex">+0</div><div class="b" style="margin-top:6px">hexágonos neste rolê</div></div>
   <div style="text-align:right"><div style="font-size:26px;font-weight:800"><span id="rKm">0,0</span> <span class="small muted">km</span></div><div style="font-size:26px;font-weight:800" id="rT">0:00</div></div></div>
  <div class="hud glasscard" style="padding:14px 22px"><div class="row" style="justify-content:space-between"><div class="speed" style="background:none;border:none"><b id="rSpd">0</b><span>km/h</span></div>
   <div class="ring" id="hold"><svg width="80" height="80" viewBox="0 0 80 80"><circle id="holdC" cx="40" cy="40" r="38" fill="none" stroke="#C6F432" stroke-width="3" stroke-linecap="round" stroke-dasharray="239" stroke-dashoffset="239" transform="rotate(-90 40 40)"/></svg><i></i></div>
   <button data-on="recenter" class="speed" style="background:none;border:none;color:var(--tx2)">${ic(I.loc,20)}<span style="margin-top:4px">centrar</span></button></div>
   <div class="small" style="text-align:center;color:var(--tx4);margin-top:8px">Segure o botão pra encerrar</div></div>`;},
 mapReady(){setHexMode(ride.mode==='terr'?'fog':'normal');setRoute([]);setTrack(ride.track);placeCar(ride.last||gps.pos||S.lastPos||DEFAULT_CENTER);map.setPadding({top:260,bottom:200,left:0,right:0});this.follow=true;refreshHexes();
   map.on('dragstart',this.ds=()=>{this.follow=false;});if(ride.last)this.onPos(ride.last);},
 mount(el){const h=$('#hold',el),c=$('#holdC',el);let t0,raf;const up=()=>{cancelAnimationFrame(raf);c.style.transition='stroke-dashoffset .2s';c.setAttribute('stroke-dashoffset',239);};
   h.addEventListener('pointerdown',e=>{e.preventDefault();t0=performance.now();c.style.transition='none';const f=now=>{const k=Math.min(1,(now-t0)/900);c.setAttribute('stroke-dashoffset',239*(1-k));if(k>=1){navigator.vibrate&&navigator.vibrate(60);const r=rideStop(true);r?router.go('summary',{id:r.id},{root:true}):(toast('Rolê muito curto, não salvei','dark'),router.tabTo('map'));return;}raf=requestAnimationFrame(f);};raf=requestAnimationFrame(f);});
   ['pointerup','pointerleave','pointercancel'].forEach(x=>h.addEventListener(x,up));},
 leave(){map&&this.ds&&map.off('dragstart',this.ds);},
 onTick(){$('#rT')&&($('#rT').textContent=fmtT(ride.sec));},
 onPos(p){$('#rHex').textContent='+'+ride.hexNew.length;$('#rKm').textContent=fmtKm(ride.dist);$('#rSpd').textContent=Math.round((ride.speed||0)*3.6);placeCar(p);if(ride.heading!=null)setArrowRot(ride.heading);if(this.follow)map.jumpTo({center:p,zoom:16.3,pitch:38,bearing:0});},
 on:{simnow(a){goSim();a.style.display='none';$('#rSrc').textContent='simulação';},recenter(){this.follow=true;}}};
/* ---------- RESUMO ---------- */
SCREENS.summary={tabbar:false,
 html(p){const r=S.rides.find(x=>x.id===p.id);if(!r)return'<div class="empty">Rolê não encontrado</div>';const kml=activeCar()&&activeCar().kml;const posted=S.posts.some(x=>x.ride===r.id);
  return`<div class="hdr hexbg"><div style="flex:1"><h1>Rolê concluído</h1><div class="small muted">${new Date(r.t).toLocaleDateString('pt-BR',{weekday:'long'})} · ${hhmm(new Date(r.t))} · ${esc(r.car||'')}${r.sim?' · simulado':''}</div></div><button class="ib" data-on="close">${ic(I.x)}</button></div>
  <div class="scroll hexbg" style="padding-top:0"><div class="card" style="padding:0;overflow:hidden"><div style="height:230px;position:relative">${trackSVG(r.track,360,230,Object.keys(S.hexes).filter(k=>S.hexes[k]>=r.t))}<div style="position:absolute;left:14px;top:12px;font-weight:800;font-size:13px">rolê</div></div>
   <div style="padding:14px"><div class="row"><div class="big" style="font-size:64px">+${r.hex}</div><div><div class="b">hexágonos</div><div class="small muted">${r.taken?`${r.taken} tomados da Rosa Choque`:'território novo'}</div></div></div></div></div>
   <div class="card stat3" style="margin-top:12px;padding:14px 0"><div><b>${fmtKm(r.dist)}</b><span>km</span></div><div><b>${fmtT(r.sec)}</b><span>tempo</span></div><div><b>${r.sec?Math.round(r.dist/r.sec*3.6):0}</b><span>km/h média</span></div></div>
   <div class="card row" style="margin-top:12px">${ic(I.pump,20)}<div style="flex:1;font-size:14px" class="muted">Consumo estimado: <b style="color:var(--tx)">${kml?(r.dist/1000/kml).toFixed(2).replace('.',','):'—'} L</b> com ${kml?String(kml).replace('.',','):'—'} km/l</div></div>
   <button class="btn" data-on="post" style="margin-top:16px" ${posted?'disabled style="margin-top:16px;opacity:.5"':''}>${posted?'Já está no feed':'Postar na comunidade'}</button>
   <button class="btn sec" data-on="share" style="margin-top:10px">${ic(I.share,18)}Compartilhar</button></div>`;},
 on:{close(){router.tabTo('map');},post(a){const r=S.rides.find(x=>x.id===this.params.id);S.posts.unshift({id:'p'+Date.now(),t:Date.now(),ride:r.id,txt:r.dest?`Rolê até ${r.dest}`:'Rolê pela cidade',horn:0,me:true,cmts:[]});save();a.textContent='Postado!';a.disabled=true;a.style.opacity=.5;toast('Postado na comunidade');},
  async share(){const r=S.rides.find(x=>x.id===this.params.id);const txt=`Fiz +${r.hex} hex e ${fmtKm(r.dist)} km no Rolê`;try{if(navigator.share)await navigator.share({title:'Rolê',text:txt,url:location.href.split('#')[0]});else{await navigator.clipboard.writeText(txt);toast('Texto copiado');}}catch(e){}}}};
/* ---------- COMUNIDADE (parte 3 virá completa) ---------- */
const FAKE=[{h:'lia.m',n:'Lia Moraes',crew:'Rosa Choque',g:'linear-gradient(135deg,#FFC2E8,#E0559E)',hex:41,km:318},{h:'duka',n:'Eduardo',crew:'Turbo Clan',g:'linear-gradient(135deg,#9CF0D0,#2FB38A)',hex:36,km:204},{h:'rafa_cg',n:'Rafa',crew:'',g:'linear-gradient(135deg,#FFB08A,#FF6A3D)',hex:33,km:150},{h:'paulão',n:'Paulo',crew:'Moto Norte',g:'linear-gradient(135deg,#E2E3DE,#8C8E88)',hex:29,km:480}];
SCREENS.feed={tab:'feed',
 html(){const mine=S.posts;const fake=[{f:FAKE[0],txt:'Serra no fim de tarde, 9 hex novos pra Rosa',hex:9,km:112,t:Date.now()-2*3600e3,horn:248,cm:31},{f:FAKE[2],txt:'Editei o Gol com IA, ficou brabo',img:'p-front-ai.webp',t:Date.now()-5*3600e3,horn:97,cm:12}];
  const card=(who,txt,body,horn,cm,t,id,on)=>`<div class="card post"><div class="row">${av((who.n.split(' ').map(w=>w[0]).join('').slice(0,2)||who.h.slice(0,2)).toUpperCase(),38,who.g)}<div style="flex:1"><div class="b" style="font-size:14px">${esc(who.n)} ${who.crew?`<span class="${who.crew==='Rosa Choque'?'or':'muted'}" style="font-weight:600">· ${esc(who.crew)}</span>`:''}</div><div class="small muted">${ago(t)}</div></div></div>${body}<div style="margin-top:10px;font-size:14px">${esc(txt)}</div><div class="acts"><button data-on="horn" data-id="${id}" class="${on?'on':''}">${ic(I.horn,18)}<span>${horn}</span> buzinas</button><button>${ic(I.cmt,17)}${cm}</button></div></div>`;
  const meW={h:S.me.handle,n:S.me.name,crew:S.me.crew,g:'linear-gradient(135deg,#EFFF7A,#86C92A)'};
  return`<div class="hdr"><h1>Comunidade</h1><button class="ib" data-go="notifs">${ic(I.bell)}</button></div><div class="scroll">
   ${mine.map(p=>{const r=S.rides.find(x=>x.id===p.ride);return card(meW,p.txt,r?`<div class="postmap">${trackSVG(r.track,360,170)}</div><div class="row small" style="margin-top:8px;gap:14px"><b class="lime">+${r.hex} hex</b><span>${fmtKm(r.dist)} km</span><span>${fmtT(r.sec)}</span></div>`:'',p.horn,p.cmts.length,p.t,p.id,p.hornOn);}).join('')}
   ${fake.map((p,i)=>card(p.f,p.txt,p.img?`<div class="postmap" style="background:radial-gradient(80% 70% at 50% 80%,#2B3519,#141512)"><img src="${p.img}" style="object-fit:contain"></div>`:`<div class="postmap">${trackSVG(demoTrack(i),360,170)}</div><div class="row small" style="margin-top:8px;gap:14px"><b class="lime">+${p.hex} hex</b><span>${p.km} km</span></div>`,p.horn+((S.fakeHorn||{})['f'+i]?1:0),p.cm,p.t,'f'+i,(S.fakeHorn||{})['f'+i])).join('')}
   <div class="empty small">Feed completo, perfis e ranking chegam na parte 3.</div></div>`;},
 on:{horn(a){const id=a.dataset.id;const n=a.querySelector('span');const on=!a.classList.contains('on');a.classList.toggle('on',on);n.textContent=+n.textContent+(on?1:-1);
  if(id[0]==='f'){S.fakeHorn=S.fakeHorn||{};S.fakeHorn[id]=on;}else{const p=S.posts.find(x=>x.id===id);p.hornOn=on;p.horn+=on?1:-1;}save();}}};
function ago(t){const s=(Date.now()-t)/1000;if(s<60)return'agora';if(s<3600)return`há ${Math.round(s/60)} min`;if(s<86400)return`há ${Math.round(s/3600)} h`;return`há ${Math.round(s/86400)} d`;}
function demoTrack(i){const o=[-43.94+i*.01,-19.93];const t=[];let x=o[0],y=o[1];for(let k=0;k<40;k++){x+=(k%10<5?.0012:.0002)*(i?1:-1);y+=(k%10<5?.0002:.0012);t.push([x,y]);}return t;}
SCREENS.notifs={tabbar:false,
 html(){S.notifs.forEach(n=>n.read=true);save();return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Notificações</h2></div><div class="scroll"><div class="list">${S.notifs.map(n=>`<div class="row" style="padding:14px 4px;align-items:flex-start"><span class="ib" style="width:40px;height:40px;color:var(--lime2)">${ic(I.hex,18)}</span><div style="flex:1"><div style="font-size:14px;line-height:1.4">${esc(n.txt)}</div><div class="small muted" style="margin-top:2px">${ago(n.t)}</div></div></div>`).join('')}</div></div>`;}};
/* ---------- GARAGEM (parte 2 virá completa) ---------- */
SCREENS.garage={tab:'garage',
 html(){const c=activeCar();return`<div class="hdr"><h1>Garagem</h1></div><div class="scroll">
  <div class="plat">${c&&c.front?`<img src="${c.front}">`:''}</div>
  <div style="margin:10px 4px 0"><div class="small muted">${esc(c?c.year:'')}</div><div style="font-size:34px;font-weight:800;letter-spacing:-.8px">${esc(c?c.model:'')}</div></div>
  <div class="card stat3" style="margin-top:14px;padding:14px 0"><div><b>${c?String(c.kml).replace('.',','):'—'}</b><span>km/l real</span></div><div><b>${fmtKm(S.rides.reduce((a,r)=>a+r.dist,0))}</b><span>km no Rolê</span></div><div><b>${S.rides.length}</b><span>rolês</span></div></div>
  <div class="sec-t">Seu carro no mapa</div>
  <div class="card list">${[['photo','Foto da traseira','Seu carro de verdade no mapa'],['arrow','Seta padrão','Simples, vem pronta']].map(x=>`<div class="row" data-on="marker" data-m="${x[0]}" style="padding:10px 0"><div style="flex:1"><div class="b">${x[1]}</div><div class="small muted">${x[2]}</div></div><span class="switch ${S.settings.marker===x[0]?'on':''}"></span></div>`).join('')}</div>
  <div class="empty small">Cadastro do seu carro com foto, recorte e edição com IA chegam na parte 2.</div></div>`;},
 on:{marker(a){S.settings.marker=a.dataset.m;save();$$('[data-on="marker"] .switch').forEach(s=>s.classList.toggle('on',s.parentElement===a));rebuildCar();toast(a.dataset.m==='arrow'?'Seta no mapa':'Foto da traseira no mapa');}}};
/* ---------- PERFIL ---------- */
SCREENS.profile={tab:'profile',
 html(){const tot=S.rides.reduce((a,r)=>a+r.dist,0);const nh=Object.keys(S.hexes).length;return`<div class="hdr hexbg"><h1>Perfil</h1><button class="ib" data-on="settings">${ic(I.gear)}</button></div><div class="scroll hexbg" style="padding-top:0">
  <div class="row" style="margin:6px 4px 0">${av('JU',64)}<div><div style="font-size:28px;font-weight:800">${esc(S.me.name)}</div><div class="small"><span class="lime b">${esc(S.me.crew)}</span> <span class="muted">· nível ${S.me.level}</span></div></div></div>
  <div class="card stat3" style="margin-top:16px;padding:14px 0"><div><b class="lime">${nh}</b><span>hexágonos</span></div><div><b>${S.rides.length}</b><span>rolês</span></div><div><b>${fmtKm(tot)}</b><span>km</span></div></div>
  <div class="sec-t">Seus rolês</div>${S.rides.length?S.rides.map(r=>`<button class="card row press" data-go="summary" data-p='${JSON.stringify({id:r.id})}' style="width:100%;text-align:left;margin-bottom:8px;padding:8px"><div style="width:62px;height:62px;border-radius:14px;overflow:hidden;flex-shrink:0">${trackSVG(r.track,62,62)}</div><div style="flex:1"><div class="b">${esc(r.dest?'Até '+r.dest:r.mode==='terr'?'Território':'Rolê livre')}</div><div class="small muted">${new Date(r.t).toLocaleDateString('pt-BR')} · ${fmtKm(r.dist)} km · ${fmtT(r.sec)}</div></div><span class="lime b small" style="padding-right:8px">+${r.hex} hex</span></button>`).join(''):'<div class="card empty">Nenhum rolê ainda. Toque no + pra começar.</div>'}
  </div>`;},
 on:{settings(){sheet(`<div style="font-size:20px;font-weight:800;margin-bottom:6px">Ajustes</div>
   <div class="row" style="padding:12px 0" id="s1"><div style="flex:1"><div class="b">Modo simulação</div><div class="small muted">O carro anda sozinho, pra testar parado</div></div><span class="switch ${S.settings.simulate?'on':''}"></span></div>
   <div class="row" style="padding:12px 0" id="s2"><div style="flex:1"><div class="b">Avisos por voz</div></div><span class="switch ${S.settings.voice?'on':''}"></span></div>
   <button class="btn danger" id="rs" style="margin-top:12px">Apagar meus dados do protótipo</button>`,(w,close)=>{
   $('#s1',w).onclick=()=>{S.settings.simulate=!S.settings.simulate;save();$('#s1 .switch',w).classList.toggle('on');};
   $('#s2',w).onclick=()=>{S.settings.voice=!S.settings.voice;save();$('#s2 .switch',w).classList.toggle('on');};
   $('#rs',w).onclick=()=>{if(confirm('Apagar rolês, hexágonos e ajustes?')){localStorage.removeItem(KEY);location.reload();}};});}}};
/* ================= boot ================= */
function boot(){
  $('#app').innerHTML=`<div id="mapHost"><div id="map"></div></div><div id="screens"></div>
   <nav class="tabbar" id="tabbar"><button data-t="map" aria-label="Mapa">${ic(I.map,22,1.8)}</button><button data-t="feed" aria-label="Comunidade">${ic(I.people,22,1.8)}</button><button data-t="startRide" class="plus" aria-label="Novo rolê">${ic(I.plus,24,2.4)}</button><button data-t="garage" aria-label="Garagem">${ic(I.car,22,1.8)}</button><button data-t="profile" aria-label="Perfil">${ic(I.user,22,1.8)}</button></nav><div id="toast" class="toast"></div>`;
  $$('#tabbar button').forEach(b=>b.onclick=()=>{if(ride.on&&b.dataset.t!=='map'){toast('Encerre o rolê antes','dark');return;}router.tabTo(b.dataset.t);});
  try{initMap();}catch(e){console.error(e);}
  router.tabTo('map');
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
}
document.addEventListener('DOMContentLoaded',boot);
window.__role={S,ride,router,SCREENS,save,toast,sheet,ic,I,esc,$,$$,activeCar,rebuildCar,fmtKm,av,trackSVG,ago,fmtT,getMap:()=>map,gps,speak,DEFAULT_CENTER};
})();
