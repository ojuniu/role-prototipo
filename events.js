/* Rolê — eventos: criar, buscar por região, confirmar presença, ver no mapa */
(()=>{'use strict';
const RL=window.__role;if(!RL||!RL.comm)return;
const {S,SCREENS,save,toast,sheet,ic,I,esc,$,$$,router,gps,ride}=RL;
const C=RL.comm;const DEF=RL.DEFAULT_CENTER||[-43.9386,-19.9255];
const myPos=()=>gps.pos||ride.last||S.lastPos||DEF;
const hsh=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0)/4294967295;};
const rad=d=>d*Math.PI/180;
const dist=(a,b)=>{const dLat=rad(b[1]-a[1]),dLng=rad(b[0]-a[0]);const x=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLng/2)**2;return 12742000*Math.asin(Math.sqrt(x));};
const fmtD=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1).replace('.',',')+' km':Math.round(m/10)*10+' m';
const offset=(p,m,b)=>{const r=b*Math.PI/180;return[p[0]+m*Math.sin(r)/(111320*Math.cos(p[1]*Math.PI/180)),p[1]+m*Math.cos(r)/110540];};
const CAL='<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>';
const TYPES={meet:['Encontro','#C6F432'],ride:['Rolê em grupo','#22D3EE'],show:['Exposição','#FACC15'],track:['Track day','#FF4F4F'],cafe:['Café com carros','#FFB08A'],moto:['Motociata','#A78BFA'],som:['Som automotivo','#F472B6']};
const MES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],DIA=['dom','seg','ter','qua','qui','sex','sáb'];
const st=document.createElement('style');st.textContent=`
.evc{display:flex;gap:12px;align-items:stretch;padding:12px;margin-bottom:10px;width:100%;text-align:left}
.evd{width:56px;flex-shrink:0;border-radius:14px;background:#1A1B18;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.evd b{font-size:22px}.evd span{font-size:11px;color:var(--tx3);margin-top:3px;text-transform:uppercase;font-weight:700}
.evt{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;padding:3px 8px;border-radius:99px;background:rgba(255,255,255,.06)}
.evt i{width:7px;height:7px;border-radius:9px}
.evmap{position:relative;height:200px;border-radius:20px;overflow:hidden;border:1px solid var(--line)}
.evpin{width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#0A0B0A;box-shadow:0 4px 14px rgba(0,0,0,.5);border:2px solid rgba(0,0,0,.4);cursor:pointer}
`;document.head.appendChild(st);
/* eventos simulados na região de quem usa o app */
const TIT={meet:['Encontro de Gol Quadrado','Encontro de rebaixados','Encontro de antigos','Noite dos turbinados'],ride:['Rolê noturno da Turbo Clan','Subida da serra','Rolê das 6h','Rolê até a cachoeira'],show:['Exposição de clássicos','Feira de carros antigos'],track:['Track day no autódromo','Arrancada amadora'],cafe:['Café & Carros','Domingo de café com carros'],moto:['Motociata solidária','Rolê de moto até o mirante'],som:['Encontro de som automotivo']};
function seedEvents(){const base=myPos(),key=base[0].toFixed(1)+':'+base[1].toFixed(1);if(S.evSeed===key&&S.evFake)return S.evFake;
  const out=[];const r=C.rnd(Math.floor(hsh(key)*1e6));const ks=Object.keys(TYPES);const now=new Date();
  for(let i=0;i<12;i++){const ty=ks[Math.floor(r()*ks.length)],t=TIT[ty][Math.floor(r()*TIT[ty].length)];const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+Math.floor(r()*30),[8,9,10,14,19,20,21][Math.floor(r()*7)],r()<.5?0:30);
   const p=offset(base,600+Math.pow(r(),1.4)*60000,r()*360);const host=C.P[Math.floor(r()*C.P.length)];
   out.push({id:'fe'+key+i,ty,title:t,t:d.getTime(),p,host:host.h,crew:ty==='ride'&&host.crew?host.crew:'',going:Math.floor(6+r()*240),desc:['Chega cedo pra pegar vaga. Traz a família.','Saída pontual. Tanque cheio e respeito no trânsito.','Entrada gratuita. Vai ter food truck.','Evento aberto pra todos os modelos.'][Math.floor(r()*4)],fake:1});}
  S.evSeed=key;S.evFake=out;save();return out;}
S.events=S.events||[];S.evGoing=S.evGoing||{};
const all=()=>[...S.events,...seedEvents()].filter(e=>e.t>Date.now()-6*3600e3);
const evById=id=>all().find(e=>e.id===id);
const dateBox=t=>{const d=new Date(t);return`<div class="evd"><b>${d.getDate()}</b><span>${MES[d.getMonth()]}</span></div>`;};
const when=t=>{const d=new Date(t);return`${DIA[d.getDay()]}, ${d.getDate()} ${MES[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;};
const going=e=>e.going+(S.evGoing[e.id]?1:0);
const where=new Map();
function placeName(e,cb){if(e.place)return cb(e.place);if(where.has(e.id))return cb(where.get(e.id));
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=17&accept-language=pt-BR&lat=${e.p[1]}&lon=${e.p[0]}`).then(r=>r.json()).then(j=>{const a=j.address||{};const n=[a.road,a.suburb||a.neighbourhood,a.city||a.town||a.village].filter(Boolean).join(', ');where.set(e.id,n);cb(n);}).catch(()=>{});}
/* ---------- LISTA ---------- */
SCREENS.events={tabbar:false,
 html(){const ctr=this.ctr||null;return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Eventos</h2><button class="btn sm" data-go="eventNew">${ic(I.plus,16)}Criar</button></div><div class="scroll">
  <div class="row" style="gap:8px"><input class="inp" id="eq" placeholder="Buscar em outra cidade…" style="flex:1" value="${esc(this.cname||'')}"><button class="ib" data-on="near" style="width:50px;height:50px;border-radius:15px" aria-label="Perto de mim">${ic(I.loc,18)}</button></div>
  <div class="chips" id="er" style="margin-top:10px">${[10,30,100,300].map(k=>`<button class="chip ${(this.rad||30)===k?'lime':''}" data-r="${k}">até ${k} km</button>`).join('')}</div>
  <div class="chips" id="et" style="margin-top:8px"><button class="chip ${!this.ty?'lime':''}" data-t="">Todos</button>${Object.entries(TYPES).map(([k,[n,c]])=>`<button class="chip ${this.ty===k?'lime':''}" data-t="${k}"><i style="width:7px;height:7px;border-radius:9px;background:${c}"></i>${n}</button>`).join('')}</div>
  <div class="small muted" id="eh" style="margin:14px 4px 8px"></div><div id="el"></div></div>`;},
 mount(el){const draw=()=>{const c=this.ctr||myPos(),R=(this.rad||30)*1000;const l=all().filter(e=>(!this.ty||e.ty===this.ty)&&dist(c,e.p)<=R).sort((a,b)=>a.t-b.t);
   $('#eh',el).innerHTML=`${l.length} ${l.length===1?'evento':'eventos'} ${this.cname?'perto de <b>'+esc(this.cname)+'</b>':'perto de você'}`;
   $('#el',el).innerHTML=l.map(e=>{const[n,col]=TYPES[e.ty];return`<button class="card evc press" data-id="${e.id}">${dateBox(e.t)}<div style="flex:1;min-width:0"><span class="evt"><i style="background:${col}"></i>${n}</span><div class="b" style="font-size:16px;margin-top:6px">${esc(e.title)}</div><div class="small muted" style="margin-top:2px">${when(e.t)} · a ${fmtD(dist(myPos(),e.p))}</div><div class="small" style="margin-top:6px"><b class="lime">${going(e)}</b> <span class="muted">vão</span>${S.evGoing[e.id]?' · <b class="lime">você vai</b>':''}${e.mine?' · <b>seu evento</b>':''}</div></div></button>`;}).join('')||'<div class="card empty">Nenhum evento nessa região. Que tal criar um?</div>';
   $$('[data-id]',$('#el',el)).forEach(b=>b.onclick=()=>router.go('event',{id:b.dataset.id}));};
  $$('#er [data-r]',el).forEach(b=>b.onclick=()=>{this.rad=+b.dataset.r;$$('#er [data-r]',el).forEach(x=>x.classList.toggle('lime',x===b));draw();});
  $$('#et [data-t]',el).forEach(b=>b.onclick=()=>{this.ty=b.dataset.t||null;$$('#et [data-t]',el).forEach(x=>x.classList.toggle('lime',x===b));draw();});
  let tm;$('#eq',el).addEventListener('input',e=>{clearTimeout(tm);const v=e.target.value.trim();if(v.length<3)return;tm=setTimeout(async()=>{try{const j=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(v)}`)).json();if(j[0]){this.ctr=[+j[0].lon,+j[0].lat];this.cname=j[0].display_name.split(',')[0];if((this.rad||30)<30)this.rad=30;draw();extra(this.ctr);draw();}}catch(e){}},600);});
  const extra=c=>{const key='x'+c[0].toFixed(1)+':'+c[1].toFixed(1);if(S.events.some(e=>e.region===key)||(this._x||[]).includes(key))return;(this._x=this._x||[]).push(key);const r=C.rnd(Math.floor(hsh(key)*1e6));const ks=Object.keys(TYPES);
   for(let i=0;i<6;i++){const ty=ks[Math.floor(r()*ks.length)],d=new Date();d.setDate(d.getDate()+1+Math.floor(r()*25));d.setHours([9,10,19,20][Math.floor(r()*4)],0,0,0);const host=C.P[Math.floor(r()*C.P.length)];
    (S.evFake||(S.evFake=[])).push({id:'fx'+key+i,ty,title:TIT[ty][Math.floor(r()*TIT[ty].length)],t:d.getTime(),p:offset(c,400+r()*12000,r()*360),host:host.h,going:Math.floor(5+r()*180),desc:'Evento aberto pra todos os modelos.',fake:1});}save();};
  draw();},
 on:{near(){this.ctr=null;this.cname='';$('#eq',this.el).value='';router.render(this,true,true);}}};
/* ---------- DETALHE ---------- */
SCREENS.event={tabbar:false,
 html(pp){const e=evById(pp.id);if(!e)return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button></div><div class="empty">Evento não encontrado ou já passou</div>`;const[n,col]=TYPES[e.ty];const host=C.who(e.host)||{n:e.host,h:e.host};const on=!!S.evGoing[e.id];
  const ppl=[...(on?[{me:true,n:S.me.name,h:S.me.handle}]:[]),...C.P.filter((_,i)=>hsh(e.id+i)<.45).slice(0,7)];
  const map=RL.staticMap?RL.staticMap([offset(e.p,-60,0),offset(e.p,60,0)],440,200,{noRoute:true,maxZ:15,extra:pr=>{const[x,y]=pr(e.p);return`<circle cx="${x}" cy="${y}" r="26" fill="${col}" fill-opacity=".18"/><circle cx="${x}" cy="${y}" r="10" fill="${col}" stroke="#0A0B0A" stroke-width="3"/>`;}}):'';
  return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Evento</h2><button class="ib" data-on="share" aria-label="Compartilhar">${ic(I.share,18)}</button></div><div class="scroll">
  <div class="evmap"><div class="smapw">${map}</div><span class="osmc">Esri · © OpenStreetMap</span></div>
  <div style="margin:14px 4px 0"><span class="evt"><i style="background:${col}"></i>${n}</span>${e.crew?` <span class="evt">Crew ${esc(e.crew)}</span>`:''}<div style="font-size:26px;font-weight:800;margin-top:8px;line-height:1.15">${esc(e.title)}</div>
   <div class="row small" style="margin-top:10px;gap:8px">${ic(CAL,15)}<b>${when(e.t)}</b></div>
   <div class="row small muted" style="margin-top:6px;gap:8px;align-items:flex-start">${ic('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',15)}<span id="epl">${esc(e.place||'Buscando endereço…')} · a ${fmtD(dist(myPos(),e.p))}</span></div></div>
  <div class="row" style="gap:10px;margin-top:16px"><button class="btn ${on?'sec':''}" data-on="go" style="flex:1">${on?'✓ Você vai':'Eu vou'}</button><button class="btn sec" data-on="route" style="flex:1">${ic(I.route,18)}Como chegar</button></div>
  <button class="btn sec" data-on="ics" style="margin-top:10px">${ic(CAL,18)}Salvar na agenda</button>
  ${e.desc?`<div class="card" style="margin-top:14px;font-size:14px;line-height:1.5">${esc(e.desc)}</div>`:''}
  <div class="sec-t">Quem vai <span class="small muted" style="font-weight:600">${going(e)} pessoas</span></div>
  <div class="stories">${ppl.map(p=>`<button class="story" data-on="prof" data-h="${esc(p.h)}">${RL.avatar2?RL.avatar2(p,52):''}<span>${esc(p.me?'você':p.h)}</span></button>`).join('')}</div>
  <div class="sec-t">Organizado por</div><button class="card row press" data-on="prof" data-h="${esc(host.h)}" style="width:100%;text-align:left">${RL.avatar2?RL.avatar2(host,44):''}<div style="flex:1"><div class="b">${esc(host.n)}</div><div class="small muted">@${esc(host.h)}${host.crew?' · '+esc(host.crew):''}</div></div></button>
  ${e.mine?`<button class="btn danger" data-on="del" style="margin-top:16px">Cancelar evento</button>`:''}</div>`;},
 mount(el){const e=evById(this.params.id);if(e)placeName(e,n=>{const x=$('#epl',el);if(x&&n)x.textContent=`${n} · a ${fmtD(dist(myPos(),e.p))}`;});},
 on:{go(){const id=this.params.id;S.evGoing[id]=!S.evGoing[id];save();toast(S.evGoing[id]?'Presença confirmada':'Presença cancelada',S.evGoing[id]?'':'dark');router.render(this,true,true);},
  route(){const e=evById(this.params.id);router.go('preview',{dest:{name:e.title,addr:'Evento',p:e.p}});},
  prof(a){a.dataset.h===S.me.handle?router.go('profile'):router.go('person',{h:a.dataset.h});},
  ics(){const e=evById(this.params.id);const f=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');const txt=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Role//PT\r\nBEGIN:VEVENT\r\nUID:${e.id}@role\r\nDTSTAMP:${f(Date.now())}\r\nDTSTART:${f(e.t)}\r\nDTEND:${f(e.t+3*3600e3)}\r\nSUMMARY:${e.title}\r\nGEO:${e.p[1]};${e.p[0]}\r\nDESCRIPTION:${(e.desc||'').replace(/\n/g,' ')}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
   const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/calendar'}));a.download='evento-role.ics';a.click();toast('Abra o arquivo pra salvar na agenda');},
  async share(){const e=evById(this.params.id);const t=`${e.title} · ${when(e.t)}`;try{if(navigator.share)await navigator.share({title:'Rolê',text:t,url:location.href.split('#')[0]});else{await navigator.clipboard.writeText(t);toast('Copiado');}}catch(x){}},
  del(){if(!confirm('Cancelar este evento?'))return;S.events=S.events.filter(x=>x.id!==this.params.id);save();drawPins();toast('Evento cancelado','dark');router.back();}}};
/* ---------- CRIAR ---------- */
SCREENS.eventNew={tabbar:false,
 html(){const d=new Date(Date.now()+3*864e5);const ds=d.toISOString().slice(0,10);return`<div class="hdr"><button class="ib" data-back>${ic(I.back)}</button><h2>Criar evento</h2></div><div class="scroll">
  <label class="f">Tipo</label><div class="chips" id="nt" style="flex-wrap:wrap">${Object.entries(TYPES).map(([k,[n,c]],i)=>`<button class="chip ${i===0?'lime':''}" data-t="${k}"><i style="width:7px;height:7px;border-radius:9px;background:${c}"></i>${n}</button>`).join('')}</div>
  <label class="f">Nome do evento</label><input class="inp" id="nn" maxlength="60" placeholder="Ex.: Encontro de Gol no posto">
  <div class="row" style="gap:10px;align-items:flex-start"><div style="flex:1"><label class="f">Data</label><input class="inp" type="date" id="nd" value="${ds}"></div><div style="flex:1"><label class="f">Hora</label><input class="inp" type="time" id="nh" value="19:00"></div></div>
  <label class="f">Local</label><input class="inp" id="np" placeholder="Endereço ou nome do lugar" autocomplete="off"><div id="ns" class="list"></div>
  <button class="small b lime" data-on="here" style="margin:10px 4px 0">${ic(I.loc,14)} Usar onde estou agora</button>
  <label class="f">Descrição</label><textarea class="inp" id="ndsc" rows="3" maxlength="300" style="height:auto;padding:12px 14px;resize:none" placeholder="O que vai rolar, regras, ponto de encontro…"></textarea>
  ${S.me.crew?`<button class="optrow" id="nc" style="border:none"><div style="flex:1"><div class="b">Só pra minha crew</div><div class="small muted">${esc(S.me.crew)}</div></div><span class="switch"></span></button>`:''}
  <button class="btn" data-on="save" style="margin-top:14px">Publicar evento</button></div>`;},
 mount(el){this.ty='meet';this.p=null;this.place='';this.crewOnly=false;
  $$('#nt [data-t]',el).forEach(b=>b.onclick=()=>{this.ty=b.dataset.t;$$('#nt [data-t]',el).forEach(x=>x.classList.toggle('lime',x===b));});
  const nc=$('#nc',el);if(nc)nc.onclick=()=>{this.crewOnly=!this.crewOnly;$('.switch',nc).classList.toggle('on',this.crewOnly);};
  let tm;$('#np',el).addEventListener('input',e=>{clearTimeout(tm);const v=e.target.value.trim();this.p=null;if(v.length<3){$('#ns',el).innerHTML='';return;}tm=setTimeout(async()=>{const c=myPos();try{const j=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=br&accept-language=pt-BR&viewbox=${c[0]-.5},${c[1]+.5},${c[0]+.5},${c[1]-.5}&q=${encodeURIComponent(v)}`)).json();
   $('#ns',el).innerHTML=j.map((r,i)=>`<button class="row press" data-i="${i}" style="width:100%;text-align:left;padding:10px 4px"><span class="small">${esc(r.display_name.split(',').slice(0,3).join(','))}</span></button>`).join('');$$('#ns [data-i]',el).forEach(b=>b.onclick=()=>{const r=j[+b.dataset.i];this.p=[+r.lon,+r.lat];this.place=r.display_name.split(',').slice(0,3).join(',');$('#np',el).value=this.place;$('#ns',el).innerHTML='';});}catch(x){}},500);});},
 on:{here(){this.p=myPos().slice();this.place='';$('#np',this.el).value='Onde estou agora';toast('Local definido','dark');},
  save(){const el=this.el,title=$('#nn',el).value.trim();if(title.length<3){toast('Dê um nome pro evento','dark');return;}if(!this.p){toast('Escolha o local','dark');return;}
   const t=new Date($('#nd',el).value+'T'+($('#nh',el).value||'19:00')).getTime();if(!(t>Date.now())){toast('Escolha uma data futura','dark');return;}
   const e={id:'ev'+Date.now(),ty:this.ty,title,t,p:this.p,place:this.place,host:S.me.handle,crew:this.crewOnly?S.me.crew:'',going:0,desc:$('#ndsc',el).value.trim(),mine:true};S.events.push(e);S.evGoing[e.id]=true;save();drawPins();toast('Evento publicado');router.go('event',{id:e.id},{root:true});}}};
/* ---------- pins no mapa ---------- */
let pins=[];
function drawPins(){const m=RL.getMap&&RL.getMap();if(!m||!window.maplibregl)return;pins.forEach(p=>p.remove());pins=[];const c=myPos();
  all().filter(e=>dist(c,e.p)<40000).forEach(e=>{const el=document.createElement('div');el.className='evpin';el.style.background=TYPES[e.ty][1];el.innerHTML=ic(CAL,18,2.2);el.title=e.title;el.onclick=x=>{x.stopPropagation();router.go('event',{id:e.id});};pins.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(e.p).addTo(m));});}
const MS=SCREENS.map;const mh=MS.html;
MS.html=function(p){return mh.call(this,p).replace('<div class="mapfabs">',`<div class="mapfabs"><button class="fab" data-on="events" aria-label="Eventos">${ic(CAL,19)}</button>`);};
MS.on.events=()=>router.go('events');
const wait=setInterval(()=>{const m=RL.getMap&&RL.getMap();if(!m||!window.maplibregl)return;clearInterval(wait);m.once('idle',drawPins);},300);
})();
