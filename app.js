/* Rolê — protótipo navegável */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const MAPVIEWS={Main:'home',Drive:'drive',Territorio:'terr'};
const START=[-43.93858,-19.91916], END=[-43.93807,-19.93197];   // Praça Sete -> Praça da Liberdade (BH)
const FALLBACK_ROUTE=[[-43.93858,-19.91916],[-43.93905,-19.92055],[-43.93962,-19.92233],[-43.94006,-19.92398],[-43.94046,-19.92561],[-43.94003,-19.92745],[-43.93936,-19.92916],[-43.93872,-19.93064],[-43.93807,-19.93197]];
const STYLE='https://tiles.openfreemap.org/styles/liberty';
const state={markerMode:'photo',view:null,sim:null,hexCount:0,km:0,simMs:0,stationsOn:false};
let map,routeLine=FALLBACK_ROUTE,steps=[],cum=[],total=0,hexes=[],hexIndex=new Map(),carMarker,destMarker,stationMarkers=[],mapReady=false,usingFallback=false;

/* ---------- phone scaling ---------- */
function fit(){
  const wrap=$('#phoneWrap'),ph=$('#phone');
  const small=innerWidth<=820;
  const s=small?Math.min(innerWidth/390,innerHeight/844):Math.min((innerHeight-60)/844,1);
  ph.style.transform=`scale(${s})`;
  wrap.style.width=390*s+'px';wrap.style.height=844*s+'px';
  if(map)map.resize();
}
addEventListener('resize',fit);

/* ---------- geo helpers ---------- */
const R=6371000,rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function dist(a,b){const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
function bearing(a,b){const y=Math.sin(rad(b[0]-a[0]))*Math.cos(rad(b[1]));const x=Math.cos(rad(a[1]))*Math.sin(rad(b[1]))-Math.sin(rad(a[1]))*Math.cos(rad(b[1]))*Math.cos(rad(b[0]-a[0]));return (deg(Math.atan2(y,x))+360)%360;}
function prep(){cum=[0];for(let i=1;i<routeLine.length;i++)cum.push(cum[i-1]+dist(routeLine[i-1],routeLine[i]));total=cum[cum.length-1];}
function along(d){d=Math.max(0,Math.min(total,d));let i=1;while(i<cum.length-1&&cum[i]<d)i++;const t=(d-cum[i-1])/((cum[i]-cum[i-1])||1);const a=routeLine[i-1],b=routeLine[i];return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}

/* ---------- hex grid (pointy, meters) ---------- */
const HS=85; const LAT0=-19.925, LNG0=-43.9385, MLAT=111320, MLNG=111320*Math.cos(rad(LAT0));
const toM=p=>[(p[0]-LNG0)*MLNG,(p[1]-LAT0)*MLAT], toLL=m=>[LNG0+m[0]/MLNG,LAT0+m[1]/MLAT];
function hexCenter(q,r){return [HS*Math.sqrt(3)*(q+r/2),HS*1.5*r];}
function hexAt(p){const [x,y]=toM(p);const q=(Math.sqrt(3)/3*x-y/3)/HS,r=(2/3*y)/HS;let s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;return rq+','+rr;}
function buildHexes(){
  hexes=[];hexIndex.clear();const sM=toM(START),eM=toM(END);let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let q=-22;q<=22;q++)for(let r=-22;r<=22;r++){const c=hexCenter(q,r);if(Math.abs(c[0])>1900||Math.abs(c[1])>2300)continue;
    const ds=Math.hypot(c[0]-sM[0],c[1]-sM[1]),de=Math.hypot(c[0]-eM[0],c[1]-eM[1]);
    let s='none';if(ds<420&&rnd()<0.8)s='mine';else if(de<380&&rnd()<0.85)s='rival';else if(rnd()<0.05)s=rnd()<.5?'mine':'rival';
    const poly=[];for(let k=0;k<=6;k++){const a=rad(60*k-30);poly.push(toLL([c[0]+HS*0.96*Math.cos(a),c[1]+HS*0.96*Math.sin(a)]));}
    const h={id:q+','+r,s,poly};hexes.push(h);hexIndex.set(h.id,h);}
}
function hexGeo(){return{type:'FeatureCollection',features:hexes.map(h=>({type:'Feature',properties:{s:h.s},geometry:{type:'Polygon',coordinates:[h.poly]}}))};}
function routeGeo(upto){const f=[{type:'Feature',properties:{k:'all'},geometry:{type:'LineString',coordinates:routeLine}}];
  if(upto>0){const pts=[];for(let i=0;i<routeLine.length&&cum[i]<upto;i++)pts.push(routeLine[i]);pts.push(along(upto));if(pts.length>1)f.push({type:'Feature',properties:{k:'done'},geometry:{type:'LineString',coordinates:pts}});}
  return{type:'FeatureCollection',features:f};}

/* ---------- map ---------- */
function fallbackStyle(){return{version:8,sources:{},layers:[{id:'bg',type:'background',paint:{'background-color':'#151614'}}]};}
function restyle(){
  const L=map.getStyle().layers||[];
  for(const l of L){const id=l.id.toLowerCase();try{
    if(l.type==='background')map.setPaintProperty(l.id,'background-color','#0D0E0C');
    else if(l.type==='fill'){let c='#121310';if(/water/.test(id))c='#0B1214';else if(/park|wood|grass|forest|green|cemetery|pitch|landcover/.test(id))c='#111A0F';else if(/building/.test(id))c='#1A1B18';map.setPaintProperty(l.id,'fill-color',c);map.setPaintProperty(l.id,'fill-opacity',1);try{map.setPaintProperty(l.id,'fill-outline-color',c)}catch(e){}}
    else if(l.type==='fill-extrusion'){map.setPaintProperty(l.id,'fill-extrusion-color','#1E1F1B');map.setPaintProperty(l.id,'fill-extrusion-opacity',0.92);}
    else if(l.type==='line'){if(/water|river|stream/.test(id))map.setPaintProperty(l.id,'line-color','#0B1214');else if(/boundary|admin/.test(id))map.setLayoutProperty(l.id,'visibility','none');else{const major=/motorway|trunk|primary|secondary|major/.test(id);map.setPaintProperty(l.id,'line-color',/casing/.test(id)?'#0D0E0C':(major?'#3B3D37':'#2A2C27'));}}
    else if(l.type==='symbol'){if(/poi|shield|transit|aerialway|ferry/.test(id))map.setLayoutProperty(l.id,'visibility','none');else{map.setPaintProperty(l.id,'text-color','#8C8E86');map.setPaintProperty(l.id,'text-halo-color','#0D0E0C');}}
    else if(l.type==='hillshade'||l.type==='raster')map.setLayoutProperty(l.id,'visibility','none');
  }catch(e){}}
}
function addLayers(){
  if(map.getSource('hex'))return;
  map.addSource('hex',{type:'geojson',data:hexGeo()});
  map.addSource('route',{type:'geojson',data:routeGeo(0)});
  const before=undefined;
  map.addLayer({id:'hex-fill',type:'fill',source:'hex',paint:{'fill-color':hexFillExpr('home'),'fill-opacity':1}},before);
  map.addLayer({id:'hex-line',type:'line',source:'hex',paint:{'line-color':['match',['get','s'],'mine','#C6F432','new','#EFFF7A','rival','#FF6A3D','rgba(255,255,255,0.07)'],'line-width':['match',['get','s'],'new',2.5,'none',1,1.6],'line-opacity':['match',['get','s'],'none',1,0.75]}});
  map.addLayer({id:'route-glow',type:'line',source:'route',filter:['==',['get','k'],'all'],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#C6F432','line-width':22,'line-blur':14,'line-opacity':0.55}});
  map.addLayer({id:'route-core',type:'line',source:'route',filter:['==',['get','k'],'all'],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#D9FF4A','line-width':7}});
  map.addLayer({id:'route-hi',type:'line',source:'route',filter:['==',['get','k'],'all'],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#FFFFFF','line-width':2,'line-opacity':0.6}});
  map.addLayer({id:'route-done',type:'line',source:'route',filter:['==',['get','k'],'done'],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#5E6A2E','line-width':8,'line-opacity':0.9}});
}
function hexFillExpr(mode){
  const none=mode==='terr'?'rgba(9,10,8,0.84)':'rgba(0,0,0,0)';
  return ['match',['get','s'],'mine','rgba(198,244,50,0.16)','new','rgba(214,255,80,0.34)','rival','rgba(255,106,61,0.16)',none];
}
function carEl(){
  const d=document.createElement('div');d.className='carmk';
  d.innerHTML=state.markerMode==='arrow'?'<div class="glow"></div><svg width="40" height="46" viewBox="0 0 40 46"><path d="M20 3 L36 41 L20 32 L4 41 Z" fill="#fff" stroke="#C6F432" stroke-width="2.5" stroke-linejoin="round"/></svg>':
   `<div class="glow" style="${state.markerMode==='neon'?'':'opacity:.55'}"></div><img src="assets/p-rear.webp" alt="Seu carro">`;
  return d;
}
function resetCar(){if(!map)return;const pos=carMarker?carMarker.getLngLat():{lng:START[0],lat:START[1]};if(carMarker)carMarker.remove();carMarker=new maplibregl.Marker({element:carEl(),anchor:'bottom',pitchAlignment:'viewport',rotationAlignment:'viewport'}).setLngLat(pos).addTo(map);}
function initMap(){
  map=new maplibregl.Map({container:'map',style:STYLE,center:[-43.9386,-19.9255],zoom:15,pitch:45,bearing:-10,attributionControl:{compact:true},interactive:true,fadeDuration:0});
  let loaded=false;
  const fb=setTimeout(()=>{if(!loaded){usingFallback=true;map.setStyle(fallbackStyle());}},7000);
  map.on('error',e=>{if(!loaded&&!usingFallback&&e&&e.error&&/style|Failed to fetch|NetworkError/i.test(String(e.error.message||e.error))){usingFallback=true;clearTimeout(fb);map.setStyle(fallbackStyle());}});
  map.on('style.load',()=>{loaded=true;clearTimeout(fb);if(!usingFallback)restyle();addLayers();mapReady=true;resetCar();placeDest();applyView(state.view,true);});
  fetchRoute();
}
function placeDest(){if(destMarker)destMarker.remove();const el=document.createElement('div');el.className='pin dest';el.innerHTML='<div class="p"><b>Praça da Liberdade</b><span>Rosa Choque · 3 hex</span></div>';destMarker=new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(END).addTo(map);}
async function fetchRoute(){
  try{const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${START.join(',')};${END.join(',')}?overview=full&geometries=geojson&steps=true`);const j=await r.json();
    if(j.routes&&j.routes[0]){routeLine=j.routes[0].geometry.coordinates;steps=j.routes[0].legs[0].steps.map(s=>({loc:s.maneuver.location,type:s.maneuver.type,mod:s.maneuver.modifier||'',name:s.name||''}));}
  }catch(e){}
  prep();computeStepDist();if(mapReady){map.getSource('route').setData(routeGeo(0));if(state.view)applyView(state.view,true);}
}
function computeStepDist(){for(const s of steps){let best=0,bd=1e9;for(let i=0;i<routeLine.length;i++){const d=dist(routeLine[i],s.loc);if(d<bd){bd=d;best=i;}}s.at=cum[best]||0;}}
prep();

/* ---------- views & router ---------- */
function show(name){
  if(!document.querySelector(`.view[data-v="${name}"]`))name='Main';
  if(state.view===name)return;
  if(state.sim&&!MAPVIEWS[name])stopSim(false);
  if(state.view==='CameraTraseira')stopCam();
  state.view=name;
  $$('.view').forEach(v=>v.classList.toggle('on',v.dataset.v===name));
  $$('#side a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+name));
  $('#map').classList.toggle('hidden',!MAPVIEWS[name]);
  if(name==='CameraTraseira')startCam();
  if(MAPVIEWS[name])applyView(name);
}
function applyView(name,instant){
  if(!mapReady||!MAPVIEWS[name])return;const mode=MAPVIEWS[name];
  map.setPaintProperty('hex-fill','fill-color',hexFillExpr(mode));
  map.resize();
  ['route-glow','route-core','route-hi'].forEach(l=>map.setLayoutProperty(l,'visibility',mode==='terr'?'none':'visible'));
  if(destMarker)destMarker.getElement().style.display=mode==='home'?'':'none';
  stationMarkers.forEach(m=>m.getElement().style.display=(mode==='home'&&state.stationsOn)?'':'none');
  if(mode==='home'){stopSim(false);map.setPadding({top:120,bottom:340,left:30,right:30});const b=new maplibregl.LngLatBounds();routeLine.forEach(p=>b.extend(p));map.fitBounds(b,{padding:{top:150,bottom:360,left:50,right:50},pitch:40,bearing:-8,duration:instant?0:1200,maxZoom:16.2});carMarker&&carMarker.setLngLat(START);map.getSource('route').setData(routeGeo(0));}
  if(mode==='drive'||mode==='terr'){startSim(mode);}
}

/* ---------- simulation ---------- */
function fmtD(m){return m>=1000?(m/1000).toFixed(1).replace('.',',')+' km':Math.max(10,Math.round(m/10)*10)+' m';}
const TURN={left:'à esquerda','slight left':'levemente à esquerda','sharp left':'à esquerda',right:'à direita','slight right':'levemente à direita','sharp right':'à direita',straight:'em frente',uturn:'o retorno'};
function instr(s){if(!s)return'Siga em frente';if(s.type==='arrive')return'Chegada ao destino';const n=s.name?` na ${s.name}`:'';if(s.type==='roundabout'||s.type==='rotary')return'Entre na rotatória'+n;if(s.mod.includes('straight'))return'Siga em frente'+n;return`Vire ${TURN[s.mod]||'em frente'}${n}`;}
function arrowFor(s){const m=(s&&s.mod)||'straight';if(m.includes('left'))return'<path d="M17 21V11a3 3 0 0 0-3-3H5"></path><path d="M9 4L5 8l4 4"></path>';if(m.includes('right'))return'<path d="M7 21V11a3 3 0 0 1 3-3h9"></path><path d="M15 4l4 4-4 4"></path>';return'<path d="M12 20V5"></path><path d="M6 11l6-6 6 6"></path>';}
function startSim(mode){
  stopSim(false);
  state.hexCount=0;state.km=0;state.simMs=0;
  hexes.forEach(h=>{if(h.s==='new')h.s='none';});map.getSource('hex').setData(hexGeo());
  map.getSource('route').setData(routeGeo(0));
  const speed=mode==='drive'?14:16; // m/s simulated (x real time)
  const t0=performance.now();let last=t0,d=0,lastHex=null,smoothB=bearing(routeLine[0],routeLine[Math.min(3,routeLine.length-1)]),lastSrc=0;
  map.setPadding(mode==='drive'?{top:330,bottom:40,left:0,right:0}:{top:300,bottom:180,left:0,right:0});
  const loop=now=>{
    if(!state.sim)return;const dt=Math.min(64,now-last);last=now;d+=speed*dt/1000*(mode==='drive'?1.6:2.2);state.simMs+=dt*12;
    if(d>=total){d=total;}
    const p=along(d),ahead=along(d+25);const b=bearing(p,ahead);let diff=((b-smoothB+540)%360)-180;smoothB=(smoothB+diff*0.08+360)%360;
    carMarker.setLngLat(p);
    if(state.markerMode==='arrow'){const svg=carMarker.getElement().querySelector('svg');if(svg)svg.style.transform=`rotate(${(smoothB-map.getBearing()+360)%360}deg)`;}
    map.jumpTo({center:p,bearing:mode==='drive'?smoothB:smoothB*0+(-8),zoom:mode==='drive'?17.4:16.2,pitch:mode==='drive'?62:35});
    const hid=hexAt(p);if(hid!==lastHex){lastHex=hid;const h=hexIndex.get(hid);if(h&&(h.s==='none'||h.s==='rival')){const wasR=h.s==='rival';h.s='new';state.hexCount++;map.getSource('hex').setData(hexGeo());toast(wasR?'+1 hex · tomado da Rosa Choque':'+1 hex desbloqueado');}
      const chip=$('#rivalChip');if(chip){const hh=hexIndex.get(hid);chip.style.opacity=(hh&&hh.s==='new'&&d>total*0.5)?'1':'0';}}
    if(now-lastSrc>120){lastSrc=now;map.getSource('route').setData(routeGeo(d));updHUD(mode,d);}
    if(d>=total){stopSim(true);return;}
    state.sim=requestAnimationFrame(loop);
  };
  state.sim=requestAnimationFrame(loop);
}
function updHUD(mode,d){
  const rem=total-d;
  if(mode==='drive'){let nx=steps.find(s=>s.at>d+5&&s.type!=='depart');const nn=nx?steps[steps.indexOf(nx)+1]:null;
    setT('#nav-dist',fmtD(nx?nx.at-d:rem));setT('#nav-instr',instr(nx));setT('#nav-next',nn?`Depois, ${instr(nn).toLowerCase()}`:'Depois, chegada');
    const ic=$('#nav-icon');if(ic)ic.innerHTML=arrowFor(nx);
    const eta=Math.max(1,Math.round(rem/8.3/60));setT('#nav-eta',eta+' min');const t=new Date(Date.now()+rem/8.3*1000);setT('#nav-rest',`${fmtD(rem)} · ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`);
    const pr=$('#nav-prog');if(pr)pr.style.width=(d/total*100).toFixed(1)+'%';setT('#nav-hex','+'+state.hexCount+' hex');}
  else{setT('#t-hex','+'+state.hexCount);setT('#t-km',(d/1000).toFixed(1).replace('.',','));setT('#t-min',String(Math.max(1,Math.round(state.simMs/60000))));}
}
function stopSim(finished){if(state.sim){cancelAnimationFrame(state.sim);state.sim=null;}
  if(finished){setT('#r-hex','+'+state.hexCount);setT('#r-hex2','+'+state.hexCount);setT('#r-km',(total/1000).toFixed(1).replace('.',',')+' km');setTimeout(()=>{location.hash='#Resumo';},900);toast('Rolê concluído');}}
function setT(s,t){const e=$(s);if(e)e.textContent=t;}
let tt;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1600);}

/* ---------- stations ---------- */
function stations(){if(stationMarkers.length)return;const pts=[[routeLine[Math.floor(routeLine.length*0.35)],'5,89',true,'A'],[[-43.9335,-19.9215],'5,94',false,'B'],[[-43.9432,-19.9282],'5,97',false,'C']];
  for(const [p,v,best,l] of pts){const el=document.createElement('div');el.className='pin'+(best?' best':'');el.innerHTML=`<div class="p"><small>${l}</small>${v}</div>`;stationMarkers.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(p).addTo(map));}}

/* ---------- camera ---------- */
let stream;
async function startCam(){const v=$('#camvideo');if(!v)return;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});v.srcObject=stream;v.style.display='block';}catch(e){v.style.display='none';}}
function stopCam(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}const v=$('#camvideo');if(v)v.style.display='none';}

/* ---------- interactions ---------- */
function wire(){
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
    if(act==='mode'){$$('[data-act="mode"]',a.parentElement).forEach(b=>{const on=b===a;b.setAttribute('aria-checked',on);b.style.border=on?'1.5px solid #C6F432':'1px solid rgba(255,255,255,0.09)';b.style.background=on?'rgba(198,244,50,0.08)':'rgba(255,255,255,0.04)';const c=b.querySelector('.chk');if(c)c.style.display=on?'flex':'none';});state.startMode=a.dataset.m;}
    if(act==='start'){e.preventDefault();location.hash=state.startMode==='nav'?'#Drive':'#Territorio';}
    if(act==='marker'){$$('[data-act="marker"]').forEach(b=>{const on=b===a;b.setAttribute('aria-checked',on);b.style.border=on?'1.5px solid #C6F432':'1px solid rgba(255,255,255,0.08)';b.style.background=on?'rgba(198,244,50,0.07)':'rgba(255,255,255,0.04)';const i=b.querySelector('.ind');if(i)i.innerHTML=on?CHK:RAD;});state.markerMode=a.dataset.m;resetCar();prevMarker();toast(a.dataset.m==='arrow'?'Seta padrão no mapa':'Foto da traseira no mapa');}
    if(act==='beforeafter'){const after=a.dataset.s==='after';$('#aiImg').src=after?'assets/p-front-ai.webp':'assets/p-front.webp';$$('[data-act="beforeafter"]').forEach(b=>{const on=b===a;b.style.background=on?'#F2F2EF':'transparent';b.style.color=on?'#0A0B0A':'#A8AAA2';b.style.fontWeight=on?'800':'600';});}
    if(act==='horn'){const n=a.querySelector('.n');const on=a.classList.toggle('on');n.textContent=(+n.textContent+(on?1:-1));a.style.color=on?'#DCFF6A':'#C8CAC3';}
    if(act==='stations'){state.stationsOn=!state.stationsOn;stations();stationMarkers.forEach(m=>m.getElement().style.display=state.stationsOn?'':'none');a.style.background=state.stationsOn?'rgba(198,244,50,0.28)':'';toast(state.stationsOn?'Gasolina perto: R$ 5,89 no Posto A':'Postos escondidos');}
    if(act==='shutter'){e.preventDefault();const f=$('#flash');f.style.opacity='1';setTimeout(()=>f.style.opacity='0',120);toast('Recortando com IA…');setTimeout(()=>{state.markerMode='photo';resetCar();location.hash='#Marcador';toast('Foto salva no seu carro');},1300);}
    if(act==='generate'){toast('Gerando com IA…');setTimeout(()=>{$('#aiImg').src='assets/p-front-ai.webp';toast('Pronto: vermelho + neon');},1200);}
    if(act==='follow'){a.textContent=a.textContent.trim()==='Seguir'?'Seguindo':'Seguir';}
  });
  // hold to stop
  const hold=$('[data-hold]');if(hold){let h;const start=e=>{e.preventDefault();hold.style.transform='scale(.92)';h=setTimeout(()=>{stopSim(true);},800);};const end=()=>{hold.style.transform='';clearTimeout(h);};hold.addEventListener('pointerdown',start);['pointerup','pointerleave'].forEach(x=>hold.addEventListener(x,end));hold.addEventListener('click',e=>e.preventDefault());}
}
function prevMarker(){const v=document.querySelector('[data-v="Marcador"]');if(!v)return;const img=v.querySelector('img[alt^="Seu carro"]');if(!img)return;let ar=v.querySelector('#prevArrow');if(!ar){ar=document.createElement('div');ar.id='prevArrow';ar.style.cssText='position:absolute;left:175px;top:240px;width:40px;height:46px;display:none;filter:drop-shadow(0 0 14px rgba(198,244,50,.9))';ar.innerHTML='<svg width="40" height="46" viewBox="0 0 40 46"><path d="M20 3 L36 41 L20 32 L4 41 Z" fill="#fff" stroke="#C6F432" stroke-width="2.5" stroke-linejoin="round"/></svg>';img.parentElement.appendChild(ar);}const arrow=state.markerMode==='arrow';img.style.display=arrow?'none':'';ar.style.display=arrow?'block':'none';const g=img.previousElementSibling;if(g)g.style.opacity=state.markerMode==='photo'?'.6':'1';}
const CHK='<span style="width: 22px; height: 22px; border-radius: 999px; background: #C6F432; display: flex; align-items: center; justify-content: center; flex-shrink: 0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0B0A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></span>';
const RAD='<span style="width: 22px; height: 22px; border-radius: 999px; border: 2px solid rgba(255,255,255,0.25); box-sizing: border-box; flex-shrink: 0; display:block"></span>';

/* ---------- boot ---------- */
function clock(){const d=new Date();setT('#clock',`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`);}
window.addEventListener('DOMContentLoaded',()=>{
  fit();clock();setInterval(clock,20000);buildHexes();wire();
  addEventListener('hashchange',()=>show(location.hash.slice(1)||'Main'));
  try{initMap();}catch(e){console.error(e);}
  show(location.hash.slice(1)||'Main');
  fit();
});
})();
