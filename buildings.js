/* Rolê — 3D automático: casas e prédios genéricos ao longo das ruas onde o mapa não tem construções (cidades pequenas) */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.getMap)return;
const HALF={motorway:12,trunk:10,primary:9,secondary:8,tertiary:7,minor:5,street:5,service:3.5};
const FC=f=>({type:'FeatureCollection',features:f});
function rnd(seed){let s=Math.abs(seed|0)%233280||7;return()=>(s=(s*9301+49297)%233280)/233280;}
let map,last='',tm;
function gen(){const src=map.getSource('fakeb');if(!src)return;if(map.getZoom()<14.5){if(last){src.setData(FC([]));last='';}return;}
  const c=map.getCenter(),key=c.lng.toFixed(4)+','+c.lat.toFixed(4)+','+map.getZoom().toFixed(1);if(key===last)return;
  let fs;try{fs=map.queryRenderedFeatures();}catch(e){return;}
  const kx=111320*Math.cos(c.lat*Math.PI/180),ky=110540;const P=p=>[(p[0]-c.lng)*kx,(p[1]-c.lat)*ky],U=q=>[q[0]/kx+c.lng,q[1]/ky+c.lat];
  const CELL=120,real=new Map(),roads=[];
  for(const f of fs){const sl=f.sourceLayer,g=f.geometry;if(!g)continue;
    if(sl==='building'){const p0=g.type==='Polygon'?g.coordinates[0][0]:g.type==='MultiPolygon'?g.coordinates[0][0][0]:null;if(!p0)continue;const p=P(p0),k=Math.floor(p[0]/CELL)+':'+Math.floor(p[1]/CELL);real.set(k,(real.get(k)||0)+1);}
    else if(sl==='transportation'){const pr=f.properties||{},cl=pr.class;if(!(cl in HALF)||pr.brunnel==='tunnel'||pr.brunnel==='bridge')continue;const ls=g.type==='LineString'?[g.coordinates]:g.type==='MultiLineString'?g.coordinates:[];ls.forEach(l=>roads.push({h:HALF[cl],pts:l.map(P)}));}}
  roads.sort((a,b)=>Math.hypot(a.pts[0][0],a.pts[0][1])-Math.hypot(b.pts[0][0],b.pts[0][1]));
  /* índice espacial das ruas, pra não pôr casa em cima de rua */
  const RC=8,RH=new Map();let sid=0;
  for(const r of roads)for(let i=1;i<r.pts.length;i++){sid++;const a=r.pts[i-1],b=r.pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/5));
    for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n,k=Math.floor(x/RC)+':'+Math.floor(y/RC);let arr=RH.get(k);if(!arr)RH.set(k,arr=[]);arr.push([x,y,sid,r.h]);}}
  const near=(x,y,id)=>{const cx=Math.floor(x/RC),cy=Math.floor(y/RC);for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const arr=RH.get((cx+i)+':'+(cy+j));if(arr)for(const p of arr)if(p[2]!==id&&Math.hypot(p[0]-x,p[1]-y)<p[3]+1.5)return true;}return false;};
  const out=[],occ=new Set();sid=0;
  outer:for(const r of roads)for(let i=1;i<r.pts.length;i++){sid++;const a=r.pts[i-1],b=r.pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);if(L<18)continue;
    const ux=dx/L,uy=dy/L,nx=-uy,ny=ux,ga=U(a),rr=rnd(Math.round(ga[0]*1e5)*31+Math.round(ga[1]*1e5)*17);
    for(const side of[1,-1]){let s=6+rr()*4;while(s<L-8){const w=7+rr()*6,d=9+rr()*9,o=r.h+1.5+rr()*2,vac=rr()<.12,tall=rr()<.07,h=tall?9+rr()*9:3+rr()*4.5;if(s+w>L-6)break;
      if(!vac){const cs=[[s,o],[s+w,o],[s+w,o+d],[s,o+d]].map(([t,q])=>[a[0]+ux*t+nx*q*side,a[1]+uy*t+ny*q*side]);const cx=(cs[0][0]+cs[2][0])/2,cy=(cs[0][1]+cs[2][1])/2,ok=Math.round(cx/7)+':'+Math.round(cy/7);
        if((real.get(Math.floor(cx/CELL)+':'+Math.floor(cy/CELL))||0)<3&&!occ.has(ok)&&!near(cx,cy,sid)&&!cs.some(p=>near(p[0],p[1],sid))){occ.add(ok);out.push({type:'Feature',properties:{h:+h.toFixed(1)},geometry:{type:'Polygon',coordinates:[[...cs,cs[0]].map(U)]}});if(out.length>=5000)break outer;}}
      s+=w+1+rr()*2.5;}}}
  src.setData(FC(out));last=key;}
const wait=setInterval(()=>{map=RL.getMap();if(!map)return;clearInterval(wait);
  const setup=()=>{if(map.getSource('fakeb')||!map.getStyle()||!map.getStyle().sources||!map.getStyle().sources.openmaptiles)return;
    const before=((map.getStyle().layers||[]).find(l=>l.type==='symbol')||{}).id;
    map.addSource('fakeb',{type:'geojson',data:FC([])});
    map.addLayer({id:'fake-3d',type:'fill-extrusion',source:'fakeb',minzoom:14.5,paint:{'fill-extrusion-color':['interpolate',['linear'],['get','h'],3,'#1C1D1A',12,'#262823'],'fill-extrusion-height':['get','h'],'fill-extrusion-base':0,'fill-extrusion-opacity':.88}},before);last='';};
  if(map.isStyleLoaded())setup();map.on('style.load',()=>setTimeout(setup,60));
  map.on('idle',()=>{setup();gen();});
},200);
})();
